import { Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { Vote, Zap, Shield } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 text-transparent bg-clip-text">
            Live Polls
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Create instant polls, share with anyone, watch results live. No
            signup required.
          </p>
          <Link to="/create">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
            >
              Create Your First Poll
            </motion.button>
          </Link>
        </motion.div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700"
          >
            <Zap className="w-12 h-12 text-yellow-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Real-time Updates
            </h3>
            <p className="text-gray-400">
              Watch votes roll in instantly across all connected users
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700"
          >
            <Vote className="w-12 h-12 text-purple-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Signup</h3>
            <p className="text-gray-400">
              Create and vote instantly. Just share the link
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700"
          >
            <Shield className="w-12 h-12 text-green-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Fair & Secure
            </h3>
            <p className="text-gray-400">
              One vote per person with IP and JWT protection
            </p>
          </motion.div>
        </div>

        {/* How it works */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-8">How it works</h2>
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 text-gray-300">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 border border-purple-500 flex items-center justify-center font-bold">
                1
              </div>
              <span>Create poll with options</span>
            </div>
            <div className="text-purple-400 hidden md:block">→</div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 border border-purple-500 flex items-center justify-center font-bold">
                2
              </div>
              <span>Share the generated link</span>
            </div>
            <div className="text-purple-400 hidden md:block">→</div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 border border-purple-500 flex items-center justify-center font-bold">
                3
              </div>
              <span>Watch live results</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
