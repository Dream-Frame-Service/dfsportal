// Minimal typings to satisfy `import.meta.env` when Vite types are unavailable.
// Extend as needed for additional env vars.
declare module 'vite/client' {
  interface ImportMetaEnv {
    readonly VITE_SUPABASE_URL: string
    readonly VITE_SUPABASE_ANON_KEY: string
    // add custom vars below …
    [key: string]: string | undefined
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
}
