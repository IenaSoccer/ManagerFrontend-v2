import { defineStore } from 'pinia';
import axios from 'axios';
import type { ApiResourceEndpoints } from '../interfaces/endpoints';
import type { ServerResponse } from 'src/interfaces/response';
import type { Resource } from '../interfaces/resources';

interface State {
  resources: Resource<string>[] | null;
}

type UpdateResourcePayload = Omit<Partial<Resource>, 'id'>;

export const useResourcesStore = defineStore('ResourcesStore', {
  state: (): State => ({
    resources: null,
  }),
  getters: {
    pageInfo(): ApiResourceEndpoints {
      const base = String(process.env.API_URL ?? '#');
      return {
        STORE_LISTRESOURCES: base + '/resources',
        STORE_GETRESOURCE: (resourceId: string, per_page?: number) =>
          `${base}/resources/${resourceId}${per_page ? `?per_page=${per_page}` : ''}`,
        STORE_ADDRESOURCE: (parentId?: string) => `${base}/resources/${parentId ?? ''}`,
        STORE_EDITRESOURCE: (resourceId: string) => `${base}/resources/${resourceId}`,
        STORE_DELETERESOURCE: (resourceId: string) => `${base}/resources/${resourceId}`,
      };
    },
  },

  actions: {
    async getResources(): Promise<Resource<string>[] | null> {
      const response = axios.get<ServerResponse>(this.pageInfo.STORE_LISTRESOURCES);

      return response
        .then((res) => {
          const content = res.data?.body?.content?.data as Resource<string>[] | undefined;
          this.resources = content ?? null;
          return this.resources;
        })
        .catch((err) => {
          if (axios.isAxiosError(err)) throw err.response?.data ?? err;
          throw err;
        });
    },
    async getResourceById(folderId: string, per_page?: number): Promise<Resource<string>[] | null> {
      const response = axios.get<ServerResponse>(
        this.pageInfo.STORE_GETRESOURCE(folderId, per_page),
      );

      return response
        .then((res) => {
          const content = res.data?.body?.content?.data as Resource<string>[] | undefined;
          this.resources = content ?? null;

          return this.resources;
        })
        .catch((err) => {
          if (axios.isAxiosError(err)) throw err.response?.data ?? err;
          throw err;
        });
    },
    async editResourceById(
      resourceId: string,
      resource: UpdateResourcePayload,
    ): Promise<UpdateResourcePayload | null> {
      const response = axios.post<ServerResponse>(
        this.pageInfo.STORE_EDITRESOURCE(resourceId),
        resource,
      );

      return response
        .then((res) => {
          const content = res.data?.body?.content as UpdateResourcePayload | undefined;
          return content ?? null;
        })
        .catch((err) => {
          if (axios.isAxiosError(err)) throw err.response?.data ?? err;
          throw err;
        });
    },
    async deleteResourceById(resourceId: string): Promise<string | null> {
      const response = axios.delete<ServerResponse>(this.pageInfo.STORE_DELETERESOURCE(resourceId));

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
    async addResource(resource: Partial<Resource>): Promise<number | null> {
      const response = axios.put<ServerResponse>(
        this.pageInfo.STORE_ADDRESOURCE(resource.fid ?? ''),
        resource,
      );

      return response
        .then((res) => {
          const code = res.data?.body?.code;
          return code ?? null;
        })
        .catch((err) => {
          if (axios.isAxiosError(err)) throw err.response?.data ?? err;
          throw err;
        });
    },
  },
});
