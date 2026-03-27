<template>
  <div class="max-w-7xl mx-auto bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-2xl">
    <div v-if="isLoaded" class="mx-auto select-none">
      <user-details />
      <div class="bg-white/10 backdrop-blur-md overflow-hidden rounded-2xl animate-slide-up">
        <!-- Desktop View -->
        <div class="hidden md:!block overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                <th class="px-6 py-4 text-left font-bold">Email</th>
                <th class="px-6 py-4 text-left font-bold">Ruolo</th>
                <th class="px-6 py-4 text-left font-bold">Azioni</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(user, index) in currentUsers" :key="user.id"
                class="border-b border-purple-300/30 hover:bg-purple-500/20 transition-all duration-300 group"
                :style="{ animationDelay: `${index * 50}ms` }">
                <td class="px-6 py-4">
                  <input readonly v-model="user.email" type="email"
                    class="w-full px-3 py-2 bg-white/80 border-2 border-purple-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition" />
                </td>
                <td class="px-6 py-4">
                  <select v-model="user.role" :disabled="user.id === authStore.currentUser?.user.id"
                    class="w-full px-3 py-2 bg-white/80 border-2 border-purple-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition">
                    <option v-for="(v, k) in roles" :value="k" :key="k">{{ v }}</option>
                  </select>
                </td>
                <td class="px-6 py-4 space-x-2 space-y-2">
                  <q-btn :disabled="isEditButtonDisabled || user.id === authStore.currentUser?.user.id"
                    @click="editUserDetails(user.id)" icon="edit"
                    class="px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transform hover:scale-105 transition-all" />
                  <q-btn :disabled="isSaveButtonDisabled || user.id === authStore.currentUser?.user.id"
                    @click="saveUser(user.id, user)" icon="save"
                    class="px-3 py-2 !mt-0 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-green-500/50 transform hover:scale-105 transition-all" />
                  <q-btn :disabled="isDeleteButtonDisabled || user.id === authStore.currentUser?.user.id"
                    @click="deleteUser(user.id)" icon="delete"
                    class="px-3 py-2 !mt-0 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-red-500/50 transform hover:scale-105 transition-all" />
                  <q-btn :disabled="isResetPasswordButtonDisabled || user.id === authStore.currentUser?.user.id"
                    @click="resetPassword(user.id)" icon="lock_reset"
                    class="px-3 py-2 !mt-0 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-yellow-500/50 transform hover:scale-105 transition-all" />
                </td>
              </tr>
            </tbody>
          </table>
          <div class="flex justify-between items-center px-6 py-4 bg-white/5 border-t border-purple-300/30">
            <div class="text-sm text-purple-700">
              Mostrando {{ startIndex() + 1 }} - {{ Math.min(endIndex(), totalUsers) }} di
              {{ totalUsers }}
              utenti
            </div>
            <div class="flex gap-2">
              <q-btn @click="previousPage" :disabled="currentPage === 1" icon="chevron_left"
                class="px-4 py-2 bg-purple-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-600 transition" />
              <div class="flex items-center gap-2">
                <span class="text-sm text-purple-700">Pagina {{ currentPage }} di {{ totalPages() }}</span>
              </div>
              <q-btn @click="nextPage" :disabled="currentPage === totalPages()" icon="chevron_right"
                class="px-4 py-2 bg-purple-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-600 transition" />
            </div>
          </div>
        </div>

        <!-- Mobile View -->
        <div class="md:hidden space-y-4 p-4">
          <div v-for="(user, index) in currentUsers" :key="user.id"
            class="rounded-xl p-4 space-y-3 hover:bg-purple-500/30 transition-all"
            :style="{ animationDelay: `${index * 50}ms` }">
            <div>
              <label class="block text-xs font-bold text-purple-800 mb-1">Email</label>
              <input readonly v-model="user.email" type="email"
                class="w-full px-3 py-2 bg-white/80 border-2 border-purple-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="block text-xs font-bold text-purple-800 mb-1">Ruolo</label>
                <select v-model="user.role" :disabled="user.id === authStore.currentUser?.user.id"
                  class="w-full px-3 py-2 bg-white/80 border-2 border-purple-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option v-for="(v, k) in roles" :value="k" :key="k">{{ v }}</option>
                </select>
              </div>
            </div>
            <div class="flex gap-2">
              <q-btn :disabled="isEditButtonDisabled || user.id === authStore.currentUser?.user.id"
                @click="editUserDetails(user.id)" icon="edit"
                class="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all" />
              <q-btn :disabled="isSaveButtonDisabled || user.id === authStore.currentUser?.user.id"
                @click="saveUser(user.id, user)" icon="save"
                class="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-green-500/50 transition-all" />
              <q-btn :disabled="isDeleteButtonDisabled || user.id === authStore.currentUser?.user.id"
                @click="deleteUser(user.id)" icon="delete"
                class="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-red-500/50 transition-all" />
              <q-btn :disabled="isResetPasswordButtonDisabled || user.id === authStore.currentUser?.user.id"
                @click="resetPassword(user.id)" icon="lock_reset"
                class="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-yellow-500/50 transition-all" />
            </div>
          </div>
          <div class="flex flex-col gap-3 mt-4">
            <div class="text-sm font-light text-purple-700 text-center">
              Mostrando {{ startIndex() + 1 }} - {{ Math.min(endIndex(), totalUsers) }} di
              {{ totalUsers }}
              utenti
            </div>
            <div class="flex gap-2">
              <q-btn @click="previousPage" :disabled="currentPage === 1" icon="chevron_left"
                class="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-600 transition" />
              <div class="flex-1 flex items-center justify-center text-sm font-light text-purple-700">
                Pagina {{ currentPage }} di {{ totalPages() }}
              </div>
              <q-btn @click="nextPage" :disabled="currentPage === totalPages()" icon="chevron_right"
                class="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-600 transition" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="flex justify-center items-center h-64">
      <q-spinner-dots size="48px" color="purple" />
    </div>
  </div>
