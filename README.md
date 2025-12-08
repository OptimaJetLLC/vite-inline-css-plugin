# vite-inline-css-plugin

Plugin for vite that inline CSS as base64.

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
