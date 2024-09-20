<script setup lang="ts">
import Cookies from "js-cookie";
import { onMounted, ref } from "vue";
import { state } from "../utils/store";

import { useRouter } from "vue-router";

const router = useRouter();

const loading = ref(false);
const error = ref(false);
onMounted(async () => {
	const url = new URL(window.location.href);
	const code = url.searchParams.get("code");
	if (!code) {
		error.value = true;
		return;
	}
	loading.value = true;

	const code_verifier = Cookies.get("code_verifier");
	if (!code_verifier) {
		error.value = true;
		return;
	}

	const bodyData = new URLSearchParams();
	bodyData.append(`client_id`, import.meta.env.VITE_CLIENT_ID);
	bodyData.append(`grant_type`, `authorization_code`);
	bodyData.append(`code`, code);
	bodyData.append(`redirect_uri`, import.meta.env.VITE_APP_URL + import.meta.env.VITE_REDIRECT_PATH);
	bodyData.append(`code_verifier`, code_verifier);
	try {
		const response = await fetch("https://accounts.spotify.com/api/token", {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: bodyData,
		});
		const data = await response.json();

		console.log(data);

		state.access_token = data.access_token;
		state.refresh_token = data.refresh_token;
		localStorage.setItem("refresh_token", data.refresh_token);

		loading.value = false;
		state.loggedIn = true;
		router.push("/player");
	} catch (e) {
		console.log(e);
		error.value = true;
	}
});
</script>

<template>
	<div>
		<h1>Logging in...</h1>
	</div>
</template>
