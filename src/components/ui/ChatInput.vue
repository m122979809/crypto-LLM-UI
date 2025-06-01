<template>
  <div class="bg-gradient-to-b bg-[#E9D6BA] px-4 py-4 relative">
    <div class="flex items-center gap-2 w-full max-w-2xl mx-auto">
      <!-- Plus 按鈕與上彈式選單 -->
      <div class="relative">
        <button
          @click="showMenu = !showMenu"
          class="transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
          :class="showMenu ? 'rotate-45' : ''"
        >
          <Plus class="transition-transform duration-200 ease-in-out" />
        </button>

        <!-- 上彈式選單 -->
        <transition
          enter-active-class="transition duration-100 ease-out"
          enter-from-class="transform opacity-0 scale-95"
          enter-to-class="transform opacity-100 scale-100"
          leave-active-class="transition duration-75 ease-in"
          leave-from-class="transform opacity-100 scale-100"
          leave-to-class="transform opacity-0 scale-95"
        >
          <div
            v-if="showMenu"
            class="absolute bottom-full mb-2 left-0 w-32 rounded-md bg-white shadow-md z-50 text-sm text-[#5C3A21]"
          >
          <button
              class="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-[#F8E6C1]"
              @click="emit('uploadImage'); showMenu = false"
            >
              <Camera class="w-4 h-4" />
              <span>圖片</span>
            </button>
            <button
              class="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-[#F8E6C1]"
              @click="emit('uploadFile'); showMenu = false"
            >
              <File class="w-4 h-4" />
              <span>檔案</span>
            </button>
            <button
              class="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-[#F8E6C1]"
              @click="emit('recordVoice'); showMenu = false"
            >
              <Microphone class="w-4 h-4" />
              <span>錄音</span>
            </button>
          </div>
        </transition>
      </div>

      <!-- 輸入框 -->
      <input
        :value="input"
        :disabled="loading"
        @input="$emit('update:input', $event.target.value)"
        @keyup.enter="$emit('send')"
        type="text"
        placeholder="輸入訊息..."
        class="flex-1 px-4 py-2 border border-[#E4D3B3] rounded-full focus:ring focus:ring-[#E4D3B3] focus:outline-none bg-white"
      />

      <!-- 送出按鈕 -->
      <button
        @click="$emit('send')"
        class="bg-[#A47E5C] text-white px-4 py-2 rounded-full font-bold hover:bg-[#3E2816] hover:text-white transition duration-300 ease-in-out disabled:opacity-50"
      >
        <Send />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Plus from '../../assets/plus.vue'
import Send from '../../assets/paper-airplane.vue'
import Camera from '../../assets/camera.vue'
import File from '../../assets/folder-plus.vue'
import Microphone from '../../assets/microphone.vue'

const props = defineProps({
  input: String,
  loading: Boolean
})

const emit = defineEmits(['update:input', 'send', 'uploadImage', 'uploadFile', 'recordVoice'])

const showMenu = ref(false)

function handleClickOutside(e) {
  if (!e.target.closest('.relative')) {
    showMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
<style scoped>
.rotate-45 {
  transform: rotate(45deg);
}
</style>
