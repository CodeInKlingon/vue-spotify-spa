<script setup lang="ts">
import { ref } from "vue";
import TrackSearch from "../components/TrackSearch.vue";
import Button from "primevue/button";
import { useTemplateRef } from "vue";
import { dragAndDrop } from "@formkit/drag-and-drop";

// const trackListRef = useTemplateRef("trackListRef");
const tracks = ref<any[]>([]);
const trackListRef = ref();

dragAndDrop({
	parent: trackListRef,
	values: tracks,
});

function addTrack(track: any) {
	console.log(track);
	tracks.value.push(track);
}

function playTrack(index: number) {
	console.log("Play", tracks.value[index]);
}

function removeTrack(index: number) {
	tracks.value.splice(index, 1);
}
</script>

<template>
	<TrackSearch @addTrack="addTrack" />
	<table>
		<thead>
			<tr>
				<th></th>
				<th>Track</th>
				<th>Album</th>
			</tr>
		</thead>
		<tbody ref="trackListRef">
			<tr v-if="tracks.length === 0">
				<td colspan="4">No tracks added</td>
			</tr>
			<tr class="track-item" v-for="(track, index) in tracks" @click="playTrack(index)">
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
				<td>
					<Button soft icon="pi pi-trash" @click="removeTrack(index)" />
				</td>
			</tr>
		</tbody>
	</table>
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
