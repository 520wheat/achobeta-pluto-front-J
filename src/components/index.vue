<script setup>
  
</script>
<template>
  <el-container class="layout-container">
    <el-header>
        <span>AchoBeta</span>
        <el-dropdown trigger="click">
        <span class="el-dropdown-link">
        下拉菜单<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item icon="el-icon-plus">个人中心</el-dropdown-item>
        <el-dropdown-item icon="el-icon-circle-plus">常用设备</el-dropdown-item>
        <el-dropdown-item icon="el-icon-circle-plus-outline">登出</el-dropdown-item>
      </el-dropdown-menu>
        </el-dropdown>
    </el-header>
    <el-container>
      <el-aside width="200px" >
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
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<style>
.layout-container{
    height: 100vh;
  .el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #B3C0D1;
    color: #333;
    border: 1px solid black;
    border-collapse: collapse;
  }
  .el-aside {
    /* display: flex; */
    /* align-items: center;
    justify-content: center; */
    background-color: #B3C0D1;
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
}
</style>