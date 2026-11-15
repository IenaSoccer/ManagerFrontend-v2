<template>
  <div>
    <div class="fixed bottom-4 left-4 right-4 z-50 flex justify-center pointer-events-none roboto">
      <WBanner class="pointer-events-auto w-full max-w-xl" />
    </div>
    <router-view class="z-10 roboto" />
  </div>
</template>

<script setup lang="ts">
import WBanner from '@/components/Widgets/WBanner.vue';
</script>
