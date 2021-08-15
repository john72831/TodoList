<template>
  <header>
    <nav>
      <h1>
        <router-link to="/">JTodo</router-link>
      </h1>
      <ul>
        <li v-if="isLoggedIn">
          <a @click.prevent="logout">登出</a>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script>
import { authenticateModule } from '~/store'
export default {
  computed: {
    isLoggedIn() {
      return authenticateModule.isAuthenticated
    },
  },
  methods: {
    logout() {
      authenticateModule.logout()
      this.$router.replace('/login')
    },
  },
}
</script>

<style scoped>
header {
  width: 100%;
  height: 5rem;
  background-color: #409eff;
  display: flex;
  justify-content: center;
  align-items: center;
}

header a {
  color: white;
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border: 1px solid transparent;
  cursor: pointer;
}

h1 {
  margin: 0;
}

h1 a {
  color: white;
  margin: 0;
}

h1 a:hover,
h1 a:active,
h1 a.router-link-active {
  border-color: transparent;
}

header nav {
  width: 90%;
  margin: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

header ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

li {
  margin: 0 0.5rem;
}
</style>
