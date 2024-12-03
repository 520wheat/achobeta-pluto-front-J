<script setup >
   import router from '@/router/index.js'
   import {ref,onMounted,defineExpose} from 'vue'
   import {Loading,Delete,ArrowDown,Plus, MessageBox} from '@element-plus/icons-vue'
   import {teamQueryOrganization,teamModifyOranization,teamShowMessage,teamDeleteMember} from '@/api/team.js'
   import {useUserStore} from '@/stores'
   import { onBeforeRouteUpdate, useRoute } from 'vue-router';
   const userStore = useUserStore()
   let route = useRoute()
   console.log(route.query);
   const isManager=ref()//判断是否为管理员
   const dialogTeam = ref(false)
   const lastId = ref('')
   const userId=userStore.userId
   const teamId=ref()//团队信息团队Id
  const currentTeam=ref()//团队信息当前团队名称
   if(route.query.teamId){
      teamId.value=route.query.teamId
      userStore.teams.forEach(item=>{
        if(item.teamId===teamId.value){
          currentTeam.value=item.teamName
        }
      })
   }else{
      teamId.value=userStore.teams[0].teamId
      currentTeam.value=userStore.teams[0].teamName
   }
    const manageCurrentTeam=ref()
  manageCurrentTeam.value=JSON.parse(JSON.stringify(currentTeam.value))//团队架构管理当前团队名称
 let manageTeamId=teamId.value//团队架构管理团队Id

 //判断当前用户在所选团队是不是管理员
