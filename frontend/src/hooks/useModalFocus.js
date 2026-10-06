import { useEffect } from "react";
// Trap keyboard focus in a modal and restore its invoker when possible.
export default function useModalFocus(ref, active = true) {
  useEffect(() => {
    if (!active || !ref.current) return;
    const root = ref.current,
      previous = document.activeElement;
    const focusable = () =>
      [
        ...root.querySelectorAll(
          'button:not(:disabled), input:not(:disabled), textarea:not(:disabled), select:not(:disabled), [tabindex="0"]',
        ),
      ].filter((el) => el.getClientRects().length);
    if (!root.contains(document.activeElement))
      (focusable()[0] || root).focus();
    const trap = (e) => {
      if (e.key !== "Tab") return;
      const items = focusable(),
        first = items[0],
        last = items.at(-1);
      if (!first) {
        e.preventDefault();
        root.focus();
        return;
      }
      if (
        e.shiftKey &&
        (document.activeElement === first ||
          !root.contains(document.activeElement))
      ) {
        e.preventDefault();
        last.focus();
      } else if (
        !e.shiftKey &&
        (document.activeElement === last ||
          !root.contains(document.activeElement))
      ) {
        e.preventDefault();
        first.focus();
      }
    };
    root.addEventListener("keydown", trap);
    return () => {
      root.removeEventListener("keydown", trap);
      if (previous?.isConnected && !previous.disabled) previous.focus();
    };
  }, [ref, active]);
}
