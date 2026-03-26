<template>
  <!-- Folder List -->
  <div
    class="p-6 bg-white rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
  >
    <div class="text-xs font-bold text-gray-600 uppercase tracking-wide mb-3 select-none">
      <q-icon name="folder" class="inline-block mr-1" size="sm" />
    </div>
    <q-tree v-if="isLoaded" :nodes="formattedFolderTree" node-key="id" default-expand-all>
      <template v-slot:default-header="prop">
        <div
          class="flex items-center gap-2 w-full cursor-pointer"
          :class="{ 'bg-blue-100 rounded px-2 py-1': selectedFolderId === prop.node.id }"
          @click="selectFolderId(prop.node)"
        >
          <q-btn
            v-if="editingId === prop.node.id"
            flat
            dense
            round
            size="sm"
            :style="{ backgroundColor: editData.color }"
            class="flex-shrink-0"
          >
            <q-popup-proxy>
              <q-color v-model="editData.color" />
            </q-popup-proxy>
          </q-btn>
          <div
            v-else
            class="w-3 h-3 rounded-full flex-shrink-0"
            :style="{ backgroundColor: prop.node.color }"
          ></div>

          <input
            v-if="editingId === prop.node.id"
            type="text"
            v-model="editData.name"
            class="flex-grow px-2 py-1 border rounded text-sm"
          />
          <span v-else class="flex-grow">{{ prop.node.name }}</span>

          <select
            @click.stop
            v-if="editingId === prop.node.id"
            v-model="editData.visibility"
            class="px-2 py-1 border rounded text-xs"
          >
            <option :value="editData.visibility?.length ? editData.visibility : randomString">
              {{ editData.visibility?.length ? editData.visibility : randomString }}
            </option>
            <option value="">Public</option>
          </select>
          <span v-else class="text-xs text-gray-500 select-all">{{
            prop.node.visibility || 'public'
          }}</span>

          <!-- Action buttons -->
          <div class="flex gap-1">
            <q-btn
              v-if="editingId === prop.node.id"
              flat
              dense
              round
              size="sm"
              icon="check"
              color="green"
              @click.stop="onSave(prop.node)"
            />
            <q-btn v-else flat dense round size="sm" icon="add" @click.stop="onAdd(prop.node)" />
            <q-btn
              v-if="editingId === prop.node.id"
              flat
              dense
              round
              size="sm"
              icon="close"
              color="red"
              @click.stop="onCancel"
            />
            <q-btn
              v-else
              flat
              dense
              round
              size="sm"
              icon="edit"
              @click.stop="onEditStart(prop.node)"
            />
            <q-btn
              flat
              :disabled="!prop.node.pid"
              dense
              round
              size="sm"
              icon="delete"
              @click.stop="onRemove(prop.node)"
            />
            <q-btn
              v-if="prop.node.visibility"
              flat
              dense
              round
              size="sm"
              icon="share"
              color="orange"
              @click.stop="onShare(prop.node)"
            />
          </div>
        </div>
      </template>
    </q-tree>
    <div v-else class="flex justify-center items-center h-32">
      <q-spinner-dots size="36px" color="gray" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, inject, onMounted, ref } from 'vue';
import { handleStatus } from 'src/helpers/errors';
import type { EventBus } from 'quasar';
import type { Folder } from '../../interfaces/folders';
import type { Globals } from 'src/interfaces/globals';
import type { ServerResponse, ValidationError } from 'src/interfaces/response';

type FormattedFolder = Folder & { children?: FormattedFolder[] };

const globals = inject('globals') as Globals;
const foldersStore = globals.stores.folders;

const bus = inject<EventBus>('bus');
const folderTree = ref<Folder[]>([]);
const formattedFolderTree = ref<FormattedFolder[]>([]);
const isLoaded = ref(false);
const editingId = ref<string | null>(null);
const editData = ref<Partial<Folder>>({});
const selectedFolderId = ref<string | null>(null);

const hashString = async (message: string) => {
  // Encode the string as a Uint8Array
  const msgBuffer = new TextEncoder().encode(message);

  // Hash the message using SHA-256
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

  // Convert the ArrayBuffer to a hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => ('00' + b.toString(16)).slice(-2)).join('');

  return hashHex;
};

const onShare = async (node: Folder) => {
  const url = `${globals.endpoints.HOMEPAGE_URL}/private/${node.id}/${(await hashString(node.visibility)).substring(0, 32)}`;
  await navigator.clipboard.writeText(url);
  bus?.emit('success:general', {
    title: 'URL della cartella copiato negli appunti!',
    button: 'Chiudi',
  });
};

const getFolders = (nodeId?: string) => {
  if (!nodeId) {
    foldersStore
      .getFolderList()
      .then((folders) => {
        folderTree.value = folders || [];
        formattedFolderTree.value = foldersStore.formatFoldersForTree(folderTree.value);
        isLoaded.value = true;
      })
      .catch((error: ServerResponse) => {
        handleStatus(error, bus!);
      });
  } else {
    foldersStore.getFolderById(nodeId).catch((error: ServerResponse) => {
      handleStatus(error, bus!);
    });
  }
};

onMounted(() => {
  getFolders();
});

const selectFolderId = (folder: Folder) => {
  if (folder.pid) {
    selectedFolderId.value = folder.id;
    bus?.emit('select:folder', folder.id);
    bus?.emit('select:resource', null);
  }
};

const onAdd = (node: Folder) => {
  isLoaded.value = false;
  foldersStore
    .addFolder({ pid: node.id, name: 'Nuova Cartella', color: '#CCCCCC' })
    .then(() => {
      bus?.emit('success:general', { title: 'Cartella creata correttamente!', button: 'Chiudi' });
      getFolders();
    })
    .catch((error: ServerResponse | ValidationError) => {
      handleStatus(error, bus!);
    });
};

const randomString = computed(() => {
  return Math.random().toString(36).substring(2, 10);
});

const onSave = (node: Folder) => {
  isLoaded.value = false;
  foldersStore
    .editFolderById(node.id, editData.value)
    .then(() => {
      bus?.emit('success:general', {
        title: 'Cartella modificata correttamente!',
        button: 'Chiudi',
      });
      getFolders();
      editingId.value = null;
      editData.value = {};
    })
    .catch((error: ServerResponse | ValidationError) => {
      handleStatus(error, bus!);
    });
};

const onRemove = (node: Folder) => {
  isLoaded.value = false;
  foldersStore
    .deleteFolderById(node.id)
    .then(() => {
      bus?.emit('success:general', {
        title: 'Cartella eliminata correttamente!',
        button: 'Chiudi',
      });
      getFolders();
    })
    .catch((error: ServerResponse) => {
      handleStatus(error, bus!);
    });
};

const onCancel = () => {
  editingId.value = null;
  editData.value = {};
};

const onEditStart = (node: Folder) => {
  editingId.value = node.id;
  editData.value = { ...node };
};
</script>
