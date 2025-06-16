import "./ui-BAZ8HTBl.js";
import { r as reactExports } from "./vendor-Dw3NhmYV.js";
import "./index-xgH9wc9T.js";
const AuthContext = reactExports.createContext(void 0);
const useAuth = () => {
  const context = reactExports.useContext(AuthContext);
  if (context === void 0) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
export {
  AuthContext as A,
  useAuth as u
};
//# sourceMappingURL=AuthContext-D76ueosG.js.map
