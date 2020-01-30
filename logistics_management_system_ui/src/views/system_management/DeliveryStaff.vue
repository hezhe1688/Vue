<template>
    <div>
        <template>
            <el-card class="box-card">
                <el-row :gutter="100">
                    <el-col :span="2">
                        <el-button @click="deliveryStaff_showDialog()" type="primary" plain>新增配送人</el-button>
                    </el-col>
                    <el-col :span="2" style="margin-left: 20px">
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
                            label="配送人员ID"
                            width="120">
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            label="配送人员姓名"
                            width="120">
                    </el-table-column>
                    <el-table-column
                            prop="idCard"
                            label="配送人身份证"
                            width="160">
                    </el-table-column>
                    <el-table-column
                            prop="gender"
                            label="配送人性别"
                            width="90">
                    </el-table-column>
                    <el-table-column
                            prop="drivingType"
                            label="准驾车型"
                            width="100">
                    </el-table-column>
                    <el-table-column
                            prop="tel"
                            label="配送人员电话"
                            width="110">
                    </el-table-column>
                    <el-table-column
                            label="配送人员车牌号"
                            width="300">
                        <template slot-scope="scope">
                            <span v-for="(item) in scope.row.automobiles">
                                【{{item.licensePlate}}】
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="操作"
                            width="100">
                        <template slot-scope="scope">
                            <el-button
                                    size="mini"
                                    type="danger"
                                    @click="deliveryStaff_handleDelete(scope.$index, scope.row)">删除
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
        <!--新增配送人员对话框-->
        <el-dialog
                title="新增配送人员"
                :visible.sync="dialogVisible"
                width="500px"
                destroy-on-close
                :before-close="handleClose">
            <el-form ref="deliveryStaff" :model="deliveryStaff" label-width="130px">
                <el-form-item label="配送人员姓名" prop="name">
                    <el-input v-model="deliveryStaff.name"></el-input>
                </el-form-item>
                <el-form-item label="配送人身份证" prop="idCard">
                    <el-input v-model="deliveryStaff.idCard"></el-input>
                </el-form-item>
                <el-form-item label="配送人性别" prop="gender">
                    <el-input v-model="deliveryStaff.gender"></el-input>
                </el-form-item>
                <el-form-item label="准驾车型">
                    <el-input v-model="deliveryStaff.drivingType"></el-input>
                </el-form-item>
                <el-form-item label="联系电话">
                    <el-input v-model="deliveryStaff.tel"></el-input>
                </el-form-item>
                <el-form-item label="配送人员持有车辆">
                    <el-select v-model="deliveryStaff.automobiles" placeholder="请选择">
                        <el-option
                                v-for="item in options"
                                :key="item.id"
                                :label="item.licensePlate"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCancel()">取 消</el-button>
                <el-button type="primary" @click="deliveryStaff_addData('deliveryStaff')">新 增</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
	import {request} from '../../network/request.js'
	import qs from 'qs'

	export default {
		name: "deliveryStaff",
		data() {
			return {
				deliveryStaff: {
					id: '',
					name: '',
					idCard: '',
					gender: '',
					drivingType: '',
					tel: '',
					automobiles: {
						licensePlate: '',
						id: ''
					}
				},
				tableData: [],  //所有数据
				multipleSelection: [], //多选数组
				ids: [], //批量删除ids
				pageSizes: [8, 10, 15, 20, 25, 30],
				currentPage: 1, //当前页
				pageSize: 8,  //pageSizes中的选项
				total: 0, //总条数
				deliveryStaff_searchInput: '',  //搜索框输入的值
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
					url: '/getAllPageDeliveryStaff',
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
			deliveryStaff_handleDelete(index, row) {
				request({
					url: '/deleteDeliveryStaffById',
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


			//打开新增对话框数据,并且将车辆信息绑定上去
			deliveryStaff_showDialog() {
				this.dialogVisible = true;
				let that = this;
				request({
					url: '/getAutomobileInfo',
					method: 'get',
				}).then(res => {
					that.options = res.data;
				})
			},
			handleClose(done) {
				this.$confirm('确认关闭？')
					.then(_ => {
						done();
						this.deliveryStaff = {}; //当点击编辑按钮关掉以后仍然有数据绑定
					})
					.catch(_ => {
					});
			},


			//新增数据
			deliveryStaff_addData(formName) {
				let that = this;
				const data = {
					name: that.deliveryStaff.name,
					idCard: that.deliveryStaff.idCard,
					gender: that.deliveryStaff.gender,
					drivingType: that.deliveryStaff.drivingType,
					tel: that.deliveryStaff.tel,
					automobiles: that.deliveryStaff.automobiles
				};
				this.$refs[formName].validate((valid) => {
					if (valid) {
						request({
							url: '/insertDeliveryStaff',
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
								this.deliveryStaff = {};
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
				this.deliveryStaff = {};
			},
		}
	}
</script>

<style scoped>
</style>
