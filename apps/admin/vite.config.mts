import { fileURLToPath } from 'node:url';

import { defineConfig } from '@vben/vite-config';

import AutoImport from 'unplugin-auto-import/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';

export default defineConfig(async () => {
  return {
    application: {},
    vite: {
      resolve: {
        alias: {
          '@': fileURLToPath(new URL('src', import.meta.url)),
        },
      },
      plugins: [
        AutoImport({
          imports: ['vue', 'vue-router', 'vue-i18n'],
          dts: 'src/types/auto-imports.d.ts',
        }),
        Components({
          resolvers: [
            AntDesignVueResolver({
              importStyle: false,
            }),
          ],
          dts: 'src/types/components.d.ts',
        }),
      ],
      server: {
        proxy: {
          '/api': {
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
            // mock代理目标地址
            target: 'http://localhost:5320/api',
            ws: true,
          },
        },
      },
    },
  };
});
