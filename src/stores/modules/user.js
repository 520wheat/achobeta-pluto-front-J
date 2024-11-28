import { defineStore } from "pinia";
import { ref } from 'vue'

export const useUserStore = defineStore('big-user', () => {
    const accessToken = ref('')
    const refreshToken = ref('')
    const userId = ref('')
    const deviceId = ref('')
    const teams = ref([])
    const setToken = (newToken) => {
        accessToken.value = newToken
    }
    const setRefreshToken = (newToken) => {
        refreshToken.value = newToken
    }
    const removeToken = () => {
        accessToken.value = ''
        refreshToken.value = ''
    }
    const setData = (uId, pList, devId) => {
        userId.value = uId,
        teams.value = pList
        deviceId.value = devId
    }
    const removeData = () => {
        userId.value = ''
        teams.value = []
        deviceId.value = ''
    }
    return {
        accessToken,
        refreshToken,
        userId,
        deviceId,
        teams,
        setToken,
        setRefreshToken,
        setData,
        removeToken,
        removeData
    }
}, {
    persist: true
})