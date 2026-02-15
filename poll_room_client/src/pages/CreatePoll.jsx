import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import { createPoll } from "../api/pollApi";

const CreatePoll = () => {
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");

  const addOption = () => {
    if (options.length < 10) {
      setOptions([...options, ""]);
    }
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  const updateOption = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!question.trim()) {
      setError("Please enter a question");
      return;
    }

    const validOptions = options.filter((opt) => opt.trim());
    if (validOptions.length < 2) {
      setError("Please add at least 2 options");
      return;
    }

    setIsCreating(true);
    try {
      const response = await createPoll({
        question: question.trim(),
        options: validOptions,
      });

      navigate(`/poll/${response.data.id}`);
    } catch (err) {
      setError(err.message || "Failed to create poll");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Home
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            Create a New Poll
          </h1>
          <p className="text-gray-400 mb-8">
            Fill in the details below to create your poll
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Question Input */}
            <div>
              <label className="block text-gray-300 mb-2 font-medium">
                Question
              </label>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g., What's your favorite programming language?"
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                maxLength={200}
              />
            </div>

            {/* Options */}
            <div>
              <label className="block text-gray-300 mb-2 font-medium">
                Options ({options.length}/10)
              </label>
              <div className="space-y-3">
                <AnimatePresence>
                  {options.map((option, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex gap-2"
                    >
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                        className="flex-1 px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                        maxLength={100}
                      />
                      {options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeOption(index)}
                          className="px-3 py-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/30 transition-colors"
                        >
                          <Trash2 size={20} />
                        </button>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {options.length < 10 && (
                <button
                  type="button"
                  onClick={addOption}
                  className="mt-3 flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
                >
                  <Plus size={20} />
                  Add Option
                </button>
              )}
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isCreating}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? "Creating Poll..." : "Create Poll"}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default CreatePoll;
