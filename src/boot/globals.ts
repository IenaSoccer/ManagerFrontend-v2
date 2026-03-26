import { ref } from 'vue';
import type { NavLink } from '../interfaces/navbar';
import { useUsersStore } from 'src/modules/dashboard/stores/users';
import { useFoldersStore } from 'src/modules/dashboard/stores/folders';
import { useResourcesStore } from 'src/modules/dashboard/stores/resources';
import { useAuthStore } from 'src/modules/auth/stores/login';
import { useAttachmentsStore } from 'src/modules/dashboard/stores/attachments';
import { boot } from 'quasar/wrappers';
import type { App } from 'vue';
import { useAccountStore } from 'src/modules/dashboard/stores/account';
import { useTokenStore } from 'src/modules/dashboard/stores/token';
import { useMappingsStore } from 'src/modules/dashboard/stores/mappings';
import { useMetricsStore } from 'src/modules/dashboard/stores/metrics';

export default boot(({ app }: { app: App }) => {
  const globals = {
    stores: {
      users: useUsersStore(),
      folders: useFoldersStore(),
      resources: useResourcesStore(),
      auth: useAuthStore(),
      attachments: useAttachmentsStore(),
      account: useAccountStore(),
      mappings: useMappingsStore(),
      token: useTokenStore(),
      metrics: useMetricsStore(),
    },
    endpoints: {
      API_URL: String(process.env.API_URL ?? '#'),
      MEDIA_URL: String(process.env.MEDIA_URL ?? '#'),
      ATTACHMENTS_URL: String(process.env.ATTACHMENTS_URL ?? '#'),
      HOMEPAGE_URL: String(process.env.HOMEPAGE_URL ?? '#'),
    },
    linkList: [] as NavLink[],
    dirty: ref(false),
  };

  // for Composition API
  app.provide('globals', globals);
});
