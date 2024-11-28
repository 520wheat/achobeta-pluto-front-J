<script setup>
  import { ArrowDown, Timer } from '@element-plus/icons-vue'
  import { useRouter } from 'vue-router'
  import { ref } from 'vue'
  import axios from 'axios'
  const router = useRouter()
  const dialogVisible = ref(false)

  const userId = localStorage.getItem('userId') || '1005';//用户ID
  const deviceId = localStorage.getItem('deviceId') || '1005';//设备ID

  const goPersonalCenter = () => {
    router.push('/personalCenter')
  }
  const goCommonDevice = () => {
    dialogVisible.value = true
  }
  const logout = () => {
    router.push('/LoginPage')
  }
  const devices = ref([
    {
      id: 1,
      name: '测试设备1',
      lastIP: '192.168.1.1',
      lastLoginTime: '2023-01-01 12:00:00',
      isCurrent: true
    },
    {
      id: 2,
      name: '测试设备2',
      lastIP: '192.168.1.2',
      lastLoginTime: '2023-01-02 12:00:00',
      isCurrent: false
    }
  ])
  const logoutStatus = ref(new Map())
  const logoutDevice = (deviceId) => {
    console.log('Logging out device:', deviceId)
    logoutStatus.value.set(deviceId, true)
  }

  // 获取常用设备
const getCommonDevice = async () => {
    const response = await axios.get('/api/v1/device/getDevices',{
        params:{
            userId: userId,
            deviceId: deviceId,
            limit: 10,
            lastDeviceId: ''
        },
        headers:{}
    })
    console.log(response);
} 
getCommonDevice();

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
              <el-dropdown-item @click="goPersonalCenter">个人中心</el-dropdown-item>
              <el-dropdown-item @click="goCommonDevice">常用设备</el-dropdown-item>
              <el-dropdown-item @click="logout"><span style="text-align: center;">登出</span></el-dropdown-item>
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

    <el-dialog
      v-model="dialogVisible"
      title="常用设备"
      width="800px"
      style="font-weight: bold;"
    >
      <span style="font-size: 14px;color: #999;">此处将显示所有您开启了"三十天自动登录"的设备</span>
      <el-divider></el-divider>
      
      <el-table :data="devices" style="width: 100%">
        <el-table-column label="设备名称" width="180">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <span>{{ scope.row.name }}</span>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column label="上次登录IP" width="180">
          <template #default="scope">
            <el-popover effect="light" trigger="hover" placement="top" width="auto">
              <template #default>
                <div>设备名称: {{ scope.row.name }}</div>
                <div>IP地址: {{ scope.row.lastIP }}</div>
                <div>登录时间: {{ scope.row.lastLoginTime }}</div>
              </template>
              <template #reference>
                <el-tag>{{ scope.row.lastIP }}</el-tag>
              </template>
            </el-popover>
          </template>
        </el-table-column>

        <el-table-column label="上次登录时间" width="180">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <el-icon><timer /></el-icon>
              <span style="margin-left: 10px">{{ scope.row.lastLoginTime }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template #default="scope">
            <span v-if="scope.row.isCurrent">当前设备</span>
            <template v-else>
              <span v-if="logoutStatus.get(scope.row.id)" style="color: #67C23A">下线成功</span>
              <el-button
                v-else
                size="small"
                type="danger"
                @click="logoutDevice(scope.row.id)"
              >
                下线
              </el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
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
    border: none !important; /* 取消边框 */
    outline: none !important; /* 取消轮廓线 */
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

/* 弹窗 */
</style>
