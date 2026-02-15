import { Response } from "express";
import { VoteService } from "./vote.service.js";
import { VoterRequest } from "../../middlewares/authVoter.middleware.js";

export const castVote = async (req: VoterRequest, res: Response) => {
  try {
    const { pollId, optionId } = req.body;
    const voterId = req.voterId;
    const ipAddress = req.ip ?? "";
    console.log({ipAddress})

    // Input validation
    if (!voterId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Voter ID is missing",
      });
    }

    if (!pollId?.trim() || !optionId?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Poll ID and Option ID are required",
      });
    }

    const result = await VoteService.castVote(
      pollId.trim(),
      optionId.trim(),
      voterId,
      ipAddress,
    );

    return res.json({
      success: true,
      data: result,
      message: "Vote cast successfully",
    });
  } catch (error: any) {
    // Handle specific error cases
    if (error.message === "ALREADY_VOTED") {
      return res.status(403).json({
        success: false,
        message: "You have already voted in this poll",
      });
    }

    if (error.message === "POLL_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Poll not found",
      });
    }

    if (error.message === "INVALID_OPTION") {
      return res.status(400).json({
        success: false,
        message: "Selected option is not valid for this poll",
      });
    }

    // Log unexpected errors
    console.error("Cast vote error:", {
      error: error.message,
      stack: error.stack,
      body: req.body,
      voterId: req.voterId,
      ip: req.ip,
    });

    return res.status(500).json({
      success: false,
      message: "Failed to cast vote. Please try again.",
    });
  }
};

export const deleteVote = async (req: VoterRequest, res: Response) => {
  try {
    const { pollId } = req.params as { pollId: string };
    const voterId = req.voterId;

    if (!voterId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Voter ID is missing",
      });
    }

    if (!pollId?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Poll ID is required",
      });
    }

    const result = await VoteService.deleteVote(pollId.trim(), voterId);

    return res.json({
      success: true,
      data: result,
      message: "Vote deleted successfully",
    });
  } catch (error: any) {
    if (error.message === "VOTE_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Vote not found",
      });
    }

    console.error("Delete vote error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete vote. Please try again.",
    });
  }
};
