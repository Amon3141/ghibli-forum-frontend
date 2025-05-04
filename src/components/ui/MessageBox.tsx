interface MessageBoxProps {
  type: "error" | "success";
  message: string;
}

export default function MesssageBox({ type, message }: MessageBoxProps) {
  return (
    <div className={`
      rounded-sm p-4 box-border w-full
      ${type === "error" ? "bg-red-100" : "bg-green-100"}
    `}>
      <p className="text-textcolor/80">{message}</p>
    </div>
  )
}