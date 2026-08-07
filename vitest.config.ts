import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'happy-dom',
      exclude: [...configDefaults.exclude, 'e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      setupFiles: ['./src/stores/__tests__/setup.ts'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html'],
      },
      // This line fixes the setTimeout issue
      testTimeout: 5000,
      // Enable fake timers
      fakeTimers: {
        toFake: ['setTimeout', 'clearTimeout'],
      },
    },
  }),
)