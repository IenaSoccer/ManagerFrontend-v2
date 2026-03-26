export interface Message {
  message: string;
  severity: number;
}

export interface I18nConfig {
  [key: string]: {
    [key: string]: Message | { [key: string]: Message };
  };
}
