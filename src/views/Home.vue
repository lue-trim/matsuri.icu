<template>
    <div>
        <!-- Navigation Bar -->
        <div class="form-group">
            <ul class="tab-container">
                <!-- <input type="text" v-model="danmakus_query" class="form-control" id="danmakus_search_input" placeholder="弹幕关键词"> -->
                <li>
                    <router-link :to="{ path:'/' }" tag='button' class="btn btn-primary form-control">
                        <span>主页</span>
                    </router-link>
                </li>
                <li>
                    <router-link :to="{ path:'/search/' }" tag='button' class="btn form-control"> <!-- style="width:200px"> -->
                        <span>弹幕/语音数据检索</span>
                    </router-link>
                </li>
                <li>
                    <router-link :to="{ path:'/guard/' }" tag='button' class="btn form-control"> <!-- style="width:200px"> -->
                        <span>上舰记录查询</span>
                    </router-link>
                </li>
                <li>
                    <router-link :to="{ path:'/about/' }" tag='button' class="btn form-control"> <!-- style="width:200px"> -->
                        <span>关于</span>
                    </router-link>
                </li>
            </ul>
        </div>


        <!-- Header -->
        <div class="form-group">
            <h1>{{head_text}}</h1>
        </div>
        <div class="row">
            <div class="col-4">
                <hr>
            </div>
        </div>


        <!-- 直播间筛选 -->
        <!-- <div class="form-group">
            <label for="danmakus_search_input"> </label>
        </div> -->
        <div class="form-group">
            <label for="search_input"> </label>
            <input type="text" v-model="search_query" class="form-control" id="search_input" placeholder="直播间筛选">
        </div>


        <!-- Main -->
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
    inject: ['apiRoot', 'siteName'],
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
        document.title = '主页 - ' + this.siteName;
        window.addEventListener('scroll', this.scrollFunc);
        if (this.channel_list === null)
            this.$root.loading = true;
        this.show_hidden = this.$route.query.hasOwnProperty('hey');
        this.webp_support = this.$root.webp_support;
        this.$http
        .get(this.apiRoot + '/channel')
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

    .tab-container{
        display: table;
        list-style-type: none;
        padding: 0;
    }
    .tab-container li{
        /* display:inline; */
        float:left;
    }
    .tab-container li a{
        display: block;
        padding: 10px;
    }

</style>
