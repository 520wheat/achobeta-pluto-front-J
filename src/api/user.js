import request from '@/utils/request'

//登录接口
export const userLoginService = ({ Phone, yzm }) =>
    request.post('', { Phone, yzm })