type PaginatedResponse<T> = {
  data?: T[];

  total: number;
  to: number;
  from: number;
  current_page: number;
  per_page: number;
  last_page: number;
  first_page_url: string;
  last_page_url: string;
  prev_page_url: string | null;
  next_page_url: string | null;
  path: string;
  links: {
    url: string | null;
    label: string;
    active: boolean;
    page: number | null;
  }[];
};

type ServerResponse = {
  header: string;
  body: {
    code: number;
    message: string;
    content: PaginatedResponse<unknown> | any;
  };
};

type ValidationError = {
  errors: {
    [key: string]: string[];
  };
  message: string;
};

export type { ServerResponse, ValidationError };
