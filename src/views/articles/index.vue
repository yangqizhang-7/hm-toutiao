<template>
<div class="container-article">
    <!-- 筛选条件布局 -->
    <el-card>
    <!--面包屑-->
      <div slot="header">
        <my-bread>内容管理</my-bread>
      </div>
    <!--筛选条件-->
    <el-form label-width="100px" size="small">
        <el-form-item label="状态：">
            <el-radio-group v-model="reqParams.status">
                <el-radio :label="null">全部</el-radio>
                <el-radio :label="0">草稿</el-radio>
                <el-radio :label="1">待审核</el-radio>
                <el-radio :label="2">审核通过</el-radio>
                <el-radio :label="3">审核失败</el-radio>
                <el-radio :label="4">已删除</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道：" clearable>
            <my-channel v-model="reqParams.channel_id"></my-channel>
        </el-form-item>
        <el-form-item label="日期：">
            <el-date-picker
                v-model="dateArr"
                type="daterange"
                range-separator="到"
                start-placeholder="起始时间"
                end-placeholder="结束时间"
                @change="changeDate"
                value-format="yyyy-MM-dd"
            ></el-date-picker>
        </el-form-item>
        <el-form-item >
          <el-button type="primary" @click ='search'>筛选</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 筛选结果布局 -->
    <el-card style='margin-top:20px'>
      <div slot='header'>
        <span style="font-weight:bold">
          根据筛选条件共查询到 {{total}} 条结果：
        </span>
      </div>
       <!-- 表格 -->
      <el-table :data="articles">
        <el-table-column label="封面" >
          <template slot-scope ="scope">
            <el-image :src="scope.row.cover.images[0]" style='width:100px;height:100px'>
              <div slot = 'error'>
                <img src ='../../assets/error.gif' width='100px' height = '75px'>
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="标题" prop = 'title'></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status===0" type="info" effect="dark">草稿</el-tag>
            <el-tag v-if="scope.row.status===1" effect="dark">待审核</el-tag>
            <el-tag v-if="scope.row.status===2" type="success" effect="dark">审核通过</el-tag>
            <el-tag v-if="scope.row.status===3" type="warning" effect="dark">审核失败</el-tag>
            <el-tag v-if="scope.row.status===4" type="danger" effect="dark">已删除</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="发布时间" prop = 'pubdate'></el-table-column>
        <el-table-column label="操作">
          <template slot-scope ="scope">
            <el-button @click ="toEdit(scope.row.id)" type="primary" icon="el-icon-edit" circle></el-button>
            <el-button @click ="delArticle(scope.row.id)" type="danger" icon="el-icon-delete" circle disabled="true"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        style="margin-top:20px;text-align:center"
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="reqParams.per_page"
        :current-page="reqParams.page"
        @current-change="pager"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      props: ['value'],
      // 由axios进行数据提交，字段的值null,axios是不会提交该字段
      reqParams: {
        status: null,
        channel_id: null,
        // 显示第一页
        page: 1,
        // 每页显示个数
        per_page: 10
      },
      total: 0,
      // 下拉列表的选项
      channelOptions: [],
      // 日期筛选
      dateArr: [],
      articles: []
    }
  },
  created () {
    this.getArticles()
  },
  methods: {
    // 列表渲染
    async getArticles () {
      const { data: { data } } = await this.$http.get('articles', { params: this.reqParams })
      console.log(data)
      this.articles = data.results
      // 总条数
      this.total = data.total_count
    },
    // 分页函数
    pager (newPage) {
      // 修改当前的页码为新的页码
      this.reqParams.page = newPage
      // 重新获取数据
      this.getArticles()
    },
    search () {
      if (this.reqParams.channel_id === '') this.reqParams.channel_id = null
      // 页码换为1
      this.reqParams.page = 1
      this.getArticles()
    },
    changeDate (dateArr) {
      if (dateArr) {
        this.reqParams.begin_pubdate = dateArr[0]
        this.reqParams.end_pubdate = dateArr[1]
      } else {
        this.reqParams.begin_pubdate = null
        this.reqParams.end_pubdate = null
      }
    },
    // 编辑按钮
    toEdit (id) {
      this.$router.push({ path: '/publish', query: { id } })
    },
    // 删除按钮
    delArticle (id) {
      // 显示确认框
      this.$confirm('是否永久删除此文章', '提示：', {
        confirmButtonText: '当然',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(async () => {
        // 点击了确认
        // 1. 发请求传id
        await this.$http.delete(`articles/${id}`)
        // 2. 提示删除成功
        this.$notify({
          title: '成功删除',
          message: '您已成功删除该文章',
          type: 'success',
          duration: 2000
        })
        // 3. 更新列表
        this.getArticles()
      }).catch(() => {
        // 点击了取消
        // 不需要任何操作
        this.$notify({
          title: '取消删除',
          message: '您已取消删除该文章',
          type: 'info',
          duration: 2000
        })
      })
    }
  }
}
</script>

<style scoped lang='less'></style>
