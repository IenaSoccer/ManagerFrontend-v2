<template>
  <div class="bg-white my-8 rounded-xl p-5 shadow-sm border border-gray-200">
    <div
      class="text-xs font-bold text-gray-700 uppercase tracking-wider mb-4 select-none flex items-center justify-between">
      <div class="flex items-center gap-2">
        <q-icon name="resources" size="sm" color="blue" />
      </div>
      <div>
        <q-toggle :disable="!selectedFolderId" v-model="resourceMode" :true-value="'gallery'" :false-value="'post'"
          :label="resourceMode === 'post' ? 'Post' : 'Galleria'" color="blue" class="pr-4" />
        <q-btn flat dense round icon="add" color="blue" size="sm" :disabled="!selectedFolderId"
          @click="openAddResourceDialog(selectedFolderId!, resourceMode)" title="Aggiungi risorsa" />
      </div>
    </div>
    <q-list v-if="isLoaded && resources.length" class="bg-white rounded-lg shadow-md max-h-96 overflow-y-auto border border-gray-200">
      <q-item v-for="resource in resources" :key="resource.id" clickable @click="selectResourceId(resource)" :class="{
        'bg-blue-50 border-l-4 border-blue-500': selectedResourceId === resource.id,
        'hover:bg-gray-50 transition-colors': selectedResourceId !== resource.id,
      }" class="border-b border-gray-100 last:border-b-0">
        <q-item-section avatar>
          <q-img v-if="computedThumbnails[resource.id]" :src="computedThumbnails[resource.id]" :alt="`Miniatura di ${resource.name}`" />
        </q-item-section>
        <q-item-section>
          <q-item-label class="font-semibold text-gray-800">{{ resource.name }}</q-item-label>
          <q-item-label caption class="text-gray-500 text-xs">{{
            resource.description
            }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <div class="flex items-center gap-2">
            <q-toggle v-model="resource.attributes.preview" v-if="resource.content.type" @click.stop
              :disable="previewSavingIds.has(resource.id)" label="Bozza" @update:model-value="savePreview(resource)" />
            <q-btn flat dense round icon="delete" color="negative" size="sm"
              aria-label="Elimina risorsa" @click.stop="confirmDeleteResource(resource.id)" />
          </div>
        </q-item-section>
      </q-item>
    </q-list>
    <div v-else-if="!isLoaded" class="flex flex-col justify-center items-center h-40 gap-3">
      <q-spinner-dots size="40px" color="blue" />
      <span class="text-sm text-gray-500">Caricamento risorse...</span>
    </div>
    <div v-else class="text-center text-sm text-gray-500 py-10">Seleziona una cartella o aggiungi la prima risorsa.</div>
  </div>
</template>
<script setup lang="ts" name="ResourceList">
import { inject, onBeforeUnmount, onMounted, ref } from 'vue';
import { handleStatus } from 'src/helpers/errors';
import { useQuasar, type EventBus } from 'quasar';
import type { Resource } from '../../interfaces/resources';
import type { Globals } from 'src/interfaces/globals';
import type { AttachmentType } from '../../interfaces/attachments';
import type { ServerResponse } from 'src/interfaces/response';

const globals = inject('globals') as Globals;
const resourcesStore = globals.stores.resources;
const bus = inject<EventBus>('bus');
const $q = useQuasar();

const isLoaded = ref(true);
const selectedResourceId = ref<string | null>(null);
const resources = ref<Resource<string>[]>([]);
const selectedFolderId = ref<string | null>(null);
const resourceMode = ref<'post' | 'gallery'>('post');
const computedThumbnails = ref<Record<string, string>>({});
const previewSavingIds = ref(new Set<string>());

const computeThumbnails = async (folderId: string) => {
  computedThumbnails.value = {};
  return globals.stores.attachments
    .getAttachmentsByFolderId(folderId, 1000, 1)
    .then((attachments: AttachmentType[] | null) => {
      const byId = new Map((attachments ?? []).map((attachment) => [attachment.id, attachment.data.path]));
      computedThumbnails.value = Object.fromEntries(
        resources.value
          .map((resource) => [resource.id, byId.get(resource.thumbnail)])
          .filter((entry): entry is [string, string] => Boolean(entry[1]))
          .map(([id, path]) => [id, `${String(process.env.ATTACHMENTS_URL ?? '#')}/attachments/${path}`]),
      );
    })
    .catch(() => {
      return '';
    });
};

const savePreview = async (resource: Resource<string>) => {
  previewSavingIds.value.add(resource.id);
  try {
    await resourcesStore.editResourceById(resource.id, { attributes: resource.attributes });
  } catch (error) {
    resource.attributes.preview = !resource.attributes.preview;
    handleStatus(error, bus);
  } finally {
    previewSavingIds.value.delete(resource.id);
  }
};

const openAddResourceDialog = (fid: string, mode: 'post' | 'gallery') => {
  bus?.emit('add:resource', { fid, mode });
};

const selectResourceId = (resource: Resource<string>) => {
  selectedResourceId.value = resource.id;

  bus?.emit('select:resource', resource);
};

const getResources = async (folderId?: string) => {
  isLoaded.value = false;
  await resourcesStore
    .getResourceById(folderId!)
    .then((res) => {
      resources.value = res ?? [];
      return computeThumbnails(folderId!);
    })
    .catch((error: ServerResponse) => {
      handleStatus(error, bus);
    });
};

const deleteResource = async (resourceId: string) => {
  await resourcesStore
    .deleteResourceById(resourceId)
    .then(() => {
      bus?.emit('success:general', { title: 'Risorsa eliminata con successo!', button: 'Chiudi' });
      if (selectedFolderId.value) {
        bus?.emit('refresh:resources', selectedFolderId.value);
      }
    })
    .catch((error: ServerResponse) => {
      handleStatus(error, bus);
    });
};

const confirmDeleteResource = (resourceId: string) => {
  $q.dialog({
    title: 'Elimina risorsa',
    message: 'Questa operazione non può essere annullata. Vuoi continuare?',
    cancel: true,
    persistent: true,
  }).onOk(() => void deleteResource(resourceId));
};

onMounted(() => {
  bus?.on('refresh:resources', (folderId: string) => {
    isLoaded.value = false;
    getResources(folderId)
      .then(() => {
        isLoaded.value = true;
      })
      .catch((error: ServerResponse) => {
        handleStatus(error, bus);
      });
  });
  bus?.on('select:folder', (folderId: string) => {
    selectedFolderId.value = folderId;
    isLoaded.value = false;
    getResources(folderId)
      .then(() => {
        isLoaded.value = true;
      })
      .catch((error: ServerResponse) => {
        handleStatus(error, bus);
      });
  });
});

onBeforeUnmount(() => {
  bus?.off('refresh:resources');
  bus?.off('select:folder');
});
</script>
