import {defineConfig} from 'vite'
import path, {resolve} from 'path'
import vue from '@vitejs/plugin-vue'
// https://vitejs.dev/config/

export default defineConfig({
    plugins: [vue()],
    resolve: {
        extensions: ['.js', '.vue', '.scss'],
        alias: {
            '@': path.resolve(__dirname, './src/'),
        }
    },
    server: {
        hmr: true,
    },
    build: {
        outDir: 'dist',
        lib: {
            entry: resolve(__dirname, './src/index.js'),
            name: 'any-grid-layout',
            fileName: 'any-grid-layout',
        },
        rollupOptions: {
            external: ['vue'],
            output: {
                globals: {  //  UMD 模式下为外部化依赖提供全局变量
                    vue: 'Vue',
                },
            },
        }
    }
})
