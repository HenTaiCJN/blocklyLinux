<script setup lang="ts">
import {onMounted, ref} from "vue";
import router from "@/router";


onMounted(() => {
    init()
})

function init(){
    router.push({name:"car"})
}
</script>

<template>
    <RouterView />
</template>

<style>
#app {
    padding: 0 !important;
}

.blocklyMainWorkspaceScrollbar {
    visibility: hidden !important;
}

.blocklyScrollbarHandle {
    visibility: hidden !important;
}
</style>
