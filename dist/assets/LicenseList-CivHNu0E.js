import{j as e,r as b,u as Ee}from"./react-vendor-BIZaP1tt.js";import{D as de,t as oe,v as le,w as pe,B as h,C as E,d as O,e as T,l as q,g as _,X as W,Y as xe,s as L,y as Se,K as f,f as _e,I as ke,z as Ce,E as Pe,F as te,G as C,H as ze,J as P,x as qe}from"./admin-core-B2SBlvpM.js";import{F as Ae,aM as ee,a4 as V,aL as $e,X as Ie,a0 as ie,H as Z,aK as Y,bl as Me,Q as ne,aC as Fe,a1 as Oe,an as Te,ao as K}from"./ui-components-Ace1hSxE.js";import{s as ce}from"./admin-security-B0BokOg9.js";import"./vendor-DfVw5h9R.js";import"./aws-sdk-n3W_cRwv.js";import"./supabase-D_JhUDtQ.js";const Re=({license:t,isOpen:p,onClose:i})=>{if(!t)return null;const d=n=>n?new Date(n).toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"}):"N/A",c=n=>n?new Date(n).toLocaleDateString():"N/A",g=(n,l)=>{const u=new Date,y=new Date(l),x=Math.ceil((y.getTime()-u.getTime())/(1e3*3600*24));switch(n.toLowerCase()){case"active":return x<=30?{color:"text-yellow-600",bgColor:"bg-yellow-50",borderColor:"border-yellow-200",icon:"⚠️",message:`Expires in ${x} days - Renewal Required Soon`}:x<=90?{color:"text-blue-600",bgColor:"bg-blue-50",borderColor:"border-blue-200",icon:"📅",message:`Expires in ${x} days - Plan Renewal`}:{color:"text-green-600",bgColor:"bg-green-50",borderColor:"border-green-200",icon:"✅",message:"Active and Valid"};case"expired":return{color:"text-red-600",bgColor:"bg-red-50",borderColor:"border-red-200",icon:"❌",message:`Expired ${Math.abs(x)} days ago - Immediate Action Required`};case"pending renewal":return{color:"text-yellow-600",bgColor:"bg-yellow-50",borderColor:"border-yellow-200",icon:"⏳",message:"Renewal in Progress"};default:return{color:"text-gray-600",bgColor:"bg-gray-50",borderColor:"border-gray-200",icon:"❓",message:"Status Unknown"}}},r=n=>({Business:{icon:"🏢",description:"General business operations license"},Environmental:{icon:"🌱",description:"Environmental compliance and permits"},Safety:{icon:"🦺",description:"Safety regulations and protocols"},Health:{icon:"🏥",description:"Public health requirements"},Fire:{icon:"🔥",description:"Fire safety and prevention"},Building:{icon:"🏗️",description:"Construction and building permits"}})[n]||{icon:"📄",description:"License certification"},w=n=>({MOBIL:{color:"bg-red-500",description:"Mobil Gas Station"},"AMOCO ROSEDALE":{color:"bg-blue-500",description:"Amoco Rosedale Station"},"AMOCO BROOKLYN":{color:"bg-green-500",description:"Amoco Brooklyn Station"},ALL:{color:"bg-gray-500",description:"All Station Locations"}})[n]||{color:"bg-gray-500",description:n},o=g(t.status,t.expiry_date),v=r(t.category),D=w(t.station),j=()=>{const n=`
      <!DOCTYPE html>
      <html>
        <head>
          <title>License Certificate - ${t.license_name}</title>
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
              background: ${o.bgColor};
              border: 2px solid ${o.borderColor.replace("border-","")};
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
              color: ${o.color.replace("text-","")};
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
              background: ${D.color};
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
            <div class="license-name">${t.license_name}</div>
            
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">License Number</div>
                <div class="info-value" style="font-family: monospace; font-size: 18px;">${t.license_number}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Record ID</div>
                <div class="info-value">#${t.ID}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Category</div>
                <div class="info-value">
                  <span class="category-badge category-${t.category.toLowerCase()}">${v.icon} ${t.category}</span>
                </div>
              </div>
              <div class="info-item">
                <div class="info-label">Station Coverage</div>
                <div class="info-value">
                  <span class="category-badge station-badge">${t.station}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="dates-section">
            <div class="date-card">
              <div class="date-label">📅 Issue Date</div>
              <div class="date-value">${d(t.issue_date)}</div>
            </div>
            <div class="date-card">
              <div class="date-label">⏰ Expiry Date</div>
              <div class="date-value">${d(t.expiry_date)}</div>
            </div>
          </div>

          <div class="status-section">
            <div class="status-icon">${o.icon}</div>
            <div class="status-message">${t.status.toUpperCase()}</div>
            <div style="font-size: 14px; color: #6b7280;">${o.message}</div>
          </div>

          <div class="authority-section">
            <div class="info-label">Issuing Authority</div>
            <div style="font-size: 20px; font-weight: bold; color: #0ea5e9; margin-top: 10px;">
              ${t.issuing_authority}
            </div>
            <div style="font-size: 14px; color: #6b7280; margin-top: 10px;">
              ${v.description}
            </div>
          </div>

          <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 25px 0;">
            <div class="info-label">Document Information</div>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-top: 15px;">
              <div>
                <span style="font-size: 12px; color: #6b7280;">File Reference ID:</span><br>
                <span style="font-weight: bold;">${t.document_file_id||"Not Available"}</span>
              </div>
              <div>
                <span style="font-size: 12px; color: #6b7280;">Created by User:</span><br>
                <span style="font-weight: bold;">#${t.created_by}</span>
              </div>
            </div>
          </div>

          <div class="footer">
            <div style="font-weight: bold; margin-bottom: 10px;">
              This is an official license certificate document
            </div>
            <div>
              Generated on ${new Date().toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit"})}
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
    `,l=window.open("","_blank");l&&(l.document.write(n),l.document.close(),l.focus(),setTimeout(()=>{l.print(),l.close()},500))};return e.jsx(de,{open:p,onOpenChange:i,"data-id":"s0exazr4p","data-path":"src/components/EnhancedLicensePrintDialog.tsx",children:e.jsxs(oe,{className:"max-w-4xl max-h-[95vh] overflow-y-auto","data-id":"gn50485xh","data-path":"src/components/EnhancedLicensePrintDialog.tsx",children:[e.jsx(le,{"data-id":"ojntp57qu","data-path":"src/components/EnhancedLicensePrintDialog.tsx",children:e.jsxs("div",{className:"flex items-center justify-between","data-id":"53v2jzhve","data-path":"src/components/EnhancedLicensePrintDialog.tsx",children:[e.jsxs(pe,{className:"flex items-center gap-2","data-id":"0xdhhsi7e","data-path":"src/components/EnhancedLicensePrintDialog.tsx",children:[e.jsx(Ae,{className:"h-5 w-5 text-blue-600","data-id":"umulnvsiu","data-path":"src/components/EnhancedLicensePrintDialog.tsx"}),"Enhanced License Certificate - ",t.license_name]}),e.jsxs(h,{onClick:j,variant:"outline",size:"sm",className:"flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50","data-id":"kn56xoj8l","data-path":"src/components/EnhancedLicensePrintDialog.tsx",children:[e.jsx(ee,{className:"h-4 w-4","data-id":"12e8dsugx","data-path":"src/components/EnhancedLicensePrintDialog.tsx"}),"Print Certificate"]})]})}),e.jsxs("div",{className:"space-y-6","data-id":"ndqaf5jvx","data-path":"src/components/EnhancedLicensePrintDialog.tsx",children:[e.jsx(E,{className:"bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200","data-id":"ovbjj1g3l","data-path":"src/components/EnhancedLicensePrintDialog.tsx",children:e.jsx(O,{"data-id":"r5rslt1rw","data-path":"src/components/EnhancedLicensePrintDialog.tsx",children:e.jsxs("div",{className:"text-center","data-id":"qvx9eiufz","data-path":"src/components/EnhancedLicensePrintDialog.tsx",children:[e.jsx(T,{className:"text-2xl text-blue-800 mb-2","data-id":"93w5c852u","data-path":"src/components/EnhancedLicensePrintDialog.tsx",children:t.license_name}),e.jsxs("div",{className:"flex items-center justify-center gap-4","data-id":"p22hfv600","data-path":"src/components/EnhancedLicensePrintDialog.tsx",children:[e.jsx(q,{className:`${D.color} text-white`,"data-id":"zd2m3dmvr","data-path":"src/components/EnhancedLicensePrintDialog.tsx",children:t.station}),e.jsx(q,{variant:"outline",className:"text-blue-600","data-id":"mr1tm08em","data-path":"src/components/EnhancedLicensePrintDialog.tsx",children:t.license_number})]})]})})}),e.jsx(E,{className:`border-2 ${o.borderColor} ${o.bgColor}`,"data-id":"tjml8opcj","data-path":"src/components/EnhancedLicensePrintDialog.tsx",children:e.jsxs(_,{className:"p-6 text-center","data-id":"sdzxmnga2","data-path":"src/components/EnhancedLicensePrintDialog.tsx",children:[e.jsx("div",{className:"text-4xl mb-2","data-id":"w77bwe2y4","data-path":"src/components/EnhancedLicensePrintDialog.tsx",children:o.icon}),e.jsx("div",{className:`text-xl font-bold ${o.color} mb-2`,"data-id":"x11hbilp9","data-path":"src/components/EnhancedLicensePrintDialog.tsx",children:t.status.toUpperCase()}),e.jsx("div",{className:"text-sm text-gray-600","data-id":"yu3tra3h8","data-path":"src/components/EnhancedLicensePrintDialog.tsx",children:o.message})]})}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6","data-id":"f1vhkdokh","data-path":"src/components/EnhancedLicensePrintDialog.tsx",children:[e.jsxs(E,{"data-id":"46ndicbon","data-path":"src/components/EnhancedLicensePrintDialog.tsx",children:[e.jsx(O,{"data-id":"a92g4iyzc","data-path":"src/components/EnhancedLicensePrintDialog.tsx",children:e.jsxs(T,{className:"text-sm flex items-center gap-2","data-id":"s419mvc9v","data-path":"src/components/EnhancedLicensePrintDialog.tsx",children:[e.jsx(V,{className:"h-4 w-4","data-id":"ydguqliyt","data-path":"src/components/EnhancedLicensePrintDialog.tsx"}),"License Details"]})}),e.jsxs(_,{className:"space-y-4","data-id":"njeezhgiy","data-path":"src/components/EnhancedLicensePrintDialog.tsx",children:[e.jsxs("div",{"data-id":"82alm4m41","data-path":"src/components/EnhancedLicensePrintDialog.tsx",children:[e.jsx("div",{className:"text-xs text-gray-600 uppercase font-medium","data-id":"ctdircnt5","data-path":"src/components/EnhancedLicensePrintDialog.tsx",children:"Category"}),e.jsxs("div",{className:"flex items-center gap-2 mt-1","data-id":"d1a0t1d2w","data-path":"src/components/EnhancedLicensePrintDialog.tsx",children:[e.jsx("span",{className:"text-lg","data-id":"h3zdhxbky","data-path":"src/components/EnhancedLicensePrintDialog.tsx",children:v.icon}),e.jsxs("div",{"data-id":"gci1aifng","data-path":"src/components/EnhancedLicensePrintDialog.tsx",children:[e.jsx("div",{className:"font-medium","data-id":"1plcu0rr1","data-path":"src/components/EnhancedLicensePrintDialog.tsx",children:t.category}),e.jsx("div",{className:"text-xs text-gray-500","data-id":"f1reblv0j","data-path":"src/components/EnhancedLicensePrintDialog.tsx",children:v.description})]})]})]}),e.jsx(W,{"data-id":"bkjl46e0m","data-path":"src/components/EnhancedLicensePrintDialog.tsx"}),e.jsxs("div",{"data-id":"k4oefa9yy","data-path":"src/components/EnhancedLicensePrintDialog.tsx",children:[e.jsx("div",{className:"text-xs text-gray-600 uppercase font-medium","data-id":"d1hbr794h","data-path":"src/components/EnhancedLicensePrintDialog.tsx",children:"Issuing Authority"}),e.jsx("div",{className:"font-medium mt-1","data-id":"wuazurtzc","data-path":"src/components/EnhancedLicensePrintDialog.tsx",children:t.issuing_authority})]}),e.jsxs("div",{"data-id":"evufmseuk","data-path":"src/components/EnhancedLicensePrintDialog.tsx",children:[e.jsx("div",{className:"text-xs text-gray-600 uppercase font-medium","data-id":"9mzyz07h5","data-path":"src/components/EnhancedLicensePrintDialog.tsx",children:"Document File ID"}),e.jsx("div",{className:"font-medium mt-1","data-id":"67tkyu3w8","data-path":"src/components/EnhancedLicensePrintDialog.tsx",children:t.document_file_id||"Not Available"})]})]})]}),e.jsxs(E,{"data-id":"14az79k8t","data-path":"src/components/EnhancedLicensePrintDialog.tsx",children:[e.jsx(O,{"data-id":"wuzbck0sn","data-path":"src/components/EnhancedLicensePrintDialog.tsx",children:e.jsxs(T,{className:"text-sm flex items-center gap-2","data-id":"dj3bb2lqw","data-path":"src/components/EnhancedLicensePrintDialog.tsx",children:[e.jsx($e,{className:"h-4 w-4","data-id":"fxb3exznm","data-path":"src/components/EnhancedLicensePrintDialog.tsx"}),"Important Dates"]})}),e.jsxs(_,{className:"space-y-4","data-id":"57wiwk9vd","data-path":"src/components/EnhancedLicensePrintDialog.tsx",children:[e.jsxs("div",{"data-id":"c019bhbdh","data-path":"src/components/EnhancedLicensePrintDialog.tsx",children:[e.jsx("div",{className:"text-xs text-gray-600 uppercase font-medium","data-id":"f9a9q7ztr","data-path":"src/components/EnhancedLicensePrintDialog.tsx",children:"Issue Date"}),e.jsx("div",{className:"font-medium mt-1","data-id":"l9bc0os68","data-path":"src/components/EnhancedLicensePrintDialog.tsx",children:d(t.issue_date)})]}),e.jsx(W,{"data-id":"f32oc95e5","data-path":"src/components/EnhancedLicensePrintDialog.tsx"}),e.jsxs("div",{"data-id":"nwa8rott5","data-path":"src/components/EnhancedLicensePrintDialog.tsx",children:[e.jsx("div",{className:"text-xs text-gray-600 uppercase font-medium","data-id":"1bn1zvj6g","data-path":"src/components/EnhancedLicensePrintDialog.tsx",children:"Expiry Date"}),e.jsx("div",{className:"font-medium mt-1","data-id":"a4vtcc2h9","data-path":"src/components/EnhancedLicensePrintDialog.tsx",children:d(t.expiry_date)})]}),e.jsx(W,{"data-id":"mfpqu1btt","data-path":"src/components/EnhancedLicensePrintDialog.tsx"}),e.jsxs("div",{"data-id":"4p8tdsctx","data-path":"src/components/EnhancedLicensePrintDialog.tsx",children:[e.jsx("div",{className:"text-xs text-gray-600 uppercase font-medium","data-id":"5kneeyjqp","data-path":"src/components/EnhancedLicensePrintDialog.tsx",children:"Station Coverage"}),e.jsxs("div",{className:"mt-1","data-id":"rzgxlkw6s","data-path":"src/components/EnhancedLicensePrintDialog.tsx",children:[e.jsx(q,{className:`${D.color} text-white`,"data-id":"5ao7v5xmb","data-path":"src/components/EnhancedLicensePrintDialog.tsx",children:t.station}),e.jsx("div",{className:"text-xs text-gray-500 mt-1","data-id":"uxhmv4gz9","data-path":"src/components/EnhancedLicensePrintDialog.tsx",children:D.description})]})]})]})]})]}),e.jsxs(E,{"data-id":"ab9hmnwqy","data-path":"src/components/EnhancedLicensePrintDialog.tsx",children:[e.jsx(O,{"data-id":"5vrg32wah","data-path":"src/components/EnhancedLicensePrintDialog.tsx",children:e.jsx(T,{className:"text-sm","data-id":"h2rl1ht2e","data-path":"src/components/EnhancedLicensePrintDialog.tsx",children:"System Information"})}),e.jsx(_,{"data-id":"nyusgezri","data-path":"src/components/EnhancedLicensePrintDialog.tsx",children:e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4 text-sm","data-id":"p8tzcbij0","data-path":"src/components/EnhancedLicensePrintDialog.tsx",children:[e.jsxs("div",{className:"flex justify-between","data-id":"twcw3qd8t","data-path":"src/components/EnhancedLicensePrintDialog.tsx",children:[e.jsx("span",{className:"text-gray-600","data-id":"l9sikfxgy","data-path":"src/components/EnhancedLicensePrintDialog.tsx",children:"Record ID:"}),e.jsxs("span",{className:"font-medium","data-id":"q0rf34tb9","data-path":"src/components/EnhancedLicensePrintDialog.tsx",children:["#",t.ID]})]}),e.jsxs("div",{className:"flex justify-between","data-id":"kfkp5rf0h","data-path":"src/components/EnhancedLicensePrintDialog.tsx",children:[e.jsx("span",{className:"text-gray-600","data-id":"bleimivet","data-path":"src/components/EnhancedLicensePrintDialog.tsx",children:"Created by User:"}),e.jsxs("span",{className:"font-medium","data-id":"obtfhrimq","data-path":"src/components/EnhancedLicensePrintDialog.tsx",children:["#",t.created_by]})]}),e.jsxs("div",{className:"flex justify-between","data-id":"5ig9g94i9","data-path":"src/components/EnhancedLicensePrintDialog.tsx",children:[e.jsx("span",{className:"text-gray-600","data-id":"u4p305jo0","data-path":"src/components/EnhancedLicensePrintDialog.tsx",children:"Document Generated:"}),e.jsx("span",{className:"font-medium","data-id":"mf8cftrc7","data-path":"src/components/EnhancedLicensePrintDialog.tsx",children:c(new Date().toISOString())})]}),e.jsxs("div",{className:"flex justify-between","data-id":"opo3u2rf8","data-path":"src/components/EnhancedLicensePrintDialog.tsx",children:[e.jsx("span",{className:"text-gray-600","data-id":"xx8a23981","data-path":"src/components/EnhancedLicensePrintDialog.tsx",children:"System Version:"}),e.jsx("span",{className:"font-medium","data-id":"kv32uam1w","data-path":"src/components/EnhancedLicensePrintDialog.tsx",children:"DFS Portal v2.0"})]})]})})]})]}),e.jsxs(xe,{className:"flex justify-end space-x-2","data-id":"37k7lybh1","data-path":"src/components/EnhancedLicensePrintDialog.tsx",children:[e.jsxs(h,{variant:"outline",onClick:i,"data-id":"sgut48qoo","data-path":"src/components/EnhancedLicensePrintDialog.tsx",children:[e.jsx(Ie,{className:"w-4 h-4 mr-2","data-id":"x8hzlg7bt","data-path":"src/components/EnhancedLicensePrintDialog.tsx"}),"Close"]}),e.jsxs(h,{onClick:j,className:"bg-blue-600 hover:bg-blue-700","data-id":"xad6fzgkb","data-path":"src/components/EnhancedLicensePrintDialog.tsx",children:[e.jsx(ee,{className:"w-4 h-4 mr-2","data-id":"f702uqf02","data-path":"src/components/EnhancedLicensePrintDialog.tsx"}),"Print Certificate"]})]})]})})};class Be{async checkAndSendAlerts(){try{console.log("🔍 Checking for licenses requiring alerts...");const{data:p,error:i}=await L.from("sms_alert_settings").select("*").eq("is_active",!0).order("id",{ascending:!1});if(i){console.error("Error loading SMS settings:",i);return}const d=p||[];if(d.length===0){console.log("No active SMS alert settings found");return}const{data:c,error:g}=await L.from("licenses_certificates").select("*").eq("status","Active").order("expiry_date",{ascending:!0}).limit(1e3);if(g){console.error("Error loading licenses:",g);return}const r=c||[];console.log(`Found ${r.length} active licenses to check`);const{data:w,error:o}=await L.from("sms_alert_contacts").select("*").eq("is_active",!0).order("id",{ascending:!1});if(o){console.error("Error loading SMS contacts:",o);return}const v=w||[];if(v.length===0){console.log("No active SMS contacts found");return}const D=new Date;let j=0;for(const n of r){const l=new Date(n.expiry_date),u=Math.ceil((l.getTime()-D.getTime())/(1e3*60*60*24));console.log(`📋 Checking license: ${n.license_name} (expires in ${u} days)`);for(const y of d)if(u<=y.days_before_expiry&&u>0&&await this.shouldSendAlert(n.id,y.id,y.alert_frequency_days)){console.log(`⚠️ License ${n.license_name} needs alert (${u} days remaining)`);const k=this.getRelevantContacts(v,n.station);for(const X of k)await this.sendLicenseAlert(n,X,y,u),j++}}console.log(`✅ License alert check completed. ${j} alerts sent.`)}catch(p){console.error("Error in license alert service:",p)}}async shouldSendAlert(p,i,d){try{const{data:c,error:g}=await L.from("sms_alert_history").select("*").eq("license_id",p).order("sent_date",{ascending:!1}).limit(1);if(g)return console.error("Error checking alert history:",g),!0;const r=c||[];if(r.length===0)return!0;const w=new Date(r[0].sent_date);return Math.ceil((new Date().getTime()-w.getTime())/(1e3*60*60*24))>=d}catch(c){return console.error("Error checking alert frequency:",c),!0}}getRelevantContacts(p,i){return p.filter(d=>d.station==="ALL"||d.station===i)}async sendLicenseAlert(p,i,d,c){try{const g=this.createMessageFromTemplate(d.message_template,p,c);console.log(`📱 Sending license alert to ${i.contact_name} (${i.mobile_number})`);const r=await ce.sendSMS({to:i.mobile_number,message:g,type:"license_alert"});await L.from("sms_alert_history").insert({license_id:p.id,contact_id:i.id,mobile_number:i.mobile_number,message_content:g,sent_date:new Date().toISOString(),delivery_status:r.success?"Sent":`Failed - ${r.error}`,days_before_expiry:c,created_by:1}),r.success?console.log(`✅ License alert sent successfully to ${i.contact_name}`):console.error(`❌ License alert failed to ${i.contact_name}:`,r.error)}catch(g){console.error(`Error sending license alert to ${i.contact_name}:`,g)}}createMessageFromTemplate(p,i,d){const c=new Date(i.expiry_date).toLocaleDateString();return p.replace(/{license_name}/g,i.license_name).replace(/{station}/g,i.station).replace(/{expiry_date}/g,c).replace(/{days_remaining}/g,d.toString()).replace(/{license_number}/g,i.license_number).replace(/{category}/g,i.category)}async sendImmediateAlert(p){try{const{data:i,error:d}=await L.from("licenses_certificates").select("*").eq("id",p).single();if(d||!i)return{success:!1,message:"License not found"};const c=i,g=new Date(c.expiry_date),r=new Date,w=Math.ceil((g.getTime()-r.getTime())/(1e3*60*60*24)),{data:o,error:v}=await L.from("sms_alert_contacts").select("*").eq("is_active",!0).order("id",{ascending:!1});if(v)return{success:!1,message:"Failed to load contacts"};const D=o||[],j=this.getRelevantContacts(D,c.station);if(j.length===0)return{success:!1,message:"No active contacts found for this station"};const n=`🚨 URGENT: License '${c.license_name}' for ${c.station} expires in ${w} days (${g.toLocaleDateString()}). Please renew immediately!`;let l=0;for(const u of j){const y=await ce.sendSMS({to:u.mobile_number,message:n,type:"immediate_alert"});await L.from("sms_alert_history").insert({license_id:c.id,contact_id:u.id,mobile_number:u.mobile_number,message_content:n,sent_date:new Date().toISOString(),delivery_status:y.success?"Sent":`Failed - ${y.error}`,days_before_expiry:w,created_by:1}),y.success&&l++}return{success:l>0,message:`Alert sent to ${l}/${j.length} contacts`}}catch(i){return console.error("Error sending immediate alert:",i),{success:!1,message:"Failed to send alert"}}}}const re=new Be,Je=()=>{const[t,p]=b.useState([]),[i,d]=b.useState(!0),[c,g]=b.useState(""),[r,w]=b.useState(1),[o,v]=b.useState(0),[D,j]=b.useState(null),[n,l]=b.useState(!1),[u,y]=b.useState(!1),[x,k]=b.useState(null),[X,A]=b.useState(!1),[S,he]=b.useState(null),[$,ge]=b.useState(!0),R=Ee(),{userProfile:J}=Se(),I=10;b.useEffect(()=>{B()},[r,c,$]);const B=async()=>{try{d(!0);let s=L.from("licenses_certificates").select("*",{count:"exact"}).order("expiry_date",{ascending:!0});c&&(s=s.ilike("license_name",`%${c}%`)),$||(s=s.ilike("status","%Active%"));const a=(r-1)*I,z=a+I-1;s=s.range(a,z);const{data:N,error:F,count:m}=await s;if(F)throw F;p(N||[]),v(m||0)}catch(s){console.error("Error loading licenses:",s),f({title:"Error",description:"Failed to load licenses",variant:"destructive"})}finally{d(!1)}},me=s=>{he(s),A(!0)},Le=async s=>{try{k(s);const{error:a}=await L.from("licenses_certificates").update({status:"Cancelled"}).eq("ID",s);if(a)throw a;f({title:"✅ License Deactivated",description:"License has been marked as cancelled. It can be reactivated later if needed.",duration:5e3}),await B()}catch(a){console.error("Error deactivating license:",a),f({title:"❌ Deactivation Failed",description:`Failed to deactivate license: ${a}`,variant:"destructive"})}finally{k(null)}},ue=async s=>{k(s);try{const{data:a,error:z}=await L.from("licenses_certificates").select("*").eq("ID",s).limit(1).single();if(z)throw z;const N=a;if(!N)throw new Error("License not found");if(f({title:"🗑️ Deleting License",description:"Removing associated files and data..."}),N.document_file_id)try{console.log(`Deleting file with ID: ${N.document_file_id}`)}catch(m){console.warn("File deletion warning:",m)}try{const{data:m,error:Q}=await L.from("sms_alert_history").select("*").eq("license_id",s);!Q&&(m==null?void 0:m.length)>0&&(await L.from("sms_alert_history").delete().eq("license_id",s),console.log(`Deleted ${m.length} SMS alert history records`))}catch(m){console.warn("SMS alert history cleanup warning:",m)}try{const{data:m,error:Q}=await L.from("sms_alert_schedules").select("*").eq("alert_type","License Expiry").eq("station_filter",N.station);!Q&&(m==null?void 0:m.length)>0&&console.log(`Found ${m.length} related alert schedules`)}catch(m){console.warn("Alert schedule cleanup warning:",m)}const{error:F}=await L.from("licenses_certificates").delete().eq("ID",s);if(F)throw F;f({title:"✅ License Deleted Successfully",description:`${N.license_name} and all associated data have been removed from the system.`,duration:5e3}),await B()}catch(a){console.error("Error during license deletion:",a),f({title:"❌ Deletion Failed",description:`Failed to delete license: ${a}`,variant:"destructive",duration:7e3})}finally{k(null)}},fe=s=>{j(s),l(!0)},ye=()=>{l(!1),j(null)},be=async()=>{try{y(!0),f({title:"📱 Checking Licenses",description:"Analyzing licenses for expiry alerts..."}),await re.checkAndSendAlerts(),f({title:"✅ License Alerts Complete",description:"SMS alerts sent for expiring licenses. Check SMS History for details."})}catch(s){console.error("Error sending SMS alerts:",s),f({title:"❌ Alert Failed",description:"Failed to send SMS alerts. Please try again.",variant:"destructive"})}finally{y(!1)}},ve=async s=>{try{const a=await re.sendImmediateAlert(s);a.success?f({title:"📱 SMS Alert Sent",description:a.message}):f({title:"❌ Alert Failed",description:a.message,variant:"destructive"})}catch(a){console.error("Error sending immediate alert:",a),f({title:"Error",description:"Failed to send SMS alert",variant:"destructive"})}},se=(J==null?void 0:J.role)==="Administrator",je=async s=>{try{k(s);const{error:a}=await L.from("licenses_certificates").update({status:"Active"}).eq("ID",s);if(a)throw a;f({title:"✅ License Reactivated",description:"License has been successfully reactivated.",duration:3e3}),await B()}catch(a){console.error("Error reactivating license:",a),f({title:"❌ Reactivation Failed",description:`Failed to reactivate license: ${a}`,variant:"destructive"})}finally{k(null)}},we=s=>{switch(s.toLowerCase()){case"active":return"bg-green-500";case"expired":return"bg-red-500";case"pending renewal":return"bg-yellow-500";case"cancelled":case"inactive":return"bg-gray-500";default:return"bg-gray-500"}},De=s=>({Business:"bg-blue-500",Environmental:"bg-green-500",Safety:"bg-orange-500",Health:"bg-purple-500",Fire:"bg-red-500",Building:"bg-gray-500"})[s]||"bg-gray-500",Ne=s=>{switch(s.toUpperCase()){case"MOBIL":return"bg-blue-600";case"AMOCO ROSEDALE":return"bg-green-600";case"AMOCO BROOKLYN":return"bg-purple-600";case"ALL":return"bg-gray-600";default:return"bg-gray-600"}},ae=s=>s?new Date(s).toLocaleDateString():"N/A",H=s=>{if(!s)return!1;const a=new Date,z=new Date(s),N=Math.ceil((z.getTime()-a.getTime())/(1e3*3600*24));return N<=30&&N>=0},M=s=>{if(!s)return!1;const a=new Date;return new Date(s)<a},U=Math.ceil(o/I),G=t.reduce((s,a)=>({active:s.active+(a.status.toLowerCase()==="active"?1:0),expiring_soon:s.expiring_soon+(H(a.expiry_date)&&a.status.toLowerCase()!=="cancelled"?1:0),expired:s.expired+(M(a.expiry_date)&&a.status.toLowerCase()!=="cancelled"?1:0),cancelled:s.cancelled+(a.status.toLowerCase()==="cancelled"||a.status.toLowerCase()==="inactive"?1:0)}),{active:0,expiring_soon:0,expired:0,cancelled:0});return e.jsxs("div",{className:"space-y-6","data-id":"yswgfq1j5","data-path":"src/pages/Licenses/LicenseList.tsx",children:[e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-4 gap-4","data-id":"5r2l194w7","data-path":"src/pages/Licenses/LicenseList.tsx",children:[e.jsx(E,{"data-id":"atyucaqyf","data-path":"src/pages/Licenses/LicenseList.tsx",children:e.jsx(_,{className:"p-6","data-id":"a9hpxkk5w","data-path":"src/pages/Licenses/LicenseList.tsx",children:e.jsxs("div",{className:"flex items-center space-x-2","data-id":"eez32slb7","data-path":"src/pages/Licenses/LicenseList.tsx",children:[e.jsx(ie,{className:"w-8 h-8 text-green-600","data-id":"9ofqej4wj","data-path":"src/pages/Licenses/LicenseList.tsx"}),e.jsxs("div",{"data-id":"chwtjll9l","data-path":"src/pages/Licenses/LicenseList.tsx",children:[e.jsx("p",{className:"text-sm font-medium text-gray-600","data-id":"7sffce40f","data-path":"src/pages/Licenses/LicenseList.tsx",children:"Active Licenses"}),e.jsx("p",{className:"text-2xl font-bold","data-id":"l17wuf920","data-path":"src/pages/Licenses/LicenseList.tsx",children:G.active})]})]})})}),e.jsx(E,{"data-id":"2b8d7amw4","data-path":"src/pages/Licenses/LicenseList.tsx",children:e.jsx(_,{className:"p-6","data-id":"m2lkb2jw5","data-path":"src/pages/Licenses/LicenseList.tsx",children:e.jsxs("div",{className:"flex items-center space-x-2","data-id":"x5ina2l32","data-path":"src/pages/Licenses/LicenseList.tsx",children:[e.jsx(Z,{className:"w-8 h-8 text-yellow-600","data-id":"mrezj5fzj","data-path":"src/pages/Licenses/LicenseList.tsx"}),e.jsxs("div",{"data-id":"sism71vxc","data-path":"src/pages/Licenses/LicenseList.tsx",children:[e.jsx("p",{className:"text-sm font-medium text-gray-600","data-id":"vab0am73w","data-path":"src/pages/Licenses/LicenseList.tsx",children:"Expiring Soon"}),e.jsx("p",{className:"text-2xl font-bold","data-id":"4y9b7j3ie","data-path":"src/pages/Licenses/LicenseList.tsx",children:G.expiring_soon})]})]})})}),e.jsx(E,{"data-id":"x9d9uavqk","data-path":"src/pages/Licenses/LicenseList.tsx",children:e.jsx(_,{className:"p-6","data-id":"ztqbvisoh","data-path":"src/pages/Licenses/LicenseList.tsx",children:e.jsxs("div",{className:"flex items-center space-x-2","data-id":"36ayaa0v1","data-path":"src/pages/Licenses/LicenseList.tsx",children:[e.jsx(V,{className:"w-8 h-8 text-red-600","data-id":"6nu7c2amt","data-path":"src/pages/Licenses/LicenseList.tsx"}),e.jsxs("div",{"data-id":"gn93luqhz","data-path":"src/pages/Licenses/LicenseList.tsx",children:[e.jsx("p",{className:"text-sm font-medium text-gray-600","data-id":"p3lkeeox6","data-path":"src/pages/Licenses/LicenseList.tsx",children:"Expired"}),e.jsx("p",{className:"text-2xl font-bold","data-id":"5g2f2bvma","data-path":"src/pages/Licenses/LicenseList.tsx",children:G.expired})]})]})})}),e.jsx(E,{"data-id":"c4k8m9z1x","data-path":"src/pages/Licenses/LicenseList.tsx",children:e.jsx(_,{className:"p-6","data-id":"l3h5n7q2w","data-path":"src/pages/Licenses/LicenseList.tsx",children:e.jsxs("div",{className:"flex items-center space-x-2","data-id":"r9t6e8u4i","data-path":"src/pages/Licenses/LicenseList.tsx",children:[e.jsx(Y,{className:"w-8 h-8 text-gray-600","data-id":"m2p5j8k1l","data-path":"src/pages/Licenses/LicenseList.tsx"}),e.jsxs("div",{"data-id":"s7f3g9h6n","data-path":"src/pages/Licenses/LicenseList.tsx",children:[e.jsx("p",{className:"text-sm font-medium text-gray-600","data-id":"d4v7x2c9b","data-path":"src/pages/Licenses/LicenseList.tsx",children:"Cancelled"}),e.jsx("p",{className:"text-2xl font-bold","data-id":"q8w1e5r3t","data-path":"src/pages/Licenses/LicenseList.tsx",children:G.cancelled})]})]})})})]}),e.jsxs(E,{"data-id":"jm43kzapy","data-path":"src/pages/Licenses/LicenseList.tsx",children:[e.jsx(O,{"data-id":"hjtkiiwbm","data-path":"src/pages/Licenses/LicenseList.tsx",children:e.jsxs("div",{className:"flex items-center justify-between","data-id":"wr2xpz1ii","data-path":"src/pages/Licenses/LicenseList.tsx",children:[e.jsxs("div",{"data-id":"2xvj28q73","data-path":"src/pages/Licenses/LicenseList.tsx",children:[e.jsxs(T,{className:"flex items-center space-x-2","data-id":"5uc6totjh","data-path":"src/pages/Licenses/LicenseList.tsx",children:[e.jsx(V,{className:"w-6 h-6","data-id":"h3dmrqctq","data-path":"src/pages/Licenses/LicenseList.tsx"}),e.jsx("span",{"data-id":"yexlwvcda","data-path":"src/pages/Licenses/LicenseList.tsx",children:"Licenses & Certificates"})]}),e.jsx(_e,{"data-id":"wyppc18um","data-path":"src/pages/Licenses/LicenseList.tsx",children:"Manage your business licenses and certificates"})]}),e.jsxs("div",{className:"flex items-center space-x-2","data-id":"4syl9p6ld","data-path":"src/pages/Licenses/LicenseList.tsx",children:[se&&e.jsxs(e.Fragment,{children:[e.jsxs(h,{onClick:be,disabled:u,variant:"outline",className:"flex items-center space-x-2","data-id":"id478c0xo","data-path":"src/pages/Licenses/LicenseList.tsx",children:[e.jsx(Me,{className:"w-4 h-4","data-id":"h3naa0eet","data-path":"src/pages/Licenses/LicenseList.tsx"}),e.jsx("span",{"data-id":"pnkhgtxes","data-path":"src/pages/Licenses/LicenseList.tsx",children:u?"Sending...":"Send SMS Alerts"})]}),e.jsxs(h,{onClick:()=>R("/admin/sms-alerts"),variant:"outline",className:"flex items-center space-x-2","data-id":"xo2ixxym6","data-path":"src/pages/Licenses/LicenseList.tsx",children:[e.jsx(ne,{className:"w-4 h-4","data-id":"yiui8n7e9","data-path":"src/pages/Licenses/LicenseList.tsx"}),e.jsx("span",{"data-id":"2dueaelmw","data-path":"src/pages/Licenses/LicenseList.tsx",children:"SMS Settings"})]})]}),e.jsxs(h,{onClick:()=>R("/licenses/new"),className:"flex items-center space-x-2","data-id":"abxmlmxl0","data-path":"src/pages/Licenses/LicenseList.tsx",children:[e.jsx(Fe,{className:"w-4 h-4","data-id":"skmboegpn","data-path":"src/pages/Licenses/LicenseList.tsx"}),e.jsx("span",{"data-id":"tsnjzr2xg","data-path":"src/pages/Licenses/LicenseList.tsx",children:"Add License"})]})]})]})}),e.jsxs(_,{"data-id":"y72l9z6g4","data-path":"src/pages/Licenses/LicenseList.tsx",children:[e.jsxs("div",{className:"flex items-center justify-between mb-6","data-id":"2bm6ntwyq","data-path":"src/pages/Licenses/LicenseList.tsx",children:[e.jsxs("div",{className:"relative flex-1 max-w-sm","data-id":"c6igq7xfz","data-path":"src/pages/Licenses/LicenseList.tsx",children:[e.jsx(Oe,{className:"absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4","data-id":"zw0db9clp","data-path":"src/pages/Licenses/LicenseList.tsx"}),e.jsx(ke,{placeholder:"Search licenses...",value:c,onChange:s=>g(s.target.value),className:"pl-10","data-id":"dvr2nry9d","data-path":"src/pages/Licenses/LicenseList.tsx"})]}),e.jsx("div",{className:"flex items-center space-x-2","data-id":"op01c6tmk","data-path":"src/pages/Licenses/LicenseList.tsx",children:e.jsxs(h,{variant:$?"default":"outline",size:"sm",onClick:()=>ge(!$),className:"flex items-center space-x-2","data-id":"1zhi4gtzj","data-path":"src/pages/Licenses/LicenseList.tsx",children:[e.jsx(Y,{className:"w-4 h-4","data-id":"d8am7onkr","data-path":"src/pages/Licenses/LicenseList.tsx"}),e.jsxs("span",{"data-id":"ezlv06j8k","data-path":"src/pages/Licenses/LicenseList.tsx",children:[$?"Hide":"Show"," Cancelled"]})]})})]}),i?e.jsx("div",{className:"space-y-4","data-id":"kd40f4ksu","data-path":"src/pages/Licenses/LicenseList.tsx",children:[...Array(5)].map((s,a)=>e.jsx("div",{className:"h-16 bg-gray-100 rounded animate-pulse","data-id":"0sz4qxz0i","data-path":"src/pages/Licenses/LicenseList.tsx"},a))}):t.length===0?e.jsxs("div",{className:"text-center py-8","data-id":"ipujzvq9h","data-path":"src/pages/Licenses/LicenseList.tsx",children:[e.jsx(V,{className:"w-12 h-12 text-gray-400 mx-auto mb-4","data-id":"bml786pig","data-path":"src/pages/Licenses/LicenseList.tsx"}),e.jsx("p",{className:"text-gray-500","data-id":"lokrg9ghh","data-path":"src/pages/Licenses/LicenseList.tsx",children:"No licenses found"}),e.jsx(h,{variant:"outline",className:"mt-4",onClick:()=>R("/licenses/new"),"data-id":"sf88hfx2g","data-path":"src/pages/Licenses/LicenseList.tsx",children:"Add Your First License"})]}):e.jsx("div",{className:"border rounded-lg overflow-hidden","data-id":"7hbb55i8g","data-path":"src/pages/Licenses/LicenseList.tsx",children:e.jsxs(Ce,{"data-id":"4yfu037pc","data-path":"src/pages/Licenses/LicenseList.tsx",children:[e.jsx(Pe,{"data-id":"ug8dk0az2","data-path":"src/pages/Licenses/LicenseList.tsx",children:e.jsxs(te,{"data-id":"bgdtq60zj","data-path":"src/pages/Licenses/LicenseList.tsx",children:[e.jsx(C,{"data-id":"3jrl2m6dd","data-path":"src/pages/Licenses/LicenseList.tsx",children:"License Name"}),e.jsx(C,{"data-id":"k1qaq974y","data-path":"src/pages/Licenses/LicenseList.tsx",children:"License Number"}),e.jsx(C,{"data-id":"739qv6alh","data-path":"src/pages/Licenses/LicenseList.tsx",children:"Category"}),e.jsx(C,{"data-id":"j5pztsjh0","data-path":"src/pages/Licenses/LicenseList.tsx",children:"Station"}),e.jsx(C,{"data-id":"4ga60onxb","data-path":"src/pages/Licenses/LicenseList.tsx",children:"Issue Date"}),e.jsx(C,{"data-id":"ko1xt4c5m","data-path":"src/pages/Licenses/LicenseList.tsx",children:"Expiry Date"}),e.jsx(C,{"data-id":"zx3311yla","data-path":"src/pages/Licenses/LicenseList.tsx",children:"Status"}),e.jsx(C,{"data-id":"zoxkxoety","data-path":"src/pages/Licenses/LicenseList.tsx",children:"Actions"})]})}),e.jsx(ze,{"data-id":"buujsytow","data-path":"src/pages/Licenses/LicenseList.tsx",children:t.map(s=>e.jsxs(te,{className:M(s.expiry_date)?"bg-red-50":H(s.expiry_date)?"bg-yellow-50":"","data-id":"y9n0bda44","data-path":"src/pages/Licenses/LicenseList.tsx",children:[e.jsx(P,{"data-id":"dbfj6ylxj","data-path":"src/pages/Licenses/LicenseList.tsx",children:e.jsxs("div",{"data-id":"4te9yy1if","data-path":"src/pages/Licenses/LicenseList.tsx",children:[e.jsx("p",{className:"font-medium","data-id":"8b4nauy2o","data-path":"src/pages/Licenses/LicenseList.tsx",children:s.license_name}),e.jsx("p",{className:"text-sm text-gray-500","data-id":"7k9k0gs3s","data-path":"src/pages/Licenses/LicenseList.tsx",children:s.issuing_authority})]})}),e.jsx(P,{className:"font-medium","data-id":"9qi906uae","data-path":"src/pages/Licenses/LicenseList.tsx",children:s.license_number}),e.jsx(P,{"data-id":"4pa5phxhw","data-path":"src/pages/Licenses/LicenseList.tsx",children:e.jsx(q,{className:`text-white ${De(s.category)}`,"data-id":"9rdtgbweq","data-path":"src/pages/Licenses/LicenseList.tsx",children:s.category})}),e.jsx(P,{"data-id":"ckjncht0o","data-path":"src/pages/Licenses/LicenseList.tsx",children:e.jsx(q,{className:`text-white ${Ne(s.station)}`,"data-id":"tkir01xrz","data-path":"src/pages/Licenses/LicenseList.tsx",children:s.station})}),e.jsx(P,{"data-id":"3zeucj880","data-path":"src/pages/Licenses/LicenseList.tsx",children:ae(s.issue_date)}),e.jsx(P,{"data-id":"1pch0ufc8","data-path":"src/pages/Licenses/LicenseList.tsx",children:e.jsxs("div",{className:"flex items-center space-x-2","data-id":"yxbcfn6vs","data-path":"src/pages/Licenses/LicenseList.tsx",children:[e.jsx("span",{"data-id":"vz89ei5b8","data-path":"src/pages/Licenses/LicenseList.tsx",children:ae(s.expiry_date)}),M(s.expiry_date)&&e.jsx(Z,{className:"w-4 h-4 text-red-500","data-id":"l8kr4227b","data-path":"src/pages/Licenses/LicenseList.tsx"}),H(s.expiry_date)&&!M(s.expiry_date)&&e.jsx(Z,{className:"w-4 h-4 text-yellow-500","data-id":"hsmbf5fpg","data-path":"src/pages/Licenses/LicenseList.tsx"})]})}),e.jsx(P,{"data-id":"9b40djbk1","data-path":"src/pages/Licenses/LicenseList.tsx",children:e.jsx(q,{className:`text-white ${we(s.status)}`,"data-id":"iju5cgzhq","data-path":"src/pages/Licenses/LicenseList.tsx",children:s.status})}),e.jsx(P,{"data-id":"g76he2ar0","data-path":"src/pages/Licenses/LicenseList.tsx",children:e.jsxs("div",{className:"flex items-center space-x-2","data-id":"ag3vb9cgq","data-path":"src/pages/Licenses/LicenseList.tsx",children:[e.jsx(h,{variant:"outline",size:"sm",onClick:()=>fe(s),className:"text-blue-600 hover:text-blue-700",title:"Print Document","data-id":"mh73cu15f","data-path":"src/pages/Licenses/LicenseList.tsx",children:e.jsx(ee,{className:"w-4 h-4","data-id":"q9ctilc62","data-path":"src/pages/Licenses/LicenseList.tsx"})}),(H(s.expiry_date)||M(s.expiry_date))&&e.jsx(h,{variant:"outline",size:"sm",onClick:()=>ve(s.ID),className:"text-orange-600 hover:text-orange-700",title:"Send SMS Alert","data-id":"20hg8dybs","data-path":"src/pages/Licenses/LicenseList.tsx",children:e.jsx(ne,{className:"w-4 h-4","data-id":"clhjnskux","data-path":"src/pages/Licenses/LicenseList.tsx"})}),se&&e.jsxs(e.Fragment,{children:[e.jsx(h,{variant:"outline",size:"sm",onClick:()=>R(`/licenses/edit/${s.ID}`),title:"Edit License","data-id":"itticots7","data-path":"src/pages/Licenses/LicenseList.tsx",children:e.jsx(Te,{className:"w-4 h-4","data-id":"wnimbsr32","data-path":"src/pages/Licenses/LicenseList.tsx"})}),s.status.toLowerCase()==="cancelled"||s.status.toLowerCase()==="inactive"?e.jsx(h,{variant:"outline",size:"sm",onClick:()=>je(s.ID),disabled:x===s.ID,className:`${x===s.ID?"text-gray-400":"text-green-600 hover:text-green-700"}`,title:x===s.ID?"Processing...":"Reactivate License","data-id":"1pdv67sx2","data-path":"src/pages/Licenses/LicenseList.tsx",children:e.jsx(ie,{className:`w-4 h-4 ${x===s.ID?"animate-spin":""}`,"data-id":"kuzfq3h9d","data-path":"src/pages/Licenses/LicenseList.tsx"})}):e.jsx(h,{variant:"outline",size:"sm",onClick:()=>me(s),disabled:x===s.ID,className:`${x===s.ID?"text-gray-400":"text-red-600 hover:text-red-700"}`,title:x===s.ID?"Processing...":"Delete License","data-id":"knpqb3mfi","data-path":"src/pages/Licenses/LicenseList.tsx",children:e.jsx(K,{className:`w-4 h-4 ${x===s.ID?"animate-spin":""}`,"data-id":"vn548kq6e","data-path":"src/pages/Licenses/LicenseList.tsx"})})]})]})})]},s.ID))})]})}),U>1&&e.jsxs("div",{className:"flex items-center justify-between mt-6","data-id":"ycqywaxtw","data-path":"src/pages/Licenses/LicenseList.tsx",children:[e.jsxs("p",{className:"text-sm text-gray-700","data-id":"0nir713c7","data-path":"src/pages/Licenses/LicenseList.tsx",children:["Showing ",(r-1)*I+1," to ",Math.min(r*I,o)," of ",o," licenses"]}),e.jsxs("div",{className:"flex items-center space-x-2","data-id":"r3iarkpra","data-path":"src/pages/Licenses/LicenseList.tsx",children:[e.jsx(h,{variant:"outline",size:"sm",onClick:()=>w(s=>Math.max(s-1,1)),disabled:r===1,"data-id":"jwrw6r2p1","data-path":"src/pages/Licenses/LicenseList.tsx",children:"Previous"}),e.jsxs("span",{className:"text-sm","data-id":"49r9tevk0","data-path":"src/pages/Licenses/LicenseList.tsx",children:["Page ",r," of ",U]}),e.jsx(h,{variant:"outline",size:"sm",onClick:()=>w(s=>Math.min(s+1,U)),disabled:r===U,"data-id":"p27tf86gc","data-path":"src/pages/Licenses/LicenseList.tsx",children:"Next"})]})]})]})]}),e.jsx(Re,{license:D,isOpen:n,onClose:ye,"data-id":"hb04mov5w","data-path":"src/pages/Licenses/LicenseList.tsx"}),e.jsx(de,{open:X,onOpenChange:A,"data-id":"n1zza37kk","data-path":"src/pages/Licenses/LicenseList.tsx",children:e.jsxs(oe,{className:"sm:max-w-[425px]","data-id":"xoilc6udn","data-path":"src/pages/Licenses/LicenseList.tsx",children:[e.jsxs(le,{"data-id":"mwvwy2jaw","data-path":"src/pages/Licenses/LicenseList.tsx",children:[e.jsxs(pe,{className:"flex items-center space-x-2","data-id":"7z2yq8262","data-path":"src/pages/Licenses/LicenseList.tsx",children:[e.jsx(K,{className:"w-5 h-5 text-red-500","data-id":"os6658jic","data-path":"src/pages/Licenses/LicenseList.tsx"}),e.jsx("span",{"data-id":"i6jlrv51t","data-path":"src/pages/Licenses/LicenseList.tsx",children:"Delete License"})]}),e.jsxs(qe,{"data-id":"rdnrk302z","data-path":"src/pages/Licenses/LicenseList.tsx",children:["Choose how you want to handle the license: ",e.jsx("strong",{"data-id":"jlq2qfawf","data-path":"src/pages/Licenses/LicenseList.tsx",children:S==null?void 0:S.license_name})]})]}),e.jsx("div",{className:"space-y-4 py-4","data-id":"f0zj0485r","data-path":"src/pages/Licenses/LicenseList.tsx",children:e.jsxs("div",{className:"space-y-3","data-id":"yufi95y7f","data-path":"src/pages/Licenses/LicenseList.tsx",children:[e.jsxs("div",{className:"flex items-start space-x-3 p-4 border rounded-lg bg-yellow-50","data-id":"93gy1o817","data-path":"src/pages/Licenses/LicenseList.tsx",children:[e.jsx(Y,{className:"w-5 h-5 text-yellow-600 mt-1","data-id":"275gn4wzj","data-path":"src/pages/Licenses/LicenseList.tsx"}),e.jsxs("div",{"data-id":"m9l026q8v","data-path":"src/pages/Licenses/LicenseList.tsx",children:[e.jsx("h4",{className:"font-medium text-yellow-800","data-id":"nl9xupz4u","data-path":"src/pages/Licenses/LicenseList.tsx",children:"Soft Delete (Recommended)"}),e.jsx("p",{className:"text-sm text-yellow-700","data-id":"jvemo5og3","data-path":"src/pages/Licenses/LicenseList.tsx",children:"Mark as cancelled but keep all data for potential recovery. This is safer and maintains audit trails."})]})]}),e.jsxs("div",{className:"flex items-start space-x-3 p-4 border rounded-lg bg-red-50","data-id":"em0td25aa","data-path":"src/pages/Licenses/LicenseList.tsx",children:[e.jsx(K,{className:"w-5 h-5 text-red-600 mt-1","data-id":"0f6ss8ufm","data-path":"src/pages/Licenses/LicenseList.tsx"}),e.jsxs("div",{"data-id":"gxb82jqiv","data-path":"src/pages/Licenses/LicenseList.tsx",children:[e.jsx("h4",{className:"font-medium text-red-800","data-id":"qzc1dp9ij","data-path":"src/pages/Licenses/LicenseList.tsx",children:"Permanent Delete"}),e.jsx("p",{className:"text-sm text-red-700","data-id":"bj6s0c2iy","data-path":"src/pages/Licenses/LicenseList.tsx",children:"Completely remove the license and all associated files and SMS history. This cannot be undone."})]})]})]})}),e.jsxs(xe,{className:"space-x-2","data-id":"mr560w56p","data-path":"src/pages/Licenses/LicenseList.tsx",children:[e.jsx(h,{variant:"outline",onClick:()=>A(!1),disabled:x!==null,"data-id":"9toabgrdg","data-path":"src/pages/Licenses/LicenseList.tsx",children:"Cancel"}),e.jsxs(h,{variant:"outline",onClick:()=>{Le((S==null?void 0:S.ID)||0),A(!1)},disabled:x!==null,className:"text-yellow-600 hover:text-yellow-700 border-yellow-200 hover:bg-yellow-50","data-id":"5w1rbh2g6","data-path":"src/pages/Licenses/LicenseList.tsx",children:[e.jsx(Y,{className:"w-4 h-4 mr-2","data-id":"5j9eivygn","data-path":"src/pages/Licenses/LicenseList.tsx"}),"Soft Delete"]}),e.jsxs(h,{variant:"destructive",onClick:()=>{ue((S==null?void 0:S.ID)||0),A(!1)},disabled:x!==null,"data-id":"uvp6rp9l4","data-path":"src/pages/Licenses/LicenseList.tsx",children:[e.jsx(K,{className:"w-4 h-4 mr-2","data-id":"lyb93izyu","data-path":"src/pages/Licenses/LicenseList.tsx"}),"Permanent Delete"]})]})]})})]})};export{Je as default};
