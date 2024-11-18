import axios from 'axios'
import { useUserStore } from '@/stores'
import { getRefresh } from '@/api/user.js'
import { ElMessage } from 'element-plus'
import router from '@/router'
const baseURL = 'http://localhost8091'
const userStore = useUserStore()
const instance = axios.create({
    //基础地址，超时时间
    baseURL,
    timeout: 10000,

})
//请求拦截器
instance.interceptors.request.use(
    (config) => {
        //在发送请求前做些什么
        //携带token
        // const userStore = useUserStore()
        // if (config.url !== '/LoginPage') {
        //     config.headers.Authorization = userStore.token
        // }
        // if (config.url === '/refresh_token') {
        //     config.headers.Authorization = userStore.refreshToken
        // }
        return config
    },
    (err) => Promise.reject(err)
)
let isRefreshing = false;//标记是否正在刷新token
//响应拦截器
instance.interceptors.response.use(
    async (res) => {
        // if (res.data.code === '0000') {
        //     if (res.data.data.token) {
        //         userStore.setToken(res.data.data.token)
        //     }
        //     if (res.data.data.refreshToken) {
        //         userStore.setRefreshToken(res.data.data.refreshToken)
        //     }
        //     return res.data.data
        // }
        // //错误的特殊情况如 401 权限不足 或 token过期 => 拦截到登录
        // else if (res.data.code === 401) {
        //     if (!res.config._retry && !isRefreshing) {
        //         console.log('token过期');
        //         isRefreshing = true;
        //         res.config._retry = true;
        //         //请求刷新token
        //         const result = await getRefresh();
        //         console.log(result);
        //         if (result.token) {
        //             console.log('getRefresh()携带长token去重新获取短token', result)
        //             res.config.headers.Authorization = userStore.token
        //             isRefreshing = false;
        //             return instance.request(res.config)

        //         } else if (isRefreshing) {
        //             console.log('长token过期')
        //             isRefreshing = false
        //             ElMessage.error('请重新登录');
        //             router.push('/LoginPage')
        //         }
        //     }
        // }
        // return res;
    },
    (err) => {
        return Promise.reject(err)
    }
)

export default instance
// export { baseURL }