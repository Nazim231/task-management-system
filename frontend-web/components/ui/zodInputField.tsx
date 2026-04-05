import { Input } from './input';
import type { InputProps } from '@/types/components';

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
