/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Základní URL backendu (v docker-compose.dev.yml: http://localhost:8081). */
  readonly VITE_API_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
