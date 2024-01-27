<template>
    <div class="dashboard-editor-container">
        <!--中间四个看板-->
        <el-row :gutter="40">
            <el-col :xs="12" :sm="12" :lg="6" style="margin-bottom:10px;color:orange;">
                <el-form ref="form" :model="asset_info" label-width="80px" size="mini">
                    <el-form-item label="隶属任务">{{asset_info.task_name}}</el-form-item>
                    <el-form-item label="资产目标">{{asset_info.target}}</el-form-item>
                    <el-form-item label="IP地址">{{asset_info.ip}}</el-form-item>
                    <el-form-item label="设备类型">{{asset_info.vendor}}</el-form-item>
                    <el-form-item label="操作系统">{{asset_info.os}}</el-form-item>
                    <el-form-item label="区域信息">{{asset_info.area}}</el-form-item>
                    <el-form-item label="GPS坐标">{{asset_info.gps}}</el-form-item>
                    <el-form-item label="IP运营商">{{asset_info.isp}}</el-form-item>
                    <el-form-item label="探测时间">{{asset_info.date}}</el-form-item>
                </el-form>
            </el-col>
            <el-col :xs="12" :sm="12" :lg="6" style="margin-bottom:10px;">
                <!-- <box-card :data="box2"/> -->
                <p>我是个子域图，如果没有就是端口图</p>
            </el-col>
            <el-col :xs="24" :sm="24" :lg="12" style="margin-bottom:10px;">
                <!-- <box-card :data="box3"/> -->
                <p>我是个Web站点信息</p>
            </el-col>
        </el-row>
        <!--底下的漏洞及服务-->
        <el-row :gutter="40">
            <el-col :xs="36" :sm="36" :lg="18" style="margin-bottom:5px;">
                <p>我是个漏洞表</p>
            </el-col>
            <el-col :xs="12" :sm="12" :lg="6" style="margin-bottom:5px;">
                <!-- <box-card :data="box6"/> -->
                <p>我是个漏洞类型图、少于两个就是服务类型图</p>
            </el-col>
        </el-row>
    </div>
</template>

<script>
// import { InfoDetail } from "@/api/instance"
import waves from "@/directive/waves";

export default {
    name: "instance_info",
    directives: { waves },
    data() {
        return {
            asset_info:{
                task_name: "混合云渗透测试", target: "zan71.com", ip: "47.92.255.39", vendor: "Dell", 
                os: "Linux", area: "浙江省杭州市", gps: "30.2813,120.12", isp: "阿里云", date: "2021-01-27 20:30:21",
            }  // 资产基本信息   
        }
    },
    created(){
        let id = this.$route.query.id
        this.getDetail(id)
    },
    methods: {
        getDetail(id) {
            console.log(id)
            // let query = { instance_id: id }
            // InfoDetail(query).then((response) => {
                
            //     setTimeout(() => { this.isLoading = false; this.service_loading = false }, 1 * 1000)
            // })
        },
    }
};
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
        padding-left: 0px;
        padding-right: 0px;
        margin-bottom: 32px;
    }
}

@media (max-width:1024px) {
    .chart-wrapper {
        padding: 8px;
    }
}
</style>