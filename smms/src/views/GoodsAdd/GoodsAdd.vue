<template>
    <div class="goods-add">
      <!-- 卡片 -->
      <el-card class="box-card">
            <!-- 头 -->
            <div slot="header" class="clearfix">
                <h3>商品添加</h3>
            </div>
            <!-- 身体 -->
            <div class="item">
                <!-- 商品添加表单 -->
                <el-form 
                    style="width: 316px"
                    size="small"
                    :model="goodsAddForm"
                    status-icon 
                    :rules="rules"
                    ref="goodsAddForm"
                    label-width="100px"
                    >
                     <!-- 1. 所属分类 -->
                    <el-form-item label="所属分类" prop="category">
                        <el-select v-model="goodsAddForm.category" placeholder="请选择分类">
                        <el-option label="电子类" value="电子类"></el-option>
                        <el-option label="食品类" value="食品类"></el-option>
                        <el-option label="烟酒类" value="烟酒类"></el-option>
                        <el-option label="服装类" value="服装类"></el-option>
                        <el-option label="蔬菜类" value="蔬菜类"></el-option>
                        </el-select>
                    </el-form-item>
                    <!-- 2. 商品条形码 -->
                    <el-form-item label="商品条形码" prop="barCode">
                        <el-input type="text" v-model="goodsAddForm.barCode" autocomplete="off"></el-input>
                    </el-form-item>
                    <!-- 3. 商品名称 -->
                    <el-form-item label="商品名称" prop="goodsName">
                        <el-input type="text" v-model="goodsAddForm.goodsName" autocomplete="off"></el-input>
                    </el-form-item>
                    <!-- 4. 商品进价 -->
                    <el-form-item label="商品进价" prop="costPrice">
                        <el-input type="text" @blur="autoPrice" v-model="goodsAddForm.costPrice" autocomplete="off"></el-input>
                    </el-form-item>
                    <!-- 5. 商品售价 -->
                    <el-form-item label="商品售价" prop="salePrice">
                        <el-input type="text" v-model="goodsAddForm.salePrice" autocomplete="off"></el-input>
                    </el-form-item>
                    <!-- 6. 市场价 -->
                    <el-form-item label="市场价" prop="marketPrice">
                        <el-input type="text" v-model="goodsAddForm.marketPrice" autocomplete="off"></el-input>
                    </el-form-item>
                    <!-- 7. 入库数量 -->
                    <el-form-item label="入库数量" prop="stockCount">
                        <el-input type="text" v-model="goodsAddForm.stockCount" autocomplete="off"></el-input>
                    </el-form-item>
                    <!-- 8. 商品重量 -->
                    <el-form-item label="商品重量" prop="goodsWeight">
                        <el-input type="text" v-model="goodsAddForm.goodsWeight" autocomplete="off"></el-input>
                    </el-form-item>
                    <!-- 9. 商品单位 -->
                    <el-form-item label="商品单位" prop="goodsUnit">
                        <el-input type="text" v-model="goodsAddForm.goodsUnit" autocomplete="off"></el-input>
                    </el-form-item>
                    <!-- 10. 会员优惠 -->
                    <el-form-item label="会员优惠" prop="vipDiscount">
                        <el-radio-group v-model="goodsAddForm.vipDiscount">
                        <el-radio label="享受"></el-radio>
                        <el-radio label="不享受"></el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <!-- 11. 是否促销 -->
                    <el-form-item label="是否促销"  prop="promotion">
                        <el-radio-group v-model="goodsAddForm.promotion">
                        <el-radio label="促销"></el-radio>
                        <el-radio label="不促销"></el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <!-- 12. 商品简介 -->
                    <el-form-item label="商品简介"  prop="goodsDesc">
                        <el-input type="textarea" v-model="goodsAddForm.goodsDesc"></el-input>
                    </el-form-item>
                    <!-- 提交按钮 -->
                    <el-form-item>
                        <el-button type="primary" @click="submitForm()">确定</el-button>
                    </el-form-item>

                </el-form>
            </div>
        </el-card>
    </div>
