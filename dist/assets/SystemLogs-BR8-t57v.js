import { j as jsxRuntimeExports } from "./ui-BAZ8HTBl.js";
import { r as reactExports } from "./vendor-Dw3NhmYV.js";
import { c as createLucideIcon, u as useToast, s as supabase, j as AccessDenied, B as Button, R as RefreshCw, C as Card, f as CardContent, k as AlertTriangle, b as CardHeader, d as CardTitle, T as Table, n as TableHeader, o as TableRow, p as TableHead, q as TableBody, r as TableCell, h as Badge, S as Shield } from "./index-xgH9wc9T.js";
import { I as Input } from "./input-DS8Y9d9X.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-D7v6NG_6.js";
import { u as useAdminAccess, a as useBatchSelection, B as BatchActionBar, C as Checkbox, b as BatchDeleteDialog } from "./use-admin-access-DsbUxxaq.js";
import { F as FileText } from "./file-text-DwQmg6EU.js";
import { D as Download } from "./download-P-Ks_4cO.js";
import { X as XCircle, D as Database } from "./use-smart-auth-BiISLyYS.js";
import { S as Search } from "./search-SzCONyLZ.js";
import { C as Clock } from "./clock-e1m0ravT.js";
import { U as User } from "./user-Bq-6DliO.js";
import { C as CheckCircle } from "./check-circle-_u3N8RQL.js";
import "./square-pen-9pUwpptK.js";
import "./trash-2-CZFivf2G.js";
import "./AuthContext-D76ueosG.js";
/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Info = createLucideIcon("Info", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 16v-4", key: "1dtifu" }],
  ["path", { d: "M12 8h.01", key: "e9boi3" }]
]);
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
        return /* @__PURE__ */ jsxRuntimeExports.jsx(XCircle, { className: "w-4 h-4 text-red-500", "data-id": "kbwzuc4mn", "data-path": "src/pages/Admin/SystemLogs.tsx" });
      case "Blocked":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(AlertTriangle, { className: "w-4 h-4 text-yellow-500", "data-id": "6ttoi0u2y", "data-path": "src/pages/Admin/SystemLogs.tsx" });
      case "Success":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle, { className: "w-4 h-4 text-green-500", "data-id": "stjlw64ec", "data-path": "src/pages/Admin/SystemLogs.tsx" });
      case "Suspicious":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(AlertTriangle, { className: "w-4 h-4 text-orange-500", "data-id": "3487124i0", "data-path": "src/pages/Admin/SystemLogs.tsx" });
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
        /* @__PURE__ */ jsxRuntimeExports.jsx(XCircle, { className: "w-8 h-8 text-red-600", "data-id": "bilsljezf", "data-path": "src/pages/Admin/SystemLogs.tsx" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "q404gyfzt", "data-path": "src/pages/Admin/SystemLogs.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-600", "data-id": "dkid6bkht", "data-path": "src/pages/Admin/SystemLogs.tsx", children: "Errors" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-red-600", "data-id": "1qvooi621", "data-path": "src/pages/Admin/SystemLogs.tsx", children: errorCount })
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-id": "hdtbsf464", "data-path": "src/pages/Admin/SystemLogs.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4", "data-id": "6ttarok9y", "data-path": "src/pages/Admin/SystemLogs.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-3", "data-id": "ybe9k9rof", "data-path": "src/pages/Admin/SystemLogs.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertTriangle, { className: "w-8 h-8 text-yellow-600", "data-id": "4vnmcah9h", "data-path": "src/pages/Admin/SystemLogs.tsx" }),
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
export {
  SystemLogs as default
};
//# sourceMappingURL=SystemLogs-BR8-t57v.js.map
