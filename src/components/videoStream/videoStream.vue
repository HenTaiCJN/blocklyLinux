<script setup lang="ts">

import {io} from "socket.io-client";
import {onMounted, ref} from "vue";

const socket = io('http://192.168.1.100:9010');
const action=ref('')

onMounted(() => {
    socketStart()
    keyListenStart()
})

function socketStart() {
    socket.on('connect', () => {
        console.log('Connected to WebSocket server');
    });

    socket.on('response', (data) => {
        console.log('Received response:', data);
        action.value=`${data}\n`
    });

    socket.emit('message', 'Hello, Server!');

    socket.on('move', (data) => {
        action.value = `${data}\n`;
    });
    socket.on('fire', (data) => {
        action.value = `${data}\n`;
    });
    socket.on('bottom_move', (data) => {
        action.value = `${data}\n`;
    });
    socket.on('up_move', (data) => {
        action.value = `${data}\n`;
    });
    socket.on('motor_error', (data) => {
        action.value = `${data}\n`;
    });
}

function keyListenStart() {
    document.addEventListener('keydown', (event) => {
        if (['W', 'A', 'S', 'D'].includes(event.key.toUpperCase())) {
            socket.emit('key_event', {
                key: event.key.toUpperCase(),
                action: 'down'
            });
        }
        if ([' '].includes(event.key.toUpperCase())) {
            socket.emit('fireKey_event', {
                key: event.key.toUpperCase(),
                action: 'down'
            });
        }
        if (['ArrowLeft', 'ArrowRight'].includes(event.key)) {
            socket.emit('bottomKey_event', {
                key: event.key,
                action: 'down'
            });
        }
        if (['ArrowUp', 'ArrowDown'].includes(event.key)) {
            socket.emit('upKey_event', {
                key: event.key,
                action: 'down'
            });
        }
        if (['T'].includes(event.key)) {
            socket.emit('reset_event', {
                key: event.key,
                action: 'down'
            });
        }
    });

    document.addEventListener('keyup', (event) => {
        if (['W', 'A', 'S', 'D'].includes(event.key.toUpperCase())) {
            socket.emit('key_event', {
                key: event.key.toUpperCase(),
                action: 'up'
            });
        }
        if ([' '].includes(event.key.toUpperCase())) {
            socket.emit('fireKey_event', {
                key: event.key.toUpperCase(),
                action: 'up'
            });
        }
        if (['ArrowLeft', 'ArrowRight'].includes(event.key)) {
            socket.emit('upKey_event', {
                key: event.key,
                action: 'up'
            });
        }
        if (['ArrowUp', 'ArrowDown'].includes(event.key)) {
            socket.emit('fireKey_event', {
                key: event.key,
                action: 'up'
            });
        }

    });
}

</script>

<template>
    <div  style="text-align: center">
        <img src="http://192.168.1.100:9010/video_feed"  alt="" width="240" height="240"/>
    </div>

    <pre style="text-align: center">{{action}}</pre>

</template>

<style scoped>

</style>
