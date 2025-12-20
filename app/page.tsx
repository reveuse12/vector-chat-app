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
  Play,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Gradient Orbs Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-gradient-to-br from-orange-500/10 to-rose-500/10 rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between px-4 py-2 rounded-2xl bg-background/60 backdrop-blur-xl border border-border/50 shadow-lg shadow-black/5">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold text-lg">VectorChat</span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
              <a href="#features" className="hover:text-foreground transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-foreground transition-colors">How it works</a>
              <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
                  Sign in
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 border-0">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 sm:pt-40 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 text-sm mb-8 backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-violet-500" />
            <span className="bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent font-medium">
              Powered by RAG + AI
            </span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
            Your documents,
            <br />
            <span className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-orange-500 bg-clip-text text-transparent">
              supercharged with AI
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Upload your knowledge base and chat with it naturally. 
            Get instant, accurate answers grounded in your actual content.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto h-12 px-8 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 border-0 text-base gap-2 shadow-lg shadow-violet-500/25">
                Start for free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 px-8 rounded-xl text-base gap-2 bg-background/50 backdrop-blur-sm">
              <Play className="h-4 w-4" />
              Watch demo
            </Button>
          </div>

          {/* Hero Visual - Chat Preview */}
          <div className="relative max-w-4xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 via-fuchsia-500/20 to-orange-500/20 rounded-3xl blur-2xl" />
            <div className="relative rounded-2xl border border-border/50 bg-background/80 backdrop-blur-xl shadow-2xl shadow-black/10 overflow-hidden">
              {/* Window Header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-muted/30">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="flex-1 text-center text-sm text-muted-foreground">VectorChat</div>
              </div>
              {/* Chat Content */}
              <div className="p-6 space-y-4">
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">U</div>
                  <div className="flex-1 p-3 rounded-2xl rounded-tl-sm bg-muted/50 text-sm max-w-md">
                    What are the key features of our product?
                  </div>
                </div>
                <div className="flex gap-3 justify-end">
                  <div className="flex-1 p-3 rounded-2xl rounded-tr-sm bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 text-sm max-w-lg text-left">
                    Based on your documentation, the key features include:
                    <ul className="mt-2 space-y-1 text-muted-foreground">
                      <li>• Real-time vector search</li>
                      <li>• Natural language processing</li>
                      <li>• Secure document storage</li>
                    </ul>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logos/Trust Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 border-y border-border/50">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-sm text-muted-foreground mb-6">Built with modern technologies</p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-60">
            <span className="text-lg font-semibold">Next.js</span>
            <span className="text-lg font-semibold">Supabase</span>
            <span className="text-lg font-semibold">pgvector</span>
            <span className="text-lg font-semibold">Gemini AI</span>
            <span className="text-lg font-semibold">Vercel</span>
          </div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-violet-500 mb-3">FEATURES</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Everything you need
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg">
              Powerful tools to transform your documents into an intelligent assistant.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Large Card */}
            <div className="md:col-span-2 lg:col-span-2 group relative p-8 rounded-3xl border border-border/50 bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5 hover:border-violet-500/30 transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-violet-500/10 to-transparent rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500" />
              <div className="relative">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center mb-6">
                  <Database className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Semantic Vector Search</h3>
                <p className="text-muted-foreground leading-relaxed max-w-md">
                  Find relevant content based on meaning, not just keywords. Our pgvector-powered search understands context and delivers precise results.
                </p>
              </div>
            </div>

            {/* Small Card */}
            <div className="group relative p-6 rounded-3xl border border-border/50 bg-background/50 hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all duration-300">
              <div className="h-10 w-10 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-4 group-hover:bg-cyan-500/20 transition-colors">
                <Zap className="h-5 w-5 text-cyan-500" />
              </div>
              <h3 className="font-semibold mb-2">Real-time Streaming</h3>
              <p className="text-sm text-muted-foreground">
                See responses as they generate. No waiting.
              </p>
            </div>

            {/* Small Card */}
            <div className="group relative p-6 rounded-3xl border border-border/50 bg-background/50 hover:border-orange-500/30 hover:bg-orange-500/5 transition-all duration-300">
              <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4 group-hover:bg-orange-500/20 transition-colors">
                <Upload className="h-5 w-5 text-orange-500" />
              </div>
              <h3 className="font-semibold mb-2">Easy Upload</h3>
              <p className="text-sm text-muted-foreground">
                Drop your documents and we handle the rest.
              </p>
            </div>

            {/* Small Card */}
            <div className="group relative p-6 rounded-3xl border border-border/50 bg-background/50 hover:border-green-500/30 hover:bg-green-500/5 transition-all duration-300">
              <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center mb-4 group-hover:bg-green-500/20 transition-colors">
                <Shield className="h-5 w-5 text-green-500" />
              </div>
              <h3 className="font-semibold mb-2">Secure & Private</h3>
              <p className="text-sm text-muted-foreground">
                Your data stays yours with RLS protection.
              </p>
            </div>

            {/* Large Card */}
            <div className="md:col-span-2 lg:col-span-1 group relative p-6 rounded-3xl border border-border/50 bg-background/50 hover:border-rose-500/30 hover:bg-rose-500/5 transition-all duration-300">
              <div className="h-10 w-10 rounded-xl bg-rose-500/10 flex items-center justify-center mb-4 group-hover:bg-rose-500/20 transition-colors">
                <MessageSquare className="h-5 w-5 text-rose-500" />
              </div>
              <h3 className="font-semibold mb-2">Natural Conversations</h3>
              <p className="text-sm text-muted-foreground">
                Chat naturally. Ask follow-ups. Get contextual answers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-muted/30 to-background">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-violet-500 mb-3">HOW IT WORKS</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Three simple steps
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <StepCard
              number="01"
              title="Upload"
              description="Add your documents to the knowledge base. We automatically chunk and embed them."
              gradient="from-violet-500 to-fuchsia-500"
            />
            <StepCard
              number="02"
              title="Ask"
              description="Chat naturally with your AI assistant. It understands context and nuance."
              gradient="from-fuchsia-500 to-orange-500"
            />
            <StepCard
              number="03"
              title="Get Answers"
              description="Receive accurate responses grounded in your actual documents."
              gradient="from-orange-500 to-rose-500"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-orange-500" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
            <div className="relative px-8 py-16 sm:px-16 sm:py-20 text-center text-white">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Ready to supercharge your docs?
              </h2>
              <p className="text-white/80 mb-8 text-lg max-w-xl mx-auto">
                Join thousands of teams using VectorChat to unlock their knowledge.
              </p>
              <Link href="/signup">
                <Button size="lg" className="h-12 px-8 rounded-xl bg-white text-violet-600 hover:bg-white/90 text-base font-semibold shadow-lg">
                  Get started free
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border/50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold">VectorChat</span>
            </div>
            <div className="flex items-center gap-8 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Contact</a>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 VectorChat. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function StepCard({
  number,
  title,
  description,
  gradient,
}: {
  number: string;
  title: string;
  description: string;
  gradient: string;
}) {
  return (
    <div className="text-center">
      <div className={`inline-flex h-16 w-16 rounded-2xl bg-gradient-to-br ${gradient} items-center justify-center mb-6 shadow-lg`}>
        <span className="text-2xl font-bold text-white">{number}</span>
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
