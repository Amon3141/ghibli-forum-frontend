import EmailSentPageClient from './EmailSentPageClient';

interface EmailSentPageProps {
  searchParams: {
    email?: string;
    emailSent?: string;
  };
}

export default function EmailSentPage({ searchParams }: EmailSentPageProps) {
  const { email, emailSent } = searchParams;

  const emailSentBoolean = emailSent === 'true';

  return (
    <EmailSentPageClient 
      email={email || null} 
      emailSent={emailSentBoolean} 
    />
  );
}