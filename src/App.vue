<script setup lang="ts">
  
</script>

<template>

  <div class="common-layout">
    <el-container>
        <el-header class="common-header">
          <div class="picture"></div>
          <p>AchoBeta</p>
        </el-header>

        <el-container class="body">
          <el-aside class="common-aside">
            <div class="aside-main">
              <p>主页</p>
            </div>
          </el-aside>

          <el-main class="common-main">
            Main
          </el-main>
        </el-container>
      </el-container>  
  </div>
  
</template>

<style scoped>

/* 主页start */
.common-layout {
  height: 100vh;
  background-color: #f2f2f2;
}

.common-header {
  background-color: #fff;
  color: #000;
  outline: 2px solid #000;
  margin-top: 20px;
  margin-left: 20px;
  margin-right: 20px;
  box-shadow: 10px 10px 10px rgba(0, 0, 0, 0.2);

  display: flex;
  align-items: center;
}

.body {
  margin-left: 20px;
  margin-right: 20px; 
  box-shadow: 10px 10px 10px rgba(0, 0, 0, 0.2);
}

.common-aside {
  width: 200px;
  height: 85vh;
  background-color: #fff;
  color: #000;
  outline: 2px solid #000;
}

.common-main {
  height: 85vh;
  background-color: #fff;
  color: #000;
  outline: 2px solid #000;
  border-collapse: collapse;
}

.picture {
  height: 40px;
  width: 40px;
  background-color: beige;
  margin-right: 20px;
}

/* aside 的主页 start */

/* aside 的主页 end */
.aside-main {
  height: 40px;
  width: 200px;
  background-color: aqua;
  margin-top: 10px;

  display: flex;
  align-items: center;
  text-indent: 20px;
}


/* 主页end */

</style>
