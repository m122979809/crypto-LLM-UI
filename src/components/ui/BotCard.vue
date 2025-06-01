<template>
    <div
      @click="$emit('select')"
      class="cursor-pointer bg-[#a47e5ccc] hover:bg-[#a47e5ce6] backdrop-blur-sm p-4 rounded-2xl shadow-xl transition duration-200 hover:shadow-2xl hover:-translate-y-1"
    >
      <h2 class="text-lg font-bold text-[#fffaf0] mb-2">{{ bot.name }}</h2>
      <p class="text-sm text-[#f1e8d4]">{{ bot.description }}</p>
    </div>
  </template>
  
  <script setup>
  defineProps({
    bot: {
      type: Object,
      required: true
    }
  })
  
  defineEmits(['select'])
  </script>
  