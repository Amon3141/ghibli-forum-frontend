import GeneralButton from './GeneralButton';
import MessageBox from './MessageBox';
import { MessageBoxType } from '@/types/interface';

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
    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
      <p className="text-lg mb-3">{confirmMessage}</p>
      {processError && (
        <MessageBox type={MessageBoxType.ERROR} message={processError} />
      )}
      <div className="flex justify-end gap-4 mt-3">
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
    </div>
  );
}
