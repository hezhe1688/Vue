<template>
    <div>
        <template>
            <el-card class="box-card" style="width: 1200px;">
                <el-row :gutter="100">
                    <el-col :span="2">
                        <el-button @click="product_showDialog()" type="primary" plain>新增产品</el-button>
                    </el-col>
                    <el-col :span="2">
                        <el-button @click="product_toggleSelection()" type="warning" plain>取消操作</el-button>
                    </el-col>
                    <el-col :span="2">
                        <el-button @click="product_delClick()" type="danger" plain>批量删除</el-button>
                    </el-col>
                    <el-col :span="6">
                        <el-input
                                placeholder="输入产品ID查询"
                                clearable
                                prefix-icon="el-icon-search"
                                v-model="product_searchInput">
                        </el-input>
                    </el-col>
                    <el-col :span="3" style="margin-left: -90px">
                        <el-button @click="product_searchBtn()" type="success" plain>搜索产品</el-button>
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
                            label="产品ID"
                            width="90">
                    </el-table-column>
                    <el-table-column
                            prop="productName"
                            label="产品名称"
                            width="280">
                    </el-table-column>
                    <el-table-column
                            prop="productType"
                            label="产品类型"
                            width="150">
                    </el-table-column>
                    <el-table-column
                            prop="productQuantity"
                            label="产品数量"
                            width="110">
                    </el-table-column>
                    <el-table-column
                            prop="productPrice"
                            label="产品价格"
                            width="110">
                    </el-table-column>
                    <el-table-column
                            label="操作"
                            width="145">
                        <template slot-scope="scope">
                            <el-button
                                    size="mini"
                                    @click="product_handle(scope.$index, scope.row)">编辑
                            </el-button>
                            <el-button
                                    size="mini"
                                    type="danger"
                                    @click="product_handleDelete(scope.$index, scope.row)">删除
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
        <!--新增产品对话框-->
        <el-dialog
                title="新增产品"
                :visible.sync="dialogVisible"
                width="500px"
                destroy-on-close
                :before-close="handleClose">
            <el-form :rules="rules" ref="product" :model="product" label-width="100px">
                <el-form-item label="产品名称" prop="productName">
                    <el-input v-model="product.productName"></el-input>
                </el-form-item>
                <el-form-item label="产品类型" prop="productType">
                    <el-select v-model="product.productType"
                               clearable placeholder="请选择">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="产品数量" prop="productQuantity">
                    <el-input-number v-model="product.productQuantity" :min="1" :max="50"
                                     label="描述文字"></el-input-number>
                </el-form-item>
                <el-form-item label="产品价格" prop="productPrice">
                    <el-input v-model="product.productPrice"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCancel()">取 消</el-button>
                <el-button type="primary" @click="product_addData('product')">新 增</el-button>
            </span>
        </el-dialog>
        <!--修改产品对话框-->
        <el-dialog
                title="修改产品"
                :visible.sync="editDialogVisible"
                width="500px"
                destroy-on-close
                :before-close="handleClose">
            <el-form :rules="rules" ref="product" :model="product" label-width="100px">
                <el-form-item label="产品ID">
                    <el-input :disabled="true" v-model="product.id"></el-input>
                </el-form-item>
                <el-form-item label="产品名称" prop="productName">
                    <el-input v-model="product.productName"></el-input>
                </el-form-item>
                <el-form-item label="产品类型" prop="productType">
                    <el-select v-model="product.productType"
                               clearable placeholder="请选择">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="产品数量" prop="productQuantity">
                    <el-input-number v-model="product.productQuantity" :min="1" :max="50"
                                     label="描述文字"></el-input-number>
                </el-form-item>
                <el-form-item label="产品价格" prop="productPrice">
                    <el-input v-model="product.productPrice"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editCancel()">取 消</el-button>
                <el-button type="primary" @click="product_editData('product')">修 改</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
	import {request} from '../../network/request.js'
	import qs from 'qs'

	export default {
		name: "Product",
		data() {
			return {
				product: {
					id: '',
					productName: '',
					productType: '',
					productQuantity: '',
					productPrice: '',
				},
				tableData: [],  //所有数据
				multipleSelection: [], //多选数组
				ids: [], //批量删除ids
				pageSizes: [8, 10, 15, 20, 25, 30],
				currentPage: 1, //当前页
				pageSize: 8,  //pageSizes中的选项
				total: 0, //总条数
				product_searchInput: '',  //搜索框输入的值
				loading: true,  //数据加载
				dialogVisible: false,  //新增对话框
				editDialogVisible: false,  //修改对话框
				//类型选择中的属性，为了简单起见没有选择远程从服务器请求数据，这里写死了
				options: [{
					value: '生活电器',
					label: '生活电器'
				}, {
					value: '男装',
					label: '男装'
				}, {
					value: '电脑办公',
					label: '电脑办公'
				}, {
					value: '图书音像',
					label: '图书音像'
				}, {
					value: '女装',
					label: '女装'
				}, {
					value: '母婴玩具',
					label: '母婴玩具'
				}],

				//新增数据进行校验
				rules: {
					productName: {
						required: true, message:
							'请输入产品姓名', trigger:
							'blur'
					}
					,
					productType: {
						required: true, message:
							'请输入产品类型', trigger:
							'blur'
					}
					,
					productQuantity: {required: true, message: '请选择产品数量', trigger: 'blur'},
					productPrice:
						{
							required: true, message:
								'请输入产品价格', trigger:
								'blur'
						}
					,
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
					url: '/getAllPageProduct',
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
			product_searchBtn() {
				let that = this;
				request({
					url: '/getProductByName',
					method: 'get',
					params: {
						currentPage: this.currentPage,
						pageSize: this.pageSize,
						productLikeName: that.product_searchInput
					}
				}).then(res => {
					if (res != null) {
						that.loading = false;
						this.$notify({
							title: '成功',
							message: '数据查询成功',
							type: 'success'
						});
						that.product_searchInput = ''
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
			product_toggleSelection() {
				this.$refs.multipleTable.clearSelection();
				this.multipleSelection = []
			},
			//批量删除
			product_delClick() {
				if (this.multipleSelection.length !== 0) {
					this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						let that = this;
						request({
							url: '/delBatchProductById',
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

			//单条记录删除
			product_handleDelete(index, row) {
				request({
					url: '/deleteProductById',
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
			product_handle(index, row) {
				this.editDialogVisible = true;
				this.product = row;
			},

			//修改数据
			product_editData(formName) {
				let that = this;
				const data = {
					id: that.product.id,
					productName: that.product.productName,
					productType: that.product.productType,
					productQuantity: that.product.productQuantity,
					productPrice: that.product.productPrice,
				};
				this.$refs[formName].validate((valid) => {
					if (valid) {
						request({
							url: '/productEditData',
							method: 'put',
							data: qs.stringify(data),
						}).then(res => {
							if (res !== 0) {
								this.editDialogVisible = false;
								this.product = {};
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
				this.product = {};
			},

			//打开新增对话框数据
			product_showDialog() {
				this.dialogVisible = true;
			},
			handleClose(done) {
				this.$confirm('确认关闭？')
					.then(_ => {
						done();
						this.product = {}; //当点击编辑按钮关掉以后仍然有数据绑定
					})
					.catch(_ => {
					});
			},

			//新增数据
			product_addData(formName) {
				let that = this;
				const data = {
					productName: that.product.productName,
					productType: that.product.productType,
					productQuantity: that.product.productQuantity,
					productPrice: that.product.productPrice,
				};
				this.$refs[formName].validate((valid) => {
					if (valid) {
						request({
							url: '/insertProduct',
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
								this.product = {};
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
				this.product = {};
			}
		}
	}
</script>

<style scoped>

</style>
