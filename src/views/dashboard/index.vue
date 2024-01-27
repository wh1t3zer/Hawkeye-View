<template>
    <div class="dashboard-editor-container">
        <!--头顶四个-->
        <panel-group :data="panel_data" />
        <!--中间四个看板-->
        <el-row :gutter="40">
            <el-col :xs="12" :sm="12" :lg="6" style="margin-bottom:10px;">
                <box-card :data="box1" />
            </el-col>
            <el-col :xs="12" :sm="12" :lg="6" style="margin-bottom:10px;">
                <box-card :data="box2"/>
            </el-col>
            <el-col :xs="12" :sm="12" :lg="6" style="margin-bottom:10px;">
                <box-card :data="box3"/>
            </el-col>
            <el-col :xs="12" :sm="12" :lg="6" style="margin-bottom:10px;">
                <box-card :data="box4"/>
            </el-col>
        </el-row>
        <!--底下的漏洞及进度-->
        <el-row :gutter="40">
            <el-col :xs="36" :sm="36" :lg="18" style="margin-bottom:5px;">
                <box-card :data="box5"/>
            </el-col>
            <el-col :xs="12" :sm="12" :lg="6" style="margin-bottom:5px;">
                <box-card :data="box6"/>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import BoxCard from './components/BoxCard'

export default {
    name: 'DashboardAdmin',
    components: {PanelGroup, BoxCard},
    data() {
        return {
            socket:"",
            box1: {
                'title': 'AssetVendor', 'image': '/img/service.png', 'type': 'pie',
                'series': [
                    {name: 'Windows', value: 12}, {name: 'Linux', value: 8}, {name: 'Centos', value: 7}, {name: 'Cisco', value: 5},
                    {name: 'Ubuntu', value: 4}, {name: 'Debian', value: 2}, {name: 'Arm', value: 1}, {name: 'Huawei', value: 1}
                ]
            },
            box2: {
                'title': 'SubDoamin', 'image': '/img/domain.png', 'type': 'pie',
                'series': [
                    { value: 32, name: 'www' }, { value: 24, name: 'mail' }, { value: 14, name: 'cdn' },
                    { value: 12, name: 'account' }, { value: 10, name: 'clound' }, { value: 9, name: 'smtp' },
                ]
            },
            box3: {
                'title': 'Software', 'image': '/img/vul.png', 'type': 'pie',
                'series': [
                    {name: 'Vsftpd', value: 12}, {name: 'Weblogic', value: 8}, {name: 'Flink', value: 7},
                    {name: 'OpenSSH', value: 4}, {name: 'IIS', value: 2}, {name: 'Nginx', value: 1}
                ]
            },
            box4: {
                'title': 'Vul Type', 'image': '/img/hack.png', 'type': 'pie',
                'series': [
                    { value: 320, name: 'RCE' }, { value: 240, name: 'Weak Passwd' },{ value: 100, name: 'Unauthorized' },{ value: 120, name: 'File Upload' },
                    { value: 149, name: 'SQL Injection' }, { value: 79, name: 'Buffer Overflow' }, { value: 79, name: 'Information Disclosure' },
                ]
            },
            box5: {
                'title': 'Vulnerability', 'image': '/img/vul.png', 'type': 'table',
                'series': [
                    
                ]
            },
            box6:{
                'title': 'WebSite', 'image': '/img/domain.png', 'type': 'line',
                'series': [
                    {name: 'Web Server', value: 2}, {name: 'Content Type', value: 2}, {name: 'Login Page', value: 3},
                    {name: 'Upload Page', value: 2}, {name: 'Sub Domain', value: 8}, {name: 'Site URL', value: 33}, {name: 'Resource Path', value: 186}
                ]
            },
            box6_bak:{
                'title': 'Penetration', 'image': '', 'type': 'timeline',
                'series': [
                    {content: '支持使用图标', timestamp: '2018-04-12 20:46', size: 'large', type: 'success', icon: 'el-icon-check' },
                    {content: '支持自定义尺寸', timestamp: '2018-04-03 20:46', size: 'large', type:"primary", icon: 'el-icon-loading' },
                    {content: '支持自定义颜色', timestamp: '2018-04-03 20:46', color: '#688', size: 'large'}, { content: '默认样式的节点', timestamp: '2018-04-03 20:46'}
                ]
            },
            panel_data: {
                'vul_count': 23, // 漏洞威胁
                'asset_count': 42, //插件数量
                'ip_count': 8, //弱口令
                'resource_count': 5 //资产统计
            },
        }
    },
    created() {
        this.handlerWs()
    },
    destroyed: function () {
        console.log("离开了")
        // 销毁监听
        if(this.socket){
            this.socket.close();
            this.socket.onclose = function(evt) {
                console.log("websocket已关闭", evt); 
            };
        }
    },
   
    methods: {
        // websocket通信
        handlerWs(){
            this.init()
        },
        init: function () {
            if(typeof(WebSocket) === "undefined"){
                alert("您的浏览器不支持wsocket")
            }else{
                // 实例化socket
                let path = "ws://127.0.0.1:8700/dashboard/all"
                this.socket = new WebSocket(path)
                // 监听socket连接
                this.socket.onopen = this.open
                // 监听socket错误信息
                this.socket.onerror = this.error
                // 监听socket消息
                this.socket.onmessage = this.getMessage
            }
        },
        open: function () {
            console.log("ws连接成功")
        },
        error: function () {
            console.log("ws连接错误")
        },
        getMessage: function (msg) {
            this.update(msg)
        },
        send: function () {
            this.socket.send("dd")
        },
        closeWebsocket(){
            if(this.socket){
                this.socket.close();
                this.socket.onclose = function(evt) {
                    console.log("websocket已关闭", evt); 
                };
            }
        },
        update(msg){
            var obj = JSON.parse(msg.data)
            this.panel_data = obj.panel_data
            this.box1 = obj.box1
            this.box2 = obj.box2
            this.box3 = obj.box3
            this.box4 = obj.box4
            this.box5 = obj.box5
            this.box6 = obj.box6
            console.log(this.box6)
        },
    }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
    padding-top: 8px;
    padding-right: 20px;
    padding-left: 20px;
    background-color: rgb(240, 242, 245);
    position: relative;

    .github-corner {
        position: absolute;
        top: 0px;
        border: 0;
        right: 0;
    }

    .chart-wrapper {
        padding: 0px;
        padding-left: -20px;
        padding-right: -20px;
        margin-bottom: 32px;
    }
}

