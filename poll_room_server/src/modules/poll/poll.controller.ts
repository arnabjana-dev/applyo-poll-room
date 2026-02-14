import { Request, Response } from "express";
import { PollService } from "./poll.service.js";
import { VoterRequest } from "../../middlewares/authVoter.middleware.js";

export const createPoll = async (req: Request, res: Response) => {
  try {
    const { question, options } = req.body;

    // Basic validation
    if (!question || !Array.isArray(options) || options.length < 2) {
      return res.status(400).json({
        message:
          "Invalid poll data. Question and at least 2 options are required.",
      });
    }

    const poll = await PollService.createPoll(question, options);

    return res.status(201).json({
      success: true,
      data: poll,
      message: "Poll created successfully",
    });
  } catch (error: any) {
    console.error("Create poll error:", error);

    // specific error messages from the service
    if (
      error.message.includes("Duplicate options") ||
      error.message.includes("empty") ||
      error.message.includes("required") ||
      error.message.includes("at least 2") ||
      error.message.includes("Maximum 20")
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create poll. Please try again.",
    });
  }
};

export const getPollById = async (req: VoterRequest, res: Response) => {
  try {
    const { pollId } = req.params as { pollId: string };
    const voterId = req.voterId;

    if (!pollId) {
      return res.status(400).json({
        success: false,
        message: "Poll ID is required",
      });
    }

    const poll = await PollService.getPollById(pollId, voterId);

    if (!poll) {
      return res.status(404).json({
        success: false,
        message: "Poll not found",
      });
    }

    return res.json({
      success: true,
      data: poll,
    });
  } catch (error: any) {
    console.error("Get poll error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch poll details. Please try again.",
    });
  }
};
