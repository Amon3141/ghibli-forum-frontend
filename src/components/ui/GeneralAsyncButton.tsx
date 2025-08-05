import React from 'react';
import GeneralButton from './GeneralButton';

interface GeneralAsyncButtonProps extends Omit<React.ComponentProps<typeof GeneralButton>, 'children'> {
  mainText: string;
  loadingText: string;
  isLoading: boolean;
}

export default function GeneralAsyncButton({
  mainText,
  loadingText,
  isLoading,
  disabled,
  ...props
}: GeneralAsyncButtonProps) {
  return (
    <GeneralButton
      {...props}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          <span>{loadingText}</span>
        </div>
      ) : (
        mainText
      )}
    </GeneralButton>
  );
}