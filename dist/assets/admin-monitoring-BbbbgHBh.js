var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { r as reactExports, j as jsxRuntimeExports } from "./react-vendor-DX0Gaxph.js";
import { o as useAdminAccess, u as useToast, Q as useBatchSelection, s as supabase, p as AccessDenied, B as Button, C as Card, g as CardContent, R as BatchActionBar, I as Input, S as Select, h as SelectTrigger, i as SelectValue, j as SelectContent, k as SelectItem, d as CardHeader, e as CardTitle, z as Table, E as TableHeader, F as TableRow, G as TableHead, U as Checkbox, H as TableBody, J as TableCell, l as Badge, V as BatchDeleteDialog, P as Progress, A as Alert, m as AlertDescription, T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent, f as CardDescription, W as AlertTitle } from "./admin-core-DFYqoWCM.js";
import { a4 as FileText, Y as RefreshCw, aa as Download, ab as CircleX, H as TriangleAlert, aU as Info, a1 as Search, ai as Clock, a7 as User, a0 as CircleCheckBig, F as Shield, M as Database, ao as Trash2, a5 as Zap, a_ as HardDrive, ak as TrendingUp, ba as Cpu, Z as Activity, b7 as Code, f as ChevronDown, bb as Lightbulb, bc as BookOpen, _ as Target, ah as Play, bd as Square, be as Timer, bf as MousePointer, a2 as Settings, aB as Eye, b8 as Funnel, $ as ChartColumn } from "./ui-components-E8Qujiw2.js";
const SystemLogs = () => {
  const { isAdmin } = useAdminAccess();
  const [logs, setLogs] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(false);
  const [searchTerm, setSearchTerm] = reactExports.useState("");
  const [selectedLevel, setSelectedLevel] = reactExports.useState("All");
  const [selectedCategory, setSelectedCategory] = reactExports.useState("All");
  const [dateRange, setDateRange] = reactExports.useState("today");
  const [isBatchDeleteDialogOpen, setIsBatchDeleteDialogOpen] = reactExports.useState(false);
  const [batchActionLoading, setBatchActionLoading] = reactExports.useState(false);
  const { toast } = useToast();
  const batchSelection = useBatchSelection();
  const logLevels = ["Success", "Failed", "Blocked", "Suspicious"];
  const categories = ["Login", "Logout", "Failed Login", "Registration", "Password Reset", "Data Access", "Data Modification", "Permission Change", "Admin Action"];
  const dateRanges = [
    { value: "today", label: "Today" },
    { value: "week", label: "Last 7 days" },
    { value: "month", label: "Last 30 days" },
    { value: "all", label: "All time" }
  ];
  reactExports.useEffect(() => {
    fetchAuditLogs();
  }, []);
  const fetchAuditLogs = async () => {
    try {
      console.log("Fetching audit logs from database...");
      const { data, error } = await supabase.from("audit_logs").select("*").order("event_timestamp", { ascending: false }).limit(100);
      if (error) {
        console.error("Error fetching audit logs:", error);
        setLogs([]);
        return;
      }
      console.log("Audit logs data received:", data);
      setLogs(data || []);
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      toast({
        title: "Error",
        description: "Failed to fetch system logs",
        variant: "destructive"
      });
      setLogs([]);
    }
  };
  const refreshLogs = async () => {
    setLoading(true);
    try {
      await fetchAuditLogs();
      toast({
        title: "Logs Refreshed",
        description: "System logs have been updated"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh logs",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const exportLogs = () => {
    const filteredLogs2 = getFilteredLogs();
    const csvContent = [
      ["Timestamp", "Event Type", "Status", "User", "Action", "Resource", "IP Address", "Station"],
      ...filteredLogs2.map(
        (log) => [
          log.event_timestamp,
          log.event_type,
          log.event_status,
          log.username || "",
          log.action_performed || "",
          log.resource_accessed || "",
          log.ip_address || "",
          log.station || ""
        ]
      )
    ].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-logs-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    toast({
      title: "Export Complete",
      description: "Audit logs have been exported to CSV file"
    });
  };
  const handleBatchDelete = () => {
    const selectedData = batchSelection.getSelectedData(filteredLogs, (log) => log.id);
    if (selectedData.length === 0) {
      toast({
        title: "No Selection",
        description: "Please select log entries to delete",
        variant: "destructive"
      });
      return;
    }
    setIsBatchDeleteDialogOpen(true);
  };
  const confirmBatchDelete = async () => {
    setBatchActionLoading(true);
    try {
      const selectedData = batchSelection.getSelectedData(filteredLogs, (log) => log.id);
      const selectedIds = selectedData.map((log) => log.id);
      const remainingLogs = logs.filter((log) => !selectedIds.includes(log.id));
      setLogs(remainingLogs);
      toast({
        title: "Success",
        description: `Deleted ${selectedData.length} log entries successfully`
      });
      setIsBatchDeleteDialogOpen(false);
      batchSelection.clearSelection();
    } catch (error) {
      console.error("Error in batch delete:", error);
      toast({
        title: "Error",
        description: `Failed to delete log entries: ${error}`,
        variant: "destructive"
      });
    } finally {
      setBatchActionLoading(false);
    }
  };
  const getFilteredLogs = () => {
    return logs.filter((log) => {
      const matchesSearch = log.event_type.toLowerCase().includes(searchTerm.toLowerCase()) || log.action_performed.toLowerCase().includes(searchTerm.toLowerCase()) || log.username && log.username.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLevel = selectedLevel === "All" || log.event_status === selectedLevel;
      const matchesCategory = selectedCategory === "All" || log.event_type === selectedCategory;
      const logDate = new Date(log.event_timestamp);
      const now = /* @__PURE__ */ new Date();
      let matchesDate = true;
      switch (dateRange) {
        case "today":
          matchesDate = logDate.toDateString() === now.toDateString();
          break;
        case "week": {
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1e3);
          matchesDate = logDate >= weekAgo;
          break;
        }
        case "month": {
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1e3);
          matchesDate = logDate >= monthAgo;
          break;
        }
        default:
          matchesDate = true;
      }
      return matchesSearch && matchesLevel && matchesCategory && matchesDate;
    });
  };
  const getLevelIcon = (status) => {
    switch (status) {
      case "Failed":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-4 h-4 text-red-500", "data-id": "kbwzuc4mn", "data-path": "src/pages/Admin/SystemLogs.tsx" });
      case "Blocked":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-4 h-4 text-yellow-500", "data-id": "6ttoi0u2y", "data-path": "src/pages/Admin/SystemLogs.tsx" });
      case "Success":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-4 h-4 text-green-500", "data-id": "stjlw64ec", "data-path": "src/pages/Admin/SystemLogs.tsx" });
      case "Suspicious":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-4 h-4 text-orange-500", "data-id": "3487124i0", "data-path": "src/pages/Admin/SystemLogs.tsx" });
      default:
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "w-4 h-4 text-blue-500", "data-id": "p5y04jlx7", "data-path": "src/pages/Admin/SystemLogs.tsx" });
    }
  };
  const getLevelBadgeColor = (status) => {
    switch (status) {
      case "Failed":
        return "bg-red-100 text-red-800";
      case "Blocked":
        return "bg-yellow-100 text-yellow-800";
      case "Success":
        return "bg-green-100 text-green-800";
      case "Suspicious":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };
  const getCategoryIcon = (eventType) => {
    switch (eventType) {
      case "Login":
      case "Logout":
      case "Failed Login":
      case "Registration":
      case "Password Reset":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-4 h-4", "data-id": "x00vtwcvk", "data-path": "src/pages/Admin/SystemLogs.tsx" });
      case "Data Access":
      case "Data Modification":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Database, { className: "w-4 h-4", "data-id": "23k13zghk", "data-path": "src/pages/Admin/SystemLogs.tsx" });
      case "Permission Change":
      case "Admin Action":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-4 h-4", "data-id": "w7uy00y0p", "data-path": "src/pages/Admin/SystemLogs.tsx" });
      default:
        return /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-4 h-4", "data-id": "66qujkux6", "data-path": "src/pages/Admin/SystemLogs.tsx" });
    }
  };
  const filteredLogs = getFilteredLogs();
  const errorCount = logs.filter((log) => log.event_status === "Failed").length;
  const warningCount = logs.filter((log) => log.event_status === "Blocked").length;
  const infoCount = logs.filter((log) => log.event_status === "Success").length;
  if (!isAdmin) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      AccessDenied,
      {
        feature: "System Logs",
        requiredRole: "Administrator",
        "data-id": "49ufucymf",
        "data-path": "src/pages/Admin/SystemLogs.tsx"
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-id": "ua4eu9031", "data-path": "src/pages/Admin/SystemLogs.tsx", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "ju5w5zxnt", "data-path": "src/pages/Admin/SystemLogs.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-3", "data-id": "ho2ddx6qg", "data-path": "src/pages/Admin/SystemLogs.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-8 h-8 text-blue-600", "data-id": "lrkmur89g", "data-path": "src/pages/Admin/SystemLogs.tsx" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-gray-900", "data-id": "mpi30rdx8", "data-path": "src/pages/Admin/SystemLogs.tsx", children: "Audit Logs" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex space-x-2", "data-id": "tr18jjetq", "data-path": "src/pages/Admin/SystemLogs.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: refreshLogs, disabled: loading, variant: "outline", "data-id": "it1488dm7", "data-path": "src/pages/Admin/SystemLogs.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: `w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`, "data-id": "9oulje1j7", "data-path": "src/pages/Admin/SystemLogs.tsx" }),
          "Refresh"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: exportLogs, variant: "outline", "data-id": "udt39q3jj", "data-path": "src/pages/Admin/SystemLogs.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-4 h-4 mr-2", "data-id": "kj835nv2c", "data-path": "src/pages/Admin/SystemLogs.tsx" }),
          "Export"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", "data-id": "8xn2n5y9v", "data-path": "src/pages/Admin/SystemLogs.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-id": "tq87vreir", "data-path": "src/pages/Admin/SystemLogs.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4", "data-id": "rkpyx5ojz", "data-path": "src/pages/Admin/SystemLogs.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-3", "data-id": "5smymc5cp", "data-path": "src/pages/Admin/SystemLogs.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-8 h-8 text-blue-600", "data-id": "wcc3jsu9u", "data-path": "src/pages/Admin/SystemLogs.tsx" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "mzdfhckct", "data-path": "src/pages/Admin/SystemLogs.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-600", "data-id": "7revijfi1", "data-path": "src/pages/Admin/SystemLogs.tsx", children: "Total Logs" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold", "data-id": "walmhu5e1", "data-path": "src/pages/Admin/SystemLogs.tsx", children: logs.length })
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-id": "kfri51inx", "data-path": "src/pages/Admin/SystemLogs.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4", "data-id": "a1p55810v", "data-path": "src/pages/Admin/SystemLogs.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-3", "data-id": "v0nj93p9o", "data-path": "src/pages/Admin/SystemLogs.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-8 h-8 text-red-600", "data-id": "bilsljezf", "data-path": "src/pages/Admin/SystemLogs.tsx" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "q404gyfzt", "data-path": "src/pages/Admin/SystemLogs.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-600", "data-id": "dkid6bkht", "data-path": "src/pages/Admin/SystemLogs.tsx", children: "Errors" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-red-600", "data-id": "1qvooi621", "data-path": "src/pages/Admin/SystemLogs.tsx", children: errorCount })
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-id": "hdtbsf464", "data-path": "src/pages/Admin/SystemLogs.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4", "data-id": "6ttarok9y", "data-path": "src/pages/Admin/SystemLogs.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-3", "data-id": "ybe9k9rof", "data-path": "src/pages/Admin/SystemLogs.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-8 h-8 text-yellow-600", "data-id": "4vnmcah9h", "data-path": "src/pages/Admin/SystemLogs.tsx" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "trumyixto", "data-path": "src/pages/Admin/SystemLogs.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-600", "data-id": "c7cf4tukk", "data-path": "src/pages/Admin/SystemLogs.tsx", children: "Warnings" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-yellow-600", "data-id": "kyzieblo6", "data-path": "src/pages/Admin/SystemLogs.tsx", children: warningCount })
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-id": "r1ltjtn2o", "data-path": "src/pages/Admin/SystemLogs.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4", "data-id": "y515n4a1u", "data-path": "src/pages/Admin/SystemLogs.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-3", "data-id": "f680p65uy", "data-path": "src/pages/Admin/SystemLogs.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "w-8 h-8 text-blue-600", "data-id": "3kogsm6jd", "data-path": "src/pages/Admin/SystemLogs.tsx" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "w7vzcyuhg", "data-path": "src/pages/Admin/SystemLogs.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-600", "data-id": "gjgfwj8gb", "data-path": "src/pages/Admin/SystemLogs.tsx", children: "Info" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-blue-600", "data-id": "5mjymgg09", "data-path": "src/pages/Admin/SystemLogs.tsx", children: infoCount })
        ] })
      ] }) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      BatchActionBar,
      {
        selectedCount: batchSelection.selectedCount,
        onBatchDelete: handleBatchDelete,
        onClearSelection: batchSelection.clearSelection,
        isLoading: batchActionLoading,
        showEdit: false,
        "data-id": "tz4bvya39",
        "data-path": "src/pages/Admin/SystemLogs.tsx"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-id": "d32mpezmv", "data-path": "src/pages/Admin/SystemLogs.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4", "data-id": "z5pw0yq6l", "data-path": "src/pages/Admin/SystemLogs.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-5 gap-4", "data-id": "4nemg2jlw", "data-path": "src/pages/Admin/SystemLogs.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", "data-id": "z6536lg8o", "data-path": "src/pages/Admin/SystemLogs.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4", "data-id": "t8op5o5er", "data-path": "src/pages/Admin/SystemLogs.tsx" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            placeholder: "Search logs...",
            value: searchTerm,
            onChange: (e) => setSearchTerm(e.target.value),
            className: "pl-10",
            "data-id": "8ihm0enaj",
            "data-path": "src/pages/Admin/SystemLogs.tsx"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: selectedLevel, onValueChange: setSelectedLevel, "data-id": "c4p0ghwsi", "data-path": "src/pages/Admin/SystemLogs.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-id": "pgvrt3d6p", "data-path": "src/pages/Admin/SystemLogs.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Filter by level", "data-id": "8djwraf9q", "data-path": "src/pages/Admin/SystemLogs.tsx" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { "data-id": "508t7cip3", "data-path": "src/pages/Admin/SystemLogs.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "All", "data-id": "d7z9lvk1l", "data-path": "src/pages/Admin/SystemLogs.tsx", children: "All Levels" }),
          logLevels.map(
            (level) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: level, "data-id": "mqeg1vxz6", "data-path": "src/pages/Admin/SystemLogs.tsx", children: level }, level)
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: selectedCategory, onValueChange: setSelectedCategory, "data-id": "y29mvpldx", "data-path": "src/pages/Admin/SystemLogs.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-id": "4iz9isrpr", "data-path": "src/pages/Admin/SystemLogs.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Filter by category", "data-id": "lqo9pp0cz", "data-path": "src/pages/Admin/SystemLogs.tsx" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { "data-id": "hybbw23bd", "data-path": "src/pages/Admin/SystemLogs.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "All", "data-id": "7h24njj4o", "data-path": "src/pages/Admin/SystemLogs.tsx", children: "All Categories" }),
          categories.map(
            (category) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: category, "data-id": "nip8ms1al", "data-path": "src/pages/Admin/SystemLogs.tsx", children: category }, category)
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: dateRange, onValueChange: setDateRange, "data-id": "u1l31gk2q", "data-path": "src/pages/Admin/SystemLogs.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-id": "2lvhp00sf", "data-path": "src/pages/Admin/SystemLogs.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { "data-id": "wz0n4sivu", "data-path": "src/pages/Admin/SystemLogs.tsx" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { "data-id": "07s15y4i3", "data-path": "src/pages/Admin/SystemLogs.tsx", children: dateRanges.map(
          (range) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: range.value, "data-id": "26oedtozu", "data-path": "src/pages/Admin/SystemLogs.tsx", children: range.label }, range.value)
        ) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "outline",
          onClick: () => {
            setSearchTerm("");
            setSelectedLevel("All");
            setSelectedCategory("All");
            setDateRange("today");
          },
          "data-id": "ucjbd0y99",
          "data-path": "src/pages/Admin/SystemLogs.tsx",
          children: "Clear Filters"
        }
      )
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "kwpr4iolj", "data-path": "src/pages/Admin/SystemLogs.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "0fgfudjrj", "data-path": "src/pages/Admin/SystemLogs.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { "data-id": "sebemfpyd", "data-path": "src/pages/Admin/SystemLogs.tsx", children: [
        "Audit Logs (",
        filteredLogs.length,
        ")"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { "data-id": "ec3dbps4d", "data-path": "src/pages/Admin/SystemLogs.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", "data-id": "t2mp601ls", "data-path": "src/pages/Admin/SystemLogs.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { "data-id": "gn3fvyk7n", "data-path": "src/pages/Admin/SystemLogs.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { "data-id": "m7rk9or8w", "data-path": "src/pages/Admin/SystemLogs.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { "data-id": "5fy5l0zd0", "data-path": "src/pages/Admin/SystemLogs.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-12", "data-id": "92d0ujp25", "data-path": "src/pages/Admin/SystemLogs.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Checkbox,
              {
                checked: filteredLogs.length > 0 && batchSelection.selectedCount === filteredLogs.length,
                onCheckedChange: () => batchSelection.toggleSelectAll(filteredLogs, (log) => log.id),
                "aria-label": "Select all logs",
                "data-id": "jo9egy25k",
                "data-path": "src/pages/Admin/SystemLogs.tsx"
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "6iwbc3pte", "data-path": "src/pages/Admin/SystemLogs.tsx", children: "Time" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "iit8j0eda", "data-path": "src/pages/Admin/SystemLogs.tsx", children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "3ssswnzsc", "data-path": "src/pages/Admin/SystemLogs.tsx", children: "Event Type" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "mmm6e3aly", "data-path": "src/pages/Admin/SystemLogs.tsx", children: "Action" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "wkkj926tv", "data-path": "src/pages/Admin/SystemLogs.tsx", children: "User" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "ucnyajokf", "data-path": "src/pages/Admin/SystemLogs.tsx", children: "IP Address" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { "data-id": "hyokjbil2", "data-path": "src/pages/Admin/SystemLogs.tsx", children: filteredLogs.map(
            (log) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: batchSelection.isSelected(log.id) ? "bg-blue-50" : "", "data-id": "g43nbkvz1", "data-path": "src/pages/Admin/SystemLogs.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "7d5p1845s", "data-path": "src/pages/Admin/SystemLogs.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Checkbox,
                {
                  checked: batchSelection.isSelected(log.id),
                  onCheckedChange: () => batchSelection.toggleItem(log.id),
                  "aria-label": `Select log ${log.id}`,
                  "data-id": "4u87jwabo",
                  "data-path": "src/pages/Admin/SystemLogs.tsx"
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-mono text-sm", "data-id": "bf90zqcp9", "data-path": "src/pages/Admin/SystemLogs.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", "data-id": "9igw8h1da", "data-path": "src/pages/Admin/SystemLogs.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3 text-gray-400", "data-id": "oo79np60e", "data-path": "src/pages/Admin/SystemLogs.tsx" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "p69pzu7yn", "data-path": "src/pages/Admin/SystemLogs.tsx", children: new Date(log.event_timestamp).toLocaleString() })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "twt7k9632", "data-path": "src/pages/Admin/SystemLogs.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", "data-id": "sxb68ui3f", "data-path": "src/pages/Admin/SystemLogs.tsx", children: [
                getLevelIcon(log.event_status),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: getLevelBadgeColor(log.event_status), "data-id": "az5r318an", "data-path": "src/pages/Admin/SystemLogs.tsx", children: log.event_status })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "jgs8kb3ah", "data-path": "src/pages/Admin/SystemLogs.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", "data-id": "3w6mvwm1o", "data-path": "src/pages/Admin/SystemLogs.tsx", children: [
                getCategoryIcon(log.event_type),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "2yljbkli2", "data-path": "src/pages/Admin/SystemLogs.tsx", children: log.event_type })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "max-w-md", "data-id": "w4dhaebx0", "data-path": "src/pages/Admin/SystemLogs.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate", title: log.action_performed, "data-id": "saxl8wf1z", "data-path": "src/pages/Admin/SystemLogs.tsx", children: log.action_performed }),
                log.failure_reason && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-red-600 mt-1", "data-id": "bfsw8o6j1", "data-path": "src/pages/Admin/SystemLogs.tsx", children: [
                  "Reason: ",
                  log.failure_reason
                ] }),
                log.additional_data && log.additional_data !== "{}" && /* @__PURE__ */ jsxRuntimeExports.jsxs("details", { className: "mt-1", "data-id": "dpolfbrcf", "data-path": "src/pages/Admin/SystemLogs.tsx", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("summary", { className: "text-xs text-gray-500 cursor-pointer hover:text-gray-700", "data-id": "uzv32o9md", "data-path": "src/pages/Admin/SystemLogs.tsx", children: "View details" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "text-xs bg-gray-50 p-2 rounded mt-1 overflow-x-auto", "data-id": "meo4rd1tf", "data-path": "src/pages/Admin/SystemLogs.tsx", children: JSON.stringify(JSON.parse(log.additional_data), null, 2) })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "zj46vc48t", "data-path": "src/pages/Admin/SystemLogs.tsx", children: log.username && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-1", "data-id": "5i2rdz088", "data-path": "src/pages/Admin/SystemLogs.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-3 h-3 text-gray-400", "data-id": "713ijjyhg", "data-path": "src/pages/Admin/SystemLogs.tsx" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", "data-id": "tohrlo0l2", "data-path": "src/pages/Admin/SystemLogs.tsx", children: log.username })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-mono text-sm", "data-id": "pm3qj4xx8", "data-path": "src/pages/Admin/SystemLogs.tsx", children: log.ip_address })
            ] }, log.id)
          ) })
        ] }) }),
        filteredLogs.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-8 text-gray-500", "data-id": "ap5bm3g8q", "data-path": "src/pages/Admin/SystemLogs.tsx", children: "No logs found matching the current filters." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      BatchDeleteDialog,
      {
        isOpen: isBatchDeleteDialogOpen,
        onClose: () => setIsBatchDeleteDialogOpen(false),
        onConfirm: confirmBatchDelete,
        selectedCount: batchSelection.selectedCount,
        isLoading: batchActionLoading,
        itemName: "log entries",
        selectedItems: batchSelection.getSelectedData(filteredLogs, (log) => log.id).map((log) => ({
          id: log.id,
          name: `${log.level} - ${log.category} - ${log.message.substring(0, 50)}...`
        })),
        "data-id": "w9lkclf8z",
        "data-path": "src/pages/Admin/SystemLogs.tsx"
      }
    )
  ] });
};
const SystemLogs$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: SystemLogs
}, Symbol.toStringTag, { value: "Module" }));
class PerformanceAPIWrapper {
  constructor() {
    __publicField(this, "isPerformanceSupported");
    __publicField(this, "isMemorySupported");
    __publicField(this, "isNavigationTimingSupported");
    this.isPerformanceSupported = this.checkPerformanceSupport();
    this.isMemorySupported = this.checkMemorySupport();
    this.isNavigationTimingSupported = this.checkNavigationTimingSupport();
  }
  checkPerformanceSupport() {
    return typeof window !== "undefined" && typeof window.performance !== "undefined" && window.performance !== null;
  }
  checkMemorySupport() {
    if (!this.isPerformanceSupported) return false;
    try {
      const performance = window.performance;
      return performance.memory && typeof performance.memory.usedJSHeapSize === "number";
    } catch (error) {
      return false;
    }
  }
  checkNavigationTimingSupport() {
    if (!this.isPerformanceSupported) return false;
    try {
      const performance = window.performance;
      if (!performance || typeof performance !== "object") return false;
      if (typeof performance.getEntriesByType !== "function") return false;
      try {
        const testResult = performance.getEntriesByType("navigation");
        return Array.isArray(testResult);
      } catch (testError) {
        console.warn("Performance.getEntriesByType test call failed:", testError);
        return false;
      }
    } catch (error) {
      console.warn("Performance.getEntriesByType not available:", error);
      return false;
    }
  }
  /**
   * Safely get memory information
   */
  getMemoryUsage() {
    if (!this.isMemorySupported) {
      return null;
    }
    try {
      const memory = window.performance.memory;
      return {
        usedJSHeapSize: memory.usedJSHeapSize || 0,
        totalJSHeapSize: memory.totalJSHeapSize || 0,
        jsHeapSizeLimit: memory.jsHeapSizeLimit || 0
      };
    } catch (error) {
      console.warn("Error accessing performance.memory:", error);
      return null;
    }
  }
  /**
   * Safely get navigation timing information
   */
  getNavigationTiming() {
    if (!this.isNavigationTimingSupported) {
      return null;
    }
    try {
      if (typeof window.performance.getEntriesByType !== "function") {
        console.warn("getEntriesByType method not available");
        return null;
      }
      const navigationEntries = window.performance.getEntriesByType("navigation");
      return navigationEntries.length > 0 ? navigationEntries[0] : null;
    } catch (error) {
      console.warn("Error accessing navigation timing:", error);
      return null;
    }
  }
  /**
   * Safely get resource timing information
   */
  getResourceTiming() {
    if (!this.isNavigationTimingSupported) {
      return [];
    }
    try {
      if (typeof window.performance.getEntriesByType !== "function") {
        console.warn("getEntriesByType method not available for resource timing");
        return [];
      }
      return window.performance.getEntriesByType("resource");
    } catch (error) {
      console.warn("Error accessing resource timing:", error);
      return [];
    }
  }
  /**
   * Safely get mark entries
   */
  getMarks() {
    if (!this.isNavigationTimingSupported) {
      return [];
    }
    try {
      if (typeof window.performance.getEntriesByType !== "function") {
        console.warn("getEntriesByType method not available for marks");
        return [];
      }
      return window.performance.getEntriesByType("mark");
    } catch (error) {
      console.warn("Error accessing performance marks:", error);
      return [];
    }
  }
  /**
   * Safely get measure entries
   */
  getMeasures() {
    if (!this.isNavigationTimingSupported) {
      return [];
    }
    try {
      if (typeof window.performance.getEntriesByType !== "function") {
        console.warn("getEntriesByType method not available for measures");
        return [];
      }
      return window.performance.getEntriesByType("measure");
    } catch (error) {
      console.warn("Error accessing performance measures:", error);
      return [];
    }
  }
  /**
   * Safely create a performance mark
   */
  mark(name) {
    if (!this.isPerformanceSupported) {
      return;
    }
    try {
      if (typeof window.performance.mark === "function") {
        window.performance.mark(name);
      }
    } catch (error) {
      console.warn("Error creating performance mark:", error);
    }
  }
  /**
   * Safely create a performance measure
   */
  measure(name, startMark, endMark) {
    if (!this.isPerformanceSupported) {
      return;
    }
    try {
      if (typeof window.performance.measure === "function") {
        window.performance.measure(name, startMark, endMark);
      }
    } catch (error) {
      console.warn("Error creating performance measure:", error);
    }
  }
  /**
   * Safely get current timestamp
   */
  now() {
    if (!this.isPerformanceSupported) {
      return Date.now();
    }
    try {
      return window.performance.now();
    } catch (error) {
      console.warn("Error getting performance.now():", error);
      return Date.now();
    }
  }
  /**
   * Get comprehensive support information
   */
  getSupportInfo() {
    return {
      performance: this.isPerformanceSupported,
      memory: this.isMemorySupported,
      navigationTiming: this.isNavigationTimingSupported,
      marks: this.isPerformanceSupported && typeof window.performance.mark === "function",
      measures: this.isPerformanceSupported && typeof window.performance.measure === "function",
      now: this.isPerformanceSupported && typeof window.performance.now === "function"
    };
  }
  /**
   * Check if all required APIs are supported
   */
  isFullySupported() {
    return this.isPerformanceSupported && this.isMemorySupported && this.isNavigationTimingSupported;
  }
}
const performanceAPI = new PerformanceAPIWrapper();
const _MemoryLeakMonitor = class _MemoryLeakMonitor {
  constructor() {
    __publicField(this, "components", /* @__PURE__ */ new Map());
    __publicField(this, "memoryCheckInterval", null);
    __publicField(this, "maxMemoryGrowth", 50 * 1024 * 1024);
    // 50MB
    __publicField(this, "memoryCheckFrequency", 3e4);
    // 30 seconds
    __publicField(this, "isMonitoring", false);
    __publicField(this, "baselineMemory", null);
    __publicField(this, "memoryHistory", []);
    __publicField(this, "maxHistorySize", 100);
    // Enhanced leak detection properties
    __publicField(this, "leakOccurrences", 0);
    __publicField(this, "lastAlertTime", 0);
    __publicField(this, "ALERT_COOLDOWN", 3e5);
    // 5 minutes between alerts
    __publicField(this, "MIN_OCCURRENCES_FOR_CRITICAL_ALERT", 3);
    __publicField(this, "CONSECUTIVE_GROWTH_THRESHOLD", 5);
    // Must see growth 5 times consecutively
    __publicField(this, "consecutiveGrowthCount", 0);
    this.initializeMonitoring();
  }
  static getInstance() {
    if (!_MemoryLeakMonitor.instance) {
      _MemoryLeakMonitor.instance = new _MemoryLeakMonitor();
    }
    return _MemoryLeakMonitor.instance;
  }
  initializeMonitoring() {
    if (!performanceAPI.getSupportInfo().memory) {
      console.warn("Memory monitoring not available in this environment");
      return;
    }
    try {
      this.baselineMemory = this.getCurrentMemoryStats();
      if (this.baselineMemory) {
        this.startMonitoring();
      } else {
        console.warn("Performance memory API not available in this browser");
      }
    } catch (error) {
      console.warn("Error initializing memory monitoring:", error);
    }
  }
  getCurrentMemoryStats() {
    try {
      const memory = performanceAPI.getMemoryUsage();
      if (!memory) {
        return null;
      }
      return {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit
      };
    } catch (error) {
      console.warn("Error accessing performance.memory:", error);
      return null;
    }
  }
  startMonitoring() {
    if (this.isMonitoring) return;
    this.isMonitoring = true;
    this.memoryCheckInterval = setInterval(() => {
      this.checkMemoryUsage();
    }, this.memoryCheckFrequency);
    if (typeof window !== "undefined") {
      window.addEventListener("beforeunload", () => {
        this.stopMonitoring();
      });
    }
  }
  stopMonitoring() {
    if (this.memoryCheckInterval) {
      clearInterval(this.memoryCheckInterval);
      this.memoryCheckInterval = null;
    }
    this.isMonitoring = false;
  }
  checkMemoryUsage() {
    const currentMemory = this.getCurrentMemoryStats();
    if (!currentMemory || !this.baselineMemory) return;
    this.memoryHistory.push({
      timestamp: Date.now(),
      memory: currentMemory
    });
    if (this.memoryHistory.length > this.maxHistorySize) {
      this.memoryHistory.shift();
    }
    this.analyzeMemoryTrend(currentMemory);
    const memoryPressure = currentMemory.usedJSHeapSize / currentMemory.jsHeapSizeLimit;
    if (memoryPressure > 0.8) {
      console.warn(`High memory pressure detected: ${(memoryPressure * 100).toFixed(1)}%`);
      this.sugggestGarbageCollection();
    }
  }
  analyzeMemoryTrend(currentMemory) {
    if (this.memoryHistory.length < 10) return;
    const recentHistory = this.memoryHistory.slice(-10);
    const previousMemory = recentHistory[recentHistory.length - 2];
    if (!previousMemory) return;
    const memoryDelta = currentMemory.usedJSHeapSize - previousMemory.memory.usedJSHeapSize;
    const significantGrowth = memoryDelta > this.maxMemoryGrowth / 10;
    if (significantGrowth) {
      this.consecutiveGrowthCount++;
    } else {
      this.consecutiveGrowthCount = Math.max(0, this.consecutiveGrowthCount - 1);
    }
    if (this.consecutiveGrowthCount >= this.CONSECUTIVE_GROWTH_THRESHOLD) {
      this.leakOccurrences++;
      const now = Date.now();
      const shouldTriggerCriticalAlert = this.leakOccurrences >= this.MIN_OCCURRENCES_FOR_CRITICAL_ALERT && now - this.lastAlertTime > this.ALERT_COOLDOWN;
      if (shouldTriggerCriticalAlert) {
        this.lastAlertTime = now;
        this.reportCriticalMemoryLeak(currentMemory);
      }
    }
    if (memoryDelta < -(this.maxMemoryGrowth / 5)) {
      this.leakOccurrences = 0;
      this.consecutiveGrowthCount = 0;
      console.log("Memory usage decreased significantly - resetting leak detection counters");
    }
  }
  reportCriticalMemoryLeak(currentMemory) {
    const memoryGrowth = currentMemory.usedJSHeapSize - this.baselineMemory.usedJSHeapSize;
    console.error(`🚨 CRITICAL MEMORY LEAK DETECTED!`);
    console.error(`Memory grew by ${(memoryGrowth / 1024 / 1024).toFixed(2)}MB`);
    console.error(`Leak occurrences: ${this.leakOccurrences}`);
    console.error(`Consecutive growth periods: ${this.consecutiveGrowthCount}`);
    this.reportSuspiciousComponents();
  }
  reportGlobalMemoryLeak(currentMemory, growth) {
    console.warn(`Potential memory leak detected! Memory grew by ${(growth / 1024 / 1024).toFixed(2)}MB`);
    this.reportSuspiciousComponents();
  }
  reportSuspiciousComponents() {
    const suspiciousComponents = Array.from(this.components.entries()).filter(([_, tracker]) => tracker.leakReports.length > 0).map(([name, tracker]) => ({
      name,
      leakCount: tracker.leakReports.length,
      lastLeakTime: Math.max(...tracker.leakReports.map((r) => r.timestamp))
    })).sort((a, b) => b.leakCount - a.leakCount);
    if (suspiciousComponents.length > 0) {
      console.group("🔍 Suspicious Components:");
      suspiciousComponents.forEach((comp) => {
        console.log(`${comp.name}: ${comp.leakCount} potential leaks`);
      });
      console.groupEnd();
    }
  }
  sugggestGarbageCollection() {
    if (typeof window !== "undefined" && window.gc) {
      console.log("Triggering garbage collection...");
      window.gc();
    } else {
      console.log("Consider triggering garbage collection manually in DevTools");
    }
  }
  trackComponent(componentName) {
    const memoryStats = this.getCurrentMemoryStats();
    if (this.components.has(componentName)) {
      const existing = this.components.get(componentName);
      existing.mountTime = Date.now();
      existing.unmountTime = void 0;
      existing.memoryUsageOnMount = memoryStats;
    } else {
      this.components.set(componentName, {
        name: componentName,
        mountTime: Date.now(),
        leakReports: [],
        memoryUsageOnMount: memoryStats,
        memoryUsageOnUnmount: null
      });
    }
    console.log(`📊 Tracking component: ${componentName}`, {
      totalTracked: this.components.size,
      memoryOnMount: memoryStats ? `${(memoryStats.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB` : "N/A"
    });
  }
  untrackComponent(componentName) {
    const tracker = this.components.get(componentName);
    if (!tracker) return;
    const memoryStats = this.getCurrentMemoryStats();
    tracker.unmountTime = Date.now();
    tracker.memoryUsageOnUnmount = memoryStats;
    const lifecycleTime = tracker.unmountTime - tracker.mountTime;
    if (tracker.memoryUsageOnMount && memoryStats) {
      const memoryDelta = memoryStats.usedJSHeapSize - tracker.memoryUsageOnMount.usedJSHeapSize;
      if (memoryDelta > 5 * 1024 * 1024) {
        console.warn(`Component ${componentName} may have caused memory growth: ${(memoryDelta / 1024 / 1024).toFixed(2)}MB`);
      }
    }
    console.log(`📉 Component unmounted: ${componentName}`, {
      lifecycleTime: `${lifecycleTime}ms`,
      leakReports: tracker.leakReports.length,
      memoryOnUnmount: memoryStats ? `${(memoryStats.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB` : "N/A"
    });
  }
  reportPotentialLeak(componentName, leakType, metadata) {
    const tracker = this.components.get(componentName);
    if (!tracker) {
      console.warn(`Cannot report leak for untracked component: ${componentName}`);
      return;
    }
    const leakReport = {
      componentName,
      leakType,
      metadata,
      timestamp: Date.now(),
      memoryStats: this.getCurrentMemoryStats()
    };
    tracker.leakReports.push(leakReport);
    console.warn(`🚨 Potential memory leak detected in ${componentName}:`, {
      type: leakType,
      details: metadata,
      totalLeaksForComponent: tracker.leakReports.length
    });
    this.suggestFix(leakType, componentName);
  }
  suggestFix(leakType, componentName) {
    const suggestions = {
      setState_after_unmount: "Use a ref to track mount status or cleanup async operations in useEffect cleanup",
      large_closure: "Consider breaking down large objects or using useMemo/useCallback to optimize closures",
      uncleared_timer: "Make sure to clear timers in useEffect cleanup function",
      unremoved_listener: "Remove event listeners in useEffect cleanup function",
      uncancelled_subscription: "Cancel subscriptions and async operations in useEffect cleanup",
      memory_leak_detected: "Check for circular references and ensure proper cleanup of resources"
    };
    const suggestion = suggestions[leakType];
    if (suggestion) {
      console.log(`💡 Suggestion for ${componentName}: ${suggestion}`);
    }
  }
  getComponentStats(componentName) {
    if (componentName) {
      return this.components.get(componentName) || null;
    }
    return Array.from(this.components.values());
  }
  getMemoryHistory() {
    return [...this.memoryHistory];
  }
  getCurrentMemoryInfo() {
    const current = this.getCurrentMemoryStats();
    const growth = current && this.baselineMemory ? current.usedJSHeapSize - this.baselineMemory.usedJSHeapSize : 0;
    const pressure = current ? current.usedJSHeapSize / current.jsHeapSizeLimit : 0;
    const totalLeakReports = Array.from(this.components.values()).reduce((total, tracker) => total + tracker.leakReports.length, 0);
    return {
      current,
      baseline: this.baselineMemory,
      growth,
      pressure,
      componentsTracked: this.components.size,
      totalLeakReports,
      leakOccurrences: this.leakOccurrences,
      isCriticalLeakDetected: this.leakOccurrences >= this.MIN_OCCURRENCES_FOR_CRITICAL_ALERT,
      nextAlertTime: this.lastAlertTime + this.ALERT_COOLDOWN
    };
  }
  // Force garbage collection if available (Chrome DevTools)
  forceGarbageCollection() {
    if (typeof window !== "undefined" && window.gc) {
      window.gc();
      console.log("Garbage collection triggered");
      return true;
    }
    console.warn('Garbage collection not available. Enable in Chrome: --js-flags="--expose-gc"');
    return false;
  }
  // Reset monitoring baseline and counters
  resetBaseline() {
    this.baselineMemory = this.getCurrentMemoryStats();
    this.memoryHistory = [];
    this.leakOccurrences = 0;
    this.consecutiveGrowthCount = 0;
    this.lastAlertTime = 0;
    console.log("Memory baseline and leak detection counters reset");
  }
  // Generate memory report
  generateReport() {
    const info = this.getCurrentMemoryInfo();
    const suspiciousComponents = Array.from(this.components.values()).filter((tracker) => tracker.leakReports.length > 0).sort((a, b) => b.leakReports.length - a.leakReports.length);
    const report = `
Memory Leak Detection Report
Generated: ${(/* @__PURE__ */ new Date()).toISOString()}

=== Memory Stats ===
Current Usage: ${info.current ? (info.current.usedJSHeapSize / 1024 / 1024).toFixed(2) : "N/A"}MB
Baseline Usage: ${info.baseline ? (info.baseline.usedJSHeapSize / 1024 / 1024).toFixed(2) : "N/A"}MB
Memory Growth: ${(info.growth / 1024 / 1024).toFixed(2)}MB
Memory Pressure: ${(info.pressure * 100).toFixed(1)}%
Heap Size Limit: ${info.current ? (info.current.jsHeapSizeLimit / 1024 / 1024).toFixed(2) : "N/A"}MB

=== Leak Detection Status ===
Leak Occurrences: ${info.leakOccurrences}
Critical Leak Detected: ${info.isCriticalLeakDetected ? "YES" : "NO"}
Next Alert Available: ${info.nextAlertTime > Date.now() ? new Date(info.nextAlertTime).toISOString() : "Now"}

=== Component Tracking ===
Components Tracked: ${info.componentsTracked}
Total Leak Reports: ${info.totalLeakReports}

=== Suspicious Components ===
${suspiciousComponents.length === 0 ? "No suspicious components detected" : suspiciousComponents.map(
      (comp) => `${comp.name}: ${comp.leakReports.length} leak reports`
    ).join("\n")}

=== Memory History (Last 10 entries) ===
${this.memoryHistory.slice(-10).map(
      (entry) => `${new Date(entry.timestamp).toISOString()}: ${(entry.memory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`
    ).join("\n")}
    `;
    return report.trim();
  }
};
__publicField(_MemoryLeakMonitor, "instance");
let MemoryLeakMonitor = _MemoryLeakMonitor;
const MemoryLeakDashboard = () => {
  const [memoryInfo, setMemoryInfo] = reactExports.useState(null);
  const [components, setComponents] = reactExports.useState([]);
  const [memoryHistory, setMemoryHistory] = reactExports.useState([]);
  const [isMonitoring, setIsMonitoring] = reactExports.useState(true);
  const { toast } = useToast();
  const monitor = MemoryLeakMonitor.getInstance();
  const refreshData = () => {
    try {
      const info = monitor.getCurrentMemoryInfo();
      const componentStats = monitor.getComponentStats();
      const history = monitor.getMemoryHistory();
      setMemoryInfo(info);
      setComponents(Array.isArray(componentStats) ? componentStats : []);
      setMemoryHistory(history);
    } catch (error) {
      console.warn("Error refreshing memory data:", error);
      setMemoryInfo({
        current: null,
        baseline: null,
        growth: 0,
        pressure: 0,
        componentsTracked: 0,
        totalLeakReports: 0,
        leakOccurrences: 0,
        isCriticalLeakDetected: false,
        nextAlertTime: 0
      });
      setComponents([]);
      setMemoryHistory([]);
    }
  };
  reactExports.useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 5e3);
    return () => clearInterval(interval);
  }, []);
  const formatBytes = (bytes) => {
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };
  const getMemoryPressureColor = (pressure) => {
    if (pressure < 0.5) return "text-green-600";
    if (pressure < 0.7) return "text-yellow-600";
    return "text-red-600";
  };
  const getMemoryPressureLabel = (pressure) => {
    if (pressure < 0.5) return "Low";
    if (pressure < 0.7) return "Medium";
    return "High";
  };
  const handleForceGC = () => {
    const success = monitor.forceGarbageCollection();
    if (success) {
      toast({
        title: "Garbage Collection Triggered",
        description: "Manual garbage collection has been executed."
      });
      setTimeout(refreshData, 1e3);
    } else {
      toast({
        title: "Garbage Collection Unavailable",
        description: 'Enable garbage collection in Chrome DevTools with --js-flags="--expose-gc"',
        variant: "destructive"
      });
    }
  };
  const handleResetBaseline = () => {
    monitor.resetBaseline();
    toast({
      title: "Baseline Reset",
      description: "Memory monitoring baseline has been reset."
    });
    refreshData();
  };
  const handleDownloadReport = () => {
    const report = monitor.generateReport();
    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `memory-leak-report-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "Report Downloaded",
      description: "Memory leak report has been saved to your downloads."
    });
  };
  const suspiciousComponents = components.filter((comp) => comp.leakReports.length > 0).sort((a, b) => b.leakReports.length - a.leakReports.length);
  if (!memoryInfo) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-id": "62vvbrrgx", "data-path": "src/components/MemoryLeakDashboard.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-6", "data-id": "o3z57cxow", "data-path": "src/components/MemoryLeakDashboard.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center", "data-id": "e96gb2p7w", "data-path": "src/components/MemoryLeakDashboard.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-4 w-4 animate-spin mr-2", "data-id": "q3bzjjxbq", "data-path": "src/components/MemoryLeakDashboard.tsx" }),
      "Loading memory data..."
    ] }) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-id": "pl89o3zrw", "data-path": "src/components/MemoryLeakDashboard.tsx", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "pg80m2cbt", "data-path": "src/components/MemoryLeakDashboard.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "cclzd8nys", "data-path": "src/components/MemoryLeakDashboard.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold", "data-id": "g4g1rn4dd", "data-path": "src/components/MemoryLeakDashboard.tsx", children: "Memory Leak Monitor" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", "data-id": "00sfzfdld", "data-path": "src/components/MemoryLeakDashboard.tsx", children: "Real-time memory usage and leak detection dashboard" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", "data-id": "3h1rgxwko", "data-path": "src/components/MemoryLeakDashboard.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: refreshData, variant: "outline", size: "sm", "data-id": "iwbudp01p", "data-path": "src/components/MemoryLeakDashboard.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-4 w-4 mr-2", "data-id": "nrm94hy6u", "data-path": "src/components/MemoryLeakDashboard.tsx" }),
          "Refresh"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: handleForceGC, variant: "outline", size: "sm", "data-id": "uzjg7g6j6", "data-path": "src/components/MemoryLeakDashboard.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4 mr-2", "data-id": "6aau26t48", "data-path": "src/components/MemoryLeakDashboard.tsx" }),
          "Force GC"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: handleResetBaseline, variant: "outline", size: "sm", "data-id": "fikgzzm54", "data-path": "src/components/MemoryLeakDashboard.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-4 w-4 mr-2", "data-id": "hw057gm1s", "data-path": "src/components/MemoryLeakDashboard.tsx" }),
          "Reset Baseline"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: handleDownloadReport, variant: "outline", size: "sm", "data-id": "dpe83i16q", "data-path": "src/components/MemoryLeakDashboard.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4 mr-2", "data-id": "6ttb5ej83", "data-path": "src/components/MemoryLeakDashboard.tsx" }),
          "Download Report"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", "data-id": "dsequu6fb", "data-path": "src/components/MemoryLeakDashboard.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "2i8g5fy9y", "data-path": "src/components/MemoryLeakDashboard.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", "data-id": "txhbijqfm", "data-path": "src/components/MemoryLeakDashboard.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium", "data-id": "80gsuwhyr", "data-path": "src/components/MemoryLeakDashboard.tsx", children: "Current Memory" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(HardDrive, { className: "h-4 w-4 text-muted-foreground", "data-id": "7i52fx8x6", "data-path": "src/components/MemoryLeakDashboard.tsx" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { "data-id": "aslkh6tc6", "data-path": "src/components/MemoryLeakDashboard.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold", "data-id": "t58hfutum", "data-path": "src/components/MemoryLeakDashboard.tsx", children: memoryInfo.current ? formatBytes(memoryInfo.current.usedJSHeapSize) : "N/A" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", "data-id": "6w6qbkk4u", "data-path": "src/components/MemoryLeakDashboard.tsx", children: [
            "of ",
            memoryInfo.current ? formatBytes(memoryInfo.current.jsHeapSizeLimit) : "N/A",
            " limit"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "r48889ylo", "data-path": "src/components/MemoryLeakDashboard.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", "data-id": "haohp4wz1", "data-path": "src/components/MemoryLeakDashboard.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium", "data-id": "eiak81y9r", "data-path": "src/components/MemoryLeakDashboard.tsx", children: "Memory Growth" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-4 w-4 text-muted-foreground", "data-id": "78rae63qy", "data-path": "src/components/MemoryLeakDashboard.tsx" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { "data-id": "9awfcnl3p", "data-path": "src/components/MemoryLeakDashboard.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold", "data-id": "1eou6w9ah", "data-path": "src/components/MemoryLeakDashboard.tsx", children: formatBytes(memoryInfo.growth) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", "data-id": "37msaqe0h", "data-path": "src/components/MemoryLeakDashboard.tsx", children: "since baseline" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "quxl4blq3", "data-path": "src/components/MemoryLeakDashboard.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", "data-id": "uvvmjyu7x", "data-path": "src/components/MemoryLeakDashboard.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium", "data-id": "alonk06cj", "data-path": "src/components/MemoryLeakDashboard.tsx", children: "Memory Pressure" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Cpu, { className: "h-4 w-4 text-muted-foreground", "data-id": "nle9mo4ez", "data-path": "src/components/MemoryLeakDashboard.tsx" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { "data-id": "jh9sqz24q", "data-path": "src/components/MemoryLeakDashboard.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `text-2xl font-bold ${getMemoryPressureColor(memoryInfo.pressure)}`, "data-id": "4tf3pcduk", "data-path": "src/components/MemoryLeakDashboard.tsx", children: [
            (memoryInfo.pressure * 100).toFixed(1),
            "%"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", "data-id": "v3i3p8s6d", "data-path": "src/components/MemoryLeakDashboard.tsx", children: [
            getMemoryPressureLabel(memoryInfo.pressure),
            " pressure"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: memoryInfo.pressure * 100, className: "mt-2", "data-id": "kbgz3kyzr", "data-path": "src/components/MemoryLeakDashboard.tsx" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "m8x9aql45", "data-path": "src/components/MemoryLeakDashboard.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", "data-id": "i3kg4ksnk", "data-path": "src/components/MemoryLeakDashboard.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium", "data-id": "f216e9sys", "data-path": "src/components/MemoryLeakDashboard.tsx", children: "Components Tracked" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-4 w-4 text-muted-foreground", "data-id": "9kmdoi000", "data-path": "src/components/MemoryLeakDashboard.tsx" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { "data-id": "7assyqn1r", "data-path": "src/components/MemoryLeakDashboard.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold", "data-id": "g641hs5xn", "data-path": "src/components/MemoryLeakDashboard.tsx", children: memoryInfo.componentsTracked }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", "data-id": "si16w2kb1", "data-path": "src/components/MemoryLeakDashboard.tsx", children: [
            memoryInfo.totalLeakReports,
            " leak reports"
          ] })
        ] })
      ] })
    ] }),
    memoryInfo.pressure > 0.7 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { "data-id": "52d8ozvxk", "data-path": "src/components/MemoryLeakDashboard.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4", "data-id": "j7ne468uo", "data-path": "src/components/MemoryLeakDashboard.tsx" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDescription, { "data-id": "cxyaew4rf", "data-path": "src/components/MemoryLeakDashboard.tsx", children: [
        "High memory pressure detected (",
        (memoryInfo.pressure * 100).toFixed(1),
        "%). Consider triggering garbage collection or investigating memory leaks."
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "components", className: "space-y-4", "data-id": "458rb6ykx", "data-path": "src/components/MemoryLeakDashboard.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { "data-id": "xfmbwfj6f", "data-path": "src/components/MemoryLeakDashboard.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "components", "data-id": "q48l8aqm2", "data-path": "src/components/MemoryLeakDashboard.tsx", children: "Component Tracking" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "leaks", "data-id": "gthxwh9ra", "data-path": "src/components/MemoryLeakDashboard.tsx", children: [
          "Leak Reports",
          suspiciousComponents.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "destructive", className: "ml-2", "data-id": "9y4adnzif", "data-path": "src/components/MemoryLeakDashboard.tsx", children: suspiciousComponents.length })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "history", "data-id": "pa3e7nylm", "data-path": "src/components/MemoryLeakDashboard.tsx", children: "Memory History" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "components", className: "space-y-4", "data-id": "r4fe43hkd", "data-path": "src/components/MemoryLeakDashboard.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "700c0ro9m", "data-path": "src/components/MemoryLeakDashboard.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { "data-id": "0cra8lmit", "data-path": "src/components/MemoryLeakDashboard.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { "data-id": "xfkkvabns", "data-path": "src/components/MemoryLeakDashboard.tsx", children: "Component Tracking" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { "data-id": "kd6p0o7nk", "data-path": "src/components/MemoryLeakDashboard.tsx", children: "Real-time tracking of React components and their memory impact" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { "data-id": "hxj26vlda", "data-path": "src/components/MemoryLeakDashboard.tsx", children: components.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-muted-foreground py-8", "data-id": "p9r938xuo", "data-path": "src/components/MemoryLeakDashboard.tsx", children: "No components are currently being tracked" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", "data-id": "y596hhyxe", "data-path": "src/components/MemoryLeakDashboard.tsx", children: components.map(
          (component, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border rounded-lg p-4", "data-id": "784xje5yt", "data-path": "src/components/MemoryLeakDashboard.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", "data-id": "0mjj3ss0h", "data-path": "src/components/MemoryLeakDashboard.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold", "data-id": "x83fxs1f4", "data-path": "src/components/MemoryLeakDashboard.tsx", children: component.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", "data-id": "nmrygczsg", "data-path": "src/components/MemoryLeakDashboard.tsx", children: [
                component.leakReports.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "destructive", "data-id": "xrx7aenar", "data-path": "src/components/MemoryLeakDashboard.tsx", children: [
                  component.leakReports.length,
                  " leaks"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: component.unmountTime ? "secondary" : "default", "data-id": "amqs2zlmf", "data-path": "src/components/MemoryLeakDashboard.tsx", children: component.unmountTime ? "Unmounted" : "Mounted" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 text-sm", "data-id": "6ngljka6n", "data-path": "src/components/MemoryLeakDashboard.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "l4rd7pptc", "data-path": "src/components/MemoryLeakDashboard.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", "data-id": "8s6ma3w6n", "data-path": "src/components/MemoryLeakDashboard.tsx", children: "Mount Time:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { "data-id": "kpknh0jx9", "data-path": "src/components/MemoryLeakDashboard.tsx", children: new Date(component.mountTime).toLocaleTimeString() })
              ] }),
              component.unmountTime && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "jqwvsdrok", "data-path": "src/components/MemoryLeakDashboard.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", "data-id": "dvw67g50f", "data-path": "src/components/MemoryLeakDashboard.tsx", children: "Unmount Time:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { "data-id": "9q2f1cj8d", "data-path": "src/components/MemoryLeakDashboard.tsx", children: new Date(component.unmountTime).toLocaleTimeString() })
              ] }),
              component.memoryUsageOnMount && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "9e5crdyhf", "data-path": "src/components/MemoryLeakDashboard.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", "data-id": "t01xhaq1u", "data-path": "src/components/MemoryLeakDashboard.tsx", children: "Memory on Mount:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { "data-id": "fook6tyt9", "data-path": "src/components/MemoryLeakDashboard.tsx", children: formatBytes(component.memoryUsageOnMount.usedJSHeapSize) })
              ] }),
              component.memoryUsageOnUnmount && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "28v9jkwf9", "data-path": "src/components/MemoryLeakDashboard.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", "data-id": "50swxrsc9", "data-path": "src/components/MemoryLeakDashboard.tsx", children: "Memory on Unmount:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { "data-id": "t8y3atboh", "data-path": "src/components/MemoryLeakDashboard.tsx", children: formatBytes(component.memoryUsageOnUnmount.usedJSHeapSize) })
              ] })
            ] })
          ] }, index)
        ) }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "leaks", className: "space-y-4", "data-id": "jp75qbwh8", "data-path": "src/components/MemoryLeakDashboard.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "y3otabrxv", "data-path": "src/components/MemoryLeakDashboard.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { "data-id": "3ulnvlm1u", "data-path": "src/components/MemoryLeakDashboard.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { "data-id": "owipjd038", "data-path": "src/components/MemoryLeakDashboard.tsx", children: "Leak Reports" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { "data-id": "qv29llsg0", "data-path": "src/components/MemoryLeakDashboard.tsx", children: "Components with detected memory leak patterns" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { "data-id": "jmywi2fwg", "data-path": "src/components/MemoryLeakDashboard.tsx", children: suspiciousComponents.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-8", "data-id": "9bwdaazum", "data-path": "src/components/MemoryLeakDashboard.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-green-600 mb-2", "data-id": "n3eqzbapl", "data-path": "src/components/MemoryLeakDashboard.tsx", children: "✅ No memory leaks detected" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", "data-id": "tk5bxpj15", "data-path": "src/components/MemoryLeakDashboard.tsx", children: "All components are clean!" })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", "data-id": "d6xfunas9", "data-path": "src/components/MemoryLeakDashboard.tsx", children: suspiciousComponents.map(
          (component, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-red-200 rounded-lg p-4 bg-red-50", "data-id": "mcdyt5tct", "data-path": "src/components/MemoryLeakDashboard.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", "data-id": "c3157s6qy", "data-path": "src/components/MemoryLeakDashboard.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-red-900", "data-id": "oimhmx9af", "data-path": "src/components/MemoryLeakDashboard.tsx", children: component.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "destructive", "data-id": "zrbab2dmm", "data-path": "src/components/MemoryLeakDashboard.tsx", children: [
                component.leakReports.length,
                " issues"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", "data-id": "7zeb6fzxi", "data-path": "src/components/MemoryLeakDashboard.tsx", children: component.leakReports.map(
              (report, reportIndex) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm bg-white rounded p-2", "data-id": "6mktx3z7p", "data-path": "src/components/MemoryLeakDashboard.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "kthmniunp", "data-path": "src/components/MemoryLeakDashboard.tsx", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", "data-id": "u1g2o14v2", "data-path": "src/components/MemoryLeakDashboard.tsx", children: report.leakType }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", "data-id": "ia9tkh8z7", "data-path": "src/components/MemoryLeakDashboard.tsx", children: new Date(report.timestamp).toLocaleTimeString() })
                ] }),
                report.metadata && /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "mt-1 text-xs text-gray-600 bg-gray-100 p-1 rounded overflow-x-auto", "data-id": "tkbl1xqjd", "data-path": "src/components/MemoryLeakDashboard.tsx", children: JSON.stringify(report.metadata, null, 2) })
              ] }, reportIndex)
            ) })
          ] }, index)
        ) }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "history", className: "space-y-4", "data-id": "hk9b0wpy7", "data-path": "src/components/MemoryLeakDashboard.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "k9ne761xj", "data-path": "src/components/MemoryLeakDashboard.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { "data-id": "gv8schxxb", "data-path": "src/components/MemoryLeakDashboard.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { "data-id": "80ow5urim", "data-path": "src/components/MemoryLeakDashboard.tsx", children: "Memory Usage History" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { "data-id": "66qzvmxcb", "data-path": "src/components/MemoryLeakDashboard.tsx", children: "Historical memory usage data over time" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { "data-id": "unwmrnvc1", "data-path": "src/components/MemoryLeakDashboard.tsx", children: memoryHistory.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-muted-foreground py-8", "data-id": "e4q04pdyp", "data-path": "src/components/MemoryLeakDashboard.tsx", children: "No memory history data available" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 max-h-96 overflow-y-auto", "data-id": "zofrr3bae", "data-path": "src/components/MemoryLeakDashboard.tsx", children: memoryHistory.slice(-20).reverse().map(
          (entry, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between py-2 border-b", "data-id": "9po6apcd6", "data-path": "src/components/MemoryLeakDashboard.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", "data-id": "bk2r8hkx7", "data-path": "src/components/MemoryLeakDashboard.tsx", children: new Date(entry.timestamp).toLocaleString() }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", "data-id": "0xc91doil", "data-path": "src/components/MemoryLeakDashboard.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", "data-id": "81zn67r4n", "data-path": "src/components/MemoryLeakDashboard.tsx", children: formatBytes(entry.memory.usedJSHeapSize) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", "data-id": "345t6k9p3", "data-path": "src/components/MemoryLeakDashboard.tsx", children: [
                (entry.memory.usedJSHeapSize / entry.memory.jsHeapSizeLimit * 100).toFixed(1),
                "% of limit"
              ] })
            ] })
          ] }, index)
        ) }) })
      ] }) })
    ] })
  ] });
};
const MemoryLeakPreventionGuide = () => {
  const [openSections, setOpenSections] = reactExports.useState(/* @__PURE__ */ new Set());
  const toggleSection = (sectionId) => {
    const newOpenSections = new Set(openSections);
    if (newOpenSections.has(sectionId)) {
      newOpenSections.delete(sectionId);
    } else {
      newOpenSections.add(sectionId);
    }
    setOpenSections(newOpenSections);
  };
  const commonPatterns = [
    {
      title: "Timer Cleanup",
      description: "Always clear timers when components unmount",
      badCode: `// ❌ BAD: Timer not cleared
function BadComponent() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    setInterval(() => {
      setCount(prev => prev + 1); // Memory leak!
    }, 1000);
  }, []);
  
  return <div>{count}</div>;
}`,
      goodCode: `// ✅ GOOD: Timer properly cleaned up
