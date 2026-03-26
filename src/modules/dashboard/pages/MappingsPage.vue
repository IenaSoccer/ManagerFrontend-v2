<template>
  <q-page class="min-h-screen p-6 bg-gradient-to-br from-slate-200 to-blue-500">
    <div class="animate-fade-in">
      <div>
        <h1 class="text-3xl md:text-4xl font-bold text-black text-center mb-2 animate-fade-in">
          Gestione mappature
        </h1>
        <p class="text-center mb-8 text-blue-800 animate-fade-in-delay">
          Gestisci le mappature vista-cartella
        </p>
      </div>
      <MappingHandler></MappingHandler>
    </div>
  </q-page>
</template>
<script setup lang="ts">
import MappingHandler from 'src/modules/dashboard/components/Mappings/MappingHandler.vue';
</script>
