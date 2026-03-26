import axios from 'axios';
import type {
  Router,
  NavigationGuardNext,
  RouteLocationNormalized,
  RouteRecordNormalized,
} from 'vue-router';
import { useAuthStore } from 'src/modules/auth/stores/login';

export default ({ store, router }: { store: any; router: Router }) => {
  const setAuthorization = (
    token: string | null | undefined,
    refreshToken: string | null | undefined,
    apiToken: string | null | undefined,
  ): void => {
    if (token || apiToken) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      axios.defaults.headers.common['X-Refresh-Token'] = `${refreshToken}`;
      axios.defaults.headers.common['X-Api-Token'] = `${apiToken}`;
    } else {
      delete axios.defaults.headers.common.Authorization;
      delete axios.defaults.headers.common['X-Refresh-Token'];
      delete axios.defaults.headers.common['X-Api-Token'];
    }
  };

  router.beforeEach(
    (
      to: RouteLocationNormalized,
      _from: RouteLocationNormalized,
      next: NavigationGuardNext,
    ) => {
      const authGuarded = to.matched.some((record: RouteRecordNormalized) =>
        Boolean(record.meta?.authGuarded),
      );

      const currentToken = useAuthStore(store).getToken;
      const currentRefreshToken = useAuthStore(store).getRefreshToken;
      const currentApiToken = useAuthStore(store).apiToken;
      if (currentToken) {
        setAuthorization(currentToken, currentRefreshToken, currentApiToken);
      }

      if (authGuarded && !currentToken) {
        next('/login');
      } else {
        next();
      }
    },
  );

  axios.interceptors.response.use(null, async (error: any) => {
    if (error?.response?.status === 401) {
      await router.push('/login');
    }

    return Promise.reject(error);
  });
};
