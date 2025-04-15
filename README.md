# matsuri.icu REVISITED / 麻酱弹幕站储备粮复刻版

---

修改自 https://matsuri.icu （原作者brainbush已经不再更新）

原版后端： https://github.com/brainbush/api.matsuri.icu
手搓的python后端： https://github.com/lue-trim/matsuri-api

## 构建环境
环境没什么特别的..就是一个普通的vue+vite环境  
> 我是直接在conda里装了个nodejs和vite就莫名其妙地跑起来了

## 构建过程
1. 安装依赖项
    ```bash
    npm install
    ```
1. 设置`VITE_APP_GTM`环境变量
    ```bash
    export VITE_APP_GTM=GTM-PC6DNRNV #虽然我也不知道是拿来干什么的
    ```
1. 修改`vite.config.js`  
    参考设置：  
    ```javascript
    import { defineConfig } from 'vite'
    import vue from '@vitejs/plugin-vue'

    const path = require('path');

    // https://vitejs.dev/config/
    export default defineConfig({
    base: '/matsuri.icu', //网站根目录
    plugins: [vue()],
    build: {
        outDir: 'docs' //这里是编译的输出文件夹，设置成docs方便使用GitHub Pages自动部署
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
        extensions: ['.vue', '.js']
    }
    })
    ```
1. 构建
    ```bash
    npm run build
    ```
