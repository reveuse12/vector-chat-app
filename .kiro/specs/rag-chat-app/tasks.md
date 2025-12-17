# Implementation Plan

- [x] 1. Project Setup and Configuration





  - [x] 1.1 Install required dependencies


    - Install ai (Vercel AI SDK), @google/generative-ai, @supabase/supabase-js
    - Install shadcn/ui and configure with Tailwind CSS
    - Install fast-check for property-based testing
    - _Requirements: 9.1_
  - [x] 1.2 Configure environment variables and validation


    - Create .env.local template with NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, GOOGLE_GENERATIVE_AI_API_KEY
    - Implement lib/config.ts with validation that throws descriptive errors for missing variables
    - _Requirements: 9.1, 9.2_
  - [ ]* 1.3 Write property test for environment variable validation
    - **Property 12: Environment Variable Validation**
    - **Validates: Requirements 9.2**
  - [x] 1.4 Set up shadcn/ui components


    - Initialize shadcn/ui with `npx shadcn@latest init`
    - Add required components: button, input, card, avatar, scroll-area, textarea, form, label, toast, dropdown-menu, dialog, alert
    - _Requirements: 8.1, 8.2_

- [x] 2. Database Schema and Supabase Setup





  - [x] 2.1 Create Supabase client utilities


    - Implement lib/supabase/client.ts for browser-side client
    - Implement lib/supabase/server.ts for server-side client with cookie handling
    - _Requirements: 7.1_
  - [x] 2.2 Create database schema SQL migration


    - Enable pgvector extension
    - Create profiles table with role column
    - Create documents table with embedding vector(768) column
    - Create chats and messages tables
    - Create match_documents RPC function for similarity search
    - Create ivfflat index on embeddings
    - _Requirements: 7.1, 7.2, 7.3, 7.4_
  - [x] 2.3 Create TypeScript types for database models


    - Define Profile, Document, Chat, Message, RetrievedDocument interfaces in lib/types/database.ts
    - _Requirements: 7.2, 7.3_

- [x] 3. Authentication System

  - [x] 3.1 Implement authentication middleware
    - Create middleware.ts for route protection
    - Define protected routes and admin routes
    - Redirect unauthenticated users to login
    - _Requirements: 2.3, 3.3_
  - [ ]* 3.2 Write property test for protected route redirection
    - **Property 3: Protected Route Redirection**
    - **Validates: Requirements 2.3**
  - [ ]* 3.3 Write property test for non-admin route denial
    - **Property 6: Non-Admin Route Denial**
    - **Validates: Requirements 3.3**
  - [x] 3.4 Create login page and form
    - Implement app/(auth)/login/page.tsx
    - Create components/auth/LoginForm.tsx using shadcn/ui Card, Form, Input, Button
    - Handle login with Supabase Auth
    - Display error messages for invalid credentials
    - _Requirements: 2.1, 2.2_
  - [x] 3.5 Implement logout functionality
    - Add logout action that terminates session
    - Redirect to login page after logout
    - _Requirements: 2.4_
  - [ ]* 3.6 Write property test for session termination
    - **Property 4: Session Termination on Logout**
    - **Validates: Requirements 2.4**

- [x] 4. User Signup and Admin Seeding






  - [x] 4.1 Create signup page and form


    - Implement app/(auth)/signup/page.tsx
    - Create components/auth/SignupForm.tsx using shadcn/ui Card, Form, Input, Button
    - Add password confirmation field
    - Display validation errors for invalid input
    - Link to login page for existing users
    - _Requirements: 1.1, 1.4_
  - [x] 4.2 Implement signup server action


    - Add signUp function to lib/actions/auth.ts
    - Create user in Supabase Auth
    - Create profile with role='user' in profiles table
    - Auto-login user after successful registration
    - Redirect to chat page on success
    - _Requirements: 1.2, 1.5, 3.5_
  - [ ]* 4.3 Write property test for signup creates user role only
    - **Property 1: Signup Creates User Role Only**
    - **Validates: Requirements 1.2, 3.5**
  - [ ]* 4.4 Write property test for duplicate email rejection
    - **Property 2: Duplicate Email Rejection**
    - **Validates: Requirements 1.3**
  - [x] 4.5 Create admin seeding script


    - Create scripts/seed-admin.ts
    - Read ADMIN_EMAIL and ADMIN_PASSWORD from environment variables
    - Create admin user in Supabase Auth using service role key
    - Create profile with role='admin' in profiles table
    - Handle case where admin already exists (skip or update)
    - _Requirements: 3.1_
  - [x] 4.6 Add seed script to package.json


    - Add "seed:admin" script to package.json
    - Document usage in README
    - _Requirements: 3.1_
  - [x] 4.7 Update environment variables template


    - Add ADMIN_EMAIL and ADMIN_PASSWORD to .env.local.example
    - _Requirements: 3.1, 10.1_

