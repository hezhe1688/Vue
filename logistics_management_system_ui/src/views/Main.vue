<template>
    <div>
        <el-container>
            <!--侧边栏-->
            <el-aside width="210px" style="height: 710px">
                <el-menu default-active="2" :default-openeds="['2']" router>
                    <el-menu-item index="1" class="navigation-menu">
                        <span slot="title">Logistics Management</span>
                    </el-menu-item>
                    <el-menu-item index="">
                        <i class="el-icon-house"></i>
                        <span slot="title">首页</span>
                    </el-menu-item>
                    <el-submenu index="3">
                        <template slot="title"><i class="el-icon-film"></i>系统管理</template>
                        <el-menu-item index="/consumer">
                            <i class="el-icon-coordinate"></i>
                            <span slot="title">客户管理</span>
                        </el-menu-item>
                        <el-menu-item index="/order">
                            <i class="el-icon-shopping-cart-2"></i>
                            <span slot="title">订单管理</span>
                        </el-menu-item>
                        <el-menu-item index="/product">
                            <i class="el-icon-present"></i>
                            <span slot="title">产品管理</span>
                        </el-menu-item>
                        <el-menu-item index="/warehouse">
                            <i class="el-icon-coin"></i>
                            <span slot="title">仓库管理</span>
                        </el-menu-item>
                        <el-menu-item index="/deliveryStaff">
                            <i class="el-icon-place"></i>
                            <span slot="title">配送人员管理</span>
                        </el-menu-item>
                        <el-menu-item index="/automobile">
                            <i class="el-icon-truck"></i>
                            <span slot="title">配送车辆管理</span>
                        </el-menu-item>
                    </el-submenu>
                    <el-submenu index="4">
                        <template slot="title"><i class="el-icon-lock"></i>权限控制</template>
                        <el-menu-item index="/user">
                            <i class="el-icon-wind-power"></i>
                            <span slot="title">用户管理</span>
                        </el-menu-item>
                        <el-menu-item index="/role">
                            <i class="el-icon-bank-card"></i>
                            <span slot="title">角色管理</span>
                        </el-menu-item>
                        <el-menu-item index="/permission">
                            <i class="el-icon-key"></i>
                            <span slot="title">权限管理</span>
                        </el-menu-item>
                    </el-submenu>
                    <el-submenu index="5">
                        <template slot="title"><i class="el-icon-cpu"></i>系统监控</template>
                        <el-menu-item index="/swagger-ui.html#/">
                            <i class="el-icon-link"></i>
                            <span slot="title">Swagger2接口文档</span>
                        </el-menu-item>
                        <el-menu-item index="druid/index.html">
                            <i class="el-icon-wallet"></i>
                            <span slot="title">SQL监控</span>
                        </el-menu-item>
                        <el-menu-item index="5-3">
                            <i class="el-icon-no-smoking"></i>
                            <span slot="title">服务监控</span>
                        </el-menu-item>
                    </el-submenu>
                    <el-submenu index="6">
                        <template slot="title"><i class="el-icon-setting"></i>日志管理</template>
                        <el-menu-item index="/logs">
                            <i class="el-icon-mobile"></i>
                            <span slot="title">登录日志</span>
                        </el-menu-item>
                    </el-submenu>
                    <el-submenu index="7">
                        <template slot="title"><i class="el-icon-pie-chart"></i>运维管理</template>
                        <el-menu-item>
                            <i class="el-icon-notebook-1"></i>
                            <span slot="title">服务器</span>
                        </el-menu-item>
                        <el-menu-item>
                            <i class="el-icon-office-building"></i>
                            <span slot="title">应用管理</span>
                        </el-menu-item>
                        <el-menu-item>
                            <i class="el-icon-data-line"></i>
                            <span slot="title">部署管理</span>
                        </el-menu-item>
                        <el-menu-item>
                            <i class="el-icon-c-scale-to-original"></i>
                            <span slot="title">部署备份</span>
                        </el-menu-item>
                        <el-menu-item>
                            <i class="el-icon-set-up"></i>
                            <span slot="title">数据库管理</span>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <el-container>
                <!--头部信息-->
                <el-header>
                    <span class="left">物流管理系统后台管理</span>
                    <span class="right">
                        <el-link :underline="false" icon="el-icon-time" >{{nowTime}}</el-link>
                        <el-link :underline="false" style="margin-left: 15px">网站首页</el-link>
                        <el-link :underline="false" style="margin-left: 15px">贺哲</el-link>
                        <el-link :underline="false" icon="el-icon-switch-button" style="margin-left: 15px">退出登录</el-link>
                    </span>
                </el-header>
                <!--中间区域-->
                <el-main>
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
	export default {
		name: "Main",
		data() {
			return {
				nowTime: ''
			}
		},
		methods: {
			timeFormate(timeStamp) {
				let year = new Date(timeStamp).getFullYear();
				let month = new Date(timeStamp).getMonth() + 1 < 10 ? "0" + (new Date(timeStamp).getMonth() + 1) : new Date(timeStamp).getMonth() + 1;
				let date = new Date(timeStamp).getDate() < 10 ? "0" + new Date(timeStamp).getDate() : new Date(timeStamp).getDate();
				let hh = new Date(timeStamp).getHours() < 10 ? "0" + new Date(timeStamp).getHours() : new Date(timeStamp).getHours();
				let mm = new Date(timeStamp).getMinutes() < 10 ? "0" + new Date(timeStamp).getMinutes() : new Date(timeStamp).getMinutes();
				let ss = new Date(timeStamp).getSeconds() < 10 ? "0" + new Date(timeStamp).getSeconds() : new Date(timeStamp).getSeconds();
				this.nowTime = year + "." + month + "." + date + "  " + "星期" + '日一二三四五六'.charAt(new Date().getDay()) + " " + hh + ":" + mm + ':' + ss;
			},
			nowTimes() {
				this.timeFormate(new Date());
				setInterval(this.nowTimes, 1000);
				this.clear()
			},
			clear() {
				clearInterval(this.nowTimes)
				this.nowTimes = null;
			}
		},
		mounted() {
			this.nowTimes();
		},
		beforeDestroy() {
			this.clear();
		}
	}
</script>

<style scoped>
    * {
        margin: 0;
        padding: 0;
    }

    .el-header {
        line-height: 60px;
    }

    .el-aside {
        color: #333;
    }

    .navigation-menu {
        color: #409EFF;
        font-size: 18px;
        font-family: Arial, sans-serif;
        font-style: italic;
    }

    .el-header .left {
        font-size: 20px;
        letter-spacing: 2px;
        color: #409EFF;
        font-style: italic;
        margin-left: 30px;
        text-shadow: 1px 1px 1px ghostwhite;
    }

    .el-header .right {
        float: right;
        margin-right: 20px;
        font-size: 14px;
    }

</style>
