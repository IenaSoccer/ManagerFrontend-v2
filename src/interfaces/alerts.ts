enum Severity {
  INFO = 0,
  WARNING = 1,
  ERROR = 2,
  SUCCESS = 3,
}

type AlertPayload = {
  title: string;
  severity: Severity;
  button: string;
};

export type { AlertPayload };
export { Severity };
