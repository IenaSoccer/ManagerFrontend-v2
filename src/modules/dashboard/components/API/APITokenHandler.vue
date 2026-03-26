<template>
  <!-- API Token Handler -->
  <div class="w-full my-8 flex justify-center">
    <div
      class="max-w-3xl w-full bg-gradient-to-br from-white to-slate-50 p-6 rounded-3xl shadow-lg"
    >
      <header class="flex items-start gap-4 mb-6">
        <div class="flex items-center justify-center w-14 h-14 rounded-xl bg-blue-50 text-blue-600">
          <q-icon name="vpn_key" />
        </div>
        <div>
          <h2 class="text-2xl font-semibold text-slate-800">Crea Token API</h2>
          <p class="text-sm text-slate-500">
            Assegna permessi e scadenza al token. Conserva il token generato in un posto sicuro.
          </p>
        </div>
      </header>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Name -->
        <div class="">
          <label for="apiTokenName" class="block text-sm font-medium text-slate-700 mb-2"
            >Nome Token API</label
          >
          <div class="relative">
            <input
              id="apiTokenName"
              v-model="apiTokenName"
              type="text"
              placeholder="Es: token-staff-1"
              class="w-full pl-4 pr-12 py-3 border rounded-xl bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
            />
            <div class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              <q-icon name="edit" />
            </div>
          </div>
        </div>

        <!-- Permissions -->
        <div class="">
          <label class="block text-sm font-medium text-slate-700 mb-2">Permessi</label>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <label
              v-for="(perm, index) in CAPABILITIES ?? []"
              :key="index"
              :class="[
                'cursor-pointer select-none px-3 py-2 rounded-lg border flex items-center gap-3 transition',
                isSelected(perm)
                  ? 'bg-blue-50 border-blue-300 text-blue-700 shadow-sm'
                  : 'bg-white border-gray-200 text-slate-700 hover:shadow-sm',
              ]"
            >
              <input type="checkbox" :value="perm" v-model="selectedPermissions" class="w-4 h-4" />
              <div class="text-sm">{{ perm }}</div>
            </label>
          </div>
          <p class="text-xs text-slate-400 mt-2">Seleziona i permessi necessari per il token.</p>
        </div>

        <!-- Expiry -->
        <div class="">
          <label class="block text-sm font-medium text-slate-700 mb-2">Scadenza Token</label>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <label class="inline-flex items-center gap-2 cursor-pointer">
              <input type="radio" value="never" v-model="expiryOption" />
              <span class="text-sm">Mai</span>
            </label>
            <label class="inline-flex items-center gap-2 cursor-pointer">
              <input type="radio" value="1" v-model="expiryOption" />
              <span class="text-sm">1 giorno</span>
            </label>
            <label class="inline-flex items-center gap-2 cursor-pointer">
              <input type="radio" value="7" v-model="expiryOption" />
              <span class="text-sm">7 giorni</span>
            </label>
            <label class="inline-flex items-center gap-2 cursor-pointer">
              <input type="radio" value="30" v-model="expiryOption" />
              <span class="text-sm">30 giorni</span>
            </label>
            <label class="inline-flex items-center gap-2 cursor-pointer">
              <input type="radio" value="custom" v-model="expiryOption" />
              <span class="text-sm">Personalizzata</span>
            </label>
          </div>

          <div v-if="expiryOption === 'custom'" class="mt-3">
            <input
              type="date"
              v-model="customExpiry"
              :min="minDatetime"
              class="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <p class="text-xs text-slate-400 mt-2">
            Scadenza selezionata: <span class="font-medium text-slate-600">{{ humanExpiry }}</span>
          </p>
        </div>

        <!-- Submit -->
        <div class="flex flex-col sm:flex-row items-stretch gap-3">
          <div class="sm:w-44">
            <button
              type="submit"
              :disabled="!canSubmit"
              :class="[
                'w-full py-3 rounded-xl text-white font-medium transition',
                canSubmit ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-300 cursor-not-allowed',
              ]"
            >
              Crea Token
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, inject } from 'vue';
import type { Capabilities } from '../../interfaces/token';
import type { UpdateTokenPayload } from 'src/modules/auth/interfaces/payloads';
import type { EventBus } from 'quasar';
import { handleStatus } from 'src/helpers/errors';
import type { Globals } from 'src/interfaces/globals';
import type { ServerResponse, ValidationError } from 'src/interfaces/response';

const apiTokenName = ref<string>('');
const selectedPermissions = ref<string[]>([]);
const expiryOption = ref<string>('30');
const customExpiry = ref<string>('');
const tokenStore = inject<Globals>('globals')?.stores.token;
const CAPABILITIES = ref<Capabilities | null>(null);
const bus = inject<EventBus>('bus');

onMounted(async () => {
  CAPABILITIES.value = await tokenStore!.listCapabilities().catch((error: ServerResponse) => {
    handleStatus(error, bus!);
    return null;
  });
});

// helpers
const isSelected = (id: string) => selectedPermissions.value.includes(id);

const computeExpiryIso = (): string | null => {
  if (expiryOption.value === 'never') return null;
  if (expiryOption.value === 'custom') {
    return customExpiry.value ? new Date(customExpiry.value).toISOString() : null;
  }
  const days = parseInt(expiryOption.value, 10);
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString();
};

const humanExpiry = computed(() => {
  if (expiryOption.value === 'never') return 'Mai';
  if (expiryOption.value === 'custom')
    return customExpiry.value ? new Date(customExpiry.value).toLocaleString() : 'Non impostata';
  const days = parseInt(expiryOption.value, 10);
  return `Tra ${days} giorn${days > 1 ? 'i' : 'o'}`;
});

const canSubmit = computed(() => {
  return apiTokenName.value.trim().length > 0 && selectedPermissions.value.length > 0;
});

const minDatetime = computed(() => {
  const now = new Date();
  // format YYYY-MM-DDTHH:MM
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
});

const handleSubmit = async () => {
  const payload = <UpdateTokenPayload>{
    name: apiTokenName.value.trim(),
    capabilities: selectedPermissions.value.slice(),
    expiration: computeExpiryIso(),
  };

  await tokenStore!
    .addToken(payload)
    .then(() => {
      bus?.emit('success:general', { title: 'Token creato con successo!', button: 'Chiudi' });
      bus?.emit('refresh:tokens');
    })
    .catch((error: ServerResponse | ValidationError) => {
      handleStatus(error, bus!);
      return;
    });

  apiTokenName.value = '';
  selectedPermissions.value = [];
  expiryOption.value = '30';
  customExpiry.value = '';
};
</script>
