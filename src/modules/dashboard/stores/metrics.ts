import { defineStore } from 'pinia';
import axios from 'axios';
import type { ApiMetricsEndpoints } from '../interfaces/endpoints';
import type { Metrics } from '../interfaces/metrics';
interface State {
  metrics: Metrics | null;
}

export const useMetricsStore = defineStore('MetricsStore', {
  state: (): State => ({
    metrics: null,
  }),
  getters: {
    pageInfo(): ApiMetricsEndpoints {
      const base = String(process.env.API_URL ?? '#');
      return {
        STORE_GETRESOURCESMETRICS: base + '/metrics/resources',
        STORE_GETFOLDERSMETRICS: `${base}/metrics/folders`,
        STORE_GETUSERSMETRICS: `${base}/metrics/users`,
        STORE_GETPOSTMETRICS: `${base}/metrics/posts`,
      };
    },
  },

  actions: {
    async fetchResourcesMetrics(): Promise<Omit<Metrics, 'folders' | 'users' | 'posts'> | null> {
      const response = axios.get(this.pageInfo.STORE_GETRESOURCESMETRICS);

      return response
        .then((res) => {
          const content = res.data?.body?.content as
            | Omit<Metrics, 'folders' | 'users' | 'posts'>
            | undefined;
          if (!this.metrics) this.metrics = {} as Metrics;

          this.metrics.resources = content?.resources ?? null;
          return this.metrics;
        })
        .catch((err) => {
          if (axios.isAxiosError(err)) throw err.response?.data ?? err;
          throw err;
        });
    },
    async fetchUsersMetrics(): Promise<Omit<Metrics, 'resources' | 'folders' | 'posts'> | null> {
      const response = axios.get(this.pageInfo.STORE_GETUSERSMETRICS);

      return response
        .then((res) => {
          const content = res.data?.body?.content as
            | Omit<Metrics, 'resources' | 'folders' | 'posts'>
            | undefined;
          if (!this.metrics) this.metrics = {} as Metrics;

          this.metrics.users = content?.users ?? null;
          return this.metrics;
        })
        .catch((err) => {
          if (axios.isAxiosError(err)) throw err.response?.data ?? err;
          throw err;
        });
    },
    async fetchPostsMetrics(): Promise<Omit<Metrics, 'resources' | 'folders' | 'users'> | null> {
      const response = axios.get(this.pageInfo.STORE_GETPOSTMETRICS);

      return response
        .then((res) => {
          const content = res.data?.body?.content as
            | Omit<Metrics, 'resources' | 'folders' | 'users'>
            | undefined;
          if (!this.metrics) this.metrics = {} as Metrics;

          this.metrics.posts = content?.posts ?? null;
          return this.metrics;
        })
        .catch((err) => {
          if (axios.isAxiosError(err)) throw err.response?.data ?? err;
          throw err;
        });
    },
  },
});
