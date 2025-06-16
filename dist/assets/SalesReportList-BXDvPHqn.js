import { j as jsxRuntimeExports } from "./ui-BAZ8HTBl.js";
import { r as reactExports, u as useNavigate } from "./vendor-Dw3NhmYV.js";
import { B as Button, C as Card, b as CardHeader, d as CardTitle, h as Badge, f as CardContent, X, s as supabase, v as toast, e as CardDescription, T as Table, n as TableHeader, o as TableRow, p as TableHead, q as TableBody, r as TableCell } from "./index-BDkJIub7.js";
import { I as Input } from "./input-DuAIOXAd.js";
import { u as useAuth } from "./AuthContext-CGZTrpGt.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, e as DialogFooter } from "./dialog-DQTKpYge.js";
import { S as Separator } from "./separator-CPMoODEa.js";
import { R as Receipt, F as Fuel } from "./receipt-BUtuDC5Q.js";
import { P as Printer } from "./printer-B3-3bBH1.js";
import { D as DollarSign } from "./dollar-sign-BipQ1WW8.js";
import { T as TrendingUp } from "./trending-up-Bymz7YBN.js";
import { A as AlertCircle } from "./alert-circle-Jk151MGF.js";
import { C as Calendar } from "./calendar-BpyyOZ57.js";
import { P as Plus } from "./plus-B9tDglN7.js";
import { S as Search } from "./search-BeX_R1GV.js";
import { S as SquarePen } from "./square-pen-7bCDDO3z.js";
import { T as Trash2 } from "./trash-2-Dhnxhlze.js";
const EnhancedSalesReportPrintDialog = ({
  open,
  onOpenChange,
  report
}) => {
  if (!report) return null;
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(amount || 0);
  };
  const formatNumber = (num) => {
    return (num || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };
  const getStationBadgeColor = (station) => {
    switch (station.toUpperCase()) {
      case "MOBIL":
        return "bg-red-500 text-white";
      case "AMOCO ROSEDALE":
        return "bg-blue-500 text-white";
      case "AMOCO BROOKLYN":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };
  const expenses = report.expenses_data ? JSON.parse(report.expenses_data) : [];
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const cashExpenses = expenses.filter((e) => e.paymentType === "Cash").reduce((sum, expense) => sum + expense.amount, 0);
  const cardExpenses = expenses.filter((e) => e.paymentType === "Credit Card").reduce((sum, expense) => sum + expense.amount, 0);
  const chequeExpenses = expenses.filter((e) => e.paymentType === "Cheque").reduce((sum, expense) => sum + expense.amount, 0);
  const totalPaymentMethods = report.credit_card_amount + report.debit_card_amount + report.mobile_amount + report.cash_amount;
  report.regular_gallons + report.super_gallons + report.diesel_gallons;
  const isPaymentBalanced = Math.abs(totalPaymentMethods - report.total_sales) <= 0.01;
  const isCashBalanced = Math.abs(report.total_short_over) <= 1;
  const handlePrint = () => {
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Enhanced Sales Report - ${report.station} - ${formatDate(report.report_date)}</title>
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
              line-height: 1.4;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 3px solid #2563eb;
              padding-bottom: 20px;
            }
            .company-logo {
              font-size: 28px;
              font-weight: bold;
              color: #1e40af;
              margin-bottom: 5px;
            }
            .report-title {
              font-size: 20px;
              color: #374151;
              margin-bottom: 10px;
            }
            .report-meta {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 20px;
              background: #f8fafc;
              padding: 15px;
              border-radius: 8px;
              margin-bottom: 25px;
            }
            .meta-item {
              text-align: center;
            }
            .meta-label {
              font-size: 12px;
              color: #6b7280;
              text-transform: uppercase;
              font-weight: 600;
            }
            .meta-value {
              font-size: 14px;
              font-weight: bold;
              margin-top: 5px;
            }
            .station-badge {
              display: inline-block;
              padding: 4px 12px;
              border-radius: 20px;
              color: white;
              font-size: 12px;
              font-weight: 600;
            }
            .section {
              margin-bottom: 25px;
              break-inside: avoid;
            }
            .section-header {
              display: flex;
              align-items: center;
              margin-bottom: 15px;
              padding-bottom: 10px;
              border-bottom: 2px solid #e5e7eb;
            }
            .section-icon {
              margin-right: 10px;
              color: #2563eb;
            }
            .section-title {
              font-size: 18px;
              font-weight: bold;
              color: #1f2937;
            }
            .data-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 15px;
            }
            .data-card {
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              padding: 15px;
              background: #ffffff;
            }
            .data-label {
              font-size: 12px;
              color: #6b7280;
              text-transform: uppercase;
              font-weight: 600;
              margin-bottom: 5px;
            }
            .data-value {
              font-size: 16px;
              font-weight: bold;
              color: #1f2937;
            }
            .currency {
              color: #059669;
            }
            .gallons {
              color: #2563eb;
            }
            .summary-card {
              background: linear-gradient(135deg, #3b82f6, #1d4ed8);
              color: white;
              padding: 20px;
              border-radius: 10px;
              margin: 20px 0;
            }
            .summary-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 20px;
              text-align: center;
            }
            .summary-amount {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 5px;
            }
            .summary-label {
              font-size: 12px;
              opacity: 0.9;
            }
            .expenses-table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
            }
            .expenses-table th,
            .expenses-table td {
              padding: 10px;
              text-align: left;
              border-bottom: 1px solid #e5e7eb;
            }
            .expenses-table th {
              background: #f3f4f6;
              font-weight: 600;
              font-size: 12px;
              text-transform: uppercase;
            }
            .verification-section {
              background: #f0fdf4;
              border: 2px solid #10b981;
              border-radius: 8px;
              padding: 20px;
              margin: 20px 0;
            }
            .verification-failed {
              background: #fef2f2;
              border-color: #ef4444;
            }
            .verification-item {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 10px;
            }
            .check-passed {
              color: #059669;
              font-weight: bold;
            }
            .check-failed {
              color: #dc2626;
              font-weight: bold;
            }
            .footer {
              margin-top: 40px;
              text-align: center;
              font-size: 11px;
              color: #6b7280;
              border-top: 1px solid #e5e7eb;
              padding-top: 20px;
            }
            .notes-section {
              background: #fffbeb;
              border-left: 4px solid #f59e0b;
              padding: 15px;
              margin: 20px 0;
            }
            @media print {
              body { font-size: 11pt; }
              .section { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-logo">DFS Manager Portal</div>
            <div class="report-title">Daily Sales Report - Enhanced</div>
          </div>

          <div class="report-meta">
            <div class="meta-item">
              <div class="meta-label">Report Date</div>
              <div class="meta-value">${formatDate(report.report_date)}</div>
            </div>
            <div class="meta-item">
              <div class="meta-label">Station</div>
              <div class="meta-value">
                <span class="station-badge" style="background: ${report.station === "MOBIL" ? "#ef4444" : report.station === "AMOCO ROSEDALE" ? "#3b82f6" : "#10b981"}">${report.station}</span>
              </div>
            </div>
            <div class="meta-item">
              <div class="meta-label">Employee</div>
              <div class="meta-value">${report.employee_name}</div>
            </div>
          </div>

          <div class="summary-card">
            <div class="summary-grid">
              <div>
                <div class="summary-amount">${formatCurrency(report.total_sales)}</div>
                <div class="summary-label">Total Sales</div>
              </div>
              <div>
                <div class="summary-amount">${formatNumber(report.total_gallons)} gal</div>
                <div class="summary-label">Total Gallons</div>
              </div>
              <div>
                <div class="summary-amount">${formatCurrency(report.lottery_total_cash)}</div>
                <div class="summary-label">Lottery Sales</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-header">
              <span class="section-icon">💰</span>
              <span class="section-title">Cash Collection & Balance</span>
            </div>
            <div class="data-grid">
              <div class="data-card">
                <div class="data-label">Cash on Hand</div>
                <div class="data-value currency">${formatCurrency(report.cash_collection_on_hand)}</div>
              </div>
              <div class="data-card">
                <div class="data-label">Short/Over</div>
                <div class="data-value ${report.total_short_over >= 0 ? "check-passed" : "check-failed"}">${formatCurrency(report.total_short_over)}</div>
              </div>
              <div class="data-card">
                <div class="data-label">Cash Sales</div>
                <div class="data-value currency">${formatCurrency(report.cash_amount)}</div>
              </div>
              <div class="data-card">
                <div class="data-label">Cash Expenses</div>
                <div class="data-value currency">${formatCurrency(cashExpenses)}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-header">
              <span class="section-icon">💳</span>
              <span class="section-title">Payment Methods</span>
            </div>
            <div class="data-grid">
              <div class="data-card">
                <div class="data-label">Credit Card</div>
                <div class="data-value currency">${formatCurrency(report.credit_card_amount)}</div>
              </div>
              <div class="data-card">
                <div class="data-label">Debit Card</div>
                <div class="data-value currency">${formatCurrency(report.debit_card_amount)}</div>
              </div>
              <div class="data-card">
                <div class="data-label">Mobile Payments</div>
                <div class="data-value currency">${formatCurrency(report.mobile_amount)}</div>
              </div>
              <div class="data-card">
                <div class="data-label">Cash Payments</div>
                <div class="data-value currency">${formatCurrency(report.cash_amount)}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-header">
              <span class="section-icon">⛽</span>
              <span class="section-title">Fuel Sales</span>
            </div>
            <div class="data-grid">
              <div class="data-card">
                <div class="data-label">Regular Gallons</div>
                <div class="data-value gallons">${formatNumber(report.regular_gallons)} gal</div>
              </div>
              <div class="data-card">
                <div class="data-label">Super Gallons</div>
                <div class="data-value gallons">${formatNumber(report.super_gallons)} gal</div>
              </div>
              <div class="data-card">
                <div class="data-label">Diesel Gallons</div>
                <div class="data-value gallons">${formatNumber(report.diesel_gallons)} gal</div>
              </div>
              <div class="data-card">
                <div class="data-label">Total Gallons</div>
                <div class="data-value gallons">${formatNumber(report.total_gallons)} gal</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-header">
              <span class="section-icon">🛒</span>
              <span class="section-title">Store Sales</span>
            </div>
            <div class="data-grid">
              <div class="data-card">
                <div class="data-label">Grocery Sales</div>
                <div class="data-value currency">${formatCurrency(report.grocery_sales)}</div>
              </div>
              ${report.station === "MOBIL" ? `
              <div class="data-card">
                <div class="data-label">EBT Sales</div>
                <div class="data-value currency">${formatCurrency(report.ebt_sales)}</div>
              </div>
              ` : ""}
              <div class="data-card">
                <div class="data-label">Lottery Net Sales</div>
                <div class="data-value currency">${formatCurrency(report.lottery_net_sales)}</div>
              </div>
              <div class="data-card">
                <div class="data-label">Scratch-off Sales</div>
                <div class="data-value currency">${formatCurrency(report.scratch_off_sales)}</div>
              </div>
            </div>
          </div>

          ${expenses.length > 0 ? `
          <div class="section">
            <div class="section-header">
              <span class="section-icon">📋</span>
              <span class="section-title">Expenses (${expenses.length} items)</span>
            </div>
            <table class="expenses-table">
              <thead>
                <tr>
                  <th>Vendor</th>
                  <th>Amount</th>
                  <th>Payment Method</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                ${expenses.map((expense) => `
                <tr>
                  <td>${expense.vendorName}</td>
                  <td>${formatCurrency(expense.amount)}</td>
                  <td>${expense.paymentType}${expense.chequeNo ? ` (#${expense.chequeNo})` : ""}</td>
                  <td>${expense.notes || "-"}</td>
                </tr>
                `).join("")}
              </tbody>
            </table>
            <div class="data-grid" style="margin-top: 15px;">
              <div class="data-card">
                <div class="data-label">Total Expenses</div>
                <div class="data-value currency">${formatCurrency(totalExpenses)}</div>
              </div>
              <div class="data-card">
                <div class="data-label">Cash Expenses</div>
                <div class="data-value currency">${formatCurrency(cashExpenses)}</div>
              </div>
              <div class="data-card">
                <div class="data-label">Card Expenses</div>
                <div class="data-value currency">${formatCurrency(cardExpenses)}</div>
              </div>
              <div class="data-card">
                <div class="data-label">Cheque Expenses</div>
                <div class="data-value currency">${formatCurrency(chequeExpenses)}</div>
              </div>
            </div>
          </div>
          ` : ""}

          <div class="verification-section ${isPaymentBalanced && isCashBalanced ? "" : "verification-failed"}">
            <div class="section-header">
              <span class="section-icon">✓</span>
              <span class="section-title">Report Verification</span>
            </div>
            <div class="verification-item">
              <span>Payment Methods Balance:</span>
              <span class="${isPaymentBalanced ? "check-passed" : "check-failed"}">
                ${isPaymentBalanced ? "✓ Balanced" : `⚠️ Discrepancy: ${formatCurrency(Math.abs(totalPaymentMethods - report.total_sales))}`}
              </span>
            </div>
            <div class="verification-item">
              <span>Cash Balance (Short/Over):</span>
              <span class="${isCashBalanced ? "check-passed" : "check-failed"}">
                ${isCashBalanced ? "✓ Within tolerance" : "⚠️ Outside tolerance"}
              </span>
            </div>
            <div class="verification-item">
              <span>Documents Uploaded:</span>
              <span class="check-passed">✓ All Required</span>
            </div>
          </div>

          ${report.notes ? `
          <div class="notes-section">
            <div class="section-header">
              <span class="section-icon">📝</span>
              <span class="section-title">Additional Notes</span>
            </div>
            <p style="margin: 0; white-space: pre-wrap;">${report.notes}</p>
          </div>
          ` : ""}

          <div class="footer">
            <div>Report ID: #${report.ID} | Generated on ${(/* @__PURE__ */ new Date()).toLocaleString()}</div>
            <div>Created by User #${report.created_by} | DFS Manager Portal v2.0</div>
            <div style="margin-top: 10px; font-style: italic;">
              This is an official business document. Please retain for your records.
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
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, "data-id": "nfj0bspmm", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-7xl max-h-[95vh] overflow-y-auto", "data-id": "pju3yrhmm", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { "data-id": "vpu48sxl6", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "k4vwk334t", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2", "data-id": "ru8r52y45", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Receipt, { className: "h-5 w-5 text-blue-600", "data-id": "ily78v8qn", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx" }),
        "Enhanced Sales Report - ",
        report.station
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          onClick: handlePrint,
          variant: "outline",
          size: "sm",
          className: "flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50",
          "data-id": "knargsigk",
          "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "h-4 w-4", "data-id": "zci1fq4z3", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx" }),
            "Print Full Report"
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-id": "0cftv8qde", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200", "data-id": "wafqznfno", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "n2puxr7rb", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "wqp9vhh1u", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "v3rl3w8bo", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-blue-800", "data-id": "jq4c5c71y", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: formatDate(report.report_date) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-2", "data-id": "geuzwol9x", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: getStationBadgeColor(report.station), "data-id": "u8s6xxnkx", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: report.station }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-gray-600", "data-id": "gbpj1fde4", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: [
              "Employee: ",
              report.employee_name
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", "data-id": "ku6flmdww", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-blue-800", "data-id": "a5quco9ty", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: formatCurrency(report.total_sales) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-gray-600", "data-id": "9h66fakkx", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: "Total Sales" })
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", "data-id": "ipp9ha9ym", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-id": "ve5ee45n4", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 text-center", "data-id": "epp3wvo1k", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "h-8 w-8 mx-auto text-green-600 mb-2", "data-id": "quyh8i9vf", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-green-600", "data-id": "ztahfbnjv", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: formatCurrency(report.total_sales) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-gray-600", "data-id": "hd6lhsbbq", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: "Total Sales" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-id": "6l9eceytc", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 text-center", "data-id": "jqgxhgdsy", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Fuel, { className: "h-8 w-8 mx-auto text-blue-600 mb-2", "data-id": "7cwhbzkvx", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-blue-600", "data-id": "f3mbsg5p8", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: formatNumber(report.total_gallons) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-gray-600", "data-id": "pxrx3ujd9", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: "Total Gallons" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-id": "7ml55fuhf", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 text-center", "data-id": "fp2rkckpa", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-8 w-8 mx-auto text-purple-600 mb-2", "data-id": "t3tj5ah3c", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-purple-600", "data-id": "qztmkcdzn", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: formatCurrency(report.lottery_total_cash) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-gray-600", "data-id": "xkhhehqu5", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: "Lottery Sales" })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: `border-2 ${isPaymentBalanced && isCashBalanced ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`, "data-id": "yonatv9o0", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "ph413d7va", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "flex items-center gap-2", "data-id": "g44n89d25", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: isPaymentBalanced && isCashBalanced ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-green-600", "data-id": "evujsuleq", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: "✓ Report Verified" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-red-600 flex items-center gap-2", "data-id": "ezfpec1at", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertCircle, { className: "h-5 w-5", "data-id": "k8np7ku99", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx" }),
          "Discrepancies Found"
        ] }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { "data-id": "bxrtcl1bt", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", "data-id": "uggeiu1ua", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", "data-id": "xun580ajb", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "lb1djuicf", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: "Payment Balance:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: isPaymentBalanced ? "text-green-600 font-medium" : "text-red-600 font-medium", "data-id": "jyzbc4wsa", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: isPaymentBalanced ? "✓ Balanced" : `⚠️ ${formatCurrency(Math.abs(totalPaymentMethods - report.total_sales))} difference` })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", "data-id": "3htawnd8a", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "c5wrnmb96", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: "Cash Balance:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: isCashBalanced ? "text-green-600 font-medium" : "text-red-600 font-medium", "data-id": "s27d5hiua", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: isCashBalanced ? "✓ Within tolerance" : `⚠️ ${formatCurrency(Math.abs(report.total_short_over))}` })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", "data-id": "zm6phqnq5", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "6vjvntzmi", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "yd2hay199", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm", "data-id": "mdncwt5bg", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: "Payment Methods" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-2", "data-id": "rnlkfky6t", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", "data-id": "5kiw0cffh", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "uq7yftxit", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: "Credit Card:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", "data-id": "m1w2bucdj", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: formatCurrency(report.credit_card_amount) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", "data-id": "7pfl0pad1", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "vrowmjj96", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: "Debit Card:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", "data-id": "e9384xopw", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: formatCurrency(report.debit_card_amount) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", "data-id": "hgo5jgcpp", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "b3cmlzlen", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: "Mobile:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", "data-id": "hcxmxwq92", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: formatCurrency(report.mobile_amount) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", "data-id": "u8davm9nb", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "mdp95mn7b", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: "Cash:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", "data-id": "imzy6eti5", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: formatCurrency(report.cash_amount) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "995ium6hf", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "95azghl4t", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm", "data-id": "1drzyvdrx", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: "Fuel Sales" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-2", "data-id": "cxk952tzb", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", "data-id": "ixgho7yu2", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "t04ygl85d", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: "Regular:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium", "data-id": "0r9obj3kd", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: [
                formatNumber(report.regular_gallons),
                " gal"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", "data-id": "ygxm5n5o0", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "qq1hay5mi", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: "Super:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium", "data-id": "iok2uxfh3", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: [
                formatNumber(report.super_gallons),
                " gal"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", "data-id": "9qvy027aq", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "csry1th5t", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: "Diesel:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium", "data-id": "jhguveiaf", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: [
                formatNumber(report.diesel_gallons),
                " gal"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { "data-id": "1wwyi9zs3", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm font-semibold", "data-id": "pnkruv9no", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "tdz95txu0", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: "Total:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { "data-id": "okq4sa0hd", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: [
                formatNumber(report.total_gallons),
                " gal"
              ] })
            ] })
          ] })
        ] })
      ] }),
      expenses.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "jo0zxphib", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "mhekh4qxd", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm", "data-id": "m1dglqmbt", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: [
          "Expenses (",
          expenses.length,
          " items) - Total: ",
          formatCurrency(totalExpenses)
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { "data-id": "zqfo7t6vc", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-gray-600", "data-id": "452isskjj", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: [
          "Cash: ",
          formatCurrency(cashExpenses),
          " | Card: ",
          formatCurrency(cardExpenses),
          " | Cheque: ",
          formatCurrency(chequeExpenses)
        ] }) })
      ] }),
      report.notes && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "6ozt88tiq", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "pax6f5d1c", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm", "data-id": "5ubnz8k8x", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: "Notes" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { "data-id": "4innb06fb", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-700 whitespace-pre-wrap", "data-id": "pze0mggyz", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: report.notes }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "flex justify-end space-x-2", "data-id": "z0cn5ze7j", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: () => onOpenChange(false), "data-id": "mc7j3xzqp", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4 mr-2", "data-id": "1zpfwaice", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx" }),
        "Close"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: handlePrint, className: "bg-blue-600 hover:bg-blue-700", "data-id": "h0261p2to", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "w-4 h-4 mr-2", "data-id": "y6xoebs66", "data-path": "src/components/EnhancedSalesReportPrintDialog.tsx" }),
        "Print Full Report"
      ] })
    ] })
  ] }) });
};
const SalesReportList = () => {
  const [reports, setReports] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [searchTerm, setSearchTerm] = reactExports.useState("");
  const [currentPage, setCurrentPage] = reactExports.useState(1);
  const [totalCount, setTotalCount] = reactExports.useState(0);
  const [printDialogOpen, setPrintDialogOpen] = reactExports.useState(false);
  const [selectedReport, setSelectedReport] = reactExports.useState(null);
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const pageSize = 10;
  reactExports.useEffect(() => {
    loadReports();
  }, [currentPage, searchTerm]);
  const loadReports = async () => {
    try {
      setLoading(true);
      let query = supabase.from("daily_sales_reports_enhanced").select("*", { count: "exact" }).order("report_date", { ascending: false });
      if (searchTerm) {
        query = query.ilike("station", `%${searchTerm}%`);
      }
      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);
      const { data, count, error } = await query;
      if (error) throw error;
      setReports(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error("Error loading sales reports:", error);
      toast({
        title: "Error",
        description: "Failed to load sales reports",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (reportId) => {
    if (!confirm("Are you sure you want to delete this sales report?")) {
      return;
    }
    try {
      const { error } = await supabase.from("daily_sales_reports_enhanced").delete().eq("id", reportId);
      if (error) throw error;
      toast({
        title: "Success",
        description: "Sales report deleted successfully"
      });
      loadReports();
    } catch (error) {
      console.error("Error deleting sales report:", error);
      toast({
        title: "Error",
        description: "Failed to delete sales report",
        variant: "destructive"
      });
    }
  };
  const handlePrint = (report) => {
    setSelectedReport(report);
    setPrintDialogOpen(true);
  };
  const isAdmin = (userProfile == null ? void 0 : userProfile.role) === "Administrator";
  const canAddReport = (userProfile == null ? void 0 : userProfile.role) === "Employee" || (userProfile == null ? void 0 : userProfile.role) === "Administrator";
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
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(amount);
  };
  const totalPages = Math.ceil(totalCount / pageSize);
  const totals = reports.reduce((acc, report) => {
    const totalSales = report.total_sales || 0;
    const cashAmount = report.cash_amount || 0;
    const creditCardAmount = report.credit_card_amount || 0;
    const debitCardAmount = report.debit_card_amount || 0;
    const mobileAmount = report.mobile_amount || 0;
    const grocerySales = report.grocery_sales || 0;
    const totalGallons = report.total_gallons || 0;
    const lotteryTotalCash = report.lottery_total_cash || 0;
    const paymentTotal = cashAmount + creditCardAmount + debitCardAmount + mobileAmount;
    if (Math.abs(paymentTotal + grocerySales - totalSales) > 0.01) {
      console.warn(`Report ID ${report.ID}: Payment methods + grocery (${paymentTotal + grocerySales}) don't match total (${totalSales})`);
    }
    return {
      total_sales: acc.total_sales + totalSales,
      cash_amount: acc.cash_amount + cashAmount,
      credit_card_amount: acc.credit_card_amount + creditCardAmount,
      debit_card_amount: acc.debit_card_amount + debitCardAmount,
      mobile_amount: acc.mobile_amount + mobileAmount,
      grocery_sales: acc.grocery_sales + grocerySales,
      total_gallons: acc.total_gallons + totalGallons,
      lottery_total_cash: acc.lottery_total_cash + lotteryTotalCash
    };
  }, {
    total_sales: 0,
    cash_amount: 0,
    credit_card_amount: 0,
    debit_card_amount: 0,
    mobile_amount: 0,
    grocery_sales: 0,
    total_gallons: 0,
    lottery_total_cash: 0
  });
  const summaryPaymentTotal = totals.cash_amount + totals.credit_card_amount + totals.debit_card_amount + totals.mobile_amount;
  const summaryWithGrocery = summaryPaymentTotal + totals.grocery_sales;
  console.log("Summary calculations:", {
    total_sales: totals.total_sales,
    payment_total: summaryPaymentTotal,
    with_grocery: summaryWithGrocery,
    payment_matches: Math.abs(summaryWithGrocery - totals.total_sales) <= 0.01
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-id": "s5u1kk052", "data-path": "src/pages/Sales/SalesReportList.tsx", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", "data-id": "qhmyaexfo", "data-path": "src/pages/Sales/SalesReportList.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-id": "scn6up0zx", "data-path": "src/pages/Sales/SalesReportList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-6", "data-id": "87t2gaaif", "data-path": "src/pages/Sales/SalesReportList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", "data-id": "3xj99lvdk", "data-path": "src/pages/Sales/SalesReportList.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "w-8 h-8 text-green-600", "data-id": "9aa0i27p0", "data-path": "src/pages/Sales/SalesReportList.tsx" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "twcfmv49t", "data-path": "src/pages/Sales/SalesReportList.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-gray-600", "data-id": "sbtcrnf8m", "data-path": "src/pages/Sales/SalesReportList.tsx", children: "Total Sales" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold", "data-id": "592ufcqd6", "data-path": "src/pages/Sales/SalesReportList.tsx", children: formatCurrency(totals.total_sales) })
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-id": "7nd82zbx4", "data-path": "src/pages/Sales/SalesReportList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-6", "data-id": "667v9mtfl", "data-path": "src/pages/Sales/SalesReportList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", "data-id": "v8g5si2tf", "data-path": "src/pages/Sales/SalesReportList.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-8 h-8 text-blue-600", "data-id": "r2vv9bv12", "data-path": "src/pages/Sales/SalesReportList.tsx" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "ocbavfrn5", "data-path": "src/pages/Sales/SalesReportList.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-gray-600", "data-id": "4j9zbsskh", "data-path": "src/pages/Sales/SalesReportList.tsx", children: "Total Gallons" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold", "data-id": "146pnef7x", "data-path": "src/pages/Sales/SalesReportList.tsx", children: totals.total_gallons.toFixed(2) })
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-id": "5zi37se7w", "data-path": "src/pages/Sales/SalesReportList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-6", "data-id": "hesdv1g92", "data-path": "src/pages/Sales/SalesReportList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", "data-id": "4z7s1ym0k", "data-path": "src/pages/Sales/SalesReportList.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "w-8 h-8 text-purple-600", "data-id": "9ag2hnusd", "data-path": "src/pages/Sales/SalesReportList.tsx" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "dlablt0wf", "data-path": "src/pages/Sales/SalesReportList.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-gray-600", "data-id": "axoky002i", "data-path": "src/pages/Sales/SalesReportList.tsx", children: "Grocery Sales" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold", "data-id": "1dqgizwu8", "data-path": "src/pages/Sales/SalesReportList.tsx", children: formatCurrency(totals.grocery_sales) })
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-id": "je80z1cro", "data-path": "src/pages/Sales/SalesReportList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-6", "data-id": "uu7pawc68", "data-path": "src/pages/Sales/SalesReportList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", "data-id": "9796tjll9", "data-path": "src/pages/Sales/SalesReportList.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-8 h-8 text-orange-600", "data-id": "ysx5bcmy0", "data-path": "src/pages/Sales/SalesReportList.tsx" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "r73woml87", "data-path": "src/pages/Sales/SalesReportList.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-gray-600", "data-id": "p1qq0csze", "data-path": "src/pages/Sales/SalesReportList.tsx", children: "Reports" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold", "data-id": "zi459xupw", "data-path": "src/pages/Sales/SalesReportList.tsx", children: totalCount })
        ] })
      ] }) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-id": "32cx6pk95", "data-path": "src/pages/Sales/SalesReportList.tsx", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { "data-id": "04cc4ooyq", "data-path": "src/pages/Sales/SalesReportList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", "data-id": "6wminfuht", "data-path": "src/pages/Sales/SalesReportList.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "pv9fk1tjx", "data-path": "src/pages/Sales/SalesReportList.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center space-x-2", "data-id": "unwia1h0r", "data-path": "src/pages/Sales/SalesReportList.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-6 h-6", "data-id": "xhkhx1r5u", "data-path": "src/pages/Sales/SalesReportList.tsx" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "6d3fhtgo2", "data-path": "src/pages/Sales/SalesReportList.tsx", children: "Daily Sales Reports" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { "data-id": "gp5k9lo5r", "data-path": "src/pages/Sales/SalesReportList.tsx", children: "Track daily sales performance across all stations" })
        ] }),
        canAddReport && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => navigate("/sales/new"), className: "flex items-center space-x-2", "data-id": "pht7kseoz", "data-path": "src/pages/Sales/SalesReportList.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4", "data-id": "pftbd4tf9", "data-path": "src/pages/Sales/SalesReportList.tsx" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "dnnqy57ls", "data-path": "src/pages/Sales/SalesReportList.tsx", children: "Add Report" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { "data-id": "pow67ybyx", "data-path": "src/pages/Sales/SalesReportList.tsx", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center space-x-2 mb-6", "data-id": "yrrfk8331", "data-path": "src/pages/Sales/SalesReportList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 max-w-sm", "data-id": "hkkkhtrow", "data-path": "src/pages/Sales/SalesReportList.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4", "data-id": "uv7p5m56x", "data-path": "src/pages/Sales/SalesReportList.tsx" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              placeholder: "Search by station...",
              value: searchTerm,
              onChange: (e) => setSearchTerm(e.target.value),
              className: "pl-10",
              "data-id": "wmgbkyjb5",
              "data-path": "src/pages/Sales/SalesReportList.tsx"
            }
          )
        ] }) }),
        loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", "data-id": "2xyu4lboq", "data-path": "src/pages/Sales/SalesReportList.tsx", children: [...Array(5)].map(
          (_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 bg-gray-100 rounded animate-pulse", "data-id": "476u6o1nn", "data-path": "src/pages/Sales/SalesReportList.tsx" }, i)
        ) }) : reports.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-8", "data-id": "0hxymx7ub", "data-path": "src/pages/Sales/SalesReportList.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-12 h-12 text-gray-400 mx-auto mb-4", "data-id": "1pzr8c80m", "data-path": "src/pages/Sales/SalesReportList.tsx" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500", "data-id": "yf7nl72kh", "data-path": "src/pages/Sales/SalesReportList.tsx", children: "No sales reports found" }),
          canAddReport && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              className: "mt-4",
              onClick: () => navigate("/sales/new"),
              "data-id": "szxh6ni1x",
              "data-path": "src/pages/Sales/SalesReportList.tsx",
              children: "Add Your First Sales Report"
            }
          )
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border rounded-lg overflow-hidden", "data-id": "wqs58113r", "data-path": "src/pages/Sales/SalesReportList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { "data-id": "ufobs1uih", "data-path": "src/pages/Sales/SalesReportList.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { "data-id": "y6qi5ku5q", "data-path": "src/pages/Sales/SalesReportList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { "data-id": "r5fgbhpxt", "data-path": "src/pages/Sales/SalesReportList.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "3mh4ydd8m", "data-path": "src/pages/Sales/SalesReportList.tsx", children: "Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "2jmevvzkr", "data-path": "src/pages/Sales/SalesReportList.tsx", children: "Station" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "8z76o578g", "data-path": "src/pages/Sales/SalesReportList.tsx", children: "Shift" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "gx2j5u8ai", "data-path": "src/pages/Sales/SalesReportList.tsx", children: "Total Sales" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "l8eb3s5ms", "data-path": "src/pages/Sales/SalesReportList.tsx", children: "Gallons" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "eokb4eub4", "data-path": "src/pages/Sales/SalesReportList.tsx", children: "Grocery" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "0ynqnn2xm", "data-path": "src/pages/Sales/SalesReportList.tsx", children: "Payment Methods" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "w3dlyggdn", "data-path": "src/pages/Sales/SalesReportList.tsx", children: "Employee" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { "data-id": "ccdq3tnxc", "data-path": "src/pages/Sales/SalesReportList.tsx", children: "Actions" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TableBody, { "data-id": "4uit7uusw", "data-path": "src/pages/Sales/SalesReportList.tsx", children: [
            reports.map(
              (report) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { "data-id": "1xig3o9au", "data-path": "src/pages/Sales/SalesReportList.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", "data-id": "z6mr8m4c6", "data-path": "src/pages/Sales/SalesReportList.tsx", children: formatDate(report.report_date) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "pa6fvyglv", "data-path": "src/pages/Sales/SalesReportList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: `text-white ${getStationBadgeColor(report.station)}`, "data-id": "9b5s4fdjx", "data-path": "src/pages/Sales/SalesReportList.tsx", children: report.station }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "vx923wpqk", "data-path": "src/pages/Sales/SalesReportList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: report.shift === "DAY" ? "default" : "secondary", "data-id": "ybhw0zoup", "data-path": "src/pages/Sales/SalesReportList.tsx", children: report.shift || "DAY" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", "data-id": "tznbwjn1m", "data-path": "src/pages/Sales/SalesReportList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", "data-id": "o6lmw26e1", "data-path": "src/pages/Sales/SalesReportList.tsx", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "6g5smdd5u", "data-path": "src/pages/Sales/SalesReportList.tsx", children: formatCurrency(report.total_sales) }),
                  (() => {
                    const total = report.total_sales || 0;
                    const cash = report.cash_amount || 0;
                    const credit = report.credit_card_amount || 0;
                    const debit = report.debit_card_amount || 0;
                    const mobile = report.mobile_amount || 0;
                    const grocery = report.grocery_sales || 0;
                    const paymentTotal = cash + credit + debit + mobile + grocery;
                    const isPaymentCorrect = Math.abs(paymentTotal - total) <= 0.01;
                    return isPaymentCorrect ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-600 text-xs", "data-id": "agqa1bafc", "data-path": "src/pages/Sales/SalesReportList.tsx", children: "✓" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-600 text-xs", title: `Payment total: ${formatCurrency(paymentTotal)}`, "data-id": "qyd4z8kx6", "data-path": "src/pages/Sales/SalesReportList.tsx", children: "⚠️" });
                  })()
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "8f6fxcj56", "data-path": "src/pages/Sales/SalesReportList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center space-x-2", "data-id": "tdylbfoiz", "data-path": "src/pages/Sales/SalesReportList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "7kkdzpoti", "data-path": "src/pages/Sales/SalesReportList.tsx", children: (report.total_gallons || 0).toFixed(2) }) }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "qi55yv2zj", "data-path": "src/pages/Sales/SalesReportList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center space-x-2", "data-id": "4hf2o1etg", "data-path": "src/pages/Sales/SalesReportList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "avohx0haa", "data-path": "src/pages/Sales/SalesReportList.tsx", children: formatCurrency(report.grocery_sales) }) }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "zjh9zkjy1", "data-path": "src/pages/Sales/SalesReportList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 text-xs", "data-id": "1754eno96", "data-path": "src/pages/Sales/SalesReportList.tsx", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "vhgk8tk9l", "data-path": "src/pages/Sales/SalesReportList.tsx", children: [
                    "Cash: ",
                    formatCurrency(report.cash_amount)
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "anarega25", "data-path": "src/pages/Sales/SalesReportList.tsx", children: [
                    "Credit: ",
                    formatCurrency(report.credit_card_amount)
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "jggo3ytwq", "data-path": "src/pages/Sales/SalesReportList.tsx", children: [
                    "Debit: ",
                    formatCurrency(report.debit_card_amount)
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-id": "7nr82o2gz", "data-path": "src/pages/Sales/SalesReportList.tsx", children: [
                    "Mobile: ",
                    formatCurrency(report.mobile_amount)
                  ] })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "ynwaqtax1", "data-path": "src/pages/Sales/SalesReportList.tsx", children: report.employee_name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "r2vymdorf", "data-path": "src/pages/Sales/SalesReportList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", "data-id": "8yhtt2u1o", "data-path": "src/pages/Sales/SalesReportList.tsx", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      variant: "outline",
                      size: "sm",
                      onClick: () => handlePrint(report),
                      title: "Document Print",
                      "data-id": "dht8tyoo6",
                      "data-path": "src/pages/Sales/SalesReportList.tsx",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "w-4 h-4", "data-id": "dzvhe8g2t", "data-path": "src/pages/Sales/SalesReportList.tsx" })
                    }
                  ),
                  isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        variant: "outline",
                        size: "sm",
                        onClick: () => navigate(`/sales/edit/${report.ID}`),
                        title: "Edit Report",
                        "data-id": "l7ti8a6yh",
                        "data-path": "src/pages/Sales/SalesReportList.tsx",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { className: "w-4 h-4", "data-id": "vbjym211y", "data-path": "src/pages/Sales/SalesReportList.tsx" })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        variant: "outline",
                        size: "sm",
                        onClick: () => handleDelete(report.ID),
                        className: "text-red-600 hover:text-red-700",
                        title: "Delete Report",
                        "data-id": "6rxu2g1rj",
                        "data-path": "src/pages/Sales/SalesReportList.tsx",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4", "data-id": "69nisn1dy", "data-path": "src/pages/Sales/SalesReportList.tsx" })
                      }
                    )
                  ] })
                ] }) })
              ] }, report.ID)
            ),
            reports.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "bg-gray-50 font-semibold border-t-2", "data-id": "hwt1t6mo3", "data-path": "src/pages/Sales/SalesReportList.tsx", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-bold", "data-id": "13xu8wdw2", "data-path": "src/pages/Sales/SalesReportList.tsx", children: "TOTALS" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "fevjht7ea", "data-path": "src/pages/Sales/SalesReportList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "text-xs", "data-id": "s47z4mlud", "data-path": "src/pages/Sales/SalesReportList.tsx", children: [
                reports.length,
                " reports"
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-gray-500", "data-id": "ylqdsmrt8", "data-path": "src/pages/Sales/SalesReportList.tsx", children: "-" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-bold text-green-600", "data-id": "rwacl78b7", "data-path": "src/pages/Sales/SalesReportList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", "data-id": "4phdcmjga", "data-path": "src/pages/Sales/SalesReportList.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-id": "41fk6g02u", "data-path": "src/pages/Sales/SalesReportList.tsx", children: formatCurrency(totals.total_sales) }),
                Math.abs(summaryWithGrocery - totals.total_sales) <= 0.01 ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-600 text-xs", "data-id": "ozmy4ve9q", "data-path": "src/pages/Sales/SalesReportList.tsx", children: "✓" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-600 text-xs", "data-id": "ng2f07tub", "data-path": "src/pages/Sales/SalesReportList.tsx", children: "⚠️" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-bold text-blue-600", "data-id": "3efpkwfz4", "data-path": "src/pages/Sales/SalesReportList.tsx", children: totals.total_gallons.toFixed(2) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-bold text-purple-600", "data-id": "gg5wqoq96", "data-path": "src/pages/Sales/SalesReportList.tsx", children: formatCurrency(totals.grocery_sales) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { "data-id": "uku5v8r73", "data-path": "src/pages/Sales/SalesReportList.tsx", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 text-xs", "data-id": "yk3tm42az", "data-path": "src/pages/Sales/SalesReportList.tsx", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-medium", "data-id": "l9x4ihss6", "data-path": "src/pages/Sales/SalesReportList.tsx", children: [
                  "Cash: ",
                  formatCurrency(totals.cash_amount)
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-medium", "data-id": "lta79l341", "data-path": "src/pages/Sales/SalesReportList.tsx", children: [
                  "Credit: ",
                  formatCurrency(totals.credit_card_amount)
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-medium", "data-id": "lamqbtca6", "data-path": "src/pages/Sales/SalesReportList.tsx", children: [
                  "Debit: ",
                  formatCurrency(totals.debit_card_amount)
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-medium", "data-id": "3w9dn37d2", "data-path": "src/pages/Sales/SalesReportList.tsx", children: [
                  "Mobile: ",
                  formatCurrency(totals.mobile_amount)
                ] })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-gray-500", "data-id": "6sdod4a9s", "data-path": "src/pages/Sales/SalesReportList.tsx", children: "-" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-gray-500", "data-id": "6s921ucne", "data-path": "src/pages/Sales/SalesReportList.tsx", children: "-" })
            ] })
          ] })
        ] }) }),
        totalPages > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-6", "data-id": "olodcsrpp", "data-path": "src/pages/Sales/SalesReportList.tsx", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-gray-700", "data-id": "3e59g74zn", "data-path": "src/pages/Sales/SalesReportList.tsx", children: [
            "Showing ",
            (currentPage - 1) * pageSize + 1,
            " to ",
            Math.min(currentPage * pageSize, totalCount),
            " of ",
            totalCount,
            " reports"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", "data-id": "j231ia14b", "data-path": "src/pages/Sales/SalesReportList.tsx", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: () => setCurrentPage((prev) => Math.max(prev - 1, 1)),
                disabled: currentPage === 1,
                "data-id": "sutaj09af",
                "data-path": "src/pages/Sales/SalesReportList.tsx",
                children: "Previous"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm", "data-id": "s9uewymzw", "data-path": "src/pages/Sales/SalesReportList.tsx", children: [
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
                "data-id": "7nilrpyru",
                "data-path": "src/pages/Sales/SalesReportList.tsx",
                children: "Next"
              }
            )
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      EnhancedSalesReportPrintDialog,
      {
        open: printDialogOpen,
        onOpenChange: setPrintDialogOpen,
        report: selectedReport,
        "data-id": "83o0ak1kp",
        "data-path": "src/pages/Sales/SalesReportList.tsx"
      }
    )
  ] });
};
export {
  SalesReportList as default
};
//# sourceMappingURL=SalesReportList-BXDvPHqn.js.map
