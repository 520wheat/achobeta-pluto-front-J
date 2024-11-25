import { defineStore } from "pinia";
import { ref } from 'vue'

export const useUserStore = defineStore('big-user', () => {
    const accessToken = ref('')
    const refreshToken = ref('')
    const userId = ref('')
    const positionList = ref([])
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
    const setData = (uId, pList) => {
        userId.value = uId,
        positionList.value = pList
    }
    const removeData = () => {
        userId.value = ''
        positionList.value = []
    }
    return {
        accessToken,
        refreshToken,
        userId,
        positionList,
        setToken,
        setRefreshToken,
        setData,
        removeToken,
        removeData
    }
}, {
    persist: true
})