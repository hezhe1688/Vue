<template>
    <div>
        <el-container>
            <!--侧边栏-->
            <el-aside width="210px" style="height: 710px">
                <el-menu default-active="2" :default-openeds="['2']" router >
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
                        <el-menu-item index="3-3">
                            <i class="el-icon-present"></i>
                            <span slot="title">产品管理</span>
                        </el-menu-item>
                        <el-menu-item index="3-4">
                            <i class="el-icon-coin"></i>
                            <span slot="title">仓库管理</span>
                        </el-menu-item>
                        <el-menu-item index="3-5">
                            <i class="el-icon-truck"></i>
                            <span slot="title">配送车辆管理</span>
                        </el-menu-item>
                        <el-menu-item index="3-6">
                            <i class="el-icon-place"></i>
                            <span slot="title">配送人员管理</span>
                        </el-menu-item>
                    </el-submenu>
                    <el-submenu index="4">
                        <template slot="title"><i class="el-icon-lock"></i>权限控制</template>
                        <el-menu-item index="4-1">
                            <i class="el-icon-wind-power"></i>
                            <span slot="title">用户管理</span>
                        </el-menu-item>
                        <el-menu-item index="4-2">
                            <i class="el-icon-bank-card"></i>
                            <span slot="title">角色管理</span>
                        </el-menu-item>
                        <el-menu-item index="4-3">
                            <i class="el-icon-key"></i>
                            <span slot="title">权限管理</span>
                        </el-menu-item>
                    </el-submenu>
                    <el-submenu index="5">
                        <template slot="title"><i class="el-icon-cpu"></i>系统监控</template>
                        <el-menu-item index="5-1">
                            <i class="el-icon-orange"></i>
                            <span slot="title">在线用户</span>
                        </el-menu-item>
                        <el-menu-item index="5-2">
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
                        <el-menu-item index="6-1">
                            <i class="el-icon-folder-opened"></i>
                            <span slot="title">操作日志</span>
                        </el-menu-item>
                        <el-menu-item index="6-2">
                            <i class="el-icon-document-copy"></i>
                            <span slot="title">日志备份</span>
                        </el-menu-item>
                        <el-menu-item index="6-3">
                            <i class="el-icon-mobile"></i>
                            <span slot="title">登录日志</span>
                        </el-menu-item>
                        <el-menu-item index="6-4">
                            <i class="el-icon-attract"></i>
                            <span slot="title">异常日志</span>
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
                        <el-dropdown>
                            <i class="el-icon-setting" style="margin-right: 10px"></i>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item>查看</el-dropdown-item>
                                <el-dropdown-item>新增</el-dropdown-item>
                                <el-dropdown-item>删除</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                        <el-avatar> 贺哲 </el-avatar>
                    </span>
                    <el-divider></el-divider>
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
			const item = {
				date: '2016-05-02',
				name: '王小虎',
				address: '上海市普陀区金沙江路 1518 弄'
			};
			return {
				tableData: Array(20).fill(item)
			}
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
