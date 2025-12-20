'use client';

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
  ChevronRight,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Subtle Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-muted/50 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-muted/30 rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between px-5 py-3 rounded-2xl bg-background/70 backdrop-blur-xl border border-border/40">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-foreground flex items-center justify-center">
                <Bot className="h-4 w-4 text-background" />
              </div>
              <span className="font-semibold text-lg tracking-tight">VectorChat</span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
              <a href="#features" className="hover:text-foreground transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-foreground transition-colors">How it works</a>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
                  Sign in
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="rounded-xl">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-36 sm:pt-44 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-muted/50 text-sm mb-8">
            <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">Powered by RAG Technology</span>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.1]">
            Your documents,
            <br />
            <span className="text-muted-foreground">
              supercharged with AI
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
            Upload your knowledge base and chat with it naturally. 
            Get instant, accurate answers grounded in your content.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-20">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto h-11 px-6 rounded-xl text-sm gap-2">
                Start for free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto h-11 px-6 rounded-xl text-sm">
                Sign in to dashboard
              </Button>
            </Link>
          </div>

          {/* Hero Visual - Chat Preview */}
          <div className="relative max-w-3xl mx-auto">
            <div className="rounded-2xl border border-border bg-card shadow-xl overflow-hidden">
              {/* Window Header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-border" />
                  <div className="w-2.5 h-2.5 rounded-full bg-border" />
                  <div className="w-2.5 h-2.5 rounded-full bg-border" />
                </div>
                <div className="flex-1 text-center text-xs text-muted-foreground">Chat</div>
              </div>
              {/* Chat Content */}
              <div className="p-6 space-y-4 bg-background">
                <div className="flex gap-3">
                  <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-xs font-medium shrink-0">U</div>
                  <div className="p-3 rounded-2xl rounded-tl-md bg-muted text-sm max-w-sm">
                    What are the key features of our product?
                  </div>
                </div>
                <div className="flex gap-3 justify-end">
                  <div className="p-3 rounded-2xl rounded-tr-md bg-foreground/5 border border-border text-sm max-w-md text-left">
                    Based on your documentation, the key features include:
                    <ul className="mt-2 space-y-1 text-muted-foreground text-xs">
                      <li>• Real-time vector search</li>
                      <li>• Natural language processing</li>
                      <li>• Secure document storage</li>
                    </ul>
                  </div>
                  <div className="h-7 w-7 rounded-full bg-foreground flex items-center justify-center shrink-0">
                    <Bot className="h-3.5 w-3.5 text-background" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 border-y border-border">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-6">Built with</p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-muted-foreground">
            <span className="text-sm font-medium">Next.js</span>
            <span className="text-sm font-medium">Supabase</span>
            <span className="text-sm font-medium">pgvector</span>
            <span className="text-sm font-medium">Gemini AI</span>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Features</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Everything you need
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Simple, powerful tools to transform your documents into an intelligent assistant.
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Primary Feature */}
            <div className="md:col-span-2 lg:col-span-2 p-8 rounded-2xl border border-border bg-card">
              <div className="h-10 w-10 rounded-xl bg-foreground flex items-center justify-center mb-5">
                <Database className="h-5 w-5 text-background" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Semantic Vector Search</h3>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-lg">
                Find relevant content based on meaning, not just keywords. Our pgvector-powered search understands context and delivers precise results every time.
              </p>
            </div>

            <FeatureCard
              icon={<Zap className="h-4 w-4" />}
              title="Real-time Streaming"
              description="See responses as they generate. No waiting for complete answers."
            />

            <FeatureCard
              icon={<Upload className="h-4 w-4" />}
              title="Easy Upload"
              description="Drop your documents and we handle chunking and indexing."
            />

            <FeatureCard
              icon={<Shield className="h-4 w-4" />}
              title="Secure & Private"
              description="Your data stays yours with row-level security protection."
            />

            <FeatureCard
              icon={<MessageSquare className="h-4 w-4" />}
              title="Natural Conversations"
              description="Chat naturally. Ask follow-ups. Get contextual answers."
            />
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">How it works</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Three simple steps
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12 md:gap-8">
            <StepCard
              number="01"
              title="Upload"
              description="Add your documents to the knowledge base. We automatically chunk and embed them."
            />
            <StepCard
              number="02"
              title="Ask"
              description="Chat naturally with your AI assistant. It understands context and nuance."
            />
            <StepCard
              number="03"
              title="Get Answers"
              description="Receive accurate responses grounded in your actual documents."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
            Ready to get started?
          </h2>
          <p className="text-muted-foreground mb-8">
            Create your account and start chatting with your documents in minutes.
          </p>
          <Link href="/signup">
            <Button size="lg" className="h-11 px-6 rounded-xl text-sm gap-2">
              Create free account
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-md bg-foreground flex items-center justify-center">
                <Bot className="h-3 w-3 text-background" />
              </div>
              <span className="text-sm font-medium">VectorChat</span>
            </div>
            <p className="text-xs text-muted-foreground">
              © 2025 VectorChat. All rights reserved.
            </p>
          </div>
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
    <div className="p-6 rounded-2xl border border-border bg-card hover:bg-muted/30 transition-colors">
      <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-semibold mb-1.5">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
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
    <div className="text-center">
      <div className="inline-flex h-12 w-12 rounded-full border-2 border-border items-center justify-center mb-5">
        <span className="text-sm font-mono font-medium text-muted-foreground">{number}</span>
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