</template>

<script setup lang="ts" name="UsersList">
import { roles } from 'src/helpers/roles';
import type { UpdateUserPayload } from '../../stores/users';
import { inject, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import type { EventBus } from 'quasar';
import { handleStatus } from 'src/helpers/errors';
import type { UserInfo } from 'src/modules/auth/interfaces/user';
import UserDetails from './UserDetails.vue';
import type { Globals } from 'src/interfaces/globals';

const globals = inject('globals') as Globals;
const usersStore = globals.stores.users;
const authStore = globals.stores.auth;
const bus = inject<EventBus>('bus');

const isSaveButtonDisabled = ref(false);
const isDeleteButtonDisabled = ref(false);
const isEditButtonDisabled = ref(false);
const isResetPasswordButtonDisabled = ref(false);
const isLoaded = ref(false);

const currentUsers = ref<UserInfo[]>([]);
const currentPage = ref(1);
const itemsPerPage = ref(10);
const totalUsers = ref(0);

onMounted(() => {
  bus?.on('toggle:loading', (users: UserInfo[]) => {
    totalUsers.value = usersStore.total;
    isLoaded.value = true;
    currentUsers.value = users || [];
  });

  onUserLoad(itemsPerPage.value, currentPage.value)
    .then((users) => {
      bus?.emit('toggle:loading', users || []);
    })
    .catch((error) => {
      handleStatus(error, bus!);
    });
});

onBeforeUnmount(() => {
  bus?.off('toggle:loading');
});

watch(currentPage, (n, o) => {
  if (n === o) return;

  isLoaded.value = false;
  onUserLoad(itemsPerPage.value, currentPage.value)
    .then((users) => {
      bus?.emit('toggle:loading', users || []);
    })
    .catch((error) => {
      handleStatus(error, bus!);
    });
});

const onUserLoad = async (per_page?: number, page?: number) => {
  return await usersStore.getUserList(per_page, page).catch((error) => {
    handleStatus(error, bus!);
    return null;
  });
};

const saveUser = (userId: string, user: UserInfo) => {
  isSaveButtonDisabled.value = true;
  const userInfo = <UpdateUserPayload>{
    user: {
      ...user,
    },
    details: {},
  };
  usersStore
    .editUserById(userId, userInfo)
    .then(() => {
      bus?.emit('success:general', { title: 'Utente modificato correttamente!', button: 'Chiudi' });
    })
    .catch((error) => {
      handleStatus(error, bus!);
    })
    .finally(() => {
      isSaveButtonDisabled.value = false;
    });
};

const deleteUser = (userId: string) => {
  isDeleteButtonDisabled.value = true;
  usersStore
    .deleteUserById(userId)
    .then(() => {
      bus?.emit('success:general', { title: 'Utente eliminato correttamente!', button: 'Chiudi' });
      bus?.emit('refresh:userList');
    })
    .catch((error) => {
      handleStatus(error, bus!);
    })
    .finally(() => {
      setTimeout(() => {
        isDeleteButtonDisabled.value = false;
      }, 500);
    });
};

const resetPassword = (userId: string) => {
  isResetPasswordButtonDisabled.value = true;
  usersStore
    .resetPasswordById(userId)
    .then((response: string | null) => {
      bus?.emit('success:general', {
        title: 'Password reimpostata correttamente!',
        button: 'Chiudi',
      });
      alert('La nuova password è: ' + response);
    })
    .catch((error) => {
      handleStatus(error, bus!);
    })
    .finally(() => {
      isResetPasswordButtonDisabled.value = false;
    });
};

const editUserDetails = (userId: string) => {
  isEditButtonDisabled.value = true;
  bus?.emit('open:editProfile', {
    userId,
    onClose: () => {
      isEditButtonDisabled.value = false;
    },
  });
};

const totalPages = () => Math.ceil(totalUsers.value / itemsPerPage.value);
const startIndex = () => (currentPage.value - 1) * itemsPerPage.value;
const endIndex = () => startIndex() + itemsPerPage.value;

const nextPage = () => {
  if (currentPage.value < totalPages()) {
    currentPage.value++;
  }
};

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};
</script>
