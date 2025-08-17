'use client';
import { useIsValidWidth } from '@/hooks/useIsScreenWidth';

export default function ScreenTooNarrowOverlay() {
  const isValidWidth = useIsValidWidth();

  if (isValidWidth) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-primary/10 backdrop-blur-lg z-[9999] flex items-center justify-center p-4">
      <div className="bg-custom-white rounded-lg p-6 text-center max-w-sm w-full">
        <h2 className="text-lg font-bold mb-4 text-textcolor">
          画面が狭すぎます
        </h2>
        <p className="text-sm text-textcolor/80 leading-relaxed">
          ジブリ掲示板を正常に利用するにはより広い画面でアクセスしてください。
        </p>
        <div className="mt-4 text-xs text-textcolor/60">
          推奨: 最小幅 315px以上
        </div>
      </div>
    </div>
  );
}