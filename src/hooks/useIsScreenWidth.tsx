"use client";
import { useEffect, useState } from "react";

// 画面幅がthreasholdより大きいかどうかを返す
function useIsScreenWidth(threashold: number) {
  const [isScreenWidth, setIsScreenWidth] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsScreenWidth(window.innerWidth >= threashold);
      }, 50);
    };

    setIsScreenWidth(window.innerWidth >= threashold);
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, [threashold]);

  return isScreenWidth;
}

export const useIsSm = () => useIsScreenWidth(640);
export const useIsValidWidth = () => useIsScreenWidth(315);