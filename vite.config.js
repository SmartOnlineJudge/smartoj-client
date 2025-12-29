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
          manualChunks: {
            // 将大型库分离到单独的chunk中
            'monaco-editor': ['monaco-editor'],
            'ant-design': ['ant-design-vue'],
            // 将Markdown编辑器分离
            'markdown-editor': ['@kangc/v-md-editor'],
            // 将数学公式库分离
            'katex': ['katex'],
            // 将代码高亮库分离
            'highlight': ['highlight.js'],
            // 将公共代码分离
            vendor: ['vue', 'vue-router', 'pinia', 'axios', 'qs']
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