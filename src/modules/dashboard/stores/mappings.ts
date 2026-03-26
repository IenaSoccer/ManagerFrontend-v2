import { defineStore } from 'pinia';
import axios from 'axios';
import type { ServerResponse } from 'src/interfaces/response';
import type { Mappings } from '../interfaces/mappings';
import type { ApiMappingsEndpoints } from '../interfaces/endpoints';

interface State {
  mappings: Mappings | null;
}

export const useMappingsStore = defineStore('MappingsStore', {
  state: (): State => ({
    mappings: null,
  }),
  getters: {
    pageInfo(): ApiMappingsEndpoints {
      const base = String(process.env.API_URL ?? '#');
      return {
        STORE_LISTMAPPINGS: base + '/mappings',
        STORE_ADDMAPPING: base + '/mappings',
        STORE_DELETEMAPPING: (mappingId: string) => `${base}/mappings/${mappingId}`,
      };
    },
  },

  actions: {
    async getMappings(): Promise<Mappings | null> {
      const response = axios.get<ServerResponse>(this.pageInfo.STORE_LISTMAPPINGS);

      return response
        .then((res) => {
          const content = res.data?.body?.content as Mappings | undefined;
          this.mappings = content ?? null;
          return content ?? null;
        })
        .catch((err) => {
          if (axios.isAxiosError(err)) throw err.response?.data ?? err;
          throw err;
        });
    },
    async deleteMappingByFolderId(folderId: string): Promise<string | null> {
      const response = axios.delete<ServerResponse>(this.pageInfo.STORE_DELETEMAPPING(folderId));

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
    async addMapping(mapping: Mappings): Promise<number | null> {
      const response = axios.put<ServerResponse>(this.pageInfo.STORE_ADDMAPPING, {
        mappings: mapping,
      });

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
