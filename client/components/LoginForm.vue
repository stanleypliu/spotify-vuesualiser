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

<script setup>
import { onMounted } from "vue";
import { useTokenStore } from "../store/store";

const store = useTokenStore();

const emit = defineEmits(["logged-in"]);
const clientId = import.meta.env.VITE_CLIENT_ID; // your clientId
const redirectUrl = "http://localhost:3000"; // your redirect URL - must be localhost URL and/or HTTPS

const authorizationEndpoint = "https://accounts.spotify.com/authorize";
const tokenEndpoint = "https://accounts.spotify.com/api/token";
const scope = "user-read-private user-read-email user-top-read";

function saveToken(response) {
  const { access_token, refresh_token, expires_in } = response;
  console.log(store);

  store.update((state) => {
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

// Soptify API Calls
async function getToken(code) {
  const code_verifier = store.codeVerifier;

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
      code_verifier: code_verifier,
    }),
  });

  return await response.json();
}

async function loginWithSpotifyClick() {
  await redirectToSpotifyAuthorize();
}

async function redirectToSpotifyAuthorize() {
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const randomValues = crypto.getRandomValues(new Uint8Array(64));
  const randomString = randomValues.reduce(
    (acc, x) => acc + possible[x % possible.length],
    ""
  );

  const code_verifier = randomString;
  const data = new TextEncoder().encode(code_verifier);
  const hashed = await crypto.subtle.digest("SHA-256", data);

  const code_challenge_base64 = btoa(
    String.fromCharCode(...new Uint8Array(hashed))
  )
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  store.codeVerifier = code_verifier;

  const authUrl = new URL(authorizationEndpoint);
  const params = {
    response_type: "code",
    client_id: clientId,
    scope: scope,
    code_challenge_method: "S256",
    code_challenge: code_challenge_base64,
    redirect_uri: redirectUrl,
  };

  authUrl.search = new URLSearchParams(params).toString();
  window.location.href = authUrl.toString(); // Redirect the user to the authorization server for login
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
