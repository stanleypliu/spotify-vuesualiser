<template>
  <div class="spotify-top-artists">
    <ul class="spotify-top-artists__options">
      <li v-for="(option, index) in timeOptions" :key="index">
        <button
          @click="selectTimePeriod(option.param)"
          :class="option.label === defaultTimePeriod ? 'active' : ''"
        >
          {{ option.label }}
        </button>
      </li>
    </ul>
    <div class="grid-container-wrapper">
      <transition-group name="fade" class="grid-container" tag="div">
        <div v-for="artist in topArtists" :key="artist.name" class="grid-item">
          <img :src="artist.image" :alt="artist.name" class="artist-image" />
          <div class="artist-name">
            <p>{{ artist.name }}</p>
          </div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
// import * as d3 from "d3";

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});

const topArtists = ref();

function loadImages() {
  topArtists.value = props.data.items.map(
    (item: { name: string; images: { url: string }[] }) => {
      return {
        name: item.name,
        image: item.images[2].url,
      };
    }
  );
}

loadImages();

watch(props, () => {
  loadImages();
});

const emit = defineEmits(["clicked-time-period"]);

const timeOptions = [
  { label: "Last year", param: "time_range=long_term" },
  { label: "Last 6 months", param: "time_range=medium_term" },
  { label: "Last month", param: "time_range=short_term" },
];

const defaultTimePeriod = ref(timeOptions[1].label);

function selectTimePeriod(param: (typeof timeOptions)[number]["param"]) {
  emit("clicked-time-period", param);
  defaultTimePeriod.value =
    timeOptions.find((option) => option.param === param)?.label ||
    timeOptions[0].label;
}

// // Declare the chart dimensions and margins.
// const width = 928;
// const height = 500;
// const marginTop = 30;
// const marginRight = 0;
// const marginBottom = 30;
// const marginLeft = 40;

// // Declare the x (horizontal position) scale.
// const x = d3
//   .scaleBand()
//   .domain(
//     d3.groupSort(
//       topArtists.value,
//       ([d]) => -d.followers,
//       (d) => d.name
//     )
//   ) // descending frequency
//   .range([marginLeft, width - marginRight])
//   .padding(0.1);

// // Declare the y (vertical position) scale.
// const y = d3
//   .scaleLinear()
//   .domain([0, d3.max(topArtists.value, (d) => d.followers)])
//   .range([height - marginBottom, marginTop]);

// // Create the SVG container.
// const svg = d3
//   .create("svg")
//   .attr("width", width)
//   .attr("height", height)
//   .attr("viewBox", [0, 0, width, height])
//   .attr("style", "max-width: 100%; height: auto;");

// // Add a rect for each bar.
// svg
//   .append("g")
//   .attr("fill", "steelblue")
//   .selectAll()
//   .data(topArtists.value)
//   .join("rect")
//   .attr("x", (d) => x(d.name))
//   .attr("y", (d) => y(d.followers))
//   .attr("height", (d) => y(0) - y(d.followers))
//   .attr("width", x.bandwidth());

// // Add the x-axis and label.
// svg
//   .append("g")
//   .attr("transform", `translate(0,${height - marginBottom})`)
//   .call(d3.axisBottom(x).tickSizeOuter(0));

// // Add the y-axis and label, and remove the domain line.
// svg
//   .append("g")
//   .attr("transform", `translate(${marginLeft},0)`)
//   .call(d3.axisLeft(y).tickFormat((y) => (y * 100).toFixed()))
//   .call((g) => g.select(".domain").remove())
//   .call((g) =>
//     g
//       .append("text")
//       .attr("x", -marginLeft)
//       .attr("y", 10)
//       .attr("fill", "currentColor")
//       .attr("text-anchor", "start")
//       .text("↑ Followers")
//   );

// // Return the SVG element.
// svg.node();

// const barChart = ref(svg.node().outerHTML);

// onMounted(() => {
//   svg.remove();
// });
</script>

<style scoped lang="scss">
.spotify-top-artists {
  margin-top: 30px;

  &__options {
    display: flex;
    justify-content: center;
    list-style-type: none;
    gap: 30px;
  }
}

.grid-container-wrapper {
  height: 600px; // Adjust this value based on your needs
  margin-top: 20px;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: 10px;
}

.grid-item {
  width: 160px;
  height: 160px;
  position: relative;
  overflow: hidden;
}

.artist-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.8s ease;
}

.grid-item:hover .artist-image {
  opacity: 0.3; // Make the image more opaque when hovered
}

.artist-name {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-weight: bold;
  color: white;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.grid-item:hover .artist-name {
  opacity: 1; // Show the artist name when hovered
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-leave-active {
  position: absolute;
}
</style>
