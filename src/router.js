import {createRouter, createWebHashHistory} from 'vue-router'

import Home from "@/views/Home";
import Channel from "@/views/Channel";
import Detail from "@/views/Detail";
import Viewer from "@/views/Viewer"
import About from "@/views/About";
import NotFound from "@/views/NotFound";
import DanmakuSearch from "@/views/DanmakuSearch";
import Search from "@/views/Search"

const routes = [
    { path: '/', name: 'home', component: Home },
    { path: '/channel/:channel', name: 'channel', component: Channel },
    { path: '/detail/:id', name: 'detail', component: Detail },
    { path: '/viewer/:id', name: 'viewer', component: Viewer },
    { path: '/danmakusearch/:danmaku', name: 'danmaku_search', component: DanmakuSearch },
    { path: '/search', name: 'search', component: Search },
    { path: '/about', name: 'about', component: About },
    { path: '/:pathMatch(.*)', name: 'NotFound', component: NotFound },
    // {path: '/:catchAll(.*)', redirect: '/'}
];

const router = createRouter({
    mode: 'hash',//history
    base: import.meta.env.BASE_URL,
    history: createWebHashHistory(import.meta.env.BASE_URL),
    // history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes
})

export default router
