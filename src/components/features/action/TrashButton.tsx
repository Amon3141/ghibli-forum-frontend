import { TbTrash } from "react-icons/tb";

interface TrashButtonProps {
  onClick: () => void;
}

export default function TrashButton({ onClick: handleClickTrashButton }: TrashButtonProps) {
  return (
    <button
      onClick={handleClickTrashButton}
      className="flex items-center justify-center transition-opacity duration-100 cursor-pointer group"
    >
      <TbTrash className="text-lg group-hover:text-red-700"/>
    </button>
  );
}