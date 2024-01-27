<template>
    <div class="app-container">
        <el-row :gutter="40">
            <el-col :xs="40" :sm="40" :lg="24" style="margin-bottom:5px;">
                <div>
                    <el-tabs v-model="activeName" @tab-click="handleClick" class="tab-div">
                        <!--任务配置-->
                        <el-tab-pane label="任务配置" name="base" style="margin-top:10px">
                            <el-form ref="form" :model="base" label-width="100px" label-position="left">
                                <el-form-item label="任务限时"><el-input-number v-model="base.timeout" :min="180" :max="600"></el-input-number> ( 秒 )</el-form-item>
                                <el-form-item label="并发探测"><el-input-number v-model="base.pool" :min="0" :max="10"></el-input-number></el-form-item>
                                <el-form-item label="失败重试"><el-input-number v-model="base.try" :min="0" :max="5"></el-input-number></el-form-item>
                                <el-form-item label="探测端口"><el-input type="textarea" v-model="base.port_list" :rows="4"></el-input></el-form-item>
                                <el-form-item label="域名字典"><el-input type="textarea" v-model="base.domain_dict" :rows="4"></el-input></el-form-item>
                            </el-form>
                        </el-tab-pane>
                        <!--Web配置-->
                        <el-tab-pane label="Web渗透" name="web" style="margin-top:10px">
                            <el-form ref="form" :model="web" label-width="100px" label-position="left">
                                <el-form-item label="爬虫模式">
                                    <el-radio-group v-model="web.mode">
                                        <el-radio :label="1" >事件触发型</el-radio>
                                        <el-radio :label="2" >多线程请求</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                                <el-form-item label="线程数量"><el-input-number v-model="web.thread" :min="0" :max="10"></el-input-number> 个</el-form-item>
                                <el-form-item label="请求超时"><el-input-number v-model="web.timeout" :min="0" :max="10"></el-input-number> 秒</el-form-item>
                                <el-form-item label="失败重试"><el-input-number v-model="web.fail_try" :min="0" :max="5"></el-input-number> 次</el-form-item>
                                <el-form-item label="超时重试"><el-input-number v-model="web.out_try" :min="0" :max="10"></el-input-number> 次</el-form-item>
                                <el-form-item label="Cookie"><el-input type="textarea" v-model="web.cookie" :rows="8"></el-input></el-form-item>
                            </el-form>
                            <el-form :inline="true" :model="web" label-width="100px" label-position="left">
                                <el-form-item label="登录用户" style="width: 50%">
                                    <el-input type="textarea" v-model="web.user" :rows="4" style="width: 500px"></el-input>
                                </el-form-item>
                                <el-form-item label="登录密码">
                                    <el-input type="textarea" v-model="web.passwd" :rows="4" style="width: 500px"></el-input>
                                </el-form-item>
                                <el-form-item label="路径字典" style="width: 50%">
                                    <el-input type="textarea" v-model="web.path" :rows="4" style="width: 500px"></el-input>
                                </el-form-item>
                                <el-form-item label="后缀字典">
                                    <el-input type="textarea" v-model="web.suffix" :rows="4" style="width: 500px"></el-input>
                                </el-form-item>
                                <el-form-item label="路径白名单" style="width: 50%">
                                    <el-input type="textarea" v-model="web.path_white" :rows="4" style="width: 500px"></el-input>
                                </el-form-item>
                                <el-form-item label="后缀白名单">
                                    <el-input type="textarea" v-model="web.suffix_white" :rows="4" style="width: 500px"></el-input>
                                </el-form-item>
                            </el-form>
                        </el-tab-pane>
                        <!--漏洞配置 :left-default-checked="[2, 3]" :right-default-checked="[1]"-->
                        <el-tab-pane label="漏洞渗透" name="vul" style="margin-top:10px">
                            <div>
                                <span style="font-size:14px; font-weight:600; color:#606266;">执行插件</span> 
                                <div style="text-align:center; background-color:#f0f2f5; width:100%;">
                                    <el-transfer style="text-align: left; " v-model="load_plugins" filterable
                                    :titles="['插件库', '加载区']" :button-texts="['移除', '添加']"
                                    
                                    :render-content="renderFunc"
                                    :format="{noChecked: '${total}',hasChecked: '${checked}/${total}'}"
                                    @change="handleChange"
                                    :data="plugin_list">
                                    </el-transfer>
                                </div>
                            </div>
                        </el-tab-pane>
                        <!--权限配置-->
                        <el-tab-pane label="权限渗透" name="auth" style="margin-top:10px">
                            <el-form ref="form" :model="auth" label-width="100px" label-position="left">
                                <el-form-item label="线程数量"><el-input-number v-model="auth.thread" :min="0" :max="10"></el-input-number> 个</el-form-item>
                                <el-form-item label="请求超时"><el-input-number v-model="auth.timeout" :min="0" :max="10"></el-input-number> 秒</el-form-item>
                                <el-form-item label="失败重试"><el-input-number v-model="auth.fail_try" :min="0" :max="5"></el-input-number> 次</el-form-item>
                                <el-form-item label="超时重试"><el-input-number v-model="auth.out_try" :min="0" :max="10"></el-input-number> 次</el-form-item>
                                <el-form-item label="服务协议"><el-input type="textarea" v-model="auth.protocol" :rows="4"></el-input></el-form-item>
                                <el-form-item label="用户字典"><el-input type="textarea" v-model="auth.user" :rows="4"></el-input></el-form-item>
                                <el-form-item label="密码字典"><el-input type="textarea" v-model="auth.passwd" :rows="4"></el-input></el-form-item>
                            </el-form>
                        </el-tab-pane>
                        <!--蜜罐配置-->
                        <el-tab-pane label="蜜罐识别" name="trap" style="margin-top:10px">
                            <div><span style="font-size:14px; font-weight:600; color:#606266;">执行插件</span>
                                <div style="text-align:center; background-color:#f0f2f5">
                                    <el-transfer style="text-align: left;" v-model="load_traps" filterable
                                    :titles="['插件库', '加载区']" :button-texts="['移除', '添加']"
                                    :left-default-checked="[2, 3]" :right-default-checked="[1]"
                                    :render-content="renderFunc"
                                    :format="{noChecked: '${total}',hasChecked: '${checked}/${total}'}"
                                    @change="handleChange"
                                    :data="trap_list">
                                    </el-transfer>
                                </div>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </el-col>
        </el-row>
        <el-row :gutter="40">
            <el-col :xs="48" :sm="48" :lg="24" style="margin-bottom:0px;">
                <div style="text-align:center">
                  <el-button type="success" @click="onsubmit">提交</el-button>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { TrapPluginList } from "@/api/trap_plugin"
