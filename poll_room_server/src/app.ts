import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import pollRoutes from "./modules/poll/poll.routes.js";
import voteRoutes from "./modules/vote/vote.routes.js";

export const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/polls", pollRoutes);
app.use("/api/votes", voteRoutes);
