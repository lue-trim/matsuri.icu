<template>
    <div>
        <h1>{{head_text}}</h1>
        <div class="form-group">
            <label for="search_input"> </label>
            <input type="text" v-model="search_query" class="form-control" id="search_input" placeholder="直播间筛选">
        </div>
        <div class="form-group">
            <label for="danmakus_search_input"> </label>
            <div class="col-auto" style="display: flex">
                <input type="text" v-model="danmakus_query" class="form-control" id="danmakus_search_input" placeholder="弹幕关键词">
                <router-link :to="{ path:'/search/' + danmakus_query }" tag='button' class="btn btn-primary" style="width:200px">
                    全局弹幕搜索
                </router-link>
            </div>
        </div>
        <CardList v-for="channel in display_result" :channel="channel" :webp_support="webp_support"
                  :key="channel.bilibili_uid"/>
        <div class="empty"></div>
        <footer class="footer mt-auto py-1">
        </footer>
    </div>
</template>

<script>
import CardList from "@/components/CardChannelList";

function true_compare(a, b) {
    if (a.is_live && !b.is_live)
        return -1;
    if (!a.is_live && b.is_live)
        return 1;
    if (!(a.is_live ^ b.is_live))
        return b.last_live - a.last_live;
    return 0;
}

export default {
    name: "HomePage",
    components: {CardList},
    data() {
        return {
            channel_data: JSON.parse(localStorage.getItem('channel_list') || "[]").sort(true_compare),
            channel_list: [],
            search_query: null,
            danmakus_query: null,
            showed: 30,
            show_hidden: this.show_hidden,
            webp_support: this.webp_support,
            head_list: ['✧ε♡зwase✧ε♡зwase✧ε♡зwase✧', '麻酱弹幕站储备粮复刻版', '嗝……果咩']
        }
    },
    computed: {
        head_text: function () {
            return this.head_list[Math.floor(Math.random() * this.head_list.length)]
        },
        query_result: function () {
            if (this.channel_list === null) {
                return [];
            }
            if (this.search_query === null || this.search_query === '')
                return this.channel_list;
            let query_lowercase = this.search_query.toLowerCase();
            return this.channel_list.filter((item) => {
                return Number(query_lowercase) === item.bilibili_uid || Number(query_lowercase) === item.bilibili_live_room || item.name.toLowerCase().match(query_lowercase)
            })
        },
        display_result: function () {
            return this.query_result.filter((channel, index) => index < this.showed)
        }
    },
    watch: {
        search_query: function () {
            this.showed = 30
        },
        danmakus_query: function (val) {
            this.danmakus_query = val
        },
        channel_data: function (val) {
            if (this.show_hidden) this.channel_list = val.slice().sort(true_compare);
            else this.channel_list = val.filter(channel => channel.hidden === false).slice().sort(true_compare);
        }
    },
    mounted() {
        document.title = 'ICU for Viewers';
        window.addEventListener('scroll', this.scrollFunc);
        if (this.channel_list === null)
            this.$root.loading = true;
        this.show_hidden = this.$route.query.hasOwnProperty('hey');
        this.webp_support = this.$root.webp_support;
        this.$http
        .get('//matsuri.luetrim.top/channel')
        .then(function (response) {
            if (response.data.status === 0) {
                this.channel_data = response.data.data;
                localStorage.setItem('channel_list', JSON.stringify(response.data.data));
                this.$root.loading = false;
            }
        }.bind(this))
        .catch(error => {
            console.log(error)
        })
    },
    methods: {
        scrollFunc() {
            if (document.body.clientHeight - window.scrollY - window.innerHeight < (document.body.clientHeight / this.showed)) {
                if (this.showed < this.query_result.length)
                    this.showed += 30;
            }
        }
    }
}
</script>

<style scoped>
.empty {
    padding-bottom: 30px;
}

footer {
    background: rgba(255,255,255,0.5);
    bottom: 0;
    font-size: 0.6rem;
    position: fixed;
}
</style>
