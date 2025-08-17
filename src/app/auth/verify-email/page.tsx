import VerifyEmailPageClient from './VerifyEmailPageClient';
import LoadingScreen from '@/components/ui/LoadingScreen';

interface VerifyEmailPageProps {
  searchParams: {
    token?: string;
  };
}

export default function VerifyEmailPage({ searchParams }: VerifyEmailPageProps) {
  const { token } = searchParams;

  return (
    <VerifyEmailPageClient token={token || null} />
  );
}