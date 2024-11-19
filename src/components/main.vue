<script>
import axios from 'axios';
import { stringify } from 'postcss';


/* 飞书多维表格API -- begin */
async function getAppAccessToken() {
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

//获取登录预授权码
async function getLoginCode() {
    let redirect_uri = 'https://127.0.0.1:5173/main';
    redirect_uri = encodeURIComponent(redirect_uri);
    const response = await fetch(`/open-apis/authen/v1/authorize?app_id=cli_a7be0d481e3cd00c&redirect_uri=${redirect_uri}&scope=bitable:app`,{
        method: 'GET',
    }); 
    

    const data = await response.json();
    // console.log(data);
    return data.login_code; 
}

async function accessToken() {
    let token = await getAppAccessToken();
    let code = await getLoginCode();

    const response = await fetch('/open-apis/authen/v1/oidc/access_token',{
        method: 'POST',
        headers:{
            'Content-Type': "application/json; charset=utf-8",
            'Authorization':token
        },
        body: JSON.stringify({
            grant_type: 'authorization_code',
            code: code,
        })
    });

    const data = await response.json();
    return data.user_access_token;
}


// //刷新user_token
// async function refreshToken() {
//     let token = await getAppAccessToken();

//     const response = await fetch('/open-apis/authen/v1/oidc/refresh_access_token',{
//         method: 'POST',
//         headers:{
//             'Content-Type': "application/json; charset=utf-8",
//             'Authorization':token
//         },
//         body: JSON.stringify({
//             grant_type: 'refresh_token',
//             refresh_token: refresh_token
//         })
//     });

//     const data = await response.json();
//     return data.user_access_token;
// }

// //获取表格元数据
// async function getSheetData(user_access_Token) {

//     const response = await fetch('/open-apis/bitable/v1/apps/M5l2bHYEiaYq2esmVM1cTyamn5s',{
//         method: 'GET',
//         headers:{
//             'Authorization': `Bearer ${user_access_Token}`,
//         }
//     });

//     const data = await response.json();
//     return data.spreadsheets;
// }

//查询记录
async function queryRecords(){
    //获取access_token
    const access_Token = await accessToken();
    const app_token = 'M5l2bHYEiaYq2esmVM1cTyamn5s';
    const table_id = 'tblM1AuOpuhpxBSb';

    const response = await fetch(`/open-apis/bitable/v1/apps/${app_token}/tables/${table_id}/records/search`,{
        method: 'POST',
        headers:{
            'Content-Type': "application/json; charset=utf-8",
            'Authorization': `Bearer ${access_Token}`,
        }
    });

    const data = await response.json();
    const Data = {
        queryRecords: data.queryRecords,
        access_Token: access_Token
    }
    return Data;
}

//获取多维表格记录
async function getSheetRecords() {

    // const user_Token = await accessToken();
    // const queryRecord = await queryRecords();
    const Data = await queryRecords();
    const query_Records = Data.queryRecords;
    const access_Token = Data.access_Token;
    // getSheetData(user_Token);

    const response = await fetch('/open-apis/bitable/v1/apps/M5l2bHYEiaYq2esmVM1cTyamn5s/tables/tbl_a7be0d481e3cd00c/records/batch_get',{
        method: 'POST',
        headers:{
            'Authorization': `Bearer ${access_Token}`,
            'Content-Type': "application/json; charset=utf-8",
        },
        body: JSON.stringify({
            "record_ids": query_Records,
            "user_id_type": "open_id",
            "with_shared_url": true,
            "automatic_fields": true
        }),
    });
    

    const data = await response.json();
    return data.records;
}



async function updateTaskData(){
    try{
        //获取access_token
        // const accessToken =  await getAppAccessToken();

        //获取表格数据
        //const spreadsheetToken = 'cli_a7be0d481e3cd00c';
        const sheetData = await getSheetRecords();

        const taskData = {
            totalTasks: sheetData.total_tasks || 0,
            unfinishedTasks: sheetData.unfinished_tasks || 0,
            soonOverdue: sheetData.soon_overdue || 0,
            overdue: sheetData.overdue || 0
        };

        //更新数据
        document.getElementById('totalTasks').textContent = taskData.totalTasks;
        document.getElementById('unfinishedTasks').textContent = taskData.unfinishedTasks;
        document.getElementById('soonOverdue').textContent = taskData.soonOverdue;
        document.getElementById('overdue').textContent = taskData.overdue;
    }catch(error){
        console.error('Error updating task data:',error);
    }
}

updateTaskData();

/* 飞书多维表格API -- end */


/* 消息 -- begin */
export default{
    data() {
        return {
            messages: [{
                id: 1,
                title: '系统通知',
                content: '您有新的任务需要完成',
                type:'system',
                read: false,
            },{
                id: 2,
                title: '团队通知',
                content: '团队会议即将开始',
                type: 'team',
                read: false,
            },{
                id: 2,
                title: '团队通知',
                content: '团队会议即将开始',
                type: 'team',
                read: false,
            },{
                id: 2,
                title: '团队通知',
                content: '团队会议即将开始',
                type: 'team',
                read: false,
            },{
                id: 2,
                title: '团队通知',
                content: '团队会议即将开始',
                type: 'team',
                read: false,
            }
        ],
            loading: false,
            noMoreData: false,
            curPage: 1,
            pageSize: 5,           
        };
    },
    methods: {
        //更新数据
        async fetchMessages() {
            //防止重复请求
            if(this.loading || this.noMoreData) return;

            this.loading = true;
            try{
                const response = await axios.get(`https://`,{
                    params:{
                        page: this.curPage,
                        pageSize: this.pageSize,
                    },
                });

                const newMessages = response.data.messages;

                //返回的新的消息条数小于每页规定的的条数，说明已经没有更多数据了
                if(newMessages.length < this.pageSize){
                    this.noMoreData = true;
                }

                //将新申请的数据加到已有的里面
                this.messages = [...this.messages,...newMessages];
            }catch(error){
                console.error('获取消息失败',error);
            }finally{
                this.loading = false;
            }
        },

        //滚动事件
        handleScroll(event){
            const container = event.target;
            const bottom = container.scrollHeight === container.scrollTop + container.clientHeight;

            //到底部且不是正在加载数据时，加载新数据
            if(bottom && !this.loading &&!this.noMoreData){
                this.fetchMessages();
            }
        },

        //消息标记为已读
        markAsRead(message){
            if(!message.read){
                message.read = true;
            }
        },

        //全部标记为已读
        markAllAsRead(){
            this.messages.forEach(message => {
                message.read = true;
            });
        },

        //翻页,改变页码的时候会进行分页加载
        changePage(page){
            if(page < 1 && page === this.curPage)   return;

            this.curPage = page;
            this.messages = [];//要清空当前的数据
            this.noMoreData = false;//重置有无更多信息的标志
            this.fetchMessages();
        },
    },
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
                <p>本月排名</p>
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
        <p>消息</p>
        <div class="message-container" @scroll="handleScroll">
            <!-- 消息列表 -->
             <div v-for="(message,index) in messages" :key="message.id"
                    :class="['message',{unread: !message.read,'system-notice':message.type==='team'}]"
                    @click="markAsRead(message)">

                <div class="message-title">{{ message.title }}</div>
                <div class="message-content">{{ message.content }}</div>
                <div v-if="!message.read" class="status-dot"></div>
            </div>

            <!-- 加载中 -->
             <div v-if="loading" class="loading">加载中…………</div>

            <!-- 已经展示所有消息 -->
             <div v-if="noMoreData" class="no-more">已经到底了>_<</div>

            <!-- 翻页 -->
             <div v-if="!loading && !noMoreData" class="pagination">
                <button @click="changePage(curPage - 1)" :disabled="curPage <=1">上一页</button>
                <span>页码：{{ curPage }}</span>
                <button @click="changePage(curPage + 1)" :disabled="noMoreData">下一页</button>
             </div>

            <!-- 全部已读 -->
             <button v-if="messages.length > 0 && !loading" @click="markAllAsRead" class="mark-all-read">全部已读</button>
        </div>
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
        height: 80px;
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



.information {
    width: 49.5%;
    height: 50%;
    display: flex;
    font-size: 15px;
    color: #000;
    background-color: #fff;
    text-indent:20px;
    font-weight:bold;
    margin-left: 2px;

    float: left;
}

.project {
    width: 100%;
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
.message-container{
    max-height: 500px;
    overflow-y: auto;
    padding: 10px;
    position: relative;
}

.message{
    padding: 10px;
    border-bottom: 1px solid #ddd;
    margin-bottom: 10px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    position: relative;
}

.message-title{
    font-weight: bold;
    font-size: 14px;
}

.message-content{
    font-size: 12px;
    color: #555;
}

.status-dot{
    width: 8px;
    height: 8px;
    background-color: red;
    border-radius: 50%;
    position: absolute;
    top: 10px;
    right: 10px;
}

.message.unread{
    background-color: #f8f8f8;
    border: 1px solid #007bff;
}

.message.read{
    background-color: #f1f1f1;
    border: 1px solid #ccc;
}

.message.system-notice{
    background-color: #e7f3fe;
}

.message.team-notice{
    background-color: #fff3cd;
}

.loading{
    text-align: center;
    padding: 10px;
}

.no-more{
    text-align: center;
    padding: 10px;
    color: gray;
}

.pagination{
    text-align: center;
    margin-top: 20px;
    padding-top: 10px;
    position: sticky;
    bottom: 0;
    background-color: #fff;
    z-index: 10;
    border-top: 1px solid #ddd;
}

.pagination button{
    padding: 5px 10px;
    margin: 0 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.pagination button:disabled{
    background-color: #ccc;
    cursor: not-allowed;
}

.mark-all-read{
    background-color: #007bff;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 10px auto;
    display: block;
}

.mark-all-read:hover{
    background-color: #0056b3;
}




</style>