import GeneralButton from './GeneralButton';
import MessageBox from './MessageBox';
import { MessageBoxType } from '@/types/types';

interface ConfirmationPopupProps {
  type: 'action' | 'delete';
  confirmMessage: string;
  confirmLabel: string;
  onConfirm: () => Promise<boolean>;
  onClose: () => void;
  isProcessing: boolean;
  processError: string | null;
}

export default function ConfirmationPopup({
  type, confirmMessage, confirmLabel, onConfirm, onClose, isProcessing, processError
}: ConfirmationPopupProps) {
  const handleConfirm = async () => {
    const isSuccess = await onConfirm();
    if (isSuccess) {
      onClose();
    }
  };

  return (
    <div className="
      flex flex-col items-center bg-custom-white rounded-lg
      py-3 px-5 sm:py-4 sm:px-7 max-w-md mx-4 space-y-3 sm:space-y-4
    ">
      <p className="text-sm sm:text-base pt-1">{confirmMessage}</p>
      <div className="flex items-center justify-center gap-4 mt-2 mb-1">
        <GeneralButton
          onClick={onClose}
          color="default"
        >
          キャンセル
        </GeneralButton>
        <GeneralButton
          onClick={handleConfirm}
          color={type === 'delete' ? 'delete' : 'primary'}
        >
          {confirmLabel}{isProcessing && "中..."}
        </GeneralButton>
      </div>
      {processError && (
        <div className="w-full mt-2 sm:mt-3">
          <MessageBox type={MessageBoxType.Error} message={processError} />
        </div>
      )}
    </div>
  );
}
