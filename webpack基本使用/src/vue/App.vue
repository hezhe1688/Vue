<template>
    <div>
        <h1>{{msg}}</h1>
        <h1>{{msg}}</h1>
        <h1>{{msg}}</h1>
        <h1>{{msg}}</h1>
        <Demo></Demo>
    </div>
</template>

<script>
	import Demo from './Demo.vue'

	export default {
		name: "App",
		data() {
			return {
				msg: '你们好'
			}
		},
		components: {
			Demo
		}
	}
</script>

<style scoped>
    h1 {
        color: #ffff00;
    }
</style>