<template>
  <q-dialog v-model="dialog.isVisible" @hide="onDialogHide">
    <q-card style="width: 100vw; max-width: 900px">
      <q-card-section class="row select-none items-center q-pb-none bg-gradient-to-r from-blue-500 to-purple-600">
        <div class="text-h6 text-white font-bold">📚 Archivio Allegati</div>
        <q-space />
        <q-btn icon="close" flat round dense @click="dialog.isVisible = false" class="text-white" />
      </q-card-section>

      <!-- Attachments Grid with Pagination -->
      <q-card-section>
        <div v-if="dialog.isLoaded" class="space-y-4">
          <div class="space-y-3">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <span class="text-sm font-semibold text-gray-600">
                Totale: {{ attachmentsCount }} allegati
              </span>
              <div class="flex items-center gap-2">
                <q-btn v-if="!dialog.singleSelectionMode"
                  :icon="isAllFilteredSelected ? 'check_box' : 'check_box_outline_blank'" color="primary" flat dense
                  :disable="visibleAttachments.length === 0" @click="toggleSelectAllFiltered" />
                <q-pagination v-model="pagination.currentPage" :max="maxPages" direction-links boundary-links size="sm"
                  color="blue" />
              </div>
            </div>
            <q-input v-model="filters.searchTitle" dense outlined clearable label="Cerca per parole chiave"
              placeholder="Scrivi il nome/descrizione dell'allegato..." class="rounded-lg">
              <template #append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            <div v-for="attachment in visibleAttachments" :key="attachment.id" :class="[
              'relative group transition-all duration-200 rounded-xl overflow-hidden',
              'border border-gray-200 shadow-lg h-64',
              'hover:shadow-xl hover:border-blue-400',
              isAttachmentSelected(attachment.id) ? 'ring-2 ring-blue-400' : '',
            ]">
              <img :src="computedThumbnail(attachment.data.path)" alt="Attachment Thumbnail"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
              <q-checkbox v-if="!dialog.singleSelectionMode" v-model="attachmentsData.selectedIds" :val="attachment.id"
                class="absolute top-2 left-2 z-10" size="sm" />
              <q-radio v-else v-model="attachmentsData.selectedIds" :val="attachment.id"
                class="absolute top-2 left-2 z-10" size="sm" />
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-3">
                <div v-if="editing.editingId === attachment.id && editing.editingField === 'name'" class="mb-2">
                  <input v-model="editing.editingValue" type="text" class="w-full px-2 py-1 rounded text-sm text-black"
                    @keyup.enter="saveEdit(attachment.id, 'name')" @blur="saveEdit(attachment.id, 'name')" autofocus />
                </div>
                <span v-else-if="attachment.data.name"
                  class="text-white text-sm font-semibold mb-2 truncate cursor-pointer hover:bg-white/20 px-1 rounded"
                  @click="startEdit(attachment.id, 'name', attachment.data.name)">
                  {{ attachment.data.name }}
                </span>
                <div v-if="editing.editingId === attachment.id && editing.editingField === 'description'"
                  class="w-full">
                  <input v-model="editing.editingValue" type="text" class="w-full px-2 py-1 rounded text-xs text-black"
                    @keyup.enter="saveEdit(attachment.id, 'description')" @blur="saveEdit(attachment.id, 'description')"
                    autofocus />
                </div>
                <span v-else-if="attachment.data.description"
                  class="text-white text-xs opacity-90 line-clamp-2 cursor-pointer hover:bg-white/20 px-1 rounded"
                  @click="startEdit(attachment.id, 'description', attachment.data.description)">
                  {{ attachment.data.description }}
                </span>
              </div>
              <div class="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <q-btn icon="delete" flat dense size="sm" color="negative" class="bg-red-500/90 hover:bg-red-600"
                  @click="deleteAttachment(attachmentsData.folderId, attachment.id)" />
              </div>
              <div v-if="isAttachmentSelected(attachment.id)"
                class="absolute top-2 right-2 bg-blue-400 text-white text-xs px-2 py-1 rounded shadow-lg font-bold z-10">
                Selezionato
              </div>
            </div>
          </div>
        </div>
        <div v-else class="flex justify-center items-center h-48">
          <q-spinner-dots size="40px" color="blue"></q-spinner-dots>
        </div>
      </q-card-section>

      <!-- Upload Form Section -->
      <q-separator />
      <q-card-section class="bg-gradient-to-br from-gray-50 to-white">
        <div class="space-y-4">
          <div class="text-h6 font-bold text-gray-800">⬆️ Carica Nuovo Allegato</div>

          <!-- File Upload Area -->
          <div @dragover.prevent @drop.prevent="handleDrop">
            <input id="resourceAttachment" type="file" class="hidden" accept="image/png,image/jpeg,video/mp4" multiple
              @change="handleAttachmentUpload" />
            <label for="resourceAttachment" class="block cursor-pointer">
              <div v-if="upload.attachmentPreviews.length === 0"
                class="border-4 border-dashed border-purple-300 rounded-2xl p-8 text-center transition-all duration-300 bg-purple-50 hover:border-purple-500 hover:bg-purple-100">
                <div class="text-4xl mb-3 animate-bounce">📤</div>
                <p class="text-gray-700 font-semibold">Clicca o trascina immagini qui</p>
                <p class="text-xs text-gray-500 mt-1">PNG/JPEG/MP4 (puoi selezionare più file)</p>
              </div>
              <div v-else class="space-y-3">
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  <div v-for="(item, index) in upload.attachmentPreviews" :key="index"
                    class="relative inline-block rounded-2xl overflow-hidden shadow-2xl group">
                    <img :src="item.preview" alt="Thumbnail preview"
                      class="max-w-full max-h-[150px] block rounded-2xl transition-transform duration-300 group-hover:scale-105" />
                    <button type="button" @click.prevent="removeAttachment(index)"
                      class="absolute top-2.5 right-2.5 bg-red-500/90 text-white border-0 rounded-full w-8 h-8 cursor-pointer text-lg transition-all duration-300 hover:bg-red-600 hover:rotate-90 hover:scale-110 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            </label>
          </div>

          <!-- Form Fields -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <q-input v-model="upload.newAttachment.name" outlined label="Nome Allegato" placeholder="Es. Logo Squadra"
              dense class="rounded-lg" :rules="[(val) => (val && val.trim() !== '') || 'Il nome è obbligatorio']" />
            <q-input v-model="upload.newAttachment.description" outlined label="Descrizione"
              placeholder="Es. Logo ufficiale della squadra" dense class="rounded-lg" />
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right" class="bg-gray-100 space-x-2">
        <q-btn label="Annulla" flat dense @click="resetUploadForm" />
        <q-btn label="Carica" color="positive" dense
          :disable="upload.attachmentPreviews.length === 0 || !upload.newAttachment.name.trim()"
          @click="uploadAttachment" />
        <span v-if="upload.attachmentPreviews.length > 0" class="text-sm text-gray-600">
          {{ upload.attachmentPreviews.length }} file(s) selezionato(i)
        </span>
        <q-separator vertical />
        <q-btn label="Elimina Selezionati" color="negative" flat dense :disable="!hasSelection"
          @click="deleteSelected" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script setup lang="ts" name="AttachmentsArchive">
