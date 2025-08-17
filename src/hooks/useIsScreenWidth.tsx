"use client";
import { useEffect, useState } from "react";

// 画面幅がthreasholdより大きいかどうかを返す
function useIsScreenWidth(threashold: number) {
  const [isScreenWidth, setIsScreenWidth] = useState<boolean | null>(null);

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

export const useIsSm = () => {
  const isSm = useIsScreenWidth(640);
  return isSm === null ? false : isSm;
};

export const useIsValidWidth = () => {
  const isValidWidth = useIsScreenWidth(315);
  return isValidWidth === null ? true : isValidWidth;
};