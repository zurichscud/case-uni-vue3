<script setup lang="ts">
const emit = defineEmits(['itemclick'])
defineProps({
  icon: {
    type: String,
    default: '',
  },
})

function handleItemClick() {
  emit('itemclick')
}
</script>

<template>
  <wd-grid-item  use-icon-slot v-bind="$attrs" @itemclick="handleItemClick">
    <template #icon>
      <image
        :src="icon"
        style="width: 50rpx; height: 50rpx"
        mode="scaleToFill"
      />
    </template>
  </wd-grid-item>
</template>

<style scoped></style>
