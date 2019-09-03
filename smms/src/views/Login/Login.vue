<template>
    <div class="login">
        <!-- 登录表单容器 -->
        <div class="login-wrap">
            <!-- 标题 -->
            <h3 class="title">
                <i class="el-icon-s-custom"></i>
                华联超市管理系统-登录
            </h3>

            <!-- 登录表单 -->
            <el-form 
                :model="loginForm" 
                status-icon 
                :rules="rules"
                ref="loginForm"
                label-width="100px"
                >

                <el-form-item label="账号" prop="account">
                    <el-input type="text" v-model="loginForm.account" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="密码" prop="password">
                    <el-input type="text" v-model="loginForm.password" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="确认密码" prop="checkPass">
                    <el-input type="password" v-model="loginForm.checkPass" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="submitForm()">登录</el-button>
                    <el-button @click="resetForm()">重置</el-button>
                </el-form-item>

            </el-form>
        </div>
    </div>
</template>

<script>
// 引入工具函数
import { pwdReg } from '@/utils/reg';

// 引入请求函数
import { checkLogin } from '@/api/login'

// 引入本地存储封装
import local from '@/utils/local'

export default {
    data() {
        // 自定义验证函数
        // 验证密码
        const checkPwd = (rule, value, callback) => {
            // 获取值的长度
            const len = value.length;

            if (value === '') {
                callback(new Error('密码不能为空')) // 非空
            } else if ( len < 3 || len > 6 ) {
                callback(new Error('长度为3 ~ 6 位')) // 长度
            } else  if (!pwdReg( value )) {
                callback(new Error('只可以输入字母数字')) // 正则
            } else {
                // 确认密码不为空 触发一致性验证
                if (this.loginForm.checkPass !== '') {
                    this.$refs.loginForm.validateField('checkPass') // 触发确认密码的一致性验证
                }
                callback() // 成功
            }
        }
        // 验证确认密码
        const confirmPwd = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码')) // 非空
            } else if (value !== this.loginForm.password) {
                callback(new Error('两次密码不一致')) // 一致性
            } else {
                callback(); // 成功
            }
        }
        return {
            // 登录表单数据
            loginForm: {
                account: '',  // 账号
                password: '', // 密码
                checkPass: '' // 确认密码
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
                    {  required: true, validator: checkPwd, trigger: 'blur' } // 自定义验证
                ],
                // 确认密码
                checkPass: [
                    { required: true,  validator: confirmPwd, trigger: 'blur' } // 自定义验证
                ]
            }
        }
    },
    methods: {
        // 登录
        submitForm() {
            // 获取el-form组件 调用验证方法
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    // 收集参数
                    let params = {
                        account: this.loginForm.account,
                        password: this.loginForm.password
                    }
                    // 把参数发送给后端
                    checkLogin(params)
                        .then(res => {
                            // 接收后端响应的数据
                            let {code, reason, token} = res;

                            // 判断
                            if (code === 0) { // 成功   
                                // console.log('我登录成功了，看一下后台到底有没有给我令牌token:', token)
                                // 把token存入本地存储
                                local.set('user_token', token)

                                this.$message({ // 弹成功提示
                                    type: 'success',
                                    message: reason
                                })
                                this.$router.push('/home') // 跳转后端首页

                            } else if (code ===1) { // 失败
                                this.$message.error( reason ) // 弹失败提示
                            }
                        })
                        .catch(err => {
                            console.log(err)
                        })
                } else {
                    console.log('前端验证不通过!')
                    return false;
                }
            })
        },
        // 重置
        resetForm() {
            // 获取el-form表单 调用内置重置方法
            this.$refs.loginForm.resetFields();
        }
    }
}
</script>

<style lang="less">
    // 引入样式
    @import './login.less';
</style>