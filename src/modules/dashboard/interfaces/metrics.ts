type Metrics = {
  resources: {
    galleria: number;
    video: number;
    news: number;
    carosello: number;
    storia: number;
    total: number;
  } | null;
  posts: {
    total: number;
    trending_hashtags: string[];
  } | null;
  users: {
    users_by_role: {
      name: string;
      count: number;
    }[];
  } | null;
  folders:
    | {
        id: string;
        name: string;
        count: number;
      }[]
    | null;
};

export type { Metrics };
