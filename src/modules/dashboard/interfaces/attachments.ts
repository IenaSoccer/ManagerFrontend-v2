type AttachmentType = {
  id: string;
  data: Attachment;
  fid: string;
};

type Attachment = {
  name: string;
  path: string;
  description: string;
};

export type { AttachmentType, Attachment };
