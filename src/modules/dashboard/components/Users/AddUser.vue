<template>
  <div class="max-w-7xl my-8 mx-auto bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-2xl p-6">
    <div v-if="isLoaded" class="mx-auto select-none">
      <div class="bg-white/10 backdrop-blur-md overflow-hidden rounded-2xl animate-slide-up">
        <div class="p-6">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Aggiungi Utente</h2>

          <q-form @submit.prevent="addUser" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <q-input v-model="newUser.firstname" label="Nome" required dense outlined
                class="transition-shadow duration-200 focus-within:ring-4 focus-within:ring-purple-300/30 rounded" />
              <q-input v-model="newUser.lastname" label="Cognome" dense outlined
                class="transition-shadow duration-200 focus-within:ring-4 focus-within:ring-purple-300/30 rounded" />
            </div>

            <q-input v-model="newUser.email" label="Email" type="email" required dense outlined
              class="transition-shadow duration-200 focus-within:ring-4 focus-within:ring-purple-300/30 rounded" />

            <q-input v-model="newUser.description" label="Descrizione" type="textarea" autogrow outlined
              class="transition-shadow duration-200 focus-within:ring-4 focus-within:ring-purple-300/30 rounded" />

            <div class="flex items-center justify-between pt-2">
              <q-btn :loading="isSubmitting" type="submit" color="primary" unelevated
                class="px-6 py-2 transition-transform hover:-translate-y-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg">
                <template v-if="!submitted">Aggiungi</template>
                <template v-else><q-icon name="check" /> Aggiunto</template>
              </q-btn>
            </div>
          </q-form>
        </div>
      </div>
    </div>
    <div v-else class="flex justify-center items-center h-64">
      <q-spinner-dots size="48px" color="purple" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { EventBus } from 'quasar';
import { ref, inject } from 'vue';
import type { Globals } from 'src/interfaces/globals';
import type { AddUserPayload } from '../../stores/users';
import { handleStatus } from 'src/helpers/errors';

const bus = inject<EventBus>('bus');
const globals = inject('globals') as Globals;

const usersStore = globals.stores.users;
const newUser = ref<AddUserPayload>({
  firstname: '',
  lastname: '',
  description: '',
  email: '',
});

const isSubmitting = ref(false);
const submitted = ref(false);
const isLoaded = ref(true);

const addUser = () => {
  isSubmitting.value = true;
  usersStore
    .createUser(newUser.value)
    .then((response: string | null) => {
      bus?.emit('success:general', { title: 'Utente aggiunto con successo', button: 'Chiudi' });
      alert('La password generata è: ' + response);

      newUser.value = {
        firstname: '',
        lastname: '',
        description: '',
        email: '',
      };
    })
    .catch((err) => {
      handleStatus(err, bus!);
    })
    .finally(() => {
      isSubmitting.value = false;
    });
};
</script>
