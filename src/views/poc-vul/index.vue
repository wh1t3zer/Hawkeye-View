<template>
    <div class="app-container">
        <div class="filter-container">
            <el-input v-model="listQuery.info" placeholder="Target" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
            <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">Search</el-button>
        </div>

        <!--详情弹框-->
        <el-dialog title="漏洞详情" :visible.sync="dialog" width="66%">
            <el-form :model="dialogData" label-width="90px" size="mini" label-position="left">
                <el-form-item label="漏洞类型">
                    <el-radio-group v-model="dialogData.vul_type">
                        <el-radio label="RCE" border></el-radio>
                        <el-radio label="Weak Passwd" border></el-radio>
                        <el-radio label="Unauthorized" border></el-radio>
                        <el-radio label="File Upload" border></el-radio>
                        <el-radio label="SQL Injection" border></el-radio>
                        <el-radio label="Buffer Overflow" border></el-radio>
                        <el-radio label="Information Disclosure" border></el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <el-form ref="form" :inline="true" :model="dialogData" label-width="90px" size="mini" label-position="left">
                <el-form-item label="漏洞ID"><el-input v-model="dialogData.id" style="width:200px" disabled/></el-form-item>
                <el-form-item label="资产ID"><el-input v-model="dialogData.asset_id" style="width:200px" /></el-form-item>
                <el-form-item label="应用ID"><el-input v-model="dialogData.port_id" style="width:200px" /></el-form-item>
                <el-form-item label="插件ID"><el-input v-model="dialogData.plugin_id" style="width:200px" /></el-form-item>
                <el-form-item label="Target"><el-input v-model="dialogData.asset" style="width:200px" /></el-form-item>
                <el-form-item label="验证日期"><el-input v-model="dialogData.create_at" style="width:200px" /></el-form-item>
                <el-form-item label="应用名称"><el-input v-model="dialogData.app_name" style="width:200px" /></el-form-item>
                <el-form-item label="漏洞名称"><el-input v-model="dialogData.vul_name" style="width:200px" /></el-form-item>
            </el-form>
            <div style="text-align:center;margin-top:1%;background-color:#e7faf0;padding-bottom:2%">
                <el-tag type="success" style="font-size:20px;margin-bottom:2%;font-weight:600">漏洞验证</el-tag>
                <el-form v-model="dialogData" size="mini" label-width="90px" label-position="left">
                    <el-form-item label="URL"><el-input v-model="dialogData.verify_url"/></el-form-item>
                    <el-form-item label="Payload"><el-input v-model="dialogData.verify_payload" type="textarea"/></el-form-item>
                    <el-form-item label="Result"><el-input v-model="dialogData.verify_result"/></el-form-item>
                </el-form>
            </div>
            <div style="text-align:center;margin-top:1%;background-color:#e7faf0;padding-bottom:2%">
                <el-tag type="success" style="font-size:20px;margin-bottom:2%;font-weight:600">漏洞攻击</el-tag>
                <el-form v-model="dialogData" size="mini" label-width="90px" label-position="left">
                    <el-form-item label="URL"><el-input v-model="dialogData.exploit_url"/></el-form-item>
                    <el-form-item label="Payload"><el-input v-model="dialogData.exploit_payload" type="textarea"/></el-form-item>
                    <el-form-item label="Result"><el-input v-model="dialogData.exploit_result"/></el-form-item>
                </el-form>
            </div>
            <div style="text-align:center;margin-top:1%;background-color:#e7faf0;padding-bottom:2%">
                <el-tag type="success" style="font-size:20px;margin-bottom:2%;font-weight:600">漏洞利用</el-tag>
                <el-form v-model="dialogData" size="mini" label-width="90px" label-position="left">
                    <el-form-item label="URL"><el-input v-model="dialogData.webshell_url"/></el-form-item>
                    <el-form-item label="Payload"><el-input v-model="dialogData.webshell_payload" type="textarea"/></el-form-item>
                    <el-form-item label="Result"><el-input v-model="dialogData.webshell_result"/></el-form-item>
                </el-form>
            </div>
            <div style="text-align:center;margin-top:1%;background-color:#e7faf0;padding-bottom:2%">
                <el-tag type="success" style="font-size:20px;margin-bottom:2%;font-weight:600">木马植入</el-tag>
                <el-form v-model="dialogData" size="mini" label-width="90px" label-position="left">
                    <el-form-item label="URL"><el-input v-model="dialogData.trojan_url"/></el-form-item>
                    <el-form-item label="Payload"><el-input v-model="dialogData.trojan_payload" type="textarea" /></el-form-item>
                    <el-form-item label="Result"><el-input v-model="dialogData.trojan_result"/></el-form-item>
                </el-form>
            </div>
        </el-dialog>

        <!--控制台-->
        <el-dialog title="远程会话" :visible.sync="trojanDialog" width="40%" @close='closeDialog'>
            <div class="wrapper" style="height:450px">
                <div class="main" style="height:400px" ref="box">
                    <div v-for="(item, index) in output" :key="index">
                    <div v-if="item.iscli">
                        <svg-icon style="float: right; height: 30px; width: 30px" icon-class="people"/>
                        <div style="margin-right:10%"  align="right"> <pre><span>{{item.msg}}</span></pre></div>
                    </div>
                    <div v-else>
                        <svg-icon style="float: left; height: 30px; width: 30px" icon-class="international"/>
                        <div style="margin-left:10%"> <pre>{{item.msg}}</pre></div>
                    </div>
                </div>
                </div>
                <div style="margin-top: 15px; flex: 0;">
                    <el-input placeholder="请输入命令" v-model="input" @keyup.enter.native="send" class="input-with-select">
                        <template slot="prepend">Command：</template>
                        <el-button slot="append" icon="el-icon-s-promotion" @click="send">发送</el-button>
                    </el-input>
                </div>
            </div>
        </el-dialog>

        <!--列表-->
        <el-table v-loading="listLoading" element-loading-text="玩命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" 
        :data="list" border fit highlight-current-row style="width: 100%;" :default-sort = "{prop: 'date', order: 'descending'}">
            <el-table-column label="漏洞名称" min-width="60px" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.vul_name }}</span>
                </template>
            </el-table-column>
            <el-table-column label="隶属资产" min-width="30px" align="center">
                <template slot-scope="{row}">
                    <router-link :to="'/asset/info?instance_id='+row.task_id">
                        <el-button type="text" size="mini" class="operation-btn">{{ row.asset }}</el-button>
                    </router-link>
                </template>
            </el-table-column>
            <el-table-column label="目标应用" min-width="30px" align="center">
                <template slot-scope="{row}"><span>{{ row.app_name }}</span></template>
            </el-table-column>
            <el-table-column label="资产影响" min-width="60px" align="center">
                <template slot-scope="{row}">
                    <el-tag v-if="row.verify_result != ''" type="warning">Verify</el-tag>
                    <el-tag v-if="row.exploit_result != ''" type="warning">exploit</el-tag>
                    <el-tag v-if="row.webshell_result != ''" type="warning">webshell</el-tag>
                    <el-tag v-if="row.trojan_result != ''" type="warning">trojan</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="POC类型" min-width="30px" align="center">
                <template slot-scope="{row}"><el-tag effect="dark" type="danger">{{ row.vul_type }}</el-tag></template>
            </el-table-column>
            <el-table-column label="漏洞利用" min-width="30px" align="center">
                <template slot-scope="{row}">
                    <el-button v-if="row.line==0" size="mini" type="warning" slot="append" @click="handlerWs(row)" disabled>漏洞利用</el-button>
                    <el-button v-else size="mini" type="warning" slot="append" @click="handlerWs(row)">漏洞利用</el-button>
                </template>
            </el-table-column>
            
            <el-table-column label="检测日期" min-width="30px" align="center" prop="date" sortable>
                <template slot-scope="{row}">
                    <span>{{ row.create_at }}</span>
                </template>
            </el-table-column>
            <el-table-column label="Operation" align="center" width="180" class-name="small-padding fixed-width">
                <template slot-scope="{row,$index}">
                    <el-button type="primary" size="mini" class="operation-btn" @click="handleDialog(row)">详情</el-button>
                    <el-button type="danger" size="mini" @click="handleDelete(row,$index)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    </div>
