/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_API_END_POINT: string
  readonly VITE_STORAGE_URL: string
  readonly VITE_WEBSOCKET_URL: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
