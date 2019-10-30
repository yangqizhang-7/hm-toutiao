<template>
<div class="container-article">
    <!-- 筛选条件布局 -->
    <el-card>
    <!--面包屑-->
      <div slot="header">
        <my-bread>内容管理</my-bread>
      </div>
    <!--筛选条件-->
    <el-form label-width="110px" size="small">
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
        <el-form-item label="频道：">
            <el-select v-model="reqParams.channel_id" placeholder="请选择">
                <el-option
                v-for="item in channelOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                ></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="日期：">
            <el-date-picker
                v-model="dateArr"
                type="datetimerange"
                range-separator="到"
                start-placeholder="起始时间"
                end-placeholder="结束时间"
            ></el-date-picker>
        </el-form-item>
        <el-form-item >
          <el-button type="primary">筛选</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 筛选结果布局 -->
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 由axios进行数据提交，字段的值null,axios是不会提交该字段
      reqParams: {
        status: null,
        channel_id: null
      },
      // 下拉列表的选项
      channelOptions: [
        { value: 1, label: 'JAVA' },
        { value: 2, label: 'JAVASCRIPT' },
        { value: 3, label: 'PHP' }
      ],
      // 日期筛选
      dateArr: []
    }
  }
}
</script>

<style scoped lang='less'></style>
