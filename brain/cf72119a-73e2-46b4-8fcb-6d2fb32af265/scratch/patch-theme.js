import fs from 'node:fs';

const file = 'apps/merchant-admin/src/views/admin.html';
let content = fs.readFileSync(file, 'utf8');

const oldBlock = `    // --- REAL LIGHT / DARK THEME CONTROLLER ---
    let manualThemeOverride = null;

    function updateThemeForSection(sectionId) {
      if (manualThemeOverride !== null) {
        applyTheme(manualThemeOverride);
        return;
      }
      // Automatically real dark mode in developer settings, bright white mode in operations & store settings
      if (sectionId === 'developerHub') {
        applyTheme('dark');
      } else {
        applyTheme('light');
      }
    }

    function applyTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      document.body.setAttribute('data-theme', theme);

      const icon = document.getElementById('headerThemeIcon');
      const text = document.getElementById('headerThemeText');
      if (theme === 'dark') {
        if (icon) icon.textContent = '';
        if (text) text.textContent = 'Real Dark';
      } else {
        if (icon) icon.textContent = '';
        if (text) text.textContent = 'Theme: Light';
      }
    }

    function toggleThemeManual() {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      manualThemeOverride = next;
      applyTheme(next);
      showAdminToast(\`Switched to \${next === 'dark' ? 'Real Dark Mode' : 'Theme: Light Mode'}\`);
    }`;

const newBlock = `    // --- GLOBAL ENTERPRISE LIGHT / DARK THEME CONTROLLER ---
    function getStoredTheme() {
      try {
        const stored = localStorage.getItem('paygate_theme');
        if (stored === 'light' || stored === 'dark') return stored;
      } catch (e) { }
      return 'dark'; // Clean enterprise dark default
    }

    function applyTheme(theme) {
      const mode = (theme === 'light') ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', mode);
      document.body.setAttribute('data-theme', mode);
      try {
        localStorage.setItem('paygate_theme', mode);
      } catch (e) { }

      const icon = document.getElementById('headerThemeIcon');
      const text = document.getElementById('headerThemeText');
      if (icon) icon.textContent = '';
      if (text) text.textContent = (mode === 'dark') ? 'Dark Mode' : 'Light Mode';
    }

    function toggleThemeManual() {
      const current = document.documentElement.getAttribute('data-theme') || getStoredTheme();
      const next = (current === 'dark') ? 'light' : 'dark';
      applyTheme(next);
      showAdminToast(\`Switched to \${next === 'dark' ? 'Dark Mode' : 'Light Mode'}\`);
    }

    function updateThemeForSection(sectionId) {
      applyTheme(getStoredTheme());
    }`;

const normalizedContent = content.replace(/\r\n/g, '\n');
const normalizedOld = oldBlock.replace(/\r\n/g, '\n');
const normalizedNew = newBlock.replace(/\r\n/g, '\n');

if (!normalizedContent.includes(normalizedOld)) {
  console.error('Target old block not found!');
  process.exit(1);
}

const updated = normalizedContent.replace(normalizedOld, normalizedNew);
fs.writeFileSync(file, updated, 'utf8');
console.log('Successfully updated theme controller!');
