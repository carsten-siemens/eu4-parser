import { build } from 'esbuild';

await build({
  entryPoints: ['src/index.js'],
  outfile: 'dist/index.js',
  format: 'esm',
  bundle: true,
  platform: "node",
  external: ['fs']  
});

await build({
  entryPoints: ['src/index.js'],
  outfile: 'dist/index.cjs',
  format: 'cjs',
  bundle: true,
  platform: "node",
  external: ['fs']  
});