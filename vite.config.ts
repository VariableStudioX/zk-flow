import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/zk-flow',
  plugins: [react()],
  publicDir: 'public',
  // server: {
  //   proxy: {
  //     // 字符串简写写法：http://localhost:5173/foo -> http://localhost:4567/foo
  //     '/foo': 'http://localhost:4567',
  //     // 带选项写法：http://localhost:5173/api/bar -> http://jsonplaceholder.typicode.com/bar
  //     '/proxycoingecko': {
  //       target: 'https://api.coingecko.com',
  //       changeOrigin: true,
  //       rewrite: (path) => path.replace(/^\/proxycoingecko/, ''),
  //     },
  //   },
  // },
});
