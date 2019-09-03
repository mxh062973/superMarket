<template>
    <div class="password-modify">
      <!-- 卡片 -->
      <el-card class="box-card">
            <!-- 头 -->
            <div slot="header" class="clearfix">
                <h3>密码修改</h3>
            </div>
            <!-- 身体 -->
            <div class="item">
                <!-- 账号添加表单 -->
                <el-form 
                    style="width: 316px"
                    size="small"
                    :model="passwordModifyForm"
                    status-icon 
                    :rules="rules"
                    ref="passwordModifyForm"
                    label-width="100px"
                    >
                    <!-- 旧的密码 -->
                    <el-form-item label="旧的密码" prop="oldPassword">
                        <el-input type="text" v-model="passwordModifyForm.oldPassword" autocomplete="off"></el-input>
                    </el-form-item>

                    <!-- 新的密码 -->
                    <el-form-item label="新的密码" prop="newPassword">
                        <el-input type="text" v-model="passwordModifyForm.newPassword" autocomplete="off"></el-input>
                    </el-form-item>

                    <!-- 确认新密码 -->
                    <el-form-item label="确认新密码" prop="checkPass">
                        <el-input type="text" v-model="passwordModifyForm.checkPass" autocomplete="off"></el-input>
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
import local from '@/utils/local'

// 引入请求函数
import { checkOldPass, passwordModify } from '@/api/account'

export default { 
    data() {
        // 自定义验证函数
        const checkOldPwd = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('旧密码不能为空'))
            } else {
                // 把旧密码发送给后端
                checkOldPass({oldPwd: value})
                    .then(res => {
                        // 接收数据
                        let {code, reason} = res;
                        if (code === 1) {
                            callback(new Error(reason)) // 密码错误提示
                        } else if (code === 0) {
                            callback() // 成功
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
        } 
        const checkNewPwd = (rule, value, callback) => {
            // 获取长度
            let len = value.length;
            if (value === '') {
                callback(new Error('新密码不能为空'))
            } else if (value === this.passwordModifyForm.oldPassword) {
                callback(new Error('新密码不能与旧密码相同'))
            } else if (len < 3 || len > 6) {
                callback(new Error('密码长度3 ~ 6 位'))
            } else if(!pwdReg( value )) {
                callback(new Error('只可以输入字母数字'))
            } else {
                if (this.passwordModifyForm.checkPass !== '') {
                    this.$refs.passwordModifyForm.validateField('checkPass')
                }
                callback()
            }
        }
        const confirmPwd =  (rule, value, callback) => {
             let len = value.length;
            if (value === '') {
                callback(new Error('新密码不能为空'))
            } else if (value !== this.passwordModifyForm.newPassword) {
                callback(new Error('两次密码不一致'))
            } else {
                callback()
            }
        }

        return {
            // 添加账号表单数据（和表单双向绑定）
            passwordModifyForm: {
                oldPassword: '', // 旧的密码
                newPassword: '', // 新的密码
                checkPass: '', // 确认密码
            },
            // 验证规则
            rules: {
                oldPassword: [
                    {required: true, validator: checkOldPwd, trigger: 'blur'}
                ], 
                newPassword: [
                    {required: true, validator: checkNewPwd, trigger: 'blur'}
                ], 
                checkPass: [
                    {required: true, validator: confirmPwd, trigger: 'blur'}
                ],   
            }
        }
    },
    methods: {
        // 提交
        submitForm() {
            // 获取整个表单，调用验证方法
            this.$refs.passwordModifyForm.validate((valid) => { // 所有前端验证通过 valid:true, 否则valid: false
                if (valid) {
                    // 发送修改密码的请求
                    passwordModify({ newPassword: this.passwordModifyForm.newPassword })
                        .then(res => {
                            // 接收数据
                            let {code, reason} = res;
                            // 判断
                            if (code === 0) {
                                // 弹成功提示
                                this.$message({
                                    type: 'success',
                                    message: reason
                                })
                                // 清除token 退出登录
                                local.remove('user_token')
                                this.$router.push('/login')

                            } else if (code === 1){
                                // 弹失败提示
                                this.$message.error(reason)
                            }
                        })
                        .catch(err => {

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
    .password-modify {
        .el-card {
            .el-card__header {
                background-color: #f1f1f1;
            }
        }
    }
</style>
