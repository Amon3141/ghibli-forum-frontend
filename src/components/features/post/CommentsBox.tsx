'use client';
import { useIsSm } from "@/hook/useIsScreenWidth";
import { MessageBoxType } from "@/types/MessageBoxType";
import { Comment } from "@/types/database/comment";

import MessageBox from "@/components/ui/MessageBox";
import CommentCard from "@/components/features/post/CommentCard";

interface CommentsBoxProps {
  comments: Comment[];
  selectedCommentId: number | null;
  fetchCommentsError: string | null;
  handleChangeSelectedComment: (commentId: number) => void;
  onClickCommentTrashButton: (commentId: number) => void;
  renderRepliesBox: (commentId: number) => React.ReactNode;
}

export default function CommentsBox({
  comments,
  selectedCommentId,
  fetchCommentsError,
  handleChangeSelectedComment,
  onClickCommentTrashButton,
  renderRepliesBox
}: CommentsBoxProps) {
  const isSm = useIsSm();

  return (
    <div className="flex-1 flex flex-col gap-4">
      {fetchCommentsError && (
        <MessageBox type={MessageBoxType.ERROR} message={fetchCommentsError} />
      )}

      {comments && comments.map((comment) => (
        <div key={comment.id}>
          <CommentCard
            comment={comment}
            selectedCommentId={selectedCommentId}
            onClickShowReply={() => {
              handleChangeSelectedComment(comment.id);
            }}
            onClickTrashButton={() => {
              onClickCommentTrashButton(comment.id);
            }}
          />
          {!isSm && selectedCommentId === comment.id && (
            <div className="mb-4">
              {renderRepliesBox(comment.id)}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}