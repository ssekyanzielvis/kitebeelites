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
  
  if (content.includes('MediaPreviewModal')) return;
  
  // 1. Import MediaPreviewModal
  content = content.replace(
    /(import \{[^}]+\} from 'lucide-react';)/,
    "$1\nimport MediaPreviewModal from '@/components/MediaPreviewModal';"
  );
  
  // Ensure Eye is imported
  if (!content.includes(' Eye,') && !content.includes('{ Eye,') && !content.includes(', Eye ') && !content.includes('{ Eye }')) {
    content = content.replace(/from 'lucide-react';/, ", Eye } from 'lucide-react';").replace(/}, Eye/, ', Eye');
  }
  
  // 2. Add state
  content = content.replace(
    /const \[isModalOpen, setIsModalOpen\] = useState\(false\);/,
    "const [isModalOpen, setIsModalOpen] = useState(false);\n  const [previewMedia, setPreviewMedia] = useState<string | null>(null);"
  );
  
  // 3. Add Modal in render
  content = content.replace(
    /(\{isModalOpen && \()/,
    `{previewMedia && (
        <MediaPreviewModal 
          url={previewMedia} 
          onClose={() => setPreviewMedia(null)} 
        />
      )}

      $1`
  );
  
  // 4. Add the Eye button next to the Edit button
  const editBtnRegex = /(<button[^>]*onClick=\{\(\) => (?:openEditModal|handleEdit)\(([^)]+)\)\}[^>]*>[\s\S]*?<Edit[^>]*>[\s\S]*?<\/button>)/;
  
  content = content.replace(editBtnRegex, (match, p1, p2) => {
    return `<button
                onClick={(e) => { e.stopPropagation(); setPreviewMedia(${p2}.image_url || ${p2}.media_url); }}
                className="p-2 text-purple-600 hover:bg-purple-50 rounded"
                title="Preview Media"
              >
                <Eye className="w-5 h-5" />
              </button>
              ` + match;
  });
  
  fs.writeFileSync(filePath, content);
  console.log('Updated', filePath);
});
