import { defineConfig } from 'tsup';

// OPTIONAL dist build, for consumers who cannot transpile source (e.g. a
// non-Next.js host). The RECOMMENDED handoff is shipping source +
// `transpilePackages` (see README) — that path preserves the "use client"
// directive automatically and needs no build step.
export default defineConfig({
  entry: { index: 'src/index.ts', 'logic/profit': 'src/logic/profit.ts' },
  format: ['esm'],
  dts: true,
  external: ['react', 'react-dom'],
  clean: true,
});
