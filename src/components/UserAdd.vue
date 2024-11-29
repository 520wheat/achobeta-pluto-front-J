<script setup >
import router from '@/router/index.js'
import {ref,toRaw,toRefs} from 'vue'
import { useRoute } from 'vue-router';
import {useUserStore} from '@/stores'
import {teamQueayMember,teamQueryOrganization,teamQueryRoles,teamAddMember} from '@/api/team.js'
import { formContextKey } from 'element-plus';
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
const currentTeam = ref()//当前团队/职位
const teamId = route.query.teamId //团队id
const userId = userStore.userId //发起操作的用户id
const isAdd=ref(false)

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
//查询可以支配赋予他人的团队及角色
userStore.teams.forEach(item=>{
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
//点击加号新增团队
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
  isAdd.value=!isAdd.value
  let string = ""
  for(let i =0;i<value.length-1;i++){
    string+=value[i]+"-"
  }
  string+=value[value.length-1]
  teamArr.value.push(string)
  formModel.value.belongTeam=teamArr.value[0]
}

//删除团队/职位
const del = async () =>{
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
            trigger:'change'
        }
    ],
      idCard:[
        {
            pattern:/^\d{18}$|^\d{15}$/,
            message:'请输入正确的身份证号',
            trigger:'change'
        }
    ]
}
//重置
const reset = () => {
   for(let key in formModel.value){
     formModel.value[key]=''
   }
    teamArr.value=[]
    formModel.value.belongTeam=teamArr.value[0]//所属团队默认显示第一个
    formModel.value.selectPermission=[]//清空选择的管理权限
    roles.value=[]
}
//保存
const positions = teamArr.value
const save = async () =>{
    await form.value.validate()
    console.log(1);
    const res = teamAddMember(teamId,userId,formModel.value.userName,formModel.value.phone,formModel.value.entryTime,formModel.value.gender,formModel.value.idCard,formModel.value.email,formModel.value.grade,formModel.value.major,formModel.value.studentId,formModel.value.experience,formModel.value.currentStatus,positions).then(res=>{
        console.log(res.data);
        if(res.data.data.statusCode===1){
             ElMessageBox.confirm('该手机号已存在，是否跳转该用户信息详情页','温馨提示',{
              type: 'warning',
              confirmButtonText:'确认',
              cancelButtonText:'取消'
           }).then(res1=>{
            console.log(333);
               router.push({
               path:'UserInfEdit',
               query:{
                 memberId:res.data.data.userInfo.userId,
                 teamId:teamId
               }
             })
           }).catch(err=>{
             console.log(err);
           })
        }
        else{
            router.push({
             path:'ManageTeamPage',
             query:{
                teamId:teamId,
             }
           })
        }
        
    }).catch(err=>{
        console.log(err);
    })
    console.log(formModel.value);
}
</script>

<template>
    <el-header class="UserHeader">
    <span style="font-weight: 700;">
        <el-button type="text" text="plain" size="large" @click="toManageTeamPage()" >&lt;</el-button>个人信息
    </span>
    <div class="right">
      <el-button type="info" class="cz" @click="reset">重置</el-button>
      <el-button class="bc" color="rgb(0, 122, 255)" @click="save">保存</el-button>
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
                        <el-button @click="changeAdd()">+</el-button> 
                        <el-button @click="del()">-</el-button>
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
}
.bc {
    width: 80px;
}

</style>