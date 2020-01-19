<template>
    <div>
        <h2>我是User</h2>
        <h3>{{$route.params.userId}}</h3>
        <h3>{{userId}}</h3>
    </div>
</template>

<script>
	export default {
		name: "User",
        computed:{
			userId(){
				return this.$route.params.userId
            }
        }
	}
</script>

<style scoped>

</style>