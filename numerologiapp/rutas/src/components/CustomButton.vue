<template>
  <div>
    <q-btn @click="accionBoton" :style="{backgroundColor: props.colorFondo, color:textoColor}"  :label="nombreBoton" ></q-btn>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
const emit = defineEmits(["accion"])

function accionBoton(){ 
    emit("accion")
}

const props = defineProps({
  colorFondo:{
    type:String,
    required:true,
    default:"white"
  },
  textoColor:{
    type:String,
    required:true,
    default:"black"
  },
  nombreBoton:{
    type:String,
    required:true,
    default:"Soy un boton personalizado"
  }
})
</script>