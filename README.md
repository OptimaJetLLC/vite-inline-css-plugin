# vite-inline-css-plugin

Vite plugin that converts CSS `?url` imports to base64 data URLs in development and
production builds.

## Requirements

- Node.js `^20.19.0` or `>=22.12.0`
- Vite `^7.2.7` or `^8.0.0`
- An environment that can load ESM packages; this package has no CommonJS build

## Installation

```bash
npm install --save-dev vite-inline-css-plugin
```

## Configuration

```typescript
import { defineConfig } from 'vite';
import { inlineCssPlugin } from 'vite-inline-css-plugin';

export default defineConfig(() => ({
  plugins: [inlineCssPlugin()],
}));
```

## Usage

### Static import

Add the `?url` suffix to a CSS import. The default export is a `data:text/css;base64,...` URL.

```typescript
import stylesheetUrl from './styles.css?url';

const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = stylesheetUrl;
document.head.append(link);
```

### Dynamic import

Dynamic imports return the usual module namespace object, so read its `default` export.

```typescript
const { default: stylesheetUrl } = await import('./styles.css?url');
```

## Behavior and limitations

- The plugin reads the referenced CSS file as UTF-8 and encodes those bytes as base64.
- Both static and dynamic `?url` imports are supported.
- CSS is read directly from disk and does not pass through Vite's CSS processing pipeline.
  PostCSS, preprocessors, CSS Modules, transformations, and minification are therefore not
  applied.
- `@import` and `url(...)` references remain unchanged. Relative references may not resolve when
  the stylesheet is loaded from a data URL.
- Base64 increases the encoded size by roughly one third and moves the CSS into the JavaScript
  bundle. Consider the resulting bundle size before inlining large stylesheets.
- A Content Security Policy may need to allow the `data:` scheme in `style-src` when the returned
  URL is used as a stylesheet.

If you need a Vite-processed CSS string instead of a data URL, use Vite's native CSS `?inline`
import.

## Package format

The package is published as ESM only. CommonJS consumers must use dynamic `import()` or migrate
their Vite configuration to ESM.

## Contributing

See the
[contribution guide](https://github.com/OptimaJetLLC/vite-inline-css-plugin/blob/main/CONTRIBUTING.md)
for local setup and pull request instructions.

## License

MIT
