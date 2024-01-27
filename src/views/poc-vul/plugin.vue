<template>
    <div class="app-container">
        <div class="filter-container">
            <el-input v-model="listQuery.info" placeholder="Target" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
            <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">Search</el-button>
            <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-upload" @click="handleDialog(false)">新增插件</el-button>
        </div>

        <el-dialog :title="title_dialog" :visible.sync="dialog" width="70%">
            <el-form :model="temp_data" label-width="80px" size="mini">
                <el-form-item label="漏洞类型" required>
                    <el-radio-group v-model="temp_data.vul_type">
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
            <el-form ref="form" :inline="true" :model="temp_data" label-width="80px" size="mini">
                <el-form-item label="漏洞ID" required><el-input v-model="temp_data.vul_id"></el-input></el-form-item>
                <el-form-item label="漏洞名称" required><el-input v-model="temp_data.vul_name"></el-input></el-form-item>
                <el-form-item label="漏洞日期" required><el-input v-model="temp_data.vul_date" placeholder="2020/01/01"></el-input></el-form-item>
                <el-form-item label="应用名称" required><el-input v-model="temp_data.app_name"></el-input></el-form-item>
                <el-form-item label="应用版本" required><el-input v-model="temp_data.app_version"></el-input></el-form-item>
                <el-form-item label="应用链接"><el-input v-model="temp_data.app_powerLink"></el-input></el-form-item>
                <el-form-item label="插件版本" required><el-input v-model="temp_data.version"></el-input></el-form-item>
                <el-form-item label="CNNVD"><el-input v-model="temp_data.cnnvd"></el-input></el-form-item>
                <el-form-item label="CVE-ID"><el-input v-model="temp_data.cve_id"></el-input></el-form-item>
                <el-form-item label="提交作者" required><el-input v-model="temp_data.author"></el-input></el-form-item>
                <el-form-item label="威胁等级" required>
                    <el-select v-model="temp_data.rank" placeholder="请选择威胁等级">
                        <el-option label="Fatal" :value="5"></el-option>
                        <el-option label="High" :value="4"></el-option>
                        <el-option label="Middle" :value="3"></el-option>
                        <el-option label="Normal" :value="2"></el-option>
                        <el-option label="Low" :value="1"></el-option>
                    </el-select>    
                </el-form-item>
            </el-form>
            <el-form v-model="temp_data" size="mini" label-width="80px">
                <el-form-item label="默认端口" required><el-input v-model="temp_data.default_ports" type="textarea" placeholder="80,8080"></el-input></el-form-item>
                <el-form-item label="默认服务" required><el-input v-model="temp_data.default_service" type="textarea" placeholder="https,redis"></el-input></el-form-item>
                <el-form-item label="漏洞描述" required><el-input v-model="temp_data.desc" type="textarea" placeholder="80,8080"></el-input></el-form-item>
                <el-form-item label="插件内容" required><el-input v-model="temp_data.content" type="textarea" :rows="10"></el-input></el-form-item>
            </el-form>
            <div style="text-align:center">
                <el-button v-if="is_add" type="primary" @click="onCreate">立即创建</el-button>
                <el-button v-else type="danger" @click="onUpdate">确认修改</el-button>
            </div>
        </el-dialog>

        <!-- <el-dialog title="插件详情" :visible.sync="info_dialog" width="50%">
            <pre overflow="hidden">{{info_data}}</pre>
        </el-dialog> -->

        <el-table v-loading="listLoading" element-loading-text="玩命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" 
        :data="list" border fit highlight-current-row style="width: 100%;" :default-sort = "{prop: 'plugin_date', order: 'descending'}">
            <el-table-column label="POC名称" min-width="40px" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.vul_name }}</span>
                </template>
            </el-table-column>
            <el-table-column label="POC类型" min-width="30px" align="center">
                <template slot-scope="{row}">
                    <span><el-tag effect="dark" type="warning">{{ row.vul_type }}</el-tag></span>
                </template>
            </el-table-column>
            <el-table-column label="受影响应用" min-width="30px" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.app_name }}</span>
                </template>
            </el-table-column>
            <el-table-column label="受影响版本" min-width="30px" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.app_version }}</span>
                </template>
            </el-table-column>
            <el-table-column label="描述" min-width="100px" align="center" :show-overflow-tooltip="true">
                <template slot-scope="{row}">
                    <span>{{ row.desc }}</span>
                </template>
            </el-table-column>
            <el-table-column label="漏洞日期" min-width="30px" align="center" prop="plugin_date" sortable>
                <template slot-scope="{row}">
                    <span>{{ row.vul_date }}</span>
                </template>
            </el-table-column>
            <el-table-column label="更新日期" min-width="40px" align="center" prop="plugin_date" sortable>
                <template slot-scope="{row}">
                    <span>{{ row.update_at }}</span>
                </template>
            </el-table-column>
            <el-table-column label="Operation" align="center" width="180" class-name="small-padding fixed-width">
                <template slot-scope="{row,$index}">
                    <el-button type="primary" size="mini" class="operation-btn" @click="handleDialog(row)">编辑</el-button>
                    <el-button type="danger" size="mini" @click="handleDelete(row,$index)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    </div>
