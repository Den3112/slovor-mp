import type { StorybookConfig } from '@storybook/nextjs-vite'

const config: StorybookConfig = {
  stories: [
    '../components/**/*.mdx',
    '../components/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../stories/**/*.mdx',
    '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: ['@storybook/addon-vitest', '@storybook/addon-a11y'],
  framework: '@storybook/nextjs-vite',
  staticDirs: ['../public'],
  async viteFinal(config) {
    const { mergeConfig } = await import('vite')
    const path = await import('path')
    const { fileURLToPath } = await import('url')
    const _dirname = path.dirname(fileURLToPath(import.meta.url))
    return mergeConfig(config, {
      resolve: {
        alias: {
          '@/lib/supabase/client': path.resolve(
            _dirname,
            '../lib/supabase/mock-client.ts'
          ),
        },
      },
    })
  },
}
export default config
