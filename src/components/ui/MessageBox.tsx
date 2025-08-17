import { MessageBoxType } from "@/types/types";

interface MessageBoxProps {
  type: MessageBoxType;
  message: string;
  className?: string;
}

export default function MesssageBox({ type, message, className }: MessageBoxProps) {
  const getBackgroundColor = () => {
    switch (type) {
      case MessageBoxType.Error:
        return "bg-red-100";
      case MessageBoxType.Success:
        return "bg-green-100";
      case MessageBoxType.Warning:
        return "bg-orange-100";
      default:
        return "bg-gray-100";
    }
  };

  return (
    <div className={`
      rounded-sm p-2.5 sm:p-3 box-border w-full small-text ${className}
      ${getBackgroundColor()}
    `}>
      <p className="text-textcolor/80">{message}</p>
    </div>
  )
}