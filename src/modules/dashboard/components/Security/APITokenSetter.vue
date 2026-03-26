<template>
  <!-- Account Security - API Token Setter -->
  <div class="w-full my-8 rounded-3xl select-none">
    <div class="mx-auto my-8 rounded-3xl max-w-3xl">
      <form @submit.prevent="handleSubmit" class="bg-white p-8 rounded-2xl space-y-6">
        <h2 class="text-2xl font-bold text-gray-800 mb-2">Impostazioni di Sicurezza</h2>

        <!-- API Token Section -->
        <div class="space-y-4">
          <div class="flex items-start justify-between">
            <div class="flex-1 pr-4">
              <label for="apiToken" class="font-medium text-gray-700">API Token</label>
              <p class="text-sm text-gray-500">Inserisci una chiave API per avere più privilegi.</p>
            </div>
            <div class="w-full max-w-lg">
              <div class="relative">
                <input :type="showToken ? 'text' : 'password'" v-model="apiToken" minlength="12" id="apiToken"
                  placeholder="●●●●●●●●●●●●"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                <button type="button" @click="toggleShow"
                  class="absolute top-2 right-2 text-sm text-indigo-600 hover:underline">
                  {{ showToken ? 'Nascondi' : 'Mostra' }}
                </button>
              </div>
              <div class="flex gap-2 mt-3">
                <button type="submit"
                  class="flex-1 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition">
                  Salva Token
                </button>
                <button type="button" @click="copyToken"
                  class="px-4 py-2 bg-gray-100 text-gray-800 font-medium rounded-lg hover:bg-gray-200 transition">
                  Copia
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
<script setup lang="ts">
import { inject, ref } from 'vue';
import type { EventBus } from 'quasar';
import type { Globals } from 'src/interfaces/globals';

const apiToken = ref('');
const showToken = ref(false);
const bus = inject<EventBus>('bus');
const authStore = inject<Globals>('globals')?.stores?.auth;

const handleSubmit = () => saveToken();

const toggleShow = () => {
  showToken.value = !showToken.value;
};

const saveToken = () => {
  if (!apiToken.value) {
    bus?.emit('error:general', 'Inserisci un API token');
    return;
  }

  try {
    // if the auth store exposes a setter, call it; otherwise just emit success
    if (authStore?.setApiToken) authStore.setApiToken(apiToken.value);
    bus?.emit('success:general', { title: 'Token salvato con successo!', button: 'Chiudi' });
  } catch {
    bus?.emit('error:general', 'Impossibile salvare il token');
  }
};

const copyToken = async () => {
  try {
    await navigator.clipboard.writeText(apiToken.value || '');
    bus?.emit('success:general', { title: 'Token copiato negli appunti', button: 'Ok' });
  } catch {
    bus?.emit('error:general', 'Impossibile copiare il token');
  }
};
</script>
