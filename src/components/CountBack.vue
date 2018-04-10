<template>
  <div class="box count_view">
    <el-row type="flex" justify="flex-start" :gutter="10">
      <el-col :span="5">
        <button-panel :class="type === 'historyMins' ? 'button_hover' : ''" title="历史统计" :content="historyCountMins + '分'" type="historyMins" @listen="changeType"></button-panel>
      </el-col>
      <el-col :span="5">
        <button-panel :class="type === 'historyList' ? 'button_hover' : ''" title="任务历史" :content="historyCountList + '个'" type="historyList" @listen="changeType"></button-panel>
      </el-col>
      <el-col :span="5">
        <button-panel :class="type === 'historyPromo' ? 'button_hover' : ''" title="番茄历史" :content="historyCountPromos + '个'" type="historyPromo" @listen="changeType"></button-panel>
      </el-col>
    </el-row>
    <div class="count_content">
      <div  v-if="type === 'historyMins'" v-loading="chartLoading" >
        <div class="chart_search">
          <el-date-picker :editable="false" v-model="countDate" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" size="small" @change="dateSearch" :picker-options="pickerOptions"></el-date-picker>
        </div>
        <!-- 折线图 -->
        <chart class="count_chart_line" :chartData="chartLineData" type="line"></chart>
        <p class="count_time">累计{{ allMins }}mins</p>
        <div class="count_chart_2">
          <div class="count_chart_contanier">
            <!-- 标签统计 -->
            <chart :chartData="chartPieData" type="pie"></chart>
          </div>
          <div class="count_chart_contanier">
            <!-- 最佳工作时间 -->
            <chart :chartData="chartBarData" type="bar"></chart>
          </div>
        </div>
      </div>
      <div v-else-if="type === 'historyPromo'" v-loading="promoLoading">
        <div class="chart_search">
          <el-date-picker :editable="false" v-model="countPromoDate" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" size="small" @change="getPromoData" :picker-options="pickerOptions"></el-date-picker>
        </div>
        <div class="promo_content">
          <p v-if="promoShowData.length === 0" class="content_none_data">
            暂无数据~fighting！
          </p>
          <div v-else v-for="(data, index) in promoShowData" :key="index" class="completed_promo">
            <completed-promo :promoData="data" @reloadPro="reloadPro"></completed-promo>
          </div>
        </div>
        <el-pagination small layout="prev, pager, next" :total="promoPageTotal" :page-size="pageSize" @current-change="handleCurrentChange"></el-pagination>
      </div>
      <div v-else-if="type === 'historyList'" v-loading="listLoading">
        <div class="chart_search">
          <el-date-picker :editable="false" v-model="countListDate" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" size="small" @change="getListData" :picker-options="pickerOptions"></el-date-picker>
        </div>
        <div class="promo_content">
          <p v-if="listShowData.length === 0" class="content_none_data">
            暂无数据~fighting！
          </p>
          <div v-for="(data, index) in listShowData" :key="index" class="completed_list">
            <completed-list :listData="data" @reloadList="reloadProList"></completed-list>
          </div>
        </div>
        <el-pagination small layout="prev, pager, next" :total="listPageTotal" :page-size="pageSize" @current-change="handleCurrentChange"></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import buttonPanel from '@/components/ButtonPanel'
