'use client';
import { useIsSm } from "@/hooks/useIsScreenWidth";
import { MessageBoxType } from "@/types/types";
import { Comment } from "@/types/database";

import MessageBox from "@/components/ui/MessageBox";
import CommentCard from "@/components/features/post/CommentCard";
import { RepliesBoxType } from "@/components/features/post/RepliesBox";

interface CommentsBoxProps {
  comments: Comment[];
  selectedCommentId: number | null;
  fetchCommentsError: string | null;
  handleChangeSelectedComment: (commentId: number) => void;
  onClickCommentTrashButton: (commentId: number) => void;
  renderRepliesBox: (commentId: number, type: RepliesBoxType) => React.ReactNode;
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
    <div className="w-full flex flex-col gap-2">
      {fetchCommentsError && (
        <MessageBox type={MessageBoxType.Error} message={fetchCommentsError} className="mb-2" />
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
            renderRepliesBox(comment.id, RepliesBoxType.Below)
          )}
        </div>
      ))}
    </div>
  );
}