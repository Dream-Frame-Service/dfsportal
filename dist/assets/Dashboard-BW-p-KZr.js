import { r as reactExports, u as useNavigate, j as jsxRuntimeExports } from "./react-vendor-DX0Gaxph.js";
import { u as useToast, s as supabase } from "./admin-core-CknIDYcP.js";
import "./vendor-ChWeSoXy.js";
import "./aws-sdk-DF6-bWA6.js";
import "./ui-components-svEX1DXz.js";
import "./supabase-DWlqU2OS.js";
const Dashboard = () => {
  var _a;
  const [user, setUser] = reactExports.useState(null);
  const [profile, setProfile] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  const [debugInfo, setDebugInfo] = reactExports.useState({
    supabaseUrl: "",
    hasAnonKey: false,
    authStatus: "checking",
    networkRequests: [],
    rlsError: null
  });
  const navigate = useNavigate();
  const { toast } = useToast();
  reactExports.useEffect(() => {
    const checkSupabaseConfig = () => {
      const url = "https://vetufvhzmawjbsumtplq.supabase.co";
      console.log("🔧 Supabase Configuration Check:");
      console.log("URL:", `${url.substring(0, 30)}...`);
      console.log("Anon Key:", "SET");
      setDebugInfo((prev) => ({
        ...prev,
        supabaseUrl: url,
        hasAnonKey: true
      }));
      return true;
    };
    const fetchDashboardData = async () => {
      var _a2, _b, _c;
      try {
        setLoading(true);
        if (!checkSupabaseConfig()) {
          return;
        }
        console.log("🔐 Checking authentication...");
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.error("❌ Session error:", sessionError);
          throw sessionError;
        }
        console.log("📊 Session status:", session ? "Active" : "No session");
        const { data: { user: user2 }, error: userError } = await supabase.auth.getUser();
        setDebugInfo((prev) => ({
          ...prev,
          authStatus: user2 ? "authenticated" : "not authenticated",
          networkRequests: [...prev.networkRequests, {
            type: "auth.getUser",
            success: !userError,
            timestamp: (/* @__PURE__ */ new Date()).toISOString()
          }]
        }));
        if (userError) {
          console.error("❌ Error fetching user:", userError);
          throw userError;
        }
        if (!user2) {
          console.log("🚪 No user found, redirecting to login");
          navigate("/login");
          return;
        }
        console.log("✅ User authenticated:", user2.id);
        setUser(user2);
        console.log("📝 Fetching user profile...");
        const { data: profileData, error: profileError } = await supabase.from("profiles").select("*").eq("id", user2.id).single();
        setDebugInfo((prev) => ({
          ...prev,
          networkRequests: [...prev.networkRequests, {
            type: "profiles.select",
            success: !profileError,
            error: profileError == null ? void 0 : profileError.message,
            timestamp: (/* @__PURE__ */ new Date()).toISOString()
          }]
        }));
        if (profileError) {
          console.error("❌ Error fetching profile:", profileError);
          if ((_a2 = profileError.message) == null ? void 0 : _a2.includes("policy")) {
            setDebugInfo((prev) => ({
              ...prev,
              rlsError: "Row Level Security (RLS) policy may be blocking access to profiles table"
            }));
          }
          if (profileError.code === "PGRST116") {
            console.log("📝 Profile not found, creating new profile...");
            const { data: newProfile, error: createError } = await supabase.from("profiles").insert([
              {
                id: user2.id,
                email: user2.email,
                updated_at: (/* @__PURE__ */ new Date()).toISOString()
              }
            ]).select().single();
            setDebugInfo((prev) => ({
              ...prev,
              networkRequests: [...prev.networkRequests, {
                type: "profiles.insert",
                success: !createError,
                error: createError == null ? void 0 : createError.message,
                timestamp: (/* @__PURE__ */ new Date()).toISOString()
              }]
            }));
            if (createError) {
              console.error("❌ Error creating profile:", createError);
              if ((_b = createError.message) == null ? void 0 : _b.includes("policy")) {
                setDebugInfo((prev) => ({
                  ...prev,
                  rlsError: "RLS policy is blocking profile creation. Check INSERT policy for profiles table."
                }));
              }
              throw createError;
            }
            setProfile(newProfile);
            console.log("✅ Profile created successfully");
          } else {
            throw profileError;
          }
        } else {
          setProfile(profileData);
          console.log("✅ Profile fetched successfully");
        }
        console.log("🧪 Testing access to other tables...");
        const tables = ["chats", "messages", "wisdom"];
        for (const table of tables) {
          try {
            const { error: tableError } = await supabase.from(table).select("id").limit(1);
            setDebugInfo((prev) => ({
              ...prev,
              networkRequests: [...prev.networkRequests, {
                type: `${table}.select`,
                success: !tableError,
                error: tableError == null ? void 0 : tableError.message,
                timestamp: (/* @__PURE__ */ new Date()).toISOString()
              }]
            }));
            if ((_c = tableError == null ? void 0 : tableError.message) == null ? void 0 : _c.includes("policy")) {
              console.warn(`⚠️ RLS issue with ${table} table:`, tableError.message);
            }
          } catch (err) {
            console.error(`❌ Error testing ${table} table:`, err);
          }
        }
      } catch (err) {
        console.error("❌ Dashboard data fetch error:", err);
        setError(err.message);
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Check console for details.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        var _a2;
        console.log("🔄 Auth state changed:", event, (_a2 = session == null ? void 0 : session.user) == null ? void 0 : _a2.id);
        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          await fetchDashboardData();
        } else if (event === "SIGNED_OUT") {
          navigate("/login");
        }
      }
    );
    fetchDashboardData();
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center min-h-screen", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4", children: "Loading dashboard..." })
    ] }) });
  }
  if (error) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center min-h-screen", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center max-w-2xl mx-auto p-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-red-600 mb-4", children: "Dashboard Error" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-red-500 mb-4", children: [
        "Error: ",
        error
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-100 p-4 rounded text-left mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold mb-2", children: "Debug Information:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Supabase URL:" }),
            " ",
            debugInfo.supabaseUrl
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Anon Key:" }),
            " ",
            debugInfo.hasAnonKey ? "Present" : "Missing"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Auth Status:" }),
            " ",
            debugInfo.authStatus
          ] }),
          debugInfo.rlsError && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-red-600", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "RLS Error:" }),
            " ",
            debugInfo.rlsError
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => window.location.reload(),
          className: "px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600",
          children: "Refresh Page"
        }
      )
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold mb-4", children: "Dashboard" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-100 p-4 rounded mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold mb-2", children: "Debug Info:" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-medium", children: "User Info:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm", children: [
            "User ID: ",
            user == null ? void 0 : user.id
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm", children: [
            "Email: ",
            user == null ? void 0 : user.email
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm", children: [
            "Auth Status: ",
            debugInfo.authStatus
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-medium", children: "Supabase Config:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm", children: [
            "URL: ",
            (_a = debugInfo.supabaseUrl) == null ? void 0 : _a.substring(0, 30),
            "..."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm", children: [
            "Anon Key: ",
            debugInfo.hasAnonKey ? "✅ Set" : "❌ Missing"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-medium", children: "Profile Data:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "text-xs bg-white p-2 rounded overflow-auto", children: JSON.stringify(profile, null, 2) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-medium", children: "Network Requests:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1 text-xs", children: debugInfo.networkRequests.map((req, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `p-1 ${req.success ? "bg-green-100" : "bg-red-100"}`, children: [
          req.timestamp,
          ": ",
          req.type,
          " - ",
          req.success ? "✅ Success" : `❌ Failed: ${req.error}`
        ] }, i)) })
      ] }),
      debugInfo.rlsError && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 p-3 bg-red-100 border border-red-300 rounded", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-red-700 font-medium", children: "⚠️ RLS Policy Issue Detected:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-red-600 text-sm", children: debugInfo.rlsError })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" })
  ] });
};
export {
  Dashboard as default
};