import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
// import { AddRule } from "@/api/asset"
import { PocPluginList } from "@/api/poc_plugin"
/* eslint-disable */
export default {
   // components: { Pagination },
    directives: { waves },
    data() {
        return {
            // 漏洞插件库
            plugin_list: [{key: 1, label: "Weblogic 'wls-wsat' XMLDecoder 反序列化漏洞"},{key: 2, label: "Apache Flink RCE"}],
            // 已加载的Poc插件
            load_plugins: [],
            // 蜜罐识别插件库
            trap_list: [{key: 1, label: 'test01'},{key: 2, label: 'test02'},{key: 3, label: 'test03'},{key: 4, label: 'test04'},{key: 5, label: 'test05'},],
            // 已加载的trap插件
            load_traps: [1],
            renderFunc(h, option) {
               return  <span> { option.key } - { option.label } </span>
            },
            activeName: 'base',
            base: {
                pool: 11, try: 5, timeout: 300,
                port_list: "21-22, 25, 53, 80, 110, 443, 3306, 5900, 5901, 5902, 5903, 5904, 5905, 6379, 7001, 8080, 8081, 9000, 27017",
                domain_dict: "oa, www, mail, cdn, ftp, bbs, smtp, sign, docs, cloud, account"
            },
            web:{
                mode: 2, thread: 10, timeout: 10, fail_try: 5, out_try: 5,
                user: 'admin, root, test', passwd: '123456, 111111, admin, root, test',
                cookie: 'cna=5GqpFiyCpWACAXd7S8b6LidM; _ga=GA1.2.2078592356.1583916815; login_aliyunid_pk=1792239139637698; UM_distinctid=173d80bb8563bf-09a68eba36880e-5b193413-1fa400-173d80bb85773d; cnz=jPm4XxRfkyoCAfgwdHH93dIK; aliyun_choice=CN; console_base_assets_version=3.20.3; currentRegionId=cn-zhangjiakou; channel=u9aX%2FzlmLTGE%2BQtc4P5%2BOlHLnUuLLKmSIHpiCOVlYoA%3D; _HOME_JSESSIONID=P1666H81-665K5D6CX1J7J05AB77U1-L892YBKK-BS1X4; _home_session0=TT%2FS7FgYSuQGiAynrK%2FBCB5HyPH9yhCqMin20Zg%2BhuNkHXg64eUs%2FD8yGpPT6srkZ0OSRlXn334EDsjd3QclNcWoJWuRF0aHjSP%2F%2BNkLvSx%2BBYnwkU%2BeSYuEjy5vJ4aXKbvVsi46eEgw%2B97f0uiaMw%3D%3D; xlly_s=1; ping_test=false; t=ba47057fab764a2b7ef2c46f7ab36829; _tb_token_=5581ee4e1ee51; cookie2=18d375370d0129218afda0d96a957155; _samesite_flag_=true; login_aliyunid="hhxjs****"; login_aliyunid_ticket=tPmZPUjph*IMx_eb*whROny9wktCSz4ypwZ4of_BNpwU_TOTNChZBoeM1KJexdfb9zhYnsN5Zos6qISCrRt7mGxbigG2Cd4fWaCmBZHIzsgdZq64XXWQgyKFeuf0vpmV*s*CT58JlM_1t$w3cg$GhijM0; login_aliyunid_luid="BG+gQQmKodS8ee0ff1e0705626ffd9bfed8aef29391+xEEdSET03oJ18Jv7gqwR8g=="; login_aliyunid_csrf=_csrf_tk_1254311547288652; login_aliyunid_abi="BG+a0U29nt4543279e8e6331d53c9d2a3a046661d3b+GyJ9a0bsrCg4VyVHtVDv+G/rscQg194FCXR+nVhZmsutTEsc8m4="; login_aliyunid_pks="BG+lokxkJYLfcl37i1mT+pgYLuqdbZll5HTYEmtweGWB/M="; hssid=073dc9fe-ca58-4fb9-a889-a1cc3807d1b3; hsite=6; aliyun_country=CN; aliyun_site=CN; aliyun_lang=zh; isg=BGdnSwYly3DHaHBO5ardEnGu9psx7DvOY-PtgTnUg_YdKIfqQbzLHqUpSii2wBNG; tfstk=c1DRB36cHEYoXHExbbdcRZtI6rKca9LLlgahphmkExTPjHBFKs0-IA8USQZCy-KA.; l=eBxDYxK7OlLzz85JBOfwourza77OSIRAguPzaNbMiOCPOR1p5Y-PW6GU9YT9C3GVh6ueR35GXu98BeYBq3K-nxvTkjOadJMmn',
                path: '/login, /sign, /backend', suffix: 'asp, html, jsp, php',
                path_white: '/static', suffix_white: 'css, jpg, png, tar, gz, rar',
            },
            auth:{
                thread: 10, timeout: 10, fail_try: 5, out_try: 5,
                protocol: 'ssh, ftp, vnc, mail, cisco, mysql, redis, mongodb',
                user: 'root, admin, test, guest', passwd: 'root, 123456, admin, test, guest, 666666, 111111',
            }
        };
    },
    created() {
        this.initData()
    },
    methods: {
        handleClick(tab) {
            console.log(tab.name);
        },
        handleChange(value, direction, movedKeys) {
            console.log(value, direction, movedKeys);
        },
        onsubmit(){
            console.log(this.web)
            let data = this.web
            // AddRule(data).then((response)=>{
            //     console.log(response)
            // })
            
        },
        initData(){
            TrapPluginList({page: 1, limit: 20, info: ""}).then((response) => {
                let resp = response.data.list;
                let trap_list = []
                for (let i=0;i<response.data.total;i++){
                    let item = resp[i]
                    trap_list.push({key: item.id, label: item.name})
                }
                this.trap_list = trap_list
            });
            PocPluginList({page: 1,limit: 20, info:""}).then((response) => {
                let resp = response.data.list
                let plugin_list = []
                for (let i=0;i<response.data.total;i++){
                    let item = resp[i]
                    plugin_list.push({key: item.id, label: item.vul_name})
                    console.log(plugin_list)
                }
            });
        }
        
    },
};
</script>

<style>
.app-container{
    background-color: #f0f2f5;
    /* height: 820px; */
}
.tab-div{
    background-color: white;
    padding: 1% 2%;
    /* height: 750px; */
}

.el-transfer-panel{
    width:42%;
}
</style>