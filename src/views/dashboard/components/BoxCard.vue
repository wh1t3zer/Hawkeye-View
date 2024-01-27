<template>
  <el-card class="box-card-component">
    <div slot="header" class="box-card-header">
        <img src="https://wpimg.wallstcn.com/e7d23d71-cf19-4b90-a1cc-f56af8c0903d.png">
    </div>
    <!-- <div style="padding-top:15px;"><p> </p> 隔离</div> -->
    <div style="position:relative; padding-top: 20px">
      <pan-thumb :image="data.image" class="panThumb" />
      <mallki class-name="mallki-text" :text="data.title" />
      
      <!--判断是横向线条还是饼图-->
      <div v-if="data.type=='line'">
        <div v-for="(item, index) in data.series" :key="index" :label="item" class="progress-item">
          <span>{{item.name}}</span>
          <!-- <el-slider v-model="item.value" input-size="mini" :max="2"></el-slider> -->
          <!-- <el-progress :percentage="10"></el-progress> -->
          <el-progress :text-inside="true" :stroke-width="14" :percentage="item.value" :format="format" status="success"></el-progress>
        </div>
      </div>
      <div v-if="data.type=='pie'">
        <pie-chart :chart-data="data"/>
      </div>
      <!--漏洞列表-->
      <div v-if="data.type=='table'">
        <el-table element-loading-background="rgba(0, 0, 0, 0.8)" :data="data.series" border fit highlight-current-row >
            <el-table-column label="资产ID" min-width="10px" align="center">
                <template slot-scope="{row}">
                    <router-link :to="'/asset/info?instance_id='+row._id">
                        <el-button type="text" size="mini" class="operation-btn">{{ row.asset_id }}</el-button>
                    </router-link>
                </template>
            </el-table-column>
            <el-table-column label="Target" min-width="25px" align="center">
                <template slot-scope="{row}">
                    <router-link :to="'/asset/info?instance_id='+row._id">
                        <el-button type="text" size="mini" class="operation-btn">{{ row.asset }}</el-button>
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
      <!--渗透链路-->
      <div v-if="data.type=='timeline'">
        <el-timeline>
          <el-timeline-item v-for="(activity, index) in data.series" :key="index" :icon="activity.icon" :type="activity.type" :color="activity.color" :size="activity.size" :timestamp="activity.timestamp">
            {{activity.content}}
          </el-timeline-item>
        </el-timeline>
      </div>
    </div>
  </el-card>
</template>

<script>
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
    height: 400px;
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
</style>
