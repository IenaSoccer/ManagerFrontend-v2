<template>
  <!-- Session Manager for managing user sessions -->
  <div
    class="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 max-w-4xl mx-auto"
  >
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-lg font-bold text-gray-800">Gestione Sessioni</h2>
      <button
        @click="revokeOtherSessions"
        :disabled="sessions.length < 1 || isRevoking"
        class="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        title="Termina tutte le sessioni"
      >
        {{ isRevoking ? 'Terminazione…' : 'Termina tutte le sessioni' }}
      </button>
    </div>

    <div class="space-y-4">
      <div
        v-for="session in sessions"
        :key="session.id"
        class="p-4 bg-white rounded-lg shadow-sm flex justify-between items-center"
      >
        <div class="flex items-center gap-3">
          <div>
            <h3 class="font-semibold text-gray-800">{{ session.name }}</h3>
            <p class="text-sm text-gray-600">
              Ultimo accesso:
              {{ session.last_used_at ? new Date(session.last_used_at).toLocaleString() : 'Mai' }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useQuasar, type EventBus } from 'quasar';
import { handleStatus } from 'src/helpers/errors';
import type { Globals } from 'src/interfaces/globals';
import type { SessionType } from 'src/modules/auth/interfaces/payloads';
import { inject, onMounted, ref } from 'vue';

const authStore = inject<Globals>('globals')?.stores.auth;
const sessions = ref<SessionType[]>([]);
const bus = inject<EventBus>('bus');
const $q = useQuasar();
const isRevoking = ref(false);

const getActiveSessions = async () => {
  await authStore
    ?.getActiveSessions()
    .then((activeSessions) => {
      sessions.value = activeSessions;
    })
    .catch((err) => {
      handleStatus(err, bus);
    });
};

const revokeOtherSessions = () => {
  if (!sessions.value.length) return;
  $q.dialog({
    title: 'Termina sessioni',
    message: 'Vuoi terminare tutte le altre sessioni attive?',
    cancel: true,
    persistent: true,
  }).onOk(() => void performRevokeOtherSessions());
};

const performRevokeOtherSessions = async () => {
  isRevoking.value = true;
  await authStore
    ?.revokeAllSessions()
    .then(() => {
      void getActiveSessions();
    })
    .catch((err) => {
      handleStatus(err, bus);
    })
    .finally(() => {
      isRevoking.value = false;
    });
};

onMounted(async () => {
  await getActiveSessions();
});
</script>
