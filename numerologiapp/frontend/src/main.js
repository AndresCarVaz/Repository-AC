import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { Quasar, Notify, Loading, Dialog } from 'quasar';
import router from './router/index.js';

// Quasar icon sets and lang
import '@quasar/extras/material-icons/material-icons.css';
import '@quasar/extras/fontawesome-v6/fontawesome-v6.css';

// Quasar css
import 'quasar/src/css/index.sass';

// App css
import './css/app.scss';

import App from './App.vue';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(Quasar, {
    plugins: { Notify, Loading, Dialog },
    config: {
        dark: true,
        notify: {
            position: 'top',
            timeout: 4000,
            classes: 'q-px-lg q-py-md text-weight-medium rounded-borders shadow-4'
        }
    }
});

app.mount('#app');
