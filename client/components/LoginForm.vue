<template>
  <div class="oauth-wrapper">
    <h4 class="login-form__title">
      To begin, please authorise your Spotify account.
    </h4>
    <button class="oauth-button" type="submit" @click="loginWithSpotifyClick()">
      Log Into Spotify
    </button>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useTokenStore } from "../store/store";
import { useSpotifyAuth } from "../composables/useSpotifyAuth";

const store = useTokenStore();
const { redirectToSpotifyAuthorize } = useSpotifyAuth();

const emit = defineEmits(["logged-in"]);
const clientId = import.meta.env.VITE_CLIENT_ID; // your clientId
const redirectUrl = "http://localhost:5173"; // your redirect URL - must be localhost URL and/or HTTPS

const tokenEndpoint = "https://accounts.spotify.com/api/token";

function saveToken(response) {
  const { access_token, refresh_token, expires_in } = response;

  store.$patch((state) => {
    state.accessToken = access_token;
    state.refreshToken = refresh_token;
    state.expiresIn = expires_in;
    const now = new Date();
    const expiry = new Date(now.getTime() + expires_in * 1000).toString();
    state.expires = expiry;
  });
}

// Move the token exchange logic to a separate function
async function handleTokenExchange() {
  const args = new URLSearchParams(window.location.search);
  const code = args.get("code");

  if (code) {
    const token = await getToken(code);
    saveToken(token);

    // Remove code from URL so we can refresh correctly.
    const url = new URL(window.location.href);
    url.searchParams.delete("code");

    const updatedUrl = url.search ? url.href : url.href.replace("?", "");
    window.history.replaceState({}, document.title, updatedUrl);
  }

  emit("logged-in");
}

// Call the function when the component is mounted
onMounted(() => {
  handleTokenExchange();
});

async function getToken(code: string) {
  try {
    const codeVerifier: string | null =
      window.localStorage.getItem("code_verifier");

    if (!codeVerifier) {
      throw new Error("Missing code verifier");
    }

    const response = await fetch(tokenEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: clientId,
        grant_type: "authorization_code",
        code: code,
        redirect_uri: redirectUrl,
        code_verifier: codeVerifier,
      }),
    });

    return await response.json();
  } catch {
    console.error("Couldn't login");
  }
}

async function loginWithSpotifyClick() {
  await redirectToSpotifyAuthorize(clientId, redirectUrl);
}
</script>

<style lang="scss" scoped>
.oauth-wrapper {
  margin: 80px auto;

  height: 60%;
}

.oauth-button {
  font-weight: bold;
  margin-top: 40px;
  font-size: 16px;
}

.login-form {
  &__title {
    color: white;
    margin-top: 40px;
    margin-bottom: 10px;
    text-align: center;
  }
}
</style>
