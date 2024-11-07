<script setup>
    import { useRoute,useRouter } from 'vue-router';
    import { useUserStore} from '@/stores';
    const router = useRouter()
    const route = useRoute()

    const goList = () =>{
      router.push('/list')

    }

    const userStore = useUserStore()
</script>

<template>

   <router-view></router-view>

</template>
 
<style scoped>

</style>
 