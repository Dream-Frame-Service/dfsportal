import { supabase, type Database } from '@/lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

// Generic types for database operations
type TableName = keyof Database['public']['Tables'];
type TableRow<T extends TableName> = Database['public']['Tables'][T]['Row'];
type TableInsert<T extends TableName> = Database['public']['Tables'][T]['Insert'];
type TableUpdate<T extends TableName> = Database['public']['Tables'][T]['Update'];

// Real-time subscription manager
class RealtimeManager {
  private channels: Map<string, RealtimeChannel> = new Map();

  subscribe<T extends TableName>(
  table: T,
  callback: (payload: any) => void,
  filters?: {column: string;eq: string | number;}[])
  : () => void {
    const channelName = `${table}_${Date.now()}`;

    let subscription = supabase.
    channel(channelName).
    on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: table as string,
        ...(filters && { filter: filters.map((f) => `${f.column}=eq.${f.eq}`).join(',') })
      },
      callback
    );

    subscription.subscribe();
    this.channels.set(channelName, subscription);

    // Return unsubscribe function
    return () => {
      const channel = this.channels.get(channelName);
      if (channel) {
        supabase.removeChannel(channel);
        this.channels.delete(channelName);
      }
    };
  }

  unsubscribeAll() {
    this.channels.forEach((channel) => {
      supabase.removeChannel(channel);
    });
    this.channels.clear();
  }
}

export const realtimeManager = new RealtimeManager();

// Generic CRUD operations
export class SupabaseService {
  // Create (Insert)
  static async create<T extends TableName>(
  table: T,
  data: TableInsert<T>)
  : Promise<{data: TableRow<T> | null;error: string | null;}> {
    try {
      const { data: result, error } = await supabase.
      from(table).
      insert(data as any).
      select().
      single();

      if (error) {
        console.error(`Error creating ${table}:`, error);
        return { data: null, error: error.message };
      }

      return { data: result, error: null };
    } catch (err) {
      console.error(`Error creating ${table}:`, err);
      return { data: null, error: 'An unexpected error occurred' };
    }
  }

  // Read (Select with pagination)
  static async read<T extends TableName>(
  table: T,
  options: {
    page?: number;
    pageSize?: number;
    orderBy?: keyof TableRow<T>;
    ascending?: boolean;
    filters?: {column: keyof TableRow<T>;operator: string;value: any;}[];
    select?: string;
  } = {})
  : Promise<{
    data: TableRow<T>[] | null;
    count: number | null;
    error: string | null;
  }> {
    try {
      const {
        page = 1,
        pageSize = 10,
        orderBy = 'id' as keyof TableRow<T>,
        ascending = false,
        filters = [],
        select = '*'
      } = options;

      let query = supabase.
      from(table).
      select(select, { count: 'exact' });

      // Apply filters
      filters.forEach((filter) => {
        const { column, operator, value } = filter;
        switch (operator.toLowerCase()) {
          case 'eq':
            query = query.eq(column as string, value);
            break;
          case 'neq':
            query = query.neq(column as string, value);
            break;
          case 'gt':
            query = query.gt(column as string, value);
            break;
          case 'gte':
            query = query.gte(column as string, value);
            break;
          case 'lt':
            query = query.lt(column as string, value);
            break;
          case 'lte':
            query = query.lte(column as string, value);
            break;
          case 'like':
            query = query.like(column as string, `%${value}%`);
            break;
          case 'ilike':
            query = query.ilike(column as string, `%${value}%`);
            break;
          default:
            query = query.eq(column as string, value);
        }
      });

      // Apply ordering
      query = query.order(orderBy as string, { ascending });

      // Apply pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, count, error } = await query;

      if (error) {
        console.error(`Error reading ${table}:`, error);
        return { data: null, count: null, error: error.message };
      }

      return { data: (data as unknown) as TableRow<T>[], count, error: null };
    } catch (err) {
      console.error(`Error reading ${table}:`, err);
      return { data: null, count: null, error: 'An unexpected error occurred' };
    }
  }

