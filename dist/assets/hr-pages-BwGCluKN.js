import { r as reactExports, u as useNavigate, j as jsxRuntimeExports, a as useParams, L as Link } from "./react-vendor-DX0Gaxph.js";
import { s as supabase, K as toast, C as Card, d as CardHeader, e as CardTitle, f as CardDescription, B as Button, g as CardContent, S as Select, h as SelectTrigger, i as SelectValue, j as SelectContent, k as SelectItem, I as Input, z as Table, E as TableHeader, F as TableRow, G as TableHead, H as TableBody, J as TableCell, l as Badge, L as Label, O as Textarea, n as Switch, u as useToast, D as Dialog, t as DialogContent, v as DialogHeader, w as DialogTitle, x as DialogDescription } from "./admin-core-CknIDYcP.js";
import { u as useListKeyboardShortcuts, V as ViewModal, N as NumberInput, E as EnhancedFileUpload } from "./business-pages-BYlNtgd-.js";
import { U as Users, aC as Plus, a1 as Search, aO as Mail, aS as Phone, aB as Eye, an as SquarePen, ao as Trash2, a7 as User, J as ArrowLeft, aG as Save, Y as RefreshCw, az as DollarSign, aL as Calendar, a4 as FileText, ac as CircleAlert, aa as Download } from "./ui-components-svEX1DXz.js";
import { m as motion } from "./animations-DEJKylty.js";
import { f as format } from "./utilities-BPr3_uG_.js";
const EmployeeList = () => {
  const [employees, setEmployees] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [searchTerm, setSearchTerm] = reactExports.useState("");
  const [selectedStation, setSelectedStation] = reactExports.useState("ALL");
  const [currentPage, setCurrentPage] = reactExports.useState(1);
  const [totalCount, setTotalCount] = reactExports.useState(0);
  const [selectedEmployeeId, setSelectedEmployeeId] = reactExports.useState(null);
  const [viewModalOpen, setViewModalOpen] = reactExports.useState(false);
  const [selectedEmployee, setSelectedEmployee] = reactExports.useState(null);
  const navigate = useNavigate();
  const pageSize = 10;
  reactExports.useEffect(() => {
    loadEmployees();
  }, [currentPage, searchTerm, selectedStation]);
  const loadEmployees = async () => {
    try {
      setLoading(true);
      let query = supabase.from("employees").select("*", { count: "exact" }).order("ID", { ascending: false });
      if (searchTerm) {
        query = query.or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,employee_id.ilike.%${searchTerm}%`);
      }
      if (selectedStation && selectedStation !== "ALL") {
        query = query.eq("station", selectedStation);
      }
      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);
      const { data, count, error } = await query;
      if (error) throw error;
      setEmployees(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error("Error loading employees:", error);
      toast({
        title: "Error",
        description: "Failed to load employees",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const handleView = (employee) => {
    setSelectedEmployee(employee);
    setSelectedEmployeeId(employee.ID);
    setViewModalOpen(true);
  };
  const handleEdit = (employeeId) => {
    navigate(`/employees/edit/${employeeId}`);
  };
  const handleDelete = async (employeeId) => {
    if (!confirm("Are you sure you want to delete this employee?")) {
      return;
    }
    try {
      const { error } = await supabase.from("employees").delete().eq("id", employeeId);
      if (error) throw error;
      toast({
        title: "Success",
        description: "Employee deleted successfully"
      });
      loadEmployees();
      setViewModalOpen(false);
    } catch (error) {
      console.error("Error deleting employee:", error);
      toast({
        title: "Error",
        description: "Failed to delete employee",
        variant: "destructive"
      });
    }
  };
  const handleExport = () => {
    if (!selectedEmployee) return;
    const csvContent = [
      "Field,Value",
      `Employee ID,${selectedEmployee.employee_id}`,
      `Name,${selectedEmployee.first_name} ${selectedEmployee.last_name}`,
      `Email,${selectedEmployee.email}`,
      `Phone,${selectedEmployee.phone}`,
      `Position,${selectedEmployee.position}`,
      `Station,${selectedEmployee.station}`,
      `Hire Date,${selectedEmployee.hire_date}`,
      `Salary,${selectedEmployee.salary}`,
      `Status,${selectedEmployee.is_active ? "Active" : "Inactive"}`
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `employee_${selectedEmployee.employee_id}_details.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast({
      title: "Success",
      description: "Employee details exported successfully"
    });
  };
  useListKeyboardShortcuts(
    selectedEmployeeId,
    (id) => {
      const employee = employees.find((emp) => emp.ID === id);
      if (employee) handleView(employee);
    },
    handleEdit,
    handleDelete,
    () => navigate("/employees/new")
  );
  const getStationBadgeColor = (station) => {
    switch (station.toUpperCase()) {
      case "MOBIL":
        return "bg-blue-500";
      case "AMOCO ROSEDALE":
        return "bg-green-500";
      case "AMOCO BROOKLYN":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };
  const totalPages = Math.ceil(totalCount / pageSize);
  const getViewModalFields = (employee) => [
    {
      key: "employee_id",
      label: "Employee ID",
      value: employee.employee_id,
      type: "text",
      icon: User
    },
    {
      key: "name",
      label: "Full Name",
      value: `${employee.first_name} ${employee.last_name}`,
      type: "text",
      icon: User
    },
    {
      key: "email",
      label: "Email",
      value: employee.email,
      type: "email"
    },
    {
      key: "phone",
      label: "Phone",
      value: employee.phone,
      type: "phone"
    },
    {
      key: "position",
      label: "Position",
      value: employee.position,
      type: "text"
    },
    {
      key: "station",
      label: "Station",
      value: employee.station,
      type: "badge",
      badgeColor: getStationBadgeColor(employee.station)
    },
    {
      key: "hire_date",
      label: "Hire Date",
      value: employee.hire_date,
      type: "date"
    },
    {
      key: "salary",
      label: "Salary",
      value: employee.salary,
      type: "currency"
    },
    {
      key: "is_active",
      label: "Status",
      value: employee.is_active,
      type: "boolean"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-id": "zmmkn8bnw", "data-path": "src/pages/Employees/EmployeeList.tsx", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "uxdnid6ft", "data-path": "src/pages/Employees/EmployeeList.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "tu2w7bkm3", "data-path": "src/pages/Employees/EmployeeList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "muol9vvbd", "data-path": "src/pages/Employees/EmployeeList.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", "data-id": "b4ei4ih1y", "data-path": "src/pages/Employees/EmployeeList.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center space-x-2", "data-id": "kc411o880", "data-path": "src/pages/Employees/EmployeeList.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-6 h-6", "data-id": "zfdraguaf", "data-path": "src/pages/Employees/EmployeeList.tsx" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "0nmrmqj64", "data-path": "src/pages/Employees/EmployeeList.tsx", children: "Employee List" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { "data-id": "0z075w2c2", "data-path": "src/pages/Employees/EmployeeList.tsx", children: "Manage your employees across all stations" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: () => navigate("/employees/new"),
            className: "flex items-center space-x-2",
            "data-id": "bybi2tm73",
            "data-path": "src/pages/Employees/EmployeeList.tsx",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4", "data-id": "4z56y4t30", "data-path": "src/pages/Employees/EmployeeList.tsx" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "d1zvu9yiq", "data-path": "src/pages/Employees/EmployeeList.tsx", children: "Add Employee" })
            ]
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { "data-id": "be1j7hds5", "data-path": "src/pages/Employees/EmployeeList.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-4 mb-6", "data-id": "l1pja9kvd", "data-path": "src/pages/Employees/EmployeeList.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-64", "data-id": "4tp5vq593", "data-path": "src/pages/Employees/EmployeeList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: selectedStation, onValueChange: setSelectedStation, "data-id": "7m72i2mz0", "data-path": "src/pages/Employees/EmployeeList.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-id": "jpur4sjuj", "data-path": "src/pages/Employees/EmployeeList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select Station", "data-id": "9j5he2aix", "data-path": "src/pages/Employees/EmployeeList.tsx" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { "data-id": "kkbd0hlr9", "data-path": "src/pages/Employees/EmployeeList.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "ALL", "data-id": "85vrrdznp", "data-path": "src/pages/Employees/EmployeeList.tsx", children: "Select Any Station" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "MOBIL", "data-id": "x4eu19zdf", "data-path": "src/pages/Employees/EmployeeList.tsx", children: "MOBIL" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "AMOCO ROSEDALE", "data-id": "2k4a7qk9q", "data-path": "src/pages/Employees/EmployeeList.tsx", children: "AMOCO ROSEDALE" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "AMOCO BROOKLYN", "data-id": "q39y6o9hr", "data-path": "src/pages/Employees/EmployeeList.tsx", children: "AMOCO BROOKLYN" })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 max-w-sm", "data-id": "i5jvqz05m", "data-path": "src/pages/Employees/EmployeeList.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4", "data-id": "ebsi0qdr1", "data-path": "src/pages/Employees/EmployeeList.tsx" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                placeholder: "Search employees...",
                value: searchTerm,
                onChange: (e) => setSearchTerm(e.target.value),
                className: "pl-10",
                "data-id": "jvpmuxhpi",
                "data-path": "src/pages/Employees/EmployeeList.tsx"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg", "data-id": "0yl8qwrxb", "data-path": "src/pages/Employees/EmployeeList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-blue-700", "data-id": "wqswrmsd7", "data-path": "src/pages/Employees/EmployeeList.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { "data-id": "ca8ls0gyv", "data-path": "src/pages/Employees/EmployeeList.tsx", children: "Keyboard shortcuts:" }),
          " Select a row, then press ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { className: "px-1 py-0.5 bg-blue-100 rounded text-xs", "data-id": "mtypif3ek", "data-path": "src/pages/Employees/EmployeeList.tsx", children: "V" }),
          " to view,",
          /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { className: "px-1 py-0.5 bg-blue-100 rounded text-xs ml-1", "data-id": "u7gu7kqum", "data-path": "src/pages/Employees/EmployeeList.tsx", children: "E" }),
          " to edit,",
          /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { className: "px-1 py-0.5 bg-blue-100 rounded text-xs ml-1", "data-id": "vl1iyntwg", "data-path": "src/pages/Employees/EmployeeList.tsx", children: "D" }),
          " to delete, or",
          /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { className: "px-1 py-0.5 bg-blue-100 rounded text-xs ml-1", "data-id": "cu3p5jgo9", "data-path": "src/pages/Employees/EmployeeList.tsx", children: "Ctrl+N" }),
          " to create new"
        ] }) }),
        loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", "data-id": "1bh0bxn2i", "data-path": "src/pages/Employees/EmployeeList.tsx", children: [...Array(5)].map(
          (_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 bg-gray-100 rounded animate-pulse", "data-id": "e8hdycdfx", "data-path": "src/pages/Employees/EmployeeList.tsx" }, i)
        ) }) : employees.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-8", "data-id": "unsu76yyp", "data-path": "src/pages/Employees/EmployeeList.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-12 h-12 text-gray-400 mx-auto mb-4", "data-id": "fgccdxg32", "data-path": "src/pages/Employees/EmployeeList.tsx" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500", "data-id": "ef5gtm3m0", "data-path": "src/pages/Employees/EmployeeList.tsx", children: "No employees found" })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border rounded-lg overflow-hidden", "data-id": "xdm7tfsfq", "data-path": "src/pages/Employees/EmployeeList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { "data-id": "xv7v28pfo", "data-path": "src/pages/Employees/EmployeeList.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { "data-id": "b04pp8sp1", "data-path": "src/pages/Employees/EmployeeList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { "data-id": "xfbuelacs", "data-path": "src/pages/Employees/EmployeeList.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "qddxyqv1w", "data-path": "src/pages/Employees/EmployeeList.tsx", children: "Employee ID" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "c2im5d5jv", "data-path": "src/pages/Employees/EmployeeList.tsx", children: "Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "6f10948kv", "data-path": "src/pages/Employees/EmployeeList.tsx", children: "Contact" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "nea2rabf4", "data-path": "src/pages/Employees/EmployeeList.tsx", children: "Position" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "f5x7kcvgc", "data-path": "src/pages/Employees/EmployeeList.tsx", children: "Station" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "b813hg7w3", "data-path": "src/pages/Employees/EmployeeList.tsx", children: "Hire Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "ghtn2lbek", "data-path": "src/pages/Employees/EmployeeList.tsx", children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "inkk7barm", "data-path": "src/pages/Employees/EmployeeList.tsx", children: "Actions" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { "data-id": "uv45zdj6q", "data-path": "src/pages/Employees/EmployeeList.tsx", children: employees.map(
            (employee, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.tr,
              {
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                transition: { delay: index * 0.05 },
                className: `border-b hover:bg-gray-50 transition-colors cursor-pointer ${selectedEmployeeId === employee.ID ? "bg-blue-50 border-blue-200" : ""}`,
                onClick: () => setSelectedEmployeeId(employee.ID),
                "data-id": "s9x68qcp6",
                "data-path": "src/pages/Employees/EmployeeList.tsx",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", "data-id": "t6cjhvsn2", "data-path": "src/pages/Employees/EmployeeList.tsx", children: employee.employee_id }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "eujv99as4", "data-path": "src/pages/Employees/EmployeeList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "bx49fz3gr", "data-path": "src/pages/Employees/EmployeeList.tsx", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-medium", "data-id": "wr0jkekan", "data-path": "src/pages/Employees/EmployeeList.tsx", children: [
                      employee.first_name,
                      " ",
                      employee.last_name
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500", "data-id": "obzmh00xr", "data-path": "src/pages/Employees/EmployeeList.tsx", children: employee.position })
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "4fzyy21vx", "data-path": "src/pages/Employees/EmployeeList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", "data-id": "o01xfi1dn", "data-path": "src/pages/Employees/EmployeeList.tsx", children: [
                    employee.email && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-1 text-sm", "data-id": "2edakrf7b", "data-path": "src/pages/Employees/EmployeeList.tsx", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "w-3 h-3", "data-id": "6x2s6wcs9", "data-path": "src/pages/Employees/EmployeeList.tsx" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "lwnny6tnb", "data-path": "src/pages/Employees/EmployeeList.tsx", children: employee.email })
                    ] }),
                    employee.phone && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-1 text-sm", "data-id": "qof4owl4b", "data-path": "src/pages/Employees/EmployeeList.tsx", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "w-3 h-3", "data-id": "84dst5jpo", "data-path": "src/pages/Employees/EmployeeList.tsx" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "s46tecofs", "data-path": "src/pages/Employees/EmployeeList.tsx", children: employee.phone })
                    ] })
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "u2pbnhvdh", "data-path": "src/pages/Employees/EmployeeList.tsx", children: employee.position }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "o9h7jbfko", "data-path": "src/pages/Employees/EmployeeList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: `text-white ${getStationBadgeColor(employee.station)}`, "data-id": "ggvzngnc6", "data-path": "src/pages/Employees/EmployeeList.tsx", children: employee.station }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "wkjt75be5", "data-path": "src/pages/Employees/EmployeeList.tsx", children: formatDate(employee.hire_date) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "1e91rwri3", "data-path": "src/pages/Employees/EmployeeList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: employee.is_active ? "default" : "secondary", "data-id": "i9qlbly9g", "data-path": "src/pages/Employees/EmployeeList.tsx", children: employee.is_active ? "Active" : "Inactive" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "dw3le627q", "data-path": "src/pages/Employees/EmployeeList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", "data-id": "1ln5fu8na", "data-path": "src/pages/Employees/EmployeeList.tsx", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        variant: "outline",
                        size: "sm",
                        onClick: (e) => {
                          e.stopPropagation();
                          handleView(employee);
                        },
                        className: "text-blue-600 hover:text-blue-700",
                        "data-id": "r83qrzb9m",
                        "data-path": "src/pages/Employees/EmployeeList.tsx",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-4 h-4", "data-id": "7hsn61dl7", "data-path": "src/pages/Employees/EmployeeList.tsx" })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        variant: "outline",
                        size: "sm",
                        onClick: (e) => {
                          e.stopPropagation();
                          handleEdit(employee.ID);
                        },
                        "data-id": "s96ihm5uy",
                        "data-path": "src/pages/Employees/EmployeeList.tsx",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { className: "w-4 h-4", "data-id": "k1d5xiv5n", "data-path": "src/pages/Employees/EmployeeList.tsx" })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        variant: "outline",
                        size: "sm",
                        onClick: (e) => {
                          e.stopPropagation();
                          handleDelete(employee.ID);
                        },
                        className: "text-red-600 hover:text-red-700",
                        "data-id": "l96cn6jgn",
                        "data-path": "src/pages/Employees/EmployeeList.tsx",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4", "data-id": "ed5t8yyg4", "data-path": "src/pages/Employees/EmployeeList.tsx" })
                      }
                    )
                  ] }) })
                ]
              },
              employee.ID
            )
          ) })
        ] }) }),
        totalPages > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-6", "data-id": "9irxs9jae", "data-path": "src/pages/Employees/EmployeeList.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-gray-700", "data-id": "hso0coido", "data-path": "src/pages/Employees/EmployeeList.tsx", children: [
            "Showing ",
            (currentPage - 1) * pageSize + 1,
            " to ",
            Math.min(currentPage * pageSize, totalCount),
            " of ",
            totalCount,
            " employees"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", "data-id": "sziex4qrk", "data-path": "src/pages/Employees/EmployeeList.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: () => setCurrentPage((prev) => Math.max(prev - 1, 1)),
                disabled: currentPage === 1,
                "data-id": "tagh7fm1g",
                "data-path": "src/pages/Employees/EmployeeList.tsx",
                children: "Previous"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm", "data-id": "56vw801ao", "data-path": "src/pages/Employees/EmployeeList.tsx", children: [
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
                "data-id": "72b1oks56",
                "data-path": "src/pages/Employees/EmployeeList.tsx",
                children: "Next"
              }
            )
          ] })
        ] })
      ] })
    ] }),
    selectedEmployee && /* @__PURE__ */ jsxRuntimeExports.jsx(
      ViewModal,
      {
        isOpen: viewModalOpen,
        onClose: () => {
          setViewModalOpen(false);
          setSelectedEmployee(null);
          setSelectedEmployeeId(null);
        },
        title: `${selectedEmployee.first_name} ${selectedEmployee.last_name}`,
        subtitle: `Employee ID: ${selectedEmployee.employee_id} • ${selectedEmployee.position}`,
        data: selectedEmployee,
        fields: getViewModalFields(selectedEmployee),
        onEdit: () => {
          setViewModalOpen(false);
          handleEdit(selectedEmployee.ID);
        },
        onDelete: () => handleDelete(selectedEmployee.ID),
        onExport: handleExport,
        canEdit: true,
        canDelete: true,
        canExport: true,
        "data-id": "rp94i4iwx",
        "data-path": "src/pages/Employees/EmployeeList.tsx"
      }
    )
  ] });
};
const EmployeeList$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: EmployeeList
}, Symbol.toStringTag, { value: "Module" }));
const EmployeeForm = () => {
  const [formData, setFormData] = reactExports.useState({
    employee_id: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    position: "",
    station: "",
    hire_date: "",
    salary: 0,
    is_active: true,
    date_of_birth: "",
    current_address: "",
    mailing_address: "",
    reference_name: "",
    id_document_type: "",
    id_document_file_id: null
  });
  const [selectedFile, setSelectedFile] = reactExports.useState(null);
  const [isUploading, setIsUploading] = reactExports.useState(false);
  const [loading, setLoading] = reactExports.useState(false);
  const [isEditing, setIsEditing] = reactExports.useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const stations = ["MOBIL", "AMOCO ROSEDALE", "AMOCO BROOKLYN"];
  const positions = ["Manager", "Supervisor", "Cashier", "Attendant", "Mechanic", "Cleaner"];
  const idDocumentTypes = ["Driving License", "Passport", "Green Card", "SSN", "Work Permit"];
  reactExports.useEffect(() => {
    if (id) {
      setIsEditing(true);
      loadEmployee(parseInt(id));
    } else {
      generateEmployeeId();
    }
  }, [id]);
  const generateEmployeeId = async () => {
    try {
      const { data, error } = await supabase.from("employees").select("employee_id").ilike("employee_id", "DFS%").order("employee_id", { ascending: false }).limit(1e3);
      if (error) {
        console.error("Error fetching existing employee IDs:", error);
        throw error;
      }
      let nextNumber = 1001;
      if (data && data.length > 0) {
        const existingNumbers = data.map((emp) => {
          const match = emp.employee_id.match(/^DFS(\d+)$/);
          return match ? parseInt(match[1]) : 0;
        }).filter((num) => num > 0);
        if (existingNumbers.length > 0) {
          nextNumber = Math.max(...existingNumbers) + 1;
        }
      }
      const uniqueId = `DFS${nextNumber}`;
      const { data: checkData, error: checkError } = await supabase.from("employees").select("employee_id").eq("employee_id", uniqueId).limit(1);
      if (checkError) {
        console.error("Error checking employee ID uniqueness:", checkError);
        throw checkError;
      }
      if (checkData && checkData.length > 0) {
        const fallbackId = `DFS${nextNumber + 1}`;
        setFormData((prev) => ({ ...prev, employee_id: fallbackId }));
        console.log("Generated unique employee ID (fallback):", fallbackId);
      } else {
        setFormData((prev) => ({ ...prev, employee_id: uniqueId }));
        console.log("Generated unique employee ID:", uniqueId);
      }
    } catch (error) {
      console.error("Error generating employee ID:", error);
      toast({
        title: "Warning",
        description: "Could not auto-generate employee ID. Please enter manually.",
        variant: "default"
      });
    }
  };
  const loadEmployee = async (employeeId) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("employees").select("*").eq("ID", employeeId).limit(1).single();
      if (error) throw error;
      if (data) {
        const employee = data;
        setFormData({
          employee_id: employee.employee_id || "",
          first_name: employee.first_name || "",
          last_name: employee.last_name || "",
          email: employee.email || "",
          phone: employee.phone || "",
          position: employee.position || "",
          station: employee.station || "",
          hire_date: employee.hire_date ? employee.hire_date.split("T")[0] : "",
          salary: employee.salary || 0,
          is_active: employee.is_active !== false,
          date_of_birth: employee.date_of_birth ? employee.date_of_birth.split("T")[0] : "",
          current_address: employee.current_address || "",
          mailing_address: employee.mailing_address || "",
          reference_name: employee.reference_name || "",
          id_document_type: employee.id_document_type || "",
          id_document_file_id: employee.id_document_file_id || null
        });
      }
    } catch (error) {
      console.error("Error loading employee:", error);
      toast({
        title: "Error",
        description: "Failed to load employee details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const handleFileUpload = async () => {
    if (!selectedFile) return null;
    setIsUploading(true);
    try {
      const fileExt = selectedFile.name.split(".").pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage.from("documents").upload(fileName, selectedFile);
      if (uploadError) throw uploadError;
      const { data: fileRecord, error: fileError } = await supabase.from("files").insert({
        filename: selectedFile.name,
        storage_path: uploadData.path,
        file_size: selectedFile.size,
        mime_type: selectedFile.type,
        uploaded_at: (/* @__PURE__ */ new Date()).toISOString()
      }).select("id").single();
      if (fileError) throw fileError;
      return fileRecord.id;
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Error",
        description: "Failed to upload file. Please try again.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      let fileId = formData.id_document_file_id;
      if (selectedFile) {
        fileId = await handleFileUpload();
        if (fileId === null) {
          setLoading(false);
          return;
        }
      }
      const dataToSubmit = {
        ...formData,
        hire_date: formData.hire_date ? new Date(formData.hire_date).toISOString() : "",
        date_of_birth: formData.date_of_birth ? new Date(formData.date_of_birth).toISOString() : "",
        id_document_file_id: fileId,
        created_by: 1
      };
      if (isEditing && id) {
        const { error } = await supabase.from("employees").update(dataToSubmit).eq("ID", parseInt(id));
        if (error) throw error;
        toast({
          title: "Success",
          description: "Employee updated successfully"
        });
      } else {
        const { error } = await supabase.from("employees").insert(dataToSubmit);
        if (error) throw error;
        toast({
          title: "Success",
          description: "Employee created successfully"
        });
      }
      navigate("/employees");
    } catch (error) {
      console.error("Error saving employee:", error);
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "create"} employee`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", "data-id": "r8kna9wld", "data-path": "src/pages/Employees/EmployeeForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "zz646kdsk", "data-path": "src/pages/Employees/EmployeeForm.tsx", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "ahnf43nwc", "data-path": "src/pages/Employees/EmployeeForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "w23g8q7er", "data-path": "src/pages/Employees/EmployeeForm.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "b6pn8ij6a", "data-path": "src/pages/Employees/EmployeeForm.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center space-x-2", "data-id": "8vhgprhn4", "data-path": "src/pages/Employees/EmployeeForm.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-6 h-6", "data-id": "elt3t2e5m", "data-path": "src/pages/Employees/EmployeeForm.tsx" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "ai0xl2y8b", "data-path": "src/pages/Employees/EmployeeForm.tsx", children: isEditing ? "Edit Employee" : "Add New Employee" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { "data-id": "a38tuknlu", "data-path": "src/pages/Employees/EmployeeForm.tsx", children: isEditing ? "Update employee information" : "Add a new employee to your team" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: () => navigate("/employees"), "data-id": "rre573m7n", "data-path": "src/pages/Employees/EmployeeForm.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4 mr-2", "data-id": "f6ephe5ks", "data-path": "src/pages/Employees/EmployeeForm.tsx" }),
        "Back to Employees"
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { "data-id": "ynrudii9q", "data-path": "src/pages/Employees/EmployeeForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-8", "data-id": "c5e7pmh5v", "data-path": "src/pages/Employees/EmployeeForm.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "bbbgdjsut", "data-path": "src/pages/Employees/EmployeeForm.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold mb-4 text-gray-900", "data-id": "36fgvly4c", "data-path": "src/pages/Employees/EmployeeForm.tsx", children: "Basic Information" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", "data-id": "69il4k7cd", "data-path": "src/pages/Employees/EmployeeForm.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "qmd2de80x", "data-path": "src/pages/Employees/EmployeeForm.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "employee_id", "data-id": "v58x0pcjm", "data-path": "src/pages/Employees/EmployeeForm.tsx", children: "Employee ID *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", "data-id": "1jybh030t", "data-path": "src/pages/Employees/EmployeeForm.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "employee_id",
                  value: formData.employee_id,
                  onChange: (e) => handleInputChange("employee_id", e.target.value),
                  placeholder: isEditing ? "Enter employee ID" : "Auto-generated",
                  readOnly: !isEditing,
                  className: !isEditing ? "bg-gray-50 cursor-not-allowed" : "",
                  required: true,
                  "data-id": "skixncigk",
                  "data-path": "src/pages/Employees/EmployeeForm.tsx"
                }
              ),
              !isEditing && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  size: "sm",
                  onClick: generateEmployeeId,
                  className: "shrink-0",
                  "data-id": "du62433nf",
                  "data-path": "src/pages/Employees/EmployeeForm.tsx",
                  children: "Regenerate"
                }
              )
            ] }),
            !isEditing && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500", "data-id": "45wi9b9zq", "data-path": "src/pages/Employees/EmployeeForm.tsx", children: "Auto-generated format: DFS#### (sequential numbering starting from DFS1001)" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "j8ompj6d0", "data-path": "src/pages/Employees/EmployeeForm.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "station", "data-id": "rj8nlb22f", "data-path": "src/pages/Employees/EmployeeForm.tsx", children: "Station *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: formData.station, onValueChange: (value) => handleInputChange("station", value), "data-id": "tuc4pob3v", "data-path": "src/pages/Employees/EmployeeForm.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-id": "ky5zadqo6", "data-path": "src/pages/Employees/EmployeeForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select station", "data-id": "x675q7mtg", "data-path": "src/pages/Employees/EmployeeForm.tsx" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { "data-id": "8ovqeebx4", "data-path": "src/pages/Employees/EmployeeForm.tsx", children: stations.map(
                (station) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: station, "data-id": "pfem5hb86", "data-path": "src/pages/Employees/EmployeeForm.tsx", children: station }, station)
              ) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "kwghb8kne", "data-path": "src/pages/Employees/EmployeeForm.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "first_name", "data-id": "68j9thoxe", "data-path": "src/pages/Employees/EmployeeForm.tsx", children: "First Name *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "first_name",
                value: formData.first_name,
                onChange: (e) => handleInputChange("first_name", e.target.value),
                placeholder: "Enter first name",
                required: true,
                "data-id": "j1qyfeuh4",
                "data-path": "src/pages/Employees/EmployeeForm.tsx"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "2gwzptzzk", "data-path": "src/pages/Employees/EmployeeForm.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "last_name", "data-id": "guwnb4807", "data-path": "src/pages/Employees/EmployeeForm.tsx", children: "Last Name *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "last_name",
                value: formData.last_name,
                onChange: (e) => handleInputChange("last_name", e.target.value),
                placeholder: "Enter last name",
                required: true,
                "data-id": "adfaol8jo",
                "data-path": "src/pages/Employees/EmployeeForm.tsx"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "q7ip2lzzi", "data-path": "src/pages/Employees/EmployeeForm.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "date_of_birth", "data-id": "upd5dju7a", "data-path": "src/pages/Employees/EmployeeForm.tsx", children: "Date of Birth" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "date_of_birth",
                type: "date",
                value: formData.date_of_birth,
                onChange: (e) => handleInputChange("date_of_birth", e.target.value),
                "data-id": "nmlrb4an5",
                "data-path": "src/pages/Employees/EmployeeForm.tsx"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "ijmqhgd5u", "data-path": "src/pages/Employees/EmployeeForm.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "email", "data-id": "nd2q4uzsr", "data-path": "src/pages/Employees/EmployeeForm.tsx", children: "Email" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "email",
                type: "email",
                value: formData.email,
                onChange: (e) => handleInputChange("email", e.target.value),
                placeholder: "Enter email address",
                "data-id": "2djuhslx6",
                "data-path": "src/pages/Employees/EmployeeForm.tsx"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "9pgqm2v48", "data-path": "src/pages/Employees/EmployeeForm.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "phone", "data-id": "vwehzuxl7", "data-path": "src/pages/Employees/EmployeeForm.tsx", children: "Phone" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "phone",
                value: formData.phone,
                onChange: (e) => handleInputChange("phone", e.target.value),
                placeholder: "Enter phone number",
                "data-id": "7dmj6s1c9",
                "data-path": "src/pages/Employees/EmployeeForm.tsx"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "pocqtvaty", "data-path": "src/pages/Employees/EmployeeForm.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "reference_name", "data-id": "z6d2kmye9", "data-path": "src/pages/Employees/EmployeeForm.tsx", children: "Reference Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "reference_name",
                value: formData.reference_name,
                onChange: (e) => handleInputChange("reference_name", e.target.value),
                placeholder: "Enter reference name",
                "data-id": "cbhxp0xii",
                "data-path": "src/pages/Employees/EmployeeForm.tsx"
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "edc3yprkp", "data-path": "src/pages/Employees/EmployeeForm.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold mb-4 text-gray-900", "data-id": "4cz0355pp", "data-path": "src/pages/Employees/EmployeeForm.tsx", children: "Address Information" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", "data-id": "0ljustgac", "data-path": "src/pages/Employees/EmployeeForm.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "1v25ua5rh", "data-path": "src/pages/Employees/EmployeeForm.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "current_address", "data-id": "cphf6k4xo", "data-path": "src/pages/Employees/EmployeeForm.tsx", children: "Current Address" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                id: "current_address",
                value: formData.current_address,
                onChange: (e) => handleInputChange("current_address", e.target.value),
                placeholder: "Enter current address",
                rows: 3,
                "data-id": "ojzsr6ir7",
                "data-path": "src/pages/Employees/EmployeeForm.tsx"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "bjgr0zyzu", "data-path": "src/pages/Employees/EmployeeForm.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "mailing_address", "data-id": "1tn9qtn6l", "data-path": "src/pages/Employees/EmployeeForm.tsx", children: "Mailing Address" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                id: "mailing_address",
                value: formData.mailing_address,
                onChange: (e) => handleInputChange("mailing_address", e.target.value),
                placeholder: "Enter mailing address",
                rows: 3,
                "data-id": "55dqh16s5",
                "data-path": "src/pages/Employees/EmployeeForm.tsx"
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "7xmfwzkc7", "data-path": "src/pages/Employees/EmployeeForm.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold mb-4 text-gray-900", "data-id": "baj9axi2j", "data-path": "src/pages/Employees/EmployeeForm.tsx", children: "Employment Information" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", "data-id": "ixblw7qg7", "data-path": "src/pages/Employees/EmployeeForm.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "zc5xsmngj", "data-path": "src/pages/Employees/EmployeeForm.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "position", "data-id": "r53ce40b3", "data-path": "src/pages/Employees/EmployeeForm.tsx", children: "Position *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: formData.position, onValueChange: (value) => handleInputChange("position", value), "data-id": "doinlk8rq", "data-path": "src/pages/Employees/EmployeeForm.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-id": "qgfk0oys8", "data-path": "src/pages/Employees/EmployeeForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select position", "data-id": "f8m31eo8x", "data-path": "src/pages/Employees/EmployeeForm.tsx" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { "data-id": "1xl4sh693", "data-path": "src/pages/Employees/EmployeeForm.tsx", children: positions.map(
                (position) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: position, "data-id": "g4f38adc1", "data-path": "src/pages/Employees/EmployeeForm.tsx", children: position }, position)
              ) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "h84qguna7", "data-path": "src/pages/Employees/EmployeeForm.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "hire_date", "data-id": "v89bq90up", "data-path": "src/pages/Employees/EmployeeForm.tsx", children: "Hire Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "hire_date",
                type: "date",
                value: formData.hire_date,
                onChange: (e) => handleInputChange("hire_date", e.target.value),
                "data-id": "fsjhthg1d",
                "data-path": "src/pages/Employees/EmployeeForm.tsx"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "593pq50x5", "data-path": "src/pages/Employees/EmployeeForm.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "salary", "data-id": "3wqis3h19", "data-path": "src/pages/Employees/EmployeeForm.tsx", children: "Salary ($)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              NumberInput,
              {
                id: "salary",
                step: "0.01",
                min: "0",
                value: formData.salary,
                onChange: (value) => handleInputChange("salary", value),
                "data-id": "ywji2syt1",
                "data-path": "src/pages/Employees/EmployeeForm.tsx"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "z2aljvy13", "data-path": "src/pages/Employees/EmployeeForm.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "is_active", "data-id": "yky5kg359", "data-path": "src/pages/Employees/EmployeeForm.tsx", children: "Active Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", "data-id": "5uq5njmfl", "data-path": "src/pages/Employees/EmployeeForm.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Switch,
                {
                  id: "is_active",
                  checked: formData.is_active,
                  onCheckedChange: (checked) => handleInputChange("is_active", checked),
                  "data-id": "0cpnctnxz",
                  "data-path": "src/pages/Employees/EmployeeForm.tsx"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-gray-600", "data-id": "as0l1zloa", "data-path": "src/pages/Employees/EmployeeForm.tsx", children: formData.is_active ? "Active" : "Inactive" })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "v27q1gmmc", "data-path": "src/pages/Employees/EmployeeForm.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold mb-4 text-gray-900", "data-id": "dhbbrdfj0", "data-path": "src/pages/Employees/EmployeeForm.tsx", children: "ID Documentation" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", "data-id": "m0tyj2ys5", "data-path": "src/pages/Employees/EmployeeForm.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "4o92prohv", "data-path": "src/pages/Employees/EmployeeForm.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "id_document_type", "data-id": "4z4n5twgi", "data-path": "src/pages/Employees/EmployeeForm.tsx", children: "ID Document Type" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: formData.id_document_type, onValueChange: (value) => handleInputChange("id_document_type", value), "data-id": "2tlsxqr8c", "data-path": "src/pages/Employees/EmployeeForm.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-id": "wxmjmwt9z", "data-path": "src/pages/Employees/EmployeeForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select ID document type", "data-id": "ev6jlx2i7", "data-path": "src/pages/Employees/EmployeeForm.tsx" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { "data-id": "kt7ajkfzc", "data-path": "src/pages/Employees/EmployeeForm.tsx", children: idDocumentTypes.map(
                (type) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: type, "data-id": "wxxoxflu4", "data-path": "src/pages/Employees/EmployeeForm.tsx", children: type }, type)
              ) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "px72txmsf", "data-path": "src/pages/Employees/EmployeeForm.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { "data-id": "sx4hrlcfu", "data-path": "src/pages/Employees/EmployeeForm.tsx", children: "ID Document Upload" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              EnhancedFileUpload,
              {
                onFileSelect: setSelectedFile,
                accept: ".pdf,.jpg,.jpeg,.png,image/*",
                label: "Upload ID Document or Take Photo",
                currentFile: selectedFile == null ? void 0 : selectedFile.name,
                maxSize: 10,
                allowCamera: true,
                "data-id": "08ljgj7qm",
                "data-path": "src/pages/Employees/EmployeeForm.tsx"
              }
            ),
            selectedFile && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-gray-50 rounded-lg", "data-id": "tqpnbcn7q", "data-path": "src/pages/Employees/EmployeeForm.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", "data-id": "spuz1p8o8", "data-path": "src/pages/Employees/EmployeeForm.tsx", children: "Selected file:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-600", "data-id": "wd584ca1t", "data-path": "src/pages/Employees/EmployeeForm.tsx", children: selectedFile.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500 mt-1", "data-id": "m6fifkmo0", "data-path": "src/pages/Employees/EmployeeForm.tsx", children: selectedFile.type.includes("image") ? "Image file selected" : "Document file selected" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500", "data-id": "y8huoitus", "data-path": "src/pages/Employees/EmployeeForm.tsx", children: "Supported formats: PDF, JPG, PNG (Max 10MB)" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end space-x-4 pt-6 border-t", "data-id": "uuox2lll2", "data-path": "src/pages/Employees/EmployeeForm.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            onClick: () => navigate("/employees"),
            "data-id": "holplvnex",
            "data-path": "src/pages/Employees/EmployeeForm.tsx",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: loading || isUploading, "data-id": "0fn5zuy9h", "data-path": "src/pages/Employees/EmployeeForm.tsx", children: loading || isUploading ? "Saving..." : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-4 h-4 mr-2", "data-id": "tmw7n7q21", "data-path": "src/pages/Employees/EmployeeForm.tsx" }),
          isEditing ? "Update Employee" : "Create Employee"
        ] }) })
      ] })
    ] }) })
  ] }) });
};
const EmployeeForm$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: EmployeeForm
}, Symbol.toStringTag, { value: "Module" }));
const SalaryList = () => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o;
  const [salaryRecords, setSalaryRecords] = reactExports.useState([]);
  const [employees, setEmployees] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [refreshing, setRefreshing] = reactExports.useState(false);
  const [searchTerm, setSearchTerm] = reactExports.useState("");
  const [statusFilter, setStatusFilter] = reactExports.useState("all");
  const [stationFilter, setStationFilter] = reactExports.useState("all");
  const [currentPage, setCurrentPage] = reactExports.useState(1);
  const [totalRecords, setTotalRecords] = reactExports.useState(0);
  const [selectedRecord, setSelectedRecord] = reactExports.useState(null);
  const [showViewDialog, setShowViewDialog] = reactExports.useState(false);
  const [isOnline, setIsOnline] = reactExports.useState(navigator.onLine);
  const [retryCount, setRetryCount] = reactExports.useState(0);
  const [lastUpdateTime, setLastUpdateTime] = reactExports.useState(/* @__PURE__ */ new Date());
  const [realtimeUpdates, setRealtimeUpdates] = reactExports.useState(0);
  const { toast: toast2 } = useToast();
  const navigate = useNavigate();
  const pageSize = 10;
  reactExports.useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      handleRefresh(true);
      toast2({
        title: "Back Online",
        description: "Real-time data synchronization resumed",
        variant: "default"
      });
    };
    const handleOffline = () => {
      setIsOnline(false);
      toast2({
        title: "Offline",
        description: "Real-time updates paused",
        variant: "destructive"
      });
    };
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);
  reactExports.useEffect(() => {
    fetchEmployees();
    fetchSalaryRecords();
  }, [currentPage, statusFilter, stationFilter, searchTerm]);
  reactExports.useEffect(() => {
    if (!isOnline) return;
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        handleRefresh(true);
      }
    }, 15e3);
    return () => clearInterval(interval);
  }, [currentPage, statusFilter, stationFilter, searchTerm, isOnline]);
  reactExports.useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && isOnline) {
        handleRefresh(true);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isOnline]);
  const fetchEmployees = reactExports.useCallback(async () => {
    try {
      console.log("👥 Fetching employees data...");
      const { data, error } = await supabase.from("employees").select("*").eq("is_active", true).order("first_name", { ascending: true }).limit(1e3);
      if (error) throw error;
      const employees2 = data || [];
      console.log("✅ Employees fetched successfully:", employees2.length);
      setEmployees(employees2);
    } catch (error) {
      console.error("❌ Error fetching employees:", error);
      toast2({
        title: "Error",
        description: "Failed to fetch employee data",
        variant: "destructive"
      });
    }
  }, [toast2]);
  const fetchSalaryRecords = reactExports.useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      let query = supabase.from("salary_records").select("*", { count: "exact" }).order("pay_date", { ascending: false });
      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }
      if (stationFilter !== "all") {
        query = query.eq("station", stationFilter);
      }
      if (searchTerm) {
        query = query.ilike("employee_id", `%${searchTerm}%`);
      }
      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);
      console.log("🔄 Fetching salary records - Real-time update:", {
        currentPage,
        pageSize,
        statusFilter,
        stationFilter,
        searchTerm,
        silent,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
      const { data: records, error, count } = await query;
      if (error) throw error;
      console.log("✅ Salary records fetched successfully:", {
        recordsCount: (records == null ? void 0 : records.length) || 0,
        totalCount: count || 0,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
      setSalaryRecords(records || []);
      setTotalRecords(count || 0);
      setLastUpdateTime(/* @__PURE__ */ new Date());
      setRetryCount(0);
    } catch (error) {
      console.error("❌ Error fetching salary records:", error);
      setRetryCount((prev) => prev + 1);
      if (!silent) {
        toast2({
          title: "Error",
          description: `Failed to fetch salary records. ${retryCount < 3 ? "Retrying..." : "Please check your connection."}`,
          variant: "destructive"
        });
        if (retryCount < 3) {
          setTimeout(() => {
            console.log(`🔄 Auto-retrying... Attempt ${retryCount + 1}/3`);
            fetchSalaryRecords(true);
          }, Math.pow(2, retryCount) * 1e3);
        }
      }
    } finally {
      if (!silent) setLoading(false);
    }
  }, [currentPage, pageSize, statusFilter, stationFilter, searchTerm, toast2]);
  const handleRefresh = reactExports.useCallback(async (silent = false) => {
    if (!silent) setRefreshing(true);
    try {
      console.log("🔄 Starting data refresh...", { silent, timestamp: (/* @__PURE__ */ new Date()).toISOString() });
      await Promise.all(
        [
          fetchEmployees(),
          fetchSalaryRecords(silent)
        ]
      );
      console.log("✅ Data refresh completed successfully");
      if (!silent) {
        toast2({
          title: "Success",
          description: "🔄 Data refreshed successfully",
          variant: "default"
        });
      }
    } catch (error) {
      console.error("❌ Error refreshing data:", error);
      if (!silent) {
        toast2({
          title: "Error",
          description: "❌ Failed to refresh data. Please try again.",
          variant: "destructive"
        });
      }
    } finally {
      if (!silent) setRefreshing(false);
    }
  }, [fetchEmployees, fetchSalaryRecords, toast2]);
  const handleViewRecord = (record) => {
    setSelectedRecord(record);
    setShowViewDialog(true);
  };
  const handleEditRecord = (record) => {
    const employeeName = getEmployeeName(record.employee_id);
    console.log("📝 Navigating to edit salary record:", { id: record.id, employee: employeeName });
    toast2({
      title: "Opening Editor",
      description: `📝 Loading salary record for ${employeeName}...`,
      variant: "default"
    });
    navigate(`/salary/${record.id}/edit`);
  };
  const handleDelete = async (id) => {
    const record = salaryRecords.find((r) => r.id === id);
    const employeeName = record ? getEmployeeName(record.employee_id) : "Unknown";
    if (!confirm(`Are you sure you want to delete the salary record for ${employeeName}?

This action cannot be undone.`)) return;
    try {
      console.log("🗑️ Deleting salary record:", id);
      const { error } = await supabase.from("salary_records").delete().eq("id", id);
      if (error) throw error;
      console.log("✅ Salary record deleted successfully");
      toast2({
        title: "Success",
        description: `🗑️ Salary record for ${employeeName} deleted successfully`
      });
      await fetchSalaryRecords();
    } catch (error) {
      console.error("❌ Error deleting salary record:", error);
      toast2({
        title: "Error",
        description: `❌ Failed to delete salary record for ${employeeName}`,
        variant: "destructive"
      });
    }
  };
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const record = salaryRecords.find((r) => r.id === id);
      if (!record) return;
      const employeeName = getEmployeeName(record.employee_id);
      console.log("🔄 Updating salary record status:", { id, newStatus, employeeName });
      const { error } = await supabase.from("salary_records").update({
        status: newStatus,
        pay_period_start: new Date(record.pay_period_start).toISOString(),
        pay_period_end: new Date(record.pay_period_end).toISOString(),
        pay_date: new Date(record.pay_date).toISOString()
      }).eq("id", id);
      if (error) throw error;
      console.log("✅ Status updated successfully");
      toast2({
        title: "Success",
        description: `📋 ${employeeName}'s salary status updated to ${newStatus}`
      });
      await fetchSalaryRecords();
    } catch (error) {
      console.error("❌ Error updating status:", error);
      toast2({
        title: "Error",
        description: "❌ Failed to update status. Please try again.",
        variant: "destructive"
      });
    }
  };
  const getEmployeeName = (employeeId) => {
    const employee = employees.find((emp) => emp.employee_id === employeeId);
    return employee ? `${employee.first_name} ${employee.last_name}` : employeeId;
  };
  const getStatusBadgeVariant = (status) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "default";
      case "processed":
        return "secondary";
      case "pending":
        return "outline";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };
  const calculateSummaryStats = () => {
    const totalGrossPay = salaryRecords.reduce((sum, record) => sum + (record.gross_pay || 0), 0);
    const totalNetPay = salaryRecords.reduce((sum, record) => sum + (record.net_pay || 0), 0);
    const uniqueEmployees = new Set(salaryRecords.map((record) => record.employee_id)).size;
    return {
      totalGrossPay,
      totalNetPay,
      uniqueEmployees,
      totalRecords: salaryRecords.length
    };
  };
  const exportToPDF = (record) => {
    var _a2, _b2, _c2, _d2, _e2, _f2, _g2, _h2, _i2, _j2, _k2, _l2, _m2, _n2, _o2;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    const employeeName = getEmployeeName(record.employee_id);
    const content = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Salary Slip - ${employeeName}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .details { margin: 20px 0; }
          .row { display: flex; justify-content: space-between; margin: 10px 0; }
          .section { margin: 20px 0; border-top: 1px solid #ccc; padding-top: 15px; }
          .total { font-weight: bold; font-size: 1.2em; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>DFS Manager Portal</h1>
          <h2>Salary Slip</h2>
        </div>
        
        <div class="details">
          <div class="row"><span>Employee:</span><span>${employeeName} (${record.employee_id})</span></div>
          <div class="row"><span>Station:</span><span>${record.station}</span></div>
          <div class="row"><span>Pay Period:</span><span>${format(new Date(record.pay_period_start), "MMM dd")} - ${format(new Date(record.pay_period_end), "MMM dd, yyyy")}</span></div>
          <div class="row"><span>Pay Date:</span><span>${format(new Date(record.pay_date), "MMM dd, yyyy")}</span></div>
          <div class="row"><span>Pay Frequency:</span><span>${record.pay_frequency}</span></div>
        </div>

        <div class="section">
          <h3>Earnings</h3>
          <div class="row"><span>Base Salary:</span><span>$${((_a2 = record.base_salary) == null ? void 0 : _a2.toLocaleString()) || "0.00"}</span></div>
          <div class="row"><span>Regular Hours (${record.regular_hours}):</span><span>$${((_b2 = record.hourly_rate * record.regular_hours) == null ? void 0 : _b2.toLocaleString()) || "0.00"}</span></div>
          <div class="row"><span>Overtime Hours (${record.overtime_hours}):</span><span>$${((_c2 = record.overtime_pay) == null ? void 0 : _c2.toLocaleString()) || "0.00"}</span></div>
          <div class="row"><span>Bonus:</span><span>$${((_d2 = record.bonus_amount) == null ? void 0 : _d2.toLocaleString()) || "0.00"}</span></div>
          <div class="row"><span>Commission:</span><span>$${((_e2 = record.commission) == null ? void 0 : _e2.toLocaleString()) || "0.00"}</span></div>
          <div class="row total"><span>Gross Pay:</span><span>$${((_f2 = record.gross_pay) == null ? void 0 : _f2.toLocaleString()) || "0.00"}</span></div>
        </div>

        <div class="section">
          <h3>Deductions</h3>
          <div class="row"><span>Federal Tax:</span><span>$${((_g2 = record.federal_tax) == null ? void 0 : _g2.toLocaleString()) || "0.00"}</span></div>
          <div class="row"><span>State Tax:</span><span>$${((_h2 = record.state_tax) == null ? void 0 : _h2.toLocaleString()) || "0.00"}</span></div>
          <div class="row"><span>Social Security:</span><span>$${((_i2 = record.social_security) == null ? void 0 : _i2.toLocaleString()) || "0.00"}</span></div>
          <div class="row"><span>Medicare:</span><span>$${((_j2 = record.medicare) == null ? void 0 : _j2.toLocaleString()) || "0.00"}</span></div>
          <div class="row"><span>Health Insurance:</span><span>$${((_k2 = record.health_insurance) == null ? void 0 : _k2.toLocaleString()) || "0.00"}</span></div>
          <div class="row"><span>401(k):</span><span>$${((_l2 = record.retirement_401k) == null ? void 0 : _l2.toLocaleString()) || "0.00"}</span></div>
          <div class="row"><span>Other Deductions:</span><span>$${((_m2 = record.other_deductions) == null ? void 0 : _m2.toLocaleString()) || "0.00"}</span></div>
          <div class="row total"><span>Total Deductions:</span><span>$${((_n2 = record.total_deductions) == null ? void 0 : _n2.toLocaleString()) || "0.00"}</span></div>
        </div>

        <div class="section">
          <div class="row total" style="font-size: 1.5em; color: green;"><span>Net Pay:</span><span>$${((_o2 = record.net_pay) == null ? void 0 : _o2.toLocaleString()) || "0.00"}</span></div>
        </div>

        ${record.notes ? `<div class="section"><h3>Notes</h3><p>${record.notes}</p></div>` : ""}
        
        <div style="margin-top: 50px; text-align: center; font-size: 0.9em; color: #666;">
          Generated on ${format(/* @__PURE__ */ new Date(), "PPpp")}
        </div>
      </body>
      </html>
    `;
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.print();
  };
  const stats = calculateSummaryStats();
  const totalPages = Math.ceil(totalRecords / pageSize);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-id": "0powv5sql", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "ap4fr7id2", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "mwsu7wgze", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold", "data-id": "ogogrlpqe", "data-path": "src/pages/Salary/SalaryList.tsx", children: "Salary Management" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", "data-id": "91l9dxguk", "data-path": "src/pages/Salary/SalaryList.tsx", children: "Manage employee salary records and payroll" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", "data-id": "4ouoryfjw", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", "data-id": "9dkb1z3ot", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: isOnline ? "default" : "destructive", className: "text-xs", "data-id": "1sm2qf2td", "data-path": "src/pages/Salary/SalaryList.tsx", children: isOnline ? "🟢 Live" : "🔴 Offline" }),
          refreshing && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-xs animate-pulse", "data-id": "1xtbpau9j", "data-path": "src/pages/Salary/SalaryList.tsx", children: "🔄 Syncing..." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            onClick: () => handleRefresh(false),
            disabled: refreshing,
            "data-id": "yaa0r07yy",
            "data-path": "src/pages/Salary/SalaryList.tsx",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: `h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`, "data-id": "d6rr69cqr", "data-path": "src/pages/Salary/SalaryList.tsx" }),
              refreshing ? "Refreshing..." : "Refresh"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/salary/new", "data-id": "yj93dafu6", "data-path": "src/pages/Salary/SalaryList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { "data-id": "kxoeipfc8", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-2", "data-id": "fxdcxb7w1", "data-path": "src/pages/Salary/SalaryList.tsx" }),
          "Add Salary Record"
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", "data-id": "pwseyhiro", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-id": "c9axl899f", "data-path": "src/pages/Salary/SalaryList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex items-center p-4", "data-id": "dhs0tb1de", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "h-8 w-8 text-green-600 mr-3", "data-id": "5u0geog51", "data-path": "src/pages/Salary/SalaryList.tsx" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "97hp702bw", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-muted-foreground", "data-id": "o763kdvjf", "data-path": "src/pages/Salary/SalaryList.tsx", children: "Total Gross Pay" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-2xl font-bold", "data-id": "parmyvoqr", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
            "$",
            stats.totalGrossPay.toLocaleString()
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-id": "k4bigzqlz", "data-path": "src/pages/Salary/SalaryList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex items-center p-4", "data-id": "4k2d8pkit", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "h-8 w-8 text-blue-600 mr-3", "data-id": "6otp4dadt", "data-path": "src/pages/Salary/SalaryList.tsx" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "pn16ro3l0", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-muted-foreground", "data-id": "9e84rk50z", "data-path": "src/pages/Salary/SalaryList.tsx", children: "Total Net Pay" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-2xl font-bold", "data-id": "er0ebdr61", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
            "$",
            stats.totalNetPay.toLocaleString()
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-id": "9i28hfw7m", "data-path": "src/pages/Salary/SalaryList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex items-center p-4", "data-id": "j1n5rbdv6", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-8 w-8 text-purple-600 mr-3", "data-id": "0wo0avk4a", "data-path": "src/pages/Salary/SalaryList.tsx" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "00e9ha0gt", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-muted-foreground", "data-id": "boewliuop", "data-path": "src/pages/Salary/SalaryList.tsx", children: "Employees" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold", "data-id": "bot0wk60e", "data-path": "src/pages/Salary/SalaryList.tsx", children: stats.uniqueEmployees })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-id": "xba105zqt", "data-path": "src/pages/Salary/SalaryList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex items-center p-4", "data-id": "11dn6k2zq", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-8 w-8 text-orange-600 mr-3", "data-id": "rh3g0rhxv", "data-path": "src/pages/Salary/SalaryList.tsx" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "n54oooctf", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-muted-foreground", "data-id": "uncjcdqdk", "data-path": "src/pages/Salary/SalaryList.tsx", children: "Total Records" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold", "data-id": "bpkinn8qk", "data-path": "src/pages/Salary/SalaryList.tsx", children: totalRecords })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-id": "hj4945t1w", "data-path": "src/pages/Salary/SalaryList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4", "data-id": "huh6sgy09", "data-path": "src/pages/Salary/SalaryList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-4", "data-id": "bskzw0c4b", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 min-w-[200px]", "data-id": "4w3etcikq", "data-path": "src/pages/Salary/SalaryList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", "data-id": "aq0c36so3", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-2 top-2.5 h-4 w-4 text-muted-foreground", "data-id": "rhzyufjx8", "data-path": "src/pages/Salary/SalaryList.tsx" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            placeholder: "Search by employee ID...",
            value: searchTerm,
            onChange: (e) => setSearchTerm(e.target.value),
            className: "pl-8",
            "data-id": "4xzaozd8w",
            "data-path": "src/pages/Salary/SalaryList.tsx"
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: statusFilter, onValueChange: setStatusFilter, "data-id": "qw1taunyd", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-[150px]", "data-id": "l0gzypqe3", "data-path": "src/pages/Salary/SalaryList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Status", "data-id": "9rxmbhkpx", "data-path": "src/pages/Salary/SalaryList.tsx" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { "data-id": "53e82cdg7", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", "data-id": "rss701s40", "data-path": "src/pages/Salary/SalaryList.tsx", children: "All Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Pending", "data-id": "ba8ky5vmm", "data-path": "src/pages/Salary/SalaryList.tsx", children: "Pending" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Processed", "data-id": "61lhm7tqb", "data-path": "src/pages/Salary/SalaryList.tsx", children: "Processed" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Paid", "data-id": "ky9vbvt2j", "data-path": "src/pages/Salary/SalaryList.tsx", children: "Paid" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Cancelled", "data-id": "owqjsquyi", "data-path": "src/pages/Salary/SalaryList.tsx", children: "Cancelled" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: stationFilter, onValueChange: setStationFilter, "data-id": "2cdns4zex", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-[180px]", "data-id": "d7im2ntf9", "data-path": "src/pages/Salary/SalaryList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Station", "data-id": "akaswewap", "data-path": "src/pages/Salary/SalaryList.tsx" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { "data-id": "670m8imvz", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", "data-id": "4mhn7wk0x", "data-path": "src/pages/Salary/SalaryList.tsx", children: "All Stations" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "MOBIL", "data-id": "rt7e1pda1", "data-path": "src/pages/Salary/SalaryList.tsx", children: "MOBIL" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "AMOCO ROSEDALE", "data-id": "fvqiu9rsl", "data-path": "src/pages/Salary/SalaryList.tsx", children: "AMOCO ROSEDALE" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "AMOCO BROOKLYN", "data-id": "2iasx8cnw", "data-path": "src/pages/Salary/SalaryList.tsx", children: "AMOCO BROOKLYN" })
        ] })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "4tpqkrgif", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { "data-id": "b7i0wlgza", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { "data-id": "dn2v199ha", "data-path": "src/pages/Salary/SalaryList.tsx", children: "Salary Records" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardDescription, { "data-id": "frooocdey", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
          "Showing ",
          salaryRecords.length,
          " of ",
          totalRecords,
          " salary records",
          refreshing && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-blue-600 ml-2", "data-id": "7wnoivrqj", "data-path": "src/pages/Salary/SalaryList.tsx", children: "(🔄 Real-time sync active...)" }),
          !isOnline && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-600 ml-2", "data-id": "x2mspk42z", "data-path": "src/pages/Salary/SalaryList.tsx", children: "(🔴 Offline mode)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground mt-1", "data-id": "v2c041dn5", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
            "Last updated: ",
            format(lastUpdateTime, "MMM dd, yyyy · h:mm:ss a"),
            retryCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-orange-600 ml-2", "data-id": "sxhmrr1dt", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
              "(🔄 Retry ",
              retryCount,
              "/3)"
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { "data-id": "lm0pk6eyd", "data-path": "src/pages/Salary/SalaryList.tsx", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center py-8", "data-id": "kbkbwhoss", "data-path": "src/pages/Salary/SalaryList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-primary", "data-id": "o0v9pulu4", "data-path": "src/pages/Salary/SalaryList.tsx" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "overflow-x-auto", "data-id": "ypu2isqfd", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { "data-id": "xyahzryws", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { "data-id": "qfp6o8vzp", "data-path": "src/pages/Salary/SalaryList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { "data-id": "c1clnx037", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "2tsrsqvuq", "data-path": "src/pages/Salary/SalaryList.tsx", children: "Employee" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "7g551klxi", "data-path": "src/pages/Salary/SalaryList.tsx", children: "Pay Period" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "o08fs84ql", "data-path": "src/pages/Salary/SalaryList.tsx", children: "Pay Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "zdduf6tg2", "data-path": "src/pages/Salary/SalaryList.tsx", children: "Frequency" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "6zbzutven", "data-path": "src/pages/Salary/SalaryList.tsx", children: "Gross Pay" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "r7ytgdpel", "data-path": "src/pages/Salary/SalaryList.tsx", children: "Net Pay" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "acf9xf0pr", "data-path": "src/pages/Salary/SalaryList.tsx", children: "Station" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "x6l018q4f", "data-path": "src/pages/Salary/SalaryList.tsx", children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "g9u73n579", "data-path": "src/pages/Salary/SalaryList.tsx", children: "Actions" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { "data-id": "q5r8ti0b9", "data-path": "src/pages/Salary/SalaryList.tsx", children: salaryRecords.map(
            (record) => {
              var _a2, _b2;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { "data-id": "7rmgj6rbj", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "font-medium", "data-id": "e43nw0a46", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
                  getEmployeeName(record.employee_id),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", "data-id": "3lsakiz8q", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
                    "ID: ",
                    record.employee_id
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "kjo56nt0c", "data-path": "src/pages/Salary/SalaryList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm", "data-id": "9aqj1ve9h", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
                  format(new Date(record.pay_period_start), "MMM dd"),
                  " - ",
                  format(new Date(record.pay_period_end), "MMM dd, yyyy")
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "l62zevn87", "data-path": "src/pages/Salary/SalaryList.tsx", children: format(new Date(record.pay_date), "MMM dd, yyyy") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "e7b84xcsu", "data-path": "src/pages/Salary/SalaryList.tsx", children: record.pay_frequency }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "font-medium", "data-id": "f1f6j3piz", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
                  "$",
                  ((_a2 = record.gross_pay) == null ? void 0 : _a2.toLocaleString()) || "0"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "font-medium text-green-600", "data-id": "3bo6y4oza", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
                  "$",
                  ((_b2 = record.net_pay) == null ? void 0 : _b2.toLocaleString()) || "0"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "1qcn88n2h", "data-path": "src/pages/Salary/SalaryList.tsx", children: record.station }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "eguetxdky", "data-path": "src/pages/Salary/SalaryList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Select,
                  {
                    value: record.status,
                    onValueChange: (value) => handleStatusUpdate(record.id, value),
                    "data-id": "yymlaaelp",
                    "data-path": "src/pages/Salary/SalaryList.tsx",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-auto h-auto p-0 border-none", "data-id": "lhjtbq9gc", "data-path": "src/pages/Salary/SalaryList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: getStatusBadgeVariant(record.status), "data-id": "aayta9k75", "data-path": "src/pages/Salary/SalaryList.tsx", children: record.status }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { "data-id": "8ehz5ksdn", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Pending", "data-id": "eoa6ts7cq", "data-path": "src/pages/Salary/SalaryList.tsx", children: "Pending" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Processed", "data-id": "xz3g5rxey", "data-path": "src/pages/Salary/SalaryList.tsx", children: "Processed" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Paid", "data-id": "7o3pxaugc", "data-path": "src/pages/Salary/SalaryList.tsx", children: "Paid" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Cancelled", "data-id": "bvlj5b3hu", "data-path": "src/pages/Salary/SalaryList.tsx", children: "Cancelled" })
                      ] })
                    ]
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "9h3o83bjn", "data-path": "src/pages/Salary/SalaryList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", "data-id": "ct5xk1yvn", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      variant: "ghost",
                      size: "sm",
                      onClick: () => handleViewRecord(record),
                      title: "View Details",
                      "data-id": "vpluiirjr",
                      "data-path": "src/pages/Salary/SalaryList.tsx",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4", "data-id": "e4ubrgquc", "data-path": "src/pages/Salary/SalaryList.tsx" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      variant: "ghost",
                      size: "sm",
                      onClick: () => handleEditRecord(record),
                      title: "Edit Record",
                      "data-id": "5fkgsnh4i",
                      "data-path": "src/pages/Salary/SalaryList.tsx",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { className: "h-4 w-4", "data-id": "07sr1vv8l", "data-path": "src/pages/Salary/SalaryList.tsx" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      variant: "ghost",
                      size: "sm",
                      onClick: () => exportToPDF(record),
                      title: "Export PDF",
                      "data-id": "0a6fwom2k",
                      "data-path": "src/pages/Salary/SalaryList.tsx",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-4 w-4", "data-id": "mjv1nesdh", "data-path": "src/pages/Salary/SalaryList.tsx" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      variant: "ghost",
                      size: "sm",
                      onClick: () => handleDelete(record.id),
                      className: "text-destructive hover:text-destructive",
                      title: "Delete Record",
                      "data-id": "5y92a8anz",
                      "data-path": "src/pages/Salary/SalaryList.tsx",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4", "data-id": "uoz2muwx3", "data-path": "src/pages/Salary/SalaryList.tsx" })
                    }
                  )
                ] }) })
              ] }, record.id);
            }
          ) })
        ] }),
        salaryRecords.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-8 text-muted-foreground", "data-id": "b4djsgt0d", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-12 w-12 mx-auto mb-4 text-muted-foreground/50", "data-id": "881cnvoy9", "data-path": "src/pages/Salary/SalaryList.tsx" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { "data-id": "k3hty7fbm", "data-path": "src/pages/Salary/SalaryList.tsx", children: "No salary records found." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/salary/new", className: "text-primary hover:underline", "data-id": "41mnlo7z5", "data-path": "src/pages/Salary/SalaryList.tsx", children: "Create your first salary record" })
        ] })
      ] }) })
    ] }),
    totalPages > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-center gap-2", "data-id": "arcul1mww", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "outline",
          onClick: () => setCurrentPage((prev) => Math.max(prev - 1, 1)),
          disabled: currentPage === 1,
          "data-id": "fhj37fow6",
          "data-path": "src/pages/Salary/SalaryList.tsx",
          children: "Previous"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center px-4", "data-id": "gyc00fl8d", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
        "Page ",
        currentPage,
        " of ",
        totalPages
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "outline",
          onClick: () => setCurrentPage((prev) => Math.min(prev + 1, totalPages)),
          disabled: currentPage === totalPages,
          "data-id": "raor6sfhf",
          "data-path": "src/pages/Salary/SalaryList.tsx",
          children: "Next"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: showViewDialog, onOpenChange: setShowViewDialog, "data-id": "7xfyjjlri", "data-path": "src/pages/Salary/SalaryList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-4xl max-h-[90vh] overflow-y-auto", "data-id": "gr15za3up", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { "data-id": "nn6hz49nu", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { "data-id": "iyi4pdxda", "data-path": "src/pages/Salary/SalaryList.tsx", children: "Salary Record Details" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { "data-id": "7n73a656z", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
          "Complete salary information for ",
          selectedRecord ? getEmployeeName(selectedRecord.employee_id) : ""
        ] })
      ] }),
      selectedRecord && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-id": "8lzmfiupv", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", "data-id": "5jeaaqqe9", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "8k5ovg2qr", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-muted-foreground", "data-id": "l8fhas1n4", "data-path": "src/pages/Salary/SalaryList.tsx", children: "Employee" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-medium", "data-id": "9oocgfxat", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
              getEmployeeName(selectedRecord.employee_id),
              " (",
              selectedRecord.employee_id,
              ")"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "guu3yjq10", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-muted-foreground", "data-id": "d92g11oju", "data-path": "src/pages/Salary/SalaryList.tsx", children: "Station" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { "data-id": "c94u8rb5b", "data-path": "src/pages/Salary/SalaryList.tsx", children: selectedRecord.station })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "swfu72s76", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-muted-foreground", "data-id": "dbbq73mjz", "data-path": "src/pages/Salary/SalaryList.tsx", children: "Pay Period" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { "data-id": "sygwvqrcl", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
              format(new Date(selectedRecord.pay_period_start), "MMM dd"),
              " - ",
              format(new Date(selectedRecord.pay_period_end), "MMM dd, yyyy")
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "cygiebn2a", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-muted-foreground", "data-id": "5oi5h377m", "data-path": "src/pages/Salary/SalaryList.tsx", children: "Pay Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { "data-id": "uacu4rwnk", "data-path": "src/pages/Salary/SalaryList.tsx", children: format(new Date(selectedRecord.pay_date), "MMM dd, yyyy") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "98dk6ymms", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-muted-foreground", "data-id": "za0i3liiw", "data-path": "src/pages/Salary/SalaryList.tsx", children: "Pay Frequency" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { "data-id": "sah810gz7", "data-path": "src/pages/Salary/SalaryList.tsx", children: selectedRecord.pay_frequency })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "jzlhsxpda", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-muted-foreground", "data-id": "gkh3q2pbc", "data-path": "src/pages/Salary/SalaryList.tsx", children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: getStatusBadgeVariant(selectedRecord.status), "data-id": "1sf2r7rfd", "data-path": "src/pages/Salary/SalaryList.tsx", children: selectedRecord.status })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "mjqm4190b", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold mb-3", "data-id": "5gq92m5um", "data-path": "src/pages/Salary/SalaryList.tsx", children: "Earnings" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-4", "data-id": "0c0x2y4z5", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "5poyvldpr", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-muted-foreground", "data-id": "rpxxpi9vg", "data-path": "src/pages/Salary/SalaryList.tsx", children: "Base Salary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-medium", "data-id": "fhii8j4e1", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
                "$",
                ((_a = selectedRecord.base_salary) == null ? void 0 : _a.toLocaleString()) || "0.00"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "arghc7igi", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-muted-foreground", "data-id": "iioi1575c", "data-path": "src/pages/Salary/SalaryList.tsx", children: "Hourly Rate" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-medium", "data-id": "gxd4o307x", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
                "$",
                ((_b = selectedRecord.hourly_rate) == null ? void 0 : _b.toFixed(2)) || "0.00"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "bnf60fury", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-muted-foreground", "data-id": "m50pdbah0", "data-path": "src/pages/Salary/SalaryList.tsx", children: "Regular Hours" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", "data-id": "wi2u638n6", "data-path": "src/pages/Salary/SalaryList.tsx", children: selectedRecord.regular_hours || 0 })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "dei2bcum1", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-muted-foreground", "data-id": "keqn80qpi", "data-path": "src/pages/Salary/SalaryList.tsx", children: "Overtime Hours" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", "data-id": "9uyw6b54x", "data-path": "src/pages/Salary/SalaryList.tsx", children: selectedRecord.overtime_hours || 0 })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "w2x1te572", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-muted-foreground", "data-id": "c8tkcou1k", "data-path": "src/pages/Salary/SalaryList.tsx", children: "Overtime Pay" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-medium", "data-id": "dapbbieyu", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
                "$",
                ((_c = selectedRecord.overtime_pay) == null ? void 0 : _c.toLocaleString()) || "0.00"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "efxtaopd0", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-muted-foreground", "data-id": "mnc2pvdby", "data-path": "src/pages/Salary/SalaryList.tsx", children: "Bonus" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-medium", "data-id": "1tdobr45r", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
                "$",
                ((_d = selectedRecord.bonus_amount) == null ? void 0 : _d.toLocaleString()) || "0.00"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "5eivnfjws", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-muted-foreground", "data-id": "u413r7iwj", "data-path": "src/pages/Salary/SalaryList.tsx", children: "Commission" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-medium", "data-id": "xbzk2ud3q", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
                "$",
                ((_e = selectedRecord.commission) == null ? void 0 : _e.toLocaleString()) || "0.00"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-3 border-t pt-2", "data-id": "8akuucz76", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-muted-foreground", "data-id": "7glee0q1z", "data-path": "src/pages/Salary/SalaryList.tsx", children: "Gross Pay" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xl font-bold text-green-600", "data-id": "33phwny1s", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
                "$",
                ((_f = selectedRecord.gross_pay) == null ? void 0 : _f.toLocaleString()) || "0.00"
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "54u06k8kv", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold mb-3", "data-id": "eqbtgskn7", "data-path": "src/pages/Salary/SalaryList.tsx", children: "Deductions" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-4", "data-id": "qs226g17s", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "3yr787pop", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-muted-foreground", "data-id": "zd430kd0v", "data-path": "src/pages/Salary/SalaryList.tsx", children: "Federal Tax" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-medium", "data-id": "x7hbvlwpp", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
                "$",
                ((_g = selectedRecord.federal_tax) == null ? void 0 : _g.toLocaleString()) || "0.00"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "yzd1msa8s", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-muted-foreground", "data-id": "j7h89xvf3", "data-path": "src/pages/Salary/SalaryList.tsx", children: "State Tax" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-medium", "data-id": "8k2ozc2sm", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
                "$",
                ((_h = selectedRecord.state_tax) == null ? void 0 : _h.toLocaleString()) || "0.00"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "4wr9hllpa", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-muted-foreground", "data-id": "9bx3p13s3", "data-path": "src/pages/Salary/SalaryList.tsx", children: "Social Security" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-medium", "data-id": "krffizqsq", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
                "$",
                ((_i = selectedRecord.social_security) == null ? void 0 : _i.toLocaleString()) || "0.00"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "k4l9ffog3", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-muted-foreground", "data-id": "b3m9zy5rx", "data-path": "src/pages/Salary/SalaryList.tsx", children: "Medicare" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-medium", "data-id": "hhfuma2hs", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
                "$",
                ((_j = selectedRecord.medicare) == null ? void 0 : _j.toLocaleString()) || "0.00"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "cjubr6ryp", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-muted-foreground", "data-id": "tg1nw28r5", "data-path": "src/pages/Salary/SalaryList.tsx", children: "Health Insurance" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-medium", "data-id": "khkich616", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
                "$",
                ((_k = selectedRecord.health_insurance) == null ? void 0 : _k.toLocaleString()) || "0.00"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "guyn21xza", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-muted-foreground", "data-id": "l0nepgdyw", "data-path": "src/pages/Salary/SalaryList.tsx", children: "401(k)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-medium", "data-id": "rekxqmmcl", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
                "$",
                ((_l = selectedRecord.retirement_401k) == null ? void 0 : _l.toLocaleString()) || "0.00"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "m8x1a4yu6", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-muted-foreground", "data-id": "eewv5lbcp", "data-path": "src/pages/Salary/SalaryList.tsx", children: "Other Deductions" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-medium", "data-id": "ddbihmtm4", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
                "$",
                ((_m = selectedRecord.other_deductions) == null ? void 0 : _m.toLocaleString()) || "0.00"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-3 border-t pt-2", "data-id": "fmcwaruq1", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-muted-foreground", "data-id": "u9964cbpq", "data-path": "src/pages/Salary/SalaryList.tsx", children: "Total Deductions" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xl font-bold text-red-600", "data-id": "ucejoofws", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
                "$",
                ((_n = selectedRecord.total_deductions) == null ? void 0 : _n.toLocaleString()) || "0.00"
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t pt-4", "data-id": "5qbbt2c1o", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-muted-foreground", "data-id": "d7e6mgysr", "data-path": "src/pages/Salary/SalaryList.tsx", children: "Net Pay" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-3xl font-bold text-green-600", "data-id": "n4gtsz2vn", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
            "$",
            ((_o = selectedRecord.net_pay) == null ? void 0 : _o.toLocaleString()) || "0.00"
          ] })
        ] }),
        selectedRecord.notes && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "emvd20wv6", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-muted-foreground", "data-id": "46bupcz2s", "data-path": "src/pages/Salary/SalaryList.tsx", children: "Notes" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 p-3 bg-muted rounded-md", "data-id": "un8wkz2j5", "data-path": "src/pages/Salary/SalaryList.tsx", children: selectedRecord.notes })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 pt-4 border-t", "data-id": "qt7rkurkm", "data-path": "src/pages/Salary/SalaryList.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              onClick: () => exportToPDF(selectedRecord),
              "data-id": "1qsl2kp7y",
              "data-path": "src/pages/Salary/SalaryList.tsx",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4 mr-2", "data-id": "9mi0a5ft5", "data-path": "src/pages/Salary/SalaryList.tsx" }),
                "Export PDF"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: () => {
                setShowViewDialog(false);
                handleEditRecord(selectedRecord);
              },
              "data-id": "a4634mvs6",
              "data-path": "src/pages/Salary/SalaryList.tsx",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { className: "h-4 w-4 mr-2", "data-id": "3fo3zrgx5", "data-path": "src/pages/Salary/SalaryList.tsx" }),
                "Edit Record"
              ]
            }
          )
        ] })
      ] })
    ] }) })
  ] });
};
const SalaryList$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: SalaryList
}, Symbol.toStringTag, { value: "Module" }));
const SalaryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast: toast2 } = useToast();
  const isEditing = Boolean(id && id !== "new");
  const [employees, setEmployees] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(false);
  const [formData, setFormData] = reactExports.useState({
    employee_id: "",
    pay_period_start: "",
    pay_period_end: "",
    pay_date: format(/* @__PURE__ */ new Date(), "yyyy-MM-dd"),
    pay_frequency: "Biweekly",
    base_salary: 0,
    hourly_rate: 0,
    regular_hours: 80,
    overtime_hours: 0,
    overtime_rate: 0,
    overtime_pay: 0,
    bonus_amount: 0,
    commission: 0,
    gross_pay: 0,
    federal_tax: 0,
    state_tax: 0,
    social_security: 0,
    medicare: 0,
    health_insurance: 0,
    retirement_401k: 0,
    other_deductions: 0,
    total_deductions: 0,
    net_pay: 0,
    station: "MOBIL",
    status: "Pending",
    notes: "",
    created_by: 1
  });
  reactExports.useEffect(() => {
    fetchEmployees();
    if (isEditing) {
      fetchSalaryRecord();
    }
  }, [id]);
  reactExports.useEffect(
    () => {
      calculatePayroll();
    },
    [
      formData.base_salary,
      formData.hourly_rate,
      formData.regular_hours,
      formData.overtime_hours,
      formData.bonus_amount,
      formData.commission
    ]
  );
  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase.from("employees").select("*").eq("is_active", true).order("first_name", { ascending: true }).limit(1e3);
      if (error) throw error;
      setEmployees(data || []);
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast2({
        title: "Error",
        description: "Failed to fetch employee data",
        variant: "destructive"
      });
    }
  };
  const fetchSalaryRecord = async () => {
    if (!id || id === "new") return;
    setLoading(true);
    try {
      const { data, error } = await supabase.from("salary_records").select("*").eq("id", parseInt(id)).limit(1).single();
      if (error) throw error;
      if (data) {
        setFormData({
          ...data,
          pay_period_start: format(new Date(data.pay_period_start), "yyyy-MM-dd"),
          pay_period_end: format(new Date(data.pay_period_end), "yyyy-MM-dd"),
          pay_date: format(new Date(data.pay_date), "yyyy-MM-dd")
        });
      }
    } catch (error) {
      console.error("Error fetching salary record:", error);
      toast2({
        title: "Error",
        description: "Failed to fetch salary record",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const calculatePayroll = () => {
    const overtimeRate = formData.hourly_rate * 1.5;
    const overtimePay = formData.overtime_hours * overtimeRate;
    const regularPay = formData.hourly_rate * formData.regular_hours;
    const grossPay = formData.base_salary + regularPay + overtimePay + formData.bonus_amount + formData.commission;
    setFormData((prev) => ({
      ...prev,
      overtime_rate: overtimeRate,
      overtime_pay: overtimePay,
      gross_pay: grossPay,
      net_pay: grossPay
    }));
  };
  const handleEmployeeChange = (employeeId) => {
    const employee = employees.find((emp) => emp.employee_id === employeeId);
    if (employee) {
      setFormData((prev) => ({
        ...prev,
        employee_id: employeeId,
        station: employee.station,
        hourly_rate: employee.salary / 2080
        // Assuming 2080 work hours per year
      }));
    }
  };
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const submitData = {
        ...formData,
        pay_period_start: new Date(formData.pay_period_start).toISOString(),
        pay_period_end: new Date(formData.pay_period_end).toISOString(),
        pay_date: new Date(formData.pay_date).toISOString()
      };
      if (isEditing) {
        const { error } = await supabase.from("salary_records").update(submitData).eq("id", parseInt(id));
        if (error) throw error;
      } else {
        const { error } = await supabase.from("salary_records").insert(submitData);
        if (error) throw error;
      }
      toast2({
        title: "Success",
        description: `Salary record ${isEditing ? "updated" : "created"} successfully`
      });
      navigate("/salary");
    } catch (error) {
      console.error("Error saving salary record:", error);
      toast2({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "create"} salary record`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-id": "bybotqknl", "data-path": "src/pages/Salary/SalaryForm.tsx", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", "data-id": "7w8jrpf9i", "data-path": "src/pages/Salary/SalaryForm.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", onClick: () => navigate("/salary"), "data-id": "cabslwo6j", "data-path": "src/pages/Salary/SalaryForm.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4 mr-2", "data-id": "c1jrkrpsl", "data-path": "src/pages/Salary/SalaryForm.tsx" }),
        "Back to Salary Records"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "zkhlxbvod", "data-path": "src/pages/Salary/SalaryForm.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold", "data-id": "ikc5yp8cx", "data-path": "src/pages/Salary/SalaryForm.tsx", children: isEditing ? "Edit Salary Record" : "Create Salary Record" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", "data-id": "0ah2t1lfi", "data-path": "src/pages/Salary/SalaryForm.tsx", children: isEditing ? "Update salary record details" : "Add a new salary record for payroll processing" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", "data-id": "gyq6bdphd", "data-path": "src/pages/Salary/SalaryForm.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "xuzm50r1j", "data-path": "src/pages/Salary/SalaryForm.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { "data-id": "tcxfetn5o", "data-path": "src/pages/Salary/SalaryForm.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { "data-id": "5f13hiqiw", "data-path": "src/pages/Salary/SalaryForm.tsx", children: "Basic Information" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { "data-id": "xfwzf4e0d", "data-path": "src/pages/Salary/SalaryForm.tsx", children: "Employee and pay period details" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-4", "data-id": "y7jsmv8cc", "data-path": "src/pages/Salary/SalaryForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", "data-id": "6yksihvl4", "data-path": "src/pages/Salary/SalaryForm.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "6gi6uhn9", "data-path": "src/pages/Salary/SalaryForm.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "employee_id", "data-id": "mowc14vm2", "data-path": "src/pages/Salary/SalaryForm.tsx", children: "Employee *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: formData.employee_id, onValueChange: handleEmployeeChange, "data-id": "f72iud11i", "data-path": "src/pages/Salary/SalaryForm.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-id": "34xmnel6f", "data-path": "src/pages/Salary/SalaryForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select employee", "data-id": "ajszeryex", "data-path": "src/pages/Salary/SalaryForm.tsx" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { "data-id": "y6marms0q", "data-path": "src/pages/Salary/SalaryForm.tsx", children: employees.map(
                (employee) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: employee.employee_id, "data-id": "l78soxj4i", "data-path": "src/pages/Salary/SalaryForm.tsx", children: [
                  employee.first_name,
                  " ",
                  employee.last_name,
                  " (",
                  employee.employee_id,
                  ")"
                ] }, employee.employee_id)
              ) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "du6dlt0e3", "data-path": "src/pages/Salary/SalaryForm.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "pay_frequency", "data-id": "ukqitau85", "data-path": "src/pages/Salary/SalaryForm.tsx", children: "Pay Frequency" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: formData.pay_frequency, onValueChange: (value) => handleInputChange("pay_frequency", value), "data-id": "dd092vd0b", "data-path": "src/pages/Salary/SalaryForm.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-id": "qrj7o2dja", "data-path": "src/pages/Salary/SalaryForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { "data-id": "xxtbkn71c", "data-path": "src/pages/Salary/SalaryForm.tsx" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { "data-id": "wbd599hl1", "data-path": "src/pages/Salary/SalaryForm.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Weekly", "data-id": "es7gn2cvn", "data-path": "src/pages/Salary/SalaryForm.tsx", children: "Weekly" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Biweekly", "data-id": "7chvd6rfr", "data-path": "src/pages/Salary/SalaryForm.tsx", children: "Biweekly" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Monthly", "data-id": "1gjdv5hbj", "data-path": "src/pages/Salary/SalaryForm.tsx", children: "Monthly" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Semi-monthly", "data-id": "mwo1rgzwz", "data-path": "src/pages/Salary/SalaryForm.tsx", children: "Semi-monthly" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "ekskgtwjn", "data-path": "src/pages/Salary/SalaryForm.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "pay_period_start", "data-id": "cr4yuymwc", "data-path": "src/pages/Salary/SalaryForm.tsx", children: "Pay Period Start *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "pay_period_start",
                type: "date",
                value: formData.pay_period_start,
                onChange: (e) => handleInputChange("pay_period_start", e.target.value),
                required: true,
                "data-id": "oroubhg3c",
                "data-path": "src/pages/Salary/SalaryForm.tsx"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "3vflsvptp", "data-path": "src/pages/Salary/SalaryForm.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "pay_period_end", "data-id": "2pr619mx9", "data-path": "src/pages/Salary/SalaryForm.tsx", children: "Pay Period End *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "pay_period_end",
                type: "date",
                value: formData.pay_period_end,
                onChange: (e) => handleInputChange("pay_period_end", e.target.value),
                required: true,
                "data-id": "9btwjuqg8",
                "data-path": "src/pages/Salary/SalaryForm.tsx"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "vxewo4rgu", "data-path": "src/pages/Salary/SalaryForm.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "pay_date", "data-id": "kxc8f4f5w", "data-path": "src/pages/Salary/SalaryForm.tsx", children: "Pay Date *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "pay_date",
                type: "date",
                value: formData.pay_date,
                onChange: (e) => handleInputChange("pay_date", e.target.value),
                required: true,
                "data-id": "iddcjav1q",
                "data-path": "src/pages/Salary/SalaryForm.tsx"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "tsmg1dxz6", "data-path": "src/pages/Salary/SalaryForm.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "station", "data-id": "ss8gm8eau", "data-path": "src/pages/Salary/SalaryForm.tsx", children: "Station" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: formData.station, onValueChange: (value) => handleInputChange("station", value), "data-id": "69sjos8hr", "data-path": "src/pages/Salary/SalaryForm.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-id": "gppogjcdi", "data-path": "src/pages/Salary/SalaryForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { "data-id": "6rg2ja4bm", "data-path": "src/pages/Salary/SalaryForm.tsx" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { "data-id": "6thr4xmpg", "data-path": "src/pages/Salary/SalaryForm.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "MOBIL", "data-id": "g18l973rj", "data-path": "src/pages/Salary/SalaryForm.tsx", children: "MOBIL" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "AMOCO ROSEDALE", "data-id": "f0otz1kds", "data-path": "src/pages/Salary/SalaryForm.tsx", children: "AMOCO ROSEDALE" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "AMOCO BROOKLYN", "data-id": "30ky4ltyn", "data-path": "src/pages/Salary/SalaryForm.tsx", children: "AMOCO BROOKLYN" })
              ] })
            ] })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "d3yups7e5", "data-path": "src/pages/Salary/SalaryForm.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { "data-id": "ls3nb97gh", "data-path": "src/pages/Salary/SalaryForm.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", "data-id": "ndfk2k8su", "data-path": "src/pages/Salary/SalaryForm.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "h-5 w-5", "data-id": "oc6juqqy5", "data-path": "src/pages/Salary/SalaryForm.tsx" }),
            "Earnings"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { "data-id": "thoy2sfvm", "data-path": "src/pages/Salary/SalaryForm.tsx", children: "Base salary, hourly wages, and additional compensation" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-4", "data-id": "nop3z80q9", "data-path": "src/pages/Salary/SalaryForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", "data-id": "5z210p0hp", "data-path": "src/pages/Salary/SalaryForm.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "xhg9xenfz", "data-path": "src/pages/Salary/SalaryForm.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "base_salary", "data-id": "ndp77oo4d", "data-path": "src/pages/Salary/SalaryForm.tsx", children: "Base Salary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              NumberInput,
              {
                id: "base_salary",
                step: "0.01",
                value: formData.base_salary,
                onChange: (value) => handleInputChange("base_salary", value),
                "data-id": "4szvcul7u",
                "data-path": "src/pages/Salary/SalaryForm.tsx"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "bhrqdxgzz", "data-path": "src/pages/Salary/SalaryForm.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "hourly_rate", "data-id": "fdfwt0fw8", "data-path": "src/pages/Salary/SalaryForm.tsx", children: "Hourly Rate" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              NumberInput,
              {
                id: "hourly_rate",
                step: "0.01",
                value: formData.hourly_rate,
                onChange: (value) => handleInputChange("hourly_rate", value),
                "data-id": "2iv01s8ee",
                "data-path": "src/pages/Salary/SalaryForm.tsx"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "17b8suy0t", "data-path": "src/pages/Salary/SalaryForm.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "regular_hours", "data-id": "1t7j4v0gp", "data-path": "src/pages/Salary/SalaryForm.tsx", children: "Regular Hours" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              NumberInput,
              {
                id: "regular_hours",
                step: "0.01",
                value: formData.regular_hours,
                onChange: (value) => handleInputChange("regular_hours", value),
                "data-id": "43giyqi7m",
                "data-path": "src/pages/Salary/SalaryForm.tsx"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "zg2dg42uu", "data-path": "src/pages/Salary/SalaryForm.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "overtime_hours", "data-id": "4fz98tznl", "data-path": "src/pages/Salary/SalaryForm.tsx", children: "Overtime Hours" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              NumberInput,
              {
                id: "overtime_hours",
                step: "0.01",
                value: formData.overtime_hours,
                onChange: (value) => handleInputChange("overtime_hours", value),
                "data-id": "iculuxr8j",
                "data-path": "src/pages/Salary/SalaryForm.tsx"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "jn4kufzg1", "data-path": "src/pages/Salary/SalaryForm.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "overtime_rate", "data-id": "ltxixk4zb", "data-path": "src/pages/Salary/SalaryForm.tsx", children: "Overtime Rate (Auto-calculated)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "overtime_rate",
                type: "number",
                step: "0.01",
                value: formData.overtime_rate.toFixed(2),
                disabled: true,
                className: "bg-muted",
                "data-id": "bcp8gk2wq",
                "data-path": "src/pages/Salary/SalaryForm.tsx"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "j0817hxnx", "data-path": "src/pages/Salary/SalaryForm.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "overtime_pay", "data-id": "ua1hjma6c", "data-path": "src/pages/Salary/SalaryForm.tsx", children: "Overtime Pay (Auto-calculated)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "overtime_pay",
                type: "number",
                step: "0.01",
                value: formData.overtime_pay.toFixed(2),
                disabled: true,
                className: "bg-muted",
                "data-id": "zjnyghxto",
                "data-path": "src/pages/Salary/SalaryForm.tsx"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "4tqika07w", "data-path": "src/pages/Salary/SalaryForm.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "bonus_amount", "data-id": "iez2yl8qg", "data-path": "src/pages/Salary/SalaryForm.tsx", children: "Bonus Amount" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              NumberInput,
              {
                id: "bonus_amount",
                step: "0.01",
                value: formData.bonus_amount,
                onChange: (value) => handleInputChange("bonus_amount", value),
                "data-id": "derc29lna",
                "data-path": "src/pages/Salary/SalaryForm.tsx"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "mybay1e88", "data-path": "src/pages/Salary/SalaryForm.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "commission", "data-id": "8advihm43", "data-path": "src/pages/Salary/SalaryForm.tsx", children: "Commission" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              NumberInput,
              {
                id: "commission",
                step: "0.01",
                value: formData.commission,
                onChange: (value) => handleInputChange("commission", value),
                "data-id": "f9qlcz1fb",
                "data-path": "src/pages/Salary/SalaryForm.tsx"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "fts1oxp9j", "data-path": "src/pages/Salary/SalaryForm.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "gross_pay", "data-id": "5vjpgt53i", "data-path": "src/pages/Salary/SalaryForm.tsx", children: "Gross Pay (Auto-calculated)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "gross_pay",
                type: "number",
                step: "0.01",
                value: formData.gross_pay.toFixed(2),
                disabled: true,
                className: "bg-muted font-bold",
                "data-id": "ipqut09z0",
                "data-path": "src/pages/Salary/SalaryForm.tsx"
              }
            )
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "5hslmpskw", "data-path": "src/pages/Salary/SalaryForm.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "utztt0xmp", "data-path": "src/pages/Salary/SalaryForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { "data-id": "m5agaq1ay", "data-path": "src/pages/Salary/SalaryForm.tsx", children: "Additional Information" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", "data-id": "8guzpw169", "data-path": "src/pages/Salary/SalaryForm.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", "data-id": "82zro7kvt", "data-path": "src/pages/Salary/SalaryForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "08vzlgowp", "data-path": "src/pages/Salary/SalaryForm.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "status", "data-id": "u9go33ott", "data-path": "src/pages/Salary/SalaryForm.tsx", children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: formData.status, onValueChange: (value) => handleInputChange("status", value), "data-id": "m4mkb76ox", "data-path": "src/pages/Salary/SalaryForm.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-id": "p6h9tlgb5", "data-path": "src/pages/Salary/SalaryForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { "data-id": "t8klju44w", "data-path": "src/pages/Salary/SalaryForm.tsx" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { "data-id": "md95uajkn", "data-path": "src/pages/Salary/SalaryForm.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Pending", "data-id": "rqnmoj27k", "data-path": "src/pages/Salary/SalaryForm.tsx", children: "Pending" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Processed", "data-id": "399zhkpu8", "data-path": "src/pages/Salary/SalaryForm.tsx", children: "Processed" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Paid", "data-id": "0797rrfag", "data-path": "src/pages/Salary/SalaryForm.tsx", children: "Paid" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Cancelled", "data-id": "coukukz1f", "data-path": "src/pages/Salary/SalaryForm.tsx", children: "Cancelled" })
              ] })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "dbpaed75d", "data-path": "src/pages/Salary/SalaryForm.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "notes", "data-id": "yk3x4yl27", "data-path": "src/pages/Salary/SalaryForm.tsx", children: "Notes" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                id: "notes",
                value: formData.notes,
                onChange: (e) => handleInputChange("notes", e.target.value),
                placeholder: "Additional notes about this salary record...",
                rows: 3,
                "data-id": "p19zucl3q",
                "data-path": "src/pages/Salary/SalaryForm.tsx"
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-4", "data-id": "f9phyhivu", "data-path": "src/pages/Salary/SalaryForm.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: () => navigate("/salary"), "data-id": "0bbzc5xxf", "data-path": "src/pages/Salary/SalaryForm.tsx", children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: loading, "data-id": "23gq6mhgv", "data-path": "src/pages/Salary/SalaryForm.tsx", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2", "data-id": "k161nj8hp", "data-path": "src/pages/Salary/SalaryForm.tsx" }),
          isEditing ? "Updating..." : "Creating..."
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-4 w-4 mr-2", "data-id": "4su2kcrqm", "data-path": "src/pages/Salary/SalaryForm.tsx" }),
          isEditing ? "Update Record" : "Create Record"
        ] }) })
      ] })
    ] })
  ] });
};
const SalaryForm$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: SalaryForm
}, Symbol.toStringTag, { value: "Module" }));
export {
  EmployeeList$1 as E,
  SalaryList$1 as S,
  EmployeeForm$1 as a,
  SalaryForm$1 as b
};
