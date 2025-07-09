'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';

interface KikiWelcomeAnimationProps {
  onAnimationComplete: () => void;
  triggerShowMainContent: () => void;
}

export default function KikiWelcomeAnimation({ onAnimationComplete, triggerShowMainContent }: KikiWelcomeAnimationProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const animationDuration = 2000;
  const showMainContentDelay = 1500;

  useEffect(() => {
    setIsAnimating(true);
    // Start animation after component mounts
    const animationTimer = setTimeout(() => {
      setIsAnimating(false);
      onAnimationComplete();
    }, animationDuration);

    const showMainContentTimer = setTimeout(() => {
      triggerShowMainContent();
    }, showMainContentDelay);

    return () => {
      clearTimeout(animationTimer);
      clearTimeout(showMainContentTimer);
    };
  }, [onAnimationComplete, triggerShowMainContent]);

  if (!isAnimating) return null;

  return (
    <div className="fixed inset-0 z-10 bg-opacity-0 overflow-hidden">
      {/* Kiki flying animation */}
      <div className="kiki-container">
        <Image
          src="/images/pngs/kiki_flying.png"
          alt="Kiki flying on her broomstick"
          width={200}
          height={200}
          priority
        />
      </div>

      <style jsx>{`
        .kiki-container {
          position: absolute;
          top: -100px;
          left: -200px;
          animation: kiki-flight 3s ease-in-out forwards;
        }

        @keyframes kiki-flight {
          0% {
            top: 55px;
            left: -400px;
            transform: rotate(-10deg) scale(0.85);
            opacity: 0;
          }
          15% {
            opacity: 1;
            transform: rotate(5deg) scale(1);
          }
          30% {
            top: 50vh;
            left: 20vw;
            transform: rotate(15deg) scale(1.1);
          }
          50% {
            top: 65vh;
            left: 50vw;
            transform: rotate(-5deg) scale(1.3);
          }
          65% {
            top: 60vh;
            left: 70vw;
            transform: rotate(10deg) scale(1.15);
          }
          80% {
            top: 50vh;
            left: 85vw;
            transform: rotate(20deg) scale(0.95);
          }
          90% {
            opacity: 1;
          }
          100% {
            top: 50vh;
            left: 100vw;
            transform: rotate(25deg) scale(0.90);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
} 