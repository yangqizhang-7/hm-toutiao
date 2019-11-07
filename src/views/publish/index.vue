<template>
  <div class="container-publish">
    <el-card>
       <div slot="header">
        <my-bread>{{$route.query.id?'修改':'发布'}}文章</my-bread>
      </div>
      <!-- 表单 -->
      <el-form label-width="110px">
        <!-- 标题 -->
        <el-form-item label="标题：">
          <el-input v-model="articleForm.title" style="width:400px"></el-input>
        </el-form-item>
        <!-- 富文本组件 -->
        <el-form-item label="内容：">
            <quill-editor v-model="articleForm.content" :options="editorOption"></quill-editor>
        </el-form-item>
        <!-- 封面选择 -->
        <el-form-item label="封面：">
          <!--单选框组件-->
          <el-radio-group v-model="articleForm.cover.type" @change="articleForm.cover.images=[]">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
          <!-- 对话框组件 -->
          <div v-if="articleForm.cover.type===1">
            <my-image v-model="articleForm.cover.images[0]"></my-image>
          </div>
          <div v-if="articleForm.cover.type===3">
            <my-image v-for="i in 3" :key="i" v-model="articleForm.cover.images[i-1]"></my-image>
          </div>
        </el-form-item>
        <!-- 频道组件 -->
        <el-form-item label="频道：">
          <my-channel v-model="articleForm.channel_id"></my-channel>
        </el-form-item>
        <!-- 保存按钮 -->
         <el-form-item v-if="$route.query.id">
          <el-button type="primary" @click="update(false)">修改</el-button>
          <el-button @click="update(true)">存入草稿</el-button>
        </el-form-item>
        <el-form-item v-else>
          <el-button type="primary" @click="create(false)">发表</el-button>
          <el-button @click="create(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
// 挂载富文本编辑器组件
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'

export default {
  components: {
    quillEditor
  },
  created () {
    // 根据地址栏是否有ID来判断
    const articleId = this.$route.query.id
    if (articleId) {
      // 填充表单内容
      this.getArticle(articleId)
    }
  },
  watch: {
    // value ===> 值改变后触发的函数 (newVal,oldVal) 新值  旧值
    '$route.query.id': function (newVal, oldVal) {
      debugger
      if (newVal) {
        // 修改 填充表单
        this.getArticle(newVal)
      } else {
        // 新建 重置表单
        this.articleForm = {
          title: null,
          content: null,
          channel_id: null,
          cover: {
            type: 1,
            images: []
          }
        }
      }
    }
  },
  data () {
    return {
      // 传递的数据 articleForm
      articleForm: {
        title: null,
        content: null,
        cover: {
          // 单选框组件默认选择单图
          type: 1,
          images: []
        },
        channel_id: null
      },
      // 配置富文本对象
      editorOption: {
        placeholder: '请输入文字',
        modules: {
          toolbar: [
            // 加粗 斜体 下划线 删除线
            ['bold', 'italic', 'underline', 'strike'],
            // 引用 代码块
            ['blockquote', 'code-block'],
            // 一号 二号
            [{ 'header': 1 }, { 'header': 2 }],
            // 有序列表 无序列表
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            // 向前缩进一格  向后缩进一格
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            // 图片
            ['image'], ['video']
          ]
        }
      }
    }
  },
  methods: {
    // 新建
    async create (draft) {
      await this.$http.post(`articles?draft=${draft}`, this.articleForm)
      // 成功
      this.$message.success(draft ? '存入草稿成功' : '发表成功')
      this.$router.push('/article')
    },
    // 修改
    async update (draft) {
      await this.$http.put(`articles/${this.articleForm.id}?draft=${draft}`, this.articleForm)
      // 成功
      this.$message.success(draft ? '存入草稿成功' : '修改成功')
      this.$router.push('/article')
    },
    async getArticle (id) {
      const { data: { data } } = await this.$http.get(`articles/${id}`)
      this.articleForm = data
      console.log(data)
      this.channel_id = data.channel_id
    }
  }
}
</script>

<style scoped lang='less'>
/* 调整三图状态的样式 */
.my-image{
  display: inline-block;
  margin-right: 20px;
}
</style>
