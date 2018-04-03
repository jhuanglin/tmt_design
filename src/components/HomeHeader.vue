<template>
  <div class="header">
    <span class="web_logo">
        TMT
    </span>
    <div class="header_menu">
        <span class="menu" @click="toConfig">个人设置</span>
        <span v-if="userName == ''" class="menu" @click="toLogin">游客登陆</span>
        <el-dropdown v-else>
          <span class="el-dropdown-link menu">
            {{ userName }}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <span @click="changePass">修改密码</span>
            </el-dropdown-item>
            <el-dropdown-item>
              <span @click="backLogin">退出登陆</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
    </div>
    <el-dialog title="修改密码" :visible.sync="dialogVis" class="config_dialog">
      <el-form :model="configPass" label-width="100px" ref="configPass" :rules="rules">
        <p class="form_group">确定修改密码吗 ╮(￣▽￣)╭</p>
        <el-form-item label="初始密码" prop="oldPass">
          <el-input v-model="configPass.oldPass" type="password" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item label="修改密码" prop="newPass">
          <el-input v-model="configPass.newPass" type="password" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item label="修改密码" prop="confirmPass">
          <el-input v-model="configPass.confirmPass" type="password" style="width:200px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="closeConfig">取 消</el-button>
        <el-button type="primary" @click="confirmChange('configPass')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    var validateOldPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入旧密码'))
      } else {
        this.$http({
          method: 'POST',
          url: '/api/user/confirmpass',
          data: {
            password: value
          }
        }).then((res) => {
          if (res.data.status === true) {
            callback()
          } else {
            callback(new Error('密码错误'))
          }
        })
      }
    }
    var validateNewPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else {
        if (this.configPass.passwordConfirm !== '') {
          this.$refs.configPass.validateField('confirmPass')
        }
        callback()
      }
    }
    var validateConfirmPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.configPass.newPass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      userName: '',
      dialogVis: false,
      configPass: {
        oldPass: '',
        newPass: '',
        confirmPass: ''
      },
      rules: {
        oldPass: [
          {validator: validateOldPass, trigger: 'blur'}
        ],
        newPass: [
          {validator: validateNewPass, trigger: 'blur'}
        ],
        confirmPass: [
          {validator: validateConfirmPass, trigger: 'blur'}
        ]
      }
    }
  },
  created () {
    this.isUser()
  },
  methods: {
    // 判断是否用户登陆
    isUser () {
      let userName = localStorage.getItem('username')
      if (userName) {
        this.userName = userName
      }
    },
    // 进行页面设置
    toConfig () {
      this.$emit('listen')
    },
    // 进到登陆页面
    toLogin () {
      this.$router.push('/')
    },
    // 删除Storage，返回登陆页面
    backLogin () {
      localStorage.clear()
      this.toLogin()
    },
    // 关闭修改对话框
    closeConfig () {
      this.$refs['configPass'].resetFields()
      this.dialogVis = false
    },
    // 确认修改密码
    confirmChange (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http({
            method: 'POST',
            url: '/api/user/changepass',
            data: {
              newpass: this.configPass.newPass
            }
          }).then((res) => {
            if (res.data.status === true) {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.closeConfig()
            } else {
              this.$message({
                message: '修改失败，请重试',
                type: 'warning'
              })
            }
          })
        }
      })
    },
    changePass () {
      this.dialogVis = true
    }
  }
}
</script>

<style lang="scss" scoped>
.header{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 5%;
  background-color: #f6f6f6;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  box-shadow: 0 6px 15px rgba(36,37,38,0.08);

  .web_logo{
    font-size: 30px;
    margin: 10px 0;
  }

  .header_menu{
    .menu{
      cursor: pointer;
      color: #000;
      margin-right: 10px;
    }
  }
  .form_group{
    font-weight: bold;
    margin-bottom: 15px;
  }

}
</style>
