<template>
    <div>
        <template>
            <el-card class="box-card">
                <el-row :gutter="100">
                    <el-col :span="2">
                        <el-button @click="automobile_showDialog()" type="primary" plain>新增配送车辆</el-button>
                    </el-col>
                    <el-col :span="2" style="margin-left: 40px">
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
                            label="配送车辆ID"
                            width="150">
                    </el-table-column>
                    <el-table-column
                            prop="licensePlate"
                            label="汽车牌照"
                            width="150">
                    </el-table-column>
                    <el-table-column
                            prop="automobileType"
                            label="汽车类型"
                            width="200">
                    </el-table-column>
                    <el-table-column
                            :formatter="formatterState"
                            prop="state"
                            label="汽车状态"
                            width="150">
                    </el-table-column>
                    <el-table-column
                            label="操作"
                            width="200">
                        <template slot-scope="scope">
                            <el-button
                                    size="mini"
                                    @click="automobile_handle(scope.$index, scope.row)">编辑
                            </el-button>
                            <el-button
                                    size="mini"
                                    type="danger"
                                    @click="automobile_handleDelete(scope.$index, scope.row)">删除
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
        <!--新增配送车辆对话框-->
        <el-dialog
                title="新增配送车辆"
                :visible.sync="dialogVisible"
                width="500px"
                destroy-on-close
                :before-close="handleClose">
            <el-form ref="automobile" :model="automobile" label-width="130px">
                <el-form-item label="汽车牌照">
                    <el-input v-model="automobile.licensePlate"></el-input>
                </el-form-item>
                <el-form-item label="汽车类型">
                    <el-input v-model="automobile.automobileType"></el-input>
                </el-form-item>
                <el-form-item label="汽车状态">
                    <el-radio v-model="automobile.state" label="1">正常状态</el-radio>
                    <el-radio v-model="automobile.state" label="0">维修状态</el-radio>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCancel()">取 消</el-button>
                <el-button type="primary" @click="automobile_addData('automobile')">新 增</el-button>
            </span>
        </el-dialog>
        <!--修改配送车辆对话框-->
        <el-dialog
                title="修改配送车辆"
                :visible.sync="editDialogVisible"
                width="500px"
                destroy-on-close
                :before-close="handleClose">
            <el-form ref="automobile" :model="automobile" label-width="130px">
                <el-form-item label="汽车牌照">
                    <el-input v-model="automobile.licensePlate"></el-input>
                </el-form-item>
                <el-form-item label="汽车类型">
                    <el-input v-model="automobile.automobileType"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editCancel()">取 消</el-button>
                <el-button type="primary" @click="automobile_editData('consumer')">修 改</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
	import {request} from '../../network/request.js'
	import qs from 'qs'

	export default {
		name: "automobile",
		data() {
			return {
				automobile: {
					id: '',
					licensePlate: '',
					automobileType: '',
					state: '',
				},
				tableData: [],  //所有数据
				multipleSelection: [], //多选数组
				ids: [], //批量删除ids
				pageSizes: [8, 10, 15, 20, 25, 30],
				currentPage: 1, //当前页
				pageSize: 8,  //pageSizes中的选项
				total: 0, //总条数
				automobile_searchInput: '',  //搜索框输入的值
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
					url: '/getAllPageAutomobile',
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
			automobile_handleDelete(index, row) {
				request({
					url: '/deleteAutomobileById',
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
			automobile_showDialog() {
				this.dialogVisible = true;
			},
			handleClose(done) {
				this.$confirm('确认关闭？')
					.then(_ => {
						done();
						this.automobile = {}; //当点击编辑按钮关掉以后仍然有数据绑定
					})
					.catch(_ => {
					});
			},


			//新增数据
			automobile_addData() {
				let that = this;
				const data = {
					licensePlate: that.automobile.licensePlate,
					automobileType: that.automobile.automobileType,
					state: that.automobile.state,
				};
				request({
					url: '/insertAutomobile',
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
						this.automobile = {};
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
				this.automobile = {};
			},
			formatterState(row, column) {
				return row.state == '1' ? "正常状态" : row.state == '0' ? "维修状态" : "";
			},

			//进入修改界面并绑定数据
			automobile_handle(index, row) {
				this.editDialogVisible = true;
				this.automobile = row;
			},

			//修改数据
			automobile_editData() {
				let that = this;
				const data = {
					id: that.automobile.id,
					licensePlate: that.automobile.licensePlate,
					automobileType: that.automobile.automobileType,
				};
				request({
					url: '/automobileEditData',
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
						this.automobile = {};
						this.getAllData();
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
				this.automobile = {};
			},
		}
	}
</script>
<style scoped>
</style>
