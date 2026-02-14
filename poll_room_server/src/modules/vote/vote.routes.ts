import { Router } from "express";
import { castVote, deleteVote } from "./vote.controller.js";
import { rateLimiter } from "../../middlewares/rateLimiter.middleware.js";
import { authVoter } from "../../middlewares/authVoter.middleware.js";

const router = Router();

router.post("/", rateLimiter, authVoter, castVote);
router.delete("/:pollId", rateLimiter, authVoter, deleteVote);

export default router;
