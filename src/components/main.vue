<script setup>
import axios from 'axios';
import { stringify } from 'postcss';
import { ref, onUnmounted, computed } from 'vue';
import ElementPlus from 'element-plus'
import { ElButton, ElTable, ElTableColumn, ElMessage } from 'element-plus'
import 'element-plus/dist/index.css'
import { useRoute } from 'vue-router';  

/* 飞书多维表格API -- begin */
//获取app_access_token
let getAppAccessToken = async () => {
    const response = await fetch('/open-apis/auth/v3/app_access_token/internal',{
        method: 'POST',
        headers:{
            'Content-Type': "application/json; charset=utf-8"
        },
        body: JSON.stringify({
            app_id: 'cli_a7be0d481e3cd00c',
            app_secret: 'om6ZIgZNSS5xLcavK6pSjdq6SJRAPTon'
        })
    });
    // console.log(await response.json());
    
    const data = await response.json();
    return data.app_access_token;
}

//获取tenant_access_token
let getTenantAccessToken = async () => {
    const response = await fetch(`/open-apis/auth/v3/tenant_access_token/internal`,{ 
        method: 'POST',
        headers:{
            'Content-Type': "application/json; charset=utf-8"
        },
        body: JSON.stringify({
            app_id: 'cli_a7be0d481e3cd00c',
            app_secret: 'om6ZIgZNSS5xLcavK6pSjdq6SJRAPTon'
        })
    }); 
    const data = await response.json();
    return data.tenant_access_token;
}

//查询记录
let getRecord = async () => {
    const tenantAccessToken = await getTenantAccessToken();
    const response = await fetch(`/open-apis/bitable/v1/apps/M5l2bHYEiaYq2esmVM1cTyamn5s/tables/tblM1AuOpuhpxBSb/records/search`,{     
        method: 'POST',
        headers:{
            Authorization: `Bearer ${tenantAccessToken}`,
            'Content-Type': "application/json; charset=utf-8"
        },
        body:JSON.stringify({
            view_id:'vewqjDXwMS',
            field_names:['当前状态','负责人','预计结束时间'],
            automatic_fields:false
        })
    }); 
    // console.log(tenantAccessToken);
    // const data = await response.json();
    // console.log(data);
    
    // return data.data.items.map(item => item.record_id);
    // // return data.data.items[0].record_id;
    const data = await response.json();
    return data; 
}

//批量获取记录
// let getRecords = async () => {
//     const tenantAccessToken = await getTenantAccessToken();
//     let recordIds = await getRecord();
//     recordIds = recordIds.slice(0,4);
//     console.log(recordIds);
    
//     const response = await fetch(`/open-apis/bitable/v1/apps/M5l2bHYEiaYq2esmVM1cTyamn5s/tables/tblM1AuOpuhpxBSb/records/batch_get`,{
//         method: 'POST',
//         headers:{
//             'Authorization': `Bearer ${tenantAccessToken}`,
//             'Content-Type': "application/json; charset=utf-8",
//         },
//         body: JSON.stringify({
//             record_ids: recordIds,
//             // record_ids: [`${recordIds}`],
//             // with_shared_url: false,
//             // user_id_type: 'open_id',
//             // automatic_fields: false
//         })
//     }); 
//     const data = await response.json();
//     console.log(data.data);
    
//     return data;
// }

//更新项目进度中的数据