@media (max-width:1024px) {
    .chart-wrapper {
        padding: 8px;
    }
}
.sbutton {
		padding: 5px 5px;
		border-radius: 50px;
		background: #232B30; /* old browsers */
		background: -moz-linear-gradient(top, #3D4850 3%, #313d45 4%, #232B30 100%); /* firefox */
		background: -webkit-gradient(linear, left top, left bottom, color-stop(3%,#3D4850), color-stop(4%,#313d45), color-stop(100%,#232B30)); /* webkit */
		filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#3D4850', endColorstr='#232B30',GradientType=0 ); /* ie */
		box-shadow: 1px 1px 1px rgba(0,0,0,0.2); /* CSS3 */
		-moz-box-shadow: 1px 1px 1px rgba(0,0,0,0.2); /* Firefox */
		-webkit-box-shadow: 1px 1px 1px rgba(0,0,0,0.2); /* Safari, Chrome */
	  }
    .sbutton:hover {
        color: #fff;
        background: #4C5A64; /* old browsers */
        background: -moz-linear-gradient(top, #4C5A64 3%, #404F5A 4%, #2E3940 100%); /* firefox */
        background: -webkit-gradient(linear, left top, left bottom, color-stop(3%,#4C5A64), color-stop(4%,#404F5A), color-stop(100%,#2E3940)); /* webkit */
        filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#4C5A64', endColorstr='#2E3940',GradientType=0 ); /* ie */
    }
    .sbutton:active {
        background-position: 0 top;
        position: relative;
        top: 1px;
        color: #fff;
        background: #20282D; /* old browsers */
        background: -moz-linear-gradient(top, #20282D 3%, #252E34 51%, #222A30 100%); /* firefox */
        background: -webkit-gradient(linear, left top, left bottom, color-stop(3%,#20282D), color-stop(51%,#252E34), color-stop(100%,#222A30)); /* webkit */
        filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#20282D', endColorstr='#222A30',GradientType=0 ); /* ie */
        -moz-box-shadow: 1px 1px 1px rgba(255,255,255,0.1); /* Firefox */
        -webkit-box-shadow: 1px 1px 1px rgba(255,255,255,0.1); /* Safari, Chrome */
        box-shadow: 1px 1px 1px rgba(255,255,255,0.1); /* CSS3 */
    }
</style>

 