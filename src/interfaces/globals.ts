import type { useAuthStore } from 'src/modules/auth/stores/login';
import type { useAttachmentsStore } from 'src/modules/dashboard/stores/attachments';
import type { useFoldersStore } from 'src/modules/dashboard/stores/folders';
import type { useResourcesStore } from 'src/modules/dashboard/stores/resources';
import type { useUsersStore } from 'src/modules/dashboard/stores/users';
import type { Ref } from 'vue';
import type { NavLink } from './navbar';
import type { useAccountStore } from 'src/modules/dashboard/stores/account';
import type { useMappingsStore } from 'src/modules/dashboard/stores/mappings';
import type { useTokenStore } from 'src/modules/dashboard/stores/token';
import type { useMetricsStore } from 'src/modules/dashboard/stores/metrics';

export interface Globals {
  linkList: NavLink[];
  stores: {
    users: ReturnType<typeof useUsersStore>;
    folders: ReturnType<typeof useFoldersStore>;
    resources: ReturnType<typeof useResourcesStore>;
    auth: ReturnType<typeof useAuthStore>;
    attachments: ReturnType<typeof useAttachmentsStore>;
    account: ReturnType<typeof useAccountStore>;
    mappings: ReturnType<typeof useMappingsStore>;
    token: ReturnType<typeof useTokenStore>;
    metrics: ReturnType<typeof useMetricsStore>;
  };
  dirty: Ref<boolean>;
  endpoints: {
    API_URL: string;
    MEDIA_URL: string;
    ATTACHMENTS_URL: string;
    HOMEPAGE_URL: string;
  };
}
