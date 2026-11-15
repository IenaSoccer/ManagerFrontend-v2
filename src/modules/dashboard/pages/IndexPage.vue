<template>
  <q-page class="min-h-screen p-6 bg-gradient-to-br from-slate-200 to-blue-500">
    <div class="animate-fade-in">
      <StatisticsViewer></StatisticsViewer>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import StatisticsViewer from '@/modules/dashboard/components/Overview/StatisticsViewer.vue';
</script>
