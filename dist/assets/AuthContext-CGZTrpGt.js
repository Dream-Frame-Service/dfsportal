import "./ui-BAZ8HTBl.js";
import { r as reactExports } from "./vendor-Dw3NhmYV.js";
import { m as supabase } from "./index-BDkJIub7.js";
function getTableName(table) {
  return typeof table === "symbol" ? String(table) : table;
}
async function createRecord(table, data) {
  const tableName = getTableName(table);
  try {
    const { data: result, error } = await supabase.from(table).insert(data).select().single();
    if (error) {
      console.error(`Error creating ${tableName}:`, error);
      return null;
    }
    return result;
  } catch (err) {
    console.error(`Error creating ${tableName}:`, err);
    return null;
  }
}
async function readRecords(table, options = {}) {
  try {
    const {
      page = 1,
      pageSize = 10,
      orderBy = "id",
      ascending = false,
      filters = [],
      select = "*"
    } = options;
    let query = supabase.from(table).select(select, { count: "exact" });
    filters.forEach((filter) => {
      const { column, operator, value } = filter;
      switch (operator.toLowerCase()) {
        case "eq":
          query = query.eq(column, value);
          break;
        case "neq":
          query = query.neq(column, value);
          break;
        case "gt":
          query = query.gt(column, value);
          break;
        case "gte":
          query = query.gte(column, value);
          break;
        case "lt":
          query = query.lt(column, value);
          break;
        case "lte":
          query = query.lte(column, value);
          break;
        case "like":
          query = query.like(column, `%${value}%`);
          break;
        case "ilike":
          query = query.ilike(column, `%${value}%`);
          break;
        default:
          query = query.eq(column, value);
      }
    });
    query = query.order(orderBy, { ascending });
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);
    const { data, count, error } = await query;
    if (error) {
      console.error(`Error reading ${table}:`, error);
      return { data: null, count: null, error: error.message };
    }
    return { data, count, error: null };
  } catch (err) {
    console.error(`Error reading ${table}:`, err);
    return { data: null, count: null, error: "An unexpected error occurred" };
  }
}
async function updateRecord(table, id, data) {
  try {
    const { data: result, error } = await supabase.from(table).update(data).eq("id", id).select().single();
    if (error) {
      console.error(`Error updating ${table}:`, error);
      return { data: null, error: error.message };
    }
    return { data: result, error: null };
  } catch (err) {
    console.error(`Error updating ${table}:`, err);
    return { data: null, error: "An unexpected error occurred" };
  }
}
async function deleteRecord(table, id) {
  try {
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) {
      console.error(`Error deleting from ${table}:`, error);
      return { error: error.message };
    }
    return { error: null };
  } catch (err) {
    console.error(`Error deleting from ${table}:`, err);
    return { error: "An unexpected error occurred" };
  }
}
async function batchCreate(table, data) {
  try {
    const { data: result, error } = await supabase.from(table).insert(data).select();
    if (error) {
      console.error(`Error batch creating ${table}:`, error);
      return { data: null, error: error.message };
    }
    return { data: result, error: null };
  } catch (err) {
    console.error(`Error batch creating ${table}:`, err);
    return { data: null, error: "An unexpected error occurred" };
  }
}
async function batchUpdate(table, updates) {
  try {
    const results = await Promise.all(
      updates.map(({ id, data: data2 }) => updateRecord(table, id, data2))
    );
    const errors = results.filter((r) => r.error).map((r) => r.error);
    if (errors.length > 0) {
      return { data: null, error: errors.join(", ") };
    }
    const data = results.map((r) => r.data).filter(Boolean);
    return { data, error: null };
  } catch (err) {
    console.error(`Error batch updating ${table}:`, err);
    return { data: null, error: "An unexpected error occurred" };
  }
}
async function batchDelete(table, ids) {
  try {
    const { error } = await supabase.from(table).delete().in("id", ids);
    if (error) {
      console.error(`Error batch deleting from ${table}:`, error);
      return { error: error.message };
    }
    return { error: null };
  } catch (err) {
    console.error(`Error batch deleting from ${table}:`, err);
    return { error: "An unexpected error occurred" };
  }
}
async function uploadFile(bucket, path, file) {
  try {
    const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
      cacheControl: "3600",
      upsert: false
    });
    if (error) {
      console.error("Error uploading file:", error);
      return { data: null, error: error.message };
    }
    return { data, error: null };
  } catch (err) {
    console.error("Error uploading file:", err);
    return { data: null, error: "An unexpected error occurred" };
  }
}
function getFileUrl(bucket, path) {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
class EmailService {
  static async sendEmail(emailData) {
    try {
      console.log("📧 Email would be sent:", {
        from: emailData.from,
        to: emailData.to,
        subject: emailData.subject,
        preview: `${emailData.html.substring(0, 100)}...`
      });
      return {
        data: {
          message: "Email logged successfully (development mode)",
          emailData
        },
        error: null
      };
    } catch (error) {
      console.error("Error in sendEmail:", error);
      return {
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }
}
class AuthService {
  static async getCurrentUser() {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        return {
          data: null,
          error: (authError == null ? void 0 : authError.message) || "User not authenticated"
        };
      }
      const { data: profile, error: profileError } = await supabase.from("user_profiles").select("*").eq("user_id", user.id).single();
      if (profileError) {
        return {
          data: {
            id: user.id,
            email: user.email,
            role: "Employee",
            created_at: user.created_at
          },
          error: null
        };
      }
      return {
        data: {
          id: user.id,
          email: user.email,
          ...profile
        },
        error: null
      };
    } catch (error) {
      console.error("Error in getCurrentUser:", error);
      return {
        data: null,
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }
  static async register(credentials) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password
      });
      if (error) {
        console.error("Supabase registration error:", error);
        return { data: null, error: error.message };
      }
      return { data, error: null };
    } catch (error) {
      console.error("Error in register:", error);
      return {
        data: null,
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }
}
const SupabaseService = {
  createRecord,
  readRecords,
  updateRecord,
  deleteRecord,
  batchCreate,
  batchUpdate,
  batchDelete,
  uploadFile,
  getFileUrl,
  deleteFile,
  subscribeToChanges,
  unsubscribeFromChanges,
  executeRpc,
  searchRecords
};
const AuthContext = reactExports.createContext(void 0);
const useAuth = () => {
  const context = reactExports.useContext(AuthContext);
  if (context === void 0) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
export {
  AuthContext as A,
  EmailService as E,
  SupabaseService as S,
  AuthService as a,
  useAuth as u
};
//# sourceMappingURL=AuthContext-CGZTrpGt.js.map
