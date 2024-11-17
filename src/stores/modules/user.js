import { defineStore } from "pinia";
import { ref } from 'vue'

export const useUserStore = defineStore('big-user', () => {
    const token = ref('')
    const refreshToken = ref('')
    const setToken = (newToken) => {
        token.value = newToken
    }
    const setRefreshToken = (newToken) => {
        refreshToken.value = newToken
    }
    const removeToken = () => {
        token.value = ''
    }

    return {
        token,
        refreshToken,
        setToken,
        setRefreshToken,
        removeToken
    }
}, {
    persist: true
})