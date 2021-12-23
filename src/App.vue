<template>
  <div class="overlay"></div>
  <div class="wrapper">
    <div class="wrapper__content">
      <h1 class="app-title">
        Spotify
        <span class="color-white">Vuesualiser</span>.
      </h1>
      <!-- Div to hold login screen, visualisations and more -->
      <div class="wrapper__components">
        <login-form></login-form>
      </div>
    </div>
  </div>
</template>

<script setup>
  import LoginForm from './components/LoginForm.vue';
</script>

<style lang="scss" scoped> 
.overlay {
  background-image: url("../src/assets/images/background.svg");
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
    width: 1000px;
    height: 800px;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }

  &__components {
    // todo Temporary guides put in place - remove later
    border: 1px solid black;
    border-radius: 2px;
    
    margin-top: 20px;

    width: 100%;
    height: 100%;
  }
}
</style>
