import { c as createLucideIcon } from "./index-xgH9wc9T.js";
import { r as reactExports } from "./vendor-Dw3NhmYV.js";
import { A as AuthContext } from "./AuthContext-D76ueosG.js";
import "./ui-BAZ8HTBl.js";
/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Database = createLucideIcon("Database", [
  ["ellipse", { cx: "12", cy: "5", rx: "9", ry: "3", key: "msslwz" }],
  ["path", { d: "M3 5V19A9 3 0 0 0 21 19V5", key: "1wlel7" }],
  ["path", { d: "M3 12A9 3 0 0 0 21 12", key: "mv7ke4" }]
]);
/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const XCircle = createLucideIcon("XCircle", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m15 9-6 6", key: "1uzhvr" }],
  ["path", { d: "m9 9 6 6", key: "z0biqf" }]
]);
const DemoAuthContext = reactExports.createContext(void 0);
({
  CreateTime: (/* @__PURE__ */ new Date()).toISOString()
});
const useSmartAuth = () => {
  const demoAuth = reactExports.useContext(DemoAuthContext);
  const regularAuth = reactExports.useContext(AuthContext);
  if (demoAuth) {
    console.log("🚀 [Smart Auth] Using Demo Auth Context - Admin Access:", demoAuth.isAdmin);
    return demoAuth;
  }
  console.log("🔐 [Smart Auth] Using Regular Auth Context - Admin Access:", (regularAuth == null ? void 0 : regularAuth.isAdmin) || false);
  return regularAuth;
};
export {
  Database as D,
  XCircle as X,
  useSmartAuth as u
};
//# sourceMappingURL=use-smart-auth-BiISLyYS.js.map
