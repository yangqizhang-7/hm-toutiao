<template>
  <div class="container-setting">
    <el-card>
      <!-- 面包屑 -->
      <div slot="header">
        <my-bread>个人设置</my-bread>
      </div>
      <!-- 栅格系统 -->
      <el-row>
        <!-- 左侧信息 -->
        <el-col :span="12">
          <el-form :model="userForm" label-width="120px">
            <el-form-item label="编号：">{{userForm.id}}</el-form-item>
            <el-form-item label="手机：">{{userForm.mobile}}</el-form-item>
            <el-form-item label="媒体名称：">
              <el-input v-model="userForm.name"></el-input>
            </el-form-item>
            <el-form-item label="媒体介绍：">
              <el-input v-model="userForm.intro" type="textarea" :rows="3"></el-input>
            </el-form-item>
            <el-form-item label="邮箱：">
              <el-input v-model="userForm.email"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="updateUserInfo">保存设置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <!-- 右侧图片 -->
        <el-col :span="12">
          <el-upload
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :http-request="updatePhoto"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <p style="text-align:center">修改头像</p>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import EventBus from '@/eventbus'
import local from '@/utils/local'
export default {
  data () {
    return {
      userForm: {
        id: null,
        mobile: null,
        name: null,
        intro: null,
        email: null
      },
      imageUrl: null
    }
  },
  created () {
    this.getUserInfo()
  },
  methods: {
    // 获取用户信息
    async getUserInfo () {
      const { data: { data } } = await this.$http.get('user/profile')
      this.userForm = data
      this.imageUrl = data.photo
    },
    // 修改用户信息
    async updateUserInfo () {
      const { name, intro, email } = this.userForm
      await this.$http.patch('user/profile', { name, intro, email })
      // 提示
      this.$message.success('保存设置成功')
      // 更新 本地存储  用户名称
      const user = local.getUser()
      user.name = name
      local.setUser(user)
      // 更新 HOME组件  用户名称
      EventBus.$emit('updateName', name)
    },
    // 修改头像（上传图片）
    async updatePhoto (result) {
      // console.log(result)
      // 选择文件后触发当前函数，默认传入一个选择后的结果（包含文件信息）
      // 1. 获取图片文件数据
      const file = result.file
      // 2. 创建一个formData
      const formData = new FormData()
      // 3. 追加图片数据到fromData  字段名字和后台一致
      formData.append('photo', file)
      console.log(formData.photo)
      // 4. 使用axios提交数据
      const { data: { data } } = await this.$http.patch('user/photo', formData)
      // 5. 拿着上传成功后的地址进行预览
      this.imageUrl = data.photo
      // 6. 提示
      this.$message.success('修改头像成功')
      // 7. 更新home组件的photo
      EventBus.$emit('updatePhoto', data.photo)
      // 8. 更新本地存储的photo
      const user = local.getUser()
      user.photo = data.photo
      local.setUser(user)
    }
  }
}
</script>
