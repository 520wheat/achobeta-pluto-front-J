<script setup>
  import { ArrowDown, Timer,HomeFilled,UserFilled } from '@element-plus/icons-vue'
  import { useRouter } from 'vue-router'
  import { ref } from 'vue'
  import axios from 'axios'
  import {useUserStore} from '@/stores'
  import {logout,userMessage} from '@/api/user.js'
  import { ElMessage } from 'element-plus';
  const router = useRouter()
  const dialogVisible = ref(false)
  const userStore = useUserStore()
  
  const userId = userStore.userId;//用户ID
  const deviceId = userStore.deviceId;//设备ID
  const userToken=userStore.accessToken
  const ip = sessionStorage.getItem('ip');//IP

  const goPersonalCenter = () => {
    console.log(1);
    router.push('/personalCenter')
  }
  const goCommonDevice = () => {
    dialogVisible.value = true
  }
  const devices = ref([
  ])
  const logoutStatus = ref(new Map())
  const logoutDevice = (deviceId) => {
    console.log('Logging out device:', deviceId)
    logoutStatus.value.set(deviceId, true)
  }

  // 获取常用设备
const getCommonDevice = async () => {
    const response = await axios.get('http://8.134.110.164:8091/api/v1/device/getDevices',{
        params:{
            userId: userId,
            deviceId: deviceId,
            limit: 10,
            lastDeviceId: ''
        },
        headers:{
             'Content-Type': 'application/json',
              'access_token': `${userToken}`
        }
    })
    console.log(11111,response);
    devices.value=response.data.data.userCommonUseDevices
    console.log(devices.value);
}

getCommonDevice();
console.log(devices.value);
  const loginOut = () =>{
     const res = logout(userStore.deviceId).then(res=>{
      console.log(res.data);
       router.push('/LoginPage')
        userStore.removeToken();
        userStore.removeData();
        ElMessage.success('登出成功')
        console.log(userStore.accessToken); 
     }).catch(err=>{
      console.log(err);
     })
  }
  const userName = ref('')
  
  const res = userMessage(userId).then(res=>{
      userName.value=res.data.data.userName
  }).catch(err=>{
    console.log(err);
  })
</script>

<template>
  <el-container class="layout-container">
    <el-header>
        <div class="logo"><img src="/img/logo.png" alt="logo" height="40px" width="40px"></div>
        <p style="font-weight: bold;float: left">AchoBeta</p>
               
        <el-dropdown style="float: right;line-height: 40px;margin-top: 10px;">
          <span class="el-dropdown-link">
            <span style="font-weight: bold;">欢迎回来，{{ userName }}</span>
            
            <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="goPersonalCenter">个人中心</el-dropdown-item>
              <el-dropdown-item @click="goCommonDevice">常用设备</el-dropdown-item>
              <el-dropdown-item @click="loginOut()"><span style="text-align: center;" >登出</span></el-dropdown-item>          
            </el-dropdown-menu>
          </template>
        </el-dropdown>

    </el-header>

    <el-container>
      <el-aside style="box-shadow:10px 10px 20px rgba(0,0,0,0.2);">
        <el-menu 
          active-text-color="#fff"
          :default-active="$route.path"
          router
        >

          <el-menu-item index="/main">
            <el-icon><HomeFilled /></el-icon>
            <span>主页</span>
          </el-menu-item> 

          <el-menu-item index="/ManageTeamPage">
            <el-icon><UserFilled /></el-icon>
            <span>团队信息</span>
          </el-menu-item> 
      </el-menu>
      </el-aside>

      <el-main style="box-shadow:10px 10px 20px rgba(0,0,0,0.2);">
        <router-view :key="router.fullPath"></router-view>
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
              <span>{{ scope.row.deviceName }}</span>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column label="上次登录IP" width="180">
          <template #default="scope">
            <el-popover effect="light" trigger="hover" placement="top" width="auto">
              <template #default>
                <div>设备名称: {{ scope.row.deviceName }}</div>
                <div>IP地址: {{ scope.row.ip }}</div>
                <div>登录时间: {{ scope.row.lastLoginTime }}</div>
              </template>
              <template #reference>
                <el-tag>{{ scope.row.ip }}</el-tag>
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
    color: #333333;
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
  .el-menu-item.is-active {
      background-color: rgb(58, 172, 247) !important;//选中背景色
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
