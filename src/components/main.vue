<script setup>
import axios from 'axios';
import { stringify } from 'postcss';
import { ref, onUnmounted, computed } from 'vue';
import ElementPlus from 'element-plus'
import { ElButton, ElTable, ElTableColumn, ElMessage } from 'element-plus'
import 'element-plus/dist/index.css'
import { useRoute } from 'vue-router';  
   import {useUserStore} from '@/stores'
   const userStore=useUserStore()
/* 飞书多维表格API -- begin */
//获取app_access_token
let getAppAccessToken = async () => {
    const response = await fetch('open-apis/auth/v3/app_access_token/internal',{
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
    const response = await fetch(`open-apis/bitable/v1/apps/M5l2bHYEiaYq2esmVM1cTyamn5s/tables/tblM1AuOpuhpxBSb/records/search`,{     
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
    const data = await response.json();
    return data; 
}

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
const inf_s = ref([]);
const totalInf = ref(0);//总消息数
const currentPage = ref(1);//当前页码
const totalPage = ref(1);//总页数
const showInfDetail = ref(false);//是否显示消息详情
const infContent = ref('');//消息详情内容

const timestamp = ref(0);//时间戳
let intervalId = null;//定时器ID
const userToken = userStore.accessToken;//用户token
const userId = userStore.userId;//用户ID

//获取一页消息
const getOneInf = async () => {
    try{
        const response = await axios.get('http://8.134.110.164:8091/api/v1/announce/getUserAnnounce',{
            params:{
                userId:userId,
                limit: 5,
            },
            headers:{
                'Content-Type': 'application/json',
                'access_token': `${userToken}`
            }
        });
        
        if(response?.data?.data?.userAnnounce){
            inf_s.value = [...inf_s.value, ...response.data.data.userAnnounce];
            totalInf.value = inf_s.value.length;
            updateTotalPage();
        } else {
            inf_s.value = [];
            totalInf.value = 0;
            updateTotalPage();
            console.log('No announcements found:', response.data);
        }
    }catch(error){  
        console.error('获取所有消息失败:', error);
        inf_s.value = [];
        totalInf.value = 0;
        updateTotalPage();
    } 
} 
getOneInf();

//计算更新总消息数
const updateTotalInf = () => {
    totalInf.value = inf_s.value.filter(inf =>!inf.read).length;
};
// 计算总页数
const updateTotalPage = () => { 
    totalPage.value = Math.ceil(totalInf.value / 5);
};
updateTotalInf();
updateTotalPage();


// 全部已读
const readAllInf = async () => {
    const response = await axios.post('http://8.134.110.164:8091/api/v1/announce/readAllAnnounce',{
            userId: userId
        },{
        headers:{
            'Content-Type': 'application/json',
            'access_token': `${userToken}`
        }   
    })
    console.log(response);
}

const readAll = () => {
    inf_s.value = inf_s.value.map(inf => ({ ...inf, read: true }));
    
    readAllInf().then(() => {
        ElMessage.success('所有消息已标为已读');
    });
};

//单条信息已读
const readOneInf = async (infId) => {
    console.log(userId,infId);
    const response = await axios.post('http://8.134.110.164:8091/api/v1/announce/readUserAnnounce',{
            userId: userId,
            announceId: infId
        },{
        headers:{
            'Content-Type': 'application/json',
            'access_token': `${userToken}`
        }   
    })
    console.log(response);
}   

// 消息点击事件
const handleInfClick = (inf) => {  
    showInfDetail.value = true;// 显示消息详情
    infContent.value = inf.body;
    updateInfReadStatus(inf.announceId);// 标记为已读并更新样式
    readOneInf(inf.announceId);
};

// 更新单条消息的已读状态
const updateInfReadStatus = (infId) => {
    const index = inf_s.value.findIndex(inf => inf.announceId === infId);
    if (index !== -1) {
        inf_s.value[index] = { ...inf_s.value[index], read: true };
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

const handleCurrentChange = async (page) => {
    currentPage.value = page;

    if(page === totalPage.value){
        await getOneInf();
    }
};


/* 消息 -- end */



</script>


<template>
    <div class="dashboard-container">
        <div class="dashboard-row">
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
                <div class="inf-container">
                    <div class="title">
                        <h3 class="inf-title">消息</h3>
                        <el-button type="primary" text class="read-all" @click="readAll">全部已读</el-button>
                    </div>

                    <ul class="inf-list">
                        <li
                          v-for="inf in paginatedMessages"
                          :key="inf.announceId"
                          class="inf-item"
                          :class="{ 'hover-effect': !inf.read }"
                          @click="handleInfClick(inf)"
                        >
                            <div class="dot-content">
                                <span v-if="!inf.read" class="unread-dot"></span>
                                <span :class="['inf-content',{read:inf.read}]">
                                    {{ inf.title }}
                                </span>
                            </div>
                            <div class="inf-tag">
                                <span
                                    :class="['inf-type',{system:inf.type === 0,type:inf.type === 1}]"
                                >
                                    <i :class="inf.type === 0 ? 'el-icon-bell' : 'el-icon-user-solid'"></i>
                                    {{inf.type === 0 ? '系统通知' : '团队通知'}}
                                </span>
                            </div>
                        </li>
                        <el-empty v-if="inf_s.length === 0" description="暂无消息" />
                    </ul>

                    <div class="inf-pagination">
                        <el-pagination
                            :page-size="5"              
                            :total="totalInf"
                            :current-page="currentPage"
                            layout="prev, pager, next"
                            @current-change="handleCurrentChange"
                        />  
                    </div>
                </div>
            </div>
        </div>


        <div class="project">
            <p style="height: 10px;">项目进度</p>
            <div class="container">
                <div class="box">
                    <div class="box-content">
                        <div class="header">
                            <div class="icon-wrapper hexagon">
                                <i class="el-icon-s-order"></i>
                            </div>
                            <div class="title">总任务数</div>
                        </div>
                        <div class="data" id="totalTasks">0</div>
                    </div>
                </div>
                <div class="box">
                    <div class="box-content">
                        <div class="header">
                            <div class="icon-wrapper square">
                                <i class="el-icon-s-management"></i>
                            </div>
                            <div class="title">未完成任务</div>
                        </div>
                        <div class="data" id="unfinishedTasks">0</div>
                    </div>
                </div>
                <div class="box">
                    <div class="box-content">
                        <div class="header">
                            <div class="icon-wrapper diamond warning">
                                <i class="el-icon-warning-outline"></i>
                            </div>
                            <div class="title">即将逾期</div>
                        </div>
                        <div class="data" id="soonOverdue">0</div>
                    </div>
                </div>
                <div class="box">
                    <div class="box-content">
                        <div class="header">
                            <div class="icon-wrapper triangle danger">
                                <i class="el-icon-warning"></i>
                            </div>
                            <div class="title">已逾期</div>
                        </div>
                        <div class="data" id="overdue">0</div>
                    </div>
                </div>
            </div>       
        </div>
    </div>

    <!-- 添加消息详情弹 -->
    <el-dialog
        v-model="showInfDetail"
        title="消息详情"
        width="30%"
        class="inf-detail"
        :show-close="true"
        @close="closeInf"
    >
        <div class="inf-detail-content">
            {{ infContent }}
        </div>
    </el-dialog>
</template>


<style>
.dashboard-container {
    width: 100%;
    height: 100%;
}

.dashboard-row {
    width: 100%;
    height: 50%;
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
}

.integral {
    width: 50%;
    height: 100%;
    background-color: #fff;
    font-size: 15px;
    color: #000;
    text-indent:20px;
    font-weight:bold;
    padding-top: 10px;
    padding-bottom: 20px;

    .title {
        height: 20px;
        padding: 10px 0 0 0;
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
        transition: all 0.3s ease;
        cursor: pointer;

        &:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 30px rgba(0,0,0,0.15);
            border-color: #409eff;
            background: linear-gradient(145deg, #ffffff, #f5f7fa);
        }

        p:last-child {
            color: #409eff;
            font-weight: bold;
            transition: all 0.3s ease;
        }

        &:hover p:last-child {
            transform: scale(1.1);
            color: #336699;
        }
    }
}

.project {
    width: 100%;
    height: 200px;
    margin-top: 20px;
    padding-right: 10px;
    font-size: 15px;
    color: #000;
    background-color: #fff;
    text-indent:20px;
    font-weight:bold;

    float: left;

    .container {
        margin-top: 30px;
        display: flex;      
        gap: 8px;
        padding: 0 8px;
        height: 80px;
    }

    .box {
        flex: 1;
        padding: 8px 12px;
        margin-left: 10px;
        margin-right: 10px;
        height: 70px;
        border-radius: 4px;
        background: #ffffff;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
        transition: all 0.3s ease;
        border: 1px solid #e4e7ed;
    }

    .box:last-child {
        margin-right: 0;
    }

    .box:hover {
        transform: translateY(-2px);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }

    .box-content {
        position: relative;
    }

    .header {
        display: flex;
        align-items: center;
        gap: 4px;
        margin-bottom: 2px;
    }

    .icon-wrapper {
        width: 18px;
        height: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .icon-wrapper i {
        font-size: 11px;
    }

    /* 六边形图标 */
    .icon-wrapper.hexagon {
        background: #ecf5ff;
        clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
    }

    /* 正方形图标 */
    .icon-wrapper.square {
        background: #7d8792;
        transform: rotate(25deg);
    }

    .icon-wrapper.square i {
        transform: rotate(-45deg);
        display: inline-block;
    }

    /* 菱形图标 */
    .icon-wrapper.diamond {
        background: #dbcbb6;
        clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
    }

    .icon-wrapper.diamond i {
        color: #c48a34;
    }

    /* 三角形图标 */
    .icon-wrapper.triangle {
        background: #f7dbdb;
        clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
    }

    .icon-wrapper.triangle i {
        color: #f56c6c;
        transform: translateY(2px);
    }

    .title {
        font-size: 11px;
        color: #000000;
        font-weight: bold;
        flex: 1;
    }

    .data {
        font-size: 14px;
        font-weight: bold;
        color: #303133;
        margin-top: 2px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .box:hover .data {
        transform: scale(1.05);
        color: #409eff;
    }

    /* 添加渐变边框效果 */
    .box::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(90deg, transparent, rgba(64, 158, 255, 0.5), transparent);
        transform: scaleX(0);
        transition: transform 0.3s ease;
    }

    .box:hover::before {
        transform: scaleX(1);
    }

    /* 响应式调整 */
    @media (max-width: 768px) {
        .project .container {
            flex-wrap: wrap;
            gap: 8px;
        }
        
        .project .box {
            flex: 1 1 calc(50% - 8px);
            margin-bottom: 8px;
        }
    }
}


/* 消息模块--begin */
.information {
    width: 50%;
    height: 100%;
    background-color: #fff;
    padding: 15px;
}

.inf-container {
    height: 100%;
    display: flex;
    flex-direction: column;
}

.title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    height: 30px;
}

.inf-list {
    flex: 1;
    list-style: none;
    margin: 0;
    padding: 5px 0;
    overflow-y: auto;
}

.inf-pagination {
    margin-top: auto;
    padding: 2px 0;
    height: 15px;
}

.inf-title {
    font-size: 15px;
    color: #000;
    font-weight: bold;
    text-indent: 5px;
    float: left;
}

.read-all {
    float: right;
    margin-top: 10px;
    margin-right: 20px;
}

.inf-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 15px;
    margin: 2px 5px;
    border-radius: 6px;
    transition: all 0.3s ease;
    cursor: pointer;
    background-color: #f8f9fa;
    border: 1px solid transparent;
    flex-wrap: nowrap;
    height: 14%;
    min-height: 30px;
}

.inf-item:hover {
    background-color: #f0f2f5;
    transform: translateX(5px);
}

.hover-effect {
    border-left: 3px solid #409eff;
}

.dot-content {
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 1;
    overflow: visible;
}

.unread-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #f56c6c;
    box-shadow: 0 0 5px rgba(245, 108, 108, 0.5);
    animation: pulse 2s infinite;
    margin-top: 1px;
}

@keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
}

.inf-content {
    color: #303133;
    font-size: 13.5px;
    transition: color 0.3s ease;
    word-break: break-word;
    line-height: 1.3;
    display: block;
    overflow: visible;
    flex: 1;
    padding: 2px 0;
}

.inf-content.read {
    color: #909399;
}

.inf-type {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 8px;
    border-radius: 10px;
    font-size: 11.5px;
    font-weight: 500;
    transition: all 0.3s ease;
    margin-left: 10px;
}

.inf-type i {
    font-size: 14px;
}

.inf-type.system {
    background-color: rgba(103, 194, 58, 0.1);
    color: #67c23a;
}

.inf-type.type {
    background-color: rgba(64, 158, 255, 0.1);
    color: #409eff;
}

/* 已读消息样式 */
.inf-item:has(.inf-content.read) .inf-type {
    opacity: 0.6;
}

.inf-tag {
    padding: 5px 10px;
    border-radius: 5px;
    color: #fff;
    font-size: 12px;
    flex-shrink: 0;
}

.inf-type.system {
    background-color: #67c23a;
    color: #fff;
    border-radius: 12px;
    padding: 2px 6px;
    font-size: 10px;
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
    padding: 2px 6px;
    font-size: 10px;
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
    height: 15px;
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
    align-items: center;
    padding: 0;
    margin: 0;
    line-height: 15px;
    transform: scale(0.8);
}

:deep(.el-pagination .el-pager li) {
    background-color: transparent;
}

:deep(.el-pagination .el-pager li.active) {
    color: #409eff;
    font-weight: bold;
}

/* 消息模块--end */ 

/* 弹窗样式 */
.inf-detail {
    .el-dialog__header {
        padding: 15px 20px;
        border-bottom: 1px solid #eee;
    }

    .el-dialog__body {
        padding: 20px;
    }

    .inf-detail-content {
        font-size: 14px;
        line-height: 1.6;
        color: #333;
        word-break: break-word;
    }
}

/* 弹窗动画 */
.el-dialog {
    border-radius: 8px;
    overflow: hidden;
}

:deep(.el-dialog__title) {
    font-size: 16px;
    font-weight: bold;
}

:deep(.el-dialog__headerbtn) {
    font-size: 18px;
}

:deep(.el-dialog__body) {
    padding: 20px;
    max-height: 60vh;
    overflow-y: auto;
}

</style>