let updateProjectProgress = async () => {
    try {
        const response = await getRecord();
        console.log(response);
        if (response.code === 0 && response.data?.items) {
            const responsibleRecords = response.data.items.filter(record => 
                Array.isArray(record.fields.负责人) && 
                record.fields.负责人.some(person => person.name === "姚焕增")
            );
            
            if (responsibleRecords.length > 0) {
                const totalTasks = responsibleRecords.length;
                const unfinishedTasks = responsibleRecords.filter(record => 
                    record.fields['当前状态'] !== '已完成'
                ).length;
                const soonOverdue = responsibleRecords.filter(record => {
                    const endDate = new Date(record.fields['预计结束时间']);
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    return endDate < tomorrow && endDate >= new Date();
                }).length;
                const overdue = responsibleRecords.filter(record => 
                    new Date(record.fields['预计结束时间']) < new Date() && record.fields['当前状态'] !== '已完成'
                ).length;

                // 更新DOM元素
                document.getElementById('totalTasks').textContent = totalTasks;
                document.getElementById('unfinishedTasks').textContent = unfinishedTasks;
                document.getElementById('soonOverdue').textContent = soonOverdue;
                document.getElementById('overdue').textContent = overdue;
            }
        } else {
            console.error('获取记录失败:', response);
        }
    } catch (error) {
        console.error('更新项目进度时发生错误:', error);
    }
}

updateProjectProgress();

/* 飞书多维表格API -- end */


/* 消息 -- begin */
const inf_s = ref([
  { userId: 1, content: 'Welcome to the system!', isRead: false, type: 0 },
  { userId: 2, content: 'Your report has been approved.', isRead: true, type: 1 },
  { userId: 3, content: 'Reminder: Team meeting tomorrow at 10 AM.', isRead: false, type: 1 },
  { userId: 4, content: 'Reminder: Team meeting tomorrow at 10 AM.', isRead: false, type: 0 },
  { userId: 5, content: 'Reminder: Team meeting tomorrow at 10 AM.', isRead: false, type: 1 },
  { userId: 6, content: 'Reminder: Team meeting tomorrow at 10 AM.', isRead: false, type: 0 },
  { userId: 7, content: 'Reminder: Team meeting tomorrow at 10 AM.', isRead: false, type: 1 },
  { userId: 8, content: 'Reminder: Team meeting tomorrow at 10 AM.', isRead: false, type: 1 },
  { userId: 9, content: 'Reminder: Team meeting tomorrow at 10 AM.', isRead: false, type: 1 },
  { userId: 10, content: 'Reminder: Team meeting tomorrow at 10 AM.', isRead: false, type: 0 },   
]);
const totalInf = ref(0);//总消息数
const currentPage = ref(1);//当前页码
const totalPage = ref(1);//总页数
const showInfDetail = ref(false);//是否显示消息详情
const infContent = ref('');//消息详情内容

const timestamp = ref(0);//时间戳
let intervalId = null;//定时器ID
const userToken = localStorage.getItem('userToken') ||  '';//用户token

//获取所有消息
const getAllInf = async () => {
    const response = await axios.get('/main/getAnnounces');
    console.log(response);
} 
getAllInf();

//计算更新总消息数
const updateTotalInf = () => {
    totalInf.value = inf_s.value.filter(inf =>!inf.isRead).length;
};
// 计算总页数
const updateTotalPage = () => { 
    totalPage.value = Math.ceil(totalInf.value / 5);
};
updateTotalInf();
updateTotalPage();


// 全部已读
const readAll = () => {
    inf_s.value = inf_s.value.map(inf => ({ ...inf, isRead: true }));
    ElMessage.success('所有消息已标为已读');
};

// 消息点击事件
const handleInfClick = (inf) => {  
    showInfDetail.value = true;// 显示消息详情
    infContent.value = inf.content;   
    updateInfReadStatus(inf.userId);// 标记为已读并更新样式
};

// 更新单条消息的已读状态
const updateInfReadStatus = (infId) => {
    const index = inf_s.value.findIndex(inf => inf.userId === infId);
    if (index !== -1) {
        inf_s.value[index] = { ...inf_s.value[index], isRead: true };
    }
};

// 关闭消息详情视图
const closeInf = () => {
    showInfDetail.value = false;
};  

// 翻页
const paginatedMessages = computed(() => {
    const startIndex = (currentPage.value - 1) * 5;
    const endIndex = startIndex + 5;
    return inf_s.value.slice(startIndex, endIndex);
}); 

const handleCurrentChange = (page) => {
    currentPage.value = page;
};


/* 消息 -- end */



</script>


