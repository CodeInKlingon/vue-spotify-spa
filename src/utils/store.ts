import { reactive } from "vue";

export const state = reactive<{
	access_token: string;
	refresh_token: string;
}>({
	access_token: "",
	refresh_token: "",
});
