'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { logout } from '@/lib/actions/auth';
import { Button } from '@/components/ui/button';

interface LogoutButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export function LogoutButton({ 
  variant = 'ghost', 
  size = 'default',
  className 
}: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogout() {
    setIsLoading(true);
    try {
      toast.success('Signed out', {
        description: 'You have been signed out successfully.',
      });
      await logout();
    } catch {
      // If redirect fails, force a client-side navigation
      window.location.href = '/login';
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleLogout}
      disabled={isLoading}
    >
      {isLoading ? 'Signing out...' : 'Sign Out'}
    </Button>
  );
}
