<template>
    <div>
        <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="id">
                <el-input v-model="form.id"></el-input>
            </el-form-item>
            <el-form-item label="用户名">
                <el-input v-model="form.username"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">新增</el-button>
                <el-button>取消</el-button>
            </el-form-item>
        </el-form>
        <h1>{{form.id}}</h1>
        <h1>{{form.username}}</h1>
    </div>
</template>

<script>
	import {request} from '../network/request.js'
	import qs from 'qs'

	export default {
		name: "AddUser",
		data() {
			return {
				form: {
					id: '',
					username: '',
				}
			}
		},
		methods: {
			onSubmit() {
				let that = this;
				const data = {
					id: that.form.id,
					username: that.form.username
                };
				request({
					url: '/insertUser',
					method: 'post',
					//headers: {'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'},
					data: qs.stringify(data),
				}).then(rs => {
					console.log(rs);
				})
			}
		}
	}
</script>

<style scoped>
    @import url("//unpkg.com/element-ui@2.13.0/lib/theme-chalk/index.css");
</style>