const fs = require('fs');

const files = [
  'app/admin/slides/page.tsx',
  'app/admin/achievements/page.tsx',
  'app/admin/gallery/page.tsx',
  'app/admin/core-values/page.tsx',
  'app/admin/news/page.tsx',
  'app/admin/programs/page.tsx',
  'app/admin/leadership/page.tsx',
  'app/admin/content/page.tsx'
];

files.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  if (filePath.includes('gallery/page.tsx')) {
    // Gallery has a custom ternary for video/image. Let's just replace it.
    content = content.replace(
      /\{item\.image_url\?\.match\([\s\S]*?<\/img>[\s\S]*?\}/g,
      `<MediaRenderer src={item.image_url} alt={item.description || 'Gallery'} className="w-full h-48 object-cover" isThumbnail />`
    );
  } else {
    // Replace standard <img src={var.image_url} alt={...} className={...} />
    content = content.replace(
      /<img\s+src=\{([^}]+)\}\s+alt=\{([^}]+)\}\s+className="([^"]+)"\s*\/>/g,
      '<MediaRenderer src={$1} alt={$2} className="$3" isThumbnail />'
    );
    // Replace standard <img src={var.image_url} alt="..." className="..." />
    content = content.replace(
      /<img\s+src=\{([^}]+)\}\s+alt="([^"]+)"\s+className="([^"]+)"\s*\/>/g,
      '<MediaRenderer src={$1} alt="$2" className="$3" isThumbnail />'
    );
  }

  fs.writeFileSync(filePath, content);
  console.log('Processed', filePath);
});
