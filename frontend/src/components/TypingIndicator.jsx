export default function TypingIndicator({ name = "Contato" }) {
  return (
    <div className="typing-indicator" role="status">
      {name} está digitando<span className="typing-dots">...</span>
    </div>
  );
}
