<script setup>
import {ref} from 'vue'
// import {userLoginService} from '@/api/user.js'
//整个的用于提交的form数据对象,看接口文档
const formModel=ref({
   Phone: '',
   yzm: ''
})
const rules = {
   Phone: [
      { required: true,message: '请输入手机号码',trigger: 'change'},
      { 
         pattern: /^[1]([3-9])[0-9]{9}$/,
         message: "请检查手机号码是否正确",
         trigger: "blur" 
      }
   ],
   yzm: [
      { required: true,message: '请输入验证码',trigger: 'change'}
   ]
}
const form = ref()
let sending = ref(true);
let second = ref(5);
let yzmwz = ref('获取验证码')
let message = ref('请检查手机号码是否正确')
const validateForm= () => {
   form.value.validateField('Phone',(valid) => {
      if(!valid) 
     {  
        return;
     }
     else
     {
       //向后端发送验证码
         
       //倒计时
       sending.value=false;
       const countId = setInterval(() => {
         second.value--;
         if(second.value<0){
            clearInterval(countId);
            sending.value=true;
            second.value=5
            yzmwz.value='重新发送'
         }
       },1000)
     }
   })
}
//点击登录
const login = async () => {
   //登录预校验
   await form.value.validate()
   //获取token判断
   // const res = await userLoginService(formModel.value)
}
</script>

<template>
   <el-row class="login-page">
    <el-col :span="8" class="bg">AchoBeta欢迎您</el-col>
    <el-col :span="6" :offset="5" class="form">
     <el-form
        :model="formModel"
        :rules="rules"
        ref="form"
        size="large"
        autocomplete="off"
        hide-required-asterisk="true" 
        >
        <el-form-item label="手机号码" prop="Phone" label-position = "left" label-width="80px">
        <el-input v-model="formModel.Phone"></el-input>
     </el-form-item>
     <el-form-item label="验证码" prop="yzm" label-position = "left" label-width="80px">
      <div class="flex">
         <el-input v-model="formModel.yzm"></el-input>
        <el-button v-if="sending" type="text" @click="validateForm">{{yzmwz}}</el-button>
        <el-button v-else type="text" disabled="true">{{ second }}s</el-button>
      </div>
     </el-form-item>
     <el-form-item class="flex">
      <div class="flex">
       <span>{{ message }}</span>
       <el-checkbox class="cbox" size="small">三十天内自动登录</el-checkbox>
      </div>
     </el-form-item>
     <el-form-item>
      <el-button type="primary" style="width: 100%;" @click="login">登录/注册</el-button>
     </el-form-item>
      </el-form>
      <span>未注册手机号登录后将自动注册</span>
    </el-col>

   </el-row>
</template>

<style lang="scss" scoped>
 .login-page {
   height: 100vh;
   .bg {
   display: flex;
   justify-content: center;
   align-items: center;
   font-size: 30px;
   background-color: rgb(50, 173, 230);
   color: #fff;
 }
.form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    background-color: #fff;
    margin-top: 200px;
    margin-bottom: 190px;
    padding: 0 20px;
    border: 1px solid black;
    border-radius: 5px;
}
.flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }

span {
   color: cadetblue;
   margin-left: 65px;
   font-size: 12px;
}
 }


</style>

