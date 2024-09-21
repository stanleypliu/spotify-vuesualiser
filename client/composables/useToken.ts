import { useTokenStore } from "../store/store";

const store = useTokenStore();

export function useToken() {
  function saveToken(response) {
    const { access_token, refresh_token, expires_in } = response;
    store.accessToken = access_token
    store.refreshToken = refresh_token
    store.expiresIn = expires_in
  
    const now = new Date();
    const expiry = new Date(now.getTime() + expires_in * 1000).toString();
    store.expires = expiry
  }

  return { saveToken }
}
