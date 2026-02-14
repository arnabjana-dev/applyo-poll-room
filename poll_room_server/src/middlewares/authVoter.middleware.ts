import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
import envConfig from "../configs/env.config.js";

const COOKIE_NAME = "voter_token";

export interface VoterPayload {
  voterId: string;
  issuedAt: number;
}
export interface VoterRequest extends Request {
  voterId?: string;
}

export const authVoter = (
  req: VoterRequest,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies?.[COOKIE_NAME];

  if (!token) {
    return issueNewToken(req, res, next);
  }

  try {
    const decoded = jwt.verify(
      token,
      envConfig.JWT_SECRET as string,
    ) as VoterPayload;

    req.voterId = decoded.voterId;
    return next();
  } catch (err) {
    return issueNewToken(req, res, next);
  }
};

function issueNewToken(req: VoterRequest, res: Response, next: NextFunction) {
  const voterId = randomUUID();

  const newToken = jwt.sign(
    {
      voterId,
      issuedAt: Date.now(),
    },
    envConfig.JWT_SECRET,
  );

  res.cookie(COOKIE_NAME, newToken, {
    httpOnly: true,
    secure: envConfig.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
  });

  req.voterId = voterId;
  return next();
}
