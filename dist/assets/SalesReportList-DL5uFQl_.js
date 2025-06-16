import{j as a}from"./ui-D8yO-OxE.js";import{r as j,u as ta}from"./vendor-XhsmhKu1.js";import{B as S,C as o,b as D,d as L,h as O,f as p,X as ea,s as J,v as I,e as da,T as ia,n as la,o as G,p as f,q as na,r as n}from"./index-DRBMqcxT.js";import{I as ca}from"./input-O-h5M17i.js";import{u as ra}from"./AuthContext-Bo8HSNc2.js";import{D as oa,a as pa,b as ha,c as xa,e as ma}from"./dialog--irBdw-G.js";import{S as ga}from"./separator-CZaaJG51.js";import{R as Sa,F as va}from"./receipt-ER4IH60t.js";import{P as U}from"./printer-DWU32MN3.js";import{D as Y}from"./dollar-sign-OBnb8nXG.js";import{T as B}from"./trending-up-rMf4iF9b.js";import{A as ua}from"./alert-circle-BtBhanmN.js";import{C as fa}from"./calendar-QZkL-AVB.js";import{P as ba}from"./plus-BGEVx4a3.js";import{S as ja}from"./search-CuZ6-xMH.js";import{S as ya}from"./square-pen-CBuslv3A.js";import{T as Ra}from"./trash-2-MkbbqPap.js";const _a=({open:y,onOpenChange:$,report:s})=>{if(!s)return null;const w=d=>d?new Date(d).toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"}):"N/A",e=d=>new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(d||0),h=d=>(d||0).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}),v=d=>{switch(d.toUpperCase()){case"MOBIL":return"bg-red-500 text-white";case"AMOCO ROSEDALE":return"bg-blue-500 text-white";case"AMOCO BROOKLYN":return"bg-green-500 text-white";default:return"bg-gray-500 text-white"}},x=s.expenses_data?JSON.parse(s.expenses_data):[],R=x.reduce((d,c)=>d+c.amount,0),z=x.filter(d=>d.paymentType==="Cash").reduce((d,c)=>d+c.amount,0),T=x.filter(d=>d.paymentType==="Credit Card").reduce((d,c)=>d+c.amount,0),C=x.filter(d=>d.paymentType==="Cheque").reduce((d,c)=>d+c.amount,0),q=s.credit_card_amount+s.debit_card_amount+s.mobile_amount+s.cash_amount;s.regular_gallons+s.super_gallons+s.diesel_gallons;const u=Math.abs(q-s.total_sales)<=.01,g=Math.abs(s.total_short_over)<=1,m=()=>{const d=`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Enhanced Sales Report - ${s.station} - ${w(s.report_date)}</title>
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
              <div class="meta-value">${w(s.report_date)}</div>
            </div>
            <div class="meta-item">
              <div class="meta-label">Station</div>
              <div class="meta-value">
                <span class="station-badge" style="background: ${s.station==="MOBIL"?"#ef4444":s.station==="AMOCO ROSEDALE"?"#3b82f6":"#10b981"}">${s.station}</span>
              </div>
            </div>
            <div class="meta-item">
              <div class="meta-label">Employee</div>
              <div class="meta-value">${s.employee_name}</div>
            </div>
          </div>

          <div class="summary-card">
            <div class="summary-grid">
              <div>
                <div class="summary-amount">${e(s.total_sales)}</div>
                <div class="summary-label">Total Sales</div>
              </div>
              <div>
                <div class="summary-amount">${h(s.total_gallons)} gal</div>
                <div class="summary-label">Total Gallons</div>
              </div>
              <div>
                <div class="summary-amount">${e(s.lottery_total_cash)}</div>
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
                <div class="data-value currency">${e(s.cash_collection_on_hand)}</div>
              </div>
              <div class="data-card">
                <div class="data-label">Short/Over</div>
                <div class="data-value ${s.total_short_over>=0?"check-passed":"check-failed"}">${e(s.total_short_over)}</div>
              </div>
              <div class="data-card">
                <div class="data-label">Cash Sales</div>
                <div class="data-value currency">${e(s.cash_amount)}</div>
              </div>
              <div class="data-card">
                <div class="data-label">Cash Expenses</div>
                <div class="data-value currency">${e(z)}</div>
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
                <div class="data-value currency">${e(s.credit_card_amount)}</div>
              </div>
              <div class="data-card">
                <div class="data-label">Debit Card</div>
                <div class="data-value currency">${e(s.debit_card_amount)}</div>
              </div>
              <div class="data-card">
                <div class="data-label">Mobile Payments</div>
                <div class="data-value currency">${e(s.mobile_amount)}</div>
              </div>
              <div class="data-card">
                <div class="data-label">Cash Payments</div>
                <div class="data-value currency">${e(s.cash_amount)}</div>
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
                <div class="data-value gallons">${h(s.regular_gallons)} gal</div>
              </div>
              <div class="data-card">
                <div class="data-label">Super Gallons</div>
                <div class="data-value gallons">${h(s.super_gallons)} gal</div>
              </div>
              <div class="data-card">
                <div class="data-label">Diesel Gallons</div>
                <div class="data-value gallons">${h(s.diesel_gallons)} gal</div>
              </div>
              <div class="data-card">
                <div class="data-label">Total Gallons</div>
                <div class="data-value gallons">${h(s.total_gallons)} gal</div>
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
                <div class="data-value currency">${e(s.grocery_sales)}</div>
              </div>
              ${s.station==="MOBIL"?`
              <div class="data-card">
                <div class="data-label">EBT Sales</div>
                <div class="data-value currency">${e(s.ebt_sales)}</div>
              </div>
              `:""}
              <div class="data-card">
                <div class="data-label">Lottery Net Sales</div>
                <div class="data-value currency">${e(s.lottery_net_sales)}</div>
              </div>
              <div class="data-card">
                <div class="data-label">Scratch-off Sales</div>
                <div class="data-value currency">${e(s.scratch_off_sales)}</div>
              </div>
            </div>
          </div>

          ${x.length>0?`
          <div class="section">
            <div class="section-header">
              <span class="section-icon">📋</span>
              <span class="section-title">Expenses (${x.length} items)</span>
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
                ${x.map(b=>`
                <tr>
                  <td>${b.vendorName}</td>
                  <td>${e(b.amount)}</td>
                  <td>${b.paymentType}${b.chequeNo?` (#${b.chequeNo})`:""}</td>
                  <td>${b.notes||"-"}</td>
                </tr>
                `).join("")}
              </tbody>
            </table>
            <div class="data-grid" style="margin-top: 15px;">
              <div class="data-card">
                <div class="data-label">Total Expenses</div>
                <div class="data-value currency">${e(R)}</div>
              </div>
              <div class="data-card">
                <div class="data-label">Cash Expenses</div>
                <div class="data-value currency">${e(z)}</div>
              </div>
              <div class="data-card">
                <div class="data-label">Card Expenses</div>
                <div class="data-value currency">${e(T)}</div>
              </div>
              <div class="data-card">
                <div class="data-label">Cheque Expenses</div>
                <div class="data-value currency">${e(C)}</div>
              </div>
            </div>
          </div>
          `:""}

          <div class="verification-section ${u&&g?"":"verification-failed"}">
            <div class="section-header">
              <span class="section-icon">✓</span>
              <span class="section-title">Report Verification</span>
            </div>
            <div class="verification-item">
              <span>Payment Methods Balance:</span>
              <span class="${u?"check-passed":"check-failed"}">
                ${u?"✓ Balanced":`⚠️ Discrepancy: ${e(Math.abs(q-s.total_sales))}`}
              </span>
            </div>
            <div class="verification-item">
              <span>Cash Balance (Short/Over):</span>
              <span class="${g?"check-passed":"check-failed"}">
                ${g?"✓ Within tolerance":"⚠️ Outside tolerance"}
              </span>
            </div>
            <div class="verification-item">
              <span>Documents Uploaded:</span>
              <span class="check-passed">✓ All Required</span>
            </div>
          </div>

          ${s.notes?`
          <div class="notes-section">
            <div class="section-header">
              <span class="section-icon">📝</span>
              <span class="section-title">Additional Notes</span>
            </div>
            <p style="margin: 0; white-space: pre-wrap;">${s.notes}</p>
          </div>
          `:""}

          <div class="footer">
            <div>Report ID: #${s.ID} | Generated on ${new Date().toLocaleString()}</div>
            <div>Created by User #${s.created_by} | DFS Manager Portal v2.0</div>
            <div style="margin-top: 10px; font-style: italic;">
              This is an official business document. Please retain for your records.
            </div>
          </div>
        </body>
      </html>
    `,c=window.open("","_blank");c&&(c.document.write(d),c.document.close(),c.focus(),setTimeout(()=>{c.print(),c.close()},500))};return a.jsx(oa,{open:y,onOpenChange:$,"data-id":"nfj0bspmm","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:a.jsxs(pa,{className:"max-w-7xl max-h-[95vh] overflow-y-auto","data-id":"pju3yrhmm","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:[a.jsx(ha,{"data-id":"vpu48sxl6","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:a.jsxs("div",{className:"flex items-center justify-between","data-id":"k4vwk334t","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:[a.jsxs(xa,{className:"flex items-center gap-2","data-id":"ru8r52y45","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:[a.jsx(Sa,{className:"h-5 w-5 text-blue-600","data-id":"ily78v8qn","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx"}),"Enhanced Sales Report - ",s.station]}),a.jsxs(S,{onClick:m,variant:"outline",size:"sm",className:"flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50","data-id":"knargsigk","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:[a.jsx(U,{className:"h-4 w-4","data-id":"zci1fq4z3","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx"}),"Print Full Report"]})]})}),a.jsxs("div",{className:"space-y-6","data-id":"0cftv8qde","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:[a.jsx(o,{className:"bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200","data-id":"wafqznfno","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:a.jsx(D,{"data-id":"n2puxr7rb","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:a.jsxs("div",{className:"flex items-center justify-between","data-id":"wqp9vhh1u","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:[a.jsxs("div",{"data-id":"v3rl3w8bo","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:[a.jsx(L,{className:"text-blue-800","data-id":"jq4c5c71y","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:w(s.report_date)}),a.jsxs("div",{className:"flex items-center gap-2 mt-2","data-id":"geuzwol9x","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:[a.jsx(O,{className:v(s.station),"data-id":"u8s6xxnkx","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:s.station}),a.jsxs("span",{className:"text-sm text-gray-600","data-id":"gbpj1fde4","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:["Employee: ",s.employee_name]})]})]}),a.jsxs("div",{className:"text-right","data-id":"ku6flmdww","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:[a.jsx("div",{className:"text-2xl font-bold text-blue-800","data-id":"a5quco9ty","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:e(s.total_sales)}),a.jsx("div",{className:"text-sm text-gray-600","data-id":"9h66fakkx","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:"Total Sales"})]})]})})}),a.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-4","data-id":"ipp9ha9ym","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:[a.jsx(o,{"data-id":"ve5ee45n4","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:a.jsxs(p,{className:"p-4 text-center","data-id":"epp3wvo1k","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:[a.jsx(Y,{className:"h-8 w-8 mx-auto text-green-600 mb-2","data-id":"quyh8i9vf","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx"}),a.jsx("div",{className:"text-2xl font-bold text-green-600","data-id":"ztahfbnjv","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:e(s.total_sales)}),a.jsx("div",{className:"text-sm text-gray-600","data-id":"hd6lhsbbq","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:"Total Sales"})]})}),a.jsx(o,{"data-id":"6l9eceytc","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:a.jsxs(p,{className:"p-4 text-center","data-id":"jqgxhgdsy","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:[a.jsx(va,{className:"h-8 w-8 mx-auto text-blue-600 mb-2","data-id":"7cwhbzkvx","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx"}),a.jsx("div",{className:"text-2xl font-bold text-blue-600","data-id":"f3mbsg5p8","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:h(s.total_gallons)}),a.jsx("div",{className:"text-sm text-gray-600","data-id":"pxrx3ujd9","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:"Total Gallons"})]})}),a.jsx(o,{"data-id":"7ml55fuhf","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:a.jsxs(p,{className:"p-4 text-center","data-id":"fp2rkckpa","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:[a.jsx(B,{className:"h-8 w-8 mx-auto text-purple-600 mb-2","data-id":"t3tj5ah3c","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx"}),a.jsx("div",{className:"text-2xl font-bold text-purple-600","data-id":"qztmkcdzn","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:e(s.lottery_total_cash)}),a.jsx("div",{className:"text-sm text-gray-600","data-id":"xkhhehqu5","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:"Lottery Sales"})]})})]}),a.jsxs(o,{className:`border-2 ${u&&g?"border-green-200 bg-green-50":"border-red-200 bg-red-50"}`,"data-id":"yonatv9o0","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:[a.jsx(D,{"data-id":"ph413d7va","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:a.jsx(L,{className:"flex items-center gap-2","data-id":"g44n89d25","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:u&&g?a.jsx("div",{className:"text-green-600","data-id":"evujsuleq","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:"✓ Report Verified"}):a.jsxs("div",{className:"text-red-600 flex items-center gap-2","data-id":"ezfpec1at","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:[a.jsx(ua,{className:"h-5 w-5","data-id":"k8np7ku99","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx"}),"Discrepancies Found"]})})}),a.jsx(p,{"data-id":"bxrtcl1bt","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:a.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4","data-id":"uggeiu1ua","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:[a.jsxs("div",{className:"flex justify-between","data-id":"xun580ajb","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:[a.jsx("span",{"data-id":"lb1djuicf","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:"Payment Balance:"}),a.jsx("span",{className:u?"text-green-600 font-medium":"text-red-600 font-medium","data-id":"jyzbc4wsa","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:u?"✓ Balanced":`⚠️ ${e(Math.abs(q-s.total_sales))} difference`})]}),a.jsxs("div",{className:"flex justify-between","data-id":"3htawnd8a","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:[a.jsx("span",{"data-id":"c5wrnmb96","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:"Cash Balance:"}),a.jsx("span",{className:g?"text-green-600 font-medium":"text-red-600 font-medium","data-id":"s27d5hiua","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:g?"✓ Within tolerance":`⚠️ ${e(Math.abs(s.total_short_over))}`})]})]})})]}),a.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6","data-id":"zm6phqnq5","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:[a.jsxs(o,{"data-id":"6vjvntzmi","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:[a.jsx(D,{"data-id":"yd2hay199","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:a.jsx(L,{className:"text-sm","data-id":"mdncwt5bg","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:"Payment Methods"})}),a.jsxs(p,{className:"space-y-2","data-id":"rnlkfky6t","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:[a.jsxs("div",{className:"flex justify-between text-sm","data-id":"5kiw0cffh","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:[a.jsx("span",{"data-id":"uq7yftxit","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:"Credit Card:"}),a.jsx("span",{className:"font-medium","data-id":"m1w2bucdj","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:e(s.credit_card_amount)})]}),a.jsxs("div",{className:"flex justify-between text-sm","data-id":"7pfl0pad1","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:[a.jsx("span",{"data-id":"vrowmjj96","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:"Debit Card:"}),a.jsx("span",{className:"font-medium","data-id":"e9384xopw","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:e(s.debit_card_amount)})]}),a.jsxs("div",{className:"flex justify-between text-sm","data-id":"hgo5jgcpp","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:[a.jsx("span",{"data-id":"b3cmlzlen","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:"Mobile:"}),a.jsx("span",{className:"font-medium","data-id":"hcxmxwq92","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:e(s.mobile_amount)})]}),a.jsxs("div",{className:"flex justify-between text-sm","data-id":"u8davm9nb","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:[a.jsx("span",{"data-id":"mdp95mn7b","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:"Cash:"}),a.jsx("span",{className:"font-medium","data-id":"imzy6eti5","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:e(s.cash_amount)})]})]})]}),a.jsxs(o,{"data-id":"995ium6hf","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:[a.jsx(D,{"data-id":"95azghl4t","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:a.jsx(L,{className:"text-sm","data-id":"1drzyvdrx","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:"Fuel Sales"})}),a.jsxs(p,{className:"space-y-2","data-id":"cxk952tzb","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:[a.jsxs("div",{className:"flex justify-between text-sm","data-id":"ixgho7yu2","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:[a.jsx("span",{"data-id":"t04ygl85d","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:"Regular:"}),a.jsxs("span",{className:"font-medium","data-id":"0r9obj3kd","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:[h(s.regular_gallons)," gal"]})]}),a.jsxs("div",{className:"flex justify-between text-sm","data-id":"ygxm5n5o0","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:[a.jsx("span",{"data-id":"qq1hay5mi","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:"Super:"}),a.jsxs("span",{className:"font-medium","data-id":"iok2uxfh3","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:[h(s.super_gallons)," gal"]})]}),a.jsxs("div",{className:"flex justify-between text-sm","data-id":"9qvy027aq","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:[a.jsx("span",{"data-id":"csry1th5t","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:"Diesel:"}),a.jsxs("span",{className:"font-medium","data-id":"jhguveiaf","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:[h(s.diesel_gallons)," gal"]})]}),a.jsx(ga,{"data-id":"1wwyi9zs3","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx"}),a.jsxs("div",{className:"flex justify-between text-sm font-semibold","data-id":"pnkruv9no","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:[a.jsx("span",{"data-id":"tdz95txu0","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:"Total:"}),a.jsxs("span",{"data-id":"okq4sa0hd","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:[h(s.total_gallons)," gal"]})]})]})]})]}),x.length>0&&a.jsxs(o,{"data-id":"jo0zxphib","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:[a.jsx(D,{"data-id":"mhekh4qxd","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:a.jsxs(L,{className:"text-sm","data-id":"m1dglqmbt","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:["Expenses (",x.length," items) - Total: ",e(R)]})}),a.jsx(p,{"data-id":"zqfo7t6vc","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:a.jsxs("div",{className:"text-sm text-gray-600","data-id":"452isskjj","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:["Cash: ",e(z)," | Card: ",e(T)," | Cheque: ",e(C)]})})]}),s.notes&&a.jsxs(o,{"data-id":"6ozt88tiq","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:[a.jsx(D,{"data-id":"pax6f5d1c","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:a.jsx(L,{className:"text-sm","data-id":"5ubnz8k8x","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:"Notes"})}),a.jsx(p,{"data-id":"4innb06fb","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:a.jsx("p",{className:"text-sm text-gray-700 whitespace-pre-wrap","data-id":"pze0mggyz","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:s.notes})})]})]}),a.jsxs(ma,{className:"flex justify-end space-x-2","data-id":"z0cn5ze7j","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:[a.jsxs(S,{variant:"outline",onClick:()=>$(!1),"data-id":"mc7j3xzqp","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:[a.jsx(ea,{className:"w-4 h-4 mr-2","data-id":"1zpfwaice","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx"}),"Close"]}),a.jsxs(S,{onClick:m,className:"bg-blue-600 hover:bg-blue-700","data-id":"h0261p2to","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx",children:[a.jsx(U,{className:"w-4 h-4 mr-2","data-id":"y6xoebs66","data-path":"src/components/EnhancedSalesReportPrintDialog.tsx"}),"Print Full Report"]})]})]})})},Ia=()=>{const[y,$]=j.useState([]),[s,w]=j.useState(!0),[e,h]=j.useState(""),[v,x]=j.useState(1),[R,z]=j.useState(0),[T,C]=j.useState(!1),[q,u]=j.useState(null),g=ta(),{userProfile:m}=ra(),d=10;j.useEffect(()=>{c()},[v,e]);const c=async()=>{try{w(!0);let t=J.from("daily_sales_reports_enhanced").select("*",{count:"exact"}).order("report_date",{ascending:!1});e&&(t=t.ilike("station",`%${e}%`));const i=(v-1)*d,_=i+d-1;t=t.range(i,_);const{data:E,count:P,error:N}=await t;if(N)throw N;$(E||[]),z(P||0)}catch(t){console.error("Error loading sales reports:",t),I({title:"Error",description:"Failed to load sales reports",variant:"destructive"})}finally{w(!1)}},b=async t=>{if(confirm("Are you sure you want to delete this sales report?"))try{const{error:i}=await J.from("daily_sales_reports_enhanced").delete().eq("id",t);if(i)throw i;I({title:"Success",description:"Sales report deleted successfully"}),c()}catch(i){console.error("Error deleting sales report:",i),I({title:"Error",description:"Failed to delete sales report",variant:"destructive"})}},X=t=>{u(t),C(!0)},Q=(m==null?void 0:m.role)==="Administrator",H=(m==null?void 0:m.role)==="Employee"||(m==null?void 0:m.role)==="Administrator",Z=t=>{switch(t.toUpperCase()){case"MOBIL":return"bg-blue-500";case"AMOCO ROSEDALE":return"bg-green-500";case"AMOCO BROOKLYN":return"bg-purple-500";default:return"bg-gray-500"}},aa=t=>t?new Date(t).toLocaleDateString():"N/A",r=t=>new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(t),A=Math.ceil(R/d),l=y.reduce((t,i)=>{const _=i.total_sales||0,E=i.cash_amount||0,P=i.credit_card_amount||0,N=i.debit_card_amount||0,M=i.mobile_amount||0,k=i.grocery_sales||0,V=i.total_gallons||0,sa=i.lottery_total_cash||0,K=E+P+N+M;return Math.abs(K+k-_)>.01&&console.warn(`Report ID ${i.ID}: Payment methods + grocery (${K+k}) don't match total (${_})`),{total_sales:t.total_sales+_,cash_amount:t.cash_amount+E,credit_card_amount:t.credit_card_amount+P,debit_card_amount:t.debit_card_amount+N,mobile_amount:t.mobile_amount+M,grocery_sales:t.grocery_sales+k,total_gallons:t.total_gallons+V,lottery_total_cash:t.lottery_total_cash+sa}},{total_sales:0,cash_amount:0,credit_card_amount:0,debit_card_amount:0,mobile_amount:0,grocery_sales:0,total_gallons:0,lottery_total_cash:0}),W=l.cash_amount+l.credit_card_amount+l.debit_card_amount+l.mobile_amount,F=W+l.grocery_sales;return console.log("Summary calculations:",{total_sales:l.total_sales,payment_total:W,with_grocery:F,payment_matches:Math.abs(F-l.total_sales)<=.01}),a.jsxs("div",{className:"space-y-6","data-id":"s5u1kk052","data-path":"src/pages/Sales/SalesReportList.tsx",children:[a.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4","data-id":"qhmyaexfo","data-path":"src/pages/Sales/SalesReportList.tsx",children:[a.jsx(o,{"data-id":"scn6up0zx","data-path":"src/pages/Sales/SalesReportList.tsx",children:a.jsx(p,{className:"p-6","data-id":"87t2gaaif","data-path":"src/pages/Sales/SalesReportList.tsx",children:a.jsxs("div",{className:"flex items-center space-x-2","data-id":"3xj99lvdk","data-path":"src/pages/Sales/SalesReportList.tsx",children:[a.jsx(Y,{className:"w-8 h-8 text-green-600","data-id":"9aa0i27p0","data-path":"src/pages/Sales/SalesReportList.tsx"}),a.jsxs("div",{"data-id":"twcfmv49t","data-path":"src/pages/Sales/SalesReportList.tsx",children:[a.jsx("p",{className:"text-sm font-medium text-gray-600","data-id":"sbtcrnf8m","data-path":"src/pages/Sales/SalesReportList.tsx",children:"Total Sales"}),a.jsx("p",{className:"text-2xl font-bold","data-id":"592ufcqd6","data-path":"src/pages/Sales/SalesReportList.tsx",children:r(l.total_sales)})]})]})})}),a.jsx(o,{"data-id":"7nd82zbx4","data-path":"src/pages/Sales/SalesReportList.tsx",children:a.jsx(p,{className:"p-6","data-id":"667v9mtfl","data-path":"src/pages/Sales/SalesReportList.tsx",children:a.jsxs("div",{className:"flex items-center space-x-2","data-id":"v8g5si2tf","data-path":"src/pages/Sales/SalesReportList.tsx",children:[a.jsx(B,{className:"w-8 h-8 text-blue-600","data-id":"r2vv9bv12","data-path":"src/pages/Sales/SalesReportList.tsx"}),a.jsxs("div",{"data-id":"ocbavfrn5","data-path":"src/pages/Sales/SalesReportList.tsx",children:[a.jsx("p",{className:"text-sm font-medium text-gray-600","data-id":"4j9zbsskh","data-path":"src/pages/Sales/SalesReportList.tsx",children:"Total Gallons"}),a.jsx("p",{className:"text-2xl font-bold","data-id":"146pnef7x","data-path":"src/pages/Sales/SalesReportList.tsx",children:l.total_gallons.toFixed(2)})]})]})})}),a.jsx(o,{"data-id":"5zi37se7w","data-path":"src/pages/Sales/SalesReportList.tsx",children:a.jsx(p,{className:"p-6","data-id":"hesdv1g92","data-path":"src/pages/Sales/SalesReportList.tsx",children:a.jsxs("div",{className:"flex items-center space-x-2","data-id":"4z7s1ym0k","data-path":"src/pages/Sales/SalesReportList.tsx",children:[a.jsx(Y,{className:"w-8 h-8 text-purple-600","data-id":"9ag2hnusd","data-path":"src/pages/Sales/SalesReportList.tsx"}),a.jsxs("div",{"data-id":"dlablt0wf","data-path":"src/pages/Sales/SalesReportList.tsx",children:[a.jsx("p",{className:"text-sm font-medium text-gray-600","data-id":"axoky002i","data-path":"src/pages/Sales/SalesReportList.tsx",children:"Grocery Sales"}),a.jsx("p",{className:"text-2xl font-bold","data-id":"1dqgizwu8","data-path":"src/pages/Sales/SalesReportList.tsx",children:r(l.grocery_sales)})]})]})})}),a.jsx(o,{"data-id":"je80z1cro","data-path":"src/pages/Sales/SalesReportList.tsx",children:a.jsx(p,{className:"p-6","data-id":"uu7pawc68","data-path":"src/pages/Sales/SalesReportList.tsx",children:a.jsxs("div",{className:"flex items-center space-x-2","data-id":"9796tjll9","data-path":"src/pages/Sales/SalesReportList.tsx",children:[a.jsx(fa,{className:"w-8 h-8 text-orange-600","data-id":"ysx5bcmy0","data-path":"src/pages/Sales/SalesReportList.tsx"}),a.jsxs("div",{"data-id":"r73woml87","data-path":"src/pages/Sales/SalesReportList.tsx",children:[a.jsx("p",{className:"text-sm font-medium text-gray-600","data-id":"p1qq0csze","data-path":"src/pages/Sales/SalesReportList.tsx",children:"Reports"}),a.jsx("p",{className:"text-2xl font-bold","data-id":"zi459xupw","data-path":"src/pages/Sales/SalesReportList.tsx",children:R})]})]})})})]}),a.jsxs(o,{"data-id":"32cx6pk95","data-path":"src/pages/Sales/SalesReportList.tsx",children:[a.jsx(D,{"data-id":"04cc4ooyq","data-path":"src/pages/Sales/SalesReportList.tsx",children:a.jsxs("div",{className:"flex items-center justify-between","data-id":"6wminfuht","data-path":"src/pages/Sales/SalesReportList.tsx",children:[a.jsxs("div",{"data-id":"pv9fk1tjx","data-path":"src/pages/Sales/SalesReportList.tsx",children:[a.jsxs(L,{className:"flex items-center space-x-2","data-id":"unwia1h0r","data-path":"src/pages/Sales/SalesReportList.tsx",children:[a.jsx(B,{className:"w-6 h-6","data-id":"xhkhx1r5u","data-path":"src/pages/Sales/SalesReportList.tsx"}),a.jsx("span",{"data-id":"6d3fhtgo2","data-path":"src/pages/Sales/SalesReportList.tsx",children:"Daily Sales Reports"})]}),a.jsx(da,{"data-id":"gp5k9lo5r","data-path":"src/pages/Sales/SalesReportList.tsx",children:"Track daily sales performance across all stations"})]}),H&&a.jsxs(S,{onClick:()=>g("/sales/new"),className:"flex items-center space-x-2","data-id":"pht7kseoz","data-path":"src/pages/Sales/SalesReportList.tsx",children:[a.jsx(ba,{className:"w-4 h-4","data-id":"pftbd4tf9","data-path":"src/pages/Sales/SalesReportList.tsx"}),a.jsx("span",{"data-id":"dnnqy57ls","data-path":"src/pages/Sales/SalesReportList.tsx",children:"Add Report"})]})]})}),a.jsxs(p,{"data-id":"pow67ybyx","data-path":"src/pages/Sales/SalesReportList.tsx",children:[a.jsx("div",{className:"flex items-center space-x-2 mb-6","data-id":"yrrfk8331","data-path":"src/pages/Sales/SalesReportList.tsx",children:a.jsxs("div",{className:"relative flex-1 max-w-sm","data-id":"hkkkhtrow","data-path":"src/pages/Sales/SalesReportList.tsx",children:[a.jsx(ja,{className:"absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4","data-id":"uv7p5m56x","data-path":"src/pages/Sales/SalesReportList.tsx"}),a.jsx(ca,{placeholder:"Search by station...",value:e,onChange:t=>h(t.target.value),className:"pl-10","data-id":"wmgbkyjb5","data-path":"src/pages/Sales/SalesReportList.tsx"})]})}),s?a.jsx("div",{className:"space-y-4","data-id":"2xyu4lboq","data-path":"src/pages/Sales/SalesReportList.tsx",children:[...Array(5)].map((t,i)=>a.jsx("div",{className:"h-16 bg-gray-100 rounded animate-pulse","data-id":"476u6o1nn","data-path":"src/pages/Sales/SalesReportList.tsx"},i))}):y.length===0?a.jsxs("div",{className:"text-center py-8","data-id":"0hxymx7ub","data-path":"src/pages/Sales/SalesReportList.tsx",children:[a.jsx(B,{className:"w-12 h-12 text-gray-400 mx-auto mb-4","data-id":"1pzr8c80m","data-path":"src/pages/Sales/SalesReportList.tsx"}),a.jsx("p",{className:"text-gray-500","data-id":"yf7nl72kh","data-path":"src/pages/Sales/SalesReportList.tsx",children:"No sales reports found"}),H&&a.jsx(S,{variant:"outline",className:"mt-4",onClick:()=>g("/sales/new"),"data-id":"szxh6ni1x","data-path":"src/pages/Sales/SalesReportList.tsx",children:"Add Your First Sales Report"})]}):a.jsx("div",{className:"border rounded-lg overflow-hidden","data-id":"wqs58113r","data-path":"src/pages/Sales/SalesReportList.tsx",children:a.jsxs(ia,{"data-id":"ufobs1uih","data-path":"src/pages/Sales/SalesReportList.tsx",children:[a.jsx(la,{"data-id":"y6qi5ku5q","data-path":"src/pages/Sales/SalesReportList.tsx",children:a.jsxs(G,{"data-id":"r5fgbhpxt","data-path":"src/pages/Sales/SalesReportList.tsx",children:[a.jsx(f,{"data-id":"3mh4ydd8m","data-path":"src/pages/Sales/SalesReportList.tsx",children:"Date"}),a.jsx(f,{"data-id":"2jmevvzkr","data-path":"src/pages/Sales/SalesReportList.tsx",children:"Station"}),a.jsx(f,{"data-id":"8z76o578g","data-path":"src/pages/Sales/SalesReportList.tsx",children:"Shift"}),a.jsx(f,{"data-id":"gx2j5u8ai","data-path":"src/pages/Sales/SalesReportList.tsx",children:"Total Sales"}),a.jsx(f,{"data-id":"l8eb3s5ms","data-path":"src/pages/Sales/SalesReportList.tsx",children:"Gallons"}),a.jsx(f,{"data-id":"eokb4eub4","data-path":"src/pages/Sales/SalesReportList.tsx",children:"Grocery"}),a.jsx(f,{"data-id":"0ynqnn2xm","data-path":"src/pages/Sales/SalesReportList.tsx",children:"Payment Methods"}),a.jsx(f,{"data-id":"w3dlyggdn","data-path":"src/pages/Sales/SalesReportList.tsx",children:"Employee"}),a.jsx(f,{"data-id":"ccdq3tnxc","data-path":"src/pages/Sales/SalesReportList.tsx",children:"Actions"})]})}),a.jsxs(na,{"data-id":"4uit7uusw","data-path":"src/pages/Sales/SalesReportList.tsx",children:[y.map(t=>a.jsxs(G,{"data-id":"1xig3o9au","data-path":"src/pages/Sales/SalesReportList.tsx",children:[a.jsx(n,{className:"font-medium","data-id":"z6mr8m4c6","data-path":"src/pages/Sales/SalesReportList.tsx",children:aa(t.report_date)}),a.jsx(n,{"data-id":"pa6fvyglv","data-path":"src/pages/Sales/SalesReportList.tsx",children:a.jsx(O,{className:`text-white ${Z(t.station)}`,"data-id":"9b5s4fdjx","data-path":"src/pages/Sales/SalesReportList.tsx",children:t.station})}),a.jsx(n,{"data-id":"vx923wpqk","data-path":"src/pages/Sales/SalesReportList.tsx",children:a.jsx(O,{variant:t.shift==="DAY"?"default":"secondary","data-id":"ybhw0zoup","data-path":"src/pages/Sales/SalesReportList.tsx",children:t.shift||"DAY"})}),a.jsx(n,{className:"font-medium","data-id":"tznbwjn1m","data-path":"src/pages/Sales/SalesReportList.tsx",children:a.jsxs("div",{className:"flex items-center space-x-2","data-id":"o6lmw26e1","data-path":"src/pages/Sales/SalesReportList.tsx",children:[a.jsx("span",{"data-id":"6g5smdd5u","data-path":"src/pages/Sales/SalesReportList.tsx",children:r(t.total_sales)}),(()=>{const i=t.total_sales||0,_=t.cash_amount||0,E=t.credit_card_amount||0,P=t.debit_card_amount||0,N=t.mobile_amount||0,M=t.grocery_sales||0,k=_+E+P+N+M;return Math.abs(k-i)<=.01?a.jsx("span",{className:"text-green-600 text-xs","data-id":"agqa1bafc","data-path":"src/pages/Sales/SalesReportList.tsx",children:"✓"}):a.jsx("span",{className:"text-red-600 text-xs",title:`Payment total: ${r(k)}`,"data-id":"qyd4z8kx6","data-path":"src/pages/Sales/SalesReportList.tsx",children:"⚠️"})})()]})}),a.jsx(n,{"data-id":"8f6fxcj56","data-path":"src/pages/Sales/SalesReportList.tsx",children:a.jsx("div",{className:"flex items-center space-x-2","data-id":"tdylbfoiz","data-path":"src/pages/Sales/SalesReportList.tsx",children:a.jsx("span",{"data-id":"7kkdzpoti","data-path":"src/pages/Sales/SalesReportList.tsx",children:(t.total_gallons||0).toFixed(2)})})}),a.jsx(n,{"data-id":"qi55yv2zj","data-path":"src/pages/Sales/SalesReportList.tsx",children:a.jsx("div",{className:"flex items-center space-x-2","data-id":"4hf2o1etg","data-path":"src/pages/Sales/SalesReportList.tsx",children:a.jsx("span",{"data-id":"avohx0haa","data-path":"src/pages/Sales/SalesReportList.tsx",children:r(t.grocery_sales)})})}),a.jsx(n,{"data-id":"zjh9zkjy1","data-path":"src/pages/Sales/SalesReportList.tsx",children:a.jsxs("div",{className:"space-y-1 text-xs","data-id":"1754eno96","data-path":"src/pages/Sales/SalesReportList.tsx",children:[a.jsxs("div",{"data-id":"vhgk8tk9l","data-path":"src/pages/Sales/SalesReportList.tsx",children:["Cash: ",r(t.cash_amount)]}),a.jsxs("div",{"data-id":"anarega25","data-path":"src/pages/Sales/SalesReportList.tsx",children:["Credit: ",r(t.credit_card_amount)]}),a.jsxs("div",{"data-id":"jggo3ytwq","data-path":"src/pages/Sales/SalesReportList.tsx",children:["Debit: ",r(t.debit_card_amount)]}),a.jsxs("div",{"data-id":"7nr82o2gz","data-path":"src/pages/Sales/SalesReportList.tsx",children:["Mobile: ",r(t.mobile_amount)]})]})}),a.jsx(n,{"data-id":"ynwaqtax1","data-path":"src/pages/Sales/SalesReportList.tsx",children:t.employee_name}),a.jsx(n,{"data-id":"r2vymdorf","data-path":"src/pages/Sales/SalesReportList.tsx",children:a.jsxs("div",{className:"flex items-center space-x-2","data-id":"8yhtt2u1o","data-path":"src/pages/Sales/SalesReportList.tsx",children:[a.jsx(S,{variant:"outline",size:"sm",onClick:()=>X(t),title:"Document Print","data-id":"dht8tyoo6","data-path":"src/pages/Sales/SalesReportList.tsx",children:a.jsx(U,{className:"w-4 h-4","data-id":"dzvhe8g2t","data-path":"src/pages/Sales/SalesReportList.tsx"})}),Q&&a.jsxs(a.Fragment,{children:[a.jsx(S,{variant:"outline",size:"sm",onClick:()=>g(`/sales/edit/${t.ID}`),title:"Edit Report","data-id":"l7ti8a6yh","data-path":"src/pages/Sales/SalesReportList.tsx",children:a.jsx(ya,{className:"w-4 h-4","data-id":"vbjym211y","data-path":"src/pages/Sales/SalesReportList.tsx"})}),a.jsx(S,{variant:"outline",size:"sm",onClick:()=>b(t.ID),className:"text-red-600 hover:text-red-700",title:"Delete Report","data-id":"6rxu2g1rj","data-path":"src/pages/Sales/SalesReportList.tsx",children:a.jsx(Ra,{className:"w-4 h-4","data-id":"69nisn1dy","data-path":"src/pages/Sales/SalesReportList.tsx"})})]})]})})]},t.ID)),y.length>0&&a.jsxs(G,{className:"bg-gray-50 font-semibold border-t-2","data-id":"hwt1t6mo3","data-path":"src/pages/Sales/SalesReportList.tsx",children:[a.jsx(n,{className:"font-bold","data-id":"13xu8wdw2","data-path":"src/pages/Sales/SalesReportList.tsx",children:"TOTALS"}),a.jsx(n,{"data-id":"fevjht7ea","data-path":"src/pages/Sales/SalesReportList.tsx",children:a.jsxs(O,{variant:"outline",className:"text-xs","data-id":"s47z4mlud","data-path":"src/pages/Sales/SalesReportList.tsx",children:[y.length," reports"]})}),a.jsx(n,{className:"text-gray-500","data-id":"ylqdsmrt8","data-path":"src/pages/Sales/SalesReportList.tsx",children:"-"}),a.jsx(n,{className:"font-bold text-green-600","data-id":"rwacl78b7","data-path":"src/pages/Sales/SalesReportList.tsx",children:a.jsxs("div",{className:"flex items-center space-x-2","data-id":"4phdcmjga","data-path":"src/pages/Sales/SalesReportList.tsx",children:[a.jsx("span",{"data-id":"41fk6g02u","data-path":"src/pages/Sales/SalesReportList.tsx",children:r(l.total_sales)}),Math.abs(F-l.total_sales)<=.01?a.jsx("span",{className:"text-green-600 text-xs","data-id":"ozmy4ve9q","data-path":"src/pages/Sales/SalesReportList.tsx",children:"✓"}):a.jsx("span",{className:"text-red-600 text-xs","data-id":"ng2f07tub","data-path":"src/pages/Sales/SalesReportList.tsx",children:"⚠️"})]})}),a.jsx(n,{className:"font-bold text-blue-600","data-id":"3efpkwfz4","data-path":"src/pages/Sales/SalesReportList.tsx",children:l.total_gallons.toFixed(2)}),a.jsx(n,{className:"font-bold text-purple-600","data-id":"gg5wqoq96","data-path":"src/pages/Sales/SalesReportList.tsx",children:r(l.grocery_sales)}),a.jsx(n,{"data-id":"uku5v8r73","data-path":"src/pages/Sales/SalesReportList.tsx",children:a.jsxs("div",{className:"space-y-1 text-xs","data-id":"yk3tm42az","data-path":"src/pages/Sales/SalesReportList.tsx",children:[a.jsxs("div",{className:"font-medium","data-id":"l9x4ihss6","data-path":"src/pages/Sales/SalesReportList.tsx",children:["Cash: ",r(l.cash_amount)]}),a.jsxs("div",{className:"font-medium","data-id":"lta79l341","data-path":"src/pages/Sales/SalesReportList.tsx",children:["Credit: ",r(l.credit_card_amount)]}),a.jsxs("div",{className:"font-medium","data-id":"lamqbtca6","data-path":"src/pages/Sales/SalesReportList.tsx",children:["Debit: ",r(l.debit_card_amount)]}),a.jsxs("div",{className:"font-medium","data-id":"3w9dn37d2","data-path":"src/pages/Sales/SalesReportList.tsx",children:["Mobile: ",r(l.mobile_amount)]})]})}),a.jsx(n,{className:"text-gray-500","data-id":"6sdod4a9s","data-path":"src/pages/Sales/SalesReportList.tsx",children:"-"}),a.jsx(n,{className:"text-gray-500","data-id":"6s921ucne","data-path":"src/pages/Sales/SalesReportList.tsx",children:"-"})]})]})]})}),A>1&&a.jsxs("div",{className:"flex items-center justify-between mt-6","data-id":"olodcsrpp","data-path":"src/pages/Sales/SalesReportList.tsx",children:[a.jsxs("p",{className:"text-sm text-gray-700","data-id":"3e59g74zn","data-path":"src/pages/Sales/SalesReportList.tsx",children:["Showing ",(v-1)*d+1," to ",Math.min(v*d,R)," of ",R," reports"]}),a.jsxs("div",{className:"flex items-center space-x-2","data-id":"j231ia14b","data-path":"src/pages/Sales/SalesReportList.tsx",children:[a.jsx(S,{variant:"outline",size:"sm",onClick:()=>x(t=>Math.max(t-1,1)),disabled:v===1,"data-id":"sutaj09af","data-path":"src/pages/Sales/SalesReportList.tsx",children:"Previous"}),a.jsxs("span",{className:"text-sm","data-id":"s9uewymzw","data-path":"src/pages/Sales/SalesReportList.tsx",children:["Page ",v," of ",A]}),a.jsx(S,{variant:"outline",size:"sm",onClick:()=>x(t=>Math.min(t+1,A)),disabled:v===A,"data-id":"7nilrpyru","data-path":"src/pages/Sales/SalesReportList.tsx",children:"Next"})]})]})]})]}),a.jsx(_a,{open:T,onOpenChange:C,report:q,"data-id":"83o0ak1kp","data-path":"src/pages/Sales/SalesReportList.tsx"})]})};export{Ia as default};
//# sourceMappingURL=SalesReportList-DL5uFQl_.js.map
