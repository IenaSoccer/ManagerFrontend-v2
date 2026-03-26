<template>
  <q-page class="min-h-screen p-6 bg-gradient-to-br from-slate-200 to-blue-500">
    <div class="animate-fade-in">
      <div>
        <h1 class="text-3xl md:text-4xl font-bold text-black text-center mb-2 animate-fade-in">
          Gestione API Token
        </h1>
        <p class="text-center mb-8 text-blue-800 animate-fade-in-delay">Gestisci i token API</p>
      </div>
      <APITokenList></APITokenList>
      <APITokenHandler></APITokenHandler>
    </div>
  </q-page>
</template>
<script setup lang="ts">
import APITokenHandler from 'src/modules/dashboard/components/API/APITokenHandler.vue';
import APITokenList from '../components/API/APITokenList.vue';
</script>
