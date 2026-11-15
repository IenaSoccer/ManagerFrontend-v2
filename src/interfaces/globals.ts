import type { useAuthStore } from '@/modules/auth/stores/login';
import type { useAttachmentsStore } from '@/modules/dashboard/stores/attachments';
import type { useFoldersStore } from '@/modules/dashboard/stores/folders';
import type { useResourcesStore } from '@/modules/dashboard/stores/resources';
import type { useUsersStore } from '@/modules/dashboard/stores/users';
import type { Ref } from 'vue';
import type { NavLink } from './navbar';
import type { useAccountStore } from '@/modules/dashboard/stores/account';
import type { useMappingsStore } from '@/modules/dashboard/stores/mappings';
import type { useTokenStore } from '@/modules/dashboard/stores/token';
import type { useMetricsStore } from '@/modules/dashboard/stores/metrics';

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
