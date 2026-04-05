'use client';

import { LoginForm } from '@/components/auth/LoginForm';
import { Loading } from '@/components/Loading';
import { useAuthStore } from '@/lib/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Login() {
  const { isAuthenticated, hasHydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!hasHydrated) return;
    if (isAuthenticated) router.replace('/tasks');
  }, [isAuthenticated, router, hasHydrated]);

  return hasHydrated ? <LoginForm /> : <Loading />;
}
