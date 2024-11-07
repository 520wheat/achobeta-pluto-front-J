import axios from 'axios'
import { useUserStore } from '@/stores'
import router from '@/router'
// const baseUBL = ''
const instance = axios.create({
    //基础地址，超时时间
    baseURL,
    timeout: 10000,
    //请求头
    //   headers:
})
//请求拦截器
instance.interceptors.request.use(
    (config) => {
        //携带token
        const useStore = useUserStore()

    }
)
//响应拦截器

export default instance
export { baseURL }