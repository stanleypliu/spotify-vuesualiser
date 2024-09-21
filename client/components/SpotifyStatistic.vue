<template>
  <div class="spotify-statistic">
    <template v-if="fetchedData">
      <h3 class="spotify-statistic__message">{{ message }}</h3>
      <component
        v-if="fetchedData"
        :is="component"
        :data="fetchedData"
        @clicked-time-period="customParams = $event"
      />
    </template>
    <div v-else>
      <h2>Loading...</h2>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useTokenStore } from "../store/store";

const store = useTokenStore();
const props = defineProps({
  slide: {
    type: Number,
    required: true,
  },
  component: {
    type: Object,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  endpoint: {
    type: String,
    required: true,
  },
});
const accessToken = store.accessToken;

const fetchedData = ref();
const customParams = ref("");
onMounted(async () => (fetchedData.value = await fetchData()));

watch(customParams, async () => {
  fetchedData.value = await fetchData();
});

async function fetchData() {
  const response = await fetch(
    "https://api.spotify.com/v1" + props.endpoint + `?${customParams.value}`,
    {
      method: "GET",
      headers: { Authorization: "Bearer " + accessToken },
    }
  );

  return await response.json();
}
</script>

<style scoped lang="scss">
.spotify-statistic {
  &__message {
    color: white;
  }
}
</style>
