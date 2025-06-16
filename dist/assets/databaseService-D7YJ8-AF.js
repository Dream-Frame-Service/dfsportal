import { S as SupabaseService, E as EmailService, a as AuthService } from "./AuthContext-CGZTrpGt.js";
const TABLE_MAP = {
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
  12611: "sms_settings"
};
const convertFilters = (filters = []) => {
  return filters.map((filter) => {
    const { name, op, value } = filter;
    let operator = "eq";
    switch (op) {
      case "Equal":
        operator = "eq";
        break;
      case "StringContains":
        operator = "ilike";
        break;
      case "GreaterThan":
        operator = "gt";
        break;
      case "LessThan":
        operator = "lt";
        break;
      case "GreaterThanOrEqual":
        operator = "gte";
        break;
      case "LessThanOrEqual":
        operator = "lte";
        break;
      default:
        operator = "eq";
    }
    return {
      column: name,
      operator,
      value: op === "StringContains" ? `%${value}%` : value
    };
  });
};
class DatabaseService {
  // List records with pagination (replaces ezsite tablePage)
  static async tablePage(tableId, options = {}) {
    const {
      PageNo = 1,
      PageSize = 100,
      OrderByField = "id",
      IsAsc = false,
      Filters = [],
      Select = "*"
    } = options;
    const tableName = TABLE_MAP[tableId] || tableId.toString();
    const supabaseFilters = convertFilters(Filters);
    try {
      const { data, count, error } = await SupabaseService.readRecords(
        tableName,
        {
          page: PageNo,
          pageSize: PageSize,
          orderBy: OrderByField,
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
        error: err instanceof Error ? err.message : "Unknown error"
      };
    }
  }
  // Create record (replaces ezsite tableCreate)
  static async tableCreate(tableId, payload) {
    const tableName = TABLE_MAP[tableId] || tableId.toString();
    try {
      const data = await SupabaseService.createRecord(tableName, payload);
      return { data, error: null };
    } catch (err) {
      console.error(`Error in tableCreate for ${tableName}:`, err);
      return {
        data: null,
        error: err instanceof Error ? err.message : "Unknown error"
      };
    }
  }
  // Update record (replaces ezsite tableUpdate)
  static async tableUpdate(tableId, payload) {
    const tableName = TABLE_MAP[tableId] || tableId.toString();
    const { ID, id = ID, ...rest } = payload;
    try {
      const result = await SupabaseService.updateRecord(tableName, id, rest);
      return result;
    } catch (err) {
      console.error(`Error in tableUpdate for ${tableName}:`, err);
      return {
        data: null,
        error: err instanceof Error ? err.message : "Unknown error"
      };
    }
  }
  // Delete record (replaces ezsite tableDelete)
  static async tableDelete(tableId, { ID }) {
    const tableName = TABLE_MAP[tableId] || tableId.toString();
    try {
      const result = await SupabaseService.deleteRecord(tableName, ID);
      return result;
    } catch (err) {
      console.error(`Error in tableDelete for ${tableName}:`, err);
      return {
        error: err instanceof Error ? err.message : "Unknown error"
      };
    }
  }
  // File upload (replaces ezsite upload)
  static async upload({ filename, file }) {
    var _a;
    try {
      const path = `${Date.now()}_${filename}`;
      const result = await SupabaseService.uploadFile("uploads", path, file);
      if (result.error) {
        return { data: null, error: result.error };
      }
      return { data: (_a = result.data) == null ? void 0 : _a.path, error: null };
    } catch (err) {
      console.error("Error in upload:", err);
      return {
        data: null,
        error: err instanceof Error ? err.message : "Unknown error"
      };
    }
  }
  // Send email (replaces ezsite sendEmail)
  static async sendEmail(emailData) {
    try {
      return await EmailService.sendEmail(emailData);
    } catch (err) {
      console.error("Error in sendEmail:", err);
      return {
        data: null,
        error: err instanceof Error ? err.message : "Unknown error"
      };
    }
  }
  // User registration (replaces ezsite register)
  static async register(credentials) {
    try {
      return await AuthService.register(credentials);
    } catch (err) {
      console.error("Error in register:", err);
      return {
        data: null,
        error: err instanceof Error ? err.message : "Unknown error"
      };
    }
  }
  // Get current user info (replaces ezsite getUserInfo)
  static async getUserInfo() {
    try {
      return await AuthService.getCurrentUser();
    } catch (err) {
      console.error("Error in getUserInfo:", err);
      return {
        data: null,
        error: err instanceof Error ? err.message : "Unknown error"
      };
    }
  }
}
export {
  DatabaseService as D
};
//# sourceMappingURL=databaseService-D7YJ8-AF.js.map
