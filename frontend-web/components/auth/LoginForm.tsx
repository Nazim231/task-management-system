'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import Link from 'next/link';
import { post } from '@/lib/axios';
import { ZodInputField } from '../ui/zodInputField';

// Validation schema
const loginSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    type TokenPair = { refreshToken: string; accessToken: string };
    const response = await post<TokenPair>('/auth/login', data);

    if (response.success) {
      toast.success('Login successful!');
      reset();
      // Store token if provided in response
      if (response.data) {
        localStorage.setItem('accessToken', response.data.accessToken);
      }
      router.push('/dashboard');
    } else if (response.errors) {
      Object.entries(response.errors).forEach(([field, err]) => {
        setError(field as keyof LoginFormData, { message: err });
      });
    } else toast.error(response.message);
    setIsLoading(false);
  };

  const fields = [
    { name: 'email', label: 'Email', placeholder: 'example@ex.co', type: 'email' },
    {
      name: 'password',
      label: 'Password',
      placeholder: '••••••••',
      type: 'password',
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" method="POST">
          {fields.map((f) => (
            <ZodInputField
              key={f.name}
              zodRegister={register}
              {...f}
              disabled={isLoading}
              error={errors[f.name as keyof LoginFormData] && errors[f.name as keyof LoginFormData]?.message}
            />
          ))}

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
              Sign up
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
