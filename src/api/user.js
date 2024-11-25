import request from '@/utils/request'

//发送验证码接口
export const userSendcodeService = (phone) => {
    return request({
        url: 'http://is7ay5.natappfree.cc/api/v1/auth/getcode',
        method: 'post',
        data: {
            phone
        }
    })
}
//登录接口
export const userLoginService = (phone, code, ip, fingerPrinting, isAutoLogin) => {
    return request({
        url: 'http://is7ay5.natappfree.cc/api/v1/auth/login',
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
        url: 'http://is7ay5.natappfree.cc/api/v1/auth/refresh',//看后端怎么写，在request里面也有这个配置
        method: 'post',
    })
}
