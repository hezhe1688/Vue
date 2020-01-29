<template>
    <div>
        <template>
            <el-card class="box-card" style="width: 1200px;">
                <el-row :gutter="100">
                    <el-col :span="2">
                        <el-button @click="consumer_showDialog()" type="primary" plain>添加用户</el-button>
                    </el-col>
                    <el-col :span="2">
                        <el-button @click="consumer_toggleSelection()" type="warning" plain>取消操作</el-button>
                    </el-col>
                    <el-col :span="2">
                        <el-button @click="consumer_delClick()" type="danger" plain>批量删除</el-button>
                    </el-col>
                    <el-col :span="6" style="margin-left: 520px">
                        <el-input
                                placeholder="输入客户名称查询"
                                clearable
                                prefix-icon="el-icon-search"
                                v-model="consumer_searchInput">
                        </el-input>
                    </el-col>
                    <el-col :span="2" style="margin-left: -90px">
                        <el-button @click="consumer_searchBtn()" type="success" plain>搜索客户</el-button>
                    </el-col>
                </el-row>
                <el-table
                        @selection-change="handleSelectionChange"
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
                            width="110">
                    </el-table-column>
                    <el-table-column
                            prop="consumerName"
                            label="客户名称"
                            width="110">
                    </el-table-column>
                    <el-table-column
                            prop="consumerPassword"
                            label="客户密码"
                            width="160">
                    </el-table-column>
                    <el-table-column
                            prop="gender"
                            label="客户性别"
                            width="110">
                    </el-table-column>
                    <el-table-column
                            prop="age"
                            label="客户年龄"
                            width="110">
                    </el-table-column>
                    <el-table-column
                            prop="email"
                            label="客户邮箱"
                            width="160">
                    </el-table-column>
                    <el-table-column
                            :formatter="formatterState"
                            prop="state"
                            label="状态"
                            width="90">
                    </el-table-column>
                    <el-table-column
                            prop="registrationDate"
                            label="注册日期"
                            width="110">
                    </el-table-column>
                    <el-table-column
                            label="操作"
                            width="145">
                        <template slot-scope="scope">
                            <el-button
                                    size="mini"
                                    @click="consumer_handle(scope.$index, scope.row)">编辑
                            </el-button>
                            <el-button
                                    size="mini"
                                    type="danger"
                                    @click="consumer_handleDelete(scope.$index, scope.row)">删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>

            </el-card>
            <!--分页组件-->
            <div class="block">
                <el-pagination
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
        <!--新增数据对话框-->
        <el-dialog
                title="新增数据"
                :visible.sync="dialogVisible"
                width="500px"
                destroy-on-close
                :before-close="handleClose">
            <el-form :rules="rules" ref="consumer" :model="consumer" label-width="80px">
                <el-form-item label="客户名称" prop="consumerName">
                    <el-input v-model="consumer.consumerName"></el-input>
                </el-form-item>
                <el-form-item label="客户密码" prop="consumerPassword">
                    <el-input v-model="consumer.consumerPassword"></el-input>
                </el-form-item>
                <el-form-item label="客户性别" prop="gender">
                    <el-radio v-model="consumer.gender" label="男">男</el-radio>
                    <el-radio v-model="consumer.gender" label="女">女</el-radio>
                </el-form-item>
                <el-form-item label="客户年龄" prop="age">
                    <el-input v-model="consumer.age"></el-input>
                </el-form-item>
                <el-form-item label="客户邮箱" prop="email">
                    <el-input v-model="consumer.email"></el-input>
                </el-form-item>
                <el-form-item label="客户状态" prop="state">
                    <el-input v-model="consumer.state"></el-input>
                </el-form-item>
                <el-form-item label="注册日期" prop="registrationDate">
                    <el-date-picker
                            v-model="consumer.registrationDate"
                            align="right"
                            type="date"
                            placeholder="选择日期"
                            :picker-options="pickerOptions">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCancel()">取 消</el-button>
                <el-button type="primary" @click="consumer_addData('consumer')">新 增</el-button>
            </span>
        </el-dialog>
        <!--修改数据对话框-->
        <el-dialog
                title="修改数据"
                :visible.sync="editDialogVisible"
                width="500px"
                destroy-on-close
                :before-close="handleClose">
            <el-form :rules="rules" ref="consumer" :model="consumer" label-width="80px">
                <el-form-item label="客户id">
                    <el-input :disabled="true" v-model="consumer.id"></el-input>
                </el-form-item>
                <el-form-item label="客户名称" prop="consumerName">
                    <el-input v-model="consumer.consumerName"></el-input>
                </el-form-item>
                <el-form-item label="客户密码" prop="consumerPassword">
                    <el-input v-model="consumer.consumerPassword"></el-input>
                </el-form-item>
                <el-form-item label="客户性别" prop="gender">
                    <el-radio v-model="consumer.gender" label="男">男</el-radio>
                    <el-radio v-model="consumer.gender" label="女">女</el-radio>
                </el-form-item>
                <el-form-item label="客户年龄" prop="age">
                    <el-input v-model="consumer.age"></el-input>
                </el-form-item>
                <el-form-item label="客户邮箱" prop="email">
                    <el-input v-model="consumer.email"></el-input>
                </el-form-item>
                <el-form-item label="客户状态" prop="state">
                    <el-input v-model="consumer.state"></el-input>
                </el-form-item>
                <el-form-item label="注册日期" prop="registrationDate">
                    <el-date-picker
                            v-model="consumer.registrationDate"
                            align="right"
                            type="date"
                            placeholder="选择日期"
                            :picker-options="pickerOptions">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editCancel()">取 消</el-button>
                <el-button type="primary" @click="consumer_editData('consumer')">修 改</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
	import {request} from '../../network/request.js'
	import qs from 'qs'

	export default {
		name: "Consumer",
		data() {
			return {
				consumer: {
					id: '',
					consumerName: '',
					consumerPassword: '',
					gender: '',
					age: '',
					email: '',
					state: '',
					registrationDate: ''
				},
				tableData: [],
				multipleSelection: [],
				ids: [], //批量删除ids
				pageSizes: [8, 10, 15, 20, 25, 30],
				currentPage: 1, //当前页
				pageSize: 8,    //pageSizes中的选项
				total: 0, //总条数
				consumer_searchInput: '',  //搜索框输入的值
				loading: true,  //数据加载
				dialogVisible: false,  //新增对话框
				editDialogVisible: false,  //修改对话框
				//选择日期
				pickerOptions: {
					disabledDate(time) {
						return time.getTime() > Date.now();
					},
					shortcuts: [{
						text: '今天',
						onClick(picker) {
							picker.$emit('pick', new Date());
						}
					}, {
						text: '昨天',
						onClick(picker) {
							const date = new Date();
							date.setTime(date.getTime() - 3600 * 1000 * 24);
							picker.$emit('pick', date);
						}
					}, {
						text: '一周前',
						onClick(picker) {
							const date = new Date();
							date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
							picker.$emit('pick', date);
						}
					}]
				},
				//新增数据进行校验
				rules: {
					consumerName: {required: true, message: '请输入用户名称', trigger: 'blur'},
					consumerPassword: {required: true, message: '请输入密码', trigger: 'blur'},
					gender: {required: true, message: '请选择性别', trigger: 'blur'},
					age: {required: true, message: '请输入年龄', trigger: 'blur'},
					email: {required: true, message: '请正确输入邮箱格式', type: 'email', trigger: 'blur'},
					state: {required: true, message: '请输入状态0（禁用）1（启用）', trigger: 'blur'},
					registrationDate: {type: 'date', required: true, message: '请选择时间', trigger: 'blur'}
				}
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
					url: '/getAllConsumerPage',
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
			handleSizeChange() {

			},
			//分页中点击上一页，下一页的时候使用
			handleCurrentChange(currentPage) {
				this.currentPage = currentPage;
				this.getAllData();
			},
			//根据客户名称模糊查询
			consumer_searchBtn() {
				let that = this;
				request({
					url: '/getConsumerByName',
					method: 'get',
					params: {
						currentPage: this.currentPage,
						pageSize: this.pageSize,
						consumerLikeName: that.consumer_searchInput
					}
				}).then(res => {
					if (res != null) {
						that.loading = false;
						this.$notify({
							title: '成功',
							message: '数据查询成功',
							type: 'success'
						});
						that.consumer_searchInput = ''
					}
					that.tableData = res.data.list;
					that.total = res.data.total;
					that.currentPage = res.data.pageNum;
				})
			},
			//选择行
			handleSelectionChange(selections) {
				let that = this;
				for (let item of selections) {
					that.multipleSelection.push(item.id);
				}
				//取消重复ID添加
				that.multipleSelection = Array.from(new Set(that.multipleSelection));
			},
			//取消选择并且清空数组
			consumer_toggleSelection() {
				this.$refs.multipleTable.clearSelection();
				this.multipleSelection = []
			},
			//批量删除
			consumer_delClick() {
				if (this.multipleSelection.length !== 0) {
					this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						let that = this;
						request({
							url: '/delBatchConsumerById',
							method: 'delete',
							params: {
								ids: that.multipleSelection
							},
							//用于格式化数组
							paramsSerializer: function (params) {
								return qs.stringify(params, {arrayFormat: 'repeat'})
							}
						}).then(res => {
							this.getAllData();
							this.$notify({
								title: '成功',
								message: '删除成功',
								type: 'success'
							});
						});
					}).catch(() => {
						this.$notify({
							title: '失败',
							message: '删除失败',
							type: 'error'
						});
					});
				}
			},
			//进入修改界面并绑定数据
			consumer_handle(index, row) {
				this.editDialogVisible = true;
				this.consumer = row;
			},

			//修改数据
			consumer_editData(formName) {
				let that = this;
				const data = {
					id: that.consumer.id,
					consumerName: that.consumer.consumerName,
					consumerPassword: that.consumer.consumerPassword,
					gender: that.consumer.gender,
					age: that.consumer.age,
					email: that.consumer.email,
					state: that.consumer.state,
					registrationDate: new Date(that.consumer.registrationDate).toLocaleDateString().replace(/\//g, '-'),
				};
				this.$refs[formName].validate((valid) => {
					if (valid) {
						request({
							url: '/consumerEditData',
							method: 'put',
							data: qs.stringify(data),
						}).then(res => {
							if (res !== 0) {
								this.$notify({
									title: '成功',
									message: '修改成功',
									type: 'success'
								});
								this.editDialogVisible = false;
								this.consumer = {};
								this.getAllData();
							}
						}).catch(res => {
							this.$notify({
								title: '失败',
								message: '修改失败',
								type: 'error'
							});
						})
					} else {
						this.$notify.error({
							title: '错误',
							message: '请按要求完成校验'
						});
						return false;
					}
				});
			},
			//点击修改的取消按钮
			editCancel() {
				this.editDialogVisible = false;
				this.consumer = {};
			},
			//单条记录删除
			consumer_handleDelete(index, row) {
				request({
					url: '/delConsumerById',
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
			//打开新增对话框数据
			consumer_showDialog() {
				this.dialogVisible = true;
			},
			handleClose(done) {
				this.$confirm('确认关闭？')
					.then(_ => {
						done();
						this.consumer = {}; //当点击编辑按钮关掉以后仍然有数据绑定
					})
					.catch(_ => {
					});
			},
			//新增数据
			consumer_addData(formName) {
				let that = this;
				const data = {
					consumerName: that.consumer.consumerName,
					consumerPassword: that.consumer.consumerPassword,
					gender: that.consumer.gender,
					age: that.consumer.age,
					email: that.consumer.email,
					state: that.consumer.state,
					registrationDate: that.consumer.registrationDate,
				};
				this.$refs[formName].validate((valid) => {
					if (valid) {
						request({
							url: '/insertConsumer',
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
								this.consumer = {};
								this.getAllData();
							}
						}).catch(res => {
							this.$notify({
								title: '失败',
								message: '新增失败',
								type: 'error'
							});
						})
					} else {
						this.$notify.error({
							title: '错误',
							message: '请按要求完成校验'
						});
						return false;
					}
				});
			},
			//新增取消按钮
			addCancel() {
				this.dialogVisible = false;
				this.consumer = {};
			},
			formatterState(row, column) {
				return row.state == '1' ? "激活状态" : row.state == '0' ? "禁用状态" : "";
			}
		}
	}
</script>

<style scoped>

</style>
