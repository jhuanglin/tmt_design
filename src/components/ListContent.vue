<template>
  <div class="list_content box">
    <div class="content_header clearfix">
      <span :class="['head_label', timeTip]" @click="changeTip('time')">时间</span>
      <span :class="['head_label', labelTip]" @click="changeTip('label')">标签</span>
      <i class="el-icon-plus label_right icon" @click="openInsert"></i>
    </div>
    <div class="content_main">
      <div class="search">
        <el-date-picker v-if="type === 'time'" :editable="false" class="date_search" v-model="listDate" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" size="small" @change="listDateSearch" :picker-options="pickerOptions"></el-date-picker>
        <el-select v-else v-model="searchLabel" placeholder="请选择" >
          <el-option v-for="item in labelOptions" :key="item.value" :label="item.label" :value="item.label"></el-option>
        </el-select>
      </div>
      <div class="list_main">
        <div v-if="formatList.length > 0" v-for="(lists, index) in formatList" :key="index">
          <!-- 时间显示 -->
          <div class="list_time clearfix" @mouseenter="listHover(index)" @mouseleave="listHover()">
            <span>{{ lists[0].start_time }}<span v-if="index === 0 && haveTodayList">(今天)</span></span>
            <i :class="[lists[0].disabled ? 'el-icon-arrow-up' : 'el-icon-arrow-down', {list_time_hover: listItemHover == index},'icon', 'icon_right']" @click="showList(index)"></i>
          </div>
          <div :class="[ lists[0].disabled ? 'closed_list' : 'flex_list', 'list_detali', 'clearfix']" v-for="(list, listIndex) in lists" :key="listIndex" @mouseenter="mouseHover('' + index + listIndex)" @mouseleave="mouseHover()">
            <div class="list_title">
              <span class="list_cicle">●</span>
              <span><span style="font-weight: bold;color: #ff9292">{{' [ ' + list.label + ' ] '}}</span>{{ list.title }}</span>
            </div>
            <div :class="[{list_hover: itemHover == ('' + index + listIndex)}, 'list_icon']">
              <el-tooltip class="item" effect="dark" content="删除" placement="top" :open-delay="200">
                <i class="el-icon-close icon" @click="showDelDia(list.list_id)"></i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="完成任务" placement="top" :open-delay="200">
                <i class="el-icon-check icon" @click="showCompleteDia(list, list.list_id)"></i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="添加到右侧计时器" placement="top" :open-delay="200">
                <span class="icon" @click="addToTick(list)">→</span>
              </el-tooltip>
            </div>
          </div>
        </div>
        <p  v-if="formatList.length === 0" class="notice_msg">暂无任务~fighting！</p>
      </div>
    </div>
    <el-dialog title="删除TMT" :visible.sync="dialogVisible" width="30%">
      <span>确定要删除该TMT吗/(ㄒoㄒ)/~~？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="delList">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="添加新的TMT" :close-on-click-modal="false" :visible.sync="insertDiVisible" class="config_dialog">
      <el-form :model="addListInfo" label-width="120px" ref="addListInfo" >
        <el-form-item label="待办事项">
          <el-input style="width: 60%" v-model="addListInfo.title" ></el-input>
        </el-form-item>
        <el-form-item label="预计完成番茄数">
           <el-input-number v-model="addListInfo.tmt_counts" :min="1" :max="100"></el-input-number>
        </el-form-item>
        <el-form-item label="标签">
           <el-select v-model="addListInfo.label" placeholder="请选择">
            <el-option v-for="item in labelOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="预计日期">
          <el-date-picker :editable="false" v-model="addListDate" class="countdate_search" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" size="small" :picker-options="pickerOptions"></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="closeDia">取消</el-button>
        <el-button type="primary" @click="confirmAdd">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="完成TMT" :visible.sync="comDialogVis" width="30%">
      <el-form :model="comList" label-width="120px">
        <el-form-item label="任务名称">
          <el-input :disabled="false" v-model="comList.title"></el-input>
        </el-form-item>
        <el-form-item label="总结">
          <el-input v-model="comList.summary" type="textarea" :rows="2" placeholder="请进行你的总结(●'◡'●)"></el-input>
        </el-form-item>
        <el-form-item label="预计番茄数" class="form_item_inline">
          <span class="notice_msg">{{ comList.tmt_counts }}</span>
        </el-form-item>
        <el-form-item label="实际番茄数" class="form_item_inline">
          <span class="notice_msg">{{ comList.complete_counts }}</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeComDia">取 消</el-button>
        <el-button type="primary" @click="confirmCompleList">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      type: 'time',
      list: [],
      comList: {},
      listDate: '',
      disabled: [],
      addListDate: [],
      // dialogTitle: '',
      dialogVisible: false,
      comDialogVis: false,
      // dialogMsg: '',
      delId: '',
      completeId: '',
      // 插入框显示变量
      insertDiVisible: false,
      // 插入框存储对象
      addListInfo: {
        // 输入框
        title: '',
        // 计数器
        tmt_counts: '',
        // 下拉选择
        label: '',
        // 时间选择
        start_time: '',
        end_time: ''
      },
      // 标签
      labelOptions: [
        {
          value: '1',
          label: '全部'
        }, {
          value: '2',
          label: '学习'
        }, {
          value: '3',
          label: '工作'
        }, {
          value: '4',
          label: '生活'
        }, {
          value: '5',
          label: '读书'
        }, {
          value: '6',
          label: '运动'
        }, {
          value: '7',
          label: '其他'
        }
      ],
      searchLabel: 1,
      itemHover: -1,
      listItemHover: -1,
      haveTodayList: false,
      rightList: {},
      pickerOptions: {
        shortcuts: [{
          text: '今天',
          onClick (picker) {
            const now = new Date()
            picker.$emit('pick', [now, now])
          }
        }]
      }
    }
  },
  created () {
    this.reqLabel()
    this.reqListData()
    this.$eventBus.$on('delCompleteList', () => {
      this.reqListData()
    })
    this.$eventBus.$on('clearShowList', () => {
      this.rightList = {}
    })
  },
  methods: {
    reqLabel () {
      this.$http({
        method: 'post',
        url: '/api/label'
      }).then((res) => {
        if (res.data.status === true) {
          this.labelOptions = res.data.label
          if (this.labelOptions.length !== 0) {
            this.searchLabel = this.labelOptions[0].label
          }
        }
      })
    },
    reqListData () {
      // 不需要发送数据
      this.$http({
        method: 'post',
        url: '/api/list'
      }).then((res) => {
        if (res.data.status === true) {
          this.list = res.data.list
          this.haveTodayList = res.data.have_todaylists
        }
      })
    },
    // 删除清单
    delList () {
      // var list = this.list
      var listId = this.delId
      this.$http({
        method: 'POST',
        url: '/api/list/del',
        data: {
          list_id: listId
        }
      }).then((res) => {
        if (res.data.status === true) {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.dialogVisible = false
          this.reqListData()
          // for (let i = 0, len = list.length; i < len; i++) {
          //   if (listId === list[i].list_id) {
          //     this.list.splice(i, 1)
          //     break
          //   }
          // }
        } else {
          this.$message({
            message: '删除失败，请重试(●' + '◡' + '●)',
            type: 'error'
          })
        }
      })
      // }
    },
    // 将当前清单发送到timetick模块
    addToTick (list) {
      this.rightList = JSON.parse(JSON.stringify(list))
      this.$emit('listen', list)
    },
    confirmAdd () {
      var listInfo = this.addListInfo
      var keys = Object.keys(listInfo)
      for (var i = 0, len = keys.length; i < len; i++) {
        if (listInfo[keys[i]].toString().trim() === '') {
          this.$message({
            message: '请填写全部内容再进行提交',
            type: 'warning'
          })
          return
        }
      }
      this.$http({
        method: 'POST',
        url: '/api/list/add',
        data: listInfo
      }).then((res) => {
        if (res.data.status === true) {
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          //  要手动添加还是请求服务器数据? -> 请求服务器数据
          this.reqListData()
          this.closeDia()
          // this.insertDiVisible = false
          // this.$refs['addListInfo'].resetFields()
        } else {
          this.$message({
            message: '添加失败，请重试',
            type: 'warning'
          })
        }
      })
    },
    // 关闭对话框
    closeDia () {
      let keys = Object.keys(this.addListInfo)
      keys.forEach((item, index) => {
        if (this.addListInfo[item]) {
          this.addListInfo[item] = ''
        }
      })
      this.addListDate = []
      this.insertDiVisible = false
    },
    // 日期搜索
    /**
     * /api/list/search_date 清单日期搜索
     * @POST {start_time||end_time} Object 查询开始时间|结束时间
     * @GET {list} Object 返回来的清单数据
     */
    listDateSearch (val) {
      if (val) {
        this.$http({
          method: 'post',
          url: '/api/list/search_date',
          data: {
            start_time: this.listDate[0],
            end_time: this.listDate[1]
          }
        }).then((res) => {
          if (res.data.status === true) {
            this.list = res.data.list
          }
        })
      } else {
        this.reqListData()
      }
    },
    // 展示删除提示框
    showDelDia (delId) {
      var rList = this.rightList
      if (rList.list_id && rList.list_id === delId) {
        this.$alert('请先将该任务从右侧移除再进行操作', '提示', {
          confirmButtonText: '确定'
        })
        return
      }
      this.delId = delId
      this.dialogVisible = true
    },
    showCompleteDia (list, comId) {
      var rList = this.rightList
      if (rList.list_id && rList.list_id === comId) {
        this.$alert('请先将该任务从右侧移除再进行操作', '提示', {
          confirmButtonText: '确定'
        })
        return
      }
      this.completeId = comId
      this.comList = Object.assign({}, list)
      this.comDialogVis = true
    },
    // 是否显示list详情
    showList (index) {
      let boo = this.formatList[index][0].disabled
      this.$set(this.formatList[index][0], 'disabled', !boo)
    },
    // 改变标签类别
    changeTip (type) {
      this.type = type
    },
    // 改变插入框显示变量
    openInsert () {
      this.insertDiVisible = true
    },
    // 任务列表的icon显示
    mouseHover (index = -1) {
      this.itemHover = index
    },
    // 时间显示的icon显示
    listHover (index = -1) {
      this.listItemHover = index
    },
    closeComDia () {
      this.comList = {}
      this.comDialogVis = false
    },
    confirmCompleList () {
      var list = this.comList
      this.$http({
        method: 'POST',
        url: '/api/list/complete',
        data: list
      }).then((res) => {
        if (res.data.status === true) {
          this.$message({
            message: '完成任务~fighting！',
            type: 'success'
          })
          this.reqListData()
          this.addToTick({})
          this.closeComDia()
          this.$eventBus.$emit('reloadCountData')
        } else {
          this.$message({
            message: '服务器发生错误~请重试',
            type: 'warning'
          })
        }
      })
    }
  },
  computed: {
    timeTip () {
      if (this.type === 'time') {
        return 'label_bottom'
      } else {
        return ''
      }
    },
    labelTip () {
      if (this.type === 'label') {
        return 'label_bottom'
      } else {
        return ''
      }
    },
    formatList () {
      if (this.type === 'label') {
        return this.labelList
      } else {
        return this.timeList
      }
    },
    // 当选择时间的时候的显示的清单数据结构
    timeList () {
      var listArr = []
      var objArr = []
      var list = this.list
      var len = list.length
      if (len === 1) {
        this.$set(list[0], 'disabled', false)
        objArr.push(list[0])
        listArr.push(objArr)
      }
      for (var i = 0; i < len - 1; i++) {
        if (objArr.length === 0) {
          this.$set(list[i], 'disabled', false)
        }
        objArr.push(list[i])
        if (list[i].start_time !== list[i + 1].start_time) {
          listArr.push(objArr)
          objArr = []
        }
        if (i === len - 2) {
          objArr.push(list[i + 1])
          listArr.push(objArr)
        }
      }
      return listArr
    },
    labelList () {
      if (this.type === 'label') {
        var list = JSON.parse(JSON.stringify(this.timeList))
        var searchLabel = this.searchLabel
        if (searchLabel === '全部') {
          return list
        }
        var l = list.map((item, index) => {
          return item.filter((it, ind) => {
            return it.label === searchLabel
          })
        })
        l = l.filter((item) => {
          return item.length > 0
        })
        return l
      }
    }
  },
  watch: {
    addListDate (dateValue) {
      if (dateValue.length === 2) {
        this.addListInfo.start_time = dateValue[0]
        this.addListInfo.end_time = dateValue[1]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.box{
  width: 100%;
}

.list_content {
  padding: 30px;

  .content_header {
    padding: 10px 0;
    .head_label{
      padding: 3px 5px;
      cursor: pointer;
      &:first-child{
        margin-right: 10px;
      }
    }

    .label_bottom{
      padding-bottom: 3px;
      border-bottom: 3px solid #ff9292;
    }
    .label_right {
      float: right;
    }
  }

  .search{
    margin: 10px 0;
    .date_search{
      width: 100%;
    }
  }

  .icon_right{
    display: none;
    float:right;
  }

  .notice_msg{
    font-weight: bold;
    margin: 10px;
    color: #8ecfff;
}

  .list_time{
    font-weight: bold;
    padding: 5px;

    .list_time_hover{
      display: block;
    }
  }
  .closed_list{
    display: none;
  }
  .flex_list{
    display: flex;
  }
  .list_detali{
    padding: 6px 10px;
    justify-content: space-between;

    .list_title{
      flex-grow: 1;
      line-height: 24px;
    }
    .list_icon{
      display: none;
      min-width: 42px;
    }
    .list_hover{
     display: block;
    }
    .list_cicle{
      color: #ccc;
      margin-right: 5px;
    }
    .el-icon-close{
      margin-right: 5px;
    }
  }
  .form_item_inline{
    display: inline-block;
  }
}

</style>
