<template>
    <div class="right-header">
        <el-row>
            <!-- 左 -->
            <el-col :span="12">
                <h3><i class="el-icon-menu"></i>华联超市管理系统</h3>
            </el-col>
            <!-- 右 -->
            <el-col :span="12">
                <el-row>
                    <el-col :span="18">
                        <el-dropdown  @command="handleCommand">
                        <span class="el-dropdown-link">
                            {{ userName }}
                            <i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="personal">个人中心</el-dropdown-item>
                                <el-dropdown-item command="logout">退出系统</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>

                    </el-col>
                    <el-col :span="6">
                        <div class="avatar">
                            <img :src="avatarUrl" alt="">
                        </div>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
    </div>
</template>

<script>
// 引入本地存储封装
import local from '@/utils/local'

// 引入请求函数
import { getInfo } from '@/api/account'

export default {
    data() {
        return {
            userName: '', // 账号名
            avatarUrl: '' // 头像地址
        }
    },
    methods: {
        handleCommand(command) {
            if (command === 'logout') { // 退出系统
                // 1. 清除token
                local.remove('user_token')

                // 2. 弹出提示信息
                this.$message({
                    type: 'success',
                    message: '退出系统成功！哥哥! 欢迎回来!'
                })
                setTimeout(() => {
                    // 3. 跳转到登录页面
                    this.$router.push('/login')
                }, 1000)
                
            } else if (command === 'personal') { // 个人中心
                // 跳转到个人中心
                this.$router.push('/home/personal')
            }
        },
        getUserInfo() {
            // 发送请求 获取用户信息
            getInfo()
                .then(res => {
                    // 接收数据
                    let { data } = res;

                    // 获取账号
                    let { account, avatarUrl } = data[0]
                    this.userName = account; // 渲染账号
                    this.avatarUrl = 'http://127.0.0.1:666' + avatarUrl; // 渲染头像地址
                })  
                .catch(err => {
                    console.log(err)
                })
        }
    },
    created() {
        // 请求当前登录的用户信息
        this.getUserInfo();
    }
}
</script>

<style lang="less">
    .right-header {
        color:#2d3a4b;
        font-size: 16px;
        border-bottom: 1px solid #ccc;
        & > .el-row {
            & > .el-col {
                .el-row {
                    .el-col:first-child {
                        text-align: right;
                    }
                    .el-col:last-child {
                        text-align: center;
                        .avatar {
                            width: 50px;
                            height: 50px;
                            background: green;
                            margin-left: 20px;
                            margin-top: 5px;
                            border-radius: 50%;
                            img {
                                width: 100%;
                                height: 100%;
                                border-radius: 50%;
                            }
                        }
                    }
                }
            }
        }
    }
</style>