<template>
    <div class="integral">
        <div class="title"><h1>积分情况</h1></div>
        <div class="content">
            <div class="temp">
                <p>本月新增</p>
                <p style="text-indent: 47%;font-size: 20px;">0</p>
            </div>
            <div class="temp">
                <p>月排名</p>
                <p style="text-indent: 47%;font-size: 20px;">0</p>
            </div>
            <div class="temp">
                <p>剩余积分</p>
                <p style="text-indent: 47%;font-size: 20px;">0</p>
            </div>
            <div class="temp">
                <p>累计积分</p>
                <p style="text-indent: 47%;font-size: 20px;">0</p>
            </div>
        </div>       
    </div>


    <div class="information">
        
        <div class="title">
            <h3 class="inf-title">消息</h3>
            <el-button type="primary" text class="read-all" @click="readAll">全部已读</el-button>
        </div>

        <!-- 消息列表 -->
         <ul class="inf-list">
            <li
              v-for="inf in paginatedMessages"
              :key="inf.userId"
              class="inf-item"
            >
                <div class="dot-content" @click="handleInfClick(inf)">
                    <span v-if="!inf.isRead" class="unread-dot"></span>
                    <span :class="['inf-content',{read:inf.isRead}]">
                        {{inf.content.length > 25
                            ? inf.content.substring(0,25) + '...'
                            : inf.content
                        }}
                    </span>
                </div>
                <div class="inf-tag">
                    <span
                        :class="['inf-type',{system:inf.type === 0,type:inf.type === 1}]"
                    >
                        {{inf.type === 0 ? '系统通知' : '团队通知'}}
                    </span>
                </div>
            </li>
            <p v-if="inf_s.length === 0" class="no-data">暂无消息</p>
         </ul>

        <!-- 分页 -->
         <div class="inf-pagination">
            <el-pagination
                :page-size="5"              
                :total="totalInf"
                :current-page="currentPage"
                layout="prev, pager, next"
                @current-change="handleCurrentChange"
            />  
         </div>

         <!-- 弹窗  -->
          <el-dialog
            v-model="showInfDetail"
            title="消息详情"
            width="500px"
            align-center
            class="inf-detail"
          >
            <p class="inf-text">{{ infContent }}</p>
            <template #footer>
                <el-button @click="closeInf" class="inf-close">关闭</el-button>
            </template>
          </el-dialog>
    </div>


    <div class="project">
        <p style="height: 0px;">项目进度</p>
        <div class="container">
            <div class="box">
                <div class="title" style="height: 30px;">总任务数</div>
                <div class="data" id="totalTasks">0</div>
            </div>
            <div class="box">
                <div class="title" style="height: 30px;">我的未完成任务</div>
                <div class="data" id="unfinishedTasks">0</div>
            </div>
            <div class="box">
                <div class="title" style="height: 30px;">即将逾期</div>
                <div class="data" id="soonOverdue">0</div>
            </div>
            <div class="box">
                <div class="title" style="height: 30px;">已逾期</div>
                <div class="data" id="overdue">0</div>
            </div>
        </div>       
    </div>
</template>


<style>
.integral {
    width: 48.5%;
    height: 50%;
    font-size: 15px;
    color: #000;
    background-color: #fff;
    text-indent:20px;
    font-weight:bold;
    margin-right: 10px;

    float: left;

    .title {
        height: 20px;
    }
    h1 {
        font-size: 15px;
    }
    p {
        text-indent:40%;
    }

    .content {
        flex-wrap: wrap;
        gap: 20px;
        padding-top: 20px;
        padding-left: 20px;
        padding-right: 20px;
    }

    .temp {
        flex: 1 1 calc(50% - 20px);
        height: 20%;
        width: 40%;
        background-color: #ffffff;
        color: rgb(0, 0, 0);
        font-size: 10px;
        justify-content: center;

        margin-right: 20px;
        margin-bottom: 30px;

        float: left;

        border-radius: 4px;
        border: #000 1px solid;      
        box-shadow:10px 10px 20px rgba(0,0,0,0.2); 
    }
}

