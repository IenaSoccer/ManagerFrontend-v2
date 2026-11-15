import { defineConfig } from '#q-app';

export default defineConfig((ctx) => {
  const environmentFile = ctx.dev ? '.env.development' : '.env.production';

  return {
    boot: ['boot.ts', 'i18n.ts', 'initialization.ts', 'globals.ts', 'recaptcha.ts'],
    css: ['tailwind.css', 'app.scss', 'styles.css'],
    extras: ['fontawesome-v7', 'roboto-font', 'material-icons'],
    build: {
      vueOptionsAPI: true,
      env: {
        folder: 'config',
        file: [environmentFile],
      },
      target: {
        browser: ['es2022', 'firefox115', 'chrome115', 'safari14'],
        node: 'node22',
      },
      typescript: {
        strict: true,
        vueShim: true,
      },
      vueRouterMode: 'history',
      vitePlugins: [
        [
          'vite-plugin-checker',
          {
            vueTsc: true,
            eslint: {
              lintCommand: 'eslint -c ./eslint.config.js "./src*/**/*.{ts,js,mjs,cjs,vue}"',
              useFlatConfig: true,
            },
          },
          { server: false },
        ],
      ],
    },
    devServer: {
      open: true,
    },
    framework: {
      config: {},
      plugins: ['Dialog', 'LocalStorage'],
    },
    animations: [],
    ssr: {
      prodPort: 3000,
      middlewares: ['render'],
      pwa: false,
    },
    pwa: {
      workboxMode: 'GenerateSW',
    },
    capacitor: {
      hideSplashscreen: true,
    },
    electron: {
      preloadScripts: ['electron-preload'],
      inspectPort: 5858,
      bundler: 'packager',
      packager: {},
      builder: {
        appId: 'managerfrontend',
      },
    },
    bex: {
      extraScripts: [],
    },
  };
});
