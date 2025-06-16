import { j as jsxRuntimeExports, c as createContextScope, d as Presence, P as Primitive, b as useControllableState, u as useComposedRefs, e as composeEventHandlers, o as useSize, p as createDialogScope, q as Root, r as Portal, W as WarningProvider, C as Content, s as createSlottable, T as Title, D as Description, t as Close, O as Overlay, v as Trigger } from "./ui-BAZ8HTBl.js";
import { r as reactExports } from "./vendor-Dw3NhmYV.js";
import { u as usePrevious, C as Check } from "./select-D7v6NG_6.js";
import { l as cn, h as Badge, B as Button, X, t as buttonVariants } from "./index-xgH9wc9T.js";
import { S as SquarePen } from "./square-pen-9pUwpptK.js";
import { T as Trash2 } from "./trash-2-CZFivf2G.js";
import { u as useSmartAuth } from "./use-smart-auth-BiISLyYS.js";
var CHECKBOX_NAME = "Checkbox";
var [createCheckboxContext, createCheckboxScope] = createContextScope(CHECKBOX_NAME);
var [CheckboxProviderImpl, useCheckboxContext] = createCheckboxContext(CHECKBOX_NAME);
function CheckboxProvider(props) {
  const {
    __scopeCheckbox,
    checked: checkedProp,
    children,
    defaultChecked,
    disabled,
    form,
    name,
    onCheckedChange,
    required,
    value = "on",
    // @ts-expect-error
    internal_do_not_use_render
  } = props;
  const [checked, setChecked] = useControllableState({
    prop: checkedProp,
    defaultProp: defaultChecked ?? false,
    onChange: onCheckedChange,
    caller: CHECKBOX_NAME
  });
  const [control, setControl] = reactExports.useState(null);
  const [bubbleInput, setBubbleInput] = reactExports.useState(null);
  const hasConsumerStoppedPropagationRef = reactExports.useRef(false);
  const isFormControl = control ? !!form || !!control.closest("form") : (
    // We set this to true by default so that events bubble to forms without JS (SSR)
    true
  );
  const context = {
    checked,
    disabled,
    setChecked,
    control,
    setControl,
    name,
    form,
    value,
    hasConsumerStoppedPropagationRef,
    required,
    defaultChecked: isIndeterminate(defaultChecked) ? false : defaultChecked,
    isFormControl,
    bubbleInput,
    setBubbleInput
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    CheckboxProviderImpl,
    {
      scope: __scopeCheckbox,
      ...context,
      children: isFunction(internal_do_not_use_render) ? internal_do_not_use_render(context) : children
    }
  );
}
var TRIGGER_NAME$1 = "CheckboxTrigger";
var CheckboxTrigger = reactExports.forwardRef(
  ({ __scopeCheckbox, onKeyDown, onClick, ...checkboxProps }, forwardedRef) => {
    const {
      control,
      value,
      disabled,
      checked,
      required,
      setControl,
      setChecked,
      hasConsumerStoppedPropagationRef,
      isFormControl,
      bubbleInput
    } = useCheckboxContext(TRIGGER_NAME$1, __scopeCheckbox);
    const composedRefs = useComposedRefs(forwardedRef, setControl);
    const initialCheckedStateRef = reactExports.useRef(checked);
    reactExports.useEffect(() => {
      const form = control == null ? void 0 : control.form;
      if (form) {
        const reset = () => setChecked(initialCheckedStateRef.current);
        form.addEventListener("reset", reset);
        return () => form.removeEventListener("reset", reset);
      }
    }, [control, setChecked]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.button,
      {
        type: "button",
        role: "checkbox",
        "aria-checked": isIndeterminate(checked) ? "mixed" : checked,
        "aria-required": required,
        "data-state": getState(checked),
        "data-disabled": disabled ? "" : void 0,
        disabled,
        value,
        ...checkboxProps,
        ref: composedRefs,
        onKeyDown: composeEventHandlers(onKeyDown, (event) => {
          if (event.key === "Enter") event.preventDefault();
        }),
        onClick: composeEventHandlers(onClick, (event) => {
          setChecked((prevChecked) => isIndeterminate(prevChecked) ? true : !prevChecked);
          if (bubbleInput && isFormControl) {
            hasConsumerStoppedPropagationRef.current = event.isPropagationStopped();
            if (!hasConsumerStoppedPropagationRef.current) event.stopPropagation();
          }
        })
      }
    );
  }
);
CheckboxTrigger.displayName = TRIGGER_NAME$1;
var Checkbox$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeCheckbox,
      name,
      checked,
      defaultChecked,
      required,
      disabled,
      value,
      onCheckedChange,
      form,
      ...checkboxProps
    } = props;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      CheckboxProvider,
      {
        __scopeCheckbox,
        checked,
        defaultChecked,
        disabled,
        required,
        onCheckedChange,
        name,
        form,
        value,
        internal_do_not_use_render: ({ isFormControl }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            CheckboxTrigger,
            {
              ...checkboxProps,
              ref: forwardedRef,
              __scopeCheckbox
            }
          ),
          isFormControl && /* @__PURE__ */ jsxRuntimeExports.jsx(
            CheckboxBubbleInput,
            {
              __scopeCheckbox
            }
          )
        ] })
      }
    );
  }
);
Checkbox$1.displayName = CHECKBOX_NAME;
var INDICATOR_NAME = "CheckboxIndicator";
var CheckboxIndicator = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeCheckbox, forceMount, ...indicatorProps } = props;
    const context = useCheckboxContext(INDICATOR_NAME, __scopeCheckbox);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Presence,
      {
        present: forceMount || isIndeterminate(context.checked) || context.checked === true,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.span,
          {
            "data-state": getState(context.checked),
            "data-disabled": context.disabled ? "" : void 0,
            ...indicatorProps,
            ref: forwardedRef,
            style: { pointerEvents: "none", ...props.style }
          }
        )
      }
    );
  }
);
CheckboxIndicator.displayName = INDICATOR_NAME;
var BUBBLE_INPUT_NAME = "CheckboxBubbleInput";
var CheckboxBubbleInput = reactExports.forwardRef(
  ({ __scopeCheckbox, ...props }, forwardedRef) => {
    const {
      control,
      hasConsumerStoppedPropagationRef,
      checked,
      defaultChecked,
      required,
      disabled,
      name,
      value,
      form,
      bubbleInput,
      setBubbleInput
    } = useCheckboxContext(BUBBLE_INPUT_NAME, __scopeCheckbox);
    const composedRefs = useComposedRefs(forwardedRef, setBubbleInput);
    const prevChecked = usePrevious(checked);
    const controlSize = useSize(control);
    reactExports.useEffect(() => {
      const input = bubbleInput;
      if (!input) return;
      const inputProto = window.HTMLInputElement.prototype;
      const descriptor = Object.getOwnPropertyDescriptor(
        inputProto,
        "checked"
      );
      const setChecked = descriptor.set;
      const bubbles = !hasConsumerStoppedPropagationRef.current;
      if (prevChecked !== checked && setChecked) {
        const event = new Event("click", { bubbles });
        input.indeterminate = isIndeterminate(checked);
        setChecked.call(input, isIndeterminate(checked) ? false : checked);
        input.dispatchEvent(event);
      }
    }, [bubbleInput, prevChecked, checked, hasConsumerStoppedPropagationRef]);
    const defaultCheckedRef = reactExports.useRef(isIndeterminate(checked) ? false : checked);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.input,
      {
        type: "checkbox",
        "aria-hidden": true,
        defaultChecked: defaultChecked ?? defaultCheckedRef.current,
        required,
        disabled,
        name,
        value,
        form,
        ...props,
        tabIndex: -1,
        ref: composedRefs,
        style: {
          ...props.style,
          ...controlSize,
          position: "absolute",
          pointerEvents: "none",
          opacity: 0,
          margin: 0,
          // We transform because the input is absolutely positioned but we have
          // rendered it **after** the button. This pulls it back to sit on top
          // of the button.
          transform: "translateX(-100%)"
        }
      }
    );
  }
);
CheckboxBubbleInput.displayName = BUBBLE_INPUT_NAME;
function isFunction(value) {
  return typeof value === "function";
}
function isIndeterminate(checked) {
  return checked === "indeterminate";
}
function getState(checked) {
  return isIndeterminate(checked) ? "indeterminate" : checked ? "checked" : "unchecked";
}
const Checkbox = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Checkbox$1,
  {
    ref,
    className: cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      CheckboxIndicator,
      {
        className: cn("flex items-center justify-center text-current"),
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" })
      }
    )
  }
));
Checkbox.displayName = Checkbox$1.displayName;
function useBatchSelection() {
  const [selectedItems, setSelectedItems] = reactExports.useState(/* @__PURE__ */ new Set());
  const isSelected = reactExports.useCallback((id) => {
    return selectedItems.has(id);
  }, [selectedItems]);
  const selectItem = reactExports.useCallback((id) => {
    setSelectedItems((prev) => /* @__PURE__ */ new Set([...prev, id]));
  }, []);
  const deselectItem = reactExports.useCallback((id) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  }, []);
  const toggleItem = reactExports.useCallback((id) => {
    if (isSelected(id)) {
      deselectItem(id);
    } else {
      selectItem(id);
    }
  }, [isSelected, selectItem, deselectItem]);
  const selectAll = reactExports.useCallback((items, getItemId) => {
    const allIds = items.map(getItemId);
    setSelectedItems(new Set(allIds));
  }, []);
  const deselectAll = reactExports.useCallback(() => {
    setSelectedItems(/* @__PURE__ */ new Set());
  }, []);
  const toggleSelectAll = reactExports.useCallback((items, getItemId) => {
    const allIds = items.map(getItemId);
    const allSelected = allIds.every((id) => selectedItems.has(id));
    if (allSelected) {
      deselectAll();
    } else {
      selectAll(items, getItemId);
    }
  }, [selectedItems, selectAll, deselectAll]);
  const getSelectedData = reactExports.useCallback((items, getItemId) => {
    return items.filter((item) => selectedItems.has(getItemId(item)));
  }, [selectedItems]);
  const clearSelection = reactExports.useCallback(() => {
    setSelectedItems(/* @__PURE__ */ new Set());
  }, []);
  const isAllSelected = reactExports.useMemo(() => {
    return selectedItems.size > 0;
  }, [selectedItems.size]);
  const isPartiallySelected = reactExports.useMemo(() => {
    return selectedItems.size > 0;
  }, [selectedItems.size]);
  const selectedCount = reactExports.useMemo(() => {
    return selectedItems.size;
  }, [selectedItems.size]);
  return {
    selectedItems,
    isSelected,
    isAllSelected,
    isPartiallySelected,
    selectedCount,
    selectItem,
    deselectItem,
    toggleItem,
    selectAll,
    deselectAll,
    toggleSelectAll,
    getSelectedData,
    clearSelection
  };
}
const BatchActionBar = ({
  selectedCount,
  onBatchEdit,
  onBatchDelete,
  onClearSelection,
  isLoading = false,
  showEdit = true,
  showDelete = true
}) => {
  if (selectedCount === 0) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4", "data-id": "0aq0wg9l0", "data-path": "src/components/BatchActionBar.tsx", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", "data-id": "gz90tg1fw", "data-path": "src/components/BatchActionBar.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "bg-blue-100 text-blue-800", "data-id": "bomuvx2cj", "data-path": "src/components/BatchActionBar.tsx", children: [
        selectedCount,
        " item",
        selectedCount !== 1 ? "s" : "",
        " selected"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", "data-id": "sxnas9rvj", "data-path": "src/components/BatchActionBar.tsx", children: [
        showEdit && onBatchEdit && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            variant: "outline",
            onClick: onBatchEdit,
            disabled: isLoading,
            className: "flex items-center gap-2",
            "data-id": "1fn5056g4",
            "data-path": "src/components/BatchActionBar.tsx",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { className: "h-4 w-4", "data-id": "kmo5nebba", "data-path": "src/components/BatchActionBar.tsx" }),
              "Edit Selected"
            ]
          }
        ),
        showDelete && onBatchDelete && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            variant: "outline",
            onClick: onBatchDelete,
            disabled: isLoading,
            className: "flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50",
            "data-id": "ppxvidknj",
            "data-path": "src/components/BatchActionBar.tsx",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4", "data-id": "86azf1n4e", "data-path": "src/components/BatchActionBar.tsx" }),
              "Delete Selected"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        size: "sm",
        variant: "ghost",
        onClick: onClearSelection,
        disabled: isLoading,
        className: "flex items-center gap-2",
        "data-id": "x2ekj2amk",
        "data-path": "src/components/BatchActionBar.tsx",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4", "data-id": "wk7tpf02e", "data-path": "src/components/BatchActionBar.tsx" }),
          "Clear Selection"
        ]
      }
    )
  ] });
};
var ROOT_NAME = "AlertDialog";
var [createAlertDialogContext, createAlertDialogScope] = createContextScope(ROOT_NAME, [
  createDialogScope
]);
var useDialogScope = createDialogScope();
var AlertDialog$1 = (props) => {
  const { __scopeAlertDialog, ...alertDialogProps } = props;
  const dialogScope = useDialogScope(__scopeAlertDialog);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root, { ...dialogScope, ...alertDialogProps, modal: true });
};
AlertDialog$1.displayName = ROOT_NAME;
var TRIGGER_NAME = "AlertDialogTrigger";
var AlertDialogTrigger = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, ...triggerProps } = props;
    const dialogScope = useDialogScope(__scopeAlertDialog);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Trigger, { ...dialogScope, ...triggerProps, ref: forwardedRef });
  }
);
AlertDialogTrigger.displayName = TRIGGER_NAME;
var PORTAL_NAME = "AlertDialogPortal";
var AlertDialogPortal$1 = (props) => {
  const { __scopeAlertDialog, ...portalProps } = props;
  const dialogScope = useDialogScope(__scopeAlertDialog);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Portal, { ...dialogScope, ...portalProps });
};
AlertDialogPortal$1.displayName = PORTAL_NAME;
var OVERLAY_NAME = "AlertDialogOverlay";
var AlertDialogOverlay$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, ...overlayProps } = props;
    const dialogScope = useDialogScope(__scopeAlertDialog);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Overlay, { ...dialogScope, ...overlayProps, ref: forwardedRef });
  }
);
AlertDialogOverlay$1.displayName = OVERLAY_NAME;
var CONTENT_NAME = "AlertDialogContent";
var [AlertDialogContentProvider, useAlertDialogContentContext] = createAlertDialogContext(CONTENT_NAME);
var Slottable = createSlottable("AlertDialogContent");
var AlertDialogContent$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, children, ...contentProps } = props;
    const dialogScope = useDialogScope(__scopeAlertDialog);
    const contentRef = reactExports.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, contentRef);
    const cancelRef = reactExports.useRef(null);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      WarningProvider,
      {
        contentName: CONTENT_NAME,
        titleName: TITLE_NAME,
        docsSlug: "alert-dialog",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogContentProvider, { scope: __scopeAlertDialog, cancelRef, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Content,
          {
            role: "alertdialog",
            ...dialogScope,
            ...contentProps,
            ref: composedRefs,
            onOpenAutoFocus: composeEventHandlers(contentProps.onOpenAutoFocus, (event) => {
              var _a;
              event.preventDefault();
              (_a = cancelRef.current) == null ? void 0 : _a.focus({ preventScroll: true });
            }),
            onPointerDownOutside: (event) => event.preventDefault(),
            onInteractOutside: (event) => event.preventDefault(),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Slottable, { children }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(DescriptionWarning, { contentRef })
            ]
          }
        ) })
      }
    );
  }
);
AlertDialogContent$1.displayName = CONTENT_NAME;
var TITLE_NAME = "AlertDialogTitle";
var AlertDialogTitle$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, ...titleProps } = props;
    const dialogScope = useDialogScope(__scopeAlertDialog);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Title, { ...dialogScope, ...titleProps, ref: forwardedRef });
  }
);
AlertDialogTitle$1.displayName = TITLE_NAME;
var DESCRIPTION_NAME = "AlertDialogDescription";
var AlertDialogDescription$1 = reactExports.forwardRef((props, forwardedRef) => {
  const { __scopeAlertDialog, ...descriptionProps } = props;
  const dialogScope = useDialogScope(__scopeAlertDialog);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Description, { ...dialogScope, ...descriptionProps, ref: forwardedRef });
});
AlertDialogDescription$1.displayName = DESCRIPTION_NAME;
var ACTION_NAME = "AlertDialogAction";
var AlertDialogAction$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, ...actionProps } = props;
    const dialogScope = useDialogScope(__scopeAlertDialog);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Close, { ...dialogScope, ...actionProps, ref: forwardedRef });
  }
);
AlertDialogAction$1.displayName = ACTION_NAME;
var CANCEL_NAME = "AlertDialogCancel";
var AlertDialogCancel$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, ...cancelProps } = props;
    const { cancelRef } = useAlertDialogContentContext(CANCEL_NAME, __scopeAlertDialog);
    const dialogScope = useDialogScope(__scopeAlertDialog);
    const ref = useComposedRefs(forwardedRef, cancelRef);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Close, { ...dialogScope, ...cancelProps, ref });
  }
);
AlertDialogCancel$1.displayName = CANCEL_NAME;
var DescriptionWarning = ({ contentRef }) => {
  const MESSAGE = `\`${CONTENT_NAME}\` requires a description for the component to be accessible for screen reader users.

You can add a description to the \`${CONTENT_NAME}\` by passing a \`${DESCRIPTION_NAME}\` component as a child, which also benefits sighted users by adding visible context to the dialog.

Alternatively, you can use your own component as a description by assigning it an \`id\` and passing the same value to the \`aria-describedby\` prop in \`${CONTENT_NAME}\`. If the description is confusing or duplicative for sighted users, you can use the \`@radix-ui/react-visually-hidden\` primitive as a wrapper around your description component.

For more information, see https://radix-ui.com/primitives/docs/components/alert-dialog`;
  reactExports.useEffect(() => {
    var _a;
    const hasDescription = document.getElementById(
      (_a = contentRef.current) == null ? void 0 : _a.getAttribute("aria-describedby")
    );
    if (!hasDescription) console.warn(MESSAGE);
  }, [MESSAGE, contentRef]);
  return null;
};
var Root2 = AlertDialog$1;
var Portal2 = AlertDialogPortal$1;
var Overlay2 = AlertDialogOverlay$1;
var Content2 = AlertDialogContent$1;
var Action = AlertDialogAction$1;
var Cancel = AlertDialogCancel$1;
var Title2 = AlertDialogTitle$1;
var Description2 = AlertDialogDescription$1;
const AlertDialog = Root2;
const AlertDialogPortal = Portal2;
const AlertDialogOverlay = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Overlay2,
  {
    className: cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props,
    ref
  }
));
AlertDialogOverlay.displayName = Overlay2.displayName;
const AlertDialogContent = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogPortal, { children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogOverlay, {}),
  /* @__PURE__ */ jsxRuntimeExports.jsx(
    Content2,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      ),
      ...props
    }
  )
] }));
AlertDialogContent.displayName = Content2.displayName;
const AlertDialogHeader = ({
  className,
  ...props
}) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "div",
  {
    className: cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    ),
    ...props
  }
);
AlertDialogHeader.displayName = "AlertDialogHeader";
const AlertDialogFooter = ({
  className,
  ...props
}) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "div",
  {
    className: cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    ),
    ...props
  }
);
AlertDialogFooter.displayName = "AlertDialogFooter";
const AlertDialogTitle = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Title2,
  {
    ref,
    className: cn("text-lg font-semibold", className),
    ...props
  }
));
AlertDialogTitle.displayName = Title2.displayName;
const AlertDialogDescription = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Description2,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
AlertDialogDescription.displayName = Description2.displayName;
const AlertDialogAction = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Action,
  {
    ref,
    className: cn(buttonVariants(), className),
    ...props
  }
));
AlertDialogAction.displayName = Action.displayName;
const AlertDialogCancel = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Cancel,
  {
    ref,
    className: cn(
      buttonVariants({ variant: "outline" }),
      "mt-2 sm:mt-0",
      className
    ),
    ...props
  }
));
AlertDialogCancel.displayName = Cancel.displayName;
const BatchDeleteDialog = ({
  isOpen,
  onClose,
  onConfirm,
  selectedCount,
  isLoading = false,
  itemName = "items",
  selectedItems = []
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: isOpen, onOpenChange: onClose, "data-id": "tunntr6ru", "data-path": "src/components/BatchDeleteDialog.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { className: "max-w-md", "data-id": "ig084uzkk", "data-path": "src/components/BatchDeleteDialog.tsx", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { "data-id": "gsqsea6wq", "data-path": "src/components/BatchDeleteDialog.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogTitle, { className: "flex items-center gap-2 text-red-600", "data-id": "bjqp14ayz", "data-path": "src/components/BatchDeleteDialog.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-5 w-5", "data-id": "7fjuau142", "data-path": "src/components/BatchDeleteDialog.tsx" }),
        "Confirm Batch Delete"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { className: "space-y-3", "data-id": "qwboeaq7q", "data-path": "src/components/BatchDeleteDialog.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "qrgp5x81h", "data-path": "src/components/BatchDeleteDialog.tsx", children: [
          "Are you sure you want to delete",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "destructive", className: "mx-1", "data-id": "f5igh3ggy", "data-path": "src/components/BatchDeleteDialog.tsx", children: selectedCount }),
          itemName,
          "? This action cannot be undone."
        ] }),
        selectedItems.length > 0 && selectedItems.length <= 5 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4", "data-id": "cot1ftlzr", "data-path": "src/components/BatchDeleteDialog.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-gray-700 mb-2", "data-id": "yvn0rf523", "data-path": "src/components/BatchDeleteDialog.tsx", children: "Items to be deleted:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1", "data-id": "thj5d0ojx", "data-path": "src/components/BatchDeleteDialog.tsx", children: selectedItems.map(
            (item, index) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-gray-600 bg-gray-50 p-2 rounded", "data-id": "i72auv86j", "data-path": "src/components/BatchDeleteDialog.tsx", children: item.name || item.title || item.id || "Unknown item" }, index)
          ) })
        ] }),
        selectedItems.length > 5 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4", "data-id": "95dav1yn9", "data-path": "src/components/BatchDeleteDialog.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-gray-600", "data-id": "5vifoq4rf", "data-path": "src/components/BatchDeleteDialog.tsx", children: [
          selectedCount,
          " ",
          itemName,
          " will be permanently deleted."
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { "data-id": "oxayl72pe", "data-path": "src/components/BatchDeleteDialog.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { disabled: isLoading, "data-id": "ka2ps1g2e", "data-path": "src/components/BatchDeleteDialog.tsx", children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        AlertDialogAction,
        {
          onClick: onConfirm,
          disabled: isLoading,
          className: "bg-red-600 hover:bg-red-700 focus:ring-red-600",
          "data-id": "1h2zts0i7",
          "data-path": "src/components/BatchDeleteDialog.tsx",
          children: isLoading ? "Deleting..." : `Delete ${selectedCount} ${itemName}`
        }
      )
    ] })
  ] }) });
};
const useAdminAccess = () => {
  const authContext = useSmartAuth();
  const { userProfile, isAdmin } = authContext || {};
  const adminStatus = isAdmin !== void 0 ? isAdmin : (userProfile == null ? void 0 : userProfile.role) === "Administrator";
  const hasMonitoringAccess = adminStatus;
  const checkAdminAccess = () => {
    console.log("🔐 [Admin Access Check] Admin Status:", adminStatus, "Context Type:", authContext ? "Available" : "Missing");
    return adminStatus;
  };
  const requireAdminAccess = () => {
    if (!adminStatus) {
      throw new Error("Administrator access required for this feature");
    }
  };
  return {
    isAdmin: adminStatus,
    hasAdminAccess: adminStatus,
    hasMonitoringAccess,
    checkAdminAccess,
    requireAdminAccess
  };
};
export {
  BatchActionBar as B,
  Checkbox as C,
  useBatchSelection as a,
  BatchDeleteDialog as b,
  useAdminAccess as u
};
//# sourceMappingURL=use-admin-access-DsbUxxaq.js.map
