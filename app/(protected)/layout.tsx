/**
 * Protected Layout
 * Layout for authenticated routes (chat, admin)
 * Requirements: 1.3, 1.4
 */

import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import { Header } from '@/components/layout/Header';
import { Toaster } from '@/components/ui/sonner';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Get user profile for role information
  const { data: profile } = await (supabase
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .from('profiles') as any)
    .select('role')
    .eq('id', user.id)
    .single();

  const isAdmin = profile?.role === 'admin';

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header userEmail={user.email || ''} isAdmin={isAdmin} />
      <main className="flex-1">
        {children}
      </main>
      <Toaster position="top-right" richColors closeButton />
    </div>
  );
}
