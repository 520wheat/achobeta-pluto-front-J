import request from '@/utils/request'

//发送验证码接口
export const userSendcodeService = (phone) => {
    return request({
        url: '/api/v1/auth/getcode',
        method: 'post',
        data: phone
    })
}
//登录接口
export const userLoginService = ({ Phone, yzm }) => {
    return request.post('', { Phone, yzm })
}

//刷新token接口
export const getRefresh = () => {
    return request({
        url: '/refresh_token',//看后端怎么写，在request里面也有这个配置
        method: 'get',
    })
}