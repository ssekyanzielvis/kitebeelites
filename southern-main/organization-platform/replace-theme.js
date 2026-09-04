const fs = require('fs');
const glob = require('glob');

const files = glob.sync('app/(visitor)/**/*.tsx');

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  if (content.includes('useAppStore((state) => state.theme)')) {
    content = content.replace(/const theme = useAppStore\(\(state\) => state\.theme\);/g, 'const { theme } = useHydratedTheme();');
    changed = true;
  }

  if (changed) {
    if (!content.includes('useHydratedTheme')) {
      content = content.replace(/import \{.*?\} from '@\/lib\/store';/, (match) => {
        if (match.includes('useHydratedTheme')) return match;
        return match.replace('}', ', useHydratedTheme }');
      });
    }
    fs.writeFileSync(file, content);
    console.log('Updated', file);
  }
}
