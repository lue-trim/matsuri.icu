<template>
    <div class="row" style="display: grid;">
        <div class="col-12">
            <hr>
        </div>
        <router-link :to="{name:'channel',params:{channel:channel.bilibili_uid}}" style="display: flex;">
            <div class="d-flex container container-row"  style="display: flex;">
                <img class="image_container" alt="" :src="face">
                <div class="col ms-4" style="display: grid;">
                    <div class="row">
                        <h5>{{channel.name}}
                            <a target="_blank" rel="noopener noreferrer" :href="live_url" v-if="channel.is_live" >
                                <span class="badge bg-primary">直播中</span>
                            </a>
                        </h5>
                    </div>
                    <div class="row">
                        <div class="col-6 col-md">
                            <div class="row">
                                <div class="tag_name">上次直播</div>
                            </div>
                            <div class="row">
                                <div class="tag_value pt-1" :title="last_live_hover">{{last_live}}</div>
                            </div>
                        </div>
                        <div class="col-6 col-md">
                            <div class="row">
                                <div class="tag_name">上次直播弹幕数</div>
                            </div>
                            <div class="row">
                                <div class="tag_value pt-1">{{last_danmu}}</div>
                            </div>
                        </div>
                        <div class="col-6 col-md">
                            <div class="row">
                                <div class="tag_name">累计收录片段数</div>
                            </div>
                            <div class="row">
                                <div class="tag_value pt-1">{{total_clips}}</div>
                            </div>
                        </div>
                        <div class="col-6 col-md">
                            <div class="row">
                                <div class="tag_name">累计弹幕数</div>
                            </div>
                            <div class="row">
                                <div class="tag_value pt-1">{{total_danmu}}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </router-link>
    </div>
</template>

<script>
export default {
    name: "CardChannelList",
    props: {
        channel: Object,
        webp_support: Boolean
    },
    computed: {
        face: function () {
            if (this.webp_support) {
                return this.channel.face + '@256h_256w.webp'
            } else {
                return this.channel.face + '@256h_256w'
            }
        },
        live_url: function () {
            if (this.channel.hasOwnProperty('bilibili_live_room'))
                return 'https://live.bilibili.com/' + this.channel.bilibili_live_room;
            return ''
        },
        last_live: function () {
            let timestamp = this.channel.last_live;
            if (timestamp === null) return '无';
            if (this.$moment().diff(timestamp, 'days') > 7) {
                return this.$moment(timestamp).format('YYYY年MM月DD日');
            }
            return this.$moment(timestamp).fromNow();
        },
        last_live_hover: function () {
            return this.$moment(this.channel.last_live).format('YYYY/M/D H:mm:ss');
        },
        total_clips: function () {
            if (this.channel.total_clips > 0)
                return this.channel.total_clips;
            return '无'
        },
        last_danmu: function () {
            let last_danmu = this.channel.last_danmu;
            if (last_danmu === null) {
                return '无'
            }
            return last_danmu + '条'
        },
        total_danmu: function () {
            let total_danmu = this.channel.total_danmu;
            if (total_danmu === null) {
                return '无'
            }
            return total_danmu + '条'
        }
    }
}
</script>

<style scoped>

.image_container {
    align-self: center;
    width: 100px;
    height: 100px;
    background-size: cover;
    border-radius: 5%;
}

.badge {
    margin-left: 5px;
}
.badge:hover{
    background-color: #ffffff00;
}

.container-row {
    padding-left: 30px;
    padding-right: 30px;
}

.col-md{
    display: grid;
}

.row {
    display: flex;
    align-self: center;
}

.tag_name {
    color: rgba(0, 0, 0, .55);
    font-size: 13px;
}

.tag_value {
    font-size: 20px;
    align-self: flex-start;
}

a:link {
    color: #212121;
    text-decoration: none;
}
</style>