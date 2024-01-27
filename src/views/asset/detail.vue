<template>
    <div class="dashboard-editor-container">
        <!--中间四个看板-->
        <el-row :gutter="40">
            <el-col :xs="12" :sm="12" :lg="6" style="margin-bottom:10px;">
                <box-card :data="asset_info"/>
            </el-col>
            <el-col :xs="12" :sm="12" :lg="6" style="margin-bottom:10px;">
                <box-card :data="box1"/>
            </el-col>
            <el-col :xs="24" :sm="24" :lg="12" style="margin-bottom:10px;">
                <box-card :data="box2"/>
            </el-col>
        </el-row>
        <!--底下的漏洞及进度-->
        <el-row :gutter="40">
            <el-col :xs="36" :sm="36" :lg="18" style="margin-bottom:5px;">
                <box-card :data="box3"/>
            </el-col>
            <el-col :xs="12" :sm="12" :lg="6" style="margin-bottom:5px;">
                <box-card :data="box6"/>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import BoxCard from './components/BoxCard'
import { AssetDetail } from "@/api/asset"

export default {
    components: {BoxCard},
    data() {
        return {
            asset_info:{
                title: 'Asset Info', 'type': 'info', 'image': '/img/service.png',
                task_name: "混合云渗透测试", target: "zan71.com", ip: "47.92.255.39", vendor: "Dell", 
                os: "Linux", area: "浙江省杭州市", gps: "30.2813,120.12", isp: "阿里云", date: "2021-01-27 20:30:21",
            },  // 资产基本信息 
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
                    {_id: "5f895e84230e4f1c78ac7b8b", target: "172.31.50.0/24", name: "开发环境资产探测1",user: 'Admin'},
                    {_id: "5f895e84230e4f1c78ac7b8b", target: "172.31.50.0/24", name: "开发环境资产探测2",user: 'Admin'},
                    {_id: "5f895e84230e4f1c78ac7b8b", target: "172.31.50.0/24", name: "开发环境资产探测3",user: 'Admin'},
                    {_id: "5f895e84230e4f1c78ac7b8b", target: "172.31.50.0/24", name: "开发环境资产探测4",user: 'Admin'},
                    {_id: "5f895e84230e4f1c78ac7b8b", target: "172.31.50.0/24", name: "开发环境资产探测5",user: 'Admin'},
                    {_id: "5f895e84230e4f1c78ac7b8b", target: "172.31.50.0/24", name: "开发环境资产探测6",user: 'Admin'},
                    {_id: "5f895e84230e4f1c78ac7b8b", target: "172.31.50.0/24", name: "开发环境资产探测7",user: 'Admin'},
                ]
            },
            box6:{
                'title': 'WebSite', 'image': '/img/domain.png', 'type': 'pie',
                'series': [
                    {name: 'Web Server', value: 2}, {name: 'Content Type', value: 2}, {name: 'Login Page', value: 3},
                    {name: 'Upload Page', value: 2}, {name: 'Sub Domain', value: 8}, {name: 'Site URL', value: 33}, {name: 'Resource Path', value: 186}
                ]
            },
        }
    },
    created() {
        let id = this.$route.query.id
        this.getDetail(id)
    },
   
    methods: {
        getDetail(id){
            AssetDetail({id: id}).then((response) => {
                console.log(response.data)
                let resp = response.data
                this.asset_info =resp.asset_info
                this.box1 = resp.box1
                this.box2 = this.webhandler(resp.web_list)
                this.box3 = resp.vul_list
            });
        },
        /**
         * content_type:"text/html"
            id:31
            login_list:""
            port_id:324
            resource_list:"assets/favicon/favicon.ico,assets/favicon/manifest.json,assets/favicon/favicon-16x16.png,assets/favicon/browserconfig.xml,assets/favicon/favicon-32x32.png,assets/favicon/apple-touch-icon.png,assets/favicon/safari-pinned-tab.svg"
            route_list:""
            server:""
            start_url:"http://172.31.50.252:8081"
            sub_domain:""
            title:"Apache Flink Web Dashboard"
            upload_list:""
        */
        // 将web数组进行进行组合
        webhandler(obj){
            let content_type = ''
            let login_list = ''
            let resource_list = ''
            let route_list = ''
            let server = ''
            let start_url = ''
            let sub_domain = ''
            let site = ''
            let upload_list = ''
            for(let i=0;i<obj.series.length;i++){
                let item = obj.series[i]
                content_type += item.content_type
                login_list += item.login_list
                resource_list += item.resource_list
                route_list += item.route_list
                server += item.server
                start_url += item.start_url
                sub_domain += item.sub_domain
                site += item.title
                upload_list += item.upload_list
            }
            let box2 = {
                title: obj.title, type: obj.type, image: obj.image,
                content_type: content_type, login_list: login_list, resource_list: resource_list, route_list: resource_list,
                server: server, start_url: start_url, sub_domain: sub_domain, site: site,upload_list: upload_list
            }
            return box2
        }
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

</style>

 