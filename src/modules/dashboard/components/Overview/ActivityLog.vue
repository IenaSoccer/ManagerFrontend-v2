<template>
  <!-- Admin Log Table -->
  <div v-if="isAdmin" class="mt-8 max-w-8xl mx-auto">
    <div
      class="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 select-none"
    >
      <div class="text-xs font-bold text-gray-600 uppercase tracking-wide mb-4">Log Attività</div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-gray-200">
              <th class="text-left py-3 px-4 font-semibold text-gray-700">Timestamp</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-700">Utente</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-700">Azione</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-700">Risorsa</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-700">Stato</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="log in paginatedLogs"
              :key="log.id"
              class="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
            >
              <td class="py-3 px-4 text-gray-600">{{ log.timestamp }}</td>
              <td class="py-3 px-4 text-gray-800">{{ log.user }}</td>
              <td class="py-3 px-4 text-gray-800">{{ log.action }}</td>
              <td class="py-3 px-4 text-gray-600">{{ log.resource }}</td>
              <td class="py-3 px-4">
                <span
                  :class="`px-2 py-1 text-xs rounded-full font-semibold ${log.status === 'Success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`"
                >
                  {{ log.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="mt-4 flex justify-between">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
        >
          Precedente
        </button>
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
        >
          Successivo
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const currentPage = ref(1);
const itemsPerPage = 10;

const totalPages = computed(() => Math.ceil(activityLogs.value.length / itemsPerPage));

const paginatedLogs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return activityLogs.value.slice(start, start + itemsPerPage);
});

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const isAdmin = ref(true);
const activityLogs = ref([
  {
    id: 1,
    timestamp: '2024-06-01 10:00',
    user: 'admin',
    action: 'Created',
    resource: 'Post #42',
    status: 'Success',
  },
  {
    id: 2,
    timestamp: '2024-06-01 10:05',
    user: 'editor1',
    action: 'Updated',
    resource: 'Gallery #8',
    status: 'Success',
  },
  {
    id: 3,
    timestamp: '2024-06-01 10:10',
    user: 'viewer2',
    action: 'Deleted',
    resource: 'Video #12',
    status: 'Failed',
  },
  {
    id: 4,
    timestamp: '2024-06-01 10:15',
    user: 'admin',
    action: 'Created',
    resource: 'Folder #1',
    status: 'Success',
  },
  {
    id: 5,
    timestamp: '2024-06-01 10:20',
    user: 'editor2',
    action: 'Updated',
    resource: 'Post #6',
    status: 'Success',
  },
]);
</script>

<style scoped>
@media (max-width: 640px) {
  table {
    display: block;
    overflow-x: auto;
  }
}
</style>
