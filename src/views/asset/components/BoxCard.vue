<template>
    <el-card class="box-card-component">
        <div slot="header" class="box-card-header">
            <img src="https://wpimg.wallstcn.com/e7d23d71-cf19-4b90-a1cc-f56af8c0903d.png">
        </div>
        
        <!--饼图-->
        <div v-if="data.type=='pie'" style="position:relative; padding-top: 15%">
            <pan-thumb :image="data.image" class="panThumb" />
            <mallki class-name="mallki-text" :text="data.title" />
            <pie-chart :chart-data="data"/>
        </div>

        <!--漏洞列表-->
        <div v-if="data.type=='table'" style="position:relative; padding-top: 10px">
            <pan-thumb :image="data.image" class="panThumb" />
            <mallki class-name="mallki-text" :text="data.title" />
            <el-table element-loading-background="rgba(0, 0, 0, 0.8)" :data="data.series" border fit highlight-current-row >
                <el-table-column label="资产ID" min-width="10px" align="center">
                    <template slot-scope="{row}">
                        <router-link :to="'/asset/info?instance_id='+row._id">
                            <el-button type="text" size="mini" class="operation-btn">{{ row.asset_id }}</el-button>
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column label="漏洞信息" min-width="45px" align="center">
                    <template slot-scope="{row}"><span>{{row.vul_name}}</span></template>
                </el-table-column>
                <el-table-column label="漏洞类型" min-width="20px" align="center">
                    <template slot-scope="{row}"><el-tag type="danger">{{ row.vul_type }}</el-tag></template>
                </el-table-column>
                <el-table-column label="创建日期" min-width="20px" align="center">
                    <template slot-scope="{row}"><span>{{ row.create_at }}</span></template>
                </el-table-column>
            </el-table>
        </div>
        
        <!--资产信息-->
        <div v-if="data.type=='info'" style="position:relative; padding-top: 15%">
            <pan-thumb :image="data.image" class="panThumb" />
            <mallki class-name="mallki-text" :text="data.title" />
            <el-form ref="form" :model="data" label-width="80px" size="mini" style="color:orange">
                <div style="position:absolute; padding:1% 0 0 75%; display:float">
                    <el-button type="text" class="sbutton" @click="honeypot">
                        <el-avatar :size="80" style="color:#fff;background-color:unset"> 可疑蜜罐 </el-avatar>
                    </el-button>
                </div>
                <el-form-item label="隶属任务"><span>{{data.task_name}}</span></el-form-item>
                <el-form-item label="资产目标">{{data.target}}</el-form-item>
                <el-form-item label="IP地址">{{data.ip}}</el-form-item>
                <el-form-item label="设备类型">{{data.vendor}}</el-form-item>
                <el-form-item label="探测时间">{{data.date}}</el-form-item>
            </el-form>
            <el-form ref="form" :inline="true" :model="data" label-width="80px" size="mini" style="color:orange;margin:0 auto">
                <el-form-item label="操作系统">{{data.os}}</el-form-item>
                <el-form-item label="区域信息">{{data.area}}</el-form-item>
                <el-form-item label="GPS坐标">{{data.gps}}</el-form-item>
                <el-form-item label="IP运营商">{{data.isp}}</el-form-item>
            </el-form>
        </div>
        <!--web信息-->
        <div v-if="data.type=='web'" style="position:relative; padding-top: 1%">
            <pan-thumb :image="data.image" class="panThumb" />
            <mallki class-name="mallki-text" :text="data.title" />
            <el-form ref="form" :model="data" label-width="110px" size="mini" style="color:orange">
                <!-- {{data}} -->
                <el-form-item label="Title">{{data.site}}</el-form-item>
                <el-form-item label="Server">{{data.server}}</el-form-item>
                <el-form-item label="Content-Type">{{data.content_type}}</el-form-item>
                <el-form-item label="SubDomain"><el-input type="text"  v-model="data.sub_domain"></el-input></el-form-item>
                <el-form-item label="Login Page"><el-input type="text"  v-model="data.login_list"></el-input></el-form-item>
                <el-form-item label="Upload Page"><el-input type="text"  v-model="data.upload_list"></el-input></el-form-item>
                <el-form-item label="Route URL"><el-input type="text"  v-model="data.route_list"></el-input></el-form-item>
                <el-form-item label="Resource"><el-input type="textarea"  v-model="data.resource_list"></el-input></el-form-item>
            </el-form>
        </div>
    </el-card>
</template>

<script>
/**
 * content_type = ''
let login_list = ''
let resource_list = ''
let route_list = ''
let server = ''
let start_url = ''
let sub_domain = ''
let site = ''
let upload_list = ''
 */
import PanThumb from '@/components/PanThumb'
import Mallki from '@/components/TextHoverEffect/Mallki'
import PieChart from './PieChart'
export default {
    components: { PanThumb, Mallki, PieChart },
    props: {
        data: {
            type: Object,
            default() {
                return {
                    pieData: {}
                }
            }
        }
    },
    watch: {
        data: {
            handler: function(newData) {
                this.data = newData
            }
        }
    },
    methods:{
        format(percentage) {return `${percentage}`},
        honeypot(){alert("yes")},
    }
}
</script>

<style lang="scss" >
.box-card-component{
    .el-card__header {
        padding: 0px!important;
    }
    .el-card__body {
        padding-top: 10px!important;
    }
}
</style>
<style lang="scss" scoped>
.box-card-component {
    height: 460px;
    overflow-y:auto;
    .box-card-header {
        position: relative;
        height: 30px;
        img {
            width: 100%;
            height: 100%;
            transition: all 0.2s linear;
            &:hover {
                transform: scale(1.5, 1.5);
                filter: contrast(130%);
            }
        }
    }
    .mallki-text {
        position: absolute;
        top: -15px;
        right: 0px;
        font-size: 18px;
        font-weight: bold;
    }
    .panThumb {
        z-index: 100;
        height: 40px!important;
        width: 40px!important;
        position: absolute!important;
        top: -40px;
        left: 0px;
        border: 4px solid #ffffff;
        background-color: #fff;
        margin: auto;
        box-shadow: none!important;
        ::v-deep .pan-info {
            box-shadow: none!important;
        }
    }
    .progress-item {
        margin-bottom: 10px;
        font-size: 14px;
    }
    @media only screen and (max-width: 1510px){
        .mallki-text{
            display: none;
        }
    }
}
.sbutton{
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
</style>
