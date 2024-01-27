<template>
    <div class="app-container">
        <div class="filter-container">
            <el-input v-model="listQuery.info" placeholder="key" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
            <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">Search</el-button>
            <router-link :to="'/web_vul/task_create'">
                <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit">Add</el-button>
            </router-link>
        </div>
        <!--弹出框-->
        <el-dialog title="任务详情" :visible.sync="dialog" width="40%">
            <pre overflow="hidden">{{dialogData}}</pre>
        </el-dialog>

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

        <el-table :key="tableKey" v-loading="listLoading" element-loading-text="玩命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" 
        :data="list" border fit highlight-current-row style="width: 100%;" :default-sort = "{prop: 'date', order: 'descending'}">
            <el-table-column type="selection" width="35px"></el-table-column>
            <el-table-column label="资产ID" prop="id" min-width="38px" align="center">
                <template slot-scope="{row}">
                    <router-link :to="'/web_vul/index?task_id='+row.asset_id">
                        <el-button type="text" size="mini" class="operation-btn">{{ row.asset_id }}</el-button>
                    </router-link>
                </template>
            </el-table-column>
            <el-table-column label="资产名" min-width="30px" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.asset_name }}</span>
                </template>
            </el-table-column>

            <el-table-column label="目标IP" width="300px" align="center">
                <template slot-scope="{row}">
                    <el-tag v-for="(item,index) in row.target_list" :key="index" type="" effect="plain" style="margin-right:10px;margin-top:2px">{{ item }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="远程会话" width="300px" align="center">
                <template slot-scope="{row}">
                    <div style="margin-top: 15px;">
                        <el-select style="width: 50%" size="mini" v-model="row.line" slot="prepend" placeholder="线路选择">
                            <el-option label="直通线路" value="2"></el-option>
                            <el-option label="穿透线路" value="1"></el-option>
                        </el-select>
                        <el-button v-if="row.is_Conn" size="mini" type="success" icon="el-icon-phone-outline" disabled>建立会话</el-button>
                        <el-button v-else size="mini" type="success" slot="append" icon="el-icon-phone-outline" @click="handlerWs(row)">建立会话</el-button>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="检测时间" min-width="30px" align="center" prop="date" sortable>
                <template slot-scope="{row}">
                    <span>{{row.date}}</span>
                </template>
            </el-table-column>
            <el-table-column label="Operation" align="center" min-width="40px" class-name="small-padding fixed-width">
                <template slot-scope="{row,$index}">
                    <el-button type="primary" size="mini" class="operation-btn" @click="handleDialog(row, $index)">详情</el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    </div>
</template>

<script>
import { TrojanList } from "@/api/trojan"
import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

export default {
    components: { Pagination },
    directives: { waves },
    data() {
        return {
            tableKey: 0,
            bug: true,
            colors: ['#F7BA2A', '#F7BA2A', '#FF4500'],
            list: [
                {
                  asset_id: "123",
                  is_Conn: 0,
                  asset_name: "weblogic",
                  spareLine: undefined,
                }
            ],
            dialog: false,
            dialogData: {},
            trojanDialog: false,
            total: 0,
            listLoading: false,
            listQuery: {page: 1, limit: 20, info: ""},
            path:"ws://127.0.0.1:8700/trojan/echo",
            socket:"",
            input: "",
            spareLine: undefined,
            output: []
        };
    },
    created() {
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
            TrojanList(this.listQuery).then((response) => {
                // let array = response.data.list;
                this.total = response.data.total;
                this.list = response.data.list;
                setTimeout(() => { this.listLoading = false; }, 1.5 * 1000);
            });
        },
        // 关键词查询
        handleFilter() {
            this.listQuery.page = 1;
            this.getList();
        },
        // 弹出任务详情
        handleDialog(row, index){
            if (index==10){
                console.log(index)
            }
            this.dialogData = row
            this.dialog = true
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
                let path = this.path + "?id="+ row.asset_id + "&name=" + row.asset_name + "&line=" + row.line
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
.dialog-list{
    width: 60%;
    word-wrap:break-word; 
    word-break:break-all;  
    overflow: hidden;   
}
pre{
    white-space: pre-wrap;
    word-wrap: break-word;
}
.wrapper {
    display: flex;
    flex-direction: column;
    min-height: 100%;
}

.header {
    flex: 0;
}

.main{
    flex: 1;
    overflow:auto;
}

.footer {
    flex: 0;
}

</style>