const currentTeamIsManager = ()=>{
  userStore.teams.forEach(item=>{
   if(item.teamId===teamId.value){
      if(item.permissions.member===1){
        isManager.value=true;
      }else{
        isManager.value=false;
      }
   }
 })
}
 currentTeamIsManager();
 //
   const manage = ref([
    {
        userName:'张三',
        teams:[
          "设计者-设计负责人",
          "研发组-后端组-后端负责人",
          "财务组-财务负责人"
        ],
        grade:'2019',
        major:'网络工程',
        currentStatus:'在校',
        phone:'13025316517'
    },
    {
        userName:'张三',
        teams:[
          "设计者-设计负责人",
          "研发组-后端组-后端负责人",
          "财务组-财务负责人"
        ],
        grade:'2019',
        major:'网络工程',
        currentStatus:'在校',
        phone:'13025316517'
    },
   ])
    const tableData = ref()
    // const requestMemberListDTO = {
    //   userId:userId,
    //   teamId:teamId.value,
    //   lastId:lastId.value,
    //   limit:'10'
    // }
    // console.log(requestMemberListDTO);
    // userId,teamId.value,lastId.value,10
  //团队成员信息页面渲染
   const ShowMessage = () =>{
       const res = teamShowMessage(userId,teamId.value,lastId.value,10).then(res =>{
          console.log(res.data);
          console.log(teamId.value);
          manage.value=res.data.data.members
          tableData.value = [...tableData.value, ...manage.value]
          console.log(manage.value);
          console.log(tableData.value);
       }).catch(err =>{
         console.log(err);
       })
   }
   ShowMessage()
    
   tableData.value=manage.value
   const container =ref()
   const scrollTopVal=ref(0)
   const currentPage = ref(1)
   const pageSize = ref(10)
   const loading = ref(false)
   const isEmpty = ref(false)
   
   const loadMoreData = () => {
      if (loading.value || isEmpty.value){
        return
      }
      loading.value = true
      console.log(tableData.value);
      //后续向后端请求数据
      setTimeout(function(){
      lastId.value=tableData.value[tableData.value.length-1].userId
      ShowMessage()
      if(manage.value.length === 0){
        isEmpty.value=true;
        loading.value=false;
        return
      }
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
   //查看详情
   const viewDetail = (row,$index) => {
      console.log(row,$index)
      if(isManager.value){
        router.push({
        path:'UserInfEdit',
        query:{
          memberId:row.userId,
          teamId:teamId.value,
          readOnly: true
        }
      })
    }else{
      console.log(2);
      router.push({
        path:'UserInf',
        query:{
          memberId:row.userId,
          teamId:teamId.value
        }
      })
    }
   }
   //删除团队信息的用户
   const deleteTeamMessage = async (row) =>{
      await ElMessageBox.confirm('您确定要删除该用户吗，删除后将无法复原','温馨提示',{
        type: 'warning',
        confirmButtonText:'确认',
        cancelButtonText:'取消'
      })
      const res = teamDeleteMember(userId,row.userId,teamId.value).then(res=>{
        console.log(res.data);
        console.log('删除成功');
        if(res.data.code===2403){
          ElMessage.error(res.data.info)
        }
        else{
         ElMessage.success('删除成功')
         tableData.value=''
         lastId.value=''
         isEmpty.value=false
        ShowMessage();
        }
      
      }).catch(err=>{
        console.log(err);
      })
   }
  //新增用户
   const toUserInfEdit = () => {
     router.push({
        path:'UserAdd',
        query:{
          teamId:teamId.value,
        }
      })
   }
 
  //获取团队架构管理树级信息
  const teamManage = () =>{
    dialogTeam.value = true;
    const res = teamQueryOrganization(userId,manageTeamId).then(res =>{
       console.log(res.data);
       if(res.data.code!==200){
        dialogTeam.value=false;
        return
       }
       Tree1.value=res.data.data.subordinates
       console.log(Tree1.value);
       Tree2.value=''
       Tree3.value=''
       Tree4.value=''
       isShow2=false
       isShow3=false
       isShow4=false
       TreeCopy.value=JSON.parse(JSON.stringify(Tree1.value))//深拷贝一个数组对象
    }).catch(err => {
        console.log(err);
    })
  }
  //切换团队架构当前团队
const manageChangeTeam = (Id,positionName) =>{
  userStore.teams.forEach(item=>{
   if(item.teamId===Id){
    console.log(Id);
      if(item.permissions.structure_VIEW===0){
         ElMessage.error('用户无权限')
      }else{
          manageTeamId=Id
          manageCurrentTeam.value=positionName
          console.log(manageTeamId);
          console.log(manageCurrentTeam.value);
          teamManage()
      } 
   }
 })
}
//切换团队信息当前团队
const messageChangeTeam = (Id,positionName) =>{
   console.log(Id);
   teamId.value=Id
   currentTeam.value=positionName
    manageCurrentTeam.value=currentTeam.value
    manageTeamId=teamId.value
   tableData.value=''
   lastId.value=''
   isEmpty.value=false
   currentTeamIsManager()
   ShowMessage();
}
const Tree1 = ref([
  //  {
  //         "positionId": "0003",
  //         "parentPositiondId":"",
  //         "positionName": "开发组",
  //         "teamId": "0001",
  //         "level": 1,
  //         "subordinates": [
  //             {
  //             "positionId": "0004",
  //             "parentPositiondId":"0003",
  //             "positionName": "前端组",
  //             "teamId": "0001",
  //             "level": 2,
  //             "subordinates": [
  //               {
  //                 "positionId": "0005",
  //                 "positionName": "前端工程师",
  //                 "teamId": "0001",
  //                 "level": 3,
  //                 "subordinates": [
  //                   {
  //                     "positionId": "0006",
  //                      "positionName": "zzh",
  //                      "teamId": "0001",
  //                      "level": 4,
  //                      "subordinates": []
  //                   }
  //                 ]
  //               },   
  //             ]
  //           },
  //           {
  //             "positionId": "0009",
  //             "positionName": "席间组",
  //             "teamId": "0001",
  //             "level": 2,
  //             "subordinates": []
  //           }
  //         ]
  //       },
  //        {
  //         "positionId": "0007",
  //         "positionName": "研发组",
  //         "teamId": "0001",
  //         "level": 1,
  //         "subordinates": [
  //           {
  //             "positionId": "0008",
  //             "positionName": "后端组",
  //             "teamId": "0001",
  //             "level": 2,
  //             "subordinates":[]
  //           }
  //         ]
  //       },
])
const TreeCopy=ref([])
const Tree2 = ref([])
const Tree3 = ref([])
const Tree4 = ref([])
const curNode1 = ref([])
const curNode2 = ref([])
const curNode3 = ref([])
const curNode4 = ref([])
let isShow2 =false//新建分组的显示
let isShow3 =false
let isShow4 =false
const isShow = new Array(3).fill().map(() => new Array(50).fill(true))//树级菜单展开的按钮
//展开各级节点
const handleTree1 = (item,index) =>{
  let t = ref([])
  t.value=item.subordinates
  Tree2.value=t.value
  Tree3.value=''
  Tree4.value=''
  isShow2=true
  isShow3=false
  isShow4=false
  for(let i=0;i<3;i++){
    isShow[i].fill(true)
  }
  isShow[0][index]=false
  curNode1.value=item
}
const handleTree2 = (item,index) =>{
  if(item.subordinates.length === 0){
     Tree3.value=[]
  }
  let t = ref([])
  t.value=item.subordinates
  Tree3.value=t.value
  Tree4.value=''
  isShow3=true
  isShow4=false
  for(let i=1;i<3;i++){
    isShow[i].fill(true)
  }
  isShow[1][index]=false
  curNode2.value=item
}
const handleTree3 = (item,index) =>{
  if(item.subordinates.length === 0){
     Tree4.value=[]
  }
  let t = ref([])
  t.value=item.subordinates
  Tree4.value=t.value
  isShow4=true
  isShow[2].fill(true)
  isShow[2][index]=false
  curNode3.value=item
}
//删除团队架构管理的组别/职位
const DelChildren = (nodes,parentPositionId,index) =>{
  for(let i =0;i<nodes.length;i++){
    //找要删除的节点的父节点
    if(nodes[i].positionId===parentPositionId){
       nodes[i].subordinates.splice(index,1)
    }
  }
  // console.log(nodes);
}
const DelTree = async (item,index) => {
  console.log(item);
  await ElMessageBox.confirm('您确定要删除该分组/职位吗','温馨提示',{
    type: 'warning',
    confirmButtonText:'确认',
    cancelButtonText:'取消'
  })
  if(item.level===1){
    Tree1.value.splice(index,1)
    console.log(TreeCopy.value);
    Tree2.value=''
    Tree3.value=''
    Tree4.value=''
  }
  else if(item.level===2){
    DelChildren(Tree1.value,item.parentPositionId,index)
    Tree3.value=''
    Tree4.value=''
  }
  else if(item.level===3){
    DelChildren(Tree2.value,item.parentPositionId,index)
    Tree4.value=''
  }
  else{
    DelChildren(Tree3.value,item.parentPositionId,index)
  }
}
//添加新职位
const isEditing1=ref(false)
const isEditing2=ref(false)
const isEditing3=ref(false)
const isEditing4=ref(false)
const newPositionName=ref('')
const toggleEdit = (level) =>{
  if(level===1) isEditing1.value=!isEditing1.value
  else if(level===2) isEditing2.value=!isEditing2.value
  else if(level===3) isEditing3.value=!isEditing3.value
  else if(level===4) isEditing4.value=!isEditing4.value
}
const creatItem1 = () =>{
  const newNode = {
  parentPositionId:manageTeamId,
  positionName:newPositionName.value,
  parentPositionName:manageCurrentTeam.value,
  level:1,
  subordinates:[]
  }
  Tree1.value.push(newNode)
  newPositionName.value=''
  toggleEdit(1)
}
const creatItem = (pnode) =>{
  console.log(pnode);
  console.log(newPositionName.value);
  const newNode = {
    parentPositionId:pnode.positionId,
    parentPositionName:pnode.positionName,
    positionName:newPositionName.value,
    level:pnode.level+1,
    subordinates:[]
  }
  // console.log(newNode);
  pnode.subordinates.push(newNode)
  newPositionName.value=''
   toggleEdit(pnode.level+1)
}

//保存
const deletePositions = ref([])
const addPositions = ref([])
const delCompare = (nodes,newNodes) =>{
    nodes.forEach(node => {
       const t = newNodes.find(newNode => newNode.positionId===node.positionId)
       if(!t){
         deletePositions.value.push(
          {
            "positionId":node.positionId,
            "level":node.level,
          }
         )
       }
       else{
          delCompare(node.subordinates,t.subordinates);
       }
    })
}
const add = (newNode) => {
  addPositions.value.push(
  {
    parentPositionId:newNode.parentPositionId,
    parentPositionName:newNode.parentPositionName,
    parentPositionLevel:newNode.level-1,
    newPositionName:newNode.positionName
  }
 )
  if(newNode.subordinates.length!==0){
    for(let i=0;i<newNode.subordinates.length;i++){
      add(newNode.subordinates[i])
    }
  }
}
const addCompare = (nodes,newNodes) =>{
   newNodes.forEach(newNode => {
      const t = nodes.find(node => node.positionId===newNode.positionId)
      if(!t){
        // console.log(newNode);
        add(newNode)
        // console.log(addPositions.value);
      }
      else{
        addCompare(t.subordinates,newNode.subordinates)
      }
   })
}
const preseve = () =>{
   delCompare(TreeCopy.value,Tree1.value)
   addCompare(TreeCopy.value,Tree1.value)
   console.log(deletePositions.value);
   console.log(addPositions.value);
   const res = teamModifyOranization(userId,addPositions.value,deletePositions.value,manageTeamId).then(res =>{
     console.log(res.data);
     deletePositions.value=[]
     addPositions.value=[]
     dialogTeam.value=false
     isShow[0].fill(true)
     if(res.data.code===200)
     ElMessage.success('保存成功')
   }).catch(err =>{
    console.log(err);
   })
}
//重置
const reset = () =>{
  // console.log(TreeCopy.value);
  Tree1.value=JSON.parse(JSON.stringify(TreeCopy.value))
  console.log(Tree1.value);
  Tree2.value=''
  Tree3.value=''
  Tree4.value=''
  isShow2=false
  isShow3=false
  isShow4=false
  isShow[0].fill(true)
  deletePositions.value=[]
  addPositions.value=[]
}
</script>

<template>
  <el-card class="page-manage">
    <template #header>
    <div class="header">
        <div class="left">
        <span style="font-size: 22px;padding: 0 15px;font-weight: 700;">团队信息</span>
         <el-dropdown style="line-height: 35px;">
          <span class="el-dropdown-link">
            <span style="font-weight: bold;">当前团队: {{ currentTeam }}</span>
           <el-icon><ArrowDown /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu >
              <el-dropdown-item v-for="(item,index) in userStore.teams" @click="messageChangeTeam(item.teamId,item.teamName)">{{ item.teamName }}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        </div>
        <div>
            <el-button v-if="isManager" type="info" style="color: black;" @click="teamManage()">团队架构管理</el-button>
            <el-button v-if="isManager" color="rgb(0, 122, 255)" @click="toUserInfEdit">新增用户</el-button>
        </div>
    </div>
     <!-- 团���架构管理内容 -->
    <el-dialog v-model="dialogTeam" width="900" title="团队架构管理">
    <div style="border-bottom: 1px solid #000;padding-bottom: 5px;color: gray;">支持修改指定团队内部的架构</div>
    <div style="padding:5px 0;font-size: 16px;font-weight: 700;">
      <el-dropdown style="line-height: 35px;">
          <span class="el-dropdown-link">
            <span style="font-weight: bold;">当前团队: {{manageCurrentTeam}}</span>
           <el-icon><ArrowDown /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="(item,index) in userStore.teams" @click="manageChangeTeam(item.teamId,item.teamName)">{{ item.teamName }}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
    </div>
    <div class="tree">
      <div class="tree1">
       <p v-for="(item,index) in Tree1">
        {{item.positionName}}
        <span class="icon">
          <el-button type="text" :icon="Delete" @click="DelTree(item,index)" style="color: red;">
          </el-button>
          <el-button type="text" text="plain" v-if="isShow[0][index]" @click="handleTree1(item,index)">&gt;</el-button>
        </span>
       </p>
       <span v-if="!isEditing1">
        新增分组/职位<el-button class="icon" type="text" :icon="Plus" @click="toggleEdit(1)">      
        </el-button>
       </span>
       <el-input v-else v-model="newPositionName" @keyup.enter="creatItem1()" @blur="toggleEdit(1)"></el-input>
      </div>
      <div class="tree1">
       <p v-for="(item,index) in Tree2">
        {{item.positionName}}
        <span class="icon">
          <el-button type="text" :icon="Delete" @click="DelTree(item,index)" style="color: red;">
          </el-button>
          <el-button type="text" text="plain" v-if="isShow[1][index]" @click="handleTree2(item,index)">&gt;</el-button>
        </span>
       </p>
       <span v-if="isShow2">
         <span v-if="!isEditing2">
        新增分组/职位<el-button class="icon" type="text" :icon="Plus" @click="toggleEdit(2)">      
        </el-button>
       </span>
       <el-input v-else v-model="newPositionName" @keyup.enter="creatItem(curNode1)" @blur="toggleEdit(2)"></el-input>
       </span>
      </div>
      <div class="tree1">
       <p v-for="(item,index) in Tree3">
        {{item.positionName}}
        <span class="icon">
          <el-button type="text" :icon="Delete" @click="DelTree(item,index)" style="color: red;">
          </el-button>
          <el-button type="text" text="plain" v-if="isShow[2][index]" @click="handleTree3(item,index)">&gt;</el-button>
        </span>
       </p>
        <span v-if="isShow3">
          <span v-if="!isEditing3">
           新增分组/职位<el-button class="icon" type="text" :icon="Plus" @click="toggleEdit(3)">      
           </el-button>
          </span>
          <el-input v-else v-model="newPositionName" @keyup.enter="creatItem(curNode2)" @blur="toggleEdit(3)"></el-input>
        </span>
      </div>
      <div class="tree1" style="border-right: 1px solid #000;">
       <p v-for="(item,index) in Tree4">
        {{item.positionName}}
        <span class="icon">
          <el-button type="text" :icon="Delete" @click="DelTree(item,index)" style="color: red;">
          </el-button>
        </span>
       </p>
        <span v-if="isShow4">
          <span v-if="!isEditing4">
           新增分组/职位<el-button class="icon" type="text" :icon="Plus" @click="toggleEdit(4)">      
           </el-button>
          </span>
          <el-input v-else v-model="newPositionName" @keyup.enter="creatItem(curNode3)" @blur="toggleEdit(4)"></el-input>
        </span>
      </div>
    </div>
    <div class="right">
      <el-button type="info" class="cz" @click="reset()">重置</el-button>
      <el-button class="bc" @click="preseve()" color="rgb(0, 122, 255)">保存</el-button>
    </div>
    
    </el-dialog>
    </template>
    <!-- 内容 -->
     <div ref="container" class="container">
       <el-table :data="tableData" style="width: 100%;">
        <el-table-column prop="userName" label="姓名" width="140"></el-table-column>
        <el-table-column prop="positionList" label="组别" width="310">
          <template #default="scope">
            <div v-for="(item,index) in scope.row.positionList">{{ item }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="grade" label="年级" width="110"></el-table-column>
        <el-table-column prop="major" label="专业" width="180"></el-table-column>
        <el-table-column prop="currentStatus" label="现状" width="150"></el-table-column>
        <el-table-column prop="phone" label="联系方式" width="150"></el-table-column>
        <el-table-column label="操作">
            <template #default="{row,$index}">
                <el-button type="text" @click="viewDetail(row,$index)">查看详情</el-button>
                <el-button v-if="isManager" type="text" @click="deleteTeamMessage(row)" style="color: rgb(245, 108, 108);">删除</el-button>
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
    .el-dropdown-link {
      cursor: pointer;
      font-size: 16px;
    }
    .foot {
      text-align: center;
    }
    li {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .tree {
      display: flex;
      align-items: center;
      min-height: 30vh;
      // box-sizing: border-box;
    }
    .tree1{
      padding: 0 10px;
      border: 1px solid #000;
      border-right: 0px;
      height: 430px;
      width: 180px;
      border-radius: 2px;
      overflow: auto;   /*隐藏y轴元素，以滚轮显示*/
    }
    .tree1 p {
      color: #000;
    }
    .icon {
      float: right;
      //cursor: pointer;
    }
    .right{
      padding-top: 20px;
      margin-left: 100vh;
    }
    .cz {
    color: #000;
    width: 80px;
    }
    .bc {
    width: 80px;
    }
  }
</style>