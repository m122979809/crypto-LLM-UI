<template>
  <div class="flex flex-wrap gap-2">
    <BaseButton
      v-for="(bot, index) in bots"
      :key="index"
      @click="selectBot(bot)"
      class="px-4 py-2 text-[#6b3b3b] shadow-xl transition rounded"
      :class="[bot.name === activeBot ? 'ring-2 ring-offset-1 ring-yellow-500' : '', bot.color]"
    >
      {{ bot.name }}
    </BaseButton>
  </div>
</template>

<script setup>
import { defineEmits, ref } from 'vue'
import BaseButton from './BaseButton.vue'

const emit = defineEmits(['select'])

const activeBot = ref(null)

const bots = [
  { name: '科學知識'},
  { name: '傳統醫療'},
  { name: '長照'},
  { name: '部落產經'},
]

function selectBot(bot) {
  activeBot.value = bot.name
  emit('select', bot.name)
}
</script>
