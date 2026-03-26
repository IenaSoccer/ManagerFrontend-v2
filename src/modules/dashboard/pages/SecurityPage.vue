<template>
  <q-page class="min-h-screen p-6 bg-gradient-to-br from-slate-200 to-blue-500">
    <div class="animate-fade-in">
      <div>
        <h1 class="text-3xl md:text-4xl font-bold text-black text-center mb-2 animate-fade-in">
          Sicurezza account
        </h1>
        <p class="text-center mb-8 text-blue-800 animate-fade-in-delay">
          Gestisci le impostazioni di sicurezza del tuo account
        </p>
      </div>
      <security-settings></security-settings>
      <session-manager></session-manager>
      <APITokenSetter></APITokenSetter>
    </div>
  </q-page>
</template>
<script setup lang="ts">
import SecuritySettings from 'src/modules/dashboard/components/Security/SecuritySettings.vue';
import SessionManager from 'src/modules/dashboard/components/Security/SessionManager.vue';
import APITokenSetter from '../components/Security/APITokenSetter.vue';
</script>
