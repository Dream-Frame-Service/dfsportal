import { SupabaseService } from "@/services/supabaseService";

// Map the numeric EZSite “tableId” to real Supabase table names
const TABLE_MAP: Record<number | string, string> = {
    11725: "user_permissions",
    11726: "role_permissions",
    11727: "roles",
    11729: "expenses",
    11731: "inventory",
    12599: "stations",
    12611: "sms_settings",
    12612: "sms_contacts",
    12613: "sms_history",
    12640: "sms_configs",
    12641: "sms_templates",
    12706: "audit_logs",
    // add others as required …
};

// Helpers
function getTable(tableId: number | string): string {
    const table = TABLE_MAP[tableId];
    if (!table) throw new Error(`Unknown tableId ${tableId}`);
    return table;
}

async function safe<T>(
    fn: () => Promise<T>,
): Promise<{ data?: T; error?: any }> {
    try {
        return { data: await fn() };
    } catch (error) {
        console.error(error);
        return { error };
    }
}

export const ezsiteCompat = {
    apis: {
        tablePage: async (tableId: number | string, _params: any) => {
            const table = getTable(tableId);
            const { data, error } = await SupabaseService.readRecords(
                table as any,
                {
                    page: _params?.PageNo ?? 1,
                    pageSize: _params?.PageSize ?? 100,
                },
            );
            return { data: { List: data ?? [] }, error };
        },

        tableCreate: async (tableId: number | string, payload: any) =>
            safe(() =>
                SupabaseService.createRecord(getTable(tableId) as any, payload)
            ),

        tableUpdate: async (tableId: number | string, payload: any) =>
            safe(() =>
                SupabaseService.updateRecord(
                    getTable(tableId) as any,
                    payload.ID,
                    payload,
                )
            ),

        tableDelete: async (tableId: number | string, payload: any) =>
            safe(() =>
                SupabaseService.deleteRecord(
                    getTable(tableId) as any,
                    payload.ID,
                )
            ),

        upload: async ({ bucket = "public", path, file }: any) =>
            safe(() => SupabaseService.uploadFile(bucket, path, file)),
    },
};

// Attach once to window so existing code keeps compiling
if (typeof window !== "undefined") {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore – we extend the Window object below in a .d.ts file
    window.ezsite = ezsiteCompat;
}
