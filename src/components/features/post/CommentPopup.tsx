import { useState } from 'react';

export default function CommentPopup({
  onClose, handlePostComment
}: {
  onClose: () => void, handlePostComment: (comment: string) => void
}) {
  const [newComment, setNewComment] = useState<string>("");

  const handleSubmit = () => {
    handlePostComment(newComment);
    onClose();
    setNewComment("");
  }

  return (
    <div className="w-[90%] md:w-[60%] lg:w-[50%] bg-white rounded-md p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3>コメントを投稿</h3>
        <button onClick={() => {
          setNewComment("");
          onClose();
        }}>×</button>
      </div>
      <div className="w-full">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md resize-none focus:outline-none"
          rows={5}
          placeholder="コメントを入力してください..."
        />
      </div>
      <button
        className="bg-primary px-4 py-2 rounded-md"
        onClick={handleSubmit}
      >
        投稿
      </button>
    </div>
  )
}