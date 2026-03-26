<template>
  <!-- Mappings handler -->
  <div class="w-full my-8 rounded-3xl select-none">
    <div class="mx-auto my-8 rounded-3xl max-w-4xl">
      <form @submit.prevent="handleSubmit" class="bg-white p-8 rounded-2xl space-y-6">
        <!-- Folder list with mapping dropdowns -->
        <div class="">
          <label class="flex items-center gap-2 font-semibold text-gray-800 mb-3 text-base">
            Mappature vista-cartella
            <q-icon name="folder" class="text-gray-500" />
          </label>

          <div v-if="!isLoading" class="space-y-3">
            <template v-for="folder in folderList" :key="folder.id">
              <div class="border border-gray-200 rounded-xl p-4 bg-gray-50">
                <div class="flex items-center justify-between gap-4">
                  <div class="flex items-center gap-3">
                    <button type="button" @click="toggle(folder)" class="text-gray-600 hover:text-gray-800"
                      aria-label="toggle">
                      <q-icon :name="folder.expanded ? 'keyboard_arrow_down' : 'chevron_right'" />
                    </button>
                    <div class="font-medium text-gray-800">{{ folder.name }}</div>
                  </div>

                  <div class="w-56">
                    <!-- only allow editing if this folder is a leaf (no subfolders) -->
                    <select @change="updateMappingList(folder)" v-model="folder.mapping"
                      :disabled="folder.subfolders?.length ? true : false"
                      class="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:cursor-not-allowed disabled:bg-gray-100">
                      <option value="">-- Seleziona mappatura --</option>
                      <option v-for="(name, id) in mappings" :key="id" :value="id"
                        v-text="name[0]?.toUpperCase() + name.slice(1)"></option>
                    </select>
                  </div>
                </div>

                <div v-if="folder.expanded && folder.subfolders?.length" class="mt-3 pl-10 space-y-2">
                  <template v-for="sub in folder.subfolders" :key="sub.id">
                    <div class="flex items-center justify-between gap-4 p-2 bg-white rounded-lg border border-gray-100">
                      <div class="text-sm text-gray-700">{{ sub.name }}</div>
                      <div class="w-44">
                        <!-- only allow editing subfolder mapping if subfolder is a leaf -->
                        <select v-model="sub.mapping" :disabled="sub.subfolders?.length ? true : false"
                          class="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:cursor-not-allowed disabled:bg-gray-100">
                          <option value="">-- Seleziona mappatura --</option>
                          <option v-for="(name, id) in mappings" :key="id" :value="id"
                            v-text="name[0]?.toUpperCase() + name.slice(1)"></option>
                        </select>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </template>
          </div>
          <div v-else class="flex flex-col justify-center items-center h-40 gap-3">
            <q-spinner-dots size="40px" color="blue" />
            <span class="text-sm text-gray-500">Caricamento mappature...</span>
          </div>

          <div class="">
            <button type="submit" :disabled="isLoading"
              class="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-3 rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transform hover:scale-105 transition-all">
              Salva Mappatura
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, onMounted, ref } from 'vue';
import type { Mappings } from '../../interfaces/mappings';
import type { Folder } from '../../interfaces/folders';
import { handleStatus } from 'src/helpers/errors';
import type { EventBus } from 'quasar';
import type { Globals } from 'src/interfaces/globals';
import type { ServerResponse } from 'src/interfaces/response';
type FolderItem = {
  id: string;
  name: string;
  mapping: string;
  expanded?: boolean;
  subfolders?: FolderItem[];
};

const mappings = ref<Mappings | null>(null);
const mappingList = ref<Mappings | null>({});
const folders = ref<Folder[] | null>(null);
const folderList = ref<FolderItem[]>([]);
const isLoading = ref(false);
const mappingsStore = inject<Globals>('globals')?.stores.mappings;
const folderStore = inject<Globals>('globals')?.stores.folders;
const bus = inject<EventBus>('bus');

const getFolders = async () => {
  await folderStore!.getFolderList().catch((err: ServerResponse) => {
    handleStatus(err, bus!);
  });
};

const getMappings = async () => {
  await mappingsStore!.getMappings().catch((err: ServerResponse) => {
    handleStatus(err, bus!);
  });
};

onMounted(async () => {
  isLoading.value = true;

  await getFolders();
  folders.value = folderStore!.folders;

  await getMappings();
  mappings.value = mappingsStore!.mappings;

  folderList.value = transformToFolderItems(folders.value?.find((f) => f.pid === null)?.id || '');

  folderList.value?.forEach((f) => {
    mappingList.value![f.id] = f.mapping || '';
  });
  isLoading.value = false;
});

const transformToFolderItems = (parentFolder: string): FolderItem[] => {
  if (!folders.value) return [];
  return folders.value
    .filter((f) => f.pid === parentFolder)
    .map<FolderItem>((f) => ({
      id: f.id,
      name: f.name,
      mapping: f.view_mapping || '',
      expanded: false,
      subfolders: transformToFolderItems(f.id),
    }));
};

const toggle = (f: FolderItem) => {
  f.expanded = !f.expanded;
};

const updateMappingList = (folder: FolderItem) => {
  mappingList.value![folder.id] = folder.mapping || '';
  if (folder.subfolders?.length) {
    folder.subfolders.forEach((subfolder) => updateMappingList(subfolder));
  }
};

const handleSubmit = () => {
  mappingsStore!
    .addMapping(mappingList.value!)
    .then(() => {
      bus?.emit('success:general', { title: 'Mappatura salvata con successo!', button: 'Chiudi' });
    })
    .catch((err: ServerResponse) => {
      handleStatus(err, bus!);
    });
};
</script>
