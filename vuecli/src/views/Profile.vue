<template>
    <div>
        <h1>我是profile</h1>
        <div>{{$route.query}}</div>
        <div>{{$route.query.name}}</div>
        <div>{{$route.query.age}}</div>
    </div>

</template>

<script>
	export default {
		name: "profile"
	}
</script>

<style scoped>

</style>