import assert from 'node:assert/strict';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { inlineCssPlugin } from '../src/index';
import { build } from 'vite';

const STATIC_CSS = 'body { color: red; }';
const DYNAMIC_CSS = '.button { color: blue; }';

test('inlines static and dynamic CSS URL imports with Vite 8', async () => {
  const fixtureDirectory = await mkdtemp(path.join(tmpdir(), 'vite-inline-css-plugin-'));

  try {
    const sourceDirectory = path.join(fixtureDirectory, 'src');
    await mkdir(sourceDirectory);
    await Promise.all([
      writeFile(
        path.join(fixtureDirectory, 'index.html'),
        '<script type="module" src="/src/main.js"></script>'
      ),
      writeFile(
        path.join(sourceDirectory, 'main.js'),
        `import staticCssUrl from './static.css?url';
globalThis.staticCssUrl = staticCssUrl;
globalThis.loadDynamicCssUrl = () => import('./dynamic.css?url');`
      ),
      writeFile(path.join(sourceDirectory, 'static.css'), STATIC_CSS),
      writeFile(path.join(sourceDirectory, 'dynamic.css'), DYNAMIC_CSS),
    ]);

    const result = await build({
      root: fixtureDirectory,
      logLevel: 'silent',
      plugins: [inlineCssPlugin()],
      build: {
        minify: false,
        write: false,
      },
    });

    if (!Array.isArray(result) && 'close' in result) {
      await result.close();
      assert.fail('Expected Vite to return build output instead of a watcher.');
    }

    const outputs = Array.isArray(result) ? result : [result];
    const outputFiles = outputs.flatMap((output) => output.output);
    const bundledJavaScript = outputFiles
      .filter((output) => output.type === 'chunk')
      .map((output) => output.code)
      .join('\n');

    assert.ok(bundledJavaScript.includes(toDataUrl(STATIC_CSS)));
    assert.ok(bundledJavaScript.includes(toDataUrl(DYNAMIC_CSS)));
    assert.equal(
      outputFiles.some((output) => output.type === 'asset' && output.fileName.endsWith('.css')),
      false
    );
  } finally {
    await rm(fixtureDirectory, { recursive: true, force: true });
  }
});

function toDataUrl(css: string): string {
  return `data:text/css;base64,${Buffer.from(css).toString('base64')}`;
}
