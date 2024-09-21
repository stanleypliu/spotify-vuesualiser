<template>
  <div class="spotify-top-tracks">
    <ul class="spotify-top-tracks__options">
      <li v-for="(option, index) in timeOptions" :key="index">
        <button
          @click="selectTimePeriod(option.param)"
          :class="option.label === defaultTimePeriod ? 'active' : ''"
        >
          {{ option.label }}
        </button>
      </li>
    </ul>
    <div class="spotify-top-tracks__list">
      <div v-for="column in 2" :key="column">
        <p
          v-for="(track, index) in getColumnTracks(column)"
          :key="track.name"
          :class="[
            'spotify-top-tracks__list-item',
            { 'color-white': index % 2 === 0 }
          ]"
        >
          {{ track.artists }} - {{ track.name }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps({
  data: {
    type: Object,
  },
});

const topTracks = ref();

function formatTopTracks() {
  topTracks.value = props.data.items.map((item) => {
    return {
      name: item.name,
      artists: item.artists.map((artist) => artist.name).join(", "),
    };
  });
}

formatTopTracks();

watch(props, (newValue) => {
  if (newValue) {
    formatTopTracks();
  }
});

const getColumnTracks = (column) => {
  const startIndex = column === 1 ? 0 : 10;
  const endIndex = column === 1 ? 10 : 20;
  return topTracks.value.slice(startIndex, endIndex);
};


const emit = defineEmits(["clicked-time-period"]);

const timeOptions = [
  { label: "Last year", param: "time_range=long_term" },
  { label: "Last 6 months", param: "time_range=medium_term" },
  { label: "Last month", param: "time_range=short_term" },
];

const defaultTimePeriod = ref(timeOptions[1].label);

function selectTimePeriod(param) {
  emit("clicked-time-period", param);
  defaultTimePeriod.value = timeOptions.find(
    (option) => option.param === param
  )?.label;
}
</script>

<style scoped lang="scss">
.spotify-top-tracks {
  margin-top: 30px;
  margin-left: auto;
  margin-right: auto;
  max-width: 800px;
  height: 500px;

  &__options {
    display: flex;
    justify-content: center;
    list-style-type: none;
    gap: 30px;
  }

  &__list {
    margin-top: 30px;
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  &__list-item {
    margin-top: 15px;
    font-size: 18px;
  }
}
</style>
