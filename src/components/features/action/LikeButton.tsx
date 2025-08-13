import { useState } from "react";

import { FaRegHeart, FaHeart } from "react-icons/fa6";

interface LikeButtonProps {
  likes: number;
  isLiked: boolean;
  onClick: () => void;
}

export default function LikeButton({
  likes: initialLikes, isLiked: initialIsLiked, onClick
}: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(initialIsLiked);

  const handleClick = () => {
    if (isLiked) {
      setIsLiked(false);
      setLikes(likes - 1);
    } else {
      setIsLiked(true);
      setLikes(likes + 1);
    }
    onClick();
  };

  return (
    <div className="flex items-center gap-1">
      <button onClick={handleClick} className="popup-element">
        {isLiked ? <FaHeart /> : <FaRegHeart />}
      </button>
      <p>{likes}</p>
    </div>
  );
}
