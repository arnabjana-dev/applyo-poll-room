import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, Share2, ArrowLeft } from "lucide-react";
import { getPoll, votePoll } from "../api/pollApi";
import socketService from "../socket/socket";
import ShareModal from "../components/ShareModal";

const PollRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isVoting, setIsVoting] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        setLoading(true);
        const response = await getPoll(id);
        setPoll(response.data);
      } catch (err) {
        alert(String(err.message));
      } finally {
        setLoading(false);
      }
    };

    fetchPoll();
    socketService.connect();
    socketService.joinPoll(id);

    // poll updates
    socketService.onPollUpdated((data) => {
      setPoll((prev) => ({
        ...prev,
        results: data.results,
        totalVotes: data.totalVotes,
      }));
    });

    return () => {
      socketService.disconnect();
    };
  }, [id]);

  const handleVote = async () => {
    if (!selectedOption || isVoting) return;

    setIsVoting(true);
    try {
      await votePoll(id, selectedOption);
      setPoll((prev) => ({
        ...prev,
        hasVoted: true,
        votedOptionId: selectedOption,
      }));
    } catch (err) {
      alert(String(err.message));
    } finally {
      setIsVoting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Poll not found</h2>
          <button
            onClick={() => navigate("/")}
            className="text-purple-400 hover:text-purple-300"
          >
            Go back home
          </button>
        </div>
      </div>
    );
  }

  const totalVotes =
    poll.totalVotes || Object.values(poll.results).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            Back
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowShareModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
            >
              <Share2 size={18} />
              Share
            </button>
          </div>
        </div>

        {/* Share Modal */}
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          pollId={id}
          pollQuestion={poll?.question}
        />

        {/* Poll Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-8 mb-6"
        >
          <h1 className="text-3xl font-bold text-white mb-4">
            {poll.question}
          </h1>

          <div className="flex items-center gap-4 text-gray-400 mb-8">
            <div className="flex items-center gap-2">
              <Users size={18} />
              <span>
                {totalVotes} vote{totalVotes !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-4 mb-8">
            {poll.options.map((option) => {
              const voteCount = poll.results[option.id] || 0;
              const percentage =
                totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;
              const isSelected = selectedOption === option.id;
              const isVoted = poll.hasVoted && poll.votedOptionId === option.id;

              return (
                <motion.div
                  key={option.id}
                  whileHover={{ scale: poll.hasVoted ? 1 : 1.02 }}
                  className={`relative overflow-hidden rounded-lg border ${
                    isVoted
                      ? "border-green-500 bg-green-500/10"
                      : isSelected
                        ? "border-purple-500 bg-purple-500/10"
                        : "border-gray-700 hover:border-gray-600"
                  } ${!poll.hasVoted && "cursor-pointer"}`}
                  onClick={() => !poll.hasVoted && setSelectedOption(option.id)}
                >
                  <div className="relative z-10 p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white font-medium">
                        {option.text}
                      </span>
                      <span className="text-gray-400">
                        {voteCount} votes ({percentage.toFixed(1)}%)
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.5 }}
                        className={`h-full ${
                          isVoted
                            ? "bg-gradient-to-r from-green-500 to-emerald-500"
                            : "bg-gradient-to-r from-purple-500 to-pink-500"
                        }`}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Vote button */}
          {!poll.hasVoted ? (
            <button
              onClick={handleVote}
              disabled={!selectedOption || isVoting}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isVoting
                ? "Casting Vote..."
                : selectedOption
                  ? "Cast Vote"
                  : "Select an option to vote"}
            </button>
          ) : (
            <div className="text-center p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
              <p className="text-green-400 font-medium">
                ✓ You've voted in this poll
              </p>
            </div>
          )}
        </motion.div>

        {/* Share instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-gray-500 text-sm"
        >
          Share this link with others to get more votes. Results update in
          real-time!
        </motion.div>
      </div>
    </div>
  );
};

export default PollRoom;
