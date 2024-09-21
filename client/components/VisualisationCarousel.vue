<template>
  <carousel>
    <slide v-for="slide in Object.keys(SLIDE_CONFIG).length" :key="slide">
      <spotify-statistic
        :slide="slide"
        :component="SLIDE_CONFIG[slide].component"
        :message="SLIDE_CONFIG[slide].message"
        :endpoint="SLIDE_CONFIG[slide].endpoint"
      />
    </slide>

    <template #addons>
      <navigation />
    </template>
  </carousel>
</template>

<script setup lang="ts">
import "vue3-carousel/dist/carousel.css";
import { Carousel, Slide, Navigation } from "vue3-carousel";
import SpotifyStatistic from "./SpotifyStatistic.vue";
import SpotifyTopArtists from "./SpotifyTopArtists.vue";
import SpotifyTopTracks from "./SpotifyTopTracks.vue";

const SLIDE_CONFIG = {
  1: {
    message: "Your top artists in the...",
    endpoint: "/me/top/artists",
    component: SpotifyTopArtists,
  },
  2: {
    message: "Your top tracks in the...",
    endpoint: "/me/top/tracks",
    component: SpotifyTopTracks,
  },
};
</script>

<style>
.carousel__item {
  width: 100%;
  background-color: var(--vc-clr-primary);
  color: var(--vc-clr-white);
  font-size: 20px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.carousel__slide {
  padding: 10px;
  min-height: 900px;
}

.carousel__icon {
  color: white;
}
</style>
