<template>
    <div class="account-manage">
       <el-card class="box-card">
            <div slot="header" class="clearfix">
                <h3>账号管理</h3>
            </div>
            <div>
                <!-- 表格 -->
                <el-table
                    ref="accountTableData"
                    :data="accountTableData"
                    tooltip-effect="dark"
                    style="width: 100%"
                    @selection-change="selectChange">
                    >
                    <!-- 选择框 -->
                    <el-table-column
                        type="selection"
                        width="55">
                    </el-table-column>

                    <!-- 账号 -->
                    <el-table-column
                        prop="account"
                        label="账号"
                        >
                    </el-table-column>

                    <!-- 用户组 -->
                    <el-table-column
                        prop="userGroup"
                        label="用户组"
                        >
                    </el-table-column>

                    <!-- 日期 -->
                    <el-table-column
                        label="日期"
                        >
                        <template slot-scope="scope">{{ scope.row.ctime | filterCtime }}</template>
                    </el-table-column>

                    <!-- 操作 -->
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <!-- 编辑按钮 -->
                            <el-button
                                size="mini"
                                type="primary"
                                @click="handleEdit(scope.row.id)"
                                >
                                <i class="el-icon-edit"></i>
                                编辑
                            </el-button>
                            <!-- 删除按钮 -->
                            <el-button
                                size="mini"
                                type="danger"
                                @click="handleDelete(scope.row.id)"
                                >
                                    <i class="el-icon-delete"></i>
                                    删除
                                </el-button>
                        </template>
                    </el-table-column>

                </el-table>
                <!-- 分页 -->
                <div style="margin-top: 20px">
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-sizes="[1, 3, 5, 10, 20, 50]"
                        :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total"
                        >
                    </el-pagination>
                </div>
                <!-- 批量删除&取消选择按钮 -->
                <div  style="margin-top: 20px">
                    <el-button @click="batchDel" size='small' type="danger">批量删除</el-button>
                    <el-button @click="deselect" size='small' type="primary">取消选择</el-button>
                </div>

                <!-- 修改表单模态框 -->
                <el-dialog title="修改账号" width="420px" :visible.sync="visible">
                    <!-- 修改表单 -->
                    <el-form ref="editForm" :model="editForm" style="width: 316px" :rules="rules">
                        <!-- 账号 -->
                        <el-form-item label="账号" prop="account" label-width="120px">
                            <el-input v-model="editForm.account" autocomplete="off"></el-input>
                        </el-form-item>
                        <!-- 用户组 -->
                        <el-form-item label="用户组" label-width="120px">
                            <el-select v-model="editForm.userGroup" placeholder="请选择用户组">
                                <el-option label="超级管理员" value="超级管理员"></el-option>
                                <el-option label="普通用户" value="普通用户"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                    <!-- 修改表单按钮 -->
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="visible = false">取 消</el-button>
                        <el-button type="primary" @click="saveEdit">确 定</el-button>
                    </div>
                </el-dialog>
            </div>
        </el-card>
    </div>
</template>

<script>
// 引入时间格式化模块
import moment from 'moment'

// 引入封装的请求函数
import { batchDelete, accountEdit, accountDel, saveEdit, getDataByPage } from '@/api/account'

