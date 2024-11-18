<script setup>
import {ref} from 'vue'
import {useUserStore} from '@/stores'
import {userSendcodeService} from '@/api/user.js'
// import {userLoginService} from '@/api/user.js'
//整个的用于提交的form数据对象,看接口文档
const formModel=ref({
   phone: '',
   yzm: ''
})
const form = ref()
const reg=/^[1]([3-9])[0-9]{9}$/
let sending = ref(true);
let second = ref(5);
let yzmwz = ref('获取验证码')
let message = ref('')
const userAgent = navigator.userAgent;
const validatePhone = () => {
  if(!reg.test(formModel.value.phone)) 
     {  
        message.value='请检查手机号码是否正确'
        return false;
     }
     return true;
}
const validateyzm= async () => {
   // form.value.validateField('Phone',(valid) => {
   if(validatePhone()) 
     {
      message.value=''
       //向后端请求发送验证码
         const res = await userSendcodeService(formModel.value.phone).then(res=>{
            console.log(res.data);
            //接口的成功事件处理逻辑
         }).catch(err=>{
            console.log(err);
         })
         console.log(res.data)
         
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
   }
const userStore=useUserStore()
//点击登录
const login = async () => {
   //登录预校验
    if(validatePhone()){

    }
   //获取token判断
   // const res = await userLoginService(formModel.value)
}
console.log(sessionStorage.getItem('ip'))
console.log(userAgent)
</script>

<template>
   <el-row class="login-page">
    <el-col :span="8" class="bg">AchoBeta欢迎您</el-col>
    <el-col :span="7" :offset="5" class="form">
     <el-form
        :model="formModel"
        :rules="rules"
        ref="form"
        size="large"
        autocomplete="off"
        hide-required-asterisk="true" 
        >
        <el-form-item label="手机号码" label-position = "left" label-width="80px">
        <el-input v-model="formModel.phone"></el-input>
     </el-form-item>
     <el-form-item label="验证码"  label-position = "left" label-width="80px">
      <div class="flex">
         <el-input v-model="formModel.yzm"></el-input>
        <el-button v-if="sending" type="text" @click="validateyzm">{{yzmwz}}</el-button>
        <el-button v-else type="text" disabled="true">{{ second }}s</el-button>
      </div>
     </el-form-item>
     <el-form-item class="flex">
      <div class="flex">
       <span class="eromes">{{ message }}</span>
       <el-checkbox class="cbox" size="small">三十天内自动登录</el-checkbox>
      </div>
     </el-form-item>
     <el-form-item>
      <el-button type="primary" class="loginbutton" @click="login">登录/注册</el-button>
     </el-form-item>
      </el-form>
      <span class="foot">未注册手机号登录后将自动注册</span>
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
.eromes {
   font-size: 13px;
   color: rgb(245, 108, 108);
   margin-left: 80px;
   margin-top: -8px;
}
.foot {
   color: cadetblue;
   margin-left: 114px;
   font-size: 13px;
}
.loginbutton {
   width: 260px;
   margin-left: 73px;
   font-size: 16px;
}
 }


</style>

