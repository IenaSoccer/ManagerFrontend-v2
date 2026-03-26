import { defineStore } from 'pinia';
import axios from 'axios';
import type { ApiFolderEndpoints } from '../interfaces/endpoints';
import type { ServerResponse } from 'src/interfaces/response';
import type { Folder } from '../interfaces/folders';

interface State {
  folders: Folder[] | null;
}

type UpdateFolderPayload = Omit<Partial<Folder>, 'id'>;
interface FolderNode extends Folder {
  children?: FolderNode[];
}

export const useFoldersStore = defineStore('FoldersStore', {
  state: (): State => ({
    folders: null,
  }),
  getters: {
    pageInfo(): ApiFolderEndpoints {
      const base = String(process.env.API_URL ?? '#');
      return {
        STORE_LISTFOLDERS: (per_page?: number) =>
          `${base}/folders${per_page ? `?per_page=${per_page}` : ''}`,
        STORE_GETFOLDER: (folderId: string) => `${base}/folders/${folderId}`,
        STORE_ADDFOLDER: (parentId?: string) => `${base}/folders/${parentId ?? ''}`,
        STORE_EDITFOLDER: (folderId: string) => `${base}/folders/${folderId}`,
        STORE_DELETEFOLDER: (folderId: string) => `${base}/folders/${folderId}`,
      };
    },
  },

  actions: {
    async getFolderList(per_page?: number): Promise<Folder[] | null> {
      const response = axios.get<ServerResponse>(this.pageInfo.STORE_LISTFOLDERS(per_page));

      return response
        .then((res) => {
          const content = res.data?.body?.content?.data as Folder[] | undefined;
          this.folders = content ?? null;
          return this.folders;
        })
        .catch((err) => {
          if (axios.isAxiosError(err)) throw err.response?.data ?? err;
          throw err;
        });
    },
    async getFolderById(folderId: string): Promise<Folder | null> {
      const response = axios.get<ServerResponse>(this.pageInfo.STORE_GETFOLDER(folderId));

      return response
        .then((res) => {
          const content = res.data?.body?.content as Folder | undefined;
          return content ?? null;
        })
        .catch((err) => {
          if (axios.isAxiosError(err)) throw err.response?.data ?? err;
          throw err;
        });
    },
    async editFolderById(
      folderId: string,
      folder: UpdateFolderPayload,
    ): Promise<UpdateFolderPayload | null> {
      const response = axios.post<ServerResponse>(this.pageInfo.STORE_EDITFOLDER(folderId), folder);

      return response
        .then((res) => {
          const content = res.data?.body?.content as UpdateFolderPayload | undefined;
          return content ?? null;
        })
        .catch((err) => {
          if (axios.isAxiosError(err)) throw err.response?.data ?? err;
          throw err;
        });
    },
    async deleteFolderById(folderId: string): Promise<string | null> {
      const response = axios.delete<ServerResponse>(this.pageInfo.STORE_DELETEFOLDER(folderId));

      return response
        .then((res) => {
          const content = res.data?.body?.content as string | undefined;
          return content ?? null;
        })
        .catch((err) => {
          if (axios.isAxiosError(err)) throw err.response?.data ?? err;
          throw err;
        });
    },
    async addFolder(folder: Partial<Folder>): Promise<number | null> {
      const response = axios.put<ServerResponse>(
        this.pageInfo.STORE_ADDFOLDER(folder.pid ?? ''),
        folder,
      );

      return response
        .then((res) => {
          const code = res.data?.body?.content as number | undefined;
          return code ?? null;
        })
        .catch((err) => {
          if (axios.isAxiosError(err)) throw err.response?.data ?? err;
          throw err;
        });
    },
    formatFoldersForTree(folders: Folder[]): FolderNode[] {
      const folderMap: Map<string, FolderNode> = new Map();
      const tree: FolderNode[] = [];

      folders.forEach((folder) => {
        folderMap.set(folder.id, { ...folder, children: [] });
      });

      folders.forEach((folder) => {
        const node = folderMap.get(folder.id)!;
        if (folder.pid && folderMap.has(folder.pid)) {
          const parent = folderMap.get(folder.pid)!;
          if (!parent.children) parent.children = [];
          parent.children.push(node);
        } else {
          tree.push(node);
        }
      });

      return tree;
    },
  },
});
