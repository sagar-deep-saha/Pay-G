import fs from 'node:fs';
import path from 'node:path';

const adminHtmlPath = path.resolve('apps/merchant-admin/src/views/admin.html');
let content = fs.readFileSync(adminHtmlPath, 'utf8');

// 1. Clean professional CSS overrides to inject
// Replaces fluffy AI-generated styling with high-density enterprise workstation look
const enterpriseCss = `
  <style>
    :root,
    [data-theme="light"] {
      --theme: light;
      --bg: #eceff1;
      --bg-header: #1e293b;
      --bg-nav: #ffffff;
      --bg-subnav: #f1f5f9;
      --bg-card: #ffffff;
      --bg-surface: #f8fafc;
      --bg-box: #ffffff;
      --bg-elevated: #f1f5f9;
      --bg-slot: #ffffff;
      --bg-table-th: #f1f5f9;
      --bg-input: #ffffff;

      --border: #cbd5e1;
      --border-focus: #2563eb;
      --border-subtle: #e2e8f0;
      --border-hover: #94a3b8;

      --text: #0f172a;
      --text-muted: #475569;
      --text-dim: #64748b;
      --text-heading: #0f172a;

      --primary: #1e40af;
      --primary-hover: #1d4ed8;
      --primary-glow: none;
      --primary-light: #eff6ff;

      --success: #15803d;
      --success-glow: none;
      --danger: #b91c1c;
      --danger-glow: none;
      --warning: #b45309;
      --warning-glow: none;
      --info: #0369a1;
      --info-glow: none;

      --card-shadow: none;
      --card-shadow-hover: none;

      --badge-success-bg: #f0fdf4;
      --badge-success-text: #166534;
      --badge-success-border: #bbf7d0;
      --badge-danger-bg: #fef2f2;
      --badge-danger-text: #991b1b;
      --badge-danger-border: #fecaca;
      --badge-warning-bg: #fffbeb;
      --badge-warning-text: #92400e;
      --badge-warning-border: #fde68a;
      --badge-info-bg: #f0f9ff;
      --badge-info-text: #075985;
      --badge-info-border: #bae6fd;
      --badge-neutral-bg: #f8fafc;
      --badge-neutral-text: #334155;
      --badge-neutral-border: #cbd5e1;

      --btn-sec-bg: #ffffff;
      --btn-sec-text: #1e293b;
      --btn-sec-border: #94a3b8;
      --btn-sec-hover-bg: #f1f5f9;
      --btn-sec-hover-text: #0f172a;

      --tr-hover: #f1f5f9;
      --focus-ring: none;

      --kpi-vol-color: #15803d;
      --kpi-success-color: #1e40af;
      --kpi-queue-color: #b45309;
      --kpi-pending-color: #b91c1c;

      --header-bg: #182234;
      --header-border: #0f172a;
      --header-title: #ffffff;
      --nav-bg: #ffffff;
      --nav-border: #cbd5e1;
      --subnav-bg: #f8fafc;
      --subnav-border: #cbd5e1;
      --pill-bg: #ffffff;
      --pill-text: #334155;
      --pill-border: #cbd5e1;
    }

    [data-theme="dark"] {
      --theme: dark;
      --bg: #0f172a;
      --bg-header: #020617;
      --bg-nav: #0b1329;
      --bg-subnav: #0f172a;
      --bg-card: #131d35;
      --bg-surface: #0b1329;
      --bg-box: #0b1329;
      --bg-elevated: #1e293b;
      --bg-slot: #0b1329;
      --bg-table-th: #0b1329;
      --bg-input: #0b1329;

      --border: #334155;
      --border-focus: #38bdf8;
      --border-subtle: #1e293b;
      --border-hover: #475569;

      --text: #f8fafc;
      --text-muted: #94a3b8;
      --text-dim: #64748b;
      --text-heading: #ffffff;

      --primary: #38bdf8;
      --primary-hover: #0284c7;
      --primary-glow: none;
      --primary-light: rgba(56, 189, 248, 0.1);

      --success: #34d399;
      --success-glow: none;
      --danger: #f87171;
      --danger-glow: none;
      --warning: #fbbf24;
      --warning-glow: none;
      --info: #38bdf8;
      --info-glow: none;

      --card-shadow: none;
      --card-shadow-hover: none;

      --badge-success-bg: rgba(52, 211, 153, 0.15);
      --badge-success-text: #34d399;
      --badge-success-border: rgba(52, 211, 153, 0.4);
      --badge-danger-bg: rgba(248, 113, 113, 0.15);
      --badge-danger-text: #f87171;
      --badge-danger-border: rgba(248, 113, 113, 0.4);
      --badge-warning-bg: rgba(251, 191, 36, 0.15);
      --badge-warning-text: #fbbf24;
      --badge-warning-border: rgba(251, 191, 36, 0.4);
      --badge-info-bg: rgba(56, 189, 248, 0.15);
      --badge-info-text: #38bdf8;
      --badge-info-border: rgba(56, 189, 248, 0.4);
      --badge-neutral-bg: #1e293b;
      --badge-neutral-text: #94a3b8;
      --badge-neutral-border: #334155;

      --btn-sec-bg: #1e293b;
      --btn-sec-text: #f1f5f9;
      --btn-sec-border: #475569;
      --btn-sec-hover-bg: #334155;
      --btn-sec-hover-text: #ffffff;

      --tr-hover: rgba(255, 255, 255, 0.03);
      --focus-ring: none;

      --kpi-vol-color: #34d399;
      --kpi-success-color: #38bdf8;
      --kpi-queue-color: #fbbf24;
      --kpi-pending-color: #f87171;

      --header-bg: #020617;
      --header-border: #1e293b;
      --header-title: #ffffff;
      --nav-bg: #0b1329;
      --nav-border: #334155;
      --subnav-bg: #0f172a;
      --subnav-border: #334155;
      --pill-bg: #0b1329;
      --pill-text: #cbd5e1;
      --pill-border: #334155;
    }

    /* STRICT PROFESSIONAL RESET: ZERO ANIMATIONS, ZERO TRANSITIONS, ZERO FLOATING EFFECTS */
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      transition: none !important;
      animation: none !important;
      box-shadow: none !important;
      border-radius: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    }

    *:hover {
      transform: none !important;
      filter: none !important;
    }

    body {
      background: var(--bg);
      color: var(--text);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      font-size: 13px;
      line-height: 1.45;
    }

    /* TOP ENTERPRISE HEADER */
    header {
      background: var(--header-bg);
      border-bottom: 1px solid var(--header-border);
      padding: 0.45rem 1.25rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      z-index: 1000;
      height: 44px;
    }

    .brand-group {
      display: flex;
      align-items: center;
      gap: 0.65rem;
    }

    .brand-title {
      font-size: 1.05rem;
      font-weight: 700;
      color: var(--header-title);
      letter-spacing: 0.02em;
      text-transform: uppercase;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }

    .brand-badge {
      font-size: 0.68rem;
      font-weight: 700;
      padding: 0.15rem 0.45rem;
      border-radius: 2px;
      background: #334155;
      color: #cbd5e1;
      border: 1px solid #475569;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .header-quick-stats {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    /* UTILITY HEADER BUTTONS */
    .theme-mode-pill,
    .store-switch-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.2rem 0.55rem;
      border-radius: 2px;
      font-size: 0.72rem;
      font-weight: 600;
      cursor: pointer;
      border: 1px solid #475569;
      background: #1e293b;
      color: #f1f5f9;
      user-select: none;
      text-transform: uppercase;
    }

    .theme-mode-pill:hover,
    .store-switch-badge:hover {
      background: #334155;
    }

    .store-switch-badge.is-online {
      background: #14532d;
      border-color: #16a34a;
      color: #dcfce7;
    }

    .store-switch-badge.is-offline {
      background: #450a0a;
      border-color: #dc2626;
      color: #fee2e2;
    }

    .live-pulse-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      background: #064e3b;
      border: 1px solid #059669;
      color: #a7f3d0;
      padding: 0.2rem 0.5rem;
      border-radius: 2px;
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .pulse-dot {
      display: none;
    }

    /* PRIMARY WORKSTATION TAB STRIP */
    .main-nav-bar {
      background: var(--nav-bg);
      border-bottom: 1px solid var(--nav-border);
      display: flex;
      padding: 0 1.25rem;
      position: sticky;
      top: 44px;
      z-index: 999;
      gap: 0;
    }

    .main-nav-btn {
      padding: 0.65rem 1.15rem;
      cursor: pointer;
      border: 1px solid transparent;
      border-bottom: none;
      background: transparent;
      font-weight: 700;
      color: var(--text-muted);
      white-space: nowrap;
      font-size: 0.85rem;
      display: flex;
      align-items: center;
      gap: 0.4rem;
      border-radius: 0;
      margin-bottom: -1px;
    }

    .main-nav-btn:hover {
      color: var(--text);
      background: #f1f5f9;
    }

    .main-nav-btn.active {
      color: var(--text-heading);
      background: var(--bg);
      border-color: var(--nav-border);
      border-top: 3px solid var(--primary);
      border-bottom: 1px solid var(--bg);
    }

    /* SECONDARY WORKBENCH TOOLBAR */
    .sub-nav-bar {
      background: var(--subnav-bg);
      border-bottom: 1px solid var(--subnav-border);
      display: flex;
      gap: 0.35rem;
      padding: 0.45rem 1.25rem;
      overflow-x: auto;
    }

    .sub-nav-pill {
      padding: 0.3rem 0.75rem;
      cursor: pointer;
      border: 1px solid var(--pill-border);
      background: var(--pill-bg);
      border-radius: 2px;
      font-weight: 600;
      color: var(--pill-text);
      white-space: nowrap;
      font-size: 0.78rem;
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
    }

    .sub-nav-pill:hover {
      color: var(--text);
      background: #e2e8f0;
      border-color: #94a3b8;
    }

    .sub-nav-pill.active {
      color: #ffffff;
      background: var(--primary);
      border-color: var(--primary);
    }

    main {
      padding: 1.25rem;
      max-width: 1540px;
      width: 100%;
      margin: 0 auto;
      flex: 1;
    }

    /* HIGH DENSITY KPI TILES */
    .kpi-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .kpi-box {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 2px;
      padding: 0.85rem 1.1rem;
    }

    .kpi-title {
      font-size: 0.7rem;
      color: var(--text-muted);
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .kpi-value {
      font-size: 1.6rem;
      font-weight: 700;
      margin-top: 0.25rem;
      font-family: Consolas, "SF Mono", Monaco, "Courier New", monospace;
    }

    /* SOLID RECTANGULAR CARDS */
    .card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 2px;
      padding: 1.15rem;
      margin-bottom: 1rem;
    }

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.85rem;
      padding-bottom: 0.65rem;
      border-bottom: 1px solid var(--border-subtle);
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .card-heading {
      font-size: 0.95rem;
      font-weight: 700;
      color: var(--text-heading);
      letter-spacing: 0.01em;
    }

    .card-subtext {
      font-size: 0.78rem;
      color: var(--text-muted);
      margin-top: 0.15rem;
    }

    .settings-group-box {
      background: var(--bg-surface);
      border: 1px solid var(--border);
      border-radius: 2px;
      padding: 1rem;
      margin-bottom: 1rem;
    }

    .group-box-title {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      color: var(--primary);
      letter-spacing: 0.05em;
      margin-bottom: 0.75rem;
      padding-bottom: 0.35rem;
      border-bottom: 1px solid var(--border);
    }

    /* COMPACT DATA TABLES */
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.8rem;
      border: 1px solid var(--border);
    }

    th {
      text-align: left;
      padding: 0.5rem 0.75rem;
      background: var(--bg-table-th);
      color: var(--text-muted);
      font-weight: 700;
      border-bottom: 1px solid var(--border);
      border-right: 1px solid var(--border-subtle);
      text-transform: uppercase;
      font-size: 0.68rem;
      letter-spacing: 0.05em;
    }

    td {
      padding: 0.55rem 0.75rem;
      border-bottom: 1px solid var(--border-subtle);
      border-right: 1px solid var(--border-subtle);
      color: var(--text);
      vertical-align: middle;
    }

    tr:hover td {
      background: var(--tr-hover);
    }

    /* RECTANGULAR ENTERPRISE STATUS BADGES */
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.15rem 0.45rem;
      border-radius: 2px;
      font-size: 0.68rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      border: 1px solid transparent;
      font-family: Consolas, "SF Mono", monospace;
    }

    .badge-success {
      background: var(--badge-success-bg);
      color: var(--badge-success-text);
      border-color: var(--badge-success-border);
    }

    .badge-danger {
      background: var(--badge-danger-bg);
      color: var(--badge-danger-text);
      border-color: var(--badge-danger-border);
    }

    .badge-warning {
      background: var(--badge-warning-bg);
      color: var(--badge-warning-text);
      border-color: var(--badge-warning-border);
    }

    .badge-info {
      background: var(--badge-info-bg);
      color: var(--badge-info-text);
      border-color: var(--badge-info-border);
    }

    .badge-neutral {
      background: var(--badge-neutral-bg);
      color: var(--badge-neutral-text);
      border-color: var(--badge-neutral-border);
    }

    /* CLEAN FLAT BUTTONS */
    .btn {
      padding: 0.4rem 0.85rem;
      border-radius: 2px;
      border: 1px solid #94a3b8;
      font-weight: 600;
      cursor: pointer;
      font-size: 0.78rem;
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      text-decoration: none;
      user-select: none;
      background: #ffffff;
      color: #0f172a;
    }

    .btn:hover {
      background: #f1f5f9;
      border-color: #64748b;
    }

    .btn-primary {
      background: #1e40af;
      border-color: #1e3a8a;
      color: #ffffff;
    }

    .btn-primary:hover {
      background: #1d4ed8;
      border-color: #1e40af;
    }

    .btn-secondary {
      background: var(--btn-sec-bg);
      border-color: var(--btn-sec-border);
      color: var(--btn-sec-text);
    }

    .btn-secondary:hover {
      background: var(--btn-sec-hover-bg);
    }

    .btn-success {
      background: #15803d;
      border-color: #166534;
      color: #ffffff;
    }

    .btn-success:hover {
      background: #16a34a;
    }

    .btn-danger {
      background: #b91c1c;
      border-color: #991b1b;
      color: #ffffff;
    }

    .btn-danger:hover {
      background: #dc2626;
    }

    /* COMPACT FORM CONTROLS */
    input, select, textarea {
      border: 1px solid var(--border);
      border-radius: 2px;
      padding: 0.4rem 0.6rem;
      font-size: 0.8rem;
      background: var(--bg-input);
      color: var(--text);
      font-family: inherit;
    }

    input:focus, select:focus, textarea:focus {
      outline: 1px solid var(--border-focus);
      border-color: var(--border-focus);
    }

    /* CODE, LOG & MONOSPACE BLOCKS */
    code, pre, .mono-data {
      font-family: Consolas, "SF Mono", Monaco, "Courier New", monospace !important;
      font-size: 0.78rem;
    }

    /* MODAL AND DIALOGS */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
    }

    .modal-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 2px;
      padding: 1.25rem;
      max-width: 640px;
      width: 90%;
      max-height: 85vh;
      overflow-y: auto;
    }
  </style>
`;

