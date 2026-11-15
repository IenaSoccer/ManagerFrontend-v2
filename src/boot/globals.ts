import { ref } from 'vue';
import type { NavLink } from '../interfaces/navbar';
import { useUsersStore } from '@/modules/dashboard/stores/users';
import { useFoldersStore } from '@/modules/dashboard/stores/folders';
import { useResourcesStore } from '@/modules/dashboard/stores/resources';
import { useAuthStore } from '@/modules/auth/stores/login';
import { useAttachmentsStore } from '@/modules/dashboard/stores/attachments';
import { defineBoot } from '#q-app';
import type { App } from 'vue';
import { useAccountStore } from '@/modules/dashboard/stores/account';
import { useTokenStore } from '@/modules/dashboard/stores/token';
import { useMappingsStore } from '@/modules/dashboard/stores/mappings';
import { useMetricsStore } from '@/modules/dashboard/stores/metrics';

export default defineBoot(({ app }: { app: App }) => {
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
      API_URL: String(import.meta.env.QCLI_API_URL ?? '#'),
      MEDIA_URL: String(import.meta.env.QCLI_MEDIA_URL ?? '#'),
      ATTACHMENTS_URL: String(import.meta.env.QCLI_ATTACHMENTS_URL ?? '#'),
      HOMEPAGE_URL: String(import.meta.env.QCLI_HOMEPAGE_URL ?? '#'),
    },
    linkList: [] as NavLink[],
    dirty: ref(false),
  };

  // for Composition API
  app.provide('globals', globals);
});
