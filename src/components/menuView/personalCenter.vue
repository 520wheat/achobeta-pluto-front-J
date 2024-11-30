  <script lang="ts" setup>
  import { reactive, ref, onMounted } from 'vue' 
  import { useRouter } from 'vue-router'
  const router = useRouter()
  import type { ComponentSize, FormInstance, FormRules } from 'element-plus'
  import axios from 'axios'
  import { ElMessage } from 'element-plus'
  
  interface RuleForm {
    userName: string
    gender: string
    entryTime: string
    positions: string[]
    idCard: string
    phone: string
    email: string
    experience: string
    grade: string
    major: string
    studentId: string
    currentStatus: string
  }
  
  const formSize = ref<ComponentSize>('default')
  const ruleFormRef = ref<FormInstance>()
  const ruleForm = reactive<RuleForm>({
    userName: '',
    gender: '0', // 0 男, 1 女
    entryTime: '',
    positions: [],
    idCard: '',
    phone: '',
    email: '',
    grade: '',
    major: '',
    studentId: '',
    experience: '',
    currentStatus: '',
  })

  const rules = reactive<FormRules<RuleForm>>({
    userName: [
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
    idCard: [
      {required: true,message: '请输入身份证号',trigger: 'change',},
      {min: 18, max: 18, message: '长度应为18', trigger: 'change',},
    ],
    email: [
      {required: true,message: '请输入邮箱',trigger: 'change',},
      {type: 'email', message: '请输入正确的邮箱格式', trigger: 'change'},
    ],
    grade:[
      { required: true, message: '请输入年级', trigger: 'change' },
      { 
        pattern: /^20\d{2}$/,
        message: '请输入有效的年级（如：2023）',
        trigger: 'change'
      }
    ],
    major: [
      {required: true,message: '请输入专业',trigger: 'change',},
      {min: 1, max: 20, message: '长度应为1到20', trigger: 'change',},
    ], 
    studentId: [
      {required: true,message: '请输入学号',trigger: 'change',},
      {min: 13, max: 13, message: '长度应为13', trigger: 'change',},
    ],
  })
  
  const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
  }

  const goMain = () => {
    router.push('/main')
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
      
      console.log(response.data.data);
      
      if (response.data.data) {// 确保数据存在且格式正确       
        const userData = response.data.data || {}
        userData.gender = String(userData.gender)
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
      ruleForm.userName = '未知用户'
      ruleForm.entryTime = new Date().toISOString().split('T')[0]
    } finally {
      loading.value = false
    }
  }

  // 修改个人信息
  const saveSuccess = () => {
    ElMessage({
      message: '保存成功',
      type: 'success',
      duration: 2000,
      showClose: true
    })
  }

  const updateUserInfo = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate(async (valid, fields) => {
      if (valid) {
      try {
        const response = await axios({
          method: 'put',
          url: '/api/v1/user/info',
          headers: {
            'Content-Type': 'application/json',
          },
          data: ruleForm
        })

        if (response.status === 200) {
          saveSuccess()
        } else {
          ElMessage('保存失败')
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

  // 更新 onMounted 中的 fetchUserInfo
  onMounted(() => {
    fetchUserInfo()
  })

  </script>

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
          <el-button type="primary" @click="updateUserInfo(ruleFormRef)">
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
        <el-form-item label="真实姓名" prop="userName" class="form-name">
          <el-input v-model="ruleForm.userName" />
        </el-form-item>
        <!-- 性别 -->
        <el-form-item label="性别" prop="gender" class="form-sex">
          <el-select v-model="ruleForm.gender" placeholder="性别">
            <el-option label="男" value="0" />
            <el-option label="女" value="1" />
          </el-select>
        </el-form-item> 
      </div>

      <div class="form-group">
        <!-- 加入时间 -->
        <el-form-item label="加入时间：" class="form-time">
          <span style="font-size: 16px; font-weight: 500; color: #000000;">{{ ruleForm.entryTime }}</span>
        </el-form-item>
        <!-- 所属团队/职位 -->
        <el-form-item label="所属团队/职位：" class="form-team">
          <ul style="padding: 0; margin: 0;">
            <li v-for="(position, index) in ruleForm.positions" 
                :key="index" 
                style="list-style-type: none; font-size: 16px; font-weight: 500; color: #000000; white-space: nowrap;">
              {{ position[1] }} - {{ position[2] }}<template v-if="position[3] && position[4]"> / {{ position[3] }} / {{ position[4] }}</template>
            </li>
          </ul>
        </el-form-item>
      </div>
      
      <div class="form-group">
        <!-- 身份证号 -->
        <el-form-item label="身份证号" prop="idCard" class="form-idCard">
          <el-input v-model="ruleForm.idCard" />
        </el-form-item>
        <!-- 手机号码 -->
        <el-form-item label="手机号码：" class="form-phone">
          <span style="font-size: 16px; font-weight: 500; color: #000000;">{{ ruleForm.phone }}</span>
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
        <el-form-item label="实习、创业、就职经历" prop="experience" class="form-experience">
          <el-input v-model="ruleForm.experience" type="textarea" />
        </el-form-item> 
      </div>
      
      <div class="form-group">
        <!-- 现状 -->
        <el-form-item label="现状" prop="currentStatus" class="form-currentStatus">
          <el-input v-model="ruleForm.currentStatus" type="textarea" />
        </el-form-item>
      </div>
      
    </el-form>
  </template>

  
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

    .form-experience{
      width: 90%;
    } 

    .form-currentStatus{
      width: 90%;
    }

    .isLiked{
      color: #ff0000;
    }
  </style> 
