<template>
    <div>
        <template>
            <el-card class="box-card">
                <el-row :gutter="100">
                    <el-col :span="2">
                        <el-button @click="user_showDialog()" type="primary" plain>新增用户</el-button>
                    </el-col>
                    <el-col :span="2">
                        <el-button type="warning" plain>取消操作</el-button>
                    </el-col>
                    <el-col :span="6">
                        <el-input
                                placeholder="输入用户名称查询"
                                clearable
                                prefix-icon="el-icon-search"
                                v-model="user_searchInput">
                        </el-input>
                    </el-col>
                    <el-col :span="3" style="margin-left: -90px">
                        <el-button @click="user_searchBtn()" type="success" plain>搜索用户</el-button>
                    </el-col>
                </el-row>
                <el-table
                        ref="multipleTable"
                        :data="tableData"
                        v-loading="loading"
                        element-loading-text="数据加载中，请稍等"
                        tooltip-effect="dark"
                        stripe
                        style="width: 1200px;margin-top: 10px">
                    <el-table-column
                            type="selection"
                            width="45">
                    </el-table-column>
                    <el-table-column
                            fixed
                            sortable
                            prop="id"
                            label="用户ID"
                            width="90">
                    </el-table-column>
                    <el-table-column
                            prop="username"
                            label="用户名"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="password"
                            label="用户密码"
                            width="450">
                    </el-table-column>
                    <el-table-column
                            prop="state"
                            label="用户状态"
                            width="110">
                    </el-table-column>
                    <el-table-column
                            prop="roleName"
                            label="所属角色"
                            width="150">
                    </el-table-column>
                    <el-table-column
                            label="操作"
                            width="145">
                        <template slot-scope="scope">
                            <el-button
                                    size="mini"
                                    @click="user_handle(scope.$index, scope.row)">编辑
                            </el-button>
                            <el-button
                                    size="mini"
                                    type="danger"
                                    @click="user_handleDelete(scope.$index, scope.row)">删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>
            <!--分页组件-->
            <div class="block">
                <el-pagination
                        background
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-sizes="pageSizes"
                        :page-size="pageSize"
                        :total="total"
                        layout="total, sizes, prev, pager, next, jumper">
                </el-pagination>
            </div>
        </template>
        <!--新增用户对话框-->
        <el-dialog
                title="新增用户"
                :visible.sync="dialogVisible"
                width="500px"
                destroy-on-close
                :before-close="handleClose">
            <el-form ref="user" :model="user" label-width="110px">
                <el-form-item label="用户名">
                    <el-input v-model="user.username"></el-input>
                </el-form-item>
                <el-form-item label="用户密码">
                    <el-input v-model="user.password"></el-input>
                </el-form-item>
                <el-form-item label="用户状态">
                    <el-radio v-model="user.state" :label="1">正常状态</el-radio>
                    <el-radio v-model="user.state" :label="0">禁用状态</el-radio>
                </el-form-item>
                <el-form-item label="关联角色">
                    <el-select v-model="user.roleName" placeholder="请选择">
                        <el-option
                                v-for="item in options"
                                :key="item.id"
                                :label="item.roleName"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCancel()">取 消</el-button>
                <el-button type="primary" @click="user_addData('user')">新 增</el-button>
            </span>
        </el-dialog>
        <!--修改用户信息对话框-->
        <el-dialog
                title="修改仓库"
                :visible.sync="editDialogVisible"
                width="500px"
                destroy-on-close
                :before-close="handleClose">
            <el-form ref="user" :model="user" label-width="110px">
                <el-form-item label="用户名">
                    <el-input v-model="user.username"></el-input>
                </el-form-item>
                <el-form-item label="关联角色">
                    <el-select v-model="user.roleName" placeholder="请选择">
                        <el-option
                                v-for="item in options"
                                :key="item.id"
                                :label="item.roleName"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editCancel()">取 消</el-button>
                <el-button type="primary" @click="user_editData('user')">修 改</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
	import {request} from '../../network/request.js'
	import qs from 'qs'

	export default {
		name: "user",
		data() {
			return {
				user: {
					id: '',
					username: '',
					password: '',
					state: '',
					roleName: '',
				},
				role: {
					id: '',
					roleName: ''
				},
				tableData: [],  //所有数据
				multipleSelection: [], //多选数组
				ids: [], //批量删除ids
				pageSizes: [8, 10, 15, 20, 25, 30],
				currentPage: 1, //当前页
				pageSize: 8,  //pageSizes中的选项
				total: 0, //总条数
				user_searchInput: '',  //搜索框输入的值
				loading: true,  //数据加载
				dialogVisible: false,  //新增对话框
				editDialogVisible: false,  //修改对话框
				options: []
			}
		},
		//当vue对象创建时加载进来
		created() {
			this.getAllData();
		},
		methods: {
			//获取所有信息
			getAllData() {
				let that = this;
				request({
					url: '/getAllPagerUser',
					method: 'get',
					params: {
						currentPage: this.currentPage,
						pageSize: this.pageSize,
					}
				}).then(res => {
					if (res != null) {
						that.loading = false;
					}
					that.tableData = res.data.list;
					that.total = res.data.total;
					that.currentPage = res.data.pageNum;
				})
			},
			handleSizeChange(val) {
				this.pageSize = val;
				this.getAllData(val)
			},
			//分页中点击上一页，下一页的时候使用
			handleCurrentChange(currentPage) {
				this.currentPage = currentPage;
				this.getAllData();
			},

			//根据客户名称模糊查询
			user_searchBtn() {
				let that = this;
				request({
					url: '/getUserByName',
					method: 'get',
					params: {
						currentPage: this.currentPage,
						pageSize: this.pageSize,
						userLikeName: that.user_searchInput
					}
				}).then(res => {
					if (res != null) {
						that.loading = false;
						this.$notify({
							title: '成功',
							message: '数据查询成功',
							type: 'success'
						});
						that.user_searchInput = ''
					}
					that.tableData = res.data.list;
					that.total = res.data.total;
					that.currentPage = res.data.pageNum;
				})
			},

			//单条记录删除
			user_handleDelete(index, row) {
				request({
					url: '/deleteUserById',
					method: 'delete',
					params: {
						id: row.id
					}
				}).then(res => {
					if (res !== 0) {
						this.$notify({
							title: '成功',
							message: '删除成功',
							type: 'success'
						});
						this.getAllData();
					}
				}).catch(res => {
					this.$notify.error({
						title: '错误',
						message: '删除失败'
					});
				})
			},

			//进入修改界面并绑定数据
			user_handle(index, row) {
				let that = this;
				this.editDialogVisible = true;
				this.user = row;
				request({
					url: "/getRoleMgs",
					method: 'get'
				}).then(res => {
					that.options = res.data;
				})
			},

			//修改数据
			user_editData() {
				let that = this;
				const data = {
					id: that.user.id,
					username: that.user.username,
                    roleName: that.user.roleName,
				};
				request({
					url: '/userEditData',
					method: 'put',
					data: qs.stringify(data),
				}).then(res => {
					if (res !== 0) {
						this.editDialogVisible = false;
						this.user = {};
						this.getAllData();
						this.$notify({
							title: '成功',
							message: '修改成功',
							type: 'success'
						});
					}
				}).catch(res => {
					this.$notify({
						title: '失败',
						message: '修改失败',
						type: 'error'
					});
				})
			},

			//点击修改的取消按钮
			editCancel() {
				this.editDialogVisible = false;
				this.user = {};
			},

			handleClose(done) {
				this.$confirm('确认关闭？')
					.then(_ => {
						done();
						this.user = {}; //当点击编辑按钮关掉以后仍然有数据绑定
					})
					.catch(_ => {
					});
			},

			//打开新增对话框数据
			user_showDialog() {
				this.dialogVisible = true;
				let that = this;
				request({
					url: "/getRoleMgs",
					method: 'get'
				}).then(res => {
					that.options = res.data;
				})
			},

			//新增数据
			user_addData() {
				let that = this;
				const data = {
					username: that.user.username,
					password: that.user.password,
					state: that.user.state,
					roleName: that.user.roleName,
				};
				request({
					url: '/insertUser',
					method: 'post',
					data: qs.stringify(data),
				}).then(res => {
					if (res !== 0) {
						this.$notify({
							title: '成功',
							message: '新增成功',
							type: 'success'
						});
						this.dialogVisible = false;
						this.user = {};
						this.getAllData();
					}
				}).catch(res => {
					this.$notify({
						title: '失败',
						message: '新增失败',
						type: 'error'
					});
				})
			},
			//新增取消按钮
			addCancel() {
				this.dialogVisible = false;
				this.user = {};
			},
		}
	}
</script>

<style scoped>
</style>
