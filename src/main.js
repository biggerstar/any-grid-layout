import { createApp } from 'vue';
import App from './App.vue';
import Vue3GridLayout from "@/install.js";


const app = createApp(App)

app.use(Vue3GridLayout)
app.mount('#app')

