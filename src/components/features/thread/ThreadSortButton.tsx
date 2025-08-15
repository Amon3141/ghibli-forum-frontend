import { SortDirection, ThreadSortType } from "@/types/sort"
import SortIcon from "@/components/ui/SortIcon"

interface SortButtonProps {
  label: string;
  sortType: ThreadSortType;
  sortDirection: SortDirection;
  globalSortType: ThreadSortType;
  handleSortThreads: (newSortType: ThreadSortType) => void;
}

export default function ThreadSortButton({
  label, sortType, sortDirection, globalSortType, handleSortThreads
}: SortButtonProps) {
  return (
    <button
      onClick={() => handleSortThreads(sortType)}
      className={"flex items-center gap-1"}
    >
      <span>{label}</span>
      <SortIcon
        isSorted={globalSortType === sortType}
        sortDirection={sortDirection ?? SortDirection.desc}
      />
    </button>
  )
}