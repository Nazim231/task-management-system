'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import type { ProtectedRouteProps } from '@/types/components';
import { Loading } from './Loading';

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, hasHydrated } = useAuthStore();

  useEffect(() => {
    if (!hasHydrated) return;

    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router, hasHydrated]);

  if (!isAuthenticated || !hasHydrated) <Loading />;

  return <>{children}</>;
}
