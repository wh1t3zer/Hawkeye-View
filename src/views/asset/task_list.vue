<!--资产任务列表-->
<template>
    <div class="app-container">
        <div class="filter-container">
            <el-input v-model="listQuery.info" placeholder="Target" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
            <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">Search</el-button>
            <router-link :to="'/asset/task_add'">
                <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit">Add</el-button>
            </router-link>
        </div>

        <el-dialog title="任务预览" :visible.sync="dialog" width="50%">
            <pre overflow="hidden">{{dialogData}}</pre>
        </el-dialog>

        <el-table :key="tableKey" v-loading="listLoading" element-loading-text="玩命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" 
        :data="list" border fit highlight-current-row style="width: 100%;" :default-sort = "{prop: 'update_at', order: 'descending'}">
            <el-table-column label="任务名" min-width="40px" align="center">
                <template slot-scope="{row}">
                    <router-link :to="'/asset/view?id='+row.id">
                        <el-button type="text" size="mini" class="operation-btn">{{ row.name }}</el-button>
                    </router-link>
                </template>
            </el-table-column>
            <el-table-column label="探测目标" min-width="60px" align="center">
                <template slot-scope="{row}">
                    <span>{{row.target_list}}</span>
                </template>
            </el-table-column>
            <el-table-column label="Banner" min-width="90px" align="center">
                <template slot-scope="{row}">
                    <el-tag v-if="row.auth_scan" type="info">权限爆破</el-tag>
                    <el-tag v-if="row.poc_scan" type="warning">漏洞检测</el-tag>
                    <el-tag v-if="row.web_scan" type="danger">Web渗透</el-tag>
                    <el-tag v-if="row.trap_scan" type="success">蜜罐识别</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="扫描周期" min-width="30px" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.recursion|loadTypeFilter }}</span>
                </template>
            </el-table-column>
            <el-table-column label="资产数量" min-width="30px" align="center">
                <template slot-scope="{row}">
                    <span style="color:#ff9900">{{ row.asset_num }}</span>
                </template>
            </el-table-column>
            <el-table-column label="检测状态" min-width="40px" align="center">
                <template slot-scope="{row}">
                <el-tag v-if="row.status=='Successfully'" effect="dark" type="success">
                    <i  class="el-icon-finished"  style="margin-left:2%">{{ row.status }}</i>
                </el-tag>
                <el-tag v-else-if="row.status=='New'">
                    <i  class="el-icon-video-play" style="margin-left:2%" >{{ row.status }}</i>
                </el-tag>
                <el-tag v-else-if="row.status=='Processing'">
                    <i  class="el-icon-loading" style="margin-left:2%" >{{ row.status }}</i>
                </el-tag>
                <el-tag v-else>
                    <i  class="el-icon-error" style="margin-left:2%" >{{ row.status }}</i>
                </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="扫描时间" min-width="50px" align="center" prop="update_at" sortable>
                <template slot-scope="{row}"><span>{{ row.update_at }}</span></template>
            </el-table-column>
            <el-table-column label="创建时间" min-width="50px" align="center" prop="update_at" sortable>
                <template slot-scope="{row}"><span>{{ row.create_at }}</span></template>
            </el-table-column>
            <el-table-column fixed="right" label="Operation" align="center" width="120px" class-name="small-padding fixed-width">
                <template slot-scope="{row,$index}">
                    <el-dropdown :hide-on-click="false">
                        <span class="el-dropdown-link">选项卡<i class="el-icon-arrow-down el-icon--right"></i></span>
                        <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item><el-button type="text" @click="handleDialog(row)">任务详情</el-button></el-dropdown-item>
                        <el-dropdown-item>
                            <!-- <router-link :to="'/asset/discovery/task_edit?id='+row._id"> -->
                            <!-- <el-button type="text" class="operation-btn">编辑任务</el-button> -->
                            <!-- </router-link> -->
                        </el-dropdown-item>
                        <!-- <el-dropdown-item>
                            <el-button type="text" @click="rescan(row)">立即重扫</el-button>
                        </el-dropdown-item> -->
                        <el-dropdown-item>
                            <el-button type="text" @click="handleDelete(row,$index)">删除任务</el-button>
                        </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    </div>
</template>

<script>
import { InfoList } from "@/api/task"
import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

const StatusOptions = [
    { key: "0", display_name: "一次" },
    { key: "1", display_name: "每天" },
    { key: "7", display_name: "每周" },
    { key: "30", display_name: "每月" },
];

const loadTypeKeyValue = StatusOptions.reduce((acc, cur) => {
    acc[cur.key] = cur.display_name;
    return acc;
}, {});

export default {
    name: "instanceinfo_list",
    components: { Pagination },
    directives: { waves },
    filters: {
            loadTypeFilter(type) {return loadTypeKeyValue[type]},
    },
    data() {
        return {
            tableKey: 0,
            list: [
                {
                    id: 1,
                    web_rule_id: 0,
                    name: "test001",
                    target_list: "zan71.com",
                    web_scan: 1,
                    poc_scan: 1,
                    auth_scan: 1,
                    trap_scan: 1,
                    recursion: 0,
                    progress: "success",
                    percent: 100,
                    status: "success",
                    create_at: "2021-01-23T21:31:18+08:00",
                    update_at: "2021-01-24T14:07:56+08:00",
                    is_delete: 0
                },
            ],
            dialog: false,
            dialogData: {},
            dialogPortInfoList:[],
            total: 0,
            listLoading: false,
            listQuery: {page: 1, limit: 20, info: ""},
        };
    },
    created() {
        let task_name = this.$route.query.task_name
        this.listQuery.info = task_name
        this.getList();
    },
    methods: {
        // 获取列表
        getList() {
            this.list = []
            this.listLoading = true;
            InfoList(this.listQuery).then((response) => {
                this.list = response.data.list;
                this.total = response.data.total;
                console.log(response.data)
                setTimeout(() => { this.listLoading = false; }, 1 * 1000);
            });
        },
        // 根据单个实例，获取它的端口信息列表
        get_portinfo(instance_id){
            let query = {page_no: 1, page_size: 1000, info: instance_id}
            // PortInfoList(query).then((response) => {
            //     this.dialogPortInfoList = response.data.list;
            //     this.dialog = true
            // });
        },
        // 关键词查询
        handleFilter() {
            this.listQuery.page_no = 1;
            this.getList();
        },
        // 删除记录
        handleDelete(row, index) {
            this.$confirm("此操作将删除该记录, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                // DelDiscovery({ id: row._id }).then((response) => {
                //     this.$notify({ title: "Success", message: "Delete Successfully" + response.data.errmsg, type: "success", duration: 3000, });
                //     this.list.splice(index, 1);
                // }).catch(() => {
                //     this.$notify({title: "Failed", message: "Failed Delete", type: "danger", duration: 5000});
                // });
            })
        },
        handleDialog(row){
            this.dialogData = row
            this.dialog = true
        },
        rescan(row){
            // ExeDiscovery({"id": row._id}).then((response) => {
            //     console.log(response)
            //     this.$notify({title: "Success", message: "Rescan Successfully", type: "success", duration: 5000});
            //     this.getList() //刷新列表
            // }).catch(() => {
            //     this.$notify({title: "Failed", message: "Failed Execte Rescan.", type: "danger", duration: 5000});
            // });
        }
    },
};
</script>

<style>
.operation-btn {
  margin-right: 0px;
}
pre{
    white-space: pre-wrap;
    word-wrap: break-word;
}
</style>