<template>
  <div id="app">
    <router-link to="/user">user</router-link>
    <router-link to="/adduser">新增</router-link>
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'App'
  }
</script>

<style>

</style>
