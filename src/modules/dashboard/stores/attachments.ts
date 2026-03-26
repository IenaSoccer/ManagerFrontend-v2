import { defineStore } from 'pinia';
import axios from 'axios';
import type { ApiAttachmentsEndpoints } from '../interfaces/endpoints';
import type { ServerResponse } from 'src/interfaces/response';
import type { Attachment, AttachmentType } from '../interfaces/attachments';

interface State {
  attachments: AttachmentType[] | null;
  total: number;
}

export type UpdateAttachmentTypePayload = Omit<Partial<AttachmentType>, 'id'>;
export type UpdateAttachmentPayload = Omit<Attachment, 'path'>;

export const useAttachmentsStore = defineStore('AttachmentsStore', {
  state: (): State => ({
    attachments: null,
    total: 0,
  }),
  getters: {
    pageInfo(): ApiAttachmentsEndpoints {
      const base = String(process.env.API_URL ?? '#');
      return {
        STORE_GETATTACHMENTS: (folderId: string, per_page?: number, page: number = 1) =>
          `${base}/attachments/${folderId}?${per_page ? `per_page=${per_page}` : ''}${page ? `&page=${page}` : ''}`,
        STORE_ADDATTACHMENT: (folderId: string) => `${base}/attachments/${folderId}`,
        STORE_DELETEATTACHMENT: (folderId: string, attachmentId: string) =>
          `${base}/attachments/${folderId}/${attachmentId}`,
        STORE_EDITATTACHMENT: (attachmentId: string) => `${base}/attachments/${attachmentId}`,
      };
    },
  },

  actions: {
    async getAttachmentsByFolderId(
      folderId: string,
      per_page?: number,
      page: number = 1,
    ): Promise<AttachmentType[] | null> {
      const response = axios.get<ServerResponse>(
        this.pageInfo.STORE_GETATTACHMENTS(folderId, per_page, page),
      );

      return response
        .then((res) => {
          const content = res.data?.body?.content as
            | { data: AttachmentType[]; total: number }
            | undefined;
          this.attachments = content?.data ?? null;
          this.total = content?.total ?? 0;
          return this.attachments ?? null;
        })
        .catch((err) => {
          if (axios.isAxiosError(err)) throw err.response?.data ?? err;
          throw err;
        });
    },
    async editAttachmentById(
      attachmentId: string,
      attachment: UpdateAttachmentPayload,
    ): Promise<UpdateAttachmentPayload | null> {
      const response = axios.post<ServerResponse>(
        this.pageInfo.STORE_EDITATTACHMENT(attachmentId),
        attachment,
      );

      return response
        .then((res) => {
          const content = res.data?.body?.content as UpdateAttachmentPayload | undefined;
          return content ?? null;
        })
        .catch((err) => {
          if (axios.isAxiosError(err)) throw err.response?.data ?? err;
          throw err;
        });
    },
    async deleteAttachmentById(folderId: string, attachmentId: string): Promise<string | null> {
      const response = axios.delete<ServerResponse>(
        this.pageInfo.STORE_DELETEATTACHMENT(folderId, attachmentId),
      );

      return response
        .then((res) => {
          const content = res.data?.body?.content as string | undefined;
          return content ?? null;
        })
        .catch((err) => {
          if (axios.isAxiosError(err)) throw err.response?.data ?? err;
          throw err;
        });
    },
    async addAttachment(
      folderId: string,
      attachment: UpdateAttachmentPayload & { media: string },
    ): Promise<number | null> {
      const response = axios.put<ServerResponse>(
        this.pageInfo.STORE_ADDATTACHMENT(folderId),
        attachment,
      );

      return response
        .then((res) => {
          const code = res.data?.body?.content as number | undefined;
          return code ?? null;
        })
        .catch((err) => {
          if (axios.isAxiosError(err)) throw err.response?.data ?? err;
          throw err;
        });
    },
  },
});
