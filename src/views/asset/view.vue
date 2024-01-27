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
        <!--新建扫描任务-->
        <el-row :gutter="40">
            <el-col :xs="48" :sm="48" :lg="24" style="margin-bottom:0px;">
                <div style="text-align:center">
                    <el-button class="sbutton" circle @click="start_scan" size="mini">
                        <el-progress v-if="status=='New'" type="circle" :percentage="0" :width="45" :format="format"></el-progress>
                        <el-progress v-else-if="status=='Processing'" type="circle" :percentage="percent" :width="45"></el-progress>
                        <el-progress v-else-if="status=='Stop'" type="circle" :percentage="percent" :width="45" status="warning"></el-progress>
                        <el-progress v-else-if="status=='Failed'" type="circle" :percentage="percent" :width="45" status="exception"></el-progress>
                        <el-progress v-else-if="status=='Successfully'" type="circle" :percentage="100" :width="45" status="success"></el-progress>
                    </el-button>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import PanelGroup from '../dashboard/components/PanelGroup'
import BoxCard from '../dashboard/components/BoxCard'
import { TaskInfo, TaskDetail, TaskExec } from "@/api/task"

export default {
    name: 'DashboardAdmin',
    components: {PanelGroup, BoxCard},
    data() {
        return {
            task_id: 0,
            socket:"",
            percent: 0,
            status: "Successfully", // 空字符串表示
            box1:{
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
                    { value: 12, name: 'account' }, { value: 10, name: 'cloud' }, { value: 9, name: 'smtp' },
                ]
            },
            box3: {
                'title': 'Software', 'image': '/img/vul.png', 'type': 'pie',
                'series': [
                    {name: 'Vsftpd', value: 12}, {name: 'Weblogic', value: 8}, {name: 'Flink', value: 7},
                    {name: 'OpenSSH', value: 4}, {name: 'IIS', value: 2}, {name: 'Nginx', value: 1}, {name: 'Redis', value: 1}
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
                    {
                        "id": 7, "asset_id": 55,
                        "asset": "172.31.50.252:8081", "vul_name": "Apache Flink RCE",
                        "vul_type": "RCE", "create_at": "2021-01-29 15:05:02",
                    },
                    {
                        "id": 8, "asset_id": 55, "asset": "172.31.50.252:7001",
                        "vul_name": "Weblogic 'wls-wsat' XMLDecoder 反序列化漏洞",
                        "vul_type": "RCE", "create_at": "2021-01-29 15:05:03",
                    },
                    {
                        "id": 8, "asset_id": 56, "asset": "172.31.50.253:21",
                        "vul_name": "FTP Week Password",
                        "vul_type": "Weak Passwd", "create_at": "2021-01-29 15:05:03",
                    },
                    {
                        "id": 8, "asset_id": 57, "asset": "172.31.50.254:6379",
                        "vul_name": "Redis Unauthorized",
                        "vul_type": "Unauthorized", "create_at": "2021-01-29 15:05:04",
                    },
                    {
                        "id": 8, "asset_id": 57, "asset": "172.31.50.254:8080",
                        "vul_name": "Zabbix SQL Injection",
                        "vul_type": "SQL Injection", "create_at": "2021-01-29 15:05:05",
                    }
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
                'title': 'Penetration', 'image': '/img/domain.png', 'type': 'timeline',
                'series': [
                    {content: '支持使用图标', timestamp: '2018-04-12 20:46', size: 'large', type: 'success', icon: 'el-icon-check' },
                    {content: '支持自定义尺寸', timestamp: '2018-04-03 20:46', size: 'large', type:"primary", icon: 'el-icon-loading' },
                    {content: '支持自定义颜色', timestamp: '2018-04-03 20:46', color: '#688', size: 'large'}, { content: '默认样式的节点', timestamp: '2018-04-03 20:46'}
                ]
            },
            panel_data: {
                'vul_count': 11, // 漏洞威胁
                'asset_count': 47, //插件数量
                'resource_count': 8, //弱口令
                'service_count': 5 //资产统计
            },
        }
    },
    created() {
        this.task_id = this.$route.query.id
        // 对版图进行赋值
        this.initPage()
    },
    destroyed: function () {
        console.log("离开了")
        // 销毁监听
        if(this.socket){
            this.socket.close();
            let _this=this
            this.socket.onclose = function(evt) {
                console.log("websocket已关闭"); 
            };
        }
    },
   
    methods: {
        format(percentage){
            return percentage === 0 ? '扫描' : `${percentage}%`;
        },
        initPage(){
            TaskInfo({"id": this.task_id}).then((response) => {
                var resp = response.data
                if (status=='New'){console.log("未开始的", status)}
                else if(this.status != 'Finished'){this.handlerWs()}  //正在执行, 进行刷新数据
                else{ 
                    this.fetchData() 
                    console.log("已完成的", status)
                }
            });
        },
        // 静态一次性赋值
        fetchData(){
            TaskDetail({"id": this.task_id}).then((response) => {
                console.log(response.data)
                let resp = response.data
                this.percent = resp.percent
                this.status = resp.status
                this.panel_data = resp.panel_data
                this.box1 = resp.box1
                this.box2 = resp.box2
                this.box3 = resp.box3
                this.box4 = resp.box4
                this.box5 = resp.box5
                this.box6 = resp.box6
            }).catch(()=>{
                this.$notify({title: "Failed", message: "服务不可用", type: "error", duration: 5000})
            })
        },
        // 执行任务,并刷新本页数据
        start_scan(){
            this.percent = 0
            this.status = "Processing"
            TaskExec({"id": this.task_id}).then(() => {
                this.$notify({title: "Success", message: "执行成功", type: "success", duration: 5000})
                setTimeout(() => { this.handlerWs() }, 2 * 1000);
            }).catch(()=>{
                this.$notify({title: "Failed", message: "服务不可用", type: "error", duration: 5000})
            })
        },
        // websocket通信
        handlerWs: function () {
            if(typeof(WebSocket) === "undefined"){
                alert("您的浏览器不支持wsocket")
            }else{
                // 实例化socket
                let path = "ws://127.0.0.1:8700/task/stat" + "?id="+ this.task_id
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
            this.socket.send("")
        },
        closeWebsocket(){
            if(this.socket){
                this.socket.close();
                let _this=this
                this.socket.onclose = function(evt) {
                    console.log("websocket已关闭"); 
                };
            }
        },
        update(msg){
            var obj = JSON.parse(msg.data)
            this.percent = obj.percent
            this.status = obj.status
            this.panel_data = obj.panel_data
            this.box1 = obj.box1
            this.box2 = obj.box2
            this.box3 = obj.box3
            this.box4 = obj.box4
            this.box5 = obj.box5
            this.box6 = obj.box6
            if (this.status == 'Successfully'){
                this.socket.close();
                let _this=this
                this.socket.onclose = function(evt) {
                    console.log("websocket已关闭"); 
                };
            }
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
.el-progress__text{
    color: #fff;
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

 