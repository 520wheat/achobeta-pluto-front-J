<script setup>
import {ref} from 'vue'
import router from '@/router/index.js'
import {useUserStore} from '@/stores'
import {userSendcodeService,userLoginService} from '@/api/user.js'
import FingerprintJS from '@fingerprintjs/fingerprintjs'
const userStore=useUserStore()
    if (userStore.accessToken && userStore.refreshToken) {
        router.push('/main')
      console.log(1);
    }
//浏览器指纹
const fingerPrinting=ref('')
FingerprintJS.load().then(fp => {
    fp.get().then(result => {
        fingerPrinting.value = result.visitorId;
        console.log(fingerPrinting.value);
    });
});
//整个的用于提交的form数据对象,看接口文档
const formModel=ref({
   phone: '',
   code: ''
})
const form = ref()
const reg=/^[1]([3-9])[0-9]{9}$/
const codeReg=/^\d{6}$/
let sending = ref(true);
let second = ref(59);
let codewz = ref('获取验证码')
let message = ref('')
const ip= sessionStorage.getItem('ip')
console.log(ip);


const isAutoLogin = ref('false')
const changeisAutoLogin = () =>{
   if(isAutoLogin.value==='false') isAutoLogin.value='true'
   else isAutoLogin.value='false'
}
const userAgent = navigator.userAgent;
const validatePhone = () => {
  if(!reg.test(formModel.value.phone)) 
     {  
        message.value='请检查手机号码是否正确'
        return false;
     }
     return true;
}
const validateCode = () => {
   if(!codeReg.test(formModel.value.code)){
      message.value='验证码格式错误'
      return false;
   }
   return true;
}
const sendCode= () => {
   // form.value.validateField('Phone',(valid) => {
   if(validatePhone()) 
     {
        message.value=''
       //向后端请求发送验证码
         const res = userSendcodeService(formModel.value.phone).then(res=>{
            console.log(res.data);
            //接口的成功事件处理逻辑
            if(res.data.code!==200){
               message.value=res.data.info
            }
         }).catch(err=>{
             console.log(err);
         })

       //倒计时
       sending.value=false;
       const countId = setInterval(() => {
         second.value--;
         if(second.value<0){
            clearInterval(countId);
            sending.value=true;
            second.value=60
            codewz.value='重新发送'
         }
       },1000)
     }
   }

//点击登录
const login = () => {
   //登录预校验
    if(validatePhone()){
      if(validateCode()){
         message.value=''
         console.log(formModel.value.phone);
         const res =  userLoginService(formModel.value.phone,formModel.value.code,ip,fingerPrinting.value,isAutoLogin.value).then(res=>{
         console.log(res.data);
         if(res.data.code===2500 || res.data.code===2007) message.value=res.data.info
         else if(res.data.code===200){
            console.log(1);
            
            userStore.setToken(res.data.data.accessToken)
            userStore.setRefreshToken(res.data.data.refreshToken)
            userStore.setData(res.data.data.userId,res.data.data.teams,res.data.data.deviceId)
            router.push('/main')
            ElMessage.success('登录成功')
         }
         else  ElMessage.error('服务异常')
      }).catch(err=>{
         console.log(err);
      })
    }
   //获取token判断
  }
}
console.log(ip)
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
         <el-input v-model="formModel.code"></el-input>
        <el-button v-if="sending" type="text" @click="sendCode">{{codewz}}</el-button>
        <el-button v-else type="text" disabled="true">{{ second }}s</el-button>
      </div>
     </el-form-item>
     <el-form-item class="flex">
      <div class="flex">
       <span class="eromes">{{ message }}</span>
       <el-checkbox class="cbox" size="small" @click="changeisAutoLogin()">三十天内自动登录</el-checkbox>
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
   font-size: 35px;
   color: #fff;
   background: url('/img/bgc.jpg') no-repeat ;
   background-size: cover;
   border-radius: 0 5px 5px 0;
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

