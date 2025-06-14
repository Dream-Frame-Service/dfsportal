/* -------------------------------------------------------------
   Global shims – keep the TypeScript compiler quiet.
   This intentionally uses very relaxed types (any / unknown)
   so existing code keeps working while you migrate away from
   the old ezsite helpers.
----------------------------------------------------------------*/
export {}; // ensure this is treated as a module

declare global {
    // 1)  ezsite   ------------------------------------------------
    interface EzsiteApis {
        tablePage: (...args: any[]) => Promise<{ data?: any; error?: any }>;
        tableCreate: (...args: any[]) => Promise<{ error?: any }>;
        tableUpdate: (...args: any[]) => Promise<{ error?: any }>;
        tableDelete: (...args: any[]) => Promise<{ error?: any }>;
        upload: (...args: any[]) => Promise<{ data?: any; error?: any }>;
        sendEmail: (...args: any[]) => Promise<{ error?: any }>;
        register: (...args: any[]) => Promise<{ error?: any }>;
        getUserInfo: () => Promise<{ data?: any; error?: any }>;
    }

    interface Window {
        ezsite: { apis: EzsiteApis };
    }

    // 2)  widen the <input size> attribute so "sm" etc. are allowed
    namespace JSX {
        interface IntrinsicElements {
            // add string support without losing number
            input:
                & React.DetailedHTMLProps<
                    React.InputHTMLAttributes<HTMLInputElement>,
                    HTMLInputElement
                >
                & { size?: number | string };
        }
    }
}

/* 3)  Missing module dummies ---------------------------------- */
declare module "motion/react" {
    const x: any;
    export = x;
}
declare module "@radix-ui/react-slider" {
    const x: any;
    export = x;
}
declare module "next-themes" {
    export const useTheme: () => any;
}
