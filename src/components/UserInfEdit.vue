<script setup>
import router from '@/router/index.js'
import {ref} from 'vue'
 const toManageTeamPage = () => {
     router.push({
      path: 'ManageTeampage'
     })
   }
const formModel=ref({
   name: '',
   sex: '',
   time:'',
   idcard:'',
   phone:'',
   email:'',
   grade:'',
   major:'',
   stnumber:'',
})
const rules = {
    phone: [
        { required: true,message: '手机号为必填项',trigger:'change' },
        { pattern: /^[1]([3-9])[0-9]{9}$/, message: '请检查是否为中国大陆手机号',trigger:'change'}
    ],
    time: [
        { 
            pattern :/^((\d{4})\/(0[13578]|1[02])\/(0[1-9]|[12]\d|3[01])|(\d{4})\/(0[469]|11)\/(0[1-9]|[12]\d|30)|(\d{4})\/02\/(0[1-9]|1\d|2[0-8])|(((\d{2}(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))\/02\/29))$)/,
            message:'格式为xxxx/xx/xx',
            trigger:'blur'
        }
    ]
}
const reset = () => {
    for(let key in formModel.value){
        formModel.value[key]=''
    }
}
</script>

<template>
    <el-header class="UserHeader">
    <span>
        <el-button type="text" text="plain" size="large" @click="toManageTeamPage" >&lt;</el-button>个人信息
    </span>
    <div class="right">
      <el-button type="info" class="cz" @click="reset">重置</el-button>
      <el-button class="bc" color="rgb(0, 122, 255)">保存</el-button>
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
                        <el-input v-model="formModel.name"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="性别" label-position="top">
                        <el-select v-model="formModel.sex" placeholder="未选择" >
                            <el-option label="男" value="男"></el-option>
                            <el-option label="女" value="女"></el-option>
                            <el-option label="未选择" value="未选择"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="50">
                <el-col :span="7">
                    <el-form-item label="加入时间" prop="time" label-position="top">
                        <el-input v-model="formModel.time"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item label="所属团队/职位" label-position="top">
                        <el-select placeholder="未选择">
                            <el-option label="男"></el-option>
                            <el-option label="女"></el-option>
                        </el-select>
                    </el-form-item>
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
                    <el-form-item label="身份证号" label-position="top">
                        <el-input v-model="formModel.idcard"></el-input>
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
                        <el-input v-model="formModel.stnumber"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="实习、创业、就职经历" label-position="top">
                <el-input
                 type="textarea"
                 :rows="4"
                 resize="none"
                ></el-input>
            </el-form-item>
            <el-form-item label="现状" label-position="top">
                <el-input
                 type="textarea"
                 :rows="3"
                 resize="none"
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