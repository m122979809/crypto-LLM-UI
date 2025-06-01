<!-- components/ui/BaseButton.vue -->
<template>
    <button
      class="bg-[#3B2E2A] text-white hover:bg-[#5C4033] rounded px-4 py-2 transition duration-200 disabled:opacity-50"
      v-bind="$attrs"
    >
      <slot />
    </button>
</template>
  