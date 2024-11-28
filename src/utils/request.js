import axios from 'axios'
import { useUserStore } from '@/stores'
import { getRefresh } from '@/api/user.js'
import { ElMessage } from 'element-plus'
import router from '@/router'
const baseURL = 'http://3jqpu6.natappfree.cc'
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
        const userStore = useUserStore()
        if (config.url === '/api/v1/auth/refresh') {
            config.headers.refresh_token = userStore.refreshToken
        }
        else if (userStore.accessToken) {
            config.headers.access_token = userStore.accessToken
        }
        return config
    },
    (err) => {
        return Promise.reject(err)
    }
)
let isRefreshing = false;//标记是否正在刷新token
//响应拦截器
instance.interceptors.response.use(
    (res) => {

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
        return res
    },
    (err) => {
        if (err.response.data.code === 6008) {
            if (!isRefreshing) {
                console.log('accesstoken过期');
                isRefreshing = true;
                //请求刷新token
                const res = getRefresh().then(res => {
                    console.log(res.data);
                    if (res.data.code === 200) {
                        userStore.setToken(res.data.data.accessToken)
                        userStore.setRefreshToken(res.data.data.refreshToken)
                        console.log('刷新成功');
                    }
                    else if (res.data.code === 6004) {
                        console.log('长token过期');
                        userStore.removeToken()
                        ElMessage.error('请重新登录')
                        router.push('/LoginPage')
                    }
                    // else if(res.data.code===6003){
                    //     console.log('长token缺失');
                    //     userStore.removeToken()
                    //     ElMessage.error('请重新登录')
                    //     router.push('/LoginPage')
                    // }
                }).catch(err => {
                    console.log(err);
                })
                isRefreshing = false
            }
        }
        else if (err.response.data.code === 6013) {
            err.config.headers.access_token = userStore.accessToken
            return instance.request(err.config)
        }
        return Promise.reject(err)
    }
)

export default instance
// export { baseURL }