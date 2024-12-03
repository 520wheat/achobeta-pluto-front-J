import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores'

//配置路由
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        { path: '/LoginPage', component: () => import('@/components/LoginPage.vue') },//登录页
        {
            path: '/',
            component: () => import('@/components/index.vue'),
            redirect: '/LoginPage',
            children: [
                {
                    path: '/main',
                    component: () => import('@/components/main.vue')
                },
                {
                    path: '/ManageTeampage',
                    component: () => import('@/components/ManageTeampage.vue')
                },
                {
                    path: '/UserInfEdit',
                    component: () => import('@/components/UserInfEdit.vue')
                },
                {
                    path: '/UserInf',
                    component: () => import('@/components/UserInf.vue')
                },
                {
                    path: '/UserAdd',
                    component: () => import('@/components/UserAdd.vue')
                },
                {
                    path: '/personalCenter',
                    component: () => import('@/components/menuView/personalCenter.vue')
                },
                {
                    path: '/LoginPage',
                    component: () => import('@/components/LoginPage.vue')
                },
            ]
        }

    ]
})
//路由全局前置守卫
const authUrls = ['/main', '/ManageTeamPage', '/UserAdd', '/UserInfEdit', '/personalCenter']
router.beforeEach((to, from, next) => {
    const userStore = useUserStore()
    if (to.path === '/LoginPage') {
        next()
        return
    }
    else if (authUrls.includes(to.path)) {
        if (userStore.refreshToken) {
            next()
        } else {
            ElMessageBox.alert('你的登录状态已失效，请重新登录', '温馨提示', {
                type: 'warning',
                confirmButtonText: '返回登陆页面'
            }).then(res => {
                next('/LoginPage')
            }).catch(err => {
                console.log(err);
            })

        }
    }
})
export default router