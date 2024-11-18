<script setup>
  import { ArrowDown } from '@element-plus/icons-vue'
</script>

<template>
  <el-container class="layout-container">
    <el-header>
        <div class="logo"><img src="/img/logo.png" alt="logo" height="40px" width="40px"></div>
        <p style="font-weight: bold;float: left">AchoBeta</p>
               
        <el-dropdown style="float: right;line-height: 40px;margin-top: 10px;">
          <span class="el-dropdown-link">
            <span style="font-weight: bold;">欢迎回来，XXX</span>
            
            <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>个人中心</el-dropdown-item>
              <el-dropdown-item>常用设备</el-dropdown-item>
              <el-dropdown-item><span style="text-align: center;">登出</span></el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

    </el-header>

    <el-container>
      <el-aside style="box-shadow:10px 10px 20px rgba(0,0,0,0.2);">
        <el-menu 
          active-text-color="#ffd04b"
          text-color="#000"
          router
        >

          <el-menu-item index="/main">
            <span>主页</span>
          </el-menu-item> 

          <el-menu-item index="/ManageTeamPage">
            <span>团队信息</span>
          </el-menu-item> 
      </el-menu>
      </el-aside>

      <el-main style="box-shadow:10px 10px 20px rgba(0,0,0,0.2);">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
.layout-container{
    height: 96vh;
    background-color: #f4f4f4;  
    margin-bottom: 20px;

  .el-header {  
    margin-top: 20px;
    margin-left: 20px;
    margin-right: 20px;

    justify-content: space-between;
    align-items: center;
    background-color: #ffffff;
    color: #333;
    outline: 1px solid #000;

    box-shadow:10px 10px 20px rgba(0,0,0,0.2);
  }
  .el-aside {
    width: 200px;
    margin-left: 20px;
    margin-bottom: 20px;

    background-color: #ffffff;
    outline: 1px solid #000;
    border-right: 1px solid #000;
  }
  .el-dropdown-link {
    cursor: pointer;
    color: #000;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
  .demonstration {
    display: block;
    color: #8492a6;
    font-size: 14px;
    margin-bottom: 20px;
  }

  .el-main {
    margin-right: 20px;
    margin-bottom: 20px;

    background-color: #f4f4f4;
    color: #333;
    outline: 1px solid #000;
  }
}

.logo {
  float: left;
  width: 40px;
  height: 40px;
  margin: 10px;
  background-color: #ffffff;

  line-height: 40px;  
  text-align: center;  
}

/* 下拉菜单 */
.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
</style>
