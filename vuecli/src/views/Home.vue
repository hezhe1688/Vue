<template>
  <div class="home">
    <h1>我是首页</h1>
    <router-link to="/home/homeNews">新闻</router-link>
    <router-link to="/home/HomeMsg">信息</router-link>
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'home',
}
</script>
