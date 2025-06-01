<template>
  <div class="p-4 bg-[#F1EBD9] flex flex-col space-y-4">
    <!-- 標題動畫 -->
    <h1
      class="text-lg font-bold transform transition-all duration-700"
      :class="isMounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-5'"
    >
      <p
        class="first-letter:text-7xl first-letter:font-extrabold italic box-decoration-slice bg-gradient-to-r from-[#A47E5C] to-[#6B4C3B] px-4 py-1 text-white rounded leading-[1.4]"
      >
        Crypto LLM
      </p>
    </h1>

    <!-- 新對話按鈕 -->
    <button
      class="transition duration-150 ease-in-out w-full bg-[#bda189] text-[#381d0a] px-4 py-2 rounded hover:bg-[#3E2816] hover:text-white active:scale-95"
      @click="$emit('new-chat')"
    >
      新對話
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

defineEmits(['new-chat'])

const isMounted = ref(false)

onMounted(() => {
  setTimeout(() => {
    isMounted.value = true
  }, 100) // 微延遲讓動畫流暢
})
</script>
