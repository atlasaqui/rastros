import { motion } from "framer-motion";

export default function ChatBubble({ text, type }) {
  return (
    <motion.div
      className={`chat-bubble ${type === "sent" ? "chat-bubble-sent" : ""}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      {text}
    </motion.div>
  );
}
