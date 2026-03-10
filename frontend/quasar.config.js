/* eslint-env node */

const { configure } = require('quasar/wrappers');

module.exports = configure(function (/* ctx */) {
  return {
    eslint: {
      fix: true,
      warnings: true,
      errors: true
    },

    boot: [
      'axios',
      'pinia'
    ],

    css: [
      'app.scss'
    ],

    extras: [
      'material-icons',
      'fontawesome-v6',
      'ionicons-v4',
      'mdi-v7',
      'eva-icons',
      'roboto-font'
    ],

    build: {
      target: {
        browser: [ 'es2019', 'edge88', 'firefox78', 'chrome87', 'safari13.1' ],
        node: 'node16'
      },
      vueRouterMode: 'hash',
      env: {
        API_URL: process.env.API_URL || 'http://localhost:3000/api'
      }
    },

    devServer: {
      open: true
    },

    quasar: {
      plugins: [
        'Notify',
        'Loading',
        'Dialog'
      ],
      lang: 'es',
      iconSet: 'material-icons',
      config: {
        dark: true
      }
    },

    animations: 'all',

    framework: {
      config: {
        dark: true
      }
    },

    ssr: {
      pwa: false,
      prodPort: 3000,
      middlewares: []
    },

    pwa: {
      workboxMode: 'generateSW'
    },

    cordova: {},

    capacitor: {
      hideSplashscreen: true
    },

    electron: {
      inspectPort: 5858,
      bundler: 'packager',
      packager: {},
      builder: {
        appId: 'numerologia-ia'
      }
    },

    bex: {
      contentScripts: []
    }
  };
});
