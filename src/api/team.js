import request from '@/utils/request'
import { Phone } from '@element-plus/icons-vue'

//团队成员信息渲染

export const teamShowMessage = (userId, teamId, lastId, limit) => {
    return request({
        url: '/api/v1/team/member/list',
        method: 'get',
        params: {
            userId,
            teamId,
            lastId,
            limit
        }
    })
}
// export const teamShowMessage = (requestMemberListDTO) => {
//     return request({
//         url: '/api/v1/team/member/list',
//         method: 'get',
//         params: {
//             userId: requestMemberListDTO.userId,
//             teamId: requestMemberListDTO.teamId,
//             lastId: requestMemberListDTO.lastId,
//             limit: requestMemberListDTO.limit
//         }

//     })
// }

//团队架构管理信息渲染
export const teamQueryOrganization = (userId, teamId) => {
    return request({
        url: '/api/v1/team/structure',
        method: 'get',
        params: {
            userId,
            teamId
        }
    })
}
//修改团队组织架构
export const teamModifyOranization = (userId, addPositions, deletePositions, teamId) => {
    return request({
        url: '/api/v1/team/structure',
        method: 'put',
        data: {
            userId,
            addPositions,
            deletePositions,
            teamId
        }
    })
}
//查询团队成员信息详情
export const teamQueayMember = (userId, teamId, memberId) => {
    return request({
        url: '/api/v1/team/member/detail',
        method: 'get',
        params: {
            userId,
            teamId,
            memberId
        }
    })
}
//修改团队成员信息
export const teamModifyMember = (teamId, memberId, userId, userName, phone, entryTime, gender, idCard, email, grade, major, studentId, experience, currentStatus, addPositions, deletePositions) => {
    return request({
        url: '/api/v1/team/member',
        method: 'put',
        data: {
            teamId,
            memberId,
            userId,
            userName,
            phone,
            entryTime,
            gender,
            idCard,
            email,
            grade,
            major,
            studentId,
            experience,
            currentStatus,
            addPositions,
            deletePositions
        }
    })
}
//删除团队成员
export const teamDeleteMember = (userId, memberId, teamId) => {
    return request({
        url: '/api/v1/team/member',
        method: 'delete',
        params: {
            userId,
            memberId,
            teamId
        }
    })
}
//新增用户-添加团队成员
export const teamAddMember = (teamId, userId, userName, phone, entryTime, gender, idCard, email, grade, major, studentId, experience, currentStatus, positions) => {
    return request({
        url: '/api/v1/team/member',
        method: 'post',
        data: {
            teamId,
            userId,
            userName,
            phone,
            entryTime,
            gender,
            idCard,
            email,
            grade,
            major,
            studentId,
            experience,
            currentStatus,
            positions
        }
    })
}