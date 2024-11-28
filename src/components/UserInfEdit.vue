<script setup >
import router from '@/router/index.js'
import {ref,toRaw,toRefs} from 'vue'
import { useRoute } from 'vue-router';
import {useUserStore} from '@/stores'
import {teamQueayMember} from '@/api/team.js'
let route = useRoute()
const userStore = useUserStore()
console.log(route.query);
const formModel=ref({
   userName: '1',
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
   belongTeam:''
})
const teamArr = ref([])//所属全部团队/职位
const teamArrCopy=ref([])
const memberId=route.query.memberId //查看的成员id
const teamId = route.query.teamId //团队id
const userId = userStore.userId //发起操作的用户id
const dataCopy = ref({})
const isAdd=ref(false)
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
}).catch(err=>{
  console.log(err);
})
const toManageTeamPage = () => {
    console.log(1);
    router.push('/ManageTeamPage')
}
//
const back = () =>{
   isAdd.value=!isAdd.value
}
const changeAdd = () =>{
    isAdd.value=!isAdd.value
    userStore.teams.forEach(item =>{
      console.log(item);
    })
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
}
const subordinates = [
  
     {
        "positionId": "2d52c633-4c3e-4690-ab53-e1fe3cfafd82",
        "positionName": "团队负责人",
        "teamId": "0001",
        "level": 1,
        "subordinates": []
      },
      {
        "positionId": "55763ceb-8514-4fe0-8408-770929329e45",
        "positionName": "设计组",
        "teamId": "0001",
        "level": 1,
        "subordinates": [
          {
            "positionId": "78c4caed-29f0-498d-9fc4-909f4b9b684e",
            "positionName": "设计负责人",
            "teamId": "0001",
            "level": 2,
            "subordinates": []
          },
          {
            "positionId": "ba188752-ad2c-4157-89d7-1520bf8d0981",
            "positionName": "设计师",
            "teamId": "0001",
            "level": 2,
            "subordinates": []
          }
        ]
      },
      {
        "positionId": "a93f4af3-9dd4-47a3-a92e-0197ea2f58ae",
        "positionName": "产品组",
        "teamId": "0001",
        "level": 1,
        "subordinates": [
          {
            "positionId": "524c76ac-df9c-484e-8927-ef8981e2bdfb",
            "positionName": "产品组成员",
            "teamId": "0001",
            "level": 2,
            "subordinates": []
          },
          {
            "positionId": "7f62c83b-5762-4d04-964d-a28f1c9c0d1a",
            "positionName": "产品负责人",
            "teamId": "0001",
            "level": 2,
            "subordinates": []
          }
        ]
      },
      {
        "positionId": "d5bffd9d-4050-4dc4-bb06-b5a4e0fa3bb3",
        "positionName": "财务组",
        "teamId": "0001",
        "level": 1,
        "subordinates": [
          {
            "positionId": "2224d65f-d5a9-49a6-8ce7-99badfe86b95",
            "positionName": "财务负责人",
            "teamId": "0001",
            "level": 2,
            "subordinates": []
          },
          {
            "positionId": "ea5d0fbb-b039-44f9-a7ba-a62397d2b099",
            "positionName": "财务助理",
            "teamId": "0001",
            "level": 2,
            "subordinates": []
          }
        ]
      },
      {
        "positionId": "d96e97b2-990d-4288-92ec-73dbb8b8427c",
        "positionName": "研发组",
        "teamId": "0001",
        "level": 1,
        "subordinates": [
          {
            "positionId": "80c12e61-6f69-4c80-821c-399afd0251d6",
            "positionName": "后端组",
            "teamId": "0001",
            "level": 2,
            "subordinates": [
              {
                "positionId": "1ed86e92-813f-42e4-a6d8-e5f67cfec151",
                "positionName": "后端开发工程师",
                "teamId": "0001",
                "level": 3,
                "subordinates": []
              },
              {
                "positionId": "8fc2ee16-e2a1-4ce5-be56-2b57ec5ae66c",
                "positionName": "后端研发负责人",
                "teamId": "0001",
                "level": 3,
                "subordinates": []
              }
            ]
          },
          {
            "positionId": "822842c2-12b3-450b-94ea-0a493220c555",
            "positionName": "其他组",
            "teamId": "0001",
            "level": 2,
            "subordinates": []
          },
          {
            "positionId": "844a27dc-ecc5-4f9f-812f-1a4d9cdfc6d6",
            "positionName": "前端组",
            "teamId": "0001",
            "level": 2,
            "subordinates": [
              {
                "positionId": "4d21137d-e52c-43bc-bc7f-cd794e38eecb",
                "positionName": "前端开发工程师",
                "teamId": "0001",
                "level": 3,
                "subordinates": []
              },
              {
                "positionId": "8c53a226-2243-47bf-abb6-d3e8f0b6ef2c",
                "positionName": "前端研发负责人",
                "teamId": "0001",
                "level": 3,
                "subordinates": []
              }
            ]
          },
          {
            "positionId": "d1e51413-244d-4108-8df9-58e54c30f800",
            "positionName": "研发负责人",
            "teamId": "0001",
            "level": 2,
            "subordinates": []
          }
        ]
      }
]
//删除团队/职位
const del = () =>{
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
    formModel.value.belongTeam=teamArr.value[0]
}
//保存
const addPositions=ref([])
const deletePositions=ref([])
const save = async () =>{
    // await form.value.validate()
    addCompare(teamArrCopy.value,teamArr.value)
    delCompare(teamArrCopy.value,teamArr.value)
    console.log(addPositions.value);
    console.log(deletePositions.value);
    console.log(teamArr.value);
}
//获取新增的团队/职位
const addCompare = (arr,newarr) =>{
  newarr.forEach(newitem =>{
     if((arr.find(item => item===newitem))===undefined){
        addPositions.value.push(newitem)
     }
  })
}
//获取删除的团队/职位
const delCompare = (arr,newarr) =>{
   arr.forEach(item =>{
      if((newarr.find(newitem => item === newitem))===undefined){
          deletePositions.value.push(item)
      }
   })
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
                        <el-select placeholder="无权限">
                            <el-option label="男"></el-option>
                            <el-option label="女"></el-option>
                        </el-select>
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