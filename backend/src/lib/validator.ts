import { UserRegistration } from '../types/user';
import { ValidationError } from '../types/validation';

export function validateCredentials(
  email: string,
  password: string,
): ValidationError {
  const errors: Record<string, string> = {};

  console.log(`Credentials: ${email}, ${password}`)

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.email = 'Please provide a valid email address';
  }

  // Password validation regex (at least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character)
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&.]{8,}$/;
  if (!password || !passwordRegex.test(password)) {
    errors.password =
      'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateUserData(data: UserRegistration): ValidationError {
  const validName: boolean = data.name != null && data.name.trim().length > 0;
  const credentials = validateCredentials(data.email, data.password);

  let errors: Record<string, any> = {};

  if (!validName) errors['name'] = 'Invalid name';
  if (!credentials.valid) errors = { ...errors, ...credentials.errors };

  return {
    valid: validName && credentials.valid,
    errors,
  };
}
