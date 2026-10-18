import fs from 'node:fs';
import path from 'node:path';

const file = path.resolve('apps/merchant-admin/src/views/admin.html');
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/<nav class="main-nav-bar">[\s\S]*?<\/nav>/, `<nav class="main-nav-bar">
    <button class="main-nav-btn active" id="mainNavOperations" onclick="switchSection('operations')">Merchant Operations</button>
    <button class="main-nav-btn" id="mainNavStoreSettings" onclick="switchSection('storeSettings')">Store Settings</button>
    <button class="main-nav-btn" id="mainNavDeveloperHub" onclick="switchSection('developerHub')">Developer &amp; Infrastructure</button>
    <button class="main-nav-btn" id="mainNavSecurity" onclick="switchSection('security')">Security Console</button>
  </nav>`);

fs.writeFileSync(file, content, 'utf8');
console.log('Cleaned main-nav-bar in admin.html!');
