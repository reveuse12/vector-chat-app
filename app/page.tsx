import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  MessageSquare,
  Upload,
  Zap,
  Shield,
  ArrowRight,
  Sparkles,
  Database,
  Bot,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Bot className="h-6 w-6" />
              <span className="font-semibold text-lg">VectorChat</span>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Powered by RAG Technology</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Chat with your
            <br />
            <span className="text-muted-foreground">knowledge base</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Upload your documents and get instant, accurate answers. 
            AI that understands your content and speaks your language.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto gap-2">
                Start for free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Sign in to dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Everything you need
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Simple, powerful tools to turn your documents into an intelligent assistant.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Upload className="h-5 w-5" />}
              title="Document Upload"
              description="Upload text documents and let our system automatically chunk and index them for retrieval."
            />
            <FeatureCard
              icon={<Database className="h-5 w-5" />}
              title="Vector Search"
              description="Semantic search powered by embeddings finds the most relevant context for every query."
            />
            <FeatureCard
              icon={<MessageSquare className="h-5 w-5" />}
              title="Natural Chat"
              description="Conversational interface with streaming responses. Ask questions in plain language."
            />
            <FeatureCard
              icon={<Zap className="h-5 w-5" />}
              title="Real-time Streaming"
              description="See responses as they're generated. No waiting for complete answers."
            />
            <FeatureCard
              icon={<Shield className="h-5 w-5" />}
              title="Secure & Private"
              description="Your data stays yours. Role-based access control and secure authentication."
            />
            <FeatureCard
              icon={<Sparkles className="h-5 w-5" />}
              title="Context-Aware"
              description="AI responses grounded in your actual documents, not hallucinations."
            />
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              How it works
            </h2>
            <p className="text-muted-foreground">
              Three simple steps to your AI-powered knowledge assistant.
            </p>
          </div>
          <div className="space-y-8">
            <StepCard
              number="01"
              title="Upload your documents"
              description="Add your knowledge base content. We'll automatically process and index it."
            />
            <StepCard
              number="02"
              title="Ask questions"
              description="Chat naturally with your AI assistant. It understands context and nuance."
            />
            <StepCard
              number="03"
              title="Get accurate answers"
              description="Receive responses grounded in your actual documents with source references."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Ready to get started?
          </h2>
          <p className="text-muted-foreground mb-8">
            Create your account and start chatting with your documents in minutes.
          </p>
          <Link href="/signup">
            <Button size="lg" className="gap-2">
              Create free account
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Bot className="h-5 w-5" />
            <span className="text-sm">VectorChat</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Built with Next.js, Supabase & AI
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 rounded-lg border bg-card">
      <div className="h-10 w-10 rounded-md bg-secondary flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function StepCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-6 items-start">
      <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-mono text-sm font-bold">
        {number}
      </div>
      <div className="pt-2">
        <h3 className="font-semibold mb-1">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
