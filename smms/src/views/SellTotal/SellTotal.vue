<template>
    <div class="sell-total">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>销售统计</span>
                <el-button  size="mini" style="margin-left: 30px;" type="primary" @click="getData">
                    加载新数据
                </el-button>
            </div>
            <div>
               <!-- 报表渲染在这里哦 -->
               <!-- 1. 准备一个容器 -->
               <div id="sellCharts" style="height:400px;"></div>
            </div>
        </el-card>
    </div>
</template>

<script>
    // 引入请求数据函数
    import { getSellData } from '@/api/goods'

    export default {
        data() {
            return {
                // x轴
                xData: ['19-06-20', '19-06-21', '19-06-22', '19-06-23', '19-06-24', '19-06-25', '19-06-26'],
                // 核心数据
                seriesData: [100, 1000, 901, 934, 200, 1330, 300]
            }
        },
        methods: {
            // 重新加载数据
            getData() {
                getSellData()
                    .then(res => {
                        // 接收数据
                        let {category, value} = res;
                        // 渲染
                        this.xData = category;
                        this.seriesData = value;

                        // 重新调用报表
                        var option = {
                            // x轴
                            xAxis: {
                                    type: 'category',
                                    data: this.xData
                            },
                            // y轴
                            yAxis: {
                                type: 'value',
                            },
                            // 核心数据
                            series: [{
                                data: this.seriesData,
                                type: 'line',
                            }]
                        }
                        this.drawCharts(option);
                    })
                    .catch(err => {
                        console.log(err)
                    })
            },

            // 生成报表的函数
            drawCharts(option) {
                // 1. 初始化报表
                let sellChart = this.echarts.init( document.getElementById('sellCharts') )

                // 3. 使用配置生成报表
                sellChart.setOption( option )
            }
        },
        mounted() {
            let option = {
                // x轴
                xAxis: {
                        type: 'category',
                        data: this.xData
                },
                // y轴
                yAxis: {
                    type: 'value'
                },
                // 核心数据
                series: [{
                    data: this.seriesData,
                    type: 'bar'
                }]
            }
            this.drawCharts(option);
        }
    }
</script>

<style lang="less">

</style>