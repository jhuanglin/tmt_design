<template>
  <div class="list_container" @mouseenter="shownIcon" @mouseleave="hideIcon">
    <p class="list_header">
      [{{listData.label}}] {{ listData.title }}
    </p>
    <div class="list_content">
      <p>预计完成时间：<span class="content_value">{{ listData.start_time }} - {{ listData.end_time }}</span></p>
      <p>实际完成时间：<span class="content_value">{{ listData.start_time }} - {{ listData.end_time }}</span></p>
      <p>
        <span style="margin-right: 60px">预计番茄数：<span class="content_value">{{ listData.tmt_counts }}</span></span>
        <span>所花番茄数：<span class="content_value">{{ listData.tmt_counts }}</span></span>
      </p>
      <p>
        <!-- <span>完成状态：<span :class="'content_status', 'status_' + listData.status">{{ statuOptions[listData.status] }}</span></span> -->
        <span>完成状态：<span class="content_value status_">{{ listData.status }}</span></span>
      </p>
      <p v-if="listData.summary !== ''" class="list_summary">总结: <span class="content_value">{{ listData.summary }}</span></p>
    </div>
    <div :class="[showIcon ? '' : 'list_icon']">
      <i class="el-icon-close icon" @click="openDelDia"></i>
      <i class="el-icon-edit icon" @click="openEditDia"></i>
    </div>
    <el-dialog title="删除该任务" :visible.sync="closeDiaVis" width="30%">
      <p>确定要删除该任务吗/(ㄒoㄒ)/~~？</p>
      <p>删除之后该任务不会真正被删除，而是回到左侧未完成任务列表中</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDiaVis = false">取 消</el-button>
        <el-button type="primary" @click="delList">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改任务" :visible.sync="editDiaVis">
      <el-form :model="editList" label-width="100px">
          <el-form-item label="番茄名称">
            <el-input v-model="editList.title" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="总结">
            <el-input v-model="editList.summary" type="textarea" :rows="2" placeholder="请进行你的总结(●'◡'●)"></el-input>
          </el-form-item>
          <el-form-item label="完成时间">
            <p>{{ editList.start_time }} - {{ editList.end_time }}</p>
          </el-form-item>
      </el-form>
      <span slot="footer">
          <el-button type="primary" @click="confirmAdd">修改</el-button>
          <el-button @click="closeDia">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: ['listData'],
  data () {
    return {
      closeDiaVis: false,
      editDiaVis: false,
      editList: {},
      showIcon: false,
      statuOptions: ['尚需努力~fighting!', '一切都在计划中~(●' + '◡' + '●)', '超前完成!棒!!']
    }
  },
  methods: {
    openDelDia () {
      this.closeDiaVis = true
    },
    openEditDia () {
      this.editDiaVis = true
      this.editList = Object.assign({}, this.listData)
    },
    delList () {
      let listId = this.listData.list_id
      this.$http({
        method: 'POST',
        url: '/api/list/delcompleteist',
        data: {
          'list_id': listId
        }
      }).then((res) => {
        if (res.data.status === true) {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.$emit('reloadList')
          this.closeDiaVis = false
        } else {
          this.$message({
            message: '删除失败，请重试(●' + '◡' + '●)',
            type: 'error'
          })
        }
      })
    },
    closeDia () {
      this.editList = {}
      this.editDiaVis = false
    },
    confirmAdd () {
      var list = this.editList
      if (list.summary.trim() === '') {
        this.$message({
          message: '请填写你的总结(●' + '◡' + '●)',
          type: 'warning'
        })
      } else {
        this.$http({
          method: 'POST',
          url: '/api/list/changecompletelist',
          data: list
        }).then((res) => {
          if (res.data.status === true) {
            this.$message({
              message: '编辑成功拉',
              type: 'success'
            })
            this.closeDia()
            this.$emit('reloadList')
          } else {
            this.$message({
              message: '编辑失败，请重试一下',
              type: 'warning'
            })
          }
        })
      }
    },
    shownIcon () {
      this.showIcon = true
    },
    hideIcon () {
      this.showIcon = false
    }
  }
}
</script>

<style lang="scss" scoped>
.list_container{
  display: flex;
  justify-content: flex-start;
  align-items: baseline;
  padding: 10px;
  .list_header{
    color: #000;
    width: 20%;
    max-width: 200px;
    font-weight: bold;
  }
  .content_value{
    font-weight: bold;
    color: #000;
  }
  .list_content{
    flex-grow: 1;
    padding: 10px;
    line-height: 28px;
    margin-left: 10px;
    border-left: 1px solid #ccc;
    color: #9c9a9a;
  }
  .list_icon{
    display: none;
  }
  .content_status{
    font-weight: bold;
  }
  .status_2{
    color:#75d250;
  }
  .status_1{
    color: #ECAD9E;
  }
  .status_0{
    color: #19CAAD;
  }
}
</style>
