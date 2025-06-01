<template>
  <div class="flex h-screen w-screen">
    <!-- 左側：聊天紀錄欄 -->
    <aside
      :class="[ 
        'transition-all duration-300 bg-gradient-to-b from-[#F1EBD9] to-[#E4D3B3] flex flex-col',
        isSidebarCollapsed ? 'w-[0px] overflow-hidden' : 'w-[300px]',
        'shadow-[6px_0_16px_-6px_rgba(0,0,0,0.2)] z-10'
      ]"
    >
      <SidebarHeader @new-chat="handleNewChat" />
      <SidebarHistory
        :histories="histories"
        @update="handleUpdateSession"
        @delete="handleDeleteSession"
        @select="loadMessagesFromSession"
      />
      <SidebarFooter />
    </aside>

    <!-- 右側：聊天主視窗 -->
    <section class="flex-1 flex flex-col bg-gradient-to-b from-[#FFFBE6] via-[#F8E6C1] to-[#E9D6BA]">
      <!-- 主內容 -->
      <div class="flex-1 p-6 overflow-y-auto">
        <div class="flex justify-center">
          <div class="w-full max-w-2xl">
            <div v-for="(msg, index) in messages" :key="index" class="mb-4">
              <div :class="msg.sender === 'user' ? 'text-right' : 'text-left'">
                <span
                  :class="msg.sender === 'user' ? 'bg-[#D8BFAA]' : 'bg-[#F6E5CC]'"
                  class="inline-block px-5 py-2 rounded-2xl text-[#2F2F2F] shadow-sm"
                  v-html="formatMessage(msg.text)"
                ></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!currentSessionId" class="text-center text-gray-500 mt-4">
        請先選擇一個對話開始聊天。
      </div>
      <!-- 輸入框 -->
      <div v-if="isLoading" class="text-sm text-gray-500 text-center py-2 animate-pulse">
        系統回覆中...
      </div>
      <ChatInput
      v-if="currentSessionId"
      :input="input"
      :loading="isLoading"
      @update:input="val => input = val"
      @send="handleSend"
      @uploadImage="handleImageUpload"
      @recordVoice="handleVoiceRecord"
    />
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { marked } from 'marked'
import SidebarHeader from './sidebar/SidebarHeader.vue'
import SidebarHistory from './sidebar/SidebarHistory.vue'
import SidebarFooter from './sidebar/SidebarFooter.vue'
import ChatInput from './ui/ChatInput.vue'

const histories = ref([]) // 改成空陣列等待 API 載入
const messages = ref([])
const input = ref('')
const isSidebarCollapsed = ref(false)
const currentSessionId = ref(null)
const isLoading = ref(false)


// API base url from env
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

onMounted(() => {
  fetchSessions()
})

function handleImageUpload() {
  console.log('圖片上傳功能觸發')
}

function handleVoiceRecord() {
  console.log('語音錄製功能觸發')
}

function formatMessage(text) {
  return marked(text);
}

// 🔥 新增：從 API 載入對話列表
async function fetchSessions() {
  try {
    const res = await fetch(`${apiBaseUrl}/api/chat/sessions`)
    const data = await res.json()
    histories.value = data.map(item => ({
      id: item.id,
      title: item.title
    }))
  } catch (err) {
    console.error('取得對話列表失敗:', err)
  }
}

async function loadMessagesFromSession({ id }) {
  try {
    currentSessionId.value = id
    const res = await fetch(`${apiBaseUrl}/api/chat/session/${id}`)
    const data = await res.json()
    // 將訊息格式化為符合 messages 格式
    messages.value = data.map(msg => ({
      sender: msg.sender,
      text: msg.message,
      created_at: msg.created_at
    }))
    console.log("message", JSON.stringify(messages.value, null, 2))
  } catch (err) {
    console.error('載入對話訊息失敗:', err)
  }
}

async function handleNewChat() {
  try {
    const res = await fetch(`${apiBaseUrl}/api/chat/session`, {
      method: 'POST'
    })
    const data = await res.json()
    currentSessionId.value = data.session_id

    // 插入新的歷史紀錄到最前面
    histories.value.unshift({
      id: data.session_id,
      title: data.title
    })

    // 清空當前訊息
    messages.value = []

    // 自動載入剛建立的 session 訊息（通常是空的）
    await loadMessagesFromSession({ id: data.session_id })

    console.log('✅ 新對話已建立:', data)
  } catch (err) {
    console.error('❌ 建立新對話失敗:', err)
  }
}

async function handleDeleteSession(index) {
  const session = histories.value[index]
  if (!session || !session.id) return

  try {
    await fetch(`${apiBaseUrl}/api/chat/session/${session.id}`, {
      method: 'DELETE'
    })
    histories.value.splice(index, 1)
    console.log('✅ 對話已刪除:', session)
  } catch (err) {
    console.error('❌ 刪除對話失敗:', err)
  }
}

async function handleUpdateSession({ index, name }) {
  const session = histories.value[index]
  if (!session || !session.id) return

  try {
    const res = await fetch(`${apiBaseUrl}/api/chat/session/${session.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title: name })
    })

    const result = await res.json()

    if (result.status === 'updated') {
      histories.value[index].title = name
      console.log('✅ 標題已更新:', name)
    } else {
      console.error('❌ 更新失敗:', result)
    }
  } catch (err) {
    console.error('❌ 更新對話標題失敗:', err)
  }
}

async function handleSend() {
  if (!input.value.trim() || !currentSessionId.value) return
  isLoading.value = true

  const userMessage = {
    session_id: currentSessionId.value,
    sender: 'user',
    message: input.value.trim()
  }

  try {
    const res = await fetch(`${apiBaseUrl}/api/chat/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userMessage)
    })

    const result = await res.json()

    if (result.status === 'saved') {
      messages.value.push({
        sender: 'user',
        text: userMessage.message,
        created_at: new Date().toISOString()
      })

      input.value = ''

      const llmRes = await fetch(`${apiBaseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMessage.message })
      })

      const llmResult = await llmRes.json()
      const assistantText = llmResult.answer?.answer || '抱歉，沒有取得分析結果。'

      const assistantMessage = {
        session_id: currentSessionId.value,
        sender: 'bot',
        message: assistantText
      }

      const saveAssistant = await fetch(`${apiBaseUrl}/api/chat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assistantMessage)
      })

      const saveResult = await saveAssistant.json()

      if (saveResult.status === 'saved') {
        messages.value.push({
          sender: 'bot',
          text: assistantText,
          created_at: new Date().toISOString()
        })
      } else {
        console.error('❌ 助手訊息儲存失敗:', saveResult)
      }
    } else {
      console.error('❌ 使用者訊息儲存失敗:', result)
    }

  } catch (err) {
    console.error('❌ 發送訊息失敗:', err)
  } finally {
    isLoading.value = false
  }
}


</script>
