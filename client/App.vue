<template>
  <div :class="loggedIn ? 'logged-in-background' : 'overlay'"></div>
  <div class="wrapper">
    <div>
      <div class="wrapper__content">
        <h1 class="app-title" v-if="!loggedIn">
          Spotify
          <span class="color-white">Vuesualiser</span>.
        </h1>
        <h1 v-if="loggedIn" class="app-title">
          Welcome, <span class="color-white">{{ name }}</span>
        </h1>
        <div class="wrapper__components">
          <login-form
            v-if="!loggedIn"
            @logged-in="checkLoginStatus"
          ></login-form>
          <visualisation-carousel v-else />
        </div>
        <div class="button-bar">
          <button type="submit" v-if="loggedIn" @click="logoutClick()">
            Log out
          </button>
          <button v-if="loggedIn" @click="regenerateTokenClick">
            Refresh Token
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import LoginForm from "./components/LoginForm.vue";
import VisualisationCarousel from "./components/VisualisationCarousel.vue";

import { useToken } from './composables/useToken'
import { useTokenStore } from "./store/store";

const store = useTokenStore();

const tokenEndpoint = "https://accounts.spotify.com/api/token";
const accessToken = store.accessToken;
const refreshToken = store.refreshToken;
const clientId = import.meta.env.VITE_CLIENT_ID; // your clientId

const loggedIn = ref(!!accessToken);

function checkLoginStatus() {
  loggedIn.value = !!store.accessToken;
}

const name = ref("");

onMounted(async () => {
  checkLoginStatus();

  if (loggedIn.value) {
    const response = await getUserData();
    name.value = response.display_name;
  }
});

async function logoutClick() {
  localStorage.clear();
  window.location.href = "http://localhost:3000";
}

async function getUserData() {
  const response = await fetch("https://api.spotify.com/v1/me", {
    method: "GET",
    headers: { Authorization: "Bearer " + accessToken },
  });

  return await response.json();
}

async function regenerateToken() {
  const response = await fetch(tokenEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  return await response.json();
}

async function regenerateTokenClick() {
  const token = await regenerateToken();
  const { access_token, refresh_token, expires_in } = response;

  store.access_token = access_token;
  store.refresh_token = refresh_token;
  store.expires_in = expires_in;
}
</script>

<style lang="scss" scoped>
.logged-in-background {
  background-color: $spotify-grey;
  background-size: cover;

  position: fixed;
  height: 100%;
  width: 100%;

  z-index: -1;
}

.overlay {
  background-image: url("../client/assets/images/background.svg");
  background-size: cover;
  opacity: 0.8;
  filter: blur(2px) grayscale(30%);

  position: fixed;
  height: 100%;
  width: 100%;

  z-index: -1;
}

.wrapper {
  z-index: 1;

  height: 100%;
  width: 100%;

  display: flex;
  justify-content: center;
  align-items: center;

  &__content {
    min-width: 1000px;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }

  &__components {
    border-radius: 2px;

    margin-top: 20px;

    width: 100%;
    height: 100%;
  }
}

.button-bar {
  display: flex;
  gap: 30px;
  margin-top: 40px;
  font-weight: normal;
}
</style>
