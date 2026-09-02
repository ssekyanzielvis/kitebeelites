const fs = require('fs');

const files = [
  'app/(visitor)/page.tsx',
  'app/(visitor)/gallery/page.tsx',
  'app/(visitor)/about/page.tsx',
  'app/(visitor)/leadership/page.tsx',
  'components/ImageCard.tsx'
];

files.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (!content.includes('MediaRenderer')) {
    content = content.replace(/(import [^;]+;)/, "$1\nimport MediaRenderer from '@/components/MediaRenderer';");
  }

  content = content.replace(/<Image\s/g, '<MediaRenderer ');
  content = content.replace(/<\/Image>/g, '</MediaRenderer>');
  content = content.replace(/\s+sizes="[^"]+"/g, '');

  fs.writeFileSync(filePath, content);
  console.log('Processed', filePath);
});
