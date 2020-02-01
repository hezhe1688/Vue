<template>
    <div>
        <template>
            <el-card class="box-card">
                <el-row :gutter="100">
                    <el-col :span="2">
                        <el-button @click="role_showDialog()" type="primary" plain>新增角色</el-button>
                    </el-col>
                    <el-col :span="2">
                        <el-button type="warning" plain>取消操作</el-button>
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
                            label="角色ID"
                            width="90">
                    </el-table-column>
                    <el-table-column
                            prop="roleName"
                            label="角色名称"
                            width="120">
                    </el-table-column>
                    <el-table-column
                            label="拥有资源"
                            width="650">
                        <template slot-scope="scope">
                            <span v-for="(item) in scope.row.permissions">
                                【{{item.url}}】
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="操作"
                            width="145">
                        <template slot-scope="scope">
                            <el-button
                                    size="mini"
                                    type="danger"
                                    @click="role_handleDelete(scope.$index, scope.row)">删除
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
        <!--新增角色对话框-->
        <el-dialog
                title="新增用户"
                :visible.sync="dialogVisible"
                width="500px"
                destroy-on-close
                :before-close="handleClose">
            <el-form ref="role" :model="role" label-width="110px">
                <el-form-item label="用户名">
                    <el-input v-model="role.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色代码">
                    <el-input v-model="role.code"></el-input>
                </el-form-item>
                <el-form-item label="关联角色">
                    <el-select multiple collapse-tags v-model="role.permissions" placeholder="请选择">
                        <el-option
                                v-for="item in options"
                                :key="item.id"
                                :label="item.permissionName"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCancel()">取 消</el-button>
                <el-button type="primary" @click="role_addData('role')">新 增</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
	import {request} from '../../network/request.js'
	import qs from 'qs'

	export default {
		name: "role",
		data() {
			return {
				role: {
					id: '',
					roleName: '',
					permissions: {
						id: '',
						permissionName: '',
						url: ''
					}
				},
				tableData: [],  //所有数据
				multipleSelection: [], //多选数组
				ids: [], //批量删除ids
				pageSizes: [8, 10, 15, 20, 25, 30],
				currentPage: 1, //当前页
				pageSize: 8,  //pageSizes中的选项
				total: 0, //总条数
				role_searchInput: '',  //搜索框输入的值
				loading: true,  //数据加载
				dialogVisible: false,  //新增对话框
				options: [],
				pers: [] //用于存储传递到后台的权限资源
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
					url: '/getAllPagerRole',
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

			//单条记录删除
			role_handleDelete(index, row) {
				request({
					url: '/deleteRoleById',
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

			handleClose(done) {
				this.$confirm('确认关闭？')
					.then(_ => {
						done();
						this.role = {}; //当点击编辑按钮关掉以后仍然有数据绑定
					})
					.catch(_ => {
					});
			},

			//打开新增对话框数据
			role_showDialog() {
				this.dialogVisible = true;
				let that = this;
				request({
					url: "/getPermissionsMgs",
					method: 'get'
				}).then(res => {
					that.options = res.data;
				})
			},

			//新增数据
			role_addData() {
				let that = this;
				const data = {
					pers: this.pers
				};
				request({
					url: '/insertRole',
					method: 'post',
					params: {
						roleName: that.role.roleName,
						pers:that.role.permissions
                    },
					//用于格式化数组
					paramsSerializer: function (params) {
						return qs.stringify(params, {arrayFormat: 'repeat'})
					}
				}).then(res => {
					if (res !== 0) {
						this.$notify({
							title: '成功',
							message: '新增成功',
							type: 'success'
						});
						that.dialogVisible = false;
						that.role = {};
						that.getAllData();
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
				this.role = {};
			},
		}
	}
</script>

<style scoped>
</style>