</template>

<script>
// 引入工具函数
import { pwdReg } from '@/utils/reg'
// 引入请求函数
import { goodsAdd } from '@/api/goods'

export default { 
    data() {
        return {
            // 添加账号表单数据（和表单双向绑定）
            goodsAddForm: {
              category: '',
              barCode: '',
              goodsName: '',
              salePrice: '',
              marketPrice: '',
              costPrice: '',
              stockCount: '',
              goodsWeight: '',
              goodsUnit: '',
              vipDiscount: '',
              promotion: '',
              goodsDesc: ''
            },
            // 验证规则
            rules: {
              category: [{ required:true, message: '不能为空', trigger: 'change' }],
              barCode: [{ required:true, message: '不能为空', trigger: 'blur' }],
              goodsName: [{ required:true, message: '不能为空', trigger: 'blur' }],
              salePrice: [{ required:true, message: '不能为空', trigger: 'blur' }],
              marketPrice: [{ required:true, message: '不能为空', trigger: 'blur' }],
              costPrice: [{ required:true, message: '不能为空', trigger: 'blur' }],
              stockCount: [{ required:true, message: '不能为空', trigger: 'blur' }],
              goodsWeight: [{ required:true, message: '不能为空', trigger: 'blur' }],
              goodsUnit: [{ required:true, message: '不能为空', trigger: 'blur' }],
              vipDiscount: [{ required:true, message: '不能为空', trigger: 'change' }],
              promotion: [{ required:true, message: '不能为空', trigger: 'change' }],
              goodsDesc: [{ required:true, message: '不能为空', trigger: 'blur' }]
            }
        }
    },
    methods: {
        // 自动补全售价和市场价
        autoPrice() {
            this.goodsAddForm.salePrice =  (parseFloat(this.goodsAddForm.costPrice) * 1.5).toFixed(2)
            this.goodsAddForm.marketPrice =  (parseFloat(this.goodsAddForm.costPrice)  * 2).toFixed(2)
        },
        // 提交
        submitForm() {
            // 获取整个表单，调用验证方法
            this.$refs.goodsAddForm.validate((valid) => { // 所有前端验证通过 valid:true, 否则valid: false
                if (valid) {
                    // 收集参数
                    let params = {
                        category: this.goodsAddForm.category,
                        barCode: this.goodsAddForm.barCode,
                        goodsName: this.goodsAddForm.goodsName,
                        costPrice: this.goodsAddForm.costPrice,
                        salePrice: this.goodsAddForm.salePrice,
                        marketPrice: this.goodsAddForm.marketPrice,
                        stockCount: this.goodsAddForm.stockCount,
                        goodsWeight: this.goodsAddForm.goodsWeight,
                        goodsUnit: this.goodsAddForm.goodsUnit,
                        vipDiscount: this.goodsAddForm.vipDiscount,
                        promotion: this.goodsAddForm.promotion,
                        goodsDesc: this.goodsAddForm.goodsDesc
                    }

                    // 发送给后端
                    goodsAdd( params )
                        .then(res => {
                             // 接收后端响应数据
                            let {code, reason} = res;
                            // 判断
                            if (code === 0) { // 成功
                                this.$message({ // 弹成功提示
                                    message: reason,
                                    type: 'success'
                                })
                                this.$router.push('/home/goodsmanage') // 跳转到账号管理

                            } else if (code === 1) { // 失败
                                this.$message.error(reason); // 弹失败提示
                            }
                        })
                        .catch(err => {
                            console.log(err)
                        })

                } else {
                    console.log('前端验证不通过，不允许提交')
                    return false;
                }
            })
        }
    }
}
</script>

<style lang="less">
    .account-add {
        .el-card {
            .el-card__header {
                background-color: #f1f1f1;
            }
        }
    }
</style>