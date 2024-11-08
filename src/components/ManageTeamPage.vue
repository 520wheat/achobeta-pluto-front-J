<script setup>
   const manage = [
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
    }
   ]
</script>

<template>
  <el-card class="page-manage">
    <template #header>
    <div class="header">
        <div class="left">
        <span>团队信息</span>
        <span>当前团队</span>
        </div>
        <div class="right">
            <el-button type="info" style="color: black;">团队架构管理</el-button>
            <el-button type="primary">新增用户</el-button>
        </div>
    </div>
    </template>
    <!-- 内容 -->
     <el-table :data="manage" style="width: 100%;">
        <el-table-column prop="name" label="姓名"></el-table-column>
        <el-table-column prop="zubie" label="组别"></el-table-column>
        <el-table-column prop="grade" label="年级"></el-table-column>
        <el-table-column prop="zy" label="专业"></el-table-column>
        <el-table-column prop="xz" label="现状"></el-table-column>
        <el-table-column prop="phone" label="联系方式"></el-table-column>
        <el-table-column label="操作">
            <template #default="{row,index}">
                <el-button type="text">查看详情</el-button>
                <el-button type="text" style="color: rgb(245, 108, 108);">删除</el-button>
            </template>
        </el-table-column>
     </el-table>
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
  }
</style>