import EmailSentPageClient from './EmailSentPageClient';

interface EmailSentPageProps {
  searchParams: Promise<{
    email?: string;
    emailSent?: string;
  }>;
}

export default async function EmailSentPage({ searchParams }: EmailSentPageProps) {
  const { email, emailSent } = await searchParams;

  const emailSentBoolean = emailSent === 'true';

  return (
    <EmailSentPageClient 
      email={email || null} 
      emailSent={emailSentBoolean} 
    />
  );
}