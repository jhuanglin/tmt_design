<template>
  <div class="chart" ref="chart"></div>
</template>

<script>
export default {
  props: ['chartData', 'type'],
  data () {
    return {
      chart: {}
    }
  },
  mounted () {
    this.initChart()
  },
  methods: {
    initChart () {
      if (!this.chart.id) {
        this.chart = this.$echarts.init(this.$refs['chart'])
      }
      var chartData = this.chartData
      if (this.type === 'line') {
        let xdata = []
        let ydata = []
        if (chartData.xdata && chartData.ydata) {
          xdata = chartData.xdata
          ydata = chartData.ydata
        }
        this.chart.setOption({
          // color: ['#FFC547', '#FC8703', '#FE9A3A'],
          color: ['#ECAD9E'],
          title: {
            text: 'TMT统计',
            textStyle: {
              color: '#C3C6C8',
              fontSize: '20',
              fontWeight: 'normal'
            }
          },
          grid: {
            left: '40',
            right: '40'
          },
          tooltip: {
            formatter (param) {
              var html = ''
              var content = param.seriesName + ': ' + param.value
              html += param.name + '<br>' + '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + param.color + '"></span>' + content + '<br>'
              return html
            }
          },
          xAxis: {
            data: xdata
          },
          yAxis: {},
          series: [{
            name: '完成番茄',
            type: 'line',
            symbolSize: '10',
            data: ydata
          }]
        })
      } else if (this.type === 'pie') {
        var legendData = []
        var pieData = []
        chartData.legend && (legendData = chartData.legend)
        chartData.data && (pieData = chartData.data)
        if (pieData.length === 0) {
          pieData.push({
            value: '0',
            name: '暂无数据'
          })
        }
        this.chart.setOption({
          // color: ['#ECAD9E', '#19CAAD', '#F4606C', '#E6CEAC', '#BEEDC7', '#A0EEE1', '#BEE7E9', '#8CC7B5'],
          // color: ['#EAD52A', '#B28204', '#FEB62C', '#FCC767'],
          // color: ['#FD6766', '#FF534D', '#F84F62', '#FA1D0B'],
          // color: ['#F36705', '#FDCC06', '#99A42A'],
          color: ['#FFC547', '#FC8703', '#FE9A3A'],
          title: {
            text: '标签统计',
            x: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c}个 ({d}%)'
          },
          legend: {
            orient: 'vertical',
            x: 'left',
            top: '10',
            data: legendData
          },
          series: [
            {
              name: '番茄个数',
              type: 'pie',
              center: ['50%', '55%'],
              data: pieData,
              label: {
                position: 'inside'
              }
            }
          ]
        })
      } else if (this.type === 'bar') {
        let xdata = []
        let ydata = []
        let bestday = []
        let bestdate = []
        let dateLen = 0
        chartData.xdata && (xdata = chartData.xdata)
        chartData.ydata && (ydata = chartData.ydata)
        // Array
        chartData.bestday && (bestday = chartData.bestday)
        // Array
        chartData.bestdate && (bestdate = chartData.bestdate)
        bestday.length === 0 ? bestday = '-' : bestday = bestday.join(',')
        dateLen = bestdate.length
        if (dateLen === 0) {
          bestdate = '-'
        } else {
          if (dateLen === 1) {
            bestdate = bestdate[0] + ':00-' + (bestdate[0] + 1) + ':00'
          } else {
            bestdate = bestdate[0] + ':00-' + bestdate[dateLen - 1] + ':00'
          }
        }
        this.chart.setOption({
          color: ['#ECAD9E'],
          title: {
            text: '最佳工作日--' + bestday,
            subtext: '最佳工作时长--' + bestdate,
            textStyle: {
              fontSize: '20',
              fontWeight: 'normal'
            },
            subtextStyle: {
              fontSize: '18',
              fontWeight: 'normal'
            },
            left: '35'
          },
          grid: {
            left: '40',
            right: '40',
            top: '70',
            bottom: '30'
          },
          xAxis: {
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              formatter: function (value) {
                return value.slice(1)
              }
            },
            data: xdata
          },
          yAxis: {
            show: false,
            splitLine: {
              show: false
            }
          },
          series: [{
            name: '完成番茄',
            type: 'bar',
            data: ydata,
            // 当数据为0时，依然显示
            barMinHeight: 20,
            emphasis: {
              label: {
                show: true,
                position: 'top',
                color: '#ECAD9E',
                fontWeight: 'normal',
                formatter: '{c}mins'
              }
            }
          }]
        })
      }
      window.addEventListener('resize', this.chart.resize)
    }
  },
  watch: {
    chartData: function (val) {
      this.initChart()
    }
  }
}
</script>

<style>
    .chart{
        width:100%;
        height: 100%;
    }
</style>
