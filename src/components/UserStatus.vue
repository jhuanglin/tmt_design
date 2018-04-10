<template>
    <el-dialog class="user_status" title="TMT历史记录" :visible.sync="dialogVisible" @close="closeDia">
      <p class="dia_intro">嘿嘿~以下是阁下的昨日数据，今日也请好好努力哦~</p>
      <div class="dia_content">
        <div class="content_line">
          <div class="line_box line_left">
            <p>累计番茄数</p>
            <p class="line_value">{{userStatus.count_promo}}</p>
          </div>
          <div class="line_box line_right">
            <p>累计完成任务</p>
            <p class="line_value">{{userStatus.count_list}}</p>
          </div>
        </div>
        <div class="content_line">
          <div class="line_box line_left">
            <p>累计完成时间(mins)</p>
            <p class="line_value">{{userStatus.count_mins}}</p>
          </div>
          <div class="line_box line_right">
            <p v-if="userStatus.count_label.length === 0">暂无标签数据</p>
            <div v-else ref="lineChart"></div>
          </div>
        </div>
        <div class="content_promo">
          <p class="promo_list">番茄历史</p>
          <p v-if="userStatus.promo_list.length === 0" class="promo_list">暂无数据</p>
          <p v-else v-for="(list, index) in userStatus.promo_list" :key="index"  class="promo_list">
            <span>{{ list.start_time }} - {{ list.end_time }} </span>
            <span> {{ list.title }}</span>
          </p>
        </div>
      </div>
      <span slot="footer">
        <el-button type="primary" @click="closeDia">确 定</el-button>
      </span>
    </el-dialog>
</template>

<script>
export default {
  props: ['dialogVisible', 'userStatus'],
  mounted () {
    this.initPieChart()
  },
  method: {
    initPieChart () {
      let chart = this.$echarts.init(this.$refs['lineChart'])
      let pieData = this.userStatus.count_label
      chart.setOption({
        // color: ['#ECAD9E', '#19CAAD', '#F4606C', '#E6CEAC', '#BEEDC7', '#A0EEE1', '#BEE7E9', '#8CC7B5'],
        // color: ['#EAD52A', '#B28204', '#FEB62C', '#FCC767'],
        // color: ['#FD6766', '#FF534D', '#F84F62', '#FA1D0B'],
        // color: ['#FFC547', '#FC8703', '#FE9A3A'],
        color: ['#F36705', '#FDCC06', '#99A42A'],
        title: {
          text: '标签统计',
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c}个 ({d}%)'
        },
        series: [
          {
            name: '番茄个数',
            type: 'pie',
            center: ['50%', '50%'],
            data: pieData,
            label: {
              position: 'inside'
            }
          }
        ]
      })
      window.addEventListener('resize', chart.resize)
    },
    closeDia () {
      this.$emit('closeDialog')
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
