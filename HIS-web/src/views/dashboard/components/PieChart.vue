<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'
import {staffClassifyStatistics} from '@/api/charts'
export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    }
  },
  data() {
    return {
      amountCat:[],
      amount:[],
      amountMap:[],
      chart: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    staffClassifyStatistics(){
      
    },
    initChart() {
      staffClassifyStatistics(this.$store.getters.id).then(res=>{
        this.amountCat = res.data.amountCat
        this.amount = res.data.amount
        let i =0 
        for(;i<this.amountCat.length;i++){
          let temp = {}
          temp.value = this.amount[i]
          temp.name = this.amountCat[i]
          this.amountMap.push(temp)
        }
     
        this.chart = echarts.init(this.$el, 'macarons')
        this.chart.setOption({
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            left: 'center',
            bottom: '10',
            data: this.amountCat
          },
          title:{
            left:'left',
            text:'七日分类费用统计',
            fontSize:1
          },
          series: [
            {
              name: '分类费用统计',
              type: 'pie',
              roseType: 'radius',
              radius: [15, 95],
              center: ['50%', '38%'],
              data:this.amountMap,
              animationEasing: 'cubicInOut',
              animationDuration: 2600
            }
          ]
        })
      })
    }
  }
}
</script>
