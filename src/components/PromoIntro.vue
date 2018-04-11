<template>
    <el-dialog title="关于番茄" :visible.sync="diaVis" @close="closeDia">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="番茄介绍" name="first">
          <div class="intro_content">
            <p>努力是有回报的！欢迎使用TMT</p>
            <p>番茄工作法是一个简单的时间管理方法，在这里，你需要(๑•́ ₃•̀๑):</p>
            <div class="content_point">
              <p>1. <span class="strong">明确</span>自己的工作学习任务，并记录下来</p>
              <p>2. 将工作学习时间<span class="strong">分隔</span>成多个番茄时间（一个番茄时间一般分为25分钟专注时间和5分钟休息时间</p>
              <p>3. 在专注时间内<span class="strong">专心只做一件事</span></p>
              <p>4. <span class="strong">在休息时间请着重休息</span>，不要累着自己(｡￫‿￩｡)</p>
              <p>5. 为自己完成的任务进行<span class="strong">记录总结</span></p>
            </div>
            <p>拖延偷懒只能浪费我们的时间，在这里，你需要<span class="strong">自律</span>，立即行动起来，相信我，会有收获的ﾉ </p>
            <p>请开始你的一天任务吧！！(ง •̀_•́)ง~</p>
          </div>
        </el-tab-pane>
        <el-tab-pane label="关于我" name="second">
          <div class="content_point">
            <p>项目地址：<a href="https://github.com/mcmPan/tmt_design" class="intro_link">github</a></p>
            <p>意见反馈：<a href="https://github.com/mcmPan/tmt_design/issues" class="intro_link">here</a></p>
            <p>更新日期：2018-04-12</p>
          </div>
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
      activeName: 'first',
      diaVis: false
    }
  },
  methods: {
    closeDia () {
      this.$emit('closeItrDia')
    }
  },
  watch: {
    dialogVisible (val) {
      this.diaVis = val
    }
  }
}
</script>

<style lang="scss" scoped>
.intro_content{
  line-height: 32px;
  .strong{
    font-weight: bold;
  }
  .content_point{
    padding-left: 20px;
  }

}
.intro_link{
  color: #FF534D;
  font-weight: bold;
  text-decoration: none;
}
</style>