// Replace style block (between <style> and </style>)
const styleStart = content.indexOf('<style>');
const styleEnd = content.indexOf('</style>') + '</style>'.length;
if (styleStart !== -1 && styleEnd !== -1) {
  content = content.substring(0, styleStart) + enterpriseCss.trim() + content.substring(styleEnd);
}

// 2. Emoji replacements map
const emojiReplacements = [
  // Header and branding
  ['🛡️ PayGate', 'PayGate'],
  ['🛡️ YOUPI PG', 'PayGate'],
  ['Merchant &amp; Supervisor Hub', 'Merchant &amp; Supervisor Console'],
  ['☀️', ''],
  ['Bright White', 'Theme: Light'],
  ['🌙', ''],
  ['●', ''],
  ['Store (5000):', 'Store [Port 5000]:'],
  ['💻 LOCALHOST', 'LOCALHOST'],
  ['💻 LOCALHOST MODE', 'LOCALHOST MODE'],
  ['🌍 PRODUCTION', 'PRODUCTION'],
  ['🌍 PRODUCTION MODE', 'PRODUCTION MODE'],
  ['Live Syncing', '[SYNC: ACTIVE]'],

  // Main navigation
  ['<span>🏪</span>\n      <span>Daily Merchant Operations</span>', '<span>Merchant Operations</span>'],
  ['<span>🏪</span>', ''],
  ['<span>⚙️</span>\n      <span>Store Settings</span>', '<span>Store Settings</span>'],
  ['<span>⚙️</span>', ''],
  ['<span>🛠️</span>\n      <span>Developer &amp; Infrastructure Hub</span>', '<span>Developer &amp; Infrastructure</span>'],
  ['<span>🛠️</span>', ''],
  ['<span>🛡️</span>\n      <span>Security</span>', '<span>Security Console</span>'],
  ['<span>🛡️</span>', ''],

  // Sub navigation labels in JS
  ["'📊 Live Monitor & Slots'", "'Live Monitor & Slots'"],
  ["'🏪 Counter Desk (POS Cashier)'", "'Counter Desk (POS)'"],
  ["'💳 Transactions Ledger'", "'Transactions Ledger'"],
  ["'📡 Payment Observers Status'", "'Observer Status'"],
  ["'🎨 Brand Identity & Live Mockup'", "'Brand Identity & Preview'"],
  ["'⚡ Receiving Accounts (VPAs)'", "'Receiving Accounts (VPA)'"],
  ["'🏬 Selling Modes & Modalities'", "'Selling Modes'"],
  ["'🎮 Payment Simulator'", "'Payment Simulator'"],
  ["'🖥️ System Supervisor & Store (5000)'", "'Process Supervisor'"],
  ["'☁️ Cloudflare Tunnel'", "'Cloudflare Tunnel'"],
  ["'🔐 Webhooks & Secrets'", "'Webhooks & API Keys'"],
  ["'📱 Android SMS Hub'", "'Android SMS Gateway'"],
  ["'📧 Gmail & WhatsApp Protocols'", "'Gmail & WhatsApp Protocols'"],
  ["'🚫 Banned Users'", "'Banned Entities'"],
  ["'🚨 Security Events'", "'Security Audit Events'"],
  ["'📜 Ban History'", "'Enforcement History'"],

  // Cards, headings, buttons, and badges
  ['🔴 Real-Time Receiving Account Slot Ownership (UPI Invariant)', 'Real-Time Receiving Account Slot Ownership (UPI Invariant)'],
  ['📲 Download Companion APK', 'Download Companion APK'],
  ['📲 Download APK', 'Download APK'],
  ['💾 Save Credentials', 'Save Credentials'],
  ['🔗 Authorize OAuth', 'Authorize OAuth'],
  ['⚙️ Gear Icon', 'Settings Menu'],
  ['⚠️ Google Cloud Console Setup Note:', 'Note: Google Cloud Console Setup'],
  ['🚨', ''],
  ['🔓 Restore Customer Access (Unban)', 'Restore Customer Access (Unban)'],
  ['🔓', ''],
  ['🚫 Manually Ban Abusive Customer', 'Manually Ban Abusive Customer'],
  ['🚫', ''],
  ['💵 Cash at Till', 'Cash at Counter'],
  ['💳 Card at POS', 'Card at POS'],
  ['💳 Card at Counter', 'Card at Counter'],
  ['✓✓ ', '[DUAL] '],
  ['✓ ', '[SINGLE] '],
  ['🟢 RUNNING', '[RUNNING]'],
  ['⚪ STOPPED', '[STOPPED]'],
  ['🟢 ONLINE & ACTIVE', '[ONLINE]'],
  ['🔴 DISABLED', '[DISABLED]'],
  ['🟢 GREEN (WORKING)', 'GREEN (NORMAL)'],
  ['🟡 YELLOW (EXTRA PROCESSING)', 'YELLOW (PROCESSING)'],
  ['🔴 RED (DOWN)', 'RED (DOWN)'],
  ['⚪ OFF · REAL SERVER STATUS', 'REAL SERVER STATUS'],
  ['🔴 [ ON ] TEST MODE', '[TEST MODE: ON]'],
  ['🛡️ Automatic Ban System:', 'Automatic Ban System:'],
  ['🚨 FRAUD DETECTED!', 'FRAUD DETECTED:'],
  ['✅ Authenticated as', 'Authenticated as'],
  ['🔄 Re-authorize Account', 'Re-authorize Account'],
  ['🔄 Re-Pair Device', 'Re-Pair Device'],
  ['🔄 Refresh QR Code', 'Refresh QR Code'],
  ['⚡ Connect WhatsApp', 'Connect WhatsApp'],
  ['⚡ Buy Now with PayGate', 'Buy Now with PayGate'],
  ['🔔 Counter Payment Request:', 'Counter Payment Request:'],
  ['🔔 Cashier Prompt:', 'Cashier Prompt:'],
  ['🎉 Google Account Connected:', 'Google Account Connected:'],
  ['⚠️ Error:', 'Error:'],
  ['✅ Parsed successfully!', 'Parsed successfully:'],
  ['📜 Verbatim Raw Message Evidence', 'Verbatim Raw Message Evidence'],
  ['▶ Start All Services', 'Start All Services'],
  ['⏹ Stop All Services', 'Stop All Services'],
  ['▶ Enable', 'Enable'],
  ['⏹ Disable', 'Disable'],
  ['⚡', ''],
  ['✨', '']
];

for (const [from, to] of emojiReplacements) {
  content = content.replaceAll(from, to);
}

// Strip remaining standalone emojis that may be in buttons or headings
// (regex targets Unicode emoji blocks)
content = content.replace(/([\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E0}-\u{1F1FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}])/gu, '');

fs.writeFileSync(adminHtmlPath, content, 'utf8');
console.log('Successfully refactored admin.html to classic enterprise workstation look and removed all emojis/effects!');
