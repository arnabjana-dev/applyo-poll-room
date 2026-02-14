export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error
    switch (error.response.status) {
      case 400:
        return error.response.data.message || "Invalid request";
      case 403:
        return "You have already voted";
      case 404:
        return "Poll not found";
      case 500:
        return "Server error. Please try again later";
      default:
        return error.response.data.message || "Something went wrong";
    }
  } else if (error.request) {
    // Request made but no response
    return "Network error. Please check your connection";
  } else {
    // Something else happened
    return error.message || "An unexpected error occurred";
  }
};