import { computed, inject, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import type { UpdateAttachmentPayload } from '../../stores/attachments';
import { handleStatus } from 'src/helpers/errors';
import type { EventBus } from 'quasar';
import type { AttachmentType } from '../../interfaces/attachments';
import type { Globals } from 'src/interfaces/globals';
import type { ServerResponse, ValidationError } from 'src/interfaces/response';

const globals = inject('globals') as Globals;
const attachmentsStore = globals.stores.attachments;

const bus = inject<EventBus>('bus');

const dialog = ref({
  isVisible: false,
  isLoaded: true,
  singleSelectionMode: false,
});

const attachmentsData = ref({
  attachments: [] as AttachmentType[],
  total: 0,
  selectedIds: [] as string[] | string,
  folderId: '',
});

const upload = ref({
  attachmentFiles: [] as File[],
  attachmentPreviews: [] as { file: File; preview: string }[],
  newAttachment: { name: '', description: '' } as UpdateAttachmentPayload,
});

const editing = ref({
  editingId: null as string | null,
  editingField: null as 'name' | 'description' | null,
  editingValue: '',
});

const pagination = ref({
  currentPage: 1,
  itemsPerPage: 10,
});

const filters = ref({
  searchTitle: '',
});

const hasSearchQuery = computed(() => filters.value.searchTitle.trim().length > 0);
const selectedIdsList = computed(() => {
  if (Array.isArray(attachmentsData.value.selectedIds)) {
    return attachmentsData.value.selectedIds;
  }

  return attachmentsData.value.selectedIds ? [attachmentsData.value.selectedIds] : [];
});
const attachmentsCount = computed(() =>
  attachmentsData.value.total
);
const maxPages = computed(() =>
  Math.max(1, Math.ceil(Math.max(attachmentsCount.value, attachmentsData.value.total) / pagination.value.itemsPerPage)),
);
const visibleAttachments = computed(() => {
  if (!hasSearchQuery.value) {
    return attachmentsData.value.attachments;
  }

  return attachmentsData.value.attachments.slice(0, pagination.value.itemsPerPage);
});
const hasSelection = computed(() => selectedIdsList.value.length > 0);

const isAttachmentSelected = (attachmentId: string) => selectedIdsList.value.includes(attachmentId);

const isAllFilteredSelected = computed(() => {
  if (dialog.value.singleSelectionMode || !Array.isArray(attachmentsData.value.selectedIds)) {
    return false;
  }

  const visibleIds = visibleAttachments.value.map((attachment) => attachment.id);
  return visibleIds.length > 0 && visibleIds.every((id) => attachmentsData.value.selectedIds.includes(id));
});

const toggleSelectAllFiltered = () => {
  if (dialog.value.singleSelectionMode) {
    return;
  }

  if (!Array.isArray(attachmentsData.value.selectedIds)) {
    attachmentsData.value.selectedIds = [];
  }

  const visibleIds = visibleAttachments.value.map((attachment) => attachment.id);
  if (isAllFilteredSelected.value) {
    attachmentsData.value.selectedIds = attachmentsData.value.selectedIds.filter(
      (id) => !visibleIds.includes(id),
    );
    return;
  }

  attachmentsData.value.selectedIds = Array.from(
    new Set([...attachmentsData.value.selectedIds, ...visibleIds]),
  );
};

let searchDebounce: ReturnType<typeof setTimeout> | null = null;

const setLoadedState = (isLoaded: boolean) => {
  dialog.value.isLoaded = isLoaded;
};

const loadAttachments = async () => {
  const folderId = attachmentsData.value.folderId;
  if (!folderId) {
    attachmentsData.value.attachments = [];
    attachmentsData.value.total = 0;
    return;
  }

  setLoadedState(false);

  try {
    const response = hasSearchQuery.value
      ? await attachmentsStore.search(filters.value.searchTitle.trim(), folderId, pagination.value.itemsPerPage, pagination.value.currentPage)
      : await attachmentsStore.getAttachmentsByFolderId(
        folderId,
        pagination.value.itemsPerPage,
        pagination.value.currentPage,
      );

    attachmentsData.value.attachments = response ?? [];
    attachmentsData.value.total = attachmentsStore.total;
  } catch (error) {
    handleStatus(error as ServerResponse | ValidationError, bus!);
  } finally {
    setLoadedState(true);
  }
};

const resetUploadForm = () => {
  upload.value.attachmentFiles = [];
  upload.value.attachmentPreviews = [];
  upload.value.newAttachment.name = '';
  upload.value.newAttachment.description = '';
};

const handleAttachmentUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    Array.from(target.files).forEach((file) => processFile(file));
  }
};

