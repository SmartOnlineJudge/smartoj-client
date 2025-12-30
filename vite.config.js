import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  // 加载.env文件中的环境变量
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      vue(),
      vueDevTools(),
      Components({
        resolvers: [
          AntDesignVueResolver({
            importStyle: false, // css in js
          }),
        ],
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              // 将大型依赖分离到各自的chunk中
              if (id.includes('monaco-editor')) {
                return 'monaco-editor';
              }
              if (id.includes('ant-design-vue') || id.includes('ant-design-x-vue')) {
                return 'ant-design';
              }
              if (id.includes('@kangc/v-md-editor')) {
                return 'markdown-editor';
              }
              if (id.includes('highlight.js')) {
                return 'highlight';
              }
              if (id.includes('vue') || id.includes('vue-router') || id.includes('pinia') || id.includes('axios') || id.includes('qs')) {
                return 'vendor';
              }
              return 'commons';
            }
          }
        }
      },
    },
    server: {
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: env.VITE_BACKEND_URL,
          secure: false,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
        "/ai-service": {
          target: env.VITE_AI_SERVICE_BACKEND_URL,
          secure: false,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/ai-service/, ''),
        }
      },
    },
  };
});