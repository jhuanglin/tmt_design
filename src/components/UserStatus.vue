<template>
    <el-dialog class="user_status" title="TMT历史记录" :visible.sync="diaVis" @close="closeDia" width="35%">
      <p class="dia_intro">嘿嘿,以下是你的昨日数据，今日也请好好努力哦(ง •̀_•́)ง~</p>
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
            <div ref="lineChart" class="line_chart"></div>
          </div>
        </div>
        <div class="content_promo">
          <p class="promo_list">{{ userStatus.date }}番茄历史</p>
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
  data () {
    return {
      diaVis: this.dialogVisible
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.initPieChart()
    })
  },
  methods: {
    initPieChart () {
      var chart = this.$echarts.init(this.$refs['lineChart'])
      let pieData = []
      pieData = this.userStatus.count_label
      if (pieData.length === 0) {
        pieData.push({
          value: '0',
          name: '暂无数据'
        })
      }
      chart.setOption({
        // color: ['#ECAD9E', '#19CAAD', '#F4606C', '#E6CEAC', '#BEEDC7', '#A0EEE1', '#BEE7E9', '#8CC7B5'],
        // color: ['#EAD52A', '#B28204', '#FEB62C', '#FCC767'],
        color: ['#FD6766', '#F84F62', '#FF534D', '#FA1D0B'],
        // color: ['#FFC547', '#FC8703', '#FE9A3A'],
        // color: ['#F36705', '#FDCC06', '#99A42A'],
        title: {
          text: '标签统计',
          x: 'left',
          textStyle: {
            fontSize: '14',
            fontWeight: 'normal'
          }
        },
        legend: {
          data: []
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
  },
  watch: {
    dialogVisible (val) {
      this.diaVis = val
    }
  }
}
</script>

<style lang="scss" scoped>
  .dia_intro{
    margin-top: -20px;
  }
  .content_line{
    display: flex;
    &:first-child{
      border-bottom: 2px solid #ccc;
    }
    .line_box{
      flex-grow: 1;
      flex-basis: 50%;
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      height: 90px;
    }
    .line_left{
      border-right: 2px solid #ccc;
      margin-top: 20px;
      margin-bottom: 20px;
    }
    .line_right{
      margin-top: 20px;
    }
    .line_value{
      font-weight: bold;
      color: #ff9292;
      font-size: 24px;
    }
    .line_chart{
      width: 100%;
      height: 100%;
    }
  }
  .content_promo{
    border: 1px solid #ccc;
    border-bottom: none;
  }
  .promo_list{
    padding: 2px 10px;
    border-bottom: 1px solid #ccc;
  }
</style>
