interface LoadingScreenProps {
  message: string;
}

export default function LoadingScreen({ message }: LoadingScreenProps) {
  return (
    <div className="w-full h-full flex items-center justify-center gap-2">
      <div className="animate-spin rounded-full h-8 w-8 border-3 border-textcolor/90 border-t-transparent mr-2" />
      <p>{message}</p>
    </div>
  )
}