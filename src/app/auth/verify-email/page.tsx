import VerifyEmailPageClient from './VerifyEmailPageClient';
import LoadingScreen from '@/components/ui/LoadingScreen';

interface VerifyEmailPageProps {
  searchParams: Promise<{
    token?: string;
  }>;
}

export default async function VerifyEmailPage({ searchParams }: VerifyEmailPageProps) {
  const { token } = await searchParams;

  return (
    <VerifyEmailPageClient token={token || null} />
  );
}