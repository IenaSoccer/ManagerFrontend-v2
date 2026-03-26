<template>
  <nav class="h-24 flex z-30 flex-row no-wrap justify-between items-center w-full">
    <HeaderFirm></HeaderFirm>
    <ProfileBar></ProfileBar>
  </nav>
</template>
<script setup lang="ts">
import HeaderFirm from './partials/HeaderFirm.vue';
import ProfileBar from './partials/ProfileBar.vue';
</script>
