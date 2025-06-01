<template>
  <div class="flex-1 overflow-y-auto p-2" ref="containerRef">
    <ul>
      <li
        v-for="(history, index) in histories"
        :key="index"
        :class="[ 'mb-2 flex items-center justify-between px-3 py-2 rounded', selectedIndex === index ? 'bg-white' : 'bg-white/50 hover:bg-[#F8E6C1] ' ]"
      >
        <div class="flex-1">
          <input
            v-if="editingIndex === index"
            v-model="editingText"
            v-focus
            @keydown.enter="saveEdit(index)"
            @keydown.esc="cancelEdit"
            class="w-full border border-gray-300 rounded px-2 py-1 text-sm"
          />
          <button
            v-else
            class="text-left w-full truncate"
            @click="selectHistory(index)"
          >
            {{ history.title }}
          </button>
        </div>

        <!-- Dropdown -->
        <Menu as="div" class="relative ml-2">
          <MenuButton class="p-1 rounded hover:bg-yellow-200 text-gray-600 hover:text-black">
            <MenuIcon class="w-5 h-5" />
          </MenuButton>

          <transition
            enter-active-class="transition duration-100 ease-out"
            enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-in"
            leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0"
          >
            <MenuItems
              class="absolute right-0 mt-1 w-32 rounded-md bg-white shadow-lg ring-1 ring-black/5 z-10 focus:outline-none"
            >
              <div class="px-1 py-1">
                <MenuItem v-slot="{ active }">
                  <button
                    @click="startEdit(index)"
                    :class="[ 'group flex w-full items-center rounded-md px-2 py-2 text-sm', active ? 'bg-yellow-100 text-[#5C3A21]' : 'text-gray-800' ]"
                  >
                    <EditIcon class="w-4 h-4 mr-2 text-yellow-600" />
                    重新命名
                  </button>
                </MenuItem>
                <MenuItem v-slot="{ active }">
                  <button
                    @click="$emit('delete', index)"
                    :class="[ 'group flex w-full items-center rounded-md px-2 py-2 text-sm', active ? 'bg-yellow-100 text-red-700' : 'text-red-600' ]"
                  >
                    <DeleteIcon class="w-4 h-4 mr-2 text-red-400" />
                    刪除
                  </button>
                </MenuItem>
              </div>
            </MenuItems>
          </transition>
        </Menu>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import EditIcon from '../../assets/pencil-square.vue'
import DeleteIcon from '../../assets/archive-box-x-mark.vue'
import MenuIcon from '../../assets/bars-arrow-down.vue'

const props = defineProps({ histories: Array })
const emit = defineEmits(['update', 'delete', 'select'])

const editingIndex = ref(null)
const editingText = ref('')
const selectedIndex = ref(null)
const containerRef = ref(null)

// 自訂 focus 指令
const vFocus = {
  mounted(el) {
    el.focus()
  }
}

defineExpose({ vFocus })

function startEdit(index) {
  editingIndex.value = index
  editingText.value = props.histories[index].title
}

function saveEdit(index) {
  const newName = editingText.value.trim()
  if (newName && newName !== props.histories[index].title) {
    emit('update', { index, name: newName })
  }
  editingIndex.value = null
}

function cancelEdit() {
  editingIndex.value = null
}

function selectHistory(index) {
  selectedIndex.value = index
  const selected = props.histories[index]
  emit('select', { index, id: selected.id })
}

function handleClickOutside(e) {
  if (
    editingIndex.value !== null &&
    !e.target.closest('input') &&
    !e.target.closest('.relative')
  ) {
    saveEdit(editingIndex.value)
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
