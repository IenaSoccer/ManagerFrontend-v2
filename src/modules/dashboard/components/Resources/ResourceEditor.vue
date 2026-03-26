<template>
  <div v-if="showForm" class="w-full my-8 rounded-3xl select-none">
    <form @submit.prevent="handleSubmit" class="bg-white p-8 rounded-2xl space-y-6">
      <div class="animate-fade-in opacity-0">
        <label for="resourceName" class="flex items-center gap-2 font-semibold text-gray-800 mb-2 text-base">
          Nome
        </label>
        <input id="resourceName" v-model="resource!.name" type="text"
          class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-base transition-all duration-300 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 focus:-translate-y-0.5 hover:border-gray-300"
          placeholder="Scrivi il nome della risorsa" required />
      </div>

      <div class="animate-fade-in opacity-0">
        <label for="resourceDescription" class="flex items-center gap-2 font-semibold text-gray-800 mb-2 text-base">
          Descrizione
        </label>
        <textarea id="resourceDescription" v-model="resource!.description"
          class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-base transition-all duration-300 resize-y min-h-[100px] focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 focus:-translate-y-0.5 hover:border-gray-300"
          rows="3" placeholder="Scrivi la descrizione della risorsa"></textarea>
      </div>

      <div class="animate-fade-in opacity-0">
        <label class="flex items-center gap-2 font-semibold text-gray-800 mb-2 text-base">
          <span class="text-xl">🖼️</span> Miniatura
        </label>
        <div class="flex gap-4 flex-col md:flex-row">
          <div class="w-full md:w-1/3">
            <button type="button" @click="showArchiveModalContent(resource!.fid, true, resource!.thumbnail as string)"
              class="w-full h-full bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 rounded-2xl px-6 py-12 cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-2 shadow-lg shadow-blue-500/30 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/40">
              <span class="text-5xl">📁</span>
              <p class="font-semibold text-center text-sm">Scegli da archivio</p>
            </button>
          </div>
        </div>
      </div>

      <div class="animate-fade-in opacity-0">
        <label class="flex items-center gap-2 font-semibold text-gray-800 mb-2 text-base">
          Contenuto
        </label>
        <div v-if="resource?.content.type === 1"
          class="border-2 border-gray-200 rounded-xl overflow-hidden transition-all duration-300 focus-within:border-purple-500 focus-within:ring-4 focus-within:ring-purple-100">
          <QuillEditor v-if="resource?.content.type" v-model:content="resource!.content.data as string"
            contentType="html" toolbar="full" theme="snow" placeholder="Scrivi il contenuto..." />
        </div>
        <div v-else class="flex gap-4 flex-col md:flex-row">
          <div class="w-full md:w-1/3">
            <button type="button" @click="
              showArchiveModalContent(resource!.fid, false, resource!.content.data as string[])
              "
              class="w-full h-full bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 rounded-2xl px-6 py-12 cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-2 shadow-lg shadow-blue-500/30 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/40">
              <span class="text-5xl">📁</span>
              <p class="font-semibold text-center text-sm">Scegli da archivio</p>
            </button>
          </div>
        </div>
      </div>

      <div class="animate-fade-in opacity-0">
        <label class="flex items-center gap-2 font-semibold text-gray-800 mb-2 text-base">
          <span class="text-xl">🏷️</span> Tags
        </label>
        <div
          class="flex flex-wrap gap-2 p-3 border-2 border-gray-200 rounded-xl bg-gray-50 transition-all duration-300 focus-within:border-purple-500 focus-within:bg-white">
          <TransitionGroup name="tag">
            <span v-for="(tag, index) in resource!.attributes.tags" :key="tag"
              class="inline-flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-full text-sm font-medium">
              {{ tag }}
              <button type="button" @click="removeTag(index)"
                class="bg-white/30 border-0 text-white rounded-full w-5 h-5 cursor-pointer transition-all duration-200 flex items-center justify-center hover:bg-white/50 hover:rotate-90">
                ✕
              </button>
            </span>
          </TransitionGroup>
          <input v-model="tagInput" type="text"
            class="flex-1 min-w-[150px] border-0 bg-transparent px-2 py-2 focus:outline-none focus:ring-0"
            placeholder="Aggiungi tag..." @keydown.enter.prevent="addTag" @keydown.,.prevent="addTag"
            @keydown.space.prevent="addTag" />
        </div>
      </div>

      <div class="animate-fade-in opacity-0">
        <label class="flex items-center gap-2 font-semibold text-gray-800 mb-2 text-base">
          <span class="text-xl">⚙️</span> Proprietà aggiuntive
        </label>
        <TransitionGroup name="property" tag="div" class="space-y-3">
          <div v-for="(v, k) in resource!.attributes.custom" :key="k" class="flex gap-3">
            <input :value="k" type="text" placeholder="Chiave"
              class="flex-1 px-3 py-2.5 border-2 border-gray-200 rounded-xl transition-all duration-300 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100" />
            <input :value="v" type="text" placeholder="Valore"
              class="flex-1 px-3 py-2.5 border-2 border-gray-200 rounded-xl transition-all duration-300 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100" />
            <button type="button" @click="removeProperty(k)"
              class="bg-red-50 border-2 border-red-200 text-red-600 rounded-lg px-4 py-2.5 cursor-pointer transition-all duration-300 text-xl hover:bg-red-500 hover:text-white hover:border-red-600 hover:scale-105">
              🗑️
            </button>
            <button type="button" @click="addProperty(k, v)"
              class="mt-3 bg-gradient-to-r from-green-500 to-green-600 text-white border-0 rounded-xl px-6 py-3 font-semibold cursor-pointer transition-all duration-300 flex items-center gap-2 shadow-lg shadow-green-500/30 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-green-500/40">
              <span class="text-2xl font-bold">+</span> Aggiungi
            </button>
          </div>
        </TransitionGroup>
      </div>

      <div class="flex gap-4 mt-8 pt-8 border-t-2 border-gray-200 animate-fade-in opacity-0">
        <button type="submit"
          class="flex-1 px-8 py-4 text-base font-semibold rounded-xl cursor-pointer transition-all duration-300 border-0 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-purple-700 text-white shadow-lg shadow-purple-500/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/50 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          :disabled="isSaving">
          <span v-if="!isSaving">💾 Salva</span>
          <span v-else class="animate-pulse">⏳ Salvataggio...</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { inject, onBeforeUnmount, onMounted, ref } from 'vue';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import type { Resource } from '../../interfaces/resources';
