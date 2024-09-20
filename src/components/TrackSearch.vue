<script setup lang="ts">
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import InputText from "primevue/inputtext";
import { ref, watch } from "vue";
import { spotifyConfig, SpotifyFetch } from "../utils/auth";
const search = ref("");

const results = ref<any[]>([]);

watch(search, async () => {
	if (search.value.length === 0) {
		results.value = [];
	} else {
		const response = await SpotifyFetch("https://api.spotify.com/v1/search?q=" + encodeURI(search.value) + "&type=track", undefined, spotifyConfig("GET"));
		results.value = response.tracks.items;
	}
});

function addTrack(track: any) {
	emit("addTrack", track);
	search.value = "";
}

const emit = defineEmits(["addTrack"]);
</script>
<template>
	<IconField style="width: 100%">
		<InputIcon class="pi pi-search" />
		<InputText v-model="search" placeholder="Search" style="width: 100%" />
		<div v-if="results.length > 0" class="track-list">
			<table>
				<thead>
					<tr>
						<th></th>
						<th>Track</th>
						<th>Album</th>
					</tr>
				</thead>
				<tbody>
					<tr class="track-item" v-for="track in results" @click="addTrack(track)">
						<td><img class="track-image" :src="track.album.images[0].url" /></td>
						<td>
							<div class="track-info">
								<div class="track-name">{{ track.name }}</div>
								<div class="artists">
									<span v-for="artist in track.artists">{{ artist.name }}</span>
								</div>
							</div>
						</td>
						<td>
							{{ track.album.name }}
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</IconField>
</template>

<style scoped>
.track-list {
	display: flex;
	flex-direction: column;
	gap: 5px;
	max-height: 500px;
	overflow-y: auto;
	position: absolute;
	width: 100%;
	background-color: black;
	/* margin: 10px; */
	padding: 10px;
	border-radius: var(--p-inputtext-border-radius);
	border: 1px solid var(--p-inputtext-border-color);
	top: calc(100% + 10px);
}

tr:hover {
	background-color: #1a1a1a;
}

tr {
	cursor: pointer;
}

.track-image {
	width: 50px;
	height: 50px;
}
</style>
