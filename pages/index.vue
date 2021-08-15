<template>
  <div>
    <card>
      <el-form ref="form" :rules="rules" :model="form">
        <el-form-item prop="title">
          <el-input type="text" v-model.trim="form.title" />
        </el-form-item>
        <el-button type="primary" @click="addTodo">新增</el-button>
      </el-form>
    </card>
    <todo-list></todo-list>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'
import { Todo } from '~/models/todo'
import { authenticateModule, todoModule } from '@/store'

export default Vue.extend({
  data() {
    return {
      form: { title: '' },
    }
  },
  computed: {
    rules(): any {
      return {
        title: [{ required: true, trigger: 'blur', message: '請輸入待辦描述' }],
      }
    },
    ...mapGetters('todoModule', ['TodoList']),
  },
  beforeMount() {
    authenticateModule.tryLogin()
    if (!authenticateModule.isAuthenticated) this.$router.replace('/login')
  },
  methods: {
    addTodo(): void {
      ;(this.$refs['form'] as any).validate(async (valid: boolean) => {
        if (valid) {
          todoModule.insertTodo(this.form.title)
          this.form.title = ''
        }
      })
    },
  },
})
</script>
