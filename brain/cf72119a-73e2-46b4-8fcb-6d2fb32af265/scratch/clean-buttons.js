import fs from 'node:fs';

let html = fs.readFileSync('apps/merchant-admin/src/views/admin.html', 'utf8');
html = html.replace(
  'style="background:#db2777; border-color:#be185d; font-size:0.82rem; padding:0.45rem 1rem;"',
  'style="background:#ed1c24; border-color:#c81018; color:#ffffff; font-size:0.82rem; padding:0.45rem 1rem; border-radius:6px;"'
);
html = html.replace(
  'style="background:#2563eb; border-color:#1d4ed8; font-size:0.82rem; padding:0.45rem 1rem;"',
  'style="background:#ed1c24; border-color:#c81018; color:#ffffff; font-size:0.82rem; padding:0.45rem 1rem; border-radius:6px;"'
);

// Also remove any #3b82f6 or #2563eb remaining in simulator
html = html.replace(
  'style="background:#2563eb; color:#ffffff; font-size:0.75rem; padding:0.25rem 0.65rem;"',
  'style="background:#ed1c24; color:#ffffff; font-size:0.75rem; padding:0.25rem 0.65rem; border-radius:4px;"'
);

fs.writeFileSync('apps/merchant-admin/src/views/admin.html', html, 'utf8');
console.log('Cleaned remaining test injection buttons to unified #ed1c24 and 6px border-radius!');
