'use client';

import { useAuthStore } from '@/lib/store/authStore';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { post } from '@/lib/axios';
import { toast } from 'sonner';
import { JSX, useEffect } from 'react';
import { cn } from '@/lib/utils';
import TaskList from '@/components/task/tasksList';

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      const response = await post('/auth/logout', {});

      if (response.success) {
        logout();
        toast.success('Logged out successfully');
        router.push('/login');
      }
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen max-h-screen bg-gray-50 flex flex-col gap-2 overflow-y-scroll">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <Button onClick={handleLogout} variant="outline">
              Logout
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col gap-6 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* User Profile Card */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome, {user?.name}!</h2>
                <p className="text-gray-600">Email: {user?.email}</p>
              </div>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">{user?.name?.charAt(0).toUpperCase()}</span>
              </div>
            </div>
          </Card>

          {/* Dashboard Sections */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <OverviewCard cardType="total" value={0} label="Total Tasks" />
            <OverviewCard cardType="completed" value={0} label="Completed" />
            <OverviewCard cardType="pending" value={0} label="Pending" />
          </div>

          <TaskList className='' />
        </main>
      </div>
    </ProtectedRoute>
  );
}

const CardType = {
  total: 'text-blue-600',
  completed: 'text-green-600',
  pending: 'text-orange-600',
};

function OverviewCard(props: { value: number; label: string; cardType: keyof typeof CardType }): JSX.Element {
  return (
    <Card className="p-6">
      <div className="text-center">
        <div className={cn('text-4xl font-bold mb-2', CardType[props.cardType])}>{props.value}</div>
        <h3 className="text-lg font-semibold text-gray-900">{props.label}</h3>
      </div>
    </Card>
  );
}
