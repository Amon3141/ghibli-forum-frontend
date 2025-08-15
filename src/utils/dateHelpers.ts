export const getSemanticDateString = (date: Date | string): string => {
  const targetDate = new Date(date);
  const now = new Date();

  const year = targetDate.getFullYear();
  const month = targetDate.getMonth() + 1;
  const day = targetDate.getDate();
  const hour = targetDate.getHours();
  const minute = targetDate.getMinutes().toString().padStart(2, '0');

  const diffMs = now.getTime() - targetDate.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  // 未来の日付 -> yyyy/mm/dd hh:mm
  if (targetDate > now) {
    return `${year}/${month}/${day} ${hour}:${minute}`;
  }

  // 今日
  if (targetDate.toDateString() === now.toDateString()) {
    if (diffSec < 60) { // 1分以内 -> s
      return `${diffSec}s`;
    }
    if (diffMin < 60) { // 1時間以内 -> m
      return `${diffMin}m`;
    }
    if (diffHour < 24) { // 1日以内 -> h
      return `${diffHour}h`;
    }
  }

  // 1週間以内 -> d
  if (diffDay < 7) {
    return `${diffDay}d`;
  }

  // 1年以上前 
  if (targetDate.getFullYear() === now.getFullYear()) { // 今年 -> mm/dd
    return `${month}/${day}`;
  } else { // 去年以前 -> yyyy/mm/dd
    return `${year}/${month}/${day}`;
  }
};