import type { EventBus } from 'quasar';
import { handleStatus } from 'src/helpers/errors';
import type { Globals } from 'src/interfaces/globals';
import type { ServerResponse, ValidationError } from 'src/interfaces/response';

const globals = inject('globals') as Globals;
const resourcesStore = globals.stores.resources;

const tagInput = ref('');
const isSaving = ref(false);
const resource = ref<Resource<string> | null>(null);
const bus = inject<EventBus>('bus');
const isEditing = ref(false);
const showForm = ref(false);
const showArchiveModalContent = (
  folderId: string,
  singleSelectionMode: boolean,
  selectedAttachments: string[] | string,
) => {
  bus?.emit('open:archive', { folderId, singleSelectionMode, selectedAttachments });
};

onMounted(() => {
  bus?.on('select:resource', (res: Resource<string> | null = null) => {
    if (!res) {
      showForm.value = false;
      return;
    }

    isEditing.value = true;
    resource.value = res;

    showForm.value = true;
  });

  bus?.on(
    'close:archive',
    ({
      singleSelectionMode,
      selectedAttachments,
    }: {
      singleSelectionMode: boolean;
      selectedAttachments: string[] | string;
    }) => {
      if (
        !selectedAttachments ||
        (Array.isArray(selectedAttachments) && selectedAttachments.length === 0)
      )
        return;

      if (singleSelectionMode) {
        resource.value!.thumbnail = selectedAttachments as string;
        return;
      }

      resource.value!.content.data = selectedAttachments as string[];
    },
  );

  bus?.on('add:resource', ({ fid, mode }) => {
    isEditing.value = false;
    resource.value = {
      id: '',
      name: '',
      description: '',
      fid: fid,
      thumbnail: '',
      content: {
        type: mode === 'post' ? 1 : 0,
        data: [],
      },
      attributes: {
        preview: false,
        tags: [],
        custom: {},
      },
    };
    showForm.value = true;
  });
});

onBeforeUnmount(() => {
  bus?.off('select:resource');
  bus?.off('close:archive');
  bus?.off('add:resource');
});

const addTag = () => {
  const newTag = tagInput.value.trim();
  if (newTag && !resource.value?.attributes.tags.includes(newTag)) {
    resource.value?.attributes.tags.push(newTag);
  }
  tagInput.value = '';
};

const removeTag = (index: number) => {
  resource.value?.attributes.tags.splice(index, 1);
};

const addProperty = (key: string, value: string) => {
  resource.value!.attributes.custom[key] = value;
};

const removeProperty = (key: string) => {
  delete resource.value!.attributes.custom[key];
};

const handleSubmit = () => {
  isSaving.value = true;

  if (isEditing.value) {
    resourcesStore
      .editResourceById(resource.value!.id, resource.value!)
      .then(() => {
        bus?.emit('success:general', {
          title: 'Risorsa modificata correttamente!',
          button: 'Chiudi',
        });
      })
      .catch((error: ServerResponse | ValidationError) => {
        handleStatus(error, bus!);
      })
      .finally(() => {
        isSaving.value = false;
      });
    return;
  }

  resourcesStore
    .addResource(resource.value!)
    .then(() => {
      bus?.emit('success:general', { title: 'Risorsa aggiunta correttamente!', button: 'Chiudi' });
      bus?.emit('refresh:resources', resource.value!.fid);
    })
    .catch((error: ServerResponse | ValidationError) => {
      handleStatus(error, bus!);
    })
    .finally(() => {
      isSaving.value = false;
    });

  isSaving.value = false;
};
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 1s ease forwards;
}

.tag-enter-active,
.tag-leave-active {
  transition: all 0.3s ease;
}

.tag-enter-from {
  opacity: 0;
  transform: scale(0.5);
}

.tag-leave-to {
  opacity: 0;
  transform: scale(0.5) rotate(180deg);
}

.property-enter-active,
.property-leave-active {
  transition: all 0.3s ease;
}

.property-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.property-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
