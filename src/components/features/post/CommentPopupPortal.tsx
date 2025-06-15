import { createPortal } from "react-dom";

export default function CommentPopupPortal({ children }: { children: React.ReactNode }) {
  if (typeof window === "undefined") return null;
  return createPortal(children, document.body);
}