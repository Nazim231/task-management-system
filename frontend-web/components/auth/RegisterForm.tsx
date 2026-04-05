'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import Link from 'next/link';
import { post } from '@/lib/axios';
import { ZodInputField } from '../ui/zodInputField';
// Validation schema
const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/\d/, 'Password must contain at least one number')
      .regex(/[@$!%*?&]/, 'Password must contain at least one special character (@$!%*?&)'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    const { confirmPassword, ...registerData } = data;

    const response = await post('/auth/register', registerData);

    if (response.success) {
      toast.success('Registration successful!');
      reset();
      router.push('/dashboard');
    } else if (response.errors) {
      Object.entries(response.errors).forEach(([field, message]) => {
        setError(field as keyof RegisterFormData, { message });
      });
    } else {
      toast.error(response.message);
    }
    setIsLoading(false);
  };

  // field to generate
  const fields = [
    { name: 'name', label: 'Full Name', placeholder: 'John Doe', type: 'text' },
    { name: 'email', label: 'Email', placeholder: 'example@ex.co', type: 'email' },
    {
      name: 'password',
      label: 'Password',
      placeholder: '••••••••',
      type: 'password',
    },
    {
      name: 'confirmPassword',
      label: 'Confirm Password',
      placeholder: '••••••••',
      type: 'password',
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-600 mt-2">Sign up to get started</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {fields.map((f) => (
            <ZodInputField
              key={f.name}
              zodRegister={register}
              {...f}
              disabled={isLoading}
              error={errors[f.name as keyof RegisterFormData] && errors[f.name as keyof RegisterFormData]?.message}
            />
          ))}

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Creating account...' : 'Sign Up'}
          </Button>
        </form>

        {/* Sign In Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
