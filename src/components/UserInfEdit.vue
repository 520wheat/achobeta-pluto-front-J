<script setup >
import router from '@/router/index.js'
import {ref,toRaw,toRefs} from 'vue'
import { useRoute } from 'vue-router';
import {useUserStore} from '@/stores'
import {Plus,Minus} from '@element-plus/icons-vue'
import {teamQueayMember,teamQueryOrganization,teamQueryRoles,teamModifyMember} from '@/api/team.js'
let route = useRoute()
const userStore = useUserStore()
console.log(route.query);
const formModel=ref({
   userName: '',
   gender: '',
   entryTime:'',
   idCard:'',
   phone:'',
   email:'',
   grade:'',
   major:'',
   studentId:'',
   experience:'',
   currentStatus:'',
   belongTeam:'',
   selectPermission:[]
})
const permissionsArr = ref([])//点开管理权限所展示的团队数组名字
const roles = ref([])//点开管理权限所展示的团队数组
const teamArr = ref([])//所属全部团队/职位
const teamArrCopy=ref([])
const memberId=route.query.memberId //查看的成员id
const teamId = route.query.teamId //团队id
const userId = userStore.userId //发起操作的用户id
const dataCopy = ref({})
const isAdd=ref(false)
//查询所属全部团队/职位
const res = teamQueayMember(userId,teamId,memberId).then(res=>{
  console.log(res.data);
  res.data.data.positions.forEach(item =>{
    let string=""
    for(let i =1;i<item.length-1;i++){
        string=string + item[i]+ "-"
    }
    string = string + item[item.length-1]
    teamArr.value.push(string)
  })
  console.log(teamArr.value);
  teamArrCopy.value=JSON.parse(JSON.stringify(teamArr.value))//深拷贝修改前的所属团队
  formModel.value.belongTeam=teamArr.value[0]
  const {userName,gender,entryTime,idCard,phone,email,grade,major,studentId,experience,currentStatus} = res.data.data
  dataCopy.value={userName,gender,entryTime,idCard,phone,email,grade,major,studentId,experience,currentStatus}
  console.log(dataCopy.value);
  for(let key in dataCopy.value){
    for(let key2 in formModel.value){
        if(key===key2){
            formModel.value[key]=dataCopy.value[key]
        }
    }
  }
  if(res.data.data.gender===1){
    formModel.value.gender='男'
  }else if(res.data.data.gender===2){
    formModel.value.gender='女'
  }else{
    formModel.value.gender='未选择'
  }
}).catch(err=>{
  console.log(err);
})
//查询可以支配赋予他人的团队及角色
userStore.teams.forEach(item=>{
    //看用户有没有权限
    if(item.permissions.member_MODIFY===1 || item.permissions.super===1){
    const res2 = teamQueryRoles(userId,teamId).then(res2=>{
         console.log(res2.data);
         if(res2.data.data.roles)
         permissionsArr.value=res2.data.data.roles
         console.log(permissionsArr.value);
    }).catch(err=>{
        console.log(err);
    })
  }
})

const props2 = {
  checkStrictly: true,
  multiple: true,
  label:'roleName',
  value:'roleName',
  children:'roles'
}
const handleChange2 =(value) =>{
    console.log(value);
    roles.value=[]
    value.forEach(item=>{
      roles.value.push(item[0])
  })
    console.log(roles.value);
}
//获取当前用户可以修改哪些团队
const subordinates = []//添加团队/职位时显示的树级结构
userStore.teams.forEach(item =>{
  console.log(item);
  //看用户有没有权限
  if(item.permissions.member_MODIFY===1 || item.permissions.super===1){
      const res =teamQueryOrganization(userId,item.teamId).then(res=>{
         console.log(res.data);
         if(res.data.data)
        subordinates.push(res.data.data)
         console.log(subordinates);
      }).catch(err=>{
        console.log(err);
      })
  }
})
//
const toManageTeamPage = () => {
    console.log(1);
    router.push({
        path:'ManageTeamPage',
        query:{
           teamId:teamId,
        }
    })
}

const back = () =>{
   isAdd.value=!isAdd.value
}
const changeAdd = () =>{
    isAdd.value=!isAdd.value
}
const props1 = {
  checkStrictly: true,
  label:'positionName',
  value:'positionName',
  children:'subordinates'
}
const handleChange = (value) => {
  console.log(value)
  isAdd.value=!isAdd.value
  let string = ""
  for(let i =0;i<value.length-1;i++){
     string+=value[i]+"-"
  }
  string+=value[value.length-1]
  teamArr.value.push(string)
  console.log(teamArr.value);
  formModel.value.belongTeam=teamArr.value[0]
}

