import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

export default defineConfig({
  plugins: [uni()],
  server: {
    proxy: {
      '/gw': {
        target: 'https://coffee.htcbot.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/gw/, '/gw')
      },
      // 如需更多代理规则，可继续添加
      // '/api': {
      //   target: 'https://coffee.htcbot.com',
      //   changeOrigin: true,
      //   rewrite: path => path.replace(/^\/api/, '/api')
      // }
    }
  }
})
