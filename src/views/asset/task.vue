<template>
    <div class="mixin-components-container">
        <el-row>
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>{{title}}</span>
                </div>
                <div style="margin-bottom:50px;">
                    <el-form ref="form" :model="form" label-width="140px">
                        <el-form-item v-if="task_id" label="任务名" class="is-required">
                            <el-input v-model="form.name" style="width: 50%" disabled></el-input>
                        </el-form-item>
                        <el-form-item v-else label="任务名" class="is-required">
                            <el-input v-model="form.name" style="width: 50%" maxlength="20" minlength="3" placeholder="中文、字母、数字、下划线等至少3个字符"></el-input>
                        </el-form-item>
                        <el-form-item label="探测目标" class="is-required">
                            <el-input v-model="form.target_list" style="width: 50%" maxlength="1024" minlength="3" placeholder="IP, 域名, (IP、域名)混合列表, 网段等其中之一"></el-input>
                        </el-form-item>
                        <el-form-item label="扫描周期">
                            <el-select v-model="form.recursion" placeholder="请选择" style="width:200px">
                                <el-option label="一次" :value="0"></el-option><el-option label="每天" :value="1"></el-option>
                                <el-option label="每周" :value="7"></el-option><el-option label="每月" :value="30"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="渗透规则" class="is-required">
                            <el-input-number v-model="form.rule_id" :min="1" :max="50"></el-input-number>
                        </el-form-item>
                        <el-form-item label="Web渗透">
                            <el-radio-group v-model="form.web_scan"><el-radio :label="0">关闭</el-radio><el-radio :label="1">开启</el-radio></el-radio-group>
                        </el-form-item>
                        <el-form-item label="漏洞扫描">
                            <el-radio-group v-model="form.poc_scan"><el-radio :label="0">关闭</el-radio><el-radio :label="1">开启</el-radio></el-radio-group>
                        </el-form-item>
                        <el-form-item label="权限爆破">
                            <el-radio-group v-model="form.auth_scan"><el-radio :label="0">关闭</el-radio><el-radio :label="1">开启</el-radio></el-radio-group>
                        </el-form-item>
                        <el-form-item label="蜜罐识别">
                            <el-radio-group v-model="form.trap_scan"><el-radio :label="0">关闭</el-radio><el-radio :label="1">开启</el-radio></el-radio-group>
                        </el-form-item>
                        <el-form-item>
                            <el-button v-if="isEditPage" type="danger" :disabled="submitBtnDisabled" @click="onUpdate()">提交修改</el-button>
                            <el-button v-else type="primary" :disabled="submitBtnDisabled" @click="onSubmit()">立即创建</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </el-card>
        </el-row>
    </div>
</template>

<script>
import { TaskAdd } from "@/api/task"

export default {
    data() {
        return {
        isEditPage: false, //是创建还是修改任务的页面？
        submitBtnDisabled: false,
        title: "创建渗透任务",
        form: { // 创建任务提交的表单
            "auth_scan": 0,
            "name": "",
            "poc_scan": 0,
            "recursion": 0,
            "target_list": "",
            "trap_scan": 0,
            "rule_id": 0,
            "web_scan": 0
        },
        task_id: undefined,
    };
  },
  created() {
        let id = this.$route.query.id
        if (id) { //点击修改页面的跳转id uri参数(?id=64)
            // 如果有id,查DB进行赋值
            this.title = "修改探测任务"
            this.isEditPage = true
            this.isLoading = true
            this.task_id = id
            this.getDetail(id)
        }
  },
    methods: {
        // 表格格式检查
        formCheck() {
            if (this.form.name.trim() == "") { this.$message({ message: "任务名必填", type: "warning" }); return false }
            if (this.form.target_list.trim() == "") { this.$message({ message: "目标必填", type: "warning" }); return false }
            return true
        },
        // 关闭子页
        closeChildPage() {
            this.$router.go(-1)
            this.$store.state.tagsView.visitedViews.splice(this.$store.state.tagsView.visitedViews.findIndex(item => item.path === this.$route.path), 1)
            this.$router.push(this.$store.state.tagsView.visitedViews[this.$store.state.tagsView.visitedViews.length - 1].path)
        },
        // 更新任务
        onUpdate() {
            if (!this.formCheck()) { return }
            this.submitBtnDisabled = true
            //1.组装数据
            let temp = this.form
            let port_list = temp.port_list.split(',')
            let plist = []
            if (temp.user_port!=0){
                for (let i=0; i<port_list.length; i++){
                    let item = port_list[i].trim()
                    if (item != ""){plist.push(Number(item))}
                }
            }
            // let putData = {
            //     task_id: this.task_id, name: temp.name, port_list: plist, target: temp.target, recursion: temp.recursion, user: 'Admin',
            //     open_web: temp.open_web, open_poc: temp.open_poc, open_auth: temp.open_auth, user_port: temp.user_port
            // }
            //2.调API接口
            this.$notify({ title: "Warning", message: "接口未实现", type: "warning", duration: 5000});
            // PutDiscovery(putData).then((response) => {
            //     this.submitBtnDisabled = false;
            //     this.$notify({ title: response.data, message: "Update Successfully", type: "success", duration: 5000});
            //     this.closeChildPage()
            // }).catch(() => {
            //     this.submitBtnDisabled = false;
            //     this.$notify({ title: "Failed", message: "Failed Update", type: "error", duration: 5000});
            // });
        },
        //创建任务
        onSubmit() {
            if (!this.formCheck()) { return }
            this.submitBtnDisabled = true
            //1.组装数据
            let temp = this.form
            
            let data = {
                name: temp.name, target_list: temp.target_list, recursion: temp.recursion, poc_scan: temp.poc_scan,
                web_scan: temp.web_scan, auth_scan: temp.auth_scan, trap_scan: temp.trap_scan,
            }

            //2.调API接口
            TaskAdd(data).then((response) => {
                this.submitBtnDisabled = false;
                console.log(response)
                this.$notify({ title: "Success", message: "添加成功" + response.errmsg + response.data.task_id, type: "success", duration: 5000, });
                this.closeChildPage()
            }).catch(() => {
                this.submitBtnDisabled = false;
                this.$notify({title: "Failed", message: "添加失败", type: "error", duration: 5000});
            });
        },
        // 修改时，获取旧信息
        getDetail(id) {
            console.log(id)
            this.$notify({ title: "Warning", message: "接口未实现", type: "warning", duration: 5000});
            // DiscoveryInfo({ id: id }).then((response) => {
            //     let data = response.data
            //     this.form = {
            //         name: data.name, port_list: data.port_list.join(', '),
            //         target: data.target, recursion: data.recursion,
            //         open_web: data.open_web, open_poc: data.open_poc,
            //         open_auth: data.open_auth, user_port: data.user_port,
            //     }
            // }).catch(() => {
            //     this.submitBtnDisabled = false;
            //     this.$notify({title: 'Failed', message: "Failed Get AssetTask info", type: "error", duration: 5000});
            // });
        },
    }
}
</script>

<style>
.mixin-components-container {
    background-color: #f0f2f5;
    padding: 30px;
    min-height: calc(100vh - 84px);
}
.text {
    font-size: 14px;
}
.clearfix:before,
.clearfix:after {
    display: table;
    content: "";
}
.clearfix:after {
    clear: both;
}
.box-card-in {
    width: 60%;
}
.dump-box {
    font-weight: 700;
    color: #606266;
}
</style>