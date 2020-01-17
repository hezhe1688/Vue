<template>
    <div>
        <h4>{{hezhe}}</h4>
    </div>
</template>

<script>
	export default {
		name: "Demo",
        data(){
			return{
				hezhe: '贺哲'
            }
        }
	}
</script>

<style scoped>
    h4{
        font-size: 50px;
        color: blue;
    }
</style>