/**
 * Admin Page
 * Document management interface for administrators
 * Requirements: 2.1, 2.3, 3.4, 3.5
 */

import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import { DocumentUpload } from '@/components/admin/DocumentUpload';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function AdminPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Check admin role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single() as { data: { role: string } | null };

  if (!profile || profile.role !== 'admin') {
    redirect('/chat?error=unauthorized');
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Manage the knowledge base by uploading documents for the AI to reference.
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Document Ingestion</CardTitle>
            <CardDescription>
              Upload text documents to add them to the knowledge base. Documents will be
              automatically chunked and indexed for semantic search.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DocumentUpload />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
