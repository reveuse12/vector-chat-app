'use server';

import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';

export interface AuthResult {
  success: boolean;
  error?: string;
}

/**
 * Server action to sign up a new user
 * Creates user in Supabase Auth and profile with role='user'
 * Requirements: 1.2, 1.5, 3.5
 */
export async function signUp(email: string, password: string): Promise<AuthResult> {
  const supabase = await createServerClient();
  
  // Create user in Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    // Handle duplicate email error
    if (authError.message.includes('already registered') || 
        authError.message.includes('already exists')) {
      return {
        success: false,
        error: 'An account with this email already exists',
      };
    }
    return {
      success: false,
      error: authError.message,
    };
  }

  if (!authData.user) {
    return {
      success: false,
      error: 'Failed to create user account',
    };
  }

  // Create profile with role='user' (never admin via signup)
  // Requirements: 3.5 - signup creates accounts with 'user' role only
  const { error: profileError } = await (supabase
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .from('profiles') as any)
    .insert({
      id: authData.user.id,
      email: authData.user.email || email,
      role: 'user',
    });

  if (profileError) {
    // If profile creation fails, we should still return success
    // as the auth user was created - profile can be created on first login
    console.error('Failed to create profile:', profileError);
  }

  // Auto-login is handled by Supabase Auth signUp
  // The session is automatically created
  
  return {
    success: true,
  };
}

/**
 * Server action to log out the current user
 * Terminates the session and redirects to login page
 * Requirements: 2.4
 */
export async function logout() {
  const supabase = await createServerClient();
  
  await supabase.auth.signOut();
  
  redirect('/login');
}
