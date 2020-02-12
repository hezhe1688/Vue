<template>
    <div>
        <template>
            <el-card class="box-card" style="width: 1200px;">
                <el-row :gutter="100">
                    <el-col :span="1">
                        <el-button @click="log_toggleSelection()" type="warning" plain>取消操作</el-button>
                    </el-col>
                    <el-col :span="1">
                        <el-button @click="log_delClick()" type="danger" plain>批量删除</el-button>
                    </el-col>
                    <el-col :span="1">
                        <el-button @click="exportExcel()" type="info" plain>文件导出</el-button>
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
                    <el-col :span="2" style="margin-left: 150px">
                        <el-button @click="log_dataSearchBtn()" type="success" plain>日期搜索</el-button>
                    </el-col>
                    <el-col :span="5">
                        <el-input
                                placeholder="输入ip查询"
                                clearable
                                prefix-icon="el-icon-search"
                                v-model="log_searchInput">
                        </el-input>
                    </el-col>
                    <el-col :span="1" style="margin-left: -90px">
                        <el-button @click="log_searchBtn()" type="success" plain>搜索日志</el-button>
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
                            label="日志ID"
                            width="90">
                    </el-table-column>
                    <el-table-column
                            prop="ip"
                            label="IP"
                            width="130">
                    </el-table-column>
                    <el-table-column
                            prop="ipSource"
                            label="IP来源"
                            width="145">
                    </el-table-column>
                    <el-table-column
                            prop="browser"
                            label="浏览器"
                            width="130">
                    </el-table-column>
                    <el-table-column
                            prop="osName"
                            label="操作系统"
                            width="150">
                    </el-table-column>
                    <el-table-column
                            prop="longitude"
                            label="经度"
                            width="110">
                    </el-table-column>
                    <el-table-column
                            prop="latitude"
                            label="纬度"
                            width="110">
                    </el-table-column>
                    <el-table-column
                            prop="loginDate"
                            label="登录日期"
                            width="120">
                    </el-table-column>
                    <el-table-column
                            label="操作"
                            width="130">
                        <template slot-scope="scope">
                            <el-button
                                    size="mini"
                                    type="danger"
                                    @click="log_handleDelete(scope.$index, scope.row)">删除
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
		name: "Logs",
		data() {
			return {
				log: {
					id: '',
					ip: '',
					ipSource: '',
					browser: '',
					longitude: '',
					latitude: '',
					loginDate: ''
				},
				tableData: [],  //所有数据
				multipleSelection: [], //多选数组
				id: [], //批量删除ids
				pageSizes: [8, 10, 15, 20, 25, 30],
				currentPage: 1, //当前页
				pageSize: 8,  //pageSizes中的选项
				total: 0, //总条数
				log_searchInput: '',  //搜索框输入的值
				loading: true,  //数据加载
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
					url: '/getAllPageLogs',
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
			log_searchBtn() {
				let that = this;
				request({
					url: '/getLogByIp',
					method: 'get',
					params: {
						currentPage: this.currentPage,
						pageSize: this.pageSize,
						logLikeName: that.log_searchInput
					}
				}).then(res => {
					if (res != null) {
						that.loading = false;
						this.$notify({
							title: '成功',
							message: '数据查询成功',
							type: 'success'
						});
						that.log_searchInput = ''
					}
					that.tableData = res.data.list;
					that.total = res.data.total;
					that.currentPage = res.data.pageNum;
				})
			},

			//通过筛选日期进行范围查询
			log_dataSearchBtn() {
				let that = this;
				if (that.dataSearchInput.length !== 0) {  //当没有选择日期的时候就不发送查询请求
					request({
						url: '/searchLogsByDate',
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
			log_toggleSelection() {
				this.$refs.multipleTable.clearSelection();
				this.multipleSelection = []
			},
			//批量删除
			log_delClick() {
				if (this.multipleSelection.length !== 0) {
					this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						let that = this;
						request({
							url: '/deleteLogById',
							method: 'delete',
							params: {
								id: that.multipleSelection
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
			log_handleDelete(index, row) {
				request({
					url: '/deleteLogById',
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
						"日志.xlsx"
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
