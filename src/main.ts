import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

import { createDragResize } from './components/drag-resize'

const app = createApp(App)

app.use(createDragResize(), {
  isCollision: false
})

app.mount('#app')
