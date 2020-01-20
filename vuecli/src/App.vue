<template>
  <div id="app">
    <router-link to="/home" tag="button">首页</router-link>
    <router-link to="/about" tag="button">关于</router-link>
    <router-link :to="'/user/'+userId" tag="button">用户</router-link>
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