//删除团队/职位
const del= async () =>{
  await ElMessageBox.confirm('您确定要删除该团队/职位吗','温馨提示',{
    type: 'warning',
    confirmButtonText:'确认',
    cancelButtonText:'取消'
  })
    console.log(formModel.value.belongTeam);
    for(let i = 0;i<teamArr.value.length;i++){
      if(teamArr.value[i]===formModel.value.belongTeam){
         teamArr.value.splice(i,1)
      }
    }
    formModel.value.belongTeam=teamArr.value[0]
}
const form = ref()

const rules = {
    phone: [
        { required: true,message: '手机号为必填项',trigger:'change' },
        { pattern: /^[1]([3-9])[0-9]{9}$/, message: '请检查是否为中国大陆手机号',trigger:'change'}
    ],
    entryTime: [
        { 
            pattern :/^((\d{4})\/(0[13578]|1[02])\/(0[1-9]|[12]\d|3[01])|(\d{4})\/(0[469]|11)\/(0[1-9]|[12]\d|30)|(\d{4})\/02\/(0[1-9]|1\d|2[0-8])|(((\d{2}(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))\/02\/29))$)/,
            message:'格式为xxxx/xx/xx',
            trigger:'blur'
        }
    ],
    idCard:[
        {
            pattern:/^\d{18}$|^\d{15}$/,
            message:'请输入正确的身份证号',
            trigger:'blur'
        }
    ]
}
//重置
const reset = () => {
    for(let key in dataCopy.value){
      for(let key2 in formModel.value){
        if(key===key2){
            formModel.value[key]=dataCopy.value[key]
        }
      }
    }
    teamArr.value=teamArrCopy.value
    formModel.value.belongTeam=teamArr.value[0]//所属团队默认显示第一个
    formModel.value.selectPermission=[]//清空选择的管理权限
    roles.value=[]
}
//保存
// const addPositions=ref([])
// const deletePositions=ref([])

const save = async () =>{
    await form.value.validate()

//     const UserEditData = {
//     teamId:teamId,
//     memberId:memberId,
//     userId:userId,
//     userName:formModel.value.userName,
//     phone:formModel.value.phone,
//     entryTime:formModel.value.entryTime,
//     gender:formModel.value.gender,
//     idCard:formModel.value.idCard,
//     email:formModel.value.email,
//     grade:formModel.value.grade,
//     major:formModel.value.major,
//     studentId:formModel.value.studentId,
//     experience:formModel.value.experience,
//     currentStatus:formModel.value.currentStatus,
//     addPositions:addPositions.value,
//     deletePositions:deletePositions.value,
//     roles:roles.value,
//     teamNames:teamArr.value
// }
//     console.log(UserEditData);
    const res = teamModifyMember(teamId,memberId,userId,formModel.value.userName,formModel.value.phone,formModel.value.entryTime,formModel.value.gender,formModel.value.idCard,formModel.value.email,formModel.value.grade,formModel.value.major,formModel.value.studentId,formModel.value.experience,formModel.value.currentStatus,roles.value,teamArr.value).then(res=>{
        console.log(res.data);
         router.push({
        path:'ManageTeamPage',
        query:{
           teamId:teamId,
        }
      })
    }).catch(err=>{
        console.log(err);
    })
}
  const isLiked = ref(false)
  const likeCount = ref(0)

