import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useTokenStore = defineStore("store", () => {
  const accessToken = ref(localStorage.getItem("accessToken") || null);
  const refreshToken = ref(localStorage.getItem("refreshToken") || null);
  const expiresIn = ref(Number(localStorage.getItem("expiresIn")) || null);
  const expires = ref<string | null>(localStorage.getItem("expires") || null);

  watch(accessToken, (newAccessToken) => {
    if (newAccessToken) {
      localStorage.setItem("accessToken", newAccessToken);
    } else {
      localStorage.removeItem("accessToken");
    }
  });

  watch(refreshToken, (newRefreshToken) => {
    if (newRefreshToken) {
      localStorage.setItem("refreshToken", newRefreshToken);
    } else {
      localStorage.removeItem("refreshToken");
    }
  });

  watch(expiresIn, (newExpiresIn) => {
    if (newExpiresIn) {
      localStorage.setItem("expiresIn", newExpiresIn.toString());
    } else {
      localStorage.removeItem("expiresIn");
    }
  });

  watch(expires, (newExpires) => {
    if (newExpires) {
      localStorage.setItem("expires", newExpires);
    } else {
      localStorage.removeItem("expires");
    }
  });

  function updateAccessToken(newToken: string) {
    accessToken.value = newToken;
  }

  return {
    accessToken,
    refreshToken,
    expiresIn,
    expires,
    updateAccessToken,
  };
});
