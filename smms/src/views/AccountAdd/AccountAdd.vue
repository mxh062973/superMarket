<template>
    <div class="account-add">
      <!-- 卡片 -->
      <el-card class="box-card">
            <!-- 头 -->
            <div slot="header" class="clearfix">
                <h3>账号添加</h3>
            </div>
            <!-- 身体 -->
            <div class="item">
                <!-- 账号添加表单 -->
                <el-form 
                    style="width: 316px"
                    size="small"
                    :model="accountAddForm"
                    status-icon 
                    :rules="rules"
                    ref="accountAddForm"
                    label-width="100px"
                    >
                    <!-- 账号 -->
                    <el-form-item label="账号" prop="account">
                        <el-input type="text" v-model="accountAddForm.account" autocomplete="off"></el-input>
                    </el-form-item>

                    <!-- 密码 -->
                    <el-form-item label="密码" prop="password">
                        <el-input type="text" v-model="accountAddForm.password" autocomplete="off"></el-input>
                    </el-form-item>

                    <!-- 确认密码 -->
                    <el-form-item label="确认密码" prop="checkPass">
                        <el-input type="text" v-model="accountAddForm.checkPass" autocomplete="off"></el-input>
                    </el-form-item>

                    <!-- 用户组 -->
                    <el-form-item label="选择用户组" prop="userGroup">
                        <el-select v-model="accountAddForm.userGroup" placeholder="请选择用户组">
                        <el-option label="超级管理员" value="超级管理员"></el-option>
                        <el-option label="普通用户" value="普通用户"></el-option>
                        </el-select>
                    </el-form-item>

                    <!-- 提交按钮 -->
                    <el-form-item>
                        <el-button type="primary" @click="submitForm()">确定</el-button>
                        <el-button @click="resetForm()">重置</el-button>
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
import { accountAdd } from '@/api/account'

export default { 
    data() {
        // 自定义验证函数
        // 密码
        const checkPwd = (rule, value, callback) => {
            // 获取长度
            let len = value.length;

            if (value === '') {
                callback(new Error('密码不能为空'))
            } else if (len < 3 || len > 6) {
                callback(new Error('密码长度为3 ~ 6 位'))
            } else if (!pwdReg(value)) {
                callback(new Error('只可以输入字母数字'))
            } else {
                if (this.accountAddForm.checkPass !== '') {
                    // 再次出发一致性验证
                    this.$refs.accountAddForm.validateField('checkPass')
                }
                callback()
            }
        }
        // 确认密码
        const confirmPwd =  (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'))
            } else if (value !== this.accountAddForm.password) {
                callback(new Error('两次密码不一致'))
            } else {
                callback();
            }
        }
        return {
            // 添加账号表单数据（和表单双向绑定）
            accountAddForm: {
                account: '', // 账号
                password: '', // 密码
                checkPass: '', // 确认密码
                userGroup: '' // 用户组
            },
            // 验证规则
            rules: {
                // 账号
                account: [
                    { required: true, message: '请输入账号', trigger: 'blur' }, // 非空验证
                    { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' } // 长度验证
                ],
                // 密码
                password: [
                    { required: true, validator: checkPwd, trigger: 'blur' } // 自定义验证
                ],
                // 确认密码
                checkPass: [
                    { required: true, validator: confirmPwd, trigger: 'blur' } // 自定义验证
                ],
                // 用户组
                userGroup: [
                    { required: true, message: '请选择用户组', trigger: 'change' }, // 非空验证
                ]
            }
        }
    },
    methods: {
        // 提交
        submitForm() {
            // 获取整个表单，调用验证方法
            this.$refs.accountAddForm.validate((valid) => { // 所有前端验证通过 valid:true, 否则valid: false
                if (valid) {
                    // 收集参数
                    let params = {
                        account: this.accountAddForm.account,
                        password: this.accountAddForm.password,
                        userGroup: this.accountAddForm.userGroup
                    }

                    // 发送给后端
                   accountAdd( params )
                        .then(res => {
                            // 接收后端响应数据
                            let {code, reason} = res;

                            // 判断
                            if (code === 0) { // 成功
                                this.$message({ // 弹成功提示
                                    message: reason,
                                    type: 'success'
                                })
                                this.$router.push('/home/accountmanage') // 跳转到账号管理

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
        },
        // 重置
        resetForm() {
            this.$refs.accountAddForm.resetFields() // 调用表单重置方法
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