function GoodComponent() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(interval); // Cleanup
  }, []);
  
  return <div>{count}</div>;
}`,
      explanation: "Timers continue running even after component unmount unless explicitly cleared, causing memory leaks and potential state updates on unmounted components."
    },
    {
      title: "Event Listener Cleanup",
      description: "Remove event listeners to prevent memory leaks",
      badCode: `// ❌ BAD: Event listener not removed
function BadComponent() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    // Missing cleanup!
  }, []);
  
  return <div>Mouse: {position.x}, {position.y}</div>;
}`,
      goodCode: `// ✅ GOOD: Event listener properly removed
function GoodComponent() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  return <div>Mouse: {position.x}, {position.y}</div>;
}`,
      explanation: "Event listeners hold references to components, preventing garbage collection. Always remove them in cleanup functions."
    },
    {
      title: "Async Operations",
      description: "Cancel async operations when component unmounts",
      badCode: `// ❌ BAD: Async operation not cancelled
function BadComponent({ userId }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    async function fetchUser() {
      const response = await fetch(\`/api/users/\${userId}\`);
      const userData = await response.json();
      setUser(userData); // May run after unmount!
    }
    
    fetchUser();
  }, [userId]);
  
  return user ? <div>{user.name}</div> : <div>Loading...</div>;
}`,
      goodCode: `// ✅ GOOD: Async operation cancelled on unmount
function GoodComponent({ userId }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const abortController = new AbortController();
    
    async function fetchUser() {
      try {
        const response = await fetch(\`/api/users/\${userId}\`, {
          signal: abortController.signal
        });
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Fetch error:', error);
        }
      }
    }
    
    fetchUser();
    
    return () => abortController.abort();
  }, [userId]);
  
  return user ? <div>{user.name}</div> : <div>Loading...</div>;
}`,
      explanation: "Async operations can complete after component unmount, leading to state updates on unmounted components. Use AbortController to cancel them."
    }
  ];
  const bestPractices = [
    {
      title: "Use Memory Leak Detection Hooks",
      description: "Implement our custom hooks for automatic cleanup",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-5 w-5", "data-id": "gfq20e7ro", "data-path": "src/components/MemoryLeakPreventionGuide.tsx" }),
      tips: [
        "Use useMemoryLeakDetector for automatic resource tracking",
        "Implement useSafeAsync for protected async operations",
        "Wrap components with withMemoryLeakDetection HOC"
      ]
    },
    {
      title: "Monitor Component Lifecycle",
      description: "Track mount/unmount cycles and resource usage",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "h-5 w-5", "data-id": "ku3quabk6", "data-path": "src/components/MemoryLeakPreventionGuide.tsx" }),
      tips: [
        "Use refs to track component mount status",
        "Log resource allocation and cleanup",
        "Monitor memory usage during development"
      ]
    },
    {
      title: "Implement Proper Error Boundaries",
      description: "Catch and handle errors to prevent resource leaks",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-5 w-5", "data-id": "08tc275d9", "data-path": "src/components/MemoryLeakPreventionGuide.tsx" }),
      tips: [
        "Use error boundaries to prevent cascading failures",
        "Clean up resources in error scenarios",
        "Log errors with memory context"
      ]
    }
  ];
  const checklistItems = [
    "✅ All timers are cleared in useEffect cleanup",
    "✅ Event listeners are removed on unmount",
    "✅ Async operations use AbortController",
    "✅ Subscriptions are properly unsubscribed",
    "✅ Large objects are not captured in closures",
    "✅ State updates check component mount status",
    "✅ WebSocket connections are closed",
    "✅ ResizeObserver and IntersectionObserver are disconnected",
    "✅ File readers and streams are closed",
    "✅ Animation frames are cancelled"
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-id": "sisudn3be", "data-path": "src/components/MemoryLeakPreventionGuide.tsx", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", "data-id": "5o8txfkuq", "data-path": "src/components/MemoryLeakPreventionGuide.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold mb-2", "data-id": "pw2pwu1er", "data-path": "src/components/MemoryLeakPreventionGuide.tsx", children: "Memory Leak Prevention Guide" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground max-w-2xl mx-auto", "data-id": "n16thn1kz", "data-path": "src/components/MemoryLeakPreventionGuide.tsx", children: "Comprehensive guide to preventing memory leaks in React applications. Learn patterns, best practices, and use our monitoring tools." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "patterns", className: "space-y-4", "data-id": "kx4ks1q4x", "data-path": "src/components/MemoryLeakPreventionGuide.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid w-full grid-cols-4", "data-id": "9qih1lc9k", "data-path": "src/components/MemoryLeakPreventionGuide.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "patterns", "data-id": "r2wzh5emi", "data-path": "src/components/MemoryLeakPreventionGuide.tsx", children: "Common Patterns" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "practices", "data-id": "pxb4w5j0j", "data-path": "src/components/MemoryLeakPreventionGuide.tsx", children: "Best Practices" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "checklist", "data-id": "a3c0y0or5", "data-path": "src/components/MemoryLeakPreventionGuide.tsx", children: "Checklist" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "tools", "data-id": "t31341hgg", "data-path": "src/components/MemoryLeakPreventionGuide.tsx", children: "Our Tools" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "patterns", className: "space-y-4", "data-id": "9p78sqil3", "data-path": "src/components/MemoryLeakPreventionGuide.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { "data-id": "r5mnoquxm", "data-path": "src/components/MemoryLeakPreventionGuide.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4", "data-id": "pe3albdl2", "data-path": "src/components/MemoryLeakPreventionGuide.tsx" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { "data-id": "lllp10n5j", "data-path": "src/components/MemoryLeakPreventionGuide.tsx", children: "These examples show common memory leak patterns and their solutions. Click on each section to expand the code examples." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", "data-id": "v0i3m1wxk", "data-path": "src/components/MemoryLeakPreventionGuide.tsx", children: commonPatterns.map(
          (pattern, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-id": "1sz8n0b22", "data-path": "src/components/MemoryLeakPreventionGuide.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "48qm0vt5z", "data-path": "src/components/MemoryLeakPreventionGuide.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              CardHeader,
              {
                className: "cursor-pointer hover:bg-muted/50 transition-colors",
                onClick: () => toggleSection(`pattern-${index}`),
                "data-id": "i1hfa7uzz",
                "data-path": "src/components/MemoryLeakPreventionGuide.tsx",
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "1sfcadkuc", "data-path": "src/components/MemoryLeakPreventionGuide.tsx", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "chsz9azbd", "data-path": "src/components/MemoryLeakPreventionGuide.tsx", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", "data-id": "se12upv8x", "data-path": "src/components/MemoryLeakPreventionGuide.tsx", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Code, { className: "h-5 w-5", "data-id": "lm7wco979", "data-path": "src/components/MemoryLeakPreventionGuide.tsx" }),
                      pattern.title
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { "data-id": "r0ly04usw", "data-path": "src/components/MemoryLeakPreventionGuide.tsx", children: pattern.description })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: `h-4 w-4 transition-transform ${openSections.has(`pattern-${index}`) ? "rotate-180" : ""}`, "data-id": "robanvf29", "data-path": "src/components/MemoryLeakPreventionGuide.tsx" })
                ] })
              }
            ),
            openSections.has(`pattern-${index}`) && /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", "data-id": "yjd91z85t", "data-path": "src/components/MemoryLeakPreventionGuide.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-4", "data-id": "c47v43f25", "data-path": "src/components/MemoryLeakPreventionGuide.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "2wrp355wz", "data-path": "src/components/MemoryLeakPreventionGuide.tsx", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-semibold text-red-600 mb-2", "data-id": "sephttjn8", "data-path": "src/components/MemoryLeakPreventionGuide.tsx", children: "❌ Problematic Code" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "bg-red-50 border border-red-200 rounded p-3 text-sm overflow-x-auto", "data-id": "tjk9um1fg", "data-path": "src/components/MemoryLeakPreventionGuide.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx("code", { "data-id": "rvz8in9oe", "data-path": "src/components/MemoryLeakPreventionGuide.tsx", children: pattern.badCode }) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "fl2l13ahs", "data-path": "src/components/MemoryLeakPreventionGuide.tsx", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-semibold text-green-600 mb-2", "data-id": "dgoanmfal", "data-path": "src/components/MemoryLeakPreventionGuide.tsx", children: "✅ Correct Code" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "bg-green-50 border border-green-200 rounded p-3 text-sm overflow-x-auto", "data-id": "ysdmlb8ay", "data-path": "src/components/MemoryLeakPreventionGuide.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx("code", { "data-id": "p2gcd2z5b", "data-path": "src/components/MemoryLeakPreventionGuide.tsx", children: pattern.goodCode }) })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { "data-id": "7z64gntmn", "data-path": "src/components/MemoryLeakPreventionGuide.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Lightbulb, { className: "h-4 w-4", "data-id": "fbo76aaxg", "data-path": "src/components/MemoryLeakPreventionGuide.tsx" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { "data-id": "zo9edg9on", "data-path": "src/components/MemoryLeakPreventionGuide.tsx", children: pattern.explanation })
              ] })
            ] })
          ] }) }, index)
        ) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "practices", className: "space-y-4", "data-id": "sqtqi9ll4", "data-path": "src/components/MemoryLeakPreventionGuide.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4", "data-id": "b3dd9s84s", "data-path": "src/components/MemoryLeakPreventionGuide.tsx", children: bestPractices.map(
        (practice, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "2doaciajn", "data-path": "src/components/MemoryLeakPreventionGuide.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { "data-id": "vaf47xo51", "data-path": "src/components/MemoryLeakPreventionGuide.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", "data-id": "8sb3y0i5x", "data-path": "src/components/MemoryLeakPreventionGuide.tsx", children: [
              practice.icon,
              practice.title
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { "data-id": "otgv2k3v6", "data-path": "src/components/MemoryLeakPreventionGuide.tsx", children: practice.description })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { "data-id": "7m4q1rsrc", "data-path": "src/components/MemoryLeakPreventionGuide.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2", "data-id": "jxj7ncngi", "data-path": "src/components/MemoryLeakPreventionGuide.tsx", children: practice.tips.map(
            (tip, tipIndex) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2", "data-id": "z8j0alaqq", "data-path": "src/components/MemoryLeakPreventionGuide.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-4 w-4 text-green-600 mt-0.5 flex-shrink-0", "data-id": "u0ah7vpni", "data-path": "src/components/MemoryLeakPreventionGuide.tsx" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", "data-id": "tc26h1bkq", "data-path": "src/components/MemoryLeakPreventionGuide.tsx", children: tip })
            ] }, tipIndex)
          ) }) })
        ] }, index)
      ) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "checklist", className: "space-y-4", "data-id": "w3kqbbgzs", "data-path": "src/components/MemoryLeakPreventionGuide.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "l0y3ks5x9", "data-path": "src/components/MemoryLeakPreventionGuide.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { "data-id": "daru9uknp", "data-path": "src/components/MemoryLeakPreventionGuide.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", "data-id": "444t3jmtx", "data-path": "src/components/MemoryLeakPreventionGuide.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-5 w-5", "data-id": "mmkfnjs2h", "data-path": "src/components/MemoryLeakPreventionGuide.tsx" }),
            "Memory Leak Prevention Checklist"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { "data-id": "1kez7gyj1", "data-path": "src/components/MemoryLeakPreventionGuide.tsx", children: "Use this checklist when reviewing components for potential memory leaks" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { "data-id": "h1c1oyoa2", "data-path": "src/components/MemoryLeakPreventionGuide.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3", "data-id": "9t1yww3k3", "data-path": "src/components/MemoryLeakPreventionGuide.tsx", children: checklistItems.map(
          (item, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 p-2 rounded hover:bg-muted/50", "data-id": "9bd6ih1bg", "data-path": "src/components/MemoryLeakPreventionGuide.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-4 w-4 text-green-600 mt-0.5 flex-shrink-0", "data-id": "c320fl8kf", "data-path": "src/components/MemoryLeakPreventionGuide.tsx" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", "data-id": "ohcnbl01x", "data-path": "src/components/MemoryLeakPreventionGuide.tsx", children: item.replace("✅ ", "") })
          ] }, index)
        ) }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "tools", className: "space-y-4", "data-id": "9iso0oowi", "data-path": "src/components/MemoryLeakPreventionGuide.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4", "data-id": "zio42xk0i", "data-path": "src/components/MemoryLeakPreventionGuide.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "n7apllg0k", "data-path": "src/components/MemoryLeakPreventionGuide.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { "data-id": "e8l1b1pt9", "data-path": "src/components/MemoryLeakPreventionGuide.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { "data-id": "pzqop0055", "data-path": "src/components/MemoryLeakPreventionGuide.tsx", children: "useMemoryLeakDetector Hook" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { "data-id": "tpn2qi65d", "data-path": "src/components/MemoryLeakPreventionGuide.tsx", children: "Automatically track and clean up component resources" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { "data-id": "fpnm1dx0b", "data-path": "src/components/MemoryLeakPreventionGuide.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "bg-muted p-4 rounded-lg overflow-x-auto text-sm", "data-id": "6owqnqiep", "data-path": "src/components/MemoryLeakPreventionGuide.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx("code", { "data-id": "elfdgnsu6", "data-path": "src/components/MemoryLeakPreventionGuide.tsx", children: `import useMemoryLeakDetector from '@/hooks/use-memory-leak-detector';

function MyComponent() {
  const memoryTools = useMemoryLeakDetector('MyComponent');
  
  useEffect(() => {
    // Safe timer that auto-cleans
    const timer = memoryTools.safeSetTimeout(() => {
      console.log('Timer executed');
    }, 1000);
    
    // Safe event listener that auto-removes
    memoryTools.safeAddEventListener(window, 'scroll', handleScroll);
    
    return memoryTools.cleanup.all;
  }, []);
  
  return <div>Component content</div>;
}` }) }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "yo9xsfdmm", "data-path": "src/components/MemoryLeakPreventionGuide.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { "data-id": "kkivnbtc8", "data-path": "src/components/MemoryLeakPreventionGuide.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { "data-id": "vdblb4485", "data-path": "src/components/MemoryLeakPreventionGuide.tsx", children: "useSafeAsync Hook" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { "data-id": "s4n4ifw9d", "data-path": "src/components/MemoryLeakPreventionGuide.tsx", children: "Handle async operations with automatic cancellation" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { "data-id": "7p18di5u5", "data-path": "src/components/MemoryLeakPreventionGuide.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "bg-muted p-4 rounded-lg overflow-x-auto text-sm", "data-id": "jayzcqazq", "data-path": "src/components/MemoryLeakPreventionGuide.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx("code", { "data-id": "okylzip64", "data-path": "src/components/MemoryLeakPreventionGuide.tsx", children: `import useSafeAsync from '@/hooks/use-safe-async';

function MyComponent() {
  const { safeApiCall } = useSafeAsync('MyComponent');
  const [data, setData] = useState(null);
  
  useEffect(() => {
    safeApiCall(
      () => window.ezsite.apis.tablePage(tableId, params),
      {
        onSuccess: (result) => setData(result.data),
        onError: (error) => console.error(error)
      }
    );
  }, []);
  
  return <div>{data ? 'Loaded' : 'Loading...'}</div>;
}` }) }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "hfs5inrk7", "data-path": "src/components/MemoryLeakPreventionGuide.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { "data-id": "3av5awtk9", "data-path": "src/components/MemoryLeakPreventionGuide.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { "data-id": "eydz6f235", "data-path": "src/components/MemoryLeakPreventionGuide.tsx", children: "Memory Leak Dashboard" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { "data-id": "ecozacgg7", "data-path": "src/components/MemoryLeakPreventionGuide.tsx", children: "Real-time monitoring of memory usage and leak detection" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-2", "data-id": "yolpwxsqz", "data-path": "src/components/MemoryLeakPreventionGuide.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", "data-id": "6i8cj692o", "data-path": "src/components/MemoryLeakPreventionGuide.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { "data-id": "xgv180fon", "data-path": "src/components/MemoryLeakPreventionGuide.tsx", children: "Real-time monitoring" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { "data-id": "7acdv35cv", "data-path": "src/components/MemoryLeakPreventionGuide.tsx", children: "Component tracking" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { "data-id": "qu881evsh", "data-path": "src/components/MemoryLeakPreventionGuide.tsx", children: "Leak detection" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { "data-id": "khpbjli1s", "data-path": "src/components/MemoryLeakPreventionGuide.tsx", children: "Memory reports" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", "data-id": "gk2rkn4z8", "data-path": "src/components/MemoryLeakPreventionGuide.tsx", children: "Access the dashboard at /admin/memory-monitoring to view detailed memory usage statistics and potential leak reports." })
          ] })
        ] })
      ] }) })
    ] })
  ] });
};
const BadComponent = ({ onStop }) => {
  const [count, setCount] = reactExports.useState(0);
  const { toast } = useToast();
  reactExports.useEffect(() => {
    setInterval(() => {
      setCount((prev) => prev + 1);
    }, 1e3);
  }, []);
  reactExports.useEffect(() => {
    if (count > 10) {
      toast({
        title: "Memory Leak Demo",
        description: "Timer has been running for 10 seconds without cleanup!",
        variant: "destructive"
      });
      onStop();
    }
  }, [count, onStop, toast]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border border-red-200 rounded-lg bg-red-50", "data-id": "eevqd5xhg", "data-path": "src/components/MemoryLeakDemo.tsx", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-red-900 mb-2", "data-id": "yfj71hp66", "data-path": "src/components/MemoryLeakDemo.tsx", children: "❌ Component with Memory Leaks" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-red-700 text-sm mb-2", "data-id": "o9zve6g8p", "data-path": "src/components/MemoryLeakDemo.tsx", children: [
      "Count: ",
      count
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { className: "mt-2", "data-id": "wudqgjqhm", "data-path": "src/components/MemoryLeakDemo.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4", "data-id": "v56gdmqqv", "data-path": "src/components/MemoryLeakDemo.tsx" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { className: "text-red-800", "data-id": "z6fuybz64", "data-path": "src/components/MemoryLeakDemo.tsx", children: "This component has active timers that won't be cleaned up!" })
    ] })
  ] });
};
const GoodComponent = ({ onStop }) => {
  const [count, setCount] = reactExports.useState(0);
  const { toast } = useToast();
  reactExports.useEffect(() => {
    const timer = setTimeout(() => {
      setCount((prev) => prev + 1);
    }, 1e3);
    return () => clearTimeout(timer);
  }, [count]);
  reactExports.useEffect(() => {
    if (count > 10) {
      toast({
        title: "Memory Safe Demo",
        description: "Timer has been safely managed for 10 seconds!"
      });
      onStop();
    }
  }, [count, onStop, toast]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border border-green-200 rounded-lg bg-green-50", "data-id": "gxdnf5pu4", "data-path": "src/components/MemoryLeakDemo.tsx", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-green-900 mb-2", "data-id": "7w26kcdvs", "data-path": "src/components/MemoryLeakDemo.tsx", children: "✅ Component with Memory Protection" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-green-700 text-sm mb-2", "data-id": "xr84gtzra", "data-path": "src/components/MemoryLeakDemo.tsx", children: [
      "Count: ",
      count
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { className: "mt-2", "data-id": "sczf7ajrr", "data-path": "src/components/MemoryLeakDemo.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-4 w-4", "data-id": "qirwbq5sz", "data-path": "src/components/MemoryLeakDemo.tsx" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { className: "text-green-800", "data-id": "37036hehv", "data-path": "src/components/MemoryLeakDemo.tsx", children: "This component properly cleans up its resources!" })
    ] })
  ] });
};
const MemoryLeakDemo = () => {
  const [badComponentActive, setBadComponentActive] = reactExports.useState(false);
  const [goodComponentActive, setGoodComponentActive] = reactExports.useState(false);
  const startBadDemo = () => {
    setBadComponentActive(true);
    setTimeout(() => {
      setBadComponentActive(false);
    }, 15e3);
  };
  const startGoodDemo = () => {
    setGoodComponentActive(true);
    setTimeout(() => {
      setGoodComponentActive(false);
    }, 15e3);
  };
  const stopBadDemo = () => {
    setBadComponentActive(false);
  };
  const stopGoodDemo = () => {
    setGoodComponentActive(false);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-id": "7mjatho6s", "data-path": "src/components/MemoryLeakDemo.tsx", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", "data-id": "b8zya9j5v", "data-path": "src/components/MemoryLeakDemo.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold mb-2", "data-id": "nt4unsuu1", "data-path": "src/components/MemoryLeakDemo.tsx", children: "Memory Leak Detection Demo" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", "data-id": "mri75enp4", "data-path": "src/components/MemoryLeakDemo.tsx", children: "Compare components with and without memory leak protection" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "comparison", className: "space-y-4", "data-id": "h3rkkjqn4", "data-path": "src/components/MemoryLeakDemo.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid w-full grid-cols-2", "data-id": "xkejefwoa", "data-path": "src/components/MemoryLeakDemo.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "comparison", "data-id": "deb4ymjfm", "data-path": "src/components/MemoryLeakDemo.tsx", children: "Live Comparison" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "patterns", "data-id": "ocy1ofz46", "data-path": "src/components/MemoryLeakDemo.tsx", children: "Leak Patterns" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "comparison", className: "space-y-4", "data-id": "0mp565ti9", "data-path": "src/components/MemoryLeakDemo.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-6", "data-id": "fgbc4uvcv", "data-path": "src/components/MemoryLeakDemo.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "hoc0k9i8m", "data-path": "src/components/MemoryLeakDemo.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { "data-id": "8uq1iufi6", "data-path": "src/components/MemoryLeakDemo.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 text-red-600", "data-id": "whvmz1n3a", "data-path": "src/components/MemoryLeakDemo.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-5 w-5", "data-id": "879e63924", "data-path": "src/components/MemoryLeakDemo.tsx" }),
                "Memory Leak Component"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { "data-id": "gumo276m7", "data-path": "src/components/MemoryLeakDemo.tsx", children: "Demonstrates common memory leak patterns" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", "data-id": "wn9o1whg4", "data-path": "src/components/MemoryLeakDemo.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", "data-id": "9z16dls2j", "data-path": "src/components/MemoryLeakDemo.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    onClick: startBadDemo,
                    disabled: badComponentActive,
                    variant: "destructive",
                    size: "sm",
                    "data-id": "fneghorhf",
                    "data-path": "src/components/MemoryLeakDemo.tsx",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "h-4 w-4 mr-2", "data-id": "q4qb7etar", "data-path": "src/components/MemoryLeakDemo.tsx" }),
                      "Start Leak Demo"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    onClick: stopBadDemo,
                    disabled: !badComponentActive,
                    variant: "outline",
                    size: "sm",
                    "data-id": "go2qh17e0",
                    "data-path": "src/components/MemoryLeakDemo.tsx",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Square, { className: "h-4 w-4 mr-2", "data-id": "tibz9kj20", "data-path": "src/components/MemoryLeakDemo.tsx" }),
                      "Stop"
                    ]
                  }
                ),
                badComponentActive && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "destructive", "data-id": "qay0lji6w", "data-path": "src/components/MemoryLeakDemo.tsx", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-3 w-3 mr-1", "data-id": "taopt75km", "data-path": "src/components/MemoryLeakDemo.tsx" }),
                  "Active Leaks"
                ] })
              ] }),
              badComponentActive && /* @__PURE__ */ jsxRuntimeExports.jsx(BadComponent, { onStop: stopBadDemo, "data-id": "qch0j54bg", "data-path": "src/components/MemoryLeakDemo.tsx" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "281fpbb4q", "data-path": "src/components/MemoryLeakDemo.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { "data-id": "76v2hrjnn", "data-path": "src/components/MemoryLeakDemo.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 text-green-600", "data-id": "izp8qcxym", "data-path": "src/components/MemoryLeakDemo.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-5 w-5", "data-id": "57v1bemvq", "data-path": "src/components/MemoryLeakDemo.tsx" }),
                "Memory Safe Component"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { "data-id": "gjk3b9a4s", "data-path": "src/components/MemoryLeakDemo.tsx", children: "Uses proper cleanup patterns" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", "data-id": "yfkifxurc", "data-path": "src/components/MemoryLeakDemo.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", "data-id": "nrqrang49", "data-path": "src/components/MemoryLeakDemo.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    onClick: startGoodDemo,
                    disabled: goodComponentActive,
                    size: "sm",
                    "data-id": "cawv85yy3",
                    "data-path": "src/components/MemoryLeakDemo.tsx",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "h-4 w-4 mr-2", "data-id": "435rop0r3", "data-path": "src/components/MemoryLeakDemo.tsx" }),
                      "Start Safe Demo"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    onClick: stopGoodDemo,
                    disabled: !goodComponentActive,
                    variant: "outline",
                    size: "sm",
                    "data-id": "itcxh6mf1",
                    "data-path": "src/components/MemoryLeakDemo.tsx",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Square, { className: "h-4 w-4 mr-2", "data-id": "nxr1vwouj", "data-path": "src/components/MemoryLeakDemo.tsx" }),
                      "Stop"
                    ]
                  }
                ),
                goodComponentActive && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "default", "data-id": "me3ofv0ca", "data-path": "src/components/MemoryLeakDemo.tsx", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-3 w-3 mr-1", "data-id": "hosxw32gl", "data-path": "src/components/MemoryLeakDemo.tsx" }),
                  "Protected"
                ] })
              ] }),
              goodComponentActive && /* @__PURE__ */ jsxRuntimeExports.jsx(GoodComponent, { onStop: stopGoodDemo, "data-id": "5lzs0i9to", "data-path": "src/components/MemoryLeakDemo.tsx" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { "data-id": "izbf7320x", "data-path": "src/components/MemoryLeakDemo.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-4 w-4", "data-id": "qu4fu1tfk", "data-path": "src/components/MemoryLeakDemo.tsx" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDescription, { "data-id": "wq5n3w37m", "data-path": "src/components/MemoryLeakDemo.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { "data-id": "nmy595osd", "data-path": "src/components/MemoryLeakDemo.tsx", children: "Monitor the Memory Dashboard:" }),
            " Run these demos and watch the memory dashboard to see the difference in memory usage and leak detection between the two approaches. The bad component will trigger leak warnings, while the good component will show clean monitoring."
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "patterns", className: "space-y-4", "data-id": "5wy9repcj", "data-path": "src/components/MemoryLeakDemo.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4", "data-id": "u08yhyaw4", "data-path": "src/components/MemoryLeakDemo.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-red-200", "data-id": "dfxyip3rd", "data-path": "src/components/MemoryLeakDemo.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "cp7dh06l3", "data-path": "src/components/MemoryLeakDemo.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 text-red-600", "data-id": "qgci7uzr8", "data-path": "src/components/MemoryLeakDemo.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Timer, { className: "h-5 w-5", "data-id": "utxzvv6oz", "data-path": "src/components/MemoryLeakDemo.tsx" }),
            "Timer Leaks"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { "data-id": "dfdd798so", "data-path": "src/components/MemoryLeakDemo.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-2", "data-id": "zyl3tw78v", "data-path": "src/components/MemoryLeakDemo.tsx", children: "Timers that aren't cleared continue running after component unmount" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "destructive", "data-id": "r2l69avei", "data-path": "src/components/MemoryLeakDemo.tsx", children: "High Impact" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-orange-200", "data-id": "upjwealm6", "data-path": "src/components/MemoryLeakDemo.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "17fkp8owl", "data-path": "src/components/MemoryLeakDemo.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 text-orange-600", "data-id": "m2voymc53", "data-path": "src/components/MemoryLeakDemo.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MousePointer, { className: "h-5 w-5", "data-id": "ljgg48021", "data-path": "src/components/MemoryLeakDemo.tsx" }),
            "Event Listener Leaks"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { "data-id": "4uoorub9q", "data-path": "src/components/MemoryLeakDemo.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-2", "data-id": "kdjih11xs", "data-path": "src/components/MemoryLeakDemo.tsx", children: "Event listeners hold references preventing garbage collection" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", "data-id": "ye8202xum", "data-path": "src/components/MemoryLeakDemo.tsx", children: "Medium Impact" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-purple-200", "data-id": "uiaj5hvps", "data-path": "src/components/MemoryLeakDemo.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "ab6bu5405", "data-path": "src/components/MemoryLeakDemo.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 text-purple-600", "data-id": "7egh7u6xc", "data-path": "src/components/MemoryLeakDemo.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-5 w-5", "data-id": "iei8ejgc9", "data-path": "src/components/MemoryLeakDemo.tsx" }),
            "Async Operation Leaks"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { "data-id": "ni2fc192r", "data-path": "src/components/MemoryLeakDemo.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-2", "data-id": "0gtpmgy35", "data-path": "src/components/MemoryLeakDemo.tsx", children: "Fetch requests and promises completing after unmount" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", "data-id": "zv57rvozn", "data-path": "src/components/MemoryLeakDemo.tsx", children: "Medium Impact" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-blue-200", "data-id": "kc968qo89", "data-path": "src/components/MemoryLeakDemo.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "6e7lcw1wj", "data-path": "src/components/MemoryLeakDemo.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 text-blue-600", "data-id": "rmadvhr50", "data-path": "src/components/MemoryLeakDemo.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Database, { className: "h-5 w-5", "data-id": "fwuj2f2cr", "data-path": "src/components/MemoryLeakDemo.tsx" }),
            "Subscription Leaks"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { "data-id": "ne6017xan", "data-path": "src/components/MemoryLeakDemo.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-2", "data-id": "anwl35clj", "data-path": "src/components/MemoryLeakDemo.tsx", children: "Observables and subscriptions not properly unsubscribed" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", "data-id": "9fwlzii5w", "data-path": "src/components/MemoryLeakDemo.tsx", children: "High Impact" })
          ] })
        ] })
      ] }) })
    ] })
  ] });
};
const MemoryMonitoring = () => {
  const { hasMonitoringAccess } = useAdminAccess();
  if (!hasMonitoringAccess) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      AccessDenied,
      {
        feature: "Memory Leak Monitoring System",
        requiredRole: "Administrator",
        "data-id": "p7z38ixsv",
        "data-path": "src/pages/Admin/MemoryMonitoring.tsx"
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto p-6 space-y-6", "data-id": "rukn3ewv5", "data-path": "src/pages/Admin/MemoryMonitoring.tsx", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-2", "data-id": "8zcjazz7k", "data-path": "src/pages/Admin/MemoryMonitoring.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent", "data-id": "m2cmsyi9u", "data-path": "src/pages/Admin/MemoryMonitoring.tsx", children: "Memory Leak Monitoring System" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-lg max-w-3xl mx-auto", "data-id": "xlio1qsf3", "data-path": "src/pages/Admin/MemoryMonitoring.tsx", children: "Comprehensive memory leak detection, prevention, and monitoring for React applications. Keep your DFS Manager Portal running smoothly with real-time memory analysis." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8", "data-id": "w1r45qc8k", "data-path": "src/pages/Admin/MemoryMonitoring.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-blue-200 bg-blue-50/50", "data-id": "uivkr8sm6", "data-path": "src/pages/Admin/MemoryMonitoring.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", "data-id": "fpu3d50th", "data-path": "src/pages/Admin/MemoryMonitoring.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "wwpr05ske", "data-path": "src/pages/Admin/MemoryMonitoring.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-8 w-8 text-blue-600", "data-id": "y4939j8lk", "data-path": "src/pages/Admin/MemoryMonitoring.tsx" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", "data-id": "ehktpeodg", "data-path": "src/pages/Admin/MemoryMonitoring.tsx", children: "Real-time" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { "data-id": "3sy8p3114", "data-path": "src/pages/Admin/MemoryMonitoring.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-blue-900", "data-id": "dzrwlusga", "data-path": "src/pages/Admin/MemoryMonitoring.tsx", children: "Live Monitoring" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-blue-700", "data-id": "rwhbfe5yq", "data-path": "src/pages/Admin/MemoryMonitoring.tsx", children: "Track memory usage and component lifecycle in real-time" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-green-200 bg-green-50/50", "data-id": "lmewode58", "data-path": "src/pages/Admin/MemoryMonitoring.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", "data-id": "ep9j31bn7", "data-path": "src/pages/Admin/MemoryMonitoring.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "vpm3xy1mp", "data-path": "src/pages/Admin/MemoryMonitoring.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-8 w-8 text-green-600", "data-id": "577bz5z7k", "data-path": "src/pages/Admin/MemoryMonitoring.tsx" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", "data-id": "md8dpa757", "data-path": "src/pages/Admin/MemoryMonitoring.tsx", children: "Prevention" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { "data-id": "gixh6qod1", "data-path": "src/pages/Admin/MemoryMonitoring.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-green-900", "data-id": "00bdn88po", "data-path": "src/pages/Admin/MemoryMonitoring.tsx", children: "Leak Prevention" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-green-700", "data-id": "283js099l", "data-path": "src/pages/Admin/MemoryMonitoring.tsx", children: "Automatic cleanup and safe resource management" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-purple-200 bg-purple-50/50", "data-id": "pzob8v48v", "data-path": "src/pages/Admin/MemoryMonitoring.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", "data-id": "ydvohw9ie", "data-path": "src/pages/Admin/MemoryMonitoring.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "5y5uxe3ic", "data-path": "src/pages/Admin/MemoryMonitoring.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-8 w-8 text-purple-600", "data-id": "01n2dedah", "data-path": "src/pages/Admin/MemoryMonitoring.tsx" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", "data-id": "f4tr8ml45", "data-path": "src/pages/Admin/MemoryMonitoring.tsx", children: "Analytics" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { "data-id": "ofqnp2j7d", "data-path": "src/pages/Admin/MemoryMonitoring.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-purple-900", "data-id": "14sfzgwn6", "data-path": "src/pages/Admin/MemoryMonitoring.tsx", children: "Memory Analytics" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-purple-700", "data-id": "uh4st4guo", "data-path": "src/pages/Admin/MemoryMonitoring.tsx", children: "Detailed reports and memory usage patterns" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-orange-200 bg-orange-50/50", "data-id": "odkrvlfyr", "data-path": "src/pages/Admin/MemoryMonitoring.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", "data-id": "xqpcorr35", "data-path": "src/pages/Admin/MemoryMonitoring.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "oovla6lnd", "data-path": "src/pages/Admin/MemoryMonitoring.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-8 w-8 text-orange-600", "data-id": "50i9qb8ac", "data-path": "src/pages/Admin/MemoryMonitoring.tsx" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", "data-id": "2f1lrall9", "data-path": "src/pages/Admin/MemoryMonitoring.tsx", children: "Detection" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { "data-id": "nm3g4j75i", "data-path": "src/pages/Admin/MemoryMonitoring.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-orange-900", "data-id": "qsbikwce8", "data-path": "src/pages/Admin/MemoryMonitoring.tsx", children: "Leak Detection" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-orange-700", "data-id": "8ujs2af7l", "data-path": "src/pages/Admin/MemoryMonitoring.tsx", children: "Automatic detection of common memory leak patterns" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "dashboard", className: "space-y-6", "data-id": "lpncs1vei", "data-path": "src/pages/Admin/MemoryMonitoring.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid w-full grid-cols-3", "data-id": "0jv3ysz89", "data-path": "src/pages/Admin/MemoryMonitoring.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "dashboard", className: "flex items-center gap-2", "data-id": "y59hxm41m", "data-path": "src/pages/Admin/MemoryMonitoring.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-4 w-4", "data-id": "kpgxco112", "data-path": "src/pages/Admin/MemoryMonitoring.tsx" }),
          "Live Dashboard"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "demo", className: "flex items-center gap-2", "data-id": "bav9kiwui", "data-path": "src/pages/Admin/MemoryMonitoring.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "h-4 w-4", "data-id": "nri4zy57v", "data-path": "src/pages/Admin/MemoryMonitoring.tsx" }),
          "Interactive Demo"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "guide", className: "flex items-center gap-2", "data-id": "bztk52sky", "data-path": "src/pages/Admin/MemoryMonitoring.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-4 w-4", "data-id": "sx3wuszhu", "data-path": "src/pages/Admin/MemoryMonitoring.tsx" }),
          "Prevention Guide"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "dashboard", className: "space-y-6", "data-id": "4z00zwamy", "data-path": "src/pages/Admin/MemoryMonitoring.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "h24pesfae", "data-path": "src/pages/Admin/MemoryMonitoring.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { "data-id": "1kmg14yxz", "data-path": "src/pages/Admin/MemoryMonitoring.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", "data-id": "t2kac7klo", "data-path": "src/pages/Admin/MemoryMonitoring.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-5 w-5", "data-id": "99itf8bge", "data-path": "src/pages/Admin/MemoryMonitoring.tsx" }),
            "Memory Leak Dashboard"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { "data-id": "qygw00nmy", "data-path": "src/pages/Admin/MemoryMonitoring.tsx", children: "Real-time monitoring of memory usage, component tracking, and leak detection for your DFS Manager Portal." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { "data-id": "i3i80vecu", "data-path": "src/pages/Admin/MemoryMonitoring.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MemoryLeakDashboard, { "data-id": "ajcisn52q", "data-path": "src/pages/Admin/MemoryMonitoring.tsx" }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "demo", className: "space-y-6", "data-id": "pvwna82hr", "data-path": "src/pages/Admin/MemoryMonitoring.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "yfebv93w1", "data-path": "src/pages/Admin/MemoryMonitoring.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { "data-id": "kgm1p7etd", "data-path": "src/pages/Admin/MemoryMonitoring.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", "data-id": "jhglxlolq", "data-path": "src/pages/Admin/MemoryMonitoring.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "h-5 w-5", "data-id": "ukkfvsic0", "data-path": "src/pages/Admin/MemoryMonitoring.tsx" }),
            "Interactive Memory Leak Demo"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { "data-id": "p6c1zoikf", "data-path": "src/pages/Admin/MemoryMonitoring.tsx", children: "Experience the difference between memory-safe and leak-prone components in real-time." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { "data-id": "xo48ho0dl", "data-path": "src/pages/Admin/MemoryMonitoring.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MemoryLeakDemo, { "data-id": "d84ak4cjn", "data-path": "src/pages/Admin/MemoryMonitoring.tsx" }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "guide", className: "space-y-6", "data-id": "isoskqy3p", "data-path": "src/pages/Admin/MemoryMonitoring.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "v1f2d8sz6", "data-path": "src/pages/Admin/MemoryMonitoring.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { "data-id": "3zla58gu6", "data-path": "src/pages/Admin/MemoryMonitoring.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", "data-id": "s8yabbk08", "data-path": "src/pages/Admin/MemoryMonitoring.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-5 w-5", "data-id": "a0to54rf7", "data-path": "src/pages/Admin/MemoryMonitoring.tsx" }),
            "Memory Leak Prevention Guide"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { "data-id": "6e3pviyf2", "data-path": "src/pages/Admin/MemoryMonitoring.tsx", children: "Learn best practices, common patterns, and how to use our monitoring tools to prevent memory leaks." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { "data-id": "wqel7l3av", "data-path": "src/pages/Admin/MemoryMonitoring.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MemoryLeakPreventionGuide, { "data-id": "s81qcvj8s", "data-path": "src/pages/Admin/MemoryMonitoring.tsx" }) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200", "data-id": "xnl4f2c88", "data-path": "src/pages/Admin/MemoryMonitoring.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-6", "data-id": "mg73wq8p7", "data-path": "src/pages/Admin/MemoryMonitoring.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-2", "data-id": "wecy7vjmb", "data-path": "src/pages/Admin/MemoryMonitoring.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-blue-900", "data-id": "vsqyu0wz6", "data-path": "src/pages/Admin/MemoryMonitoring.tsx", children: "Memory Monitoring Status" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-4 text-sm", "data-id": "u853qcxv9", "data-path": "src/pages/Admin/MemoryMonitoring.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", "data-id": "ws0dmm9jk", "data-path": "src/pages/Admin/MemoryMonitoring.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 bg-green-500 rounded-full", "data-id": "5oqkw1so8", "data-path": "src/pages/Admin/MemoryMonitoring.tsx" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "qdx8mj1kc", "data-path": "src/pages/Admin/MemoryMonitoring.tsx", children: "Monitoring Active" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", "data-id": "ndymk7iim", "data-path": "src/pages/Admin/MemoryMonitoring.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 bg-blue-500 rounded-full", "data-id": "bfijkzwxb", "data-path": "src/pages/Admin/MemoryMonitoring.tsx" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "jqawkdwqz", "data-path": "src/pages/Admin/MemoryMonitoring.tsx", children: "Real-time Updates" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", "data-id": "kdbhz35ps", "data-path": "src/pages/Admin/MemoryMonitoring.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 bg-purple-500 rounded-full", "data-id": "crrlibe1i", "data-path": "src/pages/Admin/MemoryMonitoring.tsx" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "amhz7lzjc", "data-path": "src/pages/Admin/MemoryMonitoring.tsx", children: "Leak Detection Enabled" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", "data-id": "iqulrh7a0", "data-path": "src/pages/Admin/MemoryMonitoring.tsx", children: "Memory monitoring is automatically enabled for all components using our detection hooks." })
    ] }) }) })
  ] });
};
const MemoryMonitoring$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: MemoryMonitoring
}, Symbol.toStringTag, { value: "Module" }));
const _DatabaseConnectionManager = class _DatabaseConnectionManager {
  constructor() {
    __publicField(this, "activeConnections", /* @__PURE__ */ new Set());
    __publicField(this, "idleConnections", /* @__PURE__ */ new Set());
    __publicField(this, "requestQueue", []);
    __publicField(this, "config", {
      maxConnections: 80,
      // Lower than the 100 limit to provide buffer
      idleTimeout: 3e4,
      // 30 seconds
      connectionTimeout: 1e4,
      // 10 seconds
      retryAttempts: 3,
      retryDelay: 1e3,
      // 1 second
      healthCheckInterval: 6e4
      // 1 minute
    });
    __publicField(this, "healthCheckInterval", null);
    __publicField(this, "connectionCleanupInterval", null);
    __publicField(this, "alertThresholds", {
      warning: 0.7,
      // 70% of max connections
      critical: 0.85
      // 85% of max connections
    });
    this.startHealthCheck();
    this.startConnectionCleanup();
  }
  static getInstance() {
    if (!_DatabaseConnectionManager.instance) {
      _DatabaseConnectionManager.instance = new _DatabaseConnectionManager();
    }
    return _DatabaseConnectionManager.instance;
  }
  async acquireConnection() {
    const connectionId = this.generateConnectionId();
    if (this.activeConnections.size >= this.config.maxConnections) {
      console.warn("Database connection pool at capacity, queuing request");
      return this.queueConnection(connectionId);
    }
    const idleConnectionId = this.getIdleConnection();
    if (idleConnectionId) {
      this.activateConnection(idleConnectionId);
      return idleConnectionId;
    }
    this.activeConnections.add(connectionId);
    this.logConnectionStats();
    return connectionId;
  }
  releaseConnection(connectionId) {
    if (!this.activeConnections.has(connectionId)) {
      console.warn(`Attempted to release non-existent connection: ${connectionId}`);
      return;
    }
    this.activeConnections.delete(connectionId);
    this.idleConnections.add(connectionId);
    setTimeout(() => {
      this.cleanupIdleConnection(connectionId);
    }, this.config.idleTimeout);
    this.processQueue();
    this.logConnectionStats();
  }
  forceCloseConnection(connectionId) {
    this.activeConnections.delete(connectionId);
    this.idleConnections.delete(connectionId);
    console.log(`Forcefully closed connection: ${connectionId}`);
    this.processQueue();
    this.logConnectionStats();
  }
  async queueConnection(connectionId) {
    return new Promise((resolve, reject) => {
      const queueItem = {
        id: connectionId,
        timestamp: Date.now(),
        resolve,
        reject
      };
      this.requestQueue.push(queueItem);
      setTimeout(() => {
        const index = this.requestQueue.findIndex((item) => item.id === connectionId);
        if (index !== -1) {
          this.requestQueue.splice(index, 1);
          reject(new Error(`Connection request timeout after ${this.config.connectionTimeout}ms`));
        }
      }, this.config.connectionTimeout);
    });
  }
  getIdleConnection() {
    const idleConnectionArray = Array.from(this.idleConnections);
    if (idleConnectionArray.length > 0) {
      const connectionId = idleConnectionArray[0];
      this.idleConnections.delete(connectionId);
      return connectionId;
    }
    return null;
  }
  activateConnection(connectionId) {
    this.idleConnections.delete(connectionId);
    this.activeConnections.add(connectionId);
  }
  processQueue() {
    while (this.requestQueue.length > 0 && this.activeConnections.size < this.config.maxConnections) {
      const queueItem = this.requestQueue.shift();
      if (Date.now() - queueItem.timestamp < this.config.connectionTimeout) {
        this.activeConnections.add(queueItem.id);
        queueItem.resolve(queueItem.id);
      } else {
        queueItem.reject(new Error("Connection request timeout"));
      }
    }
  }
  cleanupIdleConnection(connectionId) {
    if (this.idleConnections.has(connectionId)) {
      this.idleConnections.delete(connectionId);
      console.log(`Cleaned up idle connection: ${connectionId}`);
    }
  }
  generateConnectionId() {
    return `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  startHealthCheck() {
    this.healthCheckInterval = setInterval(() => {
      this.performHealthCheck();
    }, this.config.healthCheckInterval);
  }
  startConnectionCleanup() {
    this.connectionCleanupInterval = setInterval(() => {
      this.cleanupStaleConnections();
    }, this.config.idleTimeout / 2);
  }
  performHealthCheck() {
    const stats = this.getConnectionStats();
    if (stats.connectionPressure >= this.alertThresholds.critical) {
      console.error("🚨 CRITICAL: Database connection usage is critically high!", stats);
      this.triggerEmergencyCleanup();
    } else if (stats.connectionPressure >= this.alertThresholds.warning) {
      console.warn("⚠️ WARNING: Database connection usage is high", stats);
      this.optimizeConnections();
    }
    this.cleanupLongRunningConnections();
  }
  cleanupStaleConnections() {
    const now = Date.now();
    const staleConnections = [];
    this.idleConnections.forEach((connectionId) => {
      const timestamp = parseInt(connectionId.split("_")[1]);
      if (now - timestamp > this.config.idleTimeout) {
        staleConnections.push(connectionId);
      }
    });
    staleConnections.forEach((connectionId) => {
      this.idleConnections.delete(connectionId);
      console.log(`Removed stale idle connection: ${connectionId}`);
    });
  }
  cleanupLongRunningConnections() {
    const now = Date.now();
    const longRunningThreshold = 3e5;
    const longRunningConnections = [];
    this.activeConnections.forEach((connectionId) => {
      const timestamp = parseInt(connectionId.split("_")[1]);
      if (now - timestamp > longRunningThreshold) {
        longRunningConnections.push(connectionId);
      }
    });
    if (longRunningConnections.length > 0) {
      console.warn(`Found ${longRunningConnections.length} long-running connections`, longRunningConnections);
      const stats = this.getConnectionStats();
      if (stats.connectionPressure > this.alertThresholds.warning) {
        const connectionsToClose = Math.min(longRunningConnections.length, 5);
        for (let i = 0; i < connectionsToClose; i++) {
          this.forceCloseConnection(longRunningConnections[i]);
        }
        console.log(`Force closed ${connectionsToClose} long-running connections due to high capacity`);
      }
    }
  }
  triggerEmergencyCleanup() {
    console.log("Triggering emergency connection cleanup...");
    const connectionsToClose = Math.min(10, this.activeConnections.size);
    const connectionArray = Array.from(this.activeConnections);
    for (let i = 0; i < connectionsToClose; i++) {
      this.forceCloseConnection(connectionArray[i]);
    }
    this.idleConnections.clear();
    this.processQueue();
    console.log(`Emergency cleanup completed. Closed ${connectionsToClose} connections.`);
  }
  optimizeConnections() {
    console.log("Optimizing database connections...");
    const idleToRemove = Math.min(5, this.idleConnections.size);
    const idleArray = Array.from(this.idleConnections);
    for (let i = 0; i < idleToRemove; i++) {
      this.cleanupIdleConnection(idleArray[i]);
    }
    console.log(`Optimization completed. Removed ${idleToRemove} idle connections.`);
  }
  logConnectionStats() {
    const stats = this.getConnectionStats();
    if (stats.connectionPressure > 0.5) {
      console.log(`Database Connections - Active: ${stats.activeConnections}/${stats.maxConnections} (${(stats.connectionPressure * 100).toFixed(1)}%), Idle: ${stats.idleConnections}, Queued: ${stats.queuedRequests}`);
    }
  }
  getConnectionStats() {
    const activeConnections = this.activeConnections.size;
    const maxConnections = this.config.maxConnections;
    const idleConnections = this.idleConnections.size;
    const queuedRequests = this.requestQueue.length;
    const connectionPressure = activeConnections / maxConnections;
    return {
      activeConnections,
      maxConnections,
      idleConnections,
      queuedRequests,
      connectionPressure
    };
  }
  getDetailedStats() {
    return {
      stats: this.getConnectionStats(),
      config: this.config,
      activeConnectionIds: Array.from(this.activeConnections),
      idleConnectionIds: Array.from(this.idleConnections),
      queuedRequestIds: this.requestQueue.map((item) => item.id),
      lastHealthCheck: Date.now()
    };
  }
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    console.log("Database connection manager configuration updated:", this.config);
  }
  reset() {
    this.activeConnections.clear();
    this.idleConnections.clear();
    this.requestQueue.forEach((item) => {
      item.reject(new Error("Connection manager reset"));
    });
    this.requestQueue = [];
    console.log("Database connection manager reset completed");
  }
  shutdown() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
    if (this.connectionCleanupInterval) {
      clearInterval(this.connectionCleanupInterval);
      this.connectionCleanupInterval = null;
    }
    this.reset();
    console.log("Database connection manager shut down");
  }
};
__publicField(_DatabaseConnectionManager, "instance");
let DatabaseConnectionManager = _DatabaseConnectionManager;
const DatabaseConnectionMonitor = () => {
  const { toast } = useToast();
  const [connectionStats, setConnectionStats] = reactExports.useState({
    connections: 0,
    max: 100,
    percentage: 0,
    status: "normal",
    timestamp: /* @__PURE__ */ new Date(),
    idle: 0,
    queued: 0,
    pressure: 0
  });
  const [history, setHistory] = reactExports.useState([]);
  const [isMonitoring, setIsMonitoring] = reactExports.useState(false);
  const [autoRefresh, setAutoRefresh] = reactExports.useState(true);
  const [isOptimizing, setIsOptimizing] = reactExports.useState(false);
  const fetchConnectionStats = async () => {
    try {
      const connectionManager = DatabaseConnectionManager.getInstance();
      const stats = connectionManager.getConnectionStats();
      const percentage = stats.activeConnections / stats.maxConnections * 100;
      let status = "normal";
      if (stats.connectionPressure >= 0.85) status = "critical";
      else if (stats.connectionPressure >= 0.7) status = "warning";
      const newStats = {
        connections: stats.activeConnections,
        max: stats.maxConnections,
        percentage,
        status,
        timestamp: /* @__PURE__ */ new Date(),
        idle: stats.idleConnections,
        queued: stats.queuedRequests,
        pressure: stats.connectionPressure
      };
      setConnectionStats(newStats);
      setHistory((prev) => {
        const newHistory = [...prev, {
          timestamp: /* @__PURE__ */ new Date(),
          connections: stats.activeConnections,
          max: stats.maxConnections,
          idle: stats.idleConnections,
          queued: stats.queuedRequests
        }].slice(-50);
        return newHistory;
      });
      if (status === "critical" && stats.activeConnections > 85) {
        toast({
          title: "Critical: High Database Connections",
          description: `${stats.activeConnections}/${stats.maxConnections} connections in use (${percentage.toFixed(1)}%)`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error fetching connection stats:", error);
      toast({
        title: "Error",
        description: "Failed to fetch database connection statistics",
        variant: "destructive"
      });
    }
  };
  const handleOptimizeConnections = async () => {
    setIsOptimizing(true);
    try {
      const connectionManager = DatabaseConnectionManager.getInstance();
      const statsBefore = connectionManager.getConnectionStats();
      if (statsBefore.connectionPressure > 0.7) {
        console.log("Triggering connection optimization due to high pressure");
        await new Promise((resolve) => setTimeout(resolve, 1e3));
        fetchConnectionStats();
      }
      toast({
        title: "Connections Optimized",
        description: `Connection pressure reduced from ${(statsBefore.connectionPressure * 100).toFixed(1)}% to ${(connectionManager.getConnectionStats().connectionPressure * 100).toFixed(1)}%`
      });
    } catch (error) {
      toast({
        title: "Optimization Failed",
        description: "Failed to optimize database connections.",
        variant: "destructive"
      });
    } finally {
      setIsOptimizing(false);
    }
  };
  const getStatusColor = (status) => {
    switch (status) {
      case "critical":
        return "destructive";
      case "warning":
        return "secondary";
      default:
        return "default";
    }
  };
  reactExports.useEffect(() => {
    let interval;
    if (autoRefresh) {
      setIsMonitoring(true);
      interval = setInterval(fetchConnectionStats, 5e3);
      fetchConnectionStats();
    } else {
      setIsMonitoring(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);
  const getTrend = () => {
    if (history.length < 2) return { direction: "stable", change: 0 };
    const recent = history.slice(-5);
    const avg = recent.reduce((sum, item) => sum + item.connections, 0) / recent.length;
    const previous = history.slice(-10, -5);
    const prevAvg = previous.length > 0 ? previous.reduce((sum, item) => sum + item.connections, 0) / previous.length : avg;
    const change = avg - prevAvg;
    const direction = change > 2 ? "increasing" : change < -2 ? "decreasing" : "stable";
    return { direction, change: Math.abs(change) };
  };
  getTrend();
  const handleManualRefresh = () => {
    fetchConnectionStats();
    toast({
      title: "Refreshed",
      description: "Database connection statistics updated"
    });
  };
  const handleViewDetails = () => {
    const connectionManager = DatabaseConnectionManager.getInstance();
    const detailedStats = connectionManager.getDetailedStats();
    console.log("Database Connection Manager Detailed Stats:", detailedStats);
    toast({
      title: "Detailed Stats",
      description: "Comprehensive connection stats logged to console"
    });
  };
  const getRecommendations = () => {
    if (connectionStats.status === "critical") {
      return [
        "IMMEDIATE: Use 'Optimize Connections' button to reduce load",
        "Check for connection leaks in application code",
        "Review long-running queries and transactions",
        "Monitor queued requests and idle connections",
        "Consider scaling database resources"
      ];
    } else if (connectionStats.status === "warning") {
      return [
        "Monitor connection usage closely",
        "Review recent application deployments",
        "Check query performance and optimization",
        "Implement connection timeout policies",
        "Prepare for potential scaling if trend continues"
      ];
    } else {
      return [
        "Connection usage is within normal limits",
        "Continue regular monitoring",
        "Maintain current connection pooling strategies",
        "Connection manager is automatically optimizing usage"
      ];
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-id": "woiowpcv7", "data-path": "src/components/DatabaseConnectionMonitor.tsx", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "orkl7z70w", "data-path": "src/components/DatabaseConnectionMonitor.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { "data-id": "qp2reunv0", "data-path": "src/components/DatabaseConnectionMonitor.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "w7ibo34kd", "data-path": "src/components/DatabaseConnectionMonitor.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", "data-id": "cwlkx56zg", "data-path": "src/components/DatabaseConnectionMonitor.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Database, { className: "h-5 w-5", "data-id": "ii2yoggxu", "data-path": "src/components/DatabaseConnectionMonitor.tsx" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { "data-id": "hydyz3orb", "data-path": "src/components/DatabaseConnectionMonitor.tsx", children: "Enhanced Database Connection Monitor" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", "data-id": "tnjspd97r", "data-path": "src/components/DatabaseConnectionMonitor.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: getStatusColor(connectionStats.status), "data-id": "mrixj84zp", "data-path": "src/components/DatabaseConnectionMonitor.tsx", children: connectionStats.status.toUpperCase() }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: handleManualRefresh,
                disabled: isMonitoring,
                "data-id": "sm7btkzt1",
                "data-path": "src/components/DatabaseConnectionMonitor.tsx",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: `h-4 w-4 mr-2 ${isMonitoring ? "animate-spin" : ""}`, "data-id": "tha2nd9pa", "data-path": "src/components/DatabaseConnectionMonitor.tsx" }),
                  "Refresh"
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { "data-id": "uj4irxqlw", "data-path": "src/components/DatabaseConnectionMonitor.tsx", children: "Real-time monitoring with automatic connection management" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", "data-id": "3ttwoplf3", "data-path": "src/components/DatabaseConnectionMonitor.tsx", children: [
        connectionStats.status === "critical" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { variant: "destructive", "data-id": "8ko9e9x29", "data-path": "src/components/DatabaseConnectionMonitor.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4", "data-id": "g6bg4ripw", "data-path": "src/components/DatabaseConnectionMonitor.tsx" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertTitle, { "data-id": "v95b8h1gx", "data-path": "src/components/DatabaseConnectionMonitor.tsx", children: "Critical Connection Usage Detected" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDescription, { "data-id": "5ykmcp5gf", "data-path": "src/components/DatabaseConnectionMonitor.tsx", children: [
            "Database connections are at ",
            connectionStats.percentage.toFixed(1),
            "% capacity (",
            connectionStats.connections,
            "/",
            connectionStats.max,
            ").",
            connectionStats.queued > 0 && ` ${connectionStats.queued} requests are queued.`,
            "Immediate action required to prevent service disruption."
          ] })
        ] }),
        connectionStats.status === "warning" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { "data-id": "vwqxdifz3", "data-path": "src/components/DatabaseConnectionMonitor.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4", "data-id": "6rgk2e7fy", "data-path": "src/components/DatabaseConnectionMonitor.tsx" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertTitle, { "data-id": "afme6d4c1", "data-path": "src/components/DatabaseConnectionMonitor.tsx", children: "High Connection Usage Warning" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDescription, { "data-id": "n9sk78acj", "data-path": "src/components/DatabaseConnectionMonitor.tsx", children: [
            "Connection pressure is at ",
            (connectionStats.pressure * 100).toFixed(1),
            "%.",
            connectionStats.queued > 0 && ` ${connectionStats.queued} requests are currently queued.`,
            "Monitor closely and consider optimization."
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", "data-id": "lzamcjby9", "data-path": "src/components/DatabaseConnectionMonitor.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "s710omqk4", "data-path": "src/components/DatabaseConnectionMonitor.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "do82507mw", "data-path": "src/components/DatabaseConnectionMonitor.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", "data-id": "hpa73n42s", "data-path": "src/components/DatabaseConnectionMonitor.tsx", children: "Active" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl font-bold text-blue-600", "data-id": "4gmj6zkk6", "data-path": "src/components/DatabaseConnectionMonitor.tsx", children: connectionStats.connections })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", "data-id": "fr26i3qjy", "data-path": "src/components/DatabaseConnectionMonitor.tsx", children: "Active connections" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "9k5x3xx3n", "data-path": "src/components/DatabaseConnectionMonitor.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "mknfl8u67", "data-path": "src/components/DatabaseConnectionMonitor.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", "data-id": "u0tvisemi", "data-path": "src/components/DatabaseConnectionMonitor.tsx", children: "Idle" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl font-bold text-green-600", "data-id": "17cw2q4u4", "data-path": "src/components/DatabaseConnectionMonitor.tsx", children: connectionStats.idle })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", "data-id": "3kwndp554", "data-path": "src/components/DatabaseConnectionMonitor.tsx", children: "Idle connections" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "kvrp6qhhp", "data-path": "src/components/DatabaseConnectionMonitor.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "5g2abq6mg", "data-path": "src/components/DatabaseConnectionMonitor.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", "data-id": "e3lj4z11e", "data-path": "src/components/DatabaseConnectionMonitor.tsx", children: "Queued" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl font-bold text-yellow-600", "data-id": "9zitxh051", "data-path": "src/components/DatabaseConnectionMonitor.tsx", children: connectionStats.queued })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", "data-id": "220t8is51", "data-path": "src/components/DatabaseConnectionMonitor.tsx", children: "Pending requests" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "ix4h6i1yl", "data-path": "src/components/DatabaseConnectionMonitor.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "dq6bj6n8t", "data-path": "src/components/DatabaseConnectionMonitor.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", "data-id": "vmvqji28k", "data-path": "src/components/DatabaseConnectionMonitor.tsx", children: "Pressure" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-2xl font-bold text-purple-600", "data-id": "d5mohocgb", "data-path": "src/components/DatabaseConnectionMonitor.tsx", children: [
                (connectionStats.pressure * 100).toFixed(1),
                "%"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", "data-id": "l4lm83rig", "data-path": "src/components/DatabaseConnectionMonitor.tsx", children: "System pressure" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "xy4vh4w1r", "data-path": "src/components/DatabaseConnectionMonitor.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "owqcy2mzx", "data-path": "src/components/DatabaseConnectionMonitor.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", "data-id": "hnl5aykau", "data-path": "src/components/DatabaseConnectionMonitor.tsx", children: "Connection Usage" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-muted-foreground", "data-id": "4zp5np1r2", "data-path": "src/components/DatabaseConnectionMonitor.tsx", children: [
              connectionStats.connections,
              "/",
              connectionStats.max
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Progress,
            {
              value: connectionStats.percentage,
              className: "h-3",
              "data-id": "nx7ig040u",
              "data-path": "src/components/DatabaseConnectionMonitor.tsx"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", "data-id": "y93jy93rp", "data-path": "src/components/DatabaseConnectionMonitor.tsx", children: [
            connectionStats.percentage.toFixed(1),
            "% of maximum capacity"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-2", "data-id": "ismvmnmhw", "data-path": "src/components/DatabaseConnectionMonitor.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: handleOptimizeConnections,
              disabled: isOptimizing,
              variant: connectionStats.status === "critical" ? "destructive" : "default",
              "data-id": "zq7z0glpc",
              "data-path": "src/components/DatabaseConnectionMonitor.tsx",
              children: [
                isOptimizing ? /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "mr-2 h-4 w-4 animate-spin", "data-id": "h02zp9n3z", "data-path": "src/components/DatabaseConnectionMonitor.tsx" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "mr-2 h-4 w-4", "data-id": "y7k3p1tgv", "data-path": "src/components/DatabaseConnectionMonitor.tsx" }),
                isOptimizing ? "Optimizing..." : "Optimize Connections"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: handleViewDetails, variant: "outline", "data-id": "ripd73tl8", "data-path": "src/components/DatabaseConnectionMonitor.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "mr-2 h-4 w-4", "data-id": "854ioddgo", "data-path": "src/components/DatabaseConnectionMonitor.tsx" }),
            "View Details"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              onClick: () => setAutoRefresh(!autoRefresh),
              "data-id": "xpb5cgxat",
              "data-path": "src/components/DatabaseConnectionMonitor.tsx",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "mr-2 h-4 w-4", "data-id": "g408xvzwr", "data-path": "src/components/DatabaseConnectionMonitor.tsx" }),
                autoRefresh ? "Disable Auto-refresh" : "Enable Auto-refresh"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm text-muted-foreground", "data-id": "9hifkkncl", "data-path": "src/components/DatabaseConnectionMonitor.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { "data-id": "e7bthmazn", "data-path": "src/components/DatabaseConnectionMonitor.tsx", children: [
            "Last updated: ",
            connectionStats.timestamp.toLocaleTimeString()
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: autoRefresh ? "default" : "secondary", "data-id": "bboq0q79v", "data-path": "src/components/DatabaseConnectionMonitor.tsx", children: isMonitoring ? "Auto-monitoring Active" : "Manual Mode" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "xx01q4u7h", "data-path": "src/components/DatabaseConnectionMonitor.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { "data-id": "k4n129e31", "data-path": "src/components/DatabaseConnectionMonitor.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { "data-id": "hb92mndbi", "data-path": "src/components/DatabaseConnectionMonitor.tsx", children: "Recommendations" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { "data-id": "9k4255akt", "data-path": "src/components/DatabaseConnectionMonitor.tsx", children: "Actions to address current connection status" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { "data-id": "devwq9jvx", "data-path": "src/components/DatabaseConnectionMonitor.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2", "data-id": "0uzf3zimy", "data-path": "src/components/DatabaseConnectionMonitor.tsx", children: getRecommendations().map(
        (recommendation, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start space-x-2", "data-id": "ffc4e4yc3", "data-path": "src/components/DatabaseConnectionMonitor.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0", "data-id": "142h1y7c0", "data-path": "src/components/DatabaseConnectionMonitor.tsx" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", "data-id": "irm5ybr51", "data-path": "src/components/DatabaseConnectionMonitor.tsx", children: recommendation })
        ] }, index)
      ) }) })
    ] }),
    history.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "dfn8j48fn", "data-path": "src/components/DatabaseConnectionMonitor.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { "data-id": "tjhbxenp5", "data-path": "src/components/DatabaseConnectionMonitor.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { "data-id": "eg4uvo3ww", "data-path": "src/components/DatabaseConnectionMonitor.tsx", children: "Recent Connection History" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardDescription, { "data-id": "moojzg0e4", "data-path": "src/components/DatabaseConnectionMonitor.tsx", children: [
          "Last ",
          history.length,
          " measurements with connection manager data"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { "data-id": "dn7yk8o0s", "data-path": "src/components/DatabaseConnectionMonitor.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 max-h-40 overflow-y-auto", "data-id": "1ulobbvcg", "data-path": "src/components/DatabaseConnectionMonitor.tsx", children: history.slice(-10).reverse().map(
        (entry, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm", "data-id": "ghax9nhbv", "data-path": "src/components/DatabaseConnectionMonitor.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "l2gsgh3sn", "data-path": "src/components/DatabaseConnectionMonitor.tsx", children: entry.timestamp.toLocaleTimeString() }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", "data-id": "7t8iuyo26", "data-path": "src/components/DatabaseConnectionMonitor.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { "data-id": "0hxry3mzq", "data-path": "src/components/DatabaseConnectionMonitor.tsx", children: [
              "A:",
              entry.connections
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { "data-id": "au6gvbcou", "data-path": "src/components/DatabaseConnectionMonitor.tsx", children: [
              "I:",
              entry.idle
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { "data-id": "g8q9bb2qj", "data-path": "src/components/DatabaseConnectionMonitor.tsx", children: [
              "Q:",
              entry.queued
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Badge,
              {
                variant: entry.connections / entry.max * 100 >= 85 ? "destructive" : entry.connections / entry.max * 100 >= 70 ? "secondary" : "default",
                "data-id": "732dg3lm3",
                "data-path": "src/components/DatabaseConnectionMonitor.tsx",
                children: [
                  (entry.connections / entry.max * 100).toFixed(1),
                  "%"
                ]
              }
            )
          ] })
        ] }, index)
      ) }) })
    ] })
  ] });
};
const DatabaseMonitoringPage = () => {
  const { hasMonitoringAccess } = useAdminAccess();
  if (!hasMonitoringAccess) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      AccessDenied,
      {
        feature: "Database Monitoring System",
        requiredRole: "Administrator",
        "data-id": "2h47n0ljp",
        "data-path": "src/pages/Admin/DatabaseMonitoring.tsx"
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto p-6 space-y-6", "data-id": "yjrgpwqdo", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "xsmdsbao4", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "l1kxaguxn", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold tracking-tight", "data-id": "tuwdqzvd0", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: "Database Monitoring" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", "data-id": "y3a8ao780", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: "Monitor and manage database performance and connections" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "px-3 py-1", "data-id": "326mhznu9", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Database, { className: "h-4 w-4 mr-2", "data-id": "w11v1vaoc", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx" }),
        "Live Monitoring"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { variant: "destructive", "data-id": "whmjotbh4", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4", "data-id": "w7s2nqspi", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AlertTitle, { "data-id": "wzot9dxhf", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: "High Database Connection Count Detected" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { "data-id": "an9wap2yc", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: "Current connections: 85/100 (85% capacity). Monitor closely and take action to prevent service disruption." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "connections", className: "space-y-4", "data-id": "h3qu0s4lm", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { "data-id": "4wbaqhx6v", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "connections", "data-id": "fcqrsxgi0", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: "Connection Monitor" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "performance", "data-id": "uz78mwxo0", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: "Performance" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "optimization", "data-id": "vdcmw2csv", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: "Optimization" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "alerts", "data-id": "4iavo3h8s", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: "Alert Settings" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "connections", className: "space-y-4", "data-id": "lqtg5a8wo", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(DatabaseConnectionMonitor, { "data-id": "cknsg0wkj", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "performance", className: "space-y-4", "data-id": "2qstdra87", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", "data-id": "ytmr7ty88", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "2fn5i2u3x", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { "data-id": "2pxpqy5ke", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center space-x-2", "data-id": "rkwuq1ic5", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-5 w-5", "data-id": "5i8ccjy8z", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "ye8cks2ua", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: "Query Performance" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { "data-id": "87cybgv68", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: "Monitor slow queries and database performance metrics" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", "data-id": "d0dsk9xo5", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "th21pxblq", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", "data-id": "0oaptod33", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "ysg4rke42", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: "Average Query Time" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", "data-id": "0nmrc4jmo", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: "145ms" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", "data-id": "t3502wahi", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "xfujqaw7f", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: "Slow Queries (>1s)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "destructive", "data-id": "f2bse3vr9", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: "12" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", "data-id": "251aww5lz", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "yohenp6f1", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: "Active Transactions" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "default", "data-id": "b4gtptkcp", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: "8" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", className: "w-full", "data-id": "r86wv9doy", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: "View Detailed Performance Report" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "xzwl46ue8", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { "data-id": "kv1fcdxcy", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { "data-id": "fnx2i5pso", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: "Connection Pool Status" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { "data-id": "dc12swps8", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: "Current status of database connection pools" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", "data-id": "fsbwzw9dc", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "ck3bbuzgx", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", "data-id": "s5wuu9w83", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "9z0gcih13", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: "Active Connections" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "destructive", "data-id": "bo84lf5bv", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: "85" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", "data-id": "s9df6t3tg", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "2h6ev1lpz", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: "Idle Connections" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", "data-id": "qfahemly8", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: "3" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", "data-id": "uxw5p9rt0", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "ofe2l6zb4", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: "Waiting for Connection" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", "data-id": "zwq84nyj1", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: "0" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", className: "w-full", "data-id": "w3xiee1in", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: "Manage Connection Pool" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "rzp9razdf", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { "data-id": "41l422lmw", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { "data-id": "lxzvezk5e", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: "Recent Connection Activity" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { "data-id": "f1isjh9so", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: "Identify patterns and potential connection leaks" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { "data-id": "i1tby17qc", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", "data-id": "qjqgoxnke", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-3 border rounded-lg", "data-id": "k0mkwfo0y", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "aqrdu6dc2", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", "data-id": "fr8avjpv8", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: "High connection usage detected" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", "data-id": "ygx7g5s36", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: "2 minutes ago - 85/100 connections" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "destructive", "data-id": "4bw16uo11", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: "Critical" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-3 border rounded-lg", "data-id": "oswfneucp", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "p8kv4bbyn", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", "data-id": "wji5edl4e", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: "Connection spike in sales reports" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", "data-id": "x9l4396ba", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: "15 minutes ago - 78/100 connections" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", "data-id": "b3ltki6q4", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: "Warning" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-3 border rounded-lg", "data-id": "kaim21fxq", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "n1jvh7ata", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", "data-id": "weqq873e9", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: "Normal connection usage" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", "data-id": "m00cvg6ua", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: "1 hour ago - 45/100 connections" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "default", "data-id": "9cnsy923r", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: "Normal" })
            ] })
          ] }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "optimization", className: "space-y-4", "data-id": "a8frh1kst", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", "data-id": "ua95mmi4g", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "98g9j02to", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { "data-id": "bfs4guwc0", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { "data-id": "jgu2juwed", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: "Connection Management" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { "data-id": "9z999cioc", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: "Optimize database connection usage" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-4", "data-id": "65bc2zdjw", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", "data-id": "ox8aogmg7", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "w-full justify-start", "data-id": "aoyj2n1kc", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Database, { className: "h-4 w-4 mr-2", "data-id": "vwobod1k3", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx" }),
              "Close Idle Connections"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "w-full justify-start", "data-id": "nbcyq3w38", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-4 w-4 mr-2", "data-id": "w1d316rcx", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx" }),
              "Kill Long-Running Queries"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "w-full justify-start", "data-id": "vehil0z95", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "h-4 w-4 mr-2", "data-id": "x5lsw8jvz", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx" }),
              "Adjust Pool Size"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "destructive", className: "w-full justify-start", "data-id": "hqijslbn7", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4 mr-2", "data-id": "gv1338f47", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx" }),
              "Emergency Connection Reset"
            ] })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "4mnv8xn2c", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { "data-id": "lgqlhvf50", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { "data-id": "zeadil80i", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: "Recommendations" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { "data-id": "jupvpli7j", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: "Immediate actions to reduce connection usage" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { "data-id": "jh9cg4o0v", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", "data-id": "hk9vichwe", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 border-l-4 border-red-500 bg-red-50 dark:bg-red-950", "data-id": "7lx95hlf8", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-red-800 dark:text-red-200", "data-id": "h85f4nxpc", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: "Critical: Review connection leaks" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-red-600 dark:text-red-300", "data-id": "i583zy0g3", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: "Check for unclosed connections in sales report generation" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-950", "data-id": "elxsp9tp5", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-yellow-800 dark:text-yellow-200", "data-id": "jc47mcu7t", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: "Implement connection pooling" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-yellow-600 dark:text-yellow-300", "data-id": "vt0wxbsin", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: "Configure maximum pool size and connection timeout" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950", "data-id": "kidcoymr7", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-blue-800 dark:text-blue-200", "data-id": "x2kom6dt1", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: "Optimize query performance" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-blue-600 dark:text-blue-300", "data-id": "9qhldaf0c", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: "Review slow queries that may be holding connections" })
            ] })
          ] }) })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "alerts", className: "space-y-4", "data-id": "splyc0bfh", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "jcrbvfnpy", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { "data-id": "8nj32dtgk", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center space-x-2", "data-id": "6gyog6lhd", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-5 w-5", "data-id": "behmeo84f", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "77pbo80ec", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: "Alert Configuration" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { "data-id": "3acs3efap", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: "Configure alerts for database connection monitoring" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", "data-id": "zy8z0g1lq", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", "data-id": "kzsj9f3ji", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "1h3jagmw8", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium", "data-id": "qfsjhn5sz", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: "Warning Threshold" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", "data-id": "qd3pjh6ml", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "number",
                    className: "flex-1 px-3 py-2 border rounded-md",
                    defaultValue: "70",
                    "data-id": "dwtmqvqxo",
                    "data-path": "src/pages/Admin/DatabaseMonitoring.tsx"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", "data-id": "zuqeqdl89", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: "%" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "o5qp63wf8", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium", "data-id": "j82edwzqt", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: "Critical Threshold" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", "data-id": "00jqtuv9d", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "number",
                    className: "flex-1 px-3 py-2 border rounded-md",
                    defaultValue: "85",
                    "data-id": "a84hg4w40",
                    "data-path": "src/pages/Admin/DatabaseMonitoring.tsx"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", "data-id": "bwqbb5z2m", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: "%" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "or76mjfza", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium", "data-id": "m6h8gbuxf", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: "Alert Methods" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "uotyrapa7", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center space-x-2", "data-id": "gunx0l3gi", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", defaultChecked: true, "data-id": "5f0s6ecvf", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", "data-id": "a5o7c06sl", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: "Browser notifications" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center space-x-2", "data-id": "80tf1gtm2", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", defaultChecked: true, "data-id": "wtk0msedq", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", "data-id": "51zc74nl6", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: "Email alerts" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center space-x-2", "data-id": "yxctcp00q", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", "data-id": "vm7be213o", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", "data-id": "vne2oaxwu", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: "SMS alerts" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "w-full", "data-id": "4m745tikj", "data-path": "src/pages/Admin/DatabaseMonitoring.tsx", children: "Save Alert Settings" })
        ] })
      ] }) })
    ] })
  ] });
};
const DatabaseMonitoring = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: DatabaseMonitoringPage
}, Symbol.toStringTag, { value: "Module" }));
const AuditLogDashboard = () => {
  const [auditStats, setAuditStats] = reactExports.useState({
    totalEvents: 0,
    failedAttempts: 0,
    suspiciousActivity: 0,
    securityScore: 100
  });
  const [recentEvents, setRecentEvents] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [refreshing, setRefreshing] = reactExports.useState(false);
  const { toast } = useToast();
  const fetchAuditData = async () => {
    setLoading(true);
    try {
      const { data: auditData, error: auditError } = await window.ezsite.apis.tablePage(12706, {
        PageNo: 1,
        PageSize: 100,
        OrderByField: "event_timestamp",
        IsAsc: false,
        Filters: []
      });
      if (auditError) {
        console.error("Error fetching audit logs:", auditError);
        throw new Error(auditError);
      }
      const logs = (auditData == null ? void 0 : auditData.List) || [];
      const totalEvents = logs.length;
      const failedAttempts = logs.filter(
        (log) => log.event_status === "Failed" || log.event_status === "Blocked"
      ).length;
      const suspiciousActivity = logs.filter(
        (log) => log.risk_level === "High" || log.risk_level === "Critical"
      ).length;
      const successfulEvents = logs.filter((log) => log.event_status === "Success").length;
      const securityScore = totalEvents > 0 ? Math.round(successfulEvents / totalEvents * 100) : 100;
      setAuditStats({
        totalEvents,
        failedAttempts,
        suspiciousActivity,
        securityScore
      });
      setRecentEvents(logs.slice(0, 10));
    } catch (error) {
      console.error("Error fetching audit data:", error);
      toast({
        title: "Error Loading Audit Data",
        description: "Failed to fetch audit log information. Please try again.",
        variant: "destructive"
      });
      setAuditStats({
        totalEvents: 0,
        failedAttempts: 0,
        suspiciousActivity: 0,
        securityScore: 100
      });
      setRecentEvents([]);
    } finally {
      setLoading(false);
    }
  };
  const refreshData = async () => {
    setRefreshing(true);
    await fetchAuditData();
    setRefreshing(false);
    toast({
      title: "Data Refreshed",
      description: "Audit log data has been updated with latest information."
    });
  };
  reactExports.useEffect(() => {
    fetchAuditData();
  }, []);
  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return "unknown time";
    const now = /* @__PURE__ */ new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1e3 * 60));
    if (diffInMinutes < 1) return "just now";
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };
  const getEventStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "success":
        return "bg-green-500 text-white";
      case "failed":
      case "blocked":
        return "bg-red-500 text-white";
      case "suspicious":
        return "bg-orange-500 text-white";
      default:
        return "bg-blue-500 text-white";
    }
  };
  const getEventIcon = (eventType) => {
    switch (eventType.toLowerCase()) {
      case "login":
      case "logout":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-4 w-4", "data-id": "0a3690c00", "data-path": "src/components/AuditLogDashboard.tsx" });
      case "data access":
      case "data modification":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4", "data-id": "b9r7um42s", "data-path": "src/components/AuditLogDashboard.tsx" });
      default:
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-4 w-4", "data-id": "sq8twpucg", "data-path": "src/components/AuditLogDashboard.tsx" });
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center p-8", "data-id": "hify41ayy", "data-path": "src/components/AuditLogDashboard.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", "data-id": "p566pt8ji", "data-path": "src/components/AuditLogDashboard.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-8 w-8 animate-spin mx-auto mb-4", "data-id": "289uaepv8", "data-path": "src/components/AuditLogDashboard.tsx" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", "data-id": "5mb0u5op0", "data-path": "src/components/AuditLogDashboard.tsx", children: "Loading real-time audit data..." })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-id": "r2pnqw7te", "data-path": "src/components/AuditLogDashboard.tsx", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "xxg4ajmqx", "data-path": "src/components/AuditLogDashboard.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "3zifu7u9c", "data-path": "src/components/AuditLogDashboard.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold tracking-tight", "data-id": "jt75dnfwk", "data-path": "src/components/AuditLogDashboard.tsx", children: "Audit Log Dashboard" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", "data-id": "e3jywcgsq", "data-path": "src/components/AuditLogDashboard.tsx", children: "Real-time security monitoring and audit trail analysis" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          onClick: refreshData,
          disabled: refreshing,
          variant: "outline",
          size: "sm",
          "data-id": "f5maulso4",
          "data-path": "src/components/AuditLogDashboard.tsx",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: `w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`, "data-id": "ry5bo743u", "data-path": "src/components/AuditLogDashboard.tsx" }),
            "Refresh"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", "data-id": "ht2wng9tr", "data-path": "src/components/AuditLogDashboard.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-id": "3emdkbnr5", "data-path": "src/components/AuditLogDashboard.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-6", "data-id": "8qaavbrvn", "data-path": "src/components/AuditLogDashboard.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "ul1otx129", "data-path": "src/components/AuditLogDashboard.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "7mn2tazzg", "data-path": "src/components/AuditLogDashboard.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-muted-foreground", "data-id": "mf0n4mqrl", "data-path": "src/components/AuditLogDashboard.tsx", children: "Total Events" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-bold", "data-id": "fgicf3s6j", "data-path": "src/components/AuditLogDashboard.tsx", children: auditStats.totalEvents.toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-8 w-8 text-blue-600", "data-id": "487e9n5cj", "data-path": "src/components/AuditLogDashboard.tsx" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-2", "data-id": "0ueojg1ks", "data-path": "src/components/AuditLogDashboard.tsx", children: "All recorded events" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-id": "5bcsk31r1", "data-path": "src/components/AuditLogDashboard.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-6", "data-id": "di3zexgo8", "data-path": "src/components/AuditLogDashboard.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "j4l8aid0l", "data-path": "src/components/AuditLogDashboard.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "16dqxc7xr", "data-path": "src/components/AuditLogDashboard.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-muted-foreground", "data-id": "1s12axy1a", "data-path": "src/components/AuditLogDashboard.tsx", children: "Failed Attempts" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-bold text-red-600", "data-id": "1wihcsj7t", "data-path": "src/components/AuditLogDashboard.tsx", children: auditStats.failedAttempts })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-8 w-8 text-red-600", "data-id": "pxgrtgn1m", "data-path": "src/components/AuditLogDashboard.tsx" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-2", "data-id": "natwcsang", "data-path": "src/components/AuditLogDashboard.tsx", children: auditStats.totalEvents > 0 ? `${(auditStats.failedAttempts / auditStats.totalEvents * 100).toFixed(1)}% of total events` : "No events recorded" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-id": "ayp8eozto", "data-path": "src/components/AuditLogDashboard.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-6", "data-id": "tx2gtubwg", "data-path": "src/components/AuditLogDashboard.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "6rnq3fnr4", "data-path": "src/components/AuditLogDashboard.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "f0e5f36jr", "data-path": "src/components/AuditLogDashboard.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-muted-foreground", "data-id": "nrn0wiaae", "data-path": "src/components/AuditLogDashboard.tsx", children: "Suspicious Activity" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-bold text-orange-600", "data-id": "nuhb5cs7j", "data-path": "src/components/AuditLogDashboard.tsx", children: auditStats.suspiciousActivity })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-8 w-8 text-orange-600", "data-id": "70v59bdml", "data-path": "src/components/AuditLogDashboard.tsx" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-2", "data-id": "50wszmwdg", "data-path": "src/components/AuditLogDashboard.tsx", children: auditStats.suspiciousActivity > 0 ? "Requires attention" : "All clear" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-id": "w6fqigzga", "data-path": "src/components/AuditLogDashboard.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-6", "data-id": "eszjf2hsg", "data-path": "src/components/AuditLogDashboard.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "4elfc5paw", "data-path": "src/components/AuditLogDashboard.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "10txq5bqe", "data-path": "src/components/AuditLogDashboard.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-muted-foreground", "data-id": "zhwcioqm2", "data-path": "src/components/AuditLogDashboard.tsx", children: "Security Score" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: `text-3xl font-bold ${auditStats.securityScore >= 95 ? "text-green-600" : auditStats.securityScore >= 80 ? "text-yellow-600" : "text-red-600"}`, "data-id": "6d4swc7v1", "data-path": "src/components/AuditLogDashboard.tsx", children: [
              auditStats.securityScore,
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: `h-8 w-8 ${auditStats.securityScore >= 95 ? "text-green-600" : auditStats.securityScore >= 80 ? "text-yellow-600" : "text-red-600"}`, "data-id": "jyt7kv3v9", "data-path": "src/components/AuditLogDashboard.tsx" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-2", "data-id": "1vdt8dc28", "data-path": "src/components/AuditLogDashboard.tsx", children: "Based on security events" })
      ] }) })
    ] }),
    auditStats.suspiciousActivity > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { className: "border-orange-500 bg-orange-50", "data-id": "axroxzppr", "data-path": "src/components/AuditLogDashboard.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4 text-orange-600", "data-id": "dobl2ezdj", "data-path": "src/components/AuditLogDashboard.tsx" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDescription, { "data-id": "6jd5n4ibc", "data-path": "src/components/AuditLogDashboard.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { "data-id": "lapnalaty", "data-path": "src/components/AuditLogDashboard.tsx", children: "Security Alert:" }),
        " ",
        auditStats.suspiciousActivity,
        " suspicious activities detected. Review the recent events below for more details."
      ] })
    ] }),
    auditStats.securityScore < 80 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { className: "border-red-500 bg-red-50", "data-id": "ni3d6khyj", "data-path": "src/components/AuditLogDashboard.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4 text-red-600", "data-id": "2ofarw3d0", "data-path": "src/components/AuditLogDashboard.tsx" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDescription, { "data-id": "s3360y3tb", "data-path": "src/components/AuditLogDashboard.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { "data-id": "v2zu9wp0c", "data-path": "src/components/AuditLogDashboard.tsx", children: "Low Security Score:" }),
        " Your system security score is ",
        auditStats.securityScore,
        "%. This indicates a high number of failed or blocked events that require investigation."
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "mtap99zn9", "data-path": "src/components/AuditLogDashboard.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "12s96qkdz", "data-path": "src/components/AuditLogDashboard.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { "data-id": "7pb6o1rl3", "data-path": "src/components/AuditLogDashboard.tsx", children: "Recent Security Events" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { "data-id": "bsmf5rmw4", "data-path": "src/components/AuditLogDashboard.tsx", children: recentEvents.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-8 text-gray-500", "data-id": "5cdm99ez6", "data-path": "src/components/AuditLogDashboard.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-12 w-12 mx-auto mb-4 text-gray-400", "data-id": "z7v9zpnmg", "data-path": "src/components/AuditLogDashboard.tsx" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { "data-id": "oa4k82bjs", "data-path": "src/components/AuditLogDashboard.tsx", children: "No audit events recorded yet." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm mt-1", "data-id": "ej3iv5ztw", "data-path": "src/components/AuditLogDashboard.tsx", children: "Security events will appear here as they occur." })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", "data-id": "7u0wuanng", "data-path": "src/components/AuditLogDashboard.tsx", children: recentEvents.map(
        (event) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-3 border rounded-lg", "data-id": "yxf0qffqw", "data-path": "src/components/AuditLogDashboard.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-3", "data-id": "zyyn4ch08", "data-path": "src/components/AuditLogDashboard.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: getEventStatusColor(event.event_status), "data-id": "ptd5m8cn9", "data-path": "src/components/AuditLogDashboard.tsx", children: [
              getEventIcon(event.event_type),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1", "data-id": "4ufk1zqs8", "data-path": "src/components/AuditLogDashboard.tsx", children: event.event_status })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "6rj3wlkzt", "data-path": "src/components/AuditLogDashboard.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-medium", "data-id": "b7uidzl5p", "data-path": "src/components/AuditLogDashboard.tsx", children: [
                event.event_type,
                ": ",
                event.action_performed || event.resource_accessed || "System action"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", "data-id": "do6p2e2b8", "data-path": "src/components/AuditLogDashboard.tsx", children: [
                event.username || "Unknown user",
                " from ",
                event.ip_address || "unknown IP",
                event.station && ` • Station: ${event.station}`,
                event.failure_reason && ` • Reason: ${event.failure_reason}`
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", "data-id": "s0pw98620", "data-path": "src/components/AuditLogDashboard.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground flex items-center", "data-id": "rxm6br0hc", "data-path": "src/components/AuditLogDashboard.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3 mr-1", "data-id": "12wvleia0", "data-path": "src/components/AuditLogDashboard.tsx" }),
              formatTimeAgo(event.event_timestamp)
            ] }),
            event.risk_level && event.risk_level !== "Low" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Badge,
              {
                variant: event.risk_level === "Critical" ? "destructive" : "secondary",
                className: "mt-1 text-xs",
                "data-id": "wic1c9mrm",
                "data-path": "src/components/AuditLogDashboard.tsx",
                children: [
                  event.risk_level,
                  " Risk"
                ]
              }
            )
          ] })
        ] }, event.id)
      ) }) })
    ] })
  ] });
};
const AuditLogViewer = () => {
  const [showFilters, setShowFilters] = reactExports.useState(false);
  const sampleLogs = [
    {
      id: 1,
      timestamp: "2024-01-15 14:30:22",
      eventType: "Login",
      user: "admin@dfsmanager.com",
      status: "Success",
      riskLevel: "Low",
      resource: "/dashboard",
      action: "View",
      station: "MOBIL",
      ipAddress: "192.168.1.100"
    },
    {
      id: 2,
      timestamp: "2024-01-15 14:25:15",
      eventType: "Failed Login",
      user: "unknown",
      status: "Failed",
      riskLevel: "Medium",
      resource: "/login",
      action: "Authenticate",
      station: "N/A",
      ipAddress: "203.0.113.10"
    },
    {
      id: 3,
      timestamp: "2024-01-15 14:20:08",
      eventType: "Data Access",
      user: "manager@dfsmanager.com",
      status: "Success",
      riskLevel: "Low",
      resource: "/sales/reports",
      action: "View",
      station: "AMOCO ROSEDALE",
      ipAddress: "192.168.1.150"
    }
  ];
  const getRiskBadgeColor = (riskLevel) => {
    switch (riskLevel) {
      case "Critical":
        return "bg-red-500 hover:bg-red-600";
      case "High":
        return "bg-orange-500 hover:bg-orange-600";
      case "Medium":
        return "bg-yellow-500 hover:bg-yellow-600";
      case "Low":
        return "bg-green-500 hover:bg-green-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "Success":
        return "bg-green-500 hover:bg-green-600";
      case "Failed":
        return "bg-red-500 hover:bg-red-600";
      case "Blocked":
        return "bg-orange-500 hover:bg-orange-600";
      case "Suspicious":
        return "bg-purple-500 hover:bg-purple-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };
  const exportLogs = () => {
    const csv = [
      "Timestamp,Event Type,User,Status,Risk Level,Resource,Action,Station,IP Address",
      ...sampleLogs.map(
        (log) => `"${log.timestamp}","${log.eventType}","${log.user}","${log.status}","${log.riskLevel}","${log.resource}","${log.action}","${log.station}","${log.ipAddress}"`
      )
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-logs-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", "data-id": "zjh88nkoy", "data-path": "src/components/AuditLogViewer.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "0zzq47j8j", "data-path": "src/components/AuditLogViewer.tsx", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "y15y2dv3b", "data-path": "src/components/AuditLogViewer.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "wr5p8dj2b", "data-path": "src/components/AuditLogViewer.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", "data-id": "8totejbsp", "data-path": "src/components/AuditLogViewer.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-5 w-5 text-blue-600", "data-id": "62hydt0ab", "data-path": "src/components/AuditLogViewer.tsx" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { "data-id": "qzxatmyr6", "data-path": "src/components/AuditLogViewer.tsx", children: "Audit Log Viewer" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", "data-id": "m09f2t7pr", "data-path": "src/components/AuditLogViewer.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => setShowFilters(!showFilters),
            "data-id": "cykriaptw",
            "data-path": "src/components/AuditLogViewer.tsx",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "h-4 w-4 mr-2", "data-id": "d9vw9h0xp", "data-path": "src/components/AuditLogViewer.tsx" }),
              "Filters"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: exportLogs,
            "data-id": "vy5zt25uf",
            "data-path": "src/components/AuditLogViewer.tsx",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4 mr-2", "data-id": "geql21rs4", "data-path": "src/components/AuditLogViewer.tsx" }),
              "Export"
            ]
          }
        )
      ] })
    ] }) }),
    showFilters && /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "border-t", "data-id": "u402kfsha", "data-path": "src/components/AuditLogViewer.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4", "data-id": "zof5jrc1j", "data-path": "src/components/AuditLogViewer.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "hcmcae8r3", "data-path": "src/components/AuditLogViewer.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium mb-1 block", "data-id": "pdtw0e75t", "data-path": "src/components/AuditLogViewer.tsx", children: "Event Type" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { "data-id": "wjm9tipb0", "data-path": "src/components/AuditLogViewer.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-id": "0l1gf9ium", "data-path": "src/components/AuditLogViewer.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All events", "data-id": "neslsgxvs", "data-path": "src/components/AuditLogViewer.tsx" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { "data-id": "jkrxf8e2y", "data-path": "src/components/AuditLogViewer.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "", "data-id": "au1blpgju", "data-path": "src/components/AuditLogViewer.tsx", children: "All Events" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Login", "data-id": "mtwasko7a", "data-path": "src/components/AuditLogViewer.tsx", children: "Login" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Logout", "data-id": "pbql2s7fx", "data-path": "src/components/AuditLogViewer.tsx", children: "Logout" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Failed Login", "data-id": "m8pnj42r5", "data-path": "src/components/AuditLogViewer.tsx", children: "Failed Login" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Data Access", "data-id": "f6scpjvld", "data-path": "src/components/AuditLogViewer.tsx", children: "Data Access" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "rb98owkvx", "data-path": "src/components/AuditLogViewer.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium mb-1 block", "data-id": "023stavyq", "data-path": "src/components/AuditLogViewer.tsx", children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { "data-id": "skyl9ntzf", "data-path": "src/components/AuditLogViewer.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-id": "mcaliz4c7", "data-path": "src/components/AuditLogViewer.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All statuses", "data-id": "saeprc8fk", "data-path": "src/components/AuditLogViewer.tsx" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { "data-id": "41510hper", "data-path": "src/components/AuditLogViewer.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "", "data-id": "85b94lzkg", "data-path": "src/components/AuditLogViewer.tsx", children: "All Statuses" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Success", "data-id": "dmnn9eveq", "data-path": "src/components/AuditLogViewer.tsx", children: "Success" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Failed", "data-id": "ch23swhd5", "data-path": "src/components/AuditLogViewer.tsx", children: "Failed" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Blocked", "data-id": "cnqp1p6na", "data-path": "src/components/AuditLogViewer.tsx", children: "Blocked" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "48zunsb5o", "data-path": "src/components/AuditLogViewer.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium mb-1 block", "data-id": "n561fuxi6", "data-path": "src/components/AuditLogViewer.tsx", children: "Risk Level" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { "data-id": "kw28cgytf", "data-path": "src/components/AuditLogViewer.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-id": "x9c6k0fgl", "data-path": "src/components/AuditLogViewer.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All risk levels", "data-id": "r1y5zr1vx", "data-path": "src/components/AuditLogViewer.tsx" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { "data-id": "ydbie7dg0", "data-path": "src/components/AuditLogViewer.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "", "data-id": "4w6q5l10w", "data-path": "src/components/AuditLogViewer.tsx", children: "All Risk Levels" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Low", "data-id": "zspsl206w", "data-path": "src/components/AuditLogViewer.tsx", children: "Low" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Medium", "data-id": "oc1i81ymv", "data-path": "src/components/AuditLogViewer.tsx", children: "Medium" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "High", "data-id": "1lp8eun8l", "data-path": "src/components/AuditLogViewer.tsx", children: "High" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Critical", "data-id": "hctuawidu", "data-path": "src/components/AuditLogViewer.tsx", children: "Critical" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "r8ucv5en4", "data-path": "src/components/AuditLogViewer.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium mb-1 block", "data-id": "s8kxgdor7", "data-path": "src/components/AuditLogViewer.tsx", children: "Username" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Search username...", "data-id": "kn0m7lblc", "data-path": "src/components/AuditLogViewer.tsx" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { "data-id": "sivwcauac", "data-path": "src/components/AuditLogViewer.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-md border", "data-id": "m28c3roaz", "data-path": "src/components/AuditLogViewer.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { "data-id": "xmxd6v5om", "data-path": "src/components/AuditLogViewer.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { "data-id": "8vfj6jwxf", "data-path": "src/components/AuditLogViewer.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { "data-id": "16rg2qjtk", "data-path": "src/components/AuditLogViewer.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "7eq4om1i2", "data-path": "src/components/AuditLogViewer.tsx", children: "Timestamp" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "dxxzdpfn4", "data-path": "src/components/AuditLogViewer.tsx", children: "Event Type" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "lu5fp66l8", "data-path": "src/components/AuditLogViewer.tsx", children: "User" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "ee0v4tqgr", "data-path": "src/components/AuditLogViewer.tsx", children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "oxt40fim9", "data-path": "src/components/AuditLogViewer.tsx", children: "Risk Level" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "wo8aku71h", "data-path": "src/components/AuditLogViewer.tsx", children: "Resource" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "e8kia8wvk", "data-path": "src/components/AuditLogViewer.tsx", children: "Action" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "mlesf66zd", "data-path": "src/components/AuditLogViewer.tsx", children: "Station" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "5nkdqscsa", "data-path": "src/components/AuditLogViewer.tsx", children: "IP Address" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { "data-id": "ry8dwf13h", "data-path": "src/components/AuditLogViewer.tsx", children: sampleLogs.map(
        (log) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { "data-id": "09lb7h43l", "data-path": "src/components/AuditLogViewer.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-sm", "data-id": "f8r0norka", "data-path": "src/components/AuditLogViewer.tsx", children: log.timestamp }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "jvh6t4yxi", "data-path": "src/components/AuditLogViewer.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", "data-id": "gvyslnmoh", "data-path": "src/components/AuditLogViewer.tsx", children: log.eventType }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "elx3v6ncb", "data-path": "src/components/AuditLogViewer.tsx", children: log.user }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "4pgfy5eb5", "data-path": "src/components/AuditLogViewer.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: `text-white ${getStatusBadgeColor(log.status)}`, "data-id": "ndy0vcgxv", "data-path": "src/components/AuditLogViewer.tsx", children: log.status }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "6zp2urptn", "data-path": "src/components/AuditLogViewer.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: `text-white ${getRiskBadgeColor(log.riskLevel)}`, "data-id": "nfb24hlbu", "data-path": "src/components/AuditLogViewer.tsx", children: log.riskLevel }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-sm", "data-id": "gqv702xtx", "data-path": "src/components/AuditLogViewer.tsx", children: log.resource }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-sm", "data-id": "mpguejzac", "data-path": "src/components/AuditLogViewer.tsx", children: log.action }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "f9lcwh5gr", "data-path": "src/components/AuditLogViewer.tsx", children: log.station }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-sm", "data-id": "wnhvhi1hg", "data-path": "src/components/AuditLogViewer.tsx", children: log.ipAddress })
        ] }, log.id)
      ) })
    ] }) }) })
  ] }) });
};
const AuditMonitoringPage = () => {
  const { isAdmin } = useAdminAccess();
  const [activeTab, setActiveTab] = reactExports.useState("dashboard");
  if (!isAdmin) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      AccessDenied,
      {
        feature: "Audit Monitoring System",
        requiredRole: "Administrator",
        "data-id": "13qwurzrr",
        "data-path": "src/pages/Admin/AuditMonitoring.tsx"
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-id": "z56dbhol1", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "dyrwudr4b", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", "data-id": "aifr4w2v3", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-6 w-6 text-blue-600", "data-id": "jx6c8tihm", "data-path": "src/pages/Admin/AuditMonitoring.tsx" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold", "data-id": "fndcmjzdw", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: "Audit & Security Monitoring" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center space-x-2", "data-id": "4iyjydzde", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "bg-green-50 text-green-700 border-green-200", "data-id": "8flc9ejrb", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-3 w-3 mr-1", "data-id": "wyrbb2sct", "data-path": "src/pages/Admin/AuditMonitoring.tsx" }),
        "Active Monitoring"
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", "data-id": "5ehtw5ced", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-blue-200 bg-blue-50", "data-id": "njo7y8xym", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-6", "data-id": "47y4txb1y", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "v78or33d9", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "s32ybwo9b", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-blue-700", "data-id": "koxy7mb9q", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: "Monitoring Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-blue-800", "data-id": "yaxj2cc6m", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: "Active" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-8 w-8 text-blue-600", "data-id": "o7tkbqime", "data-path": "src/pages/Admin/AuditMonitoring.tsx" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-blue-600 mt-2", "data-id": "mxc60moxl", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: "All access attempts are being logged" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-orange-200 bg-orange-50", "data-id": "wvo5l3dob", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-6", "data-id": "ui1zdeqg7", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "575ksbl4j", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "u939zlusk", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-orange-700", "data-id": "xi1eq3lxa", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: "Security Level" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-orange-800", "data-id": "ocw6anxzh", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: "High" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-8 w-8 text-orange-600", "data-id": "5krtjxwhf", "data-path": "src/pages/Admin/AuditMonitoring.tsx" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-orange-600 mt-2", "data-id": "faws9f74x", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: "Enhanced monitoring enabled" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-green-200 bg-green-50", "data-id": "q6j4ih6d8", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-6", "data-id": "nnpj9lnx3", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "nvl6ty23i", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "uyq2spmc0", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-green-700", "data-id": "6t9f5rrhg", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: "Compliance" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-green-800", "data-id": "3o47wtw2w", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: "100%" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "h-8 w-8 text-green-600", "data-id": "k1dg6hvfl", "data-path": "src/pages/Admin/AuditMonitoring.tsx" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-green-600 mt-2", "data-id": "4xjbnjezu", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: "Meeting security standards" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { value: activeTab, onValueChange: setActiveTab, className: "space-y-6", "data-id": "6gxcz7ruf", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid w-full grid-cols-4", "data-id": "t40r9us6p", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "dashboard", className: "flex items-center space-x-2", "data-id": "b77ft84er", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "h-4 w-4", "data-id": "1b0bhtzlx", "data-path": "src/pages/Admin/AuditMonitoring.tsx" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "kf06cgjeb", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: "Dashboard" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "logs", className: "flex items-center space-x-2", "data-id": "uhbbtr6st", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4", "data-id": "w76p5ey71", "data-path": "src/pages/Admin/AuditMonitoring.tsx" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "jhc13p97z", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: "Audit Logs" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "alerts", className: "flex items-center space-x-2", "data-id": "pkoby6tqm", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4", "data-id": "e2145h9z3", "data-path": "src/pages/Admin/AuditMonitoring.tsx" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "zl3nuu10j", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: "Security Alerts" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "settings", className: "flex items-center space-x-2", "data-id": "8jdcf3dek", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "h-4 w-4", "data-id": "5w9qnvtl3", "data-path": "src/pages/Admin/AuditMonitoring.tsx" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "2tzqoqaiq", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: "Settings" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "dashboard", "data-id": "wdp6i9qya", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AuditLogDashboard, { "data-id": "kkswq7gsk", "data-path": "src/pages/Admin/AuditMonitoring.tsx" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "logs", "data-id": "2y3rddkqa", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AuditLogViewer, { "data-id": "zrsihviti", "data-path": "src/pages/Admin/AuditMonitoring.tsx" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "alerts", "data-id": "zl5j47o14", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "wn2e0fam1", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "uy9c3noj7", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center space-x-2", "data-id": "2dkdpbfaz", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-5 w-5 text-orange-500", "data-id": "06v7zye44", "data-path": "src/pages/Admin/AuditMonitoring.tsx" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "6i23z9s4b", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: "Security Alerts Configuration" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { "data-id": "y5u6gnn2j", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", "data-id": "flb2f20lt", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", "data-id": "7yjvl8mva", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-yellow-200", "data-id": "us2blkk4b", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4", "data-id": "1e7errnmw", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", "data-id": "t5sexfxuq", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-medium", "data-id": "rjwiaovf3", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: "Failed Login Threshold" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-yellow-500 text-white", "data-id": "zryamk6gk", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: "Active" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", "data-id": "pmyqmsvgz", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: "Alert when more than 5 failed login attempts occur within 15 minutes" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-red-200", "data-id": "vmsxr4v70", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4", "data-id": "c26hgf2ke", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", "data-id": "2qk5eb37i", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-medium", "data-id": "bgzv3tv08", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: "Suspicious Activity Detection" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-red-500 text-white", "data-id": "ce7nv2cmk", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: "Active" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", "data-id": "3nkpjfvrg", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: "Monitor for unusual access patterns and data modification attempts" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-blue-200", "data-id": "el00mz1gw", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4", "data-id": "2lnkkyrga", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", "data-id": "n8ev66o9i", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-medium", "data-id": "50t1t1y0e", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: "Data Access Monitoring" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-blue-500 text-white", "data-id": "0igdohkbn", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: "Active" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", "data-id": "a0hcenjz2", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: "Track all sensitive data access and modifications" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-purple-200", "data-id": "u1go49ohp", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4", "data-id": "fvsg6fuo9", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", "data-id": "9qqcnefsm", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-medium", "data-id": "n5e0i2tuj", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: "Permission Changes" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-purple-500 text-white", "data-id": "rn8ge4bfj", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: "Active" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", "data-id": "os1fvsa2f", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: "Monitor all user permission and role modifications" })
          ] }) })
        ] }) }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "settings", "data-id": "gjvk0dn1d", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "itmc5azwn", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "myq2ieevf", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center space-x-2", "data-id": "o3u31u2mt", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "h-5 w-5", "data-id": "2b48bb8ga", "data-path": "src/pages/Admin/AuditMonitoring.tsx" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "slne5mehg", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: "Audit Logging Settings" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { "data-id": "xnng59c5n", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-id": "ctowd7nt4", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "dv75nspr5", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-medium mb-3", "data-id": "ck4xz72ca", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: "Logging Configuration" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", "data-id": "hpzt89llo", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "p85fsalt3", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium", "data-id": "7sto30w28", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: "Log Retention Period" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 border rounded-md bg-gray-50", "data-id": "kg9m8m8dg", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", "data-id": "60a1g8dwm", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: "90 days (recommended)" }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "4o8udvk1j", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium", "data-id": "n1hr1vrbg", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: "Log Level" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 border rounded-md bg-gray-50", "data-id": "b5q96h37q", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", "data-id": "5830ontwb", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: "Detailed (All Events)" }) })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "2rjc6w73d", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-medium mb-3", "data-id": "flv9rnx7k", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: "Monitored Events" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-2", "data-id": "mz0z28v0u", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: [
              "Login Attempts",
              "Logout Events",
              "Registration",
              "Password Resets",
              "Data Access",
              "Data Modifications",
              "Permission Changes",
              "Admin Actions",
              "File Uploads",
              "Report Generation",
              "System Errors",
              "Suspicious Activity"
            ].map(
              (event) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2 p-2 border rounded-md", "data-id": "3ifp6jr6d", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 bg-green-500 rounded-full", "data-id": "7tl7psqcu", "data-path": "src/pages/Admin/AuditMonitoring.tsx" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", "data-id": "fsy0x13p7", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: event })
              ] }, event)
            ) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "j0dzjgumm", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-medium mb-3", "data-id": "12iqp0f2r", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: "Export & Compliance" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", "data-id": "64k8qhs8v", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", "data-id": "l1jcgitfp", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4 mr-2", "data-id": "h5j1m62fb", "data-path": "src/pages/Admin/AuditMonitoring.tsx" }),
                "Export Weekly Report"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", "data-id": "olmm77890", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4 mr-2", "data-id": "qmad1f9ln", "data-path": "src/pages/Admin/AuditMonitoring.tsx" }),
                "Export Monthly Report"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", "data-id": "1zchwvp5c", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4 mr-2", "data-id": "qh6wioxvy", "data-path": "src/pages/Admin/AuditMonitoring.tsx" }),
                "Compliance Report"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t pt-4", "data-id": "h64e2zgax", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "eu33fbfzg", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "9vqov3ix3", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-medium", "data-id": "kvduo06an", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: "Audit Logging Status" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", "data-id": "52vzq4n6c", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: "All security events are being monitored and logged" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-green-500 text-white", "data-id": "ltju3gj6l", "data-path": "src/pages/Admin/AuditMonitoring.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-3 w-3 mr-1", "data-id": "vaogdiewb", "data-path": "src/pages/Admin/AuditMonitoring.tsx" }),
              "Active"
            ] })
          ] }) })
        ] }) })
      ] }) })
    ] })
  ] });
};
const AuditMonitoring = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: AuditMonitoringPage
}, Symbol.toStringTag, { value: "Module" }));
export {
  AuditMonitoring as A,
  DatabaseMonitoring as D,
  MemoryMonitoring$1 as M,
  SystemLogs$1 as S
};
