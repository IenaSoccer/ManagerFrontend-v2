<template>
  <div>
    <!-- Modal Backdrop -->
    <transition name="fade">
      <div v-if="isOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        @click.self="closeModal">
        <!-- Modal Content -->
        <transition name="slide-up">
          <div v-if="isOpen" class="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <!-- Header -->
            <div
              class="sticky z-50 top-0 bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between border-b border-blue-500">
              <h2 class="text-xl font-bold text-white">Modifica Profilo</h2>
              <button @click="closeModal"
                class="text-white hover:bg-blue-500 p-1.5 rounded-lg transition-colors duration-200">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <!-- Body -->
            <div class="p-8 space-y-6 z-30">
              <!-- Avatar Section -->
              <div class="flex flex-col items-center space-y-4">
                <div class="relative">
                  <img v-if="formData?.details.thumbnail" :src="computedThumbnail" alt="Avatar"
                    class="w-32 h-32 rounded-full object-cover border-4 border-blue-200 shadow-lg" />
                  <div v-else
                    class="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center border-4 border-blue-200 shadow-lg">
                    <svg class="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clip-rule="evenodd"></path>
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Form Fields -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Nome -->
                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700"> Nome </label>
                  <input v-model="formData!.details.firstname" type="text" placeholder="Inserisci il nome"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" />
                </div>

                <!-- Cognome -->
                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700"> Cognome </label>
                  <input v-model="formData!.details.lastname" type="text" placeholder="Inserisci il cognome"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" />
                </div>

                <!-- Compleanno -->
                <div class="space-y-2 md:col-span-1">
                  <label class="block text-sm font-semibold text-gray-700"> Compleanno </label>
                  <input v-model="formData!.details.birthday" type="date"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" />
                </div>
              </div>

              <!-- Descrizione -->
              <div class="space-y-2">
                <label class="block text-sm font-semibold text-gray-700"> Descrizione </label>
                <textarea v-model="formData!.details.description" placeholder="Inserisci una descrizione" rows="4"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"></textarea>
              </div>
            </div>

            <!-- Footer -->
            <div
              class="sticky bottom-0 bg-gray-50 px-8 py-6 border-t border-gray-200 flex items-center justify-end space-x-4">
              <button @click="closeModal"
                class="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-medium">
                Annulla
              </button>
              <button :disabled="isSaveButtonDisabled" @click="saveChanges"
                class="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-md hover:shadow-lg">
                Salva Modifiche
              </button>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import type { EventBus } from 'quasar';
import { ref, inject, computed, onMounted, onBeforeUnmount } from 'vue';
import type { Globals } from 'src/interfaces/globals';
import { handleStatus } from 'src/helpers/errors';
import type { UpdateUserPayload } from '../../stores/users';

const bus = inject<EventBus>('bus');
const globals = inject('globals') as Globals;

const isOpen = ref(false);
const usersStore = globals.stores.users;
const formData = ref<UpdateUserPayload>();
const userId = ref<string>('');
const isSaveButtonDisabled = ref(false);
const computedThumbnail = computed(() => {
  const baseURL = String(process.env.ATTACHMENTS_URL ?? '');
  return formData.value?.details.thumbnail
    ? `${baseURL}/${formData.value.details.thumbnail}`
    : '~assets/avatar.png';
});

onMounted(() => {
  bus?.on(
    'open:editProfile',
    ({ userId: id, onClose }: { userId: string; onClose: () => void }) => {
      userId.value = id;
      usersStore
        .getUserById(id)
        .then((user) => {
          if (user) {
            formData.value = user;
            isOpen.value = true;
          }
        })
        .catch((error) => {
          handleStatus(error, bus);
        })
        .finally(() => {
          onClose();
        });
    },
  );
});

const closeModal = () => {
  isOpen.value = false;
};

const saveChanges = () => {
  isSaveButtonDisabled.value = true;
  usersStore
    .editUserById(userId.value, formData.value!)
    .then(() => {
      bus?.emit('success:general', {
        title: 'Profilo utente aggiornato con successo!',
        button: 'Chiudi',
      });
    })
    .catch((error) => {
      handleStatus(error, bus!);
    })
    .finally(() => {
      closeModal();
      isSaveButtonDisabled.value = false;
    });
};

onBeforeUnmount(() => {
  bus?.off('open:editProfile');
});
</script>

<style scoped>
/* Smooth scrolling */
div::-webkit-scrollbar {
  width: 8px;
}

div::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 10px;
}

div::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

div::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
