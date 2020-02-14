<template>
    <div>
        <template>
            <el-card class="box-card" style="width: 1200px;">
                <el-row :gutter="100">
                    <el-col :span="1">
                        <el-button @click="feedback_toggleSelection()" type="warning" plain>取消操作</el-button>
                    </el-col>
                    <el-col :span="1">
                        <el-button @click="feedback_delClick()" type="danger" plain>批量删除</el-button>
                    </el-col>
                    <el-col :span="1">
                        <el-button @click="exportExcel()" type="info" plain>文件导出</el-button>
                    </el-col>
                </el-row>
                <el-table
                        id="out-table"
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
                            label="ID"
                            width="90">
                    </el-table-column>
                    <el-table-column
                            prop="username"
                            label="账户名称"
                            width="110">
                    </el-table-column>
                    <el-table-column
                            prop="email"
                            label="邮箱"
                            width="160">
                    </el-table-column>
                    <el-table-column
                            prop="mobileNumber"
                            label="联系电话"
                            width="120">
                    </el-table-column>
                    <el-table-column
                            prop="state"
                            label="受理状态"
                            width="90">
                        <template slot-scope="scope">
                            <el-tag
                                    :type="scope.row.state === '未受理' ? 'danger' : 'success'"
                                    disable-transitions>{{scope.row.state}}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="message"
                            label="描述信息"
                            width="440">
                    </el-table-column>
                    <el-table-column
                            label="操作"
                            width="100">
                        <template slot-scope="scope">
                            <el-button
                                    type="primary"
                                    size="mini"
                                    @click="feedback_handle(scope.$index, scope.row)">受理
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
    </div>
</template>

<script>
	import {request} from '../../network/request.js'
	import qs from 'qs'
	import FileSaver from "file-saver";
	import XLSX from "xlsx";

	export default {
		name: "feedback",
		data() {
			return {
				feedback: {
					id: '',
					username: '',
					email: '',
					mobileNumber: '',
					message: '',
					state: '',
				},
				tableData: [],  //所有数据
				multipleSelection: [], //多选数组
				ids: [], //批量删除ids
				pageSizes: [6, 10, 15, 20, 25, 30],
				currentPage: 1, //当前页
				pageSize: 6,  //pageSizes中的选项
				total: 0, //总条数
				loading: true,  //数据加载
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
					url: '/getAllPageFeedback',
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
			feedback_toggleSelection() {
				this.$refs.multipleTable.clearSelection();
				this.multipleSelection = []
			},
			//批量删除
			feedback_delClick() {
				if (this.multipleSelection.length !== 0) {
					this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						let that = this;
						request({
							url: '/delBatchFeedbackById',
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

			//受理
			feedback_handle(index, row) {
				this.feedback = row;
				let that = this;
				const data = {
					id: that.feedback.id,
					username: that.feedback.username,
					email: that.feedback.email,
					mobileNumber: that.feedback.mobileNumber,
					message: that.feedback.message,
					state: that.feedback.state,
				};
				request({
					url: '/feedbackEditData',
					method: 'put',
					data: qs.stringify(data),
				}).then(res => {
					if (res !== 0) {
						this.editDialogVisible = false;
						this.feedback = {};
						this.getAllData();
						this.$notify({
							title: '成功',
							message: '受理成功',
							type: 'success'
						});
					}
				}).catch(res => {
					this.$notify({
						title: '失败',
						message: '受理失败',
						type: 'error'
					});
				})
			},


			//导出EXECL文件
			exportExcel() {
				/* 从表生成工作簿对象 */
				var wb = XLSX.utils.table_to_book(document.querySelector("#out-table"));
				/* 获取二进制字符串作为输出 */
				var wbout = XLSX.write(wb, {
					bookType: "xlsx",
					bookSST: true,
					type: "array"
				});
				console.log('ll');
				try {
					FileSaver.saveAs(
						//Blob 对象表示一个不可变、原始数据的类文件对象。
						//Blob 表示的不一定是JavaScript原生格式的数据。
						//File 接口基于Blob，继承了 blob 的功能并将其扩展使其支持用户系统上的文件。
						//返回一个新创建的 Blob 对象，其内容由参数中给定的数组串联组成。
						new Blob([wbout], {type: "application/octet-stream"}),
						//设置导出文件名称
						"反馈信息表.xlsx"
					);
				} catch (e) {
					if (typeof console !== "undefined") console.log(e, wbout);
				}
				return wbout;
			}
		}
	}
</script>

<style scoped>

</style>
