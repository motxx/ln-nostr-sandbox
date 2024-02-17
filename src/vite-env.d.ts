/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_NOSTR_CLIENT_PROFILE_NPUB: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
