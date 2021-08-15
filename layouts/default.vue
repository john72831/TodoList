<template>
  <div>
    <Header />
    <div class="container">
      <transition name="page">
        <Nuxt />
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { authenticateModule } from '~/store'

export default Vue.extend({
  computed: {
    didAutoLogout() {
      return authenticateModule.didAutoLogout
    },
  },
  watch: {
    didAutoLogout(newValue, oldValue) {
      if (newValue && newValue !== oldValue) {
        this.$router.replace('/')
      }
    },
  },
})
</script>

<style>
body {
  margin: 0;
  font-family: Arial, 'Noto Sans TC', sans-serif;
  font-size: 16px;
}

a {
  text-decoration: none;
  color: black;
}

.container {
  max-width: 40rem;
  margin: 0 auto;
  padding: 0px;
  margin: 0px auto;
}

.page-enter-active {
  transition: all 0.3s ease-out;
}

.page-leave-active {
  transition: all 0.3s ease-in;
}

.page-enter {
  opacity: 0;
}

.page-leave,
.page-enter-to {
  opacity: 1;
}

.page-leave-to {
  opacity: 0;
}
</style>
