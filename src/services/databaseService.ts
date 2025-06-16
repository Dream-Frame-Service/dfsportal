import { SupabaseService, AuthService, EmailService } from '@/services/supabaseService';

/* --------------------------------------------------------------
   Table ID to table name mapping
   This maintains compatibility with the existing numeric table IDs
-----------------------------------------------------------------*/
const TABLE_MAP: Record<string | number, string> = {
    11725: "user_profiles",
    11726: "products", 
    11727: "employees",
    11728: "salary",
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
    11756: "product_logs",
    12196: "notifications",
    12611: "sms_settings",
};

type TableId = keyof typeof TABLE_MAP | string | number;

/* --------------------------------------------------------------
   Convert ezsite-style filters to Supabase filters
-----------------------------------------------------------------*/
const convertFilters = (filters: any[] = []) => {
    return filters.map(filter => {
        const { name, op, value } = filter;
        let operator = 'eq';
        
        switch (op) {
            case 'Equal':
                operator = 'eq';
                break;
            case 'StringContains':
                operator = 'ilike';
                break;
            case 'GreaterThan':
                operator = 'gt';
                break;
            case 'LessThan':
                operator = 'lt';
                break;
            case 'GreaterThanOrEqual':
                operator = 'gte';
                break;
            case 'LessThanOrEqual':
                operator = 'lte';
                break;
            default:
                operator = 'eq';
        }
        
        return {
            column: name,
            operator,
            value: op === 'StringContains' ? `%${value}%` : value
        };
    });
};

/* --------------------------------------------------------------
   Database Service - Direct Supabase API calls
-----------------------------------------------------------------*/
export class DatabaseService {
    
    // List records with pagination (replaces ezsite tablePage)
    static async tablePage<T extends TableId>(
        tableId: T,
        options: {
            PageNo?: number;
            PageSize?: number;
            OrderByField?: string;
            IsAsc?: boolean;
            Filters?: any[];
            Select?: string;
        } = {}
    ) {
        const {
            PageNo = 1,
            PageSize = 100,
            OrderByField = 'id',
            IsAsc = false,
            Filters = [],
            Select = '*'
        } = options;
        
        const tableName = TABLE_MAP[tableId] || tableId.toString();
        const supabaseFilters = convertFilters(Filters);
        
        try {
            const { data, count, error } = await SupabaseService.readRecords(
                tableName as any,
                {
                    page: PageNo,
                    pageSize: PageSize,
                    orderBy: OrderByField as any,
                    ascending: IsAsc,
                    filters: supabaseFilters,
                    select: Select
                }
            );
            
            if (error) {
                return { data: null, error };
            }
            
            return {
                data: {
                    List: data,
                    VirtualCount: count
                },
                error: null
            };
        } catch (err) {
            console.error(`Error in tablePage for ${tableName}:`, err);
            return {
                data: null,
                error: err instanceof Error ? err.message : 'Unknown error'
            };
        }
    }
    
    // Create record (replaces ezsite tableCreate)
    static async tableCreate<T extends TableId>(tableId: T, payload: any) {
        const tableName = TABLE_MAP[tableId] || tableId.toString();
        
        try {
            const data = await SupabaseService.createRecord(tableName as any, payload);
            return { data, error: null };
        } catch (err) {
            console.error(`Error in tableCreate for ${tableName}:`, err);
            return {
                data: null,
                error: err instanceof Error ? err.message : 'Unknown error'
            };
        }
    }
    
    // Update record (replaces ezsite tableUpdate)
    static async tableUpdate<T extends TableId>(tableId: T, payload: any) {
        const tableName = TABLE_MAP[tableId] || tableId.toString();
        const { ID, id = ID, ...rest } = payload;
        
        try {
            const result = await SupabaseService.updateRecord(tableName as any, id, rest);
            return result;
        } catch (err) {
            console.error(`Error in tableUpdate for ${tableName}:`, err);
            return {
                data: null,
                error: err instanceof Error ? err.message : 'Unknown error'
            };
        }
    }
    
    // Delete record (replaces ezsite tableDelete)
    static async tableDelete<T extends TableId>(tableId: T, { ID }: { ID: number }) {
        const tableName = TABLE_MAP[tableId] || tableId.toString();
        
        try {
            const result = await SupabaseService.deleteRecord(tableName as any, ID);
            return result;
        } catch (err) {
            console.error(`Error in tableDelete for ${tableName}:`, err);
            return {
                error: err instanceof Error ? err.message : 'Unknown error'
            };
        }
    }
    
    // File upload (replaces ezsite upload)
    static async upload({ filename, file }: { filename: string; file: File }) {
        try {
            const path = `${Date.now()}_${filename}`;
            const result = await SupabaseService.uploadFile('uploads', path, file);
            
            if (result.error) {
                return { data: null, error: result.error };
            }
            
            // Return the file path as the data (similar to ezsite behavior)
            return { data: result.data?.path, error: null };
        } catch (err) {
            console.error('Error in upload:', err);
            return {
                data: null,
                error: err instanceof Error ? err.message : 'Unknown error'
            };
        }
    }
    
    // Send email (replaces ezsite sendEmail)
    static async sendEmail(emailData: {
        from: string;
        to: string | string[];
        subject: string;
        html: string;
        text?: string;
    }) {
        try {
            return await EmailService.sendEmail(emailData);
        } catch (err) {
            console.error('Error in sendEmail:', err);
            return {
                data: null,
                error: err instanceof Error ? err.message : 'Unknown error'
            };
        }
    }
    
    // User registration (replaces ezsite register)
    static async register(credentials: { email: string; password: string }) {
        try {
            return await AuthService.register(credentials);
        } catch (err) {
            console.error('Error in register:', err);
            return {
                data: null,
                error: err instanceof Error ? err.message : 'Unknown error'
            };
        }
    }
    
    // Get current user info (replaces ezsite getUserInfo)
    static async getUserInfo() {
        try {
            return await AuthService.getCurrentUser();
        } catch (err) {
            console.error('Error in getUserInfo:', err);
            return {
                data: null,
                error: err instanceof Error ? err.message : 'Unknown error'
            };
        }
    }
}

// Export as default for easy importing
export default DatabaseService;
