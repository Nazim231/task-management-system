import type { UseFormRegister } from 'react-hook-form';

export type InputProps = {
  label: string;
  name: string;
  type: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  zodRegister: UseFormRegister<any>;
};

export interface ProtectedRouteProps {
  children: React.ReactNode;
}
