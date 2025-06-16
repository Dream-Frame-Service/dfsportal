import { j as jsxRuntimeExports } from "./ui-BAZ8HTBl.js";
import { r as reactExports } from "./vendor-Dw3NhmYV.js";
import { c as createLucideIcon, u as useToast, B as Button, C as Card, f as CardContent, h as Badge, X } from "./index-xgH9wc9T.js";
import { D as Dialog, f as DialogTrigger, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./dialog-sqCJez4p.js";
import { U as Upload, C as Camera } from "./textarea-DRj8ZshS.js";
import { L as Loader2 } from "./loader-2-HgtsHnjl.js";
import { Z as Zap } from "./zap-DmPuvH7U.js";
import { C as Check } from "./select-D7v6NG_6.js";
import { R as RotateCcw } from "./rotate-ccw-jweaWBVI.js";
import { F as FileText } from "./file-text-DwQmg6EU.js";
/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Image$1 = createLucideIcon("Image", [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", ry: "2", key: "1m3agn" }],
  ["circle", { cx: "9", cy: "9", r: "2", key: "af1f0g" }],
  ["path", { d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21", key: "1xmnt7" }]
]);
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
  const { toast } = useToast();
  const isImageUpload = accept.includes("image");
  const shouldShowCamera = allowCamera && isImageUpload;
  const validateFile = (file) => {
    if (file.size > maxSize * 1024 * 1024) {
      toast({
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
        toast({
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
          toast({
            title: "Image compressed",
            description: `File size reduced from ${formatFileSize(result.originalSize)} to ${formatFileSize(result.compressedSize)} (${result.compressionRatio.toFixed(1)}x smaller)`,
            duration: 5e3
          });
        }
        onFileSelect(result.file);
        setIsOpen(false);
      } catch (error) {
        console.error("Compression failed:", error);
        toast({
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
      toast({
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
      toast({
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
            toast({
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
            /* @__PURE__ */ jsxRuntimeExports.jsx(Loader2, { className: "h-5 w-5 animate-spin text-blue-600", "data-id": "3bbqg8m6o", "data-path": "src/components/EnhancedFileUpload.tsx" }),
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
export {
  EnhancedFileUpload as E
};
//# sourceMappingURL=EnhancedFileUpload-BSPINCtR.js.map
