import { LoginInput, RegisterInput, AuthResponse, UserSummary } from '@contentpilot/shared';

export type { LoginInput, RegisterInput, AuthResponse, UserSummary };

export interface TokenPayload {
  id: string;
  email: string;
  role: 'ADMIN' | 'EDITOR';
}
