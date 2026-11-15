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

const AUTH_STORAGE_KEY = 'iena-auth';

const readPersistedAuth = (): Pick<State, 'currentUser' | 'apiToken'> => {
  if (typeof window === 'undefined') return { currentUser: null, apiToken: null };
  const localSerialized = localStorage.getItem(AUTH_STORAGE_KEY) ?? localStorage.getItem('AuthStore');
  const sessionSerialized = sessionStorage.getItem(AUTH_STORAGE_KEY) ?? sessionStorage.getItem('AuthStore');
  const serialized = localSerialized ?? sessionSerialized;
  if (!serialized) return { currentUser: null, apiToken: null };

  try {
    const parsed = JSON.parse(serialized) as Partial<State>;
    const normalized = {
      currentUser: parsed.currentUser ?? null,
      apiToken: parsed.apiToken ?? null,
    };
    if (!localStorage.getItem(AUTH_STORAGE_KEY) && !sessionStorage.getItem(AUTH_STORAGE_KEY)) {
      (localSerialized ? localStorage : sessionStorage).setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify(normalized),
      );
    }
    localStorage.removeItem('AuthStore');
    sessionStorage.removeItem('AuthStore');
    return normalized;
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    return { currentUser: null, apiToken: null };
  }
};

export const useAuthStore = defineStore('AuthStore', {
  state: (): State => ({
    ...readPersistedAuth(),
    activeSessions: [],
  }),
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
    persistSession(remember?: boolean): void {
      if (typeof window === 'undefined') return;
      const shouldRemember = remember ?? localStorage.getItem(AUTH_STORAGE_KEY) !== null;
      const storage = shouldRemember ? localStorage : sessionStorage;
      const otherStorage = shouldRemember ? sessionStorage : localStorage;
      storage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({ currentUser: this.currentUser, apiToken: this.apiToken }),
      );
      otherStorage.removeItem(AUTH_STORAGE_KEY);
    },
    clearSession(): void {
      this.currentUser = null;
      this.apiToken = null;
      this.activeSessions = [];
      if (typeof window !== 'undefined') {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        sessionStorage.removeItem(AUTH_STORAGE_KEY);
        localStorage.removeItem('AuthStore');
        sessionStorage.removeItem('AuthStore');
      }
    },
    async refreshCurrentUser(): Promise<UserType | null> {
      const response = axios.get<ServerResponse>(this.pageInfo.STORE_EXTRA_ME);

      return response
        .then((res) => {
          const content = res.data?.body?.content as UserType | undefined;
          if (content) {
            this.currentUser = content;
            this.persistSession();
          }
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
          if (content) {
            this.currentUser = content;
            this.persistSession(Boolean(data.remember_me));
          }
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
          this.persistSession();
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
      try {
        await axios.post<ServerResponse>(this.pageInfo.STORE_LOGOUT);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status !== 401) {
          throw err.response?.data ?? err;
        }
      } finally {
        this.clearSession();
      }
    },
    setApiToken(token: string): void {
      if (!this.currentUser) throw new Error('Nessun utente attivo');

      this.apiToken = token;
      this.persistSession();
    },
  },
});
