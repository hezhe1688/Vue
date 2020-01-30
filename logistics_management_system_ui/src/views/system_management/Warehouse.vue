<template>
    <div>
        <template>
            <el-card class="box-card">
                <el-row :gutter="100">
                    <el-col :span="2">
                        <el-button @click="warehouse_showDialog()" type="primary" plain>新增订单</el-button>
                    </el-col>
                    <el-col :span="2">
                        <el-button type="warning" plain>取消操作</el-button>
                    </el-col>
                    <el-col :span="6">
                        <el-input
                                placeholder="输入仓库名称查询"
                                clearable
                                prefix-icon="el-icon-search"
                                v-model="warehouse_searchInput">
                        </el-input>
                    </el-col>
                    <el-col :span="3" style="margin-left: -90px">
                        <el-button @click="warehouse_searchBtn()" type="success" plain>搜索仓库</el-button>
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
                            label="仓库ID"
                            width="90">
                    </el-table-column>
                    <el-table-column
                            prop="warehouseName"
                            label="仓库名称"
                            width="100">
                    </el-table-column>
                    <el-table-column
                            prop="warehouseAddress"
                            label="仓库地址"
                            width="150">
                    </el-table-column>
                    <el-table-column
                            prop="warehouseContactPerson"
                            label="仓库负责人"
                            width="110">
                    </el-table-column>
                    <el-table-column
                            prop="warehouseContactNumber"
                            label="负责人电话"
                            width="110">
                    </el-table-column>
                    <el-table-column
                            prop="productType"
                            label="存储产品类型"
                            width="110">
                    </el-table-column>
                    <el-table-column
                            label="仓库商品"
                            width="400">
                        <template slot-scope="scope">
                            <span v-for="(item) in scope.row.products">
                                【{{item.productName}}】
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="操作"
                            width="145">
                        <template slot-scope="scope">
                            <el-button
                                    size="mini"
                                    @click="warehouse_handle(scope.$index, scope.row)">编辑
                            </el-button>
                            <el-button
                                    size="mini"
                                    type="danger"
                                    @click="warehouse_handleDelete(scope.$index, scope.row)">删除
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
        <!--新增仓库对话框-->
        <el-dialog
                title="新增仓库"
                :visible.sync="dialogVisible"
                width="500px"
                destroy-on-close
                :before-close="handleClose">
            <el-form ref="warehouse" :model="warehouse" label-width="110px">
                <el-form-item label="仓库名称" prop="warehouseName">
                    <el-input v-model="warehouse.warehouseName"></el-input>
                </el-form-item>
                <el-form-item label="仓库地址" prop="warehouseAddress">
                    <el-input v-model="warehouse.warehouseAddress"></el-input>
                </el-form-item>
                <el-form-item label="仓库负责人" prop="warehouseContactPerson">
                    <el-input v-model="warehouse.warehouseContactPerson"></el-input>
                </el-form-item>
                <el-form-item label="负责人电话" prop="warehouseContactNumber">
                    <el-input v-model="warehouse.warehouseContactNumber"></el-input>
                </el-form-item>
                <el-form-item label="存储产品类型" prop="productType">
                    <el-input v-model="warehouse.productType"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCancel()">取 消</el-button>
                <el-button type="primary" @click="warehouse_addData('warehouse')">新 增</el-button>
            </span>
        </el-dialog>
        <!--修改仓库信息对话框-->
        <el-dialog
                title="修改仓库"
                :visible.sync="editDialogVisible"
                width="500px"
                destroy-on-close
                :before-close="handleClose">
            <el-form ref="warehouse" :model="warehouse" label-width="100px">
                <el-form-item label="仓库ID">
                    <el-input :disabled="true" v-model="warehouse.id"></el-input>
                </el-form-item>
                <el-form-item label="仓库名称" prop="warehouseName">
                    <el-input v-model="warehouse.warehouseName"></el-input>
                </el-form-item>
                <el-form-item label="仓库地址" prop="warehouseAddress">
                    <el-input v-model="warehouse.warehouseAddress"></el-input>
                </el-form-item>
                <el-form-item label="仓库负责人" prop="warehouseContactPerson">
                    <el-input v-model="warehouse.warehouseContactPerson"></el-input>
                </el-form-item>
                <el-form-item label="负责人电话" prop="warehouseContactNumber">
                    <el-input v-model="warehouse.warehouseContactNumber"></el-input>
                </el-form-item>
                <el-form-item label="存储产品类型" prop="productType">
                    <el-input v-model="warehouse.productType"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editCancel()">取 消</el-button>
                <el-button type="primary" @click="warehouse_editData('warehouse')">修 改</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
	import {request} from '../../network/request.js'
	import qs from 'qs'

	export default {
		name: "Warehouse",
		data() {
			return {
				warehouse: {
					id: '',
					warehouseName: '',
					warehouseAddress: '',
					warehouseContactPerson: '',
					warehouseContactNumber: '',
					productType: '',
					products: {
						productName: ''
					}
				},
				tableData: [],  //所有数据
				multipleSelection: [], //多选数组
				ids: [], //批量删除ids
				pageSizes: [8, 10, 15, 20, 25, 30],
				currentPage: 1, //当前页
				pageSize: 8,  //pageSizes中的选项
				total: 0, //总条数
				warehouse_searchInput: '',  //搜索框输入的值
				loading: true,  //数据加载
				dialogVisible: false,  //新增对话框
				editDialogVisible: false,  //修改对话框
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
					url: '/getAllPageWarehouse',
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
			handleSizeChange(val){
				this.pageSize = val;
				this.getAllData(val)
			},
			//分页中点击上一页，下一页的时候使用
			handleCurrentChange(currentPage) {
				this.currentPage = currentPage;
				this.getAllData();
			},

			//根据客户名称模糊查询
			warehouse_searchBtn() {
				let that = this;
				request({
					url: '/getWarehouseByName',
					method: 'get',
					params: {
						currentPage: this.currentPage,
						pageSize: this.pageSize,
						warehouseLikeName: that.warehouse_searchInput
					}
				}).then(res => {
					if (res != null) {
						that.loading = false;
						this.$notify({
							title: '成功',
							message: '数据查询成功',
							type: 'success'
						});
						that.warehouse_searchInput = ''
					}
					that.tableData = res.data.list;
					that.total = res.data.total;
					that.currentPage = res.data.pageNum;
				})
			},

			//单条记录删除
			warehouse_handleDelete(index, row) {
				request({
					url: '/deleteWarehouseById',
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
			warehouse_handle(index, row) {
				this.editDialogVisible = true;
				this.warehouse = row;
			},

			//修改数据
			warehouse_editData(formName) {
				let that = this;
				const data = {
					id: that.warehouse.id,
					warehouseName: that.warehouse.warehouseName,
					warehouseAddress: that.warehouse.warehouseAddress,
					warehouseContactPerson: that.warehouse.warehouseContactPerson,
					warehouseContactNumber: that.warehouse.warehouseContactNumber,
					productType: that.warehouse.productType,
				};
				this.$refs[formName].validate((valid) => {
					if (valid) {
						request({
							url: '/warehouseEditData',
							method: 'put',
							data: qs.stringify(data),
						}).then(res => {
							if (res !== 0) {
								this.editDialogVisible = false;
								this.warehouse = {};
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
				this.warehouse = {};
			},

			//打开新增对话框数据
			warehouse_showDialog() {
				this.dialogVisible = true;
			},
			handleClose(done) {
				this.$confirm('确认关闭？')
					.then(_ => {
						done();
						this.warehouse = {}; //当点击编辑按钮关掉以后仍然有数据绑定
					})
					.catch(_ => {
					});
			},

			//新增数据
			warehouse_addData(formName) {
				let that = this;
				const data = {
					warehouseName: that.warehouse.warehouseName,
					warehouseAddress: that.warehouse.warehouseAddress,
					warehouseContactPerson: that.warehouse.warehouseContactPerson,
					warehouseContactNumber: that.warehouse.warehouseContactNumber,
					productType: that.warehouse.productType,
				};
				this.$refs[formName].validate((valid) => {
					if (valid) {
						request({
							url: '/insertWarehouse',
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
								this.warehouse = {};
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
				this.warehouse = {};
			},
		}
	}
</script>

<style scoped>
</style>
