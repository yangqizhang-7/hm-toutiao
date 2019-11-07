<template>
  <div class='container'>
    <el-card>
      <div slot="header">
        <my-bread>粉丝管理</my-bread>
      </div>
      <!-- tabs的选项卡 -->
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="粉丝列表" name="list">
          <div class="fans_list">
            <div class="fans_item" v-for="item in fansList" :key="item.id.toString()">
              <el-avatar :size="80" :src="item.photo"></el-avatar>
              <p>{{item.name}}</p>
              <el-button type="primary" size="small" plain>+关注</el-button>
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
          ></el-pagination>
        </el-tab-pane>
        <el-tab-pane label="粉丝画像" name="pic">
          <div ref="dom" style="width:600px;height:400px"></div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import echarts from 'echarts'
import circleUrl from '../../assets/avatar.jpg'
export default {
  data () {
    return {
      activeName: 'pic',
      circleUrl,
      fansList: [],
      reqParams: {
        page: 1,
        per_page: 49
      },
      total: 0
    }
  },
  mounted () {
    // echart绘制图标是需要操作dom的
    const dom = this.$refs.dom
    const myEcharts = echarts.init(dom)
    // 准备 配置项和数据
    const option = {
      backgroundColor: '#0ea8a8',
      title: {
        text: '调查表',
        left: 'center',
        top: 20,
        textStyle: {
          color: 'orangered'
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      visualMap: {
        show: false,
        min: 80,
        max: 600,
        inRange: {
          colorLightness: [0, 1]
        }
      },
      series: [
        {
          name: '访问来源',
          type: 'pie',
          radius: '55%',
          center: ['50%', '50%'],
          data: [
            { value: 300, name: '直接访问' },
            { value: 310, name: '邮件营销' },
            { value: 320, name: '联盟广告' },
            { value: 330, name: '视频广告' },
            { value: 340, name: '搜索引擎' },
            { value: 350, name: '他人介绍' },
            { value: 360, name: '工作原因' },
            { value: 370, name: '功能全面' }
          ].sort(function (a, b) { return a.value - b.value }),
          roseType: 'radius',
          label: {
            normal: {
              textStyle: {
                color: 'black'
              }
            }
          },
          labelLine: {
            normal: {
              lineStyle: {
                color: 'orangered'
              },
              smooth: 0.2,
              length: 10,
              length2: 20
            }
          },
          itemStyle: {
            normal: {
              color: '#c23531',
              shadowBlur: 300,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },

          animationType: 'scale',
          animationEasing: 'elasticOut',
          animationDelay: function (idx) {
            return Math.random() * 200
          }
        }
      ]
    }
    // 使用 配置项和数据
    myEcharts.setOption(option)
  },
  created () {
    this.getFansList()
  },
  methods: {
    pager (newPage) {
      this.reqParams.page = newPage
      this.getFansList()
    },
    async getFansList () {
      const {
        data: { data }
      } = await this.$http.get('followers', { params: this.reqParams })
      this.fansList = data.results
      this.total = data.total_count
    }
  }
}
</script>

<style scoped lang='less'>
.fans_item{
  width: 130px;
  height: 190px;
  padding-top: 20px;
  border: 1px dashed #ddd;
  display: inline-block;
  margin-right: 20px;
  margin-bottom: 20px;
  text-align: center;
}
</style>