import chart from '@/components/Chart'
import completedPromo from '@/components/CompletedPromo'
import completedList from '@/components/CompletedList'
export default {
  data () {
    return {
      type: '',
      historyCountMins: 0,
      historyCountPromos: 0,
      historyCountList: 0,
      allMins: 0,
      countDate: [],
      countPromoDate: [],
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      },
      chartLineData: {},
      chartPieData: {},
      chartBarData: {},
      promoData: [],
      promoShowData: [],
      listData: [],
      listShowData: [],
      countListDate: [],
      promoPageTotal: 0,
      listPageTotal: 0,
      pageSize: 2,
      chartLoading: true,
      promoLoading: true,
      listLoading: true
    }
  },
  created () {
    this.getCountData()
    this.$eventBus.$on('reloadCountData', () => {
      this.getCountData()
      let type = this.type
      if (type === 'historyList') {
        this.getListData()
      } else if (type === 'historyPromo') {
        this.getPromoData()
      } else if (type === 'historyMins') {
        this.getChartLineData()
        this.getChartData()
      }
    })
    // this.getChartLineData()
    // this.getChartData()
    // this.getListData()
  },
  methods: {
    // 获取一开始的初始统计数据
    getCountData () {
      this.$http({
        method: 'POST',
        url: '/api/count/data'
      }).then((res) => {
        if (res.data.status === true) {
          let data = res.data.data
          console.log(data)
          this.historyCountMins = data.historyCountMins
          this.historyCountPromos = data.historyCountPromos
          this.historyCountList = data.historyCountList
        }
      })
    },
    // 默认展示七天数据
    getChartLineData (val) {
      var data = {
        start_date: '',
        end_date: ''
      }
      if (val && this.countDate.length === 2) {
        data.start_date = this.countDate[0]
        data.end_date = this.countDate[1]
      }
      this.$http({
        method: 'POST',
        url: '/api/count/linechart',
        data: data
      }).then((res) => {
        if (res.data.status === true) {
          this.chartLoading = false
          this.chartLineData = res.data.data
          this.allMins = this.chartLineData.allMins
        }
      })
    },
    // 获取饼图的数据--基于标签
    getChartData () {
      this.$http({
        method: 'POST',
        url: '/api/count/piechart',
        data: {
          type: 'pie'
        }
      }).then((res) => {
        if (res.data.status === true) {
          this.chartPieData = res.data.data
        }
      })
      // 获取柱状图数据--最佳工作时长
      this.$http({
        method: 'POST',
        url: '/api/count/barchart',
        data: {
          type: 'bar'
        }
      }).then((res) => {
        if (res.data.status === true) {
          this.chartBarData = res.data.data
        }
      })
    },
    // 获取完成番茄的历史
    getPromoData (val) {
      var data = {
        start_date: '',
        end_date: ''
      }
      if (val && this.countPromoDate.length === 2) {
        data.start_date = this.countPromoDate[0]
        data.end_date = this.countPromoDate[1]
      }
      this.$http({
        method: 'POST',
        url: '/api/promo',
        data: data
      }).then((res) => {
        if (res.data.status === true) {
          this.promoData = res.data.data
          this.promoPageTotal = this.promoData.length
          this.promoShowData = this.promoData.slice(0, 2)
          this.promoLoading = false
        }
      })
    },
    getListData (val) {
      var data = {
        start_date: '',
        end_date: ''
      }
      if (val && this.countListDate.length === 2) {
        data.start_date = this.countListDate[0]
        data.end_date = this.countListDate[1]
      }
      this.$http({
        method: 'POST',
        url: '/api/list/completelist',
        data: data
      }).then((res) => {
        if (res.data.status === true) {
          this.listData = res.data.data
          this.listPageTotal = this.listData.length
          this.listShowData = this.listData.slice(0, 2)
          this.listLoading = false
        }
      })
    },
    // 点击切换当前类型
    changeType (type) {
      this.type = type
      switch (type) {
        case 'historyMins':
          if (this.chartLoading) {
            this.getChartLineData()
            this.getChartData()
            this.listLoading = true
            this.promoLoading = true
          }
          break
        case 'historyList':
          if (this.listLoading) {
            this.getListData()
            this.chartLoading = true
            this.promoLoading = true
          }
          break
        case 'historyPromo':
          if (this.promoLoading) {
            this.getPromoData()
            this.chartLoading = true
            this.listLoading = true
          }
          break
      }
    },
    // 日期搜索
    dateSearch (val) {
      this.getChartLineData(val)
    },
    // 删除之后重新加载promo
    reloadPro () {
      this.getPromoData()
      this.getCountData()
    },
    reloadProList () {
      this.getListData()
      this.$eventBus.$emit('delCompleteList')
    },
    // 切换页面
    handleCurrentChange (val) {
      var page = (Number(val) - 1) * 2
      if (this.type === 'historyPromo') {
        this.promoShowData = this.promoData.slice(page, page + 2)
      } else if (this.type === 'historyList') {
        this.listShowData = this.listData.slice(page, page + 2)
      }
    }
  },
  components: {
    buttonPanel,
    chart,
    completedPromo,
    completedList
  }
}
</script>

<style lang="scss" scoped>
.box{
  width: 100%;

  .button_hover{
    background-color: #f4f4f4;
  }
  .count_content{
    margin-top: 15px;
    border: 1px solid #eee;
    border-radius: 10px;
    background-color: #FDFDFD;
    padding: 10px;

    .chart_search{
      text-align: right;
      cursor: pointer;
    }
    .count_chart_line{
      height: 295px;
      width: 100%;
    }
    .count_time{
      margin-top: -10px;
      font-weight: 600;
      color: #9a9a9a;
    }

    .count_chart_2{
      margin-top: 10px;
      border-top: 1px solid #ccc;
      display: flex;
      justify-content: space-between;
    }
    .count_chart_contanier{
      flex-grow: 1;
      flex-basis: 50%;
      height: 250px;
      padding: 8px;
    }

    .completed_promo, .completed_list{
      border-bottom: 1px solid #ccc;
      &:last-child{
        border-bottom: 0px;
      }
    }

    .content_none_data{
      padding-top: 30px;
      padding-bottom: 30px;
      text-align: center;
      font-size: 24px;
      font-weight: bold;
      color: #F84F62;
    }
  }
}
</style>
