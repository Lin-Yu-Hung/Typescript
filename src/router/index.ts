import { createRouter, createWebHashHistory } from 'vue-router';
import Login from '@/components/Login.vue';
import Chatroom from '@/components/Chatroom.vue';
const routes = [
    {
        path: '/',
        name: 'Login',
        component: Login,
        meta: {
            title: "登入",
        },
    },
    {
        path: '/Chatroom/:userName/:roomId',
        name: 'Chatroom',
        meta: {
            title: "即時聊天室",
        },
        component: Chatroom,
    }, {
        path: "/:pathMatch(.*)*",
        meta: {
            title: "登入",
        },
        component: Login,
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

router.beforeEach((to) => {
    // 設定HTML title
    // console.log(to);

    window.document.title = to.meta.title ? to.meta.title : "E_store" as any;
});
export default router; // 確保這裡導出了 router
