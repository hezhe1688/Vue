<template>
    <div>
        <template>
            <el-row>
                <el-button @click="delClick()" type="danger" icon="el-icon-delete" circle></el-button>
            </el-row>
            <el-table
                    ref="multipleTable"
                    :data="tableData"
                    tooltip-effect="dark"
                    @selection-change="handleSelectionChange"
                    border
                    stripe
                    style="width: 450px">
                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>
                <el-table-column
                        fixed
                        sortable
                        prop="id"
                        label="用户ID"
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="username"
                        label="姓名"
                        width="120">
                </el-table-column>
                <el-table-column
                        fixed="right"
                        label="操作"
                        width="100">
                    <template slot-scope="scope">
                        <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
                        <el-button type="text" size="small">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-button @click="toggleSelection()">取消选择</el-button>
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
    </div>
</template>

<script>
    import {request} from '../network/request.js'
    import qs from 'qs'
	export default {
		name: "User",
		data() {
			return {
				tableData: [],
				multipleSelection: [],
                ids: [],
				pageSizes:[10,20,30],
				currentPage: 0, //当前页
				pageSize: 10,    //pageSizes中的选项
				total: 0 //总条数
			}
		},
		methods: {
			//获取所有信息
			getData() {
				let that = this;
				request({
                    url: '/getAllUser',
                    params: {
	                    currentPage: this.currentPage,
	                    pageSize: this.pageSize
                    }
                }).then(res => {
					that.tableData = res.data.list;
					that.total = res.data.total;
                	that.currentPage = res.data.pageNum;
				})
			},
            //选择行
			handleSelectionChange(selections){
				let that = this;
                for (let item of selections){
                	that.multipleSelection.push(item.id);
                }
                //取消重复ID添加
				that.multipleSelection = Array.from(new Set(that.multipleSelection));
			},
            //取消选择并且清空数组
			toggleSelection(){
				this.$refs.multipleTable.clearSelection();
				this.multipleSelection = []
            },
            //删除，批量删除
			delClick(){
				let that = this;
				request({
                    url: '/delUserById',
                    method: 'delete',
					params: {
                    	ids: that.multipleSelection
                    },
                    //用于格式化数组
					paramsSerializer: function(params) {
						return qs.stringify(params, { arrayFormat: 'repeat' })
					}
                }).then(res => {
					this.getData();
                })
            },

			handleSizeChange(){

			},
            //分页中点击上一页，下一页的时候使用
			handleCurrentChange(currentPage){
				this.currentPage = currentPage;
				this.getData();
            }
		},
        created(){
			this.getData();
		},
	}
</script>
<style scoped>
    @import url("//unpkg.com/element-ui@2.13.0/lib/theme-chalk/index.css");
</style>