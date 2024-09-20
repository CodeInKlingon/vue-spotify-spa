<script setup lang="ts">
import { onMounted, ref } from "vue";
import { generateVerifier, base64urlencode, sha256 } from "../utils/auth";
import Cookies from "js-cookie";
import { state } from "../utils/store";

const loginUrl = ref("");
const loading = ref(true);
onMounted(async () => {
	if (state.access_token) {
		loginUrl.value = "/player";
		loading.value = false;
		return;
	}
	const redirect_uri = import.meta.env.VITE_APP_URL + import.meta.env.VITE_REDIRECT_PATH;
	console.log(redirect_uri);
	const code_verifier = generateVerifier(128);
	const verifier_sha256 = await sha256(code_verifier);
	const code_challenge = base64urlencode(verifier_sha256);

	//store the code verifier in a cookie for comparison later
	Cookies.set("code_verifier", code_verifier);

	loginUrl.value =
		"https://accounts.spotify.com/authorize" +
		"?client_id=" +
		import.meta.env.VITE_CLIENT_ID +
		"&response_type=code" +
		"&redirect_uri=" +
		encodeURIComponent(redirect_uri) +
		"&code_challenge_method=S256" +
		"&code_challenge=" +
		code_challenge +
		(import.meta.env.VITE_SCOPES ? "&scope=" + encodeURIComponent(import.meta.env.VITE_SCOPES) : "");

	loading.value = false;
});
</script>

<template>
	<div>
		<h1>Home</h1>
		<a v-if="!loading" :href="loginUrl">Login</a>
	</div>
</template>
