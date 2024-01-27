<!--资产列表-->
<template>
    <div class="app-container">
        <div class="filter-container">
            <el-input v-model="listQuery.info" placeholder="Target" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
            <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">Search</el-button>
            <el-button class="filter-item" style="margin-left: 10px;" type="danger" icon="el-icon-delete" @click="arrayDel">批量删除</el-button>
        </div>

        <el-dialog title="资产预览" :visible.sync="dialog" width="30%">
            <pre overflow="hidden">{{dialogData}}</pre>
        </el-dialog>

        <el-table v-loading="listLoading" element-loading-text="玩命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" 
        :data="list" border fit highlight-current-row style="width: 100%;" :default-sort = "{prop: 'update_at', order: 'descending'}" ref="multipleTable" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="35px">
            </el-table-column>
            <el-table-column label="所属任务" min-width="40px" align="center">
                <template slot-scope="{row}">
                    <!-- <router-link :to="'/asset/info?id='+row.id"> -->
                    <el-button type="text" size="mini" class="operation-btn">{{ row.task_name }}</el-button>
                    <!-- </router-link> -->
                </template>
            </el-table-column>
            <el-table-column label="IP 地址" min-width="40px" align="center">
                <template slot-scope="{row}">
                    <router-link :to="'/asset/detail?id='+row.id">
                        <el-button type="text" size="mini" class="operation-btn">{{ row.ip }}</el-button>
                    </router-link>
                </template>
            </el-table-column>
            <el-table-column label="Os/Vendor" width="120px" align="center">
                <template slot-scope="{row}">
                    <span>{{row.os}}</span>
                    <span v-if="row.os != row.vendor"> - {{row.vendor}}</span>
                </template>
            </el-table-column>
            <el-table-column label="资产服务" min-width="120px" align="center" :show-overflow-tooltip="true">
                <template slot-scope="{row}">
                    <el-tag v-for="(item, index) in row.port_array" :key="index" :value="index" type="warning">{{item}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="区域/运营商/GPS" min-width="80px" align="center">
                <template slot-scope="{row}">
                    <el-tag>{{row.area}}</el-tag>
                    <el-tag v-if="row.isp">{{row.isp}}</el-tag>
                    <el-tag v-if="row.gps">{{row.gps}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="资产漏洞" min-width="60px" align="center">
                <template slot-scope="{row}">
                    <el-rate :show-score="true" text-color="#ff9900" v-model="row.vul_count" :colors="['#99A9BF', '#F7BA2A', '#ff6347']"></el-rate>
                </template>
            </el-table-column>
            <el-table-column label="探测状态" width="120px" align="center">
                <template slot-scope="{row}">
                <el-tag v-if="row.task_status=='Successfully'" effect="dark" type="success">
                    <i  class="el-icon-finished"  style="margin-left:2%">{{ row.task_status }}</i>
                </el-tag>
                <el-tag v-else-if="row.status=='New'">
                    <i  class="el-icon-video-play" style="margin-left:2%" >{{ row.task_status }}</i>
                </el-tag>
                <el-tag v-else>
                    <i  class="el-icon-loading" style="margin-left:2%" >{{ row.task_status }}</i>
                </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="扫描时间" width="160px" align="center" prop="update_at" sortable>
                <template slot-scope="{row}"><span>{{ row.create_at }}</span></template>
            </el-table-column>
            <el-table-column fixed="right" label="Operation" align="center" width="120px" class-name="small-padding fixed-width">
                <template slot-scope="{row,$index}">
                    <el-dropdown :hide-on-click="false">
                        <span class="el-dropdown-link">选项卡<i class="el-icon-arrow-down el-icon--right"></i></span>
                        <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item><el-button type="text" @click="handleDialog(row)">预览</el-button></el-dropdown-item>
                        <el-dropdown-item>
                            <router-link :to="'/asset/detail?id='+row.id">
                            <el-button type="text" class="operation-btn">详情</el-button>
                            </router-link>
                        </el-dropdown-item>
                        <el-dropdown-item>
                            <el-button type="text" @click="handleDelete(row,$index)">删除</el-button>
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
import { InfoList, DelInfo } from "@/api/asset"
import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

export default {
    components: { Pagination },
    directives: { waves },
    data() {
        return {
            tableKey: 0,
            vaue: null,
            iconClasses: ['icon-rate-face-1', 'icon-rate-face-2', 'icon-rate-face-2','icon-rate-face-2', 'icon-rate-face-3'],
            list: [ //实例列表
                {
                    id: 0,
                    isp: "74:86:7A:D1:F5:AC",
                    gps: "74:86:7A:D1:F5:AC",
                    area: 0,
                    create_at: "2020-10-16 16:49:08",
                    ip: "",
                    os: "74:86:7A:D1:F5:AC",
                    task_id: "platfrom.cn",
                    vendor: "74:86:7A:D1:F5:AC",
                },
            ],
            dialog: false,
            dialogData: {},
            dialogPortInfoList:[],
            total: 0,
            listLoading: false,
            listQuery: {page: 1, limit: 20, info: ""},
            multipleSelection: []
        };
    },
    created() {
        let task_name = this.$route.query.task_name
        this.listQuery.info = task_name
        this.getList()
    },
    methods: {
        arrayDel(){
            if (this.multipleSelection.length<1){return}
            for(let i=0;i<this.multipleSelection.length;i++){
                let id = this.multipleSelection[i].id
                let deleteQuery = { id: id };
                DelInfo(deleteQuery).then(() => {}).catch(() => {
                    this.$notify({title: "Failed", message: "Failed Delete", type: "danger", duration: 5000})
                })
            }
            this.$notify({ title: "Success", message: "Delete Successfully", type: "success", duration: 3000, })
            this.getList()
        },
        toggleSelection(rows) {
            if (rows) {
                rows.forEach(row => {this.$refs.multipleTable.toggleRowSelection(row)});
            } else {
                this.$refs.multipleTable.clearSelection();
            }
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        // 获取列表
        getList() {
            this.list = []
            this.listLoading = true;
            InfoList(this.listQuery).then((response) => {
                this.list = response.data.list;
                this.total = response.data.total;
                setTimeout(() => { this.listLoading = false; }, 1 * 1000);
            });
        },
        // 关键词查询
        handleFilter() {
            this.listQuery.page_no = 1
            this.getList()
        },
        // 删除记录
        handleDelete(row, index) {
            this.$confirm("此操作将删除该记录, 是否继续?", "提示", {
                confirmButtonText: "确定", cancelButtonText: "取消", type: "warning",
            }).then(() => {
                DelInfo({ id: row.id }).then((response) => {
                    this.$notify({ title: "Success", message: "Delete Successfully" , type: "success", duration: 3000 })
                    this.list.splice(index, 1);
                }).catch(() => {
                    this.$notify({title: "Failed", message: "Failed Delete", type: "danger", duration: 5000})
                })
            })
        },
        handleDialog(row){
            this.dialogData = row
            this.dialog = true
        },
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