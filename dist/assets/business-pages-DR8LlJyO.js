import { r as reactExports, j as jsxRuntimeExports, u as useNavigate, a as useParams, L as Link } from "./react-vendor-DX0Gaxph.js";
import { K as toast, D as Dialog, t as DialogContent, v as DialogHeader, w as DialogTitle, x as DialogDescription, z as Table, E as TableHeader, F as TableRow, G as TableHead, H as TableBody, J as TableCell, l as Badge, X as cn, C as Card, d as CardHeader, e as CardTitle, B as Button, g as CardContent, y as useAuth, s as supabase, f as CardDescription, I as Input, u as useToast, r as DialogTrigger, L as Label, S as Select, h as SelectTrigger, i as SelectValue, j as SelectContent, k as SelectItem, Y as Separator, O as Textarea, N as ScrollArea, Z as DialogFooter } from "./admin-core-DFYqoWCM.js";
import { aA as Package, bq as ArrowRight, ak as TrendingUp, az as DollarSign, aL as Calendar, a4 as FileText, aD as LoaderCircle, aG as Save, ao as Trash2, aC as Plus, a1 as Search, X, br as Camera, J as ArrowLeft, bs as Upload, aa as Download, bt as Calculator, aB as Eye, ai as Clock, an as SquarePen, aS as Phone, aO as Mail, a5 as Zap, l as Check, aE as RotateCcw, bu as Image$1, bv as Receipt, aM as Printer, bw as Fuel, ac as CircleAlert, ax as Building2, aT as MapPin, bx as ShoppingCart, by as Ticket, bz as Gauge, a0 as CircleCheckBig, bp as TrendingDown, Y as RefreshCw, bA as Minus, a2 as Settings, H as TriangleAlert, aJ as Bell, ay as Truck } from "./ui-components-E8Qujiw2.js";
import { E as ErrorLogger, C as ComponentErrorBoundary, F as FormErrorBoundary } from "./admin-security-CWSw-PzD.js";
import { A as AnimatePresence, m as motion } from "./animations-DEJKylty.js";
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
      const { data, error } = await window.ezsite.apis.tablePage("11756", {
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
                children: savingProductId === product.ID ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin", "data-id": "cpi13a2im", "data-path": "src/components/ProductCards.tsx" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-4 h-4", "data-id": "56qwhn9hs", "data-path": "src/components/ProductCards.tsx" })
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
                    children: savingProductId === product.ID ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin", "data-id": "86whprmfp", "data-path": "src/pages/Products/ProductList.tsx" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-4 h-4", "data-id": "lkm8ei34z", "data-path": "src/pages/Products/ProductList.tsx" })
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
                /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-5 h-5 animate-spin", "data-id": "kbxlmbr8a", "data-path": "src/pages/Products/ProductList.tsx" }),
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
const ProductList$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ProductList
}, Symbol.toStringTag, { value: "Module" }));
const useSmartZero = (initialValue = 0) => {
  const [value, setValue] = reactExports.useState(String(initialValue || 0));
  const [isFocused, setIsFocused] = reactExports.useState(false);
  const [hasUserInput, setHasUserInput] = reactExports.useState(false);
  const handleFocus = reactExports.useCallback(() => {
    setIsFocused(true);
    if (value === "0" && !hasUserInput) {
      setValue("");
    }
  }, [value, hasUserInput]);
  const handleBlur = reactExports.useCallback(() => {
    setIsFocused(false);
    if (!value.trim()) {
      setValue("0");
      setHasUserInput(false);
    }
  }, [value]);
  const handleChange = reactExports.useCallback((newValue) => {
    setValue(newValue);
    setHasUserInput(true);
  }, []);
  const getNumericValue = reactExports.useCallback(() => {
    const numValue = parseFloat(value) || 0;
    return numValue;
  }, [value]);
  const resetValue = reactExports.useCallback((newValue = 0) => {
    setValue(String(newValue || 0));
    setHasUserInput(newValue !== 0);
  }, []);
  return {
    value,
    isFocused,
    handleFocus,
    handleBlur,
    handleChange,
    getNumericValue,
    resetValue,
    displayValue: isFocused && value === "" ? "" : value
  };
};
const NumberInput = reactExports.forwardRef(
  ({ className, type = "number", value: propValue, onChange, onValueChange, ...props }, ref) => {
    const smartZero = useSmartZero(propValue);
    reactExports.useEffect(() => {
      if (propValue !== void 0 && propValue !== smartZero.getNumericValue()) {
        smartZero.resetValue(propValue);
      }
    }, [propValue]);
    const handleInputChange = (e) => {
      const newValue = e.target.value;
      smartZero.handleChange(newValue);
      if (onChange) {
        const numericValue = parseFloat(newValue) || 0;
        onChange(numericValue);
      }
      if (onValueChange) {
        onValueChange(newValue);
      }
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        type,
        className: cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        ),
        ref,
        value: smartZero.displayValue,
        onChange: handleInputChange,
        onFocus: smartZero.handleFocus,
        onBlur: smartZero.handleBlur,
        ...props
      }
    );
  }
);
NumberInput.displayName = "NumberInput";
const useErrorHandler = (options = {}) => {
  const { toast: toast2 } = useToast();
  const errorLogger = ErrorLogger.getInstance();
  const {
    component = "Unknown Component",
    showToast = true,
    logError = true,
    severity = "medium"
  } = options;
  const handleError = reactExports.useCallback((error, customMessage, context) => {
    const errorObj = typeof error === "string" ? new Error(error) : error;
    if (logError) {
      errorLogger.log(
        errorObj,
        severity,
        component,
        void 0,
        context
      );
    }
    if (showToast) {
      toast2({
        variant: "destructive",
        title: "Error",
        description: customMessage || errorObj.message || "An unexpected error occurred"
      });
    }
  }, [component, showToast, logError, severity, toast2, errorLogger]);
  const handleAsync = reactExports.useCallback(async (asyncFn, errorMessage, context) => {
    try {
      return await asyncFn();
    } catch (error) {
      handleError(
        error instanceof Error ? error : new Error(String(error)),
        errorMessage,
        context
      );
      return null;
    }
  }, [handleError]);
  const handleApiCall = reactExports.useCallback(async (apiCall, errorMessage, context) => {
    try {
      const result = await apiCall();
      if (result.error) {
        throw new Error(result.error);
      }
      return result.data || null;
    } catch (error) {
      handleError(
        error instanceof Error ? error : new Error(String(error)),
        errorMessage,
        context
      );
      return null;
    }
  }, [handleError]);
  return {
    handleError,
    handleAsync,
    handleApiCall
  };
};
const BarcodeScanner = ({ onScan, triggerText = "Scan Barcode", disabled = false }) => {
  const videoRef = reactExports.useRef(null);
  const canvasRef = reactExports.useRef(null);
  const [isOpen, setIsOpen] = reactExports.useState(false);
  const [stream, setStream] = reactExports.useState(null);
  const [isScanning, setIsScanning] = reactExports.useState(false);
  const { toast: toast2 } = useToast();
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsScanning(true);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast2({
        variant: "destructive",
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions."
      });
    }
  };
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      setIsScanning(false);
    }
  };
  const captureFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        const simulatedBarcode = Math.random().toString(36).substr(2, 12).toUpperCase();
        onScan(simulatedBarcode);
        setIsOpen(false);
        stopCamera();
        toast2({
          title: "Barcode Scanned",
          description: `Detected barcode: ${simulatedBarcode}`
        });
      }
    }
  };
  reactExports.useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    ComponentErrorBoundary,
    {
      componentName: "BarcodeScanner",
      severity: "medium",
      minHeight: "200px",
      "data-id": "3pibg6ms7",
      "data-path": "src/components/BarcodeScanner.tsx",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open: isOpen, onOpenChange: setIsOpen, "data-id": "39q67l96m", "data-path": "src/components/BarcodeScanner.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, "data-id": "avk5syt1n", "data-path": "src/components/BarcodeScanner.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", variant: "outline", size: "sm", disabled, "data-id": "y6ol20tpr", "data-path": "src/components/BarcodeScanner.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "w-4 h-4 mr-2", "data-id": "st0einn3s", "data-path": "src/components/BarcodeScanner.tsx" }),
          triggerText
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-md", "data-id": "3crr5yoy5", "data-path": "src/components/BarcodeScanner.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { "data-id": "pcs34g8fb", "data-path": "src/components/BarcodeScanner.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { "data-id": "vr2r4ah79", "data-path": "src/components/BarcodeScanner.tsx", children: "Scan Barcode" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center space-y-4", "data-id": "m2yxl59b5", "data-path": "src/components/BarcodeScanner.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full max-w-sm aspect-video bg-black rounded-lg overflow-hidden", "data-id": "jv41adqnn", "data-path": "src/components/BarcodeScanner.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "video",
                {
                  ref: videoRef,
                  autoPlay: true,
                  playsInline: true,
                  className: "w-full h-full object-cover",
                  "data-id": "umo9yuczd",
                  "data-path": "src/components/BarcodeScanner.tsx"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "canvas",
                {
                  ref: canvasRef,
                  className: "hidden",
                  "data-id": "1zqrqnpg4",
                  "data-path": "src/components/BarcodeScanner.tsx"
                }
              ),
              !isScanning && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center text-white", "data-id": "4n61y3quc", "data-path": "src/components/BarcodeScanner.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", "data-id": "0yw8fuk6s", "data-path": "src/components/BarcodeScanner.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "w-12 h-12 mx-auto mb-2", "data-id": "blxgzp25x", "data-path": "src/components/BarcodeScanner.tsx" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { "data-id": "ebyr1flvg", "data-path": "src/components/BarcodeScanner.tsx", children: "Initializing camera..." })
              ] }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex space-x-2", "data-id": "ga2zy4vyi", "data-path": "src/components/BarcodeScanner.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: captureFrame, disabled: !isScanning, "data-id": "gdiold53r", "data-path": "src/components/BarcodeScanner.tsx", children: "Capture" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: () => setIsOpen(false), "data-id": "6hay25d0q", "data-path": "src/components/BarcodeScanner.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4 mr-2", "data-id": "62fns4deb", "data-path": "src/components/BarcodeScanner.tsx" }),
                "Cancel"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground text-center", "data-id": "ypqys8ed6", "data-path": "src/components/BarcodeScanner.tsx", children: "Position the barcode within the camera view and click Capture" })
          ] })
        ] })
      ] })
    }
  );
};
const ProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast: toast2 } = useToast();
  const { userProfile } = useAuth();
  useErrorHandler({
    component: "ProductForm",
    severity: "high"
  });
  const isEdit = !!id;
  const [isLoading, setIsLoading] = reactExports.useState(false);
  const [vendors, setVendors] = reactExports.useState([]);
  const [categories, setCategories] = reactExports.useState([]);
  const [bulkUploadData, setBulkUploadData] = reactExports.useState([]);
  const [showBulkPreview, setShowBulkPreview] = reactExports.useState(false);
  const [isUploadingBulk, setIsUploadingBulk] = reactExports.useState(false);
  const [formData, setFormData] = reactExports.useState({
    product_name: "",
    weight: 0,
    weight_unit: "lb",
    department: "Convenience Store",
    merchant_id: "",
    last_updated_date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    last_shopping_date: "",
    case_price: 0,
    unit_per_case: 1,
    unit_price: 0,
    retail_price: 0,
    profit_margin: 0,
    category: "",
    supplier: "",
    quantity_in_stock: 0,
    minimum_stock: 0,
    description: "",
    bar_code_case: "",
    bar_code_unit: "",
    serial_number: 0,
    overdue: false
  });
  const [originalData, setOriginalData] = reactExports.useState(null);
  const weightUnits = [
    { value: "lb", label: "Pounds (lb)" },
    { value: "oz", label: "Ounces (oz)" },
    { value: "ton", label: "Tons" },
    { value: "fl_oz", label: "Fluid Ounces (fl oz)" },
    { value: "gal", label: "Gallons (gal)" },
    { value: "qt", label: "Quarts (qt)" },
    { value: "pt", label: "Pints (pt)" },
    { value: "cup", label: "Cups" },
    { value: "tbsp", label: "Tablespoons (tbsp)" },
    { value: "tsp", label: "Teaspoons (tsp)" }
  ];
  const departments = [
    "Convenience Store",
    "Fuel & Oil",
    "Automotive",
    "Food & Beverages",
    "Tobacco Products",
    "Lottery & Gaming",
    "Health & Personal Care",
    "Electronics & Accessories",
    "Cleaning Supplies",
    "Office Supplies",
    "Snacks & Candy",
    "Hot Foods & Coffee",
    "Cold Beverages",
    "Energy Drinks",
    "Beer & Wine",
    "Ice & Frozen",
    "Phone Cards & Prepaid",
    "Car Accessories",
    "Gift Cards",
    "Pharmacy & Medicine"
  ];
  reactExports.useEffect(() => {
    fetchVendors();
    fetchCategories();
    if (isEdit) {
      fetchProduct();
    } else {
      generateSerialNumber();
    }
  }, [id]);
  reactExports.useEffect(() => {
    if (formData.case_price > 0 && formData.unit_per_case > 0) {
      const calculatedUnitPrice = formData.case_price / formData.unit_per_case;
      setFormData((prev) => ({
        ...prev,
        unit_price: Math.round(calculatedUnitPrice * 100) / 100
      }));
    }
  }, [formData.case_price, formData.unit_per_case]);
  reactExports.useEffect(() => {
    if (formData.unit_price > 0) {
      const suggestedPrice = calculateSuggestedRetailPrice(formData.unit_price);
      if (formData.retail_price === 0) {
        setFormData((prev) => ({
          ...prev,
          retail_price: suggestedPrice
        }));
      }
    } else if (formData.unit_price === 0) {
      setFormData((prev) => ({
        ...prev,
        retail_price: 0
      }));
    }
  }, [formData.unit_price]);
  reactExports.useEffect(() => {
    if (formData.unit_price > 0 && formData.retail_price > 0) {
      const margin = (formData.retail_price - formData.unit_price) / formData.retail_price * 100;
      setFormData((prev) => ({
        ...prev,
        profit_margin: Math.round(margin * 100) / 100
      }));
    } else {
      setFormData((prev) => ({ ...prev, profit_margin: 0 }));
    }
  }, [formData.unit_price, formData.retail_price]);
  const fetchVendors = async () => {
    try {
      const { data, error } = await supabase.from("vendors").select("*").eq("is_active", true).order("vendor_name", { ascending: true }).limit(100);
      if (error) throw error;
      setVendors(data || []);
    } catch (error) {
      console.error("Error fetching vendors:", error);
    }
  };
  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase.from("product_categories").select("*").eq("is_active", true).order("category_name", { ascending: true }).limit(100);
      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  const generateSerialNumber = async () => {
    var _a;
    try {
      const { data, error } = await supabase.from("products").select("serial_number").order("serial_number", { ascending: false }).limit(1);
      if (error) throw error;
      const lastSerial = ((_a = data == null ? void 0 : data[0]) == null ? void 0 : _a.serial_number) || 0;
      setFormData((prev) => ({ ...prev, serial_number: lastSerial + 1 }));
    } catch (error) {
      console.error("Error generating serial number:", error);
      setFormData((prev) => ({ ...prev, serial_number: 1 }));
    }
  };
  const fetchProduct = async () => {
    var _a;
    if (!id) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from("products").select("*").eq("id", id).limit(1).single();
      if (error) throw error;
      if (data) {
        const product = data;
        const productData = {
          product_name: product.product_name || "",
          weight: product.weight || 0,
          weight_unit: product.weight_unit || "lb",
          department: product.department || "Convenience Store",
          merchant_id: ((_a = product.merchant_id) == null ? void 0 : _a.toString()) || "",
          last_updated_date: product.last_updated_date ? product.last_updated_date.split("T")[0] : "",
          last_shopping_date: product.last_shopping_date ? product.last_shopping_date.split("T")[0] : "",
          case_price: product.case_price || 0,
          unit_per_case: product.unit_per_case || 1,
          unit_price: product.unit_price || 0,
          retail_price: product.retail_price || 0,
          profit_margin: 0,
          // Will be calculated by useEffect
          category: product.category || "",
          supplier: product.supplier || "",
          quantity_in_stock: product.quantity_in_stock || 0,
          minimum_stock: product.minimum_stock || 0,
          description: product.description || "",
          bar_code_case: product.bar_code_case || "",
          bar_code_unit: product.bar_code_unit || "",
          serial_number: product.serial_number || 0,
          overdue: product.overdue || false
        };
        setFormData(productData);
        setOriginalData(productData);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      toast2({
        variant: "destructive",
        title: "Error",
        description: "Failed to load product data."
      });
    } finally {
      setIsLoading(false);
    }
  };
  const calculateSuggestedRetailPrice = (unitPrice) => {
    if (unitPrice === 0) return 0;
    let markupPercentage = 0;
    if (unitPrice < 4) {
      markupPercentage = 65;
    } else if (unitPrice >= 4 && unitPrice < 6) {
      markupPercentage = 55;
    } else if (unitPrice >= 6 && unitPrice < 8) {
      markupPercentage = 45;
    } else if (unitPrice >= 8 && unitPrice < 10) {
      markupPercentage = 35;
    } else {
      markupPercentage = 25;
    }
    const suggestedPrice = unitPrice * (1 + markupPercentage / 100);
    const roundingTargets = [0.25, 0.49, 0.75, 0.99];
    const wholeNumber = Math.floor(suggestedPrice);
    const decimal = suggestedPrice - wholeNumber;
    let closestRounding = 0.99;
    let minDifference = Math.abs(decimal - 0.99);
    roundingTargets.forEach((target) => {
      const difference = Math.abs(decimal - target);
      if (difference < minDifference) {
        minDifference = difference;
        closestRounding = target;
      }
    });
    return wholeNumber + closestRounding;
  };
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const handleBarcodeScanned = (field, barcode) => {
    setFormData((prev) => ({ ...prev, [field]: barcode }));
    toast2({
      title: "Barcode Scanned",
      description: `Barcode ${barcode} added to ${field.replace("_", " ")}`
    });
  };
  const handleBulkFileUpload = (event) => {
    var _a;
    const file = (_a = event.target.files) == null ? void 0 : _a[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      var _a2;
      try {
        const text = (_a2 = e.target) == null ? void 0 : _a2.result;
        const lines = text.split("\n").filter((line) => line.trim());
        const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
        const data = lines.slice(1).map((line, index) => {
          const values = line.split(",");
          const product = {};
          headers.forEach((header, i) => {
            var _a3;
            let value = ((_a3 = values[i]) == null ? void 0 : _a3.trim()) || "";
            const fieldMapping = {
              "product name": "product_name",
              "product_name": "product_name",
              "weight": "weight",
              "weight unit": "weight_unit",
              "weight_unit": "weight_unit",
              "department": "department",
              "merchant": "merchant_id",
              "merchant_id": "merchant_id",
              "last shopping date": "last_shopping_date",
              "last_shopping_date": "last_shopping_date",
              "case price": "case_price",
              "case_price": "case_price",
              "unit per case": "unit_per_case",
              "unit_per_case": "unit_per_case",
              "unit price": "unit_price",
              "unit_price": "unit_price",
              "retail price": "retail_price",
              "retail_price": "retail_price",
              "category": "category",
              "supplier": "supplier",
              "description": "description"
            };
            const dbField = fieldMapping[header] || header;
            if (["weight", "case_price", "unit_per_case", "unit_price", "retail_price", "merchant_id"].includes(dbField)) {
              value = value ? parseFloat(value) || 0 : 0;
            }
            product[dbField] = value;
          });
          if (product.case_price > 0 && product.unit_per_case > 0 && !product.unit_price) {
            product.unit_price = Math.round(product.case_price / product.unit_per_case * 100) / 100;
          }
          if (product.unit_price > 0 && !product.retail_price) {
            product.retail_price = calculateSuggestedRetailPrice(product.unit_price);
          }
          return product;
        });
        setBulkUploadData(data);
        setShowBulkPreview(true);
      } catch (error) {
        toast2({
          variant: "destructive",
          title: "Error",
          description: "Failed to parse CSV file. Please check the format."
        });
      }
    };
    reader.readAsText(file);
  };
  const handleBulkSubmit = async () => {
    var _a, _b, _c;
    if (!userProfile) {
      toast2({
        variant: "destructive",
        title: "Error",
        description: "User profile not found."
      });
      return;
    }
    setIsUploadingBulk(true);
    try {
      let successCount = 0;
      let errorCount = 0;
      const errors = [];
      const serialResponse = await supabase.from("products").select("serial_number").order("serial_number", { ascending: false }).limit(1);
      const lastSerial = ((_b = (_a = serialResponse.data) == null ? void 0 : _a[0]) == null ? void 0 : _b.serial_number) || 0;
      for (const productData of bulkUploadData) {
        try {
          if (!((_c = productData.product_name) == null ? void 0 : _c.trim())) {
            errors.push(`Row ${successCount + errorCount + 1}: Product name is required`);
            errorCount++;
            continue;
          }
          const productPayload = {
            serial_number: lastSerial + successCount + 1,
            product_name: productData.product_name.trim(),
            last_updated_date: (/* @__PURE__ */ new Date()).toISOString(),
            overdue: false,
            weight: productData.weight || 0,
            weight_unit: productData.weight_unit || "lb",
            department: productData.department || "Convenience Store",
            case_price: productData.case_price || 0,
            unit_per_case: productData.unit_per_case || 1,
            unit_price: productData.unit_price || 0,
            retail_price: productData.retail_price || 0,
            category: productData.category || "",
            supplier: productData.supplier || "",
            description: productData.description || "",
            quantity_in_stock: 0,
            minimum_stock: 0,
            bar_code_case: "",
            bar_code_unit: "",
            created_by: userProfile.user_id
          };
          if (productData.merchant_id) {
            productPayload.merchant_id = parseInt(productData.merchant_id);
          }
          if (productData.last_shopping_date) {
            productPayload.last_shopping_date = new Date(productData.last_shopping_date).toISOString();
          }
          const { error } = await supabase.from("products").insert(productPayload);
          if (error) {
            errors.push(`${productData.product_name}: ${error}`);
            errorCount++;
          } else {
            successCount++;
          }
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : "Unknown error";
          errors.push(`${productData.product_name || "Unknown"}: ${errorMsg}`);
          errorCount++;
        }
      }
      if (successCount > 0) {
        toast2({
          title: "Import Complete",
          description: `Successfully imported ${successCount} products. ${errorCount > 0 ? `${errorCount} errors occurred.` : ""}`
        });
      } else {
        toast2({
          variant: "destructive",
          title: "Import Failed",
          description: `No products were imported. ${errorCount} errors occurred.`
        });
      }
      if (errors.length > 0) {
        console.error("Import errors:", errors);
      }
      if (successCount > 0) {
        setShowBulkPreview(false);
        setBulkUploadData([]);
        navigate("/products");
      }
    } catch (error) {
      console.error("Bulk import error:", error);
      toast2({
        variant: "destructive",
        title: "Import Failed",
        description: error instanceof Error ? error.message : "Failed to import product data."
      });
    } finally {
      setIsUploadingBulk(false);
    }
  };
  const logFieldChange = async (productId, fieldName, oldValue, newValue, userId) => {
    try {
      const { error } = await supabase.from("product_field_changes").insert({
        product_id: productId,
        field_name: fieldName,
        old_value: (oldValue == null ? void 0 : oldValue.toString()) || "",
        new_value: (newValue == null ? void 0 : newValue.toString()) || "",
        change_date: (/* @__PURE__ */ new Date()).toISOString(),
        changed_by: userId
      });
      if (error) {
        console.error("Error logging field change:", error);
      }
    } catch (error) {
      console.error("Error logging field change:", error);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.product_name.trim()) {
      toast2({
        variant: "destructive",
        title: "Validation Error",
        description: "Product name is required."
      });
      return;
    }
    if (!userProfile) {
      toast2({
        variant: "destructive",
        title: "Error",
        description: "User profile not found."
      });
      return;
    }
    setIsLoading(true);
    try {
      const payload = {
        ...formData,
        last_updated_date: (/* @__PURE__ */ new Date()).toISOString(),
        last_shopping_date: formData.last_shopping_date ? new Date(formData.last_shopping_date).toISOString() : null,
        merchant_id: formData.merchant_id ? parseInt(formData.merchant_id) : null,
        created_by: userProfile.user_id
      };
      const { error } = isEdit ? await supabase.from("products").update(payload).eq("id", parseInt(id)) : await supabase.from("products").insert(payload);
      if (error) throw error;
      if (isEdit && originalData && userProfile) {
        const fieldsToTrack = [
          "last_shopping_date",
          "case_price",
          "unit_per_case",
          "unit_price",
          "retail_price"
        ];
        for (const field of fieldsToTrack) {
          const oldValue = originalData[field];
          const newValue = formData[field];
          if (oldValue !== newValue) {
            await logFieldChange(parseInt(id), field, oldValue, newValue, userProfile.user_id);
          }
        }
        const oldProfitMargin = originalData.unit_price > 0 && originalData.retail_price > 0 ? (originalData.retail_price - originalData.unit_price) / originalData.retail_price * 100 : 0;
        const newProfitMargin = formData.profit_margin;
        if (Math.abs(oldProfitMargin - newProfitMargin) > 0.01) {
          await logFieldChange(parseInt(id), "profit_margin", oldProfitMargin.toFixed(2), newProfitMargin.toFixed(2), userProfile.user_id);
        }
      }
      toast2({
        title: "Success",
        description: `Product ${isEdit ? "updated" : "created"} successfully.`
      });
      navigate("/products");
    } catch (error) {
      console.error("Error saving product:", error);
      toast2({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${isEdit ? "update" : "create"} product.`
      });
    } finally {
      setIsLoading(false);
    }
  };
  const suggestedRetailPrice = calculateSuggestedRetailPrice(formData.unit_price);
  const downloadTemplate = () => {
    const csvContent = [
      "Product Name,Weight,Weight Unit,Department,Merchant,Case Price,Unit Per Case,Unit Price,Retail Price,Category,Supplier,Description",
      "Example Product,12,oz,Food & Beverages,,24.00,24,1.00,1.99,Soft Drinks,Example Supplier,Example description"
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = "product_import_template.csv";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto p-6 space-y-6", "data-id": "bx12wklbd", "data-path": "src/pages/Products/ProductForm.tsx", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "q5k5t85tc", "data-path": "src/pages/Products/ProductForm.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-4", "data-id": "wlu98sixy", "data-path": "src/pages/Products/ProductForm.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: () => navigate("/products"), "data-id": "bdw35t5fy", "data-path": "src/pages/Products/ProductForm.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4 mr-2", "data-id": "rtvwkpjqu", "data-path": "src/pages/Products/ProductForm.tsx" }),
          "Back to Products"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "q5m983vey", "data-path": "src/pages/Products/ProductForm.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold", "data-id": "41gy26pq3", "data-path": "src/pages/Products/ProductForm.tsx", children: isEdit ? "Edit Product" : "Add New Product" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", "data-id": "h07pjygjz", "data-path": "src/pages/Products/ProductForm.tsx", children: isEdit ? "Update product information" : "Add a new product to your inventory" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open: showBulkPreview, onOpenChange: setShowBulkPreview, "data-id": "hi7kexvnf", "data-path": "src/pages/Products/ProductForm.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, "data-id": "93g6amn9o", "data-path": "src/pages/Products/ProductForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", "data-id": "uy4lxewlc", "data-path": "src/pages/Products/ProductForm.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-4 h-4 mr-2", "data-id": "h92678uku", "data-path": "src/pages/Products/ProductForm.tsx" }),
          "Bulk Upload"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-6xl max-h-[80vh] overflow-auto", "data-id": "0nz2kj64x", "data-path": "src/pages/Products/ProductForm.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { "data-id": "rmb9repv9", "data-path": "src/pages/Products/ProductForm.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { "data-id": "s0xq7459l", "data-path": "src/pages/Products/ProductForm.tsx", children: "Bulk Product Upload" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { "data-id": "hlbqg641c", "data-path": "src/pages/Products/ProductForm.tsx", children: 'Upload a CSV file with product data. Click "Download Template" for the correct format.' })
          ] }),
          bulkUploadData.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", "data-id": "otrmnjarm", "data-path": "src/pages/Products/ProductForm.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", "data-id": "jnbayeohh", "data-path": "src/pages/Products/ProductForm.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-medium", "data-id": "iflfxutqr", "data-path": "src/pages/Products/ProductForm.tsx", children: "Upload CSV File" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: downloadTemplate, "data-id": "7citiads7", "data-path": "src/pages/Products/ProductForm.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-4 h-4 mr-2", "data-id": "6gsm7c3h7", "data-path": "src/pages/Products/ProductForm.tsx" }),
                "Download Template"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-2 border-dashed border-gray-300 rounded-lg p-6 text-center", "data-id": "l6duwtega", "data-path": "src/pages/Products/ProductForm.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-12 h-12 mx-auto text-gray-400 mb-4", "data-id": "bvz7kpd58", "data-path": "src/pages/Products/ProductForm.tsx" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "xqwub2p94", "data-path": "src/pages/Products/ProductForm.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-medium", "data-id": "kjou9apny", "data-path": "src/pages/Products/ProductForm.tsx", children: "Upload CSV File" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500", "data-id": "3xwvpr12u", "data-path": "src/pages/Products/ProductForm.tsx", children: "Select a CSV file containing product data" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    type: "file",
                    accept: ".csv",
                    onChange: handleBulkFileUpload,
                    className: "max-w-xs mx-auto",
                    "data-id": "r8qynfi9q",
                    "data-path": "src/pages/Products/ProductForm.tsx"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-blue-50 border border-blue-200 rounded-lg p-4", "data-id": "3dwp5fzxb", "data-path": "src/pages/Products/ProductForm.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-medium text-blue-800 mb-2", "data-id": "u2zoncman", "data-path": "src/pages/Products/ProductForm.tsx", children: "Required Columns:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "text-sm text-blue-700 space-y-1", "data-id": "rhkwpjqrw", "data-path": "src/pages/Products/ProductForm.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { "data-id": "guya2pqun", "data-path": "src/pages/Products/ProductForm.tsx", children: "• Product Name (required)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { "data-id": "tgq6dgo04", "data-path": "src/pages/Products/ProductForm.tsx", children: "• Weight, Weight Unit, Department, Merchant" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { "data-id": "jvpyf8maa", "data-path": "src/pages/Products/ProductForm.tsx", children: "• Case Price, Unit Per Case, Unit Price, Retail Price" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { "data-id": "44pem9vcv", "data-path": "src/pages/Products/ProductForm.tsx", children: "• Category, Supplier, Description" })
              ] })
            ] })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", "data-id": "13jnbnr6s", "data-path": "src/pages/Products/ProductForm.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "vl7z3re82", "data-path": "src/pages/Products/ProductForm.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-lg font-medium", "data-id": "x7eodbrud", "data-path": "src/pages/Products/ProductForm.tsx", children: [
                "Preview Import Data (",
                bulkUploadData.length,
                " products)"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-x-2", "data-id": "spwy9543p", "data-path": "src/pages/Products/ProductForm.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => {
                  setBulkUploadData([]);
                  setShowBulkPreview(false);
                }, "data-id": "nf798ix7z", "data-path": "src/pages/Products/ProductForm.tsx", children: "Cancel" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handleBulkSubmit, disabled: isUploadingBulk, "data-id": "s0l90qs0w", "data-path": "src/pages/Products/ProductForm.tsx", children: isUploadingBulk ? "Importing..." : "Import Products" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border rounded-lg max-h-96 overflow-auto", "data-id": "8knn1mgms", "data-path": "src/pages/Products/ProductForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { "data-id": "p9k1dq6d0", "data-path": "src/pages/Products/ProductForm.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { "data-id": "1d31nj8tz", "data-path": "src/pages/Products/ProductForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { "data-id": "7ay0v18xb", "data-path": "src/pages/Products/ProductForm.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "3aba6dsmt", "data-path": "src/pages/Products/ProductForm.tsx", children: "Product Name" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "h7safkm9m", "data-path": "src/pages/Products/ProductForm.tsx", children: "Weight" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "fnhhv5m54", "data-path": "src/pages/Products/ProductForm.tsx", children: "Department" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "eoxwo0so8", "data-path": "src/pages/Products/ProductForm.tsx", children: "Case Price" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "lietay58u", "data-path": "src/pages/Products/ProductForm.tsx", children: "Unit Price" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "vob1mrzrz", "data-path": "src/pages/Products/ProductForm.tsx", children: "Retail Price" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "9qxs82bs8", "data-path": "src/pages/Products/ProductForm.tsx", children: "Profit %" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { "data-id": "nyr9xf477", "data-path": "src/pages/Products/ProductForm.tsx", children: bulkUploadData.map((product, index) => {
                var _a, _b, _c;
                const profit = product.unit_price > 0 && product.retail_price > 0 ? ((product.retail_price - product.unit_price) / product.retail_price * 100).toFixed(1) : "0";
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { "data-id": "0w8qpnjpw", "data-path": "src/pages/Products/ProductForm.tsx", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", "data-id": "ztfzojfdy", "data-path": "src/pages/Products/ProductForm.tsx", children: product.product_name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { "data-id": "qxwlle97c", "data-path": "src/pages/Products/ProductForm.tsx", children: [
                    product.weight,
                    " ",
                    product.weight_unit
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "nawb7vr9m", "data-path": "src/pages/Products/ProductForm.tsx", children: product.department }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { "data-id": "6ackpc71i", "data-path": "src/pages/Products/ProductForm.tsx", children: [
                    "$",
                    ((_a = product.case_price) == null ? void 0 : _a.toFixed(2)) || "0.00"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { "data-id": "ag0ksahtm", "data-path": "src/pages/Products/ProductForm.tsx", children: [
                    "$",
                    ((_b = product.unit_price) == null ? void 0 : _b.toFixed(2)) || "0.00"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { "data-id": "4yr04zme5", "data-path": "src/pages/Products/ProductForm.tsx", children: [
                    "$",
                    ((_c = product.retail_price) == null ? void 0 : _c.toFixed(2)) || "0.00"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "iecxknd33", "data-path": "src/pages/Products/ProductForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: parseFloat(profit) > 20 ? "default" : "secondary", "data-id": "kbs73ub5d", "data-path": "src/pages/Products/ProductForm.tsx", children: [
                    profit,
                    "%"
                  ] }) })
                ] }, index);
              }) })
            ] }) })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "ybi5y9x0t", "data-path": "src/pages/Products/ProductForm.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { "data-id": "c0sro9agp", "data-path": "src/pages/Products/ProductForm.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { "data-id": "yblpzeajq", "data-path": "src/pages/Products/ProductForm.tsx", children: isEdit ? "Edit Product" : "New Product" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { "data-id": "4snm2u3bc", "data-path": "src/pages/Products/ProductForm.tsx", children: isEdit ? "Update the product information below" : "Enter the product details below" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { "data-id": "9gdcuh4ed", "data-path": "src/pages/Products/ProductForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        FormErrorBoundary,
        {
          formName: "Product Form",
          showDataRecovery: true,
          onFormReset: () => {
            if (isEdit) {
              fetchProduct();
            } else {
              setFormData({
                product_name: "",
                weight: 0,
                weight_unit: "lb",
                department: "Convenience Store",
                merchant_id: "",
                last_updated_date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
                last_shopping_date: "",
                case_price: 0,
                unit_per_case: 1,
                unit_price: 0,
                retail_price: 0,
                profit_margin: 0,
                category: "",
                supplier: "",
                quantity_in_stock: 0,
                minimum_stock: 0,
                description: "",
                bar_code_case: "",
                bar_code_unit: "",
                serial_number: 0,
                overdue: false
              });
              generateSerialNumber();
            }
          },
          "data-id": "cktkquzxl",
          "data-path": "src/pages/Products/ProductForm.tsx",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", "data-id": "b47e9aqag", "data-path": "src/pages/Products/ProductForm.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", "data-id": "xjmwfhyiz", "data-path": "src/pages/Products/ProductForm.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "kglmcicue", "data-path": "src/pages/Products/ProductForm.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "product_name", "data-id": "phoq35hdt", "data-path": "src/pages/Products/ProductForm.tsx", children: "Product Name *" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "product_name",
                    placeholder: "Enter product name",
                    value: formData.product_name,
                    onChange: (e) => handleInputChange("product_name", e.target.value),
                    required: true,
                    "data-id": "rjrlm6qa7",
                    "data-path": "src/pages/Products/ProductForm.tsx"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "5wnmbfxgz", "data-path": "src/pages/Products/ProductForm.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "category", "data-id": "4rvslpa8b", "data-path": "src/pages/Products/ProductForm.tsx", children: "Category" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Select,
                  {
                    value: formData.category,
                    onValueChange: (value) => handleInputChange("category", value),
                    "data-id": "cj8kg9x7v",
                    "data-path": "src/pages/Products/ProductForm.tsx",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-id": "h53ofq07e", "data-path": "src/pages/Products/ProductForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select category", "data-id": "lt19useuz", "data-path": "src/pages/Products/ProductForm.tsx" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { "data-id": "tu1fli4s7", "data-path": "src/pages/Products/ProductForm.tsx", children: categories.map(
                        (cat) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: cat.category_name, "data-id": "dxg4exzsk", "data-path": "src/pages/Products/ProductForm.tsx", children: cat.category_name }, cat.id)
                      ) })
                    ]
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", "data-id": "kcclizqrd", "data-path": "src/pages/Products/ProductForm.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "rbfly9jkc", "data-path": "src/pages/Products/ProductForm.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "weight", "data-id": "5kewfxhrq", "data-path": "src/pages/Products/ProductForm.tsx", children: "Weight" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  NumberInput,
                  {
                    id: "weight",
                    step: 0.01,
                    min: 0,
                    value: formData.weight,
                    onChange: (value) => handleInputChange("weight", value),
                    "data-id": "ntm2991pu",
                    "data-path": "src/pages/Products/ProductForm.tsx"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "dpy100zkt", "data-path": "src/pages/Products/ProductForm.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "weight_unit", "data-id": "lmhazo1o2", "data-path": "src/pages/Products/ProductForm.tsx", children: "Weight Unit (USA Measurements)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Select,
                  {
                    value: formData.weight_unit,
                    onValueChange: (value) => handleInputChange("weight_unit", value),
                    "data-id": "ykhzxj6ot",
                    "data-path": "src/pages/Products/ProductForm.tsx",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-id": "ibo0fui0o", "data-path": "src/pages/Products/ProductForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select unit", "data-id": "wikid8ydq", "data-path": "src/pages/Products/ProductForm.tsx" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { "data-id": "o46bsqe2q", "data-path": "src/pages/Products/ProductForm.tsx", children: weightUnits.map(
                        (unit) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: unit.value, "data-id": "vr3gmqpg9", "data-path": "src/pages/Products/ProductForm.tsx", children: unit.label }, unit.value)
                      ) })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", "data-id": "ilqscfzlv", "data-path": "src/pages/Products/ProductForm.tsx", children: [
                  "Combined: ",
                  formData.weight,
                  " ",
                  formData.weight_unit
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "qsxt1su8b", "data-path": "src/pages/Products/ProductForm.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "department", "data-id": "ui00cry10", "data-path": "src/pages/Products/ProductForm.tsx", children: "Department" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Select,
                  {
                    value: formData.department,
                    onValueChange: (value) => handleInputChange("department", value),
                    "data-id": "9e5cpkg0a",
                    "data-path": "src/pages/Products/ProductForm.tsx",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-id": "o17mjjiz5", "data-path": "src/pages/Products/ProductForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select department", "data-id": "onct4n5nl", "data-path": "src/pages/Products/ProductForm.tsx" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { "data-id": "5w12yqkd7", "data-path": "src/pages/Products/ProductForm.tsx", children: departments.map(
                        (dept) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: dept, "data-id": "f42auxyjl", "data-path": "src/pages/Products/ProductForm.tsx", children: dept }, dept)
                      ) })
                    ]
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", "data-id": "8ev602vbv", "data-path": "src/pages/Products/ProductForm.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "2a4vpkma2", "data-path": "src/pages/Products/ProductForm.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "merchant_id", "data-id": "lyuaqm4jk", "data-path": "src/pages/Products/ProductForm.tsx", children: "Merchant" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Select,
                  {
                    value: formData.merchant_id,
                    onValueChange: (value) => handleInputChange("merchant_id", value),
                    "data-id": "07ewjpxem",
                    "data-path": "src/pages/Products/ProductForm.tsx",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-id": "r6bhwqo6v", "data-path": "src/pages/Products/ProductForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select merchant", "data-id": "gcgdwhskz", "data-path": "src/pages/Products/ProductForm.tsx" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { "data-id": "stxcuz9bv", "data-path": "src/pages/Products/ProductForm.tsx", children: vendors.map(
                        (vendor) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: vendor.id.toString(), "data-id": "8t00h2uci", "data-path": "src/pages/Products/ProductForm.tsx", children: vendor.vendor_name }, vendor.id)
                      ) })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "7xotykfm4", "data-path": "src/pages/Products/ProductForm.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "last_updated_date", "data-id": "d4wo4tj5g", "data-path": "src/pages/Products/ProductForm.tsx", children: "Last Updated Date" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "last_updated_date",
                    type: "date",
                    value: formData.last_updated_date,
                    onChange: (e) => handleInputChange("last_updated_date", e.target.value),
                    "data-id": "afigj8q8r",
                    "data-path": "src/pages/Products/ProductForm.tsx"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "joc9bnqgp", "data-path": "src/pages/Products/ProductForm.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "last_shopping_date", "data-id": "nfkbcc485", "data-path": "src/pages/Products/ProductForm.tsx", children: "Last Shopping Date" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "last_shopping_date",
                    type: "date",
                    value: formData.last_shopping_date,
                    onChange: (e) => handleInputChange("last_shopping_date", e.target.value),
                    "data-id": "4brvqnedm",
                    "data-path": "src/pages/Products/ProductForm.tsx"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { "data-id": "9o0gwbwwq", "data-path": "src/pages/Products/ProductForm.tsx" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", "data-id": "wbwknuhfy", "data-path": "src/pages/Products/ProductForm.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-medium", "data-id": "yu7bdekm3", "data-path": "src/pages/Products/ProductForm.tsx", children: "Pricing Information" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", "data-id": "iwqed2cq2", "data-path": "src/pages/Products/ProductForm.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "h13mzseq5", "data-path": "src/pages/Products/ProductForm.tsx", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "case_price", "data-id": "3yq7lv3rt", "data-path": "src/pages/Products/ProductForm.tsx", children: "Case Price ($)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    NumberInput,
                    {
                      id: "case_price",
                      step: 0.01,
                      min: 0,
                      value: formData.case_price,
                      onChange: (value) => handleInputChange("case_price", value),
                      "data-id": "8lif39lep",
                      "data-path": "src/pages/Products/ProductForm.tsx"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "8ilbz7re9", "data-path": "src/pages/Products/ProductForm.tsx", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "unit_per_case", "data-id": "lu93lxaue", "data-path": "src/pages/Products/ProductForm.tsx", children: "Unit Per Case" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    NumberInput,
                    {
                      id: "unit_per_case",
                      min: 1,
                      value: formData.unit_per_case,
                      onChange: (value) => handleInputChange("unit_per_case", value),
                      "data-id": "xpreug7g1",
                      "data-path": "src/pages/Products/ProductForm.tsx"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "sqleu9w7o", "data-path": "src/pages/Products/ProductForm.tsx", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "unit_price", "data-id": "bw3hnk8lw", "data-path": "src/pages/Products/ProductForm.tsx", children: "Unit Price ($)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    NumberInput,
                    {
                      id: "unit_price",
                      step: 0.01,
                      min: 0,
                      value: formData.unit_price,
                      onChange: (value) => handleInputChange("unit_price", value),
                      "data-id": "bhjy2741g",
                      "data-path": "src/pages/Products/ProductForm.tsx"
                    }
                  ),
                  formData.case_price > 0 && formData.unit_per_case > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-green-600 flex items-center", "data-id": "mig3drq7h", "data-path": "src/pages/Products/ProductForm.tsx", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Calculator, { className: "w-3 h-3 mr-1", "data-id": "9wwkfvxsf", "data-path": "src/pages/Products/ProductForm.tsx" }),
                    "Auto-calculated from case price"
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", "data-id": "7szavq7wt", "data-path": "src/pages/Products/ProductForm.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "s44v0bd4c", "data-path": "src/pages/Products/ProductForm.tsx", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "retail_price", "data-id": "sw3slkr61", "data-path": "src/pages/Products/ProductForm.tsx", children: "Retail Price ($)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    NumberInput,
                    {
                      id: "retail_price",
                      step: 0.01,
                      min: 0,
                      value: formData.retail_price,
                      onChange: (value) => handleInputChange("retail_price", value),
                      "data-id": "nhp6pvirq",
                      "data-path": "src/pages/Products/ProductForm.tsx"
                    }
                  ),
                  formData.unit_price > 0 && Math.abs(formData.retail_price - suggestedRetailPrice) < 0.01 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-green-600 flex items-center", "data-id": "c6694zlow", "data-path": "src/pages/Products/ProductForm.tsx", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Calculator, { className: "w-3 h-3 mr-1", "data-id": "7j2ylnx8a", "data-path": "src/pages/Products/ProductForm.tsx" }),
                    "Auto-calculated from unit price"
                  ] }),
                  formData.unit_price > 0 && Math.abs(formData.retail_price - suggestedRetailPrice) >= 0.01 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 p-3 bg-red-50 border border-red-200 rounded-lg", "data-id": "7ggtw6coy", "data-path": "src/pages/Products/ProductForm.tsx", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "ggamngcao", "data-path": "src/pages/Products/ProductForm.tsx", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", "data-id": "1l6080zer", "data-path": "src/pages/Products/ProductForm.tsx", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "w-4 h-4 text-red-600", "data-id": "r1rmqer56", "data-path": "src/pages/Products/ProductForm.tsx" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-medium text-red-800", "data-id": "hs4p8lfhn", "data-path": "src/pages/Products/ProductForm.tsx", children: [
                          "Suggested: $",
                          suggestedRetailPrice.toFixed(2)
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          type: "button",
                          size: "sm",
                          variant: "outline",
                          onClick: () => handleInputChange("retail_price", suggestedRetailPrice),
                          className: "text-xs h-6 px-2",
                          "data-id": "rhpckr8hc",
                          "data-path": "src/pages/Products/ProductForm.tsx",
                          children: "Apply"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-red-700 mt-1", "data-id": "on56s08f2", "data-path": "src/pages/Products/ProductForm.tsx", children: [
                      formData.unit_price < 4 ? "+65%" : formData.unit_price < 6 ? "+55%" : formData.unit_price < 8 ? "+45%" : formData.unit_price < 10 ? "+35%" : "+25%",
                      " markup, rounded to .25/.49/.75/.99"
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "orczwe7jq", "data-path": "src/pages/Products/ProductForm.tsx", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "profit_margin", "data-id": "sq9xzux3z", "data-path": "src/pages/Products/ProductForm.tsx", children: "Profit Margin (%)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", "data-id": "jf7rutm1u", "data-path": "src/pages/Products/ProductForm.tsx", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      NumberInput,
                      {
                        id: "profit_margin",
                        step: 0.01,
                        value: formData.profit_margin,
                        disabled: true,
                        className: "bg-muted",
                        "data-id": "uiwlfbodg",
                        "data-path": "src/pages/Products/ProductForm.tsx"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: formData.profit_margin > 20 ? "default" : "secondary", "data-id": "3fkohoku4", "data-path": "src/pages/Products/ProductForm.tsx", children: formData.profit_margin > 20 ? "Good" : "Low" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", "data-id": "p6l0gv7lg", "data-path": "src/pages/Products/ProductForm.tsx", children: "Auto-calculated from unit and retail price" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { "data-id": "rqx6u6vw5", "data-path": "src/pages/Products/ProductForm.tsx" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", "data-id": "rpa5p141o", "data-path": "src/pages/Products/ProductForm.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-medium", "data-id": "kkeqlckhp", "data-path": "src/pages/Products/ProductForm.tsx", children: "Additional Information" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", "data-id": "t1uth5etf", "data-path": "src/pages/Products/ProductForm.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "br0f51o36", "data-path": "src/pages/Products/ProductForm.tsx", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "supplier", "data-id": "nwezqijbs", "data-path": "src/pages/Products/ProductForm.tsx", children: "Supplier" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "supplier",
                      placeholder: "Enter supplier name",
                      value: formData.supplier,
                      onChange: (e) => handleInputChange("supplier", e.target.value),
                      "data-id": "txymx9tx5",
                      "data-path": "src/pages/Products/ProductForm.tsx"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "9x4r9yo2t", "data-path": "src/pages/Products/ProductForm.tsx", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { "data-id": "2f1u5b9f8", "data-path": "src/pages/Products/ProductForm.tsx", children: "Stock Information" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", "data-id": "qa7poz02u", "data-path": "src/pages/Products/ProductForm.tsx", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      NumberInput,
                      {
                        placeholder: "Current Stock",
                        value: formData.quantity_in_stock,
                        onChange: (value) => handleInputChange("quantity_in_stock", value),
                        min: 0,
                        "data-id": "aizhy7ulb",
                        "data-path": "src/pages/Products/ProductForm.tsx"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      NumberInput,
                      {
                        placeholder: "Min Stock",
                        value: formData.minimum_stock,
                        onChange: (value) => handleInputChange("minimum_stock", value),
                        min: 0,
                        "data-id": "dckcsjdop",
                        "data-path": "src/pages/Products/ProductForm.tsx"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", "data-id": "hbdkhswsk", "data-path": "src/pages/Products/ProductForm.tsx", children: "Current stock / Minimum stock level" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "i6cs0n1a2", "data-path": "src/pages/Products/ProductForm.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "description", "data-id": "vr0yez4f7", "data-path": "src/pages/Products/ProductForm.tsx", children: "Description" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Textarea,
                  {
                    id: "description",
                    placeholder: "Enter product description",
                    rows: 4,
                    value: formData.description,
                    onChange: (e) => handleInputChange("description", e.target.value),
                    "data-id": "pi8xzw20m",
                    "data-path": "src/pages/Products/ProductForm.tsx"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", "data-id": "bcdeqdoq5", "data-path": "src/pages/Products/ProductForm.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "00ykzf331", "data-path": "src/pages/Products/ProductForm.tsx", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "bar_code_case", "data-id": "sx2pox7kt", "data-path": "src/pages/Products/ProductForm.tsx", children: "Barcode (Case)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex space-x-2", "data-id": "6ri7xrix9", "data-path": "src/pages/Products/ProductForm.tsx", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        id: "bar_code_case",
                        placeholder: "Scan or enter case barcode",
                        value: formData.bar_code_case,
                        onChange: (e) => handleInputChange("bar_code_case", e.target.value),
                        "data-id": "bzbisylmd",
                        "data-path": "src/pages/Products/ProductForm.tsx"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      BarcodeScanner,
                      {
                        onScanned: (barcode) => handleBarcodeScanned("bar_code_case", barcode),
                        "data-id": "98bp73w7a",
                        "data-path": "src/pages/Products/ProductForm.tsx"
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "x7tmyo56s", "data-path": "src/pages/Products/ProductForm.tsx", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "bar_code_unit", "data-id": "hdxeaxie5", "data-path": "src/pages/Products/ProductForm.tsx", children: "Barcode (Unit)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex space-x-2", "data-id": "s3j3g1f3f", "data-path": "src/pages/Products/ProductForm.tsx", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        id: "bar_code_unit",
                        placeholder: "Scan or enter unit barcode",
                        value: formData.bar_code_unit,
                        onChange: (e) => handleInputChange("bar_code_unit", e.target.value),
                        "data-id": "5irm9j9k9",
                        "data-path": "src/pages/Products/ProductForm.tsx"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      BarcodeScanner,
                      {
                        onScanned: (barcode) => handleBarcodeScanned("bar_code_unit", barcode),
                        "data-id": "eshdnhw4l",
                        "data-path": "src/pages/Products/ProductForm.tsx"
                      }
                    )
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end space-x-4 pt-6", "data-id": "2pgb4f3ov", "data-path": "src/pages/Products/ProductForm.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: () => navigate("/products"), "data-id": "t2fbqbrwk", "data-path": "src/pages/Products/ProductForm.tsx", children: "Cancel" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", disabled: isLoading, "data-id": "fp7m4hvvp", "data-path": "src/pages/Products/ProductForm.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-4 h-4 mr-2", "data-id": "e2dbj22gs", "data-path": "src/pages/Products/ProductForm.tsx" }),
                isLoading ? "Saving..." : isEdit ? "Update Product" : "Create Product"
              ] })
            ] })
          ] })
        }
      ) })
    ] })
  ] });
};
const ProductForm$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ProductForm
}, Symbol.toStringTag, { value: "Module" }));
const ViewModal = ({
  isOpen,
  onClose,
  title,
  data,
  fields,
  onEdit,
  onDelete,
  onExport,
  canEdit = true,
  canDelete = true,
  canExport = true,
  loading = false,
  subtitle
}) => {
  const formatValue = (field) => {
    const { value, type } = field;
    if (value === null || value === void 0 || value === "") {
      return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-400", "data-id": "eg4d7pspi", "data-path": "src/components/ViewModal.tsx", children: "N/A" });
    }
    switch (type) {
      case "date":
        return new Date(value).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric"
        });
      case "currency":
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD"
        }).format(value);
      case "badge":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          Badge,
          {
            className: `${field.badgeColor || "bg-gray-500"} text-white`,
            "data-id": "x906u9mra",
            "data-path": "src/components/ViewModal.tsx",
            children: value
          }
        );
      case "email":
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "a",
          {
            href: `mailto:${value}`,
            className: "text-blue-600 hover:underline flex items-center space-x-1",
            "data-id": "a6iub5ee0",
            "data-path": "src/components/ViewModal.tsx",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "w-3 h-3", "data-id": "dc7d4hhek", "data-path": "src/components/ViewModal.tsx" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "q2mydccuf", "data-path": "src/components/ViewModal.tsx", children: value })
            ]
          }
        );
      case "phone":
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "a",
          {
            href: `tel:${value}`,
            className: "text-blue-600 hover:underline flex items-center space-x-1",
            "data-id": "nuhsy37sj",
            "data-path": "src/components/ViewModal.tsx",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "w-3 h-3", "data-id": "qb6guqeq8", "data-path": "src/components/ViewModal.tsx" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "kuqiof57c", "data-path": "src/components/ViewModal.tsx", children: value })
            ]
          }
        );
      case "boolean":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: value ? "default" : "secondary", "data-id": "gegcyesci", "data-path": "src/components/ViewModal.tsx", children: value ? "Yes" : "No" });
      case "number":
        return typeof value === "number" ? value.toLocaleString() : value;
      default:
        return String(value);
    }
  };
  const getFieldIcon = (field) => {
    if (field.icon) {
      const IconComponent = field.icon;
      return /* @__PURE__ */ jsxRuntimeExports.jsx(IconComponent, { className: "w-4 h-4 text-gray-500", "data-id": "pxwmzj6nq", "data-path": "src/components/ViewModal.tsx" });
    }
    switch (field.type) {
      case "date":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-4 h-4 text-gray-500", "data-id": "dx5da2ui8", "data-path": "src/components/ViewModal.tsx" });
      case "currency":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "w-4 h-4 text-gray-500", "data-id": "jzu89y4zl", "data-path": "src/components/ViewModal.tsx" });
      case "email":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "w-4 h-4 text-gray-500", "data-id": "0i8lnaxzb", "data-path": "src/components/ViewModal.tsx" });
      case "phone":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "w-4 h-4 text-gray-500", "data-id": "xyddvflg4", "data-path": "src/components/ViewModal.tsx" });
      default:
        return /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-4 h-4 text-gray-500", "data-id": "pqgnw3oti", "data-path": "src/components/ViewModal.tsx" });
    }
  };
  const visibleFields = fields.filter((field) => !field.hidden);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: isOpen, onOpenChange: onClose, "data-id": "1spnnfehd", "data-path": "src/components/ViewModal.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContent, { className: "max-w-2xl max-h-[90vh] overflow-hidden", "data-id": "r1s13gxmf", "data-path": "src/components/ViewModal.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { "data-id": "wjg0rodt6", "data-path": "src/components/ViewModal.tsx", children: isOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.95 },
      transition: { duration: 0.2 },
      "data-id": "n2suiat6z",
      "data-path": "src/components/ViewModal.tsx",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { className: "border-b pb-4", "data-id": "wfsnqaelc", "data-path": "src/components/ViewModal.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "40v0f6g4j", "data-path": "src/components/ViewModal.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", "data-id": "xf7xssves", "data-path": "src/components/ViewModal.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-6 h-6 text-blue-600", "data-id": "7p8dsmser", "data-path": "src/components/ViewModal.tsx" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "ffnn5txeq", "data-path": "src/components/ViewModal.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-xl font-bold", "data-id": "z10ds52c0", "data-path": "src/components/ViewModal.tsx", children: title }),
              subtitle && /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "mt-1", "data-id": "7h176hhe6", "data-path": "src/components/ViewModal.tsx", children: subtitle })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "sm",
              onClick: onClose,
              className: "text-gray-500 hover:text-gray-700",
              "data-id": "1kk88evz3",
              "data-path": "src/components/ViewModal.tsx",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4", "data-id": "l153o3qwv", "data-path": "src/components/ViewModal.tsx" })
            }
          )
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "max-h-[60vh] pr-4", "data-id": "dovhg5kd3", "data-path": "src/components/ViewModal.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6 py-6", "data-id": "pzk5e66gg", "data-path": "src/components/ViewModal.tsx", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", "data-id": "xoc9k096b", "data-path": "src/components/ViewModal.tsx", children: [...Array(6)].map(
          (_, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-3", "data-id": "waffhsdc4", "data-path": "src/components/ViewModal.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-4 h-4 bg-gray-200 rounded animate-pulse", "data-id": "jze120wre", "data-path": "src/components/ViewModal.tsx" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-2", "data-id": "zx7j8jama", "data-path": "src/components/ViewModal.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 bg-gray-200 rounded w-24 animate-pulse", "data-id": "pgiq21q7q", "data-path": "src/components/ViewModal.tsx" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 bg-gray-100 rounded w-32 animate-pulse", "data-id": "onb16hh3y", "data-path": "src/components/ViewModal.tsx" })
            ] })
          ] }, i)
        ) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", "data-id": "bus93rbed", "data-path": "src/components/ViewModal.tsx", children: visibleFields.map(
          (field, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: index * 0.05 },
              className: "space-y-2",
              "data-id": "e8kod921q",
              "data-path": "src/components/ViewModal.tsx",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", "data-id": "c55w3f9sk", "data-path": "src/components/ViewModal.tsx", children: [
                  getFieldIcon(field),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-gray-700", "data-id": "i51xxegnw", "data-path": "src/components/ViewModal.tsx", children: field.label })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pl-6", "data-id": "mmioapncn", "data-path": "src/components/ViewModal.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-gray-900 font-medium", "data-id": "q8epzn863", "data-path": "src/components/ViewModal.tsx", children: formatValue(field) }) })
              ]
            },
            field.key
          )
        ) }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { "data-id": "8en97nf9r", "data-path": "src/components/ViewModal.tsx" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between pt-4", "data-id": "zj0zae8gw", "data-path": "src/components/ViewModal.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2 text-xs text-gray-500", "data-id": "60mtn8uht", "data-path": "src/components/ViewModal.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3", "data-id": "2iydpgvpt", "data-path": "src/components/ViewModal.tsx" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "rnxol4sol", "data-path": "src/components/ViewModal.tsx", children: "Press V to view, E to edit, D to delete" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", "data-id": "hz3keznwy", "data-path": "src/components/ViewModal.tsx", children: [
            canExport && onExport && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: onExport,
                className: "flex items-center space-x-1",
                "data-id": "tdzl6c1z6",
                "data-path": "src/components/ViewModal.tsx",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-4 h-4", "data-id": "iiabd4w3u", "data-path": "src/components/ViewModal.tsx" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "pmwmm87qj", "data-path": "src/components/ViewModal.tsx", children: "Export" })
                ]
              }
            ),
            canDelete && onDelete && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: onDelete,
                className: "text-red-600 hover:text-red-700 flex items-center space-x-1",
                "data-id": "zo2fpqdnl",
                "data-path": "src/components/ViewModal.tsx",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4", "data-id": "30b0dyce0", "data-path": "src/components/ViewModal.tsx" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "e7h8yctkf", "data-path": "src/components/ViewModal.tsx", children: "Delete" })
                ]
              }
            ),
            canEdit && onEdit && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                onClick: onEdit,
                className: "flex items-center space-x-1",
                "data-id": "wx4xo3akr",
                "data-path": "src/components/ViewModal.tsx",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { className: "w-4 h-4", "data-id": "rx53i1y98", "data-path": "src/components/ViewModal.tsx" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "m4yvovp8c", "data-path": "src/components/ViewModal.tsx", children: "Edit" })
                ]
              }
            )
          ] })
        ] })
      ]
    }
  ) }) }) });
};
const useKeyboardShortcuts = (shortcuts) => {
  const handleKeyDown = reactExports.useCallback((event) => {
    const target = event.target;
    if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
      return;
    }
    const activeShortcut = shortcuts.find((shortcut) => {
      if (shortcut.disabled) return false;
      return event.key.toLowerCase() === shortcut.key.toLowerCase() && Boolean(event.ctrlKey) === Boolean(shortcut.ctrlKey) && Boolean(event.altKey) === Boolean(shortcut.altKey) && Boolean(event.shiftKey) === Boolean(shortcut.shiftKey);
    });
    if (activeShortcut) {
      event.preventDefault();
      activeShortcut.callback();
    }
  }, [shortcuts]);
  reactExports.useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);
};
const useListKeyboardShortcuts = (selectedId, onView, onEdit, onDelete, onCreate) => {
  const shortcuts = [
    {
      key: "v",
      callback: () => selectedId && onView(selectedId),
      disabled: !selectedId
    },
    {
      key: "e",
      callback: () => selectedId && onEdit(selectedId),
      disabled: !selectedId
    },
    {
      key: "d",
      callback: () => selectedId && onDelete(selectedId),
      disabled: !selectedId
    },
    {
      key: "n",
      ctrlKey: true,
      callback: onCreate
    }
  ];
  useKeyboardShortcuts(shortcuts);
};
const isImageFile = (file) => {
  return file.type.startsWith("image/");
};
const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};
const createCanvas = (width, height) => {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
};
const calculateDimensions = (originalWidth, originalHeight, maxWidthOrHeight) => {
  if (!maxWidthOrHeight || originalWidth <= maxWidthOrHeight && originalHeight <= maxWidthOrHeight) {
    return { width: originalWidth, height: originalHeight };
  }
  const aspectRatio = originalWidth / originalHeight;
  if (originalWidth > originalHeight) {
    return {
      width: maxWidthOrHeight,
      height: Math.round(maxWidthOrHeight / aspectRatio)
    };
  } else {
    return {
      width: Math.round(maxWidthOrHeight * aspectRatio),
      height: maxWidthOrHeight
    };
  }
};
const loadImage = (file) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(file);
  });
};
const compressImageWithCanvas = (img, options) => {
  return new Promise((resolve, reject) => {
    const { width, height } = calculateDimensions(
      img.naturalWidth,
      img.naturalHeight,
      options.maxWidthOrHeight
    );
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      reject(new Error("Could not get canvas context"));
      return;
    }
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, 0, 0, width, height);
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Failed to compress image"));
        }
      },
      "image/jpeg",
      options.quality || 0.8
    );
  });
};
const compressToTargetSize = async (img, targetSizeMB, options) => {
  let quality = options.initialQuality || 0.8;
  let blob;
  let attempts = 0;
  const maxAttempts = 10;
  const targetSizeBytes = targetSizeMB * 1024 * 1024;
  do {
    blob = await compressImageWithCanvas(img, { ...options, quality });
    if (blob.size <= targetSizeBytes || attempts >= maxAttempts) {
      break;
    }
    quality = Math.max(0.1, quality - 0.1);
    attempts++;
  } while (attempts < maxAttempts);
  return blob;
};
const getCompressionSettings = () => {
  try {
    const saved = localStorage.getItem("imageCompressionSettings");
    if (saved) {
      const settings = JSON.parse(saved);
      return {
        maxSizeMB: settings.maxSizeMB || 1,
        maxWidthOrHeight: settings.maxResolution || 1920,
        quality: settings.quality || 0.8,
        initialQuality: settings.quality || 0.8,
        useWebWorker: false,
        alwaysKeepResolution: false
      };
    }
  } catch (error) {
    console.error("Failed to load compression settings:", error);
  }
  return {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    quality: 0.8,
    initialQuality: 0.8,
    useWebWorker: false,
    alwaysKeepResolution: false
  };
};
const isCompressionEnabled = () => {
  try {
    const saved = localStorage.getItem("imageCompressionSettings");
    if (saved) {
      const settings = JSON.parse(saved);
      return settings.enabled !== false;
    }
  } catch (error) {
    console.error("Failed to load compression settings:", error);
  }
  return true;
};
const compressImage = async (file, options) => {
  const savedSettings = getCompressionSettings();
  const finalOptions = { ...savedSettings, ...options };
  const originalSize = file.size;
  const targetSizeMB = finalOptions.maxSizeMB;
  const targetSizeBytes = targetSizeMB * 1024 * 1024;
  if (!isCompressionEnabled()) {
    return {
      file,
      originalSize,
      compressedSize: originalSize,
      compressionRatio: 1,
      wasCompressed: false
    };
  }
  if (!isImageFile(file)) {
    return {
      file,
      originalSize,
      compressedSize: originalSize,
      compressionRatio: 1,
      wasCompressed: false
    };
  }
  const autoCompress = (() => {
    try {
      const saved = localStorage.getItem("imageCompressionSettings");
      return saved ? JSON.parse(saved).autoCompress : false;
    } catch {
      return false;
    }
  })();
  if (!autoCompress && originalSize <= targetSizeBytes) {
    return {
      file,
      originalSize,
      compressedSize: originalSize,
      compressionRatio: 1,
      wasCompressed: false
    };
  }
  try {
    const img = await loadImage(file);
    const compressedBlob = await compressToTargetSize(img, targetSizeMB, finalOptions);
    const compressedFile = new File(
      [compressedBlob],
      file.name.replace(/\.[^/.]+$/, ".jpg"),
      // Change extension to jpg
      {
        type: "image/jpeg",
        lastModified: Date.now()
      }
    );
    const compressedSize = compressedFile.size;
    const compressionRatio = originalSize / compressedSize;
    URL.revokeObjectURL(img.src);
    return {
      file: compressedFile,
      originalSize,
      compressedSize,
      compressionRatio,
      wasCompressed: true
    };
  } catch (error) {
    console.error("Image compression failed:", error);
    return {
      file,
      originalSize,
      compressedSize: originalSize,
      compressionRatio: 1,
      wasCompressed: false
    };
  }
};
const EnhancedFileUpload = ({
  onFileSelect,
  accept = "image/*",
  label = "Upload File",
  currentFile,
  maxSize = 10,
  className = "",
  disabled = false,
  allowCamera = true
}) => {
  const [isOpen, setIsOpen] = reactExports.useState(false);
  const [showCamera, setShowCamera] = reactExports.useState(false);
  const [cameraStream, setCameraStream] = reactExports.useState(null);
  const [capturedImage, setCapturedImage] = reactExports.useState(null);
  const [isCameraLoading, setIsCameraLoading] = reactExports.useState(false);
  const [isCompressing, setIsCompressing] = reactExports.useState(false);
  const [compressionResult, setCompressionResult] = reactExports.useState(null);
  const fileInputRef = reactExports.useRef(null);
  const videoRef = reactExports.useRef(null);
  const canvasRef = reactExports.useRef(null);
  const { toast: toast2 } = useToast();
  const isImageUpload = accept.includes("image");
  const shouldShowCamera = allowCamera && isImageUpload;
  const validateFile = (file) => {
    if (file.size > maxSize * 1024 * 1024) {
      toast2({
        title: "File too large",
        description: `File size must be less than ${maxSize}MB`,
        variant: "destructive"
      });
      return false;
    }
    if (accept && accept !== "*/*") {
      const acceptedTypes = accept.split(",").map((type) => type.trim());
      const isAccepted = acceptedTypes.some((type) => {
        if (type.startsWith(".")) {
          return file.name.toLowerCase().endsWith(type.toLowerCase());
        } else if (type.includes("*")) {
          const baseType = type.split("/")[0];
          return file.type.startsWith(baseType);
        } else {
          return file.type === type;
        }
      });
      if (!isAccepted) {
        toast2({
          title: "Invalid file type",
          description: `Please select a file of type: ${accept}`,
          variant: "destructive"
        });
        return false;
      }
    }
    return true;
  };
  const processFile = async (file) => {
    const needsCompression = isImageFile(file) && file.size > 1024 * 1024;
    if (needsCompression) {
      setIsCompressing(true);
      try {
        const result = await compressImage(file, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          quality: 0.8,
          initialQuality: 0.8
        });
        setCompressionResult(result);
        if (result.wasCompressed) {
          toast2({
            title: "Image compressed",
            description: `File size reduced from ${formatFileSize(result.originalSize)} to ${formatFileSize(result.compressedSize)} (${result.compressionRatio.toFixed(1)}x smaller)`,
            duration: 5e3
          });
        }
        onFileSelect(result.file);
        setIsOpen(false);
      } catch (error) {
        console.error("Compression failed:", error);
        toast2({
          title: "Compression failed",
          description: "Using original file instead",
          variant: "destructive"
        });
        onFileSelect(file);
        setIsOpen(false);
      } finally {
        setIsCompressing(false);
      }
    } else {
      onFileSelect(file);
      setIsOpen(false);
      toast2({
        title: "File selected",
        description: `${file.name} has been selected successfully`
      });
    }
  };
  const handleFileSelect = async (event) => {
    var _a;
    const file = (_a = event.target.files) == null ? void 0 : _a[0];
    if (file && validateFile(file)) {
      await processFile(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  const startCamera = async () => {
    setIsCameraLoading(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          facingMode: "environment"
          // Use back camera on mobile if available
        }
      });
      setCameraStream(stream);
      setShowCamera(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast2({
        title: "Camera access denied",
        description: "Please allow camera access to take photos",
        variant: "destructive"
      });
    } finally {
      setIsCameraLoading(false);
    }
  };
  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setShowCamera(false);
    setCapturedImage(null);
  };
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        const imageDataUrl = canvas.toDataURL("image/jpeg", 0.8);
        setCapturedImage(imageDataUrl);
      }
    }
  };
  const confirmCapture = async () => {
    if (capturedImage && canvasRef.current) {
      canvasRef.current.toBlob(async (blob) => {
        if (blob) {
          const file = new File([blob], `captured-${Date.now()}.jpg`, {
            type: "image/jpeg"
          });
          if (validateFile(file)) {
            stopCamera();
            await processFile(file);
            toast2({
              title: "Photo captured",
              description: "Photo has been captured successfully"
            });
          }
        }
      }, "image/jpeg", 0.8);
    }
  };
  const retakePhoto = () => {
    setCapturedImage(null);
  };
  const closeDialog = () => {
    stopCamera();
    setIsOpen(false);
  };
  const getFileIcon = () => {
    if (isImageUpload) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Image$1, { className: "h-4 w-4", "data-id": "s00ni63sv", "data-path": "src/components/EnhancedFileUpload.tsx" });
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-4 w-4", "data-id": "qshbpzxgb", "data-path": "src/components/EnhancedFileUpload.tsx" });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className, "data-id": "28a897lqr", "data-path": "src/components/EnhancedFileUpload.tsx", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open: isOpen, onOpenChange: setIsOpen, "data-id": "bepxqjckf", "data-path": "src/components/EnhancedFileUpload.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, "data-id": "z3faij0d2", "data-path": "src/components/EnhancedFileUpload.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          disabled,
          className: "w-full flex items-center gap-2",
          "data-id": "t1rspq6qi",
          "data-path": "src/components/EnhancedFileUpload.tsx",
          children: [
            getFileIcon(),
            label
          ]
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-2xl max-h-[90vh] overflow-y-auto", "data-id": "9mn6e0kph", "data-path": "src/components/EnhancedFileUpload.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { "data-id": "bt6bnsl33", "data-path": "src/components/EnhancedFileUpload.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2", "data-id": "t8cim5qfq", "data-path": "src/components/EnhancedFileUpload.tsx", children: [
          getFileIcon(),
          label
        ] }) }),
        !showCamera ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", "data-id": "ajndwulj2", "data-path": "src/components/EnhancedFileUpload.tsx", children: [
          currentFile && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-id": "6a3smxs3r", "data-path": "src/components/EnhancedFileUpload.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4", "data-id": "pd6aksu51", "data-path": "src/components/EnhancedFileUpload.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "i6hki4rpq", "data-path": "src/components/EnhancedFileUpload.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-gray-600", "data-id": "szbtuxohh", "data-path": "src/components/EnhancedFileUpload.tsx", children: "Current file:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", "data-id": "iae45fgy2", "data-path": "src/components/EnhancedFileUpload.tsx", children: currentFile })
          ] }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", "data-id": "r9vlqzkb6", "data-path": "src/components/EnhancedFileUpload.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "cursor-pointer hover:bg-gray-50 transition-colors", "data-id": "h91w96m2g", "data-path": "src/components/EnhancedFileUpload.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-6", "data-id": "otelxb92x", "data-path": "src/components/EnhancedFileUpload.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "ghost",
                className: "w-full h-auto p-0 flex flex-col items-center gap-3",
                onClick: () => {
                  var _a;
                  return (_a = fileInputRef.current) == null ? void 0 : _a.click();
                },
                "data-id": "ge5fl7cm8",
                "data-path": "src/components/EnhancedFileUpload.tsx",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 bg-blue-100 rounded-full", "data-id": "beki9ayfi", "data-path": "src/components/EnhancedFileUpload.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-8 w-8 text-blue-600", "data-id": "uovt8mj4f", "data-path": "src/components/EnhancedFileUpload.tsx" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", "data-id": "vjfu6smw8", "data-path": "src/components/EnhancedFileUpload.tsx", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold", "data-id": "25bza49x8", "data-path": "src/components/EnhancedFileUpload.tsx", children: "Upload From File" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500 mt-1", "data-id": "escx2h8bs", "data-path": "src/components/EnhancedFileUpload.tsx", children: "Choose a file from your device" })
                  ] })
                ]
              }
            ) }) }),
            shouldShowCamera && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "cursor-pointer hover:bg-gray-50 transition-colors", "data-id": "afan0j4jm", "data-path": "src/components/EnhancedFileUpload.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-6", "data-id": "imwm0gy0s", "data-path": "src/components/EnhancedFileUpload.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "ghost",
                className: "w-full h-auto p-0 flex flex-col items-center gap-3",
                onClick: startCamera,
                disabled: isCameraLoading,
                "data-id": "b85cnn2vi",
                "data-path": "src/components/EnhancedFileUpload.tsx",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 bg-green-100 rounded-full", "data-id": "lnix4ai1o", "data-path": "src/components/EnhancedFileUpload.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "h-8 w-8 text-green-600", "data-id": "tncve2dth", "data-path": "src/components/EnhancedFileUpload.tsx" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", "data-id": "ebsr6zrgi", "data-path": "src/components/EnhancedFileUpload.tsx", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold", "data-id": "kzmlckl5i", "data-path": "src/components/EnhancedFileUpload.tsx", children: "Take A Picture" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500 mt-1", "data-id": "54zw6iu52", "data-path": "src/components/EnhancedFileUpload.tsx", children: isCameraLoading ? "Loading camera..." : "Use your camera to capture" })
                  ] })
                ]
              }
            ) }) })
          ] }),
          isCompressing && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-blue-200 bg-blue-50", "data-id": "orgi2knzb", "data-path": "src/components/EnhancedFileUpload.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4", "data-id": "u3nhnobw1", "data-path": "src/components/EnhancedFileUpload.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", "data-id": "w58roef90", "data-path": "src/components/EnhancedFileUpload.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin text-blue-600", "data-id": "3bbqg8m6o", "data-path": "src/components/EnhancedFileUpload.tsx" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "lzgckt22h", "data-path": "src/components/EnhancedFileUpload.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-blue-800", "data-id": "jbnh98nc2", "data-path": "src/components/EnhancedFileUpload.tsx", children: "Compressing image..." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-blue-600", "data-id": "jjwtng8jt", "data-path": "src/components/EnhancedFileUpload.tsx", children: "Optimizing file size for better performance" })
            ] })
          ] }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center text-sm text-gray-500", "data-id": "72b9ko7qb", "data-path": "src/components/EnhancedFileUpload.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { "data-id": "j5om62lms", "data-path": "src/components/EnhancedFileUpload.tsx", children: [
              "Accepted file types: ",
              accept
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { "data-id": "frapsjolz", "data-path": "src/components/EnhancedFileUpload.tsx", children: [
              "Maximum file size: ",
              maxSize,
              "MB"
            ] }),
            isImageFile({ type: accept }) && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 p-2 bg-green-50 rounded-lg border border-green-200", "data-id": "d6e1rbnh5", "data-path": "src/components/EnhancedFileUpload.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2 text-green-700", "data-id": "58uwv7s4q", "data-path": "src/components/EnhancedFileUpload.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-4 w-4", "data-id": "eowz576wz", "data-path": "src/components/EnhancedFileUpload.tsx" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium", "data-id": "b7ml71nrw", "data-path": "src/components/EnhancedFileUpload.tsx", children: "Auto-compression enabled for images >1MB" })
            ] }) })
          ] })
        ] }) : (
          /* Camera interface */
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", "data-id": "e9h50j0qb", "data-path": "src/components/EnhancedFileUpload.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "yjfg4olcu", "data-path": "src/components/EnhancedFileUpload.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold", "data-id": "wavuww0ah", "data-path": "src/components/EnhancedFileUpload.tsx", children: "Camera" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", onClick: closeDialog, "data-id": "2pefry38n", "data-path": "src/components/EnhancedFileUpload.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4", "data-id": "4lgdm8ags", "data-path": "src/components/EnhancedFileUpload.tsx" }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative bg-black rounded-lg overflow-hidden", "data-id": "l1bwqp81w", "data-path": "src/components/EnhancedFileUpload.tsx", children: [
              !capturedImage ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "video",
                {
                  ref: videoRef,
                  autoPlay: true,
                  playsInline: true,
                  className: "w-full h-64 md:h-96 object-cover",
                  "data-id": "v9u3clu7c",
                  "data-path": "src/components/EnhancedFileUpload.tsx"
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: capturedImage,
                  alt: "Captured",
                  className: "w-full h-64 md:h-96 object-cover",
                  "data-id": "5if3pxpxy",
                  "data-path": "src/components/EnhancedFileUpload.tsx"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("canvas", { ref: canvasRef, className: "hidden", "data-id": "tlhxi398w", "data-path": "src/components/EnhancedFileUpload.tsx" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center gap-4", "data-id": "6yfmmbhry", "data-path": "src/components/EnhancedFileUpload.tsx", children: !capturedImage ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: capturePhoto, className: "flex items-center gap-2", "data-id": "2ei8u6uhx", "data-path": "src/components/EnhancedFileUpload.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "h-4 w-4", "data-id": "gy6hdxk3j", "data-path": "src/components/EnhancedFileUpload.tsx" }),
                "Capture"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: stopCamera, "data-id": "18j6yyzci", "data-path": "src/components/EnhancedFileUpload.tsx", children: "Cancel" })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: confirmCapture, className: "flex items-center gap-2", "data-id": "ayvxnzku1", "data-path": "src/components/EnhancedFileUpload.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4", "data-id": "tfsxgolu8", "data-path": "src/components/EnhancedFileUpload.tsx" }),
                "Use This Photo"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: retakePhoto, className: "flex items-center gap-2", "data-id": "dbatyj76m", "data-path": "src/components/EnhancedFileUpload.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "h-4 w-4", "data-id": "3u9t16jif", "data-path": "src/components/EnhancedFileUpload.tsx" }),
                "Retake"
              ] })
            ] }) })
          ] })
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        ref: fileInputRef,
        type: "file",
        accept,
        onChange: handleFileSelect,
        className: "hidden",
        "data-id": "y897ysif0",
        "data-path": "src/components/EnhancedFileUpload.tsx"
      }
    )
  ] });
};
const EnhancedSalesReportPrintDialog = ({
  open,
  onOpenChange,
  report
}) => {
  if (!report) return null;
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(amount || 0);
  };
  const formatNumber = (num) => {
    return (num || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };
  const getStationBadgeColor = (station) => {
    switch (station.toUpperCase()) {
      case "MOBIL":
        return "bg-red-500 text-white";
      case "AMOCO ROSEDALE":
        return "bg-blue-500 text-white";
      case "AMOCO BROOKLYN":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };
  const expenses = report.expenses_data ? JSON.parse(report.expenses_data) : [];
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const cashExpenses = expenses.filter((e) => e.paymentType === "Cash").reduce((sum, expense) => sum + expense.amount, 0);
  const cardExpenses = expenses.filter((e) => e.paymentType === "Credit Card").reduce((sum, expense) => sum + expense.amount, 0);
  const chequeExpenses = expenses.filter((e) => e.paymentType === "Cheque").reduce((sum, expense) => sum + expense.amount, 0);
  const totalPaymentMethods = report.credit_card_amount + report.debit_card_amount + report.mobile_amount + report.cash_amount;
  report.regular_gallons + report.super_gallons + report.diesel_gallons;
  const isPaymentBalanced = Math.abs(totalPaymentMethods - report.total_sales) <= 0.01;
  const isCashBalanced = Math.abs(report.total_short_over) <= 1;
  const handlePrint = () => {
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Enhanced Sales Report - ${report.station} - ${formatDate(report.report_date)}</title>
          <style>
            @page {
              size: A4;
              margin: 0.5in;
            }
            body {
              font-family: 'Arial', sans-serif;
              margin: 0;
              padding: 0;
              color: #333;
              line-height: 1.4;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 3px solid #2563eb;
              padding-bottom: 20px;
            }
            .company-logo {
              font-size: 28px;
              font-weight: bold;
              color: #1e40af;
              margin-bottom: 5px;
            }
            .report-title {
              font-size: 20px;
              color: #374151;
              margin-bottom: 10px;
            }
            .report-meta {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 20px;
              background: #f8fafc;
              padding: 15px;
              border-radius: 8px;
              margin-bottom: 25px;
            }
            .meta-item {
              text-align: center;
            }
            .meta-label {
              font-size: 12px;
              color: #6b7280;
              text-transform: uppercase;
              font-weight: 600;
            }
            .meta-value {
              font-size: 14px;
              font-weight: bold;
              margin-top: 5px;
            }
            .station-badge {
              display: inline-block;
              padding: 4px 12px;
              border-radius: 20px;
              color: white;
              font-size: 12px;
              font-weight: 600;
            }
            .section {
              margin-bottom: 25px;
              break-inside: avoid;
            }
            .section-header {
              display: flex;
              align-items: center;
              margin-bottom: 15px;
              padding-bottom: 10px;
              border-bottom: 2px solid #e5e7eb;
            }
            .section-icon {
              margin-right: 10px;
              color: #2563eb;
            }
            .section-title {
              font-size: 18px;
              font-weight: bold;
              color: #1f2937;
            }
            .data-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 15px;
            }
            .data-card {
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              padding: 15px;
              background: #ffffff;
            }
            .data-label {
              font-size: 12px;
              color: #6b7280;
              text-transform: uppercase;
              font-weight: 600;
              margin-bottom: 5px;
            }
            .data-value {
              font-size: 16px;
              font-weight: bold;
              color: #1f2937;
            }
            .currency {
              color: #059669;
            }
            .gallons {
              color: #2563eb;
            }
            .summary-card {
              background: linear-gradient(135deg, #3b82f6, #1d4ed8);
              color: white;
              padding: 20px;
              border-radius: 10px;
              margin: 20px 0;
            }
            .summary-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 20px;
              text-align: center;
            }
            .summary-amount {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 5px;
            }
            .summary-label {
              font-size: 12px;
              opacity: 0.9;
            }
            .expenses-table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
            }
            .expenses-table th,
            .expenses-table td {
              padding: 10px;
              text-align: left;
              border-bottom: 1px solid #e5e7eb;
            }
            .expenses-table th {
              background: #f3f4f6;
              font-weight: 600;
              font-size: 12px;
              text-transform: uppercase;
            }
            .verification-section {
              background: #f0fdf4;
              border: 2px solid #10b981;
              border-radius: 8px;
              padding: 20px;
              margin: 20px 0;
            }
            .verification-failed {
              background: #fef2f2;
              border-color: #ef4444;
            }
            .verification-item {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 10px;
            }
            .check-passed {
              color: #059669;
              font-weight: bold;
            }
            .check-failed {
              color: #dc2626;
              font-weight: bold;
            }
            .footer {
              margin-top: 40px;
              text-align: center;
              font-size: 11px;
              color: #6b7280;
              border-top: 1px solid #e5e7eb;
              padding-top: 20px;
            }
            .notes-section {
              background: #fffbeb;
              border-left: 4px solid #f59e0b;
              padding: 15px;
              margin: 20px 0;
            }
            @media print {
              body { font-size: 11pt; }
              .section { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-logo">DFS Manager Portal</div>
            <div class="report-title">Daily Sales Report - Enhanced</div>
          </div>

          <div class="report-meta">
            <div class="meta-item">
              <div class="meta-label">Report Date</div>
              <div class="meta-value">${formatDate(report.report_date)}</div>
            </div>
            <div class="meta-item">
              <div class="meta-label">Station</div>
              <div class="meta-value">
                <span class="station-badge" style="background: ${report.station === "MOBIL" ? "#ef4444" : report.station === "AMOCO ROSEDALE" ? "#3b82f6" : "#10b981"}">${report.station}</span>
              </div>
            </div>
            <div class="meta-item">
              <div class="meta-label">Employee</div>
              <div class="meta-value">${report.employee_name}</div>
            </div>
          </div>

          <div class="summary-card">
            <div class="summary-grid">
              <div>
                <div class="summary-amount">${formatCurrency(report.total_sales)}</div>
                <div class="summary-label">Total Sales</div>
              </div>
              <div>
                <div class="summary-amount">${formatNumber(report.total_gallons)} gal</div>
                <div class="summary-label">Total Gallons</div>
              </div>
              <div>
                <div class="summary-amount">${formatCurrency(report.lottery_total_cash)}</div>
                <div class="summary-label">Lottery Sales</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-header">
              <span class="section-icon">💰</span>
              <span class="section-title">Cash Collection & Balance</span>
            </div>
            <div class="data-grid">
              <div class="data-card">
                <div class="data-label">Cash on Hand</div>
                <div class="data-value currency">${formatCurrency(report.cash_collection_on_hand)}</div>
              </div>
              <div class="data-card">
                <div class="data-label">Short/Over</div>
                <div class="data-value ${report.total_short_over >= 0 ? "check-passed" : "check-failed"}">${formatCurrency(report.total_short_over)}</div>
              </div>
              <div class="data-card">
                <div class="data-label">Cash Sales</div>
                <div class="data-value currency">${formatCurrency(report.cash_amount)}</div>
              </div>
              <div class="data-card">
                <div class="data-label">Cash Expenses</div>
                <div class="data-value currency">${formatCurrency(cashExpenses)}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-header">
              <span class="section-icon">💳</span>
              <span class="section-title">Payment Methods</span>
            </div>
            <div class="data-grid">
              <div class="data-card">
                <div class="data-label">Credit Card</div>
                <div class="data-value currency">${formatCurrency(report.credit_card_amount)}</div>
              </div>
              <div class="data-card">
                <div class="data-label">Debit Card</div>
                <div class="data-value currency">${formatCurrency(report.debit_card_amount)}</div>
              </div>
              <div class="data-card">
                <div class="data-label">Mobile Payments</div>
                <div class="data-value currency">${formatCurrency(report.mobile_amount)}</div>
              </div>
              <div class="data-card">
                <div class="data-label">Cash Payments</div>
                <div class="data-value currency">${formatCurrency(report.cash_amount)}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-header">
              <span class="section-icon">⛽</span>
              <span class="section-title">Fuel Sales</span>
            </div>
            <div class="data-grid">
              <div class="data-card">
                <div class="data-label">Regular Gallons</div>
                <div class="data-value gallons">${formatNumber(report.regular_gallons)} gal</div>
              </div>
              <div class="data-card">
                <div class="data-label">Super Gallons</div>
                <div class="data-value gallons">${formatNumber(report.super_gallons)} gal</div>
              </div>
              <div class="data-card">
                <div class="data-label">Diesel Gallons</div>
                <div class="data-value gallons">${formatNumber(report.diesel_gallons)} gal</div>
              </div>
              <div class="data-card">
                <div class="data-label">Total Gallons</div>
                <div class="data-value gallons">${formatNumber(report.total_gallons)} gal</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-header">
              <span class="section-icon">🛒</span>
              <span class="section-title">Store Sales</span>
            </div>
            <div class="data-grid">
              <div class="data-card">
                <div class="data-label">Grocery Sales</div>
                <div class="data-value currency">${formatCurrency(report.grocery_sales)}</div>
              </div>
              ${report.station === "MOBIL" ? `
              <div class="data-card">
                <div class="data-label">EBT Sales</div>
                <div class="data-value currency">${formatCurrency(report.ebt_sales)}</div>
              </div>
              ` : ""}
              <div class="data-card">
                <div class="data-label">Lottery Net Sales</div>
                <div class="data-value currency">${formatCurrency(report.lottery_net_sales)}</div>
              </div>
              <div class="data-card">
                <div class="data-label">Scratch-off Sales</div>
                <div class="data-value currency">${formatCurrency(report.scratch_off_sales)}</div>
              </div>
            </div>
          </div>

          ${expenses.length > 0 ? `
          <div class="section">
            <div class="section-header">
              <span class="section-icon">📋</span>
              <span class="section-title">Expenses (${expenses.length} items)</span>
            </div>
            <table class="expenses-table">
              <thead>
                <tr>
                  <th>Vendor</th>
                  <th>Amount</th>
                  <th>Payment Method</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                ${expenses.map((expense) => `
                <tr>
                  <td>${expense.vendorName}</td>
                  <td>${formatCurrency(expense.amount)}</td>
                  <td>${expense.paymentType}${expense.chequeNo ? ` (#${expense.chequeNo})` : ""}</td>
                  <td>${expense.notes || "-"}</td>
                </tr>
                `).join("")}
              </tbody>
            </table>
            <div class="data-grid" style="margin-top: 15px;">
              <div class="data-card">
                <div class="data-label">Total Expenses</div>
                <div class="data-value currency">${formatCurrency(totalExpenses)}</div>
              </div>
              <div class="data-card">
                <div class="data-label">Cash Expenses</div>
                <div class="data-value currency">${formatCurrency(cashExpenses)}</div>
              </div>
              <div class="data-card">
                <div class="data-label">Card Expenses</div>
                <div class="data-value currency">${formatCurrency(cardExpenses)}</div>
              </div>
              <div class="data-card">
                <div class="data-label">Cheque Expenses</div>
                <div class="data-value currency">${formatCurrency(chequeExpenses)}</div>
              </div>
            </div>
          </div>
          ` : ""}

          <div class="verification-section ${isPaymentBalanced && isCashBalanced ? "" : "verification-failed"}">
            <div class="section-header">
              <span class="section-icon">✓</span>
              <span class="section-title">Report Verification</span>
            </div>
            <div class="verification-item">
              <span>Payment Methods Balance:</span>
              <span class="${isPaymentBalanced ? "check-passed" : "check-failed"}">
                ${isPaymentBalanced ? "✓ Balanced" : `⚠️ Discrepancy: ${formatCurrency(Math.abs(totalPaymentMethods - report.total_sales))}`}
              </span>
            </div>
            <div class="verification-item">
              <span>Cash Balance (Short/Over):</span>
              <span class="${isCashBalanced ? "check-passed" : "check-failed"}">
                ${isCashBalanced ? "✓ Within tolerance" : "⚠️ Outside tolerance"}
              </span>
            </div>
            <div class="verification-item">
              <span>Documents Uploaded:</span>
              <span class="check-passed">✓ All Required</span>
            </div>
          </div>

          ${report.notes ? `
          <div class="notes-section">
            <div class="section-header">
              <span class="section-icon">📝</span>
              <span class="section-title">Additional Notes</span>
            </div>
            <p style="margin: 0; white-space: pre-wrap;">${report.notes}</p>
          </div>
          ` : ""}

          <div class="footer">
            <div>Report ID: #${report.ID} | Generated on ${(/* @__PURE__ */ new Date()).toLocaleString()}</div>
            <div>Created by User #${report.created_by} | DFS Manager Portal v2.0</div>
            <div style="margin-top: 10px; font-style: italic;">
              This is an official business document. Please retain for your records.
            </div>
          </div>
        </body>
      </html>
    `;
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, "data-id": "nfj0bspmm", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-7xl max-h-[95vh] overflow-y-auto", "data-id": "pju3yrhmm", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { "data-id": "vpu48sxl6", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "k4vwk334t", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2", "data-id": "ru8r52y45", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Receipt, { className: "h-5 w-5 text-blue-600", "data-id": "ily78v8qn", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx" }),
        "Enhanced Sales Report - ",
        report.station
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          onClick: handlePrint,
          variant: "outline",
          size: "sm",
          className: "flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50",
          "data-id": "knargsigk",
          "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "h-4 w-4", "data-id": "zci1fq4z3", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx" }),
            "Print Full Report"
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-id": "0cftv8qde", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200", "data-id": "wafqznfno", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "n2puxr7rb", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "wqp9vhh1u", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "v3rl3w8bo", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-blue-800", "data-id": "jq4c5c71y", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: formatDate(report.report_date) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-2", "data-id": "geuzwol9x", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: getStationBadgeColor(report.station), "data-id": "u8s6xxnkx", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: report.station }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-gray-600", "data-id": "gbpj1fde4", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: [
              "Employee: ",
              report.employee_name
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", "data-id": "ku6flmdww", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-blue-800", "data-id": "a5quco9ty", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: formatCurrency(report.total_sales) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-gray-600", "data-id": "9h66fakkx", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: "Total Sales" })
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", "data-id": "ipp9ha9ym", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-id": "ve5ee45n4", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 text-center", "data-id": "epp3wvo1k", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "h-8 w-8 mx-auto text-green-600 mb-2", "data-id": "quyh8i9vf", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-green-600", "data-id": "ztahfbnjv", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: formatCurrency(report.total_sales) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-gray-600", "data-id": "hd6lhsbbq", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: "Total Sales" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-id": "6l9eceytc", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 text-center", "data-id": "jqgxhgdsy", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Fuel, { className: "h-8 w-8 mx-auto text-blue-600 mb-2", "data-id": "7cwhbzkvx", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-blue-600", "data-id": "f3mbsg5p8", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: formatNumber(report.total_gallons) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-gray-600", "data-id": "pxrx3ujd9", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: "Total Gallons" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-id": "7ml55fuhf", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 text-center", "data-id": "fp2rkckpa", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-8 w-8 mx-auto text-purple-600 mb-2", "data-id": "t3tj5ah3c", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-purple-600", "data-id": "qztmkcdzn", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: formatCurrency(report.lottery_total_cash) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-gray-600", "data-id": "xkhhehqu5", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: "Lottery Sales" })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: `border-2 ${isPaymentBalanced && isCashBalanced ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`, "data-id": "yonatv9o0", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "ph413d7va", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "flex items-center gap-2", "data-id": "g44n89d25", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: isPaymentBalanced && isCashBalanced ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-green-600", "data-id": "evujsuleq", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: "✓ Report Verified" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-red-600 flex items-center gap-2", "data-id": "ezfpec1at", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-5 w-5", "data-id": "k8np7ku99", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx" }),
          "Discrepancies Found"
        ] }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { "data-id": "bxrtcl1bt", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", "data-id": "uggeiu1ua", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", "data-id": "xun580ajb", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "lb1djuicf", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: "Payment Balance:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: isPaymentBalanced ? "text-green-600 font-medium" : "text-red-600 font-medium", "data-id": "jyzbc4wsa", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: isPaymentBalanced ? "✓ Balanced" : `⚠️ ${formatCurrency(Math.abs(totalPaymentMethods - report.total_sales))} difference` })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", "data-id": "3htawnd8a", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "c5wrnmb96", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: "Cash Balance:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: isCashBalanced ? "text-green-600 font-medium" : "text-red-600 font-medium", "data-id": "s27d5hiua", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: isCashBalanced ? "✓ Within tolerance" : `⚠️ ${formatCurrency(Math.abs(report.total_short_over))}` })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", "data-id": "zm6phqnq5", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "6vjvntzmi", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "yd2hay199", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm", "data-id": "mdncwt5bg", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: "Payment Methods" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-2", "data-id": "rnlkfky6t", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", "data-id": "5kiw0cffh", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "uq7yftxit", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: "Credit Card:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", "data-id": "m1w2bucdj", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: formatCurrency(report.credit_card_amount) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", "data-id": "7pfl0pad1", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "vrowmjj96", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: "Debit Card:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", "data-id": "e9384xopw", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: formatCurrency(report.debit_card_amount) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", "data-id": "hgo5jgcpp", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "b3cmlzlen", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: "Mobile:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", "data-id": "hcxmxwq92", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: formatCurrency(report.mobile_amount) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", "data-id": "u8davm9nb", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "mdp95mn7b", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: "Cash:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", "data-id": "imzy6eti5", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: formatCurrency(report.cash_amount) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "995ium6hf", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "95azghl4t", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm", "data-id": "1drzyvdrx", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: "Fuel Sales" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-2", "data-id": "cxk952tzb", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", "data-id": "ixgho7yu2", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "t04ygl85d", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: "Regular:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium", "data-id": "0r9obj3kd", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: [
                formatNumber(report.regular_gallons),
                " gal"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", "data-id": "ygxm5n5o0", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "qq1hay5mi", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: "Super:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium", "data-id": "iok2uxfh3", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: [
                formatNumber(report.super_gallons),
                " gal"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", "data-id": "9qvy027aq", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "csry1th5t", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: "Diesel:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium", "data-id": "jhguveiaf", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: [
                formatNumber(report.diesel_gallons),
                " gal"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { "data-id": "1wwyi9zs3", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm font-semibold", "data-id": "pnkruv9no", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "tdz95txu0", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: "Total:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { "data-id": "okq4sa0hd", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: [
                formatNumber(report.total_gallons),
                " gal"
              ] })
            ] })
          ] })
        ] })
      ] }),
      expenses.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "jo0zxphib", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "mhekh4qxd", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm", "data-id": "m1dglqmbt", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: [
          "Expenses (",
          expenses.length,
          " items) - Total: ",
          formatCurrency(totalExpenses)
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { "data-id": "zqfo7t6vc", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-gray-600", "data-id": "452isskjj", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: [
          "Cash: ",
          formatCurrency(cashExpenses),
          " | Card: ",
          formatCurrency(cardExpenses),
          " | Cheque: ",
          formatCurrency(chequeExpenses)
        ] }) })
      ] }),
      report.notes && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "6ozt88tiq", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "pax6f5d1c", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm", "data-id": "5ubnz8k8x", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: "Notes" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { "data-id": "4innb06fb", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-700 whitespace-pre-wrap", "data-id": "pze0mggyz", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: report.notes }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "flex justify-end space-x-2", "data-id": "z0cn5ze7j", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: () => onOpenChange(false), "data-id": "mc7j3xzqp", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4 mr-2", "data-id": "1zpfwaice", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx" }),
        "Close"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: handlePrint, className: "bg-blue-600 hover:bg-blue-700", "data-id": "h0261p2to", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "w-4 h-4 mr-2", "data-id": "y6xoebs66", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx" }),
        "Print Full Report"
      ] })
    ] })
  ] }) });
};
const SalesReportList = () => {
  const [reports, setReports] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [searchTerm, setSearchTerm] = reactExports.useState("");
  const [currentPage, setCurrentPage] = reactExports.useState(1);
  const [totalCount, setTotalCount] = reactExports.useState(0);
  const [printDialogOpen, setPrintDialogOpen] = reactExports.useState(false);
  const [selectedReport, setSelectedReport] = reactExports.useState(null);
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const pageSize = 10;
  reactExports.useEffect(() => {
    loadReports();
  }, [currentPage, searchTerm]);
  const loadReports = async () => {
    try {
      setLoading(true);
      let query = supabase.from("daily_sales_reports_enhanced").select("*", { count: "exact" }).order("report_date", { ascending: false });
      if (searchTerm) {
        query = query.ilike("station", `%${searchTerm}%`);
      }
      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);
      const { data, count, error } = await query;
      if (error) throw error;
      setReports(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error("Error loading sales reports:", error);
      toast({
        title: "Error",
        description: "Failed to load sales reports",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (reportId) => {
    if (!confirm("Are you sure you want to delete this sales report?")) {
      return;
    }
    try {
      const { error } = await supabase.from("daily_sales_reports_enhanced").delete().eq("id", reportId);
      if (error) throw error;
      toast({
        title: "Success",
        description: "Sales report deleted successfully"
      });
      loadReports();
    } catch (error) {
      console.error("Error deleting sales report:", error);
      toast({
        title: "Error",
        description: "Failed to delete sales report",
        variant: "destructive"
      });
    }
  };
  const handlePrint = (report) => {
    setSelectedReport(report);
    setPrintDialogOpen(true);
  };
  const isAdmin = (userProfile == null ? void 0 : userProfile.role) === "Administrator";
  const canAddReport = (userProfile == null ? void 0 : userProfile.role) === "Employee" || (userProfile == null ? void 0 : userProfile.role) === "Administrator";
  const getStationBadgeColor = (station) => {
    switch (station.toUpperCase()) {
      case "MOBIL":
        return "bg-blue-500";
      case "AMOCO ROSEDALE":
        return "bg-green-500";
      case "AMOCO BROOKLYN":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(amount);
  };
  const totalPages = Math.ceil(totalCount / pageSize);
  const totals = reports.reduce((acc, report) => {
    const totalSales = report.total_sales || 0;
    const cashAmount = report.cash_amount || 0;
    const creditCardAmount = report.credit_card_amount || 0;
    const debitCardAmount = report.debit_card_amount || 0;
    const mobileAmount = report.mobile_amount || 0;
    const grocerySales = report.grocery_sales || 0;
    const totalGallons = report.total_gallons || 0;
    const lotteryTotalCash = report.lottery_total_cash || 0;
    const paymentTotal = cashAmount + creditCardAmount + debitCardAmount + mobileAmount;
    if (Math.abs(paymentTotal + grocerySales - totalSales) > 0.01) {
      console.warn(`Report ID ${report.ID}: Payment methods + grocery (${paymentTotal + grocerySales}) don't match total (${totalSales})`);
    }
    return {
      total_sales: acc.total_sales + totalSales,
      cash_amount: acc.cash_amount + cashAmount,
      credit_card_amount: acc.credit_card_amount + creditCardAmount,
      debit_card_amount: acc.debit_card_amount + debitCardAmount,
      mobile_amount: acc.mobile_amount + mobileAmount,
      grocery_sales: acc.grocery_sales + grocerySales,
      total_gallons: acc.total_gallons + totalGallons,
      lottery_total_cash: acc.lottery_total_cash + lotteryTotalCash
    };
  }, {
    total_sales: 0,
    cash_amount: 0,
    credit_card_amount: 0,
    debit_card_amount: 0,
    mobile_amount: 0,
    grocery_sales: 0,
    total_gallons: 0,
    lottery_total_cash: 0
  });
  const summaryPaymentTotal = totals.cash_amount + totals.credit_card_amount + totals.debit_card_amount + totals.mobile_amount;
  const summaryWithGrocery = summaryPaymentTotal + totals.grocery_sales;
  console.log("Summary calculations:", {
    total_sales: totals.total_sales,
    payment_total: summaryPaymentTotal,
    with_grocery: summaryWithGrocery,
    payment_matches: Math.abs(summaryWithGrocery - totals.total_sales) <= 0.01
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-id": "s5u1kk052", "data-path": "src/pages/Sales/SalesReportList.tsx", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", "data-id": "qhmyaexfo", "data-path": "src/pages/Sales/SalesReportList.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-id": "scn6up0zx", "data-path": "src/pages/Sales/SalesReportList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-6", "data-id": "87t2gaaif", "data-path": "src/pages/Sales/SalesReportList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", "data-id": "3xj99lvdk", "data-path": "src/pages/Sales/SalesReportList.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "w-8 h-8 text-green-600", "data-id": "9aa0i27p0", "data-path": "src/pages/Sales/SalesReportList.tsx" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "twcfmv49t", "data-path": "src/pages/Sales/SalesReportList.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-gray-600", "data-id": "sbtcrnf8m", "data-path": "src/pages/Sales/SalesReportList.tsx", children: "Total Sales" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold", "data-id": "592ufcqd6", "data-path": "src/pages/Sales/SalesReportList.tsx", children: formatCurrency(totals.total_sales) })
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-id": "7nd82zbx4", "data-path": "src/pages/Sales/SalesReportList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-6", "data-id": "667v9mtfl", "data-path": "src/pages/Sales/SalesReportList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", "data-id": "v8g5si2tf", "data-path": "src/pages/Sales/SalesReportList.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-8 h-8 text-blue-600", "data-id": "r2vv9bv12", "data-path": "src/pages/Sales/SalesReportList.tsx" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "ocbavfrn5", "data-path": "src/pages/Sales/SalesReportList.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-gray-600", "data-id": "4j9zbsskh", "data-path": "src/pages/Sales/SalesReportList.tsx", children: "Total Gallons" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold", "data-id": "146pnef7x", "data-path": "src/pages/Sales/SalesReportList.tsx", children: totals.total_gallons.toFixed(2) })
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-id": "5zi37se7w", "data-path": "src/pages/Sales/SalesReportList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-6", "data-id": "hesdv1g92", "data-path": "src/pages/Sales/SalesReportList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", "data-id": "4z7s1ym0k", "data-path": "src/pages/Sales/SalesReportList.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "w-8 h-8 text-purple-600", "data-id": "9ag2hnusd", "data-path": "src/pages/Sales/SalesReportList.tsx" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "dlablt0wf", "data-path": "src/pages/Sales/SalesReportList.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-gray-600", "data-id": "axoky002i", "data-path": "src/pages/Sales/SalesReportList.tsx", children: "Grocery Sales" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold", "data-id": "1dqgizwu8", "data-path": "src/pages/Sales/SalesReportList.tsx", children: formatCurrency(totals.grocery_sales) })
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-id": "je80z1cro", "data-path": "src/pages/Sales/SalesReportList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-6", "data-id": "uu7pawc68", "data-path": "src/pages/Sales/SalesReportList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", "data-id": "9796tjll9", "data-path": "src/pages/Sales/SalesReportList.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-8 h-8 text-orange-600", "data-id": "ysx5bcmy0", "data-path": "src/pages/Sales/SalesReportList.tsx" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "r73woml87", "data-path": "src/pages/Sales/SalesReportList.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-gray-600", "data-id": "p1qq0csze", "data-path": "src/pages/Sales/SalesReportList.tsx", children: "Reports" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold", "data-id": "zi459xupw", "data-path": "src/pages/Sales/SalesReportList.tsx", children: totalCount })
        ] })
      ] }) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "32cx6pk95", "data-path": "src/pages/Sales/SalesReportList.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "04cc4ooyq", "data-path": "src/pages/Sales/SalesReportList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "6wminfuht", "data-path": "src/pages/Sales/SalesReportList.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "pv9fk1tjx", "data-path": "src/pages/Sales/SalesReportList.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center space-x-2", "data-id": "unwia1h0r", "data-path": "src/pages/Sales/SalesReportList.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-6 h-6", "data-id": "xhkhx1r5u", "data-path": "src/pages/Sales/SalesReportList.tsx" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "6d3fhtgo2", "data-path": "src/pages/Sales/SalesReportList.tsx", children: "Daily Sales Reports" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { "data-id": "gp5k9lo5r", "data-path": "src/pages/Sales/SalesReportList.tsx", children: "Track daily sales performance across all stations" })
        ] }),
        canAddReport && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => navigate("/sales/new"), className: "flex items-center space-x-2", "data-id": "pht7kseoz", "data-path": "src/pages/Sales/SalesReportList.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4", "data-id": "pftbd4tf9", "data-path": "src/pages/Sales/SalesReportList.tsx" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "dnnqy57ls", "data-path": "src/pages/Sales/SalesReportList.tsx", children: "Add Report" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { "data-id": "pow67ybyx", "data-path": "src/pages/Sales/SalesReportList.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center space-x-2 mb-6", "data-id": "yrrfk8331", "data-path": "src/pages/Sales/SalesReportList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 max-w-sm", "data-id": "hkkkhtrow", "data-path": "src/pages/Sales/SalesReportList.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4", "data-id": "uv7p5m56x", "data-path": "src/pages/Sales/SalesReportList.tsx" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              placeholder: "Search by station...",
              value: searchTerm,
              onChange: (e) => setSearchTerm(e.target.value),
              className: "pl-10",
              "data-id": "wmgbkyjb5",
              "data-path": "src/pages/Sales/SalesReportList.tsx"
            }
          )
        ] }) }),
        loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", "data-id": "2xyu4lboq", "data-path": "src/pages/Sales/SalesReportList.tsx", children: [...Array(5)].map(
          (_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 bg-gray-100 rounded animate-pulse", "data-id": "476u6o1nn", "data-path": "src/pages/Sales/SalesReportList.tsx" }, i)
        ) }) : reports.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-8", "data-id": "0hxymx7ub", "data-path": "src/pages/Sales/SalesReportList.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-12 h-12 text-gray-400 mx-auto mb-4", "data-id": "1pzr8c80m", "data-path": "src/pages/Sales/SalesReportList.tsx" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500", "data-id": "yf7nl72kh", "data-path": "src/pages/Sales/SalesReportList.tsx", children: "No sales reports found" }),
          canAddReport && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              className: "mt-4",
              onClick: () => navigate("/sales/new"),
              "data-id": "szxh6ni1x",
              "data-path": "src/pages/Sales/SalesReportList.tsx",
              children: "Add Your First Sales Report"
            }
          )
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border rounded-lg overflow-hidden", "data-id": "wqs58113r", "data-path": "src/pages/Sales/SalesReportList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { "data-id": "ufobs1uih", "data-path": "src/pages/Sales/SalesReportList.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { "data-id": "y6qi5ku5q", "data-path": "src/pages/Sales/SalesReportList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { "data-id": "r5fgbhpxt", "data-path": "src/pages/Sales/SalesReportList.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "3mh4ydd8m", "data-path": "src/pages/Sales/SalesReportList.tsx", children: "Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "2jmevvzkr", "data-path": "src/pages/Sales/SalesReportList.tsx", children: "Station" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "8z76o578g", "data-path": "src/pages/Sales/SalesReportList.tsx", children: "Shift" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "gx2j5u8ai", "data-path": "src/pages/Sales/SalesReportList.tsx", children: "Total Sales" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "l8eb3s5ms", "data-path": "src/pages/Sales/SalesReportList.tsx", children: "Gallons" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "eokb4eub4", "data-path": "src/pages/Sales/SalesReportList.tsx", children: "Grocery" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "0ynqnn2xm", "data-path": "src/pages/Sales/SalesReportList.tsx", children: "Payment Methods" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "w3dlyggdn", "data-path": "src/pages/Sales/SalesReportList.tsx", children: "Employee" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "ccdq3tnxc", "data-path": "src/pages/Sales/SalesReportList.tsx", children: "Actions" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TableBody, { "data-id": "4uit7uusw", "data-path": "src/pages/Sales/SalesReportList.tsx", children: [
            reports.map(
              (report) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { "data-id": "1xig3o9au", "data-path": "src/pages/Sales/SalesReportList.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", "data-id": "z6mr8m4c6", "data-path": "src/pages/Sales/SalesReportList.tsx", children: formatDate(report.report_date) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "pa6fvyglv", "data-path": "src/pages/Sales/SalesReportList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: `text-white ${getStationBadgeColor(report.station)}`, "data-id": "9b5s4fdjx", "data-path": "src/pages/Sales/SalesReportList.tsx", children: report.station }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "vx923wpqk", "data-path": "src/pages/Sales/SalesReportList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: report.shift === "DAY" ? "default" : "secondary", "data-id": "ybhw0zoup", "data-path": "src/pages/Sales/SalesReportList.tsx", children: report.shift || "DAY" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", "data-id": "tznbwjn1m", "data-path": "src/pages/Sales/SalesReportList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", "data-id": "o6lmw26e1", "data-path": "src/pages/Sales/SalesReportList.tsx", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "6g5smdd5u", "data-path": "src/pages/Sales/SalesReportList.tsx", children: formatCurrency(report.total_sales) }),
                  (() => {
                    const total = report.total_sales || 0;
                    const cash = report.cash_amount || 0;
                    const credit = report.credit_card_amount || 0;
                    const debit = report.debit_card_amount || 0;
                    const mobile = report.mobile_amount || 0;
                    const grocery = report.grocery_sales || 0;
                    const paymentTotal = cash + credit + debit + mobile + grocery;
                    const isPaymentCorrect = Math.abs(paymentTotal - total) <= 0.01;
                    return isPaymentCorrect ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-600 text-xs", "data-id": "agqa1bafc", "data-path": "src/pages/Sales/SalesReportList.tsx", children: "✓" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-600 text-xs", title: `Payment total: ${formatCurrency(paymentTotal)}`, "data-id": "qyd4z8kx6", "data-path": "src/pages/Sales/SalesReportList.tsx", children: "⚠️" });
                  })()
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "8f6fxcj56", "data-path": "src/pages/Sales/SalesReportList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center space-x-2", "data-id": "tdylbfoiz", "data-path": "src/pages/Sales/SalesReportList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "7kkdzpoti", "data-path": "src/pages/Sales/SalesReportList.tsx", children: (report.total_gallons || 0).toFixed(2) }) }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "qi55yv2zj", "data-path": "src/pages/Sales/SalesReportList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center space-x-2", "data-id": "4hf2o1etg", "data-path": "src/pages/Sales/SalesReportList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "avohx0haa", "data-path": "src/pages/Sales/SalesReportList.tsx", children: formatCurrency(report.grocery_sales) }) }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "zjh9zkjy1", "data-path": "src/pages/Sales/SalesReportList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 text-xs", "data-id": "1754eno96", "data-path": "src/pages/Sales/SalesReportList.tsx", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "vhgk8tk9l", "data-path": "src/pages/Sales/SalesReportList.tsx", children: [
                    "Cash: ",
                    formatCurrency(report.cash_amount)
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "anarega25", "data-path": "src/pages/Sales/SalesReportList.tsx", children: [
                    "Credit: ",
                    formatCurrency(report.credit_card_amount)
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "jggo3ytwq", "data-path": "src/pages/Sales/SalesReportList.tsx", children: [
                    "Debit: ",
                    formatCurrency(report.debit_card_amount)
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "7nr82o2gz", "data-path": "src/pages/Sales/SalesReportList.tsx", children: [
                    "Mobile: ",
                    formatCurrency(report.mobile_amount)
                  ] })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "ynwaqtax1", "data-path": "src/pages/Sales/SalesReportList.tsx", children: report.employee_name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "r2vymdorf", "data-path": "src/pages/Sales/SalesReportList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", "data-id": "8yhtt2u1o", "data-path": "src/pages/Sales/SalesReportList.tsx", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      variant: "outline",
                      size: "sm",
                      onClick: () => handlePrint(report),
                      title: "Document Print",
                      "data-id": "dht8tyoo6",
                      "data-path": "src/pages/Sales/SalesReportList.tsx",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "w-4 h-4", "data-id": "dzvhe8g2t", "data-path": "src/pages/Sales/SalesReportList.tsx" })
                    }
                  ),
                  isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        variant: "outline",
                        size: "sm",
                        onClick: () => navigate(`/sales/edit/${report.ID}`),
                        title: "Edit Report",
                        "data-id": "l7ti8a6yh",
                        "data-path": "src/pages/Sales/SalesReportList.tsx",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { className: "w-4 h-4", "data-id": "vbjym211y", "data-path": "src/pages/Sales/SalesReportList.tsx" })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        variant: "outline",
                        size: "sm",
                        onClick: () => handleDelete(report.ID),
                        className: "text-red-600 hover:text-red-700",
                        title: "Delete Report",
                        "data-id": "6rxu2g1rj",
                        "data-path": "src/pages/Sales/SalesReportList.tsx",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4", "data-id": "69nisn1dy", "data-path": "src/pages/Sales/SalesReportList.tsx" })
                      }
                    )
                  ] })
                ] }) })
              ] }, report.ID)
            ),
            reports.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "bg-gray-50 font-semibold border-t-2", "data-id": "hwt1t6mo3", "data-path": "src/pages/Sales/SalesReportList.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-bold", "data-id": "13xu8wdw2", "data-path": "src/pages/Sales/SalesReportList.tsx", children: "TOTALS" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "fevjht7ea", "data-path": "src/pages/Sales/SalesReportList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "text-xs", "data-id": "s47z4mlud", "data-path": "src/pages/Sales/SalesReportList.tsx", children: [
                reports.length,
                " reports"
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-gray-500", "data-id": "ylqdsmrt8", "data-path": "src/pages/Sales/SalesReportList.tsx", children: "-" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-bold text-green-600", "data-id": "rwacl78b7", "data-path": "src/pages/Sales/SalesReportList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", "data-id": "4phdcmjga", "data-path": "src/pages/Sales/SalesReportList.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "41fk6g02u", "data-path": "src/pages/Sales/SalesReportList.tsx", children: formatCurrency(totals.total_sales) }),
                Math.abs(summaryWithGrocery - totals.total_sales) <= 0.01 ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-600 text-xs", "data-id": "ozmy4ve9q", "data-path": "src/pages/Sales/SalesReportList.tsx", children: "✓" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-600 text-xs", "data-id": "ng2f07tub", "data-path": "src/pages/Sales/SalesReportList.tsx", children: "⚠️" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-bold text-blue-600", "data-id": "3efpkwfz4", "data-path": "src/pages/Sales/SalesReportList.tsx", children: totals.total_gallons.toFixed(2) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-bold text-purple-600", "data-id": "gg5wqoq96", "data-path": "src/pages/Sales/SalesReportList.tsx", children: formatCurrency(totals.grocery_sales) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "uku5v8r73", "data-path": "src/pages/Sales/SalesReportList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 text-xs", "data-id": "yk3tm42az", "data-path": "src/pages/Sales/SalesReportList.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-medium", "data-id": "l9x4ihss6", "data-path": "src/pages/Sales/SalesReportList.tsx", children: [
                  "Cash: ",
                  formatCurrency(totals.cash_amount)
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-medium", "data-id": "lta79l341", "data-path": "src/pages/Sales/SalesReportList.tsx", children: [
                  "Credit: ",
                  formatCurrency(totals.credit_card_amount)
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-medium", "data-id": "lamqbtca6", "data-path": "src/pages/Sales/SalesReportList.tsx", children: [
                  "Debit: ",
                  formatCurrency(totals.debit_card_amount)
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-medium", "data-id": "3w9dn37d2", "data-path": "src/pages/Sales/SalesReportList.tsx", children: [
                  "Mobile: ",
                  formatCurrency(totals.mobile_amount)
                ] })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-gray-500", "data-id": "6sdod4a9s", "data-path": "src/pages/Sales/SalesReportList.tsx", children: "-" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-gray-500", "data-id": "6s921ucne", "data-path": "src/pages/Sales/SalesReportList.tsx", children: "-" })
            ] })
          ] })
        ] }) }),
        totalPages > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-6", "data-id": "olodcsrpp", "data-path": "src/pages/Sales/SalesReportList.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-gray-700", "data-id": "3e59g74zn", "data-path": "src/pages/Sales/SalesReportList.tsx", children: [
            "Showing ",
            (currentPage - 1) * pageSize + 1,
            " to ",
            Math.min(currentPage * pageSize, totalCount),
            " of ",
            totalCount,
            " reports"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", "data-id": "j231ia14b", "data-path": "src/pages/Sales/SalesReportList.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: () => setCurrentPage((prev) => Math.max(prev - 1, 1)),
                disabled: currentPage === 1,
                "data-id": "sutaj09af",
                "data-path": "src/pages/Sales/SalesReportList.tsx",
                children: "Previous"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm", "data-id": "s9uewymzw", "data-path": "src/pages/Sales/SalesReportList.tsx", children: [
              "Page ",
              currentPage,
              " of ",
              totalPages
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: () => setCurrentPage((prev) => Math.min(prev + 1, totalPages)),
                disabled: currentPage === totalPages,
                "data-id": "7nilrpyru",
                "data-path": "src/pages/Sales/SalesReportList.tsx",
                children: "Next"
              }
            )
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      EnhancedSalesReportPrintDialog,
      {
        open: printDialogOpen,
        onOpenChange: setPrintDialogOpen,
        report: selectedReport,
        "data-id": "83o0ak1kp",
        "data-path": "src/pages/Sales/SalesReportList.tsx"
      }
    )
  ] });
};
const SalesReportList$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: SalesReportList
}, Symbol.toStringTag, { value: "Module" }));
const stations = [
  {
    id: "MOBIL",
    name: "MOBIL",
    location: "Far Rockaway",
    description: "Gas station with convenience store",
    color: "bg-blue-50 border-blue-200 hover:bg-blue-100"
  },
  {
    id: "AMOCO ROSEDALE",
    name: "AMOCO",
    location: "Rosedale",
    description: "Full service gas station",
    color: "bg-green-50 border-green-200 hover:bg-green-100"
  },
  {
    id: "AMOCO BROOKLYN",
    name: "AMOCO",
    location: "Brooklyn",
    description: "Full service gas station",
    color: "bg-purple-50 border-purple-200 hover:bg-purple-100"
  }
];
const StationSelector = ({ onStationSelect }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "irusfxzsh", "data-path": "src/components/StationSelector.tsx", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "text-center", "data-id": "p10v19tal", "data-path": "src/components/StationSelector.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center justify-center space-x-2", "data-id": "511h91uuu", "data-path": "src/components/StationSelector.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "w-6 h-6", "data-id": "06foisws4", "data-path": "src/components/StationSelector.tsx" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "0ljlq0fp7", "data-path": "src/components/StationSelector.tsx", children: "Select Station" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { "data-id": "hy1pfwcbu", "data-path": "src/components/StationSelector.tsx", children: "Choose the station to create a daily sales report for" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { "data-id": "c7k8k06b0", "data-path": "src/components/StationSelector.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", "data-id": "cgf5rbft6", "data-path": "src/components/StationSelector.tsx", children: stations.map(
      (station) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          className: `h-auto p-6 flex flex-col items-center space-y-3 ${station.color} transition-all duration-200`,
          onClick: () => onStationSelect(station.id),
          "data-id": "mr4v38vsu",
          "data-path": "src/components/StationSelector.tsx",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-8 h-8", "data-id": "4h8cuvkxj", "data-path": "src/components/StationSelector.tsx" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", "data-id": "5wz2tqz9n", "data-path": "src/components/StationSelector.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-lg", "data-id": "uwcv5f80d", "data-path": "src/components/StationSelector.tsx", children: station.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", "data-id": "pazyvv5ll", "data-path": "src/components/StationSelector.tsx", children: station.location }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-1", "data-id": "bav564feg", "data-path": "src/components/StationSelector.tsx", children: station.description })
            ] })
          ]
        },
        station.id
      )
    ) }) })
  ] });
};
const GasGrocerySalesSection = ({
  station,
  values,
  onChange
}) => {
  const isMobil = station === "MOBIL";
  const totalSales = values.creditCardAmount + values.debitCardAmount + values.mobileAmount + values.cashAmount + values.grocerySales;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-id": "diai4nlv0", "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-blue-50 border-blue-200", "data-id": "xl0j83sgl", "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "73mseup0u", "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-blue-800 flex items-center space-x-2", "data-id": "83t5xflpy", "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Fuel, { className: "w-5 h-5", "data-id": "nltvye4g1", "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "l9l0a6256", "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx", children: "Gas & Grocery Sales" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", "data-id": "mul7bdst7", "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", "data-id": "2dzkiqrob", "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "rl37ip09o", "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "creditCard", "data-id": "cs9oarj8q", "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx", children: "Credit Card Amount ($) *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              NumberInput,
              {
                id: "creditCard",
                value: values.creditCardAmount,
                onChange: (value) => onChange("creditCardAmount", value || 0),
                min: 0,
                step: 0.01,
                required: true,
                "data-id": "id7oxqbna",
                "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "28w1eo7oe", "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "debitCard", "data-id": "3mdnam8zt", "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx", children: "Debit Card Amount ($) *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              NumberInput,
              {
                id: "debitCard",
                value: values.debitCardAmount,
                onChange: (value) => onChange("debitCardAmount", value || 0),
                min: 0,
                step: 0.01,
                required: true,
                "data-id": "s5kq5937e",
                "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "7sz0hhfkf", "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "mobile", "data-id": "5pe3lezuv", "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx", children: "Mobile Payment Amount ($) *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              NumberInput,
              {
                id: "mobile",
                value: values.mobileAmount,
                onChange: (value) => onChange("mobileAmount", value || 0),
                min: 0,
                step: 0.01,
                required: true,
                "data-id": "jah41v0h8",
                "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "nc6hio325", "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "cash", "data-id": "kmm0g0q66", "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx", children: "Cash Amount ($) *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              NumberInput,
              {
                id: "cash",
                value: values.cashAmount,
                onChange: (value) => onChange("cashAmount", value || 0),
                min: 0,
                step: 0.01,
                required: true,
                "data-id": "u6m1wq00p",
                "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "iokmvbgxb", "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "grocery", "data-id": "r6a83mdew", "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx", children: "Grocery Sales ($) *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              NumberInput,
              {
                id: "grocery",
                value: values.grocerySales,
                onChange: (value) => onChange("grocerySales", value || 0),
                min: 0,
                step: 0.01,
                required: true,
                "data-id": "0pfy1hl3d",
                "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-4 border-t border-blue-200", "data-id": "odcpj8dfu", "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "kcq6hqjo9", "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-lg font-semibold", "data-id": "z5mkrc2r1", "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx", children: "Total Sales (Auto-calculated)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-2xl font-bold text-blue-800", "data-id": "nm5p9ebr0", "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx", children: [
              "$",
              totalSales.toFixed(2)
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-gray-600 mt-1", "data-id": "n6kzq86zq", "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx", children: [
            "Credit + Debit + Mobile + Cash + Grocery = $",
            totalSales.toFixed(2)
          ] })
        ] })
      ] })
    ] }),
    isMobil && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-green-50 border-green-200", "data-id": "af1hgre6e", "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "ngs2alqqt", "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-green-800 flex items-center space-x-2", "data-id": "9bt5ed51f", "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "w-5 h-5", "data-id": "yy2ls5h14", "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "olkvhqykl", "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx", children: "Grocery Sales Breakdown" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", "data-id": "5nu41vjfk", "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", "data-id": "v77tpkd6n", "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "aqi4b36xo", "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "groceryCash", "data-id": "cn75xmcuu", "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx", children: "Cash Sales ($) *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              NumberInput,
              {
                id: "groceryCash",
                value: values.groceryCashSales || 0,
                onChange: (value) => onChange("groceryCashSales", value || 0),
                min: 0,
                step: 0.01,
                required: true,
                "data-id": "ft2eat9ur",
                "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "3cdjltecn", "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "groceryCreditDebit", "data-id": "8i1k82e60", "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx", children: "Credit/Debit Card ($) *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              NumberInput,
              {
                id: "groceryCreditDebit",
                value: values.groceryCreditDebitSales || 0,
                onChange: (value) => onChange("groceryCreditDebitSales", value || 0),
                min: 0,
                step: 0.01,
                required: true,
                "data-id": "y1ke7r6fz",
                "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "3xwu01mhr", "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "ebt", "data-id": "19centwhu", "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx", children: "EBT ($) *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              NumberInput,
              {
                id: "ebt",
                value: values.ebtSales || 0,
                onChange: (value) => onChange("ebtSales", value || 0),
                min: 0,
                step: 0.01,
                required: true,
                "data-id": "ppzkvble8",
                "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-4 border-t border-green-200", "data-id": "eqnvuqd8n", "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "tk4k9upj6", "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-lg font-semibold", "data-id": "m0gi6t14t", "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx", children: "Total Grocery Sales" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-2xl font-bold text-green-800", "data-id": "rhlvg4yh8", "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx", children: [
              "$",
              ((values.groceryCashSales || 0) + (values.groceryCreditDebitSales || 0) + (values.ebtSales || 0)).toFixed(2)
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-gray-600 mt-1", children: [
            "Grocery Cash + Credit/Debit + EBT = $",
            ((values.groceryCashSales || 0) + (values.groceryCreditDebitSales || 0) + (values.ebtSales || 0)).toFixed(2)
          ] })
        ] })
      ] })
    ] })
  ] });
};
const LotterySalesSection = ({
  values,
  onChange
}) => {
  const totalLotteryCash = values.lotteryNetSales + values.scratchOffSales;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-yellow-50 border-yellow-200", "data-id": "md0s2nm2h", "data-path": "src/components/SalesReportSections/LotterySalesSection.tsx", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "rrnmqui74", "data-path": "src/components/SalesReportSections/LotterySalesSection.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-yellow-800 flex items-center space-x-2", "data-id": "un5p0qj6t", "data-path": "src/components/SalesReportSections/LotterySalesSection.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Ticket, { className: "w-5 h-5", "data-id": "evpwd8u2a", "data-path": "src/components/SalesReportSections/LotterySalesSection.tsx" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "d4drohryy", "data-path": "src/components/SalesReportSections/LotterySalesSection.tsx", children: "NY Lottery Sales" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", "data-id": "rwmoopcet", "data-path": "src/components/SalesReportSections/LotterySalesSection.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", "data-id": "ku24slxcz", "data-path": "src/components/SalesReportSections/LotterySalesSection.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "3fxu82yz5", "data-path": "src/components/SalesReportSections/LotterySalesSection.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "lotteryNet", "data-id": "oycl6vj6e", "data-path": "src/components/SalesReportSections/LotterySalesSection.tsx", children: "Net Sales ($) *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            NumberInput,
            {
              id: "lotteryNet",
              value: values.lotteryNetSales,
              onChange: (value) => onChange("lotteryNetSales", value || 0),
              min: 0,
              step: 0.01,
              required: true,
              "data-id": "krk3kmmwz",
              "data-path": "src/components/SalesReportSections/LotterySalesSection.tsx"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "bg9viufpm", "data-path": "src/components/SalesReportSections/LotterySalesSection.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "scratchOff", "data-id": "wccdzh8el", "data-path": "src/components/SalesReportSections/LotterySalesSection.tsx", children: "Scratch Off Sales ($) *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            NumberInput,
            {
              id: "scratchOff",
              value: values.scratchOffSales,
              onChange: (value) => onChange("scratchOffSales", value || 0),
              min: 0,
              step: 0.01,
              required: true,
              "data-id": "sipyopeo2",
              "data-path": "src/components/SalesReportSections/LotterySalesSection.tsx"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-4 border-t border-yellow-200", "data-id": "bbmw5hzjd", "data-path": "src/components/SalesReportSections/LotterySalesSection.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "2i1945lo8", "data-path": "src/components/SalesReportSections/LotterySalesSection.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-lg font-semibold", "data-id": "ob0z8k2ai", "data-path": "src/components/SalesReportSections/LotterySalesSection.tsx", children: "Total Sales Cash (Auto-calculated)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-2xl font-bold text-yellow-800", "data-id": "mvab1n4d7", "data-path": "src/components/SalesReportSections/LotterySalesSection.tsx", children: [
            "$",
            totalLotteryCash.toFixed(2)
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-gray-600 mt-1", "data-id": "6zp1re2ek", "data-path": "src/components/SalesReportSections/LotterySalesSection.tsx", children: [
          "Net Sales + Scratch Off = $",
          totalLotteryCash.toFixed(2)
        ] })
      ] })
    ] })
  ] });
};
const GasTankReportSection = ({
  values,
  onChange
}) => {
  const totalGallons = values.regularGallons + values.superGallons + values.dieselGallons;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-red-50 border-red-200", "data-id": "puq5bgwl9", "data-path": "src/components/SalesReportSections/GasTankReportSection.tsx", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "gqed43qpz", "data-path": "src/components/SalesReportSections/GasTankReportSection.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-red-800 flex items-center space-x-2", "data-id": "qat72qfwp", "data-path": "src/components/SalesReportSections/GasTankReportSection.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Gauge, { className: "w-5 h-5", "data-id": "oqlmw5tzc", "data-path": "src/components/SalesReportSections/GasTankReportSection.tsx" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "tceex993p", "data-path": "src/components/SalesReportSections/GasTankReportSection.tsx", children: "Gas Tank Report" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", "data-id": "diljp6f7l", "data-path": "src/components/SalesReportSections/GasTankReportSection.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", "data-id": "2cyfwq3wm", "data-path": "src/components/SalesReportSections/GasTankReportSection.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "od5pc9akg", "data-path": "src/components/SalesReportSections/GasTankReportSection.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "regular", "data-id": "lc987qu7n", "data-path": "src/components/SalesReportSections/GasTankReportSection.tsx", children: "Regular (Gallons) *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            NumberInput,
            {
              id: "regular",
              value: values.regularGallons,
              onChange: (value) => onChange("regularGallons", value || 0),
              min: 0,
              step: 0.01,
              required: true,
              "data-id": "u6tif438z",
              "data-path": "src/components/SalesReportSections/GasTankReportSection.tsx"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "k3rap7fq7", "data-path": "src/components/SalesReportSections/GasTankReportSection.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "super", "data-id": "fygnqnwil", "data-path": "src/components/SalesReportSections/GasTankReportSection.tsx", children: "Super (Gallons) *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            NumberInput,
            {
              id: "super",
              value: values.superGallons,
              onChange: (value) => onChange("superGallons", value || 0),
              min: 0,
              step: 0.01,
              required: true,
              "data-id": "fjp8n70ad",
              "data-path": "src/components/SalesReportSections/GasTankReportSection.tsx"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "c7tgyaffh", "data-path": "src/components/SalesReportSections/GasTankReportSection.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "diesel", "data-id": "gl01iiaml", "data-path": "src/components/SalesReportSections/GasTankReportSection.tsx", children: "Diesel (Gallons) *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            NumberInput,
            {
              id: "diesel",
              value: values.dieselGallons,
              onChange: (value) => onChange("dieselGallons", value || 0),
              min: 0,
              step: 0.01,
              required: true,
              "data-id": "pt98u4vwk",
              "data-path": "src/components/SalesReportSections/GasTankReportSection.tsx"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-4 border-t border-red-200", "data-id": "lxwfw7ile", "data-path": "src/components/SalesReportSections/GasTankReportSection.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "rkxbkowzr", "data-path": "src/components/SalesReportSections/GasTankReportSection.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-lg font-semibold", "data-id": "ov1wi7ykc", "data-path": "src/components/SalesReportSections/GasTankReportSection.tsx", children: "Total Gallons Sold (Auto-calculated)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-2xl font-bold text-red-800", "data-id": "ek6hf9mxg", "data-path": "src/components/SalesReportSections/GasTankReportSection.tsx", children: [
            totalGallons.toFixed(2),
            " gal"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-gray-600 mt-1", "data-id": "8vl0ixxvy", "data-path": "src/components/SalesReportSections/GasTankReportSection.tsx", children: [
          "Regular + Super + Diesel = ",
          totalGallons.toFixed(2),
          " gallons"
        ] })
      ] })
    ] })
  ] });
};
const ExpensesSection = ({
  expenses,
  onChange
}) => {
  const [vendors, setVendors] = reactExports.useState([]);
  const [isLoadingVendors, setIsLoadingVendors] = reactExports.useState(true);
  const { toast: toast2 } = useToast();
  reactExports.useEffect(() => {
    loadVendors();
  }, []);
  const loadVendors = async () => {
    try {
      const { data, error } = await window.ezsite.apis.tablePage(11729, {
        PageNo: 1,
        PageSize: 100,
        OrderByField: "vendor_name",
        IsAsc: true,
        Filters: [{ name: "is_active", op: "Equal", value: true }]
      });
      if (error) throw error;
      setVendors((data == null ? void 0 : data.List) || []);
    } catch (error) {
      console.error("Error loading vendors:", error);
      toast2({
        title: "Error",
        description: "Failed to load vendors",
        variant: "destructive"
      });
    } finally {
      setIsLoadingVendors(false);
    }
  };
  const addExpense = () => {
    const newExpense = {
      id: Date.now().toString(),
      vendorId: "",
      vendorName: "",
      amount: 0,
      paymentType: "Cash",
      notes: ""
    };
    onChange([...expenses, newExpense]);
  };
  const updateExpense = (index, field, value) => {
    const updatedExpenses = [...expenses];
    updatedExpenses[index] = { ...updatedExpenses[index], [field]: value };
    if (field === "vendorId") {
      const vendor = vendors.find((v) => v.id.toString() === value);
      updatedExpenses[index].vendorName = (vendor == null ? void 0 : vendor.vendor_name) || "";
    }
    onChange(updatedExpenses);
  };
  const removeExpense = (index) => {
    const updatedExpenses = expenses.filter((_, i) => i !== index);
    onChange(updatedExpenses);
  };
  const uploadInvoice = async (index, file) => {
    try {
      const { data: fileId, error } = await window.ezsite.apis.upload({
        filename: file.name,
        file
      });
      if (error) throw error;
      updateExpense(index, "invoiceFileId", fileId);
      toast2({
        title: "Success",
        description: "Invoice uploaded successfully"
      });
    } catch (error) {
      console.error("Error uploading invoice:", error);
      toast2({
        title: "Error",
        description: "Failed to upload invoice",
        variant: "destructive"
      });
    }
  };
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const cashExpenses = expenses.filter((e) => e.paymentType === "Cash").reduce((sum, expense) => sum + expense.amount, 0);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-orange-50 border-orange-200", "data-id": "8s4jyz0ye", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "9q6fpwuhf", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-orange-800 flex items-center justify-between", "data-id": "e8612nboz", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", "data-id": "f3tgruxa3", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Receipt, { className: "w-5 h-5", "data-id": "0b0ei6kw1", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "0r7l9c2um", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx", children: "Expenses" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          variant: "outline",
          size: "sm",
          onClick: addExpense,
          className: "bg-white hover:bg-orange-100",
          "data-id": "xd7m103a4",
          "data-path": "src/components/SalesReportSections/ExpensesSection.tsx",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4 mr-2", "data-id": "ymcugiivr", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx" }),
            "Add Expense"
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", "data-id": "d6qd6ntr5", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx", children: [
      expenses.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-8 text-gray-500", "data-id": "slelzjhkg", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx", children: 'No expenses recorded. Click "Add Expense" to get started.' }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", "data-id": "5veqkm2cc", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx", children: expenses.map(
        (expense, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-orange-200 rounded-lg p-4 bg-white", "data-id": "y7c1ov1eb", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", "data-id": "2uuz45n3a", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "text-orange-700", "data-id": "e7p29gkbq", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx", children: [
              "Expense #",
              index + 1
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "ghost",
                size: "sm",
                onClick: () => removeExpense(index),
                className: "text-red-600 hover:text-red-800 hover:bg-red-50",
                "data-id": "f2lyywjc6",
                "data-path": "src/components/SalesReportSections/ExpensesSection.tsx",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4", "data-id": "pwp137tvd", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", "data-id": "xbuew8w28", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "ypnu70e3j", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { "data-id": "qvu2fvneb", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx", children: "Vendor *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: expense.vendorId,
                  onValueChange: (value) => updateExpense(index, "vendorId", value),
                  "data-id": "qp7r0ya4x",
                  "data-path": "src/components/SalesReportSections/ExpensesSection.tsx",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-id": "ezrj9ri0j", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select vendor", "data-id": "pdzv3bgrl", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { "data-id": "2hlzy69gn", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx", children: vendors.map(
                      (vendor) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: vendor.id.toString(), "data-id": "4kr3q80pb", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx", children: vendor.vendor_name }, vendor.id)
                    ) })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "cam123ne1", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { "data-id": "0r5xsph9q", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx", children: "Amount ($) *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                NumberInput,
                {
                  value: expense.amount,
                  onChange: (value) => updateExpense(index, "amount", value || 0),
                  min: 0,
                  step: 0.01,
                  required: true,
                  "data-id": "34gmn3xeb",
                  "data-path": "src/components/SalesReportSections/ExpensesSection.tsx"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "i4n8pesca", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { "data-id": "u6mtm3uqb", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx", children: "Payment Type *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: expense.paymentType,
                  onValueChange: (value) => updateExpense(index, "paymentType", value),
                  "data-id": "4v18561t7",
                  "data-path": "src/components/SalesReportSections/ExpensesSection.tsx",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-id": "8q1gee677", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { "data-id": "hvczwac5s", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { "data-id": "9cr91sv8g", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Cash", "data-id": "pwehtns07", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx", children: "Cash" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Credit Card", "data-id": "8sahhhgrq", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx", children: "Credit Card" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Cheque", "data-id": "25755f0aj", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx", children: "Cheque" })
                    ] })
                  ]
                }
              )
            ] }),
            expense.paymentType === "Cheque" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "xuklz1qb3", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { "data-id": "nj2inloa4", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx", children: "Cheque Number *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: expense.chequeNo || "",
                  onChange: (e) => updateExpense(index, "chequeNo", e.target.value),
                  placeholder: "Enter cheque number",
                  required: true,
                  "data-id": "s6700220n",
                  "data-path": "src/components/SalesReportSections/ExpensesSection.tsx"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2 space-y-2", "data-id": "fdicvsdtd", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { "data-id": "y7ibsrsc8", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx", children: "Upload Invoice * (Mandatory)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", "data-id": "exwggg5w6", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    type: "file",
                    accept: ".pdf,.jpg,.jpeg,.png",
                    onChange: (e) => {
                      var _a;
                      const file = (_a = e.target.files) == null ? void 0 : _a[0];
                      if (file) uploadInvoice(index, file);
                    },
                    className: "flex-1",
                    "data-id": "w0v0v781x",
                    "data-path": "src/components/SalesReportSections/ExpensesSection.tsx"
                  }
                ),
                expense.invoiceFileId && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "default", className: "bg-green-100 text-green-800", "data-id": "i3a0r7ud3", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx", children: "✓ Uploaded" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2 space-y-2", "data-id": "7j1a92ra6", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { "data-id": "bw9gs3gd7", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx", children: "Notes" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Textarea,
                {
                  value: expense.notes,
                  onChange: (e) => updateExpense(index, "notes", e.target.value),
                  placeholder: "Additional notes about this expense...",
                  rows: 2,
                  "data-id": "qfrklgc31",
                  "data-path": "src/components/SalesReportSections/ExpensesSection.tsx"
                }
              )
            ] })
          ] })
        ] }, expense.id)
      ) }),
      expenses.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-4 border-t border-orange-200 bg-orange-100 rounded-lg p-4", "data-id": "gq5v4elnv", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", "data-id": "2cgi84vxt", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "frpbg1gq5", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "font-semibold", "data-id": "75swav90q", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx", children: "Total Expenses:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xl font-bold text-orange-800", "data-id": "1z1ki8c4t", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx", children: [
            "$",
            totalExpenses.toFixed(2)
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "wb35hkczm", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "font-semibold", "data-id": "qni7lr8i7", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx", children: "Cash Expenses:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xl font-bold text-orange-800", "data-id": "fvv1xtsnf", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx", children: [
            "$",
            cashExpenses.toFixed(2)
          ] })
        ] })
      ] }) })
    ] })
  ] });
};
const DocumentsUploadSection = ({
  documents,
  onChange
}) => {
  const { toast: toast2 } = useToast();
  const documentTypes = [
    {
      name: "Day Report",
      field: "dayReportFileId",
      fileId: documents.dayReportFileId,
      required: true
    },
    {
      name: "Veeder Root Report",
      field: "veederRootFileId",
      fileId: documents.veederRootFileId,
      required: true
    },
    {
      name: "Lotto Report",
      field: "lottoReportFileId",
      fileId: documents.lottoReportFileId,
      required: true
    },
    {
      name: "Scratch Off Report",
      field: "scratchOffReportFileId",
      fileId: documents.scratchOffReportFileId,
      required: true
    }
  ];
  const uploadDocument = async (field, file) => {
    try {
      const { data: fileId, error } = await window.ezsite.apis.upload({
        filename: file.name,
        file
      });
      if (error) throw error;
      onChange(field, fileId);
      toast2({
        title: "Success",
        description: `${field.replace("FileId", "").replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())} uploaded successfully`
      });
    } catch (error) {
      console.error("Error uploading document:", error);
      toast2({
        title: "Error",
        description: "Failed to upload document",
        variant: "destructive"
      });
    }
  };
  const getStatus = (document2) => {
    if (document2.fileId) {
      return {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-4 h-4", "data-id": "sks67egpd", "data-path": "src/components/SalesReportSections/DocumentsUploadSection.tsx" }),
        text: "Submitted",
        color: "bg-green-100 text-green-800 border-green-200"
      };
    } else {
      return {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-4 h-4", "data-id": "8s2y4ovqb", "data-path": "src/components/SalesReportSections/DocumentsUploadSection.tsx" }),
        text: "Not Submitted",
        color: "bg-red-100 text-red-800 border-red-200"
      };
    }
  };
  const submittedCount = documentTypes.filter((doc) => doc.fileId).length;
  const totalCount = documentTypes.length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-purple-50 border-purple-200", "data-id": "da6aamhvp", "data-path": "src/components/SalesReportSections/DocumentsUploadSection.tsx", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "04f953vf2", "data-path": "src/components/SalesReportSections/DocumentsUploadSection.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-purple-800 flex items-center justify-between", "data-id": "eov3p51ho", "data-path": "src/components/SalesReportSections/DocumentsUploadSection.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", "data-id": "xkmyszizx", "data-path": "src/components/SalesReportSections/DocumentsUploadSection.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-5 h-5", "data-id": "gpnj8pian", "data-path": "src/components/SalesReportSections/DocumentsUploadSection.tsx" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "fgfncjakl", "data-path": "src/components/SalesReportSections/DocumentsUploadSection.tsx", children: "Documents Upload" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Badge,
        {
          variant: "outline",
          className: submittedCount === totalCount ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800",
          "data-id": "1oyappxv4",
          "data-path": "src/components/SalesReportSections/DocumentsUploadSection.tsx",
          children: [
            submittedCount,
            "/",
            totalCount,
            " Submitted"
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", "data-id": "b1v0lp0ox", "data-path": "src/components/SalesReportSections/DocumentsUploadSection.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4", "data-id": "ejrimpm70", "data-path": "src/components/SalesReportSections/DocumentsUploadSection.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", "data-id": "9gf12xieo", "data-path": "src/components/SalesReportSections/DocumentsUploadSection.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-5 h-5 text-yellow-600", "data-id": "lcdowj33j", "data-path": "src/components/SalesReportSections/DocumentsUploadSection.tsx" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-yellow-800", "data-id": "qkgnkiln4", "data-path": "src/components/SalesReportSections/DocumentsUploadSection.tsx", children: "Mandatory Submission Required" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-yellow-700 mt-1", "data-id": "5umjhai04", "data-path": "src/components/SalesReportSections/DocumentsUploadSection.tsx", children: "All documents must be uploaded before submitting the sales report." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", "data-id": "c3b1nfead", "data-path": "src/components/SalesReportSections/DocumentsUploadSection.tsx", children: documentTypes.map((document2) => {
        const status = getStatus(document2);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-purple-200 rounded-lg p-4 bg-white", "data-id": "s0vf8sp06", "data-path": "src/components/SalesReportSections/DocumentsUploadSection.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", "data-id": "0ranf1d2m", "data-path": "src/components/SalesReportSections/DocumentsUploadSection.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-3", "data-id": "8d7hog8p6", "data-path": "src/components/SalesReportSections/DocumentsUploadSection.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-5 h-5 text-purple-600", "data-id": "937z7hqa6", "data-path": "src/components/SalesReportSections/DocumentsUploadSection.tsx" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", "data-id": "eg054l9zf", "data-path": "src/components/SalesReportSections/DocumentsUploadSection.tsx", children: document2.name }),
              document2.required && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "destructive", className: "text-xs", "data-id": "jvkob4m8d", "data-path": "src/components/SalesReportSections/DocumentsUploadSection.tsx", children: "Required" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: status.color, "data-id": "x1vf9s4lc", "data-path": "src/components/SalesReportSections/DocumentsUploadSection.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-1", "data-id": "xp8646eiz", "data-path": "src/components/SalesReportSections/DocumentsUploadSection.tsx", children: [
              status.icon,
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "yrum97r6j", "data-path": "src/components/SalesReportSections/DocumentsUploadSection.tsx", children: status.text })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", "data-id": "p5q0gbeh9", "data-path": "src/components/SalesReportSections/DocumentsUploadSection.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            EnhancedFileUpload,
            {
              onFileSelect: (file) => uploadDocument(document2.field, file),
              accept: ".pdf,.jpg,.jpeg,.png,.doc,.docx,image/*",
              label: document2.fileId ? "Re-upload Document" : "Upload Document",
              maxSize: 15,
              allowCamera: true,
              className: "w-full",
              "data-id": "2p4b12zre",
              "data-path": "src/components/SalesReportSections/DocumentsUploadSection.tsx"
            }
          ) }),
          document2.fileId && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 text-xs text-green-600 flex items-center space-x-1", "data-id": "amy0jlo5g", "data-path": "src/components/SalesReportSections/DocumentsUploadSection.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-3 h-3", "data-id": "hckse27xo", "data-path": "src/components/SalesReportSections/DocumentsUploadSection.tsx" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { "data-id": "844ntkc2s", "data-path": "src/components/SalesReportSections/DocumentsUploadSection.tsx", children: [
              "File uploaded successfully (ID: ",
              document2.fileId,
              ")"
            ] })
          ] })
        ] }, document2.field);
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-4 border-t border-purple-200", "data-id": "a072ppect", "data-path": "src/components/SalesReportSections/DocumentsUploadSection.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm", "data-id": "nj50gh2gq", "data-path": "src/components/SalesReportSections/DocumentsUploadSection.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-600", "data-id": "8m2fenubm", "data-path": "src/components/SalesReportSections/DocumentsUploadSection.tsx", children: "Submission Progress:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", "data-id": "fsrr66fo2", "data-path": "src/components/SalesReportSections/DocumentsUploadSection.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-32 bg-gray-200 rounded-full h-2", "data-id": "q9p0jj421", "data-path": "src/components/SalesReportSections/DocumentsUploadSection.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "bg-purple-600 h-2 rounded-full transition-all duration-300",
              style: { width: `${submittedCount / totalCount * 100}%` },
              "data-id": "od4i770z4",
              "data-path": "src/components/SalesReportSections/DocumentsUploadSection.tsx"
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium text-purple-800", "data-id": "oc9hls9kc", "data-path": "src/components/SalesReportSections/DocumentsUploadSection.tsx", children: [
            Math.round(submittedCount / totalCount * 100),
            "%"
          ] })
        ] })
      ] }) })
    ] })
  ] });
};
const CashCollectionSection = ({
  values,
  onChange
}) => {
  const expectedCash = values.totalCashFromSales - values.totalCashFromExpenses;
  const shortOver = values.cashCollectionOnHand - expectedCash;
  const isShort = shortOver < 0;
  const isOver = shortOver > 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-gray-50 border-gray-200", "data-id": "b8zsgc17l", "data-path": "src/components/SalesReportSections/CashCollectionSection.tsx", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "02w8t5auq", "data-path": "src/components/SalesReportSections/CashCollectionSection.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-gray-800 flex items-center space-x-2", "data-id": "hhqvcw364", "data-path": "src/components/SalesReportSections/CashCollectionSection.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "w-5 h-5", "data-id": "xd3g6tv50", "data-path": "src/components/SalesReportSections/CashCollectionSection.tsx" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "iae9et2kd", "data-path": "src/components/SalesReportSections/CashCollectionSection.tsx", children: "Cash Collection" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", "data-id": "q8y6trpde", "data-path": "src/components/SalesReportSections/CashCollectionSection.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", "data-id": "gohpm80qi", "data-path": "src/components/SalesReportSections/CashCollectionSection.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "iekcjvesy", "data-path": "src/components/SalesReportSections/CashCollectionSection.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "cashOnHand", "data-id": "wq4t4tfd4", "data-path": "src/components/SalesReportSections/CashCollectionSection.tsx", children: "Cash Collection on Hand ($) *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            NumberInput,
            {
              id: "cashOnHand",
              value: values.cashCollectionOnHand,
              onChange: (value) => onChange("cashCollectionOnHand", value || 0),
              min: 0,
              step: 0.01,
              required: true,
              "data-id": "56xnb4q1a",
              "data-path": "src/components/SalesReportSections/CashCollectionSection.tsx"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-gray-600", "data-id": "af8w7pm07", "data-path": "src/components/SalesReportSections/CashCollectionSection.tsx", children: "Physical cash counted at end of shift" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "9kcg690fi", "data-path": "src/components/SalesReportSections/CashCollectionSection.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { "data-id": "jzbejnd0v", "data-path": "src/components/SalesReportSections/CashCollectionSection.tsx", children: "Expected Cash ($)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 px-3 py-2 border border-gray-200 rounded-md bg-gray-100 flex items-center", "data-id": "kamq1z5k9", "data-path": "src/components/SalesReportSections/CashCollectionSection.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-gray-700 font-medium", "data-id": "3hqtt6enp", "data-path": "src/components/SalesReportSections/CashCollectionSection.tsx", children: [
            "$",
            expectedCash.toFixed(2)
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-gray-600", "data-id": "6dhtfxg7m", "data-path": "src/components/SalesReportSections/CashCollectionSection.tsx", children: "Cash sales - Cash expenses" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "azrus5mli", "data-path": "src/components/SalesReportSections/CashCollectionSection.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { "data-id": "ufx835pcj", "data-path": "src/components/SalesReportSections/CashCollectionSection.tsx", children: "Total (+/-) Short/Over" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-10 px-3 py-2 border rounded-md flex items-center justify-between bg-white", "data-id": "iyxho6guo", "data-path": "src/components/SalesReportSections/CashCollectionSection.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `font-bold text-lg ${isShort ? "text-red-600" : isOver ? "text-green-600" : "text-gray-700"}`, "data-id": "c96gox6fv", "data-path": "src/components/SalesReportSections/CashCollectionSection.tsx", children: [
              "$",
              Math.abs(shortOver).toFixed(2)
            ] }),
            isShort && /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { className: "w-5 h-5 text-red-600", "data-id": "gdth30qoo", "data-path": "src/components/SalesReportSections/CashCollectionSection.tsx" }),
            isOver && /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-5 h-5 text-green-600", "data-id": "72chsswmc", "data-path": "src/components/SalesReportSections/CashCollectionSection.tsx" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-1", "data-id": "dsc0xmsym", "data-path": "src/components/SalesReportSections/CashCollectionSection.tsx", children: [
            isShort && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "destructive", className: "text-xs", "data-id": "24vmulrxa", "data-path": "src/components/SalesReportSections/CashCollectionSection.tsx", children: "Short" }),
            isOver && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-green-100 text-green-800 text-xs", "data-id": "9weqlvere", "data-path": "src/components/SalesReportSections/CashCollectionSection.tsx", children: "Over" }),
            !isShort && !isOver && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs", "data-id": "mo372y04t", "data-path": "src/components/SalesReportSections/CashCollectionSection.tsx", children: "Exact" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-4 border-t border-gray-200 bg-blue-50 rounded-lg p-4", "data-id": "ympokidez", "data-path": "src/components/SalesReportSections/CashCollectionSection.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-blue-800 space-y-2", "data-id": "pbb2nttqe", "data-path": "src/components/SalesReportSections/CashCollectionSection.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", "data-id": "b0vzcouye", "data-path": "src/components/SalesReportSections/CashCollectionSection.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "ylpybcqdv", "data-path": "src/components/SalesReportSections/CashCollectionSection.tsx", children: "Cash Sales:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium", "data-id": "qakitw5qn", "data-path": "src/components/SalesReportSections/CashCollectionSection.tsx", children: [
            "$",
            values.totalCashFromSales.toFixed(2)
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", "data-id": "r3j32iex8", "data-path": "src/components/SalesReportSections/CashCollectionSection.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "uvpqcnil2", "data-path": "src/components/SalesReportSections/CashCollectionSection.tsx", children: "Cash Expenses:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium", "data-id": "qs3dz0wzm", "data-path": "src/components/SalesReportSections/CashCollectionSection.tsx", children: [
            "-$",
            values.totalCashFromExpenses.toFixed(2)
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between border-t border-blue-200 pt-2 font-semibold", "data-id": "rlbrp814k", "data-path": "src/components/SalesReportSections/CashCollectionSection.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "byi0b7jzg", "data-path": "src/components/SalesReportSections/CashCollectionSection.tsx", children: "Expected Cash:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { "data-id": "6df1hrwj0", "data-path": "src/components/SalesReportSections/CashCollectionSection.tsx", children: [
            "$",
            expectedCash.toFixed(2)
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", "data-id": "v9190wohq", "data-path": "src/components/SalesReportSections/CashCollectionSection.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "vi7rxiek8", "data-path": "src/components/SalesReportSections/CashCollectionSection.tsx", children: "Actual Cash on Hand:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium", "data-id": "g1y326ojh", "data-path": "src/components/SalesReportSections/CashCollectionSection.tsx", children: [
            "$",
            values.cashCollectionOnHand.toFixed(2)
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex justify-between border-t border-blue-200 pt-2 font-bold ${isShort ? "text-red-600" : isOver ? "text-green-600" : "text-blue-800"}`, "data-id": "htux0asjd", "data-path": "src/components/SalesReportSections/CashCollectionSection.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "8wwbazsn7", "data-path": "src/components/SalesReportSections/CashCollectionSection.tsx", children: "Difference:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { "data-id": "09n355m2s", "data-path": "src/components/SalesReportSections/CashCollectionSection.tsx", children: [
            isShort ? "-" : "+",
            "$",
            Math.abs(shortOver).toFixed(2)
          ] })
        ] })
      ] }) })
    ] })
  ] });
};
function SalesReportForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast: toast2 } = useToast();
  const { user } = useAuth();
  const isEditing = !!id;
  const [selectedStation, setSelectedStation] = reactExports.useState("");
  const [employees, setEmployees] = reactExports.useState([]);
  const [isLoadingEmployees, setIsLoadingEmployees] = reactExports.useState(false);
  const [formData, setFormData] = reactExports.useState({
    report_date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    station: "",
    shift: "DAY",
    employee_name: "",
    employee_id: "",
    // Cash Collection
    cashCollectionOnHand: 0,
    // Gas & Grocery Sales
    creditCardAmount: 0,
    debitCardAmount: 0,
    mobileAmount: 0,
    cashAmount: 0,
    grocerySales: 0,
    ebtSales: 0,
    // MOBIL only
    // Separate Grocery Sales Breakdown Fields
    groceryCashSales: 0,
    groceryCreditDebitSales: 0,
    // Lottery
    lotteryNetSales: 0,
    scratchOffSales: 0,
    // Gas Tank Report
    regularGallons: 0,
    superGallons: 0,
    dieselGallons: 0,
    // Documents
    dayReportFileId: void 0,
    veederRootFileId: void 0,
    lottoReportFileId: void 0,
    scratchOffReportFileId: void 0,
    // Notes
    notes: ""
  });
  const [expenses, setExpenses] = reactExports.useState([]);
  reactExports.useEffect(() => {
    if (selectedStation) {
      setFormData((prev) => ({ ...prev, station: selectedStation }));
      loadEmployees(selectedStation);
    }
  }, [selectedStation]);
  reactExports.useEffect(() => {
    if (isEditing && id) {
      loadExistingReport();
    }
  }, [isEditing, id]);
  const loadExistingReport = async () => {
    try {
      const { data, error } = await supabase.from("daily_sales_reports_enhanced").select("*").eq("id", parseInt(id)).limit(1).single();
      if (error) throw error;
      if (data) {
        const report = data;
        setSelectedStation(report.station);
        setFormData({
          report_date: report.report_date.split("T")[0],
          station: report.station,
          shift: report.shift || "DAY",
          employee_name: report.employee_name,
          employee_id: report.employee_id || "",
          cashCollectionOnHand: report.cash_collection_on_hand,
          creditCardAmount: report.credit_card_amount,
          debitCardAmount: report.debit_card_amount,
          mobileAmount: report.mobile_amount,
          cashAmount: report.cash_amount,
          grocerySales: report.grocery_sales,
          ebtSales: report.ebt_sales,
          groceryCashSales: report.grocery_cash_sales || 0,
          groceryCreditDebitSales: report.grocery_credit_debit_sales || 0,
          lotteryNetSales: report.lottery_net_sales,
          scratchOffSales: report.scratch_off_sales,
          regularGallons: report.regular_gallons,
          superGallons: report.super_gallons,
          dieselGallons: report.diesel_gallons,
          dayReportFileId: report.day_report_file_id,
          veederRootFileId: report.veeder_root_file_id,
          lottoReportFileId: report.lotto_report_file_id,
          scratchOffReportFileId: report.scratch_off_report_file_id,
          notes: report.notes
        });
        if (report.expenses_data) {
          try {
            setExpenses(JSON.parse(report.expenses_data));
          } catch (e) {
            console.error("Error parsing expenses data:", e);
          }
        }
      }
    } catch (error) {
      console.error("Error loading report:", error);
      toast2({
        title: "Error",
        description: "Failed to load existing report",
        variant: "destructive"
      });
    }
  };
  const loadEmployees = async (station) => {
    setIsLoadingEmployees(true);
    try {
      const { data, error } = await supabase.from("employees").select("*").eq("station", station).eq("is_active", true).order("first_name", { ascending: true }).limit(100);
      if (error) throw error;
      setEmployees(data || []);
    } catch (error) {
      console.error("Error loading employees:", error);
      toast2({
        title: "Error",
        description: "Failed to load employees",
        variant: "destructive"
      });
    } finally {
      setIsLoadingEmployees(false);
    }
  };
  const totalSales = formData.creditCardAmount + formData.debitCardAmount + formData.mobileAmount + formData.cashAmount + formData.grocerySales;
  const totalGallons = formData.regularGallons + formData.superGallons + formData.dieselGallons;
  const totalLotteryCash = formData.lotteryNetSales + formData.scratchOffSales;
  const totalCashFromSales = formData.cashAmount + formData.grocerySales + formData.lotteryNetSales + formData.scratchOffSales;
  const totalCashFromExpenses = expenses.filter((e) => e.paymentType === "Cash").reduce((sum, expense) => sum + expense.amount, 0);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const requiredDocs = ["dayReportFileId", "veederRootFileId", "lottoReportFileId", "scratchOffReportFileId"];
    const missingDocs = requiredDocs.filter((doc) => !formData[doc]);
    if (missingDocs.length > 0) {
      toast2({
        title: "Missing Documents",
        description: "Please upload all required documents before submitting.",
        variant: "destructive"
      });
      return;
    }
    const expensesWithoutInvoices = expenses.filter((expense) => !expense.invoiceFileId);
    if (expensesWithoutInvoices.length > 0) {
      toast2({
        title: "Missing Invoices",
        description: "Please upload invoices for all expenses.",
        variant: "destructive"
      });
      return;
    }
    const submitData = {
      report_date: formData.report_date,
      station: formData.station,
      shift: formData.shift,
      employee_name: formData.employee_name,
      employee_id: formData.employee_id,
      cash_collection_on_hand: formData.cashCollectionOnHand,
      total_short_over: formData.cashCollectionOnHand - (totalCashFromSales - totalCashFromExpenses),
      credit_card_amount: formData.creditCardAmount,
      debit_card_amount: formData.debitCardAmount,
      mobile_amount: formData.mobileAmount,
      cash_amount: formData.cashAmount,
      grocery_sales: formData.grocerySales,
      ebt_sales: formData.ebtSales,
      grocery_cash_sales: formData.groceryCashSales,
      grocery_credit_debit_sales: formData.groceryCreditDebitSales,
      lottery_net_sales: formData.lotteryNetSales,
      scratch_off_sales: formData.scratchOffSales,
      lottery_total_cash: totalLotteryCash,
      regular_gallons: formData.regularGallons,
      super_gallons: formData.superGallons,
      diesel_gallons: formData.dieselGallons,
      total_gallons: totalGallons,
      expenses_data: JSON.stringify(expenses),
      day_report_file_id: formData.dayReportFileId,
      veeder_root_file_id: formData.veederRootFileId,
      lotto_report_file_id: formData.lottoReportFileId,
      scratch_off_report_file_id: formData.scratchOffReportFileId,
      total_sales: totalSales,
      notes: formData.notes,
      created_by: (user == null ? void 0 : user.ID) || 0
    };
    try {
      let result;
      if (isEditing) {
        result = await supabase.from("daily_sales_reports_enhanced").update(submitData).eq("id", parseInt(id));
      } else {
        result = await supabase.from("daily_sales_reports_enhanced").insert(submitData);
      }
      if (result.error) {
        throw new Error(result.error.message);
      }
      toast2({
        title: isEditing ? "Report Updated" : "Report Created",
        description: `Sales report has been ${isEditing ? "updated" : "created"} successfully.`
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Error saving report:", error);
      toast2({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save report",
        variant: "destructive"
      });
    }
  };
  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const handleExpensesChange = (newExpenses) => {
    setExpenses(newExpenses);
  };
  const handleDocumentUpload = (field, fileId) => {
    setFormData((prev) => ({ ...prev, [field]: fileId }));
  };
  if (!selectedStation) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4", "data-id": "1992jutk5", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto", "data-id": "82dt9nypj", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", "data-id": "jivcyb8vs", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            onClick: () => navigate("/dashboard"),
            className: "mb-4",
            "data-id": "w52u7b3r0",
            "data-path": "src/pages/Sales/SalesReportForm.tsx",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4 mr-2", "data-id": "ojxr86pdk", "data-path": "src/pages/Sales/SalesReportForm.tsx" }),
              "Back to Reports"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold text-gray-900", "data-id": "vb18xna1a", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: "Create Daily Sales Report" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-600 mt-2", "data-id": "sv6mr3t55", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: "Step 1: Select your station to begin" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StationSelector, { onStationSelect: setSelectedStation, "data-id": "tpjxqwze1", "data-path": "src/pages/Sales/SalesReportForm.tsx" })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4", "data-id": "m7nm6l53p", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto", "data-id": "5qpv8vavd", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", "data-id": "y8n71nuuj", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          onClick: () => setSelectedStation(""),
          className: "mb-4",
          "data-id": "po9lifn3h",
          "data-path": "src/pages/Sales/SalesReportForm.tsx",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4 mr-2", "data-id": "c6zowg5yd", "data-path": "src/pages/Sales/SalesReportForm.tsx" }),
            "Change Station"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "2v555ol5c", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-3xl font-bold text-gray-900", "data-id": "9cdzibt1d", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: [
          isEditing ? "Edit" : "Create",
          " Daily Sales Report"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-gray-600 mt-2", "data-id": "dtwr1sknr", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: [
          "Station: ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", "data-id": "myzyy8d0s", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: selectedStation })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", "data-id": "r0ffml9nv", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "vix9niv3v", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "0movlh0ur", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-lg", "data-id": "ly7wzb4l7", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: "Basic Information" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { "data-id": "p3n0b2yq6", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6", "data-id": "wvm9onl7p", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "lrga58nld", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "report_date", "data-id": "banmg5c89", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: "Report Date *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "date",
                id: "report_date",
                value: formData.report_date,
                onChange: (e) => updateFormData("report_date", e.target.value),
                required: true,
                "data-id": "i8sgiah32",
                "data-path": "src/pages/Sales/SalesReportForm.tsx"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "jfhtjka0j", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { "data-id": "a1hzoaa7q", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: "Station" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 px-3 py-2 border border-gray-200 rounded-md bg-gray-100 flex items-center", "data-id": "78x8zy248", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-700 font-medium", "data-id": "fgubkl08c", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: selectedStation }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "c4xhoh3w0", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "shift", "data-id": "5wzhywn5c", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: "Shift *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: formData.shift,
                onValueChange: (value) => updateFormData("shift", value),
                "data-id": "3jt27s11c",
                "data-path": "src/pages/Sales/SalesReportForm.tsx",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-id": "ukpmiw248", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select shift", "data-id": "7x905gyno", "data-path": "src/pages/Sales/SalesReportForm.tsx" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { "data-id": "c45thqsal", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "DAY", "data-id": "9kzbwh9fw", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: "DAY" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "NIGHT", "data-id": "m4ji8msys", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: "NIGHT" })
                  ] })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "zypr5hqay", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "employee", "data-id": "ijii3lo44", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: "Employee Name *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: formData.employee_id,
                onValueChange: (value) => {
                  const selectedEmployee = employees.find((emp) => emp.employee_id === value);
                  if (selectedEmployee) {
                    updateFormData("employee_id", value);
                    updateFormData("employee_name", `${selectedEmployee.first_name} ${selectedEmployee.last_name}`);
                  }
                },
                disabled: isLoadingEmployees,
                "data-id": "bef6k6k5c",
                "data-path": "src/pages/Sales/SalesReportForm.tsx",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-id": "3zvu2xa3w", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: isLoadingEmployees ? "Loading employees..." : "Select employee", "data-id": "zdaor99vr", "data-path": "src/pages/Sales/SalesReportForm.tsx" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { "data-id": "p4h3ka3tm", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: employees.map(
                    (employee) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: employee.employee_id, "data-id": "jtjprmlro", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: [
                      employee.first_name,
                      " ",
                      employee.last_name,
                      " (ID: ",
                      employee.employee_id,
                      ")"
                    ] }, employee.id)
                  ) })
                ]
              }
            )
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        CashCollectionSection,
        {
          values: {
            cashCollectionOnHand: formData.cashCollectionOnHand,
            totalCashFromSales,
            totalCashFromExpenses
          },
          onChange: updateFormData,
          "data-id": "uxwy7v32k",
          "data-path": "src/pages/Sales/SalesReportForm.tsx"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        GasGrocerySalesSection,
        {
          station: selectedStation,
          values: {
            creditCardAmount: formData.creditCardAmount,
            debitCardAmount: formData.debitCardAmount,
            mobileAmount: formData.mobileAmount,
            cashAmount: formData.cashAmount,
            grocerySales: formData.grocerySales,
            ebtSales: formData.ebtSales,
            groceryCashSales: formData.groceryCashSales,
            groceryCreditDebitSales: formData.groceryCreditDebitSales
          },
          onChange: updateFormData,
          "data-id": "su4yecnsb",
          "data-path": "src/pages/Sales/SalesReportForm.tsx"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        LotterySalesSection,
        {
          values: {
            lotteryNetSales: formData.lotteryNetSales,
            scratchOffSales: formData.scratchOffSales
          },
          onChange: updateFormData,
          "data-id": "as7nxntuu",
          "data-path": "src/pages/Sales/SalesReportForm.tsx"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        GasTankReportSection,
        {
          values: {
            regularGallons: formData.regularGallons,
            superGallons: formData.superGallons,
            dieselGallons: formData.dieselGallons
          },
          onChange: updateFormData,
          "data-id": "jzuwg6nf6",
          "data-path": "src/pages/Sales/SalesReportForm.tsx"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        ExpensesSection,
        {
          expenses,
          onChange: handleExpensesChange,
          "data-id": "92wy5v4kp",
          "data-path": "src/pages/Sales/SalesReportForm.tsx"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        DocumentsUploadSection,
        {
          documents: {
            dayReportFileId: formData.dayReportFileId,
            veederRootFileId: formData.veederRootFileId,
            lottoReportFileId: formData.lottoReportFileId,
            scratchOffReportFileId: formData.scratchOffReportFileId
          },
          onChange: handleDocumentUpload,
          "data-id": "touqzwt68",
          "data-path": "src/pages/Sales/SalesReportForm.tsx"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "lzjrn4c1g", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "nrxxc2jqk", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-lg", "data-id": "6duge341e", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: "Additional Notes" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { "data-id": "21hj4k0li", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "6c1u5rtss", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "notes", "data-id": "ndiaylsan", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: "Notes" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              id: "notes",
              value: formData.notes,
              onChange: (e) => updateFormData("notes", e.target.value),
              placeholder: "Enter any additional notes about the day's operations...",
              rows: 4,
              "data-id": "zhr37xift",
              "data-path": "src/pages/Sales/SalesReportForm.tsx"
            }
          )
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200", "data-id": "c2heb41n4", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "i74zo007n", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-blue-800", "data-id": "72b0pfnyh", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: "Report Summary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { "data-id": "ssy71e617", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", "data-id": "jkused2y4", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", "data-id": "hnvz53fyb", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-2xl font-bold text-blue-800", "data-id": "0yddfgqps", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: [
              "$",
              totalSales.toFixed(2)
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-gray-600", "data-id": "g5ijmhke7", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: "Total Sales" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", "data-id": "5a1xo5a2p", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-green-800", "data-id": "w0dbzs1bn", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: totalGallons.toFixed(2) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-gray-600", "data-id": "z6k7tdfuk", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: "Total Gallons" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", "data-id": "b7hag1ylu", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-2xl font-bold text-purple-800", "data-id": "1255hs8zm", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: [
              "$",
              totalLotteryCash.toFixed(2)
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-gray-600", "data-id": "649589f1a", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: "Lottery Sales" })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end space-x-4 pt-6", "data-id": "xlhvwoxkm", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            onClick: () => navigate("/dashboard"),
            "data-id": "eef649rx4",
            "data-path": "src/pages/Sales/SalesReportForm.tsx",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", className: "bg-blue-600 hover:bg-blue-700", "data-id": "ijhupfqu1", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-4 h-4 mr-2", "data-id": "7olp2zhiu", "data-path": "src/pages/Sales/SalesReportForm.tsx" }),
          isEditing ? "Update" : "Create",
          " Report"
        ] })
      ] })
    ] })
  ] }) });
}
const SalesReportForm$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: SalesReportForm
}, Symbol.toStringTag, { value: "Module" }));
const OrderList = () => {
  const [orders, setOrders] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [searchTerm, setSearchTerm] = reactExports.useState("");
  const [currentPage, setCurrentPage] = reactExports.useState(1);
  const [totalCount, setTotalCount] = reactExports.useState(0);
  const [selectedOrderId, setSelectedOrderId] = reactExports.useState(null);
  const [viewModalOpen, setViewModalOpen] = reactExports.useState(false);
  const [selectedOrder, setSelectedOrder] = reactExports.useState(null);
  const navigate = useNavigate();
  const pageSize = 10;
  reactExports.useEffect(() => {
    loadOrders();
  }, [currentPage, searchTerm]);
  const loadOrders = async () => {
    try {
      setLoading(true);
      let query = supabase.from("orders").select("*", { count: "exact" }).order("order_date", { ascending: false });
      if (searchTerm) {
        query = query.ilike("order_number", `%${searchTerm}%`);
      }
      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);
      const { data, count, error } = await query;
      if (error) throw error;
      setOrders(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error("Error loading orders:", error);
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const handleView = (order) => {
    setSelectedOrder(order);
    setSelectedOrderId(order.ID);
    setViewModalOpen(true);
  };
  const handleEdit = (orderId) => {
    navigate(`/orders/edit/${orderId}`);
  };
  const handleDelete = async (orderId) => {
    if (!confirm("Are you sure you want to delete this order?")) {
      return;
    }
    try {
      const { error } = await supabase.from("orders").delete().eq("id", orderId);
      if (error) throw error;
      toast({
        title: "Success",
        description: "Order deleted successfully"
      });
      loadOrders();
      setViewModalOpen(false);
    } catch (error) {
      console.error("Error deleting order:", error);
      toast({
        title: "Error",
        description: "Failed to delete order",
        variant: "destructive"
      });
    }
  };
  const handleExport = () => {
    if (!selectedOrder) return;
    const csvContent = [
      "Field,Value",
      `Order Number,${selectedOrder.order_number}`,
      `Vendor ID,${selectedOrder.vendor_id}`,
      `Order Date,${selectedOrder.order_date}`,
      `Expected Delivery,${selectedOrder.expected_delivery}`,
      `Station,${selectedOrder.station}`,
      `Total Amount,${selectedOrder.total_amount}`,
      `Status,${selectedOrder.status}`,
      `Notes,${selectedOrder.notes}`
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `order_${selectedOrder.order_number}_details.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast({
      title: "Success",
      description: "Order details exported successfully"
    });
  };
  useListKeyboardShortcuts(
    selectedOrderId,
    (id) => {
      const order = orders.find((o) => o.ID === id);
      if (order) handleView(order);
    },
    handleEdit,
    handleDelete,
    () => navigate("/orders/new")
  );
  const getStatusBadgeColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-500";
      case "approved":
        return "bg-blue-500";
      case "shipped":
        return "bg-purple-500";
      case "delivered":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };
  const getStationBadgeColor = (station) => {
    switch (station.toUpperCase()) {
      case "MOBIL":
        return "bg-blue-600";
      case "AMOCO ROSEDALE":
        return "bg-green-600";
      case "AMOCO BROOKLYN":
        return "bg-purple-600";
      default:
        return "bg-gray-600";
    }
  };
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(amount);
  };
  const totalPages = Math.ceil(totalCount / pageSize);
  const totals = orders.reduce((acc, order) => ({
    total_amount: acc.total_amount + (order.total_amount || 0),
    pending_orders: acc.pending_orders + (order.status.toLowerCase() === "pending" ? 1 : 0),
    delivered_orders: acc.delivered_orders + (order.status.toLowerCase() === "delivered" ? 1 : 0)
  }), {
    total_amount: 0,
    pending_orders: 0,
    delivered_orders: 0
  });
  const getViewModalFields = (order) => [
    {
      key: "order_number",
      label: "Order Number",
      value: order.order_number,
      type: "text",
      icon: FileText
    },
    {
      key: "vendor_id",
      label: "Vendor ID",
      value: order.vendor_id,
      type: "number"
    },
    {
      key: "order_date",
      label: "Order Date",
      value: order.order_date,
      type: "date"
    },
    {
      key: "expected_delivery",
      label: "Expected Delivery",
      value: order.expected_delivery,
      type: "date"
    },
    {
      key: "station",
      label: "Station",
      value: order.station,
      type: "badge",
      badgeColor: getStationBadgeColor(order.station)
    },
    {
      key: "total_amount",
      label: "Total Amount",
      value: order.total_amount,
      type: "currency"
    },
    {
      key: "status",
      label: "Status",
      value: order.status,
      type: "badge",
      badgeColor: getStatusBadgeColor(order.status)
    },
    {
      key: "notes",
      label: "Notes",
      value: order.notes,
      type: "text"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-id": "67r1zc9tj", "data-path": "src/pages/Orders/OrderList.tsx", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", "data-id": "3cscsoext", "data-path": "src/pages/Orders/OrderList.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-id": "a3gj6bo4f", "data-path": "src/pages/Orders/OrderList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-6", "data-id": "sm65cnbop", "data-path": "src/pages/Orders/OrderList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", "data-id": "gi9fg0bs6", "data-path": "src/pages/Orders/OrderList.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "w-8 h-8 text-green-600", "data-id": "f6krppjbe", "data-path": "src/pages/Orders/OrderList.tsx" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "huhjtfmzn", "data-path": "src/pages/Orders/OrderList.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-gray-600", "data-id": "o8yidfrvg", "data-path": "src/pages/Orders/OrderList.tsx", children: "Total Order Value" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold", "data-id": "nlbts1wbv", "data-path": "src/pages/Orders/OrderList.tsx", children: formatCurrency(totals.total_amount) })
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-id": "t6uwtmx4o", "data-path": "src/pages/Orders/OrderList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-6", "data-id": "331978kg6", "data-path": "src/pages/Orders/OrderList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", "data-id": "3js950h40", "data-path": "src/pages/Orders/OrderList.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-8 h-8 text-yellow-600", "data-id": "45sc5thi7", "data-path": "src/pages/Orders/OrderList.tsx" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "l0tr6sn1f", "data-path": "src/pages/Orders/OrderList.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-gray-600", "data-id": "vf0daqftg", "data-path": "src/pages/Orders/OrderList.tsx", children: "Pending Orders" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold", "data-id": "majya5yey", "data-path": "src/pages/Orders/OrderList.tsx", children: totals.pending_orders })
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-id": "o4yokkov9", "data-path": "src/pages/Orders/OrderList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-6", "data-id": "dnpqti81m", "data-path": "src/pages/Orders/OrderList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", "data-id": "73ks6g49l", "data-path": "src/pages/Orders/OrderList.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "w-8 h-8 text-green-600", "data-id": "kminb79gr", "data-path": "src/pages/Orders/OrderList.tsx" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "haywzfyua", "data-path": "src/pages/Orders/OrderList.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-gray-600", "data-id": "m8tyoxu35", "data-path": "src/pages/Orders/OrderList.tsx", children: "Delivered Orders" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold", "data-id": "bl0233x3y", "data-path": "src/pages/Orders/OrderList.tsx", children: totals.delivered_orders })
        ] })
      ] }) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "9w4zoozwx", "data-path": "src/pages/Orders/OrderList.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "u5nqhobgv", "data-path": "src/pages/Orders/OrderList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "bajj06erg", "data-path": "src/pages/Orders/OrderList.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "g4e1kans2", "data-path": "src/pages/Orders/OrderList.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center space-x-2", "data-id": "tn0i9t31w", "data-path": "src/pages/Orders/OrderList.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "w-6 h-6", "data-id": "mb0q8vqyi", "data-path": "src/pages/Orders/OrderList.tsx" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "xva3lr5us", "data-path": "src/pages/Orders/OrderList.tsx", children: "Orders" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { "data-id": "33n0ohwcq", "data-path": "src/pages/Orders/OrderList.tsx", children: "Manage your purchase orders and deliveries" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => navigate("/orders/new"), className: "flex items-center space-x-2", "data-id": "oois18u7s", "data-path": "src/pages/Orders/OrderList.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4", "data-id": "q4pqo4ih0", "data-path": "src/pages/Orders/OrderList.tsx" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "uh1jjg8x1", "data-path": "src/pages/Orders/OrderList.tsx", children: "Create Order" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { "data-id": "kkqzkbzsp", "data-path": "src/pages/Orders/OrderList.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center space-x-2 mb-6", "data-id": "6ewdsk20j", "data-path": "src/pages/Orders/OrderList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 max-w-sm", "data-id": "eetiqs9vq", "data-path": "src/pages/Orders/OrderList.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4", "data-id": "j6k05o7xf", "data-path": "src/pages/Orders/OrderList.tsx" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              placeholder: "Search orders...",
              value: searchTerm,
              onChange: (e) => setSearchTerm(e.target.value),
              className: "pl-10",
              "data-id": "ebbq6bhr4",
              "data-path": "src/pages/Orders/OrderList.tsx"
            }
          )
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg", "data-id": "osw6fwg6j", "data-path": "src/pages/Orders/OrderList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-blue-700", "data-id": "2djz0fpuh", "data-path": "src/pages/Orders/OrderList.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { "data-id": "0sdptbf8c", "data-path": "src/pages/Orders/OrderList.tsx", children: "Keyboard shortcuts:" }),
          " Select a row, then press ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { className: "px-1 py-0.5 bg-blue-100 rounded text-xs", "data-id": "00q3h59z2", "data-path": "src/pages/Orders/OrderList.tsx", children: "V" }),
          " to view,",
          /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { className: "px-1 py-0.5 bg-blue-100 rounded text-xs ml-1", "data-id": "ilv8gs0ol", "data-path": "src/pages/Orders/OrderList.tsx", children: "E" }),
          " to edit,",
          /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { className: "px-1 py-0.5 bg-blue-100 rounded text-xs ml-1", "data-id": "w5rqf67ic", "data-path": "src/pages/Orders/OrderList.tsx", children: "D" }),
          " to delete, or",
          /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { className: "px-1 py-0.5 bg-blue-100 rounded text-xs ml-1", "data-id": "48qskiazf", "data-path": "src/pages/Orders/OrderList.tsx", children: "Ctrl+N" }),
          " to create new"
        ] }) }),
        loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", "data-id": "nf8jutl77", "data-path": "src/pages/Orders/OrderList.tsx", children: [...Array(5)].map(
          (_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 bg-gray-100 rounded animate-pulse", "data-id": "rs581dmoz", "data-path": "src/pages/Orders/OrderList.tsx" }, i)
        ) }) : orders.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-8", "data-id": "b6dvt9xpz", "data-path": "src/pages/Orders/OrderList.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "w-12 h-12 text-gray-400 mx-auto mb-4", "data-id": "h3mwa6k2m", "data-path": "src/pages/Orders/OrderList.tsx" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500", "data-id": "4q6cyxoe3", "data-path": "src/pages/Orders/OrderList.tsx", children: "No orders found" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              className: "mt-4",
              onClick: () => navigate("/orders/new"),
              "data-id": "3khn9oet9",
              "data-path": "src/pages/Orders/OrderList.tsx",
              children: "Create Your First Order"
            }
          )
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border rounded-lg overflow-hidden", "data-id": "nsa2rgbtv", "data-path": "src/pages/Orders/OrderList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { "data-id": "hlif6kk59", "data-path": "src/pages/Orders/OrderList.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { "data-id": "fapyqz2ju", "data-path": "src/pages/Orders/OrderList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { "data-id": "9hzudae8s", "data-path": "src/pages/Orders/OrderList.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "gmp0756bx", "data-path": "src/pages/Orders/OrderList.tsx", children: "Order Number" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "g5ahy226w", "data-path": "src/pages/Orders/OrderList.tsx", children: "Order Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "bq92vxafb", "data-path": "src/pages/Orders/OrderList.tsx", children: "Station" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "ifzmarrym", "data-path": "src/pages/Orders/OrderList.tsx", children: "Total Amount" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "254niljm7", "data-path": "src/pages/Orders/OrderList.tsx", children: "Expected Delivery" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "h00n713wf", "data-path": "src/pages/Orders/OrderList.tsx", children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "nszm8emh9", "data-path": "src/pages/Orders/OrderList.tsx", children: "Actions" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { "data-id": "ar4epdfvy", "data-path": "src/pages/Orders/OrderList.tsx", children: orders.map(
            (order, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.tr,
              {
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                transition: { delay: index * 0.05 },
                className: `border-b hover:bg-gray-50 transition-colors cursor-pointer ${selectedOrderId === order.ID ? "bg-blue-50 border-blue-200" : ""}`,
                onClick: () => setSelectedOrderId(order.ID),
                "data-id": "jp7axzmmv",
                "data-path": "src/pages/Orders/OrderList.tsx",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "font-medium", "data-id": "j08vmzeid", "data-path": "src/pages/Orders/OrderList.tsx", children: [
                    order.order_number,
                    order.notes && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500 truncate max-w-xs mt-1", "data-id": "ngucv7x8q", "data-path": "src/pages/Orders/OrderList.tsx", children: order.notes })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "t0r1j2f9g", "data-path": "src/pages/Orders/OrderList.tsx", children: formatDate(order.order_date) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "t55237rv0", "data-path": "src/pages/Orders/OrderList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: `text-white ${getStationBadgeColor(order.station)}`, "data-id": "ovz9m8gg1", "data-path": "src/pages/Orders/OrderList.tsx", children: order.station }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", "data-id": "dieptlvpb", "data-path": "src/pages/Orders/OrderList.tsx", children: formatCurrency(order.total_amount) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "qukhjph7u", "data-path": "src/pages/Orders/OrderList.tsx", children: formatDate(order.expected_delivery) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "wmkor2out", "data-path": "src/pages/Orders/OrderList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: `text-white ${getStatusBadgeColor(order.status)}`, "data-id": "9bzkxu4ua", "data-path": "src/pages/Orders/OrderList.tsx", children: order.status }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "x1u09itp4", "data-path": "src/pages/Orders/OrderList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", "data-id": "8at5ajkyu", "data-path": "src/pages/Orders/OrderList.tsx", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        variant: "outline",
                        size: "sm",
                        onClick: (e) => {
                          e.stopPropagation();
                          handleView(order);
                        },
                        className: "text-blue-600 hover:text-blue-700",
                        "data-id": "ogkduhsv6",
                        "data-path": "src/pages/Orders/OrderList.tsx",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-4 h-4", "data-id": "8yqu3ji25", "data-path": "src/pages/Orders/OrderList.tsx" })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        variant: "outline",
                        size: "sm",
                        onClick: (e) => {
                          e.stopPropagation();
                          handleEdit(order.ID);
                        },
                        "data-id": "q9k1s24bq",
                        "data-path": "src/pages/Orders/OrderList.tsx",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { className: "w-4 h-4", "data-id": "adqp2h0je", "data-path": "src/pages/Orders/OrderList.tsx" })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        variant: "outline",
                        size: "sm",
                        onClick: (e) => {
                          e.stopPropagation();
                          handleDelete(order.ID);
                        },
                        className: "text-red-600 hover:text-red-700",
                        "data-id": "laps7j8v9",
                        "data-path": "src/pages/Orders/OrderList.tsx",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4", "data-id": "ml8i88t9n", "data-path": "src/pages/Orders/OrderList.tsx" })
                      }
                    )
                  ] }) })
                ]
              },
              order.ID
            )
          ) })
        ] }) }),
        totalPages > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-6", "data-id": "343lopjlo", "data-path": "src/pages/Orders/OrderList.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-gray-700", "data-id": "dil50xp8f", "data-path": "src/pages/Orders/OrderList.tsx", children: [
            "Showing ",
            (currentPage - 1) * pageSize + 1,
            " to ",
            Math.min(currentPage * pageSize, totalCount),
            " of ",
            totalCount,
            " orders"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", "data-id": "mog6zv672", "data-path": "src/pages/Orders/OrderList.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: () => setCurrentPage((prev) => Math.max(prev - 1, 1)),
                disabled: currentPage === 1,
                "data-id": "qicxpnd15",
                "data-path": "src/pages/Orders/OrderList.tsx",
                children: "Previous"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm", "data-id": "g5rzac5h2", "data-path": "src/pages/Orders/OrderList.tsx", children: [
              "Page ",
              currentPage,
              " of ",
              totalPages
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: () => setCurrentPage((prev) => Math.min(prev + 1, totalPages)),
                disabled: currentPage === totalPages,
                "data-id": "hw2f6u6nc",
                "data-path": "src/pages/Orders/OrderList.tsx",
                children: "Next"
              }
            )
          ] })
        ] })
      ] })
    ] }),
    selectedOrder && /* @__PURE__ */ jsxRuntimeExports.jsx(
      ViewModal,
      {
        isOpen: viewModalOpen,
        onClose: () => {
          setViewModalOpen(false);
          setSelectedOrder(null);
          setSelectedOrderId(null);
        },
        title: `Order #${selectedOrder.order_number}`,
        subtitle: `${selectedOrder.station} • ${formatCurrency(selectedOrder.total_amount)} • ${selectedOrder.status}`,
        data: selectedOrder,
        fields: getViewModalFields(selectedOrder),
        onEdit: () => {
          setViewModalOpen(false);
          handleEdit(selectedOrder.ID);
        },
        onDelete: () => handleDelete(selectedOrder.ID),
        onExport: handleExport,
        canEdit: true,
        canDelete: true,
        canExport: true,
        "data-id": "exw24pupy",
        "data-path": "src/pages/Orders/OrderList.tsx"
      }
    )
  ] });
};
const OrderList$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: OrderList
}, Symbol.toStringTag, { value: "Module" }));
const ProductSearchBar = ({
  onProductSelect,
  placeholder = "Search products by name, code, category, or supplier...",
  showAllProducts = true
}) => {
  const [searchTerm, setSearchTerm] = reactExports.useState("");
  const [allProducts, setAllProducts] = reactExports.useState([]);
  const [filteredProducts, setFilteredProducts] = reactExports.useState([]);
  const [isLoading, setIsLoading] = reactExports.useState(false);
  const [showResults, setShowResults] = reactExports.useState(false);
  const searchRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (showAllProducts) {
      loadAllProducts();
    }
  }, [showAllProducts]);
  reactExports.useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProducts(showAllProducts ? allProducts : []);
      setShowResults(showAllProducts && allProducts.length > 0);
    } else {
      const filtered = allProducts.filter(
        (product) => product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) || product.product_code.toLowerCase().includes(searchTerm.toLowerCase()) || product.category.toLowerCase().includes(searchTerm.toLowerCase()) || product.supplier.toLowerCase().includes(searchTerm.toLowerCase()) || product.description.toLowerCase().includes(searchTerm.toLowerCase()) || product.bar_code_case.toLowerCase().includes(searchTerm.toLowerCase()) || product.bar_code_unit.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
      setShowResults(filtered.length > 0);
    }
  }, [searchTerm, allProducts, showAllProducts]);
  reactExports.useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const loadAllProducts = async () => {
    try {
      setIsLoading(true);
      console.log("Loading all products from products table...");
      const { data, error } = await window.ezsite.apis.tablePage("11726", {
        PageNo: 1,
        PageSize: 1e3,
        // Load a large number to get all products
        OrderByField: "product_name",
        IsAsc: true,
        Filters: []
      });
      if (error) throw error;
      const products = (data == null ? void 0 : data.List) || [];
      console.log(`Loaded ${products.length} products:`, products);
      setAllProducts(products);
      setFilteredProducts(products);
      if (products.length === 0) {
        toast({
          title: "No Products Found",
          description: "No products are available in the database.",
          variant: "default"
        });
      }
    } catch (error) {
      console.error("Error loading products:", error);
      toast({
        title: "Error Loading Products",
        description: "Failed to load products from database",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  const refreshProducts = () => {
    loadAllProducts();
  };
  const handleProductClick = (product) => {
    console.log("Product selected:", product);
    onProductSelect(product);
    setSearchTerm("");
    setShowResults(false);
  };
  const clearSearch = () => {
    setSearchTerm("");
    setFilteredProducts(showAllProducts ? allProducts : []);
    setShowResults(showAllProducts && allProducts.length > 0);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-2 border-dashed border-blue-300 hover:border-blue-500 transition-colors", "data-id": "g5aapaj5l", "data-path": "src/components/ProductSearchBar.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-6", "data-id": "0dg4ig1c8", "data-path": "src/components/ProductSearchBar.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-4", "data-id": "pxnppmhjt", "data-path": "src/components/ProductSearchBar.tsx", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center space-x-3", "data-id": "k0udpw13l", "data-path": "src/components/ProductSearchBar.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "w-12 h-12 text-blue-600", "data-id": "hua23f09o", "data-path": "src/components/ProductSearchBar.tsx" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          onClick: refreshProducts,
          variant: "outline",
          size: "sm",
          disabled: isLoading,
          className: "flex items-center space-x-2",
          "data-id": "4ozqzhpjo",
          "data-path": "src/components/ProductSearchBar.tsx",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: `w-4 h-4 ${isLoading ? "animate-spin" : ""}`, "data-id": "rp0mw1wm5", "data-path": "src/components/ProductSearchBar.tsx" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "a8rts4kzn", "data-path": "src/components/ProductSearchBar.tsx", children: "Refresh" })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold", "data-id": "od3gwi05q", "data-path": "src/components/ProductSearchBar.tsx", children: "Product Search & Browse" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", "data-id": "qenlo9hg0", "data-path": "src/components/ProductSearchBar.tsx", children: "Search products by name, code, category, supplier, or browse all available products" }),
    allProducts.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-green-600 font-medium", "data-id": "glpqz0sf8", "data-path": "src/components/ProductSearchBar.tsx", children: [
      filteredProducts.length,
      " of ",
      allProducts.length,
      " products shown"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: searchRef, className: "relative w-full max-w-md mx-auto", "data-id": "bj0557zwz", "data-path": "src/components/ProductSearchBar.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", "data-id": "eau87h1pa", "data-path": "src/components/ProductSearchBar.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            type: "text",
            value: searchTerm,
            onChange: (e) => setSearchTerm(e.target.value),
            placeholder,
            className: "pr-20",
            onFocus: () => setShowResults(filteredProducts.length > 0),
            "data-id": "mrbvr6cc1",
            "data-path": "src/components/ProductSearchBar.tsx"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1", "data-id": "grm69ggch", "data-path": "src/components/ProductSearchBar.tsx", children: [
          isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600", "data-id": "rrxeu6o98", "data-path": "src/components/ProductSearchBar.tsx" }),
          searchTerm && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "ghost",
              size: "sm",
              onClick: clearSearch,
              className: "h-6 w-6 p-0",
              "data-id": "u9ce05z8k",
              "data-path": "src/components/ProductSearchBar.tsx",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3", "data-id": "7dcehphi5", "data-path": "src/components/ProductSearchBar.tsx" })
            }
          )
        ] })
      ] }),
      showResults && filteredProducts.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-96 overflow-y-auto", "data-id": "g5qz9ufqj", "data-path": "src/components/ProductSearchBar.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sticky top-0 bg-gray-50 px-3 py-2 border-b border-gray-200", "data-id": "e9gus1pyx", "data-path": "src/components/ProductSearchBar.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-gray-600 font-medium", "data-id": "nbmifyuja", "data-path": "src/components/ProductSearchBar.tsx", children: [
          filteredProducts.length,
          " product",
          filteredProducts.length !== 1 ? "s" : "",
          " found"
        ] }) }),
        filteredProducts.map(
          (product) => {
            var _a, _b;
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors",
                onClick: () => handleProductClick(product),
                "data-id": "zfwho4sf6",
                "data-path": "src/components/ProductSearchBar.tsx",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-start justify-between", "data-id": "4w0fdliip", "data-path": "src/components/ProductSearchBar.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", "data-id": "4x6e6knhi", "data-path": "src/components/ProductSearchBar.tsx", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", "data-id": "i8o4rwa9j", "data-path": "src/components/ProductSearchBar.tsx", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "w-4 h-4 text-blue-600 flex-shrink-0", "data-id": "zdnae8a33", "data-path": "src/components/ProductSearchBar.tsx" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-medium text-sm truncate", "data-id": "0duvr0t1s", "data-path": "src/components/ProductSearchBar.tsx", children: product.product_name })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1", "data-id": "z4b9a5stw", "data-path": "src/components/ProductSearchBar.tsx", children: [
                    "Code: ",
                    product.product_code,
                    " | Category: ",
                    product.category,
                    " | Supplier: ",
                    product.supplier
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-2", "data-id": "m9k4jgvl3", "data-path": "src/components/ProductSearchBar.tsx", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", "data-id": "rz7slpafx", "data-path": "src/components/ProductSearchBar.tsx", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-green-600 font-medium", "data-id": "x7opkvdm1", "data-path": "src/components/ProductSearchBar.tsx", children: [
                        "Cost: $",
                        ((_a = product.price) == null ? void 0 : _a.toFixed(2)) || "0.00"
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-blue-600 font-medium", "data-id": "7tkk80rgz", "data-path": "src/components/ProductSearchBar.tsx", children: [
                        "Retail: $",
                        ((_b = product.retail_price) == null ? void 0 : _b.toFixed(2)) || "0.00"
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", "data-id": "sib1smq5h", "data-path": "src/components/ProductSearchBar.tsx", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `text-xs font-medium ${product.quantity_in_stock <= product.minimum_stock ? "text-red-600" : product.quantity_in_stock <= product.minimum_stock * 2 ? "text-yellow-600" : "text-green-600"}`, "data-id": "r2jxkwx9g", "data-path": "src/components/ProductSearchBar.tsx", children: [
                        "Stock: ",
                        product.quantity_in_stock
                      ] }),
                      product.quantity_in_stock <= product.minimum_stock && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs bg-red-100 text-red-700 px-1 py-0.5 rounded", "data-id": "i1sz59pam", "data-path": "src/components/ProductSearchBar.tsx", children: "Low Stock" })
                    ] })
                  ] }),
                  product.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500 mt-1 line-clamp-1", "data-id": "oftd8j0pe", "data-path": "src/components/ProductSearchBar.tsx", children: product.description })
                ] }) })
              },
              product.ID
            );
          }
        )
      ] }),
      searchTerm && filteredProducts.length === 0 && !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 p-4 text-center", "data-id": "63v26nytu", "data-path": "src/components/ProductSearchBar.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", "data-id": "b7lj3vtpj", "data-path": "src/components/ProductSearchBar.tsx", children: [
          'No products found matching "',
          searchTerm,
          '"'
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400 mt-1", "data-id": "9zswd0xzv", "data-path": "src/components/ProductSearchBar.tsx", children: "Try searching by product name, code, category, or supplier" })
      ] }),
      isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 p-4 text-center", "data-id": "4tnsh86d6", "data-path": "src/components/ProductSearchBar.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center space-x-2", "data-id": "1p1s4bk36", "data-path": "src/components/ProductSearchBar.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600", "data-id": "rm58ycfuk", "data-path": "src/components/ProductSearchBar.tsx" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", "data-id": "ewdc5jwy3", "data-path": "src/components/ProductSearchBar.tsx", children: "Loading products..." })
      ] }) })
    ] })
  ] }) }) });
};
const ProductSelectionDialog = ({
  isOpen,
  onClose,
  product,
  onConfirm
}) => {
  const [quantity, setQuantity] = reactExports.useState(1);
  const [unitType, setUnitType] = reactExports.useState("pieces");
  const unitTypes = [
    { value: "pieces", label: "Pieces (Individual Units)" },
    { value: "cases", label: "Cases (Bulk Units)" },
    { value: "boxes", label: "Boxes" },
    { value: "packs", label: "Packs" },
    { value: "bottles", label: "Bottles" },
    { value: "cans", label: "Cans" },
    { value: "bags", label: "Bags" },
    { value: "cartons", label: "Cartons" },
    { value: "dozen", label: "Dozen" },
    { value: "gallons", label: "Gallons" },
    { value: "liters", label: "Liters" },
    { value: "pounds", label: "Pounds" },
    { value: "kilograms", label: "Kilograms" }
  ];
  const handleConfirm = () => {
    if (!product) return;
    if (quantity <= 0) {
      toast({
        title: "Invalid Quantity",
        description: "Please enter a valid quantity greater than 0",
        variant: "destructive"
      });
      return;
    }
    if (quantity > product.quantity_in_stock) {
      toast({
        title: "Insufficient Stock",
        description: `Only ${product.quantity_in_stock} units available in stock`,
        variant: "destructive"
      });
      return;
    }
    onConfirm(product, quantity, unitType);
    handleClose();
  };
  const handleClose = () => {
    setQuantity(1);
    setUnitType("pieces");
    onClose();
  };
  const calculatePrice = () => {
    if (!product) return 0;
    let pricePerUnit = product.price;
    if (unitType === "cases" && product.unit_per_case > 0) {
      pricePerUnit = product.price * product.unit_per_case;
    }
    return pricePerUnit * quantity;
  };
  const getUnitInfo = () => {
    if (!product) return "";
    if (unitType === "cases" && product.unit_per_case > 0) {
      return `(${product.unit_per_case} pieces per case)`;
    }
    return "";
  };
  if (!product) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: isOpen, onOpenChange: handleClose, "data-id": "wozsi0j6k", "data-path": "src/components/ProductSelectionDialog.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-md", "data-id": "vaniqh385", "data-path": "src/components/ProductSelectionDialog.tsx", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { "data-id": "nrv0rfzqt", "data-path": "src/components/ProductSelectionDialog.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center space-x-2", "data-id": "yqrhz6v2o", "data-path": "src/components/ProductSelectionDialog.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "w-5 h-5", "data-id": "rlti0j0s2", "data-path": "src/components/ProductSelectionDialog.tsx" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "y5rxy7cqv", "data-path": "src/components/ProductSelectionDialog.tsx", children: "Add Product to Order" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { "data-id": "rfel3yq3d", "data-path": "src/components/ProductSelectionDialog.tsx", children: "Configure the quantity and unit type for this product" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-id": "exn9d468n", "data-path": "src/components/ProductSelectionDialog.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-50 p-4 rounded-lg", "data-id": "7wi5kxet7", "data-path": "src/components/ProductSelectionDialog.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-lg", "data-id": "m6zuodu9s", "data-path": "src/components/ProductSelectionDialog.tsx", children: product.product_name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 space-y-1", "data-id": "mbvcabk1h", "data-path": "src/components/ProductSelectionDialog.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", "data-id": "81g450ji4", "data-path": "src/components/ProductSelectionDialog.tsx", children: [
            "Product Code: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", "data-id": "jvx5wynrg", "data-path": "src/components/ProductSelectionDialog.tsx", children: product.product_code })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", "data-id": "estw84xqc", "data-path": "src/components/ProductSelectionDialog.tsx", children: [
            "Category: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", "data-id": "tprh59y9y", "data-path": "src/components/ProductSelectionDialog.tsx", children: product.category })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", "data-id": "um7vtm8e4", "data-path": "src/components/ProductSelectionDialog.tsx", children: [
            "Supplier: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", "data-id": "syzs4lhwe", "data-path": "src/components/ProductSelectionDialog.tsx", children: product.supplier })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2 mt-2", "data-id": "3cot7quul", "data-path": "src/components/ProductSelectionDialog.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", "data-id": "iag1jgb4x", "data-path": "src/components/ProductSelectionDialog.tsx", children: [
              "$",
              product.price.toFixed(2),
              " per unit"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", "data-id": "xxlnbsypl", "data-path": "src/components/ProductSelectionDialog.tsx", children: [
              product.quantity_in_stock,
              " in stock"
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "qfieeo8yo", "data-path": "src/components/ProductSelectionDialog.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "quantity", "data-id": "ortv0ap21", "data-path": "src/components/ProductSelectionDialog.tsx", children: "Quantity *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          NumberInput,
          {
            id: "quantity",
            value: quantity,
            onChange: setQuantity,
            min: 1,
            max: product.quantity_in_stock,
            className: "w-full",
            placeholder: "Enter quantity",
            "data-id": "pvjask3t9",
            "data-path": "src/components/ProductSelectionDialog.tsx"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", "data-id": "ycu6x3lv7", "data-path": "src/components/ProductSelectionDialog.tsx", children: [
          "Maximum available: ",
          product.quantity_in_stock,
          " units"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "t79brasrv", "data-path": "src/components/ProductSelectionDialog.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "unitType", "data-id": "cwvfld0wb", "data-path": "src/components/ProductSelectionDialog.tsx", children: "Unit Type *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: unitType, onValueChange: setUnitType, "data-id": "qde6e5udp", "data-path": "src/components/ProductSelectionDialog.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-id": "otav86nlm", "data-path": "src/components/ProductSelectionDialog.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select unit type", "data-id": "k7v4fyv42", "data-path": "src/components/ProductSelectionDialog.tsx" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { "data-id": "4eimc21qr", "data-path": "src/components/ProductSelectionDialog.tsx", children: unitTypes.map(
            (unit) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: unit.value, "data-id": "g5aa23plr", "data-path": "src/components/ProductSelectionDialog.tsx", children: unit.label }, unit.value)
          ) })
        ] }),
        getUnitInfo() && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", "data-id": "fu8x64nja", "data-path": "src/components/ProductSelectionDialog.tsx", children: getUnitInfo() })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-blue-50 p-3 rounded-lg", "data-id": "9ol2e44gq", "data-path": "src/components/ProductSelectionDialog.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "dao767au7", "data-path": "src/components/ProductSelectionDialog.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", "data-id": "22ngjbnjf", "data-path": "src/components/ProductSelectionDialog.tsx", children: "Total Price:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-lg font-bold text-blue-600", "data-id": "s4qfglp8p", "data-path": "src/components/ProductSelectionDialog.tsx", children: [
            "$",
            calculatePrice().toFixed(2)
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1", "data-id": "vjmali5pq", "data-path": "src/components/ProductSelectionDialog.tsx", children: [
          quantity,
          " ",
          unitType,
          " × $",
          (calculatePrice() / quantity).toFixed(2),
          " each"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end space-x-3", "data-id": "cnvh952sf", "data-path": "src/components/ProductSelectionDialog.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: handleClose, "data-id": "af63dsran", "data-path": "src/components/ProductSelectionDialog.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4 mr-2", "data-id": "lwahkrou1", "data-path": "src/components/ProductSelectionDialog.tsx" }),
          "Cancel"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: handleConfirm, "data-id": "s2ord991c", "data-path": "src/components/ProductSelectionDialog.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4 mr-2", "data-id": "hgy66ers7", "data-path": "src/components/ProductSelectionDialog.tsx" }),
          "Add to Order"
        ] })
      ] })
    ] })
  ] }) });
};
const OrderForm = () => {
  const [selectedStation, setSelectedStation] = reactExports.useState("");
  const [formData, setFormData] = reactExports.useState({
    order_number: "",
    station: "MOBIL",
    notes: "",
    items: [],
    total_amount: 0
  });
  const [loading, setLoading] = reactExports.useState(false);
  const [scannerOpen, setScannerOpen] = reactExports.useState(false);
  const [matchedProducts, setMatchedProducts] = reactExports.useState([]);
  const [selectedQuantity, setSelectedQuantity] = reactExports.useState({});
  const [selectedProduct, setSelectedProduct] = reactExports.useState(null);
  const [showSelectionDialog, setShowSelectionDialog] = reactExports.useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const stations2 = ["MOBIL", "AMOCO ROSEDALE", "AMOCO BROOKLYN"];
  const [stream, setStream] = reactExports.useState(null);
  const [videoRef, setVideoRef] = reactExports.useState(null);
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });
      if (videoRef) {
        videoRef.srcObject = mediaStream;
        setStream(mediaStream);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast({
        variant: "destructive",
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions."
      });
    }
  };
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };
  const searchProductsByBarcode = async (barcode) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("products").select("*").or(`bar_code_case.eq.${barcode},bar_code_unit.eq.${barcode}`).limit(10);
      if (error) throw error;
      const products = data || [];
      setMatchedProducts(products);
      if (products.length === 0) {
        toast({
          title: "No Products Found",
          description: `No products found with barcode: ${barcode}`,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Products Found",
          description: `Found ${products.length} product(s) matching barcode: ${barcode}`
        });
      }
    } catch (error) {
      console.error("Error searching products:", error);
      toast({
        title: "Search Error",
        description: "Failed to search for products",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const simulateBarcodeCapture = () => {
    const simulatedBarcode = "123456789012";
    searchProductsByBarcode(simulatedBarcode);
    setScannerOpen(false);
    stopCamera();
  };
  const addProductToOrder = (product, quantity = 1, unitType = "pieces") => {
    let pricePerUnit = product.price;
    if (unitType === "cases" && product.unit_per_case > 0) {
      pricePerUnit = product.price * product.unit_per_case;
    }
    const subtotal = pricePerUnit * quantity;
    const newItem = {
      product,
      quantity,
      unitType,
      subtotal
    };
    const existingItemIndex = formData.items.findIndex(
      (item) => item.product.ID === product.ID && item.unitType === unitType
    );
    let updatedItems;
    if (existingItemIndex >= 0) {
      updatedItems = [...formData.items];
      const newQuantity = updatedItems[existingItemIndex].quantity + quantity;
      let newPricePerUnit = updatedItems[existingItemIndex].product.price;
      if (unitType === "cases" && product.unit_per_case > 0) {
        newPricePerUnit = product.price * product.unit_per_case;
      }
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: newQuantity,
        subtotal: newPricePerUnit * newQuantity
      };
    } else {
      updatedItems = [...formData.items, newItem];
    }
    const newTotal = updatedItems.reduce((sum, item) => sum + item.subtotal, 0);
    setFormData((prev) => ({
      ...prev,
      items: updatedItems,
      total_amount: newTotal
    }));
    setMatchedProducts([]);
    setSelectedQuantity({});
    toast({
      title: "Product Added",
      description: `${quantity} ${unitType} of ${product.product_name} added to order`
    });
  };
  const updateItemQuantity = (itemIndex, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(itemIndex);
      return;
    }
    const updatedItems = [...formData.items];
    const item = updatedItems[itemIndex];
    let pricePerUnit = item.product.price;
    if (item.unitType === "cases" && item.product.unit_per_case > 0) {
      pricePerUnit = item.product.price * item.product.unit_per_case;
    }
    updatedItems[itemIndex] = {
      ...updatedItems[itemIndex],
      quantity: newQuantity,
      subtotal: pricePerUnit * newQuantity
    };
    const newTotal = updatedItems.reduce((sum, item2) => sum + item2.subtotal, 0);
    setFormData((prev) => ({
      ...prev,
      items: updatedItems,
      total_amount: newTotal
    }));
  };
  const removeItem = (itemIndex) => {
    const updatedItems = formData.items.filter((_, index) => index !== itemIndex);
    const newTotal = updatedItems.reduce((sum, item) => sum + item.subtotal, 0);
    setFormData((prev) => ({
      ...prev,
      items: updatedItems,
      total_amount: newTotal
    }));
  };
  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setShowSelectionDialog(true);
  };
  const handleProductConfirm = (product, quantity, unitType) => {
    addProductToOrder(product, quantity, unitType);
    setShowSelectionDialog(false);
    setSelectedProduct(null);
  };
  const generateOrderNumber = () => {
    const date = /* @__PURE__ */ new Date();
    const timestamp = date.getTime().toString().slice(-6);
    return `ORD-${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, "0")}-${timestamp}`;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.items.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one product to the order",
        variant: "destructive"
      });
      return;
    }
    if (!formData.station) {
      toast({
        title: "Error",
        description: "Please select a delivery station",
        variant: "destructive"
      });
      return;
    }
    try {
      setLoading(true);
      const orderNumber = formData.order_number || generateOrderNumber();
      const orderData = {
        order_number: orderNumber,
        vendor_id: 1,
        // Default vendor for barcode orders
        order_date: (/* @__PURE__ */ new Date()).toISOString(),
        station: formData.station,
        total_amount: formData.total_amount,
        status: "Pending",
        notes: `${formData.notes}

Items:
${formData.items.map(
          (item) => `- ${item.product.product_name} (${item.product.product_code}) x${item.quantity} ${item.unitType} = $${item.subtotal.toFixed(2)}`
        ).join("\n")}`,
        created_by: 1
      };
      const { error } = await supabase.from("orders").insert(orderData);
      if (error) throw error;
      toast({
        title: "Success",
        description: "Order created successfully"
      });
      navigate("/orders");
    } catch (error) {
      console.error("Error creating order:", error);
      toast({
        title: "Error",
        description: "Failed to create order",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-id": "0pyrrmwh1", "data-path": "src/pages/Orders/OrderForm.tsx", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-2 border-primary/20", "data-id": "0eua6gv07", "data-path": "src/pages/Orders/OrderForm.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "ixga767n8", "data-path": "src/pages/Orders/OrderForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "4l0wcm9y4", "data-path": "src/pages/Orders/OrderForm.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "dj3d5ikpw", "data-path": "src/pages/Orders/OrderForm.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center space-x-2", "data-id": "ti14ij8pz", "data-path": "src/pages/Orders/OrderForm.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "w-6 h-6", "data-id": "ierrfj0ok", "data-path": "src/pages/Orders/OrderForm.tsx" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "gs8bnexoh", "data-path": "src/pages/Orders/OrderForm.tsx", children: "Create Order - Station Selection" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { "data-id": "z3i1wlhaa", "data-path": "src/pages/Orders/OrderForm.tsx", children: "First, select the station for this order, then add products" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: () => navigate("/orders"), "data-id": "xzmeawgtt", "data-path": "src/pages/Orders/OrderForm.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4 mr-2", "data-id": "p6rbs575a", "data-path": "src/pages/Orders/OrderForm.tsx" }),
          "Back to Orders"
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { "data-id": "fcnauv34o", "data-path": "src/pages/Orders/OrderForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", "data-id": "1mcogms5m", "data-path": "src/pages/Orders/OrderForm.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "9902e07dq", "data-path": "src/pages/Orders/OrderForm.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "station-selector", className: "text-lg font-semibold", "data-id": "frbpir74k", "data-path": "src/pages/Orders/OrderForm.tsx", children: "Select Delivery Station *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: selectedStation,
              onValueChange: (value) => {
                setSelectedStation(value);
                setFormData((prev) => ({ ...prev, station: value }));
              },
              "data-id": "x8h93mjsv",
              "data-path": "src/pages/Orders/OrderForm.tsx",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "text-lg p-4 h-12", "data-id": "ebi3pxc6g", "data-path": "src/pages/Orders/OrderForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Choose a station to begin creating your order", "data-id": "bdldvv3s4", "data-path": "src/pages/Orders/OrderForm.tsx" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { "data-id": "608lb1o1o", "data-path": "src/pages/Orders/OrderForm.tsx", children: stations2.map(
                  (station) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: station, className: "text-lg p-3", "data-id": "13wwub84t", "data-path": "src/pages/Orders/OrderForm.tsx", children: station }, station)
                ) })
              ]
            }
          )
        ] }),
        selectedStation && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-green-50 border border-green-200 rounded-lg", "data-id": "q0iafqshg", "data-path": "src/pages/Orders/OrderForm.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-green-800 font-medium", "data-id": "sptj95zmk", "data-path": "src/pages/Orders/OrderForm.tsx", children: [
            "📍 Selected Station: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold", "data-id": "6c08r5a2g", "data-path": "src/pages/Orders/OrderForm.tsx", children: selectedStation })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-green-600 text-sm mt-1", "data-id": "dh54amp05", "data-path": "src/pages/Orders/OrderForm.tsx", children: "You can now add products to your order for this station." })
        ] })
      ] }) })
    ] }),
    selectedStation && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "gs64qjgwg", "data-path": "src/pages/Orders/OrderForm.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "fdb2u8uon", "data-path": "src/pages/Orders/OrderForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between", "data-id": "6mb3zf6to", "data-path": "src/pages/Orders/OrderForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "35rik3idc", "data-path": "src/pages/Orders/OrderForm.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center space-x-2", "data-id": "88bq5feiw", "data-path": "src/pages/Orders/OrderForm.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "w-6 h-6", "data-id": "spt9q9g4e", "data-path": "src/pages/Orders/OrderForm.tsx" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { "data-id": "g8b2lq5qm", "data-path": "src/pages/Orders/OrderForm.tsx", children: [
            "Order for ",
            selectedStation
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { "data-id": "86yg1tsqo", "data-path": "src/pages/Orders/OrderForm.tsx", children: "Scan product barcodes or search manually to add items to your order" })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { "data-id": "3l84ct1b4", "data-path": "src/pages/Orders/OrderForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-id": "gbf0po2qr", "data-path": "src/pages/Orders/OrderForm.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-2 border-dashed border-primary/30 hover:border-primary/50 transition-colors", "data-id": "pmfipr63n", "data-path": "src/pages/Orders/OrderForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-6", "data-id": "35uckn5lp", "data-path": "src/pages/Orders/OrderForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-4", "data-id": "rzp325dyw", "data-path": "src/pages/Orders/OrderForm.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "w-12 h-12 mx-auto text-primary", "data-id": "i40nmaqmu", "data-path": "src/pages/Orders/OrderForm.tsx" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold", "data-id": "5fucoxh31", "data-path": "src/pages/Orders/OrderForm.tsx", children: "Barcode Scanner" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", "data-id": "hn6q8pjgf", "data-path": "src/pages/Orders/OrderForm.tsx", children: "Click to open camera and scan product barcodes" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: () => {
                setScannerOpen(true);
                setTimeout(startCamera, 100);
              },
              className: "w-full sm:w-auto",
              disabled: loading,
              "data-id": "qe6zp8q09",
              "data-path": "src/pages/Orders/OrderForm.tsx",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "w-4 h-4 mr-2", "data-id": "s9gkv18b3", "data-path": "src/pages/Orders/OrderForm.tsx" }),
                "Open Barcode Scanner"
              ]
            }
          )
        ] }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ProductSearchBar, { onProductSelect: handleProductSelect, "data-id": "y4jp3qfx2", "data-path": "src/pages/Orders/OrderForm.tsx" }),
        scannerOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-primary", "data-id": "rxdhdr09r", "data-path": "src/pages/Orders/OrderForm.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "1i1e8llr5", "data-path": "src/pages/Orders/OrderForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { "data-id": "v3357qx1x", "data-path": "src/pages/Orders/OrderForm.tsx", children: "Barcode Scanner" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { "data-id": "y3nk4kh3a", "data-path": "src/pages/Orders/OrderForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", "data-id": "xvfw2ekn5", "data-path": "src/pages/Orders/OrderForm.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full max-w-md mx-auto aspect-video bg-black rounded-lg overflow-hidden", "data-id": "1aq9pqyt0", "data-path": "src/pages/Orders/OrderForm.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "video",
                {
                  ref: (ref) => setVideoRef(ref),
                  autoPlay: true,
                  playsInline: true,
                  className: "w-full h-full object-cover",
                  "data-id": "mk5d0ekfc",
                  "data-path": "src/pages/Orders/OrderForm.tsx"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center", "data-id": "cx3rg1y7z", "data-path": "src/pages/Orders/OrderForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-2 border-white border-dashed w-48 h-24 rounded-lg", "data-id": "8edg4yx14", "data-path": "src/pages/Orders/OrderForm.tsx" }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex space-x-2 justify-center", "data-id": "bvj4rx52t", "data-path": "src/pages/Orders/OrderForm.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: simulateBarcodeCapture, disabled: loading, "data-id": "57yt7qwih", "data-path": "src/pages/Orders/OrderForm.tsx", children: "Capture Barcode" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "outline",
                  onClick: () => {
                    setScannerOpen(false);
                    stopCamera();
                  },
                  "data-id": "81i3txece",
                  "data-path": "src/pages/Orders/OrderForm.tsx",
                  children: "Cancel"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground text-center", "data-id": "c3p3xgcgh", "data-path": "src/pages/Orders/OrderForm.tsx", children: "Position the barcode within the frame and click Capture" })
          ] }) })
        ] }),
        matchedProducts.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "qiz7hez36", "data-path": "src/pages/Orders/OrderForm.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "meazw3q06", "data-path": "src/pages/Orders/OrderForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { "data-id": "vtgnpfvj6", "data-path": "src/pages/Orders/OrderForm.tsx", children: "Found Products" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { "data-id": "hd99ymrsf", "data-path": "src/pages/Orders/OrderForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", "data-id": "yq4submw8", "data-path": "src/pages/Orders/OrderForm.tsx", children: matchedProducts.map(
            (product) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-4 border rounded-lg", "data-id": "qdjjter6p", "data-path": "src/pages/Orders/OrderForm.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", "data-id": "bma3fqudt", "data-path": "src/pages/Orders/OrderForm.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-semibold", "data-id": "pjk10i5l0", "data-path": "src/pages/Orders/OrderForm.tsx", children: product.product_name }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", "data-id": "0mnrwflcz", "data-path": "src/pages/Orders/OrderForm.tsx", children: [
                  "Code: ",
                  product.product_code,
                  " | Category: ",
                  product.category
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-medium text-green-600", "data-id": "0hjre35th", "data-path": "src/pages/Orders/OrderForm.tsx", children: [
                  "Price: $",
                  product.price.toFixed(2),
                  " | Stock: ",
                  product.quantity_in_stock
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-3", "data-id": "j7jt65frc", "data-path": "src/pages/Orders/OrderForm.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", "data-id": "29fprcx19", "data-path": "src/pages/Orders/OrderForm.tsx", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: `qty-${product.ID}`, className: "text-sm", "data-id": "ko6m039zq", "data-path": "src/pages/Orders/OrderForm.tsx", children: "Qty:" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    NumberInput,
                    {
                      id: `qty-${product.ID}`,
                      value: selectedQuantity[product.ID] || 1,
                      onChange: (value) => setSelectedQuantity((prev) => ({
                        ...prev,
                        [product.ID]: value
                      })),
                      min: 1,
                      max: product.quantity_in_stock,
                      className: "w-20",
                      "data-id": "9s6pygfvd",
                      "data-path": "src/pages/Orders/OrderForm.tsx"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    size: "sm",
                    onClick: () => addProductToOrder(product),
                    className: "flex items-center space-x-1",
                    "data-id": "xx7ux3k6h",
                    "data-path": "src/pages/Orders/OrderForm.tsx",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4", "data-id": "yltx4a0x0", "data-path": "src/pages/Orders/OrderForm.tsx" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "ax25ekm2e", "data-path": "src/pages/Orders/OrderForm.tsx", children: "Add" })
                    ]
                  }
                )
              ] })
            ] }, product.ID)
          ) }) })
        ] }),
        formData.items.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "56m4ay7k9", "data-path": "src/pages/Orders/OrderForm.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "j6yg60m9", "data-path": "src/pages/Orders/OrderForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { "data-id": "zv94brus7", "data-path": "src/pages/Orders/OrderForm.tsx", children: [
            "Order Items (",
            formData.items.length,
            ")"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { "data-id": "lulve2ryi", "data-path": "src/pages/Orders/OrderForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", "data-id": "zscfqc248", "data-path": "src/pages/Orders/OrderForm.tsx", children: [
            formData.items.map(
              (item, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-4 border rounded-lg bg-gray-50", "data-id": "j1g343t3m", "data-path": "src/pages/Orders/OrderForm.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", "data-id": "qvm659s56", "data-path": "src/pages/Orders/OrderForm.tsx", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-semibold", "data-id": "g9a06cvwj", "data-path": "src/pages/Orders/OrderForm.tsx", children: item.product.product_name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", "data-id": "jiajez3tj", "data-path": "src/pages/Orders/OrderForm.tsx", children: [
                    item.product.product_code,
                    " | $",
                    (item.subtotal / item.quantity).toFixed(2),
                    " per ",
                    item.unitType
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", "data-id": "tggaq43q0", "data-path": "src/pages/Orders/OrderForm.tsx", children: [
                    "Unit Type: ",
                    item.unitType
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-3", "data-id": "np1k3vibm", "data-path": "src/pages/Orders/OrderForm.tsx", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", "data-id": "h52ds73ns", "data-path": "src/pages/Orders/OrderForm.tsx", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        size: "sm",
                        variant: "outline",
                        onClick: () => updateItemQuantity(index, item.quantity - 1),
                        "data-id": "hzt21ym38",
                        "data-path": "src/pages/Orders/OrderForm.tsx",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "w-3 h-3", "data-id": "evhhf6vat", "data-path": "src/pages/Orders/OrderForm.tsx" })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "w-8 text-center font-medium", "data-id": "4lr74r9e3", "data-path": "src/pages/Orders/OrderForm.tsx", children: [
                      item.quantity,
                      " ",
                      item.unitType
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        size: "sm",
                        variant: "outline",
                        onClick: () => updateItemQuantity(index, item.quantity + 1),
                        "data-id": "3m5hwspgv",
                        "data-path": "src/pages/Orders/OrderForm.tsx",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3 h-3", "data-id": "62xm8hvpk", "data-path": "src/pages/Orders/OrderForm.tsx" })
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-right min-w-[80px]", "data-id": "m4i77n0fj", "data-path": "src/pages/Orders/OrderForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-semibold", "data-id": "2veb9kffl", "data-path": "src/pages/Orders/OrderForm.tsx", children: [
                    "$",
                    item.subtotal.toFixed(2)
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      size: "sm",
                      variant: "destructive",
                      onClick: () => removeItem(index),
                      "data-id": "r6r7xk4ii",
                      "data-path": "src/pages/Orders/OrderForm.tsx",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4", "data-id": "q9l29xqg3", "data-path": "src/pages/Orders/OrderForm.tsx" })
                    }
                  )
                ] })
              ] }, `${item.product.ID}-${index}`)
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t pt-3", "data-id": "lddeeboj6", "data-path": "src/pages/Orders/OrderForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center text-lg font-bold", "data-id": "reyrgo2dl", "data-path": "src/pages/Orders/OrderForm.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "bdh4y3tge", "data-path": "src/pages/Orders/OrderForm.tsx", children: "Total Amount:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { "data-id": "gx23gl6cy", "data-path": "src/pages/Orders/OrderForm.tsx", children: [
                "$",
                formData.total_amount.toFixed(2)
              ] })
            ] }) })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "f2le6exuv", "data-path": "src/pages/Orders/OrderForm.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "v8g87a07j", "data-path": "src/pages/Orders/OrderForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { "data-id": "sh2g9qpmy", "data-path": "src/pages/Orders/OrderForm.tsx", children: "Order Details" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { "data-id": "de6xb30d7", "data-path": "src/pages/Orders/OrderForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", "data-id": "uhnulbpiz", "data-path": "src/pages/Orders/OrderForm.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", "data-id": "e697mscou", "data-path": "src/pages/Orders/OrderForm.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "uibwxus4z", "data-path": "src/pages/Orders/OrderForm.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "order_number", "data-id": "k2ucfu1ra", "data-path": "src/pages/Orders/OrderForm.tsx", children: "Order Number" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "order_number",
                    value: formData.order_number,
                    onChange: (e) => setFormData((prev) => ({ ...prev, order_number: e.target.value })),
                    placeholder: "Auto-generated if left empty",
                    "data-id": "dvydn158k",
                    "data-path": "src/pages/Orders/OrderForm.tsx"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", "data-id": "hfxlkwa1k", "data-path": "src/pages/Orders/OrderForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-blue-50 border border-blue-200 rounded-lg", "data-id": "dmtec7m4l", "data-path": "src/pages/Orders/OrderForm.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-blue-800 font-medium", "data-id": "2u1odd6gb", "data-path": "src/pages/Orders/OrderForm.tsx", children: "Delivery Station" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-blue-600 font-semibold text-lg", "data-id": "mpgp9z7j9", "data-path": "src/pages/Orders/OrderForm.tsx", children: selectedStation }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-blue-500 text-sm", "data-id": "tguzkhkzp", "data-path": "src/pages/Orders/OrderForm.tsx", children: "Selected at the top of the page" })
              ] }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "3q43pyzud", "data-path": "src/pages/Orders/OrderForm.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "notes", "data-id": "ptfthgsks", "data-path": "src/pages/Orders/OrderForm.tsx", children: "Notes" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "notes",
                  value: formData.notes,
                  onChange: (e) => setFormData((prev) => ({ ...prev, notes: e.target.value })),
                  placeholder: "Enter any additional notes about this order...",
                  "data-id": "seqen17lb",
                  "data-path": "src/pages/Orders/OrderForm.tsx"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end space-x-4 pt-4", "data-id": "v79ifklm9", "data-path": "src/pages/Orders/OrderForm.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  onClick: () => navigate("/orders"),
                  "data-id": "g72qz7isz",
                  "data-path": "src/pages/Orders/OrderForm.tsx",
                  children: "Cancel"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: loading || formData.items.length === 0, "data-id": "29q17f8kk", "data-path": "src/pages/Orders/OrderForm.tsx", children: loading ? "Creating..." : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-4 h-4 mr-2", "data-id": "e2yz262dy", "data-path": "src/pages/Orders/OrderForm.tsx" }),
                "Create Order"
              ] }) })
            ] })
          ] }) })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ProductSelectionDialog,
      {
        isOpen: showSelectionDialog,
        onClose: () => {
          setShowSelectionDialog(false);
          setSelectedProduct(null);
        },
        product: selectedProduct,
        onConfirm: handleProductConfirm,
        "data-id": "iy79s7n9i",
        "data-path": "src/pages/Orders/OrderForm.tsx"
      }
    )
  ] });
};
const OrderForm$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: OrderForm
}, Symbol.toStringTag, { value: "Module" }));
const InventoryAlerts = () => {
  const [products, setProducts] = reactExports.useState([]);
  const [lowStockProducts, setLowStockProducts] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [refreshing, setRefreshing] = reactExports.useState(false);
  const [searchTerm, setSearchTerm] = reactExports.useState("");
  const [categoryFilter, setCategoryFilter] = reactExports.useState("all");
  const [severityFilter, setSeverityFilter] = reactExports.useState("all");
  const [currentPage, setCurrentPage] = reactExports.useState(1);
  const [totalRecords, setTotalRecords] = reactExports.useState(0);
  const [alertSettings, setAlertSettings] = reactExports.useState({
    lowStockThreshold: 10,
    criticalStockThreshold: 5,
    emailNotifications: true,
    autoReorderSuggestions: true
  });
  const { toast: toast2 } = useToast();
  const pageSize = 20;
  reactExports.useEffect(() => {
    fetchProducts();
    loadAlertSettings();
  }, [currentPage, categoryFilter, severityFilter, searchTerm]);
  const loadAlertSettings = () => {
    const saved = localStorage.getItem("inventoryAlertSettings");
    if (saved) {
      setAlertSettings(JSON.parse(saved));
    }
  };
  const fetchProducts = async () => {
    setLoading(true);
    try {
      let query = supabase.from("products").select("*", { count: "exact" }).order("quantity_in_stock", { ascending: true });
      if (categoryFilter !== "all") {
        query = query.eq("category", categoryFilter);
      }
      if (searchTerm) {
        query = query.ilike("product_name", `%${searchTerm}%`);
      }
      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);
      const { data, error, count } = await query;
      if (error) throw error;
      const allProducts = data || [];
      setProducts(allProducts);
      setTotalRecords(count || 0);
      const alertProducts = allProducts.filter((product) => {
        const stockRatio = product.quantity_in_stock / (product.minimum_stock || 1);
        if (severityFilter === "critical") {
          return product.quantity_in_stock <= alertSettings.criticalStockThreshold;
        } else if (severityFilter === "low") {
          return product.quantity_in_stock <= alertSettings.lowStockThreshold && product.quantity_in_stock > alertSettings.criticalStockThreshold;
        } else if (severityFilter === "reorder") {
          return product.quantity_in_stock <= product.minimum_stock;
        } else if (severityFilter === "overdue") {
          return product.overdue;
        }
        return product.quantity_in_stock <= alertSettings.lowStockThreshold || product.quantity_in_stock <= product.minimum_stock || product.overdue;
      });
      setLowStockProducts(alertProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast2({
        title: "Error",
        description: "Failed to fetch inventory data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const refreshData = async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
    toast2({
      title: "Data Refreshed",
      description: "Inventory data has been updated"
    });
  };
  const sendLowStockAlert = async () => {
    if (lowStockProducts.length === 0) {
      toast2({
        title: "No Alerts to Send",
        description: "All products are adequately stocked"
      });
      return;
    }
    try {
      const criticalItems = lowStockProducts.filter((p) => p.quantity_in_stock <= alertSettings.criticalStockThreshold);
      const lowItems = lowStockProducts.filter(
        (p) => p.quantity_in_stock <= alertSettings.lowStockThreshold && p.quantity_in_stock > alertSettings.criticalStockThreshold
      );
      const emailContent = `
        <h2>🚨 Inventory Alert Report</h2>
        <p>The following products require immediate attention:</p>
        
        ${criticalItems.length > 0 ? `
        <h3 style="color: #dc2626;">⚠️ Critical Stock Levels (${criticalItems.length} items)</h3>
        <ul>
          ${criticalItems.map((item) => `
            <li><strong>${item.product_name}</strong> - Only ${item.quantity_in_stock} units remaining (Supplier: ${item.supplier})</li>
          `).join("")}
        </ul>
        ` : ""}
        
        ${lowItems.length > 0 ? `
        <h3 style="color: #ea580c;">📉 Low Stock Levels (${lowItems.length} items)</h3>
        <ul>
          ${lowItems.map((item) => `
            <li><strong>${item.product_name}</strong> - ${item.quantity_in_stock} units remaining (Min: ${item.minimum_stock})</li>
          `).join("")}
        </ul>
        ` : ""}
        
        <p><strong>Report generated:</strong> ${(/* @__PURE__ */ new Date()).toLocaleString()}</p>
        <p>Please review and take appropriate action to restock these items.</p>
      `;
      console.log("Email alert would be sent:", {
        from: "support@gasstation.com",
        to: ["manager@gasstation.com"],
        subject: `🚨 Inventory Alert: ${lowStockProducts.length} products need attention`,
        html: emailContent
      });
      toast2({
        title: "Alert Prepared",
        description: `Alert for ${lowStockProducts.length} products logged to console (email service needs implementation)`
      });
    } catch (error) {
      console.error("Error preparing alert:", error);
      toast2({
        title: "Error",
        description: "Failed to prepare email alert",
        variant: "destructive"
      });
    }
  };
  const getStockSeverity = (product) => {
    if (product.quantity_in_stock <= alertSettings.criticalStockThreshold) return "critical";
    if (product.quantity_in_stock <= alertSettings.lowStockThreshold) return "low";
    if (product.quantity_in_stock <= product.minimum_stock) return "reorder";
    if (product.overdue) return "overdue";
    return "normal";
  };
  const getSeverityBadge = (severity) => {
    switch (severity) {
      case "critical":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "destructive", className: "bg-red-100 text-red-800", "data-id": "a30o0ocq8", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: "Critical" });
      case "low":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "bg-orange-100 text-orange-800", "data-id": "plnxseqpj", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: "Low Stock" });
      case "reorder":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "bg-yellow-100 text-yellow-800", "data-id": "2xkyb7n6d", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: "Reorder" });
      case "overdue":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "destructive", className: "bg-purple-100 text-purple-800", "data-id": "sg35tiovp", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: "Overdue" });
      default:
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "default", "data-id": "65l5w5afg", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: "Normal" });
    }
  };
  const calculateSummaryStats = () => {
    const critical = products.filter((p) => getStockSeverity(p) === "critical").length;
    const low = products.filter((p) => getStockSeverity(p) === "low").length;
    const reorder = products.filter((p) => getStockSeverity(p) === "reorder").length;
    const overdue = products.filter((p) => getStockSeverity(p) === "overdue").length;
    return { critical, low, reorder, overdue, total: products.length };
  };
  const stats = calculateSummaryStats();
  const totalPages = Math.ceil(totalRecords / pageSize);
  const categories = [...new Set(products.map((p) => p.category))];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-id": "foihocveu", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "463qvqka5", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "3kh3ogkcs", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold", "data-id": "f9l6bbi0n", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: "Inventory Alerts" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", "data-id": "w91b6yag9", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: "Monitor stock levels and manage inventory alerts" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", "data-id": "dvkomjnb9", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: refreshData, disabled: refreshing, "data-id": "0h2gniaki", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: `h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`, "data-id": "kbd88z3d1", "data-path": "src/pages/Inventory/InventoryAlerts.tsx" }),
          "Refresh"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: sendLowStockAlert, disabled: lowStockProducts.length === 0, "data-id": "5krtteca5", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-4 w-4 mr-2", "data-id": "rkgfzqm2w", "data-path": "src/pages/Inventory/InventoryAlerts.tsx" }),
          "Send Alert Email"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/inventory/settings", "data-id": "ljgtm9cay", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", "data-id": "fpnantxry", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "h-4 w-4 mr-2", "data-id": "a242ndn54", "data-path": "src/pages/Inventory/InventoryAlerts.tsx" }),
          "Settings"
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-5 gap-4", "data-id": "cm8ov6o5p", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-red-200 bg-red-50", "data-id": "at0zptqmw", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex items-center p-4", "data-id": "ydl6ldsr2", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-8 w-8 text-red-600 mr-3", "data-id": "z6i34ubm9", "data-path": "src/pages/Inventory/InventoryAlerts.tsx" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "1dnezbvwf", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-red-600", "data-id": "0krhy0ifw", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: "Critical Stock" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-red-700", "data-id": "4gwumhf55", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: stats.critical })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-orange-200 bg-orange-50", "data-id": "hy4d4rdlm", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex items-center p-4", "data-id": "ybzal07b6", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { className: "h-8 w-8 text-orange-600 mr-3", "data-id": "4052m37v2", "data-path": "src/pages/Inventory/InventoryAlerts.tsx" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "5x3kn7yub", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-orange-600", "data-id": "rq0tfeyhb", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: "Low Stock" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-orange-700", "data-id": "c5ixhlexa", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: stats.low })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-yellow-200 bg-yellow-50", "data-id": "kmsd5lu7k", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex items-center p-4", "data-id": "trfjcyywm", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-8 w-8 text-yellow-600 mr-3", "data-id": "8zi0kheh2", "data-path": "src/pages/Inventory/InventoryAlerts.tsx" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "bext11ys4", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-yellow-600", "data-id": "2z3284zy3", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: "Reorder Point" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-yellow-700", "data-id": "xx9hp3r2s", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: stats.reorder })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-purple-200 bg-purple-50", "data-id": "2yldedjve", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex items-center p-4", "data-id": "1mj7y4kpo", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-8 w-8 text-purple-600 mr-3", "data-id": "7iksjmo46", "data-path": "src/pages/Inventory/InventoryAlerts.tsx" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "pwzu3a5t0", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-purple-600", "data-id": "vlejnt7ct", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: "Overdue" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-purple-700", "data-id": "feywnn116", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: stats.overdue })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-id": "zdqqcwgaz", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex items-center p-4", "data-id": "dicspmlad", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-8 w-8 text-blue-600 mr-3", "data-id": "qj1f1e9ti", "data-path": "src/pages/Inventory/InventoryAlerts.tsx" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "wh47dkcf3", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-muted-foreground", "data-id": "5k6l40bsr", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: "Total Products" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold", "data-id": "5fmsxzg8c", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: stats.total })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-id": "t8xi25xtp", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4", "data-id": "14910sqxi", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-4", "data-id": "y7xesgmx3", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 min-w-[200px]", "data-id": "l6m27jdlb", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          placeholder: "Search products...",
          value: searchTerm,
          onChange: (e) => setSearchTerm(e.target.value),
          className: "w-full",
          "data-id": "8o5wd8nh5",
          "data-path": "src/pages/Inventory/InventoryAlerts.tsx"
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: categoryFilter, onValueChange: setCategoryFilter, "data-id": "vzw5m0q8w", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-[180px]", "data-id": "m3mx21voi", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Category", "data-id": "eu2nw14q7", "data-path": "src/pages/Inventory/InventoryAlerts.tsx" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { "data-id": "sc5ug5fck", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", "data-id": "xwzb07wr6", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: "All Categories" }),
          categories.filter((category) => category && category.trim() !== "").map(
            (category) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: category, "data-id": "zyep88opo", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: category }, category)
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: severityFilter, onValueChange: setSeverityFilter, "data-id": "jld9k7yx9", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-[150px]", "data-id": "hv2esr0e9", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Severity", "data-id": "5hp5chdsu", "data-path": "src/pages/Inventory/InventoryAlerts.tsx" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { "data-id": "7jpzvb0i6", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", "data-id": "cz6jr63ud", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: "All Items" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "critical", "data-id": "6jy95i4kg", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: "Critical Only" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "low", "data-id": "j209ciunq", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: "Low Stock" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "reorder", "data-id": "41023f2sm", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: "Reorder Point" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "overdue", "data-id": "chagw6kbt", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: "Overdue" })
        ] })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "ssjwnyxtw", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { "data-id": "vhnkjyguh", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { "data-id": "m7v1hqvi6", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: "Inventory Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardDescription, { "data-id": "zva6k5y7g", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: [
          "Showing ",
          products.length,
          " products (",
          lowStockProducts.length,
          " need attention)"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { "data-id": "f4o0hm09a", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center py-8", "data-id": "251aiz8sf", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-primary", "data-id": "4vlxqxc8a", "data-path": "src/pages/Inventory/InventoryAlerts.tsx" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "overflow-x-auto", "data-id": "qy2si58gn", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { "data-id": "wlwlfd6co", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { "data-id": "hs2vgak5c", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { "data-id": "cxprp9pvb", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "42t3fsf6m", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: "Product" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "idlrfuxgi", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: "Category" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "p6ge0ysk1", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: "Current Stock" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "5ml0541lv", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: "Min Stock" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "tdv8korso", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "w9qprvr8c", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: "Supplier" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "gqckiukqy", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: "Last Updated" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "ozp5qpshs", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: "Actions" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { "data-id": "mx10g2oie", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: products.map((product) => {
            const severity = getStockSeverity(product);
            const stockPercentage = product.quantity_in_stock / product.minimum_stock * 100;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: severity === "critical" ? "bg-red-50" : severity === "low" ? "bg-orange-50" : "", "data-id": "8ag4hd4qv", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", "data-id": "1s6jbyihi", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "vem91e1za", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", "data-id": "wro8lw1fn", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: product.product_name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", "data-id": "1bnb3hqon", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: product.department })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "6cpmviezs", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: product.category }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "3ssfzz95o", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", "data-id": "m1ynhombv", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `font-medium ${severity === "critical" ? "text-red-600" : severity === "low" ? "text-orange-600" : ""}`, "data-id": "5ewhf52zb", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: product.quantity_in_stock }),
                severity !== "normal" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-2 bg-gray-200 rounded-full overflow-hidden", "data-id": "j2twlvh2v", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: `h-full ${severity === "critical" ? "bg-red-500" : "bg-orange-500"}`,
                    style: { width: `${Math.min(stockPercentage, 100)}%` },
                    "data-id": "4w6m19h9x",
                    "data-path": "src/pages/Inventory/InventoryAlerts.tsx"
                  }
                ) })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "jm4qt4d89", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: product.minimum_stock }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "4hr9sd98g", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: getSeverityBadge(severity) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "8tx11ig7v", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: product.supplier }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "qs23prziy", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: new Date(product.last_updated_date).toLocaleDateString() }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "brujwzxaz", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", "data-id": "1irc0uoqu", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: `/products/${product.id}`, "data-id": "371r15r41", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", "data-id": "462l5yswb", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4", "data-id": "jni8he2j2", "data-path": "src/pages/Inventory/InventoryAlerts.tsx" }) }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: `/products/${product.id}/edit`, "data-id": "l7kxy6rqp", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", "data-id": "m7yzn6rhg", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4", "data-id": "lydpmzfqc", "data-path": "src/pages/Inventory/InventoryAlerts.tsx" }) }) })
              ] }) })
            ] }, product.id);
          }) })
        ] }),
        products.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-8 text-muted-foreground", "data-id": "6x71p2lwm", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: "No products found matching your criteria." })
      ] }) })
    ] }),
    totalPages > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-center gap-2", "data-id": "8xd0ggy4v", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "outline",
          onClick: () => setCurrentPage((prev) => Math.max(prev - 1, 1)),
          disabled: currentPage === 1,
          "data-id": "cdkg607fw",
          "data-path": "src/pages/Inventory/InventoryAlerts.tsx",
          children: "Previous"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center px-4", "data-id": "8ksunlavb", "data-path": "src/pages/Inventory/InventoryAlerts.tsx", children: [
        "Page ",
        currentPage,
        " of ",
        totalPages
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "outline",
          onClick: () => setCurrentPage((prev) => Math.min(prev + 1, totalPages)),
          disabled: currentPage === totalPages,
          "data-id": "58vpcd98p",
          "data-path": "src/pages/Inventory/InventoryAlerts.tsx",
          children: "Next"
        }
      )
    ] })
  ] });
};
const InventoryAlerts$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: InventoryAlerts
}, Symbol.toStringTag, { value: "Module" }));
const GasDeliveryInventory = () => {
  const [deliveries, setDeliveries] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [searchTerm, setSearchTerm] = reactExports.useState("");
  const [stationFilter, setStationFilter] = reactExports.useState("all");
  const [statusFilter, setStatusFilter] = reactExports.useState("all");
  const [fuelTypeFilter, setFuelTypeFilter] = reactExports.useState("all");
  useToast();
  const navigate = useNavigate();
  const mockDeliveries = [
    {
      id: 1,
      delivery_date: "2024-01-15T10:30:00Z",
      station: "MOBIL",
      fuel_type: "Regular (87)",
      quantity_delivered: 8500,
      unit_price: 2.85,
      total_amount: 24225,
      supplier: "ExxonMobil Supply",
      delivery_truck_number: "TRK-001",
      driver_name: "John Smith",
      status: "Delivered",
      tank_level_before: 2500,
      tank_level_after: 11e3,
      delivery_notes: "Delivery completed successfully. Tank capacity verified.",
      created_by: 1
    },
    {
      id: 2,
      delivery_date: "2024-01-15T14:15:00Z",
      station: "AMOCO ROSEDALE",
      fuel_type: "Premium (93)",
      quantity_delivered: 6e3,
      unit_price: 3.15,
      total_amount: 18900,
      supplier: "BP Supply Chain",
      delivery_truck_number: "TRK-102",
      driver_name: "Mike Johnson",
      status: "In Transit",
      tank_level_before: 1800,
      tank_level_after: 0,
      delivery_notes: "Delivery scheduled for 2 PM. Tank inspection completed.",
      created_by: 1
    },
    {
      id: 3,
      delivery_date: "2024-01-16T09:00:00Z",
      station: "AMOCO BROOKLYN",
      fuel_type: "Diesel",
      quantity_delivered: 7200,
      unit_price: 3.05,
      total_amount: 21960,
      supplier: "Shell Energy",
      delivery_truck_number: "TRK-205",
      driver_name: "Sarah Davis",
      status: "Pending",
      tank_level_before: 3200,
      tank_level_after: 0,
      delivery_notes: "Scheduled delivery. Awaiting truck arrival.",
      created_by: 1
    }
  ];
  reactExports.useEffect(() => {
    const fetchDeliveries = () => {
      setLoading(true);
      setTimeout(() => {
        setDeliveries(mockDeliveries);
        setLoading(false);
      }, 1e3);
    };
    fetchDeliveries();
  }, []);
  const getStatusBadge = (status) => {
    switch (status) {
      case "Delivered":
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-green-100 text-green-800", "data-id": "lrokrw1w5", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-3 h-3 mr-1", "data-id": "43bebgs6a", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx" }),
          "Delivered"
        ] });
      case "In Transit":
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-blue-100 text-blue-800", "data-id": "c4t2222yy", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "w-3 h-3 mr-1", "data-id": "h223mivh6", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx" }),
          "In Transit"
        ] });
      case "Pending":
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-yellow-100 text-yellow-800", "data-id": "huin90x4z", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3 mr-1", "data-id": "qiv3apomv", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx" }),
          "Pending"
        ] });
      case "Cancelled":
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-red-100 text-red-800", "data-id": "zcj5qohtl", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-3 h-3 mr-1", "data-id": "l115xu7y7", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx" }),
          "Cancelled"
        ] });
      default:
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", "data-id": "e8kdfw5t9", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: status });
    }
  };
  const filteredDeliveries = deliveries.filter((delivery) => {
    const matchesSearch = delivery.supplier.toLowerCase().includes(searchTerm.toLowerCase()) || delivery.delivery_truck_number.toLowerCase().includes(searchTerm.toLowerCase()) || delivery.driver_name.toLowerCase().includes(searchTerm.toLowerCase()) || delivery.fuel_type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStation = !stationFilter || stationFilter === "all" || delivery.station === stationFilter;
    const matchesStatus = !statusFilter || statusFilter === "all" || delivery.status === statusFilter;
    const matchesFuelType = !fuelTypeFilter || fuelTypeFilter === "all" || delivery.fuel_type === fuelTypeFilter;
    return matchesSearch && matchesStation && matchesStatus && matchesFuelType;
  });
  const totalDeliveries = filteredDeliveries.length;
  const totalQuantity = filteredDeliveries.reduce((sum, delivery) => sum + delivery.quantity_delivered, 0);
  const totalValue = filteredDeliveries.reduce((sum, delivery) => sum + delivery.total_amount, 0);
  const completedDeliveries = filteredDeliveries.filter((d) => d.status === "Delivered").length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-id": "z122bwuwo", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between", "data-id": "e5dhk7zk5", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "33pxtb43x", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl font-bold text-gray-900 flex items-center", "data-id": "9qn0zen7b", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Fuel, { className: "w-6 h-6 mr-2 text-blue-600", "data-id": "4gixazcie", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx" }),
          "GAS Delivery Inventory"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-600 mt-1", "data-id": "679t98rvu", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: "Track and manage fuel deliveries across all stations" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          onClick: () => navigate("/gas-delivery/new"),
          className: "mt-4 sm:mt-0",
          "data-id": "n4hxszcyh",
          "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4 mr-2", "data-id": "bpnsiw9wm", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx" }),
            "New Delivery"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200", "data-id": "0f1wlfhz6", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-6", "data-id": "tk6kuk6h0", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between", "data-id": "4nwumqeth", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 sm:mb-0", "data-id": "zkylfeqz8", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-gray-900 mb-1", "data-id": "r6pnfno8v", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: "Select Station" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-600 text-sm", "data-id": "yj9qvqrrz", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: "Choose a station to view its gas delivery inventory" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full sm:w-80", "data-id": "hbjhpl1dy", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: stationFilter, onValueChange: setStationFilter, "data-id": "mgypp6sqh", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "bg-white border-blue-300 focus:border-blue-500 focus:ring-blue-500", "data-id": "a4fi854if", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Choose Station", "data-id": "n3sc56t0z", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { "data-id": "l5p83amdk", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", "data-id": "t48pucqgh", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: "All Stations" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "MOBIL", "data-id": "89nhrjm9e", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: "MOBIL" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "AMOCO ROSEDALE", "data-id": "ad6l1ew75", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: "AMOCO ROSEDALE" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "AMOCO BROOKLYN", "data-id": "r3rf8lvsh", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: "AMOCO BROOKLYN" })
          ] })
        ] }) })
      ] }),
      stationFilter && stationFilter !== "all" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 p-3 bg-blue-100 rounded-lg", "data-id": "uu3wxwjz1", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-blue-800 font-medium flex items-center", "data-id": "fme75qdct", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Fuel, { className: "w-4 h-4 mr-2", "data-id": "jkeh3dy3l", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx" }),
        "Showing data for: ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 font-bold", "data-id": "fjkm1uqqs", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: stationFilter })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "qwl7a9g9n", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { "data-id": "av1pizzv8", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center text-lg", "data-id": "0wxzcgzh0", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-5 h-5 mr-2 text-blue-600", "data-id": "y60xb3hib", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx" }),
          stationFilter === "all" ? "All Stations Summary" : `${stationFilter} Summary`
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { "data-id": "nrt213noo", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: stationFilter === "all" ? "Overall statistics for all gas delivery operations" : `Statistics for ${stationFilter} station deliveries` })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { "data-id": "f7cm4d762", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", "data-id": "wyq0wj5us", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 bg-blue-50 rounded-lg", "data-id": "hawg3zbob", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", "data-id": "tk73tix45", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 bg-blue-100 rounded-lg", "data-id": "le3j41ybt", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "w-6 h-6 text-blue-600", "data-id": "f1z0acuvz", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-4", "data-id": "oiq8r27sm", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-gray-600", "data-id": "0f7mzod5f", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: "Total Deliveries" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-gray-900", "data-id": "bxhle2i9u", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: totalDeliveries })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 bg-green-50 rounded-lg", "data-id": "gw1bf6ihh", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", "data-id": "u7axxs7ao", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 bg-green-100 rounded-lg", "data-id": "xbfmp5j4x", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Fuel, { className: "w-6 h-6 text-green-600", "data-id": "3efksfrnv", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-4", "data-id": "r3jm0t3xk", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-gray-600", "data-id": "rrnqur1zw", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: "Total Gallons" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-gray-900", "data-id": "0zxpqc8so", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: totalQuantity.toLocaleString() })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 bg-yellow-50 rounded-lg", "data-id": "zd8pz9lys", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", "data-id": "ke3oxzp9f", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 bg-yellow-100 rounded-lg", "data-id": "l6oa7x66v", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-6 h-6 text-yellow-600", "data-id": "29hvjliwi", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-4", "data-id": "zekjko3x4", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-gray-600", "data-id": "d0pcv0q97", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: "Total Value" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-2xl font-bold text-gray-900", "data-id": "ktltylkd9", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: [
              "$",
              totalValue.toLocaleString()
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 bg-purple-50 rounded-lg", "data-id": "uganarpxo", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", "data-id": "751xfvu1x", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 bg-purple-100 rounded-lg", "data-id": "vn1fkpfj2", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-6 h-6 text-purple-600", "data-id": "q2u409yia", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-4", "data-id": "j4rir0by0", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-gray-600", "data-id": "hypm6ewwe", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: "Completed" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-gray-900", "data-id": "fk1pr99fo", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: completedDeliveries })
          ] })
        ] }) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-id": "agoe9sev2", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-6", "data-id": "imhbsc4rz", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", "data-id": "t8bmm0wsr", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", "data-id": "mg77c1rkb", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-3 h-4 w-4 text-gray-400", "data-id": "rxgltun7k", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            placeholder: "Search deliveries...",
            value: searchTerm,
            onChange: (e) => setSearchTerm(e.target.value),
            className: "pl-10",
            "data-id": "kym4ln6mo",
            "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: statusFilter, onValueChange: setStatusFilter, "data-id": "8btcj34u7", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-id": "fkd1nbtug", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Filter by Status", "data-id": "sa0dz70hv", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { "data-id": "5usm1a8am", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", "data-id": "4x7cks3fn", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: "All Statuses" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Delivered", "data-id": "0vk553410", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: "Delivered" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "In Transit", "data-id": "lnic6fbca", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: "In Transit" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Pending", "data-id": "nyxj0h3ri", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: "Pending" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Cancelled", "data-id": "yozc0xfye", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: "Cancelled" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: fuelTypeFilter, onValueChange: setFuelTypeFilter, "data-id": "44c52vo8s", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-id": "f42gkweel", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Filter by Fuel Type", "data-id": "awjtnd96b", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { "data-id": "b4jy6mn2d", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", "data-id": "pk6c6v6i2", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: "All Fuel Types" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Regular (87)", "data-id": "m56tcsdo6", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: "Regular (87)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Premium (93)", "data-id": "ywcxf2ood", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: "Premium (93)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Diesel", "data-id": "m53042v5j", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: "Diesel" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => {
        setSearchTerm("");
        setStatusFilter("all");
        setFuelTypeFilter("all");
      }, "data-id": "6t23ob9wj", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: "Clear Filters" })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "gyhvjowt5", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { "data-id": "kmv3fohzl", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { "data-id": "460egvsd8", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: "Gas Delivery Records" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { "data-id": "raf1ad90u", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: "Recent fuel deliveries and their status across all stations" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { "data-id": "uy0uswpg5", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: [
        loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-8", "data-id": "ug44dkanu", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600", "data-id": "wz4wno6e2", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-md border", "data-id": "j29phc6c3", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { "data-id": "rfn3eerq5", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { "data-id": "y06oyvs7z", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { "data-id": "q8u87ecyf", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "d1t4cnne6", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: "Delivery Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "v4maabvej", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: "Station" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "1orlj98i0", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: "Fuel Type" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "uz8o6tkay", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: "Quantity (Gal)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "f2ddyodre", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: "Supplier" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "dstqu4v7s", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: "Driver" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "obxdamu0r", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "y7jzn9vfg", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: "Total Amount" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "425jaeray", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: "Actions" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { "data-id": "inj5oj3yi", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: filteredDeliveries.map(
            (delivery) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { "data-id": "f4putjjf0", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "5ocn27uk8", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", "data-id": "dhgefcbke", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-4 h-4 mr-2 text-gray-400", "data-id": "822m9oxwz", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx" }),
                new Date(delivery.delivery_date).toLocaleDateString()
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "4txdvzg2g", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", "data-id": "pr2w2o3kx", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: delivery.station }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "sg3tu89k9", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: delivery.fuel_type }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", "data-id": "wp610l0mm", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: delivery.quantity_delivered.toLocaleString() }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "m0ms5usug", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: delivery.supplier }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "pyvypmx8p", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: delivery.driver_name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "nnv5azp50", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: getStatusBadge(delivery.status) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "font-medium", "data-id": "fjwfpzqm8", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: [
                "$",
                delivery.total_amount.toLocaleString()
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "0ybuj2s30", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", "data-id": "4kw7hkkdk", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", "data-id": "7onbeaiuk", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-4 h-4", "data-id": "0paxlnygr", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", "data-id": "jnze0uwsi", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { className: "w-4 h-4", "data-id": "iknveurhi", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx" }) })
              ] }) })
            ] }, delivery.id)
          ) })
        ] }) }),
        !loading && filteredDeliveries.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-8", "data-id": "3ub86uwdi", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Fuel, { className: "w-12 h-12 text-gray-400 mx-auto mb-4", "data-id": "gf6vceefy", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-medium text-gray-900 mb-2", "data-id": "bj1oxngmf", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: "No deliveries found" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-600", "data-id": "4hbz2jc7g", "data-path": "src/pages/Inventory/GasDeliveryInventory.tsx", children: "Try adjusting your search or filter criteria." })
        ] })
      ] })
    ] })
  ] });
};
const GasDeliveryInventory$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: GasDeliveryInventory
}, Symbol.toStringTag, { value: "Module" }));
export {
  EnhancedFileUpload as E,
  GasDeliveryInventory$1 as G,
  InventoryAlerts$1 as I,
  NumberInput as N,
  OrderList$1 as O,
  ProductList$1 as P,
  SalesReportList$1 as S,
  ViewModal as V,
  useResponsiveLayout as a,
  ProductForm$1 as b,
  compressImage as c,
  SalesReportForm$1 as d,
  OrderForm$1 as e,
  formatFileSize as f,
  isImageFile as i,
  useListKeyboardShortcuts as u
};
