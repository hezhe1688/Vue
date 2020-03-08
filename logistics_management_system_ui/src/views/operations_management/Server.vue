<template>
    <div>
        <template>
            <el-card class="box-card">
                <el-row :gutter="100">
                    <el-col :span="2">
                        <el-button @click="server_showDialog()" type="primary" plain>新增服务器</el-button>
                    </el-col>
                    <el-col :span="2" style="margin-left: 20px">
                        <el-button type="warning" plain>取消操作</el-button>
                    </el-col>
                    <el-col :span="6">
                        <el-input
                                placeholder="输入服务器名称查询"
                                clearable
                                prefix-icon="el-icon-search"
                                v-model="server_searchInput">
                        </el-input>
                    </el-col>
                    <el-col :span="3" style="margin-left: -90px">
                        <el-button @click="server_searchBtn()" type="success" plain>搜索服务器</el-button>
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
                            fixed
                            sortable
                            prop="id"
                            label="ID"
                            width="90">
                    </el-table-column>
                    <el-table-column
                            prop="username"
                            label="服务器名称"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="wip"
                            label="外网IP"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="nip"
                            label="内网IP"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="prot"
                            label="端口号"
                            width="150">
                    </el-table-column>
                    <el-table-column
                            prop="accountName"
                            label="账户名称"
                            width="150">
                    </el-table-column>
                    <el-table-column
                            prop="createDate"
                            label="创建日期"
                            width="200">
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

	export default {
		name: "serve",
		data() {
			return {
				server: {
					id: '',
					username: '',
					wip: '',
					nip: '',
					prot: '',
					accountName: '',
					createDate: '',
				},
				tableData: [],  //所有数据
				multipleSelection: [], //多选数组
				ids: [], //批量删除ids
				pageSizes: [8, 10, 15, 20, 25, 30],
				currentPage: 1, //当前页
				pageSize: 8,  //pageSizes中的选项
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
					url: '/getAllServerPage',
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
			}
		}
	}
</script>

<style scoped>
</style>