.project {
    width: 98.5%;
    height: 30%;
    font-size: 15px;
    color: #000;
    background-color: #fff;
    text-indent:20px;
    font-weight:bold;
    margin-top: 10px;

    float: left;

    .container {
        display: flex;      
        gap: 20px;
        padding: 20px;
    }

    .box {
        width: 15%;
        padding: 20px;
        margin-right: 20px;
        border: 1px solid #000;
        border-radius: 4px;
        box-shadow: 10px 10px 20px rgba(0,0,0,0.2);
        text-align: center;
        background-color: #ffffff;
    }

    .title {
        font-size: 12px;
        font-weight: bold;
        color: #000;
    }

    .data {
        font-size: 20px;
    }
}


/* 消息模块--begin */
.information {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: space-between;/* 垂直居中 */
    background-color: #fff;
    height: 50%;
    width: 49%;

    .title {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        margin-bottom: 10px;
    }

    .inf-title {
        font-size: 15px;
        color: #000;
        font-weight: bold;
        text-indent: 20px;
        float: left;
    }

    .read-all {
        float: right;
        margin-top: 10px;
        margin-right: 20px;
    }

    .inf-list {
        list-style: none;
        margin: 0;
        padding: 0;
        overflow-y: auto;
        max-height: 250px;
    }

    .inf-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 0px;
        margin-bottom: 5px;
        padding: 1px 30px;
    }

    .dot-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .unread-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: red;
    }   

    .inf-content {
        color: #000;
    }

    .inf-content.read {
        color: #999;
    }   

    .inf-tag {
        padding: 5px 10px;
        border-radius: 5px;
        color: #fff;
        font-size: 12px;
    }

    .inf-type.system {
        background-color: #67c23a;
        color: #fff;
        border-radius: 12px;
        padding: 5px 10px;
        font-size: 12px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
    }

    /* 已读系统通知的样式 */
    .inf-item:has(.inf-content.read) .inf-type.system {
        background-color: #e4e7ed;
        color: #909399;
        box-shadow: none;
    }

    .inf-type.type {
        background-color: #409eff;
        color: #fff;
        border-radius: 12px;
        padding: 5px 10px;
        font-size: 12px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);   
        transition: all 0.3s ease;
    }   

    /* 已读团队通知的样式 */
    .inf-item:has(.inf-content.read) .inf-type.type {
        background-color: #e4e7ed;
        color: #909399;
        box-shadow: none;
    }

    /* 分页容器 */
    .inf-pagination {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 20%;
    }   

    .no-data {
        text-align: center;
        margin-top: 20px;
        color: #999;
        font-size: 14px;    
    }   

    /* 弹窗样式 */
    ::v-deep(.el-dialog) {
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        background-color: #fff;
        overflow: hidden;
        animation: fadeIn 0.5s ease;    
    } 
    
    /* 弹窗标题 */
    ::v-deep(.inf-detail .el-dialog__title) {
        color: #333;
        padding: 10px 20px;
        font-size: 16px;
        font-weight: bold;
        text-align: center;
        border-bottom: 2px dashed #cccccc;
    }   

    /* 关闭按钮 */
    ::v-deep(.inf-detail .el-dialog__close) {
        font-size: 20px;
        color: #555;
        transition: color 0.3s ease;
    }

    ::v-deep(.inf-detail .el-dialog__close:hover) {
        color: #f56c6c;
    }

    /* 弹窗内容 */
    ::v-deep(.inf-detail .el-dialog__body) {
        padding: 15px 20px;
        font-size: 14px;
        color: #333;
        line-height: 1.5;
        text-align: left;
        background-color: #f9f9f9;
        border-radius: 10px;
        margin: 10px;
    }

    /* 添加分页组件样式 */
    :deep(.el-pagination) {
        justify-content: center;
        padding: 0;
        margin: 0;
    }

    :deep(.el-pagination .el-pager li) {
        background-color: transparent;
    }

    :deep(.el-pagination .el-pager li.active) {
        color: #409eff;
        font-weight: bold;
    }
}

/* 消息模块--end */ 




</style>