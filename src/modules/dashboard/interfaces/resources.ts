import type { AttachmentType } from './attachments';

type Resource<T = string | AttachmentType> = {
  id: string;
  name: string;
  description: string;
  thumbnail: T;
  content: {
    data: T[] | T;
    type: 0 | 1;
  };
  attributes: {
    preview: boolean;
    tags: string[];
    custom: Record<string, string>;
  };
  fid: string;
};

export type { Resource };
