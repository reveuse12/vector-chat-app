/**
 * Environment configuration with validation
 * Validates required environment variables and throws descriptive errors for missing ones
 */

interface EnvConfig {
  // Supabase (public - available on client)
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
  // Supabase (server-only)
  SUPABASE_SERVICE_ROLE_KEY?: string;
  // Google AI (server-only)
  GOOGLE_GENERATIVE_AI_API_KEY: string;
}

const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'GOOGLE_GENERATIVE_AI_API_KEY',
] as const;

/**
 * Validates that all required environment variables are present
 * @throws Error with descriptive message if any required variable is missing
 */
export function validateEnv(): EnvConfig {
  const missingVars: string[] = [];

  for (const varName of requiredEnvVars) {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  }

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variable${missingVars.length > 1 ? 's' : ''}: ${missingVars.join(', ')}`
    );
  }

  return {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    GOOGLE_GENERATIVE_AI_API_KEY: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
  };
}

/**
 * Get a required environment variable with validation
 * @throws Error if the variable is missing
 */
export function getRequiredEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

/**
 * Get an optional environment variable
 */
export function getOptionalEnvVar(name: string): string | undefined {
  return process.env[name];
}

// Export individual getters for convenience
export const getSupabaseUrl = (): string => getRequiredEnvVar('NEXT_PUBLIC_SUPABASE_URL');
export const getSupabaseAnonKey = (): string => getRequiredEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY');
export const getSupabaseServiceRoleKey = (): string | undefined => getOptionalEnvVar('SUPABASE_SERVICE_ROLE_KEY');
export const getGoogleAIKey = (): string => getRequiredEnvVar('GOOGLE_GENERATIVE_AI_API_KEY');
