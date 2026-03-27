import { defineStore } from 'pinia';
import axios from 'axios';
import type { ApiUserEndpoints } from '../interfaces/endpoints';
import type { UserDetails, UserInfo, UserType } from 'src/modules/auth/interfaces/user';
import type { ServerResponse } from 'src/interfaces/response';

interface State {
  users: UserInfo[] | null;
  total: number;
}

export type UpdateUserPayload = {
  user: Omit<Partial<UserInfo>, 'id' | 'password' | 'api_token' | 'user_uuid'>;
  details: Omit<Partial<UserDetails>, 'id' | 'user_id' | 'uid'>;
};

export type AddUserPayload = {
  firstname: string;
  lastname: string;
  description?: string;
  email: string;
};

export const useUsersStore = defineStore('UsersStore', {
  state: (): State => ({
    users: null,
    total: 0,
  }),
  getters: {
    pageInfo(): ApiUserEndpoints {
      const base = String(process.env.API_URL ?? '#');
      return {
        STORE_LISTUSERS: (per_page: number = 10, page: number = 1) =>
          `${base}/users?${per_page ? `per_page=${per_page}` : ''}${page ? `&page=${page}` : ''}`,
        STORE_CREATEUSER: `${base}/users`,
        STORE_GETUSER: (userId: string) => `${base}/users/${userId}`,
        STORE_EDITUSER: (userId: string) => `${base}/users/${userId}`,
        STORE_DELETEUSER: (userId: string) => `${base}/users/${userId}`,
        STORE_RESETPASSWORD: (userId: string) => `${base}/users/${userId}/reset-password`,
      };
    },
  },

  actions: {
    async getUserList(per_page: number = 10, page: number = 1): Promise<UserInfo[] | null> {
      const response = axios.get<ServerResponse>(this.pageInfo.STORE_LISTUSERS(per_page, page));

      return response
        .then((res) => {
          const content = res.data?.body?.content?.data as UserInfo[] | undefined;
          const total = (res.data?.body?.content?.total) as number | undefined;
          this.users = content ?? null;
          this.total = total ?? 0;
          return this.users;
        })
        .catch((err) => {
          if (axios.isAxiosError(err)) throw err.response?.data ?? err;
          throw err;
        });
    },
    async getUserById(userId: string): Promise<UserType | null> {
      const response = axios.get<ServerResponse>(this.pageInfo.STORE_GETUSER(userId));

      return response
        .then((res) => {
          const content = res.data?.body?.content as UserType | undefined;
          return content ?? null;
        })
        .catch((err) => {
          if (axios.isAxiosError(err)) throw err.response?.data ?? err;
          throw err;
        });
    },
    async editUserById(userId: string, user: UpdateUserPayload): Promise<UpdateUserPayload | null> {
      const response = axios.post<ServerResponse>(this.pageInfo.STORE_EDITUSER(userId), user);

      return response
        .then((res) => {
          const content = res.data?.body?.content as UpdateUserPayload | undefined;
          return content ?? null;
        })
        .catch((err) => {
          if (axios.isAxiosError(err)) throw err.response?.data ?? err;
          throw err;
        });
    },
    async deleteUserById(userId: string): Promise<string | null> {
      const response = axios.delete<ServerResponse>(this.pageInfo.STORE_DELETEUSER(userId));

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
    async resetPasswordById(userId: string): Promise<string | null> {
      const response = axios.post<ServerResponse>(this.pageInfo.STORE_RESETPASSWORD(userId));

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
    async createUser(user: AddUserPayload): Promise<string | null> {
      const response = axios.put<ServerResponse>(this.pageInfo.STORE_CREATEUSER, user);

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
