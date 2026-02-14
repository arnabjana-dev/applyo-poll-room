import {
  Copy,
  Check,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  Link2,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

const ShareModal = ({ isOpen, onClose, pollId, pollQuestion }) => {
  const [copied, setCopied] = useState(false);
  const modalRef = useRef();
  const pollLink = `${window.location.origin}/poll/${pollId}`;

  const shareOptions = [
    {
      name: "Copy Link",
      icon: Link2,
      action: () => {
        navigator.clipboard.writeText(pollLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
      color: "bg-gray-600",
    },
    {
      name: "WhatsApp",
      icon: ({ className }) => (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.553 4.12 1.522 5.85L.053 23.39c-.114.457.292.863.749.749l5.54-1.469C7.88 23.447 9.88 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.864 0-3.627-.537-5.125-1.478l-.366-.216-3.702.982.982-3.702-.216-.366C2.537 15.627 2 13.864 2 12 2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z" />
        </svg>
      ),
      action: () =>
        window.open(
          `https://wa.me/?text=${encodeURIComponent(`Vote here: ${pollQuestion} - ${pollLink}`)}`,
          "_blank",
        ),
      color: "bg-green-600",
    },
    {
      name: "Twitter",
      icon: Twitter,
      action: () =>
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Vote here: ${pollQuestion}`)}&url=${encodeURIComponent(pollLink)}`,
          "_blank",
        ),
      color: "bg-blue-400",
    },
    {
      name: "Facebook",
      icon: Facebook,
      action: () =>
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pollLink)}&quote=${encodeURIComponent(pollQuestion)}`,
          "_blank",
        ),
      color: "bg-blue-600",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      action: () =>
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pollLink)}`,
          "_blank",
        ),
      color: "bg-blue-700",
    },
    {
      name: "Email",
      icon: Mail,
      action: () =>
        window.open(
          `mailto:?subject=${encodeURIComponent(`Vote on: ${pollQuestion}`)}&body=${encodeURIComponent(`Check out this poll: ${pollLink}`)}`,
          "_blank",
        ),
      color: "bg-gray-500",
    },
  ];

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        ref={modalRef}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-800 rounded-2xl border border-gray-700 p-6 max-w-md w-full"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">Share Poll</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <p className="text-gray-400 mb-4 text-sm">{pollQuestion}</p>

        {/* Direct link with copy */}
        <div className="flex items-center gap-2 mb-6 p-2 bg-gray-900/50 rounded-lg border border-gray-700">
          <input
            type="text"
            value={pollLink}
            readOnly
            className="flex-1 bg-transparent text-white text-sm px-2 py-1 outline-none"
          />
          <button
            onClick={() => {
              navigator.clipboard.writeText(pollLink);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="px-3 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg text-purple-400 transition-colors flex items-center gap-1"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span className="text-sm">{copied ? "Copied!" : "Copy"}</span>
          </button>
        </div>

        {/* Share options grid */}
        <div className="grid grid-cols-4 gap-3">
          {shareOptions.map((option) => (
            <button
              key={option.name}
              onClick={option.action}
              className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-700/50 transition-colors group"
            >
              <div
                className={`p-3 rounded-full ${option.color} bg-opacity-20 group-hover:bg-opacity-30 transition-all`}
              >
                <option.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs text-gray-400 group-hover:text-gray-300">
                {option.name === "Copy Link"
                  ? copied
                    ? "Copied!"
                    : option.name
                  : option.name}
              </span>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
export default ShareModal;