const handleDrop = (event: DragEvent) => {
  const files = event.dataTransfer?.files;
  if (files) {
    Array.from(files).forEach((file) => processFile(file));
  }
};

const uploadAttachment = async () => {
  if (upload.value.attachmentPreviews.length === 0) {
    return;
  }

  for (const { preview } of upload.value.attachmentPreviews) {
    await attachmentsStore
      .addAttachment(attachmentsData.value.folderId, {
        ...upload.value.newAttachment,
        media: preview.substring(preview.indexOf(',') + 1),
      })
      .catch((error: ServerResponse | ValidationError) => {
        handleStatus(error, bus!);
        throw error;
      });
  }

  bus?.emit('success:general', {
    title: `${upload.value.attachmentPreviews.length} allegato(i) caricato(i) con successo!`,
    button: 'Chiudi',
  });
  await loadAttachments();
  resetUploadForm();
};

const processFile = (file: File) => {
  if (!upload.value.attachmentFiles.find((existingFile) => existingFile.name === file.name && existingFile.size === file.size)) {
    upload.value.attachmentFiles.push(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      upload.value.attachmentPreviews.push({
        file,
        preview: event.target?.result as string,
      });
    };
    reader.readAsDataURL(file);
  }
};

const removeAttachment = (index: number) => {
  upload.value.attachmentFiles.splice(index, 1);
  upload.value.attachmentPreviews.splice(index, 1);
};

const computedThumbnail = (path: string) => {
  const baseURL = String(process.env.ATTACHMENTS_URL ?? '#');
  return `${baseURL}/attachments/${path}`;
};

const onDialogHide = () => {
  bus?.emit('close:archive', {
    selectedAttachments: attachmentsData.value.selectedIds,
    singleSelectionMode: dialog.value.singleSelectionMode,
  });
};

const startEdit = (attachmentId: string, field: 'name' | 'description', currentValue: string) => {
  editing.value.editingId = attachmentId;
  editing.value.editingField = field;
  editing.value.editingValue = currentValue;
};

