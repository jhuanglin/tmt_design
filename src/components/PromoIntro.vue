<template>
    <el-dialog title="关于番茄" :visible.sync="dialogVisible" @close="closeDia">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="番茄介绍" name="first">
          <div>
            <p>番茄工作法是一个简单的时间管理方法，在这里，你需要(๑•́ ₃•̀๑):</p>
            <p>1. 明确自己的工作学习任务，并记录下来</p>
            <p>2. 将工作学习时间分隔成多个番茄时间（一个番茄时间一般分为25分钟专注时间和5分钟休息时间</p>
            <p>3. 在专注时间内专心只做一件事</p>
            <p>4. 在休息时间请着重休息，不要累着自己(｡￫‿￩｡)</p>
            <p>5. 为自己完成的任务进行记录总结</p>
            <p>拖延偷懒只能浪费我们的时间，在这里，你需要自律，立即行动起来，相信我，会有收获的！(●’◡’●)ﾉ </p>
            <p>请开始你的一天任务吧！！(ง •̀_•́)ง~</p>
          </div>
        </el-tab-pane>
        <el-tab-pane label="关于我" name="second">
          <p>项目地址：<a href="https://github.com/mcmPan/tmt_design">github</a></p>
          <a href="https://github.com/mcmPan/tmt_design/issues">意见反馈</a>
          <p>更新日期：</p>
          <p>2018-04-11</p>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer">
        <el-button type="primary" @click="closeDia">关 闭</el-button>
      </span>
    </el-dialog>
</template>

<script>
export default {
  props: ['dialogVisible'],
  data () {
    return {
      activeName: 'first'
    }
  },
  method: {
    closeDia () {
      this.$emit('closeItrDia')
    }
  }
}
</script>

<style lang="scss" scoped>
  .content_line{
    display: flex;
    .line_box{
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
      height: 150px;
    }
    .line_left{
      border-right: 2px solid #ccc;
      border-bottom: 2px solid #ccc;
    }
    .line_right{
      border-bottom: 2px solid #ccc;
    }
    .line_value{
      font-weight: bold;
      color: #ff9292;
    }
    .promo_list{
      padding-left: 10px;
      border-bottom: 1px solid #ccc;
    }
  }
</style>
