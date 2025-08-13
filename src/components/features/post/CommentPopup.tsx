import { useState } from 'react';
import GeneralButton from '@/components/ui/GeneralButton';
import MessageBox from '@/components/ui/MessageBox';
import { MessageBoxType } from '@/types/MessageBoxType';

interface PostCommentPopupProps {
  onClose: () => void;
  handlePostComment: (comment: string) => Promise<boolean>;
  isPostingComment: boolean;
  postCommentError: string | null;
}

export default function PostCommentPopup({
  onClose, handlePostComment, isPostingComment, postCommentError
}: PostCommentPopupProps) {
  const [newComment, setNewComment] = useState<string>("");

  const handleSubmit = async () => {
    const isSuccess = await handlePostComment(newComment);
    if (isSuccess) {
      onClose();
      setNewComment("");
    }
  }

  return (
    <div className="w-[90%] md:w-[60%] lg:w-[50%] bg-white rounded-md p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg py-1">コメントを投稿</h3>
        <button className="text-xl px-1 cursor-pointer" onClick={() => {
          setNewComment("");
          onClose();
        }}>×</button>
      </div>
      <div className="flex flex-col items-end space-y-2">
        <div className="w-full m-0">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md resize-none focus:outline-none"
            rows={5}
            placeholder="コメントを入力してください..."
          />
        </div>
        {postCommentError && (
          <MessageBox type={MessageBoxType.Error} message={postCommentError} className="mt-1" />
        )}
        <GeneralButton
          className={`
            bg-primary/60 border-primary mt-1
            ${!newComment && 'hover:bg-primary/60 pointer-events-none'}`
          }
          onClick={handleSubmit}
          color='primary'
          disabled={!newComment}
        >
          {isPostingComment ? "投稿中..." : "投稿"}
        </GeneralButton>
      </div>
    </div>
  )
}