<template>
    <div class="left-nav">
        <!-- 标题 -->
        <h3 class="title">
            <i class="el-icon-menu"></i>
            华联超市管理系统
        </h3>
        <!-- 导航 -->
        <el-menu
            :default-active="$route.path"
            unique-opened
            active-text-color="rgb(64, 158, 255)"
            background-color="rgb(48, 65, 86)"
            router
            >
            <!-- 导航 -->
            <el-submenu :index="(i+1) + ''" v-for="(nav, i) in leftNav" :key="i">
                <template slot="title">
                    <i :class="nav.iconCls"></i>
                    <span>{{ nav.navTitle }}</span>
                </template>

                <el-menu-item 
                    v-for="(subNav, i) in nav.children"
                    :key="i"
                    :index="subNav.path"
                    >
                    {{ subNav.navSubTitle }}
                </el-menu-item>
            </el-submenu>

        </el-menu>
    </div>
</template>

<script>
    // 引入请求
    import { getRole } from '@/api/account'

    export default {
        data() {
            return {
                leftNav: []
            }
        },
        created() {
            getRole()
                .then(res => {
                    // 获取用户角色
                    let { role } = res;

                    // 定义导航数据
                    let nav = [ // 左侧导航数据
                        // 导航1
                        {
                            iconCls: 'el-icon-s-tools',
                            navTitle: '系统信息',
                            role: ['超级管理员', '普通用户'],
                            children: [
                                { path: '/home/systeminfo', 'navSubTitle': '系统信息' }
                            ]
                        },
                        // 导航2
                        {
                            iconCls: 'el-icon-s-order',
                            navTitle: '账号管理',
                            role: ['超级管理员'],
                            children: [
                                { path: '/home/accountmanage', 'navSubTitle': '账号管理' },
                                { path: '/home/accountadd', 'navSubTitle': '账号添加' },
                                { path: '/home/passwordmodify', 'navSubTitle': '密码修改' },
                            ]
                        },
                        // 导航3
                        {
                            iconCls: 'el-icon-s-goods',
                            navTitle: '商品管理',
                            role: ['超级管理员', '普通用户'],
                            children: [
                                { path: '/home/goodsmanage', 'navSubTitle': '商品管理' },
                                { path: '/home/goodsadd', 'navSubTitle': '商品添加' }
                            ] 
                        },
                        // 导航4
                        {
                            iconCls: 'el-icon-tickets',
                            navTitle: '统计管理',
                            role: ['超级管理员'],
                            children: [
                                { path: '/home/selltotal', 'navSubTitle': '销售统计' },
                                { path: '/home/stocktotal', 'navSubTitle': '进货统计' }
                            ]   
                        }
                    ]

                    // 过滤导航
                    this.leftNav = nav.filter(v => v.role.includes( role ))

                })
                .catch(err => {
                    console.log(err)
                })
        }
    }
</script>

<style lang="less">
    .left-nav {
        .title {
            color: #fff;
            margin: 10px auto;
            text-align: center;
            font-size: 16px;
        }
        .el-menu {
           border-right: none;
           .el-submenu {
               color: #fff;
               .el-submenu__title {
                 color: #fff;
                & > i {
                    color: #fff;
                }
               }
           }
           .el-menu-item {
               color: #fff;
           } 
        }
    }
</style>