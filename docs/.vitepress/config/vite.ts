import {defineConfig} from "vite";
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {ArcoResolver} from 'unplugin-vue-components/resolvers'
// import {vitePluginForArco} from "@arco-plugins/vite-vue";

export default defineConfig({
  plugins: [
    AutoImport({
      resolvers: [
        ArcoResolver({
          importStyle: 'css',
        })
      ],
    }),
    Components({
      resolvers: [
        ArcoResolver({
          sideEffect: false,
        })
      ]
    }),
    // vitePluginForArco({
    //   style: 'css',
    // })
  ],
  extensions: [".ts", ".js", ".d.ts", '.vue', '.css'],
})

