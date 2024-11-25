<script setup>
import axios from 'axios';
import { stringify } from 'postcss';
import { ref, onUnmounted } from 'vue';
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
    console.log(tenantAccessToken);
    const data = await response.json();
    console.log(data);
    
    return data.data.items.map(item => item.record_id);
    // return data.data.items[0].record_id;
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
    // const GetRecords = await getRecords();
    // const records = GetRecords.items;
    let records = await getRecord();
    
    if(records.data.items.fields.负责人 === "姚焕增"){
        // 姓名匹配负责人，然后更新项目进度中的数据,距离结束时间3天内的为即将逾期，已逾期为距离结束时间超过当前时间
        let totalTasks = records.length;
        let unfinishedTasks = records.filter(record => record.fields['当前状态'] !== 'Completed').length;
        let soonOverdue = records.filter(record => new Date(record.fields['预计结束时间']) < new Date(new Date().getTime() + (3*24*60*60*1000)) && new Date(record.fields['预计结束时间']) >= new Date()).length;
        let overdue = records.filter(record => new Date(record.fields['预计结束时间']) < new Date()).length;
    }
    

    console.log(`Total Tasks: ${totalTasks}, Unfinished Tasks: ${unfinishedTasks}, Soon Overdue: ${soonOverdue}, Overdue: ${overdue}`);
}

updateProjectProgress();

/* 飞书多维表格API -- end */


/* 消息 -- begin */
const inf_s = ref([
  { userId: '1', content: 'Welcome to the system!', isRead: false, type: 0 },
  { userId: '2', content: 'Your report has been approved.', isRead: true, type: 1 },
  { userId: '3', content: 'Reminder: Team meeting tomorrow at 10 AM.', isRead: false, type: 1 },
  { userId: '4', content: 'Reminder: Team meeting tomorrow at 10 AM.', isRead: false, type: 0 },
  { userId: '5', content: 'Reminder: Team meeting tomorrow at 10 AM.', isRead: false, type: 1 },
  { userId: '6', content: 'Reminder: Team meeting tomorrow at 10 AM.', isRead: false, type: 0 },
  { userId: '7', content: 'Reminder: Team meeting tomorrow at 10 AM.', isRead: false, type: 1 },
  { userId: '8', content: 'Reminder: Team meeting tomorrow at 10 AM.', isRead: false, type: 1 },
  { userId: '9', content: 'Reminder: Team meeting tomorrow at 10 AM.', isRead: false, type: 1 },
  { userId: '10', content: 'Reminder: Team meeting tomorrow at 10 AM.', isRead: false, type: 0 },   
]);
const totalInf = ref(0);//总消息数
const currentPage = ref(1);//当前页码
const totalPage = ref(1);//总页数
const showInfDetail = ref(false);//是否显示消息详情
const infContent = ref('');//消息详情内容

const timestamp = ref(0);//时间戳
let intervalId = null;//定时器ID
const userToken = localStorage.getItem('userToken') ||  '';//用户token

//后端接口，记得定义




//获取当前消息列表
const fetchInfList = async (page = 1) => {
    try {
        const data = await getInfList(userToken, page, timestamp.value);
        if (data?.code === 200) {// 添加空值检查，如果 inf_s 未定义则使用空数组            
            const messages = data.data?.inf_s || [];
            if (messages.length > 0) {
                inf_s.value = messages.filter((msg) => msg?.content);
                totalPage.value = data.data?.total_page || 1;
                totalInf.value = data.data?.total || 0; // 假设后端返回 total 表示总记录数
            } else {
                // 如果没有消息，设置默认值
                inf_s.value = [];
                totalPage.value = 1;
                totalInf.value = 0;
            }
        } else {
            console.error('获取消息列表失败', data?.text);
            inf_s.value = []; // 错误情况下设置为空数组
            totalInf.value = 0;
        }
    } catch (error) {
        console.error('获取消息列表失败', error);
        inf_s.value = []; // 错误情况下设置为空数组
        totalInf.value = 0;
    }
}

