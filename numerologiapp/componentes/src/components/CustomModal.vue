<template>
  <q-dialog v-model="modelValue">
    <q-card class="modal-card">
      <q-card-section :style="{ color: textColor }" class="text-h6">
        {{ texto }}
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cerrar" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  texto: String,
  textColor: {
    type: String,
    default: 'black'
  }
})

const emit = defineEmits(['update:modelValue'])
</script>

<style>
.modal-card {
  padding: 12px;
}
</style>
