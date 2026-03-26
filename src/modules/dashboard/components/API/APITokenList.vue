<template>
  <div class="space-y-3 font-sans">
    <div class="flex justify-between items-center mb-3">
      <h2 class="text-lg font-semibold">Token API</h2>
    </div>

    <!-- Desktop / tablet: table view -->
    <div class="hidden sm:block" v-if="tokenList?.length">
      <table class="w-full border-collapse bg-white shadow-sm">
        <thead>
          <tr>
            <th class="text-left p-2 border-b border-gray-200 bg-gray-50 text-sm font-semibold text-gray-700">
              Nome
            </th>
            <th class="text-left p-2 border-b border-gray-200 bg-gray-50 text-sm font-semibold text-gray-700">
              Token
            </th>
            <th class="text-left p-2 border-b border-gray-200 bg-gray-50 text-sm font-semibold text-gray-700">
              Scadenza
            </th>
            <th class="text-left p-2 border-b border-gray-200 bg-gray-50 text-sm font-semibold text-gray-700">
              Ambiti
            </th>
            <th class="text-left p-2 border-b border-gray-200 bg-gray-50 text-sm font-semibold text-gray-700"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in tokenList" :key="t.id">
            <td class="text-sm p-2 border-b border-gray-100">{{ t.name || '—' }}</td>
            <td class="text-sm p-2 border-b border-gray-100">
              <div class="flex gap-2 items-center">
                <code class="font-mono bg-gray-100 px-2 py-1 rounded">{{
                  showTokenId === t.id ? t.token : masked(t.token)
                }}</code>
                <div class="flex gap-2">
                  <button class="text-blue-600 bg-transparent border-0 p-1 rounded" @click="toggleShow(t.id)"
                    :title="showTokenId === t.id ? 'Nascondi' : 'Mostra'">
                    {{ showTokenId === t.id ? '🙈' : '👁️' }}
                  </button>
                  <button class="text-blue-600 bg-transparent border-0 p-1 rounded" @click="copyToken(t.token)"
                    title="Copia">
                    📋
                  </button>
                </div>
              </div>
            </td>
            <td class="text-sm p-2 border-b border-gray-100">
              {{ t.expiration ? formatDate(t.expiration) : 'Mai' }}
            </td>
            <td class="text-sm p-2 border-b border-gray-100">
              {{ t.capabilities && t.capabilities.length ? t.capabilities.join(', ') : '—' }}
            </td>
            <td class="text-sm p-2 border-b border-gray-100 text-right">
              <button class="bg-red-50 border border-red-200 text-red-800 px-2 py-1 rounded-md" @click="revoke(t.id)"
                title="Revoca">
                🗑️
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile: stacked cards -->
    <div class="sm:hidden" v-if="tokenList?.length">
      <div v-for="t in tokenList" :key="t.id" class="bg-white shadow-sm rounded border p-3 mb-3">
        <div class="flex justify-between items-start">
          <div class="font-semibold text-sm">{{ t.name || '—' }}</div>
          <div class="text-xs text-gray-500">
            {{ t.expiration ? formatDate(t.expiration) : 'Mai' }}
          </div>
        </div>
        <div class="mt-2 flex items-start gap-2">
          <code class="font-mono bg-gray-100 px-2 py-1 rounded break-words">{{
            showTokenId === t.id ? t.token : masked(t.token)
          }}</code>
          <div class="flex gap-1 ml-auto">
            <button class="text-blue-600 bg-transparent border-0 p-1 rounded" @click="toggleShow(t.id)"
              :title="showTokenId === t.id ? 'Nascondi' : 'Mostra'">
              {{ showTokenId === t.id ? '🙈' : '👁️' }}
            </button>
            <button class="text-blue-600 bg-transparent border-0 p-1 rounded" @click="copyToken(t.token)" title="Copia">
              📋
            </button>
          </div>
        </div>
        <div class="mt-2 text-sm text-gray-600">
          Ambiti: {{ t.capabilities && t.capabilities.length ? t.capabilities.join(', ') : '—' }}
        </div>
        <div class="mt-3 text-right">
          <button class="bg-red-50 border border-red-200 text-red-800 px-2 py-1 rounded-md" @click="revoke(t.id)"
            title="Revoca">
            🗑️
          </button>
        </div>
      </div>
    </div>

    <div v-if="!loading && !tokenList?.length" class="text-gray-500 py-3">
      Nessun token trovato.
    </div>
    <div v-if="loading" class="text-gray-500 py-3">Caricamento…</div>
    <div v-if="error" class="text-red-600 pt-2">Errore: {{ error }}</div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, inject, onBeforeUnmount } from 'vue';
import type { TokenType } from '../../interfaces/token';
import type { EventBus } from 'quasar';
import { handleStatus } from 'src/helpers/errors';
import type { Globals } from 'src/interfaces/globals';
import type { ServerResponse } from 'src/interfaces/response';

const tokenList = ref<TokenType[] | null>(null);
const loading = ref<boolean>(false);
const error = ref<string | null>(null);
const showTokenId = ref<string | null>(null);
const tokenStore = inject<Globals>('globals')?.stores.token;
const bus = inject<EventBus>('bus');

const fetchTokens = async () => {
  loading.value = true;
  error.value = null;
  tokenList.value = await tokenStore!
    .listTokens()
    .finally(() => {
      loading.value = false;
    })
    .catch((error: ServerResponse) => {
      handleStatus(error, bus!);
      return null;
    });
};

const formatDate = (s: string | null | undefined) => {
  if (!s) return '—';
  try {
    return new Date(s).toLocaleString();
  } catch {
    return s;
  }
};

const masked = (t: string | null | undefined) => {
  if (!t) return '—';
  if (t.length <= 8) return '•'.repeat(t.length);
  return t.slice(0, 4) + '•'.repeat(Math.max(6, t.length - 8)) + t.slice(-4);
};

const toggleShow = (id: string) => {
  showTokenId.value = showTokenId.value === id ? null : id;
};

const copyToken = (text: string | null | undefined) => {
  if (!text) return;
  navigator.clipboard?.writeText(text).catch(() => { });
};

const revoke = async (id: string) => {
  await tokenStore!
    .deleteToken(id)
    .then(() => {
      bus?.emit('success:general', { title: 'Token revocato con successo!', button: 'Chiudi' });
      void fetchTokens();
    })
    .catch((error: ServerResponse) => {
      handleStatus(error, bus!);
    });
};

onMounted(async () => {
  bus?.on('refresh:tokens', () => void fetchTokens());
  await fetchTokens();
});

onBeforeUnmount(() => {
  bus?.off('refresh:tokens');
});
</script>
