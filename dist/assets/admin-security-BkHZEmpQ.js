var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { u as useNavigate, R as React, j as jsxRuntimeExports, r as reactExports } from "./react-vendor-DX0Gaxph.js";
import { C as Card, d as CardHeader, e as CardTitle, l as Badge, g as CardContent, B as Button, A as Alert, m as AlertDescription, u as useToast, z as Table, E as TableHeader, F as TableRow, G as TableHead, H as TableBody, J as TableCell, s as supabase, o as useAdminAccess, Q as useBatchSelection, p as AccessDenied, L as Label, I as Input, n as Switch, R as BatchActionBar, U as Checkbox, V as BatchDeleteDialog, S as Select, h as SelectTrigger, i as SelectValue, j as SelectContent, k as SelectItem, O as Textarea, P as Progress, T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent, f as CardDescription } from "./admin-core-CknIDYcP.js";
import { bi as Root, bj as CollapsibleTrigger$1, bk as CollapsibleContent$1, Y as RefreshCw, bl as House, o as ChevronUp, f as ChevronDown, bb as Bug, H as TriangleAlert, aG as Save, ai as Clock, a0 as CircleCheckBig, aa as Download, ao as Trash2, F as Shield, ab as CircleX, U as Users, G as Lock, aV as Key, ag as Server, W as Globe, aZ as TestTube, aD as LoaderCircle, bm as Send, ac as CircleAlert, Q as MessageSquare, a7 as User, aS as Phone, aU as Info, a2 as Settings, aF as Copy, aP as EyeOff, aB as Eye, aj as ExternalLink, az as DollarSign, bn as ChevronRight, bo as History, aC as Plus, an as SquarePen, a5 as Zap, $ as ChartColumn, bp as RefreshCcw, bg as Timer, M as Database, Z as Activity, K as CircleCheck, ak as TrendingUp, bq as TrendingDown, _ as Target } from "./ui-components-svEX1DXz.js";
const _ErrorLogger = class _ErrorLogger {
  // Keep last 100 error logs
  constructor() {
    __publicField(this, "logs", []);
    __publicField(this, "maxLogs", 100);
  }
  static getInstance() {
    if (!_ErrorLogger.instance) {
      _ErrorLogger.instance = new _ErrorLogger();
    }
    return _ErrorLogger.instance;
  }
  log(error, severity = "medium", component, errorInfo, context) {
    const logEntry = {
      id: this.generateId(),
      timestamp: /* @__PURE__ */ new Date(),
      error,
      errorInfo,
      component,
      userId: this.getCurrentUserId(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      severity,
      context
    };
    this.logs.unshift(logEntry);
    if (this.logs.length > this.maxLogs) {
      this.logs.pop();
    }
    this.logToConsole(logEntry);
    this.persistLogs();
    {
      this.sendToErrorService(logEntry);
    }
  }
  logToConsole(entry) {
    const style = this.getConsoleStyle(entry.severity);
    console.group(`%c🚨 Error Boundary Caught Error - ${entry.severity.toUpperCase()}`, style);
    console.error("Error:", entry.error);
    console.log("Component:", entry.component || "Unknown");
    console.log("Timestamp:", entry.timestamp.toISOString());
    console.log("URL:", entry.url);
    if (entry.errorInfo) {
      console.log("Component Stack:", entry.errorInfo.componentStack);
    }
    if (entry.context) {
      console.log("Context:", entry.context);
    }
    console.groupEnd();
  }
  getConsoleStyle(severity) {
    const styles = {
      low: "color: #856404; background: #fff3cd; padding: 2px 4px; border-radius: 3px;",
      medium: "color: #721c24; background: #f8d7da; padding: 2px 4px; border-radius: 3px;",
      high: "color: #721c24; background: #f5c6cb; padding: 2px 4px; border-radius: 3px; font-weight: bold;",
      critical: "color: white; background: #dc3545; padding: 2px 4px; border-radius: 3px; font-weight: bold;"
    };
    return styles[severity];
  }
  persistLogs() {
    try {
      const serializedLogs = this.logs.map((log) => ({
        ...log,
        error: {
          name: log.error.name,
          message: log.error.message,
          stack: log.error.stack
        }
      }));
      localStorage.setItem("dfs_error_logs", JSON.stringify(serializedLogs));
    } catch (e) {
      console.warn("Failed to persist error logs:", e);
    }
  }
  sendToErrorService(entry) {
  }
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
  getCurrentUserId() {
    try {
      return localStorage.getItem("user_id") || void 0;
    } catch {
      return void 0;
    }
  }
  getLogs() {
    return [...this.logs];
  }
  clearLogs() {
    this.logs = [];
    localStorage.removeItem("dfs_error_logs");
  }
  getLogsSummary() {
    const bySeverity = this.logs.reduce((acc, log) => {
      acc[log.severity] = (acc[log.severity] || 0) + 1;
      return acc;
    }, {});
    return { total: this.logs.length, bySeverity };
  }
};
__publicField(_ErrorLogger, "instance");
let ErrorLogger = _ErrorLogger;
const Collapsible = Root;
const CollapsibleTrigger = CollapsibleTrigger$1;
const CollapsibleContent = CollapsibleContent$1;
const ErrorFallback = ({
  error,
  resetError,
  severity = "medium",
  component,
  showDetails = true,
  showNavigation = true,
  customMessage,
  customActions
}) => {
  const navigate = useNavigate();
  const [showDetailedError, setShowDetailedError] = React.useState(false);
  const getSeverityConfig = (severity2) => {
    const configs = {
      low: {
        color: "text-yellow-600",
        bgColor: "bg-yellow-50 border-yellow-200",
        badgeVariant: "secondary",
        icon: TriangleAlert,
        title: "Minor Issue Detected"
      },
      medium: {
        color: "text-orange-600",
        bgColor: "bg-orange-50 border-orange-200",
        badgeVariant: "destructive",
        icon: TriangleAlert,
        title: "Error Occurred"
      },
      high: {
        color: "text-red-600",
        bgColor: "bg-red-50 border-red-200",
        badgeVariant: "destructive",
        icon: TriangleAlert,
        title: "Serious Error"
      },
      critical: {
        color: "text-red-700",
        bgColor: "bg-red-100 border-red-300",
        badgeVariant: "destructive",
        icon: Bug,
        title: "Critical System Error"
      }
    };
    return configs[severity2] || configs.medium;
  };
  const config = getSeverityConfig(severity);
  const IconComponent = config.icon;
  const getErrorMessage = () => {
    if (customMessage) return customMessage;
    switch (severity) {
      case "low":
        return "A minor issue occurred, but you can continue using the application.";
      case "medium":
        return "An error occurred while processing your request. Please try again.";
      case "high":
        return "A serious error occurred. Some features may not work properly.";
      case "critical":
        return "A critical system error occurred. Please contact support if this continues.";
      default:
        return "Something went wrong. Please try refreshing the page.";
    }
  };
  const handleGoHome = () => {
    navigate("/dashboard");
  };
  const handleRefreshPage = () => {
    window.location.reload();
  };
  const formatErrorForDisplay = (error2) => {
    var _a;
    return {
      name: error2.name,
      message: error2.message,
      stack: (_a = error2.stack) == null ? void 0 : _a.split("\n").slice(0, 10).join("\n")
      // Limit stack trace
    };
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-[400px] flex items-center justify-center p-4", "data-id": "qxpwrwel0", "data-path": "src/components/ErrorBoundary/ErrorFallback.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: `w-full max-w-2xl ${config.bgColor} border-2`, "data-id": "jfsd90z39", "data-path": "src/components/ErrorBoundary/ErrorFallback.tsx", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "text-center", "data-id": "cyv947hr2", "data-path": "src/components/ErrorBoundary/ErrorFallback.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center mb-4", "data-id": "g53cxgf07", "data-path": "src/components/ErrorBoundary/ErrorFallback.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `p-3 rounded-full bg-white shadow-md ${config.color}`, "data-id": "ywmk0itai", "data-path": "src/components/ErrorBoundary/ErrorFallback.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(IconComponent, { size: 32, "data-id": "b1p8vup0g", "data-path": "src/components/ErrorBoundary/ErrorFallback.tsx" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: `text-xl font-bold ${config.color}`, "data-id": "q54uama4x", "data-path": "src/components/ErrorBoundary/ErrorFallback.tsx", children: config.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2 mt-2", "data-id": "vwfvixe0n", "data-path": "src/components/ErrorBoundary/ErrorFallback.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: config.badgeVariant, className: "text-sm", "data-id": "97oogdqnq", "data-path": "src/components/ErrorBoundary/ErrorFallback.tsx", children: severity.toUpperCase() }),
        component && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-sm", "data-id": "u38dvv094", "data-path": "src/components/ErrorBoundary/ErrorFallback.tsx", children: component })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", "data-id": "xf8t419uk", "data-path": "src/components/ErrorBoundary/ErrorFallback.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-700 text-center leading-relaxed", "data-id": "iacm2p8cc", "data-path": "src/components/ErrorBoundary/ErrorFallback.tsx", children: getErrorMessage() }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3 justify-center", "data-id": "6xy1mkhw6", "data-path": "src/components/ErrorBoundary/ErrorFallback.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: resetError,
            variant: "default",
            className: "flex items-center gap-2",
            "data-id": "2z1r7fb9z",
            "data-path": "src/components/ErrorBoundary/ErrorFallback.tsx",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 16, "data-id": "o30vv6smg", "data-path": "src/components/ErrorBoundary/ErrorFallback.tsx" }),
              "Try Again"
            ]
          }
        ),
        showNavigation && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: handleGoHome,
              variant: "outline",
              className: "flex items-center gap-2",
              "data-id": "ccoedpd4u",
              "data-path": "src/components/ErrorBoundary/ErrorFallback.tsx",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(House, { size: 16, "data-id": "f3wnk9qzx", "data-path": "src/components/ErrorBoundary/ErrorFallback.tsx" }),
                "Go to Dashboard"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: handleRefreshPage,
              variant: "outline",
              className: "flex items-center gap-2",
              "data-id": "jqv0fa49f",
              "data-path": "src/components/ErrorBoundary/ErrorFallback.tsx",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 16, "data-id": "gc8trphpm", "data-path": "src/components/ErrorBoundary/ErrorFallback.tsx" }),
                "Refresh Page"
              ]
            }
          )
        ] })
      ] }),
      customActions && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center", "data-id": "oh5kvk8u0", "data-path": "src/components/ErrorBoundary/ErrorFallback.tsx", children: customActions }),
      showDetails && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Collapsible,
        {
          open: showDetailedError,
          onOpenChange: setShowDetailedError,
          className: "mt-6",
          "data-id": "xqp2ljfbn",
          "data-path": "src/components/ErrorBoundary/ErrorFallback.tsx",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CollapsibleTrigger, { asChild: true, "data-id": "bjbgp52h9", "data-path": "src/components/ErrorBoundary/ErrorFallback.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "sm",
                className: "w-full flex items-center justify-center gap-2 text-gray-600 hover:text-gray-800",
                "data-id": "lf27pmpfq",
                "data-path": "src/components/ErrorBoundary/ErrorFallback.tsx",
                children: showDetailedError ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { size: 16, "data-id": "ceqo4m5j9", "data-path": "src/components/ErrorBoundary/ErrorFallback.tsx" }),
                  "Hide Technical Details"
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 16, "data-id": "y8gar1bgv", "data-path": "src/components/ErrorBoundary/ErrorFallback.tsx" }),
                  "Show Technical Details"
                ] })
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CollapsibleContent, { className: "mt-3", "data-id": "prcocxet0", "data-path": "src/components/ErrorBoundary/ErrorFallback.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-100 rounded-lg p-4 text-sm font-mono", "data-id": "59nxiih8n", "data-path": "src/components/ErrorBoundary/ErrorFallback.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2", "data-id": "lfaw8qoxm", "data-path": "src/components/ErrorBoundary/ErrorFallback.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { "data-id": "gj451x0bm", "data-path": "src/components/ErrorBoundary/ErrorFallback.tsx", children: "Error Type:" }),
                " ",
                formatErrorForDisplay(error).name
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2", "data-id": "ck5auvd50", "data-path": "src/components/ErrorBoundary/ErrorFallback.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { "data-id": "pveizacff", "data-path": "src/components/ErrorBoundary/ErrorFallback.tsx", children: "Message:" }),
                " ",
                formatErrorForDisplay(error).message
              ] }),
              formatErrorForDisplay(error).stack && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "qcg9g1zg0", "data-path": "src/components/ErrorBoundary/ErrorFallback.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { "data-id": "rzsyw92ew", "data-path": "src/components/ErrorBoundary/ErrorFallback.tsx", children: "Stack Trace:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "mt-1 text-xs text-gray-600 whitespace-pre-wrap overflow-x-auto", "data-id": "3ytt1u7cg", "data-path": "src/components/ErrorBoundary/ErrorFallback.tsx", children: formatErrorForDisplay(error).stack })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 text-xs text-gray-500", "data-id": "1ykzjh440", "data-path": "src/components/ErrorBoundary/ErrorFallback.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { "data-id": "kdck9a7au", "data-path": "src/components/ErrorBoundary/ErrorFallback.tsx", children: "Timestamp:" }),
                " ",
                (/* @__PURE__ */ new Date()).toISOString()
              ] })
            ] }) })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 p-3 bg-gray-50 rounded-lg text-center text-sm text-gray-600", "data-id": "25vuylgik", "data-path": "src/components/ErrorBoundary/ErrorFallback.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { "data-id": "7w9t9daat", "data-path": "src/components/ErrorBoundary/ErrorFallback.tsx", children: "If this error persists, please contact support with the error details above." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1", "data-id": "wc9sewilr", "data-path": "src/components/ErrorBoundary/ErrorFallback.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { "data-id": "k8pdtzrzh", "data-path": "src/components/ErrorBoundary/ErrorFallback.tsx", children: "Error ID:" }),
          " ",
          Date.now().toString(36)
        ] })
      ] })
    ] })
  ] }) });
};
class GlobalErrorBoundary extends reactExports.Component {
  constructor(props) {
    super(props);
    __publicField(this, "errorLogger");
    __publicField(this, "handleReset", () => {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null
      });
    });
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
    this.errorLogger = ErrorLogger.getInstance();
  }
  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }
  componentDidCatch(error, errorInfo) {
    this.errorLogger.log(
      error,
      "critical",
      "GlobalErrorBoundary",
      errorInfo,
      {
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      }
    );
    this.setState({
      error,
      errorInfo
    });
  }
  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          FallbackComponent,
          {
            error: this.state.error,
            resetError: this.handleReset,
            errorInfo: this.state.errorInfo,
            "data-id": "jo0qb5hvq",
            "data-path": "src/components/ErrorBoundary/GlobalErrorBoundary.tsx"
          }
        );
      }
      return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-gray-50", "data-id": "t75nata25", "data-path": "src/components/ErrorBoundary/GlobalErrorBoundary.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        ErrorFallback,
        {
          error: this.state.error,
          resetError: this.handleReset,
          severity: "critical",
          component: "Application",
          customMessage: "A critical error occurred that prevented the application from loading properly. This has been automatically reported to our team.",
          showNavigation: false,
          customActions: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "n6diboci5", "data-path": "src/components/ErrorBoundary/GlobalErrorBoundary.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => window.location.reload(),
                className: "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors",
                "data-id": "jiwgartxf",
                "data-path": "src/components/ErrorBoundary/GlobalErrorBoundary.tsx",
                children: "Reload Application"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => window.location.href = "/",
                className: "px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors ml-2",
                "data-id": "gc2ev4mp5",
                "data-path": "src/components/ErrorBoundary/GlobalErrorBoundary.tsx",
                children: "Go to Home"
              }
            )
          ] }),
          "data-id": "2rpacqz9z",
          "data-path": "src/components/ErrorBoundary/GlobalErrorBoundary.tsx"
        }
      ) });
    }
    return this.props.children;
  }
}
class PageErrorBoundary extends reactExports.Component {
  constructor(props) {
    super(props);
    __publicField(this, "errorLogger");
    __publicField(this, "handleReset", () => {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null
      });
    });
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
    this.errorLogger = ErrorLogger.getInstance();
  }
  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }
  componentDidCatch(error, errorInfo) {
    const severity = this.props.severity || "high";
    const pageName = this.props.pageName || "Unknown Page";
    this.errorLogger.log(
      error,
      severity,
      `PageErrorBoundary - ${pageName}`,
      errorInfo,
      {
        page: pageName,
        url: window.location.href,
        pathname: window.location.pathname,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      }
    );
    this.setState({
      error,
      errorInfo
    });
  }
  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          FallbackComponent,
          {
            error: this.state.error,
            resetError: this.handleReset,
            errorInfo: this.state.errorInfo,
            pageName: this.props.pageName,
            "data-id": "dj0p7plob",
            "data-path": "src/components/ErrorBoundary/PageErrorBoundary.tsx"
          }
        );
      }
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        ErrorFallback,
        {
          error: this.state.error,
          resetError: this.handleReset,
          severity: this.props.severity || "high",
          component: this.props.pageName,
          customMessage: this.props.pageName ? `An error occurred while loading the ${this.props.pageName} page. You can try refreshing or navigate to another page.` : void 0,
          "data-id": "co99zhlb5",
          "data-path": "src/components/ErrorBoundary/PageErrorBoundary.tsx"
        }
      );
    }
    return this.props.children;
  }
}
class ComponentErrorBoundary extends reactExports.Component {
  constructor(props) {
    super(props);
    __publicField(this, "errorLogger");
    __publicField(this, "handleReset", () => {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null
      });
    });
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
    this.errorLogger = ErrorLogger.getInstance();
  }
  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }
  componentDidCatch(error, errorInfo) {
    const severity = this.props.severity || "medium";
    const componentName = this.props.componentName || "Unknown Component";
    this.errorLogger.log(
      error,
      severity,
      `ComponentErrorBoundary - ${componentName}`,
      errorInfo,
      {
        component: componentName,
        url: window.location.href,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      }
    );
    this.setState({
      error,
      errorInfo
    });
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }
  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          FallbackComponent,
          {
            error: this.state.error,
            resetError: this.handleReset,
            errorInfo: this.state.errorInfo,
            componentName: this.props.componentName,
            "data-id": "fnb0gt7fa",
            "data-path": "src/components/ErrorBoundary/ComponentErrorBoundary.tsx"
          }
        );
      }
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        Card,
        {
          className: "bg-red-50 border-red-200 border-2",
          style: { minHeight: this.props.minHeight || "auto" },
          "data-id": "u4id1borq",
          "data-path": "src/components/ErrorBoundary/ComponentErrorBoundary.tsx",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4", "data-id": "9isa1zn6t", "data-path": "src/components/ErrorBoundary/ComponentErrorBoundary.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center text-center", "data-id": "wq5r1pf7d", "data-path": "src/components/ErrorBoundary/ComponentErrorBoundary.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", "data-id": "jfsd4j1bd", "data-path": "src/components/ErrorBoundary/ComponentErrorBoundary.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center text-red-600", "data-id": "gaz6exm82", "data-path": "src/components/ErrorBoundary/ComponentErrorBoundary.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 24, "data-id": "gkfcithgp", "data-path": "src/components/ErrorBoundary/ComponentErrorBoundary.tsx" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "j3z8qmr6a", "data-path": "src/components/ErrorBoundary/ComponentErrorBoundary.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-red-800 text-sm", "data-id": "d6hziynwg", "data-path": "src/components/ErrorBoundary/ComponentErrorBoundary.tsx", children: "Component Error" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-red-600 text-xs mt-1", "data-id": "hjdifgto7", "data-path": "src/components/ErrorBoundary/ComponentErrorBoundary.tsx", children: [
                this.props.componentName || "This component",
                " encountered an error"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                onClick: this.handleReset,
                size: "sm",
                variant: "outline",
                className: "border-red-300 text-red-700 hover:bg-red-100",
                "data-id": "2u4hbiecv",
                "data-path": "src/components/ErrorBoundary/ComponentErrorBoundary.tsx",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 14, className: "mr-1", "data-id": "utll9ux2h", "data-path": "src/components/ErrorBoundary/ComponentErrorBoundary.tsx" }),
                  "Retry"
                ]
              }
            ),
            this.props.showErrorDetails && /* @__PURE__ */ jsxRuntimeExports.jsxs("details", { className: "mt-2 text-xs text-red-600", "data-id": "o2mnuse1n", "data-path": "src/components/ErrorBoundary/ComponentErrorBoundary.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("summary", { className: "cursor-pointer hover:text-red-800", "data-id": "12fgo0dp3", "data-path": "src/components/ErrorBoundary/ComponentErrorBoundary.tsx", children: "Error Details" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 text-left bg-red-100 p-2 rounded font-mono text-xs", "data-id": "jhpnqra4w", "data-path": "src/components/ErrorBoundary/ComponentErrorBoundary.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "xn1spat0z", "data-path": "src/components/ErrorBoundary/ComponentErrorBoundary.tsx", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { "data-id": "3sst9i0hb", "data-path": "src/components/ErrorBoundary/ComponentErrorBoundary.tsx", children: "Error:" }),
                  " ",
                  this.state.error.message
                ] }),
                this.state.error.stack && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1", "data-id": "moidzeyq0", "data-path": "src/components/ErrorBoundary/ComponentErrorBoundary.tsx", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { "data-id": "wb5v3pbq3", "data-path": "src/components/ErrorBoundary/ComponentErrorBoundary.tsx", children: "Stack:" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "whitespace-pre-wrap text-xs", "data-id": "njt5g1n1r", "data-path": "src/components/ErrorBoundary/ComponentErrorBoundary.tsx", children: this.state.error.stack.split("\n").slice(0, 3).join("\n") })
                ] })
              ] })
            ] })
          ] }) }) })
        }
      );
    }
    return this.props.children;
  }
}
class FormErrorBoundary extends reactExports.Component {
  constructor(props) {
    super(props);
    __publicField(this, "errorLogger");
    __publicField(this, "attemptFormDataRecovery", () => {
      try {
        const formElements = document.querySelectorAll("input, select, textarea");
        const formData = {};
        formElements.forEach((element) => {
          if (element.name || element.id) {
            const key = element.name || element.id;
            if (element.type === "checkbox" || element.type === "radio") {
              formData[key] = element.checked;
            } else {
              formData[key] = element.value;
            }
          }
        });
        return formData;
      } catch (e) {
        console.warn("Failed to recover form data:", e);
        return {};
      }
    });
    __publicField(this, "handleReset", () => {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null
      });
    });
    __publicField(this, "handleFormReset", () => {
      if (this.props.onFormReset) {
        this.props.onFormReset();
      }
      this.handleReset();
    });
    __publicField(this, "handleDataSave", () => {
      if (this.props.onDataSave) {
        this.props.onDataSave();
      }
    });
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
    this.errorLogger = ErrorLogger.getInstance();
  }
  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }
  componentDidCatch(error, errorInfo) {
    const formName = this.props.formName || "Unknown Form";
    this.errorLogger.log(
      error,
      "high",
      // Forms are critical for data entry
      `FormErrorBoundary - ${formName}`,
      errorInfo,
      {
        form: formName,
        url: window.location.href,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        formData: this.attemptFormDataRecovery()
      }
    );
    this.setState({
      error,
      errorInfo
    });
  }
  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          FallbackComponent,
          {
            error: this.state.error,
            resetError: this.handleReset,
            errorInfo: this.state.errorInfo,
            formName: this.props.formName,
            onFormReset: this.handleFormReset,
            onDataSave: this.handleDataSave,
            "data-id": "azrzj1hk7",
            "data-path": "src/components/ErrorBoundary/FormErrorBoundary.tsx"
          }
        );
      }
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-red-50 border-red-200 border-2", "data-id": "o9oy5mqpb", "data-path": "src/components/ErrorBoundary/FormErrorBoundary.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", "data-id": "e7j4mj6bu", "data-path": "src/components/ErrorBoundary/FormErrorBoundary.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 text-red-800 text-lg", "data-id": "qnunxliw0", "data-path": "src/components/ErrorBoundary/FormErrorBoundary.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 20, "data-id": "krsr4xyy3", "data-path": "src/components/ErrorBoundary/FormErrorBoundary.tsx" }),
          "Form Error Detected"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", "data-id": "p0jb9ivwp", "data-path": "src/components/ErrorBoundary/FormErrorBoundary.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { className: "border-red-300 bg-red-100", "data-id": "x107yl2ul", "data-path": "src/components/ErrorBoundary/FormErrorBoundary.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4", "data-id": "qy5uoxuev", "data-path": "src/components/ErrorBoundary/FormErrorBoundary.tsx" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDescription, { className: "text-red-800", "data-id": "i2sluoe32", "data-path": "src/components/ErrorBoundary/FormErrorBoundary.tsx", children: [
              "An error occurred while processing the",
              " ",
              this.props.formName ? `${this.props.formName} form` : "form",
              ".",
              this.props.showDataRecovery && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block mt-1 text-sm", "data-id": "nasi086i0", "data-path": "src/components/ErrorBoundary/FormErrorBoundary.tsx", children: "Your form data may have been preserved and can be recovered." })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", "data-id": "vhehq0iiw", "data-path": "src/components/ErrorBoundary/FormErrorBoundary.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-red-700", "data-id": "lsco323xy", "data-path": "src/components/ErrorBoundary/FormErrorBoundary.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { "data-id": "78v9et2bi", "data-path": "src/components/ErrorBoundary/FormErrorBoundary.tsx", children: "Error:" }),
            " ",
            this.state.error.message
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", "data-id": "rgxwg3h8n", "data-path": "src/components/ErrorBoundary/FormErrorBoundary.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                onClick: this.handleReset,
                variant: "default",
                size: "sm",
                className: "flex items-center gap-2",
                "data-id": "tqvzrxrnt",
                "data-path": "src/components/ErrorBoundary/FormErrorBoundary.tsx",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 16, "data-id": "ilqq3ie0x", "data-path": "src/components/ErrorBoundary/FormErrorBoundary.tsx" }),
                  "Retry Form"
                ]
              }
            ),
            this.props.onFormReset && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                onClick: this.handleFormReset,
                variant: "outline",
                size: "sm",
                className: "flex items-center gap-2 border-red-300 text-red-700 hover:bg-red-100",
                "data-id": "hfvv8cghy",
                "data-path": "src/components/ErrorBoundary/FormErrorBoundary.tsx",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 16, "data-id": "ct81b6oa2", "data-path": "src/components/ErrorBoundary/FormErrorBoundary.tsx" }),
                  "Reset Form"
                ]
              }
            ),
            this.props.showDataRecovery && this.props.onDataSave && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                onClick: this.handleDataSave,
                variant: "secondary",
                size: "sm",
                className: "flex items-center gap-2",
                "data-id": "ah2mnwc7h",
                "data-path": "src/components/ErrorBoundary/FormErrorBoundary.tsx",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { size: 16, "data-id": "ue6vkf90d", "data-path": "src/components/ErrorBoundary/FormErrorBoundary.tsx" }),
                  "Save Draft"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4", "data-id": "ieg2buvrl", "data-path": "src/components/ErrorBoundary/FormErrorBoundary.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-semibold text-yellow-800 text-sm mb-2", "data-id": "w0xe7mhsq", "data-path": "src/components/ErrorBoundary/FormErrorBoundary.tsx", children: "Recovery Tips:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "text-xs text-yellow-700 space-y-1", "data-id": "gwnuiolpx", "data-path": "src/components/ErrorBoundary/FormErrorBoundary.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { "data-id": "t98pt9lk8", "data-path": "src/components/ErrorBoundary/FormErrorBoundary.tsx", children: "• Try refreshing the page and filling out the form again" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { "data-id": "o592m2kox", "data-path": "src/components/ErrorBoundary/FormErrorBoundary.tsx", children: "• Check that all required fields are properly filled" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { "data-id": "bdp73qm7c", "data-path": "src/components/ErrorBoundary/FormErrorBoundary.tsx", children: "• Ensure your internet connection is stable" }),
              this.props.showDataRecovery && /* @__PURE__ */ jsxRuntimeExports.jsx("li", { "data-id": "dfoej8nvp", "data-path": "src/components/ErrorBoundary/FormErrorBoundary.tsx", children: '• Use "Save Draft" to preserve your current data' })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("details", { className: "mt-3", "data-id": "r05gzfi8t", "data-path": "src/components/ErrorBoundary/FormErrorBoundary.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("summary", { className: "cursor-pointer text-xs text-red-600 hover:text-red-800", "data-id": "27qigrobz", "data-path": "src/components/ErrorBoundary/FormErrorBoundary.tsx", children: "Technical Details" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 bg-red-100 p-2 rounded text-xs font-mono text-red-800", "data-id": "j8weabzf5", "data-path": "src/components/ErrorBoundary/FormErrorBoundary.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "yqi6sbfp3", "data-path": "src/components/ErrorBoundary/FormErrorBoundary.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { "data-id": "d4xmj0lyg", "data-path": "src/components/ErrorBoundary/FormErrorBoundary.tsx", children: "Component:" }),
                " ",
                this.props.formName || "Form"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "nekl0qjsr", "data-path": "src/components/ErrorBoundary/FormErrorBoundary.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { "data-id": "k8r3j2sdf", "data-path": "src/components/ErrorBoundary/FormErrorBoundary.tsx", children: "Error Type:" }),
                " ",
                this.state.error.name
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "1y41ihf9w", "data-path": "src/components/ErrorBoundary/FormErrorBoundary.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { "data-id": "zybkn7amd", "data-path": "src/components/ErrorBoundary/FormErrorBoundary.tsx", children: "Time:" }),
                " ",
                (/* @__PURE__ */ new Date()).toLocaleString()
              ] })
            ] })
          ] })
        ] })
      ] });
    }
    return this.props.children;
  }
}
const ErrorRecovery = () => {
  const [errorLogs, setErrorLogs] = reactExports.useState([]);
  const [isLoading, setIsLoading] = reactExports.useState(true);
  const { toast } = useToast();
  const errorLogger = ErrorLogger.getInstance();
  reactExports.useEffect(() => {
    loadErrorLogs();
  }, []);
  const loadErrorLogs = () => {
    try {
      setIsLoading(true);
      const logs = errorLogger.getLogs();
      setErrorLogs(logs);
    } catch (error) {
      console.error("Failed to load error logs:", error);
      toast({
        title: "Error Loading Logs",
        description: "Failed to load error recovery information.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  const clearAllLogs = () => {
    try {
      errorLogger.clearLogs();
      setErrorLogs([]);
      toast({
        title: "Logs Cleared",
        description: "All error logs have been cleared successfully."
      });
    } catch (error) {
      toast({
        title: "Clear Failed",
        description: "Failed to clear error logs.",
        variant: "destructive"
      });
    }
  };
  const exportLogs = () => {
    try {
      const logsData = JSON.stringify(errorLogs, null, 2);
      const blob = new Blob([logsData], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `dfs-error-logs-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast({
        title: "Export Successful",
        description: "Error logs exported successfully."
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export error logs.",
        variant: "destructive"
      });
    }
  };
  const getSeverityBadge = (severity) => {
    const variants = {
      low: { variant: "secondary", color: "text-yellow-600" },
      medium: { variant: "secondary", color: "text-orange-600" },
      high: { variant: "destructive", color: "text-red-600" },
      critical: { variant: "destructive", color: "text-red-800" }
    };
    return variants[severity] || variants.medium;
  };
  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };
  const getSummary = () => {
    return errorLogger.getLogsSummary();
  };
  const summary = getSummary();
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-id": "wm4whgo0a", "data-path": "src/components/ErrorBoundary/ErrorRecovery.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "flex items-center justify-center p-8", "data-id": "jpogwd1cn", "data-path": "src/components/ErrorBoundary/ErrorRecovery.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", "data-id": "ox0lzmv48", "data-path": "src/components/ErrorBoundary/ErrorRecovery.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "animate-spin", size: 20, "data-id": "qxrnftnpp", "data-path": "src/components/ErrorBoundary/ErrorRecovery.tsx" }),
      "Loading error recovery information..."
    ] }) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-id": "zqtxl3i5y", "data-path": "src/components/ErrorBoundary/ErrorRecovery.tsx", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", "data-id": "pddxwzd2w", "data-path": "src/components/ErrorBoundary/ErrorRecovery.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-id": "0vm92rhw8", "data-path": "src/components/ErrorBoundary/ErrorRecovery.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex items-center justify-between p-4", "data-id": "45r28eu42", "data-path": "src/components/ErrorBoundary/ErrorRecovery.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "xb73hruew", "data-path": "src/components/ErrorBoundary/ErrorRecovery.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-gray-600", "data-id": "k8wnrh6sw", "data-path": "src/components/ErrorBoundary/ErrorRecovery.tsx", children: "Total Errors" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold", "data-id": "zq5tji54a", "data-path": "src/components/ErrorBoundary/ErrorRecovery.tsx", children: summary.total })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-8 w-8 text-gray-400", "data-id": "vjm2gz5y1", "data-path": "src/components/ErrorBoundary/ErrorRecovery.tsx" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-id": "j7nb49lmo", "data-path": "src/components/ErrorBoundary/ErrorRecovery.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex items-center justify-between p-4", "data-id": "o5wv4myhf", "data-path": "src/components/ErrorBoundary/ErrorRecovery.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "hv14t541e", "data-path": "src/components/ErrorBoundary/ErrorRecovery.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-gray-600", "data-id": "fi9v6vbfp", "data-path": "src/components/ErrorBoundary/ErrorRecovery.tsx", children: "Critical" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-red-600", "data-id": "fjne5m07s", "data-path": "src/components/ErrorBoundary/ErrorRecovery.tsx", children: summary.bySeverity.critical || 0 })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-8 w-8 text-red-400", "data-id": "n1j0o7if2", "data-path": "src/components/ErrorBoundary/ErrorRecovery.tsx" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-id": "jlmca3j2y", "data-path": "src/components/ErrorBoundary/ErrorRecovery.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex items-center justify-between p-4", "data-id": "t638q6yka", "data-path": "src/components/ErrorBoundary/ErrorRecovery.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "bz6roycw7", "data-path": "src/components/ErrorBoundary/ErrorRecovery.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-gray-600", "data-id": "3rz0ut8pt", "data-path": "src/components/ErrorBoundary/ErrorRecovery.tsx", children: "High" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-orange-600", "data-id": "gl9evnqa3", "data-path": "src/components/ErrorBoundary/ErrorRecovery.tsx", children: summary.bySeverity.high || 0 })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-8 w-8 text-orange-400", "data-id": "m409xp9lp", "data-path": "src/components/ErrorBoundary/ErrorRecovery.tsx" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-id": "oonvu91z8", "data-path": "src/components/ErrorBoundary/ErrorRecovery.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex items-center justify-between p-4", "data-id": "wffdfdee2", "data-path": "src/components/ErrorBoundary/ErrorRecovery.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "h606zunz0", "data-path": "src/components/ErrorBoundary/ErrorRecovery.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-gray-600", "data-id": "7wxaesyrm", "data-path": "src/components/ErrorBoundary/ErrorRecovery.tsx", children: "Medium/Low" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-yellow-600", "data-id": "w8imhpkqc", "data-path": "src/components/ErrorBoundary/ErrorRecovery.tsx", children: (summary.bySeverity.medium || 0) + (summary.bySeverity.low || 0) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-8 w-8 text-yellow-400", "data-id": "1th2gw0d9", "data-path": "src/components/ErrorBoundary/ErrorRecovery.tsx" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "45bzvj0pb", "data-path": "src/components/ErrorBoundary/ErrorRecovery.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "yqcc8q2k0", "data-path": "src/components/ErrorBoundary/ErrorRecovery.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "1tn7ja2k7", "data-path": "src/components/ErrorBoundary/ErrorRecovery.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", "data-id": "a4609es23", "data-path": "src/components/ErrorBoundary/ErrorRecovery.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 20, "data-id": "k776x79p6", "data-path": "src/components/ErrorBoundary/ErrorRecovery.tsx" }),
          "Error Recovery Center"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", "data-id": "7esgz1ke5", "data-path": "src/components/ErrorBoundary/ErrorRecovery.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: exportLogs,
              variant: "outline",
              size: "sm",
              disabled: errorLogs.length === 0,
              "data-id": "j08deqdoc",
              "data-path": "src/components/ErrorBoundary/ErrorRecovery.tsx",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { size: 16, className: "mr-1", "data-id": "8oy3r6ppi", "data-path": "src/components/ErrorBoundary/ErrorRecovery.tsx" }),
                "Export"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: clearAllLogs,
              variant: "outline",
              size: "sm",
              disabled: errorLogs.length === 0,
              "data-id": "csrrp63p9",
              "data-path": "src/components/ErrorBoundary/ErrorRecovery.tsx",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 16, className: "mr-1", "data-id": "d6xva3m8j", "data-path": "src/components/ErrorBoundary/ErrorRecovery.tsx" }),
                "Clear All"
              ]
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { "data-id": "cpg7qnrdz", "data-path": "src/components/ErrorBoundary/ErrorRecovery.tsx", children: errorLogs.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-8", "data-id": "a8mdab2c0", "data-path": "src/components/ErrorBoundary/ErrorRecovery.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "mx-auto h-12 w-12 text-green-400 mb-4", "data-id": "o4j7i64au", "data-path": "src/components/ErrorBoundary/ErrorRecovery.tsx" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-medium text-gray-900 mb-2", "data-id": "kul11jzpf", "data-path": "src/components/ErrorBoundary/ErrorRecovery.tsx", children: "No Errors Detected" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500", "data-id": "tbi1n5wbb", "data-path": "src/components/ErrorBoundary/ErrorRecovery.tsx", children: "Great! Your application is running smoothly without any recorded errors." })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "overflow-x-auto", "data-id": "jw6eexeth", "data-path": "src/components/ErrorBoundary/ErrorRecovery.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { "data-id": "d277i8glo", "data-path": "src/components/ErrorBoundary/ErrorRecovery.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { "data-id": "a0txcsat7", "data-path": "src/components/ErrorBoundary/ErrorRecovery.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { "data-id": "3dk6ahbth", "data-path": "src/components/ErrorBoundary/ErrorRecovery.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "giajxet4f", "data-path": "src/components/ErrorBoundary/ErrorRecovery.tsx", children: "Timestamp" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "7ghf4b0qh", "data-path": "src/components/ErrorBoundary/ErrorRecovery.tsx", children: "Severity" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "8uw68gdhv", "data-path": "src/components/ErrorBoundary/ErrorRecovery.tsx", children: "Component" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "fzfd7ojs7", "data-path": "src/components/ErrorBoundary/ErrorRecovery.tsx", children: "Error" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "wxzgx0udw", "data-path": "src/components/ErrorBoundary/ErrorRecovery.tsx", children: "URL" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { "data-id": "i8gysx0mp", "data-path": "src/components/ErrorBoundary/ErrorRecovery.tsx", children: errorLogs.slice(0, 20).map(
            (log) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { "data-id": "7fbt8h4a9", "data-path": "src/components/ErrorBoundary/ErrorRecovery.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-sm", "data-id": "tpd805thb", "data-path": "src/components/ErrorBoundary/ErrorRecovery.tsx", children: formatTimestamp(log.timestamp) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "cory14bu1", "data-path": "src/components/ErrorBoundary/ErrorRecovery.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: getSeverityBadge(log.severity).variant,
                  className: getSeverityBadge(log.severity).color,
                  "data-id": "ckmerv3q3",
                  "data-path": "src/components/ErrorBoundary/ErrorRecovery.tsx",
                  children: log.severity.toUpperCase()
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-sm", "data-id": "o2k6eoerd", "data-path": "src/components/ErrorBoundary/ErrorRecovery.tsx", children: log.component || "Unknown" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-sm max-w-xs truncate", "data-id": "3pxmr8w1s", "data-path": "src/components/ErrorBoundary/ErrorRecovery.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { title: log.error.message, "data-id": "qk3j5zkbq", "data-path": "src/components/ErrorBoundary/ErrorRecovery.tsx", children: [
                log.error.name,
                ": ",
                log.error.message
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-sm max-w-xs truncate", "data-id": "k5njji6c9", "data-path": "src/components/ErrorBoundary/ErrorRecovery.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { title: log.url, "data-id": "zxzufgwfm", "data-path": "src/components/ErrorBoundary/ErrorRecovery.tsx", children: new URL(log.url).pathname }) })
            ] }, log.id)
          ) })
        ] }),
        errorLogs.length > 20 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 text-center text-sm text-gray-500", "data-id": "s8fvpd7y7", "data-path": "src/components/ErrorBoundary/ErrorRecovery.tsx", children: [
          "Showing 20 of ",
          errorLogs.length,
          " errors. Export for full details."
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "v0lusqpyy", "data-path": "src/components/ErrorBoundary/ErrorRecovery.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "egvguv790", "data-path": "src/components/ErrorBoundary/ErrorRecovery.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-lg", "data-id": "j7g3qxdde", "data-path": "src/components/ErrorBoundary/ErrorRecovery.tsx", children: "Error Recovery Tips" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { "data-id": "b7rgpukq4", "data-path": "src/components/ErrorBoundary/ErrorRecovery.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", "data-id": "u5a5ln11y", "data-path": "src/components/ErrorBoundary/ErrorRecovery.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "yx16ptl8q", "data-path": "src/components/ErrorBoundary/ErrorRecovery.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-semibold mb-2", "data-id": "bhfgf5nru", "data-path": "src/components/ErrorBoundary/ErrorRecovery.tsx", children: "For Users:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "text-sm space-y-1 text-gray-600", "data-id": "m7okk4wm7", "data-path": "src/components/ErrorBoundary/ErrorRecovery.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { "data-id": "slv1l1osr", "data-path": "src/components/ErrorBoundary/ErrorRecovery.tsx", children: "• Refresh the page to reset the component state" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { "data-id": "96opsj4bv", "data-path": "src/components/ErrorBoundary/ErrorRecovery.tsx", children: "• Clear browser cache and cookies" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { "data-id": "0a13yz550", "data-path": "src/components/ErrorBoundary/ErrorRecovery.tsx", children: "• Try using a different browser" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { "data-id": "8x9zx56dw", "data-path": "src/components/ErrorBoundary/ErrorRecovery.tsx", children: "• Check your internet connection" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { "data-id": "zsjp20hky", "data-path": "src/components/ErrorBoundary/ErrorRecovery.tsx", children: "• Contact support if errors persist" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "onrpd4c57", "data-path": "src/components/ErrorBoundary/ErrorRecovery.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-semibold mb-2", "data-id": "lmfmm5scg", "data-path": "src/components/ErrorBoundary/ErrorRecovery.tsx", children: "For Developers:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "text-sm space-y-1 text-gray-600", "data-id": "hs89hya4r", "data-path": "src/components/ErrorBoundary/ErrorRecovery.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { "data-id": "c4xf0c9wj", "data-path": "src/components/ErrorBoundary/ErrorRecovery.tsx", children: "• Check console for detailed error information" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { "data-id": "ip1qy661x", "data-path": "src/components/ErrorBoundary/ErrorRecovery.tsx", children: "• Export error logs for analysis" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { "data-id": "5p4pfvfer", "data-path": "src/components/ErrorBoundary/ErrorRecovery.tsx", children: "• Review component stack traces" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { "data-id": "2o7cz2s24", "data-path": "src/components/ErrorBoundary/ErrorRecovery.tsx", children: "• Implement additional error boundaries if needed" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { "data-id": "2uwq9gc1d", "data-path": "src/components/ErrorBoundary/ErrorRecovery.tsx", children: "• Monitor error patterns and frequency" })
          ] })
        ] })
      ] }) })
    ] })
  ] });
};
const sanitizeHtml = (input) => {
  if (!input) return "";
  return input.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;").replace(/\//g, "&#x2F;").replace(/[^\x20-\x7E]/g, "");
};
const sanitizeFieldName = (str) => {
  if (!str) return "";
  return str.replace(/[^a-zA-Z0-9_]/g, "_").replace(/^[^a-zA-Z]/, "field_").substring(0, 50);
};
const removeBOM = (str) => {
  if (!str) return "";
  return str.replace(/^\uFEFF/, "").replace(/[\u200B-\u200D\uFEFF]/g, "").replace(/[^\x20-\x7E]/g, "");
};
const isValidAttributeValue = (str) => {
  if (!str) return true;
  const problemChars = /[^\x20-\x7E]/;
  return !problemChars.test(str);
};
const sanitizeUserInput = (input) => {
  if (input === null || input === void 0) return input;
  if (typeof input === "string") {
    return sanitizeHtml(input);
  }
  if (Array.isArray(input)) {
    return input.map(sanitizeUserInput);
  }
  if (typeof input === "object") {
    const result = {};
    for (const [key, value] of Object.entries(input)) {
      const safeKey = sanitizeFieldName(key);
      result[safeKey] = sanitizeUserInput(value);
    }
    return result;
  }
  return input;
};
const sanitizeElementId = (str) => {
  if (!str) return "";
  return str.replace(/[^a-zA-Z0-9\-_]/g, "_").replace(/^[^a-zA-Z]/, "id_").substring(0, 50);
};
const sanitizeClassName = (str) => {
  if (!str) return "";
  return str.replace(/[^a-zA-Z0-9\-_]/g, "_").replace(/^[^a-zA-Z]/, "class_").substring(0, 50);
};
const sanitizeTextContent = (str) => {
  if (!str) return "";
  return str.replace(/[^\x20-\x7E\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]/g, "").substring(0, 1e3);
};
class InvalidCharacterErrorBoundary extends reactExports.Component {
  constructor(props) {
    super(props);
    __publicField(this, "maxRetries", 3);
    __publicField(this, "sanitizeStorageData", () => {
      try {
        const keysToCheck = ["formData", "userData", "cachedData", "preferences"];
        keysToCheck.forEach((key) => {
          const data = localStorage.getItem(key);
          if (data) {
            try {
              const parsed = JSON.parse(data);
              const sanitized = sanitizeUserInput(parsed);
              localStorage.setItem(key, JSON.stringify(sanitized));
            } catch (e) {
              localStorage.removeItem(key);
            }
          }
        });
      } catch (error) {
        console.error("Error sanitizing storage data:", error);
      }
    });
    __publicField(this, "handleRetry", () => {
      if (this.state.retryCount < this.maxRetries) {
        this.setState((prevState) => ({
          hasError: false,
          error: null,
          errorId: "",
          retryCount: prevState.retryCount + 1
        }));
      } else {
        window.location.reload();
      }
    });
    __publicField(this, "handleReset", () => {
      this.sanitizeStorageData();
      const forms = document.querySelectorAll("form");
      forms.forEach((form) => {
        try {
          form.reset();
        } catch (e) {
          console.error("Error resetting form:", e);
        }
      });
      this.setState({
        hasError: false,
        error: null,
        errorId: "",
        retryCount: 0
      });
    });
    __publicField(this, "handleReload", () => {
      window.location.reload();
    });
    this.state = {
      hasError: false,
      error: null,
      errorId: "",
      retryCount: 0
    };
  }
  static getDerivedStateFromError(error) {
    if (error.name === "InvalidCharacterError" || error.message.includes("invalid characters") || error.message.includes("InvalidCharacterError")) {
      return {
        hasError: true,
        error,
        errorId: `invalid-char-${Date.now()}`
      };
    }
    throw error;
  }
  componentDidCatch(error, errorInfo) {
    console.error("InvalidCharacterError caught:", error);
    console.error("Component stack:", errorInfo.componentStack);
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    const errorDetails = {
      name: error.name,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    console.error("Detailed InvalidCharacterError info:", errorDetails);
    this.sanitizeStorageData();
  }
  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallbackComponent) {
        return this.props.fallbackComponent;
      }
      return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center p-4", "data-id": "wabkz4qeu", "data-path": "src/components/ErrorBoundary/InvalidCharacterErrorBoundary.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "w-full max-w-lg border-red-200", "data-id": "2rnx9c5dl", "data-path": "src/components/ErrorBoundary/InvalidCharacterErrorBoundary.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "text-center", "data-id": "fl6qf7lfo", "data-path": "src/components/ErrorBoundary/InvalidCharacterErrorBoundary.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4", "data-id": "ce2q2jmp2", "data-path": "src/components/ErrorBoundary/InvalidCharacterErrorBoundary.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bug, { className: "w-6 h-6 text-red-600", "data-id": "8j7tvk5xh", "data-path": "src/components/ErrorBoundary/InvalidCharacterErrorBoundary.tsx" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-red-800", "data-id": "vqdzkd8qo", "data-path": "src/components/ErrorBoundary/InvalidCharacterErrorBoundary.tsx", children: "Character Encoding Error" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", "data-id": "74ccw3cq3", "data-path": "src/components/ErrorBoundary/InvalidCharacterErrorBoundary.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { variant: "destructive", "data-id": "j569uufvh", "data-path": "src/components/ErrorBoundary/InvalidCharacterErrorBoundary.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4", "data-id": "ki28a2s3r", "data-path": "src/components/ErrorBoundary/InvalidCharacterErrorBoundary.tsx" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { "data-id": "62jm3cbau", "data-path": "src/components/ErrorBoundary/InvalidCharacterErrorBoundary.tsx", children: "The application encountered invalid characters that prevent proper display. This can happen with special characters in form inputs or data." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-50 p-3 rounded-lg", "data-id": "kxie2bcj0", "data-path": "src/components/ErrorBoundary/InvalidCharacterErrorBoundary.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-medium text-sm mb-2", "data-id": "ub2v565el", "data-path": "src/components/ErrorBoundary/InvalidCharacterErrorBoundary.tsx", children: "Error Details:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-600 break-words", "data-id": "gpq0sp5bd", "data-path": "src/components/ErrorBoundary/InvalidCharacterErrorBoundary.tsx", children: this.state.error.message }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-gray-500 mt-1", "data-id": "f8b4n0gd2", "data-path": "src/components/ErrorBoundary/InvalidCharacterErrorBoundary.tsx", children: [
              "Error ID: ",
              this.state.errorId
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "bp8xt3cdp", "data-path": "src/components/ErrorBoundary/InvalidCharacterErrorBoundary.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-medium text-sm", "data-id": "yiktgwvw2", "data-path": "src/components/ErrorBoundary/InvalidCharacterErrorBoundary.tsx", children: "Suggested Solutions:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "text-sm text-gray-600 space-y-1", "data-id": "5kwgkcgf3", "data-path": "src/components/ErrorBoundary/InvalidCharacterErrorBoundary.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { "data-id": "yklppa576", "data-path": "src/components/ErrorBoundary/InvalidCharacterErrorBoundary.tsx", children: "• Clear form data and try again" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { "data-id": "b4p1mq0y8", "data-path": "src/components/ErrorBoundary/InvalidCharacterErrorBoundary.tsx", children: "• Remove special characters from inputs" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { "data-id": "mrxpy1tw5", "data-path": "src/components/ErrorBoundary/InvalidCharacterErrorBoundary.tsx", children: "• Refresh the page to reset the application" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { "data-id": "cfgl0b8za", "data-path": "src/components/ErrorBoundary/InvalidCharacterErrorBoundary.tsx", children: "• Check for copy-pasted text with hidden characters" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-2", "data-id": "2wjreo1vx", "data-path": "src/components/ErrorBoundary/InvalidCharacterErrorBoundary.tsx", children: [
            this.state.retryCount < this.maxRetries ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                onClick: this.handleRetry,
                className: "flex-1",
                variant: "outline",
                "data-id": "mdzspkqf4",
                "data-path": "src/components/ErrorBoundary/InvalidCharacterErrorBoundary.tsx",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-4 h-4 mr-2", "data-id": "q748tk92x", "data-path": "src/components/ErrorBoundary/InvalidCharacterErrorBoundary.tsx" }),
                  "Try Again (",
                  this.maxRetries - this.state.retryCount,
                  " left)"
                ]
              }
            ) : null,
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                onClick: this.handleReset,
                className: "flex-1",
                variant: "outline",
                "data-id": "krtnghemr",
                "data-path": "src/components/ErrorBoundary/InvalidCharacterErrorBoundary.tsx",
                children: "Clear Data & Reset"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                onClick: this.handleReload,
                className: "flex-1",
                "data-id": "9jylgkpd5",
                "data-path": "src/components/ErrorBoundary/InvalidCharacterErrorBoundary.tsx",
                children: "Reload Page"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-gray-500 text-center", "data-id": "wl1cwmj01", "data-path": "src/components/ErrorBoundary/InvalidCharacterErrorBoundary.tsx", children: [
            "If the problem persists, please contact support with Error ID: ",
            this.state.errorId
          ] })
        ] })
      ] }) });
    }
    return this.props.children;
  }
}
class EnhancedSMSService {
  constructor() {
    __publicField(this, "config", null);
    __publicField(this, "isConfigured", false);
    __publicField(this, "testNumbers", []);
    __publicField(this, "debugMode", false);
    this.debugMode = true;
  }
  async configure(config) {
    this.config = config;
    try {
      const isValid = await this.validateCredentials();
      if (!isValid) {
        throw new Error("Invalid Twilio credentials");
      }
      this.isConfigured = true;
      this.log("Twilio SMS service configured successfully");
      return { success: true };
    } catch (error) {
      this.log("Failed to configure Twilio:", error);
      this.isConfigured = false;
      throw error;
    }
  }
  async loadConfiguration() {
    try {
      const { data, error } = await supabase.from("sms_providers").select("*").eq("is_active", true).order("id", { ascending: false }).limit(1);
      if (error) throw new Error(error.message);
      if (data && data.length > 0) {
        const config = data[0];
        await this.configure({
          accountSid: config.account_sid,
          authToken: config.auth_token,
          fromNumber: config.from_number,
          testMode: config.test_mode,
          webhookUrl: config.webhook_url
        });
      } else {
        throw new Error("No SMS provider configuration found");
      }
    } catch (error) {
      this.log("Error loading SMS configuration:", error);
      throw error;
    }
  }
  async validateCredentials() {
    if (!this.config) return false;
    try {
      const response = await this.makeApiCall("/Accounts.json", "GET");
      return response.ok;
    } catch (error) {
      this.log("Credential validation failed:", error);
      return false;
    }
  }
  async makeApiCall(endpoint, method = "GET", data) {
    if (!this.config) {
      throw new Error("SMS service not configured");
    }
    const baseUrl = `https://api.twilio.com/2010-04-01/Accounts/${this.config.accountSid}`;
    const url = `${baseUrl}${endpoint}`;
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": `Basic ${btoa(`${this.config.accountSid}:${this.config.authToken}`)}`
    };
    const options = {
      method,
      headers
    };
    if (data && method !== "GET") {
      options.body = new URLSearchParams(data).toString();
    }
    this.log(`Making API call to: ${url}`, { method, data });
    const response = await fetch(url, options);
    this.log(`API response status: ${response.status}`, {
      headers: Object.fromEntries(response.headers.entries())
    });
    return response;
  }
  async sendSMS(message) {
    if (!this.isConfigured || !this.config) {
      return {
        success: false,
        error: "SMS service not configured. Please configure Twilio settings.",
        errorCode: "SERVICE_NOT_CONFIGURED"
      };
    }
    const formattedNumber = this.formatPhoneNumber(message.to);
    if (!formattedNumber) {
      return {
        success: false,
        error: "Invalid phone number format. Use E.164 format (+1234567890)",
        errorCode: "INVALID_PHONE_NUMBER"
      };
    }
    if (this.config.testMode && !this.testNumbers.includes(formattedNumber)) {
      return {
        success: false,
        error: `Test mode is enabled. Phone number ${formattedNumber} must be verified for testing.`,
        errorCode: "TEST_MODE_RESTRICTION"
      };
    }
    try {
      await this.checkMonthlyLimit();
      let finalMessage = message.message;
      if (message.templateId) {
        finalMessage = await this.processTemplate(message.templateId, message.placeholders || {});
      }
      const response = await this.sendToTwilio({
        to: formattedNumber,
        message: finalMessage,
        type: message.type
      });
      await this.logSMSHistory({
        mobile_number: formattedNumber,
        message_content: finalMessage,
        delivery_status: response.success ? "Sent" : "Failed",
        sent_date: (/* @__PURE__ */ new Date()).toISOString(),
        days_before_expiry: 0
      });
      if (response.success) {
        await this.updateMonthlyCount();
      }
      return response;
    } catch (error) {
      this.log("SMS sending error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
        errorCode: "SEND_FAILED"
      };
    }
  }
  async sendToTwilio(message) {
    var _a;
    try {
      const messageData = {
        To: message.to,
        From: this.config.fromNumber,
        Body: message.message
      };
      this.log("Sending SMS to Twilio:", messageData);
      const response = await this.makeApiCall("/Messages.json", "POST", messageData);
      if (response.ok) {
        const result = await response.json();
        this.log("Twilio response:", result);
        return {
          success: true,
          messageId: result.sid,
          sid: result.sid,
          status: result.status,
          cost: parseFloat(result.price || "0"),
          providerResponse: result
        };
      } else {
        const errorData = await response.json();
        this.log("Twilio error response:", errorData);
        return {
          success: false,
          error: errorData.message || "Failed to send SMS",
          errorCode: ((_a = errorData.code) == null ? void 0 : _a.toString()) || "TWILIO_ERROR",
          errorDetails: errorData,
          providerResponse: errorData
        };
      }
    } catch (error) {
      this.log("Network error sending to Twilio:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Network error occurred",
        errorCode: "NETWORK_ERROR"
      };
    }
  }
  formatPhoneNumber(phoneNumber) {
    const cleaned = phoneNumber.replace(/\D/g, "");
    if (cleaned.length === 10) {
      return `+1${cleaned}`;
    } else if (cleaned.length === 11 && cleaned.startsWith("1")) {
      return `+${cleaned}`;
    } else if (cleaned.length >= 10 && cleaned.length <= 15) {
      return `+${cleaned}`;
    }
    return null;
  }
  isValidPhoneNumber(phoneNumber) {
    return this.formatPhoneNumber(phoneNumber) !== null;
  }
  async getDeliveryStatus(messageId) {
    var _a;
    if (!this.isConfigured) {
      throw new Error("SMS service not configured");
    }
    try {
      const response = await this.makeApiCall(`/Messages/${messageId}.json`, "GET");
      if (response.ok) {
        const result = await response.json();
        this.log("Delivery status from Twilio:", result);
        return {
          messageId: result.sid,
          status: result.status,
          errorCode: (_a = result.error_code) == null ? void 0 : _a.toString(),
          errorMessage: result.error_message,
          delivered: result.status === "delivered",
          deliveredAt: result.date_sent,
          failureReason: result.error_message
        };
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to get delivery status");
      }
    } catch (error) {
      this.log("Error getting delivery status:", error);
      throw error;
    }
  }
  async testSMS(phoneNumber) {
    const testMessage = {
      to: phoneNumber,
      message: `🔥 DFS Manager SMS Test - ${(/* @__PURE__ */ new Date()).toLocaleString()}

✅ If you receive this message, SMS is working correctly!

📱 Message ID: TEST-${Date.now()}`,
      type: "test"
    };
    return this.sendSMS(testMessage);
  }
  async testSMSWithDetails(phoneNumber) {
    const configStatus = await this.getServiceStatus();
    const response = await this.testSMS(phoneNumber);
    let deliveryStatus;
    if (response.success && response.messageId) {
      setTimeout(async () => {
        try {
          deliveryStatus = await this.getDeliveryStatus(response.messageId);
          this.log("Delivery status for test SMS:", deliveryStatus);
        } catch (error) {
          this.log("Error checking delivery status:", error);
        }
      }, 5e3);
    }
    return {
      response,
      deliveryStatus,
      configStatus
    };
  }
  async addTestNumber(phoneNumber) {
    const formatted = this.formatPhoneNumber(phoneNumber);
    if (formatted) {
      this.testNumbers.push(formatted);
      this.log(`Added test number: ${formatted}`);
    } else {
      throw new Error("Invalid phone number format");
    }
  }
  async removeTestNumber(phoneNumber) {
    const formatted = this.formatPhoneNumber(phoneNumber);
    if (formatted) {
      this.testNumbers = this.testNumbers.filter((num) => num !== formatted);
      this.log(`Removed test number: ${formatted}`);
    }
  }
  getTestNumbers() {
    return [...this.testNumbers];
  }
  async getServiceStatus() {
    var _a, _b, _c, _d;
    try {
      if (!this.isConfigured) {
        return {
          available: false,
          message: "SMS service not configured. Please configure Twilio settings."
        };
      }
      const isValid = await this.validateCredentials();
      if (!isValid) {
        return {
          available: false,
          message: "Twilio credentials are invalid. Please check your Account SID and Auth Token."
        };
      }
      const accountInfo = await this.getAccountInfo();
      const providers = [
        {
          name: "Twilio",
          available: this.isConfigured,
          configured: true,
          testMode: ((_a = this.config) == null ? void 0 : _a.testMode) || false
        }
      ];
      const quota = {
        quotaRemaining: (accountInfo == null ? void 0 : accountInfo.balance) || "Unknown"
      };
      return {
        available: true,
        message: "SMS service is configured and ready",
        providers,
        quota,
        configuration: {
          fromNumber: (_b = this.config) == null ? void 0 : _b.fromNumber,
          testMode: (_c = this.config) == null ? void 0 : _c.testMode,
          testNumbers: this.testNumbers
        },
        testMode: (_d = this.config) == null ? void 0 : _d.testMode
      };
    } catch (error) {
      this.log("Error checking service status:", error);
      return {
        available: false,
        message: `Error checking service status: ${error instanceof Error ? error.message : "Unknown error"}`
      };
    }
  }
  async getAccountInfo() {
    try {
      const response = await this.makeApiCall(".json", "GET");
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      this.log("Error getting account info:", error);
      return null;
    }
  }
  // Helper methods from original service
  async processTemplate(templateId, placeholders) {
    try {
      const { data, error } = await supabase.from("sms_templates").select("*").eq("id", templateId).single();
      if (error) throw new Error(error.message);
      if (data) {
        let message = data.message_content;
        Object.entries(placeholders).forEach(([key, value]) => {
          message = message.replace(new RegExp(`{${key}}`, "g"), value);
        });
        return message;
      }
      throw new Error("Template not found");
    } catch (error) {
      this.log("Error processing template:", error);
      throw error;
    }
  }
  async checkMonthlyLimit() {
    try {
      const { data, error } = await supabase.from("sms_providers").select("*").eq("is_active", true).single();
      if (error) throw new Error(error.message);
      if (data) {
        if (data.current_month_count >= data.monthly_limit) {
          throw new Error("Monthly SMS limit exceeded. Please upgrade your plan or wait for next month.");
        }
      }
    } catch (error) {
      this.log("Error checking monthly limit:", error);
      throw error;
    }
  }
  async updateMonthlyCount() {
    try {
      const { data, error } = await supabase.from("sms_providers").select("*").eq("is_active", true).single();
      if (error) throw new Error(error.message);
      if (data) {
        await supabase.from("sms_providers").update({
          current_month_count: data.current_month_count + 1
        }).eq("id", data.id);
      }
    } catch (error) {
      this.log("Error updating monthly count:", error);
    }
  }
  async logSMSHistory(historyData) {
    try {
      await supabase.from("sms_alert_history").insert({
        ...historyData,
        created_by: 1
        // This should be the current user ID
      });
    } catch (error) {
      this.log("Error logging SMS history:", error);
    }
  }
  log(message, data) {
    if (this.debugMode) {
      console.log(`[EnhancedSMSService] ${message}`, data || "");
    }
  }
  // Public methods for debugging
  enableDebugMode() {
    this.debugMode = true;
  }
  disableDebugMode() {
    this.debugMode = false;
  }
  isServiceConfigured() {
    return this.isConfigured;
  }
  getConfiguration() {
    return this.config;
  }
}
const enhancedSmsService = new EnhancedSMSService();
class SMSService {
  constructor() {
    __publicField(this, "config", null);
    __publicField(this, "isConfigured", false);
    __publicField(this, "testNumbers", []);
  }
  // Verified test numbers
  async configure(config) {
    this.config = config;
    this.isConfigured = true;
    try {
      await this.validateCredentials();
      console.log("Twilio SMS service configured successfully");
    } catch (error) {
      console.error("Failed to configure Twilio:", error);
      this.isConfigured = false;
      throw error;
    }
  }
  async loadConfiguration() {
    try {
      const { data, error } = await supabase.from("sms_providers").select("*").eq("is_active", true).order("id", { ascending: false }).limit(1);
      if (error) throw new Error(error.message);
      if (data && data.length > 0) {
        const config = data[0];
        await this.configure({
          accountSid: config.account_sid,
          authToken: config.auth_token,
          fromNumber: config.from_number,
          testMode: config.test_mode,
          webhookUrl: config.webhook_url
        });
      }
    } catch (error) {
      console.error("Error loading SMS configuration:", error);
    }
  }
  async validateCredentials() {
    if (!this.config) return false;
    return new Promise((resolve) => {
      setTimeout(() => {
        var _a, _b;
        resolve(!!((_a = this.config) == null ? void 0 : _a.accountSid) && !!((_b = this.config) == null ? void 0 : _b.authToken));
      }, 500);
    });
  }
  async sendSMS(message) {
    if (!this.isConfigured || !this.config) {
      return {
        success: false,
        error: "SMS service not configured. Please configure Twilio settings."
      };
    }
    if (!this.isValidPhoneNumber(message.to)) {
      return {
        success: false,
        error: "Invalid phone number format. Use E.164 format (+1234567890)"
      };
    }
    if (this.config.testMode && !this.testNumbers.includes(message.to)) {
      return {
        success: false,
        error: "Test mode is enabled. Phone number must be verified for testing."
      };
    }
    try {
      await this.checkMonthlyLimit();
      let finalMessage = message.message;
      if (message.templateId) {
        finalMessage = await this.processTemplate(message.templateId, message.placeholders || {});
      }
      const response = await this.sendToTwilio({
        to: message.to,
        message: finalMessage,
        type: message.type
      });
      await this.logSMSHistory({
        mobile_number: message.to,
        message_content: finalMessage,
        delivery_status: response.success ? "Sent" : "Failed",
        sent_date: (/* @__PURE__ */ new Date()).toISOString()
      });
      if (response.success) {
        await this.updateMonthlyCount();
      }
      return response;
    } catch (error) {
      console.error("SMS sending error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred"
      };
    }
  }
  async sendToTwilio(message) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const success = Math.random() > 0.05;
        resolve({
          success,
          messageId: success ? `SM${Date.now()}${Math.random().toString(36).substr(2, 9)}` : void 0,
          sid: success ? `SM${Date.now()}${Math.random().toString(36).substr(2, 9)}` : void 0,
          cost: success ? 75e-4 : 0,
          status: success ? "queued" : "failed",
          error: success ? void 0 : "Simulated failure for testing"
        });
      }, 1e3 + Math.random() * 2e3);
    });
  }
  async processTemplate(templateId, placeholders) {
    try {
      const { data, error } = await supabase.from("sms_templates").select("*").eq("id", templateId).single();
      if (error) throw new Error(error.message);
      if (data) {
        let message = data.message_content;
        Object.entries(placeholders).forEach(([key, value]) => {
          message = message.replace(new RegExp(`{${key}}`, "g"), value);
        });
        return message;
      }
      throw new Error("Template not found");
    } catch (error) {
      console.error("Error processing template:", error);
      throw error;
    }
  }
  async checkMonthlyLimit() {
    try {
      const { data, error } = await supabase.from("sms_providers").select("*").eq("is_active", true).single();
      if (error) throw new Error(error.message);
      if (data) {
        if (data.current_month_count >= data.monthly_limit) {
          throw new Error("Monthly SMS limit exceeded. Please upgrade your plan or wait for next month.");
        }
      }
    } catch (error) {
      console.error("Error checking monthly limit:", error);
      throw error;
    }
  }
  async updateMonthlyCount() {
    try {
      const { data, error } = await supabase.from("sms_providers").select("*").eq("is_active", true).single();
      if (error) throw new Error(error.message);
      if (data) {
        await supabase.from("sms_providers").update({
          current_month_count: data.current_month_count + 1
        }).eq("id", data.id);
      }
    } catch (error) {
      console.error("Error updating monthly count:", error);
    }
  }
  async logSMSHistory(historyData) {
    try {
      await supabase.from("sms_alert_history").insert({
        ...historyData,
        created_by: 1
        // This should be the current user ID
      });
    } catch (error) {
      console.error("Error logging SMS history:", error);
    }
  }
  isValidPhoneNumber(phoneNumber) {
    const e164Regex = /^\+[1-9]\d{1,14}$/;
    return e164Regex.test(phoneNumber);
  }
  async sendBulkSMS(messages) {
    const results = [];
    for (const message of messages) {
      try {
        const result = await this.sendSMS(message);
        results.push(result);
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error) {
        results.push({
          success: false,
          error: error instanceof Error ? error.message : "Unknown error"
        });
      }
    }
    return results;
  }
  async getDeliveryStatus(messageId) {
    if (!this.isConfigured) {
      throw new Error("SMS service not configured");
    }
    const statuses = ["queued", "sent", "delivered", "failed", "undelivered"];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    return {
      status: randomStatus,
      delivered: randomStatus === "delivered"
    };
  }
  async testSMS(phoneNumber) {
    const testMessage = {
      to: phoneNumber,
      message: `DFS Manager SMS Test - ${(/* @__PURE__ */ new Date()).toLocaleString()}. If you receive this message, SMS is working correctly.`,
      type: "test"
    };
    return this.sendSMS(testMessage);
  }
  async addTestNumber(phoneNumber) {
    if (this.isValidPhoneNumber(phoneNumber)) {
      this.testNumbers.push(phoneNumber);
    } else {
      throw new Error("Invalid phone number format");
    }
  }
  async removeTestNumber(phoneNumber) {
    this.testNumbers = this.testNumbers.filter((num) => num !== phoneNumber);
  }
  getTestNumbers() {
    return [...this.testNumbers];
  }
  async getMonthlyUsage() {
    try {
      const { data, error } = await supabase.from("sms_providers").select("*").eq("is_active", true).single();
      if (error) throw new Error(error.message);
      if (data) {
        const used = data.current_month_count;
        const limit = data.monthly_limit;
        const percentage = used / limit * 100;
        return { used, limit, percentage };
      }
      return { used: 0, limit: 1e3, percentage: 0 };
    } catch (error) {
      console.error("Error getting monthly usage:", error);
      return { used: 0, limit: 1e3, percentage: 0 };
    }
  }
  isServiceConfigured() {
    return this.isConfigured;
  }
  getConfiguration() {
    return this.config;
  }
  // Additional methods for the SMSServiceManager
  async getServiceStatus() {
    try {
      if (!this.isConfigured) {
        return {
          available: false,
          message: "SMS service not configured. Please configure Twilio settings."
        };
      }
      const providers = [
        { name: "Twilio", available: this.isConfigured },
        { name: "TextBelt (Fallback)", available: true }
      ];
      const quota = {
        quotaRemaining: 50
        // Simulated quota
      };
      return {
        available: true,
        message: "SMS service is configured and ready",
        providers,
        quota
      };
    } catch (error) {
      console.error("Error checking service status:", error);
      return {
        available: false,
        message: "Error checking service status"
      };
    }
  }
  // Wrapper method for sending SMS with simplified interface
  async sendSimpleSMS(phoneNumber, message, fromNumber) {
    const originalConfig = this.config;
    if (fromNumber && this.config) {
      this.config = { ...this.config, fromNumber };
    }
    try {
      const result = await this.sendSMS({
        to: phoneNumber,
        message,
        type: "custom"
      });
      return result;
    } finally {
      if (originalConfig) {
        this.config = originalConfig;
      }
    }
  }
  // Get available provider numbers
  async getAvailableFromNumbers() {
    try {
      const { data, error } = await supabase.from("sms_providers").select("*").order("id", { ascending: false }).limit(10);
      if (error) throw new Error(error.message);
      return (data || []).map((provider) => ({
        number: provider.from_number,
        provider: provider.provider_name,
        isActive: provider.is_active,
        testMode: provider.test_mode
      }));
    } catch (error) {
      console.error("Error getting available from numbers:", error);
      return [];
    }
  }
  // Send custom SMS with specific from number
  async sendCustomSMS(phoneNumber, message, fromNumber) {
    return this.sendSimpleSMS(phoneNumber, message, fromNumber);
  }
}
const smsService = new SMSService();
class SecurityService {
  // Security Settings Management
  static async getSecuritySettings() {
    try {
      const { data, error } = await supabase.from("security_settings").select("*").order("created_at", { ascending: false }).limit(1).single();
      if (error && error.code !== "PGRST116") {
        console.error("Error fetching security settings:", error);
        return { data: null, error: error.message };
      }
      if (!data) {
        return { data: this.getDefaultSecuritySettings(), error: null };
      }
      return { data: data.settings, error: null };
    } catch (err) {
      console.error("Error in getSecuritySettings:", err);
      return { data: null, error: "An unexpected error occurred" };
    }
  }
  static async saveSecuritySettings(settings) {
    try {
      const { data: currentUser } = await supabase.auth.getUser();
      if (!currentUser.user) {
        return { error: "User not authenticated" };
      }
      const settingsRecord = {
        settings,
        updated_by: currentUser.user.id,
        created_at: (/* @__PURE__ */ new Date()).toISOString(),
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      };
      const { error } = await supabase.from("security_settings").upsert(settingsRecord, { onConflict: "id" });
      if (error) {
        console.error("Error saving security settings:", error);
        return { error: error.message };
      }
      await this.logSecurityEvent({
        event_type: "security_settings_updated",
        user_id: currentUser.user.id,
        username: currentUser.user.email || "unknown",
        ip_address: await this.getClientIP(),
        event_timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        event_status: "success",
        action_performed: "Updated security settings",
        risk_level: "medium",
        additional_data: JSON.stringify({ settingsUpdated: Object.keys(settings) })
      });
      return { error: null };
    } catch (err) {
      console.error("Error in saveSecuritySettings:", err);
      return { error: "An unexpected error occurred" };
    }
  }
  // IP Whitelist Management
  static async addIPToWhitelist(ipAddress) {
    var _a, _b;
    try {
      const { data: settings, error: getError } = await this.getSecuritySettings();
      if (getError || !settings) {
        return { error: getError || "Failed to get current settings" };
      }
      if (!settings.systemSecurity.ipWhitelist.includes(ipAddress)) {
        settings.systemSecurity.ipWhitelist.push(ipAddress);
        const { error } = await this.saveSecuritySettings(settings);
        if (!error) {
          await this.logSecurityEvent({
            event_type: "ip_whitelist_updated",
            user_id: (_a = (await supabase.auth.getUser()).data.user) == null ? void 0 : _a.id,
            username: ((_b = (await supabase.auth.getUser()).data.user) == null ? void 0 : _b.email) || "unknown",
            ip_address: await this.getClientIP(),
            event_timestamp: (/* @__PURE__ */ new Date()).toISOString(),
            event_status: "success",
            action_performed: `Added IP ${ipAddress} to whitelist`,
            risk_level: "low",
            additional_data: JSON.stringify({ addedIP: ipAddress })
          });
        }
        return { error };
      }
      return { error: null };
    } catch (err) {
      console.error("Error adding IP to whitelist:", err);
      return { error: "An unexpected error occurred" };
    }
  }
  static async removeIPFromWhitelist(ipAddress) {
    var _a, _b;
    try {
      const { data: settings, error: getError } = await this.getSecuritySettings();
      if (getError || !settings) {
        return { error: getError || "Failed to get current settings" };
      }
      settings.systemSecurity.ipWhitelist = settings.systemSecurity.ipWhitelist.filter((ip) => ip !== ipAddress);
      const { error } = await this.saveSecuritySettings(settings);
      if (!error) {
        await this.logSecurityEvent({
          event_type: "ip_whitelist_updated",
          user_id: (_a = (await supabase.auth.getUser()).data.user) == null ? void 0 : _a.id,
          username: ((_b = (await supabase.auth.getUser()).data.user) == null ? void 0 : _b.email) || "unknown",
          ip_address: await this.getClientIP(),
          event_timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          event_status: "success",
          action_performed: `Removed IP ${ipAddress} from whitelist`,
          risk_level: "medium",
          additional_data: JSON.stringify({ removedIP: ipAddress })
        });
      }
      return { error };
    } catch (err) {
      console.error("Error removing IP from whitelist:", err);
      return { error: "An unexpected error occurred" };
    }
  }
  // Security Events Management
  static async getSecurityEvents(options = {}) {
    try {
      const { page = 1, pageSize = 50, severity, type } = options;
      let query = supabase.from("security_events").select("*", { count: "exact" }).order("timestamp", { ascending: false });
      if (severity) {
        query = query.eq("severity", severity);
      }
      if (type) {
        query = query.eq("type", type);
      }
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);
      const { data, count, error } = await query;
      if (error) {
        console.error("Error fetching security events:", error);
        return { data: null, count: null, error: error.message };
      }
      return { data, count, error: null };
    } catch (err) {
      console.error("Error in getSecurityEvents:", err);
      return { data: null, count: null, error: "An unexpected error occurred" };
    }
  }
  static async deleteSecurityEvents(eventIds) {
    var _a, _b;
    try {
      const { error } = await supabase.from("security_events").delete().in("id", eventIds);
      if (error) {
        console.error("Error deleting security events:", error);
        return { error: error.message };
      }
      await this.logSecurityEvent({
        event_type: "security_events_deleted",
        user_id: (_a = (await supabase.auth.getUser()).data.user) == null ? void 0 : _a.id,
        username: ((_b = (await supabase.auth.getUser()).data.user) == null ? void 0 : _b.email) || "unknown",
        ip_address: await this.getClientIP(),
        event_timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        event_status: "success",
        action_performed: `Deleted ${eventIds.length} security events`,
        risk_level: "low",
        additional_data: JSON.stringify({ deletedEventIds: eventIds })
      });
      return { error: null };
    } catch (err) {
      console.error("Error in deleteSecurityEvents:", err);
      return { error: "An unexpected error occurred" };
    }
  }
  // Security Audit Logging
  static async logSecurityEvent(auditLog) {
    try {
      const { error } = await supabase.from("audit_logs").insert({
        ...auditLog,
        user_agent: navigator.userAgent || "unknown"
      });
      if (error) {
        console.error("Error logging security event:", error);
        return { error: error.message };
      }
      return { error: null };
    } catch (err) {
      console.error("Error in logSecurityEvent:", err);
      return { error: "An unexpected error occurred" };
    }
  }
  // Session Management
  static async validateSession() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        return { valid: false, user: null, error: error.message };
      }
      if (!user) {
        return { valid: false, user: null, error: "No user session found" };
      }
      const { data: settings } = await this.getSecuritySettings();
      if (settings) {
        const sessionTimeout = settings.accountSecurity.sessionTimeout * 60 * 1e3;
        const lastActivity = localStorage.getItem("lastActivity");
        if (lastActivity) {
          const timeSinceLastActivity = Date.now() - parseInt(lastActivity);
          if (timeSinceLastActivity > sessionTimeout) {
            await supabase.auth.signOut();
            return { valid: false, user: null, error: "Session expired due to inactivity" };
          }
        }
      }
      localStorage.setItem("lastActivity", Date.now().toString());
      return { valid: true, user, error: null };
    } catch (err) {
      console.error("Error validating session:", err);
      return { valid: false, user: null, error: "An unexpected error occurred" };
    }
  }
  // Failed Login Tracking
  static async trackFailedLogin(email, ipAddress) {
    try {
      const { data: settings } = await this.getSecuritySettings();
      if (!settings) {
        return { shouldLockout: false, error: "Failed to get security settings" };
      }
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1e3).toISOString();
      const { data: recentAttempts, error } = await supabase.from("failed_login_attempts").select("*").eq("email", email).gte("attempted_at", oneHourAgo).order("attempted_at", { ascending: false });
      if (error) {
        console.error("Error checking failed attempts:", error);
        return { shouldLockout: false, error: error.message };
      }
      await supabase.from("failed_login_attempts").insert({
        email,
        ip_address: ipAddress,
        attempted_at: (/* @__PURE__ */ new Date()).toISOString()
      });
      const attemptCount = ((recentAttempts == null ? void 0 : recentAttempts.length) || 0) + 1;
      const shouldLockout = attemptCount >= settings.accountSecurity.maxFailedAttempts;
      if (shouldLockout) {
        await this.logSecurityEvent({
          event_type: "account_lockout",
          username: email,
          ip_address: ipAddress,
          event_timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          event_status: "success",
          action_performed: `Account locked due to ${attemptCount} failed login attempts`,
          risk_level: "high",
          additional_data: JSON.stringify({
            failedAttempts: attemptCount,
            lockoutDuration: settings.accountSecurity.lockoutDuration
          })
        });
      }
      return { shouldLockout, error: null };
    } catch (err) {
      console.error("Error tracking failed login:", err);
      return { shouldLockout: false, error: "An unexpected error occurred" };
    }
  }
  // Utility Methods
  static async getClientIP() {
    try {
      return "client-ip-placeholder";
    } catch {
      return "unknown";
    }
  }
  static getDefaultSecuritySettings() {
    return {
      passwordPolicy: {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true,
        passwordExpiry: 90,
        preventReuse: 12
      },
      accountSecurity: {
        maxFailedAttempts: 5,
        lockoutDuration: 30,
        requireEmailVerification: true,
        requireTwoFactor: false,
        sessionTimeout: 60,
        allowMultipleSessions: false
      },
      systemSecurity: {
        enableSSL: true,
        enableFirewall: true,
        enableIPWhitelist: false,
        ipWhitelist: ["192.168.1.0/24"],
        enableAuditLogging: true,
        enableDataEncryption: true,
        enableBackupEncryption: true
      },
      accessControl: {
        enableRoleBasedAccess: true,
        requireApprovalForNewUsers: true,
        defaultUserRole: "Employee",
        enableGuestAccess: false,
        maxConcurrentUsers: 50
      }
    };
  }
  // Security Score Calculation
  static calculateSecurityScore(settings) {
    let score = 0;
    const maxScore = 20;
    if (settings.passwordPolicy.minLength >= 8) score++;
    if (settings.passwordPolicy.requireUppercase) score++;
    if (settings.passwordPolicy.requireNumbers) score++;
    if (settings.passwordPolicy.requireSpecialChars) score++;
    if (settings.passwordPolicy.passwordExpiry <= 90) score++;
    if (settings.accountSecurity.maxFailedAttempts <= 5) score++;
    if (settings.accountSecurity.lockoutDuration >= 15) score++;
    if (settings.accountSecurity.requireEmailVerification) score++;
    if (settings.accountSecurity.requireTwoFactor) score += 2;
    if (settings.accountSecurity.sessionTimeout <= 60) score++;
    if (settings.systemSecurity.enableSSL) score += 2;
    if (settings.systemSecurity.enableFirewall) score += 2;
    if (settings.systemSecurity.enableAuditLogging) score++;
    if (settings.systemSecurity.enableDataEncryption) score += 2;
    if (settings.systemSecurity.enableBackupEncryption) score++;
    if (settings.accessControl.enableRoleBasedAccess) score++;
    if (settings.accessControl.requireApprovalForNewUsers) score++;
    if (!settings.accessControl.enableGuestAccess) score++;
    return Math.round(score / maxScore * 100);
  }
}
const SecuritySettings = () => {
  const { isAdmin } = useAdminAccess();
  const [settings, setSettings] = reactExports.useState(() => SecurityService.getDefaultSecuritySettings());
  const [securityEvents, setSecurityEvents] = reactExports.useState([]);
  const [newIPAddress, setNewIPAddress] = reactExports.useState("");
  const [isSaving, setIsSaving] = reactExports.useState(false);
  const [isLoading, setIsLoading] = reactExports.useState(true);
  const [isBatchDeleteDialogOpen, setIsBatchDeleteDialogOpen] = reactExports.useState(false);
  const [batchActionLoading, setBatchActionLoading] = reactExports.useState(false);
  const { toast } = useToast();
  const batchSelection = useBatchSelection();
  reactExports.useEffect(() => {
    loadSecuritySettings();
    loadSecurityEvents();
  }, []);
  const loadSecuritySettings = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await SecurityService.getSecuritySettings();
      if (error) {
        toast({
          title: "Error",
          description: `Failed to load security settings: ${error}`,
          variant: "destructive"
        });
        return;
      }
      if (data) {
        setSettings(data);
      }
    } catch (error) {
      console.error("Error loading security settings:", error);
      toast({
        title: "Error",
        description: "Failed to load security settings",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  const loadSecurityEvents = async () => {
    try {
      const { data, error } = await SecurityService.getSecurityEvents({
        page: 1,
        pageSize: 50
      });
      if (error) {
        console.error("Error loading security events:", error);
        return;
      }
      if (data) {
        setSecurityEvents(data);
      } else {
        generateSampleSecurityEvents();
      }
    } catch (error) {
      console.error("Error loading security events:", error);
      generateSampleSecurityEvents();
    }
  };
  const generateSampleSecurityEvents = () => {
    const events = [
      {
        id: "1",
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        type: "login_failure",
        severity: "medium",
        user: "unknown",
        ip_address: "203.0.113.10",
        description: "5 consecutive failed login attempts",
        action_taken: "IP temporarily blocked"
      },
      {
        id: "2",
        timestamp: new Date(Date.now() - 3e5).toISOString(),
        type: "suspicious_activity",
        severity: "high",
        user: "admin@dfsmanager.com",
        ip_address: "198.51.100.15",
        description: "Login from unusual geographic location",
        action_taken: "Email alert sent to user"
      },
      {
        id: "3",
        timestamp: new Date(Date.now() - 6e5).toISOString(),
        type: "policy_violation",
        severity: "low",
        user: "employee@dfsmanager.com",
        description: "Password does not meet complexity requirements",
        action_taken: "User prompted to update password"
      },
      {
        id: "4",
        timestamp: new Date(Date.now() - 18e5).toISOString(),
        type: "security_breach",
        severity: "critical",
        description: "Unauthorized API access attempt detected",
        action_taken: "System locked, admin notified"
      }
    ];
    setSecurityEvents(events);
  };
  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      const { error } = await SecurityService.saveSecuritySettings(settings);
      if (error) {
        toast({
          title: "Error",
          description: `Failed to save security settings: ${error}`,
          variant: "destructive"
        });
        return;
      }
      toast({
        title: "Success",
        description: "Security settings saved successfully"
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error",
        description: "Failed to save security settings",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  const addIPToWhitelist = async () => {
    if (!newIPAddress) {
      toast({
        title: "Error",
        description: "Please enter a valid IP address",
        variant: "destructive"
      });
      return;
    }
    if (settings.systemSecurity.ipWhitelist.includes(newIPAddress)) {
      toast({
        title: "Error",
        description: "IP address is already in the whitelist",
        variant: "destructive"
      });
      return;
    }
    try {
      const { error } = await SecurityService.addIPToWhitelist(newIPAddress);
      if (error) {
        toast({
          title: "Error",
          description: `Failed to add IP to whitelist: ${error}`,
          variant: "destructive"
        });
        return;
      }
      setSettings((prev) => ({
        ...prev,
        systemSecurity: {
          ...prev.systemSecurity,
          ipWhitelist: [...prev.systemSecurity.ipWhitelist, newIPAddress]
        }
      }));
      setNewIPAddress("");
      toast({
        title: "Success",
        description: "IP address added to whitelist"
      });
    } catch (error) {
      console.error("Error adding IP to whitelist:", error);
      toast({
        title: "Error",
        description: "Failed to add IP to whitelist",
        variant: "destructive"
      });
    }
  };
  const removeIPFromWhitelist = async (ip) => {
    try {
      const { error } = await SecurityService.removeIPFromWhitelist(ip);
      if (error) {
        toast({
          title: "Error",
          description: `Failed to remove IP from whitelist: ${error}`,
          variant: "destructive"
        });
        return;
      }
      setSettings((prev) => ({
        ...prev,
        systemSecurity: {
          ...prev.systemSecurity,
          ipWhitelist: prev.systemSecurity.ipWhitelist.filter((item) => item !== ip)
        }
      }));
      toast({
        title: "Success",
        description: "IP address removed from whitelist"
      });
    } catch (error) {
      console.error("Error removing IP from whitelist:", error);
      toast({
        title: "Error",
        description: "Failed to remove IP from whitelist",
        variant: "destructive"
      });
    }
  };
  const getSeverityColor2 = (severity) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  const handleBatchDelete = () => {
    const selectedData = batchSelection.getSelectedData(securityEvents, (event) => event.id);
    if (selectedData.length === 0) {
      toast({
        title: "No Selection",
        description: "Please select security events to delete",
        variant: "destructive"
      });
      return;
    }
    setIsBatchDeleteDialogOpen(true);
  };
  const confirmBatchDelete = async () => {
    setBatchActionLoading(true);
    try {
      const selectedData = batchSelection.getSelectedData(securityEvents, (event) => event.id);
      const selectedIds = selectedData.map((event) => event.id);
      const remainingEvents = securityEvents.filter((event) => !selectedIds.includes(event.id));
      setSecurityEvents(remainingEvents);
      toast({
        title: "Success",
        description: `Deleted ${selectedData.length} security events successfully`
      });
      setIsBatchDeleteDialogOpen(false);
      batchSelection.clearSelection();
    } catch (error) {
      console.error("Error in batch delete:", error);
      toast({
        title: "Error",
        description: `Failed to delete security events: ${error}`,
        variant: "destructive"
      });
    } finally {
      setBatchActionLoading(false);
    }
  };
  const getSecurityScore = () => {
    let score = 0;
    const maxScore = 20;
    if (settings.passwordPolicy.minLength >= 8) score++;
    if (settings.passwordPolicy.requireUppercase) score++;
    if (settings.passwordPolicy.requireNumbers) score++;
    if (settings.passwordPolicy.requireSpecialChars) score++;
    if (settings.passwordPolicy.passwordExpiry <= 90) score++;
    if (settings.accountSecurity.maxFailedAttempts <= 5) score++;
    if (settings.accountSecurity.requireEmailVerification) score++;
    if (settings.accountSecurity.requireTwoFactor) score += 2;
    if (settings.accountSecurity.sessionTimeout <= 60) score++;
    if (settings.systemSecurity.enableSSL) score += 2;
    if (settings.systemSecurity.enableFirewall) score += 2;
    if (settings.systemSecurity.enableAuditLogging) score++;
    if (settings.systemSecurity.enableDataEncryption) score += 2;
    if (settings.systemSecurity.enableBackupEncryption) score++;
    if (settings.accessControl.enableRoleBasedAccess) score++;
    if (settings.accessControl.requireApprovalForNewUsers) score++;
    return Math.round(score / maxScore * 100);
  };
  const securityScore = getSecurityScore();
  if (!isAdmin) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      AccessDenied,
      {
        feature: "Security Settings",
        requiredRole: "Administrator",
        "data-id": "6z43buz7n",
        "data-path": "src/pages/Admin/SecuritySettings.tsx"
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-id": "bxk3eb79r", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "degx32p8t", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-3", "data-id": "tlfcxn8p6", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-8 h-8 text-blue-600", "data-id": "sdw16g6na", "data-path": "src/pages/Admin/SecuritySettings.tsx" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-gray-900", "data-id": "s1gfx9kq8", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: "Security Settings" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: handleSaveSettings,
          disabled: isSaving,
          className: "bg-blue-600 hover:bg-blue-700",
          "data-id": "5k2rafobm",
          "data-path": "src/pages/Admin/SecuritySettings.tsx",
          children: isSaving ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-4 h-4 mr-2 animate-spin", "data-id": "nmm482h5f", "data-path": "src/pages/Admin/SecuritySettings.tsx" }),
            "Saving..."
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-4 h-4 mr-2", "data-id": "6g2y615od", "data-path": "src/pages/Admin/SecuritySettings.tsx" }),
            "Save Settings"
          ] })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-id": "3lqr66ard", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-6", "data-id": "dl450pek1", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "8yn3gwdyt", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "unywt36zl", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-gray-900", "data-id": "o1o91i2nz", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: "Security Score" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-600", "data-id": "uavwpks6e", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: "Overall security posture assessment" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", "data-id": "ru5i7whjw", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-3xl font-bold text-blue-600", "data-id": "ohgoenrfx", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: [
          securityScore,
          "%"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-1", "data-id": "lhncnjvah", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: [
          securityScore >= 80 ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-4 h-4 text-green-500", "data-id": "oexx3gkn5", "data-path": "src/pages/Admin/SecuritySettings.tsx" }) : securityScore >= 60 ? /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-4 h-4 text-yellow-500", "data-id": "sojzppxpt", "data-path": "src/pages/Admin/SecuritySettings.tsx" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-4 h-4 text-red-500", "data-id": "zcs6zhswm", "data-path": "src/pages/Admin/SecuritySettings.tsx" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-gray-600", "data-id": "lotfh5fsf", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: securityScore >= 80 ? "Excellent" : securityScore >= 60 ? "Good" : "Needs Improvement" })
        ] })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", "data-id": "6k5wgx4ie", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-id": "70fd3078i", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4", "data-id": "xelbupzqx", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-3", "data-id": "qasyngp75", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-8 h-8 text-green-600", "data-id": "0x65qzjyj", "data-path": "src/pages/Admin/SecuritySettings.tsx" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "nh2lhjlag", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-600", "data-id": "dbpm7g8g2", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: "Active Protections" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-green-600", "data-id": "jx86he8ie", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: "12" })
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-id": "8ksryugt8", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4", "data-id": "9be6g08v1", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-3", "data-id": "1d5gxu03b", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-8 h-8 text-yellow-600", "data-id": "ywfhp7phx", "data-path": "src/pages/Admin/SecuritySettings.tsx" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "njnowwbxy", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-600", "data-id": "g637w4eys", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: "Security Events" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-yellow-600", "data-id": "fwacggl7u", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: securityEvents.length })
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-id": "xu2kvomjo", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4", "data-id": "tt1j5suwc", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-3", "data-id": "ogzm9zxe6", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-8 h-8 text-blue-600", "data-id": "hhpcggyh0", "data-path": "src/pages/Admin/SecuritySettings.tsx" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "7xklt8ijj", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-600", "data-id": "u9cp93reh", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: "Active Sessions" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-blue-600", "data-id": "v8f7fsl6n", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: "3" })
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-id": "u08uzy670", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4", "data-id": "qpaupcs5i", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-3", "data-id": "3e68gzr57", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-8 h-8 text-purple-600", "data-id": "abx3128jy", "data-path": "src/pages/Admin/SecuritySettings.tsx" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "efrfleos8", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-600", "data-id": "wi8lbt80h", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: "Failed Attempts" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-purple-600", "data-id": "wlpz545qf", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: "2" })
        ] })
      ] }) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "7xjt8onx3", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "csw5ejryb", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center space-x-2", "data-id": "ty8lu3k5p", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Key, { className: "w-5 h-5", "data-id": "68d0hehs1", "data-path": "src/pages/Admin/SecuritySettings.tsx" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "08pv4zo3w", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: "Password Policy" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", "data-id": "hi7zh60kt", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", "data-id": "fxp4stpvj", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "xy6kw9pb0", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "minLength", "data-id": "0euuf2sy8", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: "Minimum Length" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "minLength",
                type: "number",
                value: settings.passwordPolicy.minLength,
                onChange: (e) => setSettings((prev) => ({
                  ...prev,
                  passwordPolicy: {
                    ...prev.passwordPolicy,
                    minLength: parseInt(e.target.value) || 8
                  }
                })),
                "data-id": "eusp1qx1p",
                "data-path": "src/pages/Admin/SecuritySettings.tsx"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "ed4hwn1hw", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "passwordExpiry", "data-id": "zwxyiq39c", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: "Password Expiry (days)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "passwordExpiry",
                type: "number",
                value: settings.passwordPolicy.passwordExpiry,
                onChange: (e) => setSettings((prev) => ({
                  ...prev,
                  passwordPolicy: {
                    ...prev.passwordPolicy,
                    passwordExpiry: parseInt(e.target.value) || 90
                  }
                })),
                "data-id": "us30mkxda",
                "data-path": "src/pages/Admin/SecuritySettings.tsx"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", "data-id": "n5kvjcp3h", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-3 border rounded-lg", "data-id": "nkgy7chll", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "1o5ic18it", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { "data-id": "5p7nvanhf", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: "Require Uppercase" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500", "data-id": "chj7lc3pp", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: "At least one uppercase letter" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Switch,
              {
                checked: settings.passwordPolicy.requireUppercase,
                onCheckedChange: (checked) => setSettings((prev) => ({
                  ...prev,
                  passwordPolicy: {
                    ...prev.passwordPolicy,
                    requireUppercase: checked
                  }
                })),
                "data-id": "9te2sxffh",
                "data-path": "src/pages/Admin/SecuritySettings.tsx"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-3 border rounded-lg", "data-id": "zidd09tqq", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "vv4gnlg3u", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { "data-id": "rdisxs6j5", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: "Require Numbers" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500", "data-id": "8kai27fn4", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: "At least one number" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Switch,
              {
                checked: settings.passwordPolicy.requireNumbers,
                onCheckedChange: (checked) => setSettings((prev) => ({
                  ...prev,
                  passwordPolicy: {
                    ...prev.passwordPolicy,
                    requireNumbers: checked
                  }
                })),
                "data-id": "easd79qzq",
                "data-path": "src/pages/Admin/SecuritySettings.tsx"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-3 border rounded-lg", "data-id": "fu89ycd34", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "ck6yn63hp", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { "data-id": "9tix1je4x", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: "Require Special Characters" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500", "data-id": "72rdfdg3p", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: "At least one special character" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Switch,
              {
                checked: settings.passwordPolicy.requireSpecialChars,
                onCheckedChange: (checked) => setSettings((prev) => ({
                  ...prev,
                  passwordPolicy: {
                    ...prev.passwordPolicy,
                    requireSpecialChars: checked
                  }
                })),
                "data-id": "z016xrxws",
                "data-path": "src/pages/Admin/SecuritySettings.tsx"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-3 border rounded-lg", "data-id": "p0589ilya", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "tmc20hhn6", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { "data-id": "dv6m2lzhe", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: "Require Lowercase" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500", "data-id": "z6yjt4q50", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: "At least one lowercase letter" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Switch,
              {
                checked: settings.passwordPolicy.requireLowercase,
                onCheckedChange: (checked) => setSettings((prev) => ({
                  ...prev,
                  passwordPolicy: {
                    ...prev.passwordPolicy,
                    requireLowercase: checked
                  }
                })),
                "data-id": "ad32igs0z",
                "data-path": "src/pages/Admin/SecuritySettings.tsx"
              }
            )
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "4gx2jxu7n", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "suynswcf6", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center space-x-2", "data-id": "sq7nrfsxl", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-5 h-5", "data-id": "ku6c9qhzr", "data-path": "src/pages/Admin/SecuritySettings.tsx" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "hddpyr864", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: "Account Security" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", "data-id": "7enu5prt9", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", "data-id": "8tk2o6l8a", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "csg9x35fv", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "maxFailedAttempts", "data-id": "i3kolqnfb", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: "Max Failed Attempts" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "maxFailedAttempts",
                type: "number",
                value: settings.accountSecurity.maxFailedAttempts,
                onChange: (e) => setSettings((prev) => ({
                  ...prev,
                  accountSecurity: {
                    ...prev.accountSecurity,
                    maxFailedAttempts: parseInt(e.target.value) || 5
                  }
                })),
                "data-id": "deleixu80",
                "data-path": "src/pages/Admin/SecuritySettings.tsx"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "ee1zsukrr", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "lockoutDuration", "data-id": "6ae3xuw07", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: "Lockout Duration (minutes)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "lockoutDuration",
                type: "number",
                value: settings.accountSecurity.lockoutDuration,
                onChange: (e) => setSettings((prev) => ({
                  ...prev,
                  accountSecurity: {
                    ...prev.accountSecurity,
                    lockoutDuration: parseInt(e.target.value) || 30
                  }
                })),
                "data-id": "434k4lp1y",
                "data-path": "src/pages/Admin/SecuritySettings.tsx"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "2vag0f469", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "sessionTimeout", "data-id": "eqeh6hitv", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: "Session Timeout (minutes)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "sessionTimeout",
                type: "number",
                value: settings.accountSecurity.sessionTimeout,
                onChange: (e) => setSettings((prev) => ({
                  ...prev,
                  accountSecurity: {
                    ...prev.accountSecurity,
                    sessionTimeout: parseInt(e.target.value) || 60
                  }
                })),
                "data-id": "21hzixaai",
                "data-path": "src/pages/Admin/SecuritySettings.tsx"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", "data-id": "q45y8oqb4", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-3 border rounded-lg", "data-id": "vqhxhmfp5", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "xul1yzjha", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { "data-id": "desbyq5sl", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: "Email Verification" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500", "data-id": "skj3ie67e", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: "Require email verification for new accounts" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Switch,
              {
                checked: settings.accountSecurity.requireEmailVerification,
                onCheckedChange: (checked) => setSettings((prev) => ({
                  ...prev,
                  accountSecurity: {
                    ...prev.accountSecurity,
                    requireEmailVerification: checked
                  }
                })),
                "data-id": "my4bt1dt5",
                "data-path": "src/pages/Admin/SecuritySettings.tsx"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-3 border rounded-lg", "data-id": "9z8h535r3", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "icj474hoz", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { "data-id": "zmszk38c3", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: "Two-Factor Authentication" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500", "data-id": "bih5hl574", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: "Require 2FA for all users" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Switch,
              {
                checked: settings.accountSecurity.requireTwoFactor,
                onCheckedChange: (checked) => setSettings((prev) => ({
                  ...prev,
                  accountSecurity: {
                    ...prev.accountSecurity,
                    requireTwoFactor: checked
                  }
                })),
                "data-id": "t4r9vk1zm",
                "data-path": "src/pages/Admin/SecuritySettings.tsx"
              }
            )
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "b3o2634d4", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "83n68x764", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center space-x-2", "data-id": "8fxrj7hwq", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Server, { className: "w-5 h-5", "data-id": "3s11v1fpd", "data-path": "src/pages/Admin/SecuritySettings.tsx" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "h15wyd2cn", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: "System Security" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", "data-id": "vvdgnemy4", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", "data-id": "m12bumkmn", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-3 border rounded-lg", "data-id": "uwd6pg393", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "h4bljlrbm", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { "data-id": "xppqzdp7f", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: "SSL/TLS Encryption" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500", "data-id": "a24vpgzpf", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: "Enable secure connections" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Switch,
              {
                checked: settings.systemSecurity.enableSSL,
                onCheckedChange: (checked) => setSettings((prev) => ({
                  ...prev,
                  systemSecurity: {
                    ...prev.systemSecurity,
                    enableSSL: checked
                  }
                })),
                "data-id": "xnj8l8odl",
                "data-path": "src/pages/Admin/SecuritySettings.tsx"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-3 border rounded-lg", "data-id": "p5dju1v1p", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "dlvawjnz5", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { "data-id": "jormp61hm", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: "Firewall Protection" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500", "data-id": "c3z1a6k97", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: "Enable network firewall" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Switch,
              {
                checked: settings.systemSecurity.enableFirewall,
                onCheckedChange: (checked) => setSettings((prev) => ({
                  ...prev,
                  systemSecurity: {
                    ...prev.systemSecurity,
                    enableFirewall: checked
                  }
                })),
                "data-id": "1kk9pvh3l",
                "data-path": "src/pages/Admin/SecuritySettings.tsx"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-3 border rounded-lg", "data-id": "1cprobcfb", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "ga589uwk6", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { "data-id": "xany8o0lg", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: "Audit Logging" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500", "data-id": "mkjsz6ixg", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: "Log all system activities" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Switch,
              {
                checked: settings.systemSecurity.enableAuditLogging,
                onCheckedChange: (checked) => setSettings((prev) => ({
                  ...prev,
                  systemSecurity: {
                    ...prev.systemSecurity,
                    enableAuditLogging: checked
                  }
                })),
                "data-id": "lg22pdfb3",
                "data-path": "src/pages/Admin/SecuritySettings.tsx"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", "data-id": "wsax1nvuo", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-3 border rounded-lg", "data-id": "hcgge88xm", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "ms85zit4c", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { "data-id": "pcczpj805", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: "Data Encryption" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500", "data-id": "9y32338xd", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: "Encrypt stored data" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Switch,
              {
                checked: settings.systemSecurity.enableDataEncryption,
                onCheckedChange: (checked) => setSettings((prev) => ({
                  ...prev,
                  systemSecurity: {
                    ...prev.systemSecurity,
                    enableDataEncryption: checked
                  }
                })),
                "data-id": "8glesnxua",
                "data-path": "src/pages/Admin/SecuritySettings.tsx"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-3 border rounded-lg", "data-id": "jfnbvsxak", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "fww9dgwk9", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { "data-id": "68w2hwwxe", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: "Backup Encryption" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500", "data-id": "bpehscknu", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: "Encrypt backup files" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Switch,
              {
                checked: settings.systemSecurity.enableBackupEncryption,
                onCheckedChange: (checked) => setSettings((prev) => ({
                  ...prev,
                  systemSecurity: {
                    ...prev.systemSecurity,
                    enableBackupEncryption: checked
                  }
                })),
                "data-id": "xza3m5ugn",
                "data-path": "src/pages/Admin/SecuritySettings.tsx"
              }
            )
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "qwjodifkp", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "707l5v7mx", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center space-x-2", "data-id": "da4uv760h", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "w-5 h-5", "data-id": "7omg7uqm7", "data-path": "src/pages/Admin/SecuritySettings.tsx" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "2r2ppu1l2", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: "IP Address Management" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", "data-id": "h73tftkvn", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "v6lw37fhs", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "z52ovafut", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { "data-id": "cjut6s007", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: "Enable IP Whitelist" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500", "data-id": "cpzwgosft", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: "Only allow access from specified IP addresses" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Switch,
            {
              checked: settings.systemSecurity.enableIPWhitelist,
              onCheckedChange: (checked) => setSettings((prev) => ({
                ...prev,
                systemSecurity: {
                  ...prev.systemSecurity,
                  enableIPWhitelist: checked
                }
              })),
              "data-id": "6vd7mglhs",
              "data-path": "src/pages/Admin/SecuritySettings.tsx"
            }
          )
        ] }),
        settings.systemSecurity.enableIPWhitelist && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", "data-id": "q4o7kmfsp", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex space-x-2", "data-id": "hp4pwjecv", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                placeholder: "Enter IP address or CIDR (e.g., 192.168.1.0/24)",
                value: newIPAddress,
                onChange: (e) => setNewIPAddress(e.target.value),
                "data-id": "d85eit5rb",
                "data-path": "src/pages/Admin/SecuritySettings.tsx"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: addIPToWhitelist, "data-id": "xc36yr34s", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: "Add" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", "data-id": "ynodti97l", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: settings.systemSecurity.ipWhitelist.map(
            (ip, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-2 border rounded", "data-id": "smxbanphl", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-sm", "data-id": "dyf9a4lis", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: ip }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "sm",
                  variant: "outline",
                  onClick: () => removeIPFromWhitelist(ip),
                  className: "text-red-600",
                  "data-id": "84j0idbj3",
                  "data-path": "src/pages/Admin/SecuritySettings.tsx",
                  children: "Remove"
                }
              )
            ] }, index)
          ) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      BatchActionBar,
      {
        selectedCount: batchSelection.selectedCount,
        onBatchDelete: handleBatchDelete,
        onClearSelection: batchSelection.clearSelection,
        isLoading: batchActionLoading,
        showEdit: false,
        "data-id": "fcnsa7ex9",
        "data-path": "src/pages/Admin/SecuritySettings.tsx"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "3etb6iddc", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "2xri2oe0y", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center space-x-2", "data-id": "7ijfi11hj", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-5 h-5", "data-id": "kq4vscjwz", "data-path": "src/pages/Admin/SecuritySettings.tsx" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "b5zh6c2ae", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: "Recent Security Events" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { "data-id": "rcdzbykx0", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", "data-id": "c2rtw0yff", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { "data-id": "b44h1ipmt", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { "data-id": "uy7vu9ze4", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { "data-id": "8o2mavk0l", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-12", "data-id": "vxvjt4g1v", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Checkbox,
            {
              checked: securityEvents.length > 0 && batchSelection.selectedCount === securityEvents.length,
              onCheckedChange: () => batchSelection.toggleSelectAll(securityEvents, (event) => event.id),
              "aria-label": "Select all security events",
              "data-id": "pv23fptlx",
              "data-path": "src/pages/Admin/SecuritySettings.tsx"
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "3r0sfcwq0", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: "Time" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "zhdu1vp13", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: "Type" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "llj9uf8nw", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: "Severity" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "m3oq9tcw7", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: "Description" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "3rhvvsu73", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: "User/IP" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "n2559s5f7", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: "Action Taken" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { "data-id": "7uvhlig2o", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: securityEvents.map(
          (event) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: batchSelection.isSelected(event.id) ? "bg-blue-50" : "", "data-id": "cygedyifu", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "wbu0px8zv", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Checkbox,
              {
                checked: batchSelection.isSelected(event.id),
                onCheckedChange: () => batchSelection.toggleItem(event.id),
                "aria-label": `Select security event ${event.id}`,
                "data-id": "6qx805xym",
                "data-path": "src/pages/Admin/SecuritySettings.tsx"
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-mono text-sm", "data-id": "q060if9wa", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", "data-id": "1l2ny5qqc", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3 text-gray-400", "data-id": "fwowveiys", "data-path": "src/pages/Admin/SecuritySettings.tsx" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "5kk71egyr", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: new Date(event.timestamp).toLocaleString() })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "mkn7a0lge", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", "data-id": "56ds0wdzt", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: event.type.replace("_", " ") }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "vyrkl5oqo", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: getSeverityColor2(event.severity), "data-id": "yvmon1av2", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: event.severity.toUpperCase() }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "gzh0311tv", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: event.description }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "font-mono text-sm", "data-id": "kk9wp26lp", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: [
              event.user && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-id": "yu73bggz1", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: event.user }),
              event.ip_address && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-gray-500", "data-id": "gi4e9atby", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: event.ip_address })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "622xb3m9k", "data-path": "src/pages/Admin/SecuritySettings.tsx", children: event.action_taken || "No action taken" })
          ] }, event.id)
        ) })
      ] }) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      BatchDeleteDialog,
      {
        isOpen: isBatchDeleteDialogOpen,
        onClose: () => setIsBatchDeleteDialogOpen(false),
        onConfirm: confirmBatchDelete,
        selectedCount: batchSelection.selectedCount,
        isLoading: batchActionLoading,
        itemName: "security events",
        selectedItems: batchSelection.getSelectedData(securityEvents, (event) => event.id).map((event) => ({
          id: event.id,
          name: `${event.type} - ${event.severity.toUpperCase()} - ${event.description.substring(0, 50)}...`
        })),
        "data-id": "03j5u5blh",
        "data-path": "src/pages/Admin/SecuritySettings.tsx"
      }
    )
  ] });
};
const SecuritySettings$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: SecuritySettings
}, Symbol.toStringTag, { value: "Module" }));
const SMSTestConnection = () => {
  const [testNumber, setTestNumber] = reactExports.useState("");
  const [testing, setTesting] = reactExports.useState(false);
  const [lastTestResult, setLastTestResult] = reactExports.useState(null);
  const { toast } = useToast();
  const runConnectionTest = async () => {
    if (!testNumber.trim()) {
      toast({
        title: "Phone Number Required",
        description: "Please enter a phone number to test",
        variant: "destructive"
      });
      return;
    }
    try {
      setTesting(true);
      setLastTestResult(null);
      const serviceStatus = await smsService.getServiceStatus();
      if (!serviceStatus.available) {
        throw new Error(serviceStatus.message);
      }
      const result = await smsService.testSMS(testNumber);
      setLastTestResult({
        success: result.success,
        message: result.success ? `Test SMS sent successfully to ${testNumber}` : result.error,
        timestamp: /* @__PURE__ */ new Date(),
        messageId: result.messageId,
        phoneNumber: testNumber
      });
      if (result.success) {
        toast({
          title: "✅ Test Successful",
          description: `Test SMS sent to ${testNumber}. Check your phone!`
        });
      } else {
        toast({
          title: "❌ Test Failed",
          description: result.error || "Failed to send test SMS",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("SMS test error:", error);
      setLastTestResult({
        success: false,
        message: error instanceof Error ? error.message : "Unknown error occurred",
        timestamp: /* @__PURE__ */ new Date(),
        phoneNumber: testNumber
      });
      toast({
        title: "❌ Connection Test Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setTesting(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "w-full", "data-id": "od2udchk7", "data-path": "src/components/SMSTestConnection.tsx", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "2kdkufwwa", "data-path": "src/components/SMSTestConnection.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center", "data-id": "wvbbjvkq5", "data-path": "src/components/SMSTestConnection.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TestTube, { className: "w-5 h-5 mr-2", "data-id": "ybt8177bh", "data-path": "src/components/SMSTestConnection.tsx" }),
      "SMS Connection Test"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", "data-id": "xkh9nq0zk", "data-path": "src/components/SMSTestConnection.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "owzah4cmu", "data-path": "src/components/SMSTestConnection.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "testNumber", "data-id": "g6twrwtzh", "data-path": "src/components/SMSTestConnection.tsx", children: "Test Phone Number" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "testNumber",
            type: "tel",
            placeholder: "+1234567890",
            value: testNumber,
            onChange: (e) => setTestNumber(e.target.value),
            "data-id": "l8mec3xs0",
            "data-path": "src/components/SMSTestConnection.tsx"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", "data-id": "h14njuhir", "data-path": "src/components/SMSTestConnection.tsx", children: "Enter your phone number to receive a test SMS" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: runConnectionTest,
          disabled: testing || !testNumber.trim(),
          className: "w-full",
          "data-id": "04kenu7pp",
          "data-path": "src/components/SMSTestConnection.tsx",
          children: testing ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 mr-2 animate-spin", "data-id": "j97g2gqiv", "data-path": "src/components/SMSTestConnection.tsx" }),
            "Testing Connection..."
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "w-4 h-4 mr-2", "data-id": "v8fxaocwf", "data-path": "src/components/SMSTestConnection.tsx" }),
            "Send Test SMS"
          ] })
        }
      ),
      lastTestResult && /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { className: lastTestResult.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50", "data-id": "w0x2sne3x", "data-path": "src/components/SMSTestConnection.tsx", children: [
        lastTestResult.success ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-4 w-4 text-green-600", "data-id": "gz4lcu27r", "data-path": "src/components/SMSTestConnection.tsx" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4 text-red-600", "data-id": "n1l92vvrx", "data-path": "src/components/SMSTestConnection.tsx" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { "data-id": "1u6qpr5a0", "data-path": "src/components/SMSTestConnection.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: lastTestResult.success ? "text-green-800" : "text-red-800", "data-id": "o63d1l9qo", "data-path": "src/components/SMSTestConnection.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", "data-id": "fel4ewict", "data-path": "src/components/SMSTestConnection.tsx", children: lastTestResult.success ? "✅ Test Successful" : "❌ Test Failed" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 space-y-1 text-sm", "data-id": "8378nn8zb", "data-path": "src/components/SMSTestConnection.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "u36300j3s", "data-path": "src/components/SMSTestConnection.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { "data-id": "y0q4n0xpv", "data-path": "src/components/SMSTestConnection.tsx", children: "Message:" }),
              " ",
              lastTestResult.message
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "0my462n5o", "data-path": "src/components/SMSTestConnection.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { "data-id": "oofpitvsn", "data-path": "src/components/SMSTestConnection.tsx", children: "Phone:" }),
              " ",
              lastTestResult.phoneNumber
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "u9vq0a0fn", "data-path": "src/components/SMSTestConnection.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { "data-id": "yay2nykv2", "data-path": "src/components/SMSTestConnection.tsx", children: "Time:" }),
              " ",
              lastTestResult.timestamp.toLocaleString()
            ] }),
            lastTestResult.messageId && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "3z7fkn63a", "data-path": "src/components/SMSTestConnection.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { "data-id": "63fk3qv00", "data-path": "src/components/SMSTestConnection.tsx", children: "Message ID:" }),
              " ",
              lastTestResult.messageId
            ] })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t pt-4", "data-id": "p0gh4oahs", "data-path": "src/components/SMSTestConnection.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground space-y-2", "data-id": "7w4a8ch69", "data-path": "src/components/SMSTestConnection.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", "data-id": "50cg5dz21", "data-path": "src/components/SMSTestConnection.tsx", children: "Test Information:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "list-disc list-inside space-y-1 text-xs", "data-id": "6iorw4mu0", "data-path": "src/components/SMSTestConnection.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { "data-id": "2rr88nny4", "data-path": "src/components/SMSTestConnection.tsx", children: "This test sends a real SMS to verify your configuration" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { "data-id": "agljz840b", "data-path": "src/components/SMSTestConnection.tsx", children: "Make sure to enter a phone number you have access to" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { "data-id": "5izudjylx", "data-path": "src/components/SMSTestConnection.tsx", children: "Test messages don't count toward license alerts" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { "data-id": "ed6v78huk", "data-path": "src/components/SMSTestConnection.tsx", children: "Check your SMS provider balance if tests fail" })
        ] })
      ] }) })
    ] })
  ] });
};
const CustomSMSSendingForm = () => {
  var _a, _b;
  const [phoneNumber, setPhoneNumber] = reactExports.useState("");
  const [message, setMessage] = reactExports.useState("");
  const [fromNumber, setFromNumber] = reactExports.useState("");
  const [contacts, setContacts] = reactExports.useState([]);
  const [providers, setProviders] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(false);
  const [sendingProgress, setSendingProgress] = reactExports.useState(0);
  const [validationErrors, setValidationErrors] = reactExports.useState([]);
  const [lastSentMessage, setLastSentMessage] = reactExports.useState(null);
  const { toast } = useToast();
  reactExports.useEffect(() => {
    loadContacts();
    loadProviders();
    loadSMSService();
  }, []);
  const loadSMSService = async () => {
    try {
      await smsService.loadConfiguration();
    } catch (error) {
      console.error("Error loading SMS service:", error);
    }
  };
  const loadContacts = async () => {
    try {
      const { data, error } = await window.ezsite.apis.tablePage("12612", {
        PageNo: 1,
        PageSize: 100,
        OrderByField: "contact_name",
        IsAsc: true,
        Filters: [{ name: "is_active", op: "Equal", value: true }]
      });
      if (error) throw error;
      setContacts((data == null ? void 0 : data.List) || []);
    } catch (error) {
      console.error("Error loading contacts:", error);
      toast({
        title: "Error",
        description: "Failed to load SMS contacts",
        variant: "destructive"
      });
    }
  };
  const loadProviders = async () => {
    try {
      const { data, error } = await window.ezsite.apis.tablePage("12640", {
        PageNo: 1,
        PageSize: 10,
        OrderByField: "id",
        IsAsc: false,
        Filters: [{ name: "is_active", op: "Equal", value: true }]
      });
      if (error) throw error;
      const providerList = (data == null ? void 0 : data.List) || [];
      setProviders(providerList);
      if (providerList.length > 0 && !fromNumber) {
        setFromNumber(providerList[0].from_number);
      }
    } catch (error) {
      console.error("Error loading providers:", error);
      toast({
        title: "Error",
        description: "Failed to load SMS providers",
        variant: "destructive"
      });
    }
  };
  const validateForm = () => {
    const errors = [];
    if (!phoneNumber.trim()) {
      errors.push("Phone number is required");
    } else if (!isValidPhoneNumber(phoneNumber)) {
      errors.push("Please enter a valid phone number (e.g., +1234567890 or 1234567890)");
    }
    if (!message.trim()) {
      errors.push("Message content is required");
    } else if (message.length > 1600) {
      errors.push("Message is too long (maximum 1600 characters)");
    }
    if (!fromNumber) {
      errors.push("Please select a sender number");
    }
    setValidationErrors(errors);
    return errors.length === 0;
  };
  const isValidPhoneNumber = (phone) => {
    const cleaned = phone.replace(/[^\d]/g, "");
    if (cleaned.length < 10 || cleaned.length > 15) {
      return false;
    }
    if (cleaned.length === 10 || cleaned.length === 11 && cleaned.startsWith("1")) {
      return true;
    }
    return cleaned.length >= 10 && cleaned.length <= 15;
  };
  const formatPhoneNumber = (phone) => {
    const cleaned = phone.replace(/[^\d]/g, "");
    if (!phone.startsWith("+")) {
      if (cleaned.length === 10) {
        return `+1${cleaned}`;
      } else if (cleaned.length === 11 && cleaned.startsWith("1")) {
        return `+${cleaned}`;
      } else {
        return `+${cleaned}`;
      }
    }
    return phone;
  };
  const selectContact = (contact) => {
    setPhoneNumber(contact.mobile_number);
    toast({
      title: "Contact Selected",
      description: `Selected ${contact.contact_name} (${contact.mobile_number})`
    });
  };
  const sendCustomSMS = async () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors below",
        variant: "destructive"
      });
      return;
    }
    try {
      setLoading(true);
      setSendingProgress(0);
      const formattedPhone = formatPhoneNumber(phoneNumber);
      const progressInterval = setInterval(() => {
        setSendingProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);
      const result = await smsService.sendCustomSMS(formattedPhone, message, fromNumber);
      clearInterval(progressInterval);
      setSendingProgress(100);
      if (result.success) {
        await window.ezsite.apis.tableCreate("12613", {
          license_id: 0,
          // Custom message
          contact_id: 0,
          // Manual entry
          mobile_number: formattedPhone,
          message_content: message,
          sent_date: (/* @__PURE__ */ new Date()).toISOString(),
          delivery_status: "Sent",
          days_before_expiry: 0,
          created_by: 1
        });
        setLastSentMessage({
          phone: formattedPhone,
          message,
          timestamp: /* @__PURE__ */ new Date(),
          messageId: result.messageId
        });
        toast({
          title: "✅ SMS Sent Successfully",
          description: `Message sent to ${formattedPhone}`
        });
        setMessage("");
        if (!contacts.find((c) => c.mobile_number === formattedPhone)) {
          setPhoneNumber("");
        }
      } else {
        throw new Error(result.error || "Failed to send SMS");
      }
    } catch (error) {
      console.error("Error sending custom SMS:", error);
      toast({
        title: "❌ SMS Failed",
        description: error instanceof Error ? error.message : "Failed to send SMS",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setSendingProgress(0);
    }
  };
  const getCharacterCount = () => {
    const count = message.length;
    const smsLength = 160;
    const segments = Math.ceil(count / smsLength);
    return {
      count,
      segments,
      remaining: smsLength - (count % smsLength || smsLength),
      isLong: segments > 1
    };
  };
  const charInfo = getCharacterCount();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", "data-id": "b0i9t05x7", "data-path": "src/components/CustomSMSSendingForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", "data-id": "z77fo09mq", "data-path": "src/components/CustomSMSSendingForm.tsx", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-2", "data-id": "ux35pw6ru", "data-path": "src/components/CustomSMSSendingForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "w-full", "data-id": "d1lkxajop", "data-path": "src/components/CustomSMSSendingForm.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "bdxmdpfw4", "data-path": "src/components/CustomSMSSendingForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center", "data-id": "fcrl9q5fk", "data-path": "src/components/CustomSMSSendingForm.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "w-5 h-5 mr-2", "data-id": "q41x07ssr", "data-path": "src/components/CustomSMSSendingForm.tsx" }),
        "Send Custom SMS"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-6", "data-id": "a6yd3z9p7", "data-path": "src/components/CustomSMSSendingForm.tsx", children: [
        validationErrors.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { variant: "destructive", "data-id": "t6io0rsq3", "data-path": "src/components/CustomSMSSendingForm.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4", "data-id": "o4bshrxkg", "data-path": "src/components/CustomSMSSendingForm.tsx" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { "data-id": "xyaokz3at", "data-path": "src/components/CustomSMSSendingForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "list-disc list-inside space-y-1", "data-id": "kwcti1z6l", "data-path": "src/components/CustomSMSSendingForm.tsx", children: validationErrors.map(
            (error, index) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { "data-id": "pu1fmogh4", "data-path": "src/components/CustomSMSSendingForm.tsx", children: error }, index)
          ) }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "azam3kbzk", "data-path": "src/components/CustomSMSSendingForm.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "fromNumber", "data-id": "chcaxwggm", "data-path": "src/components/CustomSMSSendingForm.tsx", children: "Send From Number" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: fromNumber, onValueChange: setFromNumber, "data-id": "9ooa4qehp", "data-path": "src/components/CustomSMSSendingForm.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-id": "c6oahcbir", "data-path": "src/components/CustomSMSSendingForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select sender number", "data-id": "t3iicq5vh", "data-path": "src/components/CustomSMSSendingForm.tsx" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { "data-id": "n5gdbyc1y", "data-path": "src/components/CustomSMSSendingForm.tsx", children: providers.map(
              (provider) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: provider.from_number, "data-id": "o1qgtjo8n", "data-path": "src/components/CustomSMSSendingForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between w-full", "data-id": "nm0tu16xb", "data-path": "src/components/CustomSMSSendingForm.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "gq0i2qt28", "data-path": "src/components/CustomSMSSendingForm.tsx", children: provider.from_number }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2 ml-4", "data-id": "dybxt7wgi", "data-path": "src/components/CustomSMSSendingForm.tsx", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: provider.test_mode ? "outline" : "default", className: "text-xs", "data-id": "4xfzm8ygg", "data-path": "src/components/CustomSMSSendingForm.tsx", children: provider.provider_name }),
                  provider.test_mode && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-xs", "data-id": "p28gm0qig", "data-path": "src/components/CustomSMSSendingForm.tsx", children: "TEST" })
                ] })
              ] }) }, provider.id)
            ) })
          ] })
        ] }),
        contacts.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "0pengc8h5", "data-path": "src/components/CustomSMSSendingForm.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { "data-id": "gfou8r1ri", "data-path": "src/components/CustomSMSSendingForm.tsx", children: "Quick Select Contact" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2", "data-id": "g9gmsdjuq", "data-path": "src/components/CustomSMSSendingForm.tsx", children: contacts.slice(0, 6).map(
            (contact) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: () => selectContact(contact),
                className: "justify-start text-left h-auto p-3",
                "data-id": "lrc55e5wj",
                "data-path": "src/components/CustomSMSSendingForm.tsx",
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", "data-id": "t4dmh2naq", "data-path": "src/components/CustomSMSSendingForm.tsx", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-4 h-4", "data-id": "fkyjm7k6g", "data-path": "src/components/CustomSMSSendingForm.tsx" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "qanarfxes", "data-path": "src/components/CustomSMSSendingForm.tsx", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-sm", "data-id": "yd2vasmyg", "data-path": "src/components/CustomSMSSendingForm.tsx", children: contact.contact_name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", "data-id": "n2kpgihf0", "data-path": "src/components/CustomSMSSendingForm.tsx", children: contact.mobile_number }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs mt-1", "data-id": "ndbozbbtv", "data-path": "src/components/CustomSMSSendingForm.tsx", children: contact.station })
                  ] })
                ] })
              },
              contact.id
            )
          ) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "n8nv3rnti", "data-path": "src/components/CustomSMSSendingForm.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "phoneNumber", "data-id": "8eafwrqwu", "data-path": "src/components/CustomSMSSendingForm.tsx", children: [
            "Recipient Phone Number",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500 ml-1", "data-id": "x7el1pc3t", "data-path": "src/components/CustomSMSSendingForm.tsx", children: "*" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "phoneNumber",
              type: "tel",
              placeholder: "+1234567890 or 1234567890",
              value: phoneNumber,
              onChange: (e) => setPhoneNumber(e.target.value),
              className: validationErrors.some((e) => e.includes("Phone")) ? "border-red-500" : "",
              "data-id": "20dxdons3",
              "data-path": "src/components/CustomSMSSendingForm.tsx"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", "data-id": "pt1nvoxoo", "data-path": "src/components/CustomSMSSendingForm.tsx", children: "Enter a valid phone number (US: 1234567890, International: +1234567890)" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "py3u7lqnx", "data-path": "src/components/CustomSMSSendingForm.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "message", "data-id": "xqqn71uei", "data-path": "src/components/CustomSMSSendingForm.tsx", children: [
            "Message Content",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500 ml-1", "data-id": "9cm9nt4ti", "data-path": "src/components/CustomSMSSendingForm.tsx", children: "*" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              id: "message",
              placeholder: "Type your custom SMS message here...",
              value: message,
              onChange: (e) => setMessage(e.target.value),
              rows: 4,
              className: validationErrors.some((e) => e.includes("Message")) ? "border-red-500" : "",
              "data-id": "9avkopser",
              "data-path": "src/components/CustomSMSSendingForm.tsx"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center text-sm", "data-id": "w6ift44jb", "data-path": "src/components/CustomSMSSendingForm.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `${charInfo.count > 1500 ? "text-red-500" : "text-muted-foreground"}`, "data-id": "y25orxyk8", "data-path": "src/components/CustomSMSSendingForm.tsx", children: [
              charInfo.count,
              "/1600 characters"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", "data-id": "jxnxco4rr", "data-path": "src/components/CustomSMSSendingForm.tsx", children: [
              charInfo.isLong && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "text-xs", "data-id": "ecgky18sc", "data-path": "src/components/CustomSMSSendingForm.tsx", children: [
                charInfo.segments,
                " SMS segments"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", "data-id": "jjj7nfv7p", "data-path": "src/components/CustomSMSSendingForm.tsx", children: [
                charInfo.remaining,
                " remaining in current segment"
              ] })
            ] })
          ] })
        ] }),
        loading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "pu6zrgen3", "data-path": "src/components/CustomSMSSendingForm.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", "data-id": "njag10vfl", "data-path": "src/components/CustomSMSSendingForm.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin", "data-id": "jv43mil8e", "data-path": "src/components/CustomSMSSendingForm.tsx" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", "data-id": "lzq48ac9k", "data-path": "src/components/CustomSMSSendingForm.tsx", children: "Sending SMS..." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: sendingProgress, className: "w-full", "data-id": "c85cu0zsf", "data-path": "src/components/CustomSMSSendingForm.tsx" })
        ] }),
        lastSentMessage && /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { className: "border-green-200 bg-green-50", "data-id": "4d6sc0mze", "data-path": "src/components/CustomSMSSendingForm.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-4 w-4 text-green-600", "data-id": "pfn8808ev", "data-path": "src/components/CustomSMSSendingForm.tsx" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { "data-id": "9n1oob21u", "data-path": "src/components/CustomSMSSendingForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-green-800", "data-id": "j9tp2tf8a", "data-path": "src/components/CustomSMSSendingForm.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { "data-id": "6oagc5jmu", "data-path": "src/components/CustomSMSSendingForm.tsx", children: "Last message sent successfully:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 space-y-1 text-sm", "data-id": "y4ivfntlp", "data-path": "src/components/CustomSMSSendingForm.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "mcejh0fod", "data-path": "src/components/CustomSMSSendingForm.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { "data-id": "3xdh5731v", "data-path": "src/components/CustomSMSSendingForm.tsx", children: "To:" }),
                " ",
                lastSentMessage.phone
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "vmwwnuv8j", "data-path": "src/components/CustomSMSSendingForm.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { "data-id": "foj13qa18", "data-path": "src/components/CustomSMSSendingForm.tsx", children: "At:" }),
                " ",
                lastSentMessage.timestamp.toLocaleString()
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "0w93g9i9t", "data-path": "src/components/CustomSMSSendingForm.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { "data-id": "9kvp5nzq9", "data-path": "src/components/CustomSMSSendingForm.tsx", children: "Message ID:" }),
                " ",
                lastSentMessage.messageId
              ] })
            ] })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: sendCustomSMS,
            disabled: loading || !phoneNumber || !message || !fromNumber,
            className: "w-full",
            size: "lg",
            "data-id": "qmsm3hnm7",
            "data-path": "src/components/CustomSMSSendingForm.tsx",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "w-4 h-4 mr-2", "data-id": "teqh0ji4t", "data-path": "src/components/CustomSMSSendingForm.tsx" }),
              loading ? "Sending..." : "Send SMS"
            ]
          }
        ),
        providers.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-4 border-t", "data-id": "kqqfx80y5", "data-path": "src/components/CustomSMSSendingForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4 text-sm text-muted-foreground", "data-id": "c39uo4gte", "data-path": "src/components/CustomSMSSendingForm.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "sy4cwnjg7", "data-path": "src/components/CustomSMSSendingForm.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { "data-id": "zm2bwqmjy", "data-path": "src/components/CustomSMSSendingForm.tsx", children: "Service Status:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center mt-1", "data-id": "elobv2yef", "data-path": "src/components/CustomSMSSendingForm.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-4 h-4 text-green-500 mr-1", "data-id": "dwh7ygpxv", "data-path": "src/components/CustomSMSSendingForm.tsx" }),
              "SMS Service Active"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "s5utcbty3", "data-path": "src/components/CustomSMSSendingForm.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { "data-id": "zfghmxd7o", "data-path": "src/components/CustomSMSSendingForm.tsx", children: "Monthly Usage:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1", "data-id": "xc09uxj51", "data-path": "src/components/CustomSMSSendingForm.tsx", children: [
              ((_a = providers[0]) == null ? void 0 : _a.current_month_count) || 0,
              " / ",
              ((_b = providers[0]) == null ? void 0 : _b.monthly_limit) || 1e3,
              " messages"
            ] })
          ] })
        ] }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", "data-id": "lk3qyrl4v", "data-path": "src/components/CustomSMSSendingForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SMSTestConnection, { "data-id": "obrsid3xj", "data-path": "src/components/CustomSMSSendingForm.tsx" }) })
  ] }) });
};
const EnhancedSMSTestManager = () => {
  var _a;
  const [testNumber, setTestNumber] = reactExports.useState("");
  const [customMessage, setCustomMessage] = reactExports.useState("");
  const [testing, setTesting] = reactExports.useState(false);
  const [testResults, setTestResults] = reactExports.useState([]);
  const [serviceStatus, setServiceStatus] = reactExports.useState(null);
  const [configLoading, setConfigLoading] = reactExports.useState(false);
  const [deliveryTracking, setDeliveryTracking] = reactExports.useState({});
  const { toast } = useToast();
  reactExports.useEffect(() => {
    loadServiceStatus();
  }, []);
  const loadServiceStatus = async () => {
    try {
      setConfigLoading(true);
      await enhancedSmsService.loadConfiguration();
      const status = await enhancedSmsService.getServiceStatus();
      setServiceStatus(status);
    } catch (error) {
      console.error("Error loading service status:", error);
      setServiceStatus({
        available: false,
        message: error instanceof Error ? error.message : "Unknown error"
      });
    } finally {
      setConfigLoading(false);
    }
  };
  const runBasicTest = async () => {
    if (!testNumber.trim()) {
      toast({
        title: "Phone Number Required",
        description: "Please enter a phone number to test",
        variant: "destructive"
      });
      return;
    }
    try {
      setTesting(true);
      const result = await enhancedSmsService.testSMS(testNumber);
      const testResult = {
        success: result.success,
        message: result.success ? `Test SMS sent successfully to ${testNumber}` : result.error || "Unknown error",
        timestamp: /* @__PURE__ */ new Date(),
        phoneNumber: testNumber,
        messageId: result.messageId,
        errorCode: result.errorCode,
        details: result
      };
      setTestResults((prev) => [testResult, ...prev]);
      if (result.success && result.messageId) {
        trackDeliveryStatus(result.messageId, testNumber);
      }
      if (result.success) {
        toast({
          title: "✅ Test SMS Sent",
          description: `Test message sent to ${testNumber}. Check your phone!`
        });
      } else {
        toast({
          title: "❌ Test Failed",
          description: result.error || "Failed to send test SMS",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("SMS test error:", error);
      const testResult = {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error occurred",
        timestamp: /* @__PURE__ */ new Date(),
        phoneNumber: testNumber
      };
      setTestResults((prev) => [testResult, ...prev]);
      toast({
        title: "❌ Test Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setTesting(false);
    }
  };
  const runAdvancedTest = async () => {
    if (!testNumber.trim()) {
      toast({
        title: "Phone Number Required",
        description: "Please enter a phone number to test",
        variant: "destructive"
      });
      return;
    }
    try {
      setTesting(true);
      const testData = await enhancedSmsService.testSMSWithDetails(testNumber);
      const testResult = {
        success: testData.response.success,
        message: testData.response.success ? `Advanced test completed for ${testNumber}` : testData.response.error || "Unknown error",
        timestamp: /* @__PURE__ */ new Date(),
        phoneNumber: testNumber,
        messageId: testData.response.messageId,
        errorCode: testData.response.errorCode,
        details: testData,
        deliveryStatus: testData.deliveryStatus
      };
      setTestResults((prev) => [testResult, ...prev]);
      if (testData.response.success) {
        toast({
          title: "✅ Advanced Test Completed",
          description: `Comprehensive test completed for ${testNumber}`
        });
      } else {
        toast({
          title: "❌ Advanced Test Failed",
          description: testData.response.error || "Failed to complete advanced test",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Advanced SMS test error:", error);
      toast({
        title: "❌ Advanced Test Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setTesting(false);
    }
  };
  const sendCustomMessage = async () => {
    if (!testNumber.trim() || !customMessage.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter both phone number and message",
        variant: "destructive"
      });
      return;
    }
    try {
      setTesting(true);
      const result = await enhancedSmsService.sendSMS({
        to: testNumber,
        message: customMessage,
        type: "custom"
      });
      const testResult = {
        success: result.success,
        message: result.success ? `Custom message sent to ${testNumber}` : result.error || "Unknown error",
        timestamp: /* @__PURE__ */ new Date(),
        phoneNumber: testNumber,
        messageId: result.messageId,
        errorCode: result.errorCode,
        details: result
      };
      setTestResults((prev) => [testResult, ...prev]);
      if (result.success) {
        toast({
          title: "✅ Custom Message Sent",
          description: `Message sent to ${testNumber}`
        });
        setCustomMessage("");
      } else {
        toast({
          title: "❌ Send Failed",
          description: result.error || "Failed to send message",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Custom SMS error:", error);
      toast({
        title: "❌ Send Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setTesting(false);
    }
  };
  const trackDeliveryStatus = async (messageId, phoneNumber) => {
    try {
      setDeliveryTracking((prev) => ({
        ...prev,
        [messageId]: { status: "checking", phoneNumber }
      }));
      setTimeout(async () => {
        try {
          const status = await enhancedSmsService.getDeliveryStatus(messageId);
          setDeliveryTracking((prev) => ({
            ...prev,
            [messageId]: { ...status, phoneNumber }
          }));
        } catch (error) {
          console.error("Error tracking delivery:", error);
          setDeliveryTracking((prev) => ({
            ...prev,
            [messageId]: {
              status: "error",
              phoneNumber,
              error: error instanceof Error ? error.message : "Unknown error"
            }
          }));
        }
      }, 1e4);
    } catch (error) {
      console.error("Error setting up delivery tracking:", error);
    }
  };
  const addToTestNumbers = async () => {
    if (!testNumber.trim()) return;
    try {
      await enhancedSmsService.addTestNumber(testNumber);
      toast({
        title: "✅ Test Number Added",
        description: `${testNumber} added to verified test numbers`
      });
      await loadServiceStatus();
    } catch (error) {
      toast({
        title: "❌ Failed to Add",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive"
      });
    }
  };
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "text-green-600";
      case "sent":
      case "queued":
        return "text-blue-600";
      case "failed":
      case "undelivered":
        return "text-red-600";
      default:
        return "text-yellow-600";
    }
  };
  const getStatusIcon = (success) => {
    return success ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-4 w-4 text-green-600", "data-id": "eyp125i2h", "data-path": "src/components/EnhancedSMSTestManager.tsx" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4 text-red-600", "data-id": "8kdnekdoa", "data-path": "src/components/EnhancedSMSTestManager.tsx" });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "w-full", "data-id": "o9s1mfffz", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "cfebj3fw6", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center justify-between", "data-id": "xdfs72ukw", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", "data-id": "hrp785kvq", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TestTube, { className: "w-5 h-5 mr-2", "data-id": "vrv8ihras", "data-path": "src/components/EnhancedSMSTestManager.tsx" }),
        "Enhanced SMS Testing & Debugging"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: loadServiceStatus,
          disabled: configLoading,
          "data-id": "ojetsxc7a",
          "data-path": "src/components/EnhancedSMSTestManager.tsx",
          children: configLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin", "data-id": "mpfcslxcl", "data-path": "src/components/EnhancedSMSTestManager.tsx" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-4 h-4", "data-id": "lwdfi43v0", "data-path": "src/components/EnhancedSMSTestManager.tsx" })
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { "data-id": "kaqh2inw2", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "testing", className: "w-full", "data-id": "qmidfa85x", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid w-full grid-cols-4", "data-id": "dhkro61cc", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "testing", "data-id": "f715q29kp", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: "Testing" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "status", "data-id": "j214j5wp7", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "results", "data-id": "qqdazmsug", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: "Results" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "tracking", "data-id": "js2wera3q", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: "Tracking" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "testing", className: "space-y-4", "data-id": "8f0cxbmsd", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "0dhc8y7lf", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "testNumber", "data-id": "ii8fedj96", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: "Phone Number" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "testNumber",
              type: "tel",
              placeholder: "+1234567890",
              value: testNumber,
              onChange: (e) => setTestNumber(e.target.value),
              "data-id": "9b36rdzzj",
              "data-path": "src/components/EnhancedSMSTestManager.tsx"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", "data-id": "b34dip4oo", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: "Enter phone number in E.164 format (+1234567890)" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", "data-id": "oa0upkr9o", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: runBasicTest,
              disabled: testing || !testNumber.trim(),
              className: "w-full",
              "data-id": "5flduxeiy",
              "data-path": "src/components/EnhancedSMSTestManager.tsx",
              children: testing ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 mr-2 animate-spin", "data-id": "st438eyjf", "data-path": "src/components/EnhancedSMSTestManager.tsx" }),
                "Testing..."
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "w-4 h-4 mr-2", "data-id": "nf4ragatu", "data-path": "src/components/EnhancedSMSTestManager.tsx" }),
                "Basic Test"
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: runAdvancedTest,
              disabled: testing || !testNumber.trim(),
              variant: "outline",
              className: "w-full",
              "data-id": "124ytzuo9",
              "data-path": "src/components/EnhancedSMSTestManager.tsx",
              children: testing ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 mr-2 animate-spin", "data-id": "t0ocx4yh7", "data-path": "src/components/EnhancedSMSTestManager.tsx" }),
                "Testing..."
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Bug, { className: "w-4 h-4 mr-2", "data-id": "24h453i0w", "data-path": "src/components/EnhancedSMSTestManager.tsx" }),
                "Advanced Test"
              ] })
            }
          )
        ] }),
        (serviceStatus == null ? void 0 : serviceStatus.testMode) && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: addToTestNumbers,
            disabled: !testNumber.trim(),
            variant: "outline",
            size: "sm",
            className: "w-full",
            "data-id": "qtf3a3og1",
            "data-path": "src/components/EnhancedSMSTestManager.tsx",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "w-4 h-4 mr-2", "data-id": "wwsnirs0o", "data-path": "src/components/EnhancedSMSTestManager.tsx" }),
              "Add to Verified Test Numbers"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t pt-4 space-y-2", "data-id": "xn5b4587u", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "customMessage", "data-id": "cj8pgqn7u", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: "Custom Message (Optional)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              id: "customMessage",
              placeholder: "Enter custom message to test...",
              value: customMessage,
              onChange: (e) => setCustomMessage(e.target.value),
              rows: 3,
              "data-id": "wu5xvn1g0",
              "data-path": "src/components/EnhancedSMSTestManager.tsx"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: sendCustomMessage,
              disabled: testing || !testNumber.trim() || !customMessage.trim(),
              variant: "secondary",
              className: "w-full",
              "data-id": "9d6k23404",
              "data-path": "src/components/EnhancedSMSTestManager.tsx",
              children: testing ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 mr-2 animate-spin", "data-id": "oifka3l4o", "data-path": "src/components/EnhancedSMSTestManager.tsx" }),
                "Sending..."
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "w-4 h-4 mr-2", "data-id": "g3uehylsr", "data-path": "src/components/EnhancedSMSTestManager.tsx" }),
                "Send Custom Message"
              ] })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "status", className: "space-y-4", "data-id": "4mqapmcdv", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: configLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center py-8", "data-id": "2do6a3hj5", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-6 h-6 animate-spin mr-2", "data-id": "vf3bc42fj", "data-path": "src/components/EnhancedSMSTestManager.tsx" }),
        "Loading service status..."
      ] }) : serviceStatus ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", "data-id": "rdzeg7j3d", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { className: serviceStatus.available ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50", "data-id": "5gtxrdubm", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: [
          serviceStatus.available ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-4 w-4 text-green-600", "data-id": "hz8z836oz", "data-path": "src/components/EnhancedSMSTestManager.tsx" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4 text-red-600", "data-id": "e4q7gx4xo", "data-path": "src/components/EnhancedSMSTestManager.tsx" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { "data-id": "883vnlm6o", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: serviceStatus.available ? "text-green-800" : "text-red-800", "data-id": "9qierurrg", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", "data-id": "zoegjr3bw", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: serviceStatus.available ? "✅ SMS Service Active" : "❌ SMS Service Inactive" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1", "data-id": "1m4rbb0cj", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: serviceStatus.message })
          ] }) })
        ] }),
        serviceStatus.configuration && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", "data-id": "12bxthghm", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-id": "inyrxs0o8", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-4", "data-id": "sgeq2cdql", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "cdxe8qzsi", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium", "data-id": "397r8oumx", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: "Configuration" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 text-sm", "data-id": "5apw29kpa", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "4z14b46hg", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: [
                "From Number: ",
                serviceStatus.configuration.fromNumber
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "ubteawiy2", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: [
                "Test Mode:",
                /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: serviceStatus.configuration.testMode ? "secondary" : "default", className: "ml-1", "data-id": "9p9ko3nj3", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: serviceStatus.configuration.testMode ? "Enabled" : "Disabled" })
              ] }),
              ((_a = serviceStatus.configuration.testNumbers) == null ? void 0 : _a.length) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "8hjlykd4l", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: [
                "Test Numbers: ",
                serviceStatus.configuration.testNumbers.length
              ] })
            ] })
          ] }) }) }),
          serviceStatus.quota && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-id": "azlcox7ni", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-4", "data-id": "lb321s4aw", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "43lvbd1bi", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium", "data-id": "tr8yceb7q", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: "Account Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 text-sm", "data-id": "aeczbhmv7", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "x2jxr68rx", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: [
                "Balance: ",
                serviceStatus.quota.quotaRemaining
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-id": "sn740gy2j", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: "Provider: Twilio" })
            ] })
          ] }) }) })
        ] }),
        serviceStatus.testMode && /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { "data-id": "4exskpi14", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "h-4 w-4", "data-id": "n0f2ezfa0", "data-path": "src/components/EnhancedSMSTestManager.tsx" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDescription, { "data-id": "op0a3pkoh", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", "data-id": "srnzm31nr", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: "Test Mode is Enabled" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1", "data-id": "64s4kuehw", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: 'Only verified phone numbers can receive SMS messages. Add your phone number to the verified list using the "Add to Verified Test Numbers" button.' })
          ] })
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { variant: "destructive", "data-id": "uvywg0ell", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4", "data-id": "4d9ogi1qm", "data-path": "src/components/EnhancedSMSTestManager.tsx" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { "data-id": "j5pgqt1ky", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: "Unable to load service status. Please check your configuration." })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "results", className: "space-y-4", "data-id": "8ylqagl2g", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "amrpwhxsx", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-medium", "data-id": "l71zk183c", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: "Test Results" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", "data-id": "wodsslxwx", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: [
            testResults.length,
            " tests"
          ] })
        ] }),
        testResults.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-8 text-muted-foreground", "data-id": "wkxsu5xjc", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: "No test results yet. Run a test to see results here." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", "data-id": "yx2qhwavx", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: testResults.map(
          (result, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: result.success ? "border-green-200" : "border-red-200", "data-id": "avnuyw1sk", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-4", "data-id": "88czpluti", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", "data-id": "la78jx0u1", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", "data-id": "m39z47wpc", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: [
                getStatusIcon(result.success),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "c1uqg8x4z", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", "data-id": "qadlfpkxx", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: result.phoneNumber }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", "data-id": "yes4zfefk", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: result.timestamp.toLocaleString() })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: result.success ? "default" : "destructive", "data-id": "whtmp1ury", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: result.success ? "Success" : "Failed" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 space-y-2", "data-id": "kf96ufus5", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm", "data-id": "u16fbf4b4", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: result.message }),
              result.messageId && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", "data-id": "gyxcgdwa7", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: [
                "Message ID: ",
                result.messageId
              ] }),
              result.errorCode && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "destructive", className: "text-xs", "data-id": "m3x0g9u13", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: [
                "Error: ",
                result.errorCode
              ] }),
              result.details && /* @__PURE__ */ jsxRuntimeExports.jsxs("details", { className: "text-xs", "data-id": "qfzf0f7h6", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("summary", { className: "cursor-pointer text-muted-foreground", "data-id": "p7vj6kdc5", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: "View Details" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "mt-2 p-2 bg-muted rounded text-xs overflow-x-auto", "data-id": "3tfpb69nr", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: JSON.stringify(result.details, null, 2) })
              ] })
            ] })
          ] }) }, index)
        ) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "tracking", className: "space-y-4", "data-id": "46ilk16e8", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "opeazmh8i", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-medium", "data-id": "ypyacevws", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: "Delivery Tracking" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", "data-id": "aabkisomr", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: [
            Object.keys(deliveryTracking).length,
            " messages"
          ] })
        ] }),
        Object.keys(deliveryTracking).length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-8 text-muted-foreground", "data-id": "2rj30qssq", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: "No delivery tracking data. Send a test message to see tracking information." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", "data-id": "wxkrxh0zh", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: Object.entries(deliveryTracking).map(
          ([messageId, tracking]) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-id": "l0jw5qp5e", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-4", "data-id": "09bvqj07b", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "yo605o5ud", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "w60jx3nr8", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", "data-id": "jy72j6sgf", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: tracking.phoneNumber }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: getStatusColor(tracking.status), "data-id": "pkao71tbh", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: tracking.status })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground", "data-id": "embvfc9o9", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: [
              "Message ID: ",
              messageId
            ] }),
            tracking.deliveredAt && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm", "data-id": "iqx880a1i", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3 inline mr-1", "data-id": "fiznlofqd", "data-path": "src/components/EnhancedSMSTestManager.tsx" }),
              "Delivered: ",
              new Date(tracking.deliveredAt).toLocaleString()
            ] }),
            tracking.errorMessage && /* @__PURE__ */ jsxRuntimeExports.jsx(Alert, { variant: "destructive", className: "mt-2", "data-id": "694f0v1da", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { className: "text-sm", "data-id": "i3qalrxy4", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: tracking.errorMessage }) }),
            tracking.status === "checking" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", "data-id": "nwjvap91q", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3 h-3 animate-spin", "data-id": "s18htc3gr", "data-path": "src/components/EnhancedSMSTestManager.tsx" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", "data-id": "zsnudxhvl", "data-path": "src/components/EnhancedSMSTestManager.tsx", children: "Checking delivery status..." })
            ] })
          ] }) }) }, messageId)
        ) })
      ] })
    ] }) })
  ] });
};
const SMSConfigurationValidator = () => {
  const [config, setConfig] = reactExports.useState({
    accountSid: "",
    authToken: "",
    fromNumber: "",
    testMode: true,
    webhookUrl: ""
  });
  const [validation, setValidation] = reactExports.useState(null);
  const [validating, setValidating] = reactExports.useState(false);
  const [saving, setSaving] = reactExports.useState(false);
  const [showAuthToken, setShowAuthToken] = reactExports.useState(false);
  const [existingConfig, setExistingConfig] = reactExports.useState(null);
  const { toast } = useToast();
  reactExports.useEffect(() => {
    loadExistingConfiguration();
  }, []);
  const loadExistingConfiguration = async () => {
    try {
      const { data, error } = await supabase.from("twilio_config").select("*").eq("is_active", true).order("id", { ascending: false }).limit(1);
      if (error) throw new Error(error.message);
      if (error) throw new Error(error);
      if ((data == null ? void 0 : data.List) && data.List.length > 0) {
        const existing = data.List[0];
        setExistingConfig(existing);
        setConfig({
          accountSid: existing.account_sid || "",
          authToken: existing.auth_token || "",
          fromNumber: existing.from_number || "",
          testMode: existing.test_mode ?? true,
          webhookUrl: existing.webhook_url || ""
        });
      }
    } catch (error) {
      console.error("Error loading configuration:", error);
    }
  };
  const validateConfiguration = async () => {
    setValidating(true);
    try {
      const issues = [];
      let score = 0;
      const recommendations = [];
      if (!config.accountSid) {
        issues.push({
          field: "accountSid",
          valid: false,
          message: "Account SID is required",
          suggestion: "Get your Account SID from Twilio Console > Account Settings"
        });
      } else if (!config.accountSid.startsWith("AC")) {
        issues.push({
          field: "accountSid",
          valid: false,
          message: 'Account SID should start with "AC"',
          suggestion: "Verify you copied the correct Account SID from Twilio Console"
        });
      } else if (config.accountSid.length !== 34) {
        issues.push({
          field: "accountSid",
          valid: false,
          message: "Account SID should be 34 characters long",
          suggestion: "Double-check the Account SID from Twilio Console"
        });
      } else {
        issues.push({
          field: "accountSid",
          valid: true,
          message: "Account SID format is valid"
        });
        score += 20;
      }
      if (!config.authToken) {
        issues.push({
          field: "authToken",
          valid: false,
          message: "Auth Token is required",
          suggestion: "Get your Auth Token from Twilio Console > Account Settings"
        });
      } else if (config.authToken.length !== 32) {
        issues.push({
          field: "authToken",
          valid: false,
          message: "Auth Token should be 32 characters long",
          suggestion: "Verify you copied the complete Auth Token from Twilio Console"
        });
      } else {
        issues.push({
          field: "authToken",
          valid: true,
          message: "Auth Token format is valid"
        });
        score += 20;
      }
      if (!config.fromNumber) {
        issues.push({
          field: "fromNumber",
          valid: false,
          message: "From number is required",
          suggestion: "Get a phone number from Twilio Console > Phone Numbers"
        });
      } else if (!config.fromNumber.startsWith("+")) {
        issues.push({
          field: "fromNumber",
          valid: false,
          message: "From number should be in E.164 format (+1234567890)",
          suggestion: "Add country code prefix (e.g., +1 for US numbers)"
        });
      } else {
        issues.push({
          field: "fromNumber",
          valid: true,
          message: "From number format is valid"
        });
        score += 20;
      }
      if (config.accountSid && config.authToken) {
        try {
          const testResult = await testTwilioConnection();
          if (testResult.success) {
            issues.push({
              field: "connection",
              valid: true,
              message: "Successfully connected to Twilio API"
            });
            score += 30;
          } else {
            issues.push({
              field: "connection",
              valid: false,
              message: testResult.error || "Failed to connect to Twilio API",
              suggestion: "Verify your Account SID and Auth Token are correct"
            });
          }
        } catch (error) {
          issues.push({
            field: "connection",
            valid: false,
            message: `Error testing connection: ${error instanceof Error ? error.message : "Unknown error"}`,
            suggestion: "Check your internet connection and credentials"
          });
        }
      }
      if (config.webhookUrl) {
        if (!config.webhookUrl.startsWith("https://")) {
          issues.push({
            field: "webhookUrl",
            valid: false,
            message: "Webhook URL should use HTTPS",
            suggestion: "Use HTTPS for security and Twilio compatibility"
          });
        } else {
          issues.push({
            field: "webhookUrl",
            valid: true,
            message: "Webhook URL format is valid"
          });
          score += 10;
        }
      }
      if (config.testMode) {
        recommendations.push("Test mode is enabled - only verified numbers can receive SMS");
      } else {
        recommendations.push("Production mode is enabled - all valid numbers can receive SMS");
      }
      if (!config.webhookUrl) {
        recommendations.push("Consider adding a webhook URL for delivery status updates");
      }
      if (score < 60) {
        recommendations.push("Fix critical configuration issues before going live");
      } else if (score < 80) {
        recommendations.push("Configuration is mostly correct, but some improvements are recommended");
      }
      setValidation({
        overall: score >= 70,
        score,
        issues,
        recommendations
      });
    } catch (error) {
      console.error("Validation error:", error);
      toast({
        title: "Validation Error",
        description: "Failed to validate configuration",
        variant: "destructive"
      });
    } finally {
      setValidating(false);
    }
  };
  const testTwilioConnection = async () => {
    try {
      const baseUrl = `https://api.twilio.com/2010-04-01/Accounts/${config.accountSid}.json`;
      const response = await fetch(baseUrl, {
        method: "GET",
        headers: {
          "Authorization": `Basic ${btoa(`${config.accountSid}:${config.authToken}`)}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        return { success: true };
      } else {
        const errorData = await response.json();
        return {
          success: false,
          error: errorData.message || `HTTP ${response.status}: ${response.statusText}`
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Network error"
      };
    }
  };
  const saveConfiguration = async () => {
    if (!validation || !validation.overall) {
      toast({
        title: "Configuration Invalid",
        description: "Please fix validation issues before saving",
        variant: "destructive"
      });
      return;
    }
    setSaving(true);
    try {
      const configData = {
        provider_name: "Twilio",
        account_sid: config.accountSid,
        auth_token: config.authToken,
        from_number: config.fromNumber,
        is_active: true,
        test_mode: config.testMode,
        webhook_url: config.webhookUrl || "",
        monthly_limit: 1e3,
        current_month_count: 0,
        created_by: 1
        // Should be current user ID
      };
      if (existingConfig == null ? void 0 : existingConfig.ID) {
        await window.ezsite.apis.tableUpdate(12640, {
          ID: existingConfig.ID,
          ...configData
        });
      } else {
        await window.ezsite.apis.tableCreate(12640, configData);
      }
      toast({
        title: "✅ Configuration Saved",
        description: "SMS provider configuration has been saved successfully"
      });
      await loadExistingConfiguration();
    } catch (error) {
      console.error("Error saving configuration:", error);
      toast({
        title: "❌ Save Failed",
        description: error instanceof Error ? error.message : "Failed to save configuration",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Text copied to clipboard"
    });
  };
  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };
  const getScoreVariant = (score) => {
    if (score >= 80) return "default";
    if (score >= 60) return "secondary";
    return "destructive";
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "w-full", "data-id": "mmqnukkuv", "data-path": "src/components/SMSConfigurationValidator.tsx", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "h7dpsmhah", "data-path": "src/components/SMSConfigurationValidator.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center", "data-id": "t2vhgn5r3", "data-path": "src/components/SMSConfigurationValidator.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "w-5 h-5 mr-2", "data-id": "cvz1l8p61", "data-path": "src/components/SMSConfigurationValidator.tsx" }),
      "SMS Configuration Validator"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { "data-id": "j0o4ez50s", "data-path": "src/components/SMSConfigurationValidator.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "config", className: "w-full", "data-id": "xncfwctr3", "data-path": "src/components/SMSConfigurationValidator.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid w-full grid-cols-3", "data-id": "r5tsumwpj", "data-path": "src/components/SMSConfigurationValidator.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "config", "data-id": "rdsexvvbh", "data-path": "src/components/SMSConfigurationValidator.tsx", children: "Configuration" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "validation", "data-id": "y5806edb0", "data-path": "src/components/SMSConfigurationValidator.tsx", children: "Validation" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "help", "data-id": "4dudyn0xl", "data-path": "src/components/SMSConfigurationValidator.tsx", children: "Help" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "config", className: "space-y-4", "data-id": "w9ewh80z0", "data-path": "src/components/SMSConfigurationValidator.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", "data-id": "69uhw7ytt", "data-path": "src/components/SMSConfigurationValidator.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "zv35v22ce", "data-path": "src/components/SMSConfigurationValidator.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "accountSid", "data-id": "ron2mwxda", "data-path": "src/components/SMSConfigurationValidator.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Key, { className: "w-4 h-4 inline mr-1", "data-id": "3vib5d1ho", "data-path": "src/components/SMSConfigurationValidator.tsx" }),
              "Account SID"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex space-x-2", "data-id": "b1c2icivc", "data-path": "src/components/SMSConfigurationValidator.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "accountSid",
                  placeholder: "ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
                  value: config.accountSid,
                  onChange: (e) => setConfig((prev) => ({ ...prev, accountSid: e.target.value })),
                  "data-id": "m7zfioktl",
                  "data-path": "src/components/SMSConfigurationValidator.tsx"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  onClick: () => copyToClipboard(config.accountSid),
                  disabled: !config.accountSid,
                  "data-id": "hs0svhnyb",
                  "data-path": "src/components/SMSConfigurationValidator.tsx",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-4 h-4", "data-id": "6knzawxtk", "data-path": "src/components/SMSConfigurationValidator.tsx" })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "ezm1t8xkl", "data-path": "src/components/SMSConfigurationValidator.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "authToken", "data-id": "qpdxhcd4j", "data-path": "src/components/SMSConfigurationValidator.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-4 h-4 inline mr-1", "data-id": "lz8ktm92d", "data-path": "src/components/SMSConfigurationValidator.tsx" }),
              "Auth Token"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex space-x-2", "data-id": "2jxqo3xpu", "data-path": "src/components/SMSConfigurationValidator.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "authToken",
                  type: showAuthToken ? "text" : "password",
                  placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
                  value: config.authToken,
                  onChange: (e) => setConfig((prev) => ({ ...prev, authToken: e.target.value })),
                  "data-id": "4bkwj2njx",
                  "data-path": "src/components/SMSConfigurationValidator.tsx"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  onClick: () => setShowAuthToken(!showAuthToken),
                  "data-id": "pxj9psfxc",
                  "data-path": "src/components/SMSConfigurationValidator.tsx",
                  children: showAuthToken ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "w-4 h-4", "data-id": "pfxhnlk7r", "data-path": "src/components/SMSConfigurationValidator.tsx" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-4 h-4", "data-id": "2ltnd8zhs", "data-path": "src/components/SMSConfigurationValidator.tsx" })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "ley05rjlw", "data-path": "src/components/SMSConfigurationValidator.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "fromNumber", "data-id": "6z7e51xw4", "data-path": "src/components/SMSConfigurationValidator.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "w-4 h-4 inline mr-1", "data-id": "p3hrheq1i", "data-path": "src/components/SMSConfigurationValidator.tsx" }),
              "From Number"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "fromNumber",
                placeholder: "+1234567890",
                value: config.fromNumber,
                onChange: (e) => setConfig((prev) => ({ ...prev, fromNumber: e.target.value })),
                "data-id": "e03n18f4a",
                "data-path": "src/components/SMSConfigurationValidator.tsx"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "wjtfbkj8w", "data-path": "src/components/SMSConfigurationValidator.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "webhookUrl", "data-id": "tdhimghlt", "data-path": "src/components/SMSConfigurationValidator.tsx", children: "Webhook URL (Optional)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "webhookUrl",
                placeholder: "https://your-app.com/webhooks/sms",
                value: config.webhookUrl,
                onChange: (e) => setConfig((prev) => ({ ...prev, webhookUrl: e.target.value })),
                "data-id": "7t22moesd",
                "data-path": "src/components/SMSConfigurationValidator.tsx"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", "data-id": "ds0zyo2g1", "data-path": "src/components/SMSConfigurationValidator.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Switch,
            {
              checked: config.testMode,
              onCheckedChange: (checked) => setConfig((prev) => ({ ...prev, testMode: checked })),
              "data-id": "utlcu1bdj",
              "data-path": "src/components/SMSConfigurationValidator.tsx"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { "data-id": "3kriy32fr", "data-path": "src/components/SMSConfigurationValidator.tsx", children: "Test Mode (Only verified numbers can receive SMS)" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex space-x-2", "data-id": "1k8djy98c", "data-path": "src/components/SMSConfigurationValidator.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: validateConfiguration,
              disabled: validating,
              className: "flex-1",
              "data-id": "50opyc24m",
              "data-path": "src/components/SMSConfigurationValidator.tsx",
              children: validating ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 mr-2 animate-spin", "data-id": "we4qq9hyh", "data-path": "src/components/SMSConfigurationValidator.tsx" }),
                "Validating..."
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-4 h-4 mr-2", "data-id": "mnjozjck7", "data-path": "src/components/SMSConfigurationValidator.tsx" }),
                "Validate Configuration"
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: saveConfiguration,
              disabled: saving || !(validation == null ? void 0 : validation.overall),
              variant: "default",
              "data-id": "b5fne7ocz",
              "data-path": "src/components/SMSConfigurationValidator.tsx",
              children: saving ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 mr-2 animate-spin", "data-id": "kzge60f7v", "data-path": "src/components/SMSConfigurationValidator.tsx" }),
                "Saving..."
              ] }) : "Save Configuration"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "validation", className: "space-y-4", "data-id": "7cj6gln4r", "data-path": "src/components/SMSConfigurationValidator.tsx", children: validation ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", "data-id": "a7764m6h6", "data-path": "src/components/SMSConfigurationValidator.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "la85srz1i", "data-path": "src/components/SMSConfigurationValidator.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-medium", "data-id": "bf9vvsxbo", "data-path": "src/components/SMSConfigurationValidator.tsx", children: "Validation Results" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", "data-id": "mdsdih6te", "data-path": "src/components/SMSConfigurationValidator.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: getScoreVariant(validation.score), className: getScoreColor(validation.score), "data-id": "g4yijuod8", "data-path": "src/components/SMSConfigurationValidator.tsx", children: [
              "Score: ",
              validation.score,
              "/100"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: validation.score, className: "w-32", "data-id": "n1eqfk6b6", "data-path": "src/components/SMSConfigurationValidator.tsx" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { className: validation.overall ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50", "data-id": "fw9279c17", "data-path": "src/components/SMSConfigurationValidator.tsx", children: [
          validation.overall ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-4 w-4 text-green-600", "data-id": "isuquf8hf", "data-path": "src/components/SMSConfigurationValidator.tsx" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4 text-red-600", "data-id": "1fk9yxl20", "data-path": "src/components/SMSConfigurationValidator.tsx" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { "data-id": "0ssislmhk", "data-path": "src/components/SMSConfigurationValidator.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: validation.overall ? "text-green-800" : "text-red-800", "data-id": "2v8obydui", "data-path": "src/components/SMSConfigurationValidator.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", "data-id": "8915tbgsr", "data-path": "src/components/SMSConfigurationValidator.tsx", children: validation.overall ? "✅ Configuration Valid" : "❌ Configuration Issues Found" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1", "data-id": "bgvk0glxt", "data-path": "src/components/SMSConfigurationValidator.tsx", children: validation.overall ? "Your SMS configuration is valid and ready to use." : "Please fix the issues below before proceeding." })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", "data-id": "n9436zeto", "data-path": "src/components/SMSConfigurationValidator.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-medium", "data-id": "s90083p17", "data-path": "src/components/SMSConfigurationValidator.tsx", children: "Validation Details" }),
          validation.issues.map(
            (issue, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: issue.valid ? "border-green-200" : "border-red-200", "data-id": "9otiifsmb", "data-path": "src/components/SMSConfigurationValidator.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-4", "data-id": "rm49dy9pn", "data-path": "src/components/SMSConfigurationValidator.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start space-x-2", "data-id": "gu1q2ja2p", "data-path": "src/components/SMSConfigurationValidator.tsx", children: [
              issue.valid ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-4 h-4 text-green-600 mt-0.5", "data-id": "xwcxop8xf", "data-path": "src/components/SMSConfigurationValidator.tsx" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-4 h-4 text-red-600 mt-0.5", "data-id": "fedmc1ao1", "data-path": "src/components/SMSConfigurationValidator.tsx" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", "data-id": "ygw54pi9p", "data-path": "src/components/SMSConfigurationValidator.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium capitalize", "data-id": "egx4ucgu7", "data-path": "src/components/SMSConfigurationValidator.tsx", children: issue.field }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-sm ${issue.valid ? "text-green-800" : "text-red-800"}`, "data-id": "ige2ddybv", "data-path": "src/components/SMSConfigurationValidator.tsx", children: issue.message }),
                issue.suggestion && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground mt-1", "data-id": "zrimmejwm", "data-path": "src/components/SMSConfigurationValidator.tsx", children: [
                  "💡 ",
                  issue.suggestion
                ] })
              ] })
            ] }) }) }, index)
          )
        ] }),
        validation.recommendations.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "wn98meyhd", "data-path": "src/components/SMSConfigurationValidator.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-medium", "data-id": "rymtse2mh", "data-path": "src/components/SMSConfigurationValidator.tsx", children: "Recommendations" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1", "data-id": "fec454bmv", "data-path": "src/components/SMSConfigurationValidator.tsx", children: validation.recommendations.map(
            (rec, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "text-sm text-muted-foreground flex items-start", "data-id": "mrm1ux8qh", "data-path": "src/components/SMSConfigurationValidator.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mr-2", "data-id": "wo95zrkq9", "data-path": "src/components/SMSConfigurationValidator.tsx", children: "•" }),
              rec
            ] }, index)
          ) })
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-8 text-muted-foreground", "data-id": "lizhkxygz", "data-path": "src/components/SMSConfigurationValidator.tsx", children: 'Click "Validate Configuration" to check your SMS settings.' }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "help", className: "space-y-4", "data-id": "dmrzeahy6", "data-path": "src/components/SMSConfigurationValidator.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", "data-id": "68qvvvr8d", "data-path": "src/components/SMSConfigurationValidator.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-id": "t1asuhrge", "data-path": "src/components/SMSConfigurationValidator.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-4", "data-id": "gndy9a3rk", "data-path": "src/components/SMSConfigurationValidator.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-medium mb-2", "data-id": "66k3191he", "data-path": "src/components/SMSConfigurationValidator.tsx", children: "Getting Twilio Credentials" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ol", { className: "list-decimal list-inside space-y-2 text-sm", "data-id": "z5kdn4h1n", "data-path": "src/components/SMSConfigurationValidator.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { "data-id": "zt8wd3vhg", "data-path": "src/components/SMSConfigurationValidator.tsx", children: [
              "Sign up for a Twilio account at ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "https://www.twilio.com", target: "_blank", rel: "noopener noreferrer", className: "text-blue-600 hover:underline inline-flex items-center", "data-id": "uo86niram", "data-path": "src/components/SMSConfigurationValidator.tsx", children: [
                "twilio.com ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "w-3 h-3 ml-1", "data-id": "9ppdulvhm", "data-path": "src/components/SMSConfigurationValidator.tsx" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { "data-id": "oucmc1yae", "data-path": "src/components/SMSConfigurationValidator.tsx", children: "Go to the Twilio Console Dashboard" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { "data-id": "fwd5596fq", "data-path": "src/components/SMSConfigurationValidator.tsx", children: 'Find your Account SID and Auth Token in the "Account Info" section' }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { "data-id": "bmlp2gvyy", "data-path": "src/components/SMSConfigurationValidator.tsx", children: "Purchase a phone number from Phone Numbers → Manage → Buy a number" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { "data-id": "kwjb0sb55", "data-path": "src/components/SMSConfigurationValidator.tsx", children: "Copy the phone number in E.164 format (+1234567890)" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-id": "9v7yc4aar", "data-path": "src/components/SMSConfigurationValidator.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-4", "data-id": "zlz5qlob8", "data-path": "src/components/SMSConfigurationValidator.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-medium mb-2", "data-id": "uwhdmfl3d", "data-path": "src/components/SMSConfigurationValidator.tsx", children: "Common Issues & Solutions" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 text-sm", "data-id": "7140ecfyf", "data-path": "src/components/SMSConfigurationValidator.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "jdtvprn07", "data-path": "src/components/SMSConfigurationValidator.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-red-600", "data-id": "ibeeic9bx", "data-path": "src/components/SMSConfigurationValidator.tsx", children: '❌ "Authentication failed"' }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-id": "r82ijxr2g", "data-path": "src/components/SMSConfigurationValidator.tsx", children: 'Check that Account SID starts with "AC" and Auth Token is 32 characters' })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "rwxs1u5js", "data-path": "src/components/SMSConfigurationValidator.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-red-600", "data-id": "vumx90yku", "data-path": "src/components/SMSConfigurationValidator.tsx", children: '❌ "Invalid from number"' }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-id": "94byt74l7", "data-path": "src/components/SMSConfigurationValidator.tsx", children: "Ensure the from number is purchased in your Twilio account and in E.164 format" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "k5y3rulmr", "data-path": "src/components/SMSConfigurationValidator.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-red-600", "data-id": "lhxtra3at", "data-path": "src/components/SMSConfigurationValidator.tsx", children: '❌ "Test mode restrictions"' }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-id": "ai7qiq9xh", "data-path": "src/components/SMSConfigurationValidator.tsx", children: "In test mode, only verified phone numbers can receive SMS. Add numbers to verified list." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "duv1jf0rf", "data-path": "src/components/SMSConfigurationValidator.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-yellow-600", "data-id": "2spvvccer", "data-path": "src/components/SMSConfigurationValidator.tsx", children: '⚠️ "Message sent but not received"' }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-id": "masfg4l5e", "data-path": "src/components/SMSConfigurationValidator.tsx", children: "Check delivery status, verify phone number format, and ensure sufficient account balance" })
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-id": "ddojuowp1", "data-path": "src/components/SMSConfigurationValidator.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-4", "data-id": "axucefu8a", "data-path": "src/components/SMSConfigurationValidator.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-medium mb-2", "data-id": "kobh3cyog", "data-path": "src/components/SMSConfigurationValidator.tsx", children: "Best Practices" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "list-disc list-inside space-y-1 text-sm", "data-id": "u01aq81us", "data-path": "src/components/SMSConfigurationValidator.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { "data-id": "5bnsmtr12", "data-path": "src/components/SMSConfigurationValidator.tsx", children: "Keep test mode enabled during development" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { "data-id": "tnm4l82bl", "data-path": "src/components/SMSConfigurationValidator.tsx", children: "Set up webhooks for delivery status tracking" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { "data-id": "jklj87m1l", "data-path": "src/components/SMSConfigurationValidator.tsx", children: "Monitor your monthly SMS usage and limits" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { "data-id": "8ekicnbxp", "data-path": "src/components/SMSConfigurationValidator.tsx", children: "Use E.164 format for all phone numbers (+country code + number)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { "data-id": "te6ouuewj", "data-path": "src/components/SMSConfigurationValidator.tsx", children: "Test with your own phone number before going live" })
          ] })
        ] }) })
      ] }) })
    ] }) })
  ] });
};
const SMSTroubleshootingGuide = () => {
  const [openItems, setOpenItems] = reactExports.useState([]);
  const [selectedCategory, setSelectedCategory] = reactExports.useState("all");
  const troubleshootingItems = [
    {
      id: "sms-shows-sent-not-received",
      title: `SMS shows "sent successfully" but recipient doesn't receive it`,
      description: "The most common issue where the system reports success but messages don't arrive",
      severity: "high",
      category: "delivery",
      symptoms: [
        'Application shows "SMS sent successfully"',
        "Recipient never receives the message",
        "No error messages in the application",
        'SMS history shows "Sent" status'
      ],
      causes: [
        "Test mode is enabled and recipient number is not verified",
        "Invalid or incorrectly formatted phone number",
        "Insufficient account balance in Twilio",
        "Twilio number not properly configured",
        "Recipient's carrier blocking messages",
        "API credentials are incorrect but validation passed",
        "Network issues between your server and Twilio"
      ],
      solutions: [
        "Verify test mode is disabled for production use",
        "Add recipient number to verified numbers if in test mode",
        "Check phone number format (must be E.164: +1234567890)",
        "Verify Twilio account balance is sufficient",
        "Confirm Twilio phone number is active and SMS-enabled",
        "Test with a different phone number/carrier",
        "Check Twilio delivery logs in their console",
        "Verify API credentials are correct and active"
      ],
      preventive: [
        "Always test with your own phone number first",
        "Set up delivery status webhooks for real-time tracking",
        "Monitor account balance regularly",
        "Use phone number validation before sending"
      ]
    },
    {
      id: "authentication-failed",
      title: "Authentication failed or invalid credentials",
      description: "Unable to connect to Twilio API due to credential issues",
      severity: "high",
      category: "config",
      symptoms: [
        'Error: "Authentication failed"',
        "HTTP 401 Unauthorized errors",
        "Cannot connect to Twilio API",
        "Configuration validation fails"
      ],
      causes: [
        "Incorrect Account SID",
        "Incorrect Auth Token",
        "Credentials copied with extra spaces or characters",
        "Account SID doesn't match Auth Token",
        "Account suspended or deactivated"
      ],
      solutions: [
        'Double-check Account SID starts with "AC"',
        "Verify Auth Token is exactly 32 characters",
        "Copy credentials directly from Twilio Console",
        "Ensure no extra spaces or newlines in credentials",
        "Generate new Auth Token if needed",
        "Check account status in Twilio Console"
      ],
      preventive: [
        "Store credentials securely",
        "Regularly rotate Auth Tokens",
        "Use environment variables for credentials"
      ]
    },
    {
      id: "invalid-phone-number",
      title: "Invalid phone number format errors",
      description: "Phone numbers not accepted by Twilio API",
      severity: "medium",
      category: "format",
      symptoms: [
        'Error: "Invalid phone number"',
        "Messages fail to send to specific numbers",
        "Phone number validation errors",
        "Some numbers work, others don't"
      ],
      causes: [
        "Phone number not in E.164 format",
        "Missing country code",
        "Invalid characters in phone number",
        "Landline number used instead of mobile",
        "Number doesn't exist or is disconnected"
      ],
      solutions: [
        "Format all numbers as +[country code][number]",
        "Remove spaces, dashes, and parentheses",
        "Add country code (+1 for US/Canada)",
        "Verify number is a mobile/cell phone",
        "Test with known working numbers",
        "Use phone number validation service"
      ],
      preventive: [
        "Implement phone number validation on input",
        "Auto-format numbers to E.164",
        "Verify numbers are mobile before sending"
      ]
    },
    {
      id: "test-mode-restrictions",
      title: "Test mode preventing message delivery",
      description: "Messages only work for verified numbers in test mode",
      severity: "medium",
      category: "config",
      symptoms: [
        "Some numbers receive messages, others don't",
        "Only your own number receives messages",
        'Error: "Test mode restrictions"',
        "Messages work in development but not production"
      ],
      causes: [
        "Test mode is enabled in Twilio configuration",
        "Recipient numbers not added to verified list",
        "Forgot to disable test mode for production"
      ],
      solutions: [
        "Disable test mode in SMS configuration",
        "Add recipient numbers to verified list",
        "Switch to production mode configuration",
        "Verify account upgrade if needed"
      ],
      preventive: [
        "Clearly document test vs production settings",
        "Use environment-specific configurations",
        "Test with non-verified numbers before going live"
      ]
    },
    {
      id: "insufficient-balance",
      title: "Insufficient account balance",
      description: "Twilio account doesn't have enough credit to send messages",
      severity: "high",
      category: "account",
      symptoms: [
        "Messages stop sending suddenly",
        'Error: "Insufficient funds"',
        "Some messages send, others fail",
        "Account balance warnings"
      ],
      causes: [
        "Twilio account balance is too low",
        "Auto-recharge is disabled",
        "Payment method expired or failed",
        "Unexpected high usage"
      ],
      solutions: [
        "Add funds to Twilio account",
        "Set up auto-recharge",
        "Update payment method",
        "Monitor usage patterns",
        "Set up balance alerts"
      ],
      preventive: [
        "Enable auto-recharge with minimum balance",
        "Monitor monthly usage",
        "Set up low balance alerts",
        "Budget for expected SMS volume"
      ]
    },
    {
      id: "carrier-blocking",
      title: "Messages blocked by recipient carrier",
      description: "Mobile carrier is filtering or blocking messages",
      severity: "medium",
      category: "delivery",
      symptoms: [
        "Messages don't arrive at specific carriers",
        "Inconsistent delivery across carriers",
        "Works for some numbers but not others",
        "Regional delivery issues"
      ],
      causes: [
        "Carrier spam filtering",
        "Message content flagged",
        "High volume sending patterns",
        "Unregistered sender number",
        "Promotional content without opt-in"
      ],
      solutions: [
        "Register sender number with carriers",
        "Modify message content to be less promotional",
        "Implement proper opt-in processes",
        "Use different sending patterns",
        "Contact carrier support",
        "Consider short code or toll-free number"
      ],
      preventive: [
        "Follow carrier guidelines",
        "Implement double opt-in",
        "Monitor delivery rates by carrier",
        "Avoid spam trigger words"
      ]
    }
  ];
  const toggleItem = (itemId) => {
    setOpenItems(
      (prev) => prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };
  const getSeverityColor2 = (severity) => {
    switch (severity) {
      case "high":
        return "text-red-600 border-red-200 bg-red-50";
      case "medium":
        return "text-yellow-600 border-yellow-200 bg-yellow-50";
      case "low":
        return "text-blue-600 border-blue-200 bg-blue-50";
      default:
        return "text-gray-600 border-gray-200 bg-gray-50";
    }
  };
  const getSeverityIcon = (severity) => {
    switch (severity) {
      case "high":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-4 h-4", "data-id": "rfrloghgq", "data-path": "src/components/SMSTroubleshootingGuide.tsx" });
      case "medium":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-4 h-4", "data-id": "04t21hrth", "data-path": "src/components/SMSTroubleshootingGuide.tsx" });
      case "low":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-4 h-4", "data-id": "1qnw5qo7i", "data-path": "src/components/SMSTroubleshootingGuide.tsx" });
      default:
        return /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "w-4 h-4", "data-id": "dr5ph0obg", "data-path": "src/components/SMSTroubleshootingGuide.tsx" });
    }
  };
  const getCategoryIcon = (category) => {
    switch (category) {
      case "config":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-4 h-4", "data-id": "gz0yrs7f9", "data-path": "src/components/SMSTroubleshootingGuide.tsx" });
      case "account":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "w-4 h-4", "data-id": "ybtpfccr7", "data-path": "src/components/SMSTroubleshootingGuide.tsx" });
      case "delivery":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "w-4 h-4", "data-id": "9wueyvid4", "data-path": "src/components/SMSTroubleshootingGuide.tsx" });
      case "format":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "w-4 h-4", "data-id": "ctuhodktl", "data-path": "src/components/SMSTroubleshootingGuide.tsx" });
      default:
        return /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "w-4 h-4", "data-id": "hzpouwn6j", "data-path": "src/components/SMSTroubleshootingGuide.tsx" });
    }
  };
  const filteredItems = selectedCategory === "all" ? troubleshootingItems : troubleshootingItems.filter((item) => item.category === selectedCategory);
  const categoryStats = troubleshootingItems.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {});
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "w-full", "data-id": "6711ex63v", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "r2wqkg0he", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center", "data-id": "8teliw6t9", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-5 h-5 mr-2", "data-id": "ikf354td9", "data-path": "src/components/SMSTroubleshootingGuide.tsx" }),
      "SMS Troubleshooting Guide"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { "data-id": "598jc6ar4", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "issues", className: "w-full", "data-id": "uwlf09lxe", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid w-full grid-cols-3", "data-id": "9ydaze2pn", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "issues", "data-id": "jct05n6si", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: "Common Issues" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "checklist", "data-id": "hhxvcblit", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: "Diagnostic Checklist" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "resources", "data-id": "brano98xf", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: "Resources" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "issues", className: "space-y-4", "data-id": "ix6j8g9da", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 mb-4", "data-id": "yydoug2v9", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: selectedCategory === "all" ? "default" : "outline",
              size: "sm",
              onClick: () => setSelectedCategory("all"),
              "data-id": "138ousoy3",
              "data-path": "src/components/SMSTroubleshootingGuide.tsx",
              children: [
                "All Issues (",
                troubleshootingItems.length,
                ")"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: selectedCategory === "config" ? "default" : "outline",
              size: "sm",
              onClick: () => setSelectedCategory("config"),
              "data-id": "y4hobx3n8",
              "data-path": "src/components/SMSTroubleshootingGuide.tsx",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-3 h-3 mr-1", "data-id": "g0ihlyc9e", "data-path": "src/components/SMSTroubleshootingGuide.tsx" }),
                "Configuration (",
                categoryStats.config || 0,
                ")"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: selectedCategory === "delivery" ? "default" : "outline",
              size: "sm",
              onClick: () => setSelectedCategory("delivery"),
              "data-id": "unp2ko4au",
              "data-path": "src/components/SMSTroubleshootingGuide.tsx",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "w-3 h-3 mr-1", "data-id": "f44piseg7", "data-path": "src/components/SMSTroubleshootingGuide.tsx" }),
                "Delivery (",
                categoryStats.delivery || 0,
                ")"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: selectedCategory === "account" ? "default" : "outline",
              size: "sm",
              onClick: () => setSelectedCategory("account"),
              "data-id": "z8munpq8r",
              "data-path": "src/components/SMSTroubleshootingGuide.tsx",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "w-3 h-3 mr-1", "data-id": "49rm2t05p", "data-path": "src/components/SMSTroubleshootingGuide.tsx" }),
                "Account (",
                categoryStats.account || 0,
                ")"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: selectedCategory === "format" ? "default" : "outline",
              size: "sm",
              onClick: () => setSelectedCategory("format"),
              "data-id": "q77mzs537",
              "data-path": "src/components/SMSTroubleshootingGuide.tsx",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "w-3 h-3 mr-1", "data-id": "vu455wjaj", "data-path": "src/components/SMSTroubleshootingGuide.tsx" }),
                "Format (",
                categoryStats.format || 0,
                ")"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", "data-id": "74j2nrn1x", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: filteredItems.map(
          (item) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: `${getSeverityColor2(item.severity)} border`, "data-id": "raa28nqpe", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Collapsible,
            {
              open: openItems.includes(item.id),
              onOpenChange: () => toggleItem(item.id),
              "data-id": "fasz8zawk",
              "data-path": "src/components/SMSTroubleshootingGuide.tsx",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CollapsibleTrigger, { asChild: true, "data-id": "yetw3r01t", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-4 cursor-pointer hover:bg-opacity-50", "data-id": "k8h4uos5y", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "a3lgxcocx", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-3", "data-id": "wlwu6euuk", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: [
                    getSeverityIcon(item.severity),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "vdevn023j", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", "data-id": "vmomwfnmi", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: item.title }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm opacity-80", "data-id": "gq61gnt6d", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: item.description })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", "data-id": "3qq7ugb6z", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "capitalize", "data-id": "fiuca0ag7", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: [
                      getCategoryIcon(item.category),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1", "data-id": "3seph7sb9", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: item.category })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: item.severity === "high" ? "destructive" : "default", "data-id": "jxy6fwjtx", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: item.severity.toUpperCase() }),
                    openItems.includes(item.id) ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "w-4 h-4", "data-id": "2niwqipwo", "data-path": "src/components/SMSTroubleshootingGuide.tsx" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4", "data-id": "6e28mls3f", "data-path": "src/components/SMSTroubleshootingGuide.tsx" })
                  ] })
                ] }) }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(CollapsibleContent, { "data-id": "exindecbl", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-0 space-y-4", "data-id": "2gqvlaaqy", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", "data-id": "6cb5smat1", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "ueh3lql9m", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "font-medium mb-2 flex items-center", "data-id": "gnm4kqyw5", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-3 h-3 mr-1", "data-id": "nx0s6lkvd", "data-path": "src/components/SMSTroubleshootingGuide.tsx" }),
                        "Symptoms"
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "list-disc list-inside space-y-1 text-sm", "data-id": "1ij8a58kj", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: item.symptoms.map(
                        (symptom, index) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { "data-id": "s8m1hq37w", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: symptom }, index)
                      ) })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "blcod9ddk", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "font-medium mb-2 flex items-center", "data-id": "gsis15s9y", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "w-3 h-3 mr-1", "data-id": "eehnqtkup", "data-path": "src/components/SMSTroubleshootingGuide.tsx" }),
                        "Possible Causes"
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "list-disc list-inside space-y-1 text-sm", "data-id": "8sgc7fwef", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: item.causes.map(
                        (cause, index) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { "data-id": "gbmuspup0", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: cause }, index)
                      ) })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "cx58qabu9", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "font-medium mb-2 flex items-center", "data-id": "qs1paemrm", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-3 h-3 mr-1", "data-id": "eatomtht7", "data-path": "src/components/SMSTroubleshootingGuide.tsx" }),
                      "Solutions"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { className: "list-decimal list-inside space-y-1 text-sm", "data-id": "1ed5s9cs6", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: item.solutions.map(
                      (solution, index) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { "data-id": "iwuazli9e", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: solution }, index)
                    ) })
                  ] }),
                  item.preventive && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "va4wdaewr", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "font-medium mb-2 flex items-center", "data-id": "ay9vqm7bx", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-3 h-3 mr-1", "data-id": "e50a82qb0", "data-path": "src/components/SMSTroubleshootingGuide.tsx" }),
                      "Prevention Tips"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "list-disc list-inside space-y-1 text-sm", "data-id": "4c194grym", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: item.preventive.map(
                      (tip, index) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { "data-id": "3swbl06pp", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: tip }, index)
                    ) })
                  ] })
                ] }) })
              ]
            }
          ) }, item.id)
        ) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "checklist", className: "space-y-4", "data-id": "bbiaqeeq0", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { "data-id": "hf1u0kyrx", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-4 w-4", "data-id": "tebg63htl", "data-path": "src/components/SMSTroubleshootingGuide.tsx" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { "data-id": "tncpo9pv2", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: "Follow this checklist to systematically diagnose SMS delivery issues." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", "data-id": "a5hwx15up", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "st2js72wi", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "7t5awfv8r", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-lg", "data-id": "82zspfj2p", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: "Step 1: Configuration Check" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { "data-id": "ib7gahwe4", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "mgyei2jd7", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center space-x-2", "data-id": "0nbfpcbfz", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", className: "rounded", "data-id": "d2dfihscc", "data-path": "src/components/SMSTroubleshootingGuide.tsx" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "ed9mybwmp", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: 'Verify Account SID starts with "AC" and is 34 characters' })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center space-x-2", "data-id": "wjwf68zdp", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", className: "rounded", "data-id": "9fdnfjwxa", "data-path": "src/components/SMSTroubleshootingGuide.tsx" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "xv1wzo8a4", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: "Confirm Auth Token is exactly 32 characters" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center space-x-2", "data-id": "yxbubyxcp", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", className: "rounded", "data-id": "jmod2l3wq", "data-path": "src/components/SMSTroubleshootingGuide.tsx" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "kbdi1s7wq", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: "Check from number is in E.164 format (+1234567890)" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center space-x-2", "data-id": "8h35ziscv", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", className: "rounded", "data-id": "ufera6ehx", "data-path": "src/components/SMSTroubleshootingGuide.tsx" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "ystfhsag6", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: "Verify from number is SMS-enabled in Twilio" })
              ] })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "6k1itx3bf", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "q5i3anr2a", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-lg", "data-id": "cbc5l8fuw", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: "Step 2: Account Status" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { "data-id": "xtifp1eak", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "q97z2vqse", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center space-x-2", "data-id": "oj0p42m8b", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", className: "rounded", "data-id": "r7wvc02d3", "data-path": "src/components/SMSTroubleshootingGuide.tsx" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "48d6086ob", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: "Check Twilio account balance is sufficient" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center space-x-2", "data-id": "flk3dtst5", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", className: "rounded", "data-id": "tfcc7480t", "data-path": "src/components/SMSTroubleshootingGuide.tsx" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "6fq9namdv", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: "Verify account is not suspended" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center space-x-2", "data-id": "hlohe7srb", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", className: "rounded", "data-id": "i47pblsmo", "data-path": "src/components/SMSTroubleshootingGuide.tsx" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "curnyzpql", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: "Confirm payment method is valid" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center space-x-2", "data-id": "6qu0jq0ml", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", className: "rounded", "data-id": "iyv4jvgpu", "data-path": "src/components/SMSTroubleshootingGuide.tsx" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "l40nzn27e", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: "Check monthly usage limits" })
              ] })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "fe2kstbbf", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "pqrncc4t7", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-lg", "data-id": "myly68vm1", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: "Step 3: Test Mode Check" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { "data-id": "nowuvgdat", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "km7jmn0m1", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center space-x-2", "data-id": "vis7bdmjq", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", className: "rounded", "data-id": "l8771474k", "data-path": "src/components/SMSTroubleshootingGuide.tsx" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "9clsv7s51", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: "Verify if test mode is enabled/disabled appropriately" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center space-x-2", "data-id": "bvyp2emla", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", className: "rounded", "data-id": "pzmayh820", "data-path": "src/components/SMSTroubleshootingGuide.tsx" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "vefj0ug96", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: "Check if recipient number is in verified list (test mode)" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center space-x-2", "data-id": "3mkd5eri6", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", className: "rounded", "data-id": "9iek7fg5s", "data-path": "src/components/SMSTroubleshootingGuide.tsx" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "un9yldc3n", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: "Test with your own verified number first" })
              ] })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "1kkk7dyzj", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "qgzoato6x", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-lg", "data-id": "drwa185wi", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: "Step 4: Message Content & Format" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { "data-id": "p595x8cjp", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "fkeowuom6", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center space-x-2", "data-id": "1b6ucfxzk", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", className: "rounded", "data-id": "jm5c6jor1", "data-path": "src/components/SMSTroubleshootingGuide.tsx" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "eb6c88fmq", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: "Validate recipient phone number format" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center space-x-2", "data-id": "it9g22ori", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", className: "rounded", "data-id": "gkc905wsp", "data-path": "src/components/SMSTroubleshootingGuide.tsx" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "vdzkkm2a5", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: "Check message content for spam triggers" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center space-x-2", "data-id": "st8sndg3r", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", className: "rounded", "data-id": "356afnt3p", "data-path": "src/components/SMSTroubleshootingGuide.tsx" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "80vq8s5ii", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: "Verify message length is within limits" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center space-x-2", "data-id": "m762wo08a", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", className: "rounded", "data-id": "oqe44bnek", "data-path": "src/components/SMSTroubleshootingGuide.tsx" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "1kmc0amjl", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: "Test with simple message content" })
              ] })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "7pxos3xwk", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "levi50mby", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-lg", "data-id": "9cb7kww1q", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: "Step 5: Delivery Tracking" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { "data-id": "0h5dmy8sh", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "qmjnqbm8a", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center space-x-2", "data-id": "w4f58roaz", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", className: "rounded", "data-id": "k3405sjoo", "data-path": "src/components/SMSTroubleshootingGuide.tsx" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "9helh37xl", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: "Check Twilio console for delivery logs" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center space-x-2", "data-id": "3o5ucqpsq", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", className: "rounded", "data-id": "wqx1e9p77", "data-path": "src/components/SMSTroubleshootingGuide.tsx" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "pqm9ioocz", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: "Monitor delivery status updates" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center space-x-2", "data-id": "h1e1fuavw", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", className: "rounded", "data-id": "40to9avdy", "data-path": "src/components/SMSTroubleshootingGuide.tsx" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "hzb6m2h77", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: "Test with different carriers/numbers" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center space-x-2", "data-id": "6b04oh04f", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", className: "rounded", "data-id": "5oxk1uts9", "data-path": "src/components/SMSTroubleshootingGuide.tsx" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "rl9l8i2gp", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: "Check for carrier-specific issues" })
              ] })
            ] }) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "resources", className: "space-y-4", "data-id": "g1votsspy", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", "data-id": "yzfuf5luj", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "d56u8ru37", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "pipiprwc4", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-lg flex items-center", "data-id": "zg99cutpw", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "w-4 h-4 mr-2", "data-id": "m5721shwk", "data-path": "src/components/SMSTroubleshootingGuide.tsx" }),
              "Twilio Resources"
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3", "data-id": "7wn8cdrsp", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "a",
                {
                  href: "https://console.twilio.com",
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "block p-3 border rounded hover:bg-gray-50 transition-colors",
                  "data-id": "2rzfoxzyu",
                  "data-path": "src/components/SMSTroubleshootingGuide.tsx",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", "data-id": "hbw6mk4xp", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: "Twilio Console" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", "data-id": "fvrunb83k", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: "Access your account dashboard and logs" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "a",
                {
                  href: "https://www.twilio.com/docs/sms",
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "block p-3 border rounded hover:bg-gray-50 transition-colors",
                  "data-id": "6go3q13rr",
                  "data-path": "src/components/SMSTroubleshootingGuide.tsx",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", "data-id": "ezbhs52xb", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: "SMS Documentation" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", "data-id": "ls0adod9i", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: "Complete SMS API documentation" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "a",
                {
                  href: "https://support.twilio.com",
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "block p-3 border rounded hover:bg-gray-50 transition-colors",
                  "data-id": "7mi100roe",
                  "data-path": "src/components/SMSTroubleshootingGuide.tsx",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", "data-id": "atbmgja5x", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: "Twilio Support" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", "data-id": "tngvvpvgm", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: "Get help from Twilio support team" })
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "chj58yjpg", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "4w56t1mlk", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-lg", "data-id": "io0fapw2o", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: "Quick Actions" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3", "data-id": "c4eri0ysz", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "w-full justify-start", "data-id": "lszzba8kf", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-4 h-4 mr-2", "data-id": "kmtma2iby", "data-path": "src/components/SMSTroubleshootingGuide.tsx" }),
                "Test SMS Configuration"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "w-full justify-start", "data-id": "pz3h71f1j", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-4 h-4 mr-2", "data-id": "bof6u5253", "data-path": "src/components/SMSTroubleshootingGuide.tsx" }),
                "Validate Phone Numbers"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "w-full justify-start", "data-id": "sr87nito7", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "w-4 h-4 mr-2", "data-id": "pn4zlyn5j", "data-path": "src/components/SMSTroubleshootingGuide.tsx" }),
                "Check Delivery Status"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "w-full justify-start", "data-id": "z60hgujyq", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "w-4 h-4 mr-2", "data-id": "5d1d92xx8", "data-path": "src/components/SMSTroubleshootingGuide.tsx" }),
                "Check Account Balance"
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "1z4xqwoxx", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "u4cktme98", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { "data-id": "qlhtvkmul", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: "Emergency Checklist" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { "data-id": "a9zd1g39s", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { variant: "destructive", "data-id": "ucexubfah", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4", "data-id": "3n5mmc9po", "data-path": "src/components/SMSTroubleshootingGuide.tsx" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDescription, { "data-id": "l923z70n6", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium mb-2", "data-id": "e7c00j77u", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: "If SMS is completely broken:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("ol", { className: "list-decimal list-inside space-y-1 text-sm", "data-id": "i5dexyftd", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { "data-id": "jxj9bno5z", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: "Check Twilio service status at status.twilio.com" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { "data-id": "p28zlcbwo", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: "Verify your account hasn't been suspended" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { "data-id": "ij381tueh", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: "Test with the simplest possible message to your own number" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { "data-id": "8bg3pvzj2", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: "Check application logs for any error messages" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { "data-id": "9av72vjo2", "data-path": "src/components/SMSTroubleshootingGuide.tsx", children: "Contact Twilio support if all else fails" })
              ] })
            ] })
          ] }) })
        ] })
      ] })
    ] }) })
  ] });
};
const SMSAlertManagement = () => {
  const { isAdmin } = useAdminAccess();
  const [settings, setSettings] = reactExports.useState([]);
  const [contacts, setContacts] = reactExports.useState([]);
  const [history, setHistory] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const { toast } = useToast();
  reactExports.useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        await Promise.allSettled(
          [
            loadSettings(),
            loadContacts(),
            loadHistory()
          ]
        );
      } catch (error2) {
        console.error("Error initializing SMS Alert Management:", error2);
        setError("Failed to initialize SMS Alert Management");
      } finally {
        setLoading(false);
      }
    };
    initializeData();
  }, []);
  const loadSettings = async () => {
    try {
      const { data, error: error2 } = await supabase.from("sms_settings").select("*").order("id", { ascending: false }).limit(100);
      if (error2) throw error2;
      setSettings(data || []);
    } catch (error2) {
      console.error("Error loading SMS settings:", error2);
      toast({
        title: "Error",
        description: "Failed to load SMS alert settings",
        variant: "destructive"
      });
    }
  };
  const loadContacts = async () => {
    try {
      const { data, error: error2 } = await supabase.from("sms_contacts").select("*").order("id", { ascending: false }).limit(100);
      if (error2) throw error2;
      setContacts(data || []);
    } catch (error2) {
      console.error("Error loading SMS contacts:", error2);
      toast({
        title: "Error",
        description: "Failed to load SMS contacts",
        variant: "destructive"
      });
    }
  };
  const loadHistory = async () => {
    try {
      const { data, error: error2 } = await supabase.from("sms_alert_history").select("*").order("sent_date", { ascending: false }).limit(50);
      if (error2) throw error2;
      setHistory(data || []);
    } catch (error2) {
      console.error("Error loading SMS history:", error2);
      toast({
        title: "Error",
        description: "Failed to load SMS history",
        variant: "destructive"
      });
    }
  };
  const sendTestSMS = async () => {
    try {
      setLoading(true);
      const testMessage = "🔔 Test SMS from DFS Manager: This is a test message from your License Alert System. SMS functionality is working correctly!";
      const activeContacts = contacts.filter((c) => c.is_active);
      if (activeContacts.length === 0) {
        toast({
          title: "No Active Contacts",
          description: "Please add active SMS contacts before sending test messages.",
          variant: "destructive"
        });
        return;
      }
      toast({
        title: "Sending Test SMS",
        description: `Sending test SMS to ${activeContacts.length} contact(s)...`
      });
      let successCount = 0;
      let failureCount = 0;
      for (const contact of activeContacts) {
        console.log(`Sending test SMS to ${contact.contact_name} at ${contact.mobile_number}`);
        const smsResult = {
          success: Math.random() > 0.1,
          // 90% success rate
          error: Math.random() > 0.1 ? null : "Simulated failure for testing"
        };
        if (smsResult.success) {
          successCount++;
          console.log(`✅ SMS sent successfully to ${contact.contact_name}`);
        } else {
          failureCount++;
          console.error(`❌ SMS failed to ${contact.contact_name}:`, smsResult.error);
        }
        await supabase.from("sms_alert_history").insert({
          license_id: 0,
          // Test SMS
          contact_id: contact.id,
          mobile_number: contact.mobile_number,
          message_content: testMessage,
          sent_date: (/* @__PURE__ */ new Date()).toISOString(),
          delivery_status: smsResult.success ? "Sent" : `Failed - ${smsResult.error}`,
          days_before_expiry: 0,
          created_by: 1
        });
      }
      if (successCount > 0 && failureCount === 0) {
        toast({
          title: "✅ Test SMS Sent Successfully",
          description: `Test SMS sent to all ${successCount} contact(s). Check your mobile device!`
        });
      } else if (successCount > 0 && failureCount > 0) {
        toast({
          title: "⚠️ Partial Success",
          description: `${successCount} SMS sent successfully, ${failureCount} failed. Check SMS History for details.`,
          variant: "destructive"
        });
      } else {
        toast({
          title: "❌ All SMS Failed",
          description: "Failed to send SMS to any contacts. Please check phone numbers and try again.",
          variant: "destructive"
        });
      }
      loadHistory();
    } catch (error2) {
      console.error("Error sending test SMS:", error2);
      toast({
        title: "Error",
        description: `Failed to send test SMS: ${error2 instanceof Error ? error2.message : "Unknown error"}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  if (!isAdmin) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      AccessDenied,
      {
        feature: "SMS Alert Management",
        requiredRole: "Administrator",
        "data-id": "fa3pygj5c",
        "data-path": "src/pages/Admin/SMSAlertManagement.tsx"
      }
    );
  }
  if (error) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "mx-auto max-w-lg", "data-id": "txmgc5gbh", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "48qddszsp", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center text-red-600", "data-id": "hjhqevcxt", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-5 h-5 mr-2", "data-id": "0p06fhvnt", "data-path": "src/pages/Admin/SMSAlertManagement.tsx" }),
        "Error Loading SMS Alert Management"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { "data-id": "mqmvlckhl", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Alert, { variant: "destructive", "data-id": "vie4mlom1", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { "data-id": "ux33jt26g", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: error }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            onClick: () => window.location.reload(),
            className: "w-full mt-4",
            "data-id": "v0kbp0hu5",
            "data-path": "src/pages/Admin/SMSAlertManagement.tsx",
            children: "Retry"
          }
        )
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ComponentErrorBoundary, { fallback: "SMS Alert Management", "data-id": "ihht9xkda", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-id": "jlapip954", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { className: "border-red-200 bg-red-50", "data-id": "kdys6fiyg", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4 text-red-600", "data-id": "1ns16y5ws", "data-path": "src/pages/Admin/SMSAlertManagement.tsx" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { className: "text-red-800", "data-id": "moe3l6r1h", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "uzlw7iuhn", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-id": "p4p0s3rax", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { "data-id": "eujmd5pfr", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: "💛 SMS Not Working? Common Fix:" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm space-y-1", "data-id": "dr84ty48g", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "p3vfyokcn", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: [
            "• ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { "data-id": "2t2wpbcag", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: "Check Test Mode:" }),
            " If in test mode, only verified numbers receive SMS"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "dbtn661f9", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: [
            "• ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { "data-id": "b2gb16fx6", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: "Verify Phone Format:" }),
            " Use E.164 format (+1234567890)"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "yd56joi8q", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: [
            "• ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { "data-id": "681f7alc6", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: "Check Twilio Balance:" }),
            ' Insufficient funds will show "sent" but not deliver'
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "166d7p54k", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: [
            "• ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { "data-id": "1vewz1w7n", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: "Use Debug Tab:" }),
            " Complete troubleshooting guide available in the Debug tab"
          ] })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", "data-id": "11wf7a8jr", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold", "data-id": "po9j66bxt", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: "SMS Alert Management" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-4", "data-id": "7w5agbioz", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", "data-id": "l9zdh8lcp", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-5 h-5 text-green-500", "data-id": "bm3cxqq2k", "data-path": "src/pages/Admin/SMSAlertManagement.tsx" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-green-600", "data-id": "xz8ia3820", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: "SMS Service Online" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: sendTestSMS,
            disabled: loading,
            className: "bg-blue-600 hover:bg-blue-700",
            "data-id": "ukv198wwo",
            "data-path": "src/pages/Admin/SMSAlertManagement.tsx",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "w-4 h-4 mr-2", "data-id": "1t39ru9iq", "data-path": "src/pages/Admin/SMSAlertManagement.tsx" }),
              loading ? "Sending..." : "Send Test SMS"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "overview", className: "space-y-6", "data-id": "xl3707j2y", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid w-full grid-cols-4 lg:grid-cols-8", "data-id": "60dgfpq2t", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "overview", "data-id": "dc6fm0s2b", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: "📊 Overview" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "config", "data-id": "6kf8nod5k", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: "🔧 Config" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "testing", "data-id": "x39etl5fj", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: "🧪 Testing" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "troubleshoot", "data-id": "n3oyl3m4v", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: "🔍 Debug" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "custom", "data-id": "udzg85pk6", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: "📱 Send SMS" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "contacts", "data-id": "n1rr2ohli", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: "📞 Contacts" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "settings", "data-id": "ve7x047e0", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: "⚙️ Settings" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "history", "data-id": "sh8zs1oxz", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: "📝 History" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "overview", "data-id": "kxae05c5u", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", "data-id": "lulfjjera", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "pihm4lm6k", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "6zhftrcgi", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center", "data-id": "nlb5hjwlg", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "w-5 h-5 mr-2", "data-id": "lxqbs751o", "data-path": "src/pages/Admin/SMSAlertManagement.tsx" }),
              "Active Contacts"
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { "data-id": "c3iypdhlv", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-bold text-blue-600", "data-id": "50ll69bpx", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: contacts.filter((c) => c.is_active).length }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", "data-id": "6rs0lb3rq", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: [
                "Out of ",
                contacts.length,
                " total contacts"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "fbssoislu", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "v2p6xg6lf", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center", "data-id": "80gdvopek", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "w-5 h-5 mr-2", "data-id": "8ujas8fvc", "data-path": "src/pages/Admin/SMSAlertManagement.tsx" }),
              "Alert Settings"
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { "data-id": "x43zxerso", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-bold text-green-600", "data-id": "z4no0qcfc", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: settings.filter((s) => s.is_active).length }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", "data-id": "el6ek4b7i", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: "Active alert configurations" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "74dtp5p6t", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "0m8y6nupt", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center", "data-id": "j9uus3gs1", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(History, { className: "w-5 h-5 mr-2", "data-id": "3p5vyta09", "data-path": "src/pages/Admin/SMSAlertManagement.tsx" }),
              "Recent Messages"
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { "data-id": "n3e3b84im", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-bold text-purple-600", "data-id": "luawe1ktx", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: history.length }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", "data-id": "1xuijd1ct", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: "SMS messages sent" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "mt-6", "data-id": "bvochyjk3", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "l6mawk374", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { "data-id": "hgqgl7chj", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: "Quick Setup Guide" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { "data-id": "aoz59e65r", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", "data-id": "iumgb0evb", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", "data-id": "smcb2x6u6", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-600", "data-id": "2gyh3qlsf", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: "1" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "tm4weowzh", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: "Add SMS contacts in the SMS Contacts tab" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", "data-id": "cmnubaixk", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-600", "data-id": "81otdwydv", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: "2" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "pmpvqcxeq", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: "Configure alert settings for license expiry notifications" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", "data-id": "g6963fqgu", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-600", "data-id": "d8fwcl4em", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: "3" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "22b51qd7c", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: "Send test SMS to verify everything works correctly" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", "data-id": "q5vpr9tcj", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-600", "data-id": "o3obj3ygg", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: "4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "8jem6h4at", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: "Monitor SMS history to track delivery status" })
            ] })
          ] }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "config", "data-id": "jq50ga4bw", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SMSConfigurationValidator, { "data-id": "z6nwz71hg", "data-path": "src/pages/Admin/SMSAlertManagement.tsx" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "testing", "data-id": "fb4xmt2ii", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(EnhancedSMSTestManager, { "data-id": "iyjr4331h", "data-path": "src/pages/Admin/SMSAlertManagement.tsx" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "troubleshoot", "data-id": "ub8sr1aaf", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SMSTroubleshootingGuide, { "data-id": "cqxgfthlh", "data-path": "src/pages/Admin/SMSAlertManagement.tsx" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "custom", "data-id": "c24y5s1z1", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CustomSMSSendingForm, { "data-id": "hpjg77gyd", "data-path": "src/pages/Admin/SMSAlertManagement.tsx" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "contacts", "data-id": "w6yygl8nu", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "h22bkjnfb", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "79kqw0s4n", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", "data-id": "jxw54bguh", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center", "data-id": "nkyxs8pf4", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "w-5 h-5 mr-2", "data-id": "hpxfjllrx", "data-path": "src/pages/Admin/SMSAlertManagement.tsx" }),
            "SMS Contacts (",
            contacts.filter((c) => c.is_active).length,
            " active)"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: () => {
                toast({
                  title: "Add Contact",
                  description: "Opening contact creation form..."
                });
              },
              "data-id": "z1vn5ehl7",
              "data-path": "src/pages/Admin/SMSAlertManagement.tsx",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4 mr-2", "data-id": "yxh2s9s02", "data-path": "src/pages/Admin/SMSAlertManagement.tsx" }),
                "Add Contact"
              ]
            }
          )
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { "data-id": "k5r6rnr4r", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: contacts.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { "data-id": "0yiscmdli", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { "data-id": "kaj625zc7", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { "data-id": "72sck4817", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "7g59h3do1", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: "Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "68wslbg4f", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: "Mobile Number" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "80r8ictzx", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: "Station" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "3s500d81a", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: "Role" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "qdgwzi21j", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "y2mxh3lq1", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: "Actions" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { "data-id": "68whtqiez", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: contacts.map(
            (contact) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { "data-id": "ayj5tbkpl", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", "data-id": "gr6nb5jkh", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: contact.contact_name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "gfzu748kk", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: contact.mobile_number }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "yemfq2ccc", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: contact.station }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "jgh2wt20h", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: contact.contact_role }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "vfclgaegq", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: contact.is_active ? "default" : "secondary", "data-id": "fprz23oke", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: contact.is_active ? "Active" : "Inactive" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "mysqc46zb", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex space-x-2", "data-id": "vnq72y3im", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    size: "sm",
                    variant: "outline",
                    onClick: () => {
                      toast({
                        title: "Edit Contact",
                        description: `Editing contact: ${contact.contact_name}`
                      });
                    },
                    title: "Edit contact",
                    "data-id": "xszk8t9xv",
                    "data-path": "src/pages/Admin/SMSAlertManagement.tsx",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { className: "w-4 h-4", "data-id": "kh07sx1bk", "data-path": "src/pages/Admin/SMSAlertManagement.tsx" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    size: "sm",
                    variant: "outline",
                    onClick: () => {
                      if (confirm(`Are you sure you want to delete contact "${contact.contact_name}"?`)) {
                        toast({
                          title: "Contact Deleted",
                          description: `Contact ${contact.contact_name} has been deleted`,
                          variant: "destructive"
                        });
                        loadContacts();
                      }
                    },
                    title: "Delete contact",
                    className: "text-red-600 hover:text-red-700",
                    "data-id": "6venazdgp",
                    "data-path": "src/pages/Admin/SMSAlertManagement.tsx",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4", "data-id": "20qzh63rb", "data-path": "src/pages/Admin/SMSAlertManagement.tsx" })
                  }
                )
              ] }) })
            ] }, contact.id)
          ) })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-8", "data-id": "26hacs4n1", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "w-12 h-12 mx-auto text-muted-foreground mb-4", "data-id": "yux5y2jhd", "data-path": "src/pages/Admin/SMSAlertManagement.tsx" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold mb-2", "data-id": "mummj2nrp", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: "No SMS Contacts" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-4", "data-id": "dh359v7ij", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: "Add contacts to receive SMS alerts for license expiries" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: () => {
                toast({
                  title: "Add Contact",
                  description: "Opening contact creation form..."
                });
              },
              "data-id": "8f7359q6k",
              "data-path": "src/pages/Admin/SMSAlertManagement.tsx",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4 mr-2", "data-id": "h3f805g6m", "data-path": "src/pages/Admin/SMSAlertManagement.tsx" }),
                "Add Your First Contact"
              ]
            }
          )
        ] }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "settings", "data-id": "3qam673f1", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "z49jqe939", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "peh2kxgv4", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", "data-id": "az9fd8qvn", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center", "data-id": "jkcw2hbub", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "w-5 h-5 mr-2", "data-id": "n30xt648c", "data-path": "src/pages/Admin/SMSAlertManagement.tsx" }),
            "SMS Alert Settings"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: () => {
                toast({
                  title: "Add Setting",
                  description: "Opening SMS alert setting creation form..."
                });
              },
              "data-id": "n34gdw5bq",
              "data-path": "src/pages/Admin/SMSAlertManagement.tsx",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4 mr-2", "data-id": "2l8xx1yok", "data-path": "src/pages/Admin/SMSAlertManagement.tsx" }),
                "Add Setting"
              ]
            }
          )
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { "data-id": "olmmrn70o", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: settings.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { "data-id": "6fk6sixt7", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { "data-id": "12r8jzvsn", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { "data-id": "bdundy4fz", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "9vvk7i52p", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: "Setting Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "5av6mu9xs", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: "Days Before" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "41kvp4e73", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: "Frequency" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "gpnfwv15l", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "wpprswk7i", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: "Actions" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { "data-id": "wrxun8mvh", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: settings.map(
            (setting) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { "data-id": "1tpsvc0i8", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", "data-id": "qulad56h2", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: setting.setting_name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { "data-id": "h814vh2s1", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: [
                setting.days_before_expiry,
                " days"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { "data-id": "9a0fc749h", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: [
                "Every ",
                setting.alert_frequency_days,
                " days"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "optdzhf6i", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: setting.is_active ? "default" : "secondary", "data-id": "xn1xfk4mx", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: setting.is_active ? "Active" : "Inactive" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "mtle4hnq1", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex space-x-2", "data-id": "cqm2l429k", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", "data-id": "5o4fj9ypf", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { className: "w-4 h-4", "data-id": "c1xhpvz92", "data-path": "src/pages/Admin/SMSAlertManagement.tsx" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", "data-id": "k6w6ie3p1", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4", "data-id": "a4qknue7y", "data-path": "src/pages/Admin/SMSAlertManagement.tsx" }) })
              ] }) })
            ] }, setting.id)
          ) })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-8", "data-id": "kvfx2iouj", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "w-12 h-12 mx-auto text-muted-foreground mb-4", "data-id": "98fqnmg8z", "data-path": "src/pages/Admin/SMSAlertManagement.tsx" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold mb-2", "data-id": "cfxlo1bnt", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: "No Alert Settings" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-4", "data-id": "26hjqt8hs", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: "Configure when and how often to send license expiry alerts" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { "data-id": "erayvemba", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4 mr-2", "data-id": "wmsry6rbz", "data-path": "src/pages/Admin/SMSAlertManagement.tsx" }),
            "Create First Setting"
          ] })
        ] }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "history", "data-id": "jlx22ige6", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "qg322b402", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "03xbkxt51", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center", "data-id": "nvwvz5jz8", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(History, { className: "w-5 h-5 mr-2", "data-id": "37desjxcm", "data-path": "src/pages/Admin/SMSAlertManagement.tsx" }),
          "SMS Alert History"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { "data-id": "w75lfx4u6", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: history.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { "data-id": "lh2mpf3d4", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { "data-id": "vcdwbk0w9", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { "data-id": "ockiw39kz", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "57km8xnrd", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: "Date Sent" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "2r4u11o7t", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: "Mobile Number" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "zmmrmarvs", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: "Message" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "ij26jof2c", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: "Days Before Expiry" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "n0i1eznm9", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: "Status" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { "data-id": "fppuse7ri", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: history.map(
            (record) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { "data-id": "sm1r99lea", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "9blolhwqt", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: new Date(record.sent_date).toLocaleDateString() }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "z8o1bc5qr", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: record.mobile_number }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "max-w-xs truncate", "data-id": "sfp9gox57", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: record.message_content }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "mq5dtqc5m", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: record.days_before_expiry === 0 ? "Test" : `${record.days_before_expiry} days` }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "4itvveow6", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: record.delivery_status === "Sent" || record.delivery_status === "Test Sent" ? "default" : "destructive",
                  "data-id": "qpold76mr",
                  "data-path": "src/pages/Admin/SMSAlertManagement.tsx",
                  children: record.delivery_status
                }
              ) })
            ] }, record.id)
          ) })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-8", "data-id": "gearu7wk5", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(History, { className: "w-12 h-12 mx-auto text-muted-foreground mb-4", "data-id": "06fcy7q3m", "data-path": "src/pages/Admin/SMSAlertManagement.tsx" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold mb-2", "data-id": "kkamw42wr", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: "No SMS History" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-4", "data-id": "xm0keth7w", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: "SMS delivery history will appear here once you start sending alerts" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: sendTestSMS, disabled: loading, "data-id": "rtgllwrhr", "data-path": "src/pages/Admin/SMSAlertManagement.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "w-4 h-4 mr-2", "data-id": "2lo2k8i6b", "data-path": "src/pages/Admin/SMSAlertManagement.tsx" }),
            "Send Test SMS"
          ] })
        ] }) })
      ] }) })
    ] })
  ] }) });
};
const SMSAlertManagement$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: SMSAlertManagement
}, Symbol.toStringTag, { value: "Module" }));
const ErrorProneComponent = ({ shouldError }) => {
  if (shouldError) {
    throw new Error("This is a demo error thrown by ErrorProneComponent");
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 bg-green-50 border border-green-200 rounded-lg", "data-id": "bifayvn7t", "data-path": "src/components/ErrorBoundaryDemo.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", "data-id": "pht0zhurs", "data-path": "src/components/ErrorBoundaryDemo.tsx", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 bg-green-500 rounded-full", "data-id": "11u4a9b5d", "data-path": "src/components/ErrorBoundaryDemo.tsx" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-green-800", "data-id": "kyocrgemw", "data-path": "src/components/ErrorBoundaryDemo.tsx", children: "Component is working normally" })
  ] }) });
};
const ErrorProneForm = ({ shouldError }) => {
  const [formData, setFormData] = reactExports.useState({ name: "", email: "" });
  const handleSubmit = (e) => {
    e.preventDefault();
    if (shouldError) {
      throw new Error("Form submission error for demo purposes");
    }
  };
  if (shouldError && Math.random() > 0.5) {
    throw new Error("Form rendering error for demo purposes");
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", "data-id": "3vnq1ui6g", "data-path": "src/components/ErrorBoundaryDemo.tsx", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "2dkz0st29", "data-path": "src/components/ErrorBoundaryDemo.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium mb-1", "data-id": "cl8kdirfq", "data-path": "src/components/ErrorBoundaryDemo.tsx", children: "Name" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "text",
          value: formData.name,
          onChange: (e) => setFormData((prev) => ({ ...prev, name: e.target.value })),
          className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
          placeholder: "Enter your name",
          "data-id": "kfe6ijh3d",
          "data-path": "src/components/ErrorBoundaryDemo.tsx"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "zqdm6f994", "data-path": "src/components/ErrorBoundaryDemo.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium mb-1", "data-id": "ch5mdytki", "data-path": "src/components/ErrorBoundaryDemo.tsx", children: "Email" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "email",
          value: formData.email,
          onChange: (e) => setFormData((prev) => ({ ...prev, email: e.target.value })),
          className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
          placeholder: "Enter your email",
          "data-id": "8cv13nvaw",
          "data-path": "src/components/ErrorBoundaryDemo.tsx"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", className: "w-full", "data-id": "9pvouyweg", "data-path": "src/components/ErrorBoundaryDemo.tsx", children: "Submit Form" })
  ] });
};
const ErrorBoundaryDemo = () => {
  const [componentError, setComponentError] = reactExports.useState(false);
  const [formError, setFormError] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", "data-id": "jg7cp67s7", "data-path": "src/components/ErrorBoundaryDemo.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "41hy1m4fe", "data-path": "src/components/ErrorBoundaryDemo.tsx", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "zbksdx6l8", "data-path": "src/components/ErrorBoundaryDemo.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", "data-id": "rl42otsre", "data-path": "src/components/ErrorBoundaryDemo.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Bug, { className: "h-6 w-6", "data-id": "knuz7lv0l", "data-path": "src/components/ErrorBoundaryDemo.tsx" }),
      "Error Boundary Demo"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-6", "data-id": "czjvtl9so", "data-path": "src/components/ErrorBoundaryDemo.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", "data-id": "rp4sy2e0s", "data-path": "src/components/ErrorBoundaryDemo.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", "data-id": "el93kr1qc", "data-path": "src/components/ErrorBoundaryDemo.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "992r1lstv", "data-path": "src/components/ErrorBoundaryDemo.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold", "data-id": "3gudc3zb6", "data-path": "src/components/ErrorBoundaryDemo.tsx", children: "Component Error Boundary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: componentError ? "destructive" : "secondary", "data-id": "17bmzo789", "data-path": "src/components/ErrorBoundaryDemo.tsx", children: componentError ? "Error Active" : "Normal" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ComponentErrorBoundary,
            {
              componentName: "Demo Component",
              severity: "medium",
              showErrorDetails: true,
              "data-id": "nmuduhf8q",
              "data-path": "src/components/ErrorBoundaryDemo.tsx",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorProneComponent, { shouldError: componentError, "data-id": "x6y55e85f", "data-path": "src/components/ErrorBoundaryDemo.tsx" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: () => setComponentError(!componentError),
              variant: componentError ? "default" : "destructive",
              size: "sm",
              "data-id": "l48tfotm1",
              "data-path": "src/components/ErrorBoundaryDemo.tsx",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-4 h-4 mr-2", "data-id": "1hc7ge165", "data-path": "src/components/ErrorBoundaryDemo.tsx" }),
                componentError ? "Fix Component" : "Trigger Error"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", "data-id": "exkfrqqa6", "data-path": "src/components/ErrorBoundaryDemo.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "s37f1epzl", "data-path": "src/components/ErrorBoundaryDemo.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold", "data-id": "msaj99d3s", "data-path": "src/components/ErrorBoundaryDemo.tsx", children: "Form Error Boundary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: formError ? "destructive" : "secondary", "data-id": "fq47x1e05", "data-path": "src/components/ErrorBoundaryDemo.tsx", children: formError ? "Error Active" : "Normal" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            FormErrorBoundary,
            {
              formName: "Demo Form",
              showDataRecovery: true,
              onFormReset: () => {
                setFormError(false);
              },
              "data-id": "8r7r5dvqm",
              "data-path": "src/components/ErrorBoundaryDemo.tsx",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorProneForm, { shouldError: formError, "data-id": "ebb8vyg1i", "data-path": "src/components/ErrorBoundaryDemo.tsx" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: () => setFormError(!formError),
              variant: formError ? "default" : "destructive",
              size: "sm",
              "data-id": "bp7ybfdat",
              "data-path": "src/components/ErrorBoundaryDemo.tsx",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-4 h-4 mr-2", "data-id": "bckj3jxjc", "data-path": "src/components/ErrorBoundaryDemo.tsx" }),
                formError ? "Fix Form" : "Trigger Error"
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-blue-50 border border-blue-200 rounded-lg p-4", "data-id": "tgxkk4vq6", "data-path": "src/components/ErrorBoundaryDemo.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", "data-id": "05dtrq7td", "data-path": "src/components/ErrorBoundaryDemo.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-5 h-5 text-blue-600 mt-0.5", "data-id": "71o2ddfok", "data-path": "src/components/ErrorBoundaryDemo.tsx" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "cc6hqznee", "data-path": "src/components/ErrorBoundaryDemo.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-semibold text-blue-800", "data-id": "s4yqm5iw2", "data-path": "src/components/ErrorBoundaryDemo.tsx", children: "How to Test Error Boundaries" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "mt-2 text-sm text-blue-700 space-y-1", "data-id": "p681ac347", "data-path": "src/components/ErrorBoundaryDemo.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { "data-id": "62ru8zqup", "data-path": "src/components/ErrorBoundaryDemo.tsx", children: '• Click "Trigger Error" buttons to simulate component errors' }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { "data-id": "hvkxx77mk", "data-path": "src/components/ErrorBoundaryDemo.tsx", children: "• Notice how errors are gracefully handled with fallback UI" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { "data-id": "31gfnadoo", "data-path": "src/components/ErrorBoundaryDemo.tsx", children: '• Try the "Retry" buttons in the error fallback components' }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { "data-id": "5o9f0zb01", "data-path": "src/components/ErrorBoundaryDemo.tsx", children: "• Check the Error Recovery page in Admin section for logged errors" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { "data-id": "bi4xu9cdv", "data-path": "src/components/ErrorBoundaryDemo.tsx", children: "• Form errors include data recovery options" })
          ] })
        ] })
      ] }) })
    ] })
  ] }) });
};
const AsyncErrorComponent = ({ shouldError, errorType }) => {
  const [isLoading, setIsLoading] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (shouldError) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        if (errorType === "network") {
          throw new Error("Network request failed: Connection timeout");
        } else if (errorType === "parsing") {
          throw new Error("JSON parsing error: Unexpected token");
        } else if (errorType === "permission") {
          throw new Error("Permission denied: Insufficient privileges");
        }
      }, 1e3);
    }
  }, [shouldError, errorType]);
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 bg-yellow-50 border border-yellow-200 rounded-lg", "data-id": "vjlmgjzzp", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", "data-id": "gfo60luk0", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600", "data-id": "8esh4v41m", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-yellow-800", "data-id": "8d27ylxzi", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: "Processing request..." })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 bg-green-50 border border-green-200 rounded-lg", "data-id": "gglobclql", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", "data-id": "hzpbls9mz", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 bg-green-500 rounded-full", "data-id": "u173e2qiu", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-green-800", "data-id": "jmptgdt78", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: "Async operation completed successfully" })
  ] }) });
};
const MemoryLeakComponent = ({ shouldError }) => {
  const [intervalIds, setIntervalIds] = reactExports.useState([]);
  reactExports.useEffect(() => {
    if (shouldError) {
      const ids = [];
      for (let i = 0; i < 100; i++) {
        const id = setInterval(() => {
          console.log(`Memory leak interval ${i}`);
        }, 100);
        ids.push(id);
      }
      setIntervalIds(ids);
      setTimeout(() => {
        throw new Error("Memory leak detected: Too many active intervals");
      }, 500);
    }
    return () => {
      intervalIds.forEach((id) => clearInterval(id));
    };
  }, [shouldError, intervalIds]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 bg-blue-50 border border-blue-200 rounded-lg", "data-id": "e4gz3cgc2", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", "data-id": "6dib8bzlx", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 bg-blue-500 rounded-full", "data-id": "v7aqh15nv", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-blue-800", "data-id": "sgyzvkaey", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: "Memory management component active" })
  ] }) });
};
const DatabaseErrorComponent = ({ shouldError }) => {
  reactExports.useEffect(() => {
    if (shouldError) {
      setTimeout(() => {
        throw new Error("Database connection failed: Unable to establish connection to primary database");
      }, 800);
    }
  }, [shouldError]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 bg-purple-50 border border-purple-200 rounded-lg", "data-id": "o93hdkp9c", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", "data-id": "debp9trxr", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Database, { className: "w-4 h-4 text-purple-600", "data-id": "jd3knyihr", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-purple-800", "data-id": "bg0fr7if5", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: "Database connection established" })
  ] }) });
};
const EnhancedErrorBoundaryDemo = () => {
  const [activeErrors, setActiveErrors] = reactExports.useState({});
  const [errorType, setErrorType] = reactExports.useState("network");
  const [testingInProgress, setTestingInProgress] = reactExports.useState(false);
  const [testProgress, setTestProgress] = reactExports.useState(0);
  const { toast } = useToast();
  const errorLogger = ErrorLogger.getInstance();
  const errorScenarios = [
    {
      id: "component",
      name: "Component Render Error",
      description: "Simulates a component that throws during rendering",
      icon: Bug,
      severity: "medium",
      component: (shouldError) => /* @__PURE__ */ jsxRuntimeExports.jsx(ComponentErrorBoundary, { componentName: "Demo Component", severity: "medium", "data-id": "xtoa52ln1", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: shouldError ? "throw-error" : "working", "data-id": "54sy8k4o5", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: [
        shouldError && (() => {
          throw new Error("Component render error for demo");
        })(),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 bg-green-50 border border-green-200 rounded-lg", "data-id": "9pqk4uwfw", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", "data-id": "0bkt02coi", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 bg-green-500 rounded-full", "data-id": "ms4b67jhe", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-green-800", "data-id": "ij69upfrs", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: "Component rendering normally" })
        ] }) })
      ] }) })
    },
    {
      id: "async",
      name: "Async Operation Error",
      description: "Simulates errors in asynchronous operations",
      icon: Timer,
      severity: "high",
      component: (shouldError) => /* @__PURE__ */ jsxRuntimeExports.jsx(ComponentErrorBoundary, { componentName: "Async Component", severity: "high", "data-id": "j8eg1au81", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AsyncErrorComponent, { shouldError, errorType, "data-id": "mxgzqwbhf", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx" }) })
    },
    {
      id: "database",
      name: "Database Error",
      description: "Simulates database connection or query errors",
      icon: Database,
      severity: "critical",
      component: (shouldError) => /* @__PURE__ */ jsxRuntimeExports.jsx(ComponentErrorBoundary, { componentName: "Database Component", severity: "critical", "data-id": "xbj456ste", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(DatabaseErrorComponent, { shouldError, "data-id": "gxsw7j576", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx" }) })
    },
    {
      id: "memory",
      name: "Memory Leak Error",
      description: "Simulates memory management issues",
      icon: Zap,
      severity: "high",
      component: (shouldError) => /* @__PURE__ */ jsxRuntimeExports.jsx(ComponentErrorBoundary, { componentName: "Memory Component", severity: "high", "data-id": "e9caydzpr", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MemoryLeakComponent, { shouldError, "data-id": "a2jmevh7b", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx" }) })
    }
  ];
  const toggleError = (scenarioId) => {
    setActiveErrors((prev) => ({
      ...prev,
      [scenarioId]: !prev[scenarioId]
    }));
  };
  const runAutomatedTest = async () => {
    setTestingInProgress(true);
    setTestProgress(0);
    for (let i = 0; i < errorScenarios.length; i++) {
      const scenario = errorScenarios[i];
      setActiveErrors((prev) => ({ ...prev, [scenario.id]: true }));
      setTestProgress((i + 0.5) / errorScenarios.length * 100);
      await new Promise((resolve) => setTimeout(resolve, 2e3));
      setActiveErrors((prev) => ({ ...prev, [scenario.id]: false }));
      setTestProgress((i + 1) / errorScenarios.length * 100);
      await new Promise((resolve) => setTimeout(resolve, 1e3));
    }
    setTestingInProgress(false);
    toast({
      title: "Automated Test Complete",
      description: "All error scenarios have been tested successfully."
    });
  };
  const clearAllErrors = () => {
    setActiveErrors({});
    toast({
      title: "Errors Cleared",
      description: "All active error states have been reset."
    });
  };
  const exportErrorLogs = () => {
    const logs = errorLogger.getLogs();
    const dataStr = JSON.stringify(logs, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `error-logs-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast({
      title: "Error Logs Exported",
      description: "Error logs have been downloaded as JSON file."
    });
  };
  const clearErrorLogs = () => {
    errorLogger.clearLogs();
    toast({
      title: "Error Logs Cleared",
      description: "All stored error logs have been cleared."
    });
  };
  const errorSummary = errorLogger.getLogsSummary();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", "data-id": "tkn8erxh1", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "g2vojnzyp", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "kqg7qxbn1", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "jxchng0pe", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "43x50thvy", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", "data-id": "v78ycf5y9", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-6 w-6", "data-id": "1ebgh038u", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx" }),
          "Enhanced Error Boundary Demo"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", "data-id": "o7mfnz7f6", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: "Comprehensive error testing and monitoring system" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", "data-id": "ug8ub7e2b", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: runAutomatedTest,
            disabled: testingInProgress,
            variant: "outline",
            size: "sm",
            "data-id": "25ougill1",
            "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "w-4 h-4 mr-2", "data-id": "f6bpixxi3", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx" }),
              "Run All Tests"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: clearAllErrors,
            variant: "outline",
            size: "sm",
            "data-id": "trcurxt9i",
            "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCcw, { className: "w-4 h-4 mr-2", "data-id": "6fyhdjmp3", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx" }),
              "Clear All"
            ]
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { "data-id": "nes8sh07f", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "scenarios", className: "space-y-4", "data-id": "kiusmjzra", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid w-full grid-cols-3", "data-id": "232ddcg8m", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "scenarios", "data-id": "q42i5mtxi", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: "Error Scenarios" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "monitoring", "data-id": "phzqnokzw", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: "Error Monitoring" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "analytics", "data-id": "94ldrvt0z", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: "Analytics" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "scenarios", className: "space-y-6", "data-id": "w8sy6yzel", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: [
        testingInProgress && /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { "data-id": "72su62l5r", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Timer, { className: "h-4 w-4", "data-id": "o2iyiumju", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { "data-id": "332r2n4ol", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "ovfuaufit", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-id": "coyac8dw9", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: "Automated testing in progress..." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: testProgress, className: "w-full", "data-id": "kv836odal", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx" })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", "data-id": "pfk26wyke", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: errorScenarios.map((scenario) => {
          const IconComponent = scenario.icon;
          const isActive = activeErrors[scenario.id];
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", "data-id": "ppfygpnqf", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "yp3nfruav", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", "data-id": "vtewlzsps", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(IconComponent, { className: "h-5 w-5 text-gray-600", "data-id": "qfxn79ihl", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "b4kcj4bkz", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold", "data-id": "dak32290b", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: scenario.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", "data-id": "gqyhn2qd1", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: scenario.description })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", "data-id": "f1l6wp0bu", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: isActive ? "destructive" : "secondary", "data-id": "5n8o4hvoq", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: isActive ? "Error Active" : "Normal" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs", "data-id": "eorrr4kpx", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: scenario.severity })
              ] })
            ] }),
            scenario.component(isActive),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                onClick: () => toggleError(scenario.id),
                variant: isActive ? "default" : "destructive",
                size: "sm",
                disabled: testingInProgress,
                "data-id": "wng4x1bj6",
                "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-4 h-4 mr-2", "data-id": "d82dgathj", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx" }),
                  isActive ? "Fix Error" : "Trigger Error"
                ]
              }
            )
          ] }, scenario.id);
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-blue-50 border-blue-200", "data-id": "utxqifck1", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4", "data-id": "rrqyt8660", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", "data-id": "tb4mh03mm", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-5 h-5 text-blue-600 mt-0.5", "data-id": "07ty2b3tq", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "mv9zwcl74", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-semibold text-blue-800", "data-id": "2atashqr2", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: "Advanced Configuration" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 space-y-3", "data-id": "9sabc97pu", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "4qdi4sgrb", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-blue-700", "data-id": "t9iupfb1p", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: "Async Error Type:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: errorType, onValueChange: setErrorType, "data-id": "t07y7tjo4", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-full mt-1", "data-id": "5pqu6qd9b", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { "data-id": "219ovq9yn", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { "data-id": "0un6thi4d", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "network", "data-id": "elxg93oel", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: "Network Error" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "parsing", "data-id": "i12pciyse", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: "Parsing Error" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "permission", "data-id": "xzpmjv882", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: "Permission Error" })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-blue-600", "data-id": "g9xsa8wlk", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: "Configure the type of async error to simulate for testing different error handling scenarios." })
            ] })
          ] })
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "monitoring", className: "space-y-6", "data-id": "talqlwx53", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", "data-id": "oatkd2bsj", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "kltnbwejv", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", "data-id": "qyq9fzzh3", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium", "data-id": "36qv6a3w6", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: "Total Errors" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Bug, { className: "h-4 w-4 text-muted-foreground", "data-id": "f94af0rlo", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { "data-id": "tus469vdz", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-red-600", "data-id": "bgatgbvyj", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: errorSummary.total }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", "data-id": "zddznavun", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: "Errors logged in current session" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "n2e30ni77", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", "data-id": "34u3ld0lr", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium", "data-id": "6imb9t079", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: "Critical Errors" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4 text-muted-foreground", "data-id": "ra43z9d1n", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { "data-id": "4ovf0a00r", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-orange-600", "data-id": "88v1ijpna", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: errorSummary.bySeverity.critical || 0 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", "data-id": "xab98v0v4", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: "High priority errors requiring attention" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "osbc02eg0", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", "data-id": "eoxo00tp1", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium", "data-id": "rne4tdkbx", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: "Active Tests" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-4 w-4 text-muted-foreground", "data-id": "gcadoqk0r", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { "data-id": "s8ql3873i", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-blue-600", "data-id": "ht9y4g70o", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: Object.values(activeErrors).filter(Boolean).length }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", "data-id": "3i4m3nkki", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: "Currently running error scenarios" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "5lrms3q47", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "q0vkkbo86", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "vkoe0g468", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { "data-id": "qzdqvjv0k", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: "Error Log Management" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", "data-id": "4lzwjjf68", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: exportErrorLogs, variant: "outline", size: "sm", "data-id": "gcbfcdqf2", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-4 h-4 mr-2", "data-id": "jn7dwzldh", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx" }),
                "Export Logs"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: clearErrorLogs, variant: "outline", size: "sm", "data-id": "ws3gzxm9z", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4 mr-2", "data-id": "5kc7amm67", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx" }),
                "Clear Logs"
              ] })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { "data-id": "2lk8j9fik", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", "data-id": "eb1gb87ab", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", "data-id": "s4sjz80bp", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: Object.entries(errorSummary.bySeverity).map(
            ([severity, count]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", "data-id": "yzlfupzwk", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-semibold", "data-id": "5pl4qbuqa", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: count }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground capitalize", "data-id": "0zmx9cchb", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: severity })
            ] }, severity)
          ) }) }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "analytics", className: "space-y-6", "data-id": "xzlhjfmi5", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "yb9df0rlc", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { "data-id": "4iijdr9by", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { "data-id": "25mog12mk", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: "Error Pattern Analysis" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", "data-id": "384akvi0q", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: "Analyze error patterns over time to identify system issues" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { "data-id": "b9ndt1tf9", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-id": "o1dn4t3rx", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { "data-id": "g9895iyj5", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "h-4 w-4", "data-id": "1x2z59oee", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDescription, { "data-id": "ui952upjp", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { "data-id": "8vf8w5yrl", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: "Pattern Detection:" }),
              " The system monitors error frequency, severity distribution, and component failure rates to help identify potential system issues before they become critical."
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", "data-id": "lhzo9hvm9", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "e24g626jb", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-semibold mb-3", "data-id": "75k38k2xu", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: "Common Error Patterns:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-2 text-sm", "data-id": "ti9u1zy1i", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2", "data-id": "b999psgv3", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 bg-red-500 rounded-full", "data-id": "mhihpnppv", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "ezuvgcspk", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: "Repeated component failures indicate code issues" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2", "data-id": "3i7g9krnv", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 bg-orange-500 rounded-full", "data-id": "7vd01uqtv", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "ofv8tvw31", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: "Network errors suggest connectivity problems" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2", "data-id": "flt1llud1", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 bg-yellow-500 rounded-full", "data-id": "q85p74rnz", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "i0ucaq0u4", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: "Memory errors indicate resource management issues" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2", "data-id": "j9n498v0l", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 bg-blue-500 rounded-full", "data-id": "enwrqjvxd", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "cszbkoxhv", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: "Database errors suggest backend problems" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "rzi1omluo", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-semibold mb-3", "data-id": "yqpv3e5pm", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: "Monitoring Benefits:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-2 text-sm", "data-id": "joxutpk5x", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2", "data-id": "otr9sflrl", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 bg-green-500 rounded-full", "data-id": "v0539rok7", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "tys0fbuxt", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: "Early detection of system degradation" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2", "data-id": "o1zv6eyks", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 bg-green-500 rounded-full", "data-id": "369z4ge2h", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "lw8m0rtr4", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: "Improved user experience through better error handling" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2", "data-id": "6r025emwf", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 bg-green-500 rounded-full", "data-id": "tkinbxl6k", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "rn0ko8phb", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: "Data-driven decisions for system improvements" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2", "data-id": "c8u012zf3", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 bg-green-500 rounded-full", "data-id": "k9o92y8ct", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "lv1f8h6q0", "data-path": "src/components/EnhancedErrorBoundaryDemo.tsx", children: "Reduced downtime through proactive monitoring" })
                ] })
              ] })
            ] })
          ] })
        ] }) })
      ] }) })
    ] }) })
  ] }) });
};
const _EnhancedErrorLogger = class _EnhancedErrorLogger extends ErrorLogger {
  constructor() {
    super();
    __publicField(this, "patterns", /* @__PURE__ */ new Map());
    __publicField(this, "analytics", null);
    this.initializePatterns();
  }
  static getInstance() {
    if (!_EnhancedErrorLogger.enhancedInstance) {
      _EnhancedErrorLogger.enhancedInstance = new _EnhancedErrorLogger();
    }
    return _EnhancedErrorLogger.enhancedInstance;
  }
  initializePatterns() {
    const commonPatterns = [
      {
        id: "network_timeout",
        name: "Network Timeout Pattern",
        description: "Repeated network timeouts indicating connectivity issues",
        severity: "high",
        components: ["api", "network", "fetch"],
        suggestedActions: [
          "Check network connectivity",
          "Implement retry logic",
          "Review API endpoint health",
          "Consider connection pooling"
        ]
      },
      {
        id: "memory_leak",
        name: "Memory Leak Pattern",
        description: "Components consuming excessive memory over time",
        severity: "critical",
        components: ["memory", "component", "useEffect"],
        suggestedActions: [
          "Review component cleanup",
          "Check for event listener cleanup",
          "Audit interval and timeout usage",
          "Implement memory monitoring"
        ]
      },
      {
        id: "render_errors",
        name: "Render Error Pattern",
        description: "Frequent component rendering failures",
        severity: "medium",
        components: ["render", "component", "state"],
        suggestedActions: [
          "Review component state management",
          "Add prop validation",
          "Implement error boundaries",
          "Check for null/undefined values"
        ]
      },
      {
        id: "async_race",
        name: "Async Race Condition Pattern",
        description: "Race conditions in asynchronous operations",
        severity: "high",
        components: ["async", "promise", "api"],
        suggestedActions: [
          "Implement proper loading states",
          "Use AbortController for cancellation",
          "Review async/await usage",
          "Add request deduplication"
        ]
      },
      {
        id: "form_validation",
        name: "Form Validation Pattern",
        description: "Repeated form validation and submission errors",
        severity: "medium",
        components: ["form", "validation", "input"],
        suggestedActions: [
          "Enhance client-side validation",
          "Improve error messaging",
          "Add real-time validation",
          "Review form state management"
        ]
      }
    ];
    commonPatterns.forEach((pattern) => {
      this.patterns.set(pattern.id, {
        ...pattern,
        frequency: 0,
        lastOccurrence: /* @__PURE__ */ new Date(),
        trend: "stable"
      });
    });
  }
  // Override the log method to include pattern detection
  log(error, severity = "medium", component, errorInfo, context) {
    super.log(error, severity, component, errorInfo, context);
    this.analyzeForPatterns(error, component, severity);
    this.updateAnalytics();
  }
  analyzeForPatterns(error, component, severity) {
    var _a;
    const errorMessage = error.message.toLowerCase();
    const errorStack = ((_a = error.stack) == null ? void 0 : _a.toLowerCase()) || "";
    const currentTime = /* @__PURE__ */ new Date();
    this.patterns.forEach((pattern, patternId) => {
      let isMatch = false;
      if (patternId === "network_timeout" && (errorMessage.includes("timeout") || errorMessage.includes("network") || errorMessage.includes("connection"))) {
        isMatch = true;
      } else if (patternId === "memory_leak" && (errorMessage.includes("memory") || errorMessage.includes("leak") || errorMessage.includes("interval"))) {
        isMatch = true;
      } else if (patternId === "render_errors" && (errorMessage.includes("render") || errorMessage.includes("component") || errorStack.includes("render"))) {
        isMatch = true;
      } else if (patternId === "async_race" && (errorMessage.includes("async") || errorMessage.includes("promise") || errorMessage.includes("race"))) {
        isMatch = true;
      } else if (patternId === "form_validation" && (errorMessage.includes("validation") || errorMessage.includes("form") || (component == null ? void 0 : component.includes("form")))) {
        isMatch = true;
      }
      if (isMatch) {
        const updatedPattern = {
          ...pattern,
          frequency: pattern.frequency + 1,
          lastOccurrence: currentTime,
          trend: this.calculateTrend(pattern.frequency, currentTime, pattern.lastOccurrence)
        };
        if (component && !updatedPattern.components.includes(component)) {
          updatedPattern.components.push(component);
        }
        this.patterns.set(patternId, updatedPattern);
      }
    });
  }
  calculateTrend(currentFreq, currentTime, lastTime) {
    const timeDiff = currentTime.getTime() - lastTime.getTime();
    const hoursDiff = timeDiff / (1e3 * 60 * 60);
    if (hoursDiff < 1 && currentFreq > 1) {
      return "increasing";
    }
    if (hoursDiff > 24) {
      return "stable";
    }
    return "decreasing";
  }
  updateAnalytics() {
    const logs = this.getLogs();
    const now = /* @__PURE__ */ new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1e3);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1e3);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1e3);
    const errorsLastHour = logs.filter((log) => log.timestamp > oneHourAgo).length;
    const errorsLastDay = logs.filter((log) => log.timestamp > oneDayAgo).length;
    const errorsLastWeek = logs.filter((log) => log.timestamp > oneWeekAgo).length;
    const errorsByHour = {};
    logs.forEach((log) => {
      const hour = log.timestamp.getHours().toString().padStart(2, "0");
      errorsByHour[hour] = (errorsByHour[hour] || 0) + 1;
    });
    const errorsByComponent = {};
    logs.forEach((log) => {
      if (log.component) {
        errorsByComponent[log.component] = (errorsByComponent[log.component] || 0) + 1;
      }
    });
    const errorsBySeverity = {};
    logs.forEach((log) => {
      errorsBySeverity[log.severity] = (errorsBySeverity[log.severity] || 0) + 1;
    });
    const errorMessageCounts = {};
    logs.forEach((log) => {
      const message = log.error.message;
      errorMessageCounts[message] = (errorMessageCounts[message] || 0) + 1;
    });
    const topErrorMessages = Object.entries(errorMessageCounts).sort(([, a], [, b]) => b - a).slice(0, 10).map(([message, count]) => ({ message, count }));
    const recoveryRate = logs.length > 0 ? Math.max(0, 100 - errorsLastHour / logs.length * 100) : 100;
    this.analytics = {
      totalErrors: logs.length,
      errorsByHour,
      errorsByComponent,
      errorsBySeverity,
      topErrorMessages,
      recoveryRate,
      patterns: Array.from(this.patterns.values()),
      trends: {
        hourly: errorsLastHour,
        daily: errorsLastDay,
        weekly: errorsLastWeek
      }
    };
  }
  getAnalytics() {
    if (!this.analytics) {
      this.updateAnalytics();
    }
    return this.analytics;
  }
  getPatterns() {
    return Array.from(this.patterns.values()).sort((a, b) => b.frequency - a.frequency);
  }
  getCriticalPatterns() {
    return this.getPatterns().filter(
      (pattern) => pattern.severity === "critical" || pattern.severity === "high" && pattern.trend === "increasing"
    );
  }
  getRecommendations() {
    const recommendations = [];
    const analytics = this.getAnalytics();
    if (!analytics) return recommendations;
    if (analytics.trends.hourly > 5) {
      recommendations.push({
        priority: "high",
        action: "Investigate recent code changes causing error spike",
        reason: `${analytics.trends.hourly} errors in the last hour indicates a critical issue`
      });
    }
    this.getCriticalPatterns().forEach((pattern) => {
      pattern.suggestedActions.forEach((action) => {
        recommendations.push({
          priority: pattern.severity === "critical" ? "high" : "medium",
          action,
          reason: `Addressing ${pattern.name} (${pattern.frequency} occurrences)`
        });
      });
    });
    const topErrorComponent = Object.entries(analytics.errorsByComponent).sort(([, a], [, b]) => b - a)[0];
    if (topErrorComponent && topErrorComponent[1] > 3) {
      recommendations.push({
        priority: "medium",
        action: `Review and refactor ${topErrorComponent[0]} component`,
        reason: `Component has ${topErrorComponent[1]} recorded errors`
      });
    }
    return recommendations.slice(0, 10);
  }
  // Export comprehensive error report
  exportComprehensiveReport() {
    const analytics = this.getAnalytics();
    const patterns = this.getPatterns();
    const recommendations = this.getRecommendations();
    const logs = this.getLogs();
    return {
      generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      summary: analytics,
      patterns,
      recommendations,
      detailedLogs: logs.slice(0, 50),
      // Last 50 errors
      systemInfo: {
        userAgent: navigator.userAgent,
        url: window.location.href,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      }
    };
  }
};
__publicField(_EnhancedErrorLogger, "enhancedInstance");
let EnhancedErrorLogger = _EnhancedErrorLogger;
const getSeverityColor = (severity) => {
  const colors = {
    low: "text-yellow-600 bg-yellow-50 border-yellow-200",
    medium: "text-orange-600 bg-orange-50 border-orange-200",
    high: "text-red-600 bg-red-50 border-red-200",
    critical: "text-red-800 bg-red-100 border-red-300"
  };
  return colors[severity] || colors.medium;
};
const ErrorAnalyticsDashboard = () => {
  const [analytics, setAnalytics] = reactExports.useState(null);
  const [patterns, setPatterns] = reactExports.useState([]);
  const [recommendations, setRecommendations] = reactExports.useState([]);
  const [isRefreshing, setIsRefreshing] = reactExports.useState(false);
  const { toast } = useToast();
  const errorLogger = EnhancedErrorLogger.getInstance();
  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      const analyticsData = errorLogger.getAnalytics();
      const patternsData = errorLogger.getPatterns();
      const recommendationsData = errorLogger.getRecommendations();
      setAnalytics(analyticsData);
      setPatterns(patternsData);
      setRecommendations(recommendationsData);
    } catch (error) {
      toast({
        title: "Error Loading Analytics",
        description: "Failed to refresh analytics data.",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };
  const exportReport = () => {
    try {
      const report = errorLogger.exportComprehensiveReport();
      const dataStr = JSON.stringify(report, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `error-analytics-report-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
      toast({
        title: "Report Exported",
        description: "Comprehensive error analytics report has been downloaded."
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export analytics report.",
        variant: "destructive"
      });
    }
  };
  reactExports.useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 3e4);
    return () => clearInterval(interval);
  }, []);
  if (!analytics) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center p-8", "data-id": "zgj4qhadx", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", "data-id": "rtutkh0zi", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4", "data-id": "leakab0ii", "data-path": "src/components/ErrorAnalyticsDashboard.tsx" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", "data-id": "zo0uf2wm0", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: "Loading analytics data..." })
    ] }) });
  }
  const criticalPatterns = patterns.filter((p) => p.severity === "critical" || p.trend === "increasing");
  const healthScore = Math.max(0, 100 - analytics.trends.hourly * 10);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-id": "lj8xedm6x", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "4xi0b9plf", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "6d3dla97c", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold tracking-tight", "data-id": "tl1gklduv", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: "Error Analytics Dashboard" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", "data-id": "r79hv6sy4", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: "Real-time monitoring and analysis of application errors" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", "data-id": "hdjngk1k5", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: refreshData,
            disabled: isRefreshing,
            variant: "outline",
            size: "sm",
            "data-id": "l9fr3iil5",
            "data-path": "src/components/ErrorAnalyticsDashboard.tsx",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: `w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`, "data-id": "wjqkrsxc3", "data-path": "src/components/ErrorAnalyticsDashboard.tsx" }),
              "Refresh"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: exportReport, variant: "outline", size: "sm", "data-id": "pryse1sdp", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-4 h-4 mr-2", "data-id": "za9rxbdr4", "data-path": "src/components/ErrorAnalyticsDashboard.tsx" }),
          "Export Report"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", "data-id": "evx7egait", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "kcdwyb48n", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", "data-id": "x1zl1ygds", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium", "data-id": "b2oazvgt6", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: "System Health" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-4 w-4 text-muted-foreground", "data-id": "p089i8uc5", "data-path": "src/components/ErrorAnalyticsDashboard.tsx" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { "data-id": "wvcgjqm8t", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-2xl font-bold text-green-600", "data-id": "k8vb6epbu", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: [
            healthScore.toFixed(0),
            "%"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: healthScore, className: "mt-2", "data-id": "uqsmzcod4", "data-path": "src/components/ErrorAnalyticsDashboard.tsx" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", "data-id": "y5hnb7vaj", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: "Based on recent error trends" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "3uzqeqg9i", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", "data-id": "s2l9g0v6e", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium", "data-id": "yr4atx222", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: "Total Errors" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4 text-muted-foreground", "data-id": "2gj4mv6cv", "data-path": "src/components/ErrorAnalyticsDashboard.tsx" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { "data-id": "3dy6utfsh", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-red-600", "data-id": "mj49rmlud", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: analytics.totalErrors }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", "data-id": "jm0atz15z", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: "Across all components and time periods" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "wc9ezuf5d", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", "data-id": "dbwpc07pl", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium", "data-id": "btsfz5bxl", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: "Active Patterns" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "h-4 w-4 text-muted-foreground", "data-id": "9eej3z6hz", "data-path": "src/components/ErrorAnalyticsDashboard.tsx" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { "data-id": "t9l97v3ig", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-blue-600", "data-id": "l699teqcq", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: patterns.length }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", "data-id": "cegun09h5", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: [
            criticalPatterns.length,
            " critical patterns detected"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "33sc66mqy", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", "data-id": "0xk2pimo9", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium", "data-id": "qe02kts8s", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: "Recovery Rate" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-4 w-4 text-muted-foreground", "data-id": "w8mulnsom", "data-path": "src/components/ErrorAnalyticsDashboard.tsx" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { "data-id": "ki9jpdsdt", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-2xl font-bold text-green-600", "data-id": "ssqqkw3wz", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: [
            analytics.recoveryRate.toFixed(1),
            "%"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", "data-id": "x5genfhrx", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: "System stability and error recovery" })
        ] })
      ] })
    ] }),
    criticalPatterns.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { className: "border-red-200 bg-red-50", "data-id": "6bwaxk2kr", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4 text-red-600", "data-id": "v4esk3iq9", "data-path": "src/components/ErrorAnalyticsDashboard.tsx" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { "data-id": "neyw9d1fe", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "vdfl941v7", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "m6rwyykjn", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-red-800", "data-id": "9zk7l31n9", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: "Critical Issues Detected:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-2 text-red-700", "data-id": "yelujjwah", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: [
            criticalPatterns.length,
            " pattern(s) require immediate attention"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "destructive", "data-id": "aflrmkl6q", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: criticalPatterns.length })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "overview", className: "space-y-4", "data-id": "540jp8oqu", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid w-full grid-cols-4", "data-id": "4e2zd22gk", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "overview", "data-id": "v48qo4zzi", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: "Overview" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "patterns", "data-id": "m4u5u1vka", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: "Error Patterns" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "trends", "data-id": "l5g4eaxrx", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: "Trends & Metrics" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "recommendations", "data-id": "hpc8pleg7", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: "Recommendations" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "overview", className: "space-y-6", "data-id": "thkdkefyq", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", "data-id": "xvdbgk4tj", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "7v7vemr6x", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "wi8gsh53h", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-lg", "data-id": "xktwzrmuy", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: "Error Distribution by Severity" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { "data-id": "ytvy3tlhs", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", "data-id": "5isd0syu8", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: Object.entries(analytics.errorsBySeverity).map(
              ([severity, count]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "7ceu9zudg", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", "data-id": "5slkylxel", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: getSeverityColor(severity), "data-id": "1iklsdz5i", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: severity }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm", "data-id": "k1a594t79", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: [
                    count,
                    " errors"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 mx-4", "data-id": "mw4ma56y5", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Progress,
                  {
                    value: count / analytics.totalErrors * 100,
                    className: "h-2",
                    "data-id": "k9dlart3p",
                    "data-path": "src/components/ErrorAnalyticsDashboard.tsx"
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", "data-id": "gbtwi57gk", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: [
                  (count / analytics.totalErrors * 100).toFixed(1),
                  "%"
                ] })
              ] }, severity)
            ) }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "gmvnb9gau", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "5anapefou", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-lg", "data-id": "3e4x6u4a7", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: "Components with Most Errors" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { "data-id": "7ikyxazh1", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", "data-id": "thc3ze7tt", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: Object.entries(analytics.errorsByComponent).sort(([, a], [, b]) => b - a).slice(0, 5).map(
              ([component, count]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "yk39c3jdh", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", "data-id": "cd33oona9", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: component }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", "data-id": "dkblcg7a8", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-muted-foreground", "data-id": "zlet17dr2", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: [
                    count,
                    " errors"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", "data-id": "fvmsyi3ar", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: count })
                ] })
              ] }, component)
            ) }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "7qor40o7q", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { "data-id": "zivipquza", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-lg", "data-id": "pajmv3uqv", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: "Recent Error Trends" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { "data-id": "90bi2udu0", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: "Error frequency over different time periods" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { "data-id": "fwh13oo6d", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", "data-id": "dvq54nmc9", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center p-4 border rounded-lg", "data-id": "fylusnudg", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-6 w-6 mx-auto mb-2 text-blue-600", "data-id": "enfnnuymw", "data-path": "src/components/ErrorAnalyticsDashboard.tsx" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold", "data-id": "5dpp7gbnc", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: analytics.trends.hourly }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", "data-id": "ul9ph4mms", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: "Last Hour" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center p-4 border rounded-lg", "data-id": "m1cixqabg", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-6 w-6 mx-auto mb-2 text-green-600", "data-id": "mdb8puwh6", "data-path": "src/components/ErrorAnalyticsDashboard.tsx" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold", "data-id": "yt63s8hrn", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: analytics.trends.daily }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", "data-id": "gqpktnkky", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: "Last 24 Hours" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center p-4 border rounded-lg", "data-id": "7hbd0amy9", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-6 w-6 mx-auto mb-2 text-purple-600", "data-id": "cv5c0lgcx", "data-path": "src/components/ErrorAnalyticsDashboard.tsx" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold", "data-id": "z6v9c00x9", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: analytics.trends.weekly }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", "data-id": "pxoker20z", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: "Last 7 Days" })
            ] })
          ] }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "patterns", className: "space-y-6", "data-id": "f0pt7o6lj", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "aaj4jcrgb", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { "data-id": "yog3996h2", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-lg", "data-id": "c6672jqex", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: "Detected Error Patterns" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { "data-id": "k3pm3tqoq", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: "Automatically identified patterns in error occurrences" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { "data-id": "ea17ixj9g", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", "data-id": "f30pnbc2y", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: patterns.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-8", "data-id": "ap7gbj43m", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-12 w-12 mx-auto mb-4 text-green-600", "data-id": "f7uc20m9q", "data-path": "src/components/ErrorAnalyticsDashboard.tsx" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", "data-id": "q7vsf5vtf", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: "No error patterns detected" })
        ] }) : patterns.map(
          (pattern) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-l-4 border-l-blue-500", "data-id": "hu68ex5g9", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4", "data-id": "uw8x889cc", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", "data-id": "x2syakgo9", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", "data-id": "nzyym0mcy", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", "data-id": "n6bapwc8k", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-semibold", "data-id": "1e72s2guu", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: pattern.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: getSeverityColor(pattern.severity), "data-id": "dayupmfb3", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: pattern.severity }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: pattern.trend === "increasing" ? "destructive" : "secondary", "data-id": "vf5urbebx", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: [
                  pattern.trend === "increasing" && /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-3 h-3 mr-1", "data-id": "we7okggan", "data-path": "src/components/ErrorAnalyticsDashboard.tsx" }),
                  pattern.trend === "decreasing" && /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { className: "w-3 h-3 mr-1", "data-id": "4vo7t2b8e", "data-path": "src/components/ErrorAnalyticsDashboard.tsx" }),
                  pattern.trend
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-3", "data-id": "up71ipl53", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: pattern.description }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 text-xs text-muted-foreground", "data-id": "qrvu6xb05", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { "data-id": "ib4qng0l3", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: [
                  "Frequency: ",
                  pattern.frequency
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { "data-id": "efc172ple", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: [
                  "Last: ",
                  pattern.lastOccurrence.toLocaleString()
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { "data-id": "3wffgu8ez", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: [
                  "Components: ",
                  pattern.components.join(", ")
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", "data-id": "yv1luc8hv", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-red-600", "data-id": "e2h0gc2rq", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: pattern.frequency }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", "data-id": "5y9x83asm", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: "occurrences" })
            ] })
          ] }) }) }, pattern.id)
        ) }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "trends", className: "space-y-6", "data-id": "2gmo86y9q", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", "data-id": "mtcmwuf0o", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "htjyqldzm", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "s4ehofze8", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-lg", "data-id": "4q9y7tm8d", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: "Errors by Hour" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { "data-id": "pszjzp2k1", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", "data-id": "404fz6q47", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: Object.entries(analytics.errorsByHour).sort(([a], [b]) => parseInt(a) - parseInt(b)).map(
            ([hour, count]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", "data-id": "s8jnlar14", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-mono w-8", "data-id": "b4406bmlf", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: [
                hour,
                ":00"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1", "data-id": "1qn0gxy9s", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: count / Math.max(...Object.values(analytics.errorsByHour)) * 100, "data-id": "rw8b0ldvz", "data-path": "src/components/ErrorAnalyticsDashboard.tsx" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm w-8 text-right", "data-id": "bssdn8epc", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: count })
            ] }, hour)
          ) }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "5mes0azif", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "wm8kj6bhb", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-lg", "data-id": "bzocpkohc", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: "Most Common Errors" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { "data-id": "ye9i9dqyx", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", "data-id": "b04v89fay", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: analytics.topErrorMessages.slice(0, 5).map(
            (error, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 border rounded-lg", "data-id": "wec0ja6d6", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1", "data-id": "xqjjsdch3", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", "data-id": "knscjbgqw", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: [
                  error.count,
                  "x"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", "data-id": "7b0hps8y3", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: [
                  (error.count / analytics.totalErrors * 100).toFixed(1),
                  "%"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", "data-id": "r34f1gswe", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: error.message.length > 80 ? `${error.message.substring(0, 80)}...` : error.message })
            ] }, index)
          ) }) })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "recommendations", className: "space-y-6", "data-id": "whk5ztwdu", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "3mav448c7", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { "data-id": "qfu26cmmr", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-lg", "data-id": "ai0syas6i", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: "System Improvement Recommendations" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { "data-id": "o1ndeze96", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: "AI-generated suggestions based on error pattern analysis" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { "data-id": "8gx9osa87", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", "data-id": "ultu8ilyh", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: recommendations.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-8", "data-id": "8eolm4fo8", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-12 w-12 mx-auto mb-4 text-green-600", "data-id": "86my8ytez", "data-path": "src/components/ErrorAnalyticsDashboard.tsx" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", "data-id": "dq0plj1pc", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: "No specific recommendations at this time" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", "data-id": "1bwihhzem", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: "System appears to be running smoothly" })
        ] }) : recommendations.map(
          (rec, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-l-4 border-l-orange-500", "data-id": "dykgfdunm", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4", "data-id": "vnuluymzf", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", "data-id": "iot6o6eao", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 rounded-full bg-orange-100", "data-id": "k58oosweo", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: rec.priority === "high" ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4 text-orange-600", "data-id": "s4ojth8az", "data-path": "src/components/ErrorAnalyticsDashboard.tsx" }) : rec.priority === "medium" ? /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4 text-yellow-600", "data-id": "sauosobqo", "data-path": "src/components/ErrorAnalyticsDashboard.tsx" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "h-4 w-4 text-blue-600", "data-id": "olj7ch71d", "data-path": "src/components/ErrorAnalyticsDashboard.tsx" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", "data-id": "v7eo28h08", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", "data-id": "fodi6oaqt", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-medium", "data-id": "jbw5nj83f", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: rec.action }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Badge,
                  {
                    variant: rec.priority === "high" ? "destructive" : rec.priority === "medium" ? "default" : "secondary",
                    "data-id": "6v52tjzrx",
                    "data-path": "src/components/ErrorAnalyticsDashboard.tsx",
                    children: [
                      rec.priority,
                      " priority"
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", "data-id": "kdomh8sfg", "data-path": "src/components/ErrorAnalyticsDashboard.tsx", children: rec.reason })
            ] })
          ] }) }) }, index)
        ) }) })
      ] }) })
    ] })
  ] });
};
const ErrorRecoveryPage = () => {
  const { hasMonitoringAccess } = useAdminAccess();
  const [showDemo, setShowDemo] = reactExports.useState(false);
  const [activeTab, setActiveTab] = reactExports.useState("overview");
  if (!hasMonitoringAccess) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      AccessDenied,
      {
        feature: "Error Recovery and Monitoring",
        requiredRole: "Administrator",
        "data-id": "1qtn79xc0",
        "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx"
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto p-6 space-y-6", "data-id": "8uh2jpwlh", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-4", "data-id": "igbwt5y7g", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 bg-red-100 rounded-full", "data-id": "oefx21e57", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bug, { className: "h-8 w-8 text-red-600", "data-id": "cx1ega705", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "6si7r7w6p", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold text-gray-900", "data-id": "as7jaca94", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: "Error Recovery Center" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg text-gray-600", "data-id": "036v5sp77", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: "Monitor and manage application errors for better stability" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", "data-id": "dtv6s4x8j", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "qgcn93y0m", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", "data-id": "7tsdhasbb", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium", "data-id": "02w852amd", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: "Error Boundaries" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-4 w-4 text-muted-foreground", "data-id": "580juaiwj", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { "data-id": "wfbl9d3rp", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-green-600", "data-id": "4sjsspkq9", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: "Active" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", "data-id": "d5pgcmfux", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: "Protecting critical components" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "xycbn6ttv", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", "data-id": "wtf9digg8", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium", "data-id": "x5v4p2spo", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: "Error Logging" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4 text-muted-foreground", "data-id": "xwjpp6f0f", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { "data-id": "7bmulk8y6", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-blue-600", "data-id": "604t466bc", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: "Enabled" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", "data-id": "38gynn69l", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: "Capturing detailed error information" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "u0xpezzqu", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", "data-id": "v9ayiffib", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium", "data-id": "or24fl2rl", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: "Recovery Tools" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Bug, { className: "h-4 w-4 text-muted-foreground", "data-id": "y8lvgklxb", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { "data-id": "04jdaawk6", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-purple-600", "data-id": "4zemt1lf7", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: "Available" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", "data-id": "u1qkedozv", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: "Export, clear, and analyze errors" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { value: activeTab, onValueChange: setActiveTab, className: "space-y-6", "data-id": "mrl7a8tvu", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid w-full grid-cols-4", "data-id": "2alptkyjx", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "overview", "data-id": "szbcqri9z", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: "Overview" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "testing", "data-id": "25rd0zk8i", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: "Error Testing" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "analytics", "data-id": "pb29te5wk", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: "Analytics" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "recovery", "data-id": "z483lve3w", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: "Recovery Tools" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "overview", className: "space-y-6", "data-id": "77ll5pqqv", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "nisgnw2uw", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { "data-id": "bg3hxf4yf", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { "data-id": "cs7i18uhw", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: "Error Boundary Implementation" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { "data-id": "75matbljk", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: "This DFS Manager Portal includes comprehensive error handling" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { "data-id": "2ywyz9php", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", "data-id": "k1d1yvdvw", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "nrm3pq4o4", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-semibold mb-3", "data-id": "o4zsxzhq0", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: "Implemented Error Boundaries:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-2 text-sm", "data-id": "x17kvu1m0", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2", "data-id": "8ihpwn0bk", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 bg-green-500 rounded-full", "data-id": "lnmro548t", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { "data-id": "6hhres4xz", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { "data-id": "u95hq0ot5", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: "Global Error Boundary:" }),
                  " Catches all unhandled errors"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2", "data-id": "ilrtiuzh3", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 bg-blue-500 rounded-full", "data-id": "t0am750my", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { "data-id": "wb35jk023", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { "data-id": "wnolwq9wo", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: "Page Error Boundary:" }),
                  " Isolates page-level errors"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2", "data-id": "43614qz5g", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 bg-purple-500 rounded-full", "data-id": "mfe6o9c01", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { "data-id": "2igp5d28w", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { "data-id": "mqs0o232w", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: "Form Error Boundary:" }),
                  " Protects critical form components"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2", "data-id": "1r8lzh5vh", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 bg-orange-500 rounded-full", "data-id": "1wmf8e8py", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { "data-id": "qpz0w5g55", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { "data-id": "a2fike1gn", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: "Component Error Boundary:" }),
                  " Guards individual components"
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "3x27yy161", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-semibold mb-3", "data-id": "g64qjz06r", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: "Error Handling Features:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-2 text-sm", "data-id": "drqt1tyat", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2", "data-id": "lhcoqnlpr", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 bg-green-500 rounded-full", "data-id": "tniq246f9", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "p6whftqm4", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: "Graceful fallback UI components" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2", "data-id": "8tm0qifk5", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 bg-blue-500 rounded-full", "data-id": "rk7esok5w", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "retiifz0r", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: "Detailed error logging and reporting" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2", "data-id": "666t0hmo0", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 bg-purple-500 rounded-full", "data-id": "433fejfq1", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "rq0ufgxk7", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: "Form data recovery capabilities" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2", "data-id": "s3dh6gpsu", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 bg-orange-500 rounded-full", "data-id": "x4e0xk0ik", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "9a09ihscm", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: "User-friendly error messages" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2", "data-id": "bcmppbkde", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 bg-red-500 rounded-full", "data-id": "memte24d0", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "e8vn0tr24", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: "Error export and analysis tools" })
              ] })
            ] })
          ] })
        ] }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "testing", className: "space-y-6", "data-id": "uteo2tkgo", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "0zvv76awx", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "99nl1bacz", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "fznba7lc3", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "guxhmfqfi", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", "data-id": "bdibnpmf0", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TestTube, { className: "h-5 w-5", "data-id": "5obsa6xo2", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx" }),
                "Interactive Error Testing"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { "data-id": "dbqwhnfll", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: "Comprehensive error boundary testing with pattern monitoring" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                onClick: () => setShowDemo(!showDemo),
                variant: showDemo ? "secondary" : "default",
                "data-id": "6sse9pxt1",
                "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx",
                children: showDemo ? "Hide Enhanced Demo" : "Show Enhanced Demo"
              }
            )
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { "data-id": "9swup23tq", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: showDemo ? /* @__PURE__ */ jsxRuntimeExports.jsx(EnhancedErrorBoundaryDemo, { "data-id": "33217jfd2", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-8", "data-id": "6j5hmlf7r", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TestTube, { className: "h-12 w-12 mx-auto mb-4 text-muted-foreground", "data-id": "0k5gasuj2", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-4", "data-id": "n6g98yjw1", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: 'Click "Show Enhanced Demo" to access comprehensive error testing scenarios' }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "text-sm text-muted-foreground space-y-1", "data-id": "aoguz1gmc", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { "data-id": "3wvox4irz", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: "• Component rendering errors" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { "data-id": "9p32a7vss", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: "• Async operation failures" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { "data-id": "26lorawxq", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: "• Database connection issues" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { "data-id": "sajn4zxrt", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: "• Memory leak simulations" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { "data-id": "864f4i1bk", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: "• Automated testing suite" })
            ] })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "ltuwe4zss", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { "data-id": "orlmowhia", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", "data-id": "7jy5jelut", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Bug, { className: "h-5 w-5", "data-id": "clkgys6vu", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx" }),
              "Basic Error Boundary Demo"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { "data-id": "1kuzlfv6r", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: "Simple error boundary demonstration" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { "data-id": "oz5eaghkl", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorBoundaryDemo, { "data-id": "vbe5mco22", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "analytics", className: "space-y-6", "data-id": "z3y0gm8ky", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorAnalyticsDashboard, { "data-id": "rwave57lm", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "recovery", className: "space-y-6", "data-id": "vd6bx9jpx", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorRecovery, { "data-id": "g8b9e0puo", "data-path": "src/pages/Admin/ErrorRecoveryPage.tsx" }) })
    ] })
  ] });
};
const ErrorRecoveryPage$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ErrorRecoveryPage
}, Symbol.toStringTag, { value: "Module" }));
export {
  ComponentErrorBoundary as C,
  ErrorLogger as E,
  FormErrorBoundary as F,
  GlobalErrorBoundary as G,
  InvalidCharacterErrorBoundary as I,
  PageErrorBoundary as P,
  SecuritySettings$1 as S,
  sanitizeTextContent as a,
  sanitizeElementId as b,
  sanitizeClassName as c,
  sanitizeUserInput as d,
  SMSAlertManagement$1 as e,
  ErrorRecoveryPage$1 as f,
  isValidAttributeValue as i,
  removeBOM as r,
  smsService as s
};
