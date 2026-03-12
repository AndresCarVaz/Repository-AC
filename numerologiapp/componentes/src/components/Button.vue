<template>
    <div>
        <q-btn :color="props.color" :text-color="textColor" :label="props.label" @click="accion()" />
    </div>
</template>

<script setup>
import {ref, defineProps} from "vue"

const emit = defineEmits(["accionBoton"])

const props = defineProps({
    color:{
        type: String,
        default: "red"
    },
    textColor:{
        type:String,
        default: "yellow"
    },
    label:{
        type:String,
        required:true
    }
})

function accion(){
    emit("accionBoton")
}
</script>