# vite-inline-css-plugin

Vite plugin that inlines CSS imports as base64 data URLs.

## Compatibility

- Vite 8
- Vite 7.2.7 or newer

## Usage

```bash
npm install --save-dev vite-inline-css-plugin
```

```typescript
import {defineConfig} from 'vite'
import {inlineCssPlugin} from 'vite-inline-css-plugin'

export default defineConfig(() => ({
  plugins: [inlineCssPlugin()],
}))
```

## License

MIT
