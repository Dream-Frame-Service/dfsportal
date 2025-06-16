import { j as jsxRuntimeExports } from "./ui-BAZ8HTBl.js";
import { B as Button } from "./index-BDkJIub7.js";
import { d as useLocation, r as reactExports } from "./vendor-Dw3NhmYV.js";
import { m as motion } from "./proxy-XsoekknU.js";
const NotFound = () => {
  const location = useLocation();
  reactExports.useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center bg-background", "data-id": "whlkwrt68", "data-path": "src/pages/NotFound.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5 },
      className: "text-center space-y-6 p-8",
      "data-id": "ndpxyhvbk",
      "data-path": "src/pages/NotFound.tsx",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { scale: 0.5 },
            animate: { scale: 1 },
            transition: { duration: 0.5, delay: 0.2 },
            "data-id": "sy5eg7dqo",
            "data-path": "src/pages/NotFound.tsx",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-8xl font-bold text-primary", "data-id": "949sh7uie", "data-path": "src/pages/NotFound.tsx", children: "404" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            transition: { duration: 0.5, delay: 0.4 },
            className: "space-y-4",
            "data-id": "14q0mnsk6",
            "data-path": "src/pages/NotFound.tsx",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-semibold tracking-tight", "data-id": "r565v72g5", "data-path": "src/pages/NotFound.tsx", children: "Page Not Found" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", "data-id": "sumoebyfz", "data-path": "src/pages/NotFound.tsx", children: "Sorry, the page you are looking for does not exist or has been removed." })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            transition: { duration: 0.5, delay: 0.6 },
            "data-id": "e7f8n6ugp",
            "data-path": "src/pages/NotFound.tsx",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "default", size: "lg", "data-id": "eq4k92b3q", "data-path": "src/pages/NotFound.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/", "data-id": "s1mr5zldm", "data-path": "src/pages/NotFound.tsx", children: "Back to Home" }) })
          }
        )
      ]
    }
  ) });
};
export {
  NotFound as default
};
//# sourceMappingURL=NotFound-CGm9i0Tt.js.map
