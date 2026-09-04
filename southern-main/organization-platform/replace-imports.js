const fs = require('fs');
const glob = require('glob');

const files = glob.sync('app/(visitor)/**/*.tsx');

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Add useHydratedTheme to the import if useAppStore is imported from @/lib/store
  if (content.includes('useHydratedTheme') && !content.match(/import\s+{[^}]*useHydratedTheme[^}]*}\s+from\s+['"]@\/lib\/store['"]/)) {
    content = content.replace(/import\s+{([^}]*)}\s+from\s+['"]@\/lib\/store['"];/, (match, p1) => {
      if (p1.includes('useHydratedTheme')) return match;
      return `import { ${p1.trim()}, useHydratedTheme } from '@/lib/store';`;
    });
    changed = true;
  }

  // Double check if there's any file that has `const { theme } = useHydratedTheme();` but no import at all
  if (content.includes('useHydratedTheme()') && !content.includes('useHydratedTheme } from')) {
    content = content.replace(/import\s+{([^}]*)}\s+from\s+['"]@\/lib\/store['"];/, (match, p1) => {
      if (p1.includes('useHydratedTheme')) return match;
      return `import { ${p1.trim()}, useHydratedTheme } from '@/lib/store';`;
    });
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content);
    console.log('Fixed imports in', file);
  }
}
