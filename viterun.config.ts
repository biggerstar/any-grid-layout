// import basicSsl from '@vitejs/plugin-basic-ssl'
import {resolve} from "node:path";
import {
  BaseConfigReturnType,
  defineViteRunConfig as defineViteRunConfig,
  ViteRunHandleFunctionOptions,
  viteRunLogPlugin
} from "vite-run";
import dts from "vite-plugin-dts";
import copyDtsPlugin from 'vite-plugin-copy-dts'

export default defineViteRunConfig({
  baseConfig: getBaseConfig,
  packages: [
    'packages/*',
    'examples/*',
  ],
  targets: {
    'native': {
      dev: [
        ['build_lib', 'watch_lib', 'es_lib', 'sourcemap'],
        ['build_lib', 'es_lib', 'types']
      ],
      build: [
        ['build_lib', 'es_lib', 'minify'],
        ['build_lib', 'umd_lib', 'minify']
      ],
      types: [
        ['build_lib', 'es_lib', 'types']
      ],
      size: [
        ['build_lib', 'es_lib', 'minify', 'bundleAnalyzer']
      ],
    },
    // 'vue3': {
    //   build: [
    //     'es',
    //     ['umd', 'minify']
    //   ],
    //   types: ['types'],
    //   dev: ['watch']
    // },
    'native-web': {
      dev: ['10000'],
    },
    // 'vue3-web': {
    //   dev: ['11000']
    // },
  },
  build: {
    es_lib: {
      lib: {
        formats: ['es']
      }
    },
    umd_lib: {
      lib: {
        formats: ['umd']
      },
    },
    watch_lib: {
      watch: {},
    },
    minify: {
      minify: true
    },
    sourcemap: {
      rollupOptions: {
        output: {
          sourcemap: true
        }
      }
    },
    build_lib: (options) => {
      const name = options.name === 'native' ? 'anyGridLayout' : options.name
      return {
        lib: {
          entry: resolve(options.packagePath, 'src', `index.ts`),
          name: name,
          fileName: (format) => `index.${format}.js`,
        },
        rollupOptions: {
          external: [
            'vite',
            'vue',
            'vue-router',
          ],
          output: {
            globals: {
              vue: 'Vue'
            },
          }
        },
      }
    },
    build_web: (options) => {
      return {
        rollupOptions: {
          input: resolve(options.packagePath, 'index.html'),
          external: [
            'vite',
            'vue',
            'vue-router',
          ],
          output: {
            entryFileNames: (format) => `index.${format}.js`,
            format: 'umd',
            exports: 'named',
            globals: {
              vue: 'Vue'
            },
          }
        },
      }
    },
  },
  server: {
    10000: {
      // open: true,
      port: 10000
    },
    11000: {
      port: 11000
    },
    12000: {
      port: 12000
    },
  },
  preview: {
    20000: {
      port: 20000,
    }
  },
  plugins: {
    types: (options) => {
      return [
        dts({
          copyDtsFiles: true,
          declarationOnly: true,
          rollupTypes:true,
          clearPureImport:true,
        }),
        copyDtsPlugin({
          delayMerge:1200,
          files: [
            {
              from: `${options.packagePath}/typings/*.ts`,
              to: `${options.packagePath}/dist/index.d.ts`
            }
          ]
        })
      ]
    }
  }
})

function getBaseConfig(options: ViteRunHandleFunctionOptions): BaseConfigReturnType {
  // console.log(this);
  // console.log('viterun:', options)
  return {
    resolve: {
      extensions: [".ts", ".js", ".d.ts", '.vue', '.css'],
      alias: {
        "@": resolve(options.packagePath, 'src'),
        types: resolve(options.packagePath, 'src/types')
      }
    },
    build: {
      emptyOutDir: false,
      minify: false,
      rollupOptions: {
        external: [
          "vite",
          "picocolors",
          "node:process",
          "node:path",
          "node:process",
        ],
        output: {
          sourcemap: false,
          globals: {}
        },
        treeshake: true
      },
    },
    server: {
      hmr: true,
      cors: true,
      strictPort: true,
      port: 6000
    },
    plugins: [
      viteRunLogPlugin(),
    ]
  }
}
