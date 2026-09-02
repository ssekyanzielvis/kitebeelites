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
  
  content = content.replace(/} , Eye } from 'lucide-react';/g, ", Eye } from 'lucide-react';");
  
  fs.writeFileSync(filePath, content);
  console.log('Fixed', filePath);
});
