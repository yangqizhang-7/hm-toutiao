<template>
  <div class="my-image">
    <!-- 按钮 -->
    <div class="btn_box" @click="open">
      <img :src="value||defaultImage" alt />
    </div>
    <!-- 对话框 -->
    <el-dialog :visible.sync="dialogVisible" width="750px">
      <el-tabs v-model="activeName" type="card">
        <!-- 选项卡 -->
        <el-tab-pane label="素材库" name="image">
          <!-- 按钮 -->
          <el-radio-group @change="toggleList" v-model="reqParams.collect" size="small">
            <el-radio-button :label="false">全部</el-radio-button>
            <el-radio-button :label="true">收藏</el-radio-button>
          </el-radio-group>
          <!-- 列表 -->
          <div class="img_list">
          <!-- 如果当前地址和点击的图片的地址匹配 添加selected类名 -->
            <div
              :class="{selected:selectedImageUrl===item.url}"
              class="img_item"
              @click="selectedImage(item.url)"
              v-for="item in images"
              :key="item.id"
            >
              <img :src="item.url" />
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
            v-show="total>8"
          ></el-pagination>
        </el-tab-pane>
        <!-- 上传图片选项 -->
        <el-tab-pane label="上传图片" name="upload">
          <!-- 上传组件 -->
          <el-upload
            class="avatar-uploader"
            action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
            :headers="headers"
            name="image"
            :on-success="handleSuccess"
            :show-file-list="false"
          >
            <img v-if="uploadImageUrl" :src="uploadImageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="determineImage">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import local from '@/utils/local'
import defaultImage from '../assets/default.png'
export default {
  name: 'my-image',
  props: ['value'],
  data () {
    return {
      // 控制对话框显示与隐藏
      dialogVisible: false,
      // 当前激活选项卡的name的值  选择素材库 上传是upload
      activeName: 'image',
      // 提交的筛选参数
      reqParams: {
        collect: false,
        page: 1,
        per_page: 8
      },
      images: [],
      total: 0,
      // 当前选中的图片地址
      selectedImageUrl: null,
      // 设置请求头
      headers: {
        Authorization: `Bearer ${local.getUser().token}`
      },
      // 当前上传的图片地址
      uploadImageUrl: null,
      // 按钮的默认图片
      defaultImage
    }
  },
  methods: {
    // 确认图片选中
    determineImage () {
      if (this.activeName === 'image') {
        // 素材库
        if (!this.selectedImageUrl) {
          return this.$message.warning('请选中一张图片')
        }
        // 给img的src赋值图片地址 预览 关闭对话框
        // this.defaultImage = this.selectedImageUrl
        this.$emit('input', this.selectedImageUrl)
        this.dialogVisible = false
      } else {
        // 上传图片
        if (!this.uploadImageUrl) {
          return this.$message.warning('请上传一张图片')
        }
        // 给img的src赋值图片地址预览 关闭对话框
        // this.defaultImage = this.uploadImageUrl
        this.$emit('input', this.uploadImageUrl)
        this.dialogVisible = false
      }
    },
    // 上传成功
    handleSuccess (res) {
      // 预览
      this.uploadImageUrl = res.data.url
      // 提示
      this.$message.success('上传成功')
    },
    // 选中图片
    selectedImage (url) {
      this.selectedImageUrl = url
      // 选中的图片的路径是不同的 可以区分
      console.log(this.selectedImageUrl)
    },
    // 切换 全部与收藏 列表
    toggleList () {
      this.reqParams.page = 1
      this.getImages()
    },
    // 分页
    pager (newPage) {
      // 传入一个新的分页数字 newPage
      this.reqParams.page = newPage
      this.getImages()
    },
    // 打开对话框
    open () {
      this.dialogVisible = true
      this.getImages()
    },
    // 获取素材列表
    async getImages () {
      // 获取数据
      const { data: { data } } = await this.$http.get('user/images', { params: this.reqParams })
      console.log(data)
      // 赋值给images
      this.images = data.results
      // 总条数赋值
      this.total = data.total_count
    }
  }
}
</script>

<style scoped lang='less'>
.btn_box {
  width: 150px;
  height: 150px;
  border: 1px dashed #0ea8a8;
  img {
    width: 100%;
    height: 100%;
    display: block;
  }
}
.dialog-footer {
  width: 100%;
  text-align: center;
  display: inline-block;
}
.img_list {
  margin-top: 20px;
  .img_item {
    width: 150px;
    height: 120px;
    border: 1px dashed #0ea8a8;
    position: relative;
    display: inline-block;
    margin-right: 20px;
    margin-bottom: 20px;
    img {
      width: 100%;
      height: 100%;
    }
    &.selected::after {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.3) url(../assets/selected.png) no-repeat
        center / 50px 50px;
    }
  }
}
</style>
