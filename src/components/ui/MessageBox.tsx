import { MessageBoxType } from "@/types/interface";

interface MessageBoxProps {
  type: MessageBoxType;
  message: string;
  className?: string;
}

export default function MesssageBox({ type, message, className }: MessageBoxProps) {
  return (
    <div className={`
      rounded-sm p-4 box-border w-full ${className}
      ${type === MessageBoxType.ERROR ? "bg-red-100" : "bg-green-100"}
    `}>
      <p className="text-textcolor/80">{message}</p>
    </div>
  )
}