</template>

<script>
import { VulList } from "@/api/poc_vul"
import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination


export default {
    components: { Pagination },
    directives: { waves },
    data() {
        return {
            list: [],
            dialog: false,
            dialogData: {},
            total: 0,
            listLoading: false,
            listQuery: {page: 1, limit: 20, info: ""},
            trojanDialog: false,
            path:"ws://127.0.0.1:8700/trojan/echo",
            socket:"",
            input: "",
            spareLine: undefined,
            output: []
        };
    },
    created() {
        let task_name = this.$route.query.task_name
        this.listQuery.info = task_name
        this.getList();
    },
    destroyed () {
        // 销毁监听
        if (this.socket){
            this.socket.onclose = this.close
        }
    },
    methods: {
      // 获取列表
        getList() {
            this.list = []
            this.listLoading = true;
            VulList(this.listQuery).then((response) => {
                this.list = response.data.list;
                this.total = response.data.total;
                setTimeout(() => { this.listLoading = false; }, 1.5 * 1000);
                console.log(this.list)
            });
        },
        // 关键词查询
        handleFilter() {
            this.listQuery.page = 1;
            this.getList();
        },
        // 删除记录
        handleDelete(row, index) {
            this.$confirm("此操作将删除该记录, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                console.log(row, index)
                // let deleteQuery = { id: row.id };
                // serviceDelete(deleteQuery).then((response) => {
                //   this.$notify({ title: "Success", message: "Delete Successfully" + response.data.errmsg, type: "success", duration: 3000, });
                //   this.list.splice(index, 1);
                // });
                this.$notify({title: "Success", message: "接口未实现", type: "success", duration: 5000});
            }).catch(() => {this.$notify({title: "Cancel", message: "Delete Cancel", type: "info", duration: 5000})});
        },
        handleDialog(row){
            this.dialog = true
            this.dialogData = row
        },
        // websocket通信
        handlerWs(row){
            if (row.line > 0){
                this.init(row)
                console.log(row)
                this.trojanDialog = true
            }else{
                this.$notify({title: "Warning", message: "线路必选", type: "warning", duration: 5000})
                return
            }
            
        },
        init: function (row) {
            this.output.push({iscli: true, msg: "发起连接请求"})
            if(typeof(WebSocket) === "undefined"){
                alert("您的浏览器不支持socket")
            }else{
                // 实例化socket
                let path = this.path + "?id="+ row.port_id + "&name=" + row.asset_name + "&line=" + row.line
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
            this.output.push({iscli: false, msg: "ws连接成功"})
            console.log("ws连接成功")
        },
        error: function () {
            this.output.push({iscli: false, msg: "ws连接错误"})
            console.log("ws连接错误")
        },
        getMessage: function (msg) {
            this.output.push({iscli: false, msg: msg.data})
            // console.log(msg.data)
            var div = this.$refs.box
            setTimeout(()=>{div.scrollTop = div.scrollHeight},0) // 拉到底部
        },
        send: function () {
            this.output.push({iscli: true, msg: this.input})
            this.socket.send(this.input)
            this.input = ""
            var div = this.$refs.box
            setTimeout(()=>{div.scrollTop = div.scrollHeight},0) // 拉到底部
        },
        close: function () {
            this.output.push({iscli: false, msg: "ws已经关闭"})
            console.log("ws已经关闭")
        },
        closeDialog(){
            this.output = []
            if (this.socket){
                this.socket.onclose = this.close()
            }
        }
    },
};
</script>

<style>
.operation-btn {
    margin-right: 10px;
}
pre { 
    white-space: pre-wrap; /*css-3*/ 
    white-space: -moz-pre-wrap; /*Mozilla,since1999*/ 
    white-space: -pre-wrap; /*Opera4-6*/ 
    white-space: -o-pre-wrap; /*Opera7*/ 
    word-wrap: break-word; /*InternetExplorer5.5+*/ 
}
</style>