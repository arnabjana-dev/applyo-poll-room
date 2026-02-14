import { handleApiError } from "../utils/errorHandler";
import axios from "./axios";

export const createPoll = async (data) => {
  try {
    const response = await axios.post("/polls", data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to create poll" };
  }
};

export const getPoll = async (pollId) => {
  try {
    const response = await axios.get(`/polls/${pollId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch poll" };
  }
};

export const votePoll = async (pollId, optionId) => {
  try {
    const response = await axios.post("/votes", { pollId, optionId });
    return response.data;
  } catch (error) {
    throw handleApiError(error)
  }
};

// not yet: if time left
export const deleteVote = async (pollId) => {
  try {
    const response = await axios.delete(`/votes/${pollId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to delete vote" };
  }
};

