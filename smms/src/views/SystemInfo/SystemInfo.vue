<template>
    <div class="system-info">
        <!-- 卡片组件 -->
        <el-card class="box-card">
            <!-- 头 -->
            <div slot="header" class="clearfix">
                <h2>系统信息</h2>
            </div>

            <!-- 身体 -->
            <div class="item">
                <!-- 提示 -->
                <el-alert
                    title="成功提示的文案"
                    type="success"
                    show-icon>
                </el-alert>
                <el-alert
                    title="消息提示的文案"
                    type="info"
                    show-icon>
                </el-alert>

                <!-- 左右表格 -->
                <el-row :gutter="30">
                    <el-col :span="12">
                        <!-- 左面板 -->
                        <el-card class="box-card">
                            <div slot="header" class="clearfix">
                                <h3>销售排行</h3>
                            </div>
                            <div class="text item">
                                <!-- 左表格 -->
                                <el-table
                                    :data="saleRank"
                                    style="width: 100%"
                                    >
                                    <!-- 商品名称 -->
                                    <el-table-column
                                        prop="goodsName"
                                        label="商品名称"
                                        width="300">
                                    </el-table-column>

                                    <!-- 销量 -->
                                    <el-table-column
                                        prop="salesNum"
                                        label="销量">
                                    </el-table-column>

                                </el-table>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="12">
                         <!-- 右面板 -->
                        <el-card class="box-card">
                            <div slot="header" class="clearfix">
                                <h3>缺货的商品</h3>
                            </div>
                            <div class="text item">
                                <!-- 右表格 -->
                                <el-table
                                    :data="stockoutTable"
                                    style="width: 100%"
                                    >
                                    <!-- 商品名称 -->
                                    <el-table-column
                                        prop="goodsName"
                                        label="商品名称"
                                        width="300">
                                    </el-table-column>

                                    <!-- 库存 -->
                                    <el-table-column
                                        prop="inventory"
                                        label="库存">
                                    </el-table-column>

                                </el-table>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>

            </div>
        </el-card>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                // 销售排行
                saleRank: [
                    {
                       goodsName: '霸王洗发水1',
                       salesNum: 100
                    },
                    {
                       goodsName: '霸王洗发水2',
                       salesNum: 101
                    },
                    {
                       goodsName: '霸王洗发水3',
                       salesNum: 102
                    }
                ],
                // 缺货的商品
                stockoutTable:[
                    {goodsName: '蒂花之秀1', inventory: 1},
                    {goodsName: '蒂花之秀2', inventory: 0},
                    {goodsName: '蒂花之秀3', inventory: 3}
                ]
            }
        }
    }
</script>

<style lang="less">
    .system-info {
        .el-card {
            .el-card__header {
                background-color: #f1f1f1;
            }
            .el-card__body {
                .el-alert {
                    margin: 20px auto;
                }
            }
        }
    }
</style>