<template>
  <!-- <div class="p-4 bg-[#E4D3B3] text-center">
    <button
      @click="handleSignOut"
      class=" italic flex items-center justify-center gap-2 text-sm text-[#6B4C3B] hover:underline"
    >
      <SettingIcon class="w-4 h-4" />
      登出
    </button>
  </div> -->
</template>

<script setup>
import SettingIcon from '../../assets/arrow-left-start-on-rectangle.vue'
import { auth } from '@/firebase'
import { signOut } from 'firebase/auth'

async function handleSignOut() {
  try {
    await signOut(auth)
    console.log('登出成功')
    window.location.reload()  // 👈 登出後直接刷新頁面，回到登入畫面
  } catch (error) {
    console.error('登出失敗', error)
  }
}
</script>
