import { j as jsxRuntimeExports, r as reactExports } from "./react-vendor-DX0Gaxph.js";
import { u as useToast, C as Card, d as CardHeader, e as CardTitle, g as CardContent, T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent, A as Alert, m as AlertDescription, l as Badge, B as Button, L as Label, O as Textarea, I as Input } from "./admin-core-DFYqoWCM.js";
import { a as sanitizeTextContent, b as sanitizeElementId, c as sanitizeClassName, d as sanitizeUserInput, r as removeBOM, i as isValidAttributeValue } from "./admin-security-CWSw-PzD.js";
import { F as Shield, H as TriangleAlert, b7 as Code, a0 as CircleCheckBig, ab as CircleX, bU as Clipboard } from "./ui-components-E8Qujiw2.js";
import "./vendor-ChWeSoXy.js";
import "./aws-sdk-DF6-bWA6.js";
import "./supabase-DWlqU2OS.js";
const withSafeRendering = (Component) => {
  return (props) => {
    try {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Component, { ...props, "data-id": "hnp1aizon", "data-path": "src/components/SafeRenderer.tsx" });
    } catch (error) {
      if (error instanceof Error && error.name === "InvalidCharacterError") {
        console.error("InvalidCharacterError caught and handled:", error);
        const sanitizedProps = Object.entries(props).reduce((acc, [key, value]) => {
          if (typeof value === "string") {
            acc[key] = sanitizeTextContent(value);
          } else {
            acc[key] = value;
          }
          return acc;
        }, {});
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Component, { ...sanitizedProps, "data-id": "he95mg4nw", "data-path": "src/components/SafeRenderer.tsx" });
      }
      throw error;
    }
  };
};
const SafeText = ({
  children,
  className,
  tag: Tag = "span",
  ...props
}) => {
  const safeText = sanitizeTextContent(children || "");
  const safeClassName = className ? sanitizeClassName(className) : void 0;
  const safeProps = Object.entries(props).reduce((acc, [key, value]) => {
    if (typeof value === "string") {
      acc[key] = sanitizeTextContent(value);
    } else {
      acc[key] = value;
    }
    return acc;
  }, {});
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Tag,
    {
      className: safeClassName,
      ...safeProps,
      dangerouslySetInnerHTML: { __html: safeText },
      "data-id": "qajoqpm3z",
      "data-path": "src/components/SafeRenderer.tsx"
    }
  );
};
const SafeInput = ({
  className,
  id,
  safeId,
  value,
  defaultValue,
  ...props
}) => {
  const inputId = safeId || id;
  const safeProps = {
    ...props,
    className: className ? sanitizeClassName(className) : void 0,
    id: inputId ? sanitizeElementId(inputId) : void 0,
    value: typeof value === "string" ? sanitizeTextContent(value) : value,
    defaultValue: typeof defaultValue === "string" ? sanitizeTextContent(defaultValue) : defaultValue
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ...safeProps, "data-id": "gw42fval3", "data-path": "src/components/SafeRenderer.tsx" });
};
const useSafeForm = (initialData, options = {}) => {
  const { onSubmit, validateOnChange = true, sanitizeOnChange = true } = options;
  const [formData, setFormData] = reactExports.useState(sanitizeUserInput(initialData));
  const [errors, setErrors] = reactExports.useState({});
  const [isSubmitting, setIsSubmitting] = reactExports.useState(false);
  const validateField = reactExports.useCallback((field, value) => {
    if (typeof value === "string") {
      const problemChars = /[^\x20-\x7E\t\n\r]/;
      if (problemChars.test(value)) {
        return "Invalid characters detected. Please remove special characters.";
      }
      if (value.length > 1e4) {
        return "Input is too long. Please shorten your text.";
      }
    }
    return null;
  }, []);
  const updateField = reactExports.useCallback((field, value) => {
    let processedValue = value;
    if (sanitizeOnChange && typeof value === "string") {
      processedValue = sanitizeTextContent(value);
    }
    if (validateOnChange) {
      const error = validateField(field, processedValue);
      setErrors((prev) => ({
        ...prev,
        [field]: error || ""
      }));
    }
    setFormData((prev) => ({
      ...prev,
      [field]: processedValue
    }));
  }, [sanitizeOnChange, validateOnChange, validateField]);
  const updateFields = reactExports.useCallback((updates) => {
    const sanitizedUpdates = sanitizeOnChange ? sanitizeUserInput(updates) : updates;
    if (validateOnChange) {
      const newErrors = {};
      Object.entries(sanitizedUpdates).forEach(([field, value]) => {
        const error = validateField(field, value);
        if (error) {
          newErrors[field] = error;
        }
      });
      setErrors((prev) => ({ ...prev, ...newErrors }));
    }
    setFormData((prev) => ({ ...prev, ...sanitizedUpdates }));
  }, [sanitizeOnChange, validateOnChange, validateField]);
  const resetForm = reactExports.useCallback(() => {
    setFormData(sanitizeUserInput(initialData));
    setErrors({});
    setIsSubmitting(false);
  }, [initialData]);
  const validateForm = reactExports.useCallback(() => {
    const newErrors = {};
    let isValid = true;
    Object.entries(formData).forEach(([field, value]) => {
      const error = validateField(field, value);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });
    setErrors(newErrors);
    return isValid;
  }, [formData, validateField]);
  const handleSubmit = reactExports.useCallback(async (e) => {
    if (e) {
      e.preventDefault();
    }
    if (!validateForm()) {
      return false;
    }
    setIsSubmitting(true);
    try {
      const sanitizedData = sanitizeUserInput(formData);
      if (onSubmit) {
        await onSubmit(sanitizedData);
      }
      return true;
    } catch (error) {
      console.error("Form submission error:", error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm, onSubmit]);
  const getFieldProps = reactExports.useCallback((field) => {
    return {
      value: formData[field] || "",
      onChange: (e) => {
        updateField(field, e.target.value);
      },
      onBlur: () => {
        if (validateOnChange) {
          const error = validateField(field, formData[field]);
          setErrors((prev) => ({
            ...prev,
            [field]: error || ""
          }));
        }
      },
      id: sanitizeElementId(`field-${String(field)}`),
      "aria-invalid": !!errors[field],
      "aria-describedby": errors[field] ? `${sanitizeElementId(`field-${String(field)}`)}-error` : void 0
    };
  }, [formData, errors, updateField, validateField, validateOnChange]);
  const getSelectProps = reactExports.useCallback((field) => {
    return {
      value: formData[field] || "",
      onValueChange: (value) => {
        updateField(field, value);
      },
      "aria-invalid": !!errors[field],
      "aria-describedby": errors[field] ? `${sanitizeElementId(`field-${String(field)}`)}-error` : void 0
    };
  }, [formData, errors, updateField]);
  const hasErrors = Object.values(errors).some((error) => !!error);
  return {
    formData,
    errors,
    isSubmitting,
    hasErrors,
    updateField,
    updateFields,
    resetForm,
    validateForm,
    handleSubmit,
    getFieldProps,
    getSelectProps
  };
};
const safeJSONParse = (jsonString) => {
  try {
    const cleanedString = removeBOM(jsonString);
    return JSON.parse(cleanedString);
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return null;
  }
};
const safeFileReader = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      var _a;
      try {
        const content = (_a = event.target) == null ? void 0 : _a.result;
        const cleanContent = removeBOM(sanitizeTextContent(content));
        resolve(cleanContent);
      } catch (error) {
        console.error("Error reading file:", error);
        reject(error);
      }
    };
    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };
    reader.readAsText(file);
  });
};
const safeClipboard = {
  read: async () => {
    try {
      const text = await navigator.clipboard.readText();
      return removeBOM(sanitizeTextContent(text));
    } catch (error) {
      console.error("Error reading from clipboard:", error);
      return "";
    }
  },
  write: async (text) => {
    try {
      const sanitizedText = sanitizeTextContent(removeBOM(text));
      await navigator.clipboard.writeText(sanitizedText);
    } catch (error) {
      console.error("Error writing to clipboard:", error);
    }
  }
};
const InvalidCharacterErrorDemo = () => {
  const { toast } = useToast();
  const [testInput, setTestInput] = reactExports.useState("");
  const [testResults, setTestResults] = reactExports.useState([]);
  const { handleSubmit, getFieldProps, hasErrors } = useSafeForm({
    name: "",
    email: "",
    message: ""
  }, {
    onSubmit: async (data) => {
      toast({
        title: "Form Submitted Safely",
        description: "All data was sanitized and validated successfully."
      });
    }
  });
  const problemCharacterExamples = [
    { name: "Zero Width Space", char: "​", description: "Invisible character that can break rendering" },
    { name: "BOM (Byte Order Mark)", char: "\uFEFF", description: "Can appear at start of files" },
    { name: "Null Character", char: "\0", description: "Control character that breaks DOM" },
    { name: "Form Feed", char: "\f", description: "Control character" },
    { name: "Vertical Tab", char: "\v", description: "Control character" },
    { name: "Delete Character", char: "", description: "Control character" }
  ];
  const runCharacterTests = () => {
    const results = [];
    try {
      const problematicString = "Hello\0World\uFEFF​";
      const sanitized = sanitizeTextContent(problematicString);
      const isClean = !sanitized.includes("\0") && !sanitized.includes("\uFEFF");
      results.push({
        test: "Basic Sanitization",
        passed: isClean,
        message: isClean ? "Problematic characters removed successfully" : "Failed to remove problematic characters"
      });
    } catch (error) {
      results.push({
        test: "Basic Sanitization",
        passed: false,
        message: `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      });
    }
    try {
      const problematicId = "my-id\0with​problems";
      const sanitizedId = sanitizeElementId(problematicId);
      const isValidId = /^[a-zA-Z][a-zA-Z0-9\-_]*$/.test(sanitizedId);
      results.push({
        test: "Element ID Sanitization",
        passed: isValidId,
        message: isValidId ? `Created valid ID: ${sanitizedId}` : `Invalid ID created: ${sanitizedId}`
      });
    } catch (error) {
      results.push({
        test: "Element ID Sanitization",
        passed: false,
        message: `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      });
    }
    try {
      const goodAttribute = "normal-value";
      const badAttribute = "value\0withproblems";
      const goodResult = isValidAttributeValue(goodAttribute);
      const badResult = !isValidAttributeValue(badAttribute);
      results.push({
        test: "Attribute Validation",
        passed: goodResult && badResult,
        message: goodResult && badResult ? "Correctly identified valid and invalid attributes" : "Failed to properly validate attributes"
      });
    } catch (error) {
      results.push({
        test: "Attribute Validation",
        passed: false,
        message: `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      });
    }
    try {
      const bomString = "\uFEFFHello World";
      const cleaned = removeBOM(bomString);
      const bomRemoved = !cleaned.startsWith("\uFEFF");
      results.push({
        test: "BOM Removal",
        passed: bomRemoved,
        message: bomRemoved ? "BOM successfully removed" : "Failed to remove BOM"
      });
    } catch (error) {
      results.push({
        test: "BOM Removal",
        passed: false,
        message: `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      });
    }
    try {
      const problematicJSON = '\uFEFF{"key": "value\0"}';
      const parsed = safeJSONParse(problematicJSON);
      const success = parsed && typeof parsed === "object";
      results.push({
        test: "Safe JSON Parsing",
        passed: success,
        message: success ? "JSON parsed safely" : "Failed to parse problematic JSON"
      });
    } catch (error) {
      results.push({
        test: "Safe JSON Parsing",
        passed: false,
        message: `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      });
    }
    setTestResults(results);
    const passedCount = results.filter((r) => r.passed).length;
    toast({
      title: "Character Safety Tests Complete",
      description: `${passedCount}/${results.length} tests passed`,
      variant: passedCount === results.length ? "default" : "destructive"
    });
  };
  const insertProblematicCharacter = (char) => {
    setTestInput((prev) => prev + char);
  };
  const testClipboardSafety = async () => {
    try {
      const problematicText = "Test\0with\uFEFFproblems​";
      await safeClipboard.write(problematicText);
      const readText = await safeClipboard.read();
      toast({
        title: "Clipboard Test",
        description: `Successfully wrote and read text. Cleaned: ${readText.length < problematicText.length ? "Yes" : "No"}`
      });
    } catch (error) {
      toast({
        title: "Clipboard Test Failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive"
      });
    }
  };
  const testFileUpload = (event) => {
    var _a;
    const file = (_a = event.target.files) == null ? void 0 : _a[0];
    if (!file) return;
    safeFileReader(file).then((content) => {
      toast({
        title: "File Read Successfully",
        description: `Read ${content.length} characters safely`
      });
      setTestInput(content.substring(0, 500));
    }).catch((error) => {
      toast({
        title: "File Read Failed",
        description: error.message,
        variant: "destructive"
      });
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-6xl mx-auto p-6 space-y-6", "data-id": "d48n0eovl", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "ypvbc30i6", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "6ajruxnmn", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center space-x-2", "data-id": "0qnsquivw", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-5 h-5", "data-id": "chcnx2q0k", "data-path": "src/components/InvalidCharacterErrorDemo.tsx" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "lrrj7gb4s", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: "InvalidCharacterError Prevention & Testing" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { "data-id": "qo5jl12cb", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "overview", className: "w-full", "data-id": "sdfv9758g", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid w-full grid-cols-4", "data-id": "8238hqrzm", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "overview", "data-id": "9wztrstnj", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: "Overview" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "testing", "data-id": "22nzfhs6t", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: "Testing" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "safe-form", "data-id": "qdzim21kv", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: "Safe Form" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "utilities", "data-id": "wkdg5mhlc", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: "Utilities" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "overview", className: "space-y-4", "data-id": "jvneg6ojk", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { "data-id": "1dat534do", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4", "data-id": "tfv1p4kky", "data-path": "src/components/InvalidCharacterErrorDemo.tsx" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { "data-id": "9rtozu5em", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: "InvalidCharacterError occurs when React tries to create DOM elements with invalid characters. This usually happens with control characters, BOM, or zero-width characters in text content or attributes." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", "data-id": "ve9o05tzp", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "qrhmzlv5b", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "006tr3y03", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm", "data-id": "vr4m7u58z", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: "Common Causes" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-2", "data-id": "0at56fkc6", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "text-sm space-y-1", "data-id": "qrlozy3jr", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { "data-id": "c2i3ph6v0", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: "• Copy-pasted text with hidden characters" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { "data-id": "ao4m0l2f3", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: "• File content with BOM (Byte Order Mark)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { "data-id": "ql35q9xdi", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: "• Control characters in form inputs" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { "data-id": "km2qlbfuh", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: "• Invalid characters in element IDs or classes" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { "data-id": "v6tafrgbk", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: "• Corrupted localStorage data" })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "p0vbmjqn3", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "ipzvkyd55", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm", "data-id": "zs4e8qv7h", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: "Solutions Implemented" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-2", "data-id": "mxx5fvnjg", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "text-sm space-y-1", "data-id": "h4pjw2eng", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { "data-id": "wrotmjmwh", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: [
                "• ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", "data-id": "k4bzlpg3x", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: "Sanitization utilities" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { "data-id": "td232ohw9", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: [
                "• ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", "data-id": "bp8rr514z", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: "Safe form handling" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { "data-id": "mbt6z51xg", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: [
                "• ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", "data-id": "j7fcxk349", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: "Error boundary protection" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { "data-id": "c85suh4y0", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: [
                "• ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", "data-id": "cizabe07m", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: "Input validation" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { "data-id": "1knv89nop", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: [
                "• ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", "data-id": "t6snwgu6i", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: "Storage cleanup" })
              ] })
            ] }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "13q4tkcc6", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "t5sobmju6", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm", "data-id": "8qhmhoc3v", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: "Problematic Characters" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { "data-id": "oep0vwfcb", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", "data-id": "dxoxq5fgx", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: problemCharacterExamples.map(
            (example, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-3 border rounded", "data-id": "omh8o18qa", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "lo8153fnn", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-sm", "data-id": "fbrblb8kd", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: example.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-gray-600", "data-id": "njk4d4kqd", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: example.description })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "sm",
                  variant: "outline",
                  onClick: () => insertProblematicCharacter(example.char),
                  "data-id": "szjbyzwpv",
                  "data-path": "src/components/InvalidCharacterErrorDemo.tsx",
                  children: "Insert"
                }
              )
            ] }, index)
          ) }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "testing", className: "space-y-4", "data-id": "4er7jszd5", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "z5f44qu7z", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "x9tf3aftl", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm", "data-id": "3ayy3sdkp", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: "Character Safety Tests" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", "data-id": "6bondqw9p", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: runCharacterTests, className: "w-full", "data-id": "fhvk4ph2r", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Code, { className: "w-4 h-4 mr-2", "data-id": "8rw6ncnwu", "data-path": "src/components/InvalidCharacterErrorDemo.tsx" }),
              "Run Safety Tests"
            ] }),
            testResults.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", "data-id": "lvo9g6nrd", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: testResults.map(
              (result, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: `flex items-center space-x-3 p-3 rounded border ${result.passed ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`,
                  "data-id": "uixaxnfal",
                  "data-path": "src/components/InvalidCharacterErrorDemo.tsx",
                  children: [
                    result.passed ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-5 h-5 text-green-600", "data-id": "65j9pft2i", "data-path": "src/components/InvalidCharacterErrorDemo.tsx" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-5 h-5 text-red-600", "data-id": "fikv0huyz", "data-path": "src/components/InvalidCharacterErrorDemo.tsx" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", "data-id": "hok9bq4zy", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-sm", "data-id": "m42xd6gy3", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: result.test }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-gray-600", "data-id": "0m3b9rfey", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: result.message })
                    ] })
                  ]
                },
                index
              )
            ) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "8ox8jcp1z", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "rpfwsbe8h", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm", "data-id": "s4x3915lw", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: "Test Input Area" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", "data-id": "b1clgxiwv", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "ioqlrhrle", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "test-input", "data-id": "pn6cj3kvq", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: "Test problematic characters here:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Textarea,
                {
                  id: "test-input",
                  value: testInput,
                  onChange: (e) => setTestInput(e.target.value),
                  placeholder: "Paste or type text with potential problematic characters...",
                  rows: 4,
                  "data-id": "bn3t3e1iy",
                  "data-path": "src/components/InvalidCharacterErrorDemo.tsx"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", "data-id": "oqjueiae6", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "10q8he352", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { "data-id": "i0ise7id5", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: "Original (may contain problems):" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 bg-red-50 border rounded text-sm font-mono break-all", "data-id": "x35q19s9d", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: testInput || "No input" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "tfs0niq9u", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { "data-id": "sxdwf0mj8", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: "Sanitized (safe for DOM):" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 bg-green-50 border rounded text-sm font-mono break-all", "data-id": "imq2xpeeg", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: sanitizeTextContent(testInput) || "No input" })
              ] })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "safe-form", className: "space-y-4", "data-id": "ezhr0pv15", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "v2ukakwoh", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "0j3ov3755", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm", "data-id": "onx7e1kxa", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: "Safe Form Demo" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { "data-id": "qxk01iai7", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", "data-id": "xf2srqxol", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "aw9ume47k", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "safe-name", "data-id": "kuu05lopx", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: "Name:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SafeInput,
              {
                ...getFieldProps("name"),
                placeholder: "Enter your name (will be automatically sanitized)",
                "data-id": "lad5oggzm",
                "data-path": "src/components/InvalidCharacterErrorDemo.tsx"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "j046am7ry", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "safe-email", "data-id": "o604ut1it", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: "Email:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SafeInput,
              {
                ...getFieldProps("email"),
                type: "email",
                placeholder: "Enter your email",
                "data-id": "dxn4izgmt",
                "data-path": "src/components/InvalidCharacterErrorDemo.tsx"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "yu9c1a89b", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "safe-message", "data-id": "mqqmm7cc7", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: "Message:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                ...getFieldProps("message"),
                placeholder: "Enter a message (special characters will be sanitized)",
                rows: 4,
                "data-id": "goeenbeqp",
                "data-path": "src/components/InvalidCharacterErrorDemo.tsx"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: hasErrors, "data-id": "onc5qo624", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: "Submit Safe Form" }),
          hasErrors && /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { variant: "destructive", "data-id": "q3kooesl4", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4", "data-id": "hr68kv04z", "data-path": "src/components/InvalidCharacterErrorDemo.tsx" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { "data-id": "jps45zl8m", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: "Form contains errors. Please check your input." })
          ] })
        ] }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "utilities", className: "space-y-4", "data-id": "zkc3pqulm", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", "data-id": "4yjrnlokn", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "7ndob9xai", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "n9ga2crwf", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm", "data-id": "xk0swclju", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: "Clipboard Safety" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { "data-id": "k8apxd5nu", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: testClipboardSafety, className: "w-full", "data-id": "hm5ez6ygo", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clipboard, { className: "w-4 h-4 mr-2", "data-id": "34bzdmwja", "data-path": "src/components/InvalidCharacterErrorDemo.tsx" }),
              "Test Safe Clipboard Operations"
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "e3twblikn", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "akcclpkq0", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm", "data-id": "wp2r4eigy", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: "File Safety" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { "data-id": "jd59o69dc", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "6tapf6glf", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "file-test", "data-id": "znxttok0k", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: "Test file reading:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "file-test",
                  type: "file",
                  accept: ".txt,.json,.csv",
                  onChange: testFileUpload,
                  "data-id": "6wr80euv9",
                  "data-path": "src/components/InvalidCharacterErrorDemo.tsx"
                }
              )
            ] }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "vajqis8v0", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "2mh3al7gw", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm", "data-id": "sx2zs5iey", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: "Safe Text Rendering" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", "data-id": "7irnz17m8", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "tjecflgaf", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { "data-id": "815tg6kq6", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: "Test safe text rendering:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: testInput,
                  onChange: (e) => setTestInput(e.target.value),
                  placeholder: "Enter text to test safe rendering",
                  "data-id": "l3hhgjjsz",
                  "data-path": "src/components/InvalidCharacterErrorDemo.tsx"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", "data-id": "2qh93hu6a", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "1hypzs0qo", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { "data-id": "qks2s2ubg", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: "Regular rendering:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 border rounded bg-red-50", "data-id": "q1500qv0a", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "bniwhzu6x", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: testInput }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "u7gu12v5z", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { "data-id": "0rme9z64g", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: "Safe rendering:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 border rounded bg-green-50", "data-id": "54h9nhz6v", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SafeText, { "data-id": "g46ucfydy", "data-path": "src/components/InvalidCharacterErrorDemo.tsx", children: testInput }) })
              ] })
            ] })
          ] })
        ] })
      ] })
    ] }) })
  ] }) });
};
const InvalidCharacterErrorDemo$1 = withSafeRendering(InvalidCharacterErrorDemo);
export {
  InvalidCharacterErrorDemo$1 as default
};
