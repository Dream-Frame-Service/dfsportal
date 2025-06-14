import {
    AuthService,
    EmailService,
    SupabaseService,
} from "@/services/supabaseService";

/* --------------------------------------------------------------
   Minimal table-ID → table-name map.
   Extend this list as you migrate more tables.
-----------------------------------------------------------------*/
const TABLE_MAP: Record<string | number, string> = {
    11725: "user_profiles",
    11726: "products",
    11727: "employees",
    11728: "salary", // example
    11729: "vendors",
    11730: "orders",
    11731: "licenses",
    12356: "sales_reports",
    12599: "stations",
    12612: "sms_contacts",
    12613: "sms_history",
    12640: "sms_providers",
    12641: "sms_templates",
    12642: "alert_schedules",
    12706: "audit_logs",
    // ...add the rest as needed
};

type TableId = keyof typeof TABLE_MAP | string | number;

/* --------------------------------------------------------------
   Helper – converts ezsite filter format to Supabase filters.
   Currently supports basic Equal / StringContains.
-----------------------------------------------------------------*/
const applyFilters = <T extends keyof any>(
    base: ReturnType<typeof SupabaseService.readRecords<T>>,
    filters: any[] | undefined,
) => {
    let q: any = base;
    (filters || []).forEach((f) => {
        switch (f.op) {
            case "Equal":
                q = q.eq(f.name, f.value);
                break;
            case "StringContains":
                q = q.ilike(f.name, `%${f.value}%`);
                break;
            default:
                // fallback
                q = q.eq(f.name, f.value);
        }
    });
    return q;
};

/* --------------------------------------------------------------
   API façade
-----------------------------------------------------------------*/
const ezsiteApis = {
    /* ----------------------------------------------------------
     tablePage – list with paging
  ---------------------------------------------------------- */
    async tablePage<T extends TableId>(
        tableId: T,
        {
            PageNo = 1,
            PageSize = 100,
            OrderByField = "id",
            IsAsc = false,
            Filters = [],
            Select,
        }: any = {},
    ) {
        const table = TABLE_MAP[tableId] || tableId.toString();
        const { data, count, error } = await SupabaseService.readRecords(
            table as any,
            {
                page: PageNo,
                pageSize: PageSize,
                orderBy: OrderByField,
                ascending: IsAsc,
                filters: Filters,
                select: Select || "*",
            },
        );

        return {
            data: {
                List: data,
                VirtualCount: count,
            },
            error,
        };
    },

    /* ---------------------------------------------------------- */
    async tableCreate(tableId: TableId, payload: any) {
        const table = TABLE_MAP[tableId] || tableId.toString();
        const data = await SupabaseService.createRecord(table as any, payload);
        return { data, error: null };
    },

    /* ---------------------------------------------------------- */
    async tableUpdate(tableId: TableId, payload: any) {
        const table = TABLE_MAP[tableId] || tableId.toString();
        const { ID, id = ID, ...rest } = payload;
        return SupabaseService.updateRecord(table as any, id, rest);
    },

    /* ---------------------------------------------------------- */
    async tableDelete(tableId: TableId, { ID }: { ID: number }) {
        const table = TABLE_MAP[tableId] || tableId.toString();
        return SupabaseService.deleteRecord(table as any, ID);
    },

    /* ---------------------------------------------------------- */
    async upload({ filename, file }: { filename: string; file: File }) {
        const path = `${Date.now()}_${filename}`;
        return SupabaseService.uploadFile("uploads", path, file);
    },

    /* ---------------------------------------------------------- */
    sendEmail: EmailService.sendEmail,

    register: AuthService.register,
    getUserInfo: AuthService.getCurrentUser,
};

/* --------------------------------------------------------------
   Attach only once
-----------------------------------------------------------------*/
declare global {
    interface Window {
        ezsite?: { apis: typeof ezsiteApis };
    }
}

if (!window.ezsite) {
    window.ezsite = { apis: ezsiteApis };
}
