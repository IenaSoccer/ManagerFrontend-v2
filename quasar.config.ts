import { defineConfig } from '#q-app/wrappers';

export default defineConfig((ctx) => {
  const environmentFile = ctx.dev ? '.env.development' : '.env.production';

  return {
    boot: ['boot.ts', 'i18n.ts', 'initialization.ts', 'globals.ts', 'recaptcha.ts'],
    css: ['tailwind.css', 'app.scss', 'styles.css'],
    extras: ['fontawesome-v6', 'roboto-font', 'material-icons'],
    build: {
      envFolder: 'config',
      envFiles: [environmentFile],
      env: {
        API_URL: process.env.API_URL,
        HOMEPAGE_URL: process.env.HOMEPAGE_URL,
        MEDIA_URL: process.env.MEDIA_URL,
        ATTACHMENTS_URL: process.env.ATTACHMENTS_URL,
        PROFILE_URL: process.env.PROFILE_URL,
      },
      target: {
        browser: ['es2022', 'firefox115', 'chrome115', 'safari14'],
        node: 'node20',
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
      plugins: ['LocalStorage'],
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
