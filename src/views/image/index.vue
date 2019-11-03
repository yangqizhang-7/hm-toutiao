<template>
  <div class="container">
    <el-card>
      <div slot="header">
        <my-bread>素材管理</my-bread>
      </div>
      <!-- 按钮区域 -->
      <div class="btn_box">
        <!-- 全部与收藏 -->
        <!-- label 指定选中当前单选框的值 -->
        <el-radio-group @change="toggleList" v-model="reqParams.collect" size="small">
          <el-radio-button :label="false">全部</el-radio-button>
          <el-radio-button :label="true">收藏</el-radio-button>
        </el-radio-group>
        <el-button style="float:right" type="success" size="small" @click="open">添加素材</el-button>
      </div>
      <!-- 素材区域 -->
      <div class="img_list">
        <div class="img_item" v-for="item in images" :key="item.id">
          <img :src="item.url" />
          <div class="footer" v-show="!reqParams.collect">
            <!--添加收藏-->
            <span
            class="el-icon-star-off"
            :class="{red:item.is_collected}"
            @click="toggleStatus(item)"
            ></span>
            <!--删除-->
            <span
            class="el-icon-delete"
            @click="deleteImage(item.id)"
            ></span>
          </div>
        </div>
      </div>
      <!-- 分页 -->
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="reqParams.per_page"
        :current-page="reqParams.page"
        @current-change="pager"
        v-show="total>10"
      ></el-pagination>
    </el-card>
    <!-- 对话框 -->
    <el-dialog title="上传素材" :visible.sync="dialogVisible" width="300px">
       <el-upload
        class="avatar-uploader"
        action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
        :headers="headers"
        name="image"
        :on-success="handleSuccess"
        :show-file-list="false"
      >
        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import local from '@/utils/local'
export default {
  data () {
    return {
      // 上传图片设置请求头
      headers: {
        Authorization: `Bearer ${local.getUser().token}`
      },
      // 上传后图片地址
      imageUrl: null,
      // 控制对话框显示隐藏
      dialogVisible: false,
      // 提交的筛选参数
      reqParams: {
        // 刷新界面是否在收藏 false在全部 true在收藏
        collect: false,
        page: 1,
        per_page: 10
      },
      images: [],
      // 总条数
      total: 0
    }
  },
  created () {
    this.getImages()
  },
  methods: {
    // 点击按钮上传素材
    open () {
      // 打开对话框
      this.dialogVisible = true
      // 清空预览效果 把图片地址清空
      this.imageUrl = null
    },
    async getImages () {
      // 获取数据
      const { data: { data } } = await this.$http.get('user/images', { params: this.reqParams })
      // 给images数组赋值
      this.images = data.results
      // 分页
      this.total = data.total_count
    },
    pager (newPage) {
      // 切换分页 更新页码 刷新数据
      this.reqParams.page = newPage
      this.getImages()
    },
    // 切换收藏
    toggleList () {
      // 切换页码为1 刷新数据
      this.reqParams.page = 1
      this.getImages()
    },
    // 添加收藏 取消收藏
    async toggleStatus (item) {
      // debugger
      const { data: { data } } = await this.$http.put(`user/images/${item.id}`, {
        // 把当前的collect状态取反赋值
        collect: !item.is_collected
      })
      // 更改当前图片的状态
      item.is_collected = data.collect
      // 提示已更改
      this.$message.success(data.collect ? '您已成功收藏' : '您已取消收藏')
    },
    // 删除
    deleteImage (id) {
      // 显示确认框
      this.$confirm('是否永久删除此图', '提示：', {
        confirmButtonText: '当然',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(async () => {
        // 点击了确认
        // 1. 发请求传id
        await this.$http.delete(`user/images/${id}`)
        // 2. 提示
        this.$notify({
          title: '成功删除',
          message: '您已成功删除该图片',
          type: 'success',
          duration: 2000
        })
        // 3. 更新列表
        this.getImages()
      }).catch(() => {
        // 点击了取消
        // 不需要任何操作
        this.$notify({
          title: '取消删除',
          message: '您已取消删除该图片',
          type: 'info',
          duration: 2000
        })
      })
    },
    // 上传图片成功
    handleSuccess (res) {
      // res.data.url 就是图片地址
      // console.log(res)
      // 把原本的路径用新的路径替换 预览
      debugger
      this.imageUrl = res.data.url
      // 提示上传成功
      this.$message.success('上传成功')
      window.setTimeout(() => {
        // 关闭对话框
        this.dialogVisible = false
        // 更新素材
        this.getImages()
        // 设置定时器时间为2秒
      }, 2000)
    }
  }
}
</script>

<style scoped lang='less'>
.img_list {
  margin-top: 20px;
  .img_item {
    width: 160px;
    height: 160px;
    border: 1px dashed #0ea8a8;
    position: relative;
    display: inline-block;
    margin-right: 50px;
    margin-bottom: 20px;
    img{
      width:100%;
      height:100%
    }
    .footer {
      width: 100%;
      height: 30px;
      line-height: 30px;
      background: rgba(0, 0, 0, 0.3);
      color: #fff;
      position: absolute;
      left: 0;
      bottom: 0;
      text-align: center;
      /*span .red{}       选择器无效
      span.red{}          选择器有效  &连接符*/
      span {
        margin: 0 20px;
        &.red {
          color: red;
        }
      }
    }
  }
}
</style>
