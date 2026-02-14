import { Router } from "express";
import { createPoll, getPollById } from "./poll.controller.js";
import { rateLimiter } from "../../middlewares/rateLimiter.middleware.js";
import { authVoter } from "../../middlewares/authVoter.middleware.js";

const router = Router();

router.post("/", rateLimiter, createPoll);
router.get("/:pollId", rateLimiter, authVoter, getPollById);


export default router;
