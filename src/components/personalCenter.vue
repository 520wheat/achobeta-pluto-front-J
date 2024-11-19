<template>
    
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-width="auto"
      class="demo-ruleForm"
      :size="formSize"
      status-icon
    >
      <el-button @click="goMain">个人信息</el-button>
      <!-- 姓名 -->
      <el-form-item label="真实姓名" prop="name">
        <el-input v-model="ruleForm.name" />
      </el-form-item>
      <!-- 性别 -->
      <el-form-item label="性别" prop="gender">
        <el-select v-model="ruleForm.gender" placeholder="性别">
          <el-option label="男" value="男" />
          <el-option label="女" value="女" />
        </el-select>
      </el-form-item> 
      <!-- 加入时间 -->
      <el-form-item label="加入时间" prop="region">
        <el-input v-model="ruleForm.joinTime" />
      </el-form-item>
      <!-- 所属团队/职位 -->
      <el-form-item label="所属团队/职位" prop="region">
          <el-input v-model="ruleForm.team" />
      </el-form-item>
      <!-- 身份证号 -->
      <el-form-item label="身份证号" prop="idCard">
        <el-input v-model="ruleForm.idCard" />
      </el-form-item>
      <!-- 手机号码 -->
      <el-form-item label="手机号码" prop="phone">
        <el-input v-model="ruleForm.phone" />
      </el-form-item> 
      <!-- 邮箱 -->
      <el-form-item label="邮箱" prop="email">  
        <el-input v-model="ruleForm.email" />
      </el-form-item>
      <!-- 年级 -->
      <el-form-item label="年级" prop="grade">
        <el-input v-model="ruleForm.grade" />
      </el-form-item>
      <!-- 专业 -->
      <el-form-item label="专业" prop="major">
        <el-input v-model="ruleForm.major" />
      </el-form-item>
      <!-- 学号 -->
      <el-form-item label="学号" prop="studentId">
        <el-input v-model="ruleForm.studentId" />
      </el-form-item>
      <!-- 实习、创业、就职经历 -->
      <el-form-item label="实习、创业、就职经历" prop="desc">
        <el-input v-model="ruleForm.desc" type="textarea" />
      </el-form-item> 
      <!-- 现状 -->
      <el-form-item label="现状" prop="situation">
        <el-input v-model="ruleForm.situation" type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(ruleFormRef)">
          <span>保存</span>
        </el-button>
        <el-button @click="resetForm(ruleFormRef)"><span>重置</span></el-button>
      </el-form-item>
    </el-form>
  </template>
  
  <script lang="ts" setup>
  import { reactive, ref } from 'vue' 
  import { useRouter } from 'vue-router'
  import type { ComponentSize, FormInstance, FormRules } from 'element-plus'
  
  interface RuleForm {
    name: string
    gender: string
    joinTime: string
    team: string
    idCard: string
    phone: string
    email: string
    desc: string
    grade: string
    major: string
    studentId: string
    situation: string
  }
  
  const formSize = ref<ComponentSize>('default')
  const ruleFormRef = ref<FormInstance>()
  const ruleForm = reactive<RuleForm>({
    name: '',
    gender: '',
    joinTime: '',
    team: '',
    idCard: '',
    phone: '',
    email: '',
    grade: '',
    major: '',
    studentId: '',
    desc: '',
    situation: '',
  })

  const rules = reactive<FormRules<RuleForm>>({
    name: [
      { required: true, message: '请输入姓名', trigger: 'blur' },
      { min: 2, max: 5, message: '长度应为2到5', trigger: 'blur' },
    ],
    gender: [
      {
        required: true,
        message: '请选择性别',
        trigger: 'change',
      },
    ],
    joinTime: [
      {
        required: true,
        message: '请选择加入时间',
        trigger: 'change',
      },
    ],
    team: [
      {
        required: true,
        message: '请输入所属团队/职位',
        trigger: 'change',
      },
    ],
    idCard: [
      {
        required: true,
        message: '请输入身份证号',
        trigger: 'change',
      },
    ],
    phone: [
      {
        required: true,
        message: '请输入手机号码',
        trigger: 'change',
      },
    ],
    email: [
      {
        required: true,
        message: '请输入邮箱',
        trigger: 'change',
      },
    ],
    grade:[
      {
        required: true,
        message: '请输入年级',
        trigger: 'change',
      },
    ],
    major: [
      {
        required: true,
        message: '请输入专业',
        trigger: 'change',
      },
    ], 
    studentId: [
      {
        required: true,
        message: '请输入学号',
        trigger: 'change',
      },
    ],
  })
  
  const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
      if (valid) {
        console.log('submit!')
      } else {
        console.log('error submit!', fields)
      }
    })
  }
  
  const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
  }

  const goMain = () => {
    router.push('/main')
  } 

  </script>
  
  <style scoped>
    .el-form-item{
      float: left;
      margin: 10px;
      width: 40%;
    }
    .el-form{
      height: 100%;
      width: 100%;
      margin: 5px; 
      background-color: #fff;
    }
  </style> 
