import ResetPasswordPageClient from './ResetPasswordPageClient';

interface ResetPasswordPageProps {
  searchParams: {
    token?: string;
  };
}

export default function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const { token } = searchParams;

  return (
    <ResetPasswordPageClient token={token || null} />
  );
}
