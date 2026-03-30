type ApiAccountEndpoints = {
  STORE_GETME: string;
  STORE_EDITME: string;
  STORE_EDITTHUMBNAIL: string;
};

type ApiUserEndpoints = {
  STORE_LISTUSERS: (per_page?: number, page?: number) => string;
  STORE_CREATEUSER: string;
  STORE_GETUSER: (userId: string) => string;
  STORE_EDITUSER: (userId: string) => string;
  STORE_DELETEUSER: (userId: string) => string;
  STORE_RESETPASSWORD: (userId: string) => string;
};

type ApiFolderEndpoints = {
  STORE_LISTFOLDERS: (per_page?: number) => string;
  STORE_GETFOLDER: (folderId: string) => string;
  STORE_ADDFOLDER: (parentId?: string) => string;
  STORE_EDITFOLDER: (folderId: string) => string;
  STORE_DELETEFOLDER: (folderId: string) => string;
};

type ApiResourceEndpoints = {
  STORE_LISTRESOURCES: string;
  STORE_GETRESOURCE: (resourceId: string, per_page?: number) => string;
  STORE_ADDRESOURCE: (folderId?: string) => string;
  STORE_EDITRESOURCE: (resourceId: string) => string;
  STORE_DELETERESOURCE: (resourceId: string) => string;
};

type ApiAttachmentsEndpoints = {
  STORE_GETATTACHMENTS: (folderId: string, per_page?: number, page?: number) => string;
  STORE_SEARCHATTACHMENTS: (query: string, folderId: string) => string;
  STORE_ADDATTACHMENT: (folderId: string) => string;
  STORE_DELETEATTACHMENT: (folderId: string, attachmentId: string) => string;
  STORE_EDITATTACHMENT: (attachmentId: string) => string;
};

type ApiMappingsEndpoints = {
  STORE_LISTMAPPINGS: string;
  STORE_ADDMAPPING: string;
  STORE_DELETEMAPPING: (mappingId: string) => string;
};

type ApiTokenEndpoints = {
  STORE_LISTTOKENS: (tokenId: string | null) => string;
  STORE_LISTCAPABILITIES: string;
  STORE_ADDTOKEN: string;
  STORE_DELETETOKEN: (tokenId: string) => string;
};

type ApiMetricsEndpoints = {
  STORE_GETRESOURCESMETRICS: string;
  STORE_GETFOLDERSMETRICS: string;
  STORE_GETUSERSMETRICS: string;
  STORE_GETPOSTMETRICS: string;
};

export type {
  ApiAccountEndpoints,
  ApiUserEndpoints,
  ApiFolderEndpoints,
  ApiResourceEndpoints,
  ApiAttachmentsEndpoints,
  ApiMappingsEndpoints,
  ApiTokenEndpoints,
  ApiMetricsEndpoints,
};
