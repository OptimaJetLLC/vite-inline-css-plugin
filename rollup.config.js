import path from 'node:path';
import esbuild from 'rollup-plugin-esbuild';

export default {
  input: path.join(process.cwd(), './src/index.ts'),
  output: [{ format: 'es', dir: './dist', preserveModules: true }],
  external: (id) => id.startsWith('node:') || id === 'vite',
  plugins: [
    esbuild({
      sourceMap: false,
      tsconfig: path.resolve(process.cwd(), 'tsconfig.build.json'),
    }),
  ],
};
