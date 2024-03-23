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
import {viteCertsPlugin} from "@biggerstar/localhost-certs";

export default defineViteRunConfig({
  baseConfig: getBaseConfig,
  packages: [
    'packages/*',
    'examples/*',
  ],
  targets: {
    native: {
      dev: [
        ['build_lib', 'watch_lib', 'es_lib', 'sourcemap', 'dev_types'],
      ],
      build: [
        ['build_lib', 'es_lib', 'minify'],
        ['build_lib', 'umd_lib', 'minify'],
      ],
      types: [
        ['build_lib', 'es_lib', 'types'],
      ],
      size: [
        ['build_lib', 'es_lib', 'minify', 'bundleAnalyzer']
      ],
    },
    plugins: {
      dev: [
        ['build_plugins', 'watch_lib', 'es_lib', 'sourcemap', 'dev_types'],
      ],
      build: [
        ['build_plugins', 'es_lib'],
      ],
      types: [
        ['build_plugins', 'es_lib', 'plugins_types'],
      ],
    },
    'native-web': {
      dev: [
        ['10000', 'https']
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
          fileName: (format: string) => `index.${format}.js`,
        },
        rollupOptions: {
          external: [
          ],
          output: {
            globals: {
              vue: 'Vue'
            },
          }
        },
      }
    },
    /** 单独编译处理框架提供的内置插件 */
    build_plugins: (options) => {
      return {
        lib: {
          entry: resolve(options.packagePath, 'src', `index.ts`),
          name: options.name,
          fileName: (format: string) => `index.${format}.js`,
        },
        rollupOptions: {
          external: [
            '@biggerstar/layout',
            'is-what'
          ],
          output: {
            chunkFileNames: '[name].js',
            manualChunks(id) {
              // console.log(id)
              if (id.startsWith(`${options.packagePath}/src`)) {
                const pluginsPartPathName = id
                  .replace(`${options.packagePath}/src/`, '')
                  .replace('.ts', '')
                // console.log(pluginsPartPathName)
                return `${pluginsPartPathName}.es`
              }
              return ''
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
            entryFileNames: (format: string) => `index.${format}.js`,
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
    https: [viteCertsPlugin()],
    types: (options) => {
      return [
        dts({
          copyDtsFiles: true,
          declarationOnly: true,
          rollupTypes: true,
          clearPureImport: true,
        }),
        copyDtsPlugin({
          delayMerge: 1200,
          files: [
            {
              from: `${options.packagePath}/typings/*.ts`,
              to: `${options.packagePath}/dist/index.d.ts`
            }
          ]
        })
      ]
    },
    dev_types: (options) => {
      return [
        dts({
          copyDtsFiles: false,
          rollupTypes: true,
          clearPureImport: true,
          logLevel: 'silent'
        }),
      ]
    },
    plugins_types: [
      dts({
        copyDtsFiles: false,
        declarationOnly: true,
        rollupTypes: false,
        clearPureImport: true,
        logLevel: 'silent'
      }),
    ]
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
