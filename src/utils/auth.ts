import { state } from "./store";

export function generateVerifier(length: number) {
	const validChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let array = new Uint8Array(length);
	window.crypto.getRandomValues(array);
	array = array.map((x) => validChars.charCodeAt(x % validChars.length));
	const randomState = String.fromCharCode(...Array.from(array));
	return randomState;
}

export function base64urlencode(a: ArrayBuffer) {
	// Convert the ArrayBuffer to string using Uint8 array.
	// btoa takes chars from 0-255 and base64 encodes.
	// Then convert the base64 encoded to base64url encoded.
	// (replace + with -, replace / with _, trim trailing =)
	return btoa(String.fromCharCode(...new Uint8Array(a)))
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=+$/, "");
}

export async function sha256(input: string) {
	// encode as UTF-8
	const strBuffer = new TextEncoder().encode(input);

	// hash the message
	const hashBuffer = await crypto.subtle.digest("SHA-256", strBuffer);

	return hashBuffer;
}

export function spotifyConfig(method: string) {
	return {
		method: method,
		headers: {
			Authorization: "Bearer " + state.access_token,
		},
	};
}

export async function SpotifyFetch(
	url = "",
	data = undefined,
	config: any = {
		method: "POST", // *GET, POST, PUT, DELETE, etc.
		mode: "cors", // no-cors, *cors, same-origin
		cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
		credentials: "same-origin", // include, *same-origin, omit
		headers: {
			"Content-Type": "application/json",
		},
		redirect: "follow", // manual, *follow, error
		referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
	},
	retries: number = 3
) {
	//configure post body
	if (config.method !== "GET" && data && Object.keys(data).length > 0) {
		config.body = JSON.stringify(data);
	}

	try {
		const response = await fetch(url, config);
		if (response.ok) {
			return await response.json();
		} else {
			throw response;
		}
	} catch (error: unknown) {
		if (error instanceof Response && error.status == 401) {
			await RefreshAuth(state.refresh_token);
			return SpotifyFetch(url, data, config, retries - 1);
		} else {
			console.error(error);
			throw error;
		}
	}
}

export async function RefreshAuth(refresh_token: string) {
	try {
		const response = await fetch("https://accounts.spotify.com/api/token", {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: new URLSearchParams({
				grant_type: "refresh_token",
				refresh_token: refresh_token,
				client_id: import.meta.env.VITE_CLIENT_ID,
			}),
		});
		if (response.ok) {
			const data = await response.json();
			state.access_token = data.access_token;
			state.refresh_token = data.refresh_token;
			localStorage.setItem("refresh_token", data.refresh_token);
		} else {
			throw response;
		}
	} catch (error) {
		console.error(error);
		throw new Error("Failed to refresh auth");
	}
}
