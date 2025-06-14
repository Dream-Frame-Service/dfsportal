// Minimal fallback typings for `import.meta.env` etc.
// Removed once upstream `vite/client` types are available.
declare module "vite/client" {
    interface ImportMetaEnv {
        // add your custom env vars here (all must be typed as string)
        readonly VITE_SUPABASE_URL: string;
        readonly VITE_SUPABASE_ANON_KEY: string;
        // eslint-disable-next-line @typescript-eslint/ban-types
        [key: string]: string | undefined;
    }

    interface ImportMeta {
        readonly env: ImportMetaEnv;
    }
}
