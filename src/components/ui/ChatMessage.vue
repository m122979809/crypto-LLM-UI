<template>
    <div :class="alignmentClass" class="mb-4">
      <span :class="bubbleClass" class="inline-block px-4 py-2 rounded">
        {{ msg.text }}
      </span>
    </div>
</template>
  
<script setup>
  defineProps({
    msg: Object
  })
  
  const alignmentClass = computed(() =>
    props.msg.sender === 'user' ? 'text-right' : 'text-left'
  )
  const bubbleClass = computed(() =>
    props.msg.sender === 'user' ? 'bg-blue-200' : 'bg-gray-300'
  )
</script>
