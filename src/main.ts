import { createApp } from "vue";
import App from "./App.vue";
import ElementPlus from "element-plus";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import "element-plus/dist/index.css";
import "./assets/styles/index.scss";
import router from "./router";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import "./assets/styles/tree.scss";
import "./assets/styles/font.scss";
import JsBarcode from "jsbarcode";
import store from "./store";

const app = createApp(App);
app.use(ElementPlus, {
    locale: zhCn
});
app.config.globalProperties.jsbarcode = JsBarcode;
app.use(router).use(store);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}
app.mount("#app");