  // Update
  static async update<T extends TableName>(
  table: T,
  id: number,
  data: TableUpdate<T>)
  : Promise<{data: TableRow<T> | null;error: string | null;}> {
    try {
      const { data: result, error } = await supabase.
      from(table).
      update(data as any).
      eq('id', id).
      select().
      single();

      if (error) {
        console.error(`Error updating ${table}:`, error);
        return { data: null, error: error.message };
      }

      return { data: result, error: null };
    } catch (err) {
      console.error(`Error updating ${table}:`, err);
      return { data: null, error: 'An unexpected error occurred' };
    }
  }

  // Delete
  static async delete<T extends TableName>(
  table: T,
  id: number)
  : Promise<{error: string | null;}> {
    try {
      const { error } = await supabase.
      from(table).
      delete().
      eq('id', id);

      if (error) {
        console.error(`Error deleting from ${table}:`, error);
        return { error: error.message };
      }

      return { error: null };
    } catch (err) {
      console.error(`Error deleting from ${table}:`, err);
      return { error: 'An unexpected error occurred' };
    }
  }

  // Batch operations
  static async batchCreate<T extends TableName>(
  table: T,
  data: TableInsert<T>[])
  : Promise<{data: TableRow<T>[] | null;error: string | null;}> {
    try {
      const { data: result, error } = await supabase.
      from(table).
      insert(data as any).
      select();

      if (error) {
        console.error(`Error batch creating ${table}:`, error);
        return { data: null, error: error.message };
      }

      return { data: result, error: null };
    } catch (err) {
      console.error(`Error batch creating ${table}:`, err);
      return { data: null, error: 'An unexpected error occurred' };
    }
  }

  static async batchUpdate<T extends TableName>(
  table: T,
  updates: {id: number;data: TableUpdate<T>;}[])
  : Promise<{data: TableRow<T>[] | null;error: string | null;}> {
    try {
      const results = await Promise.all(
        updates.map(({ id, data }) => this.update(table, id, data))
      );

      const errors = results.filter((r) => r.error).map((r) => r.error);
      if (errors.length > 0) {
        return { data: null, error: errors.join(', ') };
      }

      const data = results.map((r) => r.data).filter(Boolean) as TableRow<T>[];
      return { data, error: null };
    } catch (err) {
      console.error(`Error batch updating ${table}:`, err);
      return { data: null, error: 'An unexpected error occurred' };
    }
  }

  static async batchDelete<T extends TableName>(
  table: T,
  ids: number[])
  : Promise<{error: string | null;}> {
    try {
      const { error } = await supabase.
      from(table).
      delete().
      in('id', ids);

      if (error) {
        console.error(`Error batch deleting from ${table}:`, error);
        return { error: error.message };
      }

      return { error: null };
    } catch (err) {
      console.error(`Error batch deleting from ${table}:`, err);
      return { error: 'An unexpected error occurred' };
    }
  }

