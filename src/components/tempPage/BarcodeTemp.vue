<template>
  <div class="barcode-wrapper">
    <Vue3Barcode
      :value="value"
      :options="options"
      :class="customClass"
    ></Vue3Barcode>
  </div>
</template>

<script setup>
import Vue3Barcode from 'vue3-barcode'

defineProps({
  value: {
    type: String,
    required: true
  },
  options: {
    type: Object,
    default: () => ({
      format: 'ITF14',
      width: 1,
      height: 25,
      displayValue: true,
      flat: true
    })
  },
  customClass: {
    type: String,
    default: 'barcode-container'
  }
})
</script>