// 点赞
  const toggleLike = async () => {
    const userId = localStorage.getItem('userId') || '1001'
    console.log(userId);
    try {
      const response = await axios.post('/api/v1/user/like/', {
        fromId: userId,
        toId: userId,
        liked: true
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userId}`
        }
      })
      console.log(response.data.data);
      isLiked.value = !isLiked.value
      likeCount.value = response.data.likeCount
    } catch (error) {
      console.error('更新点赞状态失败:', error)
      ElMessage.error('点赞失败，请稍后重试')
    }
}

</script>

<template>
    <link rel="stylesheet" href="/iconfont/download/font_ttobs1d52z/iconfont.css">
    <el-header class="UserHeader">
    <span style="font-weight: 700;">
        <el-button type="text" text="plain" size="large" @click="toManageTeamPage()" >&lt;</el-button>个人信息
    </span>
    <div class="right">
      <el-button type="info" class="cz" @click="reset">重置</el-button>
      <el-button class="bc" color="rgb(0, 122, 255)" @click="save">保存</el-button>
     <!-- 点赞 -->
      <span class="dz">
          <span class="iconfont icon-icon" :class="{ 'liked': isLiked }" @click="toggleLike" :style="{ 
            color: isLiked ? '#ff0000' : '#000000',
            cursor: 'pointer'
          }"></span>
          <div class="like-count" style="font-size: 10px;">{{ likeCount }}</div>
      </span>            
    </div>
    </el-header>
    <el-main>
      <el-form
          :model="formModel"
          :rules="rules"
          ref="form"
          hide-required-asterisk="true" 
          autocomplete="off"
          style="max-width: 1200px"
        >
           <el-row :gutter="50">
                <el-col :span="7">
                    <el-form-item label="真实姓名" label-position="top">
                        <el-input v-model="formModel.userName"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="性别" label-position="top">
                        <el-select v-model="formModel.gender" placeholder="未选择" >
                            <el-option label="男" value="1"></el-option>
                            <el-option label="女" value="2"></el-option>
                            <el-option label="未选择" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="50">
                <el-col :span="7">
                    <el-form-item label="加入时间" prop="entryTime" label-position="top">
                        <el-input v-model="formModel.entryTime"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item label="所属团队/职位" label-position="top" v-if="!isAdd">
                        <el-select v-model="formModel.belongTeam" placeholder>
                            <el-option v-for="(item,index) in teamArr" :label="item" :value="item"></el-option>
                        </el-select>
                        <el-button :icon="Plus" @click="changeAdd()"></el-button> 
                        <el-button :icon="Minus" @click="del()"></el-button>
                    </el-form-item>
                    <span v-else>
                        <p style="font-size: 14px;color: red;margin:0;padding-bottom: 10px;">选择要增加的团队/职位</p>
                        <el-cascader :options="subordinates"
                          :props="props1"
                          @change="handleChange"
                          clearable />
                        <el-button @click="back()">返回</el-button>
                    </span>
                </el-col>
                 <el-col :span="7">
                    <el-form-item label="管理权限" label-position="top">
                        <el-cascader v-model="formModel.selectPermission" :options="permissionsArr"
                          :props="props2"
                          collapse-tags
                          collapse-tags-tooltip
                          placeholder="未选择"
                          @change="handleChange2"
                          clearable />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="50">
                <el-col :span="7">
                    <el-form-item label="身份证号" prop="idCard" label-position="top">
                        <el-input v-model="formModel.idCard"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item label="手机号码 *" prop="phone" label-position="top">
                        <el-input v-model="formModel.phone"></el-input>
                    </el-form-item>
                </el-col>
                 <el-col :span="7">
                    <el-form-item label="邮箱" label-position="top">
                        <el-input v-model="formModel.email"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
             <el-row :gutter="50">
                <el-col :span="7">
                    <el-form-item label="年级" label-position="top">
                        <el-input v-model="formModel.grade"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item label="专业" label-position="top">
                        <el-input v-model="formModel.major"></el-input>
                    </el-form-item>
                </el-col>
                 <el-col :span="7">
                    <el-form-item label="学号" label-position="top">
                        <el-input v-model="formModel.studentId"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="实习、创业、就职经历" label-position="top">
                <el-input
                 type="textarea"
                 :rows="4"
                 resize="none"
                 v-model="formModel.experience"
                ></el-input>
            </el-form-item>
            <el-form-item label="现状" label-position="top">
                <el-input
                 type="textarea"
                 :rows="3"
                 resize="none"
                 v-model="formModel.currentStatus"
                ></el-input>
            </el-form-item>
        </el-form>
      </el-main>
</template>

<style lang="scss" scoped>
 .UserHeader {
    display: flex;
    align-items: center;
    justify-content: space-between;
 }
.cz {
    color: #000;
    width: 80px;
    margin-top: -10px;
}
.bc {
    width: 80px;
    margin-top: -10px;
}
.UserHeader .dz{
  width: 10%;
  height: 10%;
  margin-left: 15px;
}
.icon-icon{
    font-size: 35px;
    font-weight: 700;
}
.like-count {
    margin-left: 200px;
    font-weight: 700;
    margin-top: 5px;
}
</style>