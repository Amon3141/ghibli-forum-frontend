import { createPortal } from "react-dom";

interface OverlayProps {
  children: React.ReactNode;
  zIndex: number;
}

export default function Overlay({ children, zIndex }: OverlayProps) {
  return (
    createPortal(
      <>
        <div
          className={`fixed inset-0 bg-black opacity-50 z-${zIndex}`}
        />
        <div className={`fixed inset-0 flex items-center justify-center z-${zIndex}`}>
          {children}
        </div>
      </>,
      document.body
    )
  )
}