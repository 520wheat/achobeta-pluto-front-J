<script setup>
    import { useRoute,useRouter } from 'vue-router';
    import { useUserStore} from '@/stores';
    const router = useRouter()

    const goList = () =>{
      router.push('/list')

    }

    const userStore = useUserStore()
</script>

<template>

   <router-view :key="router.fullPath"></router-view>

</template>
 
<style scoped>

</style>
 
