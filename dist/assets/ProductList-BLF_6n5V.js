import { j as jsxRuntimeExports } from "./ui-BAZ8HTBl.js";
import { r as reactExports, u as useNavigate } from "./vendor-Dw3NhmYV.js";
import { v as toast, T as Table, n as TableHeader, o as TableRow, p as TableHead, q as TableBody, r as TableCell, h as Badge, l as cn, C as Card, b as CardHeader, d as CardTitle, B as Button, f as CardContent, s as supabase, e as CardDescription, X } from "./index-BDkJIub7.js";
import { I as Input } from "./input-DuAIOXAd.js";
import { u as useAuth } from "./AuthContext-CGZTrpGt.js";
import { D as DatabaseService } from "./databaseService-D7YJ8-AF.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription } from "./dialog-DQTKpYge.js";
import { P as Package } from "./package-D-W-NuG7.js";
import { A as ArrowRight } from "./arrow-right-BC-4i-SZ.js";
import { T as TrendingUp } from "./trending-up-Bymz7YBN.js";
import { D as DollarSign } from "./dollar-sign-BipQ1WW8.js";
import { C as Calendar } from "./calendar-BpyyOZ57.js";
import { F as FileText } from "./file-text-DkBBFLSr.js";
import { L as Loader2 } from "./loader-2-CHWmdAij.js";
import { S as Save } from "./save-BO5WkKD5.js";
import { T as Trash2 } from "./trash-2-Dhnxhlze.js";
import { P as Plus } from "./plus-B9tDglN7.js";
import { S as Search } from "./search-BeX_R1GV.js";
const ProductLogs = ({ isOpen, onClose, productId, productName }) => {
  const [logs, setLogs] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (isOpen && productId) {
      loadProductLogs();
    }
  }, [isOpen, productId]);
  const loadProductLogs = async () => {
    try {
      setLoading(true);
      console.log("Loading product logs for product ID:", productId);
      const { data, error } = await DatabaseService.tablePage("11756", {
        PageNo: 1,
        PageSize: 100,
        OrderByField: "change_date",
        IsAsc: false,
        Filters: [
          { name: "product_id", op: "Equal", value: productId }
        ]
      });
      if (error) {
        console.error("API error loading logs:", error);
        throw error;
      }
      console.log("Loaded logs:", (data == null ? void 0 : data.List) || []);
      setLogs((data == null ? void 0 : data.List) || []);
    } catch (error) {
      console.error("Error loading product logs:", error);
      toast({
        title: "Error",
        description: `Failed to load product change logs: ${error}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return "-";
    }
  };
  const formatValue = (fieldName, value) => {
    if (!value || value === "") return "-";
    if (fieldName.includes("price") || fieldName === "profit_margin") {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        return `$${numValue.toFixed(2)}`;
      }
    }
    if (fieldName.includes("date")) {
      try {
        return new Date(value).toLocaleDateString();
      } catch {
        return value;
      }
    }
    return value;
  };
  const getFieldIcon = (fieldName) => {
    switch (fieldName) {
      case "last_shopping_date":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-4 h-4", "data-id": "hc2kwpyda", "data-path": "src/components/ProductLogs.tsx" });
      case "case_price":
      case "unit_price":
      case "retail_price":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "w-4 h-4", "data-id": "cl9g91i3q", "data-path": "src/components/ProductLogs.tsx" });
      case "unit_per_case":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "w-4 h-4", "data-id": "4znreyhu3", "data-path": "src/components/ProductLogs.tsx" });
      case "profit_margin":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-4 h-4", "data-id": "xeuod0e31", "data-path": "src/components/ProductLogs.tsx" });
      default:
        return null;
    }
  };
  const getFieldDisplayName = (fieldName) => {
    switch (fieldName) {
      case "last_shopping_date":
        return "Last Shopping Date";
      case "case_price":
        return "Case Price";
      case "unit_per_case":
        return "Unit Per Case";
      case "unit_price":
        return "Unit Price";
      case "retail_price":
        return "Retail Price";
      case "profit_margin":
        return "Profit Margin";
      default:
        return fieldName.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
    }
  };
  const getFieldColor = (fieldName) => {
    switch (fieldName) {
      case "last_shopping_date":
        return "bg-blue-100 text-blue-800";
      case "case_price":
        return "bg-green-100 text-green-800";
      case "unit_per_case":
        return "bg-purple-100 text-purple-800";
      case "unit_price":
        return "bg-orange-100 text-orange-800";
      case "retail_price":
        return "bg-red-100 text-red-800";
      case "profit_margin":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: isOpen, onOpenChange: onClose, "data-id": "riru1v0g2", "data-path": "src/components/ProductLogs.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-4xl max-h-[80vh] overflow-y-auto", "data-id": "t07tjcdcm", "data-path": "src/components/ProductLogs.tsx", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { "data-id": "zecicbo1p", "data-path": "src/components/ProductLogs.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center space-x-2", "data-id": "2kw0lyje1", "data-path": "src/components/ProductLogs.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "w-5 h-5", "data-id": "0tqm973z6", "data-path": "src/components/ProductLogs.tsx" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "6s0lx11jg", "data-path": "src/components/ProductLogs.tsx", children: "Product Change Logs" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { "data-id": "n6ihqul3s", "data-path": "src/components/ProductLogs.tsx", children: [
        "Change history for: ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", "data-id": "cleq4da3a", "data-path": "src/components/ProductLogs.tsx", children: productName })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4", "data-id": "sw9xfs0so", "data-path": "src/components/ProductLogs.tsx", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", "data-id": "5jcpjg805", "data-path": "src/components/ProductLogs.tsx", children: [...Array(5)].map(
      (_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 bg-gray-100 rounded animate-pulse", "data-id": "g970bd1vj", "data-path": "src/components/ProductLogs.tsx" }, i)
    ) }) : logs.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-8", "data-id": "7yugrxnu6", "data-path": "src/components/ProductLogs.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "w-12 h-12 text-gray-400 mx-auto mb-4", "data-id": "cdb8qxkju", "data-path": "src/components/ProductLogs.tsx" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500", "data-id": "u8sg253u8", "data-path": "src/components/ProductLogs.tsx", children: "No change logs found for this product" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-400 mt-2", "data-id": "jq8ddkkhp", "data-path": "src/components/ProductLogs.tsx", children: "Changes will appear here when product information is updated" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border rounded-lg overflow-hidden", "data-id": "v396cnny9", "data-path": "src/components/ProductLogs.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { "data-id": "i7eusq3he", "data-path": "src/components/ProductLogs.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { "data-id": "0irube5by", "data-path": "src/components/ProductLogs.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { "data-id": "8z8htwwqs", "data-path": "src/components/ProductLogs.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "3p0gnpe49", "data-path": "src/components/ProductLogs.tsx", children: "Field" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "jre7lj1as", "data-path": "src/components/ProductLogs.tsx", children: "Change Date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "go1ih1wcq", "data-path": "src/components/ProductLogs.tsx", children: "Old Value" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-center", "data-id": "o6h79kyqt", "data-path": "src/components/ProductLogs.tsx", children: "→" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "sqxw0lg6q", "data-path": "src/components/ProductLogs.tsx", children: "New Value" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { "data-id": "710opnlq5", "data-path": "src/components/ProductLogs.tsx", children: logs.map(
        (log) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { "data-id": "iigia2ugp", "data-path": "src/components/ProductLogs.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "th8b3xny0", "data-path": "src/components/ProductLogs.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", "data-id": "j14l1bm8r", "data-path": "src/components/ProductLogs.tsx", children: [
            getFieldIcon(log.field_name),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: getFieldColor(log.field_name), "data-id": "6muz1l9ue", "data-path": "src/components/ProductLogs.tsx", children: getFieldDisplayName(log.field_name) })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-sm text-gray-600", "data-id": "dvj4xrm9w", "data-path": "src/components/ProductLogs.tsx", children: formatDate(log.change_date) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "azykl7sv0", "data-path": "src/components/ProductLogs.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-1 bg-red-50 text-red-700 rounded text-sm", "data-id": "sdqmonw28", "data-path": "src/components/ProductLogs.tsx", children: formatValue(log.field_name, log.old_value) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-center", "data-id": "ahuzhn6l6", "data-path": "src/components/ProductLogs.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-4 h-4 text-gray-400", "data-id": "3c6qzx23v", "data-path": "src/components/ProductLogs.tsx" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "t449z8zqe", "data-path": "src/components/ProductLogs.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-1 bg-green-50 text-green-700 rounded text-sm", "data-id": "8v0patywo", "data-path": "src/components/ProductLogs.tsx", children: formatValue(log.field_name, log.new_value) }) })
        ] }, log.ID)
      ) })
    ] }) }) })
  ] }) });
};
const HighlightText = ({ text, searchTerms, allMatch }) => {
  if (!searchTerms.length || !text) return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: text });
  const escapedTerms = searchTerms.map(
    (term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  );
  const regex = new RegExp(`(${escapedTerms.join("|")})`, "gi");
  const parts = text.split(regex);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: parts.map((part, index) => {
    const isMatch = searchTerms.some(
      (term) => part.toLowerCase() === term.toLowerCase()
    );
    if (isMatch) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: `font-semibold ${allMatch ? "bg-green-200 text-green-800" : "bg-yellow-200 text-yellow-800"}`,
          "data-id": "tao96ib2x",
          "data-path": "src/components/HighlightText.tsx",
          children: part
        },
        index
      );
    }
    return part;
  }) });
};
const MOBILE_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 1024;
function useDeviceDetection() {
  const [deviceInfo, setDeviceInfo] = reactExports.useState(() => {
    if (typeof window === "undefined") {
      return {
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        screenWidth: 1920,
        orientation: "landscape",
        touchDevice: false
      };
    }
    const width = window.innerWidth;
    return {
      isMobile: width < MOBILE_BREAKPOINT,
      isTablet: width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT,
      isDesktop: width >= TABLET_BREAKPOINT,
      screenWidth: width,
      orientation: window.innerHeight > window.innerWidth ? "portrait" : "landscape",
      touchDevice: "ontouchstart" in window || navigator.maxTouchPoints > 0
    };
  });
  reactExports.useEffect(() => {
    const updateDeviceInfo = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setDeviceInfo({
        isMobile: width < MOBILE_BREAKPOINT,
        isTablet: width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT,
        isDesktop: width >= TABLET_BREAKPOINT,
        screenWidth: width,
        orientation: height > width ? "portrait" : "landscape",
        touchDevice: "ontouchstart" in window || navigator.maxTouchPoints > 0
      });
    };
    const mobileQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const tabletQuery = window.matchMedia(`(min-width: ${MOBILE_BREAKPOINT}px) and (max-width: ${TABLET_BREAKPOINT - 1}px)`);
    const orientationQuery = window.matchMedia("(orientation: portrait)");
    mobileQuery.addEventListener("change", updateDeviceInfo);
    tabletQuery.addEventListener("change", updateDeviceInfo);
    orientationQuery.addEventListener("change", updateDeviceInfo);
    window.addEventListener("resize", updateDeviceInfo);
    updateDeviceInfo();
    return () => {
      mobileQuery.removeEventListener("change", updateDeviceInfo);
      tabletQuery.removeEventListener("change", updateDeviceInfo);
      orientationQuery.removeEventListener("change", updateDeviceInfo);
      window.removeEventListener("resize", updateDeviceInfo);
    };
  }, []);
  return deviceInfo;
}
function useResponsiveLayout() {
  const device = useDeviceDetection();
  return {
    ...device,
    showSidebar: device.isDesktop,
    showBottomNav: device.isMobile,
    compactHeader: device.isMobile || device.isTablet,
    stackedLayout: device.isMobile,
    columnsCount: device.isMobile ? 1 : device.isTablet ? 2 : 3,
    tableMode: device.isMobile ? "cards" : "table",
    sidebarMode: device.isMobile ? "overlay" : device.isTablet ? "mini" : "full"
  };
}
const ResponsiveTable = ({
  children,
  className = "",
  fallbackComponent
}) => {
  const responsive = useResponsiveLayout();
  if (responsive.isMobile && fallbackComponent) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: fallbackComponent });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn(
    "overflow-x-auto",
    responsive.isMobile && "overflow-x-scroll",
    className
  ), "data-id": "9t60y0r9q", "data-path": "src/components/ResponsiveWrapper.tsx", children });
};
const ResponsiveStack = ({
  children,
  className = "",
  spacing = "md"
}) => {
  const responsive = useResponsiveLayout();
  const spacingClass = {
    sm: "space-y-2 sm:space-y-3",
    md: "space-y-4 sm:space-y-6",
    lg: "space-y-6 sm:space-y-8"
  }[spacing];
  const stackClass = cn(
    "flex flex-col",
    spacingClass,
    responsive.isMobile && "px-1",
    className
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: stackClass, "data-id": "t161ssjzg", "data-path": "src/components/ResponsiveWrapper.tsx", children });
};
const ProductCards = ({
  products,
  searchTerm,
  onViewLogs,
  onSaveProduct,
  onDeleteProduct,
  savingProductId
}) => {
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return "-";
    }
  };
  const getSearchData = (text) => {
    if (!searchTerm || !text) {
      return {
        keywords: [],
        allMatch: false,
        highlightComponent: text
      };
    }
    const searchKeywords = searchTerm.toLowerCase().trim().split(/\s+/).filter((keyword) => keyword.length > 0);
    const textLower = text.toLowerCase();
    const allMatch = searchKeywords.every((keyword) => textLower.includes(keyword));
    return {
      keywords: searchKeywords,
      allMatch,
      highlightComponent: /* @__PURE__ */ jsxRuntimeExports.jsx(
        HighlightText,
        {
          text,
          searchTerms: searchKeywords,
          allMatch,
          "data-id": "58g0bt74c",
          "data-path": "src/components/ProductCards.tsx"
        }
      )
    };
  };
  const calculateMargin = (product) => {
    if (product.unit_price && product.retail_price && product.retail_price > 0) {
      const margin = (product.retail_price - product.unit_price) / product.retail_price * 100;
      return {
        value: margin,
        variant: margin > 20 ? "default" : margin > 10 ? "secondary" : "destructive"
      };
    }
    return null;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-4", "data-id": "vcoqocbmv", "data-path": "src/components/ProductCards.tsx", children: products.map((product) => {
    const margin = calculateMargin(product);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "hover:shadow-md transition-shadow", "data-id": "tkdth0ury", "data-path": "src/components/ProductCards.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-3", "data-id": "uq7z5v57b", "data-path": "src/components/ProductCards.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", "data-id": "ngqjwvfws", "data-path": "src/components/ProductCards.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", "data-id": "yui8uv297", "data-path": "src/components/ProductCards.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-lg leading-tight", "data-id": "4gefxa46g", "data-path": "src/components/ProductCards.tsx", children: searchTerm ? getSearchData(product.product_name).highlightComponent : product.product_name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1", "data-id": "07m0b3qxb", "data-path": "src/components/ProductCards.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "text-xs", "data-id": "6igwrok4a", "data-path": "src/components/ProductCards.tsx", children: [
                "#",
                product.serial_number || "-"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs", "data-id": "qv4tmx4tv", "data-path": "src/components/ProductCards.tsx", children: searchTerm ? getSearchData(product.department || "Convenience Store").highlightComponent : product.department || "Convenience Store" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-1 ml-2", "data-id": "dkhe03wrp", "data-path": "src/components/ProductCards.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: () => onViewLogs(product.ID, product.product_name),
                className: "p-2",
                title: "View logs",
                "data-id": "eo88gx6p9",
                "data-path": "src/components/ProductCards.tsx",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-4 h-4", "data-id": "23l7w9v0h", "data-path": "src/components/ProductCards.tsx" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: () => onSaveProduct(product.ID),
                disabled: savingProductId === product.ID,
                className: "p-2",
                title: "Save product",
                "data-id": "wy9upx6j1",
                "data-path": "src/components/ProductCards.tsx",
                children: savingProductId === product.ID ? /* @__PURE__ */ jsxRuntimeExports.jsx(Loader2, { className: "w-4 h-4 animate-spin", "data-id": "cpi13a2im", "data-path": "src/components/ProductCards.tsx" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-4 h-4", "data-id": "56qwhn9hs", "data-path": "src/components/ProductCards.tsx" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: () => onDeleteProduct(product.ID),
                className: "p-2 text-red-600 hover:text-red-700",
                title: "Delete product",
                "data-id": "ll1ytnsax",
                "data-path": "src/components/ProductCards.tsx",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4", "data-id": "znbcibmod", "data-path": "src/components/ProductCards.tsx" })
              }
            )
          ] })
        ] }),
        product.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-600 mt-2 line-clamp-2", "data-id": "8mdo5s8fb", "data-path": "src/components/ProductCards.tsx", children: searchTerm ? getSearchData(product.description).highlightComponent : product.description })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3", "data-id": "w5zeaa2gx", "data-path": "src/components/ProductCards.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 text-sm", "data-id": "zjkp7xddy", "data-path": "src/components/ProductCards.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "i32gsz0q6", "data-path": "src/components/ProductCards.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500", "data-id": "0h7r2acdd", "data-path": "src/components/ProductCards.tsx", children: "Unit Price:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", "data-id": "cr4jora7q", "data-path": "src/components/ProductCards.tsx", children: product.unit_price ? `$${product.unit_price.toFixed(2)}` : "-" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "fb7oysbqc", "data-path": "src/components/ProductCards.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500", "data-id": "lo8tua9hv", "data-path": "src/components/ProductCards.tsx", children: "Retail Price:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", "data-id": "9u6yh2lg0", "data-path": "src/components/ProductCards.tsx", children: product.retail_price ? `$${product.retail_price.toFixed(2)}` : "-" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "z8oswopfk", "data-path": "src/components/ProductCards.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500", "data-id": "64ozply7o", "data-path": "src/components/ProductCards.tsx", children: "Case Price:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", "data-id": "jy4ue1prr", "data-path": "src/components/ProductCards.tsx", children: product.case_price ? `$${product.case_price.toFixed(2)}` : "-" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "4sl3z79p4", "data-path": "src/components/ProductCards.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500", "data-id": "d846ca4wm", "data-path": "src/components/ProductCards.tsx", children: "Profit Margin:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", "data-id": "s7kltybae", "data-path": "src/components/ProductCards.tsx", children: margin ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: margin.variant, className: "text-xs", "data-id": "st1wcyk5n", "data-path": "src/components/ProductCards.tsx", children: [
              margin.value.toFixed(1),
              "%"
            ] }) : "-" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-2 text-sm border-t pt-3", "data-id": "8ughceoru", "data-path": "src/components/ProductCards.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", "data-id": "o55w5fzun", "data-path": "src/components/ProductCards.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500", "data-id": "9t7nnwi4o", "data-path": "src/components/ProductCards.tsx", children: "Weight:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", "data-id": "x66bd4ci2", "data-path": "src/components/ProductCards.tsx", children: product.weight && product.weight > 0 ? `${product.weight} ${product.weight_unit || "lb"}` : "-" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", "data-id": "9e15p2e4z", "data-path": "src/components/ProductCards.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500", "data-id": "osmo02jsp", "data-path": "src/components/ProductCards.tsx", children: "Supplier:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium truncate ml-2", "data-id": "pd3k5olyc", "data-path": "src/components/ProductCards.tsx", children: searchTerm ? getSearchData(product.supplier || "-").highlightComponent : product.supplier || "-" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", "data-id": "o39vnn1ce", "data-path": "src/components/ProductCards.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500", "data-id": "utyht6qtb", "data-path": "src/components/ProductCards.tsx", children: "Unit per Case:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", "data-id": "3f91uaoh8", "data-path": "src/components/ProductCards.tsx", children: product.unit_per_case || "-" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", "data-id": "161xfgys0", "data-path": "src/components/ProductCards.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500", "data-id": "2tbhaxvf4", "data-path": "src/components/ProductCards.tsx", children: "Last Updated:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", "data-id": "o9pd996us", "data-path": "src/components/ProductCards.tsx", children: formatDate(product.last_updated_date) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", "data-id": "bxtiv50ng", "data-path": "src/components/ProductCards.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500", "data-id": "ikluthn8r", "data-path": "src/components/ProductCards.tsx", children: "Last Shopping:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", "data-id": "oqm9cafl6", "data-path": "src/components/ProductCards.tsx", children: formatDate(product.last_shopping_date) })
          ] })
        ] })
      ] })
    ] }, product.ID);
  }) });
};
const ProductList = () => {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const responsive = useResponsiveLayout();
  const [products, setProducts] = reactExports.useState([]);
  const [allProducts, setAllProducts] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [searchTerm, setSearchTerm] = reactExports.useState("");
  const [totalCount, setTotalCount] = reactExports.useState(0);
  const [logsModalOpen, setLogsModalOpen] = reactExports.useState(false);
  const [selectedProduct, setSelectedProduct] = reactExports.useState(null);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = reactExports.useState("");
  const [isSearching, setIsSearching] = reactExports.useState(false);
  const [hasMoreProducts, setHasMoreProducts] = reactExports.useState(true);
  const [isLoadingMore, setIsLoadingMore] = reactExports.useState(false);
  const [savingProductId, setSavingProductId] = reactExports.useState(null);
  const pageSize = 50;
  const [loadedProductsCount, setLoadedProductsCount] = reactExports.useState(pageSize);
  const loadingTriggerRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setLoadedProductsCount(pageSize);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, pageSize]);
  reactExports.useEffect(() => {
    loadAllProducts();
  }, []);
  reactExports.useEffect(() => {
    filterAndSliceProducts();
  }, [debouncedSearchTerm, loadedProductsCount, allProducts]);
  const loadAllProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("products").select("*").order("id", { ascending: false }).limit(1e3);
      if (error) throw error;
      setAllProducts(data || []);
    } catch (error) {
      console.error("Error loading products:", error);
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const filterAndSliceProducts = () => {
    setIsSearching(!!debouncedSearchTerm);
    let filteredProducts = allProducts;
    if (debouncedSearchTerm) {
      const searchKeywords = debouncedSearchTerm.toLowerCase().trim().split(/\s+/).filter((keyword) => keyword.length > 0);
      filteredProducts = allProducts.filter((product) => {
        var _a;
        const searchableText = [
          product.product_name,
          product.description,
          product.category,
          product.supplier,
          product.department,
          product.bar_code_case,
          product.bar_code_unit,
          (_a = product.serial_number) == null ? void 0 : _a.toString()
        ].join(" ").toLowerCase();
        return searchKeywords.every((keyword) => searchableText.includes(keyword));
      });
    }
    if (!debouncedSearchTerm) {
      filteredProducts = filteredProducts.sort((a, b) => {
        const serialA = a.serial_number || 0;
        const serialB = b.serial_number || 0;
        return serialA - serialB;
      });
    }
    const slicedProducts = filteredProducts.slice(0, loadedProductsCount);
    setProducts(slicedProducts);
    setTotalCount(filteredProducts.length);
    setHasMoreProducts(loadedProductsCount < filteredProducts.length);
  };
  const handleDelete = async (productId) => {
    console.log("handleDelete called for product ID:", productId);
    const confirmed = confirm("Are you sure you want to delete this product? This action cannot be undone.");
    console.log("User confirmed deletion:", confirmed);
    if (!confirmed) {
      console.log("Deletion cancelled by user");
      return;
    }
    try {
      console.log("Attempting to delete product with ID:", productId);
      const { error } = await supabase.from("products").delete().eq("id", productId);
      if (error) {
        console.error("API returned error:", error);
        throw error;
      }
      console.log("Product deleted successfully");
      toast({
        title: "Success",
        description: "Product deleted successfully"
      });
      loadAllProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Error",
        description: `Failed to delete product: ${error}`,
        variant: "destructive"
      });
    }
  };
  const handleSaveProduct = async (productId = null) => {
    var _a;
    console.log("handleSaveProduct called for product ID:", productId);
    const isCreating = productId === null;
    setSavingProductId(productId || -1);
    try {
      if (isCreating) {
        const confirmed = confirm("Create a new product entry? This will add a new product with default values that you can edit.");
        if (!confirmed) {
          console.log("Product creation cancelled by user");
          setSavingProductId(null);
          return;
        }
        const { data: serialData } = await supabase.from("products").select("serial_number").order("serial_number", { ascending: false }).limit(1);
        const lastSerial = ((_a = serialData == null ? void 0 : serialData[0]) == null ? void 0 : _a.serial_number) || 0;
        const newSerial = lastSerial + 1;
        const newProductData = {
          serial_number: newSerial,
          product_name: `New Product ${newSerial}`,
          category: "General",
          quantity_in_stock: 0,
          minimum_stock: 0,
          supplier: "",
          description: "Please update this product information",
          weight: 0,
          weight_unit: "lb",
          department: "Convenience Store",
          merchant_id: null,
          bar_code_case: "",
          bar_code_unit: "",
          last_updated_date: (/* @__PURE__ */ new Date()).toISOString(),
          last_shopping_date: null,
          case_price: 0,
          unit_per_case: 1,
          unit_price: 0,
          retail_price: 0,
          overdue: false,
          created_by: (userProfile == null ? void 0 : userProfile.user_id) || null
        };
        console.log("Creating new product with data:", newProductData);
        const { error } = await supabase.from("products").insert([newProductData]);
        if (error) {
          console.error("API returned error:", error);
          throw error;
        }
        console.log("New product created successfully with serial:", newSerial);
        toast({
          title: "Success",
          description: `New product created with serial #${newSerial}. Please edit it to add complete information.`,
          duration: 5e3
        });
      } else {
        const product = products.find((p) => p.ID === productId);
        if (!product) {
          throw new Error("Product not found");
        }
        const confirmed = confirm(`Save updates to "${product.product_name}"? This will update the product information with current values.`);
        if (!confirmed) {
          console.log("Product update cancelled by user");
          setSavingProductId(null);
          return;
        }
        console.log("Updating product:", product);
        const updateData = {
          ID: product.ID,
          product_name: product.product_name,
          category: product.category || "",
          quantity_in_stock: product.quantity_in_stock || 0,
          minimum_stock: product.minimum_stock || 0,
          supplier: product.supplier || "",
          description: product.description || "",
          serial_number: product.serial_number || 0,
          weight: product.weight || 0,
          weight_unit: product.weight_unit || "lb",
          department: product.department || "Convenience Store",
          merchant_id: product.merchant_id || null,
          bar_code_case: product.bar_code_case || "",
          bar_code_unit: product.bar_code_unit || "",
          last_updated_date: (/* @__PURE__ */ new Date()).toISOString(),
          last_shopping_date: product.last_shopping_date || null,
          case_price: product.case_price || 0,
          unit_per_case: product.unit_per_case || 1,
          unit_price: product.unit_price || 0,
          retail_price: product.retail_price || 0,
          overdue: product.overdue || false,
          created_by: product.created_by || (userProfile == null ? void 0 : userProfile.user_id) || null
        };
        console.log("Updating product with data:", updateData);
        const { error } = await supabase.from("products").update(updateData).eq("ID", product.ID);
        if (error) {
          console.error("API returned error:", error);
          throw error;
        }
        console.log("Product updated successfully with ID:", product.ID);
        toast({
          title: "Success",
          description: `"${product.product_name}" updated successfully`,
          duration: 3e3
        });
      }
      loadAllProducts();
    } catch (error) {
      console.error("Error saving product:", error);
      toast({
        title: "Error",
        description: `Failed to ${isCreating ? "create" : "update"} product: ${error}`,
        variant: "destructive"
      });
    } finally {
      setSavingProductId(null);
    }
  };
  const loadMoreProducts = reactExports.useCallback(() => {
    if (isLoadingMore || !hasMoreProducts) return;
    setIsLoadingMore(true);
    setTimeout(() => {
      setLoadedProductsCount((prev) => prev + pageSize);
      setIsLoadingMore(false);
    }, 300);
  }, [isLoadingMore, hasMoreProducts, pageSize]);
  reactExports.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMoreProducts && !isLoadingMore) {
          loadMoreProducts();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "100px"
      }
    );
    const currentTrigger = loadingTriggerRef.current;
    if (currentTrigger) {
      observer.observe(currentTrigger);
    }
    return () => {
      if (currentTrigger) {
        observer.unobserve(currentTrigger);
      }
    };
  }, [loadMoreProducts, hasMoreProducts, isLoadingMore]);
  const handleViewLogs = (productId, productName) => {
    console.log("handleViewLogs called for:", { productId, productName });
    setSelectedProduct({ id: productId, name: productName });
    setLogsModalOpen(true);
    console.log("Logs modal should now be open");
  };
  const getDisplayText = () => {
    if (totalCount === 0) return "";
    const currentlyShowing = Math.min(products.length, totalCount);
    if (debouncedSearchTerm) {
      return `Showing ${currentlyShowing} of ${totalCount} products matching "${debouncedSearchTerm}"`;
    }
    if (hasMoreProducts) {
      return `Showing ${currentlyShowing} of ${totalCount} products - Scroll down to load more`;
    }
    return `Showing all ${totalCount} products`;
  };
  const getSearchData = (text) => {
    if (!debouncedSearchTerm || !text) {
      return {
        keywords: [],
        allMatch: false,
        highlightComponent: text
      };
    }
    const searchKeywords = debouncedSearchTerm.toLowerCase().trim().split(/\s+/).filter((keyword) => keyword.length > 0);
    const textLower = text.toLowerCase();
    const allMatch = searchKeywords.every((keyword) => textLower.includes(keyword));
    return {
      keywords: searchKeywords,
      allMatch,
      highlightComponent: /* @__PURE__ */ jsxRuntimeExports.jsx(
        HighlightText,
        {
          text,
          searchTerms: searchKeywords,
          allMatch,
          "data-id": "1wt725buf",
          "data-path": "src/pages/Products/ProductList.tsx"
        }
      )
    };
  };
  const handleClearSearch = () => {
    setSearchTerm("");
    setLoadedProductsCount(pageSize);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(ResponsiveStack, { spacing: "lg", "data-id": "btwya3lp5", "data-path": "src/pages/Products/ProductList.tsx", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "6w9ert8jz", "data-path": "src/pages/Products/ProductList.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "5m1mzk7vo", "data-path": "src/pages/Products/ProductList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center ${responsive.isMobile ? "flex-col space-y-4" : "justify-between"}`, "data-id": "bowlpcor5", "data-path": "src/pages/Products/ProductList.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: responsive.isMobile ? "text-center" : "", "data-id": "y8tl5mqr0", "data-path": "src/pages/Products/ProductList.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center space-x-2", "data-id": "dv5p6okn6", "data-path": "src/pages/Products/ProductList.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "w-6 h-6", "data-id": "mpvi5de9f", "data-path": "src/pages/Products/ProductList.tsx" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "lssx8ks5s", "data-path": "src/pages/Products/ProductList.tsx", children: "Products" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: responsive.isMobile ? "text-center mt-2" : "", "data-id": "60hg960xc", "data-path": "src/pages/Products/ProductList.tsx", children: "Manage your product inventory - Search across all product fields for similar items" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: () => navigate("/products/new"),
            className: `bg-brand-600 hover:bg-brand-700 text-white ${responsive.isMobile ? "w-full" : ""}`,
            "data-id": "yrss8uwf7",
            "data-path": "src/pages/Products/ProductList.tsx",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4 mr-2", "data-id": "8mt4ozszr", "data-path": "src/pages/Products/ProductList.tsx" }),
              "Add Product"
            ]
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { "data-id": "cgvu9f3kp", "data-path": "src/pages/Products/ProductList.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center mb-6 ${responsive.isMobile ? "flex-col space-y-3" : "space-x-2"}`, "data-id": "xhu140fsq", "data-path": "src/pages/Products/ProductList.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `relative ${responsive.isMobile ? "w-full" : "flex-1 max-w-sm"}`, "data-id": "obkwojs7a", "data-path": "src/pages/Products/ProductList.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4", "data-id": "i4u0f0oyn", "data-path": "src/pages/Products/ProductList.tsx" }),
            searchTerm && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: handleClearSearch,
                className: "absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 w-4 h-4 flex items-center justify-center",
                title: "Clear search",
                "data-id": "dkfof42co",
                "data-path": "src/pages/Products/ProductList.tsx",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4", "data-id": "umphay4wr", "data-path": "src/pages/Products/ProductList.tsx" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                placeholder: responsive.isMobile ? "Search products..." : "Search products by name, description, category, supplier, barcode...",
                value: searchTerm,
                onChange: (e) => setSearchTerm(e.target.value),
                className: `pl-10 ${searchTerm ? "pr-10" : "pr-3"}`,
                "data-id": "fokk0lrml",
                "data-path": "src/pages/Products/ProductList.tsx"
              }
            )
          ] }),
          debouncedSearchTerm && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center space-x-2 ${responsive.isMobile ? "w-full justify-center" : ""}`, "data-id": "vhlhajtb4", "data-path": "src/pages/Products/ProductList.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", "data-id": "lx9c47e6v", "data-path": "src/pages/Products/ProductList.tsx", children: [
              totalCount,
              " result",
              totalCount !== 1 ? "s" : "",
              " found"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: handleClearSearch,
                "data-id": "0gw3ch1r5",
                "data-path": "src/pages/Products/ProductList.tsx",
                children: "Clear"
              }
            )
          ] })
        ] }),
        loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", "data-id": "sizuuqbx0", "data-path": "src/pages/Products/ProductList.tsx", children: [...Array(5)].map(
          (_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `bg-gray-100 rounded animate-pulse ${responsive.isMobile ? "h-32" : "h-16"}`, "data-id": "iu3nnrhc1", "data-path": "src/pages/Products/ProductList.tsx" }, i)
        ) }) : products.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-8", "data-id": "5to45rrj4", "data-path": "src/pages/Products/ProductList.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "w-12 h-12 text-gray-400 mx-auto mb-4", "data-id": "1pfqp05jo", "data-path": "src/pages/Products/ProductList.tsx" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500", "data-id": "pdsgjn99d", "data-path": "src/pages/Products/ProductList.tsx", children: debouncedSearchTerm ? `No products found matching "${debouncedSearchTerm}"` : "No products found" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              className: "mt-4",
              onClick: () => debouncedSearchTerm ? handleClearSearch() : navigate("/products/new"),
              "data-id": "81ceuepen",
              "data-path": "src/pages/Products/ProductList.tsx",
              children: debouncedSearchTerm ? "Clear Search" : "Add Your First Product"
            }
          )
        ] }) : responsive.isMobile ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          ProductCards,
          {
            products,
            searchTerm: debouncedSearchTerm,
            onViewLogs: handleViewLogs,
            onSaveProduct: handleSaveProduct,
            onDeleteProduct: handleDelete,
            savingProductId,
            "data-id": "rxz6bntu1",
            "data-path": "src/pages/Products/ProductList.tsx"
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveTable, { className: "border rounded-lg overflow-hidden", "data-id": "9u668xl6m", "data-path": "src/pages/Products/ProductList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { "data-id": "parxcetjj", "data-path": "src/pages/Products/ProductList.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { "data-id": "sywj330th", "data-path": "src/pages/Products/ProductList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { "data-id": "reg1nxz9g", "data-path": "src/pages/Products/ProductList.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "wr0rdxj7u", "data-path": "src/pages/Products/ProductList.tsx", children: "Serial" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "xguj479aq", "data-path": "src/pages/Products/ProductList.tsx", children: "Product Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "7h0kv6j17", "data-path": "src/pages/Products/ProductList.tsx", children: "Weight" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "m0mjuvv7q", "data-path": "src/pages/Products/ProductList.tsx", children: "Department" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "y38xdhyn7", "data-path": "src/pages/Products/ProductList.tsx", children: "Merchant" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "hyjsoza3w", "data-path": "src/pages/Products/ProductList.tsx", children: "Last Updated Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "035hbg930", "data-path": "src/pages/Products/ProductList.tsx", children: "Last Shopping Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "th1z3z9u8", "data-path": "src/pages/Products/ProductList.tsx", children: "Case Price" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "238n5lgcq", "data-path": "src/pages/Products/ProductList.tsx", children: "Unit Per Case" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "1z9kj96eq", "data-path": "src/pages/Products/ProductList.tsx", children: "Unit Price" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "yhlio4zkh", "data-path": "src/pages/Products/ProductList.tsx", children: "Retail Price" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "uqhntcdih", "data-path": "src/pages/Products/ProductList.tsx", children: "Profit Margin" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "bezh8xz0h", "data-path": "src/pages/Products/ProductList.tsx", children: "Actions" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { "data-id": "tku466zwk", "data-path": "src/pages/Products/ProductList.tsx", children: products.map((product) => {
            const formatDate = (dateString) => {
              if (!dateString) return "-";
              try {
                return new Date(dateString).toLocaleDateString();
              } catch {
                return "-";
              }
            };
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { "data-id": "v193smj46", "data-path": "src/pages/Products/ProductList.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", "data-id": "sdowsi684", "data-path": "src/pages/Products/ProductList.tsx", children: product.serial_number || "-" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "e8rd7c27x", "data-path": "src/pages/Products/ProductList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "rg0lp6ej4", "data-path": "src/pages/Products/ProductList.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", "data-id": "gwy9p1va6", "data-path": "src/pages/Products/ProductList.tsx", children: debouncedSearchTerm ? getSearchData(product.product_name).highlightComponent : product.product_name }),
                product.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500 truncate max-w-xs", "data-id": "hgubcoamt", "data-path": "src/pages/Products/ProductList.tsx", children: debouncedSearchTerm ? getSearchData(product.description).highlightComponent : product.description })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "6ktazokh3", "data-path": "src/pages/Products/ProductList.tsx", children: product.weight && product.weight > 0 ? `${product.weight} ${product.weight_unit || "lb"}` : "-" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "jzswq8w77", "data-path": "src/pages/Products/ProductList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", "data-id": "hon8kpyv4", "data-path": "src/pages/Products/ProductList.tsx", children: debouncedSearchTerm ? getSearchData(product.department || "Convenience Store").highlightComponent : product.department || "Convenience Store" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "tja925sjn", "data-path": "src/pages/Products/ProductList.tsx", children: debouncedSearchTerm ? getSearchData(product.supplier || "-").highlightComponent : product.supplier || "-" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "2ed5zq0bu", "data-path": "src/pages/Products/ProductList.tsx", children: formatDate(product.last_updated_date) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "ilzlzxc8k", "data-path": "src/pages/Products/ProductList.tsx", children: formatDate(product.last_shopping_date) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "h9o5wgj8v", "data-path": "src/pages/Products/ProductList.tsx", children: product.case_price ? `$${product.case_price.toFixed(2)}` : "-" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "de1cqfqco", "data-path": "src/pages/Products/ProductList.tsx", children: product.unit_per_case || "-" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "8xxfe4zj9", "data-path": "src/pages/Products/ProductList.tsx", children: product.unit_price ? `$${product.unit_price.toFixed(2)}` : "-" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "gvcfe406h", "data-path": "src/pages/Products/ProductList.tsx", children: product.retail_price ? `$${product.retail_price.toFixed(2)}` : "-" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "7pq6gl3td", "data-path": "src/pages/Products/ProductList.tsx", children: (() => {
                if (product.unit_price && product.retail_price && product.retail_price > 0) {
                  const margin = (product.retail_price - product.unit_price) / product.retail_price * 100;
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Badge,
                    {
                      variant: margin > 20 ? "default" : margin > 10 ? "secondary" : "destructive",
                      className: "text-xs",
                      "data-id": "93py8n7ws",
                      "data-path": "src/pages/Products/ProductList.tsx",
                      children: [
                        margin.toFixed(1),
                        "%"
                      ]
                    }
                  );
                }
                return "-";
              })() }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "l9c1abv6q", "data-path": "src/pages/Products/ProductList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", "data-id": "wu5kfr14z", "data-path": "src/pages/Products/ProductList.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "outline",
                    size: "sm",
                    onClick: () => {
                      console.log("Viewing logs for product:", product.ID, product.product_name);
                      handleViewLogs(product.ID, product.product_name);
                    },
                    title: "View change logs",
                    "data-id": "1gq3ylslg",
                    "data-path": "src/pages/Products/ProductList.tsx",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-4 h-4", "data-id": "coqqs1v3x", "data-path": "src/pages/Products/ProductList.tsx" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "outline",
                    size: "sm",
                    onClick: () => {
                      console.log("Saving product:", product.ID);
                      handleSaveProduct(product.ID);
                    },
                    disabled: savingProductId === product.ID,
                    title: "Save product",
                    "data-id": "d6aiaoqcp",
                    "data-path": "src/pages/Products/ProductList.tsx",
                    children: savingProductId === product.ID ? /* @__PURE__ */ jsxRuntimeExports.jsx(Loader2, { className: "w-4 h-4 animate-spin", "data-id": "86whprmfp", "data-path": "src/pages/Products/ProductList.tsx" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-4 h-4", "data-id": "lkm8ei34z", "data-path": "src/pages/Products/ProductList.tsx" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "outline",
                    size: "sm",
                    onClick: () => {
                      console.log("Deleting product:", product.ID);
                      handleDelete(product.ID);
                    },
                    className: "text-red-600 hover:text-red-700",
                    title: "Delete product",
                    "data-id": "8q1xzfud0",
                    "data-path": "src/pages/Products/ProductList.tsx",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4", "data-id": "k497aogsp", "data-path": "src/pages/Products/ProductList.tsx" })
                  }
                )
              ] }) })
            ] }, product.ID);
          }) })
        ] }) }),
        products.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6", "data-id": "m4aa6rld5", "data-path": "src/pages/Products/ProductList.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-700 text-center mb-4", "data-id": "er7e69bp3", "data-path": "src/pages/Products/ProductList.tsx", children: getDisplayText() }),
          hasMoreProducts && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              ref: loadingTriggerRef,
              className: "flex items-center justify-center py-8",
              "data-id": "hkg96gs2v",
              "data-path": "src/pages/Products/ProductList.tsx",
              children: isLoadingMore ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2 text-gray-500", "data-id": "9u8xoflva", "data-path": "src/pages/Products/ProductList.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Loader2, { className: "w-5 h-5 animate-spin", "data-id": "kbxlmbr8a", "data-path": "src/pages/Products/ProductList.tsx" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "vi9t8n6nh", "data-path": "src/pages/Products/ProductList.tsx", children: "Loading more products..." })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-gray-400 text-sm", "data-id": "agnv83oox", "data-path": "src/pages/Products/ProductList.tsx", children: "Scroll down to load more products" })
            }
          ),
          !hasMoreProducts && totalCount > pageSize && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-4 text-sm text-gray-500", "data-id": "txy8dbwem", "data-path": "src/pages/Products/ProductList.tsx", children: [
            "You've reached the end - all ",
            totalCount,
            " products loaded"
          ] })
        ] })
      ] })
    ] }),
    selectedProduct && /* @__PURE__ */ jsxRuntimeExports.jsx(
      ProductLogs,
      {
        isOpen: logsModalOpen,
        onClose: () => {
          setLogsModalOpen(false);
          setSelectedProduct(null);
        },
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        "data-id": "ec6cb0czv",
        "data-path": "src/pages/Products/ProductList.tsx"
      }
    )
  ] });
};
export {
  ProductList as default
};
//# sourceMappingURL=ProductList-BLF_6n5V.js.map