const updateAttachment = async (attachmentId: string, attachment: UpdateAttachmentPayload) => {
  await attachmentsStore
    .editAttachmentById(attachmentId, {
      name: attachment.name,
      description: attachment.description,
    })
    .catch((error: ServerResponse | ValidationError) => {
      handleStatus(error, bus!);
    });
};

const saveEdit = async (attachmentId: string, field: 'name' | 'description') => {
  if (editing.value.editingValue.trim()) {
    const attachment = attachmentsData.value.attachments.find((item) => item.id === attachmentId);
    if (attachment) {
      const payload: UpdateAttachmentPayload = {
        name: field === 'name' ? editing.value.editingValue : attachment.data.name,
        description: field === 'description' ? editing.value.editingValue : attachment.data.description,
      };
      await updateAttachment(attachmentId, payload);

      if (field === 'name') {
        attachment.data.name = editing.value.editingValue;
      } else {
        attachment.data.description = editing.value.editingValue;
      }
    }
  }

  editing.value.editingId = null;
  editing.value.editingField = null;
  editing.value.editingValue = '';
};

const reloadAfterDelete = async () => {
  if (!hasSearchQuery.value && attachmentsData.value.attachments.length === 0 && pagination.value.currentPage > 1) {
    pagination.value.currentPage -= 1;
    return;
  }

  await loadAttachments();
};

const deleteAttachment = async (folderId: string, attachmentId: string) => {
  try {
    await attachmentsStore.deleteAttachmentById(folderId, attachmentId);

    attachmentsData.value.attachments = attachmentsData.value.attachments.filter(
      (attachment) => attachment.id !== attachmentId,
    );
    attachmentsData.value.total = Math.max(0, attachmentsData.value.total - 1);

    if (Array.isArray(attachmentsData.value.selectedIds)) {
      attachmentsData.value.selectedIds = attachmentsData.value.selectedIds.filter(
        (selectedId) => selectedId !== attachmentId,
      );
    } else if (attachmentsData.value.selectedIds === attachmentId) {
      attachmentsData.value.selectedIds = '';
    }

    await reloadAfterDelete();
  } catch (error) {
    handleStatus(error as ServerResponse, bus!);
  }
};

const deleteSelected = async () => {
  if (!Array.isArray(attachmentsData.value.selectedIds) || attachmentsData.value.selectedIds.length === 0) {
    return;
  }

  const selectedIds = [...attachmentsData.value.selectedIds];

  try {
    await Promise.all(
      selectedIds.map((id) => attachmentsStore.deleteAttachmentById(attachmentsData.value.folderId, id)),
    );

    attachmentsData.value.attachments = attachmentsData.value.attachments.filter(
      (attachment) => !selectedIds.includes(attachment.id),
    );
    attachmentsData.value.total = Math.max(0, attachmentsData.value.total - selectedIds.length);
    attachmentsData.value.selectedIds = [];

    await reloadAfterDelete();
  } catch (error) {
    handleStatus(error as ServerResponse, bus!);
  }
};

watch(
  () => pagination.value.currentPage,
  () => {
    if (!dialog.value.isVisible) {
      return;
    }

    void loadAttachments();
  },
);

watch(
  () => filters.value.searchTitle,
  () => {
    pagination.value.currentPage = 1;

    if (!dialog.value.isVisible || !attachmentsData.value.folderId) {
      return;
    }

    if (searchDebounce) {
      clearTimeout(searchDebounce);
    }

    searchDebounce = setTimeout(() => {
      void loadAttachments();
    }, 350);
  },
);

watch(maxPages, (newMaxPages) => {
  if (pagination.value.currentPage > newMaxPages) {
    pagination.value.currentPage = newMaxPages;
  }
});

onMounted(() => {
  bus?.on(
    'open:archive',
    ({
      folderId: newFolderId,
      singleSelectionMode: newSingleSelectionMode,
      selectedAttachments: newSelectedAttachments,
    }: {
      folderId: string;
      singleSelectionMode: boolean;
      selectedAttachments: string[] | string;
    }) => {
      attachmentsData.value.folderId = newFolderId;
      dialog.value.singleSelectionMode = newSingleSelectionMode;
      attachmentsData.value.selectedIds = newSelectedAttachments;
      filters.value.searchTitle = '';
      pagination.value.currentPage = 1;
      dialog.value.isVisible = true;
      void loadAttachments();
    },
  );
});

onBeforeUnmount(() => {
  if (searchDebounce) {
    clearTimeout(searchDebounce);
  }

  bus?.off('open:archive');
});
</script>
