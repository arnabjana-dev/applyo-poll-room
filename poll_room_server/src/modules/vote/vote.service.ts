import { prisma } from "../../lib/prisma.js";
import { getIO } from "../../socket/index.js";

export class VoteService {
  static async castVote(
    pollId: string,
    optionId: string,
    voterId: string,
    ipAddress?: string,
  ) {
    if (!pollId?.trim()) {
      throw new Error("Poll ID is required");
    }
    if (!optionId?.trim()) {
      throw new Error("Option ID is required");
    }
    if (!voterId?.trim()) {
      throw new Error("Voter ID is required");
    }

    return await prisma.$transaction(
      async (tx) => {
        // if poll exists or not
        const poll = await tx.poll.findUnique({
          where: { id: pollId },
          include: {
            options: {
              where: { id: optionId },
              select: { id: true },
            },
          },
        });

        if (!poll) {
          throw new Error("POLL_NOT_FOUND");
        }

        if (poll.options.length === 0) {
          throw new Error("INVALID_OPTION");
        }

        // if any duplicate vote
        const existing = await tx.vote.findUnique({
          where: {
            pollId_voterId: {
              pollId,
              voterId,
            },
          },
        });

        if (existing) {
          throw new Error("ALREADY_VOTED");
        }

        const vote = await tx.vote.create({
          data: {
            pollId,
            optionId,
            voterId,
            ipAddress: ipAddress || null,
          },
        });

        const votes = await tx.vote.groupBy({
          by: ["optionId"],
          where: { pollId },
          _count: true,
        });

        const allOptions = await tx.option.findMany({
          where: { pollId },
          select: { id: true },
        });
        const results: Record<string, number> = {};

        allOptions.forEach((opt) => {
          results[opt.id] = 0;
        });
        votes.forEach((v) => {
          results[v.optionId] = v._count;
        });

        const totalVotes = Object.values(results).reduce(
          (sum, count) => sum + count,
          0,
        );

        const pollUpdateData = {
          pollId,
          results,
          totalVotes,
          timestamp: new Date().toISOString(),
          voterId,
        };

        // Emit via socket
        try {
          const io = getIO();
          io.to(pollId).emit("poll_updated", pollUpdateData);
        } catch (socketError) {
          console.error("Socket emission failed:", socketError);
        }

        return {
          success: true,
          vote,
          results,
          totalVotes,
        };
      },
      {
        timeout: 10000,
        isolationLevel: "Serializable",
      },
    );
  }

  static async deleteVote(pollId: string, voterId: string) {
    if (!pollId || !voterId) {
      throw new Error("Poll ID and Voter ID are required");
    }

    return await prisma.$transaction(async (tx) => {
      const vote = await tx.vote.findUnique({
        where: {
          pollId_voterId: {
            pollId,
            voterId,
          },
        },
      });

      if (!vote) {
        throw new Error("VOTE_NOT_FOUND");
      }

      await tx.vote.delete({
        where: {
          id: vote.id,
        },
      });

      const results = await this.calculateResults(pollId);

      try {
        const io = getIO();
        io.to(pollId).emit("poll_updated", {
          pollId,
          results,
          timestamp: new Date().toISOString(),
        });
      } catch (socketError) {
        console.error("Socket emission failed:", socketError);
      }

      return { success: true, results };
    });
  }

  private static async calculateResults(
    pollId: string,
  ): Promise<Record<string, number>> {
    const votes = await prisma.vote.groupBy({
      by: ["optionId"],
      where: { pollId },
      _count: true,
    });

    const allOptions = await prisma.option.findMany({
      where: { pollId },
      select: { id: true },
    });

    const results: Record<string, number> = {};
    allOptions.forEach((opt) => {
      results[opt.id] = 0;
    });

    votes.forEach((v) => {
      results[v.optionId] = v._count;
    });

    return results;
  }
}
