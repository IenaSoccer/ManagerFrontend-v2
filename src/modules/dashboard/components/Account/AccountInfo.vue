<template>
  <div
    v-if="!isLoading && account"
    class="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 max-w-3xl mx-auto"
  >
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-lg font-bold text-gray-800">Profilo</h2>
      <div class="flex items-center gap-2">
        <button
          @click="toggleEditMode"
          class="p-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition"
          :title="isEditing ? 'Annulla' : 'Modifica'"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              v-if="!isEditing"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
            <path
              v-else
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <button
          @click="logout"
          :disabled="isLogoutButtonDisabled"
          class="p-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition disabled:opacity-50"
          title="Logout"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </button>
      </div>
    </div>

    <div class="flex items-center gap-6 mb-8">
      <div class="flex flex-col items-center">
        <img
          :src="computedThumbnail"
          alt="Avatar"
          class="w-20 h-20 rounded-full border-4 border-indigo-200 object-cover"
        />
        <label class="mt-2 text-xs text-indigo-600 font-normal cursor-pointer">
          Cambia immagine
          <input type="file" accept="image/png,image/jpeg" class="hidden" @change="onImageChange" />
        </label>
      </div>
      <div class="select-none">
        <h3 class="text-xl font-bold text-gray-800">
          {{ account.details.firstname }} {{ account.details.lastname }}
        </h3>
        <p class="text-sm text-indigo-600 font-semibold">{{ roles[account.user.role] }}</p>
      </div>
    </div>

    <div v-if="!isEditing" class="space-y-3 font-light select-none">
      <div class="text-sm">
        <span class="font-semibold text-gray-700">Nome:</span> {{ account.details.firstname }}
      </div>
      <div class="text-sm">
        <span class="font-semibold text-gray-700">Cognome:</span> {{ account.details.lastname }}
      </div>
      <div class="text-sm">
        <span class="font-semibold text-gray-700">Email:</span> {{ account.user.email }}
      </div>
      <div class="text-sm">
        <span class="font-semibold text-gray-700">Descrizione:</span>
        {{ account.details.description }}
      </div>
      <div class="text-sm">
        <span class="font-semibold text-gray-700">Compleanno:</span> {{ computedBirthday }}
      </div>
    </div>

    <div v-else class="space-y-4">
      <input
        v-model="account.details.firstname"
        type="text"
        placeholder="First Name"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg"
      />
      <input
        v-model="account.details.lastname"
        type="text"
        placeholder="Last Name"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg"
      />
      <textarea
        v-model="account.details.description"
        placeholder="Description"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg"
      ></textarea>
      <input
        v-model="account.details.birthday"
        type="date"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg"
      />
      <button
        @click="saveChanges"
        class="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition"
      >
        Salva
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { roles } from 'src/helpers/roles';
import type { UserType } from 'src/modules/auth/interfaces/user';
import { computed, inject, onBeforeUnmount, onMounted, ref } from 'vue';
import { type EventBus } from 'quasar';
import { handleStatus } from 'src/helpers/errors';
import { useRouter } from 'vue-router';
import type { Globals } from 'src/interfaces/globals';
import type { ServerResponse, ValidationError } from 'src/interfaces/response';

const globals = inject('globals') as Globals;
const accountStore = globals.stores.account;
const authStore = globals.stores.auth;

const bus = inject<EventBus>('bus');
const isEditing = ref(false);
const account = ref<UserType | null>({} as UserType);
const router = useRouter();
const isLogoutButtonDisabled = ref(false);
const isLoading = ref(true);

const computedBirthday = computed(() => {
  if (!account.value?.details.birthday) return 'N/A';
  const date = new Date(account.value.details.birthday);
  return date.toLocaleDateString();
});
const computedThumbnail = computed(() => {
  const baseURL = String(process.env.ATTACHMENTS_URL ?? '');
  return account.value?.details.thumbnail
    ? `${baseURL}/${account.value.details.thumbnail}`
    : '/src/assets/avatar.png';
});

const fetchAccountInfo = () => {
  isLoading.value = true;

  accountStore
    .getUserInfo()
    .then(() => {
      account.value!.user = accountStore.myUser!.user;
      account.value!.details = accountStore.myUser!.details;
      isLoading.value = false;
    })
    .catch((error: ServerResponse) => {
      handleStatus(error, bus!);
    });
};

const toggleEditMode = () => {
  isEditing.value = !isEditing.value;
};
const saveChanges = () => {
  accountStore
    .updateUserInfo({
      firstname: account.value!.details.firstname,
      lastname: account.value!.details.lastname,
      description: account.value!.details.description,
      birthday: account.value!.details.birthday,
    })
    .then(() => {
      isEditing.value = false;

      bus?.emit('success:general', {
        title: 'Profilo modificato correttamente!',
        button: 'Chiudi',
      });
      bus?.emit('refresh:accountInfo');
    })
    .catch((error: ServerResponse | ValidationError) => {
      handleStatus(error, bus!);
    });

  isEditing.value = false;
};

const onImageChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];

    accountStore
      .updateThumbnail(file)
      .then(() => {
        bus?.emit('success:general', {
          title: 'Immagine del profilo aggiornata con successo!',
          button: 'Chiudi',
        });
        bus?.emit('refresh:accountInfo');
      })
      .catch((error: ServerResponse | ValidationError) => {
        handleStatus(error, bus!);
      });
  }
};

const logout = () => {
  isLogoutButtonDisabled.value = true;
  authStore
    .logout()
    .then(async () => {
      await router.push({ name: 'LoginPage' });
      bus?.emit('success:general', { title: 'Logout effettuato con successo!', button: 'Chiudi' });
    })
    .catch((error: ServerResponse) => {
      handleStatus(error, bus!);
    });
};

onMounted(() => {
  fetchAccountInfo();
  bus?.on('refresh:accountInfo', fetchAccountInfo);
});

onBeforeUnmount(() => {
  bus?.off('refresh:accountInfo');
});
</script>
