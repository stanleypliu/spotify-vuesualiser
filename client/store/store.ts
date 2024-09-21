import { defineStore } from "pinia";
import { ref } from "vue";

export const useTokenStore = defineStore("store", () => {
  const accessToken = ref(null);
  const refreshToken = ref(null);
  const expiresIn = ref(null);
  const expires = ref(null);
  const codeVerifier = ref(null);

  return { accessToken, refreshToken, expiresIn, expires, codeVerifier };
});
