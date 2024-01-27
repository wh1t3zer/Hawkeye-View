<template>
    <div class="app-container">
        <div class="filter-container">
            <el-input v-model="listQuery.info" placeholder="Target" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
            <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">Search</el-button>
            <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-upload" @click="handleDialog(false)">新增插件</el-button>
        </div>

        <el-dialog :title="title_dialog" :visible.sync="dialog" width="70%">
            <el-form ref="form" :inline="true" :model="temp_data" label-width="80px" size="mini">
                <el-form-item label="蜜罐名称" required><el-input v-model="temp_data.honeypot"></el-input></el-form-item>
            </el-form>
            <el-form ref="form" :inline="true" :model="temp_data" label-width="80px" size="mini">
                <el-form-item label="蜜罐ID" required><el-input v-model="temp_data.trap_id"></el-input></el-form-item>
                <el-form-item label="插件名称" required><el-input v-model="temp_data.name"></el-input></el-form-item>
                <el-form-item label="插件作者" required><el-input v-model="temp_data.author"></el-input></el-form-item>
                <el-form-item label="应用协议" required><el-input v-model="temp_data.protocol"></el-input></el-form-item>
                <el-form-item label="应用名称" required><el-input v-model="temp_data.app_name"></el-input></el-form-item>
            </el-form>
            <el-form v-model="temp_data" size="mini" label-width="80px">
                <el-form-item label="插件描述" required><el-input v-model="temp_data.desc" type="textarea" :rows="2"></el-input></el-form-item>
                <el-form-item label="插件内容" required><el-input v-model="temp_data.content" type="textarea" :rows="20"></el-input></el-form-item>
            </el-form>
            <div style="text-align:center">
                <el-button v-if="is_add" type="primary" @click="onCreate">立即创建</el-button>
                <el-button v-else type="danger" @click="onUpdate">确认修改</el-button>
            </div>
        </el-dialog>

        <el-table v-loading="listLoading" element-loading-text="玩命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" 
        :data="list" border fit highlight-current-row style="width: 100%;" :default-sort = "{prop: 'plugin_date', order: 'descending'}">
            <el-table-column label="插件ID" min-width="15px" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.id }}</span>
                </template>
            </el-table-column>
            <el-table-column label="蜜罐服务ID" min-width="25px" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.trap_id }}</span>
                </template>
            </el-table-column>
            <el-table-column label="插件名" min-width="40px" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.name }}</span>
                </template>
            </el-table-column>
            <el-table-column label="蜜罐名称" min-width="30px" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.honeypot }}</span>
                </template>
            </el-table-column>
            <el-table-column label="应用" min-width="30px" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.app_name }}</span>
                </template>
            </el-table-column>
            <el-table-column label="协议" min-width="25px" align="center">
                <template slot-scope="{row}">
                    <span><el-tag effect="dark" type="warning">{{ row.protocol }}</el-tag></span>
                </template>
            </el-table-column>
            
            <el-table-column label="描述" min-width="100px" align="center" :show-overflow-tooltip="true">
                <template slot-scope="{row}">
                    <span>{{ row.desc }}</span>
                </template>
            </el-table-column>
            <el-table-column label="更新日期" min-width="40px" align="center" prop="plugin_date" sortable>
                <template slot-scope="{row}">
                    <span>{{ row.update_at }}</span>
                </template>
            </el-table-column>
            <el-table-column label="编写者" min-width="20px" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.author }}</span>
                </template>
            </el-table-column>
            <el-table-column label="Operation" align="center" width="170" class-name="small-padding fixed-width">
                <template slot-scope="{row,$index}">
                    <el-button type="primary" size="mini" @click="handleDialog(row)">编辑</el-button>
                    <el-button type="danger" size="mini" @click="handleDelete(row,$index)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    </div>
</template>

<script>
import { TrapPluginList, TrapPluginAdd, TrapPluginPut, TrapPluginDel } from "@/api/trap_plugin"
import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

export default {
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
            TrapPluginList(this.listQuery).then((response) => {
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
            TrapPluginAdd(data).then((response)=>{
                this.$notify({title: "Success", message: response.data, type: "success", duration: 5000});
                this.dialog = false
                this.getList()
            })
        },
        handleDelete(row, index) {
            this.$confirm("此操作将删除该记录, 是否继续?", "提示", {
                confirmButtonText: "确定", cancelButtonText: "取消", type: "warning",
            }).then(() => {
                TrapPluginDel({ id: row.id }).then(() => {
                    this.$notify({ title: "Success", message: "Delete Successfully" , type: "success", duration: 3000 })
                    this.list.splice(index, 1);
                }).catch(() => {
                    this.$notify({title: "Failed", message: "Failed Delete", type: "danger", duration: 5000})
                })
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
        }
    },
};
</script>
