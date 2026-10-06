import { motion } from "framer-motion";

export default function ChoiceButton({ text, onClick }) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.03 }}
      onClick={onClick}
    >
      {text}
    </motion.button>
  );
}
