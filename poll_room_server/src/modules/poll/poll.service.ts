import { prisma } from "../../lib/prisma.js";

export interface PollResult {
  id: string;
  question: string;
  options: Array<{
    id: string;
    text: string;
    createdAt: Date;
  }>;
  results: Record<string, number>;
  hasVoted: boolean;
  votedOptionId: string | null;
  totalVotes: number;
}

export class PollService {
  static async createPoll(question: string, options: string[]) {
    // Input validation
    if (!question?.trim()) {
      throw new Error("Poll question is required");
    }

    if (!options || options.length < 2) {
      throw new Error("At least 2 options are required");
    }

    if (options.length > 20) {
      throw new Error("Maximum 20 options allowed");
    }

    // if any duplicate options
    const uniqueOptions = [
      ...new Set(options.map((o) => o.trim().toLowerCase())),
    ];
    if (uniqueOptions.length !== options.length) {
      throw new Error("Duplicate options are not allowed");
    }

    const trimmedOptions = options
      .map((text) => text.trim())
      .filter((text) => text.length > 0);
    if (trimmedOptions.length < 2) {
      throw new Error("Options cannot be empty");
    }

    try {
      const poll = await prisma.poll.create({
        data: {
          question: question.trim(),
          options: {
            create: trimmedOptions.map((text) => ({ text })),
          },
        },
        include: {
          options: {
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      });

      return poll;
    } catch (error) {
      console.error("Failed to create poll:", error);
      throw new Error("Failed to create poll. Please try again.");
    }
  }

  static async getPollById(
    pollId: string,
    voterId?: string,
  ): Promise<PollResult | null> {
    if (!pollId) {
      throw new Error("Poll ID is required");
    }

    try {
      const poll = await prisma.poll.findUnique({
        where: { id: pollId },
        include: {
          options: {
            orderBy: {
              createdAt: "asc",
            },
          },
          votes: {
            select: {
              optionId: true,
              voterId: true,
            },
          },
        },
      });

      if (!poll) return null;

      const results: Record<string, number> = {};
      const voteCounts = new Map<string, number>();

      // Initialize with 0 votes
      poll.options.forEach((opt) => {
        results[opt.id] = 0;
        voteCounts.set(opt.id, 0);
      });

      // Count votes
      poll.votes.forEach((vote) => {
        const currentCount = voteCounts.get(vote.optionId) || 0;
        voteCounts.set(vote.optionId, currentCount + 1);
        results[vote.optionId] = currentCount + 1;
      });

      // Find user's vote if voterId provided
      const userVote = voterId
        ? poll.votes.find((v) => v.voterId === voterId)
        : null;

      // Calculate total votes
      const totalVotes = poll.votes.length;

      return {
        id: poll.id,
        question: poll.question,
        options: poll.options,
        results,
        hasVoted: !!userVote,
        votedOptionId: userVote?.optionId || null,
        totalVotes,
      };
    } catch (error) {
      console.error(`Failed to fetch poll ${pollId}:`, error);
      throw new Error("Failed to fetch poll details. Please try again.");
    }
  }
}
