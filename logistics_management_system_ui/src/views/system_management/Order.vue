<template>
    <div>
        <template>
            <el-card class="box-card" style="width: 1200px;">
                <el-row :gutter="100">
                    <el-col :span="2">
                        <el-button @click="order_showDialog()" type="primary" plain>新增订单</el-button>
                    </el-col>
                    <el-col :span="2">
                        <el-button @click="order_toggleSelection()" type="warning" plain>取消操作</el-button>
                    </el-col>
                    <el-col :span="2">
                        <el-button @click="order_delClick()" type="danger" plain>批量删除</el-button>
                    </el-col>
                    <el-col :span="4">
                        <el-date-picker
                                v-model="dataSearchInput"
                                type="daterange"
                                align="right"
                                unlink-panels
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                :picker-options="dataPickerOptions">
                        </el-date-picker>
                    </el-col>
                    <el-col :span="3" style="margin-left: 145px">
                        <el-button @click="order_dataSearchBtn()" type="success" plain>日期搜索订单</el-button>
                    </el-col>
                    <el-col :span="6">
                        <el-input
                                placeholder="输入订单ID查询"
                                clearable
                                prefix-icon="el-icon-search"
                                v-model="order_searchInput">
                        </el-input>
                    </el-col>
                    <el-col :span="3" style="margin-left: -90px">
                        <el-button @click="order_searchBtn()" type="success" plain>搜索订单</el-button>
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
                            label="订单ID"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="shippersName"
                            label="发货人姓名"
                            width="110">
                    </el-table-column>
                    <el-table-column
                            prop="shippersAddress"
                            label="发货人地址"
                            width="160">
                    </el-table-column>
                    <el-table-column
                            prop="shippersTel"
                            label="发货人电话"
                            width="100">
                    </el-table-column>
                    <el-table-column
                            prop="recipientName"
                            label="收件人姓名"
                            width="110">
                    </el-table-column>
                    <el-table-column
                            prop="recipientAddress"
                            label="收件人地址"
                            width="160">
                    </el-table-column>
                    <el-table-column
                            prop="recipientTel"
                            label="收件人电话"
                            width="100">
                    </el-table-column>
                    <el-table-column
                            prop="orderData"
                            label="订单日期"
                            width="90">
                    </el-table-column>
                    <el-table-column
                            label="操作"
                            width="145">
                        <template slot-scope="scope">
                            <el-button
                                    size="mini"
                                    @click="order_handle(scope.$index, scope.row)">编辑
                            </el-button>
                            <el-button
                                    size="mini"
                                    type="danger"
                                    @click="order_handleDelete(scope.$index, scope.row)">删除
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
        <!--新增订单对话框-->
        <el-dialog
                title="新增订单"
                :visible.sync="dialogVisible"
                width="500px"
                destroy-on-close
                :before-close="handleClose">
            <el-form :rules="rules" ref="order" :model="order" label-width="100px">
                <el-form-item label="发货人姓名" prop="shippersName">
                    <el-input v-model="order.shippersName"></el-input>
                </el-form-item>
                <el-form-item label="发货人地址" prop="shippersAddress">
                    <el-input v-model="order.shippersAddress"></el-input>
                </el-form-item>
                <el-form-item label="发货人电话" prop="shippersTel">
                    <el-input v-model="order.shippersTel"></el-input>
                </el-form-item>
                <el-form-item label="收件人姓名" prop="recipientName">
                    <el-input v-model="order.recipientName"></el-input>
                </el-form-item>
                <el-form-item label="收件人地址" prop="recipientAddress">
                    <el-input v-model="order.recipientAddress"></el-input>
                </el-form-item>
                <el-form-item label="收件人电话" prop="recipientTel">
                    <el-input v-model="order.recipientTel"></el-input>
                </el-form-item>
                <el-form-item label="订单日期" prop="orderData">
                    <el-date-picker
                            v-model="order.orderData"
                            align="right"
                            type="date"
                            placeholder="选择日期"
                            :picker-options="pickerOptions">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCancel()">取 消</el-button>
                <el-button type="primary" @click="order_addData('order')">新 增</el-button>
            </span>
        </el-dialog>
        <!--修改订单对话框-->
        <el-dialog
                title="修改订单"
                :visible.sync="editDialogVisible"
                width="500px"
                destroy-on-close
                :before-close="handleClose">
            <el-form :rules="rules" ref="order" :model="order" label-width="100px">
                <el-form-item label="发货人姓名" prop="shippersName">
                    <el-input v-model="order.shippersName"></el-input>
                </el-form-item>
                <el-form-item label="发货人地址" prop="shippersAddress">
                    <el-input v-model="order.shippersAddress"></el-input>
                </el-form-item>
                <el-form-item label="发货人电话" prop="shippersTel">
                    <el-input v-model="order.shippersTel"></el-input>
                </el-form-item>
                <el-form-item label="收件人姓名" prop="recipientName">
                    <el-input v-model="order.recipientName"></el-input>
                </el-form-item>
                <el-form-item label="收件人地址" prop="recipientAddress">
                    <el-input v-model="order.recipientAddress"></el-input>
                </el-form-item>
                <el-form-item label="收件人电话" prop="recipientTel">
                    <el-input v-model="order.recipientTel"></el-input>
                </el-form-item>
                <el-form-item label="订单日期" prop="orderData">
                    <el-date-picker
                            v-model="order.orderData"
                            align="right"
                            type="date"
                            placeholder="选择日期"
                            :picker-options="pickerOptions">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editCancel()">取 消</el-button>
                <el-button type="primary" @click="order_editData('order')">修 改</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
	import {request} from '../../network/request.js'
	import qs from 'qs'

	export default {
		name: "Order",
		data() {
			return {
				order: {
					id: '',
					shippersName: '',
					shippersAddress: '',
					shippersTel: '',
					recipientName: '',
					recipientAddress: '',
					recipientTel: '',
					orderData: ''
				},
				tableData: [],  //所有数据
				multipleSelection: [], //多选数组
				ids: [], //批量删除ids
				pageSizes: [6, 10, 15, 20, 25, 30],
				currentPage: 1, //当前页
				pageSize: 6,  //pageSizes中的选项
				total: 0, //总条数
				order_searchInput: '',  //搜索框输入的值
				loading: true,  //数据加载
				dialogVisible: false,  //新增对话框
				editDialogVisible: false,  //修改对话框
				dataSearchInput: '', //日期范围选择框
				//新增修改中快速选择日期
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
					}],
				},
				//按日期查询快速选择
				dataPickerOptions: {
					shortcuts: [{
						text: '最近一周',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '最近一个月',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '最近三个月',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
							picker.$emit('pick', [start, end]);
						}
					}]
				},
				//新增数据进行校验
				rules: {
					shippersName: {required: true, message: '请输入发货人姓名', trigger: 'blur'},
					shippersAddress: {required: true, message: '请输入发货人地址', trigger: 'blur'},
					shippersTel: [{required: true, message: '请选择发货人电话', trigger: 'blur'},
						{type: "string", message: '请输入11位有效电话号码', required: true, len: 11, max: 11}],
					recipientName: {required: true, message: '请输入收件人姓名', trigger: 'blur'},
					recipientAddress: {required: true, message: '请输入收件人地址', trigger: 'blur'},
					recipientTel: [{required: true, message: '请输入收件人电话', trigger: 'blur'},
						{type: "string", message: '请输入11位有效电话号码', required: true, len: 11, max: 11}],
					orderData: {type: 'date', required: true, message: '请输入订单日期', trigger: 'blur'}
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
					url: '/getAllPageOrder',
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
			order_searchBtn() {
				let that = this;
				request({
					url: '/getOrderByName',
					method: 'get',
					params: {
						currentPage: this.currentPage,
						pageSize: this.pageSize,
						orderLikeName: that.order_searchInput
					}
				}).then(res => {
					if (res != null) {
						that.loading = false;
						this.$notify({
							title: '成功',
							message: '数据查询成功',
							type: 'success'
						});
						that.order_searchInput = ''
					}
					that.tableData = res.data.list;
					that.total = res.data.total;
					that.currentPage = res.data.pageNum;
				})
			},

			//通过筛选日期进行范围查询
			order_dataSearchBtn() {
				let that = this;
				if (that.dataSearchInput.length !== 0) {  //当没有选择日期的时候就不发送查询请求
					request({
						url: '/searchDataByDate',
						method: 'get',
						params: {
							currentPage: this.currentPage,
							pageSize: this.pageSize,
							dataSearch: that.dataSearchInput
						}
					}).then(res => {
						if (res != null) {
							that.loading = false;
							this.$notify({
								title: '成功',
								message: '数据查询成功',
								type: 'success'
							});
							that.dataSearchInput = ''
						}
						that.tableData = res.data.list;
						that.total = res.data.total;
						that.currentPage = res.data.pageNum;
					})
				}
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
			order_toggleSelection() {
				this.$refs.multipleTable.clearSelection();
				this.multipleSelection = []
			},
			//批量删除
			order_delClick() {
				if (this.multipleSelection.length !== 0) {
					this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						let that = this;
						request({
							url: '/delBatchOrderById',
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
			order_handle(index, row) {
				this.editDialogVisible = true;
				this.order = row;
			},

			//修改数据
			order_editData(formName) {
				let that = this;
				const data = {
					id: that.order.id,
					shippersName: that.order.shippersName,
					shippersAddress: that.order.shippersAddress,
					shippersTel: that.order.shippersTel,
					recipientName: that.order.recipientName,
					recipientAddress: that.order.recipientAddress,
					recipientTel: that.order.recipientTel,
					orderData: new Date(that.order.orderData).toLocaleDateString().replace(/\//g, '-'),
				};
				this.$refs[formName].validate((valid) => {
					if (valid) {
						request({
							url: '/orderEditData',
							method: 'put',
							data: qs.stringify(data),
						}).then(res => {
							if (res !== 0) {
								this.editDialogVisible = false;
								this.order = {};
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
				this.order = {};
			},

			//单条记录删除
			order_handleDelete(index, row) {
				request({
					url: '/deleteOrderById',
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
			order_showDialog() {
				this.dialogVisible = true;
			},
			handleClose(done) {
				this.$confirm('确认关闭？')
					.then(_ => {
						done();
						this.order = {}; //当点击编辑按钮关掉以后仍然有数据绑定
					})
					.catch(_ => {
					});
			},

			//新增数据
			order_addData(formName) {
				let that = this;
				const data = {
					shippersName: that.order.shippersName,
					shippersAddress: that.order.shippersAddress,
					shippersTel: that.order.shippersTel,
					recipientName: that.order.recipientName,
					recipientAddress: that.order.recipientAddress,
					recipientTel: that.order.recipientTel,
					orderData: that.order.orderData,
				};
				this.$refs[formName].validate((valid) => {
					if (valid) {
						request({
							url: '/insertOrder',
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
								this.order = {};
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
				this.order = {};
			}
		}
	}
</script>

<style scoped>

</style>
