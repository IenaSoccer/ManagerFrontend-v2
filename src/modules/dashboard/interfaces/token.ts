type Capabilities = Array<string>;

type TokenType = {
  id: string;
  name: string;
  token: string;
  capabilities: Capabilities;
  issuer: string;
  expiration: string;
  created_at: string;
  updated_at: string;
};

export type { Capabilities, TokenType };
