<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <router-link :to="'/vul/index'">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="bug" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">漏洞威胁</div>
          <count-to :start-val="0" :end-val="data.vul_count" :duration="2600" class="card-panel-num" />
        </div>
      </div>
      </router-link>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <router-link :to="'/asset/index'">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="component" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">资产数量</div>
          <count-to :start-val="0" :end-val="data.asset_count" :duration="3000" class="card-panel-num" />
        </div>
      </div>
      </router-link>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <!-- <router-link :to="'/vul/index'"> -->
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="tree" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">服务数量</div>
          <count-to :start-val="0" :end-val="data.service_count" :duration="3200" class="card-panel-num" />
        </div>
      </div>
      <!-- </router-link> -->
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <!-- <router-link :to="'/vul/index'"> -->
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-shopping">
          <svg-icon icon-class="list" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">入侵权限</div>
          <count-to :start-val="0" :end-val="data.resource_count" :duration="4600" class="card-panel-num" />
        </div>
      </div>
      <!-- </router-link> -->
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'

export default {
  components: { CountTo },
  props: {
    data: {
      type: Object,
      default() {
        return {
          serviceNum: 0,
          todayRequestNum: 0,
          currentQps: 0,
          appNum: 0
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
  methods: {}
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 0px;

  .card-panel-col {
    margin-bottom: 10px;
  }

  .card-panel {
    height: 70px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #fff;
    border-radius: 10px;
    // background: #fff;
    background:	#2c3e50;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #f4516c;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #40c9c6;
      }

      .icon-shopping {
        background: #34bfa3
      }
    }

    .icon-people {
      color: #f4516c;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color:#40c9c6;
    }

    .icon-shopping {
      color: #34bfa3;
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: -5px 0 0 9px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      // font-weight: bold;
      // margin-right: 26px;
      margin: 12px 26px 9px 0px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: #fff;
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width: 550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
