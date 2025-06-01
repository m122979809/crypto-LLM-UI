<template>
    <div class="flex items-center justify-center h-screen bg-gradient-to-b from-[#FFFBE6] via-[#F8E6C1] to-[#E9D6BA]">
      <button
        class="px-6 py-3 bg-[#4285F4] text-white rounded-full shadow-md hover:bg-[#357AE8] text-lg font-semibold"
        @click="loginWithGoogle"
      >
        使用 Google 登入
      </button>
    </div>
  </template>
  
  <script setup>
  import { auth, googleProvider } from '@/firebase'
  import { signInWithPopup } from 'firebase/auth'
  
  async function loginWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user
      console.log('登入成功！', user)
      // TODO: 這裡可以做轉跳到聊天頁面，或儲存 user info
    } catch (error) {
      console.error('登入失敗', error)
    }
  }
  </script>
  