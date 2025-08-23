import { SortDirection, ThreadSortType } from "@/types/sort";
import { BsArrowDown, BsArrowDownUp, BsArrowUp } from "react-icons/bs";

interface SortIconProps {
  isSorted: boolean;
  sortDirection: SortDirection;
}

export default function SortIcon({ isSorted, sortDirection }: SortIconProps) {
  if (!isSorted) {
    return <BsArrowDownUp className="text-textcolor/60 w-3 sm:w-4" />;
  }

  if (sortDirection === SortDirection.asc) {
    return <BsArrowUp className="text-textcolor w-3 sm:w-4" />;
  } else if (sortDirection === SortDirection.desc) {
    return <BsArrowDown className="text-textcolor w-3 sm:w-4" />;
  }
}