<template>
  <el-dialog title="添加TMT配置" :visible.sync="diaVis" @close="closeConfig" class="config_dialog">
    <el-form :model="configInfo" label-width="100px">
      <p class="form_group">TMT配置 ╮(￣▽￣)╭</p>
      <el-form-item label="专注时长">
        <el-slider v-model="configInfo.focus_mins" show-input></el-slider>
      </el-form-item>
      <el-form-item label="短时间休息">
        <el-slider v-model="configInfo.relax_mins" show-input></el-slider>
      </el-form-item>
      <el-form-item label="长时间休息">
        <el-slider :max="60" v-model="configInfo.relax_long_mins" show-input></el-slider>
      </el-form-item>
      <el-form-item label="长时间间隔">
        <el-input-number v-model="configInfo.relax_long_count" :min="1" :max="10"></el-input-number>
      </el-form-item>
      <p class="form_group">偏好设置</p>
      <el-form-item label="自动专注" class="form_item_inline">
        <el-switch v-model="configInfo.auto_focus" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
      </el-form-item>
      <el-form-item label="自动休息" class="form_item_inline">
        <el-switch v-model="configInfo.auto_relax" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
      </el-form-item>
      <el-form-item label="允许系统通知">
        <el-switch v-model="configInfo.use_notification" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button @click="closeConfig">取 消</el-button>
      <el-button type="primary" @click="confirmConfig">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    configTrigger: Boolean
  },
  data () {
    return {
      configInfo: {
        // 专注时间
        focus_mins: 25,
        // 休息时间
        relax_mins: 5,
        // 长时间休息
        relax_long_mins: 20,
        // 长时间间隔
        relax_long_count: 4,
        // 允许系统通知
        use_notification: true,
        // 自动专注
        auto_focus: false,
        // 自动休息
        auto_relax: false
      },
      diaVis: false
    }
  },
  methods: {
    // 触发个人配置关闭
    closeConfig () {
      this.$emit('closeConfig')
    },
    // 触发个人配置确认
    confirmConfig () {
      this.$emit('confirmConfig', this.configInfo)
    }
  },
  watch: {
    configTrigger (val) {
      this.diaVis = val
    }
  }
  // computed: {
  //   diaVis : {
  //     get: () => {
  //       return this._diaVis
  //     },
  //     set: (val) => {
  //       this._diaVis = val
  //     }
  //   }
  // }
}
</script>

<style lang="scss" scoped>
.config_dialog {
    .el-form-item{
        margin-bottom: 18px;
    }

    .form_item_inline{
      display: inline-block;
    }

    .form_group{
        font-weight: bold;
    }
}
</style>
