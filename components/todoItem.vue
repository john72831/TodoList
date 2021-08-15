<template>
  <li>
    <el-checkbox :checked="isDone" @change="updateTodo" class="todoLabel">
      <div :class="{ isDone: isDone }">{{ title }}</div>
    </el-checkbox>
    <el-button class="small" style="float: right" @click="deleteTodo">刪除</el-button>
  </li>
</template>

<script lang="ts">
import Vue from 'vue'
import { todoModule } from '~/store'

export default Vue.extend({
  props: {
    id: String,
    title: String,
    isDone: Boolean,
  },
  methods: {
    async updateTodo() {
      todoModule.updateTodo({ id: this.id, title: this.title, isDone: !this.isDone })
      this.$emit('updateTodo')
    },
    async deleteTodo() {
      await todoModule.deleteTodo(this.id)
    },
  },
})
</script>

<style scoped>
li {
  margin: 20px;
}

.isDone {
  text-decoration: line-through;
}

.small {
  padding: 5px;
}
</style>
