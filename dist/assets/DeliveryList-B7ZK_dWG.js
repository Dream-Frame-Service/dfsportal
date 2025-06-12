import{j as a,u as J,r as p}from"./react-vendor-BIZaP1tt.js";import{D as Q,t as Z,v as R,w as aa,B as x,C as r,d as f,e as b,l as I,g as n,X as A,Y as ea,u as ta,s as sa,I as ia,S as da,h as ra,i as na,j as la,k as F,z as ca,E as oa,F as M,G as g,H as pa,J as u}from"./admin-core-B2SBlvpM.js";import{ay as T,aM as B,bw as q,$ as xa,H as ha,X as va,aC as V,a1 as ma,b8 as ga,aB as ua}from"./ui-components-Ace1hSxE.js";import"./vendor-DfVw5h9R.js";import"./aws-sdk-n3W_cRwv.js";import"./supabase-D_JhUDtQ.js";const Da=({open:k,onOpenChange:_,delivery:e,afterDeliveryReport:i})=>{if(!e)return null;const L=d=>d?new Date(d).toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"}):"N/A",t=d=>(d||0).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}),D=d=>{switch(d.toUpperCase()){case"MOBIL":return"bg-red-500 text-white";case"AMOCO ROSEDALE":return"bg-blue-500 text-white";case"AMOCO BROOKLYN":return"bg-green-500 text-white";default:return"bg-gray-500 text-white"}},$=d=>{switch(d.toLowerCase()){case"verified":return"text-green-600";case"discrepancy found":return"text-red-600";case"pending review":return"text-yellow-600";default:return"text-gray-600"}},c=e.regular_tank_volume+e.plus_tank_volume+e.super_tank_volume,o=e.regular_delivered+e.plus_delivered+e.super_delivered,l=c+o,j=i?i.regular_tank_final+i.plus_tank_final+i.super_tank_final:0,h=i?Math.abs(l-j):0,v=h>5,N=e.regular_tank_volume+e.regular_delivered,w=e.plus_tank_volume+e.plus_delivered,P=e.super_tank_volume+e.super_delivered,E=()=>{const d=`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Fuel Delivery Report - ${e.bol_number||`Record #${e.id}`}</title>
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
              font-size: 18px;
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
            .fuel-grid {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 15px;
            }
            .data-card {
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              padding: 15px;
              background: #ffffff;
              text-align: center;
            }
            .fuel-card {
              border: 2px solid;
              border-radius: 10px;
              padding: 20px;
              text-align: center;
            }
            .fuel-regular {
              border-color: #3b82f6;
              background: #eff6ff;
            }
            .fuel-plus {
              border-color: #10b981;
              background: #f0fdf4;
            }
            .fuel-super {
              border-color: #8b5cf6;
              background: #faf5ff;
            }
            .fuel-total {
              border-color: #f59e0b;
              background: #fffbeb;
            }
            .data-label {
              font-size: 12px;
              color: #6b7280;
              text-transform: uppercase;
              font-weight: 600;
              margin-bottom: 8px;
            }
            .data-value {
              font-size: 18px;
              font-weight: bold;
              color: #1f2937;
            }
            .fuel-amount {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 5px;
            }
            .fuel-label {
              font-size: 12px;
              color: #6b7280;
              font-weight: 600;
            }
            .comparison-table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 15px;
            }
            .comparison-table th,
            .comparison-table td {
              padding: 12px;
              text-align: center;
              border: 1px solid #e5e7eb;
            }
            .comparison-table th {
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
            .verification-warning {
              background: #fffbeb;
              border-color: #f59e0b;
            }
            .verification-error {
              background: #fef2f2;
              border-color: #ef4444;
            }
            .status-verified {
              color: #059669;
              font-weight: bold;
            }
            .status-warning {
              color: #d97706;
              font-weight: bold;
            }
            .status-error {
              color: #dc2626;
              font-weight: bold;
            }
            .notes-section {
              background: #fffbeb;
              border-left: 4px solid #f59e0b;
              padding: 15px;
              margin: 20px 0;
            }
            .footer {
              margin-top: 40px;
              text-align: center;
              font-size: 11px;
              color: #6b7280;
              border-top: 1px solid #e5e7eb;
              padding-top: 20px;
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
            <div class="report-title">Fuel Delivery Report - Enhanced</div>
          </div>

          <div class="report-meta">
            <div class="meta-item">
              <div class="meta-label">Delivery Date</div>
              <div class="meta-value">${L(e.delivery_date)}</div>
            </div>
            <div class="meta-item">
              <div class="meta-label">Station</div>
              <div class="meta-value">
                <span class="station-badge" style="background: ${e.station==="MOBIL"?"#ef4444":e.station==="AMOCO ROSEDALE"?"#3b82f6":"#10b981"}">${e.station}</span>
              </div>
            </div>
            <div class="meta-item">
              <div class="meta-label">BOL Number</div>
              <div class="meta-value">${e.bol_number||"Not Assigned"}</div>
            </div>
          </div>

          <div class="section">
            <div class="section-header">
              <span class="section-icon">📊</span>
              <span class="section-title">Delivery Summary</span>
            </div>
            <div class="data-grid">
              <div class="data-card">
                <div class="data-label">Record ID</div>
                <div class="data-value">#${e.id}</div>
              </div>
              <div class="data-card">
                <div class="data-label">Total Delivered</div>
                <div class="data-value">${t(o)} gal</div>
              </div>
              <div class="data-card">
                <div class="data-label">Total Before</div>
                <div class="data-value">${t(c)} gal</div>
              </div>
              <div class="data-card">
                <div class="data-label">Expected Total After</div>
                <div class="data-value">${t(l)} gal</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-header">
              <span class="section-icon">⛽</span>
              <span class="section-title">Tank Volumes Before Delivery</span>
            </div>
            <div class="fuel-grid">
              <div class="fuel-card fuel-regular">
                <div class="fuel-amount">${t(e.regular_tank_volume)}</div>
                <div class="fuel-label">Regular Tank (gal)</div>
              </div>
              <div class="fuel-card fuel-plus">
                <div class="fuel-amount">${t(e.plus_tank_volume)}</div>
                <div class="fuel-label">Plus Tank (gal)</div>
              </div>
              <div class="fuel-card fuel-super">
                <div class="fuel-amount">${t(e.super_tank_volume)}</div>
                <div class="fuel-label">Super Tank (gal)</div>
              </div>
              <div class="fuel-card fuel-total">
                <div class="fuel-amount">${t(c)}</div>
                <div class="fuel-label">Total Volume (gal)</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-header">
              <span class="section-icon">🚛</span>
              <span class="section-title">Fuel Delivered</span>
            </div>
            <div class="fuel-grid">
              <div class="fuel-card fuel-regular">
                <div class="fuel-amount">${t(e.regular_delivered)}</div>
                <div class="fuel-label">Regular Delivered (gal)</div>
              </div>
              <div class="fuel-card fuel-plus">
                <div class="fuel-amount">${t(e.plus_delivered)}</div>
                <div class="fuel-label">Plus Delivered (gal)</div>
              </div>
              <div class="fuel-card fuel-super">
                <div class="fuel-amount">${t(e.super_delivered)}</div>
                <div class="fuel-label">Super Delivered (gal)</div>
              </div>
              <div class="fuel-card fuel-total">
                <div class="fuel-amount">${t(o)}</div>
                <div class="fuel-label">Total Delivered (gal)</div>
              </div>
            </div>
          </div>

          ${i?`
          <div class="section">
            <div class="section-header">
              <span class="section-icon">✅</span>
              <span class="section-title">Post-Delivery Verification</span>
            </div>
            <table class="comparison-table">
              <thead>
                <tr>
                  <th>Tank Type</th>
                  <th>Before Delivery</th>
                  <th>Delivered</th>
                  <th>Expected After</th>
                  <th>Actual After</th>
                  <th>Difference</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Regular</strong></td>
                  <td>${t(e.regular_tank_volume)}</td>
                  <td>${t(e.regular_delivered)}</td>
                  <td>${t(N)}</td>
                  <td>${t(i.regular_tank_final)}</td>
                  <td class="${Math.abs(N-i.regular_tank_final)<=2?"status-verified":"status-error"}">
                    ${t(Math.abs(N-i.regular_tank_final))}
                  </td>
                </tr>
                <tr>
                  <td><strong>Plus</strong></td>
                  <td>${t(e.plus_tank_volume)}</td>
                  <td>${t(e.plus_delivered)}</td>
                  <td>${t(w)}</td>
                  <td>${t(i.plus_tank_final)}</td>
                  <td class="${Math.abs(w-i.plus_tank_final)<=2?"status-verified":"status-error"}">
                    ${t(Math.abs(w-i.plus_tank_final))}
                  </td>
                </tr>
                <tr>
                  <td><strong>Super</strong></td>
                  <td>${t(e.super_tank_volume)}</td>
                  <td>${t(e.super_delivered)}</td>
                  <td>${t(P)}</td>
                  <td>${t(i.super_tank_final)}</td>
                  <td class="${Math.abs(P-i.super_tank_final)<=2?"status-verified":"status-error"}">
                    ${t(Math.abs(P-i.super_tank_final))}
                  </td>
                </tr>
                <tr style="border-top: 2px solid #374151; font-weight: bold;">
                  <td><strong>TOTAL</strong></td>
                  <td>${t(c)}</td>
                  <td>${t(o)}</td>
                  <td>${t(l)}</td>
                  <td>${t(j)}</td>
                  <td class="${v?"status-error":"status-verified"}">
                    ${t(h)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="verification-section ${v?"verification-error":"verification-section"}">
            <div class="section-header">
              <span class="section-icon">${v?"⚠️":"✅"}</span>
              <span class="section-title">Verification Status</span>
            </div>
            <div class="data-grid">
              <div class="data-card">
                <div class="data-label">Status</div>
                <div class="data-value ${$(i.verification_status)}">${i.verification_status}</div>
              </div>
              <div class="data-card">
                <div class="data-label">Tank Temperature</div>
                <div class="data-value">${i.tank_temperature}°F</div>
              </div>
              <div class="data-card">
                <div class="data-label">Reported By</div>
                <div class="data-value">${i.reported_by}</div>
              </div>
              <div class="data-card">
                <div class="data-label">Supervisor Approval</div>
                <div class="data-value ${i.supervisor_approval?"status-verified":"status-warning"}">
                  ${i.supervisor_approval?"✅ Approved":"⏳ Pending"}
                </div>
              </div>
            </div>
            ${i.discrepancy_notes?`
            <div style="margin-top: 15px; padding: 10px; background: #fef2f2; border-radius: 5px;">
              <strong>Discrepancy Notes:</strong><br>
              ${i.discrepancy_notes}
            </div>
            `:""}
          </div>
          `:`
          <div class="verification-section verification-warning">
            <div class="section-header">
              <span class="section-icon">⏳</span>
              <span class="section-title">Verification Pending</span>
            </div>
            <p>Post-delivery tank verification has not been completed yet. Please ensure tank levels are measured and recorded after the delivery is complete.</p>
          </div>
          `}

          ${e.delivery_notes?`
          <div class="notes-section">
            <div class="section-header">
              <span class="section-icon">📝</span>
              <span class="section-title">Delivery Notes</span>
            </div>
            <p style="margin: 0; white-space: pre-wrap;">${e.delivery_notes}</p>
          </div>
          `:""}

          ${i&&i.additional_notes?`
          <div class="notes-section">
            <div class="section-header">
              <span class="section-icon">📋</span>
              <span class="section-title">Additional Verification Notes</span>
            </div>
            <p style="margin: 0; white-space: pre-wrap;">${i.additional_notes}</p>
          </div>
          `:""}

          <div class="footer">
            <div>Delivery Record ID: #${e.id} | Generated on ${new Date().toLocaleString()}</div>
            <div>Created by User #${e.created_by} | DFS Manager Portal v2.0</div>
            ${i?`<div>Verification Report ID: #${i.id} | Verified by User #${i.created_by}</div>`:""}
            <div style="margin-top: 10px; font-style: italic;">
              This is an official fuel delivery document. Please retain for your records and regulatory compliance.
            </div>
          </div>
        </body>
      </html>
    `,m=window.open("","_blank");m&&(m.document.write(d),m.document.close(),m.focus(),setTimeout(()=>{m.print(),m.close()},500))};return a.jsx(Q,{open:k,onOpenChange:_,"data-id":"7g13qjo8k","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:a.jsxs(Z,{className:"max-w-6xl max-h-[95vh] overflow-y-auto","data-id":"j17bwjjg9","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:[a.jsx(R,{"data-id":"bvxic7ih2","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:a.jsxs("div",{className:"flex items-center justify-between","data-id":"j7nb9ss9d","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:[a.jsxs(aa,{className:"flex items-center gap-2","data-id":"3236vkw03","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:[a.jsx(T,{className:"h-5 w-5 text-blue-600","data-id":"t0re7zq71","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx"}),"Enhanced Delivery Report - ",e.bol_number||`Record #${e.id}`]}),a.jsxs(x,{onClick:E,variant:"outline",size:"sm",className:"flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50","data-id":"ixdigii21","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:[a.jsx(B,{className:"h-4 w-4","data-id":"gxj77kg79","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx"}),"Print Full Report"]})]})}),a.jsxs("div",{className:"space-y-6","data-id":"lf5navhp2","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:[a.jsx(r,{className:"bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200","data-id":"lcj3od2ui","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:a.jsx(f,{"data-id":"z2isggh5t","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:a.jsxs("div",{className:"flex items-center justify-between","data-id":"hx2bq16dn","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:[a.jsxs("div",{"data-id":"dpdnrmtdv","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:[a.jsx(b,{className:"text-blue-800","data-id":"3i1y28o6k","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:L(e.delivery_date)}),a.jsxs("div",{className:"flex items-center gap-2 mt-2","data-id":"89zun3ij9","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:[a.jsx(I,{className:D(e.station),"data-id":"7mbuerl9t","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:e.station}),a.jsxs("span",{className:"text-sm text-gray-600","data-id":"606ftoww7","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:["BOL: ",e.bol_number||"Not Assigned"]})]})]}),a.jsxs("div",{className:"text-right","data-id":"0hyzw7gzn","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:[a.jsxs("div",{className:"text-2xl font-bold text-blue-800","data-id":"nje360opo","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:[t(o)," gal"]}),a.jsx("div",{className:"text-sm text-gray-600","data-id":"ormc4ftan","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:"Total Delivered"})]})]})})}),a.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-4 gap-4","data-id":"wc048v04l","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:[a.jsx(r,{"data-id":"gqfofa4k5","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:a.jsxs(n,{className:"p-4 text-center","data-id":"2iuaacmlt","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:[a.jsx(q,{className:"h-8 w-8 mx-auto text-blue-600 mb-2","data-id":"cfdolijx4","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx"}),a.jsx("div",{className:"text-2xl font-bold text-blue-600","data-id":"727oac79j","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:t(e.regular_delivered)}),a.jsx("div",{className:"text-sm text-gray-600","data-id":"0sdbcu1bd","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:"Regular Delivered"})]})}),a.jsx(r,{"data-id":"lq1wonm1s","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:a.jsxs(n,{className:"p-4 text-center","data-id":"ho1eajel4","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:[a.jsx(q,{className:"h-8 w-8 mx-auto text-green-600 mb-2","data-id":"0rxh03drn","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx"}),a.jsx("div",{className:"text-2xl font-bold text-green-600","data-id":"6fhsuk8d1","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:t(e.plus_delivered)}),a.jsx("div",{className:"text-sm text-gray-600","data-id":"xfg59ov4e","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:"Plus Delivered"})]})}),a.jsx(r,{"data-id":"0ddvpuqwj","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:a.jsxs(n,{className:"p-4 text-center","data-id":"wsxw0qk2h","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:[a.jsx(q,{className:"h-8 w-8 mx-auto text-purple-600 mb-2","data-id":"ika4j6xag","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx"}),a.jsx("div",{className:"text-2xl font-bold text-purple-600","data-id":"k4k5aayho","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:t(e.super_delivered)}),a.jsx("div",{className:"text-sm text-gray-600","data-id":"fvk8d5e3u","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:"Super Delivered"})]})}),a.jsx(r,{"data-id":"11pw4nroz","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:a.jsxs(n,{className:"p-4 text-center","data-id":"0xxt3j7o9","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:[a.jsx(xa,{className:"h-8 w-8 mx-auto text-orange-600 mb-2","data-id":"zaukfk2tk","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx"}),a.jsx("div",{className:"text-2xl font-bold text-orange-600","data-id":"adg47x8yx","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:t(o)}),a.jsx("div",{className:"text-sm text-gray-600","data-id":"dcczxwqm6","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:"Total Delivered"})]})})]}),i&&a.jsxs(r,{className:`border-2 ${v?"border-red-200 bg-red-50":"border-green-200 bg-green-50"}`,"data-id":"t51rskvbu","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:[a.jsx(f,{"data-id":"7dusxrkyh","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:a.jsx(b,{className:"flex items-center gap-2","data-id":"o38ujh6uy","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:v?a.jsxs("div",{className:"text-red-600 flex items-center gap-2","data-id":"lhvgsrspb","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:[a.jsx(ha,{className:"h-5 w-5","data-id":"9j27r0ouc","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx"}),"Volume Discrepancy Detected"]}):a.jsx("div",{className:"text-green-600","data-id":"xb9yns53y","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:"✓ Delivery Verified"})})}),a.jsx(n,{"data-id":"43i2jorpi","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:a.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4","data-id":"jtpbjdme6","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:[a.jsxs("div",{className:"flex justify-between","data-id":"3rakvduqm","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:[a.jsx("span",{"data-id":"bk84rgg5m","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:"Status:"}),a.jsx("span",{className:`font-medium ${$(i.verification_status)}`,"data-id":"mm5ugrpjj","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:i.verification_status})]}),a.jsxs("div",{className:"flex justify-between","data-id":"ptx2jj91h","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:[a.jsx("span",{"data-id":"fihlgburt","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:"Temperature:"}),a.jsxs("span",{className:"font-medium","data-id":"l22zkk605","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:[i.tank_temperature,"°F"]})]}),a.jsxs("div",{className:"flex justify-between","data-id":"kroxszmas","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:[a.jsx("span",{"data-id":"f78zevcuc","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:"Volume Difference:"}),a.jsxs("span",{className:`font-medium ${v?"text-red-600":"text-green-600"}`,"data-id":"5vm0opd5k","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:[t(h)," gal"]})]}),a.jsxs("div",{className:"flex justify-between","data-id":"gv391gcs7","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:[a.jsx("span",{"data-id":"n7yoqx3gz","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:"Supervisor Approval:"}),a.jsx("span",{className:`font-medium ${i.supervisor_approval?"text-green-600":"text-yellow-600"}`,"data-id":"qwl13c12e","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:i.supervisor_approval?"✓ Approved":"⏳ Pending"})]})]})})]}),a.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6","data-id":"ptt5gqur9","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:[a.jsxs(r,{"data-id":"35qlh8wu9","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:[a.jsx(f,{"data-id":"2fpsyf1os","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:a.jsx(b,{className:"text-sm","data-id":"uzpx1tvys","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:"Tank Volumes Before"})}),a.jsxs(n,{className:"space-y-2","data-id":"2qa178cqu","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:[a.jsxs("div",{className:"flex justify-between text-sm","data-id":"ezaffzqap","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:[a.jsx("span",{"data-id":"wz6x9n8ks","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:"Regular:"}),a.jsxs("span",{className:"font-medium","data-id":"hxof07m68","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:[t(e.regular_tank_volume)," gal"]})]}),a.jsxs("div",{className:"flex justify-between text-sm","data-id":"kmwwce6w2","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:[a.jsx("span",{"data-id":"xi4o8ild2","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:"Plus:"}),a.jsxs("span",{className:"font-medium","data-id":"tvz1wupl1","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:[t(e.plus_tank_volume)," gal"]})]}),a.jsxs("div",{className:"flex justify-between text-sm","data-id":"onom9powu","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:[a.jsx("span",{"data-id":"bka7xd1vn","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:"Super:"}),a.jsxs("span",{className:"font-medium","data-id":"fvr7v217o","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:[t(e.super_tank_volume)," gal"]})]}),a.jsx(A,{"data-id":"ikh526tci","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx"}),a.jsxs("div",{className:"flex justify-between text-sm font-semibold","data-id":"l0w4g3i80","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:[a.jsx("span",{"data-id":"vzswt8v21","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:"Total:"}),a.jsxs("span",{"data-id":"rue6d51jb","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:[t(c)," gal"]})]})]})]}),a.jsxs(r,{"data-id":"63u7k1luj","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:[a.jsx(f,{"data-id":"9je631pmj","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:a.jsx(b,{className:"text-sm","data-id":"208n9xoe7","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:"Fuel Delivered"})}),a.jsxs(n,{className:"space-y-2","data-id":"q0h9vcotc","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:[a.jsxs("div",{className:"flex justify-between text-sm","data-id":"xxgj3iqnc","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:[a.jsx("span",{"data-id":"au1gxqybk","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:"Regular:"}),a.jsxs("span",{className:"font-medium text-blue-600","data-id":"vsxkgcepi","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:[t(e.regular_delivered)," gal"]})]}),a.jsxs("div",{className:"flex justify-between text-sm","data-id":"8ws30845l","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:[a.jsx("span",{"data-id":"nji4wytu6","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:"Plus:"}),a.jsxs("span",{className:"font-medium text-green-600","data-id":"nenn6mgbw","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:[t(e.plus_delivered)," gal"]})]}),a.jsxs("div",{className:"flex justify-between text-sm","data-id":"izyqobtvq","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:[a.jsx("span",{"data-id":"wz4qf7jhk","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:"Super:"}),a.jsxs("span",{className:"font-medium text-purple-600","data-id":"dlthzrrep","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:[t(e.super_delivered)," gal"]})]}),a.jsx(A,{"data-id":"rkrmf176z","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx"}),a.jsxs("div",{className:"flex justify-between text-sm font-semibold","data-id":"87cv98346","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:[a.jsx("span",{"data-id":"u199xtboz","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:"Total:"}),a.jsxs("span",{className:"text-orange-600","data-id":"02fzk5mo7","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:[t(o)," gal"]})]})]})]})]}),(e.delivery_notes||i&&i.additional_notes)&&a.jsxs(r,{"data-id":"4u2aml0vh","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:[a.jsx(f,{"data-id":"chi75fm1j","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:a.jsx(b,{className:"text-sm","data-id":"62d291517","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:"Notes"})}),a.jsxs(n,{className:"space-y-3","data-id":"c6oaupdbo","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:[e.delivery_notes&&a.jsxs("div",{"data-id":"4o64w3zc2","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:[a.jsx("div",{className:"text-xs font-medium text-gray-600 mb-1","data-id":"o7cfub9q3","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:"Delivery Notes:"}),a.jsx("p",{className:"text-sm text-gray-700 whitespace-pre-wrap","data-id":"9q56rscwk","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:e.delivery_notes})]}),i&&i.additional_notes&&a.jsxs("div",{"data-id":"q0idl5vbo","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:[a.jsx("div",{className:"text-xs font-medium text-gray-600 mb-1","data-id":"8ha7zrj45","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:"Verification Notes:"}),a.jsx("p",{className:"text-sm text-gray-700 whitespace-pre-wrap","data-id":"w3vh9077p","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:i.additional_notes})]})]})]})]}),a.jsxs(ea,{className:"flex justify-end space-x-2","data-id":"b1t3lsjho","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:[a.jsxs(x,{variant:"outline",onClick:()=>_(!1),"data-id":"su798zt3n","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:[a.jsx(va,{className:"w-4 h-4 mr-2","data-id":"12hryy11e","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx"}),"Close"]}),a.jsxs(x,{onClick:E,className:"bg-blue-600 hover:bg-blue-700","data-id":"n8hgefn5m","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx",children:[a.jsx(B,{className:"w-4 h-4 mr-2","data-id":"03k3j03kp","data-path":"src/components/EnhancedDeliveryPrintDialog.tsx"}),"Print Full Report"]})]})]})})},Pa=()=>{const k=J(),{toast:_}=ta(),[e,i]=p.useState([]),[L,t]=p.useState(!0),[D,$]=p.useState(""),[c,o]=p.useState("all"),[l,j]=p.useState(1),[h,v]=p.useState(0),[N,w]=p.useState(null),[P,E]=p.useState(!1),d=10,m=["MOBIL","AMOCO ROSEDALE","AMOCO BROOKLYN"];p.useEffect(()=>{C()},[l,D,c]);const C=async()=>{try{t(!0);let s=sa.from("delivery_records").select("*",{count:"exact"}).order("delivery_date",{ascending:!1});c!=="all"&&(s=s.eq("station",c)),D&&(s=s.ilike("bol_number",`%${D}%`));const y=(l-1)*d,K=y+d-1,{data:W,error:O,count:X}=await s.range(y,K);if(O)throw O;i(W||[]),v(X||0)}catch(s){console.error("Error loading deliveries:",s),_({title:"Error",description:"Failed to load delivery records",variant:"destructive"})}finally{t(!1)}},H=s=>new Date(s).toLocaleDateString(),z=s=>s.toFixed(2),U=s=>s.regular_delivered+s.plus_delivered+s.super_delivered,Y=s=>{switch(s){case"MOBIL":return"bg-red-100 text-red-800";case"AMOCO ROSEDALE":return"bg-blue-100 text-blue-800";case"AMOCO BROOKLYN":return"bg-green-100 text-green-800";default:return"bg-gray-100 text-gray-800"}},G=s=>{w(s),E(!0)},S=Math.ceil(h/d);return L&&e.length===0?a.jsx("div",{className:"flex items-center justify-center min-h-screen","data-id":"ut549evh3","data-path":"src/pages/Delivery/DeliveryList.tsx",children:a.jsxs("div",{className:"text-center","data-id":"d53pfoe7m","data-path":"src/pages/Delivery/DeliveryList.tsx",children:[a.jsx("div",{className:"animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto","data-id":"eddn1jbfx","data-path":"src/pages/Delivery/DeliveryList.tsx"}),a.jsx("p",{className:"mt-4 text-gray-600","data-id":"ltmk3j3qb","data-path":"src/pages/Delivery/DeliveryList.tsx",children:"Loading delivery records..."})]})}):a.jsxs("div",{className:"container mx-auto px-4 py-6","data-id":"51g5lpbln","data-path":"src/pages/Delivery/DeliveryList.tsx",children:[a.jsxs("div",{className:"mb-6","data-id":"aqns6md1x","data-path":"src/pages/Delivery/DeliveryList.tsx",children:[a.jsxs("div",{className:"flex items-center justify-between mb-4","data-id":"k5341z5kc","data-path":"src/pages/Delivery/DeliveryList.tsx",children:[a.jsxs("div",{className:"flex items-center gap-2","data-id":"r18ht4ueq","data-path":"src/pages/Delivery/DeliveryList.tsx",children:[a.jsx(T,{className:"h-6 w-6 text-blue-600","data-id":"8cgdh2o7o","data-path":"src/pages/Delivery/DeliveryList.tsx"}),a.jsx("h1",{className:"text-2xl font-bold text-gray-900","data-id":"ar6zprqm6","data-path":"src/pages/Delivery/DeliveryList.tsx",children:"Delivery Records"})]}),a.jsxs(x,{onClick:()=>k("/delivery/new"),"data-id":"6qdmreff6","data-path":"src/pages/Delivery/DeliveryList.tsx",children:[a.jsx(V,{className:"mr-2 h-4 w-4","data-id":"ctit9jdlb","data-path":"src/pages/Delivery/DeliveryList.tsx"}),"New Delivery"]})]}),a.jsx(r,{"data-id":"j5si32rec","data-path":"src/pages/Delivery/DeliveryList.tsx",children:a.jsx(n,{className:"pt-6","data-id":"olrgucllu","data-path":"src/pages/Delivery/DeliveryList.tsx",children:a.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-4","data-id":"brgk9wj34","data-path":"src/pages/Delivery/DeliveryList.tsx",children:[a.jsxs("div",{className:"relative","data-id":"s2msberpa","data-path":"src/pages/Delivery/DeliveryList.tsx",children:[a.jsx(ma,{className:"absolute left-3 top-3 h-4 w-4 text-gray-400","data-id":"1hbq9s6c8","data-path":"src/pages/Delivery/DeliveryList.tsx"}),a.jsx(ia,{placeholder:"Search by BOL number...",value:D,onChange:s=>$(s.target.value),className:"pl-10","data-id":"en9388n5p","data-path":"src/pages/Delivery/DeliveryList.tsx"})]}),a.jsx("div",{"data-id":"vx5hukpxy","data-path":"src/pages/Delivery/DeliveryList.tsx",children:a.jsxs(da,{value:c,onValueChange:o,"data-id":"9s9vw3pms","data-path":"src/pages/Delivery/DeliveryList.tsx",children:[a.jsx(ra,{"data-id":"oofmgecc1","data-path":"src/pages/Delivery/DeliveryList.tsx",children:a.jsx(na,{placeholder:"Filter by station","data-id":"mz9dor8mj","data-path":"src/pages/Delivery/DeliveryList.tsx"})}),a.jsxs(la,{"data-id":"p0gvl7hg7","data-path":"src/pages/Delivery/DeliveryList.tsx",children:[a.jsx(F,{value:"all","data-id":"h708aueci","data-path":"src/pages/Delivery/DeliveryList.tsx",children:"All Stations"}),m.map(s=>a.jsx(F,{value:s,"data-id":"q8lwul5eh","data-path":"src/pages/Delivery/DeliveryList.tsx",children:s},s))]})]})}),a.jsx("div",{className:"flex gap-2","data-id":"f2orngb0j","data-path":"src/pages/Delivery/DeliveryList.tsx",children:a.jsxs(x,{variant:"outline",onClick:C,"data-id":"jwyvudwv0","data-path":"src/pages/Delivery/DeliveryList.tsx",children:[a.jsx(ga,{className:"mr-2 h-4 w-4","data-id":"m5lm66588","data-path":"src/pages/Delivery/DeliveryList.tsx"}),"Refresh"]})})]})})})]}),a.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-4 gap-4 mb-6","data-id":"n8zizlvpw","data-path":"src/pages/Delivery/DeliveryList.tsx",children:[a.jsx(r,{"data-id":"qhvtmfclq","data-path":"src/pages/Delivery/DeliveryList.tsx",children:a.jsxs(n,{className:"pt-6","data-id":"44devtjlw","data-path":"src/pages/Delivery/DeliveryList.tsx",children:[a.jsx("div",{className:"text-2xl font-bold text-blue-600","data-id":"mnbmdpbhb","data-path":"src/pages/Delivery/DeliveryList.tsx",children:h}),a.jsx("p",{className:"text-sm text-gray-600","data-id":"lxyxy49k4","data-path":"src/pages/Delivery/DeliveryList.tsx",children:"Total Deliveries"})]})}),a.jsx(r,{"data-id":"pvrh36vwl","data-path":"src/pages/Delivery/DeliveryList.tsx",children:a.jsxs(n,{className:"pt-6","data-id":"9zleb1f85","data-path":"src/pages/Delivery/DeliveryList.tsx",children:[a.jsx("div",{className:"text-2xl font-bold text-green-600","data-id":"28mgu70gk","data-path":"src/pages/Delivery/DeliveryList.tsx",children:e.reduce((s,y)=>s+U(y),0).toFixed(0)}),a.jsx("p",{className:"text-sm text-gray-600","data-id":"13401591a","data-path":"src/pages/Delivery/DeliveryList.tsx",children:"Total Gallons Delivered"})]})}),a.jsx(r,{"data-id":"bre2ydcfr","data-path":"src/pages/Delivery/DeliveryList.tsx",children:a.jsxs(n,{className:"pt-6","data-id":"cw6vqes5n","data-path":"src/pages/Delivery/DeliveryList.tsx",children:[a.jsx("div",{className:"text-2xl font-bold text-purple-600","data-id":"jorsqhbq2","data-path":"src/pages/Delivery/DeliveryList.tsx",children:new Set(e.map(s=>s.station)).size}),a.jsx("p",{className:"text-sm text-gray-600","data-id":"2nbxi3oew","data-path":"src/pages/Delivery/DeliveryList.tsx",children:"Stations Served"})]})}),a.jsx(r,{"data-id":"sdu94cxvi","data-path":"src/pages/Delivery/DeliveryList.tsx",children:a.jsxs(n,{className:"pt-6","data-id":"ptytn7e5i","data-path":"src/pages/Delivery/DeliveryList.tsx",children:[a.jsx("div",{className:"text-2xl font-bold text-orange-600","data-id":"bih73a1pv","data-path":"src/pages/Delivery/DeliveryList.tsx",children:e.filter(s=>new Date(s.delivery_date)>=new Date(Date.now()-7*24*60*60*1e3)).length}),a.jsx("p",{className:"text-sm text-gray-600","data-id":"c2cf8gfkj","data-path":"src/pages/Delivery/DeliveryList.tsx",children:"This Week"})]})})]}),a.jsxs(r,{"data-id":"7w65fe873","data-path":"src/pages/Delivery/DeliveryList.tsx",children:[a.jsx(f,{"data-id":"2dq179bdp","data-path":"src/pages/Delivery/DeliveryList.tsx",children:a.jsx(b,{"data-id":"6l1h3e78q","data-path":"src/pages/Delivery/DeliveryList.tsx",children:"Delivery Records"})}),a.jsx(n,{"data-id":"vj02u6kyz","data-path":"src/pages/Delivery/DeliveryList.tsx",children:e.length===0?a.jsxs("div",{className:"text-center py-8","data-id":"77oi6icmy","data-path":"src/pages/Delivery/DeliveryList.tsx",children:[a.jsx(T,{className:"mx-auto h-12 w-12 text-gray-400 mb-4","data-id":"hrz90e6r0","data-path":"src/pages/Delivery/DeliveryList.tsx"}),a.jsx("p",{className:"text-gray-600","data-id":"84o5waqt8","data-path":"src/pages/Delivery/DeliveryList.tsx",children:"No delivery records found"}),a.jsxs(x,{onClick:()=>k("/delivery/new"),className:"mt-4","data-id":"vw32puxq1","data-path":"src/pages/Delivery/DeliveryList.tsx",children:[a.jsx(V,{className:"mr-2 h-4 w-4","data-id":"h9ybuqdai","data-path":"src/pages/Delivery/DeliveryList.tsx"}),"Add First Delivery"]})]}):a.jsxs(a.Fragment,{children:[a.jsx("div",{className:"overflow-x-auto","data-id":"a4p3un3b6","data-path":"src/pages/Delivery/DeliveryList.tsx",children:a.jsxs(ca,{"data-id":"7tx2aixs3","data-path":"src/pages/Delivery/DeliveryList.tsx",children:[a.jsx(oa,{"data-id":"alqa86996","data-path":"src/pages/Delivery/DeliveryList.tsx",children:a.jsxs(M,{"data-id":"bvq1g3gt4","data-path":"src/pages/Delivery/DeliveryList.tsx",children:[a.jsx(g,{"data-id":"v4da8675j","data-path":"src/pages/Delivery/DeliveryList.tsx",children:"Serial"}),a.jsx(g,{"data-id":"6ucs8z2yi","data-path":"src/pages/Delivery/DeliveryList.tsx",children:"Date"}),a.jsx(g,{"data-id":"epm3geoos","data-path":"src/pages/Delivery/DeliveryList.tsx",children:"BOL Number"}),a.jsx(g,{"data-id":"iemp5n8jh","data-path":"src/pages/Delivery/DeliveryList.tsx",children:"Station Name"}),a.jsx(g,{"data-id":"38mv34k9w","data-path":"src/pages/Delivery/DeliveryList.tsx",children:"Regular (Delivered)"}),a.jsx(g,{"data-id":"5qnblzoka","data-path":"src/pages/Delivery/DeliveryList.tsx",children:"Plus Delivered"}),a.jsx(g,{"data-id":"e4yjtylr1","data-path":"src/pages/Delivery/DeliveryList.tsx",children:"Super Delivered"}),a.jsx(g,{"data-id":"wcktfhiks","data-path":"src/pages/Delivery/DeliveryList.tsx",children:"Full Report"})]})}),a.jsx(pa,{"data-id":"9oyx1ydpg","data-path":"src/pages/Delivery/DeliveryList.tsx",children:e.map((s,y)=>a.jsxs(M,{"data-id":"3kac2fic3","data-path":"src/pages/Delivery/DeliveryList.tsx",children:[a.jsx(u,{className:"font-medium","data-id":"tfr3s47ok","data-path":"src/pages/Delivery/DeliveryList.tsx",children:(l-1)*d+y+1}),a.jsx(u,{className:"font-medium text-gray-900","data-id":"tiw02pi9n","data-path":"src/pages/Delivery/DeliveryList.tsx",children:H(s.delivery_date)}),a.jsx(u,{className:"font-medium text-indigo-600","data-id":"tp7zh6fvi","data-path":"src/pages/Delivery/DeliveryList.tsx",children:s.bol_number||"N/A"}),a.jsx(u,{"data-id":"zkeztif12","data-path":"src/pages/Delivery/DeliveryList.tsx",children:a.jsx(I,{className:Y(s.station),"data-id":"xfphn92yn","data-path":"src/pages/Delivery/DeliveryList.tsx",children:s.station})}),a.jsxs(u,{className:"font-medium text-blue-600","data-id":"nn0las98j","data-path":"src/pages/Delivery/DeliveryList.tsx",children:[z(s.regular_delivered)," gal"]}),a.jsxs(u,{className:"font-medium text-green-600","data-id":"7ywa29n8v","data-path":"src/pages/Delivery/DeliveryList.tsx",children:[z(s.plus_delivered)," gal"]}),a.jsxs(u,{className:"font-medium text-purple-600","data-id":"64tsjavqc","data-path":"src/pages/Delivery/DeliveryList.tsx",children:[z(s.super_delivered)," gal"]}),a.jsx(u,{"data-id":"4ktgcyc4y","data-path":"src/pages/Delivery/DeliveryList.tsx",children:a.jsx(x,{variant:"ghost",size:"sm",onClick:()=>G(s),className:"h-8 w-8 p-0 hover:bg-blue-50","data-id":"5ujbdh052","data-path":"src/pages/Delivery/DeliveryList.tsx",children:a.jsx(ua,{className:"h-4 w-4 text-blue-600","data-id":"rquwmau9p","data-path":"src/pages/Delivery/DeliveryList.tsx"})})})]},s.id))})]})}),S>1&&a.jsxs("div",{className:"flex items-center justify-between mt-4","data-id":"42ak88muf","data-path":"src/pages/Delivery/DeliveryList.tsx",children:[a.jsxs("p",{className:"text-sm text-gray-600","data-id":"maxsj7x94","data-path":"src/pages/Delivery/DeliveryList.tsx",children:["Showing ",(l-1)*d+1," to ",Math.min(l*d,h)," of ",h," records"]}),a.jsxs("div",{className:"flex space-x-2","data-id":"kz1evp82m","data-path":"src/pages/Delivery/DeliveryList.tsx",children:[a.jsx(x,{variant:"outline",size:"sm",onClick:()=>j(s=>Math.max(1,s-1)),disabled:l===1,"data-id":"slt18xieu","data-path":"src/pages/Delivery/DeliveryList.tsx",children:"Previous"}),a.jsx(x,{variant:"outline",size:"sm",onClick:()=>j(s=>Math.min(S,s+1)),disabled:l===S,"data-id":"humz6rvor","data-path":"src/pages/Delivery/DeliveryList.tsx",children:"Next"})]})]})]})})]}),a.jsx(Da,{open:P,onOpenChange:E,delivery:N,"data-id":"mhcfh4vy0","data-path":"src/pages/Delivery/DeliveryList.tsx"})]})};export{Pa as default};
