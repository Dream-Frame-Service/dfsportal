import { j as jsxRuntimeExports } from "./ui-BAZ8HTBl.js";
import { r as reactExports, u as useNavigate, i as useParams } from "./vendor-Dw3NhmYV.js";
import { c as createLucideIcon, C as Card, b as CardHeader, d as CardTitle, e as CardDescription, f as CardContent, B as Button, u as useToast, h as Badge, s as supabase, i as ArrowLeft } from "./index-xgH9wc9T.js";
import { I as Input } from "./input-DS8Y9d9X.js";
import { L as Label } from "./label-DtRhp3dR.js";
import { N as NumberInput, T as Textarea } from "./textarea-DRj8ZshS.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-D7v6NG_6.js";
import { u as useAuth } from "./AuthContext-D76ueosG.js";
import { B as Building2 } from "./building-2-oB_U8MtX.js";
import { F as Fuel, R as Receipt } from "./receipt-DFeOIU8Q.js";
import { P as Plus } from "./plus-Dv20HqtF.js";
import { T as Trash2 } from "./trash-2-CZFivf2G.js";
import { E as EnhancedFileUpload } from "./EnhancedFileUpload-BSPINCtR.js";
import { F as FileText } from "./file-text-DwQmg6EU.js";
import { A as AlertCircle } from "./alert-circle-ByZw3eax.js";
import { C as CheckCircle } from "./check-circle-_u3N8RQL.js";
import { D as DollarSign } from "./dollar-sign-DilGTaud.js";
import { T as TrendingUp } from "./trending-up-JssjaG4G.js";
import { S as Save } from "./save-DHkarsQ_.js";
import "./dialog-sqCJez4p.js";
import "./loader-2-HgtsHnjl.js";
import "./zap-DmPuvH7U.js";
import "./rotate-ccw-jweaWBVI.js";
/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Gauge = createLucideIcon("Gauge", [
  ["path", { d: "m12 14 4-4", key: "9kzdfg" }],
  ["path", { d: "M3.34 19a10 10 0 1 1 17.32 0", key: "19p75a" }]
]);
/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MapPin = createLucideIcon("MapPin", [
  ["path", { d: "M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z", key: "2oe9fu" }],
  ["circle", { cx: "12", cy: "10", r: "3", key: "ilqhr7" }]
]);
/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ShoppingCart = createLucideIcon("ShoppingCart", [
  ["circle", { cx: "8", cy: "21", r: "1", key: "jimo8o" }],
  ["circle", { cx: "19", cy: "21", r: "1", key: "13723u" }],
  [
    "path",
    {
      d: "M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12",
      key: "9zh506"
    }
  ]
]);
/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ticket = createLucideIcon("Ticket", [
  [
    "path",
    {
      d: "M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z",
      key: "qn84l0"
    }
  ],
  ["path", { d: "M13 5v2", key: "dyzc3o" }],
  ["path", { d: "M13 17v2", key: "1ont0d" }],
  ["path", { d: "M13 11v2", key: "1wjjxi" }]
]);
/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const TrendingDown = createLucideIcon("TrendingDown", [
  ["polyline", { points: "22 17 13.5 8.5 8.5 13.5 2 7", key: "1r2t7k" }],
  ["polyline", { points: "16 17 22 17 22 11", key: "11uiuu" }]
]);
const stations = [
  {
    id: "MOBIL",
    name: "MOBIL",
    location: "Far Rockaway",
    description: "Gas station with convenience store",
    color: "bg-blue-50 border-blue-200 hover:bg-blue-100"
  },
  {
    id: "AMOCO ROSEDALE",
    name: "AMOCO",
    location: "Rosedale",
    description: "Full service gas station",
    color: "bg-green-50 border-green-200 hover:bg-green-100"
  },
  {
    id: "AMOCO BROOKLYN",
    name: "AMOCO",
    location: "Brooklyn",
    description: "Full service gas station",
    color: "bg-purple-50 border-purple-200 hover:bg-purple-100"
  }
];
const StationSelector = ({ onStationSelect }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "irusfxzsh", "data-path": "src/components/StationSelector.tsx", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "text-center", "data-id": "p10v19tal", "data-path": "src/components/StationSelector.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center justify-center space-x-2", "data-id": "511h91uuu", "data-path": "src/components/StationSelector.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "w-6 h-6", "data-id": "06foisws4", "data-path": "src/components/StationSelector.tsx" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "0ljlq0fp7", "data-path": "src/components/StationSelector.tsx", children: "Select Station" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { "data-id": "hy1pfwcbu", "data-path": "src/components/StationSelector.tsx", children: "Choose the station to create a daily sales report for" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { "data-id": "c7k8k06b0", "data-path": "src/components/StationSelector.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", "data-id": "cgf5rbft6", "data-path": "src/components/StationSelector.tsx", children: stations.map(
      (station) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          className: `h-auto p-6 flex flex-col items-center space-y-3 ${station.color} transition-all duration-200`,
          onClick: () => onStationSelect(station.id),
          "data-id": "mr4v38vsu",
          "data-path": "src/components/StationSelector.tsx",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-8 h-8", "data-id": "4h8cuvkxj", "data-path": "src/components/StationSelector.tsx" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", "data-id": "5wz2tqz9n", "data-path": "src/components/StationSelector.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-lg", "data-id": "uwcv5f80d", "data-path": "src/components/StationSelector.tsx", children: station.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", "data-id": "pazyvv5ll", "data-path": "src/components/StationSelector.tsx", children: station.location }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-1", "data-id": "bav564feg", "data-path": "src/components/StationSelector.tsx", children: station.description })
            ] })
          ]
        },
        station.id
      )
    ) }) })
  ] });
};
const GasGrocerySalesSection = ({
  station,
  values,
  onChange
}) => {
  const isMobil = station === "MOBIL";
  const totalSales = values.creditCardAmount + values.debitCardAmount + values.mobileAmount + values.cashAmount + values.grocerySales;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-id": "diai4nlv0", "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-blue-50 border-blue-200", "data-id": "xl0j83sgl", "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "73mseup0u", "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-blue-800 flex items-center space-x-2", "data-id": "83t5xflpy", "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Fuel, { className: "w-5 h-5", "data-id": "nltvye4g1", "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "l9l0a6256", "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx", children: "Gas & Grocery Sales" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", "data-id": "mul7bdst7", "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", "data-id": "2dzkiqrob", "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "rl37ip09o", "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "creditCard", "data-id": "cs9oarj8q", "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx", children: "Credit Card Amount ($) *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              NumberInput,
              {
                id: "creditCard",
                value: values.creditCardAmount,
                onChange: (value) => onChange("creditCardAmount", value || 0),
                min: 0,
                step: 0.01,
                required: true,
                "data-id": "id7oxqbna",
                "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "28w1eo7oe", "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "debitCard", "data-id": "3mdnam8zt", "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx", children: "Debit Card Amount ($) *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              NumberInput,
              {
                id: "debitCard",
                value: values.debitCardAmount,
                onChange: (value) => onChange("debitCardAmount", value || 0),
                min: 0,
                step: 0.01,
                required: true,
                "data-id": "s5kq5937e",
                "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "7sz0hhfkf", "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "mobile", "data-id": "5pe3lezuv", "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx", children: "Mobile Payment Amount ($) *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              NumberInput,
              {
                id: "mobile",
                value: values.mobileAmount,
                onChange: (value) => onChange("mobileAmount", value || 0),
                min: 0,
                step: 0.01,
                required: true,
                "data-id": "jah41v0h8",
                "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "nc6hio325", "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "cash", "data-id": "kmm0g0q66", "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx", children: "Cash Amount ($) *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              NumberInput,
              {
                id: "cash",
                value: values.cashAmount,
                onChange: (value) => onChange("cashAmount", value || 0),
                min: 0,
                step: 0.01,
                required: true,
                "data-id": "u6m1wq00p",
                "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "iokmvbgxb", "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "grocery", "data-id": "r6a83mdew", "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx", children: "Grocery Sales ($) *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              NumberInput,
              {
                id: "grocery",
                value: values.grocerySales,
                onChange: (value) => onChange("grocerySales", value || 0),
                min: 0,
                step: 0.01,
                required: true,
                "data-id": "0pfy1hl3d",
                "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-4 border-t border-blue-200", "data-id": "odcpj8dfu", "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "kcq6hqjo9", "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-lg font-semibold", "data-id": "z5mkrc2r1", "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx", children: "Total Sales (Auto-calculated)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-2xl font-bold text-blue-800", "data-id": "nm5p9ebr0", "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx", children: [
              "$",
              totalSales.toFixed(2)
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-gray-600 mt-1", "data-id": "n6kzq86zq", "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx", children: [
            "Credit + Debit + Mobile + Cash + Grocery = $",
            totalSales.toFixed(2)
          ] })
        ] })
      ] })
    ] }),
    isMobil && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-green-50 border-green-200", "data-id": "af1hgre6e", "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "ngs2alqqt", "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-green-800 flex items-center space-x-2", "data-id": "9bt5ed51f", "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "w-5 h-5", "data-id": "yy2ls5h14", "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "olkvhqykl", "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx", children: "Grocery Sales Breakdown" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", "data-id": "5nu41vjfk", "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", "data-id": "v77tpkd6n", "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "aqi4b36xo", "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "groceryCash", "data-id": "cn75xmcuu", "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx", children: "Cash Sales ($) *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              NumberInput,
              {
                id: "groceryCash",
                value: values.groceryCashSales || 0,
                onChange: (value) => onChange("groceryCashSales", value || 0),
                min: 0,
                step: 0.01,
                required: true,
                "data-id": "ft2eat9ur",
                "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "3cdjltecn", "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "groceryCreditDebit", "data-id": "8i1k82e60", "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx", children: "Credit/Debit Card ($) *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              NumberInput,
              {
                id: "groceryCreditDebit",
                value: values.groceryCreditDebitSales || 0,
                onChange: (value) => onChange("groceryCreditDebitSales", value || 0),
                min: 0,
                step: 0.01,
                required: true,
                "data-id": "y1ke7r6fz",
                "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "3xwu01mhr", "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "ebt", "data-id": "19centwhu", "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx", children: "EBT ($) *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              NumberInput,
              {
                id: "ebt",
                value: values.ebtSales || 0,
                onChange: (value) => onChange("ebtSales", value || 0),
                min: 0,
                step: 0.01,
                required: true,
                "data-id": "ppzkvble8",
                "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-4 border-t border-green-200", "data-id": "eqnvuqd8n", "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "tk4k9upj6", "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-lg font-semibold", "data-id": "m0gi6t14t", "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx", children: "Total Grocery Sales" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-2xl font-bold text-green-800", "data-id": "rhlvg4yh8", "data-path": "src/components/SalesReportSections/GasGrocerySalesSection.tsx", children: [
              "$",
              ((values.groceryCashSales || 0) + (values.groceryCreditDebitSales || 0) + (values.ebtSales || 0)).toFixed(2)
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-gray-600 mt-1", children: [
            "Grocery Cash + Credit/Debit + EBT = $",
            ((values.groceryCashSales || 0) + (values.groceryCreditDebitSales || 0) + (values.ebtSales || 0)).toFixed(2)
          ] })
        ] })
      ] })
    ] })
  ] });
};
const LotterySalesSection = ({
  values,
  onChange
}) => {
  const totalLotteryCash = values.lotteryNetSales + values.scratchOffSales;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-yellow-50 border-yellow-200", "data-id": "md0s2nm2h", "data-path": "src/components/SalesReportSections/LotterySalesSection.tsx", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "rrnmqui74", "data-path": "src/components/SalesReportSections/LotterySalesSection.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-yellow-800 flex items-center space-x-2", "data-id": "un5p0qj6t", "data-path": "src/components/SalesReportSections/LotterySalesSection.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Ticket, { className: "w-5 h-5", "data-id": "evpwd8u2a", "data-path": "src/components/SalesReportSections/LotterySalesSection.tsx" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "d4drohryy", "data-path": "src/components/SalesReportSections/LotterySalesSection.tsx", children: "NY Lottery Sales" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", "data-id": "rwmoopcet", "data-path": "src/components/SalesReportSections/LotterySalesSection.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", "data-id": "ku24slxcz", "data-path": "src/components/SalesReportSections/LotterySalesSection.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "3fxu82yz5", "data-path": "src/components/SalesReportSections/LotterySalesSection.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "lotteryNet", "data-id": "oycl6vj6e", "data-path": "src/components/SalesReportSections/LotterySalesSection.tsx", children: "Net Sales ($) *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            NumberInput,
            {
              id: "lotteryNet",
              value: values.lotteryNetSales,
              onChange: (value) => onChange("lotteryNetSales", value || 0),
              min: 0,
              step: 0.01,
              required: true,
              "data-id": "krk3kmmwz",
              "data-path": "src/components/SalesReportSections/LotterySalesSection.tsx"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "bg9viufpm", "data-path": "src/components/SalesReportSections/LotterySalesSection.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "scratchOff", "data-id": "wccdzh8el", "data-path": "src/components/SalesReportSections/LotterySalesSection.tsx", children: "Scratch Off Sales ($) *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            NumberInput,
            {
              id: "scratchOff",
              value: values.scratchOffSales,
              onChange: (value) => onChange("scratchOffSales", value || 0),
              min: 0,
              step: 0.01,
              required: true,
              "data-id": "sipyopeo2",
              "data-path": "src/components/SalesReportSections/LotterySalesSection.tsx"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-4 border-t border-yellow-200", "data-id": "bbmw5hzjd", "data-path": "src/components/SalesReportSections/LotterySalesSection.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "2i1945lo8", "data-path": "src/components/SalesReportSections/LotterySalesSection.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-lg font-semibold", "data-id": "ob0z8k2ai", "data-path": "src/components/SalesReportSections/LotterySalesSection.tsx", children: "Total Sales Cash (Auto-calculated)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-2xl font-bold text-yellow-800", "data-id": "mvab1n4d7", "data-path": "src/components/SalesReportSections/LotterySalesSection.tsx", children: [
            "$",
            totalLotteryCash.toFixed(2)
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-gray-600 mt-1", "data-id": "6zp1re2ek", "data-path": "src/components/SalesReportSections/LotterySalesSection.tsx", children: [
          "Net Sales + Scratch Off = $",
          totalLotteryCash.toFixed(2)
        ] })
      ] })
    ] })
  ] });
};
const GasTankReportSection = ({
  values,
  onChange
}) => {
  const totalGallons = values.regularGallons + values.superGallons + values.dieselGallons;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-red-50 border-red-200", "data-id": "puq5bgwl9", "data-path": "src/components/SalesReportSections/GasTankReportSection.tsx", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "gqed43qpz", "data-path": "src/components/SalesReportSections/GasTankReportSection.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-red-800 flex items-center space-x-2", "data-id": "qat72qfwp", "data-path": "src/components/SalesReportSections/GasTankReportSection.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Gauge, { className: "w-5 h-5", "data-id": "oqlmw5tzc", "data-path": "src/components/SalesReportSections/GasTankReportSection.tsx" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "tceex993p", "data-path": "src/components/SalesReportSections/GasTankReportSection.tsx", children: "Gas Tank Report" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", "data-id": "diljp6f7l", "data-path": "src/components/SalesReportSections/GasTankReportSection.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", "data-id": "2cyfwq3wm", "data-path": "src/components/SalesReportSections/GasTankReportSection.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "od5pc9akg", "data-path": "src/components/SalesReportSections/GasTankReportSection.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "regular", "data-id": "lc987qu7n", "data-path": "src/components/SalesReportSections/GasTankReportSection.tsx", children: "Regular (Gallons) *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            NumberInput,
            {
              id: "regular",
              value: values.regularGallons,
              onChange: (value) => onChange("regularGallons", value || 0),
              min: 0,
              step: 0.01,
              required: true,
              "data-id": "u6tif438z",
              "data-path": "src/components/SalesReportSections/GasTankReportSection.tsx"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "k3rap7fq7", "data-path": "src/components/SalesReportSections/GasTankReportSection.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "super", "data-id": "fygnqnwil", "data-path": "src/components/SalesReportSections/GasTankReportSection.tsx", children: "Super (Gallons) *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            NumberInput,
            {
              id: "super",
              value: values.superGallons,
              onChange: (value) => onChange("superGallons", value || 0),
              min: 0,
              step: 0.01,
              required: true,
              "data-id": "fjp8n70ad",
              "data-path": "src/components/SalesReportSections/GasTankReportSection.tsx"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "c7tgyaffh", "data-path": "src/components/SalesReportSections/GasTankReportSection.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "diesel", "data-id": "gl01iiaml", "data-path": "src/components/SalesReportSections/GasTankReportSection.tsx", children: "Diesel (Gallons) *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            NumberInput,
            {
              id: "diesel",
              value: values.dieselGallons,
              onChange: (value) => onChange("dieselGallons", value || 0),
              min: 0,
              step: 0.01,
              required: true,
              "data-id": "pt98u4vwk",
              "data-path": "src/components/SalesReportSections/GasTankReportSection.tsx"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-4 border-t border-red-200", "data-id": "lxwfw7ile", "data-path": "src/components/SalesReportSections/GasTankReportSection.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "rkxbkowzr", "data-path": "src/components/SalesReportSections/GasTankReportSection.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-lg font-semibold", "data-id": "ov1wi7ykc", "data-path": "src/components/SalesReportSections/GasTankReportSection.tsx", children: "Total Gallons Sold (Auto-calculated)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-2xl font-bold text-red-800", "data-id": "ek6hf9mxg", "data-path": "src/components/SalesReportSections/GasTankReportSection.tsx", children: [
            totalGallons.toFixed(2),
            " gal"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-gray-600 mt-1", "data-id": "8vl0ixxvy", "data-path": "src/components/SalesReportSections/GasTankReportSection.tsx", children: [
          "Regular + Super + Diesel = ",
          totalGallons.toFixed(2),
          " gallons"
        ] })
      ] })
    ] })
  ] });
};
const ExpensesSection = ({
  expenses,
  onChange
}) => {
  const [vendors, setVendors] = reactExports.useState([]);
  const [isLoadingVendors, setIsLoadingVendors] = reactExports.useState(true);
  const { toast } = useToast();
  reactExports.useEffect(() => {
    loadVendors();
  }, []);
  const loadVendors = async () => {
    try {
      const { data, error } = await window.ezsite.apis.tablePage(11729, {
        PageNo: 1,
        PageSize: 100,
        OrderByField: "vendor_name",
        IsAsc: true,
        Filters: [{ name: "is_active", op: "Equal", value: true }]
      });
      if (error) throw error;
      setVendors((data == null ? void 0 : data.List) || []);
    } catch (error) {
      console.error("Error loading vendors:", error);
      toast({
        title: "Error",
        description: "Failed to load vendors",
        variant: "destructive"
      });
    } finally {
      setIsLoadingVendors(false);
    }
  };
  const addExpense = () => {
    const newExpense = {
      id: Date.now().toString(),
      vendorId: "",
      vendorName: "",
      amount: 0,
      paymentType: "Cash",
      notes: ""
    };
    onChange([...expenses, newExpense]);
  };
  const updateExpense = (index, field, value) => {
    const updatedExpenses = [...expenses];
    updatedExpenses[index] = { ...updatedExpenses[index], [field]: value };
    if (field === "vendorId") {
      const vendor = vendors.find((v) => v.id.toString() === value);
      updatedExpenses[index].vendorName = (vendor == null ? void 0 : vendor.vendor_name) || "";
    }
    onChange(updatedExpenses);
  };
  const removeExpense = (index) => {
    const updatedExpenses = expenses.filter((_, i) => i !== index);
    onChange(updatedExpenses);
  };
  const uploadInvoice = async (index, file) => {
    try {
      const { data: fileId, error } = await window.ezsite.apis.upload({
        filename: file.name,
        file
      });
      if (error) throw error;
      updateExpense(index, "invoiceFileId", fileId);
      toast({
        title: "Success",
        description: "Invoice uploaded successfully"
      });
    } catch (error) {
      console.error("Error uploading invoice:", error);
      toast({
        title: "Error",
        description: "Failed to upload invoice",
        variant: "destructive"
      });
    }
  };
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const cashExpenses = expenses.filter((e) => e.paymentType === "Cash").reduce((sum, expense) => sum + expense.amount, 0);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-orange-50 border-orange-200", "data-id": "8s4jyz0ye", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "9q6fpwuhf", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-orange-800 flex items-center justify-between", "data-id": "e8612nboz", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", "data-id": "f3tgruxa3", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Receipt, { className: "w-5 h-5", "data-id": "0b0ei6kw1", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "0r7l9c2um", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx", children: "Expenses" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          variant: "outline",
          size: "sm",
          onClick: addExpense,
          className: "bg-white hover:bg-orange-100",
          "data-id": "xd7m103a4",
          "data-path": "src/components/SalesReportSections/ExpensesSection.tsx",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4 mr-2", "data-id": "ymcugiivr", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx" }),
            "Add Expense"
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", "data-id": "d6qd6ntr5", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx", children: [
      expenses.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-8 text-gray-500", "data-id": "slelzjhkg", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx", children: 'No expenses recorded. Click "Add Expense" to get started.' }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", "data-id": "5veqkm2cc", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx", children: expenses.map(
        (expense, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-orange-200 rounded-lg p-4 bg-white", "data-id": "y7c1ov1eb", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", "data-id": "2uuz45n3a", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "text-orange-700", "data-id": "e7p29gkbq", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx", children: [
              "Expense #",
              index + 1
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "ghost",
                size: "sm",
                onClick: () => removeExpense(index),
                className: "text-red-600 hover:text-red-800 hover:bg-red-50",
                "data-id": "f2lyywjc6",
                "data-path": "src/components/SalesReportSections/ExpensesSection.tsx",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4", "data-id": "pwp137tvd", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", "data-id": "xbuew8w28", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "ypnu70e3j", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { "data-id": "qvu2fvneb", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx", children: "Vendor *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: expense.vendorId,
                  onValueChange: (value) => updateExpense(index, "vendorId", value),
                  "data-id": "qp7r0ya4x",
                  "data-path": "src/components/SalesReportSections/ExpensesSection.tsx",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-id": "ezrj9ri0j", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select vendor", "data-id": "pdzv3bgrl", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { "data-id": "2hlzy69gn", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx", children: vendors.map(
                      (vendor) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: vendor.id.toString(), "data-id": "4kr3q80pb", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx", children: vendor.vendor_name }, vendor.id)
                    ) })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "cam123ne1", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { "data-id": "0r5xsph9q", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx", children: "Amount ($) *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                NumberInput,
                {
                  value: expense.amount,
                  onChange: (value) => updateExpense(index, "amount", value || 0),
                  min: 0,
                  step: 0.01,
                  required: true,
                  "data-id": "34gmn3xeb",
                  "data-path": "src/components/SalesReportSections/ExpensesSection.tsx"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "i4n8pesca", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { "data-id": "u6mtm3uqb", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx", children: "Payment Type *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: expense.paymentType,
                  onValueChange: (value) => updateExpense(index, "paymentType", value),
                  "data-id": "4v18561t7",
                  "data-path": "src/components/SalesReportSections/ExpensesSection.tsx",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-id": "8q1gee677", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { "data-id": "hvczwac5s", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { "data-id": "9cr91sv8g", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Cash", "data-id": "pwehtns07", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx", children: "Cash" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Credit Card", "data-id": "8sahhhgrq", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx", children: "Credit Card" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Cheque", "data-id": "25755f0aj", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx", children: "Cheque" })
                    ] })
                  ]
                }
              )
            ] }),
            expense.paymentType === "Cheque" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "xuklz1qb3", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { "data-id": "nj2inloa4", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx", children: "Cheque Number *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: expense.chequeNo || "",
                  onChange: (e) => updateExpense(index, "chequeNo", e.target.value),
                  placeholder: "Enter cheque number",
                  required: true,
                  "data-id": "s6700220n",
                  "data-path": "src/components/SalesReportSections/ExpensesSection.tsx"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2 space-y-2", "data-id": "fdicvsdtd", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { "data-id": "y7ibsrsc8", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx", children: "Upload Invoice * (Mandatory)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", "data-id": "exwggg5w6", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    type: "file",
                    accept: ".pdf,.jpg,.jpeg,.png",
                    onChange: (e) => {
                      var _a;
                      const file = (_a = e.target.files) == null ? void 0 : _a[0];
                      if (file) uploadInvoice(index, file);
                    },
                    className: "flex-1",
                    "data-id": "w0v0v781x",
                    "data-path": "src/components/SalesReportSections/ExpensesSection.tsx"
                  }
                ),
                expense.invoiceFileId && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "default", className: "bg-green-100 text-green-800", "data-id": "i3a0r7ud3", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx", children: "✓ Uploaded" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2 space-y-2", "data-id": "7j1a92ra6", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { "data-id": "bw9gs3gd7", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx", children: "Notes" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Textarea,
                {
                  value: expense.notes,
                  onChange: (e) => updateExpense(index, "notes", e.target.value),
                  placeholder: "Additional notes about this expense...",
                  rows: 2,
                  "data-id": "qfrklgc31",
                  "data-path": "src/components/SalesReportSections/ExpensesSection.tsx"
                }
              )
            ] })
          ] })
        ] }, expense.id)
      ) }),
      expenses.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-4 border-t border-orange-200 bg-orange-100 rounded-lg p-4", "data-id": "gq5v4elnv", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", "data-id": "2cgi84vxt", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "frpbg1gq5", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "font-semibold", "data-id": "75swav90q", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx", children: "Total Expenses:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xl font-bold text-orange-800", "data-id": "1z1ki8c4t", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx", children: [
            "$",
            totalExpenses.toFixed(2)
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "wb35hkczm", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "font-semibold", "data-id": "qni7lr8i7", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx", children: "Cash Expenses:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xl font-bold text-orange-800", "data-id": "fvv1xtsnf", "data-path": "src/components/SalesReportSections/ExpensesSection.tsx", children: [
            "$",
            cashExpenses.toFixed(2)
          ] })
        ] })
      ] }) })
    ] })
  ] });
};
const DocumentsUploadSection = ({
  documents,
  onChange
}) => {
  const { toast } = useToast();
  const documentTypes = [
    {
      name: "Day Report",
      field: "dayReportFileId",
      fileId: documents.dayReportFileId,
      required: true
    },
    {
      name: "Veeder Root Report",
      field: "veederRootFileId",
      fileId: documents.veederRootFileId,
      required: true
    },
    {
      name: "Lotto Report",
      field: "lottoReportFileId",
      fileId: documents.lottoReportFileId,
      required: true
    },
    {
      name: "Scratch Off Report",
      field: "scratchOffReportFileId",
      fileId: documents.scratchOffReportFileId,
      required: true
    }
  ];
  const uploadDocument = async (field, file) => {
    try {
      const { data: fileId, error } = await window.ezsite.apis.upload({
        filename: file.name,
        file
      });
      if (error) throw error;
      onChange(field, fileId);
      toast({
        title: "Success",
        description: `${field.replace("FileId", "").replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())} uploaded successfully`
      });
    } catch (error) {
      console.error("Error uploading document:", error);
      toast({
        title: "Error",
        description: "Failed to upload document",
        variant: "destructive"
      });
    }
  };
  const getStatus = (document) => {
    if (document.fileId) {
      return {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle, { className: "w-4 h-4", "data-id": "sks67egpd", "data-path": "src/components/SalesReportSections/DocumentsUploadSection.tsx" }),
        text: "Submitted",
        color: "bg-green-100 text-green-800 border-green-200"
      };
    } else {
      return {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(AlertCircle, { className: "w-4 h-4", "data-id": "8s2y4ovqb", "data-path": "src/components/SalesReportSections/DocumentsUploadSection.tsx" }),
        text: "Not Submitted",
        color: "bg-red-100 text-red-800 border-red-200"
      };
    }
  };
  const submittedCount = documentTypes.filter((doc) => doc.fileId).length;
  const totalCount = documentTypes.length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-purple-50 border-purple-200", "data-id": "da6aamhvp", "data-path": "src/components/SalesReportSections/DocumentsUploadSection.tsx", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "04f953vf2", "data-path": "src/components/SalesReportSections/DocumentsUploadSection.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-purple-800 flex items-center justify-between", "data-id": "eov3p51ho", "data-path": "src/components/SalesReportSections/DocumentsUploadSection.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", "data-id": "xkmyszizx", "data-path": "src/components/SalesReportSections/DocumentsUploadSection.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-5 h-5", "data-id": "gpnj8pian", "data-path": "src/components/SalesReportSections/DocumentsUploadSection.tsx" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "fgfncjakl", "data-path": "src/components/SalesReportSections/DocumentsUploadSection.tsx", children: "Documents Upload" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Badge,
        {
          variant: "outline",
          className: submittedCount === totalCount ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800",
          "data-id": "1oyappxv4",
          "data-path": "src/components/SalesReportSections/DocumentsUploadSection.tsx",
          children: [
            submittedCount,
            "/",
            totalCount,
            " Submitted"
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", "data-id": "b1v0lp0ox", "data-path": "src/components/SalesReportSections/DocumentsUploadSection.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4", "data-id": "ejrimpm70", "data-path": "src/components/SalesReportSections/DocumentsUploadSection.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", "data-id": "9gf12xieo", "data-path": "src/components/SalesReportSections/DocumentsUploadSection.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertCircle, { className: "w-5 h-5 text-yellow-600", "data-id": "lcdowj33j", "data-path": "src/components/SalesReportSections/DocumentsUploadSection.tsx" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-yellow-800", "data-id": "qkgnkiln4", "data-path": "src/components/SalesReportSections/DocumentsUploadSection.tsx", children: "Mandatory Submission Required" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-yellow-700 mt-1", "data-id": "5umjhai04", "data-path": "src/components/SalesReportSections/DocumentsUploadSection.tsx", children: "All documents must be uploaded before submitting the sales report." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", "data-id": "c3b1nfead", "data-path": "src/components/SalesReportSections/DocumentsUploadSection.tsx", children: documentTypes.map((document) => {
        const status = getStatus(document);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-purple-200 rounded-lg p-4 bg-white", "data-id": "s0vf8sp06", "data-path": "src/components/SalesReportSections/DocumentsUploadSection.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", "data-id": "0ranf1d2m", "data-path": "src/components/SalesReportSections/DocumentsUploadSection.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-3", "data-id": "8d7hog8p6", "data-path": "src/components/SalesReportSections/DocumentsUploadSection.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-5 h-5 text-purple-600", "data-id": "937z7hqa6", "data-path": "src/components/SalesReportSections/DocumentsUploadSection.tsx" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", "data-id": "eg054l9zf", "data-path": "src/components/SalesReportSections/DocumentsUploadSection.tsx", children: document.name }),
              document.required && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "destructive", className: "text-xs", "data-id": "jvkob4m8d", "data-path": "src/components/SalesReportSections/DocumentsUploadSection.tsx", children: "Required" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: status.color, "data-id": "x1vf9s4lc", "data-path": "src/components/SalesReportSections/DocumentsUploadSection.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-1", "data-id": "xp8646eiz", "data-path": "src/components/SalesReportSections/DocumentsUploadSection.tsx", children: [
              status.icon,
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "yrum97r6j", "data-path": "src/components/SalesReportSections/DocumentsUploadSection.tsx", children: status.text })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", "data-id": "p5q0gbeh9", "data-path": "src/components/SalesReportSections/DocumentsUploadSection.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            EnhancedFileUpload,
            {
              onFileSelect: (file) => uploadDocument(document.field, file),
              accept: ".pdf,.jpg,.jpeg,.png,.doc,.docx,image/*",
              label: document.fileId ? "Re-upload Document" : "Upload Document",
              maxSize: 15,
              allowCamera: true,
              className: "w-full",
              "data-id": "2p4b12zre",
              "data-path": "src/components/SalesReportSections/DocumentsUploadSection.tsx"
            }
          ) }),
          document.fileId && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 text-xs text-green-600 flex items-center space-x-1", "data-id": "amy0jlo5g", "data-path": "src/components/SalesReportSections/DocumentsUploadSection.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle, { className: "w-3 h-3", "data-id": "hckse27xo", "data-path": "src/components/SalesReportSections/DocumentsUploadSection.tsx" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { "data-id": "844ntkc2s", "data-path": "src/components/SalesReportSections/DocumentsUploadSection.tsx", children: [
              "File uploaded successfully (ID: ",
              document.fileId,
              ")"
            ] })
          ] })
        ] }, document.field);
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-4 border-t border-purple-200", "data-id": "a072ppect", "data-path": "src/components/SalesReportSections/DocumentsUploadSection.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm", "data-id": "nj50gh2gq", "data-path": "src/components/SalesReportSections/DocumentsUploadSection.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-600", "data-id": "8m2fenubm", "data-path": "src/components/SalesReportSections/DocumentsUploadSection.tsx", children: "Submission Progress:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", "data-id": "fsrr66fo2", "data-path": "src/components/SalesReportSections/DocumentsUploadSection.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-32 bg-gray-200 rounded-full h-2", "data-id": "q9p0jj421", "data-path": "src/components/SalesReportSections/DocumentsUploadSection.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "bg-purple-600 h-2 rounded-full transition-all duration-300",
              style: { width: `${submittedCount / totalCount * 100}%` },
              "data-id": "od4i770z4",
              "data-path": "src/components/SalesReportSections/DocumentsUploadSection.tsx"
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium text-purple-800", "data-id": "oc9hls9kc", "data-path": "src/components/SalesReportSections/DocumentsUploadSection.tsx", children: [
            Math.round(submittedCount / totalCount * 100),
            "%"
          ] })
        ] })
      ] }) })
    ] })
  ] });
};
const CashCollectionSection = ({
  values,
  onChange
}) => {
  const expectedCash = values.totalCashFromSales - values.totalCashFromExpenses;
  const shortOver = values.cashCollectionOnHand - expectedCash;
  const isShort = shortOver < 0;
  const isOver = shortOver > 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-gray-50 border-gray-200", "data-id": "b8zsgc17l", "data-path": "src/components/SalesReportSections/CashCollectionSection.tsx", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "02w8t5auq", "data-path": "src/components/SalesReportSections/CashCollectionSection.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-gray-800 flex items-center space-x-2", "data-id": "hhqvcw364", "data-path": "src/components/SalesReportSections/CashCollectionSection.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "w-5 h-5", "data-id": "xd3g6tv50", "data-path": "src/components/SalesReportSections/CashCollectionSection.tsx" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "iae9et2kd", "data-path": "src/components/SalesReportSections/CashCollectionSection.tsx", children: "Cash Collection" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", "data-id": "q8y6trpde", "data-path": "src/components/SalesReportSections/CashCollectionSection.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", "data-id": "gohpm80qi", "data-path": "src/components/SalesReportSections/CashCollectionSection.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "iekcjvesy", "data-path": "src/components/SalesReportSections/CashCollectionSection.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "cashOnHand", "data-id": "wq4t4tfd4", "data-path": "src/components/SalesReportSections/CashCollectionSection.tsx", children: "Cash Collection on Hand ($) *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            NumberInput,
            {
              id: "cashOnHand",
              value: values.cashCollectionOnHand,
              onChange: (value) => onChange("cashCollectionOnHand", value || 0),
              min: 0,
              step: 0.01,
              required: true,
              "data-id": "56xnb4q1a",
              "data-path": "src/components/SalesReportSections/CashCollectionSection.tsx"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-gray-600", "data-id": "af8w7pm07", "data-path": "src/components/SalesReportSections/CashCollectionSection.tsx", children: "Physical cash counted at end of shift" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "9kcg690fi", "data-path": "src/components/SalesReportSections/CashCollectionSection.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { "data-id": "jzbejnd0v", "data-path": "src/components/SalesReportSections/CashCollectionSection.tsx", children: "Expected Cash ($)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 px-3 py-2 border border-gray-200 rounded-md bg-gray-100 flex items-center", "data-id": "kamq1z5k9", "data-path": "src/components/SalesReportSections/CashCollectionSection.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-gray-700 font-medium", "data-id": "3hqtt6enp", "data-path": "src/components/SalesReportSections/CashCollectionSection.tsx", children: [
            "$",
            expectedCash.toFixed(2)
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-gray-600", "data-id": "6dhtfxg7m", "data-path": "src/components/SalesReportSections/CashCollectionSection.tsx", children: "Cash sales - Cash expenses" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "azrus5mli", "data-path": "src/components/SalesReportSections/CashCollectionSection.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { "data-id": "ufx835pcj", "data-path": "src/components/SalesReportSections/CashCollectionSection.tsx", children: "Total (+/-) Short/Over" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-10 px-3 py-2 border rounded-md flex items-center justify-between bg-white", "data-id": "iyxho6guo", "data-path": "src/components/SalesReportSections/CashCollectionSection.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `font-bold text-lg ${isShort ? "text-red-600" : isOver ? "text-green-600" : "text-gray-700"}`, "data-id": "c96gox6fv", "data-path": "src/components/SalesReportSections/CashCollectionSection.tsx", children: [
              "$",
              Math.abs(shortOver).toFixed(2)
            ] }),
            isShort && /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { className: "w-5 h-5 text-red-600", "data-id": "gdth30qoo", "data-path": "src/components/SalesReportSections/CashCollectionSection.tsx" }),
            isOver && /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-5 h-5 text-green-600", "data-id": "72chsswmc", "data-path": "src/components/SalesReportSections/CashCollectionSection.tsx" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-1", "data-id": "dsc0xmsym", "data-path": "src/components/SalesReportSections/CashCollectionSection.tsx", children: [
            isShort && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "destructive", className: "text-xs", "data-id": "24vmulrxa", "data-path": "src/components/SalesReportSections/CashCollectionSection.tsx", children: "Short" }),
            isOver && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-green-100 text-green-800 text-xs", "data-id": "9weqlvere", "data-path": "src/components/SalesReportSections/CashCollectionSection.tsx", children: "Over" }),
            !isShort && !isOver && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs", "data-id": "mo372y04t", "data-path": "src/components/SalesReportSections/CashCollectionSection.tsx", children: "Exact" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-4 border-t border-gray-200 bg-blue-50 rounded-lg p-4", "data-id": "ympokidez", "data-path": "src/components/SalesReportSections/CashCollectionSection.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-blue-800 space-y-2", "data-id": "pbb2nttqe", "data-path": "src/components/SalesReportSections/CashCollectionSection.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", "data-id": "b0vzcouye", "data-path": "src/components/SalesReportSections/CashCollectionSection.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "ylpybcqdv", "data-path": "src/components/SalesReportSections/CashCollectionSection.tsx", children: "Cash Sales:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium", "data-id": "qakitw5qn", "data-path": "src/components/SalesReportSections/CashCollectionSection.tsx", children: [
            "$",
            values.totalCashFromSales.toFixed(2)
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", "data-id": "r3j32iex8", "data-path": "src/components/SalesReportSections/CashCollectionSection.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "uvpqcnil2", "data-path": "src/components/SalesReportSections/CashCollectionSection.tsx", children: "Cash Expenses:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium", "data-id": "qs3dz0wzm", "data-path": "src/components/SalesReportSections/CashCollectionSection.tsx", children: [
            "-$",
            values.totalCashFromExpenses.toFixed(2)
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between border-t border-blue-200 pt-2 font-semibold", "data-id": "rlbrp814k", "data-path": "src/components/SalesReportSections/CashCollectionSection.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "byi0b7jzg", "data-path": "src/components/SalesReportSections/CashCollectionSection.tsx", children: "Expected Cash:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { "data-id": "6df1hrwj0", "data-path": "src/components/SalesReportSections/CashCollectionSection.tsx", children: [
            "$",
            expectedCash.toFixed(2)
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", "data-id": "v9190wohq", "data-path": "src/components/SalesReportSections/CashCollectionSection.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "vi7rxiek8", "data-path": "src/components/SalesReportSections/CashCollectionSection.tsx", children: "Actual Cash on Hand:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium", "data-id": "g1y326ojh", "data-path": "src/components/SalesReportSections/CashCollectionSection.tsx", children: [
            "$",
            values.cashCollectionOnHand.toFixed(2)
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex justify-between border-t border-blue-200 pt-2 font-bold ${isShort ? "text-red-600" : isOver ? "text-green-600" : "text-blue-800"}`, "data-id": "htux0asjd", "data-path": "src/components/SalesReportSections/CashCollectionSection.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "8wwbazsn7", "data-path": "src/components/SalesReportSections/CashCollectionSection.tsx", children: "Difference:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { "data-id": "09n355m2s", "data-path": "src/components/SalesReportSections/CashCollectionSection.tsx", children: [
            isShort ? "-" : "+",
            "$",
            Math.abs(shortOver).toFixed(2)
          ] })
        ] })
      ] }) })
    ] })
  ] });
};
function SalesReportForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const { user } = useAuth();
  const isEditing = !!id;
  const [selectedStation, setSelectedStation] = reactExports.useState("");
  const [employees, setEmployees] = reactExports.useState([]);
  const [isLoadingEmployees, setIsLoadingEmployees] = reactExports.useState(false);
  const [formData, setFormData] = reactExports.useState({
    report_date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    station: "",
    shift: "DAY",
    employee_name: "",
    employee_id: "",
    // Cash Collection
    cashCollectionOnHand: 0,
    // Gas & Grocery Sales
    creditCardAmount: 0,
    debitCardAmount: 0,
    mobileAmount: 0,
    cashAmount: 0,
    grocerySales: 0,
    ebtSales: 0,
    // MOBIL only
    // Separate Grocery Sales Breakdown Fields
    groceryCashSales: 0,
    groceryCreditDebitSales: 0,
    // Lottery
    lotteryNetSales: 0,
    scratchOffSales: 0,
    // Gas Tank Report
    regularGallons: 0,
    superGallons: 0,
    dieselGallons: 0,
    // Documents
    dayReportFileId: void 0,
    veederRootFileId: void 0,
    lottoReportFileId: void 0,
    scratchOffReportFileId: void 0,
    // Notes
    notes: ""
  });
  const [expenses, setExpenses] = reactExports.useState([]);
  reactExports.useEffect(() => {
    if (selectedStation) {
      setFormData((prev) => ({ ...prev, station: selectedStation }));
      loadEmployees(selectedStation);
    }
  }, [selectedStation]);
  reactExports.useEffect(() => {
    if (isEditing && id) {
      loadExistingReport();
    }
  }, [isEditing, id]);
  const loadExistingReport = async () => {
    try {
      const { data, error } = await supabase.from("daily_sales_reports_enhanced").select("*").eq("id", parseInt(id)).limit(1).single();
      if (error) throw error;
      if (data) {
        const report = data;
        setSelectedStation(report.station);
        setFormData({
          report_date: report.report_date.split("T")[0],
          station: report.station,
          shift: report.shift || "DAY",
          employee_name: report.employee_name,
          employee_id: report.employee_id || "",
          cashCollectionOnHand: report.cash_collection_on_hand,
          creditCardAmount: report.credit_card_amount,
          debitCardAmount: report.debit_card_amount,
          mobileAmount: report.mobile_amount,
          cashAmount: report.cash_amount,
          grocerySales: report.grocery_sales,
          ebtSales: report.ebt_sales,
          groceryCashSales: report.grocery_cash_sales || 0,
          groceryCreditDebitSales: report.grocery_credit_debit_sales || 0,
          lotteryNetSales: report.lottery_net_sales,
          scratchOffSales: report.scratch_off_sales,
          regularGallons: report.regular_gallons,
          superGallons: report.super_gallons,
          dieselGallons: report.diesel_gallons,
          dayReportFileId: report.day_report_file_id,
          veederRootFileId: report.veeder_root_file_id,
          lottoReportFileId: report.lotto_report_file_id,
          scratchOffReportFileId: report.scratch_off_report_file_id,
          notes: report.notes
        });
        if (report.expenses_data) {
          try {
            setExpenses(JSON.parse(report.expenses_data));
          } catch (e) {
            console.error("Error parsing expenses data:", e);
          }
        }
      }
    } catch (error) {
      console.error("Error loading report:", error);
      toast({
        title: "Error",
        description: "Failed to load existing report",
        variant: "destructive"
      });
    }
  };
  const loadEmployees = async (station) => {
    setIsLoadingEmployees(true);
    try {
      const { data, error } = await supabase.from("employees").select("*").eq("station", station).eq("is_active", true).order("first_name", { ascending: true }).limit(100);
      if (error) throw error;
      setEmployees(data || []);
    } catch (error) {
      console.error("Error loading employees:", error);
      toast({
        title: "Error",
        description: "Failed to load employees",
        variant: "destructive"
      });
    } finally {
      setIsLoadingEmployees(false);
    }
  };
  const totalSales = formData.creditCardAmount + formData.debitCardAmount + formData.mobileAmount + formData.cashAmount + formData.grocerySales;
  const totalGallons = formData.regularGallons + formData.superGallons + formData.dieselGallons;
  const totalLotteryCash = formData.lotteryNetSales + formData.scratchOffSales;
  const totalCashFromSales = formData.cashAmount + formData.grocerySales + formData.lotteryNetSales + formData.scratchOffSales;
  const totalCashFromExpenses = expenses.filter((e) => e.paymentType === "Cash").reduce((sum, expense) => sum + expense.amount, 0);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const requiredDocs = ["dayReportFileId", "veederRootFileId", "lottoReportFileId", "scratchOffReportFileId"];
    const missingDocs = requiredDocs.filter((doc) => !formData[doc]);
    if (missingDocs.length > 0) {
      toast({
        title: "Missing Documents",
        description: "Please upload all required documents before submitting.",
        variant: "destructive"
      });
      return;
    }
    const expensesWithoutInvoices = expenses.filter((expense) => !expense.invoiceFileId);
    if (expensesWithoutInvoices.length > 0) {
      toast({
        title: "Missing Invoices",
        description: "Please upload invoices for all expenses.",
        variant: "destructive"
      });
      return;
    }
    const submitData = {
      report_date: formData.report_date,
      station: formData.station,
      shift: formData.shift,
      employee_name: formData.employee_name,
      employee_id: formData.employee_id,
      cash_collection_on_hand: formData.cashCollectionOnHand,
      total_short_over: formData.cashCollectionOnHand - (totalCashFromSales - totalCashFromExpenses),
      credit_card_amount: formData.creditCardAmount,
      debit_card_amount: formData.debitCardAmount,
      mobile_amount: formData.mobileAmount,
      cash_amount: formData.cashAmount,
      grocery_sales: formData.grocerySales,
      ebt_sales: formData.ebtSales,
      grocery_cash_sales: formData.groceryCashSales,
      grocery_credit_debit_sales: formData.groceryCreditDebitSales,
      lottery_net_sales: formData.lotteryNetSales,
      scratch_off_sales: formData.scratchOffSales,
      lottery_total_cash: totalLotteryCash,
      regular_gallons: formData.regularGallons,
      super_gallons: formData.superGallons,
      diesel_gallons: formData.dieselGallons,
      total_gallons: totalGallons,
      expenses_data: JSON.stringify(expenses),
      day_report_file_id: formData.dayReportFileId,
      veeder_root_file_id: formData.veederRootFileId,
      lotto_report_file_id: formData.lottoReportFileId,
      scratch_off_report_file_id: formData.scratchOffReportFileId,
      total_sales: totalSales,
      notes: formData.notes,
      created_by: (user == null ? void 0 : user.ID) || 0
    };
    try {
      let result;
      if (isEditing) {
        result = await supabase.from("daily_sales_reports_enhanced").update(submitData).eq("id", parseInt(id));
      } else {
        result = await supabase.from("daily_sales_reports_enhanced").insert(submitData);
      }
      if (result.error) {
        throw new Error(result.error.message);
      }
      toast({
        title: isEditing ? "Report Updated" : "Report Created",
        description: `Sales report has been ${isEditing ? "updated" : "created"} successfully.`
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Error saving report:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save report",
        variant: "destructive"
      });
    }
  };
  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const handleExpensesChange = (newExpenses) => {
    setExpenses(newExpenses);
  };
  const handleDocumentUpload = (field, fileId) => {
    setFormData((prev) => ({ ...prev, [field]: fileId }));
  };
  if (!selectedStation) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4", "data-id": "1992jutk5", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto", "data-id": "82dt9nypj", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", "data-id": "jivcyb8vs", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            onClick: () => navigate("/dashboard"),
            className: "mb-4",
            "data-id": "w52u7b3r0",
            "data-path": "src/pages/Sales/SalesReportForm.tsx",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4 mr-2", "data-id": "ojxr86pdk", "data-path": "src/pages/Sales/SalesReportForm.tsx" }),
              "Back to Reports"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold text-gray-900", "data-id": "vb18xna1a", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: "Create Daily Sales Report" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-600 mt-2", "data-id": "sv6mr3t55", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: "Step 1: Select your station to begin" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StationSelector, { onStationSelect: setSelectedStation, "data-id": "tpjxqwze1", "data-path": "src/pages/Sales/SalesReportForm.tsx" })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4", "data-id": "m7nm6l53p", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto", "data-id": "5qpv8vavd", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", "data-id": "y8n71nuuj", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          onClick: () => setSelectedStation(""),
          className: "mb-4",
          "data-id": "po9lifn3h",
          "data-path": "src/pages/Sales/SalesReportForm.tsx",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4 mr-2", "data-id": "c6zowg5yd", "data-path": "src/pages/Sales/SalesReportForm.tsx" }),
            "Change Station"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "2v555ol5c", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-3xl font-bold text-gray-900", "data-id": "9cdzibt1d", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: [
          isEditing ? "Edit" : "Create",
          " Daily Sales Report"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-gray-600 mt-2", "data-id": "dtwr1sknr", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: [
          "Station: ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", "data-id": "myzyy8d0s", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: selectedStation })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", "data-id": "r0ffml9nv", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "vix9niv3v", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "0movlh0ur", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-lg", "data-id": "ly7wzb4l7", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: "Basic Information" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { "data-id": "p3n0b2yq6", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6", "data-id": "wvm9onl7p", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "lrga58nld", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "report_date", "data-id": "banmg5c89", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: "Report Date *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "date",
                id: "report_date",
                value: formData.report_date,
                onChange: (e) => updateFormData("report_date", e.target.value),
                required: true,
                "data-id": "i8sgiah32",
                "data-path": "src/pages/Sales/SalesReportForm.tsx"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "jfhtjka0j", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { "data-id": "a1hzoaa7q", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: "Station" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 px-3 py-2 border border-gray-200 rounded-md bg-gray-100 flex items-center", "data-id": "78x8zy248", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-700 font-medium", "data-id": "fgubkl08c", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: selectedStation }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "c4xhoh3w0", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "shift", "data-id": "5wzhywn5c", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: "Shift *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: formData.shift,
                onValueChange: (value) => updateFormData("shift", value),
                "data-id": "3jt27s11c",
                "data-path": "src/pages/Sales/SalesReportForm.tsx",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-id": "ukpmiw248", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select shift", "data-id": "7x905gyno", "data-path": "src/pages/Sales/SalesReportForm.tsx" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { "data-id": "c45thqsal", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "DAY", "data-id": "9kzbwh9fw", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: "DAY" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "NIGHT", "data-id": "m4ji8msys", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: "NIGHT" })
                  ] })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "zypr5hqay", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "employee", "data-id": "ijii3lo44", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: "Employee Name *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: formData.employee_id,
                onValueChange: (value) => {
                  const selectedEmployee = employees.find((emp) => emp.employee_id === value);
                  if (selectedEmployee) {
                    updateFormData("employee_id", value);
                    updateFormData("employee_name", `${selectedEmployee.first_name} ${selectedEmployee.last_name}`);
                  }
                },
                disabled: isLoadingEmployees,
                "data-id": "bef6k6k5c",
                "data-path": "src/pages/Sales/SalesReportForm.tsx",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-id": "3zvu2xa3w", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: isLoadingEmployees ? "Loading employees..." : "Select employee", "data-id": "zdaor99vr", "data-path": "src/pages/Sales/SalesReportForm.tsx" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { "data-id": "p4h3ka3tm", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: employees.map(
                    (employee) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: employee.employee_id, "data-id": "jtjprmlro", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: [
                      employee.first_name,
                      " ",
                      employee.last_name,
                      " (ID: ",
                      employee.employee_id,
                      ")"
                    ] }, employee.id)
                  ) })
                ]
              }
            )
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        CashCollectionSection,
        {
          values: {
            cashCollectionOnHand: formData.cashCollectionOnHand,
            totalCashFromSales,
            totalCashFromExpenses
          },
          onChange: updateFormData,
          "data-id": "uxwy7v32k",
          "data-path": "src/pages/Sales/SalesReportForm.tsx"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        GasGrocerySalesSection,
        {
          station: selectedStation,
          values: {
            creditCardAmount: formData.creditCardAmount,
            debitCardAmount: formData.debitCardAmount,
            mobileAmount: formData.mobileAmount,
            cashAmount: formData.cashAmount,
            grocerySales: formData.grocerySales,
            ebtSales: formData.ebtSales,
            groceryCashSales: formData.groceryCashSales,
            groceryCreditDebitSales: formData.groceryCreditDebitSales
          },
          onChange: updateFormData,
          "data-id": "su4yecnsb",
          "data-path": "src/pages/Sales/SalesReportForm.tsx"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        LotterySalesSection,
        {
          values: {
            lotteryNetSales: formData.lotteryNetSales,
            scratchOffSales: formData.scratchOffSales
          },
          onChange: updateFormData,
          "data-id": "as7nxntuu",
          "data-path": "src/pages/Sales/SalesReportForm.tsx"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        GasTankReportSection,
        {
          values: {
            regularGallons: formData.regularGallons,
            superGallons: formData.superGallons,
            dieselGallons: formData.dieselGallons
          },
          onChange: updateFormData,
          "data-id": "jzuwg6nf6",
          "data-path": "src/pages/Sales/SalesReportForm.tsx"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        ExpensesSection,
        {
          expenses,
          onChange: handleExpensesChange,
          "data-id": "92wy5v4kp",
          "data-path": "src/pages/Sales/SalesReportForm.tsx"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        DocumentsUploadSection,
        {
          documents: {
            dayReportFileId: formData.dayReportFileId,
            veederRootFileId: formData.veederRootFileId,
            lottoReportFileId: formData.lottoReportFileId,
            scratchOffReportFileId: formData.scratchOffReportFileId
          },
          onChange: handleDocumentUpload,
          "data-id": "touqzwt68",
          "data-path": "src/pages/Sales/SalesReportForm.tsx"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "lzjrn4c1g", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "nrxxc2jqk", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-lg", "data-id": "6duge341e", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: "Additional Notes" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { "data-id": "21hj4k0li", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "6c1u5rtss", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "notes", "data-id": "ndiaylsan", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: "Notes" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              id: "notes",
              value: formData.notes,
              onChange: (e) => updateFormData("notes", e.target.value),
              placeholder: "Enter any additional notes about the day's operations...",
              rows: 4,
              "data-id": "zhr37xift",
              "data-path": "src/pages/Sales/SalesReportForm.tsx"
            }
          )
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200", "data-id": "c2heb41n4", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "i74zo007n", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-blue-800", "data-id": "72b0pfnyh", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: "Report Summary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { "data-id": "ssy71e617", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", "data-id": "jkused2y4", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", "data-id": "hnvz53fyb", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-2xl font-bold text-blue-800", "data-id": "0yddfgqps", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: [
              "$",
              totalSales.toFixed(2)
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-gray-600", "data-id": "g5ijmhke7", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: "Total Sales" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", "data-id": "5a1xo5a2p", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-green-800", "data-id": "w0dbzs1bn", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: totalGallons.toFixed(2) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-gray-600", "data-id": "z6k7tdfuk", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: "Total Gallons" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", "data-id": "b7hag1ylu", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-2xl font-bold text-purple-800", "data-id": "1255hs8zm", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: [
              "$",
              totalLotteryCash.toFixed(2)
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-gray-600", "data-id": "649589f1a", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: "Lottery Sales" })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end space-x-4 pt-6", "data-id": "xlhvwoxkm", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            onClick: () => navigate("/dashboard"),
            "data-id": "eef649rx4",
            "data-path": "src/pages/Sales/SalesReportForm.tsx",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", className: "bg-blue-600 hover:bg-blue-700", "data-id": "ijhupfqu1", "data-path": "src/pages/Sales/SalesReportForm.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-4 h-4 mr-2", "data-id": "7olp2zhiu", "data-path": "src/pages/Sales/SalesReportForm.tsx" }),
          isEditing ? "Update" : "Create",
          " Report"
        ] })
      ] })
    ] })
  ] }) });
}
export {
  SalesReportForm as default
};
//# sourceMappingURL=SalesReportForm-UQsl5V5O.js.map
