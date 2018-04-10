<template>
  <div class="wrapper access_view">
    <div class="access_content box">
        <div class="web_logo">
            <p>TMT</p>
        </div>
        <el-form label-position="right" status-icon :rules="rules" label-width="80px" :model="userInfo" ref='userInfo'>
            <el-form-item label="账号" prop="username">
                <el-input v-model="userInfo.username" class="el_input"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="userInfo.password" type="password" class="el_input"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="passwordConfirm">
                <el-input v-model="userInfo.passwordConfirm" type="password" class="el_input"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button class="el_button" type="success" @click="register('userInfo')">注册</el-button>
            </el-form-item>
        </el-form>
        <span class="font_button" @click="toLogin">返回登陆</span>
    </div>
  </div>
</template>

<script>
import md5 from 'md5'
import '@/assets/login_regis.scss'

export default {
  data () {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (value.length < 6) {
          callback(new Error('密码最少需要6位数'))
        } else if (this.userInfo.passwordConfirm !== '') {
          this.$refs.userInfo.validateField('passwordConfirm')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.userInfo.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }

    return {
      userInfo: {
        username: '',
        password: '',
        passwordConfirm: ''
      },
      rules: {
        password: [
          { validator: validatePass, trigger: 'blur' }
        ],
        passwordConfirm: [
          { validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    register (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http({
            method: 'POST',
            url: 'api/register',
            data: {
              username: this.userInfo.username,
              password: md5(this.userInfo.password)
            }
          }).then((res) => {
            if (res.data.status === true) {
              this.$notify.success({
                title: '注册成功',
                dangerouslyUseHTMLString: true,
                messgae: '将在2s后自动跳转到登录页面<br><a href="/">自动跳转</a>',
                duration: 2000
              })
              setTimeout(() => {
                this.$router.push('/')
              }, 2000)
            } else {
              var errCode = res.data.err_code
              switch (errCode) {
                case 100:
                  this.$notify({
                    title: '错误',
                    message: '该用户已存在,请重新输入'
                  })
                  break
                // case '101':
                //   this.$notify.error({
                //     title: '错误',
                //     message: '服务器发生错误，请重试'
                //   })
                //   break
              }
            }
          })
        }
      })
    },
    toLogin () {
      this.$router.push('/')
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
