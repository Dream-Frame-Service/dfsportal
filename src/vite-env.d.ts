/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_SUPABASE_PROJECT_ID?: string;
  readonly VITE_APP_ENVIRONMENT?: string;
  readonly VITE_S3_ENDPOINT?: string;
  readonly VITE_S3_REGION?: string;
  readonly VITE_S3_ACCESS_KEY_ID?: string;
  readonly VITE_S3_SECRET_ACCESS_KEY?: string;
  readonly VITE_DEFAULT_STORAGE_BUCKET?: string;
  readonly VITE_S3_FORCE_PATH_STYLE?: string;
  readonly VITE_S3_SIGNATURE_VERSION?: string;
  readonly VITE_DEMO_MODE?: string;
  readonly VITE_SKIP_AUTH?: string;
  readonly VITE_MOCK_DATA?: string;
  readonly MODE: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly SSR: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
  readonly VITE_APP_ENVIRONMENT: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_ENABLE_REALTIME: string
  readonly VITE_ENABLE_ANALYTICS: string
  readonly VITE_ENABLE_DEBUG: string
  readonly VITE_SECURE_COOKIES: string
  readonly VITE_HTTPS_ONLY: string
  readonly VITE_TWILIO_ACCOUNT_SID: string
  readonly VITE_TWILIO_AUTH_TOKEN: string
  readonly VITE_S3_ENDPOINT: string
  readonly VITE_S3_REGION: string
  readonly VITE_S3_ACCESS_KEY_ID: string
  readonly VITE_S3_SECRET_ACCESS_KEY: string
  readonly VITE_DEFAULT_STORAGE_BUCKET: string
  readonly MODE: string
  readonly DEV: boolean
  readonly PROD: boolean
  readonly SSR: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
