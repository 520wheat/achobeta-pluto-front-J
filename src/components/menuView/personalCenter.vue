<template>
  <link rel="stylesheet" href="/iconfont/download/font_ttobs1d52z/iconfont.css">
    
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-width="auto"
      class="demo-ruleForm"
      :size="formSize"
      status-icon
    >
      <div class="title">
        <span @click="goMain" style="cursor: pointer;"> < 个人信息</span>
        <el-form-item class="button-group">
          <el-button @click="resetForm(ruleFormRef)" style="background-color: #e0e0e0;"><span style="font-size: 16px;color: #666666;">重置</span></el-button>
          <el-button type="primary" @click="submitForm(ruleFormRef)">
            <span style="font-size: 16px;">保存</span>
          </el-button>

          <!-- 点赞 -->
          <div class="button-group">
            <div class="like-container">
              <div style="display: flex; flex-direction: column; align-items: center;">
                <span class="iconfont icon-icon" :class="{ 'liked': isLiked }" @click="toggleLike" :style="{ 
                  color: isLiked ? '#ff0000' : '#000000',
                  cursor: 'pointer'
                }"></span>
                <span class="like-count" style="font-size: 10px;">{{ likeCount }}</span>
              </div>
            </div>            
          </div>
        </el-form-item>

      </div>

      <div class="form-group">
        <!-- 姓名 -->      
        <el-form-item label="真实姓名" prop="name" class="form-name">
          <el-input v-model="ruleForm.name" />
        </el-form-item>
        <!-- 性别 -->
        <el-form-item label="性别" prop="gender" class="form-sex">
          <el-select v-model="ruleForm.gender" placeholder="性别">
            <el-option label="男" value="男" />
            <el-option label="女" value="女" />
          </el-select>
        </el-form-item> 
      </div>

      <div class="form-group">
        <!-- 加入时间 -->
        <el-form-item label="加入时间" prop="region" class="form-time">
          <el-input v-model="ruleForm.joinTime" />
        </el-form-item>
        <!-- 所属团队/职位 -->
        <el-form-item label="所属团队/职位" prop="region" class="form-team">
          <el-input v-model="ruleForm.team" />
        </el-form-item>
      </div>
      
      <div class="form-group">
        <!-- 身份证号 -->
        <el-form-item label="身份证号" prop="idCard" class="form-idCard">
          <el-input v-model="ruleForm.idCard" />
        </el-form-item>
        <!-- 手机号码 -->
        <el-form-item label="手机号码" prop="phone" class="form-phone">
          <el-input v-model="ruleForm.phone" />
        </el-form-item> 
        <!-- 邮箱 -->
        <el-form-item label="邮箱" prop="email" class="form-email">  
          <el-input v-model="ruleForm.email" />
        </el-form-item>
      </div>
      
      <div class="form-group">
        <!-- 年级 -->
        <el-form-item label="年级" prop="grade" class="form-grade">
          <el-input v-model="ruleForm.grade" />
        </el-form-item>
        <!-- 专业 -->
        <el-form-item label="专业" prop="major" class="form-major">
          <el-input v-model="ruleForm.major" />
        </el-form-item>
        <!-- 学号 -->
        <el-form-item label="学号" prop="studentId" class="form-studentId">
          <el-input v-model="ruleForm.studentId" />
        </el-form-item>
      </div>
      
      <div class="form-group">
        <!-- 实习、创业、就职经历 -->
        <el-form-item label="实习、创业、就职经历" prop="desc" class="form-desc">
          <el-input v-model="ruleForm.desc" type="textarea" />
        </el-form-item> 
      </div>
      
      <div class="form-group">
        <!-- 现状 -->
        <el-form-item label="现状" prop="situation" class="form-situation">
          <el-input v-model="ruleForm.situation" type="textarea" />
          </el-form-item>
      </div>
      
    </el-form>
  </template>
  
  <script lang="ts" setup>
  import { reactive, ref, onMounted } from 'vue' 
  import { useRouter } from 'vue-router'
  const router = useRouter()
  import type { ComponentSize, FormInstance, FormRules } from 'element-plus'
  import axios from 'axios'
  import { ElMessage } from 'element-plus'
  
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
    await formEl.validate(async (valid, fields) => {
      if (valid) {
        try {
          const response = await axios.post('/api/user/update', ruleForm)
          if (response.data.success) {
            ElMessage.success('保存成功')
          } else {
            ElMessage.error('保存失败')
          }
        } catch (error) {
          console.error('提交表单时出错:', error)
          ElMessage.error('保存失败')
        }
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

  const isLiked = ref(false)
  const likeCount = ref(0)

/*
  const fetchLikeStatus = async () => {
    try {
      const response = await axios.get('/api/user/like-status')
      isLiked.value = response.data.isLiked
      likeCount.value = response.data.likeCount
    } catch (error) {
      console.error('获取点赞状态失败:', error)
    }
  }
  */

  const toggleLike = async () => {
    try {
      const response = await axios.post('/api/user/toggle-like')
      isLiked.value = response.data.isLiked
      likeCount.value = response.data.likeCount
    } catch (error) {
      console.error('更新点赞状态失败:', error)
    }
  }

  // 登录状态
  const loading = ref(false)

  // 获取用户信息
  const fetchUserInfo = async () => {
    loading.value = true
    try {
      // 尝试从本地存储获取用户ID
      const userId = localStorage.getItem('userId') || '1001'
      // const userId = '1001'
      const response = await axios.get('/api/v1/user/info', {
        params: { userId },
        headers:{},       
        timeout: 5000 // 添加超时设置
      })
      
      console.log(response.data);
      
      if (response.data) {// 确保数据存在且格式正确       
        const userData = response.data.data || {}
        Object.assign(ruleForm, userData)
      } else {
        throw new Error('Invalid response format')
      }
    } catch (error: any) {
      console.error('获取用户信息失败:', error)
      ElMessage.error(error.response?.status === 500 
        ? '服务器错误，请联系管理员'
        : '获取用户信息失败，请稍后重试')
        
      // 设置一些默认值，确保表单可用
      ruleForm.name = '未知用户'
      ruleForm.joinTime = new Date().toISOString().split('T')[0]
    } finally {
      loading.value = false
    }
  }

  // 更新 onMounted 中的 fetchUserInfo
  onMounted(() => {
    fetchUserInfo()
  })

  </script>
  
  <style scoped>
    .title{
      font-size: 20px;
      font-weight: bold;
    } 

    .button-group{
      float: right;
    } 

    .form-name{
      float: left;
      width: 30%;
    } 

    .form-sex{
      float: left;
      width: 25%;
    } 

    .form-group{
      width: 100%;
      height: 10%;
      margin: 10px;
      float: left;
    }

    .form-time{
      float: left;
      width: 30%;
    } 

    .form-team{
      float: left;
      width: 30%;
    }  

    .form-idCard{
      float: left;
      width: 30%;
    }   
    
    .form-phone{
      float: left;
      width: 30%;
    } 

    .form-email{
      float: left;
      width: 30%;
    } 

    .form-grade{
      float: left;
      width: 30%;
    }  

    .form-major{
      float: left;
      width: 30%;
    }   

    .form-studentId{
      float: left;
      width: 30%;
    }

    .like-container{
      width: 10%;
      height: 10%;
      margin-left: 50px;
      margin-right: 10px;
    }

    .icon-icon{
      font-size: 35px;
    }
  </style> 
