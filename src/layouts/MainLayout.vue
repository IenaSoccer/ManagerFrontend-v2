<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-primary text-white z-20">
      <q-toolbar>
        <q-btn flat dense round icon="menu" @click="toggleSidebar" class="q-mr-md" />
        <TopHeader></TopHeader>
      </q-toolbar>
    </q-header>
    <SideBar />
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import TopHeader from 'src/components/Header/TopHeader.vue';
import SideBar from 'src/components/Sidebar.vue';

import { inject, onBeforeUnmount, onMounted } from 'vue';
import type { EventBus } from 'quasar';
import type { Globals } from 'src/interfaces/globals';
import { handleStatus } from 'src/helpers/errors';
import type { ServerResponse } from 'src/interfaces/response';

const bus = inject<EventBus>('bus');
const toggleSidebar = () => {
  bus?.emit('toggle-sidebar');
};

const globals = inject('globals') as Globals;
const authStore = globals.stores.auth;

onMounted(() => {
  bus?.on('refresh:accountInfo', () => {
    authStore.refreshCurrentUser().catch((error: ServerResponse) => {
      handleStatus(error, bus);
    });
  });
});

onBeforeUnmount(() => {
  bus?.off('refresh:accountInfo');
});
</script>

<style>
@keyframes fadeIn {
  from {
    transform: translateY(10px);
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.animate-fade-in {
  animation: fadeIn 1s ease-in-out;
}
</style>
