import { Input } from './input';
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

export function ZodInputField(props: InputProps) {
  return (
    <div className="space-y-2">
      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
        {props.label}
      </label>
      <Input
        id={props.name}
        type={props.type}
        placeholder={props.placeholder}
        {...props.zodRegister(props.name)}
        className="w-full"
        disabled={props.disabled}
      />
      {props.error && <p className="text-sm text-red-600">{props.error}</p>}
    </div>
  );
}
