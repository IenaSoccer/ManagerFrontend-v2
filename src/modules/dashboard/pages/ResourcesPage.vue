<template>
  <q-page class="min-h-screen p-6 bg-gradient-to-br from-slate-200 to-blue-500">
    <div class="animate-fade-in">
      <div>
        <h1 class="text-3xl md:text-4xl font-bold text-black text-center mb-2 animate-fade-in">
          Gestione risorse
        </h1>
        <p class="text-center mb-8 text-blue-800 animate-fade-in-delay">
          Gestisci le risorse disponibili
        </p>
      </div>
      <FolderList></FolderList>
      <ResourceList></ResourceList>
      <ResourceEditor></ResourceEditor>
      <AttachmentsArchive></AttachmentsArchive>
    </div>
  </q-page>
</template>
<script setup lang="ts">
import FolderList from 'src/modules/dashboard/components/Resources/FolderList.vue';
import ResourceEditor from 'src/modules/dashboard/components/Resources/ResourceEditor.vue';
import ResourceList from '../components/Resources/ResourceList.vue';
import AttachmentsArchive from '../components/Resources/AttachmentsArchive.vue';
</script>