export default {
    data() {
        return {
            accountTableData: [],  // 账号表格数据
            total: 0, // 数据总条数
            currentPage: 1,  // 当前页
            pageSize: 3, // 每页条数,
            visible: false, // 修改模态框的显示和隐藏状态
            editForm: { // 修改表单
                account: '',
                userGroup: ''
            },
            editId: '',
            rules: { // 验证规则
                account: [
                    { required: true, message: '账号不能为空', trigger: 'change' },
                    { min: 3, max: 6, message:'长度3 ~ 6位', trigger: 'change' }
                ]
            },
            delIdArr: [] // 批量删除id数组
        }
    },
    methods: {
        // 批量删除
        batchDel() {
            // 如果没选中 
            if (!this.delIdArr.length) {
                this.$message.error( '请选择以后再操作！你是不是傻?' );
                return;
            }

            // 优化体验
            this.$confirm('确认执行批量删除吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => { // 确认删除
                    // 收集参数
                    let params =  { idArr: this.delIdArr }

                     // 发送请求 把"id们"发送给后端
                    batchDelete(params)
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
                                // 刷新列表
                                this.getAccountsByPage()

                            } else if (code === 1) {
                                // 弹失败提示
                                this.$message.error( reason )
                            }
                        })
                        .catch(err => {
                            console.log(err)
                        })
               
                }).catch(() => { // 取消删除
                    this.$message({
                        type: 'info',
                        message: '已取消批量删除'
                    })        
            })

           
        },
        // 表格选中状态改变事件
        selectChange(selectData) {
            this.delIdArr = selectData.map( v => v.id ) // 循环选中的数据 把每一项的id取出来 放入一个数组中
        },
        // 取消选择
        deselect() {
            this.$refs.accountTableData.clearSelection() // 选中整个表格调用取消选择方法
        },
        // 编辑
        handleEdit(id) {
            // 弹出模态框
            this.visible = true;
            // 保留id 这个id就是要修改的数据的id
            this.editId = id;

            accountEdit({ id })
                .then(res => {
                    // 接收后端响应的数据
                    let { data } = res;
                  
                    // 回填表单
                    this.editForm.account = data[0].account;
                    this.editForm.userGroup = data[0].userGroup;
                })
                .catch(err => {
                    console.log(err)
                })
        },
        // 删除
        handleDelete(id) {
            // 优化删除体验
            this.$confirm('你确定要删除吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => { // 确定走这里
                accountDel({ id })
                .then(res => {
                    // 接收后端响应的数据
                    let {code, reason} = res;
                    // 判断
                    if (code === 0) { // 成功
                        // 弹成功提示
                        this.$message({
                            type: 'success',
                            message: reason
                        })
                        // 刷新列表（重新请求一次数据）
                        this.getAccountsByPage()

                    } else if (code === 1) { // 失败
                        // 弹失败提示
                        this.$message.error( reason )
                    }
                })
                .catch(err => {
                    console.log(err)
                })

            }).catch(() => { // 取消走这里
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                })      
            })

           
        },
        // 保存编辑
        saveEdit() {
            // 调用表单的前端验证
            this.$refs.editForm.validate((valid) => {
                if (valid) {
                    // 隐藏模态框
                    this.visible = false;

                    // 收集参数
                    let params = {
                        account: this.editForm.account,
                        userGroup: this.editForm.userGroup,
                        id: this.editId
                    }
                    // 发送数据给后端
                    saveEdit(params)
                        .then(res => {
                            // 接收后端响应的数据
                            let {code, reason} = res;
                            // 判断
                            if (code === 0) { // 成功
                                this.$message({
                                    type: 'success',
                                    message: reason
                                })
                                this.getAccountsByPage() // 重新请求一次数据 刷新列表
                                
                            } else if (code === 1) { // 失败
                                this.$message.error( reason ) 
                            }
                        })
                        .catch(err => {
                            console.log(err)
                        })

                } else {
                    return false;
                }
            })
        },
        // pageSize（每页条数）改变
        handleSizeChange(pageSize) {
            this.pageSize = pageSize // 把用户选择的每页条数获取 赋值给data中的pageSize
            this.getAccountsByPage();// 调用分页请求
        },
        // currentPage（当前页）改变 
        handleCurrentChange(currentPage) {
            this.currentPage = currentPage; // 把用户选择的当前页获取 赋值给data中的currentPage
             this.getAccountsByPage(); // 调用分页请求
        },
        // 按照分页请求数据
        getAccountsByPage() {
            // 收集参数
            let params = {
                pageSize: this.pageSize,
                currentPage: this.currentPage
            }
          getDataByPage(params)
                .then(res => {
                    // 接收后端响应的数据
                    let {total, data} = res;

                    // 渲染
                    this.total = total;
                    this.accountTableData = data;

                    // 边界判断
                    if (!data.length && this.currentPage !== 1) {
                        this.currentPage -= 1;
                        this.getAccountsByPage();
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        }
    },
    created() {
        this.getAccountsByPage(); // 调用分页请求数据的函数
    },
    filters: {
        filterCtime(ctime) { // 过滤时间
            return moment(ctime).format('YYYY-MM-DD hh:mm:ss')
        }
    }
}
</script>

<style lang="less">
.account-manage {
    .el-card {
        .el-card__header {
            background-color: #f1f1f1;
        }
    }
}
</style>