</template>

<script>
import { PocPluginList, AddPlugin, PocDelPlugin} from "@/api/poc_plugin"
import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination


export default {
    name: "pocvul_plugin_list",
    components: { Pagination },
    directives: { waves },
    data() {
        return {
            list: [],
            dialog: false,
            is_add: false,  // 当前是添加还是修改操作
            title_dialog: "新增插件",
            temp_data: {},
            total: 0,
            listLoading: false,
            listQuery: {page: 1, limit: 20, info: ""}, //页码、条数、查询字段
        };
    },
    created() {
        let task_name = this.$route.query.task_name
        this.listQuery.info = task_name
        this.getList();
    },
    methods: {
        // 关闭子页
        closeChildPage() {
          this.$router.go(-1)
          this.$store.state.tagsView.visitedViews.splice(this.$store.state.tagsView.visitedViews.findIndex(item => item.path === this.$route.path), 1)
          this.$router.push(this.$store.state.tagsView.visitedViews[this.$store.state.tagsView.visitedViews.length - 1].path)
        },
        // 获取列表
        getList(){
            this.list = []
            this.listLoading = true;
            PocPluginList(this.listQuery).then((response) => {
                this.list = response.data.list;
                this.total = response.data.total;
                setTimeout(() => { this.listLoading = false }, 1.5 * 1000);
            });
        },
        // 关键词查询
        handleFilter(){
            this.listQuery.page_no = 1;
            this.getList();
        },
        // 插件详情
        handleDialog(row){
            if (row){  //编辑
                this.title_dialog ="编辑插件"
                this.is_add = false
                this.temp_data = row
            }else{  // 新增
                this.title_dialog ="新增插件"
                this.is_add = true
                this.temp_data = {}
            }
            this.dialog = true
        },
        // 打开新增插件会话框
        addplugin(){
            this.title_dialog = "新增插件",
            this.post_dialog = true
        },
        // 提交新建插件API  
        onCreate(){
            let data = this.temp_data
            AddPlugin(data).then((response)=>{
                this.$notify({title: "Success", message: response.data, type: "success", duration: 5000});
                this.closeChildPage()
            })
        },
        onUpdate(){
            let val = this.temp_data
            let data = {
                app_name: val.app_name, author: val.author, content: val.content, desc: val.desc,
                honeypot: val.honeypot, id: val.id, name: val.name, protocol: val.protocol, trap_id: val.trap_id
            }
            TrapPluginPut(data).then((response)=>{
                this.$notify({title: "Success", message: response.data, type: "success", duration: 5000});
                this.dialog = false
            })
        },
        // 删除记录
        handleDelete(row, index) {
            this.$confirm("此操作将删除该记录, 是否继续?", "提示", {
                confirmButtonText: "确定", cancelButtonText: "取消", type: "warning",
            }).then(() => {
                PocDelPlugin({ id: row.id }).then((response) => {
                    this.$notify({ title: "Success", message: "Delete Successfully" , type: "success", duration: 3000 })
                    this.list.splice(index, 1);
                }).catch(() => {
                    this.$notify({title: "Failed", message: "Failed Delete", type: "danger", duration: 5000})
                })
            })
        },
    },
};
</script>

<style>
.operation-btn {
    margin-right: 10px;
}
</style>