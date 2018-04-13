<template>
  <div class="box tick_view">
    <div class="tick_header">
      <el-input class="header_input" @clear="clearLists" v-model="showList.title" :clearable="inputClearable" placeholder="请从左侧添加新的任务" :readonly="true" prefix-icon="el-icon-plus"></el-input>
      <el-button class="time_bigin_button" type="danger" @click="resetTime">{{ button }}</el-button>
    </div>
    <div class="tick_content" @mouseleave="closeQuickButton">
      <div class="tick_time" @mouseenter="showQuickButton" >
        {{ min + ':' + s }}
        <el-button size="mini" :class="[showButton ? 'time_quick_button_show' : '' ,'time_quick_button']" type="danger" @click="quickCountTime">快速计时<i class="el-icon-arrow-right el-icon--right"></i></el-button>
      </div>
    </div>
    <div class="tick_count">
      {{ todayDate }}:<span class="count_tip">{{ countMins }}分</span>
    </div>
  </div>
</template>

<script>
import { formatWeek } from '@/untils/untils'

export default {
  // type notstart -> doing -> notrelax -> relax
  /* button 开始番茄 -> 取消计时 notstart -> doing  -> notstart
   *        doing结束 自动进入 relax 取消计时 -> 开始休息  算是完成一个番茄
   *        relax 取消 relax -> notstart 取消休息 -> 开始番茄
   */
  props: {
    list: {
      type: Object,
      default: null
    },
    initialConfig: {
      type: Object
    }
  },
  data () {
    return {
      type: 'notstart',
      inputClearable: true,
      time: '',
      timer: null,
      min: 0,
      s: 0,
      workMin: 0,
      relaxMin: 0,
      button: '开始番茄',
      showButton: false,
      notiPermission: 'default',
      notification: null,
      // 今日完成时间数
      countMins: 0,
      promoMins: 0,
      countStart: 0,
      countEnd: 0,
      showList: this.list,
      useNotification: true,
      autoFocus: false,
      autoRelax: false,
      longRelaxCount: 0,
      longRelaxMins: 0,
      promoCount: 0
    }
  },
  mounted () {
    // this.getInitialConfig()
    // this.setTime()
    this.getCountTime()
  },
  methods: {
    // 获取初始化配置
    // getInitialConfig () {},
    // 获取初始化分钟
    getCountTime () {
      // 同步今日所做时间
      this.$http({
        method: 'GET',
        url: '/api/time/count'
      }).then((res) => {
        if (res.data.status === true) {
          this.countMins = res.data.count_mins
        }
      })
    },
    /**
     * 点击按钮
     * @augments {min - 分钟数}
     * */
    resetTime () {
      // 开始计时
      if (this.type === 'notstart') {
        if (!this.showList.title) {
          this.$confirm('请从左侧任务栏选择将要执行的任务', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
        } else {
          var startDate = Date.now()
          this.showList = Object.assign(this.showList, {
            'start_date': startDate
          })
          this.countStart = Date.now()
          this.timer = setInterval(this.countTime, 1000)
          this.type = 'doing'
        }
      } else
      // 取消计时 doing -> relax 取消休息 relax -> nostart
      if (this.type === 'doing' || this.type === 'relax') {
        // 取消计时前的警告 要求用户添加放弃的原因
        //  this.$prompt('请输入放弃当前任务原因', {
        //   confirmButtonText: '放弃番茄',
        //   cancelButtonText: '取消',
        // }).then(({ value }) => {
        //   // console.log(value)
        //   clearInterval(this.timer)
        //   this.type = 'notstart'
        //   this.setTime()
        // })
        // 把开始时间删除
        if (this.showList.start_date) {
          delete this.showList.start_date
        }
        clearInterval(this.timer)
        this.type = 'notstart'
        this.setTime()
      } else
      // 开始休息 notrelax => relax
      if (this.type === 'notrelax') {
        // 点击开始休息，算一个番茄时长
        var endDate = Date.now()
        this.showList = Object.assign(this.showList, {
          'end_date': endDate
        })
        this.getCountMins()
        this.postCountMins()
        this.postPromoData()
        this.timer = setInterval(this.countTime, 1000)
        this.type = 'relax'
        setTimeout(() => {
          this.$eventBus.$emit('reloadCountData')
        }, 2000)
      }
    },
    // 计算时间
    countTime () {
      this.s--
      this.s < 10 && (this.s = '0' + this.s)
      if (this.s.length >= 3) {
        this.s = 59
        this.min = (Number(this.min) - 1)
        this.min < 10 && (this.min = '0' + this.min)
      }
      // 计时结束 type只有doing或者relax情况
      if (this.min.length >= 3) {
        this.min = '00'
        this.s = '00'
        clearInterval(this.timer)
        // 显示桌面通知
        this.showNotification()
        // 工作计时结束，完成番茄数+1
        if (this.type === 'doing') {
          this.promoCount += 1
        }
        // 计时取消 -> 开始休息 || 取消计时 -> 开始番茄
        // doing -> notrelax || relax -> notstart
        this.type = this.type === 'doing' ? 'notrelax' : 'notstart'
        this.setTime()
        if ((this.type === 'notrelax' && this.autoRelax) || (this.type === 'notstart' && this.autoFocus)) {
          this.resetTime()
        }
      }
    },
    // 重置时间
    setTime (setTime) {
      let type = this.type
      if (setTime && (this.type === 'doing' || this.type === 'relax')) {
        return
      }
      // 开始番茄的时间设置
      if (type === 'notstart') {
        this.min = this.workMin
        this.s = 0
      } else
      // 开始休息的时间设置
      if (type === 'notrelax') {
        // 如果达到了最长计时间隔
        if (this.promoCount === this.longRelaxCount) {
          this.min = this.longRelaxMins
          this.promoCount = 0
        } else {
          this.min = this.relaxMin
        }
        this.s = 0
      }
      this.min < 10 && (this.min = '0' + this.min)
      this.s < 10 && (this.s = '0' + this.s)
      this.timer = null
    },
    // 快速计时
    quickCountTime () {
      clearInterval(this.timer)
      this.timer = null
      setTimeout(() => {
        if (this.min > 10) {
          this.min = 10
        }
      }, 500)
      this.timer = setInterval(this.countTime, 1)
    },
    // 判断是否有Notification API
    setNotification () {
      if (window.Notification && this.useNotification) {
        Notification.requestPermission().then((permission) => {
          this.notiPermission = permission
        })
      } else {
        console.log('当前浏览器不支持桌面通知')
      }
    },
    // 显示桌面通知
    showNotification () {
      if (this.notiPermission === 'granted' && this.useNotification) {
        if (this.type === 'doing') {
          this.notification = this.newNotification('番茄熟了', '可以休息了~(●' + '◡' + '●)')
        } else if (this.type === 'relax') {
          this.notification = this.newNotification('休息时间到啦！', '努力努力再努力！fighting')
        }
      }

      // 显示的时候出现音频
      if (!this.notification.onshow) {
        this.notification.onshow = () => {
          var audio = new Audio('../static/video/notification_sound.mp3')
          audio.play()
          // 5秒后自动关闭消息框
          setTimeout(() => {
            this.notification.close()
          }, 5000)
        }
      }
    },
    // 新建桌面通知
    newNotification (title, msg) {
      return new Notification(
        title,
        {
          body: msg,
          icon: '../static/img/notification_img.jpg'
        }
      )
    },
    // 显示快速计时按钮
    showQuickButton () {
      if (this.type === 'doing' || this.type === 'relax') {
        this.showButton = true
      }
    },
    // 隐藏快速计时按钮
    closeQuickButton () {
      this.showButton = false
    },
    // 清空List
    clearLists () {
      this.$eventBus.$emit('clearShowList')
      this.showList = {}
      // this.$emit('clearlist')
    },
    // 发送成功数据
    // postDoneData () {
    //   var list = this.list
    //   this.$http({
    //     method: 'POST',
    //     url: '/api/time/done',
    //     data: {
    //       'doneList': list
    //     }
    //   }).then((res) => {
    //     if (res.data.status === true) {
    //     }
    //   })
    // },
    // 发送完成的番茄
    postPromoData () {
      let list = Object.assign({}, this.showList, {
        'promoMins': this.promoMins
      })
      this.$http({
        method: 'POST',
        url: '/api/promo/add',
        data: list
      }).then((res) => {
        // 如果发送失败则再次发送直到发送成功
        if (res.data.status === true) {
          this.promoMins = 0
          // this.postPromoData()
        }
      })
    },
    // 获取已学习时长
    getCountMins () {
      // if (this.type === 'doing') {
      this.countEnd = Date.now()
      var times = this.countEnd - this.countStart
      console.log('刚已完成时间' + times)
      let promoMins = Math.round(times / 1000 / 60)
      this.promoMins = promoMins
      this.countMins += promoMins
      // this.countMins += Math.round(times / 60)
      // }
    },
    // 发送今日统计数据
    postCountMins () {
      if (this.countMins !== 0) {
        this.$http({
          method: 'POST',
          url: '/api/time/addcount',
          data: {
            countMins: this.countMins
          }
        }).then((res) => {
          if (res.data.status === true) {
            // this.countMins = res.data.count_mins
          }
        })
      }
    }
    // // 发送放弃番茄原因
    // postQuitData (reason) {
    //   this.$http({
    //     method: 'POST',
    //     url: '/api/time/quit',
    //     data: {
    //       'quitData' : reason
    //     }
    //   }).then((res) => {
    //     if (res.data.status === true) {
    //       // 获取放弃列表
    //     }
    //   })
    // }
  },
  watch: {
    type (type) {
      this.inputClearable = true
      switch (type) {
        case 'notstart':
          this.button = '计时开始'
          break
        case 'doing':
          this.button = '取消计时'
          this.inputClearable = false
          break
        case 'relax':
          this.button = '取消休息'
          break
        case 'notrelax':
          this.button = '开始休息'
          break
      }
    },
    list (val) {
      this.showList = val
    },
    initialConfig (val) {
      this.workMin = val.focus_mins
      this.relaxMin = val.relax_mins
      this.useNotification = val.use_notification
      this.autoFocus = val.auto_focus
      this.autoRelax = val.auto_relax
      this.longRelaxCount = val.relax_long_count
      this.longRelaxMins = val.relax_long_mins
      this.setTime(true)
      this.setNotification()
    }
  },
  computed: {
    // showList: {
    //   get: () => {
    //     return this._showList
    //   },
    //   set: (val) => {
    //     // console.log(val)
    //     this._showList =  val
    //   }
    // },
    // showList () {
    //   return this.list
    // },
    todayDate () {
      var a = formatWeek()
      return a
    }
  }
}
</script>

<style lang="scss" scoped>
.box{
  width: 100%;
}

.tick_view{
  .tick_header{
    display: flex;
    .header_input{
      font-weight: bold;
      font-size: 19px;
      color: #f3be44;
    }
    .time_bigin_button{
      margin-left: 10px;
    }
  }
  .tick_content{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 140px;
    .tick_time{
      cursor: default;
      font-size: 5rem;
      color: #ff9292;
      position: relative;
    }
    .time_quick_button{
      display: none;
      position: absolute;
      right: -80px;
      top: -12px;
      padding: 5px;
    }
    .time_quick_button_show {
      display: block;
    }
  }
  .tick_count{
    font-size: 14px;
    font-weight: bold
  }
}
</style>
