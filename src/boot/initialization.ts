import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import type { Router, RouteRecordNormalized } from 'vue-router';
import { useAuthStore } from '@/modules/auth/stores/login';

export default ({ store, router }: { store: any; router: Router }) => {
  const setAuthorization = (
    token: string | null | undefined,
    refreshToken: string | null | undefined,
    apiToken: string | null | undefined,
  ): void => {
    const headers = axios.defaults.headers.common;
    if (token) headers.Authorization = `Bearer ${token}`;
    else delete headers.Authorization;
    if (refreshToken) headers['X-Refresh-Token'] = refreshToken;
    else delete headers['X-Refresh-Token'];
    if (apiToken) headers['X-Api-Token'] = apiToken;
    else delete headers['X-Api-Token'];
  };

  router.beforeEach(async (to) => {
    const auth = useAuthStore(store);
    const authGuarded = to.matched.some((record: RouteRecordNormalized) =>
      Boolean(record.meta?.authGuarded),
    );

    if (authGuarded && !auth.getToken && auth.getRefreshToken) {
      try {
        await auth.refreshToken();
      } catch {
        auth.clearSession();
      }
    }

    setAuthorization(auth.getToken, auth.getRefreshToken, auth.apiToken);
    if (authGuarded && !auth.getToken) return { name: 'LoginPage', query: { redirect: to.fullPath } };
    if (to.name === 'LoginPage' && auth.getToken) return { name: 'IndexPage' };
    return true;
  });

  let refreshPromise: Promise<string | null> | null = null;
  type RetryableRequestConfig = InternalAxiosRequestConfig & { _authRetry?: boolean };

  axios.interceptors.response.use(null, async (error: unknown) => {
    if (!axios.isAxiosError(error) || error.response?.status !== 401) {
      return Promise.reject(error);
    }

    const auth = useAuthStore(store);
    const request = error.config as RetryableRequestConfig | undefined;
    if (request?._authRetry) {
      auth.clearSession();
      setAuthorization(null, null, null);
      if (router.currentRoute.value.name !== 'LoginPage') await router.push('/login');
      return Promise.reject(error);
    }
    if (
      !request ||
      request.url === auth.pageInfo.STORE_REFRESHTOKEN ||
      request.url === auth.pageInfo.STORE_LOGIN
    ) {
      return Promise.reject(error);
    }

    request._authRetry = true;

    const hasNewToken =
      auth.getToken && request.headers.get('Authorization') !== `Bearer ${auth.getToken}`;

    if (!refreshPromise && !hasNewToken) {
      refreshPromise = auth
        .refreshToken()
        .then((token) => {
          if (!token) throw new Error('Nessun token di accesso ricevuto dal refresh');
          setAuthorization(token, auth.getRefreshToken, auth.apiToken);
          return token;
        })
        .catch(async (refreshError: unknown) => {
          auth.clearSession();
          setAuthorization(null, null, null);
          if (router.currentRoute.value.name !== 'LoginPage') await router.push('/login');
          throw refreshError;
        })
        .finally(() => {
          refreshPromise = null;
        });
    }

    await refreshPromise;

    request.headers.set('Authorization', `Bearer ${auth.getToken}`);
    if (auth.getRefreshToken) {
      request.headers.set('X-Refresh-Token', auth.getRefreshToken);
    } else {
      request.headers.delete('X-Refresh-Token');
    }
    if (auth.apiToken) {
      request.headers.set('X-Api-Token', auth.apiToken);
    } else {
      request.headers.delete('X-Api-Token');
    }

    return axios.request(request);
  });
};
