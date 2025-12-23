import { createApp } from 'vue'
import { createPinia } from "pinia";
import App from './App.vue'
import router from './router'
import '@kangc/v-md-editor/lib/style/base-editor.css';
import VueMarkdownEditor from '@kangc/v-md-editor';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';
import hljs from 'highlight.js';
import createKatexPlugin from '@kangc/v-md-editor/lib/plugins/katex/cdn';

VueMarkdownEditor.use(githubTheme, { Hljs: hljs } ).use(createKatexPlugin())

// Monaco 配置
self.MonacoEnvironment = {
  getWorker(_, label) {
    // 使用 Vite 的 new Worker(new URL()) 语法
    switch (label) {
      case 'typescript':
      case 'javascript':
        return new Worker(
            new URL('monaco-editor/esm/vs/language/typescript/ts.worker.js', import.meta.url),
            { type: 'module' } // 必须声明 type: 'module'
        )
      case 'json':
        return new Worker(
            new URL('monaco-editor/esm/vs/language/json/json.worker.js', import.meta.url),
            { type: 'module' }
        )
      default:
        return new Worker(
            new URL('monaco-editor/esm/vs/editor/editor.worker.js', import.meta.url),
            { type: 'module' }
        )
    }
  }
}

const app = createApp(App)
const pinia = createPinia()
app.use(router)
app.use(pinia)
app.use(VueMarkdownEditor);
app.mount('#app')