  // File upload
  static async uploadFile(
  bucket: string,
  path: string,
  file: File)
  : Promise<{data: {path: string;} | null;error: string | null;}> {
    try {
      const { data, error } = await supabase.storage.
      from(bucket).
      upload(path, file, {
        cacheControl: '3600',
        upsert: false
      });

      if (error) {
        console.error('Error uploading file:', error);
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (err) {
      console.error('Error uploading file:', err);
      return { data: null, error: 'An unexpected error occurred' };
    }
  }

  // Get file URL
  static getFileUrl(bucket: string, path: string): string {
    const { data } = supabase.storage.
    from(bucket).
    getPublicUrl(path);

    return data.publicUrl;
  }
}

// ========================================
// LEGACY API COMPATIBILITY LAYER
// ========================================

// Table ID to table name mapping for legacy ezsite compatibility
const LEGACY_TABLE_MAPPING: Record<string | number, string> = {
  11725: 'user_profiles',
  11726: 'products',
  11727: 'employees',
  11728: 'inventory',
  11729: 'vendors',
  11730: 'orders',
  11731: 'licenses',
  11788: 'salary_records',
  12356: 'sales_reports',
  12599: 'stations',
  12611: 'sms_alert_settings',
  12612: 'sms_contacts',
  12613: 'sms_alert_history',
  12640: 'sms_providers',
  12641: 'sms_templates',
  12706: 'system_logs'
};

// Legacy filter operators mapping
const LEGACY_OPERATOR_MAPPING: Record<string, string> = {
  'Equal': 'eq',
  'NotEqual': 'neq',
  'GreaterThan': 'gt',
  'GreaterThanOrEqual': 'gte',
  'LessThan': 'lt',
  'LessThanOrEqual': 'lte',
  'Contains': 'ilike',
  'StartsWith': 'like',
  'EndsWith': 'like'
};

export interface LegacyFilterItem {
  name: string;
  op: string;
  value: any;
}

export interface LegacyTablePageRequest {
  PageNo: number;
  PageSize: number;
  OrderByField?: string;
  IsAsc?: boolean;
  Filters?: LegacyFilterItem[];
}

export interface LegacyTablePageResponse<T = any> {
  data: {
    List: T[];
    VirtualCount: number;
  } | null;
  error: string | null;
}

export interface LegacyApiResponse {
  data?: any;
  error?: string | null;
}

/**
 * Legacy API Service - provides compatibility with existing window.ezsite.apis calls
 * This allows for gradual migration without breaking existing code
 */
export class LegacyApiService {
  // Get table name from legacy ID
  private getTableName(tableId: string | number): string {
    const tableName = LEGACY_TABLE_MAPPING[tableId];
    if (!tableName) {
      console.warn(`Unknown legacy table ID: ${tableId}, using as table name`);
      return tableId.toString();
    }
    return tableName;
  }

  // Convert legacy filter operator
  private convertOperator(op: string): string {
    const supabaseOp = LEGACY_OPERATOR_MAPPING[op];
    if (!supabaseOp) {
      console.warn(`Unknown legacy operator: ${op}, using 'eq'`);
      return 'eq';
    }
    return supabaseOp;
  }

  // Format filter value for LIKE operations
  private formatFilterValue(op: string, value: any): any {
    if (op === 'Contains') {
      return `%${value}%`;
    } else if (op === 'StartsWith') {
      return `${value}%`;
    } else if (op === 'EndsWith') {
      return `%${value}`;
    }
    return value;
  }

  // Legacy tablePage implementation
  async tablePage<T = any>(tableId: string | number, request: LegacyTablePageRequest): Promise<LegacyTablePageResponse<T>> {
    try {
      const tableName = this.getTableName(tableId);
      
      let query = supabase
        .from(tableName)
        .select('*', { count: 'exact' });

      // Apply filters
      if (request.Filters && request.Filters.length > 0) {
        request.Filters.forEach(filter => {
          const operator = this.convertOperator(filter.op);
          const value = this.formatFilterValue(filter.op, filter.value);
          
          // Handle different operators
          switch (operator) {
            case 'eq':
              query = query.eq(filter.name, value);
              break;
            case 'neq':
              query = query.neq(filter.name, value);
              break;
            case 'gt':
              query = query.gt(filter.name, value);
              break;
            case 'gte':
              query = query.gte(filter.name, value);
              break;
            case 'lt':
              query = query.lt(filter.name, value);
              break;
            case 'lte':
              query = query.lte(filter.name, value);
              break;
            case 'ilike':
              query = query.ilike(filter.name, value);
              break;
            case 'like':
              query = query.like(filter.name, value);
              break;
            default:
              query = query.eq(filter.name, value);
          }
        });
      }

      // Apply ordering
      if (request.OrderByField) {
        const ascending = request.IsAsc !== false; // Default to ascending
        query = query.order(request.OrderByField, { ascending });
      }

      // Apply pagination
      const from = (request.PageNo - 1) * request.PageSize;
      const to = from + request.PageSize - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        console.error('Supabase query error:', error);
        return {
          data: null,
          error: error.message
        };
      }

      return {
        data: {
          List: data || [],
          VirtualCount: count || 0
        },
        error: null
      };
    } catch (error) {
      console.error('Error in legacy tablePage:', error);
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Legacy tableCreate implementation
  async tableCreate(tableId: string | number, data: any): Promise<LegacyApiResponse> {
    try {
      const tableName = this.getTableName(tableId);
      
      // Remove ID field if it exists as Supabase handles auto-increment
      const insertData = { ...data };
      delete insertData.ID;
      delete insertData.id;

      const { data: result, error } = await supabase
        .from(tableName)
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('Supabase insert error:', error);
        return { error: error.message };
      }

      return { data: result, error: null };
    } catch (error) {
      console.error('Error in legacy tableCreate:', error);
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Legacy tableUpdate implementation
  async tableUpdate(tableId: string | number, data: any): Promise<LegacyApiResponse> {
    try {
      const tableName = this.getTableName(tableId);
      
      // Extract ID for the update
      const id = data.ID || data.id;
      if (!id) {
        return { error: 'No ID provided for update' };
      }

      // Remove ID from update data
      const updateData = { ...data };
      delete updateData.ID;
      delete updateData.id;

      const { data: result, error } = await supabase
        .from(tableName)
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Supabase update error:', error);
        return { error: error.message };
      }

      return { data: result, error: null };
    } catch (error) {
      console.error('Error in legacy tableUpdate:', error);
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Legacy tableDelete implementation
  async tableDelete(tableId: string | number, data: any): Promise<LegacyApiResponse> {
    try {
      const tableName = this.getTableName(tableId);
      
      // Extract ID for the delete
      const id = data.ID || data.id;
      if (!id) {
        return { error: 'No ID provided for delete' };
      }

      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Supabase delete error:', error);
        return { error: error.message };
      }

      return { error: null };
    } catch (error) {
      console.error('Error in legacy tableDelete:', error);
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Legacy getUserInfo implementation
  async getUserInfo(): Promise<LegacyApiResponse> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        return { error: authError?.message || 'User not authenticated' };
      }

      // Try to get user profile from user_profiles table
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileError) {
        // If no profile exists, return basic user info
        return {
          data: {
            ID: user.id,
            email: user.email,
            role: 'Employee', // Default role
            created_at: user.created_at
          },
          error: null
        };
      }

      // Return user info with profile data
      return {
        data: {
          ID: user.id,
          email: user.email,
          ...profile
        },
        error: null
      };
    } catch (error) {
      console.error('Error in legacy getUserInfo:', error);
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Legacy register implementation
  async register(credentials: { email: string; password: string }): Promise<LegacyApiResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password
      });

      if (error) {
        console.error('Supabase registration error:', error);
        return { error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error in legacy register:', error);
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Legacy sendEmail implementation
  async sendEmail(emailData: {
    from: string;
    to: string | string[];
    subject: string;
    html: string;
    text?: string;
  }): Promise<LegacyApiResponse> {
    try {
      // For now, we'll simulate email sending for development
      // In production, this would integrate with an email service like Resend, SendGrid, etc.
      console.log('📧 Email would be sent:', {
        from: emailData.from,
        to: emailData.to,
        subject: emailData.subject,
        preview: emailData.html.substring(0, 100) + '...'
      });

      // You can replace this with actual email service integration
      // For example, using Supabase Edge Functions:
      /*
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: emailData
      });
      
      if (error) {
        console.error('Email sending error:', error);
        return { error: error.message };
      }
      
      return { data, error: null };
      */

      // For development, simulate successful email
      return { 
        data: { 
          message: 'Email logged successfully (development mode)',
          emailData 
        }, 
        error: null 
      };
    } catch (error) {
      console.error('Error in legacy sendEmail:', error);
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Legacy file upload method
  async upload(uploadData: {
    filename: string;
    file: File;
  }): Promise<LegacyApiResponse> {
    try {
      // Use Supabase Storage for file uploads
      const fileName = `${Date.now()}_${uploadData.filename}`;
      const { data, error } = await supabase.storage
        .from('documents') // You may need to create this bucket in Supabase
        .upload(fileName, uploadData.file);

      if (error) throw error;

      // Return the file ID/path for compatibility
      return { 
        data: data.path, // Return the file path as the "file ID"
        error: null 
      };
    } catch (error) {
      console.error('Error in legacy upload:', error);
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}

// Export singleton instance for legacy compatibility
export const legacyApiService = new LegacyApiService();

// Create a window.ezsite.apis replacement object
export const ezsiteApisReplacement = {
  tablePage: legacyApiService.tablePage.bind(legacyApiService),
  tableCreate: legacyApiService.tableCreate.bind(legacyApiService),
  tableUpdate: legacyApiService.tableUpdate.bind(legacyApiService),
  tableDelete: legacyApiService.tableDelete.bind(legacyApiService),
  getUserInfo: legacyApiService.getUserInfo.bind(legacyApiService),
  register: legacyApiService.register.bind(legacyApiService),
  sendEmail: legacyApiService.sendEmail.bind(legacyApiService),
  upload: legacyApiService.upload.bind(legacyApiService)
};