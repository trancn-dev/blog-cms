/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import vuetify from "./vuetify";
import router from "@/router";
import { createPinia } from "pinia";
import Vue3Toastify from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export function registerPlugins(app) {
  app.use(vuetify);
  app.use(router);
  app.use(createPinia());
  app.use(Vue3Toastify, {
    autoClose: 3000,
    position: "bottom-right",
    transition: "flip",
  });
}
