<template>
  <div class="flex flex-row no-wrap justify-start items-center h-full"></div>
  <q-img
    @click="goToRoot"
    class="w-12 object-contain transform hover:scale-110 transition transition-all cursor-pointer"
    src="~assets/iena-logo.png"
  />
</template>
<style scoped>
.tenada {
  font-family: 'Tenada', sans-serif;
  font-weight: 400;
}
</style>
<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter();
const goToRoot = async () => {
  await router.push({ path: '/' });
};
</script>
