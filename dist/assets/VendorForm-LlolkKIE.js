import { r as reactExports, u as useNavigate, a as useParams, j as jsxRuntimeExports } from "./react-vendor-DX0Gaxph.js";
import { s as supabase, K as toast, C as Card, d as CardHeader, e as CardTitle, f as CardDescription, B as Button, g as CardContent, L as Label, S as Select, h as SelectTrigger, i as SelectValue, j as SelectContent, k as SelectItem, I as Input, O as Textarea, n as Switch } from "./admin-core-DFYqoWCM.js";
import { ax as Building2, J as ArrowLeft, aG as Save } from "./ui-components-E8Qujiw2.js";
import "./vendor-ChWeSoXy.js";
import "./aws-sdk-DF6-bWA6.js";
import "./supabase-DWlqU2OS.js";
const VendorForm = () => {
  const [formData, setFormData] = reactExports.useState({
    vendor_name: "",
    contact_person: "",
    email: "",
    phone: "",
    address: "",
    category: "",
    payment_terms: "",
    is_active: true,
    station: ""
  });
  const [loading, setLoading] = reactExports.useState(false);
  const [isEditing, setIsEditing] = reactExports.useState(false);
  const [selectedStation, setSelectedStation] = reactExports.useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const categories = [
    "Fuel Supplier",
    "Food & Beverages",
    "Automotive",
    "Maintenance",
    "Office Supplies",
    "Technology",
    "Cleaning Services",
    "Security Services",
    "Other"
  ];
  const paymentTermsOptions = [
    "Net 30",
    "Net 15",
    "Payment on Delivery",
    "Prepaid",
    "2/10 Net 30",
    "Custom Terms"
  ];
  const stations = [
    "MOBIL",
    "AMOCO ROSEDALE",
    "AMOCO BROOKLYN"
  ];
  reactExports.useEffect(() => {
    if (id) {
      setIsEditing(true);
      loadVendor(parseInt(id));
    }
  }, [id]);
  const loadVendor = async (vendorId) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("vendors").select("*").eq("id", vendorId).single();
      if (error) throw error;
      if (data) {
        setFormData({
          vendor_name: data.vendor_name || "",
          contact_person: data.contact_person || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
          category: data.category || "",
          payment_terms: data.payment_terms || "",
          is_active: data.is_active !== false,
          station: data.station || ""
        });
        setSelectedStation(data.station || "");
      }
    } catch (error) {
      console.error("Error loading vendor:", error);
      toast({
        title: "Error",
        description: "Failed to load vendor details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const dataToSubmit = {
        ...formData,
        station: selectedStation,
        created_by: 1
      };
      if (isEditing && id) {
        const { error } = await supabase.from("vendors").update(dataToSubmit).eq("id", parseInt(id));
        if (error) throw error;
        toast({
          title: "Success",
          description: "Vendor updated successfully"
        });
      } else {
        const { error } = await supabase.from("vendors").insert([dataToSubmit]);
        if (error) throw error;
        toast({
          title: "Success",
          description: "Vendor created successfully"
        });
      }
      navigate("/vendors");
    } catch (error) {
      console.error("Error saving vendor:", error);
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "create"} vendor`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const handleStationSelect = (station) => {
    setSelectedStation(station);
    setFormData((prev) => ({ ...prev, station }));
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", "data-id": "2w9w0ie3m", "data-path": "src/pages/Vendors/VendorForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "u92ybbjr1", "data-path": "src/pages/Vendors/VendorForm.tsx", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "s8341u6fd", "data-path": "src/pages/Vendors/VendorForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "yyw5vejf6", "data-path": "src/pages/Vendors/VendorForm.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "ev0vfxymk", "data-path": "src/pages/Vendors/VendorForm.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center space-x-2", "data-id": "08bfvda04", "data-path": "src/pages/Vendors/VendorForm.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "w-6 h-6", "data-id": "0clsb3u9t", "data-path": "src/pages/Vendors/VendorForm.tsx" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "6tjj5n0jk", "data-path": "src/pages/Vendors/VendorForm.tsx", children: isEditing ? "Edit Vendor" : "Add New Vendor" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { "data-id": "sm0c6svar", "data-path": "src/pages/Vendors/VendorForm.tsx", children: isEditing ? "Update vendor information" : "Add a new vendor to your contacts" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: () => navigate("/vendors"), "data-id": "ux2b0t48o", "data-path": "src/pages/Vendors/VendorForm.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4 mr-2", "data-id": "vb47p75yn", "data-path": "src/pages/Vendors/VendorForm.tsx" }),
        "Back to Vendors"
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { "data-id": "1aauotzv3", "data-path": "src/pages/Vendors/VendorForm.tsx", children: !selectedStation && !isEditing ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-id": "59k8of4qv", "data-path": "src/pages/Vendors/VendorForm.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-4", "data-id": "9fjk7gf6k", "data-path": "src/pages/Vendors/VendorForm.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold", "data-id": "mx5ipbxd6", "data-path": "src/pages/Vendors/VendorForm.tsx", children: "Select Station First" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-600", "data-id": "5uvreq4zk", "data-path": "src/pages/Vendors/VendorForm.tsx", children: "Please select a station before creating a vendor." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md mx-auto space-y-4", "data-id": "jyc5mbay0", "data-path": "src/pages/Vendors/VendorForm.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "station", "data-id": "3n3z724vf", "data-path": "src/pages/Vendors/VendorForm.tsx", children: "Station *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: selectedStation, onValueChange: handleStationSelect, "data-id": "6ndbfufr7", "data-path": "src/pages/Vendors/VendorForm.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-id": "09vrw0453", "data-path": "src/pages/Vendors/VendorForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select a station", "data-id": "r3jv6eej9", "data-path": "src/pages/Vendors/VendorForm.tsx" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { "data-id": "wysv0k2uo", "data-path": "src/pages/Vendors/VendorForm.tsx", children: stations.map(
            (station) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: station, "data-id": "tz1igse0i", "data-path": "src/pages/Vendors/VendorForm.tsx", children: station }, station)
          ) })
        ] })
      ] })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", "data-id": "0p6uv9atr", "data-path": "src/pages/Vendors/VendorForm.tsx", children: [
      selectedStation && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6", "data-id": "g1ezcq9i7", "data-path": "src/pages/Vendors/VendorForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "0hhj943nv", "data-path": "src/pages/Vendors/VendorForm.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "3ps9n35b4", "data-path": "src/pages/Vendors/VendorForm.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-medium text-blue-900", "data-id": "ts5qkbam9", "data-path": "src/pages/Vendors/VendorForm.tsx", children: "Selected Station" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-blue-700", "data-id": "a05hk127r", "data-path": "src/pages/Vendors/VendorForm.tsx", children: selectedStation })
        ] }),
        !isEditing && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            size: "sm",
            onClick: () => setSelectedStation(""),
            "data-id": "q4faa3po5",
            "data-path": "src/pages/Vendors/VendorForm.tsx",
            children: "Change Station"
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", "data-id": "e3b0gpvp9", "data-path": "src/pages/Vendors/VendorForm.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "8yqmc129j", "data-path": "src/pages/Vendors/VendorForm.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "vendor_name", "data-id": "vobse7vlx", "data-path": "src/pages/Vendors/VendorForm.tsx", children: "Vendor Name *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "vendor_name",
              value: formData.vendor_name,
              onChange: (e) => handleInputChange("vendor_name", e.target.value),
              placeholder: "Enter vendor company name",
              required: true,
              "data-id": "isf47otkl",
              "data-path": "src/pages/Vendors/VendorForm.tsx"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "ed3s2hg8o", "data-path": "src/pages/Vendors/VendorForm.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "contact_person", "data-id": "baabf5xru", "data-path": "src/pages/Vendors/VendorForm.tsx", children: "Contact Person *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "contact_person",
              value: formData.contact_person,
              onChange: (e) => handleInputChange("contact_person", e.target.value),
              placeholder: "Enter primary contact name",
              required: true,
              "data-id": "pa2962rko",
              "data-path": "src/pages/Vendors/VendorForm.tsx"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "zo1ejfl08", "data-path": "src/pages/Vendors/VendorForm.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "email", "data-id": "o6iftxzhh", "data-path": "src/pages/Vendors/VendorForm.tsx", children: "Email Address" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "email",
              type: "email",
              value: formData.email,
              onChange: (e) => handleInputChange("email", e.target.value),
              placeholder: "Enter email address",
              "data-id": "658lw18im",
              "data-path": "src/pages/Vendors/VendorForm.tsx"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "8zj8o3cig", "data-path": "src/pages/Vendors/VendorForm.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "phone", "data-id": "gol5ruinf", "data-path": "src/pages/Vendors/VendorForm.tsx", children: "Phone Number" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "phone",
              value: formData.phone,
              onChange: (e) => handleInputChange("phone", e.target.value),
              placeholder: "Enter phone number",
              "data-id": "e2svn4reb",
              "data-path": "src/pages/Vendors/VendorForm.tsx"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "gcl8n0cya", "data-path": "src/pages/Vendors/VendorForm.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "category", "data-id": "iee7yf4uc", "data-path": "src/pages/Vendors/VendorForm.tsx", children: "Category *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: formData.category, onValueChange: (value) => handleInputChange("category", value), "data-id": "dpk05vaoq", "data-path": "src/pages/Vendors/VendorForm.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-id": "xnz7lc8sb", "data-path": "src/pages/Vendors/VendorForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select vendor category", "data-id": "kl1ptz7ih", "data-path": "src/pages/Vendors/VendorForm.tsx" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { "data-id": "p6de13mta", "data-path": "src/pages/Vendors/VendorForm.tsx", children: categories.map(
              (category) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: category, "data-id": "kz349t2q3", "data-path": "src/pages/Vendors/VendorForm.tsx", children: category }, category)
            ) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "x4hvgsrqj", "data-path": "src/pages/Vendors/VendorForm.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "payment_terms", "data-id": "qflhxi9dw", "data-path": "src/pages/Vendors/VendorForm.tsx", children: "Payment Terms" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: formData.payment_terms, onValueChange: (value) => handleInputChange("payment_terms", value), "data-id": "nyv09ifgq", "data-path": "src/pages/Vendors/VendorForm.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-id": "wfbk3ktue", "data-path": "src/pages/Vendors/VendorForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select payment terms", "data-id": "kpn4p993i", "data-path": "src/pages/Vendors/VendorForm.tsx" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { "data-id": "5qtd6ipbp", "data-path": "src/pages/Vendors/VendorForm.tsx", children: paymentTermsOptions.map(
              (terms) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: terms, "data-id": "5lldzxc60", "data-path": "src/pages/Vendors/VendorForm.tsx", children: terms }, terms)
            ) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "3td80c7pn", "data-path": "src/pages/Vendors/VendorForm.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "address", "data-id": "mx6j44ifg", "data-path": "src/pages/Vendors/VendorForm.tsx", children: "Address" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Textarea,
          {
            id: "address",
            value: formData.address,
            onChange: (e) => handleInputChange("address", e.target.value),
            placeholder: "Enter full business address",
            rows: 3,
            "data-id": "8yvhuyrxe",
            "data-path": "src/pages/Vendors/VendorForm.tsx"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-id": "b4ei1lhzc", "data-path": "src/pages/Vendors/VendorForm.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "is_active", "data-id": "xrmb0876n", "data-path": "src/pages/Vendors/VendorForm.tsx", children: "Active Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", "data-id": "qb3heg9iv", "data-path": "src/pages/Vendors/VendorForm.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Switch,
            {
              id: "is_active",
              checked: formData.is_active,
              onCheckedChange: (checked) => handleInputChange("is_active", checked),
              "data-id": "1bb7t3tbd",
              "data-path": "src/pages/Vendors/VendorForm.tsx"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-gray-600", "data-id": "s0ef3kxp4", "data-path": "src/pages/Vendors/VendorForm.tsx", children: formData.is_active ? "Active vendor" : "Inactive vendor" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end space-x-4", "data-id": "mdj8qi9uy", "data-path": "src/pages/Vendors/VendorForm.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            onClick: () => navigate("/vendors"),
            "data-id": "8cc83c10p",
            "data-path": "src/pages/Vendors/VendorForm.tsx",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: loading, "data-id": "owev6r2tt", "data-path": "src/pages/Vendors/VendorForm.tsx", children: loading ? "Saving..." : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-4 h-4 mr-2", "data-id": "1mkpbhdp1", "data-path": "src/pages/Vendors/VendorForm.tsx" }),
          isEditing ? "Update Vendor" : "Create Vendor"
        ] }) })
      ] })
    ] }) })
  ] }) });
};
export {
  VendorForm as default
};
