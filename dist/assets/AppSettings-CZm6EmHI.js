import { r as reactExports, j as jsxRuntimeExports, u as useNavigate } from "./react-vendor-DX0Gaxph.js";
import { X as cn, u as useToast, C as Card, d as CardHeader, e as CardTitle, l as Badge, g as CardContent, L as Label, n as Switch, B as Button } from "./admin-core-DFYqoWCM.js";
import { bO as Root, bP as Track, bQ as Range, bR as Thumb, a5 as Zap, a2 as Settings, aG as Save, aE as RotateCcw, bs as Upload, bS as FileImage, X, l as Check, bp as TrendingDown, J as ArrowLeft, M as Database, aJ as Bell, F as Shield } from "./ui-components-E8Qujiw2.js";
import { i as isImageFile, f as formatFileSize, c as compressImage } from "./business-pages-DR8LlJyO.js";
import "./vendor-ChWeSoXy.js";
import "./aws-sdk-DF6-bWA6.js";
import "./supabase-DWlqU2OS.js";
import "./admin-security-CWSw-PzD.js";
import "./animations-DEJKylty.js";
const Slider = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  Root,
  {
    ref,
    className: cn(
      "relative flex w-full touch-none select-none items-center",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Track, { className: "relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Range, { className: "absolute h-full bg-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Thumb, { className: "block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" })
    ]
  }
));
Slider.displayName = Root.displayName;
const DEFAULT_SETTINGS = {
  enabled: true,
  maxSizeMB: 1,
  quality: 0.8,
  maxResolution: 1920,
  autoCompress: true
};
const ImageCompressionSettings = ({
  className = "",
  onSettingsChange
}) => {
  const [settings, setSettings] = reactExports.useState(DEFAULT_SETTINGS);
  const [hasChanges, setHasChanges] = reactExports.useState(false);
  const { toast } = useToast();
  reactExports.useEffect(() => {
    const savedSettings = localStorage.getItem("imageCompressionSettings");
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      } catch (error) {
        console.error("Failed to load compression settings:", error);
      }
    }
  }, []);
  reactExports.useEffect(() => {
    const savedSettings = localStorage.getItem("imageCompressionSettings");
    const currentSettings = JSON.stringify(settings);
    const originalSettings = savedSettings || JSON.stringify(DEFAULT_SETTINGS);
    setHasChanges(currentSettings !== originalSettings);
  }, [settings]);
  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };
  const saveSettings = () => {
    try {
      localStorage.setItem("imageCompressionSettings", JSON.stringify(settings));
      onSettingsChange == null ? void 0 : onSettingsChange(settings);
      setHasChanges(false);
      toast({
        title: "Settings Saved",
        description: "Image compression settings have been updated successfully."
      });
    } catch (error) {
      console.error("Failed to save settings:", error);
      toast({
        title: "Failed to Save",
        description: "Could not save compression settings.",
        variant: "destructive"
      });
    }
  };
  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    toast({
      title: "Settings Reset",
      description: "Compression settings have been reset to defaults."
    });
  };
  const qualityPercentage = Math.round(settings.quality * 100);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className, "data-id": "xj2j2v9z5", "data-path": "src/components/ImageCompressionSettings.tsx", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "26fh75al8", "data-path": "src/components/ImageCompressionSettings.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", "data-id": "bfzxrmky5", "data-path": "src/components/ImageCompressionSettings.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-5 w-5 text-blue-600", "data-id": "rbtbsibr4", "data-path": "src/components/ImageCompressionSettings.tsx" }),
      "Image Compression Settings",
      settings.enabled && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "default", className: "ml-2", "data-id": "5gs6l2fqb", "data-path": "src/components/ImageCompressionSettings.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "h-3 w-3 mr-1", "data-id": "gq9uoar6o", "data-path": "src/components/ImageCompressionSettings.tsx" }),
        "Active"
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-6", "data-id": "31haonsv7", "data-path": "src/components/ImageCompressionSettings.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "ltkjvvhy1", "data-path": "src/components/ImageCompressionSettings.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", "data-id": "sh1s74gp7", "data-path": "src/components/ImageCompressionSettings.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-base", "data-id": "nrwtpd44k", "data-path": "src/components/ImageCompressionSettings.tsx", children: "Enable Auto-Compression" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-600", "data-id": "3rbywx7t8", "data-path": "src/components/ImageCompressionSettings.tsx", children: "Automatically compress large images during upload" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Switch,
          {
            checked: settings.enabled,
            onCheckedChange: (checked) => updateSetting("enabled", checked),
            "data-id": "flr23n74q",
            "data-path": "src/components/ImageCompressionSettings.tsx"
          }
        )
      ] }),
      settings.enabled && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", "data-id": "dyla9pt5u", "data-path": "src/components/ImageCompressionSettings.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "yel82qok1", "data-path": "src/components/ImageCompressionSettings.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { "data-id": "cs2a1py6n", "data-path": "src/components/ImageCompressionSettings.tsx", children: "Compression Threshold" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", "data-id": "78dyxtha5", "data-path": "src/components/ImageCompressionSettings.tsx", children: [
              settings.maxSizeMB,
              "MB"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Slider,
            {
              value: [settings.maxSizeMB],
              onValueChange: ([value]) => updateSetting("maxSizeMB", value),
              max: 10,
              min: 0.5,
              step: 0.5,
              className: "w-full",
              "data-id": "q1qmvtqq0",
              "data-path": "src/components/ImageCompressionSettings.tsx"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-600", "data-id": "xmk3zj8go", "data-path": "src/components/ImageCompressionSettings.tsx", children: "Images larger than this size will be compressed" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", "data-id": "zyyt0t8im", "data-path": "src/components/ImageCompressionSettings.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "d2nk887fd", "data-path": "src/components/ImageCompressionSettings.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { "data-id": "559bwkd8w", "data-path": "src/components/ImageCompressionSettings.tsx", children: "Compression Quality" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", "data-id": "tw6a0coh0", "data-path": "src/components/ImageCompressionSettings.tsx", children: [
              qualityPercentage,
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Slider,
            {
              value: [settings.quality],
              onValueChange: ([value]) => updateSetting("quality", value),
              max: 1,
              min: 0.1,
              step: 0.1,
              className: "w-full",
              "data-id": "r9nnye8or",
              "data-path": "src/components/ImageCompressionSettings.tsx"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-600", "data-id": "vs4cs9juf", "data-path": "src/components/ImageCompressionSettings.tsx", children: "Higher quality means larger file sizes" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", "data-id": "98tiyvus1", "data-path": "src/components/ImageCompressionSettings.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "o7gdn1mrd", "data-path": "src/components/ImageCompressionSettings.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { "data-id": "dq077lxd2", "data-path": "src/components/ImageCompressionSettings.tsx", children: "Maximum Resolution" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", "data-id": "eqnp7h0r8", "data-path": "src/components/ImageCompressionSettings.tsx", children: [
              settings.maxResolution,
              "px"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Slider,
            {
              value: [settings.maxResolution],
              onValueChange: ([value]) => updateSetting("maxResolution", value),
              max: 4096,
              min: 720,
              step: 240,
              className: "w-full",
              "data-id": "o44t3ohtt",
              "data-path": "src/components/ImageCompressionSettings.tsx"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-600", "data-id": "nmwco0bbs", "data-path": "src/components/ImageCompressionSettings.tsx", children: "Maximum width or height for compressed images" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "2vo15gsh0", "data-path": "src/components/ImageCompressionSettings.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", "data-id": "71r817yvi", "data-path": "src/components/ImageCompressionSettings.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { "data-id": "ywkgc287i", "data-path": "src/components/ImageCompressionSettings.tsx", children: "Auto-compress All Images" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-600", "data-id": "c6aw023kw", "data-path": "src/components/ImageCompressionSettings.tsx", children: "Compress all images regardless of size" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Switch,
            {
              checked: settings.autoCompress,
              onCheckedChange: (checked) => updateSetting("autoCompress", checked),
              "data-id": "go6aglwwm",
              "data-path": "src/components/ImageCompressionSettings.tsx"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-gray-50 rounded-lg", "data-id": "8qabtpxov", "data-path": "src/components/ImageCompressionSettings.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-medium mb-2", "data-id": "eou98vxg9", "data-path": "src/components/ImageCompressionSettings.tsx", children: "Current Settings Summary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 text-xs text-gray-600", "data-id": "4426he896", "data-path": "src/components/ImageCompressionSettings.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { "data-id": "79u3sefqj", "data-path": "src/components/ImageCompressionSettings.tsx", children: [
            "Status: ",
            settings.enabled ? "Enabled" : "Disabled"
          ] }),
          settings.enabled && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { "data-id": "k5gqipb8v", "data-path": "src/components/ImageCompressionSettings.tsx", children: [
              "Threshold: Images over ",
              settings.maxSizeMB,
              "MB will be compressed"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { "data-id": "stf01jhme", "data-path": "src/components/ImageCompressionSettings.tsx", children: [
              "Quality: ",
              qualityPercentage,
              "% (balance of quality vs. file size)"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { "data-id": "0n5twu4tu", "data-path": "src/components/ImageCompressionSettings.tsx", children: [
              "Max Resolution: ",
              settings.maxResolution,
              "px (width or height)"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { "data-id": "v3hytj3ft", "data-path": "src/components/ImageCompressionSettings.tsx", children: [
              "Auto-compress: ",
              settings.autoCompress ? "All images" : "Large images only"
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", "data-id": "ia2rljsbn", "data-path": "src/components/ImageCompressionSettings.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: saveSettings,
            disabled: !hasChanges,
            className: "flex-1",
            "data-id": "odhv900ka",
            "data-path": "src/components/ImageCompressionSettings.tsx",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-4 w-4 mr-2", "data-id": "kprag1kmi", "data-path": "src/components/ImageCompressionSettings.tsx" }),
              "Save Settings"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            onClick: resetSettings,
            "data-id": "9sr3xbsvt",
            "data-path": "src/components/ImageCompressionSettings.tsx",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "h-4 w-4 mr-2", "data-id": "kr34hpxuf", "data-path": "src/components/ImageCompressionSettings.tsx" }),
              "Reset"
            ]
          }
        )
      ] })
    ] })
  ] });
};
const CompressionDemo = ({ className = "" }) => {
  const [isCompressing, setIsCompressing] = reactExports.useState(false);
  const [compressionResult, setCompressionResult] = reactExports.useState(null);
  const [selectedFile, setSelectedFile] = reactExports.useState(null);
  const { toast } = useToast();
  const handleFileSelect = (event) => {
    var _a;
    const file = (_a = event.target.files) == null ? void 0 : _a[0];
    if (file) {
      setSelectedFile(file);
      setCompressionResult(null);
    }
  };
  const handleCompress = async () => {
    if (!selectedFile) return;
    setIsCompressing(true);
    try {
      const result = await compressImage(selectedFile, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        quality: 0.8
      });
      setCompressionResult(result);
      if (result.wasCompressed) {
        toast({
          title: "Compression Complete!",
          description: `File size reduced by ${((1 - result.compressedSize / result.originalSize) * 100).toFixed(1)}%`
        });
      } else {
        toast({
          title: "No compression needed",
          description: "File was already optimized or not an image",
          variant: "default"
        });
      }
    } catch (error) {
      console.error("Compression failed:", error);
      toast({
        title: "Compression failed",
        description: "Could not compress the image",
        variant: "destructive"
      });
    } finally {
      setIsCompressing(false);
    }
  };
  const resetDemo = () => {
    setSelectedFile(null);
    setCompressionResult(null);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className, "data-id": "xsr6sn7vv", "data-path": "src/components/CompressionDemo.tsx", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "m4u45o777", "data-path": "src/components/CompressionDemo.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", "data-id": "ow31lr7ow", "data-path": "src/components/CompressionDemo.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-5 w-5 text-blue-600", "data-id": "nzjrza5ww", "data-path": "src/components/CompressionDemo.tsx" }),
      "Compression Demo"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-4", "data-id": "loymnlpnn", "data-path": "src/components/CompressionDemo.tsx", children: !selectedFile ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-2 border-dashed border-gray-300 rounded-lg p-6 text-center", "data-id": "8jcmvfuu5", "data-path": "src/components/CompressionDemo.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", "data-id": "riv21ug7v", "data-path": "src/components/CompressionDemo.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-8 w-8 mx-auto text-gray-400", "data-id": "2rvarlw89", "data-path": "src/components/CompressionDemo.tsx" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "fu9b36vc2", "data-path": "src/components/CompressionDemo.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-gray-700", "data-id": "jm218ss1m", "data-path": "src/components/CompressionDemo.tsx", children: "Select an image to test compression" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500", "data-id": "y3wkvcpkt", "data-path": "src/components/CompressionDemo.tsx", children: "Choose a large image file (>1MB) to see compression in action" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "cursor-pointer", "data-id": "4fe82lx4t", "data-path": "src/components/CompressionDemo.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "file",
            accept: "image/*",
            onChange: handleFileSelect,
            className: "hidden",
            "data-id": "u1wkalqyw",
            "data-path": "src/components/CompressionDemo.tsx"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", className: "mt-2", "data-id": "70r3nh7yf", "data-path": "src/components/CompressionDemo.tsx", children: "Choose File" })
      ] })
    ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", "data-id": "3142hddgy", "data-path": "src/components/CompressionDemo.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-gray-50 rounded-lg", "data-id": "vfnirllt1", "data-path": "src/components/CompressionDemo.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "ygqa9cmre", "data-path": "src/components/CompressionDemo.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", "data-id": "nhtans5n9", "data-path": "src/components/CompressionDemo.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FileImage, { className: "h-4 w-4 text-blue-600", "data-id": "nj3ufjjd0", "data-path": "src/components/CompressionDemo.tsx" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium truncate", "data-id": "q7s6hzeyq", "data-path": "src/components/CompressionDemo.tsx", children: selectedFile.name })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", onClick: resetDemo, "data-id": "brqc8pldv", "data-path": "src/components/CompressionDemo.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4", "data-id": "5h3autwzn", "data-path": "src/components/CompressionDemo.tsx" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center gap-4 text-xs text-gray-600", "data-id": "09lkit8vd", "data-path": "src/components/CompressionDemo.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { "data-id": "dvn3e7gzo", "data-path": "src/components/CompressionDemo.tsx", children: [
            "Size: ",
            formatFileSize(selectedFile.size)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { "data-id": "540wumcwx", "data-path": "src/components/CompressionDemo.tsx", children: [
            "Type: ",
            selectedFile.type
          ] }),
          isImageFile(selectedFile) && selectedFile.size > 1024 * 1024 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "text-xs", "data-id": "1xzyz8a2p", "data-path": "src/components/CompressionDemo.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-3 w-3 mr-1", "data-id": "p5rk3ria2", "data-path": "src/components/CompressionDemo.tsx" }),
            "Will be compressed"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: handleCompress,
          disabled: isCompressing,
          className: "w-full",
          "data-id": "763g6d1jk",
          "data-path": "src/components/CompressionDemo.tsx",
          children: isCompressing ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2", "data-id": "2dtwdgvjd", "data-path": "src/components/CompressionDemo.tsx" }),
            "Compressing..."
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-4 w-4 mr-2", "data-id": "ts1umxfc5", "data-path": "src/components/CompressionDemo.tsx" }),
            "Test Compression"
          ] })
        }
      ),
      compressionResult && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", "data-id": "0e2tqao00", "data-path": "src/components/CompressionDemo.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", "data-id": "byzdhdokb", "data-path": "src/components/CompressionDemo.tsx", children: [
          compressionResult.wasCompressed ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-5 w-5 text-green-600", "data-id": "xfm8i9su5", "data-path": "src/components/CompressionDemo.tsx" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(FileImage, { className: "h-5 w-5 text-blue-600", "data-id": "49rkozvks", "data-path": "src/components/CompressionDemo.tsx" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-sm", "data-id": "dufmaegg1", "data-path": "src/components/CompressionDemo.tsx", children: compressionResult.wasCompressed ? "Compression Complete" : "No Compression Needed" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 text-sm", "data-id": "zbba7xvp0", "data-path": "src/components/CompressionDemo.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "pzz8kmnxq", "data-path": "src/components/CompressionDemo.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-600", "data-id": "q9iraffem", "data-path": "src/components/CompressionDemo.tsx", children: "Original Size" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", "data-id": "78u0pgcti", "data-path": "src/components/CompressionDemo.tsx", children: formatFileSize(compressionResult.originalSize) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "9arypm99w", "data-path": "src/components/CompressionDemo.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-600", "data-id": "dpctysao0", "data-path": "src/components/CompressionDemo.tsx", children: "Final Size" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", "data-id": "bxuf0d1hj", "data-path": "src/components/CompressionDemo.tsx", children: formatFileSize(compressionResult.compressedSize) })
          ] })
        ] }),
        compressionResult.wasCompressed && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-green-50 rounded-lg", "data-id": "ubtfx1jx4", "data-path": "src/components/CompressionDemo.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-green-800", "data-id": "awpsemh4t", "data-path": "src/components/CompressionDemo.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { className: "h-4 w-4", "data-id": "vxhrcavgr", "data-path": "src/components/CompressionDemo.tsx" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium", "data-id": "ow1cschc5", "data-path": "src/components/CompressionDemo.tsx", children: [
              ((1 - compressionResult.compressedSize / compressionResult.originalSize) * 100).toFixed(1),
              "% reduction"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-green-700 mt-1", "data-id": "owny9aykl", "data-path": "src/components/CompressionDemo.tsx", children: [
            "Saved ",
            formatFileSize(compressionResult.originalSize - compressionResult.compressedSize),
            " of storage space"
          ] })
        ] })
      ] })
    ] }) })
  ] });
};
const AppSettings = () => {
  const navigate = useNavigate();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-id": "jrimbwgiq", "data-path": "src/pages/Settings/AppSettings.tsx", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", "data-id": "6f4xib8ua", "data-path": "src/pages/Settings/AppSettings.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: () => navigate("/dashboard"),
          className: "flex items-center gap-2",
          "data-id": "hc8c877kp",
          "data-path": "src/pages/Settings/AppSettings.tsx",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4", "data-id": "q5wqlmnv4", "data-path": "src/pages/Settings/AppSettings.tsx" }),
            "Back to Dashboard"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "jsageh2k0", "data-path": "src/pages/Settings/AppSettings.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold text-gray-900", "data-id": "tr5pmwu9n", "data-path": "src/pages/Settings/AppSettings.tsx", children: "App Settings" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-600", "data-id": "2svtbop23", "data-path": "src/pages/Settings/AppSettings.tsx", children: "Configure system preferences and optimize performance" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-4 gap-6", "data-id": "zy3toji9h", "data-path": "src/pages/Settings/AppSettings.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "xl:col-span-2", "data-id": "fbby74pgg", "data-path": "src/pages/Settings/AppSettings.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ImageCompressionSettings, { "data-id": "vjldtilid", "data-path": "src/pages/Settings/AppSettings.tsx" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "xl:col-span-1", "data-id": "kwwcr2wx3", "data-path": "src/pages/Settings/AppSettings.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CompressionDemo, { "data-id": "8yv5sthlv", "data-path": "src/pages/Settings/AppSettings.tsx" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "xl:col-span-1 space-y-4", "data-id": "1hzjuamt5", "data-path": "src/pages/Settings/AppSettings.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "2om41xro5", "data-path": "src/pages/Settings/AppSettings.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "i9b6btm0m", "data-path": "src/pages/Settings/AppSettings.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-lg flex items-center gap-2", "data-id": "4idvpbh9v", "data-path": "src/pages/Settings/AppSettings.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-5 w-5 text-blue-600", "data-id": "5hdhm3jrv", "data-path": "src/pages/Settings/AppSettings.tsx" }),
            "About Image Compression"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3", "data-id": "hwk2v33f8", "data-path": "src/pages/Settings/AppSettings.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-gray-600 space-y-2", "data-id": "jvwy1fi7u", "data-path": "src/pages/Settings/AppSettings.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { "data-id": "t0rd7auh9", "data-path": "src/pages/Settings/AppSettings.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { "data-id": "fsux5nztl", "data-path": "src/pages/Settings/AppSettings.tsx", children: "Automatic compression" }),
                " helps reduce file sizes for faster uploads and better storage efficiency."
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { "data-id": "euc3800tf", "data-path": "src/pages/Settings/AppSettings.tsx", children: "Large images are automatically optimized while maintaining visual quality, making your application faster and more responsive." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "bed1htnct", "data-path": "src/pages/Settings/AppSettings.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-medium text-sm", "data-id": "x49jqdopx", "data-path": "src/pages/Settings/AppSettings.tsx", children: "Benefits:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "text-xs text-gray-600 space-y-1", "data-id": "t8vwbph0z", "data-path": "src/pages/Settings/AppSettings.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { "data-id": "3f6s44yhn", "data-path": "src/pages/Settings/AppSettings.tsx", children: "• Faster upload times" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { "data-id": "uwi06kuym", "data-path": "src/pages/Settings/AppSettings.tsx", children: "• Reduced bandwidth usage" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { "data-id": "fjdgsebnn", "data-path": "src/pages/Settings/AppSettings.tsx", children: "• Better storage efficiency" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { "data-id": "pahz3vkhp", "data-path": "src/pages/Settings/AppSettings.tsx", children: "• Improved app performance" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { "data-id": "6wgbctfkp", "data-path": "src/pages/Settings/AppSettings.tsx", children: "• Maintained image quality" })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "li2jwgufe", "data-path": "src/pages/Settings/AppSettings.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "5592hy0af", "data-path": "src/pages/Settings/AppSettings.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-lg flex items-center gap-2", "data-id": "b8f95bpze", "data-path": "src/pages/Settings/AppSettings.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Database, { className: "h-5 w-5 text-green-600", "data-id": "j29wj6p05", "data-path": "src/pages/Settings/AppSettings.tsx" }),
            "Compression Stats"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { "data-id": "07xprbhwj", "data-path": "src/pages/Settings/AppSettings.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", "data-id": "ax5t95qgt", "data-path": "src/pages/Settings/AppSettings.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", "data-id": "3m57pbe3e", "data-path": "src/pages/Settings/AppSettings.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-gray-600", "data-id": "3vvwqkoi0", "data-path": "src/pages/Settings/AppSettings.tsx", children: "Files Compressed Today" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", "data-id": "6cxhvcthj", "data-path": "src/pages/Settings/AppSettings.tsx", children: "0" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", "data-id": "t0bjph6bi", "data-path": "src/pages/Settings/AppSettings.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-gray-600", "data-id": "c1lqjxt44", "data-path": "src/pages/Settings/AppSettings.tsx", children: "Storage Saved" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", "data-id": "kk6cqt4yf", "data-path": "src/pages/Settings/AppSettings.tsx", children: "0 MB" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", "data-id": "8oxo0s8kh", "data-path": "src/pages/Settings/AppSettings.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-gray-600", "data-id": "djr7btum7", "data-path": "src/pages/Settings/AppSettings.tsx", children: "Average Compression" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", "data-id": "z9y7nijz6", "data-path": "src/pages/Settings/AppSettings.tsx", children: "N/A" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500 mt-3", "data-id": "5s2i2xizg", "data-path": "src/pages/Settings/AppSettings.tsx", children: "Statistics will update as you upload and compress images." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "tf71npsma", "data-path": "src/pages/Settings/AppSettings.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "w677sp0my", "data-path": "src/pages/Settings/AppSettings.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-lg flex items-center gap-2", "data-id": "4evc242iq", "data-path": "src/pages/Settings/AppSettings.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "h-5 w-5 text-purple-600", "data-id": "6phtkdbxp", "data-path": "src/pages/Settings/AppSettings.tsx" }),
            "Quick Actions"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3", "data-id": "05j1bjci8", "data-path": "src/pages/Settings/AppSettings.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "w-full text-sm", disabled: true, "data-id": "wp5f11ouw", "data-path": "src/pages/Settings/AppSettings.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-4 w-4 mr-2", "data-id": "s7i3exmml", "data-path": "src/pages/Settings/AppSettings.tsx" }),
              "Notification Settings",
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "ml-auto", "data-id": "1h86fqago", "data-path": "src/pages/Settings/AppSettings.tsx", children: "Soon" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "w-full text-sm", disabled: true, "data-id": "n63sbczbd", "data-path": "src/pages/Settings/AppSettings.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-4 w-4 mr-2", "data-id": "ccfrucanu", "data-path": "src/pages/Settings/AppSettings.tsx" }),
              "Security Settings",
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "ml-auto", "data-id": "9zevwnl3u", "data-path": "src/pages/Settings/AppSettings.tsx", children: "Soon" })
            ] })
          ] })
        ] })
      ] })
    ] })
  ] });
};
export {
  AppSettings as default
};
