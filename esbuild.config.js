import { build } from 'esbuild';
import { nodeExternalsPlugin } from 'esbuild-node-externals';
import { writeFileSync } from 'fs';
import { join } from 'path';

const isProduction = process.env.NODE_ENV === 'production';

const baseConfig = {
  entryPoints: ['src/index.ts'],
  bundle: true,
  minify: isProduction,
  sourcemap: !isProduction,
  plugins: [nodeExternalsPlugin()]
};

// ESM build
await build({
  ...baseConfig,
  format: 'esm',
  outdir: 'dist/mjs',
  target: 'esnext'
});

// CommonJS build
await build({
  ...baseConfig,
  format: 'cjs',
  outdir: 'dist/cjs',
  target: 'es2015'
});

// Create package.json files for each distribution
writeFileSync(
  join('dist', 'mjs', 'package.json'),
  JSON.stringify({ type: 'module' }, null, 2) + '\n'
);

writeFileSync(
  join('dist', 'cjs', 'package.json'),
  JSON.stringify({ type: 'commonjs' }, null, 2) + '\n'
);

console.log('Build complete!');
