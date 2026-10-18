import fs from 'node:fs';

const file = 'apps/merchant-admin/src/views/admin.html';
let content = fs.readFileSync(file, 'utf8');

// 1. Update CSS Variables for Primary Color: #ed1c24
content = content.replace(
  /--primary:\s*[^;]+;/g,
  '--primary: #ed1c24;'
);
content = content.replace(
  /--primary-hover:\s*[^;]+;/g,
  '--primary-hover: #c81018;'
);
content = content.replace(
  /--border-focus:\s*[^;]+;/g,
  '--border-focus: #ed1c24;'
);

// 2. Harmonize KPI values, link/accent colors
content = content.replace(
  /--kpi-vol-color:\s*[^;]+;/g,
  '--kpi-vol-color: #ed1c24;'
);
content = content.replace(
  /--kpi-success-color:\s*[^;]+;/g,
  '--kpi-success-color: #ed1c24;'
);

// 3. Update global border-radius across cards, inputs, buttons, pills, badges to 6px
content = content.replace(
  /\/\* STRICT PROFESSIONAL WORKSTATION RESET[^*]+\*\//s,
  '/* PROFESSIONAL WORKSTATION DESIGN SYSTEM: CLEAN #ed1c24 PRIMARY ACCENT, HARMONIOUS 6PX BORDER RADIUS */'
);

content = content.replace(
  /\.btn\s*\{([^}]+)\}/s,
  (match, p1) => {
    let updated = p1.replace(/border-radius:\s*[^;]+;/, 'border-radius: 6px;');
    return `.btn {${updated}}`;
  }
);

content = content.replace(
  /\.card\s*\{([^}]+)\}/s,
  (match, p1) => {
    let updated = p1.replace(/border-radius:\s*[^;]+;/, 'border-radius: 6px;');
    return `.card {${updated}}`;
  }
);

content = content.replace(
  /\.kpi-box\s*\{([^}]+)\}/s,
  (match, p1) => {
    let updated = p1.replace(/border-radius:\s*[^;]+;/, 'border-radius: 6px;');
    return `.kpi-box {${updated}}`;
  }
);

content = content.replace(
  /\.settings-group-box\s*\{([^}]+)\}/s,
  (match, p1) => {
    let updated = p1.replace(/border-radius:\s*[^;]+;/, 'border-radius: 6px;');
    return `.settings-group-box {${updated}}`;
  }
);

content = content.replace(
  /input,\s*select,\s*textarea\s*\{([^}]+)\}/s,
  (match, p1) => {
    let updated = p1.replace(/border-radius:\s*[^;]+;/, 'border-radius: 6px;');
    return `input, select, textarea {${updated}}`;
  }
);

content = content.replace(
  /\.sub-nav-pill\s*\{([^}]+)\}/s,
  (match, p1) => {
    let updated = p1.replace(/border-radius:\s*[^;]+;/, 'border-radius: 6px;');
    return `.sub-nav-pill {${updated}}`;
  }
);

content = content.replace(
  /\.badge\s*\{([^}]+)\}/s,
  (match, p1) => {
    let updated = p1.replace(/border-radius:\s*[^;]+;/, 'border-radius: 4px;');
    return `.badge {${updated}}`;
  }
);

content = content.replace(
  /\.theme-mode-pill,\s*\.store-switch-badge\s*\{([^}]+)\}/s,
  (match, p1) => {
    let updated = p1.replace(/border-radius:\s*[^;]+;/, 'border-radius: 6px;');
    return `.theme-mode-pill,\n    .store-switch-badge {${updated}}`;
  }
);

content = content.replace(
  /\.live-pulse-badge\s*\{([^}]+)\}/s,
  (match, p1) => {
    let updated = p1.replace(/border-radius:\s*[^;]+;/, 'border-radius: 6px;');
    return `.live-pulse-badge {${updated}}`;
  }
);

content = content.replace(
  /\.brand-badge\s*\{([^}]+)\}/s,
  (match, p1) => {
    let updated = p1.replace(/border-radius:\s*[^;]+;/, 'border-radius: 4px;');
    return `.brand-badge {${updated}}`;
  }
);

// 4. Update .btn-primary CSS rule
content = content.replace(
  /\.btn-primary\s*\{[^}]+\}/,
  `.btn-primary {
      background: #ed1c24;
      border-color: #c81018;
      color: #ffffff;
      font-weight: 600;
    }`
);

content = content.replace(
  /\.btn-primary:hover\s*\{[^}]+\}/,
  `.btn-primary:hover {
      background: #c81018;
      border-color: #a00c12;
      color: #ffffff;
    }`
);

// 5. Replace multi-colored simulator headers and buttons
content = content.replace(
  /style="border:2px solid #3b82f6;\s*background:linear-gradient\(135deg,\s*rgba\(59,130,246,0\.12\)\s*0%,\s*rgba\(15,23,42,0\.98\)\s*100%\);/g,
  'style="border:1px solid var(--border); background:var(--bg-card);'
);

content = content.replace(
  /style="border:1px solid #3b82f6;\s*background:#0b0f19;"/g,
  'style="border:1px solid var(--border); background:var(--bg-card); border-radius:6px;"'
);

content = content.replace(
  /style="border:1px solid #ec4899;\s*background:#0b0f19;"/g,
  'style="border:1px solid var(--border); background:var(--bg-card); border-radius:6px;"'
);

content = content.replace(
  /style="border:1px solid #334155;\s*background:#0f172a;\s*margin-bottom:1\.5rem;"/g,
  'style="border:1px solid var(--border); background:var(--bg-card); border-radius:6px; margin-bottom:1.5rem;"'
);

content = content.replace(
  /style="border:1px solid #1e293b;\s*background:#0b0f19;"/g,
  'style="border:1px solid var(--border); background:var(--bg-card); border-radius:6px;"'
);

// Remove pink and bright blue headers from stream panels
content = content.replace(/color:#60a5fa;/g, 'color:var(--text-heading);');
content = content.replace(/color:#f472b6;/g, 'color:var(--text-heading);');

// Stream buttons to unified primary #ed1c24
content = content.replace(
  /style="width:100%;\s*background:#2563eb;\s*border-color:#1d4ed8;\s*padding:0\.65rem;\s*font-size:0\.92rem;\s*font-weight:800;[^"]*"/g,
  'style="width:100%; background:#ed1c24; border-color:#c81018; color:#ffffff; padding:0.65rem; font-size:0.92rem; font-weight:700; border-radius:6px; display:flex; justify-content:center; align-items:center; gap:0.5rem;"'
);

content = content.replace(
  /style="width:100%;\s*background:#db2777;\s*border-color:#be185d;\s*padding:0\.65rem;\s*font-size:0\.92rem;\s*font-weight:800;[^"]*"/g,
  'style="width:100%; background:#ed1c24; border-color:#c81018; color:#ffffff; padding:0.65rem; font-size:0.92rem; font-weight:700; border-radius:6px; display:flex; justify-content:center; align-items:center; gap:0.5rem;"'
);

// Harmonize modal radius
content = content.replace(
  /border-radius:\s*3px\s*!important;/g,
  'border-radius: 6px !important;'
);

fs.writeFileSync(file, content, 'utf8');
console.log('Successfully applied #ed1c24 primary color and unified 6px border-radius system!');
