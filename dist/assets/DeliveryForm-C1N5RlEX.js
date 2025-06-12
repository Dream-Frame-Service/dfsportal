import { u as useNavigate, a as useParams, r as reactExports, j as jsxRuntimeExports } from "./react-vendor-DX0Gaxph.js";
import { u as useToast, s as supabase, B as Button, C as Card, d as CardHeader, e as CardTitle, g as CardContent, L as Label, I as Input, S as Select, h as SelectTrigger, i as SelectValue, j as SelectContent, k as SelectItem, O as Textarea } from "./admin-core-DFYqoWCM.js";
import { N as NumberInput } from "./business-pages-DR8LlJyO.js";
import { J as ArrowLeft, ay as Truck, H as TriangleAlert, a0 as CircleCheckBig, ab as CircleX, aG as Save } from "./ui-components-E8Qujiw2.js";
import "./vendor-ChWeSoXy.js";
import "./aws-sdk-DF6-bWA6.js";
import "./supabase-DWlqU2OS.js";
import "./admin-security-CWSw-PzD.js";
import "./animations-DEJKylty.js";
const DeliveryForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [loading, setLoading] = reactExports.useState(false);
  const [formData, setFormData] = reactExports.useState({
    delivery_date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    bol_number: "",
    station: "",
    regular_tank_volume: 0,
    plus_tank_volume: 0,
    super_tank_volume: 0,
    regular_delivered: 0,
    plus_delivered: 0,
    super_delivered: 0,
    delivery_notes: "",
    created_by: 1
    // This should be set from auth context
  });
  const [afterDeliveryData, setAfterDeliveryData] = reactExports.useState({
    regular_tank_final: 0,
    plus_tank_final: 0,
    super_tank_final: 0
  });
  const [discrepancyData, setDiscrepancyData] = reactExports.useState({
    regular_expected: 0,
    plus_expected: 0,
    super_expected: 0,
    regular_discrepancy: 0,
    plus_discrepancy: 0,
    super_discrepancy: 0,
    has_discrepancy: false
  });
  const stations = ["MOBIL", "AMOCO ROSEDALE", "AMOCO BROOKLYN"];
  reactExports.useEffect(() => {
    const regular_expected = formData.regular_tank_volume + formData.regular_delivered;
    const plus_expected = formData.plus_tank_volume + formData.plus_delivered;
    const super_expected = formData.super_tank_volume + formData.super_delivered;
    const regular_discrepancy = afterDeliveryData.regular_tank_final - regular_expected;
    const plus_discrepancy = afterDeliveryData.plus_tank_final - plus_expected;
    const super_discrepancy = afterDeliveryData.super_tank_final - super_expected;
    const tolerance = 5;
    const has_discrepancy = Math.abs(regular_discrepancy) > tolerance || Math.abs(plus_discrepancy) > tolerance || Math.abs(super_discrepancy) > tolerance;
    setDiscrepancyData({
      regular_expected,
      plus_expected,
      super_expected,
      regular_discrepancy,
      plus_discrepancy,
      super_discrepancy,
      has_discrepancy
    });
  }, [formData, afterDeliveryData.regular_tank_final, afterDeliveryData.plus_tank_final, afterDeliveryData.super_tank_final]);
  reactExports.useEffect(() => {
    if (id) {
      loadDeliveryRecord();
    }
  }, [id]);
  const loadAfterDeliveryReport = async (deliveryId) => {
    try {
      const { data, error } = await supabase.from("delivery_reports").select("*").eq("delivery_record_id", deliveryId).limit(1).single();
      if (error && error.code !== "PGRST116") throw error;
      if (data) {
        setAfterDeliveryData({
          regular_tank_final: data.regular_tank_final || 0,
          plus_tank_final: data.plus_tank_final || 0,
          super_tank_final: data.super_tank_final || 0
        });
      }
    } catch (error) {
      console.error("Error loading after delivery report:", error);
    }
  };
  const loadDeliveryRecord = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("delivery_records").select("*").eq("id", parseInt(id)).single();
      if (error) throw error;
      if (data) {
        setFormData({
          ...data,
          delivery_date: data.delivery_date ? new Date(data.delivery_date).toISOString().split("T")[0] : ""
        });
        loadAfterDeliveryReport(parseInt(id));
      }
    } catch (error) {
      console.error("Error loading delivery record:", error);
      toast({
        title: "Error",
        description: "Failed to load delivery record",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.station || !formData.delivery_date || !formData.bol_number) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields (Date, BOL Number, and Station)",
        variant: "destructive"
      });
      return;
    }
    try {
      setLoading(true);
      const submitData = {
        ...formData,
        delivery_date: new Date(formData.delivery_date).toISOString()
      };
      let deliveryRecordId;
      if (id) {
        const { error } = await supabase.from("delivery_records").update(submitData).eq("id", parseInt(id));
        if (error) throw error;
        deliveryRecordId = parseInt(id);
        toast({
          title: "Success",
          description: "Delivery record updated successfully"
        });
      } else {
        const { data, error } = await supabase.from("delivery_records").insert(submitData).select().single();
        if (error) throw error;
        deliveryRecordId = data.id;
        toast({
          title: "Success",
          description: "Delivery record created successfully"
        });
      }
      if (afterDeliveryData.regular_tank_final > 0 || afterDeliveryData.plus_tank_final > 0 || afterDeliveryData.super_tank_final > 0) {
        const afterDeliverySubmitData = {
          report_date: (/* @__PURE__ */ new Date()).toISOString(),
          station: formData.station,
          delivery_record_id: deliveryRecordId,
          bol_number: formData.bol_number,
          regular_tank_final: afterDeliveryData.regular_tank_final,
          plus_tank_final: afterDeliveryData.plus_tank_final,
          super_tank_final: afterDeliveryData.super_tank_final,
          created_by: formData.created_by
        };
        const { data: existingReport } = await supabase.from("delivery_reports").select("*").eq("delivery_record_id", deliveryRecordId).limit(1).single();
        if (existingReport && !existingReport.error) {
          const { error: afterError } = await supabase.from("delivery_reports").update(afterDeliverySubmitData).eq("id", existingReport.id);
          if (afterError) throw afterError;
        } else {
          const { error: afterError } = await supabase.from("delivery_reports").insert(afterDeliverySubmitData);
          if (afterError) throw afterError;
        }
      }
      navigate("/delivery");
    } catch (error) {
      console.error("Error saving delivery record:", error);
      toast({
        title: "Error",
        description: "Failed to save delivery record",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };
  const handleAfterDeliveryChange = (field, value) => {
    setAfterDeliveryData((prev) => ({
      ...prev,
      [field]: value
    }));
  };
  if (loading && id) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center min-h-screen", "data-id": "qjiwphgcr", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", "data-id": "yy6msmwmn", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto", "data-id": "3uvnof8g2", "data-path": "src/pages/Delivery/DeliveryForm.tsx" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-gray-600", "data-id": "nnq7nk5k1", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: "Loading delivery record..." })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 py-6", "data-id": "ym5o74tcw", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", "data-id": "9rgdr49h9", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          onClick: () => navigate("/delivery"),
          variant: "ghost",
          className: "mb-4",
          "data-id": "qbmayvtjs",
          "data-path": "src/pages/Delivery/DeliveryForm.tsx",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "mr-2 h-4 w-4", "data-id": "elnuhue8v", "data-path": "src/pages/Delivery/DeliveryForm.tsx" }),
            "Back to Delivery List"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", "data-id": "9937epgce", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "h-6 w-6 text-blue-600", "data-id": "j4w9ijmun", "data-path": "src/pages/Delivery/DeliveryForm.tsx" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-gray-900", "data-id": "dybwek1o6", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: id ? "Edit Delivery Record" : "New Delivery Record" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", "data-id": "vaaokxrhj", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "5hn17sb0r", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "z31tu53a5", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { "data-id": "43q1a7ugi", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: "Delivery Information" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-4", "data-id": "rejwi35tl", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", "data-id": "17rsy954y", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "iwzjvn6yz", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "delivery_date", "data-id": "hgylcxigw", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: "Delivery Date *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "delivery_date",
                type: "date",
                value: formData.delivery_date,
                onChange: (e) => handleInputChange("delivery_date", e.target.value),
                required: true,
                "data-id": "9nduj3nd0",
                "data-path": "src/pages/Delivery/DeliveryForm.tsx"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "4yvswfg23", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "bol_number", "data-id": "3gk8z4vil", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: "BOL Number *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "bol_number",
                type: "text",
                placeholder: "Enter BOL Number",
                value: formData.bol_number,
                onChange: (e) => handleInputChange("bol_number", e.target.value),
                required: true,
                "data-id": "5gapk0z7l",
                "data-path": "src/pages/Delivery/DeliveryForm.tsx"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "mkkga0ae0", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "station", "data-id": "801u01hof", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: "Station *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: formData.station,
                onValueChange: (value) => handleInputChange("station", value),
                "data-id": "rteafyt3u",
                "data-path": "src/pages/Delivery/DeliveryForm.tsx",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-id": "d6k604lze", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select station", "data-id": "mve9mlk0y", "data-path": "src/pages/Delivery/DeliveryForm.tsx" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { "data-id": "ql5td0w3e", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: stations.map(
                    (station) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: station, "data-id": "qg69ci9um", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: station }, station)
                  ) })
                ]
              }
            )
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "op7bb5pb4", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "trpjp55pm", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { "data-id": "v4d5snxev", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: "Before Delivery Tank Report" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-4", "data-id": "t14znqdm1", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", "data-id": "r0pbe565d", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "xs0dvjg68", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "regular_tank_volume", "data-id": "03e3pht51", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: "Regular Tank Volume (Gallons)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              NumberInput,
              {
                id: "regular_tank_volume",
                step: "0.01",
                value: formData.regular_tank_volume,
                onChange: (value) => handleInputChange("regular_tank_volume", value),
                "data-id": "i1nth2xoz",
                "data-path": "src/pages/Delivery/DeliveryForm.tsx"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "poi77v7n6", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "plus_tank_volume", "data-id": "jqydd9oaw", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: "Plus Tank Volume (Gallons)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              NumberInput,
              {
                id: "plus_tank_volume",
                step: "0.01",
                value: formData.plus_tank_volume,
                onChange: (value) => handleInputChange("plus_tank_volume", value),
                "data-id": "hn1nx5l7p",
                "data-path": "src/pages/Delivery/DeliveryForm.tsx"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "595a8w7e2", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "super_tank_volume", "data-id": "rdnuw40qp", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: "Super Tank Volume (Gallons)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              NumberInput,
              {
                id: "super_tank_volume",
                step: "0.01",
                value: formData.super_tank_volume,
                onChange: (value) => handleInputChange("super_tank_volume", value),
                "data-id": "85ffhifvy",
                "data-path": "src/pages/Delivery/DeliveryForm.tsx"
              }
            )
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "mp30tpj9l", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "4gpy1a6hv", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { "data-id": "xw6h17w57", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: "Delivery Amounts" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-4", "data-id": "g58qqou7s", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", "data-id": "z5m3a1dk3", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "fk66ebw4k", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "regular_delivered", "data-id": "fkoiyikf3", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: "Regular Delivered (Gallons)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              NumberInput,
              {
                id: "regular_delivered",
                step: "0.01",
                value: formData.regular_delivered,
                onChange: (value) => handleInputChange("regular_delivered", value),
                "data-id": "vxyqbaikb",
                "data-path": "src/pages/Delivery/DeliveryForm.tsx"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "mjl65njxr", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "plus_delivered", "data-id": "tyqscjhca", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: "Plus Delivered (Gallons)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              NumberInput,
              {
                id: "plus_delivered",
                step: "0.01",
                value: formData.plus_delivered,
                onChange: (value) => handleInputChange("plus_delivered", value),
                "data-id": "g9rw8yyt8",
                "data-path": "src/pages/Delivery/DeliveryForm.tsx"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "r3p1hcarz", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "super_delivered", "data-id": "dl4jqgr0h", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: "Super Delivered (Gallons)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              NumberInput,
              {
                id: "super_delivered",
                step: "0.01",
                value: formData.super_delivered,
                onChange: (value) => handleInputChange("super_delivered", value),
                "data-id": "htytyfg19",
                "data-path": "src/pages/Delivery/DeliveryForm.tsx"
              }
            )
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "2t2w5uvry", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "2dom57icc", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { "data-id": "dnnfqiyq8", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: "After Delivery Tank Report" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-4", "data-id": "wmksflvnl", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", "data-id": "vk0m13sy7", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "fj4irpalc", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "regular_tank_final", "data-id": "bgq6o4amm", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: "Regular Tank Final (Gallons)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              NumberInput,
              {
                id: "regular_tank_final",
                step: "0.01",
                value: afterDeliveryData.regular_tank_final,
                onChange: (value) => handleAfterDeliveryChange("regular_tank_final", value),
                "data-id": "8ln60m07e",
                "data-path": "src/pages/Delivery/DeliveryForm.tsx"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "lxvkdfxzf", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "plus_tank_final", "data-id": "edf6327p0", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: "Plus Tank Final (Gallons)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              NumberInput,
              {
                id: "plus_tank_final",
                step: "0.01",
                value: afterDeliveryData.plus_tank_final,
                onChange: (value) => handleAfterDeliveryChange("plus_tank_final", value),
                "data-id": "alo38gtg6",
                "data-path": "src/pages/Delivery/DeliveryForm.tsx"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "zvc6r0mop", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "super_tank_final", "data-id": "fpihlk8oz", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: "Super Tank Final (Gallons)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              NumberInput,
              {
                id: "super_tank_final",
                step: "0.01",
                value: afterDeliveryData.super_tank_final,
                onChange: (value) => handleAfterDeliveryChange("super_tank_final", value),
                "data-id": "pl0fp5ikz",
                "data-path": "src/pages/Delivery/DeliveryForm.tsx"
              }
            )
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "xiiafec68", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "fq5lemo6w", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", "data-id": "sa6ek0ww9", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: [
          discrepancyData.has_discrepancy ? /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-5 w-5 text-red-500", "data-id": "qxdx77fn4", "data-path": "src/pages/Delivery/DeliveryForm.tsx" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-5 w-5 text-green-500", "data-id": "4c89ui7au", "data-path": "src/pages/Delivery/DeliveryForm.tsx" }),
          "Discrepancy Analysis"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", "data-id": "dojkbcuud", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: [
          discrepancyData.has_discrepancy && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-red-50 border border-red-200 rounded-lg p-4 mb-4", "data-id": "3u2ricbx7", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", "data-id": "otq7cfyud", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-4 w-4 text-red-500", "data-id": "v6dk3omyt", "data-path": "src/pages/Delivery/DeliveryForm.tsx" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-red-800", "data-id": "yh1es487h", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: "Discrepancies Detected" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-red-700 text-sm", "data-id": "h5npba40b", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: "One or more tank levels show discrepancies greater than 5 gallons. Please review and verify the measurements." })
          ] }),
          !discrepancyData.has_discrepancy && (afterDeliveryData.regular_tank_final > 0 || afterDeliveryData.plus_tank_final > 0 || afterDeliveryData.super_tank_final > 0) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-green-50 border border-green-200 rounded-lg p-4 mb-4", "data-id": "cjab8442c", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", "data-id": "8m8b3hk9o", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-4 w-4 text-green-500", "data-id": "fxna4rdwe", "data-path": "src/pages/Delivery/DeliveryForm.tsx" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-green-800", "data-id": "72njc03sn", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: "All Measurements Verified" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-green-700 text-sm", "data-id": "59p9671fx", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: "Tank levels are within acceptable tolerance limits (±5 gallons)." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", "data-id": "w4j2x80fh", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "k6ldqsoxl", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-medium text-gray-700 mb-2", "data-id": "j6yyznhfy", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: "Regular Gas" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 text-sm", "data-id": "9uytim88z", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", "data-id": "ugmo6xxpm", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "5zkw9dxub", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: "Before + Delivered:" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { "data-id": "s0bnjbv98", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: [
                    discrepancyData.regular_expected.toFixed(2),
                    " gal"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", "data-id": "qhx81fxr1", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "o2l6a22oq", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: "After Delivery:" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { "data-id": "1yc3msjx9", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: [
                    afterDeliveryData.regular_tank_final.toFixed(2),
                    " gal"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex justify-between font-medium ${Math.abs(discrepancyData.regular_discrepancy) > 5 ? "text-red-600" : "text-green-600"}`, "data-id": "qm2pgtzg0", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "0weux64ns", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: "Difference:" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { "data-id": "nkuyvt2hs", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: [
                    discrepancyData.regular_discrepancy >= 0 ? "+" : "",
                    discrepancyData.regular_discrepancy.toFixed(2),
                    " gal"
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "iract17bu", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-medium text-gray-700 mb-2", "data-id": "ctal6jpxy", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: "Plus Gas" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 text-sm", "data-id": "dkyp2xiih", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", "data-id": "gqbzb2gtg", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "6z5rcx5jl", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: "Before + Delivered:" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { "data-id": "qi7wt0yb7", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: [
                    discrepancyData.plus_expected.toFixed(2),
                    " gal"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", "data-id": "uavwum8ya", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "gov5iwnix", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: "After Delivery:" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { "data-id": "uk8axkosf", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: [
                    afterDeliveryData.plus_tank_final.toFixed(2),
                    " gal"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex justify-between font-medium ${Math.abs(discrepancyData.plus_discrepancy) > 5 ? "text-red-600" : "text-green-600"}`, "data-id": "f2lkhi9h9", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "wq93r8lu8", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: "Difference:" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { "data-id": "9zczfwrym", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: [
                    discrepancyData.plus_discrepancy >= 0 ? "+" : "",
                    discrepancyData.plus_discrepancy.toFixed(2),
                    " gal"
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "dy2nutplb", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-medium text-gray-700 mb-2", "data-id": "2db450zsy", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: "Super Gas" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 text-sm", "data-id": "2jpx59jr8", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", "data-id": "hl2sabzbg", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "dga9xjobo", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: "Before + Delivered:" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { "data-id": "36xtg8ang", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: [
                    discrepancyData.super_expected.toFixed(2),
                    " gal"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", "data-id": "lga78czeg", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "fgqpdsomk", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: "After Delivery:" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { "data-id": "0jqznt5ua", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: [
                    afterDeliveryData.super_tank_final.toFixed(2),
                    " gal"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex justify-between font-medium ${Math.abs(discrepancyData.super_discrepancy) > 5 ? "text-red-600" : "text-green-600"}`, "data-id": "h88rfyrax", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "53exz4vvn", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: "Difference:" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { "data-id": "ren3bnvn7", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: [
                    discrepancyData.super_discrepancy >= 0 ? "+" : "",
                    discrepancyData.super_discrepancy.toFixed(2),
                    " gal"
                  ] })
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gray-50 rounded-lg p-3", "data-id": "l0zwex5dh", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-gray-600", "data-id": "f2oric7r7", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { "data-id": "qd9rtx5w1", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: "Note:" }),
            " Acceptable tolerance is ±5 gallons. Differences outside this range should be investigated and documented."
          ] }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "1ek6h4brb", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "xm00rjrzk", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { "data-id": "ikbkkxyaj", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: "Additional Notes" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { "data-id": "lrjgpng6d", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "5yjifyhh2", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "delivery_notes", "data-id": "5a764weme", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: "Delivery Notes" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              id: "delivery_notes",
              value: formData.delivery_notes,
              onChange: (e) => handleInputChange("delivery_notes", e.target.value),
              placeholder: "Enter any additional notes about the delivery...",
              rows: 3,
              "data-id": "wbdbppkor",
              "data-path": "src/pages/Delivery/DeliveryForm.tsx"
            }
          )
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end space-x-4", "data-id": "mqle8lu1y", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            onClick: () => navigate("/delivery"),
            "data-id": "xhps5us75",
            "data-path": "src/pages/Delivery/DeliveryForm.tsx",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", disabled: loading, "data-id": "sbzo96lrw", "data-path": "src/pages/Delivery/DeliveryForm.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "mr-2 h-4 w-4", "data-id": "wukcr18wa", "data-path": "src/pages/Delivery/DeliveryForm.tsx" }),
          loading ? "Saving..." : "Save Delivery Record"
        ] })
      ] })
    ] })
  ] });
};
export {
  DeliveryForm as default
};
