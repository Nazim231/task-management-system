export type ValidationError =
  | { valid: true }
  | { valid: false; errors: Record<string, string> };
