import { j as jsxRuntimeExports } from "./ui-BAZ8HTBl.js";
import { r as reactExports, u as useNavigate, i as useParams } from "./vendor-Dw3NhmYV.js";
import { s as supabase, v as toast, C as Card, b as CardHeader, d as CardTitle, e as CardDescription, B as Button, i as ArrowLeft, f as CardContent } from "./index-xgH9wc9T.js";
import { I as Input } from "./input-DS8Y9d9X.js";
import { T as Textarea, N as NumberInput } from "./textarea-DRj8ZshS.js";
import { L as Label } from "./label-DtRhp3dR.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-D7v6NG_6.js";
import { S as Switch } from "./switch-Dyyad0Hw.js";
import { E as EnhancedFileUpload } from "./EnhancedFileUpload-BSPINCtR.js";
import { U as Users } from "./users-DzKuefIB.js";
import { S as Save } from "./save-DHkarsQ_.js";
import "./dialog-sqCJez4p.js";
import "./loader-2-HgtsHnjl.js";
import "./zap-DmPuvH7U.js";
import "./rotate-ccw-jweaWBVI.js";
import "./file-text-DwQmg6EU.js";
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
export {
  EmployeeForm as default
};
//# sourceMappingURL=EmployeeForm-DsigAddH.js.map
