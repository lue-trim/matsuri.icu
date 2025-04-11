<template>
    <div class="pt-3">
        <h1>关于</h1>
        <div class="row">
            <div class="col-4">
                <hr>
            </div>
        </div>
        <div class="container">
            <p></p>
            <p>原作者：brainbush，修改：<a target="_blank" rel="noopener noreferrer" href="https://github.com/lue-trim/">卤鹅菌</a></p>
            <p>项目地址详见：</p>
            <p>只改了以下API地址的前端-<a target="_blank" rel="noopener noreferrer" href="https://github.com/lue-trim/matsuri.icu">https://github.com/lue-trim/matsuri.icu</a></p>
            <p>自己手搓的可以同时接入blrec的后端-<a target="_blank" rel="noopener noreferrer" href="https://github.com/lue-trim/matsuri-api">https://github.com/lue-trim/matsuri-api</a></p>
            <p>现在这个后端的主要亮点：</p>
            <p>1. 纯python实现</p>
            <p>2. 观看人数直接通过直播间推送的“xxx人看过”这类的信息中读取</p>
            <p>3. 不依赖其他插件，下播之后可以立即通过blrec的接口，从弹幕数据里读取消息（并且因为直播场次是通过开播id+开播时间识别的，不会出现录播那种每过一天就会被当成新场次的<s>bug</s> feature）</p>
            <p>4. 受限于弹幕数据，2025年4月前经过数据补录添加的场次没办法正确显示封面</p>
            <p>5. 收入数据是按直播间实际流水（没扣任何税）计算的，没法精确统计数量，所以所有礼物的个数都是1</p>
            <p>6. float怎么限制小数位数。。有人教教吗</p>
            <p>以下是原说明..</p>
        </div>
        <div class="row">
            <div class="col-4">
                <hr>
            </div>
        </div>
        <div class="container">
            <p>一个非常Anti的站
                （一不小心致敬了
                <a target="_blank" rel="noopener noreferrer"
                   href="https://mamedaifuku.sakura.ne.jp/live_stream/html/index.html">豆大福</a>的样子）<s>明明功能比人家少那么多</s>。
            </p>
            <p>Source：&nbsp;
                <a target="_blank" rel="noopener noreferrer" href="https://github.com/brainbush/matsuri.icu">前端</a>&nbsp;
                <a target="_blank" rel="noopener noreferrer" href="https://github.com/brainbush/matsuri.luetrim.top">后端</a>&nbsp;
                <s>孩子第一次用 Vue 和 Express 写的东西不太好……</s></p>
            <p>一般情况下直播间下播后1分钟左右都会更新，如果遇到问题请联系 Telegram:
                <a target="_blank" rel="noopener noreferrer" href="https://t.me/brainbush"><code>@brainbush</code></a>。
            </p>
            <p>目前各种完善中可能遇到不稳定的情况请见谅！</p>
            <p>如果有需要增加收录的也可以点<a target="_blank" rel="noopener noreferrer" href="https://add.matsuri.icu/">这里</a>或者通过上面的方式联系！</p>
            <p>数据库压力大大大&nbsp;已经换成PostgreSQL了，估计会好一些
            <br>旧MongoDB的数据：<code>magnet:?xt=urn:btih:29A01036F0EEED880EB94A471D87C3FC7D4BAE92</code>（2020年2月至2021年1月31日）
            <br><s>快做成管人观众发言语料库</s></p>
            <br>要抓也就抓吧，也设置一下频率吧，一秒用IP池发100多个请求谁撑得住啊！
            <p>程序力非常弱可能一堆乱七八糟的情况也请见谅！</p>
            <p class="pt-3">其实一开始只是随手看到群里的大佬提出来：做一个统计直播弹幕的内容方便录播组剪辑打灯之类的吧！</p>
            <p>然后就这样愉快的做出来了，然后貌似还是半自动不太好用<s>以及一些奇奇怪怪的Bug</s>，干脆就一条龙服务吧！</p>
            <p>关于“观看人数“：数据是从弹幕发言、礼物、b站进入通知（xxx进入/关注/分享了直播间）的所有人数加在一起后以B站UID去重获得，真实的数据应该会更多不会更少wwww</p>
            <p>礼物是包括送礼和舰长哒！（是按照打折后的价格来哒）</p>
        </div>
    </div>
</template>

<script>
    export default {
        name: "AboutPage",
        mounted(){
            document.title = '关于 - ICU for Viewers'
        }
    }
</script>

<style scoped>

</style>
