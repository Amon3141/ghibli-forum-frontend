import { useState } from 'react';
import GeneralButton from '@/components/ui/GeneralButton';
import MessageBox from '@/components/ui/MessageBox';
import { MessageBoxType } from '@/types/types';

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
    <div className="w-[90%] md:w-[60%] lg:w-[50%] bg-custom-white rounded-md p-4 space-y-3">
      <div className="flex items-center justify-between gap-1">
        <h3 className="text-base sm:text-lg py-1">コメントを投稿</h3>
        <button className="
          flex items-center justify-center h-8 w-8 p-1.5
          text-base sm:text-lg rounded-full hover:bg-gray-100 cursor-pointer
        " onClick={() => {
          setNewComment("");
          onClose();
        }}>×</button>
      </div>
      <div className="flex flex-col items-end space-y-2.5">
        {postCommentError && (
          <MessageBox type={MessageBoxType.Error} message={postCommentError} />
        )}
        <div className="w-full m-0">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-md resize-none focus:outline-none text-sm sm:text-base"
            rows={5}
            placeholder="コメントを入力してください..."
          />
        </div>
        <GeneralButton
          className={`
            bg-primary/60 border-primary mt-1.5
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