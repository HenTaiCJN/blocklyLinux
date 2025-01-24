import {createRouter, createWebHistory} from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'block',
            component: () => import('@/components/Blockly/Blockly.vue'),
        },
        {
            path: '/car',
            name: 'car',
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import('@/components/videoStream/videoStream.vue'),
        },
    ],
})

export default router
