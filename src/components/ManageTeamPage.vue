<script setup>
   import router from '@/router/index.js'
   import {ref,onMounted} from 'vue'
   import {Loading} from '@element-plus/icons-vue'
   const dialogTeam = ref(false)
   const manage = ref([
    {
        name:'张三',
        zubie:'产品组',
        grade:'2019',
        zy:'网络工程',
        xz:'在校',
        phone:'联系方式'
    },
    {
        name:'张三',
        zubie:'产品组',
        grade:'2019',
        zy:'网络工程',
        xz:'在校',
        phone:'联系方式'
    },
      {
        name:'张三',
        zubie:'产品组',
        grade:'2019',
        zy:'网络工程',
        xz:'在校',
        phone:'联系方式'
    },
      {
        name:'张三',
        zubie:'产品组',
        grade:'2019',
        zy:'网络工程',
        xz:'在校',
        phone:'联系方式'
    },
      {
        name:'张三',
        zubie:'产品组',
        grade:'2019',
        zy:'网络工程',
        xz:'在校',
        phone:'联系方式'
    },
      {
        name:'张三',
        zubie:'产品组',
        grade:'2019',
        zy:'网络工程',
        xz:'在校',
        phone:'联系方式'
    },
      {
        name:'张三',
        zubie:'产品组',
        grade:'2019',
        zy:'网络工程',
        xz:'在校',
        phone:'联系方式'
    },
      {
        name:'张三',
        zubie:'产品组',
        grade:'2019',
        zy:'网络工程',
        xz:'在校',
        phone:'联系方式'
    },
      {
        name:'张三',
        zubie:'产品组',
        grade:'2019',
        zy:'网络工程',
        xz:'在校',
        phone:'联系方式'
    },
      {
        name:'张三',
        zubie:'产品组',
        grade:'2019',
        zy:'网络工程',
        xz:'在校',
        phone:'联系方式'
    },
      {
        name:'李四',
        zubie:'产品组',
        grade:'2019',
        zy:'网络工程',
        xz:'在校',
        phone:'1305546552'
    },
      {
        name:'李四',
        zubie:'产品组',
        grade:'2019',
        zy:'网络工程',
        xz:'在校',
        phone:'130542155'
    },
   ])
   //查看详情
   const viewDetail = (row,$index) => {
      console.log(row,$index)
      router.push({
        path:'UserInfEdit'
      })
   }
  //新增用户
   const toUserInfEdit = () => {
     router.push({
      path: 'UserInfEdit'
     })
   }
   const container =ref()
   const scrollTopVal=ref(0)
   const currentPage = ref(1)
   const pageSize = ref(10)
   const totalData = ref(manage)
   const loading = ref(false)
   const tableData = ref(totalData.value.slice(0,pageSize.value))
   
   const loadMoreData = () => {
      if (loading.value || currentPage.value * pageSize.value >= totalData.value.length)
       return
      loading.value = true
      //后续向后端请求数据
      setTimeout(function(){
      const start = (currentPage.value ) * pageSize.value
      const end = start + pageSize.value
      const newData = totalData.value.slice(start, end)
      tableData.value = [...tableData.value, ...newData]
      currentPage.value++
      loading.value=false
      },2000)
      console.log(loading.value)
   }
   onMounted(() => {
    if (container.value) {
    container.value.addEventListener('scroll',handleScroll,true)
    }
  })
  const handleScroll = (e) => {
      scrollTopVal.value=e.target.scrollTop
      let offsetHeight = e.target.offsetHeight
       let scrollHeight = e.target.scrollHeight
       if(scrollTopVal.value + offsetHeight >= scrollHeight -10 ){
        loadMoreData()
       }
  } 
</script>

<template>
  <el-card class="page-manage">
    <template #header>
    <div class="header">
        <div class="left">
        <span style="font-size: 22px;padding: 0 15px;">团队信息</span>
        <span>当前团队</span>
        </div>
        <div class="right">
            <el-button type="info" style="color: black;" @click="dialogTeam=true">团队架构管理</el-button>
            <el-button color="rgb(0, 122, 255)" @click="toUserInfEdit">新增用户</el-button>
        </div>
    </div>
    <el-dialog v-model="dialogTeam" width="900" title="团队架构管理">
      <!-- 团队架构管理内容 -->
    <div style="border-bottom: 1px solid #000;padding-bottom: 5px;">支持修改指定团队内部的架构</div>
    <div style="padding-top: 5px;font-size: 16px;font-weight: 700;">当前团队:</div>
    </el-dialog>
    </template>
    <!-- 内容 -->
     <div ref="container" class="container">
       <el-table :data="tableData" style="width: 100%;">
        <el-table-column prop="name" label="姓名"></el-table-column>
        <el-table-column prop="zubie" label="组别"></el-table-column>
        <el-table-column prop="grade" label="年级"></el-table-column>
        <el-table-column prop="zy" label="专业"></el-table-column>
        <el-table-column prop="xz" label="现状"></el-table-column>
        <el-table-column prop="phone" label="联系方式"></el-table-column>
        <el-table-column label="操作">
            <template #default="{row,$index}">
                <el-button type="text" @click="viewDetail(row,$index)">查看详情</el-button>
                <el-button type="text" style="color: rgb(245, 108, 108);">删除</el-button>
            </template>
        </el-table-column>

        <template #empty>
            <el-empty description="暂无数据"></el-empty>
        </template>
     </el-table>
       <div v-if="loading" class="foot">
          加载中
          <el-icon class="is-loading">
              <Loading />
           </el-icon>
       </div>
     </div> 
  </el-card>
</template>

<style lang="scss" scoped>
  .page-manage {
    min-height: 100%;
    box-sizing: border-box;
    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .container {
      overflow: auto;
      max-height: 510px
    }
    .foot {
      text-align: center;
    }
  }
</style>