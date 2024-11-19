import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),

    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/open-apis/authen': {
        target: 'https://passport.feishu.cn', // 目标服务器
        changeOrigin: true, // 修改请求头中的 Origin
        // rewrite: (path) => path.replace(/^\/open-apis/, ''), // 重写路径
      },
      '/open-apis/auth': {
        target: 'https://open.feishu.cn',//这里放跨域的 URL 就行，不用放一整个网址
        changeOrigin: true,
      },
      '/accounts': {
        target: 'https://passport.feishu.cn',//这里放跨域的 URL 就行，不用放一整个网址
        changeOrigin: true,
      },
      // '/open-apis/authen': {
      //   target: 'https://open.feishu.cn',//这里放跨域的 URL 就行，不用放一整个网址
      //   changeOrigin: true,       
      // },
      '/open-apis/authen/v1/authorize': {
        target: 'https://passport.feishu.cn/accounts/page/login',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/open-apis\/authen\/v1\/authorize/, '')
      }
    }
  }

})