- [ ] 5. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Core Services Implementation





  - [x] 6.1 Implement chunking service


    - Create lib/services/chunking.ts
    - Implement chunkDocument function that splits text into 500-1000 character chunks
    - Handle overlap between chunks (default 100 chars)
    - Return chunk metadata (index, startChar, endChar)
    - _Requirements: 3.1_
  - [ ]* 6.2 Write property test for document chunking size bounds
    - **Property 7: Document Chunking Size Bounds**
    - **Validates: Requirements 4.1**

  - [x] 6.3 Implement embedding service

    - Create lib/services/embedding.ts
    - Implement generateEmbedding using @google/generative-ai embedding-001 model
    - Implement generateEmbeddings for batch processing
    - Return 768-dimension vectors
    - _Requirements: 3.2, 4.1_
  - [ ]* 6.4 Write property test for embedding dimension consistency
    - **Property 8: Embedding Dimension Consistency**
    - **Validates: Requirements 4.2, 5.1**

  - [x] 6.5 Implement RAG service

    - Create lib/services/rag.ts
    - Implement retrieveContext that generates query embedding and calls match_documents RPC
    - Implement buildAugmentedPrompt that injects context into system prompt
    - _Requirements: 4.2, 4.3, 5.1, 5.2_
  - [ ]* 6.6 Write property test for similarity search ordering
    - **Property 10: Similarity Search Ordering**
    - **Validates: Requirements 5.2, 5.3**
  - [ ]* 6.7 Write property test for context injection completeness
    - **Property 11: Context Injection Completeness**
    - **Validates: Requirements 6.2**

- [ ] 7. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Document Ingestion Pipeline





  - [x] 8.1 Create ingestion API route
    - Implement app/api/ingest/route.ts
    - Accept document content and metadata
    - Use chunking service to split document
    - Use embedding service to generate embeddings
    - Store chunks with embeddings in Supabase documents table
    - Return success/failure with chunk count
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_
  - [ ]* 8.2 Write property test for document storage round-trip
    - **Property 9: Document Storage Round-Trip**
    - **Validates: Requirements 4.3**

  - [x] 8.3 Create admin document upload UI
    - Implement app/(protected)/admin/page.tsx
    - Create components/admin/DocumentUpload.tsx using shadcn/ui Card, Button, Textarea, Alert
    - Display upload progress and success/error messages
    - _Requirements: 3.2, 3.4, 4.4, 4.5_
  - [ ]* 8.4 Write property test for admin route access control
    - **Property 5: Admin Route Access Control**
    - **Validates: Requirements 3.2**

- [x] 9. Chat API and Persistence

  - [x] 9.1 Implement chat API route with RAG
    - Create app/api/chat/route.ts
    - Use RAG service to retrieve context for user query
    - Build augmented prompt with context
    - Stream response from Gemini using Vercel AI SDK
    - Handle errors with appropriate status codes
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [x] 9.2 Implement message persistence
    - Create or get chat session for user
    - Persist user message before AI response
    - Persist complete AI response after streaming completes
    - _Requirements: 7.1, 7.2, 7.4_
  - [ ]* 9.3 Write property test for message persistence round-trip
    - **Property 12: Message Persistence Round-Trip**
    - **Validates: Requirements 7.1, 7.2**
  - [x] 9.4 Implement chat history API
    - Create app/api/chat/history/route.ts
    - Return all chats for authenticated user
    - Include messages for each chat
    - _Requirements: 7.3_
  - [ ]* 9.5 Write property test for chat history retrieval completeness
    - **Property 13: Chat History Retrieval Completeness**
    - **Validates: Requirements 7.3**

- [ ] 10. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 11. Chat User Interface

  - [x] 11.1 Create chat page layout
    - Implement app/(protected)/chat/page.tsx
    - Create layout with sidebar for chat history and main chat area
    - Use shadcn/ui ScrollArea for message list
    - _Requirements: 9.1, 9.2_
  - [x] 11.2 Implement ChatInterface component
    - Create components/chat/ChatInterface.tsx
    - Use useChat hook from Vercel AI SDK
    - Connect to /api/chat endpoint
    - Handle streaming responses
    - _Requirements: 6.3, 6.4, 9.1_
  - [x] 11.3 Implement MessageList component
    - Create components/chat/MessageList.tsx
    - Display messages with user/AI distinction using shadcn/ui Avatar, Card
    - Show loading indicator during AI response
    - Auto-scroll to latest message
    - _Requirements: 9.2, 9.3_
  - [x] 11.4 Implement ChatInput component
    - Create components/chat/ChatInput.tsx
    - Use shadcn/ui Textarea and Button
    - Clear input on submit
    - Disable during loading
    - _Requirements: 9.1, 9.4_

  - [x] 11.5 Implement chat history sidebar
    - Create components/layout/Sidebar.tsx
    - Display list of previous chats
    - Add "New Chat" button
    - Load chat history on mount
    - _Requirements: 7.3, 7.4_

- [x] 12. Final Integration and Polish

  - [x] 12.1 Create main layout with header
    - Implement app/(protected)/layout.tsx with header and navigation
    - Add user menu with logout option
    - _Requirements: 2.4_

  - [x] 12.2 Add toast notifications
    - Configure shadcn/ui Sonner for toast notifications
    - Add success/error toasts for ingestion, auth actions
    - _Requirements: 4.4, 4.5_

  - [x] 12.3 Handle edge cases
    - Handle empty knowledge base (no context found)
    - Handle API rate limiting with retry logic
    - Handle network errors gracefully
    - _Requirements: 5.4, 6.5_

- [ ] 13. Final Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
