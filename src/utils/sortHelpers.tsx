import { Thread } from "@/types/database";
import { ThreadSortType, SortDirection } from "@/types/sort";

import { BsArrowUp, BsArrowDown, BsArrowDownUp } from "react-icons/bs";

export const getSortedThreads = (
  threads: Thread[],
  sortType: ThreadSortType,
  sortDirection: SortDirection
) => {
  if (!sortType) return threads;

  const sortedThreads = [...threads].sort((a, b) => {
    if (sortType === ThreadSortType.date) {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortDirection === SortDirection.asc ? dateA - dateB : dateB - dateA;
    } else if (sortType === ThreadSortType.comments) {
      const commentsA = a._count?.comments || 0;
      const commentsB = b._count?.comments || 0;
      return sortDirection === SortDirection.asc ? commentsA - commentsB : commentsB - commentsA;
    } else if (sortType === ThreadSortType.likes) {
      const likesA = a.reactions?.length || 0;
      const likesB = b.reactions?.length || 0;
      return sortDirection === SortDirection.asc ? likesA - likesB : likesB - likesA;
    }
    return 0;
  })

  return sortedThreads;
}