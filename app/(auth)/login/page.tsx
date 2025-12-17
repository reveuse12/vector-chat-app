import { LoginForm } from '@/components/auth/LoginForm';

interface LoginPageProps {
  searchParams: Promise<{ redirectTo?: string; error?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const redirectTo = params.redirectTo;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <LoginForm redirectTo={redirectTo} />
    </div>
  );
}
