import { FaRegTrashCan } from "react-icons/fa6";

interface TrashButtonProps {
  onClick: () => void;
}

export default function TrashButton({ onClick: handleClickTrashButton }: TrashButtonProps) {
  return (
    <button
      onClick={handleClickTrashButton}
      className="flex items-center justify-center transition-opacity duration-100 cursor-pointer group"
    >
      <FaRegTrashCan className="group-hover:text-red-700"/>
    </button>
  );
}