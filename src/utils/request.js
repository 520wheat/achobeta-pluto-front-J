import axios from 'axios'
import { useUserStore } from '@/stores'
import { getRefresh } from '@/api/user.js'

import router from '@/router'
const baseURL = 'http://wum9je.natappfree.cc'
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
        if (config.url !== '/LoginPage') {
            config.headers.access_token = userStore.accessToken
        }
        if (config.url === '/LoginPage') {
            userStore.removeToken()
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
    (res1) => {
        if (res1.data.code === 6008) {
            if (!isRefreshing) {
                console.log('accesstoken过期');
                isRefreshing = true;
                //请求刷新token
                const res = getRefresh().then(res => {
                    console.log(res.data);
                    if (res.data.code === 200) {
                        userStore.setToken(res.data.data.accessToken)
                        console.log('刷新成功');
                        res1.config.headers.access_token = userStore.accessToken
                        return instance.request(res1.config)
                    }
                    else if (res.data.code === 6004) {
                        console.log('长token过期');
                        userStore.removeToken()
                        ElMessage.error('请重新登录')
                        router.push('/LoginPage')
                    }
                    else if (res.data.code === 6003) {
                        console.log('长token缺失');
                        userStore.removeToken()
                        ElMessage.error('请重新登录')
                        router.push('/LoginPage')
                    }
                }).catch(err => {
                    console.log(err);
                })
                isRefreshing = false
            }
            return res1
        }
        else if (res1.data.code === 2403) {
            ElMessage.error(res1.data.info)
            return res1
        }
        // else if (res1.data.code === 6013) {
        //     res1.config.headers.access_token = userStore.accessToken
        //     return instance.request(res1.config)
        // }
        return res1
    },
    (err) => {
        // if (err.response.data.code === 6008) {
        //     if (!isRefreshing) {
        //         console.log('accesstoken过期');
        //         isRefreshing = true;
        //         // let config=err.response.config;
        //         //请求刷新token
        //         const res = getRefresh().then(res => {
        //             console.log(res.data);
        //             if (res.data.code === 200) {
        //                 userStore.setToken(res.data.data.accessToken)
        //                 console.log('刷新成功');
        //                 err.config.headers.access_token = userStore.accessToken
        //                 return instance.request(err.config)
        //             }
        //             else if (res.data.code === 6004) {
        //                 console.log('长token过期');
        //                 userStore.removeToken()
        //                 ElMessage.error('请重新登录')
        //                 router.push('/LoginPage')
        //             }
        //             // else if(res.data.code===6003){
        //             //     console.log('长token缺失');
        //             //     userStore.removeToken()
        //             //     ElMessage.error('请重新登录')
        //             //     router.push('/LoginPage')
        //             // }
        //         }).catch(err => {
        //             console.log(err);
        //         })
        //         isRefreshing = false
        //     }
        // }
        return Promise.reject(err)
    }
)

export default instance
// export { baseURL }