//翻页重新获取数据
const handleCurrentChange = async (page) => {
    currentPage.value = page;
    await fetchInfList(page);
};

//全部已读
const readAll = async () => {
    if (!inf_s.value.length) return; // 如果没有消息，直接返回
    
    const unreadInf = inf_s.value.filter((msg) => !msg.isRead);
    if (!unreadInf.length) return; // 如果没有未读消息，直接返回
    
    const userIds = unreadInf.map((msg) => msg.userId);

    try {
        const data = await readInf(userIds);
        if (data?.code === 200) {
            unreadInf.forEach((msg) => (msg.isRead = true));
        } else {
            throw new Error(data?.message || '后端返回错误');
        }
    } catch (error) {
        console.error('全部已读失败', error);
        ElMessage.error('标记全部已读失败，请稍后重试');
    }
}

//消息已读
const handleInfClick = async (inf) => {
    if (!inf) return;
    
    infContent.value = inf.content;
    showInfDetail.value = true;

    if (!inf.isRead) {
        try {
            const data = await readInf([inf.userId]);
            if (data?.code === 200) {
                inf.isRead = true;
            } else {
                throw new Error(data?.message || '标记已读失败');
            }
        } catch (error) {
            console.error('消息已读失败', error);
            ElMessage.error('标记已读失败，请稍后重试');
        }
    }
};

//关闭消息详情
const closeInf = () => {
    showInfDetail.value = false;
};  

//定时检查更新
const checkUpdate = async () => {
    if (!userToken) return; // 如果没有token，不执行检查
    
    try {
        const data = await getInfList(userToken, 1, timestamp.value);
        if (data?.code === 200 && data.data?.isUpdate) {
            await fetchInfList(currentPage.value);
            // 可选：有新消息时提醒用户
            ElMessage.info('收到新消息');
        }
    } catch (error) {
        console.error('定时检查更新失败', error);
    }
};

//启动定时检查
const startCheckForUpdate = () => {
    // 清除可能存在的旧定时器
    if (intervalId) {
        clearInterval(intervalId);
    }

    // 页面可见性变化监听
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            clearInterval(intervalId);
        } else {
            intervalId = setInterval(checkUpdate, 60000); // 每分钟检查一次
            checkUpdate(); // 立即检查一次
        }
    });

    // 初始启动定时器
    if (!document.hidden) {
        intervalId = setInterval(checkUpdate, 60000);
        checkUpdate(); // 立即检查一次
    }
};

// 组件卸载时清理定时器
onUnmounted(() => {
    if (intervalId) {
        clearInterval(intervalId);
    }
});

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
              v-for="inf in inf_s"
              :key="inf.userId"
              class="inf-item"
            >
                <div class="dot-content" @click="handleInfClick(inf)">
                    <span v-if="!inf.isRead" class="unread-dot"></span>
                    <span :class="['inf-content',{read:inf.isRead}]">
                        {{inf.length > 25
                            ? inf.content.sliderContextKey(0,25) + '...'
                            :inf.content
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
            <p v-if="inf_s?.value?.length" class="no-data">暂无消息</p>
         </ul>

        <!-- 分页 -->
         <div class="inf-pagination">
            <!-- <el-pagination
                layout="prev, pager, next"
                :total="totalInf"
                :page-size="5"
                :current-page="currentPage"
                @current-change="handleCurrentChange"
            /> -->
            <el-pagination
                :page-size="5"
                layout="prev, pager, next"
                :total="totalInf"
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
        margin-bottom: 10px;
        padding: 1px 20px;
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
        transition: background-color 0.3s ease, box-shadow 0.3s ease;
    }

    .inf-type.system:hover {
        background-color: #85ce61;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    .inf-type.type {
        background-color: #409eff;
        color: #fff;
        border-radius: 12px;
        padding: 5px 10px;
        font-size: 12px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);   
        transition: background-color 0.3s ease, box-shadow 0.3s ease;
    }   

    .inf-type.type:hover {
        background-color: #66b1ff;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
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