import type { TokenType } from 'src/modules/dashboard/interfaces/token';
import type { UserType } from './user';

type LoginPayload = Omit<UserType['user'], 'id' | 'role' | 'api_token' | 'user_uuid'> & {
  remember_me?: boolean;
  'g-recaptcha-response'?: string;
};

type UpdateTokenPayload = Omit<Partial<TokenType>, 'token' | 'id' | 'issuer'>;

type SessionType = {
  id: number;
  name: string;
  abilities: Array<string>;
  last_used_at: Date;
  expires_at: Date;
};

export type { LoginPayload, UpdateTokenPayload, SessionType };
