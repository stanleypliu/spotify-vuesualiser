<template>
  <div class="oauth-wrapper">
    <form class="login-form" @submit.prevent="authenticate">
      <h4 class="login-form__title">Sign in through Spotify</h4>
      <div class="login-form__fields">
        <label for="username" class="login-form__label">Username</label>
        <input class="login-form__field" type="text" name="Username" id="username" v-model.trim="username"/>
        <label for="password" class="login-form__label">Password</label>
        <input class="login-form__field" type="password" name="Password" id="password" v-model.trim="password"/>
        <button type="submit" :disabled="username === '' || password === ''">Log In Via OAuth</button>
      </div>
    </form>
  </div>
</template>

<script setup>
  import { ref } from 'vue'

  const username = ref('')
  const password = ref('')
</script>

<style lang="scss" scoped>
@import "../assets/stylesheets/variables.scss";
.oauth-wrapper {
  background-color: black;
  border: 1px solid white;
  border-radius: 6px;

  margin: 80px auto;

  height: 60%;
  width: 400px;
}

.login-form {
  color: white;

  &__title {
    margin-top: 40px;
    margin-bottom: 10px;
    text-align: center;
  }

  &__fields {
    padding: 30px;
  }

  &__label {
    font-family: $font-body;
    text-align: left;
  }

  &__field {
    border: 1px solid black;
    border-radius: 2px;

    margin-top: 10px;
    margin-left: auto;
    margin-bottom: 20px;
    margin-right: auto;
    padding: 10px;

    width: 100%;

    display: block;

    &:last-of-type {
      margin-bottom: 40px;
    }
  }
}

button {
  background-color: $spotify-green;
  border-radius: 3px;
  color: white;

  font-family: $font-body;
  font-weight: bold;
  font-size: 20px;
  text-transform: uppercase;

  margin: 0 auto;
  padding: 8px 10px;

  display: block;

  transition: 0.5s;

  &:hover:not(:disabled) {
    background-color: green;
  }

  &:disabled {
    opacity: 0.6;
  }
}
</style>