import { j as jsxRuntimeExports, r as reactExports, u as useNavigate } from "./react-vendor-DX0Gaxph.js";
import { D as Dialog, t as DialogContent, v as DialogHeader, w as DialogTitle, B as Button, C as Card, d as CardHeader, e as CardTitle, l as Badge, g as CardContent, Y as Separator, Z as DialogFooter, s as supabase, y as useAuth, K as toast, f as CardDescription, I as Input, z as Table, E as TableHeader, F as TableRow, G as TableHead, H as TableBody, J as TableCell, x as DialogDescription } from "./admin-core-CknIDYcP.js";
import { F as Shield, aM as Printer, a4 as FileText, aL as Calendar, X, a0 as CircleCheckBig, H as TriangleAlert, aK as Archive, bm as Send, Q as MessageSquare, aC as Plus, a1 as Search, an as SquarePen, ao as Trash2 } from "./ui-components-svEX1DXz.js";
import { s as smsService } from "./admin-security-BkHZEmpQ.js";
import "./vendor-ChWeSoXy.js";
import "./aws-sdk-DF6-bWA6.js";
import "./supabase-DWlqU2OS.js";
const EnhancedLicensePrintDialog = ({ license, isOpen, onClose }) => {
  if (!license) return null;
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };
  const formatDateShort = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };
  const getStatusInfo = (status, expiryDate) => {
    const today = /* @__PURE__ */ new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1e3 * 3600 * 24));
    switch (status.toLowerCase()) {
      case "active":
        if (daysUntilExpiry <= 30) {
          return {
            color: "text-yellow-600",
            bgColor: "bg-yellow-50",
            borderColor: "border-yellow-200",
            icon: "⚠️",
            message: `Expires in ${daysUntilExpiry} days - Renewal Required Soon`
          };
        } else if (daysUntilExpiry <= 90) {
          return {
            color: "text-blue-600",
            bgColor: "bg-blue-50",
            borderColor: "border-blue-200",
            icon: "📅",
            message: `Expires in ${daysUntilExpiry} days - Plan Renewal`
          };
        }
        return {
          color: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          icon: "✅",
          message: "Active and Valid"
        };
      case "expired":
        return {
          color: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          icon: "❌",
          message: `Expired ${Math.abs(daysUntilExpiry)} days ago - Immediate Action Required`
        };
      case "pending renewal":
        return {
          color: "text-yellow-600",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
          icon: "⏳",
          message: "Renewal in Progress"
        };
      default:
        return {
          color: "text-gray-600",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
          icon: "❓",
          message: "Status Unknown"
        };
    }
  };
  const getCategoryInfo = (category) => {
    const categoryMap = {
      "Business": { icon: "🏢", description: "General business operations license" },
      "Environmental": { icon: "🌱", description: "Environmental compliance and permits" },
      "Safety": { icon: "🦺", description: "Safety regulations and protocols" },
      "Health": { icon: "🏥", description: "Public health requirements" },
      "Fire": { icon: "🔥", description: "Fire safety and prevention" },
      "Building": { icon: "🏗️", description: "Construction and building permits" }
    };
    return categoryMap[category] || { icon: "📄", description: "License certification" };
  };
  const getStationInfo = (station) => {
    const stationMap = {
      "MOBIL": { color: "bg-red-500", description: "Mobil Gas Station" },
      "AMOCO ROSEDALE": { color: "bg-blue-500", description: "Amoco Rosedale Station" },
      "AMOCO BROOKLYN": { color: "bg-green-500", description: "Amoco Brooklyn Station" },
      "ALL": { color: "bg-gray-500", description: "All Station Locations" }
    };
    return stationMap[station] || { color: "bg-gray-500", description: station };
  };
  const statusInfo = getStatusInfo(license.status, license.expiry_date);
  const categoryInfo = getCategoryInfo(license.category);
  const stationInfo = getStationInfo(license.station);
  const handlePrint = () => {
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>License Certificate - ${license.license_name}</title>
          <style>
            @page {
              size: A4;
              margin: 0.5in;
            }
            body {
              font-family: 'Arial', sans-serif;
              margin: 0;
              padding: 0;
              color: #333;
              line-height: 1.5;
            }
            .certificate-header {
              text-align: center;
              margin-bottom: 40px;
              border: 3px solid #2563eb;
              padding: 30px;
              border-radius: 15px;
              background: linear-gradient(135deg, #f8fafc, #e2e8f0);
            }
            .company-logo {
              font-size: 32px;
              font-weight: bold;
              color: #1e40af;
              margin-bottom: 10px;
            }
            .certificate-title {
              font-size: 24px;
              color: #374151;
              margin-bottom: 15px;
              text-transform: uppercase;
              letter-spacing: 2px;
            }
            .certificate-subtitle {
              font-size: 16px;
              color: #6b7280;
              font-style: italic;
            }
            .license-info {
              background: white;
              border: 2px solid #e5e7eb;
              border-radius: 10px;
              padding: 30px;
              margin: 30px 0;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .license-name {
              font-size: 28px;
              font-weight: bold;
              text-align: center;
              color: #1f2937;
              margin-bottom: 20px;
              padding: 15px;
              background: #f3f4f6;
              border-radius: 8px;
            }
            .info-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 20px;
              margin: 25px 0;
            }
            .info-item {
              padding: 15px;
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              background: #fafafa;
            }
            .info-label {
              font-size: 12px;
              color: #6b7280;
              text-transform: uppercase;
              font-weight: 600;
              margin-bottom: 8px;
            }
            .info-value {
              font-size: 16px;
              font-weight: bold;
              color: #1f2937;
            }
            .status-section {
              background: ${statusInfo.bgColor};
              border: 2px solid ${statusInfo.borderColor.replace("border-", "")};
              border-radius: 10px;
              padding: 20px;
              margin: 25px 0;
              text-align: center;
            }
            .status-icon {
              font-size: 48px;
              margin-bottom: 10px;
            }
            .status-message {
              font-size: 18px;
              font-weight: bold;
              color: ${statusInfo.color.replace("text-", "")};
              margin-bottom: 10px;
            }
            .dates-section {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 20px;
              margin: 25px 0;
            }
            .date-card {
              text-align: center;
              padding: 20px;
              border: 2px solid #e5e7eb;
              border-radius: 10px;
              background: white;
            }
            .date-label {
              font-size: 14px;
              color: #6b7280;
              text-transform: uppercase;
              font-weight: 600;
              margin-bottom: 10px;
            }
            .date-value {
              font-size: 18px;
              font-weight: bold;
              color: #1f2937;
            }
            .authority-section {
              background: #f0f9ff;
              border: 2px solid #0ea5e9;
              border-radius: 10px;
              padding: 20px;
              margin: 25px 0;
            }
            .category-badge {
              display: inline-block;
              padding: 8px 16px;
              border-radius: 20px;
              font-size: 14px;
              font-weight: 600;
              margin: 5px;
            }
            .station-badge {
              background: ${stationInfo.color};
              color: white;
            }
            .category-business { background: #dbeafe; color: #1e40af; }
            .category-environmental { background: #dcfce7; color: #166534; }
            .category-safety { background: #fed7aa; color: #c2410c; }
            .category-health { background: #e9d5ff; color: #7c2d12; }
            .category-fire { background: #fecaca; color: #dc2626; }
            .category-building { background: #f3f4f6; color: #374151; }
            .footer {
              margin-top: 50px;
              text-align: center;
              font-size: 12px;
              color: #6b7280;
              border-top: 2px solid #e5e7eb;
              padding-top: 30px;
            }
            .official-seal {
              position: absolute;
              top: 20px;
              right: 20px;
              width: 80px;
              height: 80px;
              border: 3px solid #2563eb;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              background: white;
              font-size: 10px;
              text-align: center;
              font-weight: bold;
              color: #2563eb;
            }
            .watermark {
              position: fixed;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%) rotate(-45deg);
              font-size: 120px;
              color: rgba(37, 99, 235, 0.05);
              font-weight: bold;
              z-index: -1;
              pointer-events: none;
            }
            @media print {
              body { font-size: 11pt; }
            }
          </style>
        </head>
        <body>
          <div class="watermark">OFFICIAL</div>
          <div class="official-seal">
            DFS<br>OFFICIAL<br>SEAL
          </div>

          <div class="certificate-header">
            <div class="company-logo">DFS Manager Portal</div>
            <div class="certificate-title">License & Certificate Record</div>
            <div class="certificate-subtitle">Official Documentation System</div>
          </div>

          <div class="license-info">
            <div class="license-name">${license.license_name}</div>
            
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">License Number</div>
                <div class="info-value" style="font-family: monospace; font-size: 18px;">${license.license_number}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Record ID</div>
                <div class="info-value">#${license.ID}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Category</div>
                <div class="info-value">
                  <span class="category-badge category-${license.category.toLowerCase()}">${categoryInfo.icon} ${license.category}</span>
                </div>
              </div>
              <div class="info-item">
                <div class="info-label">Station Coverage</div>
                <div class="info-value">
                  <span class="category-badge station-badge">${license.station}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="dates-section">
            <div class="date-card">
              <div class="date-label">📅 Issue Date</div>
              <div class="date-value">${formatDate(license.issue_date)}</div>
            </div>
            <div class="date-card">
              <div class="date-label">⏰ Expiry Date</div>
              <div class="date-value">${formatDate(license.expiry_date)}</div>
            </div>
          </div>

          <div class="status-section">
            <div class="status-icon">${statusInfo.icon}</div>
            <div class="status-message">${license.status.toUpperCase()}</div>
            <div style="font-size: 14px; color: #6b7280;">${statusInfo.message}</div>
          </div>

          <div class="authority-section">
            <div class="info-label">Issuing Authority</div>
            <div style="font-size: 20px; font-weight: bold; color: #0ea5e9; margin-top: 10px;">
              ${license.issuing_authority}
            </div>
            <div style="font-size: 14px; color: #6b7280; margin-top: 10px;">
              ${categoryInfo.description}
            </div>
          </div>

          <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 25px 0;">
            <div class="info-label">Document Information</div>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-top: 15px;">
              <div>
                <span style="font-size: 12px; color: #6b7280;">File Reference ID:</span><br>
                <span style="font-weight: bold;">${license.document_file_id || "Not Available"}</span>
              </div>
              <div>
                <span style="font-size: 12px; color: #6b7280;">Created by User:</span><br>
                <span style="font-weight: bold;">#${license.created_by}</span>
              </div>
            </div>
          </div>

          <div class="footer">
            <div style="font-weight: bold; margin-bottom: 10px;">
              This is an official license certificate document
            </div>
            <div>
              Generated on ${(/* @__PURE__ */ new Date()).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })}
            </div>
            <div style="margin-top: 15px; font-style: italic;">
              DFS Manager Portal - License Management System v2.0
            </div>
            <div style="margin-top: 10px; font-size: 10px;">
              This document is valid only when accompanied by the original license certificate.
              For verification, contact the issuing authority directly.
            </div>
          </div>
        </body>
      </html>
    `;
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: isOpen, onOpenChange: onClose, "data-id": "s0exazr4p", "data-path": "src/components/EnhancedLicensePrintDialog.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-4xl max-h-[95vh] overflow-y-auto", "data-id": "gn50485xh", "data-path": "src/components/EnhancedLicensePrintDialog.tsx", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { "data-id": "ojntp57qu", "data-path": "src/components/EnhancedLicensePrintDialog.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "53v2jzhve", "data-path": "src/components/EnhancedLicensePrintDialog.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2", "data-id": "0xdhhsi7e", "data-path": "src/components/EnhancedLicensePrintDialog.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-5 w-5 text-blue-600", "data-id": "umulnvsiu", "data-path": "src/components/EnhancedLicensePrintDialog.tsx" }),
        "Enhanced License Certificate - ",
        license.license_name
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          onClick: handlePrint,
          variant: "outline",
          size: "sm",
          className: "flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50",
          "data-id": "kn56xoj8l",
          "data-path": "src/components/EnhancedLicensePrintDialog.tsx",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "h-4 w-4", "data-id": "12e8dsugx", "data-path": "src/components/EnhancedLicensePrintDialog.tsx" }),
            "Print Certificate"
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-id": "ndqaf5jvx", "data-path": "src/components/EnhancedLicensePrintDialog.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200", "data-id": "ovbjj1g3l", "data-path": "src/components/EnhancedLicensePrintDialog.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "r5rslt1rw", "data-path": "src/components/EnhancedLicensePrintDialog.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", "data-id": "qvx9eiufz", "data-path": "src/components/EnhancedLicensePrintDialog.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-2xl text-blue-800 mb-2", "data-id": "93w5c852u", "data-path": "src/components/EnhancedLicensePrintDialog.tsx", children: license.license_name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-4", "data-id": "p22hfv600", "data-path": "src/components/EnhancedLicensePrintDialog.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: `${stationInfo.color} text-white`, "data-id": "zd2m3dmvr", "data-path": "src/components/EnhancedLicensePrintDialog.tsx", children: license.station }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-blue-600", "data-id": "mr1tm08em", "data-path": "src/components/EnhancedLicensePrintDialog.tsx", children: license.license_number })
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: `border-2 ${statusInfo.borderColor} ${statusInfo.bgColor}`, "data-id": "tjml8opcj", "data-path": "src/components/EnhancedLicensePrintDialog.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-6 text-center", "data-id": "sdzxmnga2", "data-path": "src/components/EnhancedLicensePrintDialog.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-4xl mb-2", "data-id": "w77bwe2y4", "data-path": "src/components/EnhancedLicensePrintDialog.tsx", children: statusInfo.icon }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-xl font-bold ${statusInfo.color} mb-2`, "data-id": "x11hbilp9", "data-path": "src/components/EnhancedLicensePrintDialog.tsx", children: license.status.toUpperCase() }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-gray-600", "data-id": "yu3tra3h8", "data-path": "src/components/EnhancedLicensePrintDialog.tsx", children: statusInfo.message })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", "data-id": "f1vhkdokh", "data-path": "src/components/EnhancedLicensePrintDialog.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "46ndicbon", "data-path": "src/components/EnhancedLicensePrintDialog.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "a92g4iyzc", "data-path": "src/components/EnhancedLicensePrintDialog.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm flex items-center gap-2", "data-id": "s419mvc9v", "data-path": "src/components/EnhancedLicensePrintDialog.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-4 w-4", "data-id": "ydguqliyt", "data-path": "src/components/EnhancedLicensePrintDialog.tsx" }),
            "License Details"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", "data-id": "njeezhgiy", "data-path": "src/components/EnhancedLicensePrintDialog.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "82alm4m41", "data-path": "src/components/EnhancedLicensePrintDialog.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-gray-600 uppercase font-medium", "data-id": "ctdircnt5", "data-path": "src/components/EnhancedLicensePrintDialog.tsx", children: "Category" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1", "data-id": "d1a0t1d2w", "data-path": "src/components/EnhancedLicensePrintDialog.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg", "data-id": "h3zdhxbky", "data-path": "src/components/EnhancedLicensePrintDialog.tsx", children: categoryInfo.icon }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "gci1aifng", "data-path": "src/components/EnhancedLicensePrintDialog.tsx", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", "data-id": "1plcu0rr1", "data-path": "src/components/EnhancedLicensePrintDialog.tsx", children: license.category }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-gray-500", "data-id": "f1reblv0j", "data-path": "src/components/EnhancedLicensePrintDialog.tsx", children: categoryInfo.description })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { "data-id": "bkjl46e0m", "data-path": "src/components/EnhancedLicensePrintDialog.tsx" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "k4oefa9yy", "data-path": "src/components/EnhancedLicensePrintDialog.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-gray-600 uppercase font-medium", "data-id": "d1hbr794h", "data-path": "src/components/EnhancedLicensePrintDialog.tsx", children: "Issuing Authority" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium mt-1", "data-id": "wuazurtzc", "data-path": "src/components/EnhancedLicensePrintDialog.tsx", children: license.issuing_authority })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "evufmseuk", "data-path": "src/components/EnhancedLicensePrintDialog.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-gray-600 uppercase font-medium", "data-id": "9mzyz07h5", "data-path": "src/components/EnhancedLicensePrintDialog.tsx", children: "Document File ID" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium mt-1", "data-id": "67tkyu3w8", "data-path": "src/components/EnhancedLicensePrintDialog.tsx", children: license.document_file_id || "Not Available" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "14az79k8t", "data-path": "src/components/EnhancedLicensePrintDialog.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "wuzbck0sn", "data-path": "src/components/EnhancedLicensePrintDialog.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm flex items-center gap-2", "data-id": "dj3bb2lqw", "data-path": "src/components/EnhancedLicensePrintDialog.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-4 w-4", "data-id": "fxb3exznm", "data-path": "src/components/EnhancedLicensePrintDialog.tsx" }),
            "Important Dates"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", "data-id": "57wiwk9vd", "data-path": "src/components/EnhancedLicensePrintDialog.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "c019bhbdh", "data-path": "src/components/EnhancedLicensePrintDialog.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-gray-600 uppercase font-medium", "data-id": "f9a9q7ztr", "data-path": "src/components/EnhancedLicensePrintDialog.tsx", children: "Issue Date" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium mt-1", "data-id": "l9bc0os68", "data-path": "src/components/EnhancedLicensePrintDialog.tsx", children: formatDate(license.issue_date) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { "data-id": "f32oc95e5", "data-path": "src/components/EnhancedLicensePrintDialog.tsx" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "nwa8rott5", "data-path": "src/components/EnhancedLicensePrintDialog.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-gray-600 uppercase font-medium", "data-id": "1bn1zvj6g", "data-path": "src/components/EnhancedLicensePrintDialog.tsx", children: "Expiry Date" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium mt-1", "data-id": "a4vtcc2h9", "data-path": "src/components/EnhancedLicensePrintDialog.tsx", children: formatDate(license.expiry_date) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { "data-id": "mfpqu1btt", "data-path": "src/components/EnhancedLicensePrintDialog.tsx" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "4p8tdsctx", "data-path": "src/components/EnhancedLicensePrintDialog.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-gray-600 uppercase font-medium", "data-id": "5kneeyjqp", "data-path": "src/components/EnhancedLicensePrintDialog.tsx", children: "Station Coverage" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1", "data-id": "rzgxlkw6s", "data-path": "src/components/EnhancedLicensePrintDialog.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: `${stationInfo.color} text-white`, "data-id": "5ao7v5xmb", "data-path": "src/components/EnhancedLicensePrintDialog.tsx", children: license.station }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-gray-500 mt-1", "data-id": "uxhmv4gz9", "data-path": "src/components/EnhancedLicensePrintDialog.tsx", children: stationInfo.description })
              ] })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "ab9hmnwqy", "data-path": "src/components/EnhancedLicensePrintDialog.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "5vrg32wah", "data-path": "src/components/EnhancedLicensePrintDialog.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm", "data-id": "h2rl1ht2e", "data-path": "src/components/EnhancedLicensePrintDialog.tsx", children: "System Information" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { "data-id": "nyusgezri", "data-path": "src/components/EnhancedLicensePrintDialog.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 text-sm", "data-id": "p8tzcbij0", "data-path": "src/components/EnhancedLicensePrintDialog.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", "data-id": "twcw3qd8t", "data-path": "src/components/EnhancedLicensePrintDialog.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-600", "data-id": "l9sikfxgy", "data-path": "src/components/EnhancedLicensePrintDialog.tsx", children: "Record ID:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium", "data-id": "q0rf34tb9", "data-path": "src/components/EnhancedLicensePrintDialog.tsx", children: [
              "#",
              license.ID
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", "data-id": "kfkp5rf0h", "data-path": "src/components/EnhancedLicensePrintDialog.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-600", "data-id": "bleimivet", "data-path": "src/components/EnhancedLicensePrintDialog.tsx", children: "Created by User:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium", "data-id": "obtfhrimq", "data-path": "src/components/EnhancedLicensePrintDialog.tsx", children: [
              "#",
              license.created_by
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", "data-id": "5ig9g94i9", "data-path": "src/components/EnhancedLicensePrintDialog.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-600", "data-id": "u4p305jo0", "data-path": "src/components/EnhancedLicensePrintDialog.tsx", children: "Document Generated:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", "data-id": "mf8cftrc7", "data-path": "src/components/EnhancedLicensePrintDialog.tsx", children: formatDateShort((/* @__PURE__ */ new Date()).toISOString()) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", "data-id": "opo3u2rf8", "data-path": "src/components/EnhancedLicensePrintDialog.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-600", "data-id": "xx8a23981", "data-path": "src/components/EnhancedLicensePrintDialog.tsx", children: "System Version:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", "data-id": "kv32uam1w", "data-path": "src/components/EnhancedLicensePrintDialog.tsx", children: "DFS Portal v2.0" })
          ] })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "flex justify-end space-x-2", "data-id": "37k7lybh1", "data-path": "src/components/EnhancedLicensePrintDialog.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: onClose, "data-id": "sgut48qoo", "data-path": "src/components/EnhancedLicensePrintDialog.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4 mr-2", "data-id": "x8hzlg7bt", "data-path": "src/components/EnhancedLicensePrintDialog.tsx" }),
        "Close"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: handlePrint, className: "bg-blue-600 hover:bg-blue-700", "data-id": "xad6fzgkb", "data-path": "src/components/EnhancedLicensePrintDialog.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "w-4 h-4 mr-2", "data-id": "f702uqf02", "data-path": "src/components/EnhancedLicensePrintDialog.tsx" }),
        "Print Certificate"
      ] })
    ] })
  ] }) });
};
class LicenseAlertService {
  /**
   * Check for licenses that need alerts and send SMS notifications
   */
  async checkAndSendAlerts() {
    try {
      console.log("🔍 Checking for licenses requiring alerts...");
      const { data: settingsData, error: settingsError } = await supabase.from("sms_alert_settings").select("*").eq("is_active", true).order("id", { ascending: false });
      if (settingsError) {
        console.error("Error loading SMS settings:", settingsError);
        return;
      }
      const settings = settingsData || [];
      if (settings.length === 0) {
        console.log("No active SMS alert settings found");
        return;
      }
      const { data: licensesData, error: licensesError } = await supabase.from("licenses_certificates").select("*").eq("status", "Active").order("expiry_date", { ascending: true }).limit(1e3);
      if (licensesError) {
        console.error("Error loading licenses:", licensesError);
        return;
      }
      const licenses = licensesData || [];
      console.log(`Found ${licenses.length} active licenses to check`);
      const { data: contactsData, error: contactsError } = await supabase.from("sms_alert_contacts").select("*").eq("is_active", true).order("id", { ascending: false });
      if (contactsError) {
        console.error("Error loading SMS contacts:", contactsError);
        return;
      }
      const contacts = contactsData || [];
      if (contacts.length === 0) {
        console.log("No active SMS contacts found");
        return;
      }
      const today = /* @__PURE__ */ new Date();
      let alertsSent = 0;
      for (const license of licenses) {
        const expiryDate = new Date(license.expiry_date);
        const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1e3 * 60 * 60 * 24));
        console.log(`📋 Checking license: ${license.license_name} (expires in ${daysUntilExpiry} days)`);
        for (const setting of settings) {
          if (daysUntilExpiry <= setting.days_before_expiry && daysUntilExpiry > 0) {
            const shouldSendAlert = await this.shouldSendAlert(
              license.id,
              setting.id,
              setting.alert_frequency_days
            );
            if (shouldSendAlert) {
              console.log(`⚠️ License ${license.license_name} needs alert (${daysUntilExpiry} days remaining)`);
              const relevantContacts = this.getRelevantContacts(contacts, license.station);
              for (const contact of relevantContacts) {
                await this.sendLicenseAlert(license, contact, setting, daysUntilExpiry);
                alertsSent++;
              }
            }
          }
        }
      }
      console.log(`✅ License alert check completed. ${alertsSent} alerts sent.`);
    } catch (error) {
      console.error("Error in license alert service:", error);
    }
  }
  /**
   * Check if we should send an alert based on frequency settings
   */
  async shouldSendAlert(licenseId, settingId, frequencyDays) {
    try {
      const { data, error } = await supabase.from("sms_alert_history").select("*").eq("license_id", licenseId).order("sent_date", { ascending: false }).limit(1);
      if (error) {
        console.error("Error checking alert history:", error);
        return true;
      }
      const history = data || [];
      if (history.length === 0) {
        return true;
      }
      const lastAlert = new Date(history[0].sent_date);
      const today = /* @__PURE__ */ new Date();
      const daysSinceLastAlert = Math.ceil((today.getTime() - lastAlert.getTime()) / (1e3 * 60 * 60 * 24));
      return daysSinceLastAlert >= frequencyDays;
    } catch (error) {
      console.error("Error checking alert frequency:", error);
      return true;
    }
  }
  /**
   * Get contacts relevant to a specific station
   */
  getRelevantContacts(contacts, station) {
    return contacts.filter(
      (contact) => contact.station === "ALL" || contact.station === station
    );
  }
  /**
   * Send SMS alert for a specific license
   */
  async sendLicenseAlert(license, contact, setting, daysUntilExpiry) {
    try {
      const message = this.createMessageFromTemplate(
        setting.message_template,
        license,
        daysUntilExpiry
      );
      console.log(`📱 Sending license alert to ${contact.contact_name} (${contact.mobile_number})`);
      const smsResult = await smsService.sendSMS({
        to: contact.mobile_number,
        message,
        type: "license_alert"
      });
      await supabase.from("sms_alert_history").insert({
        license_id: license.id,
        contact_id: contact.id,
        mobile_number: contact.mobile_number,
        message_content: message,
        sent_date: (/* @__PURE__ */ new Date()).toISOString(),
        delivery_status: smsResult.success ? "Sent" : `Failed - ${smsResult.error}`,
        days_before_expiry: daysUntilExpiry,
        created_by: 1
        // System generated
      });
      if (smsResult.success) {
        console.log(`✅ License alert sent successfully to ${contact.contact_name}`);
      } else {
        console.error(`❌ License alert failed to ${contact.contact_name}:`, smsResult.error);
      }
    } catch (error) {
      console.error(`Error sending license alert to ${contact.contact_name}:`, error);
    }
  }
  /**
   * Create SMS message from template
   */
  createMessageFromTemplate(template, license, daysUntilExpiry) {
    const expiryDate = new Date(license.expiry_date).toLocaleDateString();
    return template.replace(/{license_name}/g, license.license_name).replace(/{station}/g, license.station).replace(/{expiry_date}/g, expiryDate).replace(/{days_remaining}/g, daysUntilExpiry.toString()).replace(/{license_number}/g, license.license_number).replace(/{category}/g, license.category);
  }
  /**
   * Send immediate alert for a specific license (manual trigger)
   */
  async sendImmediateAlert(licenseId) {
    try {
      const { data: licenseData, error: licenseError } = await supabase.from("licenses_certificates").select("*").eq("id", licenseId).single();
      if (licenseError || !licenseData) {
        return { success: false, message: "License not found" };
      }
      const license = licenseData;
      const expiryDate = new Date(license.expiry_date);
      const today = /* @__PURE__ */ new Date();
      const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1e3 * 60 * 60 * 24));
      const { data: contactsData, error: contactsError } = await supabase.from("sms_alert_contacts").select("*").eq("is_active", true).order("id", { ascending: false });
      if (contactsError) {
        return { success: false, message: "Failed to load contacts" };
      }
      const contacts = contactsData || [];
      const relevantContacts = this.getRelevantContacts(contacts, license.station);
      if (relevantContacts.length === 0) {
        return { success: false, message: "No active contacts found for this station" };
      }
      const defaultTemplate = `🚨 URGENT: License '${license.license_name}' for ${license.station} expires in ${daysUntilExpiry} days (${expiryDate.toLocaleDateString()}). Please renew immediately!`;
      let successCount = 0;
      for (const contact of relevantContacts) {
        const smsResult = await smsService.sendSMS({
          to: contact.mobile_number,
          message: defaultTemplate,
          type: "immediate_alert"
        });
        await supabase.from("sms_alert_history").insert({
          license_id: license.id,
          // Use the actual ID field
          contact_id: contact.id,
          mobile_number: contact.mobile_number,
          message_content: defaultTemplate,
          sent_date: (/* @__PURE__ */ new Date()).toISOString(),
          delivery_status: smsResult.success ? "Sent" : `Failed - ${smsResult.error}`,
          days_before_expiry: daysUntilExpiry,
          created_by: 1
        });
        if (smsResult.success) {
          successCount++;
        }
      }
      return {
        success: successCount > 0,
        message: `Alert sent to ${successCount}/${relevantContacts.length} contacts`
      };
    } catch (error) {
      console.error("Error sending immediate alert:", error);
      return { success: false, message: "Failed to send alert" };
    }
  }
}
const licenseAlertService = new LicenseAlertService();
const LicenseList = () => {
  const [licenses, setLicenses] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [searchTerm, setSearchTerm] = reactExports.useState("");
  const [currentPage, setCurrentPage] = reactExports.useState(1);
  const [totalCount, setTotalCount] = reactExports.useState(0);
  const [selectedLicenseForPrint, setSelectedLicenseForPrint] = reactExports.useState(null);
  const [isPrintDialogOpen, setIsPrintDialogOpen] = reactExports.useState(false);
  const [sendingSMS, setSendingSMS] = reactExports.useState(false);
  const [deletingLicenseId, setDeletingLicenseId] = reactExports.useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = reactExports.useState(false);
  const [licenseToDelete, setLicenseToDelete] = reactExports.useState(null);
  const [showCancelled, setShowCancelled] = reactExports.useState(true);
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const pageSize = 10;
  reactExports.useEffect(() => {
    loadLicenses();
  }, [currentPage, searchTerm, showCancelled]);
  const loadLicenses = async () => {
    try {
      setLoading(true);
      let query = supabase.from("licenses_certificates").select("*", { count: "exact" }).order("expiry_date", { ascending: true });
      if (searchTerm) {
        query = query.ilike("license_name", `%${searchTerm}%`);
      }
      if (!showCancelled) {
        query = query.ilike("status", "%Active%");
      }
      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);
      const { data, error, count } = await query;
      if (error) throw error;
      setLicenses(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error("Error loading licenses:", error);
      toast({
        title: "Error",
        description: "Failed to load licenses",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const openDeleteDialog = (license) => {
    setLicenseToDelete(license);
    setDeleteDialogOpen(true);
  };
  const handleSoftDelete = async (licenseId) => {
    try {
      setDeletingLicenseId(licenseId);
      const { error } = await supabase.from("licenses_certificates").update({ status: "Cancelled" }).eq("ID", licenseId);
      if (error) throw error;
      toast({
        title: "✅ License Deactivated",
        description: "License has been marked as cancelled. It can be reactivated later if needed.",
        duration: 5e3
      });
      await loadLicenses();
    } catch (error) {
      console.error("Error deactivating license:", error);
      toast({
        title: "❌ Deactivation Failed",
        description: `Failed to deactivate license: ${error}`,
        variant: "destructive"
      });
    } finally {
      setDeletingLicenseId(null);
    }
  };
  const handleHardDelete = async (licenseId) => {
    setDeletingLicenseId(licenseId);
    try {
      const { data: licenseData, error: fetchError } = await supabase.from("licenses_certificates").select("*").eq("ID", licenseId).limit(1).single();
      if (fetchError) throw fetchError;
      const license = licenseData;
      if (!license) {
        throw new Error("License not found");
      }
      toast({
        title: "🗑️ Deleting License",
        description: "Removing associated files and data..."
      });
      if (license.document_file_id) {
        try {
          console.log(`Deleting file with ID: ${license.document_file_id}`);
        } catch (fileError) {
          console.warn("File deletion warning:", fileError);
        }
      }
      try {
        const { data: alertHistory, error: alertHistoryError } = await supabase.from("sms_alert_history").select("*").eq("license_id", licenseId);
        if (!alertHistoryError && (alertHistory == null ? void 0 : alertHistory.length) > 0) {
          await supabase.from("sms_alert_history").delete().eq("license_id", licenseId);
          console.log(`Deleted ${alertHistory.length} SMS alert history records`);
        }
      } catch (alertError) {
        console.warn("SMS alert history cleanup warning:", alertError);
      }
      try {
        const { data: schedules, error: scheduleError } = await supabase.from("sms_alert_schedules").select("*").eq("alert_type", "License Expiry").eq("station_filter", license.station);
        if (!scheduleError && (schedules == null ? void 0 : schedules.length) > 0) {
          console.log(`Found ${schedules.length} related alert schedules`);
        }
      } catch (scheduleError) {
        console.warn("Alert schedule cleanup warning:", scheduleError);
      }
      const { error: deleteError } = await supabase.from("licenses_certificates").delete().eq("ID", licenseId);
      if (deleteError) throw deleteError;
      toast({
        title: "✅ License Deleted Successfully",
        description: `${license.license_name} and all associated data have been removed from the system.`,
        duration: 5e3
      });
      await loadLicenses();
    } catch (error) {
      console.error("Error during license deletion:", error);
      toast({
        title: "❌ Deletion Failed",
        description: `Failed to delete license: ${error}`,
        variant: "destructive",
        duration: 7e3
      });
    } finally {
      setDeletingLicenseId(null);
    }
  };
  const handlePrint = (license) => {
    setSelectedLicenseForPrint(license);
    setIsPrintDialogOpen(true);
  };
  const closePrintDialog = () => {
    setIsPrintDialogOpen(false);
    setSelectedLicenseForPrint(null);
  };
  const sendExpiryAlerts = async () => {
    try {
      setSendingSMS(true);
      toast({
        title: "📱 Checking Licenses",
        description: "Analyzing licenses for expiry alerts..."
      });
      await licenseAlertService.checkAndSendAlerts();
      toast({
        title: "✅ License Alerts Complete",
        description: "SMS alerts sent for expiring licenses. Check SMS History for details."
      });
    } catch (error) {
      console.error("Error sending SMS alerts:", error);
      toast({
        title: "❌ Alert Failed",
        description: "Failed to send SMS alerts. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSendingSMS(false);
    }
  };
  const sendImmediateAlert = async (licenseId) => {
    try {
      const result = await licenseAlertService.sendImmediateAlert(licenseId);
      if (result.success) {
        toast({
          title: "📱 SMS Alert Sent",
          description: result.message
        });
      } else {
        toast({
          title: "❌ Alert Failed",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error sending immediate alert:", error);
      toast({
        title: "Error",
        description: "Failed to send SMS alert",
        variant: "destructive"
      });
    }
  };
  const isAdmin = (userProfile == null ? void 0 : userProfile.role) === "Administrator";
  const handleReactivate = async (licenseId) => {
    try {
      setDeletingLicenseId(licenseId);
      const { error } = await supabase.from("licenses_certificates").update({ status: "Active" }).eq("ID", licenseId);
      if (error) throw error;
      toast({
        title: "✅ License Reactivated",
        description: "License has been successfully reactivated.",
        duration: 3e3
      });
      await loadLicenses();
    } catch (error) {
      console.error("Error reactivating license:", error);
      toast({
        title: "❌ Reactivation Failed",
        description: `Failed to reactivate license: ${error}`,
        variant: "destructive"
      });
    } finally {
      setDeletingLicenseId(null);
    }
  };
  const getStatusBadgeColor = (status) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-500";
      case "expired":
        return "bg-red-500";
      case "pending renewal":
        return "bg-yellow-500";
      case "cancelled":
      case "inactive":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };
  const getCategoryBadgeColor = (category) => {
    const colors = {
      "Business": "bg-blue-500",
      "Environmental": "bg-green-500",
      "Safety": "bg-orange-500",
      "Health": "bg-purple-500",
      "Fire": "bg-red-500",
      "Building": "bg-gray-500"
    };
    return colors[category] || "bg-gray-500";
  };
  const getStationBadgeColor = (station) => {
    switch (station.toUpperCase()) {
      case "MOBIL":
        return "bg-blue-600";
      case "AMOCO ROSEDALE":
        return "bg-green-600";
      case "AMOCO BROOKLYN":
        return "bg-purple-600";
      case "ALL":
        return "bg-gray-600";
      default:
        return "bg-gray-600";
    }
  };
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
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
  const totalPages = Math.ceil(totalCount / pageSize);
  const stats = licenses.reduce((acc, license) => ({
    active: acc.active + (license.status.toLowerCase() === "active" ? 1 : 0),
    expiring_soon: acc.expiring_soon + (isExpiringSoon(license.expiry_date) && license.status.toLowerCase() !== "cancelled" ? 1 : 0),
    expired: acc.expired + (isExpired(license.expiry_date) && license.status.toLowerCase() !== "cancelled" ? 1 : 0),
    cancelled: acc.cancelled + (license.status.toLowerCase() === "cancelled" || license.status.toLowerCase() === "inactive" ? 1 : 0)
  }), { active: 0, expiring_soon: 0, expired: 0, cancelled: 0 });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-id": "yswgfq1j5", "data-path": "src/pages/Licenses/LicenseList.tsx", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", "data-id": "5r2l194w7", "data-path": "src/pages/Licenses/LicenseList.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-id": "atyucaqyf", "data-path": "src/pages/Licenses/LicenseList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-6", "data-id": "a9hpxkk5w", "data-path": "src/pages/Licenses/LicenseList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", "data-id": "eez32slb7", "data-path": "src/pages/Licenses/LicenseList.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-8 h-8 text-green-600", "data-id": "9ofqej4wj", "data-path": "src/pages/Licenses/LicenseList.tsx" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "chwtjll9l", "data-path": "src/pages/Licenses/LicenseList.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-gray-600", "data-id": "7sffce40f", "data-path": "src/pages/Licenses/LicenseList.tsx", children: "Active Licenses" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold", "data-id": "l17wuf920", "data-path": "src/pages/Licenses/LicenseList.tsx", children: stats.active })
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-id": "2b8d7amw4", "data-path": "src/pages/Licenses/LicenseList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-6", "data-id": "m2lkb2jw5", "data-path": "src/pages/Licenses/LicenseList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", "data-id": "x5ina2l32", "data-path": "src/pages/Licenses/LicenseList.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-8 h-8 text-yellow-600", "data-id": "mrezj5fzj", "data-path": "src/pages/Licenses/LicenseList.tsx" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "sism71vxc", "data-path": "src/pages/Licenses/LicenseList.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-gray-600", "data-id": "vab0am73w", "data-path": "src/pages/Licenses/LicenseList.tsx", children: "Expiring Soon" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold", "data-id": "4y9b7j3ie", "data-path": "src/pages/Licenses/LicenseList.tsx", children: stats.expiring_soon })
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-id": "x9d9uavqk", "data-path": "src/pages/Licenses/LicenseList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-6", "data-id": "ztqbvisoh", "data-path": "src/pages/Licenses/LicenseList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", "data-id": "36ayaa0v1", "data-path": "src/pages/Licenses/LicenseList.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-8 h-8 text-red-600", "data-id": "6nu7c2amt", "data-path": "src/pages/Licenses/LicenseList.tsx" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "gn93luqhz", "data-path": "src/pages/Licenses/LicenseList.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-gray-600", "data-id": "p3lkeeox6", "data-path": "src/pages/Licenses/LicenseList.tsx", children: "Expired" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold", "data-id": "5g2f2bvma", "data-path": "src/pages/Licenses/LicenseList.tsx", children: stats.expired })
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-id": "c4k8m9z1x", "data-path": "src/pages/Licenses/LicenseList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-6", "data-id": "l3h5n7q2w", "data-path": "src/pages/Licenses/LicenseList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", "data-id": "r9t6e8u4i", "data-path": "src/pages/Licenses/LicenseList.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Archive, { className: "w-8 h-8 text-gray-600", "data-id": "m2p5j8k1l", "data-path": "src/pages/Licenses/LicenseList.tsx" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "s7f3g9h6n", "data-path": "src/pages/Licenses/LicenseList.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-gray-600", "data-id": "d4v7x2c9b", "data-path": "src/pages/Licenses/LicenseList.tsx", children: "Cancelled" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold", "data-id": "q8w1e5r3t", "data-path": "src/pages/Licenses/LicenseList.tsx", children: stats.cancelled })
        ] })
      ] }) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "jm43kzapy", "data-path": "src/pages/Licenses/LicenseList.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "hjtkiiwbm", "data-path": "src/pages/Licenses/LicenseList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "wr2xpz1ii", "data-path": "src/pages/Licenses/LicenseList.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "2xvj28q73", "data-path": "src/pages/Licenses/LicenseList.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center space-x-2", "data-id": "5uc6totjh", "data-path": "src/pages/Licenses/LicenseList.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-6 h-6", "data-id": "h3dmrqctq", "data-path": "src/pages/Licenses/LicenseList.tsx" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "yexlwvcda", "data-path": "src/pages/Licenses/LicenseList.tsx", children: "Licenses & Certificates" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { "data-id": "wyppc18um", "data-path": "src/pages/Licenses/LicenseList.tsx", children: "Manage your business licenses and certificates" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", "data-id": "4syl9p6ld", "data-path": "src/pages/Licenses/LicenseList.tsx", children: [
          isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                onClick: sendExpiryAlerts,
                disabled: sendingSMS,
                variant: "outline",
                className: "flex items-center space-x-2",
                "data-id": "id478c0xo",
                "data-path": "src/pages/Licenses/LicenseList.tsx",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "w-4 h-4", "data-id": "h3naa0eet", "data-path": "src/pages/Licenses/LicenseList.tsx" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "pnkhgtxes", "data-path": "src/pages/Licenses/LicenseList.tsx", children: sendingSMS ? "Sending..." : "Send SMS Alerts" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                onClick: () => navigate("/admin/sms-alerts"),
                variant: "outline",
                className: "flex items-center space-x-2",
                "data-id": "xo2ixxym6",
                "data-path": "src/pages/Licenses/LicenseList.tsx",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "w-4 h-4", "data-id": "yiui8n7e9", "data-path": "src/pages/Licenses/LicenseList.tsx" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "2dueaelmw", "data-path": "src/pages/Licenses/LicenseList.tsx", children: "SMS Settings" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => navigate("/licenses/new"), className: "flex items-center space-x-2", "data-id": "abxmlmxl0", "data-path": "src/pages/Licenses/LicenseList.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4", "data-id": "skmboegpn", "data-path": "src/pages/Licenses/LicenseList.tsx" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "tsnjzr2xg", "data-path": "src/pages/Licenses/LicenseList.tsx", children: "Add License" })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { "data-id": "y72l9z6g4", "data-path": "src/pages/Licenses/LicenseList.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", "data-id": "2bm6ntwyq", "data-path": "src/pages/Licenses/LicenseList.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 max-w-sm", "data-id": "c6igq7xfz", "data-path": "src/pages/Licenses/LicenseList.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4", "data-id": "zw0db9clp", "data-path": "src/pages/Licenses/LicenseList.tsx" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                placeholder: "Search licenses...",
                value: searchTerm,
                onChange: (e) => setSearchTerm(e.target.value),
                className: "pl-10",
                "data-id": "dvr2nry9d",
                "data-path": "src/pages/Licenses/LicenseList.tsx"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center space-x-2", "data-id": "op01c6tmk", "data-path": "src/pages/Licenses/LicenseList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: showCancelled ? "default" : "outline",
              size: "sm",
              onClick: () => setShowCancelled(!showCancelled),
              className: "flex items-center space-x-2",
              "data-id": "1zhi4gtzj",
              "data-path": "src/pages/Licenses/LicenseList.tsx",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Archive, { className: "w-4 h-4", "data-id": "d8am7onkr", "data-path": "src/pages/Licenses/LicenseList.tsx" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { "data-id": "ezlv06j8k", "data-path": "src/pages/Licenses/LicenseList.tsx", children: [
                  showCancelled ? "Hide" : "Show",
                  " Cancelled"
                ] })
              ]
            }
          ) })
        ] }),
        loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", "data-id": "kd40f4ksu", "data-path": "src/pages/Licenses/LicenseList.tsx", children: [...Array(5)].map(
          (_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 bg-gray-100 rounded animate-pulse", "data-id": "0sz4qxz0i", "data-path": "src/pages/Licenses/LicenseList.tsx" }, i)
        ) }) : licenses.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-8", "data-id": "ipujzvq9h", "data-path": "src/pages/Licenses/LicenseList.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-12 h-12 text-gray-400 mx-auto mb-4", "data-id": "bml786pig", "data-path": "src/pages/Licenses/LicenseList.tsx" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500", "data-id": "lokrg9ghh", "data-path": "src/pages/Licenses/LicenseList.tsx", children: "No licenses found" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              className: "mt-4",
              onClick: () => navigate("/licenses/new"),
              "data-id": "sf88hfx2g",
              "data-path": "src/pages/Licenses/LicenseList.tsx",
              children: "Add Your First License"
            }
          )
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border rounded-lg overflow-hidden", "data-id": "7hbb55i8g", "data-path": "src/pages/Licenses/LicenseList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { "data-id": "4yfu037pc", "data-path": "src/pages/Licenses/LicenseList.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { "data-id": "ug8dk0az2", "data-path": "src/pages/Licenses/LicenseList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { "data-id": "bgdtq60zj", "data-path": "src/pages/Licenses/LicenseList.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "3jrl2m6dd", "data-path": "src/pages/Licenses/LicenseList.tsx", children: "License Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "k1qaq974y", "data-path": "src/pages/Licenses/LicenseList.tsx", children: "License Number" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "739qv6alh", "data-path": "src/pages/Licenses/LicenseList.tsx", children: "Category" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "j5pztsjh0", "data-path": "src/pages/Licenses/LicenseList.tsx", children: "Station" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "4ga60onxb", "data-path": "src/pages/Licenses/LicenseList.tsx", children: "Issue Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "ko1xt4c5m", "data-path": "src/pages/Licenses/LicenseList.tsx", children: "Expiry Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "zx3311yla", "data-path": "src/pages/Licenses/LicenseList.tsx", children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "zoxkxoety", "data-path": "src/pages/Licenses/LicenseList.tsx", children: "Actions" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { "data-id": "buujsytow", "data-path": "src/pages/Licenses/LicenseList.tsx", children: licenses.map(
            (license) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: isExpired(license.expiry_date) ? "bg-red-50" : isExpiringSoon(license.expiry_date) ? "bg-yellow-50" : "", "data-id": "y9n0bda44", "data-path": "src/pages/Licenses/LicenseList.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "dbfj6ylxj", "data-path": "src/pages/Licenses/LicenseList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "4te9yy1if", "data-path": "src/pages/Licenses/LicenseList.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", "data-id": "8b4nauy2o", "data-path": "src/pages/Licenses/LicenseList.tsx", children: license.license_name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500", "data-id": "7k9k0gs3s", "data-path": "src/pages/Licenses/LicenseList.tsx", children: license.issuing_authority })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", "data-id": "9qi906uae", "data-path": "src/pages/Licenses/LicenseList.tsx", children: license.license_number }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "4pa5phxhw", "data-path": "src/pages/Licenses/LicenseList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: `text-white ${getCategoryBadgeColor(license.category)}`, "data-id": "9rdtgbweq", "data-path": "src/pages/Licenses/LicenseList.tsx", children: license.category }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "ckjncht0o", "data-path": "src/pages/Licenses/LicenseList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: `text-white ${getStationBadgeColor(license.station)}`, "data-id": "tkir01xrz", "data-path": "src/pages/Licenses/LicenseList.tsx", children: license.station }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "3zeucj880", "data-path": "src/pages/Licenses/LicenseList.tsx", children: formatDate(license.issue_date) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "1pch0ufc8", "data-path": "src/pages/Licenses/LicenseList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", "data-id": "yxbcfn6vs", "data-path": "src/pages/Licenses/LicenseList.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "vz89ei5b8", "data-path": "src/pages/Licenses/LicenseList.tsx", children: formatDate(license.expiry_date) }),
                isExpired(license.expiry_date) && /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-4 h-4 text-red-500", "data-id": "l8kr4227b", "data-path": "src/pages/Licenses/LicenseList.tsx" }),
                isExpiringSoon(license.expiry_date) && !isExpired(license.expiry_date) && /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-4 h-4 text-yellow-500", "data-id": "hsmbf5fpg", "data-path": "src/pages/Licenses/LicenseList.tsx" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "9b40djbk1", "data-path": "src/pages/Licenses/LicenseList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: `text-white ${getStatusBadgeColor(license.status)}`, "data-id": "iju5cgzhq", "data-path": "src/pages/Licenses/LicenseList.tsx", children: license.status }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "g76he2ar0", "data-path": "src/pages/Licenses/LicenseList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", "data-id": "ag3vb9cgq", "data-path": "src/pages/Licenses/LicenseList.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "outline",
                    size: "sm",
                    onClick: () => handlePrint(license),
                    className: "text-blue-600 hover:text-blue-700",
                    title: "Print Document",
                    "data-id": "mh73cu15f",
                    "data-path": "src/pages/Licenses/LicenseList.tsx",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "w-4 h-4", "data-id": "q9ctilc62", "data-path": "src/pages/Licenses/LicenseList.tsx" })
                  }
                ),
                (isExpiringSoon(license.expiry_date) || isExpired(license.expiry_date)) && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "outline",
                    size: "sm",
                    onClick: () => sendImmediateAlert(license.ID),
                    className: "text-orange-600 hover:text-orange-700",
                    title: "Send SMS Alert",
                    "data-id": "20hg8dybs",
                    "data-path": "src/pages/Licenses/LicenseList.tsx",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "w-4 h-4", "data-id": "clhjnskux", "data-path": "src/pages/Licenses/LicenseList.tsx" })
                  }
                ),
                isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      variant: "outline",
                      size: "sm",
                      onClick: () => navigate(`/licenses/edit/${license.ID}`),
                      title: "Edit License",
                      "data-id": "itticots7",
                      "data-path": "src/pages/Licenses/LicenseList.tsx",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { className: "w-4 h-4", "data-id": "wnimbsr32", "data-path": "src/pages/Licenses/LicenseList.tsx" })
                    }
                  ),
                  license.status.toLowerCase() === "cancelled" || license.status.toLowerCase() === "inactive" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      variant: "outline",
                      size: "sm",
                      onClick: () => handleReactivate(license.ID),
                      disabled: deletingLicenseId === license.ID,
                      className: `${deletingLicenseId === license.ID ? "text-gray-400" : "text-green-600 hover:text-green-700"}`,
                      title: deletingLicenseId === license.ID ? "Processing..." : "Reactivate License",
                      "data-id": "1pdv67sx2",
                      "data-path": "src/pages/Licenses/LicenseList.tsx",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: `w-4 h-4 ${deletingLicenseId === license.ID ? "animate-spin" : ""}`, "data-id": "kuzfq3h9d", "data-path": "src/pages/Licenses/LicenseList.tsx" })
                    }
                  ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      variant: "outline",
                      size: "sm",
                      onClick: () => openDeleteDialog(license),
                      disabled: deletingLicenseId === license.ID,
                      className: `${deletingLicenseId === license.ID ? "text-gray-400" : "text-red-600 hover:text-red-700"}`,
                      title: deletingLicenseId === license.ID ? "Processing..." : "Delete License",
                      "data-id": "knpqb3mfi",
                      "data-path": "src/pages/Licenses/LicenseList.tsx",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: `w-4 h-4 ${deletingLicenseId === license.ID ? "animate-spin" : ""}`, "data-id": "vn548kq6e", "data-path": "src/pages/Licenses/LicenseList.tsx" })
                    }
                  )
                ] })
              ] }) })
            ] }, license.ID)
          ) })
        ] }) }),
        totalPages > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-6", "data-id": "ycqywaxtw", "data-path": "src/pages/Licenses/LicenseList.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-gray-700", "data-id": "0nir713c7", "data-path": "src/pages/Licenses/LicenseList.tsx", children: [
            "Showing ",
            (currentPage - 1) * pageSize + 1,
            " to ",
            Math.min(currentPage * pageSize, totalCount),
            " of ",
            totalCount,
            " licenses"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", "data-id": "r3iarkpra", "data-path": "src/pages/Licenses/LicenseList.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: () => setCurrentPage((prev) => Math.max(prev - 1, 1)),
                disabled: currentPage === 1,
                "data-id": "jwrw6r2p1",
                "data-path": "src/pages/Licenses/LicenseList.tsx",
                children: "Previous"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm", "data-id": "49r9tevk0", "data-path": "src/pages/Licenses/LicenseList.tsx", children: [
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
                "data-id": "p27tf86gc",
                "data-path": "src/pages/Licenses/LicenseList.tsx",
                children: "Next"
              }
            )
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      EnhancedLicensePrintDialog,
      {
        license: selectedLicenseForPrint,
        isOpen: isPrintDialogOpen,
        onClose: closePrintDialog,
        "data-id": "hb04mov5w",
        "data-path": "src/pages/Licenses/LicenseList.tsx"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: deleteDialogOpen, onOpenChange: setDeleteDialogOpen, "data-id": "n1zza37kk", "data-path": "src/pages/Licenses/LicenseList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-[425px]", "data-id": "xoilc6udn", "data-path": "src/pages/Licenses/LicenseList.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { "data-id": "mwvwy2jaw", "data-path": "src/pages/Licenses/LicenseList.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center space-x-2", "data-id": "7z2yq8262", "data-path": "src/pages/Licenses/LicenseList.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-5 h-5 text-red-500", "data-id": "os6658jic", "data-path": "src/pages/Licenses/LicenseList.tsx" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "i6jlrv51t", "data-path": "src/pages/Licenses/LicenseList.tsx", children: "Delete License" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { "data-id": "rdnrk302z", "data-path": "src/pages/Licenses/LicenseList.tsx", children: [
          "Choose how you want to handle the license: ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { "data-id": "jlq2qfawf", "data-path": "src/pages/Licenses/LicenseList.tsx", children: licenseToDelete == null ? void 0 : licenseToDelete.license_name })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4 py-4", "data-id": "f0zj0485r", "data-path": "src/pages/Licenses/LicenseList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", "data-id": "yufi95y7f", "data-path": "src/pages/Licenses/LicenseList.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start space-x-3 p-4 border rounded-lg bg-yellow-50", "data-id": "93gy1o817", "data-path": "src/pages/Licenses/LicenseList.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Archive, { className: "w-5 h-5 text-yellow-600 mt-1", "data-id": "275gn4wzj", "data-path": "src/pages/Licenses/LicenseList.tsx" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "m9l026q8v", "data-path": "src/pages/Licenses/LicenseList.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-medium text-yellow-800", "data-id": "nl9xupz4u", "data-path": "src/pages/Licenses/LicenseList.tsx", children: "Soft Delete (Recommended)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-yellow-700", "data-id": "jvemo5og3", "data-path": "src/pages/Licenses/LicenseList.tsx", children: "Mark as cancelled but keep all data for potential recovery. This is safer and maintains audit trails." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start space-x-3 p-4 border rounded-lg bg-red-50", "data-id": "em0td25aa", "data-path": "src/pages/Licenses/LicenseList.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-5 h-5 text-red-600 mt-1", "data-id": "0f6ss8ufm", "data-path": "src/pages/Licenses/LicenseList.tsx" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "gxb82jqiv", "data-path": "src/pages/Licenses/LicenseList.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-medium text-red-800", "data-id": "qzc1dp9ij", "data-path": "src/pages/Licenses/LicenseList.tsx", children: "Permanent Delete" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-red-700", "data-id": "bj6s0c2iy", "data-path": "src/pages/Licenses/LicenseList.tsx", children: "Completely remove the license and all associated files and SMS history. This cannot be undone." })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "space-x-2", "data-id": "mr560w56p", "data-path": "src/pages/Licenses/LicenseList.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            onClick: () => setDeleteDialogOpen(false),
            disabled: deletingLicenseId !== null,
            "data-id": "9toabgrdg",
            "data-path": "src/pages/Licenses/LicenseList.tsx",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            onClick: () => {
              handleSoftDelete((licenseToDelete == null ? void 0 : licenseToDelete.ID) || 0);
              setDeleteDialogOpen(false);
            },
            disabled: deletingLicenseId !== null,
            className: "text-yellow-600 hover:text-yellow-700 border-yellow-200 hover:bg-yellow-50",
            "data-id": "5w1rbh2g6",
            "data-path": "src/pages/Licenses/LicenseList.tsx",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Archive, { className: "w-4 h-4 mr-2", "data-id": "5j9eivygn", "data-path": "src/pages/Licenses/LicenseList.tsx" }),
              "Soft Delete"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "destructive",
            onClick: () => {
              handleHardDelete((licenseToDelete == null ? void 0 : licenseToDelete.ID) || 0);
              setDeleteDialogOpen(false);
            },
            disabled: deletingLicenseId !== null,
            "data-id": "uvp6rp9l4",
            "data-path": "src/pages/Licenses/LicenseList.tsx",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4 mr-2", "data-id": "lyb93izyu", "data-path": "src/pages/Licenses/LicenseList.tsx" }),
              "Permanent Delete"
            ]
          }
        )
      ] })
    ] }) })
  ] });
};
export {
  LicenseList as default
};
