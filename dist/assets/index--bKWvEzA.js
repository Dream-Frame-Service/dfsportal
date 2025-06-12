const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/Dashboard-BJb2n0nW.js","assets/react-vendor-DX0Gaxph.js","assets/vendor-ChWeSoXy.js","assets/aws-sdk-DF6-bWA6.js","assets/admin-core-DFYqoWCM.js","assets/ui-components-E8Qujiw2.js","assets/supabase-DWlqU2OS.js","assets/NotFound-FRlOHPq8.js","assets/animations-DEJKylty.js","assets/business-pages-DR8LlJyO.js","assets/admin-security-CWSw-PzD.js","assets/hr-pages-D65sLUti.js","assets/utilities-BPr3_uG_.js","assets/VendorList-DMC7x1Ad.js","assets/VendorForm-LlolkKIE.js","assets/LicenseList-DXXOk_F9.js","assets/LicenseForm-B-wiRxgR.js","assets/DeliveryList-Dwc2L1S8.js","assets/DeliveryForm-C1N5RlEX.js","assets/AppSettings-CZm6EmHI.js","assets/admin-monitoring-BbbbgHBh.js","assets/admin-development-CbHjbPee.js","assets/S3StorageManager-BJ-KOMHl.js","assets/InvalidCharacterErrorDemo-sHPGbi4w.js"])))=>i.map(i=>d[i]);
import { r as reactExports, j as jsxRuntimeExports, R as React, u as useNavigate, h as useLocation, O as Outlet, B as BrowserRouter, i as Routes, k as Route, N as Navigate, l as clientExports } from "./react-vendor-DX0Gaxph.js";
import { _ as __vitePreload } from "./supabase-DWlqU2OS.js";
import { X as cn, u as useToast, B as Button, _ as DemoAuthProvider } from "./admin-core-DFYqoWCM.js";
import { bB as Viewport, bC as Root2, bD as Action, bE as Close, X, bF as Title, bG as Description, bH as Provider, bI as Portal, bJ as Content2, bK as Provider$1, aB as Eye, b2 as CodeXml, F as Shield, a2 as Settings, bL as ChevronLeft, bm as ChevronRight, a7 as User, bM as Menu, bj as House, aA as Package, aC as Plus, U as Users, ak as TrendingUp, ax as Building2, bx as ShoppingCart, a4 as FileText, az as DollarSign, H as TriangleAlert, bw as Fuel, ay as Truck, $ as ChartColumn, N as UserCheck, W as Globe, Q as MessageSquare, Z as Activity, M as Database } from "./ui-components-E8Qujiw2.js";
import { a as cva, b3 as QueryClient, b4 as SpeedInsights, b5 as Analytics } from "./vendor-ChWeSoXy.js";
import { Q as QueryClientProvider } from "./query-Dgw9-EV7.js";
import { P as PageErrorBoundary, G as GlobalErrorBoundary, I as InvalidCharacterErrorBoundary } from "./admin-security-CWSw-PzD.js";
import { a as useResponsiveLayout } from "./business-pages-DR8LlJyO.js";
import "./aws-sdk-DF6-bWA6.js";
import "./animations-DEJKylty.js";
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const ToastProvider = Provider;
const ToastViewport = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Viewport,
  {
    ref,
    className: cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    ),
    ...props
  }
));
ToastViewport.displayName = Viewport.displayName;
const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-2 overflow-hidden rounded-md border p-4 pr-6 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive: "destructive group border-destructive bg-destructive text-destructive-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
const Toast = reactExports.forwardRef(({ className, variant, ...props }, ref) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root2,
    {
      ref,
      className: cn(toastVariants({ variant }), className),
      ...props
    }
  );
});
Toast.displayName = Root2.displayName;
const ToastAction = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Action,
  {
    ref,
    className: cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors hover:bg-secondary focus:outline-none focus:ring-1 focus:ring-ring disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
      className
    ),
    ...props
  }
));
ToastAction.displayName = Action.displayName;
const ToastClose = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Close,
  {
    ref,
    className: cn(
      "absolute right-1 top-1 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-1 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
      className
    ),
    "toast-close": "",
    ...props,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
  }
));
ToastClose.displayName = Close.displayName;
const ToastTitle = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Title,
  {
    ref,
    className: cn("text-sm font-semibold [&+div]:text-xs", className),
    ...props
  }
));
ToastTitle.displayName = Title.displayName;
const ToastDescription = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Description,
  {
    ref,
    className: cn("text-sm opacity-90", className),
    ...props
  }
));
ToastDescription.displayName = Description.displayName;
function Toaster() {
  const { toasts } = useToast();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(ToastProvider, { children: [
    toasts.map(function({ id, title, description, action, ...props }) {
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(Toast, { ...props, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1", children: [
          title && /* @__PURE__ */ jsxRuntimeExports.jsx(ToastTitle, { children: title }),
          description && /* @__PURE__ */ jsxRuntimeExports.jsx(ToastDescription, { children: description })
        ] }),
        action,
        /* @__PURE__ */ jsxRuntimeExports.jsx(ToastClose, {})
      ] }, id);
    }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ToastViewport, {})
  ] });
}
const TooltipProvider = Provider$1;
const TooltipContent = reactExports.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Portal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
  Content2,
  {
    ref,
    sideOffset,
    className: cn(
      "z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-tooltip-content-transform-origin]",
      className
    ),
    ...props
  }
) }));
TooltipContent.displayName = Content2.displayName;
const Logo = ({
  size = "md",
  showText = true,
  className = ""
}) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-20 h-20",
    auto: "w-full h-full max-w-full max-h-full"
  };
  const textSizeClasses = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-xl",
    xl: "text-2xl",
    auto: "text-base"
  };
  const iconSize = {
    sm: "text-xs",
    md: "text-lg",
    lg: "text-2xl",
    xl: "text-3xl",
    auto: "text-sm"
  };
  const [imageError, setImageError] = React.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center space-x-3 ${className}`, "data-id": "r09kmjjsr", "data-path": "src/components/Logo.tsx", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative flex-shrink-0", "data-id": "8sfjadh9g", "data-path": "src/components/Logo.tsx", children: !imageError ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "img",
      {
        src: "https://newoaks.s3.us-west-1.amazonaws.com/AutoDev/19016/c533e5f9-97eb-43d2-8be6-bcdff5709bba.png",
        alt: "DFS Manager Portal Logo",
        className: `${sizeClasses[size]} object-contain drop-shadow-sm`,
        onError: () => {
          console.log("DFS logo not found, using fallback design");
          setImageError(true);
        },
        "data-id": "1pgq8fldt",
        "data-path": "src/components/Logo.tsx"
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `${sizeClasses[size]} bg-gradient-to-br from-blue-800 to-blue-900 rounded-lg flex items-center justify-center text-white font-bold ${iconSize[size]} shadow-lg border border-blue-700`, "data-id": "0c7xatn2v", "data-path": "src/components/Logo.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", "data-id": "4vyjftvis", "data-path": "src/components/Logo.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-extrabold tracking-wide", "data-id": "5kmt2s486", "data-path": "src/components/Logo.tsx", children: "DFS" }),
      size !== "sm" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs opacity-90", "data-id": "09mevaenh", "data-path": "src/components/Logo.tsx", children: "MGR" })
    ] }) }) }),
    showText && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col justify-center", "data-id": "xqdjugh0x", "data-path": "src/components/Logo.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `font-bold text-gray-800 leading-tight ${textSizeClasses[size]}`, "data-id": "ou0dvholx", "data-path": "src/components/Logo.tsx", children: "DFS Manager Portal" }) })
  ] });
};
const DemoDashboardLayout = () => {
  var _a;
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = reactExports.useState(true);
  useResponsiveLayout();
  const navigationItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(House, { className: "w-5 h-5" })
    },
    {
      name: "Products",
      path: "/products",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "w-5 h-5" }),
      children: [
        { name: "All Products", path: "/products", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "w-4 h-4" }) },
        { name: "Add Product", path: "/products/new", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }) }
      ]
    },
    {
      name: "Employees",
      path: "/employees",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-5 h-5" }),
      children: [
        { name: "All Employees", path: "/employees", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-4 h-4" }) },
        { name: "Add Employee", path: "/employees/new", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }) }
      ]
    },
    {
      name: "Sales Reports",
      path: "/sales",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-5 h-5" }),
      children: [
        { name: "All Reports", path: "/sales", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-4 h-4" }) },
        { name: "Add Report", path: "/sales/new", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }) }
      ]
    },
    {
      name: "Vendors",
      path: "/vendors",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "w-5 h-5" }),
      children: [
        { name: "All Vendors", path: "/vendors", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "w-4 h-4" }) },
        { name: "Add Vendor", path: "/vendors/new", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }) }
      ]
    },
    {
      name: "Orders",
      path: "/orders",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "w-5 h-5" }),
      children: [
        { name: "All Orders", path: "/orders", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "w-4 h-4" }) },
        { name: "Create Order", path: "/orders/new", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }) }
      ]
    },
    {
      name: "Licenses",
      path: "/licenses",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-5 h-5" }),
      children: [
        { name: "All Licenses", path: "/licenses", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-4 h-4" }) },
        { name: "Add License", path: "/licenses/new", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }) }
      ]
    },
    {
      name: "Salary",
      path: "/salary",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "w-5 h-5" })
    },
    {
      name: "Inventory",
      path: "/inventory/alerts",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-5 h-5" })
    },
    {
      name: "Gas Delivery",
      path: "/gas-delivery",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Fuel, { className: "w-5 h-5" })
    },
    {
      name: "Delivery",
      path: "/delivery",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "w-5 h-5" }),
      children: [
        { name: "All Deliveries", path: "/delivery", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "w-4 h-4" }) },
        { name: "New Delivery", path: "/delivery/new", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }) }
      ]
    },
    {
      name: "Admin Panel",
      path: "/admin",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-5 h-5" }),
      children: [
        { name: "Admin Dashboard", path: "/admin/dashboard", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "w-4 h-4" }) },
        { name: "User Management", path: "/admin/user-management", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(UserCheck, { className: "w-4 h-4" }) },
        { name: "Site Management", path: "/admin/site-management", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "w-4 h-4" }) },
        { name: "System Logs", path: "/admin/system-logs", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-4 h-4" }) },
        { name: "Security Settings", path: "/admin/security-settings", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-4 h-4" }) },
        { name: "SMS Alerts", path: "/admin/sms-alert-management", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "w-4 h-4" }) },
        { name: "Error Recovery", path: "/admin/error-recovery", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "w-4 h-4" }) },
        { name: "Memory Monitoring", path: "/admin/memory-monitoring", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Database, { className: "w-4 h-4" }) },
        { name: "Database Monitoring", path: "/admin/database-monitoring", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Database, { className: "w-4 h-4" }) },
        { name: "Audit Monitoring", path: "/admin/audit-monitoring", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-4 h-4" }) },
        { name: "Database Auto-sync", path: "/admin/database-autosync", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Database, { className: "w-4 h-4" }) },
        { name: "Supabase Test", path: "/admin/supabase-test", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Database, { className: "w-4 h-4" }) },
        { name: "Development Monitoring", path: "/admin/development-monitoring", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CodeXml, { className: "w-4 h-4" }) },
        { name: "Role Testing", path: "/admin/role-testing", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-4 h-4" }) },
        { name: "Advanced Real-time", path: "/admin/advanced-realtime", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "w-4 h-4" }) },
        { name: "S3 Storage", path: "/admin/s3-storage", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Database, { className: "w-4 h-4" }) },
        { name: "Error Demo", path: "/admin/invalid-character-demo", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-4 h-4" }) }
      ]
    }
  ];
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  const isActiveRoute = (path) => {
    if (path === "/dashboard" && location.pathname === "/") return true;
    return location.pathname.startsWith(path);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-screen bg-gray-100", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white px-4 py-3 shadow-lg border-b-2 border-yellow-400", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between max-w-7xl mx-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-5 h-5 text-yellow-300" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-bold", children: "🚀 DEVELOPMENT DEMO MODE" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CodeXml, { className: "w-5 h-5 text-yellow-300" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-6 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 bg-green-400 rounded-full animate-pulse" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "All Features Visible" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-4 h-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "No Auth Required" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "w-4 h-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Full Admin Access" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center mt-1 text-xs text-blue-100", children: "Review all functionality • Define role-based access later • Complete system preview" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `${sidebarOpen ? "w-64" : "w-16"} transition-all duration-300 bg-white shadow-lg flex flex-col mt-20`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 border-b border-gray-200", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        sidebarOpen ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Logo, { className: "w-8 h-8" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-lg font-bold text-gray-900", children: "DFS Portal" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-blue-600 font-medium", children: "DEMO MODE" })
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Logo, { className: "w-8 h-8 mx-auto" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "ghost",
            size: "sm",
            onClick: toggleSidebar,
            className: "p-1",
            children: sidebarOpen ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-4 h-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4" })
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex-1 p-4 space-y-2 overflow-y-auto", children: navigationItems.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: isActiveRoute(item.path) ? "default" : "ghost",
          className: `w-full justify-start ${!sidebarOpen ? "px-2" : ""}`,
          onClick: () => navigate(item.path),
          children: [
            item.icon,
            sidebarOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-3", children: item.name })
          ]
        },
        item.path
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 border-t border-gray-200", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center ${!sidebarOpen ? "justify-center" : "space-x-3"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-4 h-4 text-white" }) }),
        sidebarOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-gray-900 truncate", children: "Demo Admin" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-blue-600 truncate", children: "demo@dfs-portal.com" })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col mt-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "bg-white shadow-sm border-b border-gray-200 px-6 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-4", children: [
          !sidebarOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "sm",
              onClick: toggleSidebar,
              className: "lg:hidden",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "w-5 h-5" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold text-gray-900", children: ((_a = navigationItems.find((item) => isActiveRoute(item.path))) == null ? void 0 : _a.name) || "Dashboard" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-blue-600", children: "Development Preview Mode" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden md:flex items-center space-x-2 px-3 py-1 bg-blue-50 rounded-full", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 bg-green-500 rounded-full animate-pulse" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-blue-700 font-medium", children: "All Systems Operational" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", className: "text-blue-600 border-blue-200", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-4 h-4 mr-2" }),
            "Preview Mode"
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 overflow-y-auto bg-gray-50 p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PageErrorBoundary, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) }) })
    ] })
  ] });
};
const PageLoader = () => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center min-h-screen bg-gray-50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-4", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" }),
  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-medium text-gray-900", children: "Loading DFS Portal" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-blue-600", children: "Demo Mode - Development Preview" })
  ] })
] }) });
const Dashboard = reactExports.lazy(() => __vitePreload(() => import("./Dashboard-BJb2n0nW.js"), true ? __vite__mapDeps([0,1,2,3,4,5,6]) : void 0));
const NotFound = reactExports.lazy(() => __vitePreload(() => import("./NotFound-FRlOHPq8.js"), true ? __vite__mapDeps([7,1,2,3,4,5,6,8]) : void 0));
const ProductList = reactExports.lazy(() => __vitePreload(() => import("./business-pages-DR8LlJyO.js").then((n) => n.P), true ? __vite__mapDeps([9,1,2,3,4,5,6,10,8]) : void 0));
const ProductForm = reactExports.lazy(() => __vitePreload(() => import("./business-pages-DR8LlJyO.js").then((n) => n.b), true ? __vite__mapDeps([9,1,2,3,4,5,6,10,8]) : void 0));
const EmployeeList = reactExports.lazy(() => __vitePreload(() => import("./hr-pages-D65sLUti.js").then((n) => n.E), true ? __vite__mapDeps([11,1,2,3,4,5,6,9,10,8,12]) : void 0));
const EmployeeForm = reactExports.lazy(() => __vitePreload(() => import("./hr-pages-D65sLUti.js").then((n) => n.a), true ? __vite__mapDeps([11,1,2,3,4,5,6,9,10,8,12]) : void 0));
const SalesReportList = reactExports.lazy(() => __vitePreload(() => import("./business-pages-DR8LlJyO.js").then((n) => n.S), true ? __vite__mapDeps([9,1,2,3,4,5,6,10,8]) : void 0));
const SalesReportForm = reactExports.lazy(() => __vitePreload(() => import("./business-pages-DR8LlJyO.js").then((n) => n.d), true ? __vite__mapDeps([9,1,2,3,4,5,6,10,8]) : void 0));
const VendorList = reactExports.lazy(() => __vitePreload(() => import("./VendorList-DMC7x1Ad.js"), true ? __vite__mapDeps([13,1,2,3,4,5,6,9,10,8]) : void 0));
const VendorForm = reactExports.lazy(() => __vitePreload(() => import("./VendorForm-LlolkKIE.js"), true ? __vite__mapDeps([14,1,2,3,4,5,6]) : void 0));
const OrderList = reactExports.lazy(() => __vitePreload(() => import("./business-pages-DR8LlJyO.js").then((n) => n.O), true ? __vite__mapDeps([9,1,2,3,4,5,6,10,8]) : void 0));
const OrderForm = reactExports.lazy(() => __vitePreload(() => import("./business-pages-DR8LlJyO.js").then((n) => n.e), true ? __vite__mapDeps([9,1,2,3,4,5,6,10,8]) : void 0));
const LicenseList = reactExports.lazy(() => __vitePreload(() => import("./LicenseList-DXXOk_F9.js"), true ? __vite__mapDeps([15,1,2,3,4,5,6,10]) : void 0));
const LicenseForm = reactExports.lazy(() => __vitePreload(() => import("./LicenseForm-B-wiRxgR.js"), true ? __vite__mapDeps([16,1,2,3,4,5,6,9,10,8]) : void 0));
const SalaryList = reactExports.lazy(() => __vitePreload(() => import("./hr-pages-D65sLUti.js").then((n) => n.S), true ? __vite__mapDeps([11,1,2,3,4,5,6,9,10,8,12]) : void 0));
const SalaryForm = reactExports.lazy(() => __vitePreload(() => import("./hr-pages-D65sLUti.js").then((n) => n.b), true ? __vite__mapDeps([11,1,2,3,4,5,6,9,10,8,12]) : void 0));
const InventoryAlerts = reactExports.lazy(() => __vitePreload(() => import("./business-pages-DR8LlJyO.js").then((n) => n.I), true ? __vite__mapDeps([9,1,2,3,4,5,6,10,8]) : void 0));
const GasDeliveryInventory = reactExports.lazy(() => __vitePreload(() => import("./business-pages-DR8LlJyO.js").then((n) => n.G), true ? __vite__mapDeps([9,1,2,3,4,5,6,10,8]) : void 0));
const DeliveryList = reactExports.lazy(() => __vitePreload(() => import("./DeliveryList-Dwc2L1S8.js"), true ? __vite__mapDeps([17,1,2,3,4,5,6]) : void 0));
const DeliveryForm = reactExports.lazy(() => __vitePreload(() => import("./DeliveryForm-C1N5RlEX.js"), true ? __vite__mapDeps([18,1,2,3,4,5,6,9,10,8]) : void 0));
const AppSettings = reactExports.lazy(() => __vitePreload(() => import("./AppSettings-CZm6EmHI.js"), true ? __vite__mapDeps([19,1,2,3,4,5,6,9,10,8]) : void 0));
const AdminPanel = reactExports.lazy(() => __vitePreload(() => import("./admin-core-DFYqoWCM.js").then((n) => n.$), true ? __vite__mapDeps([4,1,2,3,5,6]) : void 0));
const AdminDashboard = reactExports.lazy(() => __vitePreload(() => import("./admin-core-DFYqoWCM.js").then((n) => n.a0), true ? __vite__mapDeps([4,1,2,3,5,6]) : void 0));
const UserManagement = reactExports.lazy(() => __vitePreload(() => import("./admin-core-DFYqoWCM.js").then((n) => n.a1), true ? __vite__mapDeps([4,1,2,3,5,6]) : void 0));
const SiteManagement = reactExports.lazy(() => __vitePreload(() => import("./admin-core-DFYqoWCM.js").then((n) => n.a2), true ? __vite__mapDeps([4,1,2,3,5,6]) : void 0));
const SystemLogs = reactExports.lazy(() => __vitePreload(() => import("./admin-monitoring-BbbbgHBh.js").then((n) => n.S), true ? __vite__mapDeps([20,1,2,3,4,5,6]) : void 0));
const SecuritySettings = reactExports.lazy(() => __vitePreload(() => import("./admin-security-CWSw-PzD.js").then((n) => n.S), true ? __vite__mapDeps([10,1,2,3,4,5,6]) : void 0));
const SMSAlertManagement = reactExports.lazy(() => __vitePreload(() => import("./admin-security-CWSw-PzD.js").then((n) => n.e), true ? __vite__mapDeps([10,1,2,3,4,5,6]) : void 0));
const ErrorRecoveryPage = reactExports.lazy(() => __vitePreload(() => import("./admin-security-CWSw-PzD.js").then((n) => n.f), true ? __vite__mapDeps([10,1,2,3,4,5,6]) : void 0));
const MemoryMonitoring = reactExports.lazy(() => __vitePreload(() => import("./admin-monitoring-BbbbgHBh.js").then((n) => n.M), true ? __vite__mapDeps([20,1,2,3,4,5,6]) : void 0));
const DatabaseMonitoring = reactExports.lazy(() => __vitePreload(() => import("./admin-monitoring-BbbbgHBh.js").then((n) => n.D), true ? __vite__mapDeps([20,1,2,3,4,5,6]) : void 0));
const AuditMonitoring = reactExports.lazy(() => __vitePreload(() => import("./admin-monitoring-BbbbgHBh.js").then((n) => n.A), true ? __vite__mapDeps([20,1,2,3,4,5,6]) : void 0));
const DatabaseAutoSyncPage = reactExports.lazy(() => __vitePreload(() => import("./admin-development-CbHjbPee.js").then((n) => n.D), true ? __vite__mapDeps([21,1,2,3,4,5,6,8]) : void 0));
const SupabaseConnectionTestPage = reactExports.lazy(() => __vitePreload(() => import("./admin-development-CbHjbPee.js").then((n) => n.S), true ? __vite__mapDeps([21,1,2,3,4,5,6,8]) : void 0));
const DevelopmentMonitoringPage = reactExports.lazy(() => __vitePreload(() => import("./admin-development-CbHjbPee.js").then((n) => n.a), true ? __vite__mapDeps([21,1,2,3,4,5,6,8]) : void 0));
const RoleTestingPage = reactExports.lazy(() => __vitePreload(() => import("./admin-development-CbHjbPee.js").then((n) => n.R), true ? __vite__mapDeps([21,1,2,3,4,5,6,8]) : void 0));
const AdvancedRealTimeFeatures = reactExports.lazy(() => __vitePreload(() => import("./admin-development-CbHjbPee.js").then((n) => n.A), true ? __vite__mapDeps([21,1,2,3,4,5,6,8]) : void 0));
const S3StorageManager = reactExports.lazy(() => __vitePreload(() => import("./S3StorageManager-BJ-KOMHl.js"), true ? __vite__mapDeps([22,1,2,3,4,5,6]) : void 0).then((module) => ({ default: module.S3StorageManager })));
const InvalidCharacterErrorDemo = reactExports.lazy(() => __vitePreload(() => import("./InvalidCharacterErrorDemo-sHPGbi4w.js"), true ? __vite__mapDeps([23,1,2,3,4,5,6,10]) : void 0));
const queryClient = new QueryClient();
function App() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(GlobalErrorBoundary, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(InvalidCharacterErrorBoundary, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxRuntimeExports.jsx(DemoAuthProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TooltipProvider, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(BrowserRouter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx(PageLoader, {}), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Routes, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Route, { path: "/", element: /* @__PURE__ */ jsxRuntimeExports.jsx(DemoDashboardLayout, {}), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { index: true, element: /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/dashboard", replace: true }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "dashboard", element: /* @__PURE__ */ jsxRuntimeExports.jsx(Dashboard, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "products", element: /* @__PURE__ */ jsxRuntimeExports.jsx(ProductList, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "products/new", element: /* @__PURE__ */ jsxRuntimeExports.jsx(ProductForm, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "products/edit/:id", element: /* @__PURE__ */ jsxRuntimeExports.jsx(ProductForm, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "employees", element: /* @__PURE__ */ jsxRuntimeExports.jsx(EmployeeList, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "employees/new", element: /* @__PURE__ */ jsxRuntimeExports.jsx(EmployeeForm, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "employees/edit/:id", element: /* @__PURE__ */ jsxRuntimeExports.jsx(EmployeeForm, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "sales", element: /* @__PURE__ */ jsxRuntimeExports.jsx(SalesReportList, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "sales/new", element: /* @__PURE__ */ jsxRuntimeExports.jsx(SalesReportForm, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "sales/edit/:id", element: /* @__PURE__ */ jsxRuntimeExports.jsx(SalesReportForm, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "vendors", element: /* @__PURE__ */ jsxRuntimeExports.jsx(VendorList, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "vendors/new", element: /* @__PURE__ */ jsxRuntimeExports.jsx(VendorForm, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "vendors/edit/:id", element: /* @__PURE__ */ jsxRuntimeExports.jsx(VendorForm, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "orders", element: /* @__PURE__ */ jsxRuntimeExports.jsx(OrderList, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "orders/new", element: /* @__PURE__ */ jsxRuntimeExports.jsx(OrderForm, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "orders/edit/:id", element: /* @__PURE__ */ jsxRuntimeExports.jsx(OrderForm, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "licenses", element: /* @__PURE__ */ jsxRuntimeExports.jsx(LicenseList, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "licenses/new", element: /* @__PURE__ */ jsxRuntimeExports.jsx(LicenseForm, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "licenses/edit/:id", element: /* @__PURE__ */ jsxRuntimeExports.jsx(LicenseForm, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "salary", element: /* @__PURE__ */ jsxRuntimeExports.jsx(SalaryList, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "salary/new", element: /* @__PURE__ */ jsxRuntimeExports.jsx(SalaryForm, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "salary/:id", element: /* @__PURE__ */ jsxRuntimeExports.jsx(SalaryForm, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "salary/:id/edit", element: /* @__PURE__ */ jsxRuntimeExports.jsx(SalaryForm, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "inventory/alerts", element: /* @__PURE__ */ jsxRuntimeExports.jsx(InventoryAlerts, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "inventory/settings", element: /* @__PURE__ */ jsxRuntimeExports.jsx(AppSettings, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "gas-delivery", element: /* @__PURE__ */ jsxRuntimeExports.jsx(GasDeliveryInventory, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "delivery", element: /* @__PURE__ */ jsxRuntimeExports.jsx(DeliveryList, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "delivery/new", element: /* @__PURE__ */ jsxRuntimeExports.jsx(DeliveryForm, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "delivery/edit/:id", element: /* @__PURE__ */ jsxRuntimeExports.jsx(DeliveryForm, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "admin", element: /* @__PURE__ */ jsxRuntimeExports.jsx(AdminPanel, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "admin/dashboard", element: /* @__PURE__ */ jsxRuntimeExports.jsx(AdminDashboard, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "admin/user-management", element: /* @__PURE__ */ jsxRuntimeExports.jsx(UserManagement, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "admin/site-management", element: /* @__PURE__ */ jsxRuntimeExports.jsx(SiteManagement, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "admin/system-logs", element: /* @__PURE__ */ jsxRuntimeExports.jsx(SystemLogs, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "admin/security-settings", element: /* @__PURE__ */ jsxRuntimeExports.jsx(SecuritySettings, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "admin/sms-alert-management", element: /* @__PURE__ */ jsxRuntimeExports.jsx(SMSAlertManagement, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "admin/error-recovery", element: /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorRecoveryPage, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "admin/memory-monitoring", element: /* @__PURE__ */ jsxRuntimeExports.jsx(MemoryMonitoring, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "admin/database-monitoring", element: /* @__PURE__ */ jsxRuntimeExports.jsx(DatabaseMonitoring, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "admin/audit-monitoring", element: /* @__PURE__ */ jsxRuntimeExports.jsx(AuditMonitoring, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "admin/database-autosync", element: /* @__PURE__ */ jsxRuntimeExports.jsx(DatabaseAutoSyncPage, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "admin/supabase-test", element: /* @__PURE__ */ jsxRuntimeExports.jsx(SupabaseConnectionTestPage, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "admin/development-monitoring", element: /* @__PURE__ */ jsxRuntimeExports.jsx(DevelopmentMonitoringPage, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "admin/role-testing", element: /* @__PURE__ */ jsxRuntimeExports.jsx(RoleTestingPage, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "admin/advanced-realtime", element: /* @__PURE__ */ jsxRuntimeExports.jsx(AdvancedRealTimeFeatures, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "admin/s3-storage", element: /* @__PURE__ */ jsxRuntimeExports.jsx(S3StorageManager, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "admin/invalid-character-demo", element: /* @__PURE__ */ jsxRuntimeExports.jsx(InvalidCharacterErrorDemo, {}) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "*", element: /* @__PURE__ */ jsxRuntimeExports.jsx(NotFound, {}) })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SpeedInsights, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Analytics, {})
  ] }) }) }) }) });
}
console.warn("🚀 Starting DFS Manager Portal...");
try {
  const container = document.getElementById("root");
  if (container) {
    const root = clientExports.createRoot(container);
    root.render(/* @__PURE__ */ jsxRuntimeExports.jsx(App, { "data-id": "pjf367331", "data-path": "src/main.tsx" }));
    console.warn("✅ App rendered successfully");
  } else {
    console.error("❌ Root element not found");
  }
} catch (error) {
  console.error("❌ App initialization failed:", error);
}
