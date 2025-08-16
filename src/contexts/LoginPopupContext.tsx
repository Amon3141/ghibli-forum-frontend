'use client';
import LoginPopup from "@/components/ui/LoginPopup";
import Overlay from "@/components/ui/Overlay";
import { createContext, useContext, useState } from "react";

interface LoginPopupContextType {
  isLoginPopupOpen: boolean;
  setIsLoginPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
  actionMessage: string | null;
  openPopupWithMessage: (message: string) => void;
}

interface LoginPopupProviderProps {
  children: React.ReactNode;
}

const LoginPopupContext = createContext<LoginPopupContextType | undefined>(undefined);

export const LoginPopupProvider = ({ children }: LoginPopupProviderProps) => {
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const openPopupWithMessage = (message: string) => {
    setActionMessage(message);
    setIsLoginPopupOpen(true);
  }

  return (
    <LoginPopupContext.Provider value={{
      isLoginPopupOpen,
      setIsLoginPopupOpen,
      actionMessage,
      openPopupWithMessage
    }}>
      {children}
      {isLoginPopupOpen && actionMessage && typeof window !== 'undefined' && (
        <Overlay zIndex={50}>
          <LoginPopup />
        </Overlay>
      )}
    </LoginPopupContext.Provider>
  )
}

export const useLoginPopup = () => {
  const context = useContext(LoginPopupContext);
  if (!context) {
    throw new Error('useLoginPopup must be used within a LoginPopupProvider');
  }
  return context;
}
