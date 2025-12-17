/**
 * Admin Seeding Script
 * Creates an admin user in Supabase Auth and profiles table
 * Requirements: 3.1
 * 
 * Usage: npx tsx scripts/seed-admin.ts
 * 
 * Required environment variables:
 * - NEXT_PUBLIC_SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY
 * - ADMIN_EMAIL
 * - ADMIN_PASSWORD
 */

import { createClient } from '@supabase/supabase-js';

async function seedAdmin() {
  // Validate required environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!supabaseUrl) {
    throw new Error('Missing required environment variable: NEXT_PUBLIC_SUPABASE_URL');
  }
  if (!serviceRoleKey) {
    throw new Error('Missing required environment variable: SUPABASE_SERVICE_ROLE_KEY');
  }
  if (!adminEmail) {
    throw new Error('Missing required environment variable: ADMIN_EMAIL');
  }
  if (!adminPassword) {
    throw new Error('Missing required environment variable: ADMIN_PASSWORD');
  }

  // Create Supabase admin client with service role key
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  console.log(`Seeding admin user: ${adminEmail}`);


  // Check if admin user already exists
  const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();
  
  if (listError) {
    throw new Error(`Failed to list users: ${listError.message}`);
  }

  const existingAdmin = existingUsers.users.find(
    (user) => user.email === adminEmail
  );

  let userId: string;

  if (existingAdmin) {
    console.log('Admin user already exists in Auth, checking profile...');
    userId = existingAdmin.id;
  } else {
    // Create admin user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true, // Auto-confirm email
    });

    if (authError) {
      throw new Error(`Failed to create admin user: ${authError.message}`);
    }

    if (!authData.user) {
      throw new Error('Failed to create admin user: No user returned');
    }

    userId = authData.user.id;
    console.log(`Created admin user in Auth with ID: ${userId}`);
  }

  // Check if profile exists
  const { data: existingProfile, error: profileCheckError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (profileCheckError && profileCheckError.code !== 'PGRST116') {
    // PGRST116 is "not found" error, which is expected if profile doesn't exist
    throw new Error(`Failed to check profile: ${profileCheckError.message}`);
  }

  if (existingProfile) {
    // Update existing profile to admin role
    if (existingProfile.role !== 'admin') {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', userId);

      if (updateError) {
        throw new Error(`Failed to update profile role: ${updateError.message}`);
      }
      console.log('Updated existing profile to admin role');
    } else {
      console.log('Profile already has admin role');
    }
  } else {
    // Create profile with admin role
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        email: adminEmail,
        role: 'admin',
      });

    if (profileError) {
      throw new Error(`Failed to create admin profile: ${profileError.message}`);
    }
    console.log('Created admin profile with admin role');
  }

  console.log('Admin seeding completed successfully!');
}

// Run the script
seedAdmin()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error seeding admin:', error.message);
    process.exit(1);
  });
