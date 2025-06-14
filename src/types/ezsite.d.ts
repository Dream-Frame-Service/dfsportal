/* eslint-disable @typescript-eslint/consistent-type-imports */
import type { ezsiteApis } from "@/lib/ezsitePolyfill";

declare global {
    interface Window {
        ezsite: {
            apis: typeof ezsiteApis;
        };
    }
}

export {};
