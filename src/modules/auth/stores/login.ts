import { defineStore } from 'pinia';
import axios from 'axios';
import type { ApiAuthEndpoints } from '../interfaces/endpoints';
import type { UserType } from '../interfaces/user';
import type { ServerResponse } from 'src/interfaces/response';
import type { LoginPayload, SessionType } from '../interfaces/payloads';

interface State {
  currentUser: UserType | null;
  apiToken: string | null;
  activeSessions: SessionType[];
}

export const useAuthStore = defineStore('AuthStore', {
  state: (): State => ({
    currentUser: null,
    apiToken: null,
    activeSessions: [],
  }),
  persist: true,
  getters: {
    pageInfo(): ApiAuthEndpoints {
      const base = String(process.env.API_URL ?? '#');
      return {
        STORE_EXTRA_ME: base + '/users/me',
        STORE_LOGIN: base + '/auth/login',
        STORE_LOGOUT: base + '/auth/logout',
        STORE_REFRESHTOKEN: base + '/auth/refresh',
        STORE_CHANGEPASSWORD: base + '/auth/password',
        STORE_REVOKEOTHERSESSIONS: base + '/auth/sessions/revoke',
        STORE_GETACTIVESSESSIONS: base + '/auth/sessions',
      };
    },
    getToken: (state): string | undefined => state.currentUser?.authorization.access_token,
    getRefreshToken: (state): string | undefined => state.currentUser?.authorization.refresh_token,
    isLoggedIn: (state): boolean => Boolean(state.currentUser?.authorization.access_token),
  },

  actions: {
    async refreshCurrentUser(): Promise<UserType | null> {
      const response = axios.get<ServerResponse>(this.pageInfo.STORE_EXTRA_ME);

      return response
        .then((res) => {
          const content = res.data?.body?.content as UserType | undefined;
          if (content) this.currentUser = content;
          return this.currentUser;
        })
        .catch((err) => {
          if (axios.isAxiosError(err)) throw err.response?.data ?? err;
          throw err;
        });
    },
    async login(data: LoginPayload): Promise<string | null> {
      const response = axios.post<ServerResponse>(this.pageInfo.STORE_LOGIN, data);

      return response
        .then((res) => {
          const content = res.data?.body?.content as UserType | undefined;
          if (content) this.currentUser = content;
          return content?.authorization.access_token ?? null;
        })
        .catch((err) => {
          if (axios.isAxiosError(err)) throw err.response?.data ?? err;
          throw err;
        });
    },
    async refreshToken(): Promise<string | null> {
      const refreshToken = this.getRefreshToken;
      if (!refreshToken) throw new Error('Nessun token di refresh disponibile');

      const response = axios.post<ServerResponse>(this.pageInfo.STORE_REFRESHTOKEN);

      return response
        .then((res) => {
          const content = res.data?.body?.content as Omit<UserType, 'user' | 'details'>;
          if (content && this.currentUser) {
            this.currentUser.authorization.access_token = content.authorization.access_token;
            this.currentUser.authorization.refresh_token = content.authorization.refresh_token;
          }
          return content?.authorization.access_token ?? null;
        })
        .catch((err) => {
          if (axios.isAxiosError(err)) throw err.response?.data ?? err;
          throw err;
        });
    },
    async changePassword(
      currentPassword: string,
      newPassword: string,
      confirmPassword: string,
    ): Promise<void> {
      await axios
        .post<ServerResponse>(this.pageInfo.STORE_CHANGEPASSWORD, {
          old_password: currentPassword,
          password: newPassword,
          password_confirmation: confirmPassword,
        })
        .catch((err) => {
          if (axios.isAxiosError(err)) throw err.response?.data ?? err;
          throw err;
        });
    },
    async getActiveSessions(): Promise<SessionType[]> {
      const response = axios.get<ServerResponse>(this.pageInfo.STORE_GETACTIVESSESSIONS);

      return response
        .then((res) => {
          const content = res.data?.body?.content as SessionType[] | undefined;
          this.activeSessions = content ?? [];
          return this.activeSessions;
        })
        .catch((err) => {
          if (axios.isAxiosError(err)) throw err.response?.data ?? err;
          throw err;
        });
    },
    async revokeAllSessions(): Promise<void> {
      const response = axios.post<ServerResponse>(this.pageInfo.STORE_REVOKEOTHERSESSIONS);

      return response
        .then(() => {
          this.activeSessions = [];
        })
        .catch((err) => {
          if (axios.isAxiosError(err)) throw err.response?.data ?? err;
          throw err;
        });
    },
    async logout(): Promise<void> {
      const response = axios.post<ServerResponse>(this.pageInfo.STORE_LOGOUT);
      return response
        .then((res) => {
          if (res.status === 200) {
            this.currentUser = null;
          }
        })
        .catch((err) => {
          if (axios.isAxiosError(err)) throw err.response?.data ?? err;
          throw err;
        });
    },
    setApiToken(token: string): void {
      if (!this.currentUser) throw new Error('Nessun utente attivo');

      this.apiToken = token;
    },
  },
});
