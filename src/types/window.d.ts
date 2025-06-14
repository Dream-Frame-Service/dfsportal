export {};

declare global {
    interface Window {
        ezsite?: typeof import("@/lib/ezsiteShim").ezsiteCompat;
    }
}
