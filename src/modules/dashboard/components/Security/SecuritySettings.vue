<template>
  <!-- Account Security Settings -->
  <div class="w-full my-8 rounded-3xl select-none">
    <div class="mx-auto my-8 rounded-3xl max-w-4xl">
      <form @submit.prevent="handleSubmit" class="bg-white p-8 rounded-2xl space-y-6">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Impostazioni di Sicurezza</h2>

        <!-- Two-Factor Authentication Toggle -->
        <div
          class="flex items-center justify-between animate-fade-in [animation-delay:0.1s] [animation-fill-mode:forwards]"
        >
          <div>
            <label for="twoFactorAuth" class="font-medium text-gray-700"
              >Autenticazione a Due Fattori (2FA)</label
            >
            <p class="text-sm text-gray-500">
              Aggiungi un ulteriore livello di sicurezza al tuo account.
            </p>
          </div>
          <input
            disabled
            type="checkbox"
            id="twoFactorAuth"
            v-model="twoFactorAuthEnabled"
            class="w-6 h-6"
          />
        </div>
      </form>
      <!-- Password change form -->
      <form @submit.prevent="handlePasswordChange" class="bg-white p-8 rounded-2xl space-y-6 mt-6">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Cambia Password</h2>

        <div class="space-y-4">
          <div>
            <label for="currentPassword" class="block text-sm font-medium text-gray-700"
              >Password Attuale</label
            >
            <input
              type="password"
              v-model="oldPassword"
              id="currentPassword"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label for="newPassword" class="block text-sm font-medium text-gray-700"
              >Nuova Password</label
            >
            <input
              type="password"
              v-model="newPassword"
              id="newPassword"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label for="confirmNewPassword" class="block text-sm font-medium text-gray-700"
              >Conferma Nuova Password</label
            >
            <input
              type="password"
              v-model="confirmNewPassword"
              id="confirmNewPassword"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          class="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
        >
          Salva
        </button>
      </form>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { EventBus } from 'quasar';
import { handleStatus } from 'src/helpers/errors';
import type { Globals } from 'src/interfaces/globals';
import type { ServerResponse, ValidationError } from 'src/interfaces/response';
import { inject, ref } from 'vue';

const twoFactorAuthEnabled = ref(false);
const authStore = inject<Globals>('globals')?.stores.auth;
const oldPassword = ref('');
const newPassword = ref('');
const confirmNewPassword = ref('');
const bus = inject<EventBus>('bus');

const handleSubmit = () => {};

const handlePasswordChange = () => {
  if (newPassword.value !== confirmNewPassword.value) {
    bus?.emit('error:general', 'Le nuove password non corrispondono');
    return;
  }

  authStore
    ?.changePassword(oldPassword.value, newPassword.value, confirmNewPassword.value)
    .then(() => {
      bus?.emit('success:general', { title: 'Password cambiata con successo!', button: 'Chiudi' });
    })
    .catch((error: ServerResponse | ValidationError) => {
      handleStatus(error, bus!);
    });
};
</script>
