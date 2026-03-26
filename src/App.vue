<template>
  <div>
    <div class="absolute bottom-8 right-8 w-full flex flex-row justify-center items-center roboto">
      <WBanner class="z-20 fixed" />
    </div>
    <router-view class="z-10 roboto" />
  </div>
</template>

<script setup lang="ts">
import WBanner from 'components/Widgets/WBanner.vue';
</script>
