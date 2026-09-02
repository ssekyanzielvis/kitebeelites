const fs = require('fs');

const files = [
  'app/admin/achievements/page.tsx',
  'app/admin/content/page.tsx',
  'app/admin/core-values/page.tsx',
  'app/admin/leadership/page.tsx',
  'app/admin/news/page.tsx',
  'app/admin/programs/page.tsx',
  'app/admin/slides/page.tsx',
  'app/admin/gallery/page.tsx'
];

files.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (!content.includes("import MediaRenderer")) {
    content = content.replace(/(import \{[^}]+\} from 'lucide-react';)/, "$1\nimport MediaRenderer from '@/components/MediaRenderer';");
    fs.writeFileSync(filePath, content);
    console.log('Added import to', filePath);
  }
});
