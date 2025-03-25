import {createRouter, createWebHistory} from 'vue-router'

import Home from "@/views/Home";
import Channel from "@/views/Channel";
import Detail from "@/views/Detail";
import Viewer from "@/views/Viewer"
import About from "@/views/About";

const routes = [
    {path: '/matsuri/', name: 'home', component: Home},
    {path: '/matsuri/channel/:channel', name: 'channel', component: Channel},
    {path: '/matsuri/detail/:id', name: 'detail', component: Detail},
    {path: '/matsuri/viewer/:id', name: 'viewer', component: Viewer},
    {path: '/matsuri/about', name: 'about', component: About},
    {path: '/matsuri/:catchAll(.*)', redirect: '/'}
];

const router = createRouter({
    mode: 'history',
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes
})

export default router
