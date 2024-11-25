import { createRouter, createWebHistory } from 'vue-router'
//配置路由
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        { path: '/LoginPage', component: () => import('@/components/LoginPage.vue') },//登录页
        {
            path: '/',
            component: () => import('@/components/index.vue'),
            redirect: '/main',
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
                    path: '/PersonalCenter',
                    component: () => import('@/components/menuView/PersonalCenter.vue')
                },
                {
                    path: '/GoCommonDevice',
                    component: () => import('@/components/menuView/GoCommonDevice.vue')
                },
                {
                    path: '/LoginPage',
                    component: () => import('@/components/LoginPage.vue')
                }   
            ]
        }
        
    ]
})

export default router