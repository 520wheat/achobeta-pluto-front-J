import request from '@/utils/request'

//发送验证码接口
export const userSendcodeService = (phone) => {
    return request({
        url: '/api/v1/auth/getcode',
        method: 'post',
        data: {
            phone
        }
    })
}
//登录接口
export const userLoginService = (phone, code, ip, fingerPrinting, isAutoLogin) => {
    return request({
        url: '/api/v1/auth/login',
        method: 'post',
        data: {
            phone,
            code,
            ip,
            fingerPrinting,
            isAutoLogin
        }
    })
}

//刷新token接口
export const getRefresh = () => {
    return request({
        url: '/api/v1/auth/refresh',//看后端怎么写，在request里面也有这个配置
        method: 'post',

    })
}
//登出接口
export const logout = (deviceId) => {
    return request({
        url: '/api/v1/auth/logout',
        method: 'post',
        data: {
            deviceId
        }
    })
}
//个人中心信息页面接口
export const userMessage = (userId) => {
    return request({
        url: '/api/v1/user/info',
        method: 'get',
        params: {
            userId
        }
    })
}