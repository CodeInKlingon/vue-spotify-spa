import { createRouter, createWebHistory } from "vue-router";
import { createApp } from "vue";
import App from "./App.vue";
import "./style.css";
import { state } from "./utils/store";
import { RefreshAuth } from "./utils/auth";
import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura";
import "primeicons/primeicons.css";
import { definePreset } from "@primevue/themes";

const router = createRouter({
	history: createWebHistory(),
	routes: [
		// Define your routes here
		// For example:
		{ path: "/", component: () => import("./pages/Home.vue") },
		{ path: "/player", component: () => import("./pages/Player.vue") },
		{ path: import.meta.env.VITE_REDIRECT_PATH, component: () => import("./pages/AuthReturn.vue") },
	],
});

router.beforeEach(async (to, from, next) => {
	const storage_refresh_token = localStorage.getItem("refresh_token");
	if (to.path === "/" && storage_refresh_token && !state.access_token) {
		try {
			await RefreshAuth(storage_refresh_token);
			next();
		} catch (error) {
			``;
			localStorage.removeItem("refresh_token");
			next("/");
		}
	}
	if (to.path !== "/authreturn" && to.path !== "/") {
		const state_refresh_token = state.refresh_token;

		if (storage_refresh_token && !state_refresh_token) {
			try {
				await RefreshAuth(storage_refresh_token);
				next();
			} catch (error) {
				console.error(error);
				localStorage.removeItem("refresh_token");
				next("/");
			}
		} else if (storage_refresh_token) {
			next();
		} else {
			next("/");
		}
	} else {
		next();
	}
});

const app = createApp(App);
const Noir = definePreset(Aura, {
	semantic: {
		primary: {
			50: "{zinc.50}",
			100: "{zinc.100}",
			200: "{zinc.200}",
			300: "{zinc.300}",
			400: "{zinc.400}",
			500: "{zinc.500}",
			600: "{zinc.600}",
			700: "{zinc.700}",
			800: "{zinc.800}",
			900: "{zinc.900}",
			950: "{zinc.950}",
		},
		colorScheme: {
			light: {
				primary: {
					color: "{zinc.950}",
					inverseColor: "#ffffff",
					hoverColor: "{zinc.900}",
					activeColor: "{zinc.800}",
				},
				highlight: {
					background: "{zinc.950}",
					focusBackground: "{zinc.700}",
					color: "#ffffff",
					focusColor: "#ffffff",
				},
			},
			dark: {
				primary: {
					color: "{zinc.50}",
					inverseColor: "{zinc.950}",
					hoverColor: "{zinc.100}",
					activeColor: "{zinc.200}",
				},
				highlight: {
					background: "rgba(250, 250, 250, .16)",
					focusBackground: "rgba(250, 250, 250, .24)",
					color: "rgba(255,255,255,.87)",
					focusColor: "rgba(255,255,255,.87)",
				},
			},
		},
	},
});
app.use(PrimeVue, {
	theme: {
		preset: Noir,
	},
});
app.use(router);
app.mount("#app");
