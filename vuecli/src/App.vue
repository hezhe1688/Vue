<template>
  <div id="app">
    <router-link to="/home" tag="button">首页</router-link>
    <router-link to="/about" tag="button">关于</router-link>
    <!--传递参数，以/接到后面-->
    <router-link :to="'/user/'+userId" tag="button">用户</router-link>
    <!--对象传递 query 以问号形式-->
    <router-link :to="{path: '/profile',query: {name:'hezhe',age:'18'}}" tag="button">档案</router-link>
    <router-view></router-view>
  </div>
</template>


<script>
    export default {
    	name: 'App',
        data(){
    		return {
    			userId: 'zhangsan'
    		}
        }
    }
</script>

<style>

</style>
