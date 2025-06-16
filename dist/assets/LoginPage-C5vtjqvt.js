import { j as jsxRuntimeExports } from "./ui-BAZ8HTBl.js";
import { r as reactExports, u as useNavigate } from "./vendor-Dw3NhmYV.js";
import { c as createLucideIcon, a as useSupabaseAuth, u as useToast, C as Card, b as CardHeader, d as CardTitle, e as CardDescription, f as CardContent, A as Alert, g as AlertDescription, L as Lock, B as Button } from "./index-xgH9wc9T.js";
import { I as Input } from "./input-DS8Y9d9X.js";
import { L as Label } from "./label-DtRhp3dR.js";
import { S as Separator } from "./separator-4GaFztwx.js";
import { L as Logo } from "./Logo-CgCYvMUA.js";
import { C as CheckCircle2 } from "./check-circle-2-DQ0zdMp0.js";
import { A as AlertCircle } from "./alert-circle-ByZw3eax.js";
import { M as Mail } from "./mail-DhtIbKd0.js";
import { E as EyeOff } from "./eye-off-DLMoVbty.js";
import { E as Eye } from "./eye-DqIgW9kS.js";
import { L as Loader2 } from "./loader-2-HgtsHnjl.js";
import { U as UserPlus } from "./user-plus-C8gbCEoR.js";
/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const LogIn = createLucideIcon("LogIn", [
  ["path", { d: "M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4", key: "u53s6r" }],
  ["polyline", { points: "10 17 15 12 10 7", key: "1ail0h" }],
  ["line", { x1: "15", x2: "3", y1: "12", y2: "12", key: "v6grx8" }]
]);
const LoginPage = () => {
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [confirmPassword, setConfirmPassword] = reactExports.useState("");
  const [authMode, setAuthMode] = reactExports.useState("login");
  const [showPassword, setShowPassword] = reactExports.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = reactExports.useState(false);
  const [message, setMessage] = reactExports.useState("");
  const [messageType, setMessageType] = reactExports.useState("error");
  const { signIn, signUp, resetPassword, loading } = useSupabaseAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const clearForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setMessage("");
  };
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      setMessage("Please enter your email address");
      setMessageType("error");
      return;
    }
    try {
      const { error } = await resetPassword(email);
      if (error) {
        setMessage(error.message);
        setMessageType("error");
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
      } else {
        setMessage("Password reset link has been sent to your email address");
        setMessageType("success");
        toast({
          title: "Success",
          description: "Password reset link sent to your email"
        });
        setTimeout(() => {
          setAuthMode("login");
          clearForm();
        }, 3e3);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to send reset email";
      setMessage(errorMessage);
      setMessageType("error");
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (authMode === "forgot-password") {
      return handleForgotPassword(e);
    }
    if (authMode === "register" && password !== confirmPassword) {
      setMessage("Passwords do not match");
      setMessageType("error");
      return;
    }
    try {
      if (authMode === "login") {
        const { error } = await signIn(email, password);
        if (!error) {
          toast({
            title: "Welcome back!",
            description: "Successfully logged in"
          });
          navigate("/dashboard");
        } else {
          setMessage(error.message);
          setMessageType("error");
        }
      } else if (authMode === "register") {
        const { error } = await signUp(email, password);
        if (!error) {
          setMessage("Account created successfully! Please check your email for verification.");
          setMessageType("success");
          toast({
            title: "Account Created",
            description: "Please check your email for verification"
          });
          setTimeout(() => {
            setAuthMode("login");
            clearForm();
          }, 3e3);
        } else {
          setMessage(error.message);
          setMessageType("error");
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      setMessage(errorMessage);
      setMessageType("error");
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };
  const getFormTitle = () => {
    switch (authMode) {
      case "login":
        return "Welcome Back";
      case "register":
        return "Create Account";
      case "forgot-password":
        return "Reset Password";
      default:
        return "Sign In";
    }
  };
  const getFormDescription = () => {
    switch (authMode) {
      case "login":
        return "Enter your credentials to access the portal";
      case "register":
        return "Create a new account to get started";
      case "forgot-password":
        return "Enter your email to receive a password reset link";
      default:
        return "";
    }
  };
  const getSubmitButtonText = () => {
    if (loading) return "Please wait...";
    switch (authMode) {
      case "login":
        return "Sign In";
      case "register":
        return "Create Account";
      case "forgot-password":
        return "Send Reset Link";
      default:
        return "Submit";
    }
  };
  const getSubmitButtonIcon = () => {
    if (loading) return /* @__PURE__ */ jsxRuntimeExports.jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin", "data-id": "vvzw0qnje", "data-path": "src/pages/LoginPage.tsx" });
    switch (authMode) {
      case "login":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { className: "mr-2 h-4 w-4", "data-id": "7z4t0t8ky", "data-path": "src/pages/LoginPage.tsx" });
      case "register":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "mr-2 h-4 w-4", "data-id": "i8zrm8lbg", "data-path": "src/pages/LoginPage.tsx" });
      case "forgot-password":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "mr-2 h-4 w-4", "data-id": "a44hnevqk", "data-path": "src/pages/LoginPage.tsx" });
      default:
        return null;
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100", "data-id": "l2x1li2t5", "data-path": "src/pages/LoginPage.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center p-4 min-h-screen", "data-id": "gjn5ll2kk", "data-path": "src/pages/LoginPage.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md", "data-id": "jhjfy039g", "data-path": "src/pages/LoginPage.tsx", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center mb-8", "data-id": "rq6vbuqss", "data-path": "src/pages/LoginPage.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center", "data-id": "1wp02bgiu", "data-path": "src/pages/LoginPage.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 transform hover:scale-105 transition-transform duration-200", "data-id": "4vshqpwf7", "data-path": "src/pages/LoginPage.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Logo, { size: "xl", showText: false, className: "mb-4", "data-id": "zu56lqzhr", "data-path": "src/pages/LoginPage.tsx" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold bg-gradient-to-r from-blue-800 to-indigo-800 bg-clip-text text-transparent mb-2", "data-id": "yu886bozh", "data-path": "src/pages/LoginPage.tsx", children: "DFS Manager Portal" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-600 font-medium", "data-id": "vqlhciznd", "data-path": "src/pages/LoginPage.tsx", children: "Gas Station Management System" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "shadow-2xl border-0 backdrop-blur-sm bg-white/95", "data-id": "f0i8rryu3", "data-path": "src/pages/LoginPage.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "space-y-1 pb-6", "data-id": "6qjh22mrn", "data-path": "src/pages/LoginPage.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-2xl font-bold text-center text-slate-800", "data-id": "5ji5apmyx", "data-path": "src/pages/LoginPage.tsx", children: getFormTitle() }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-center text-slate-600", "data-id": "hcjheekl1", "data-path": "src/pages/LoginPage.tsx", children: getFormDescription() })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { "data-id": "1c0vgqqv8", "data-path": "src/pages/LoginPage.tsx", children: [
        message && /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { className: `mb-4 ${messageType === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`, "data-id": "6wkxm01r6", "data-path": "src/pages/LoginPage.tsx", children: [
          messageType === "success" ? /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle2, { className: "h-4 w-4 text-green-600", "data-id": "0byobyvoj", "data-path": "src/pages/LoginPage.tsx" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(AlertCircle, { className: "h-4 w-4 text-red-600", "data-id": "8i1q65grn", "data-path": "src/pages/LoginPage.tsx" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { className: messageType === "success" ? "text-green-800" : "text-red-800", "data-id": "hv52jqdv3", "data-path": "src/pages/LoginPage.tsx", children: message })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", "data-id": "ko5sxb44f", "data-path": "src/pages/LoginPage.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "wob81wdbs", "data-path": "src/pages/LoginPage.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "email", className: "text-slate-700 font-medium", "data-id": "c4t9jbvi7", "data-path": "src/pages/LoginPage.tsx", children: "Email Address" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", "data-id": "4gkxupm8z", "data-path": "src/pages/LoginPage.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4", "data-id": "52fcjkm2m", "data-path": "src/pages/LoginPage.tsx" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "email",
                  type: "email",
                  placeholder: "Enter your email",
                  value: email,
                  onChange: (e) => setEmail(e.target.value),
                  required: true,
                  className: "h-11 pl-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500",
                  "data-id": "2xzzs2py7",
                  "data-path": "src/pages/LoginPage.tsx"
                }
              )
            ] })
          ] }),
          authMode !== "forgot-password" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "cozmvmhu4", "data-path": "src/pages/LoginPage.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "password", className: "text-slate-700 font-medium", "data-id": "0giglj74c", "data-path": "src/pages/LoginPage.tsx", children: "Password" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", "data-id": "efgorijtx", "data-path": "src/pages/LoginPage.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4", "data-id": "4s89t4v82", "data-path": "src/pages/LoginPage.tsx" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "password",
                  type: showPassword ? "text" : "password",
                  placeholder: "Enter your password",
                  value: password,
                  onChange: (e) => setPassword(e.target.value),
                  required: true,
                  className: "h-11 pl-10 pr-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500",
                  "data-id": "c1ass35rn",
                  "data-path": "src/pages/LoginPage.tsx"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setShowPassword(!showPassword),
                  className: "absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600",
                  "data-id": "uabn2ylgi",
                  "data-path": "src/pages/LoginPage.tsx",
                  children: showPassword ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "h-4 w-4", "data-id": "c52k1mmaj", "data-path": "src/pages/LoginPage.tsx" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4", "data-id": "rvyoo10vx", "data-path": "src/pages/LoginPage.tsx" })
                }
              )
            ] })
          ] }),
          authMode === "register" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "p7ux041vi", "data-path": "src/pages/LoginPage.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "confirmPassword", className: "text-slate-700 font-medium", "data-id": "acc0apzqz", "data-path": "src/pages/LoginPage.tsx", children: "Confirm Password" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", "data-id": "uui7a7s0l", "data-path": "src/pages/LoginPage.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4", "data-id": "pry3u41id", "data-path": "src/pages/LoginPage.tsx" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "confirmPassword",
                  type: showConfirmPassword ? "text" : "password",
                  placeholder: "Confirm your password",
                  value: confirmPassword,
                  onChange: (e) => setConfirmPassword(e.target.value),
                  required: true,
                  className: "h-11 pl-10 pr-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500",
                  "data-id": "vvyxbyhz0",
                  "data-path": "src/pages/LoginPage.tsx"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setShowConfirmPassword(!showConfirmPassword),
                  className: "absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600",
                  "data-id": "q8rddb71u",
                  "data-path": "src/pages/LoginPage.tsx",
                  children: showConfirmPassword ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "h-4 w-4", "data-id": "b1wn8zcnx", "data-path": "src/pages/LoginPage.tsx" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4", "data-id": "6sejlsvlj", "data-path": "src/pages/LoginPage.tsx" })
                }
              )
            ] })
          ] }),
          authMode === "login" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-right", "data-id": "hpseh5ri0", "data-path": "src/pages/LoginPage.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "link",
              className: "p-0 h-auto text-blue-600 hover:text-blue-800 text-sm",
              onClick: () => {
                setAuthMode("forgot-password");
                setPassword("");
                setMessage("");
              },
              "data-id": "8txeeww12",
              "data-path": "src/pages/LoginPage.tsx",
              children: "Forgot password?"
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "submit",
              className: "w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium transition-all duration-200 transform hover:scale-[1.02]",
              disabled: loading,
              "data-id": "ucima2lp4",
              "data-path": "src/pages/LoginPage.tsx",
              children: [
                getSubmitButtonIcon(),
                getSubmitButtonText()
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6", "data-id": "1srgn86ni", "data-path": "src/pages/LoginPage.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "my-4", "data-id": "rv30gigct", "data-path": "src/pages/LoginPage.tsx" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-2", "data-id": "lhuxmwo33", "data-path": "src/pages/LoginPage.tsx", children: [
            authMode === "login" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "wt94m5i8c", "data-path": "src/pages/LoginPage.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-slate-600", "data-id": "6t0bdylcu", "data-path": "src/pages/LoginPage.tsx", children: "Don't have an account? " }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "link",
                  className: "p-0 h-auto font-semibold text-blue-600 hover:text-blue-800",
                  onClick: () => {
                    setAuthMode("register");
                    clearForm();
                  },
                  "data-id": "prnd21mgl",
                  "data-path": "src/pages/LoginPage.tsx",
                  children: "Create one"
                }
              )
            ] }),
            authMode === "register" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "il0pj01vz", "data-path": "src/pages/LoginPage.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-slate-600", "data-id": "ovynygwin", "data-path": "src/pages/LoginPage.tsx", children: "Already have an account? " }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "link",
                  className: "p-0 h-auto font-semibold text-blue-600 hover:text-blue-800",
                  onClick: () => {
                    setAuthMode("login");
                    clearForm();
                  },
                  "data-id": "bgtcwipo4",
                  "data-path": "src/pages/LoginPage.tsx",
                  children: "Sign in"
                }
              )
            ] }),
            authMode === "forgot-password" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "zerql7jsc", "data-path": "src/pages/LoginPage.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-slate-600", "data-id": "rirhb5dcm", "data-path": "src/pages/LoginPage.tsx", children: "Remember your password? " }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "link",
                  className: "p-0 h-auto font-semibold text-blue-600 hover:text-blue-800",
                  onClick: () => {
                    setAuthMode("login");
                    clearForm();
                  },
                  "data-id": "7v3409vz4",
                  "data-path": "src/pages/LoginPage.tsx",
                  children: "Sign in"
                }
              )
            ] })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center mt-6 text-sm text-slate-500", "data-id": "uzd26sn75", "data-path": "src/pages/LoginPage.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { "data-id": "bnjw7t0yg", "data-path": "src/pages/LoginPage.tsx", children: "© 2024 DFS Management Systems. All rights reserved." }) })
  ] }) }) });
};
export {
  LoginPage as default
};
//# sourceMappingURL=LoginPage-C5vtjqvt.js.map
