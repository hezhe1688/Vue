<template>
    <div class="hello">
        <div id="chart1"></div>
        <div id="chart2"></div>
    </div>
</template>

<script>
	export default {
		name: "Home",
		data() {
			return {}
		},
		mounted() {
			this.$chart.line1('chart1');
			this.$chart.line2('chart2');
		}
	}
</script>

<style scoped>
    .hello{
        margin-top: 20px;
    }
    #chart1 {
        width: 600px;
        height: 650px;
        float: left;
    }

    #chart2 {
        width: 550px;
        height: 650px;
        float: right;
        margin-right: 20px;
    }
</style>
