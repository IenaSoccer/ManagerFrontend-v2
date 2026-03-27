declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    VUE_ROUTER_MODE: 'hash' | 'history' | 'abstract' | undefined;
    VUE_ROUTER_BASE: string | undefined;

    API_URL: string | undefined;
    HOMEPAGE_URL: string | undefined;
    MEDIA_URL: string | undefined;
    ATTACHMENTS_URL: string | undefined;
    PROFILE_URL: string | undefined;
  }
}
