import { readdirSync, statSync, readFileSync, writeFileSync } from 'fs';
import { join, extname } from 'path';

// tsc emits relative specifiers in .d.ts files without an extension
// (e.g. `export * from './route-entry'`). Under Node's ESM resolution
// (`moduleResolution: "NodeNext"`/`"Node16"`), TypeScript consumers can't
// resolve those specifiers. This mirrors the fix already applied to the
// bundled runtime output by rewriting relative specifiers in the emitted
// declaration files to include a `.js` extension.
const DIST_MJS = join(process.cwd(), 'dist', 'mjs');

const RELATIVE_SPECIFIER = /(\bfrom\s+['"]|\bimport\(\s*['"])(\.[^'"]+)(['"])/g;

function fixFile(filePath) {
  const source = readFileSync(filePath, 'utf8');
  const updated = source.replace(
    RELATIVE_SPECIFIER,
    (match, prefix, specifier, suffix) => {
      if (/\.[a-zA-Z0-9]+$/.test(specifier)) {
        return match;
      }
      return `${prefix}${specifier}.js${suffix}`;
    }
  );

  if (updated !== source) {
    writeFileSync(filePath, updated, 'utf8');
    console.log(`Fixed relative specifiers in ${filePath}`);
  }
}

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    if (statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.d.ts')) {
      fixFile(fullPath);
    }
  }
}

walk(DIST_MJS);
