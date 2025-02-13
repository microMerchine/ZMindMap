import { createApp } from 'vue'
import * as Sentry from '@sentry/vue'
import { BrowserTracing } from '@sentry/tracing'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/assets/css/reset.css'

// 一次性引入所有svg图
const req = require.context('./assets/pic', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)

const app = createApp(App)

const websiteCfg = JSON.parse(localStorage.getItem('zmindmap_website') || '{}')
const isDark = websiteCfg?.isDark
window.document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')

Sentry.init({
  app,
  dsn: 'https://286635702ecc437687d97885795599be@o1237174.ingest.sentry.io/6387522',
  integrations: [
    new BrowserTracing({
      routingInstrumentation: Sentry.vueRouterInstrumentation(router),
      tracingOrigins: ['localhost', 'map.kimjisoo.cn', /^\//]
    })
  ],
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0
})

app.use(store).use(router).mount('#app')
