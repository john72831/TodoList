<template>
  <div v-loading.fullscreen.lock="isLoading">
    <div v-if="todos.length || dones.length">
      <transition name="todo" mode="out-in">
        <section v-if="todos.length">
          <h2>還有{{ todos.length }}件待辦未完成</h2>
          <card>
            <transition-group name="todo" tag="ul">
              <todo-item v-for="todo in todos" :key="todo.id" :id="todo.id" :title="todo.title" :isDone="todo.isDone"></todo-item>
            </transition-group>
          </card>
        </section>
      </transition>
      <section>
        <h2 v-if="dones.length && !todos.length">已完成全部待辦，給你一個讚!</h2>
        <h2 v-else-if="dones.length">已完成{{ dones.length }}件待辦</h2>
        <transition name="todo" mode="out-in">
          <card v-if="dones.length">
            <transition-group name="todo" tag="ul">
              <todo-item v-for="done in dones" :key="done.id" :id="done.id" :title="done.title" :isDone="done.isDone"></todo-item>
            </transition-group>
          </card>
        </transition>
      </section>
    </div>
    <h3 v-else>還沒有任何一筆代辦事項，試著新增一個吧!</h3>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { todoModule } from '~/store'

export default Vue.extend({
  data() {
    return {
      isLoading: false,
    }
  },
  computed: {
    todos() {
      return todoModule.TodoList.filter(todo => !todo.isDone)
    },
    dones() {
      return todoModule.TodoList.filter(todo => todo.isDone)
    },
  },
  async mounted() {
    this.isLoading = true
    await this.loadTodos()
    this.isLoading = false
  },
  methods: {
    async loadTodos() {
      await todoModule.loadTodo()
    },
  },
})
</script>

<style scoped>
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.todo-enter-active {
  transition: all 0.3s ease-out;
}

.todo-leave-active {
  transition: all 0.3s ease-in;
}

.todo-enter {
  opacity: 0;
  transform: scale(0.8);
}

.todo-enter-to {
  opacity: 1;
  transform: scale(1);
}

.todo-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>
