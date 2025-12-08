import { readFileSync } from 'node:fs';
import type { Plugin } from 'vite';

/**
 * Vite plugin that inlines all imported CSS files as base64 data URLs.
 * This handles both static and dynamic CSS imports.
 * @returns Vite plugin
 */
export function inlineCssPlugin(): Plugin {
  const cssFiles = new Map<string, string>();

  return {
    name: 'inline-css-plugin',
    enforce: 'pre',
    async resolveId(id: string, importer?: string) {
      if (id.includes('.css?url')) {
        const filePath = id.split('?')[0];

        // Resolve the actual CSS file path
        if (importer) {
          const resolved = await this.resolve(filePath, importer, { skipSelf: true });
          if (resolved) {
            // Read and convert to data URL if not already cached
            if (!cssFiles.has(resolved.id)) {
              try {
                const cssContent = readFileSync(resolved.id, 'utf-8');
                const base64 = Buffer.from(cssContent, 'utf-8').toString('base64');
                const dataUrl = `data:text/css;base64,${base64}`;
                cssFiles.set(resolved.id, dataUrl);
              } catch (error) {
                this.error(`Failed to inline CSS file: ${resolved.id} ${error}`);
              }
            }
            // Return a virtual module ID that we'll handle in load()
            // Use .js extension to ensure it's treated as JavaScript, not CSS
            return `\0inline-css:${resolved.id}.js`;
          }
        }
      }

      return null;
    },
    load(id: string) {
      // Handle our virtual module IDs
      if (id.startsWith('\0inline-css:')) {
        // Remove the .js extension we added and the prefix
        const filePath = id.replace('\0inline-css:', '').replace(/\.js$/, '');
        const dataUrl = cssFiles.get(filePath);
        if (dataUrl) {
          // Return as ES module that exports the data URL
          // This is JavaScript, not CSS, so Vite's CSS plugin won't process it
          return `export default ${JSON.stringify(dataUrl)}`;
        }
        this.error(`CSS file not found in cache: ${filePath}`);
      }
      return null;
    },
  };
}
