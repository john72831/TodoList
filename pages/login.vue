<template>
  <div v-loading.fullscreen.lock="isLoading">
    <el-form ref="form" :rules="rules" :model="form">
      <el-form-item prop="email">
        <label for="email">E-Mail</label>
        <el-input type="email" id="email" placeholder="請輸入E-Mail" v-model.trim="form.email" />
      </el-form-item>
      <el-form-item prop="password">
        <label for="password">密碼</label>
        <el-input type="password" id="password" placeholder="請輸入密碼" v-model.trim="form.password" />
      </el-form-item>
      <el-button type="primary" @click="submit">{{ submitButtonCaption }}</el-button>
      <el-button @click="switchAuthMode">{{ switchModeButtonCaption }}</el-button>
    </el-form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { authenticateModule } from '~/store'

export default Vue.extend({
  data() {
    return {
      form: { email: '', password: '' },
      mode: 'login',
      isLoading: false,
    }
  },
  computed: {
    submitButtonCaption() {
      if (this.mode === 'login') {
        return '登入'
      } else {
        return '註冊'
      }
    },
    switchModeButtonCaption() {
      if (this.mode === 'login') {
        return '我還沒有帳號'
      } else {
        return '我已經有帳號'
      }
    },
    rules(): any {
      return {
        email: [{ required: true, trigger: 'blur', message: '請輸入登入帳號' }],
        password: [{ required: true, trigger: 'blur', message: '請輸入密碼' }],
      }
    },
  },
  methods: {
    async submit() {
      ;(this.$refs['form'] as any).validate(async (valid: boolean) => {
        if (valid) {
          this.isLoading = true
          let result = false
          if (this.mode === 'login') {
            result = await authenticateModule.login(this.form)
          } else {
            result = await authenticateModule.signup(this.form)
          }

          if (result) this.$router.replace('/')

          this.isLoading = false
        }
      })
    },
    switchAuthMode() {
      if (this.mode === 'login') {
        this.mode = 'signup'
      } else {
        this.mode = 'login'
      }
    },
  },
})
</script>

<style scoped>
label {
  font-weight: bold;
  margin-bottom: 0.5rem;
  display: block;
}
</style>
