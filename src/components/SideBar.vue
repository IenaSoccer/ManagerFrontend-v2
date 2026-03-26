<template>
  <q-drawer
    v-model="sidebarOpen"
    side="left"
    bordered
    :width="250"
    :breakpoint="1024"
    class="bg-white select-none roboto"
  >
    <q-scroll-area class="fit">
      <q-list padding class="rounded-borders">
        <q-item-label header class="text-weight-bold text-primary q-py-md">
          Navigazione
        </q-item-label>

        <q-item clickable v-ripple to="/dashboard/account" active-class="bg-blue text-white">
          <q-item-section avatar>
            <q-icon name="person" color="blue" class="rounded-full bg-white p-2" />
          </q-item-section>
          <q-item-section>Account</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/dashboard/users" active-class="bg-green text-white">
          <q-item-section avatar>
            <q-icon name="group" color="green" class="rounded-full bg-white p-2" />
          </q-item-section>
          <q-item-section>Utenti</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/dashboard/resources" active-class="bg-orange text-white">
          <q-item-section avatar>
            <q-icon name="cloud_queue" color="orange" class="rounded-full bg-white p-2" />
          </q-item-section>
          <q-item-section>Risorse</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/dashboard/mappings" active-class="bg-purple text-white">
          <q-item-section avatar>
            <q-icon name="schema" color="purple" class="rounded-full bg-white p-2" />
          </q-item-section>
          <q-item-section>Mappings</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/dashboard/api-settings" active-class="bg-red text-white">
          <q-item-section avatar>
            <q-icon name="api" color="red" class="rounded-full bg-white p-2" />
          </q-item-section>
          <q-item-section>Impostazioni API</q-item-section>
        </q-item>

        <q-separator class="q-my-md" />

        <q-item clickable v-ripple to="/dashboard/security" active-class="bg-grey-8 text-white">
          <q-item-section avatar>
            <q-icon name="security" color="grey-7" class="rounded-full bg-white p-2" />
          </q-item-section>
          <q-item-section>Sicurezza</q-item-section>
        </q-item>
      </q-list>
    </q-scroll-area>
  </q-drawer>
</template>
<script setup lang="ts">
import type { EventBus } from 'quasar';
import { inject, onBeforeUnmount, onMounted, ref } from 'vue';

const sidebarOpen = ref(false);
const bus = inject<EventBus>('bus');

onMounted(() => {
  bus?.on('toggle-sidebar', () => {
    sidebarOpen.value = !sidebarOpen.value;
  });
});

onBeforeUnmount(() => {
  bus?.off('toggle-sidebar');
});
</script>
