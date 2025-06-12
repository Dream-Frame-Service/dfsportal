import { r as reactExports, u as useNavigate, j as jsxRuntimeExports } from "./react-vendor-DX0Gaxph.js";
import { s as supabase, K as toast, C as Card, d as CardHeader, e as CardTitle, f as CardDescription, B as Button, g as CardContent, I as Input, z as Table, E as TableHeader, F as TableRow, G as TableHead, H as TableBody, J as TableCell, l as Badge } from "./admin-core-CknIDYcP.js";
import { u as useListKeyboardShortcuts, V as ViewModal } from "./business-pages-BYlNtgd-.js";
import { ax as Building2, aC as Plus, a1 as Search, aT as MapPin, aO as Mail, aS as Phone, aB as Eye, an as SquarePen, ao as Trash2 } from "./ui-components-svEX1DXz.js";
import { m as motion } from "./animations-DEJKylty.js";
import "./vendor-ChWeSoXy.js";
import "./aws-sdk-DF6-bWA6.js";
import "./supabase-DWlqU2OS.js";
import "./admin-security-BkHZEmpQ.js";
const VendorList = () => {
  const [vendors, setVendors] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [searchTerm, setSearchTerm] = reactExports.useState("");
  const [currentPage, setCurrentPage] = reactExports.useState(1);
  const [totalCount, setTotalCount] = reactExports.useState(0);
  const [selectedVendorId, setSelectedVendorId] = reactExports.useState(null);
  const [viewModalOpen, setViewModalOpen] = reactExports.useState(false);
  const [selectedVendor, setSelectedVendor] = reactExports.useState(null);
  const navigate = useNavigate();
  const pageSize = 10;
  reactExports.useEffect(() => {
    loadVendors();
  }, [currentPage, searchTerm]);
  const loadVendors = async () => {
    try {
      setLoading(true);
      let query = supabase.from("vendors").select("*", { count: "exact" }).order("vendor_name", { ascending: true });
      if (searchTerm) {
        query = query.ilike("vendor_name", `%${searchTerm}%`);
      }
      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);
      const { data, count, error } = await query;
      if (error) throw error;
      setVendors(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error("Error loading vendors:", error);
      toast({
        title: "Error",
        description: "Failed to load vendors",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const handleView = (vendor) => {
    setSelectedVendor(vendor);
    setSelectedVendorId(vendor.ID);
    setViewModalOpen(true);
  };
  const handleEdit = (vendorId) => {
    navigate(`/vendors/edit/${vendorId}`);
  };
  const handleDelete = async (vendorId) => {
    if (!confirm("Are you sure you want to delete this vendor?")) {
      return;
    }
    try {
      const { error } = await supabase.from("vendors").delete().eq("id", vendorId);
      if (error) throw error;
      toast({
        title: "Success",
        description: "Vendor deleted successfully"
      });
      loadVendors();
      setViewModalOpen(false);
    } catch (error) {
      console.error("Error deleting vendor:", error);
      toast({
        title: "Error",
        description: "Failed to delete vendor",
        variant: "destructive"
      });
    }
  };
  const handleExport = () => {
    if (!selectedVendor) return;
    const csvContent = [
      "Field,Value",
      `Vendor Name,${selectedVendor.vendor_name}`,
      `Contact Person,${selectedVendor.contact_person}`,
      `Email,${selectedVendor.email}`,
      `Phone,${selectedVendor.phone}`,
      `Address,${selectedVendor.address}`,
      `Category,${selectedVendor.category}`,
      `Payment Terms,${selectedVendor.payment_terms}`,
      `Status,${selectedVendor.is_active ? "Active" : "Inactive"}`
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vendor_${selectedVendor.vendor_name.replace(/\s+/g, "_")}_details.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast({
      title: "Success",
      description: "Vendor details exported successfully"
    });
  };
  useListKeyboardShortcuts(
    selectedVendorId,
    (id) => {
      const vendor = vendors.find((v) => v.ID === id);
      if (vendor) handleView(vendor);
    },
    handleEdit,
    handleDelete,
    () => navigate("/vendors/new")
  );
  const getCategoryBadgeColor = (category) => {
    const colors = {
      "Fuel Supplier": "bg-blue-500",
      "Food & Beverages": "bg-green-500",
      "Automotive": "bg-orange-500",
      "Maintenance": "bg-purple-500",
      "Office Supplies": "bg-gray-500",
      "Technology": "bg-indigo-500"
    };
    return colors[category] || "bg-gray-500";
  };
  const totalPages = Math.ceil(totalCount / pageSize);
  const getViewModalFields = (vendor) => [
    {
      key: "vendor_name",
      label: "Vendor Name",
      value: vendor.vendor_name,
      type: "text",
      icon: Building2
    },
    {
      key: "contact_person",
      label: "Contact Person",
      value: vendor.contact_person,
      type: "text"
    },
    {
      key: "email",
      label: "Email",
      value: vendor.email,
      type: "email"
    },
    {
      key: "phone",
      label: "Phone",
      value: vendor.phone,
      type: "phone"
    },
    {
      key: "address",
      label: "Address",
      value: vendor.address,
      type: "text",
      icon: MapPin
    },
    {
      key: "category",
      label: "Category",
      value: vendor.category,
      type: "badge",
      badgeColor: getCategoryBadgeColor(vendor.category)
    },
    {
      key: "payment_terms",
      label: "Payment Terms",
      value: vendor.payment_terms,
      type: "text"
    },
    {
      key: "is_active",
      label: "Status",
      value: vendor.is_active,
      type: "boolean"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-id": "0ex25eayp", "data-path": "src/pages/Vendors/VendorList.tsx", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "eijtox9z9", "data-path": "src/pages/Vendors/VendorList.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "vp4bieem5", "data-path": "src/pages/Vendors/VendorList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "odpe77wur", "data-path": "src/pages/Vendors/VendorList.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "xajk9qe2o", "data-path": "src/pages/Vendors/VendorList.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center space-x-2", "data-id": "gzkglal9u", "data-path": "src/pages/Vendors/VendorList.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "w-6 h-6", "data-id": "yboy4f7hw", "data-path": "src/pages/Vendors/VendorList.tsx" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "wmaf6c4lp", "data-path": "src/pages/Vendors/VendorList.tsx", children: "Vendors" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { "data-id": "hzw14fsx4", "data-path": "src/pages/Vendors/VendorList.tsx", children: "Manage your vendor contacts and information" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => navigate("/vendors/new"), className: "flex items-center space-x-2", "data-id": "0caea7ew4", "data-path": "src/pages/Vendors/VendorList.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4", "data-id": "owmll3jle", "data-path": "src/pages/Vendors/VendorList.tsx" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "kcpuv2ipl", "data-path": "src/pages/Vendors/VendorList.tsx", children: "Add Vendor" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { "data-id": "fb9v2mupm", "data-path": "src/pages/Vendors/VendorList.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center space-x-2 mb-6", "data-id": "wrkemffjr", "data-path": "src/pages/Vendors/VendorList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 max-w-sm", "data-id": "j3tjepgr1", "data-path": "src/pages/Vendors/VendorList.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4", "data-id": "zgclsibjd", "data-path": "src/pages/Vendors/VendorList.tsx" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              placeholder: "Search vendors...",
              value: searchTerm,
              onChange: (e) => setSearchTerm(e.target.value),
              className: "pl-10",
              "data-id": "eo0pu4rq7",
              "data-path": "src/pages/Vendors/VendorList.tsx"
            }
          )
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg", "data-id": "qmdgpq588", "data-path": "src/pages/Vendors/VendorList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-blue-700", "data-id": "f0tzwfyhz", "data-path": "src/pages/Vendors/VendorList.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { "data-id": "2q6mv101g", "data-path": "src/pages/Vendors/VendorList.tsx", children: "Keyboard shortcuts:" }),
          " Select a row, then press ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { className: "px-1 py-0.5 bg-blue-100 rounded text-xs", "data-id": "bqeebw590", "data-path": "src/pages/Vendors/VendorList.tsx", children: "V" }),
          " to view,",
          /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { className: "px-1 py-0.5 bg-blue-100 rounded text-xs ml-1", "data-id": "k2krkm0ox", "data-path": "src/pages/Vendors/VendorList.tsx", children: "E" }),
          " to edit,",
          /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { className: "px-1 py-0.5 bg-blue-100 rounded text-xs ml-1", "data-id": "zeo0nagy2", "data-path": "src/pages/Vendors/VendorList.tsx", children: "D" }),
          " to delete, or",
          /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { className: "px-1 py-0.5 bg-blue-100 rounded text-xs ml-1", "data-id": "2izk2sxd7", "data-path": "src/pages/Vendors/VendorList.tsx", children: "Ctrl+N" }),
          " to create new"
        ] }) }),
        loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", "data-id": "v2oygv6u1", "data-path": "src/pages/Vendors/VendorList.tsx", children: [...Array(5)].map(
          (_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 bg-gray-100 rounded animate-pulse", "data-id": "1e8x7ahv3", "data-path": "src/pages/Vendors/VendorList.tsx" }, i)
        ) }) : vendors.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-8", "data-id": "44a9pjagf", "data-path": "src/pages/Vendors/VendorList.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "w-12 h-12 text-gray-400 mx-auto mb-4", "data-id": "psqo3evau", "data-path": "src/pages/Vendors/VendorList.tsx" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500", "data-id": "jfw2h4fgn", "data-path": "src/pages/Vendors/VendorList.tsx", children: "No vendors found" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              className: "mt-4",
              onClick: () => navigate("/vendors/new"),
              "data-id": "fil8rspu6",
              "data-path": "src/pages/Vendors/VendorList.tsx",
              children: "Add Your First Vendor"
            }
          )
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border rounded-lg overflow-hidden", "data-id": "p23uparyd", "data-path": "src/pages/Vendors/VendorList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { "data-id": "ah6an831e", "data-path": "src/pages/Vendors/VendorList.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { "data-id": "s7wk0hvp9", "data-path": "src/pages/Vendors/VendorList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { "data-id": "o5g14ihqk", "data-path": "src/pages/Vendors/VendorList.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "3mmatqpz9", "data-path": "src/pages/Vendors/VendorList.tsx", children: "Vendor Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "kxowitj6g", "data-path": "src/pages/Vendors/VendorList.tsx", children: "Contact Person" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "hw37vfakn", "data-path": "src/pages/Vendors/VendorList.tsx", children: "Contact Info" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "bb9luyr9l", "data-path": "src/pages/Vendors/VendorList.tsx", children: "Category" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "o9bzvn4ka", "data-path": "src/pages/Vendors/VendorList.tsx", children: "Payment Terms" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "0atrmi18g", "data-path": "src/pages/Vendors/VendorList.tsx", children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "37cir1lcc", "data-path": "src/pages/Vendors/VendorList.tsx", children: "Actions" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { "data-id": "4ctwuo99y", "data-path": "src/pages/Vendors/VendorList.tsx", children: vendors.map(
            (vendor, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.tr,
              {
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                transition: { delay: index * 0.05 },
                className: `border-b hover:bg-gray-50 transition-colors cursor-pointer ${selectedVendorId === vendor.ID ? "bg-blue-50 border-blue-200" : ""}`,
                onClick: () => setSelectedVendorId(vendor.ID),
                "data-id": "503mhq4ap",
                "data-path": "src/pages/Vendors/VendorList.tsx",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "a4zwf2h2k", "data-path": "src/pages/Vendors/VendorList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "d0m5fj0r3", "data-path": "src/pages/Vendors/VendorList.tsx", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", "data-id": "bs03tzdo3", "data-path": "src/pages/Vendors/VendorList.tsx", children: vendor.vendor_name }),
                    vendor.address && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-1 text-sm text-gray-500 mt-1", "data-id": "jt0scht7n", "data-path": "src/pages/Vendors/VendorList.tsx", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-3 h-3", "data-id": "9bvuw8gsy", "data-path": "src/pages/Vendors/VendorList.tsx" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate max-w-xs", "data-id": "i5leu8ygx", "data-path": "src/pages/Vendors/VendorList.tsx", children: vendor.address })
                    ] })
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "l7as0451d", "data-path": "src/pages/Vendors/VendorList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", "data-id": "io1x2obhk", "data-path": "src/pages/Vendors/VendorList.tsx", children: vendor.contact_person }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "qraz83dde", "data-path": "src/pages/Vendors/VendorList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", "data-id": "gd1q3860x", "data-path": "src/pages/Vendors/VendorList.tsx", children: [
                    vendor.email && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-1 text-sm", "data-id": "43cxkf22f", "data-path": "src/pages/Vendors/VendorList.tsx", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "w-3 h-3", "data-id": "1o8lbv8qt", "data-path": "src/pages/Vendors/VendorList.tsx" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "nxf43xqh4", "data-path": "src/pages/Vendors/VendorList.tsx", children: vendor.email })
                    ] }),
                    vendor.phone && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-1 text-sm", "data-id": "7z61oj6b6", "data-path": "src/pages/Vendors/VendorList.tsx", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "w-3 h-3", "data-id": "js086lqyz", "data-path": "src/pages/Vendors/VendorList.tsx" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "bkmlz67l8", "data-path": "src/pages/Vendors/VendorList.tsx", children: vendor.phone })
                    ] })
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "dt9stoima", "data-path": "src/pages/Vendors/VendorList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: `text-white ${getCategoryBadgeColor(vendor.category)}`, "data-id": "4dvvtmjqu", "data-path": "src/pages/Vendors/VendorList.tsx", children: vendor.category }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "cq02pe9z6", "data-path": "src/pages/Vendors/VendorList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", "data-id": "drf4ebyqi", "data-path": "src/pages/Vendors/VendorList.tsx", children: vendor.payment_terms || "N/A" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "adeehyj96", "data-path": "src/pages/Vendors/VendorList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: vendor.is_active ? "default" : "secondary", "data-id": "evq24tx10", "data-path": "src/pages/Vendors/VendorList.tsx", children: vendor.is_active ? "Active" : "Inactive" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "v0imuccs9", "data-path": "src/pages/Vendors/VendorList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", "data-id": "j5bhn8g16", "data-path": "src/pages/Vendors/VendorList.tsx", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        variant: "outline",
                        size: "sm",
                        onClick: (e) => {
                          e.stopPropagation();
                          handleView(vendor);
                        },
                        className: "text-blue-600 hover:text-blue-700",
                        "data-id": "fsanx8xv3",
                        "data-path": "src/pages/Vendors/VendorList.tsx",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-4 h-4", "data-id": "b42pqtef7", "data-path": "src/pages/Vendors/VendorList.tsx" })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        variant: "outline",
                        size: "sm",
                        onClick: (e) => {
                          e.stopPropagation();
                          handleEdit(vendor.ID);
                        },
                        "data-id": "euuthcxhd",
                        "data-path": "src/pages/Vendors/VendorList.tsx",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { className: "w-4 h-4", "data-id": "5lzwnzmbs", "data-path": "src/pages/Vendors/VendorList.tsx" })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        variant: "outline",
                        size: "sm",
                        onClick: (e) => {
                          e.stopPropagation();
                          handleDelete(vendor.ID);
                        },
                        className: "text-red-600 hover:text-red-700",
                        "data-id": "dlbhos6x7",
                        "data-path": "src/pages/Vendors/VendorList.tsx",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4", "data-id": "duous25e1", "data-path": "src/pages/Vendors/VendorList.tsx" })
                      }
                    )
                  ] }) })
                ]
              },
              vendor.ID
            )
          ) })
        ] }) }),
        totalPages > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-6", "data-id": "nn20y26ky", "data-path": "src/pages/Vendors/VendorList.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-gray-700", "data-id": "fw58gu8fx", "data-path": "src/pages/Vendors/VendorList.tsx", children: [
            "Showing ",
            (currentPage - 1) * pageSize + 1,
            " to ",
            Math.min(currentPage * pageSize, totalCount),
            " of ",
            totalCount,
            " vendors"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", "data-id": "bk5rtlhp6", "data-path": "src/pages/Vendors/VendorList.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: () => setCurrentPage((prev) => Math.max(prev - 1, 1)),
                disabled: currentPage === 1,
                "data-id": "jlxalnzlh",
                "data-path": "src/pages/Vendors/VendorList.tsx",
                children: "Previous"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm", "data-id": "tlx1w410e", "data-path": "src/pages/Vendors/VendorList.tsx", children: [
              "Page ",
              currentPage,
              " of ",
              totalPages
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: () => setCurrentPage((prev) => Math.min(prev + 1, totalPages)),
                disabled: currentPage === totalPages,
                "data-id": "zmojnsrks",
                "data-path": "src/pages/Vendors/VendorList.tsx",
                children: "Next"
              }
            )
          ] })
        ] })
      ] })
    ] }),
    selectedVendor && /* @__PURE__ */ jsxRuntimeExports.jsx(
      ViewModal,
      {
        isOpen: viewModalOpen,
        onClose: () => {
          setViewModalOpen(false);
          setSelectedVendor(null);
          setSelectedVendorId(null);
        },
        title: selectedVendor.vendor_name,
        subtitle: `Contact: ${selectedVendor.contact_person} • ${selectedVendor.category}`,
        data: selectedVendor,
        fields: getViewModalFields(selectedVendor),
        onEdit: () => {
          setViewModalOpen(false);
          handleEdit(selectedVendor.ID);
        },
        onDelete: () => handleDelete(selectedVendor.ID),
        onExport: handleExport,
        canEdit: true,
        canDelete: true,
        canExport: true,
        "data-id": "4dv16ttvz",
        "data-path": "src/pages/Vendors/VendorList.tsx"
      }
    )
  ] });
};
export {
  VendorList as default
};
