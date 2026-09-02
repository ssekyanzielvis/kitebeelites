const fs = require('fs');
const files = [
  'app/admin/slides/page.tsx',
  'app/admin/achievements/page.tsx',
  'app/admin/gallery/page.tsx',
  'app/admin/core-values/page.tsx',
  'app/admin/news/page.tsx',
  'app/admin/programs/page.tsx',
  'app/admin/leadership/page.tsx',
  'app/admin/staff/page.tsx'
];

files.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  
  const match = content.match(/onClick=\{\(\) => (?:openEditModal|handleEdit)\(([^)]+)\)\}/);
  if (match && match[1]) {
    const varName = match[1];
    content = content.replace(/onClick=\{\(e\) => \{ e\.stopPropagation\(\); setPreviewMedia[^;]+; \}\}/g, `onClick={(e) => { e.stopPropagation(); setPreviewMedia((${varName} as any).image_url || (${varName} as any).media_url); }}`);
    fs.writeFileSync(filePath, content);
  }
});
