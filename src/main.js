import { createApp } from 'vue';
import App from './App.vue';
import AnyGridLayout from "@/index.js";


const app = createApp(App)

app.use(AnyGridLayout)
app.mount('#app')

