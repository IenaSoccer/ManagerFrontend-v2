import { defineStore } from 'pinia';
import axios from 'axios';
import type { ApiAccountEndpoints } from '../interfaces/endpoints';
import type { UserDetails, UserType } from 'src/modules/auth/interfaces/user';
import type { ServerResponse } from 'src/interfaces/response';

interface State {
  myUser: UserType | null;
}

type UpdateUserPayload = Omit<Partial<UserDetails>, 'id' | 'user_id' | 'uid' | 'thumbnail'>;

export const useAccountStore = defineStore('AccountStore', {
  state: (): State => ({
    myUser: {} as UserType,
  }),
  getters: {
    pageInfo(): ApiAccountEndpoints {
      const base = String(process.env.API_URL ?? '#');
      return {
        STORE_GETME: base + '/users/me',
        STORE_EDITME: base + '/users/me',
        STORE_EDITTHUMBNAIL: base + '/users/me/thumbnail',
      };
    },
  },

  actions: {
    async getUserInfo(): Promise<UserType | null> {
      const response = axios.get<ServerResponse>(this.pageInfo.STORE_GETME);
      return response
        .then((res) => {
          const content = res.data?.body?.content as UserType | undefined;
          if (content) {
            this.myUser!.user = content.user;
            this.myUser!.details = content.details;
          }
          return this.myUser;
        })
        .catch((err) => {
          if (axios.isAxiosError(err)) throw err.response?.data ?? err;
          throw err;
        });
    },
    async updateUserInfo(updatedData: UpdateUserPayload): Promise<UserDetails | null> {
      if (!this.myUser) await this.getUserInfo();

      const response = axios.patch<ServerResponse>(this.pageInfo.STORE_EDITME, updatedData);
      return response
        .then(() => {
          return this.myUser?.details ?? null;
        })
        .catch((err) => {
          if (axios.isAxiosError(err)) throw err.response?.data ?? err;
          throw err;
        });
    },
    async updateThumbnail(file: File): Promise<string | null> {
      if (!this.myUser) await this.getUserInfo();

      const formData = new FormData();
      formData.append('thumbnail', file);

      const response = axios.post<ServerResponse>(this.pageInfo.STORE_EDITTHUMBNAIL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
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
  },
});
