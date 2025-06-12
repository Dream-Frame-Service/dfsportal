import { r as reactExports, u as useNavigate, a as useParams, j as jsxRuntimeExports } from "./react-vendor-DX0Gaxph.js";
import { s as supabase, K as toast, C as Card, d as CardHeader, e as CardTitle, f as CardDescription, B as Button, g as CardContent, L as Label, I as Input, S as Select, h as SelectTrigger, i as SelectValue, j as SelectContent, k as SelectItem } from "./admin-core-CknIDYcP.js";
import { E as EnhancedFileUpload } from "./business-pages-BYlNtgd-.js";
import { a4 as FileText, J as ArrowLeft, bO as File, aG as Save } from "./ui-components-svEX1DXz.js";
import "./vendor-ChWeSoXy.js";
import "./aws-sdk-DF6-bWA6.js";
import "./supabase-DWlqU2OS.js";
import "./admin-security-BkHZEmpQ.js";
import "./animations-DEJKylty.js";
const LicenseForm = () => {
  const [formData, setFormData] = reactExports.useState({
    license_name: "",
    license_number: "",
    issuing_authority: "",
    issue_date: "",
    expiry_date: "",
    station: "",
    category: "",
    status: "Active",
    document_file_id: 0
  });
  const [loading, setLoading] = reactExports.useState(false);
  const [isEditing, setIsEditing] = reactExports.useState(false);
  const [uploadedFile, setUploadedFile] = reactExports.useState(null);
  const [uploadLoading, setUploadLoading] = reactExports.useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const stations = ["MOBIL", "AMOCO ROSEDALE", "AMOCO BROOKLYN", "ALL"];
  const categories = ["Business", "Environmental", "Safety", "Health", "Fire", "Building", "Other"];
  const statuses = ["Active", "Expired", "Pending Renewal"];
  reactExports.useEffect(() => {
    if (id) {
      setIsEditing(true);
      loadLicense(parseInt(id));
    }
  }, [id]);
  const loadLicense = async (licenseId) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("licenses_certificates").select("*").eq("ID", licenseId).single();
      if (error) throw error;
      if (data) {
        setFormData({
          license_name: data.license_name || "",
          license_number: data.license_number || "",
          issuing_authority: data.issuing_authority || "",
          issue_date: data.issue_date ? data.issue_date.split("T")[0] : "",
          expiry_date: data.expiry_date ? data.expiry_date.split("T")[0] : "",
          station: data.station || "",
          category: data.category || "",
          status: data.status || "Active",
          document_file_id: data.document_file_id || 0
        });
      }
    } catch (error) {
      console.error("Error loading license:", error);
      toast({
        title: "Error",
        description: "Failed to load license details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const handleFileUpload = async (file) => {
    try {
      setUploadLoading(true);
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage.from("documents").upload(fileName, file);
      if (uploadError) throw uploadError;
      const { data: fileRecord, error: fileError } = await supabase.from("files").insert({
        filename: file.name,
        storage_path: uploadData.path,
        file_size: file.size,
        mime_type: file.type,
        uploaded_at: (/* @__PURE__ */ new Date()).toISOString()
      }).select("id").single();
      if (fileError) throw fileError;
      setFormData((prev) => ({ ...prev, document_file_id: fileRecord.id }));
      setUploadedFile(file);
      toast({
        title: "Success",
        description: "File uploaded successfully"
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Error",
        description: "Failed to upload file",
        variant: "destructive"
      });
    } finally {
      setUploadLoading(false);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const dataToSubmit = {
        ...formData,
        issue_date: formData.issue_date ? new Date(formData.issue_date).toISOString() : "",
        expiry_date: formData.expiry_date ? new Date(formData.expiry_date).toISOString() : "",
        created_by: 1
      };
      if (isEditing && id) {
        const { error } = await supabase.from("licenses_certificates").update(dataToSubmit).eq("ID", parseInt(id));
        if (error) throw error;
        toast({
          title: "Success",
          description: "License updated successfully"
        });
      } else {
        const { error } = await supabase.from("licenses_certificates").insert(dataToSubmit);
        if (error) throw error;
        toast({
          title: "Success",
          description: "License created successfully"
        });
      }
      navigate("/licenses");
    } catch (error) {
      console.error("Error saving license:", error);
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "create"} license`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const isExpiringSoon = (expiryDate) => {
    if (!expiryDate) return false;
    const today = /* @__PURE__ */ new Date();
    const expiry = new Date(expiryDate);
    const daysDiff = Math.ceil((expiry.getTime() - today.getTime()) / (1e3 * 3600 * 24));
    return daysDiff <= 30 && daysDiff >= 0;
  };
  const isExpired = (expiryDate) => {
    if (!expiryDate) return false;
    const today = /* @__PURE__ */ new Date();
    const expiry = new Date(expiryDate);
    return expiry < today;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", "data-id": "vgg3ndeg1", "data-path": "src/pages/Licenses/LicenseForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "whv4ybpk8", "data-path": "src/pages/Licenses/LicenseForm.tsx", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "rdvlhb424", "data-path": "src/pages/Licenses/LicenseForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "bdkxse7nv", "data-path": "src/pages/Licenses/LicenseForm.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "7guhb7pso", "data-path": "src/pages/Licenses/LicenseForm.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center space-x-2", "data-id": "yh5a4rrrj", "data-path": "src/pages/Licenses/LicenseForm.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-6 h-6", "data-id": "r4ipenl0f", "data-path": "src/pages/Licenses/LicenseForm.tsx" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "zkdvbz5ak", "data-path": "src/pages/Licenses/LicenseForm.tsx", children: isEditing ? "Edit License" : "Add New License" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { "data-id": "trqxlb7gg", "data-path": "src/pages/Licenses/LicenseForm.tsx", children: isEditing ? "Update license information" : "Add a new license or certificate" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: () => navigate("/licenses"), "data-id": "stld9a5oy", "data-path": "src/pages/Licenses/LicenseForm.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4 mr-2", "data-id": "ckut7gfpu", "data-path": "src/pages/Licenses/LicenseForm.tsx" }),
        "Back to Licenses"
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { "data-id": "i7jln73oz", "data-path": "src/pages/Licenses/LicenseForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", "data-id": "qb6ele6zj", "data-path": "src/pages/Licenses/LicenseForm.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", "data-id": "zh2x4y67u", "data-path": "src/pages/Licenses/LicenseForm.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "hj9j5f1s3", "data-path": "src/pages/Licenses/LicenseForm.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "license_name", "data-id": "ya65wvg7z", "data-path": "src/pages/Licenses/LicenseForm.tsx", children: "License Name *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "license_name",
              value: formData.license_name,
              onChange: (e) => handleInputChange("license_name", e.target.value),
              placeholder: "Enter license name",
              required: true,
              "data-id": "fdgizepaj",
              "data-path": "src/pages/Licenses/LicenseForm.tsx"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "yjjalfvhz", "data-path": "src/pages/Licenses/LicenseForm.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "license_number", "data-id": "s15js82rs", "data-path": "src/pages/Licenses/LicenseForm.tsx", children: "License Number *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "license_number",
              value: formData.license_number,
              onChange: (e) => handleInputChange("license_number", e.target.value),
              placeholder: "Enter license number",
              required: true,
              "data-id": "ocvbgxszl",
              "data-path": "src/pages/Licenses/LicenseForm.tsx"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "0wb0i8xza", "data-path": "src/pages/Licenses/LicenseForm.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "issuing_authority", "data-id": "e38j05y21", "data-path": "src/pages/Licenses/LicenseForm.tsx", children: "Issuing Authority *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "issuing_authority",
              value: formData.issuing_authority,
              onChange: (e) => handleInputChange("issuing_authority", e.target.value),
              placeholder: "Enter issuing authority",
              required: true,
              "data-id": "3a14tkjai",
              "data-path": "src/pages/Licenses/LicenseForm.tsx"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "6burj9om8", "data-path": "src/pages/Licenses/LicenseForm.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "category", "data-id": "do1gats5a", "data-path": "src/pages/Licenses/LicenseForm.tsx", children: "Category *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: formData.category, onValueChange: (value) => handleInputChange("category", value), "data-id": "rk38ofbfb", "data-path": "src/pages/Licenses/LicenseForm.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-id": "hy4ju1948", "data-path": "src/pages/Licenses/LicenseForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select category", "data-id": "zxkwx0flw", "data-path": "src/pages/Licenses/LicenseForm.tsx" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { "data-id": "fv1mi1fib", "data-path": "src/pages/Licenses/LicenseForm.tsx", children: categories.map(
              (category) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: category, "data-id": "kpla2neio", "data-path": "src/pages/Licenses/LicenseForm.tsx", children: category }, category)
            ) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "busal6z6k", "data-path": "src/pages/Licenses/LicenseForm.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "station", "data-id": "5udd3b4lb", "data-path": "src/pages/Licenses/LicenseForm.tsx", children: "Station *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: formData.station, onValueChange: (value) => handleInputChange("station", value), "data-id": "6pjebtuu9", "data-path": "src/pages/Licenses/LicenseForm.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-id": "s74be2uy5", "data-path": "src/pages/Licenses/LicenseForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select station", "data-id": "s4axje0sb", "data-path": "src/pages/Licenses/LicenseForm.tsx" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { "data-id": "33znbhlxs", "data-path": "src/pages/Licenses/LicenseForm.tsx", children: stations.map(
              (station) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: station, "data-id": "9tgssdbk3", "data-path": "src/pages/Licenses/LicenseForm.tsx", children: station }, station)
            ) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "gzgg7u0pa", "data-path": "src/pages/Licenses/LicenseForm.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "status", "data-id": "fl8r90u2e", "data-path": "src/pages/Licenses/LicenseForm.tsx", children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: formData.status, onValueChange: (value) => handleInputChange("status", value), "data-id": "d7dyjp36w", "data-path": "src/pages/Licenses/LicenseForm.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-id": "drilkptry", "data-path": "src/pages/Licenses/LicenseForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select status", "data-id": "ybt1dbg8q", "data-path": "src/pages/Licenses/LicenseForm.tsx" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { "data-id": "mnyxyvhfk", "data-path": "src/pages/Licenses/LicenseForm.tsx", children: statuses.map(
              (status) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: status, "data-id": "07s2mz23o", "data-path": "src/pages/Licenses/LicenseForm.tsx", children: status }, status)
            ) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "1337o29xp", "data-path": "src/pages/Licenses/LicenseForm.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "issue_date", "data-id": "8d35k0u62", "data-path": "src/pages/Licenses/LicenseForm.tsx", children: "Issue Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "issue_date",
              type: "date",
              value: formData.issue_date,
              onChange: (e) => handleInputChange("issue_date", e.target.value),
              "data-id": "jgbp0zhl1",
              "data-path": "src/pages/Licenses/LicenseForm.tsx"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "0r75wchg8", "data-path": "src/pages/Licenses/LicenseForm.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "expiry_date", "data-id": "civv8lqca", "data-path": "src/pages/Licenses/LicenseForm.tsx", children: "Expiry Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "expiry_date",
              type: "date",
              value: formData.expiry_date,
              onChange: (e) => handleInputChange("expiry_date", e.target.value),
              className: isExpired(formData.expiry_date) ? "border-red-500" : isExpiringSoon(formData.expiry_date) ? "border-yellow-500" : "",
              "data-id": "x8dq4e6sc",
              "data-path": "src/pages/Licenses/LicenseForm.tsx"
            }
          ),
          isExpired(formData.expiry_date) && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-red-600", "data-id": "b9vw9vkd4", "data-path": "src/pages/Licenses/LicenseForm.tsx", children: "⚠️ This license has expired" }),
          isExpiringSoon(formData.expiry_date) && !isExpired(formData.expiry_date) && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-yellow-600", "data-id": "3b5uimmu3", "data-path": "src/pages/Licenses/LicenseForm.tsx", children: "⚠️ This license expires within 30 days" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", "data-id": "89hdc48lr", "data-path": "src/pages/Licenses/LicenseForm.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { "data-id": "aqxb1zuzs", "data-path": "src/pages/Licenses/LicenseForm.tsx", children: "License Document" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          EnhancedFileUpload,
          {
            onFileSelect: handleFileUpload,
            accept: ".pdf,.doc,.docx,.jpg,.jpeg,.png,image/*",
            label: "Upload License Document or Take Photo",
            currentFile: (uploadedFile == null ? void 0 : uploadedFile.name) || (formData.document_file_id > 0 ? `Document ID: ${formData.document_file_id}` : void 0),
            maxSize: 10,
            allowCamera: true,
            disabled: uploadLoading,
            "data-id": "i2v0kpg93",
            "data-path": "src/pages/Licenses/LicenseForm.tsx"
          }
        ),
        uploadedFile && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 p-3 bg-green-50 border border-green-200 rounded", "data-id": "xr4f0yzwq", "data-path": "src/pages/Licenses/LicenseForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", "data-id": "b9b0h0jke", "data-path": "src/pages/Licenses/LicenseForm.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(File, { className: "w-4 h-4 text-green-600", "data-id": "f94p8mdpt", "data-path": "src/pages/Licenses/LicenseForm.tsx" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-green-800", "data-id": "z2otnvgur", "data-path": "src/pages/Licenses/LicenseForm.tsx", children: [
            "Recently uploaded: ",
            uploadedFile.name
          ] })
        ] }) }),
        formData.document_file_id > 0 && !uploadedFile && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 p-3 bg-blue-50 border border-blue-200 rounded", "data-id": "gecz4f6n3", "data-path": "src/pages/Licenses/LicenseForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", "data-id": "54u6wzjry", "data-path": "src/pages/Licenses/LicenseForm.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(File, { className: "w-4 h-4 text-blue-600", "data-id": "r7zxszcvg", "data-path": "src/pages/Licenses/LicenseForm.tsx" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-blue-800", "data-id": "o5r2lp8wl", "data-path": "src/pages/Licenses/LicenseForm.tsx", children: [
            "Document uploaded (ID: ",
            formData.document_file_id,
            ")"
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500", "data-id": "ch3s3xq6h", "data-path": "src/pages/Licenses/LicenseForm.tsx", children: "PDF, DOC, DOCX, JPG, PNG files up to 10MB" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end space-x-4", "data-id": "o021vxd1d", "data-path": "src/pages/Licenses/LicenseForm.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            onClick: () => navigate("/licenses"),
            "data-id": "hxu85hw1b",
            "data-path": "src/pages/Licenses/LicenseForm.tsx",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: loading || uploadLoading, "data-id": "ssskqblmb", "data-path": "src/pages/Licenses/LicenseForm.tsx", children: loading ? "Saving..." : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-4 h-4 mr-2", "data-id": "9kdwsj9av", "data-path": "src/pages/Licenses/LicenseForm.tsx" }),
          isEditing ? "Update License" : "Create License"
        ] }) })
      ] })
    ] }) })
  ] }) });
};
export {
  LicenseForm as default
};
