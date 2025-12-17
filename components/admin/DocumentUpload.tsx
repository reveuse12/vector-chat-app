'use client';

/**
 * Document Upload Component
 * Allows admins to upload documents to the knowledge base
 * Requirements: 2.1, 2.3, 3.4, 3.5
 */

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, AlertCircle, Loader2, FileText } from 'lucide-react';

interface UploadResult {
  success: boolean;
  chunksProcessed?: number;
  error?: string;
}

interface UploadState {
  status: 'idle' | 'uploading' | 'success' | 'error';
  message?: string;
  chunksProcessed?: number;
}

export function DocumentUpload() {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [uploadState, setUploadState] = useState<UploadState>({ status: 'idle' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      setUploadState({
        status: 'error',
        message: 'Please enter document content',
      });
      return;
    }

    setUploadState({ status: 'uploading' });

    try {
      const response = await fetch('/api/ingest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: content.trim(),
          metadata: {
            title: title.trim() || undefined,
            uploadedAt: new Date().toISOString(),
          },
        }),
      });

      const result: UploadResult = await response.json();

      if (result.success) {
        setUploadState({
          status: 'success',
          message: `Document successfully ingested`,
          chunksProcessed: result.chunksProcessed,
        });
        toast.success('Document ingested successfully', {
          description: `Processed ${result.chunksProcessed} chunk${result.chunksProcessed !== 1 ? 's' : ''} and added to the knowledge base.`,
        });
        // Clear form on success
        setContent('');
        setTitle('');
      } else {
        setUploadState({
          status: 'error',
          message: result.error || 'Failed to ingest document',
        });
        toast.error('Ingestion failed', {
          description: result.error || 'Failed to ingest document. Please try again.',
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setUploadState({
        status: 'error',
        message: errorMessage,
      });
      toast.error('Ingestion error', {
        description: errorMessage,
      });
    }
  };

  const handleReset = () => {
    setUploadState({ status: 'idle' });
  };

  return (
    <div className="space-y-6">
      {/* Status Alert */}
      {uploadState.status === 'success' && (
        <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800 dark:text-green-200">Success</AlertTitle>
          <AlertDescription className="text-green-700 dark:text-green-300">
            {uploadState.message}
            {uploadState.chunksProcessed && (
              <span className="block mt-1">
                Processed {uploadState.chunksProcessed} chunk{uploadState.chunksProcessed !== 1 ? 's' : ''}.
              </span>
            )}
          </AlertDescription>
        </Alert>
      )}

      {uploadState.status === 'error' && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{uploadState.message}</AlertDescription>
        </Alert>
      )}

      {/* Upload Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Document Title (optional)</Label>
          <Input
            id="title"
            placeholder="Enter a title for this document"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={uploadState.status === 'uploading'}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Document Content</Label>
          <Textarea
            id="content"
            placeholder="Paste or type your document content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={uploadState.status === 'uploading'}
            className="min-h-[300px] font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground">
            {content.length.toLocaleString()} characters
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            type="submit"
            disabled={uploadState.status === 'uploading' || !content.trim()}
          >
            {uploadState.status === 'uploading' ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Upload Document
              </>
            )}
          </Button>

          {(uploadState.status === 'success' || uploadState.status === 'error') && (
            <Button type="button" variant="outline" onClick={handleReset}>
              Upload Another
            </Button>
          )}
        </div>
      </form>

      {/* Upload Progress Indicator */}
      {uploadState.status === 'uploading' && (
        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
              <div>
                <p className="font-medium text-blue-800 dark:text-blue-200">
                  Processing document...
                </p>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  Chunking, generating embeddings, and storing in the knowledge base.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
