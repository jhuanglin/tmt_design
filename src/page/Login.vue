<template>
  <div class="wrapper access_view">
    <div class="access_content box">
        <div class="web_logo">
            <p>TMT</p>
        </div>
        <el-form label-position="right" :rules="rules" label-width="80px" :model="userInfo" ref='userInfo'>
            <el-form-item label="账号" prop="username">
                <el-input v-model="userInfo.username" class="el_input"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="userInfo.password" type="password" class="el_input"></el-input>
            </el-form-item>
              <el-form-item>
                <el-button class="el_button" type="success" @click="login('userInfo')" @keyup.enter="login('userInfo')">登录</el-button>
            </el-form-item>
        </el-form>
        <span class="font_button" @click="toRegister">注册账号</span>
    </div>
  </div>
</template>

<script>
import '@/assets/login_regis.scss'

export default {
  data () {
    var validatePass = (rule, value, callback) => {
      if (value.trim() === '') {
        callback(new Error('密码不能为空~！'))
      } else {
        callback()
      }
    }
    var validateName = (rule, value, callback) => {
      if (value.trim() === '') {
        callback(new Error('请输入账号'))
      } else {
        callback()
      }
    }
    return {
      userInfo: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          {validator: validateName, trigger: 'blur'}
        ],
        password: [
          {validator: validatePass, trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    login (formname) {
      this.$refs[formname].validate((valid) => {
        if (valid) {
          this.$http({
            method: 'post',
            url: '/api/login',
            data: {
              username: this.userInfo.username,
              password: this.userInfo.password
            }
          }).then((res) => {
            if (res.data.status === true) {
              localStorage.setItem('username', this.userInfo.username)
              this.$router.push('/tmt_home')
            } else {
              var errCode = res.err_code
              switch (errCode) {
                case '100':
                  this.$notify.error({
                    title: '错误',
                    message: '该用户不存在'
                  })
                  break
                case '101':
                  this.$notify.error({
                    title: '错误',
                    message: '密码错误'
                  })
                  break
                case '102':
                  this.$notify.error({
                    title: '错误',
                    message: '服务器发生错误，请重试'
                  })
                  break
              }
            }
          })
        }
      })
    },
    toRegister () {
      this.$router.push('/register')
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
