<template>
  <div class="promo_contanier">
    <p class="promo_header">
        {{ promoData.date }}
        <br>
        共完成{{ promoData.promoList.length }}个番茄
    </p>
    <!-- @mouseenter="mouseHover(index)"  -->
    <!-- @mouseleave="mouseHover()"  -->
    <div class="promo_lists">
      <div class="promo_list" @mouseenter="mouseHover(index)" @mouseleave="mouseHover()" v-for="(list, index) in promoData.promoList" :key="index" >
          <div class="list_date">{{ list.start_date }} - {{ list.end_date }}</div>
          <div class="list_contanier">
            <div class="list_content">
              <p>{{ list.title }}</p>
              <!-- <p v-if="list.summary !== ''" class="list_summary">总结:{{ list.summary }}</p> -->
            </div>
            <i :class="[{show_icon: listHover == index}, 'el-icon-close']" @click="delList(list)"></i>
            <!-- <i :class="[{show_icon: listHover == index}, 'el-icon-edit-outline']" @click="openEdit(list)"></i> -->
          </div>
      </div>
    </div>
    <!-- <el-dialog title="添加TMT配置" :visible.sync="editTrigger">
        <el-form :model="editList" label-width="100px">
            <el-form-item label="番茄名称">
                <el-input v-model="editList.title" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="总结">
                <el-input v-model="editList.summary" type="textarea" :rows="2" placeholder="请进行你的总结(●'◡'●)"></el-input>
            </el-form-item>
            <el-form-item label="完成时间">
                <p>{{ editList.start_date }} - {{ editList.end_date }}</p>
            </el-form-item>
        </el-form>
        <span slot="footer">
            <el-button type="primary" @click="confirmAdd">修改</el-button>
            <el-button type="danger" @click="delList">删除</el-button>
            <el-button @click="closeDia">取消</el-button>
        </span>
    </el-dialog> -->
  </div>
</template>

<script>
export default {
  props: ['promoData'],
  data () {
    return {
      editTrigger: false,
      editList: {},
      listHover: -1
    }
  },
  methods: {
    // 打开编辑框
    openEdit (list) {
      this.editList = Object.assign({}, list)
      this.editTrigger = true
    },
    // 确认添加
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
          url: '/api/promo/add',
          data: list
        }).then((res) => {
          if (res.data.status === true) {
            this.$message({
              message: '编辑成功拉',
              type: 'success'
            })
            this.editTrigger = false
            this.$emit('reloadPro')
          } else {
            this.$message({
              message: '编辑失败，请重试一下',
              type: 'warning'
            })
          }
        })
      }
    },
    delList (list) {
      var listId = list.list_id
      var startDate = list.start_date
      var endDate = list.end_date
      var day = this.promoData.date
      var promoId = list.id
      this.$confirm('此操作将永久删除该任务清空', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          method: 'POST',
          url: '/api/promo/del',
          data: {
            list_id: listId,
            start_date: startDate,
            end_date: endDate,
            day: day,
            id: promoId
          }
        }).then((res) => {
          if (res.data.status === true) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            // this.editTrigger = false
            this.$emit('reloadPro')
          } else {
            this.$message({
              message: '删除失败，请重试',
              type: 'danger'
            })
          }
        })
      })
    },
    closeDia () {
      this.editList = {}
      this.editTrigger = false
    },
    mouseHover (index = -1) {
      this.listHover = index
    }
  }
  // ,
  // computed: {
  //   promoList: function () {
  //      return this.promoData.promoList
  //   }
  // }
}
</script>

<style lang="scss" scoped>
    .promo_contanier{
      padding: 5px 10px;
      display: flex;
      justify-content: flex-start;
      align-items: baseline;
      .promo_header{
        max-width: 200px;
        width: 20%;
        color: #000;
        font-weight: bold;
        margin: 10px 0;
      }
      .promo_lists{
        flex-grow: 1;
      }
      .promo_list{
        display: flex;
        justify-content: space-between;
        padding: 5px;
        cursor: pointer;
        .list_date{
            color: #c4c4c4;
        }
        .list_contanier{
          flex-grow: 1;
          display: flex;
          justify-content: flex-start;
        }
        .list_content{
          flex-grow: 1;
          padding-left: 10px;
          & p{
            padding-bottom: 10px;
          }
          .list_summary{
            color: #9c9a9a;
          }
        }
        &:hover .list_content p:first-child{
        }
        i{
          cursor: pointer;
          display: none;
          margin-right: 30px;
        }
        .show_icon{
          display: inline-block;
        }
      }
    }
</style>
