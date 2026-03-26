<template>
  <div class="flex flex-row no-wrap justify-end items-center h-full gap-3">
    <div id="user-details" class="select-none text-right">
      <span class="block text-subtitle2 text-capitalize">{{
        authStore.currentUser?.details.firstname ?? 'Utente'
      }}</span>
      <span class="block text-caption text-capitalize">{{
        roles[authStore.currentUser?.user.role ?? ''] ?? 'Ruolo generico'
      }}</span>
    </div>
    <q-btn class="w-16 h-16" flat rounded to="/dashboard/account">
      <template #default>
        <q-img class="rounded-full" :src="computedThumbnail" img-class="object-cover" />
      </template>
    </q-btn>
  </div>
</template>

<script setup lang="ts">
import { roles } from 'src/helpers/roles';
import type { Globals } from 'src/interfaces/globals';
import { computed, inject } from 'vue';

const globals = inject('globals') as Globals;
const authStore = globals.stores.auth;
const computedThumbnail = computed(() => {
  const baseURL = String(process.env.ATTACHMENTS_URL ?? '');
  return authStore.currentUser?.details.thumbnail
    ? `${baseURL}/${authStore.currentUser.details.thumbnail}`
    : '/src/assets/avatar.png';
});
</script>
