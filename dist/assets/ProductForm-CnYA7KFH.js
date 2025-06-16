var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { j as jsxRuntimeExports } from "./ui-BAZ8HTBl.js";
import { r as reactExports, u as useNavigate, i as useParams } from "./vendor-Dw3NhmYV.js";
import { c as createLucideIcon, E as ErrorLogger, C as Card, f as CardContent, k as AlertTriangle, B as Button, R as RefreshCw, b as CardHeader, d as CardTitle, A as Alert, g as AlertDescription, u as useToast, X, s as supabase, i as ArrowLeft, T as Table, n as TableHeader, o as TableRow, p as TableHead, q as TableBody, r as TableCell, h as Badge, e as CardDescription } from "./index-BDkJIub7.js";
import { I as Input } from "./input-DuAIOXAd.js";
import { C as Camera, U as Upload, N as NumberInput, T as Textarea } from "./textarea-BEpdesu_.js";
import { L as Label } from "./label-BCreZRAD.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-D861dQsx.js";
import { D as Dialog, f as DialogTrigger, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription } from "./dialog-DQTKpYge.js";
import { u as useAuth } from "./AuthContext-CGZTrpGt.js";
import { S as Save } from "./save-BO5WkKD5.js";
import { S as Separator } from "./separator-CPMoODEa.js";
import { D as Download } from "./download-BZweFUX8.js";
import { D as DollarSign } from "./dollar-sign-BipQ1WW8.js";
/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Calculator = createLucideIcon("Calculator", [
  ["rect", { width: "16", height: "20", x: "4", y: "2", rx: "2", key: "1nb95v" }],
  ["line", { x1: "8", x2: "16", y1: "6", y2: "6", key: "x4nwl0" }],
  ["line", { x1: "16", x2: "16", y1: "14", y2: "18", key: "wjye3r" }],
  ["path", { d: "M16 10h.01", key: "1m94wz" }],
  ["path", { d: "M12 10h.01", key: "1nrarc" }],
  ["path", { d: "M8 10h.01", key: "19clt8" }],
  ["path", { d: "M12 14h.01", key: "1etili" }],
  ["path", { d: "M8 14h.01", key: "6423bh" }],
  ["path", { d: "M12 18h.01", key: "mhygvu" }],
  ["path", { d: "M8 18h.01", key: "lrp35t" }]
]);
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
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center text-red-600", "data-id": "gaz6exm82", "data-path": "src/components/ErrorBoundary/ComponentErrorBoundary.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AlertTriangle, { size: 24, "data-id": "gkfcithgp", "data-path": "src/components/ErrorBoundary/ComponentErrorBoundary.tsx" }) }),
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
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertTriangle, { size: 20, "data-id": "krsr4xyy3", "data-path": "src/components/ErrorBoundary/FormErrorBoundary.tsx" }),
          "Form Error Detected"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", "data-id": "p0jb9ivwp", "data-path": "src/components/ErrorBoundary/FormErrorBoundary.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { className: "border-red-300 bg-red-100", "data-id": "x107yl2ul", "data-path": "src/components/ErrorBoundary/FormErrorBoundary.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertTriangle, { className: "h-4 w-4", "data-id": "qy5uoxuev", "data-path": "src/components/ErrorBoundary/FormErrorBoundary.tsx" }),
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
const useErrorHandler = (options = {}) => {
  const { toast } = useToast();
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
      toast({
        variant: "destructive",
        title: "Error",
        description: customMessage || errorObj.message || "An unexpected error occurred"
      });
    }
  }, [component, showToast, logError, severity, toast, errorLogger]);
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
  const { toast } = useToast();
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
        toast({
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
  const { toast } = useToast();
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
      toast({
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
    toast({
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
        toast({
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
      toast({
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
        toast({
          title: "Import Complete",
          description: `Successfully imported ${successCount} products. ${errorCount > 0 ? `${errorCount} errors occurred.` : ""}`
        });
      } else {
        toast({
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
      toast({
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
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Product name is required."
      });
      return;
    }
    if (!userProfile) {
      toast({
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
      toast({
        title: "Success",
        description: `Product ${isEdit ? "updated" : "created"} successfully.`
      });
      navigate("/products");
    } catch (error) {
      console.error("Error saving product:", error);
      toast({
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
export {
  ProductForm as default
};
//# sourceMappingURL=ProductForm-CnYA7KFH.js.map
