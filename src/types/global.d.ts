// Global type declarations for the DFS Manager Portal

import { ezsiteApisReplacement } from '../services/supabaseService';

declare global {
  interface Window {
    ezsite: {
      apis: typeof ezsiteApisReplacement;
    };
  }
}

export {};
