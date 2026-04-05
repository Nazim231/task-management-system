'use client';

import { Loading } from '@/components/Loading';
import { useAuthStore } from '@/lib/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, hasHydrated } = useAuthStore();

  useEffect(() => {
    if (!hasHydrated) return;

    if (isAuthenticated) router.replace('/tasks');
    else router.replace('/login');
  }, [isAuthenticated, hasHydrated]);
  return <Loading />;
}
