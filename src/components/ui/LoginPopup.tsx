import GeneralButton from '@/components/ui/GeneralButton';
import { useLoginPopup } from '@/contexts/LoginPopupContext';
import { useRouter } from 'next/navigation';

export default function LoginPopup() {
  const { actionMessage, setIsLoginPopupOpen } = useLoginPopup();
  const router = useRouter();
  
  return (
    <div className="w-[80%] max-w-[400px] bg-custom-white rounded-md py-3 px-4 space-y-2">
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-1.5">
          <h3 className="text-sm sm:text-base py-1">{actionMessage}</h3>
          <button 
            className="text-base sm:text-lg px-1 rounded-full hover:bg-gray-100 cursor-pointer"
            onClick={() => {
              setIsLoginPopupOpen(false);
            }}
          >×</button>
        </div>
        <p className="small-text text-textcolor/70">
          ログインして、
          みんなどジブリ愛を語り合いませんか？
        </p>
      </div>
      <div className="flex items-center justify-center pt-3 sm:pt-4 pb-2 sm:pb-3">
        <GeneralButton
          color="primary"
          className="bg-primary border-none font-bold text-textcolor/75"
          onClick={() => {
            setIsLoginPopupOpen(false);
            router.push('/auth/login');
        }}>
          ログイン
        </GeneralButton>
      </div>
    </div>
  )
}