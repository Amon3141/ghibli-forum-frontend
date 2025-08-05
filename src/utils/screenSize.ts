/**
 * Check if the current screen width is larger than a given breakpoint
 * @param breakpoint - width in pixels
 * @returns boolean - true if screen width >= breakpoint
 */
const isScreenWidthOrLarger = (breakpoint: number): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }
  return window.innerWidth >= breakpoint;
};

export const isScreenSmOrLarger = (): boolean => isScreenWidthOrLarger(640);
export const isScreenMdOrLarger = (): boolean => isScreenWidthOrLarger(768);
export const isScreenLgOrLarger = (): boolean => isScreenWidthOrLarger(1024);
export const isScreenXlOrLarger = (): boolean => isScreenWidthOrLarger(1280);