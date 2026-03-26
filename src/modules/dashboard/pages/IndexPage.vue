<template>
  <q-page class="min-h-screen p-6 bg-gradient-to-br from-slate-200 to-blue-500">
    <div class="animate-fade-in">
      <StatisticsViewer></StatisticsViewer>
      <ActivityLog class="hidden"></ActivityLog>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import ActivityLog from 'src/modules/dashboard/components/Overview/ActivityLog.vue';
import StatisticsViewer from 'src/modules/dashboard/components/Overview/StatisticsViewer.vue';
</script>
