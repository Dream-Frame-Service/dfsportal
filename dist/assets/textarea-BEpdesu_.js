import { c as createLucideIcon, l as cn } from "./index-BDkJIub7.js";
import { j as jsxRuntimeExports } from "./ui-BAZ8HTBl.js";
import { r as reactExports } from "./vendor-Dw3NhmYV.js";
/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Camera = createLucideIcon("Camera", [
  [
    "path",
    {
      d: "M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z",
      key: "1tc9qg"
    }
  ],
  ["circle", { cx: "12", cy: "13", r: "3", key: "1vg3eu" }]
]);
/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Upload = createLucideIcon("Upload", [
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["polyline", { points: "17 8 12 3 7 8", key: "t8dd8p" }],
  ["line", { x1: "12", x2: "12", y1: "3", y2: "15", key: "widbto" }]
]);
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
const Textarea = reactExports.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "textarea",
    {
      className: cn(
        "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      ),
      ref,
      ...props
    }
  );
});
Textarea.displayName = "Textarea";
export {
  Camera as C,
  NumberInput as N,
  Textarea as T,
  Upload as U
};
//# sourceMappingURL=textarea-BEpdesu_.js.map
