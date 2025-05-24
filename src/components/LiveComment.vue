<template>
    <div class="d-flex comment">
        {{ time }}({{ relative_time }})
        <a target="_blank" rel="noopener noreferrer" class="username"
           :href="'https://space.bilibili.com/'+user_id">{{ username }}</a>
        <div v-if="this.superchat_price" class="sc-container">
            <span class="sc-price">SC ￥{{ superchat_price }}</span>
            <span class="sc-text">{{ text }}</span>
        </div>
        <div v-else-if="!this.gift_name && !this.superchat_price" class="normal-text">
            <span class="normal-text">{{ text }}</span>
        </div>
        <div v-else class="gift-container">
            <span class="gift-price">￥{{ gift_price }}</span>
            <!-- <div style="color:#ff80ab;padding-left: 15px">礼物：{{ gift_name }}×{{ gift_num }}，￥{{ gift_price }}</div> -->
            <span class="gift-text">{{ gift_name }}</span>
        </div>
    </div>
</template>
<script>
export default {
    name: "LiveComment",
    props: {
        comment: Object,
        viewer_view: Boolean
    },
    computed: {
        time: function () {
            return this.$moment(this.comment.time).format('YY-MM-DD HH:mm')
        },
        relative_time: function(){
            return this.$moment.utc(this.comment.relative_time).format('H:mm:ss.SS')
        },
        text: function () {
            if (this.comment)
                return this.comment.text;
            else return null;
        },
        user_id: function () {
            if (this.comment)
                return this.comment.user_id;
            else return ''
        },
        username: function () {
            if (this.comment)
                return this.comment.username;
            else return ''
        },
        gift_name: function () {
            if (this.comment)
                return this.comment.gift_name;
            else return ''
        },
        gift_price: function () {
            if (this.comment)
                return this.comment.gift_price;
            else return null;
        },
        gift_num: function () {
            if (this.comment)
                return this.comment.gift_num;
            else return ''
        },
        superchat_price: function () {
            if (this.comment)
                return this.comment.superchat_price;
            else return ''
        }
    }
}
</script>
<style scoped>
.comment {
    padding: 2px 15px;
}

.username {
    padding-left: 15px;
}

.normal-text {
    color: #000000;
    background: #ffffff40;
}

.sc-container {
    padding: 10px;
    color: #000000;
    background: #ff80ab40;
    border-radius: 6px;
}
.sc-text {
    color: #000000;
    padding: 0px 15px;
}
.sc-price {
    color: #fff;
    background: #ff80ab;
    padding: 2px 10px;
    border-radius: 6px;
}

.gift-container {
    padding: 10px;
    color: #000000;
    background: #80abff40;
    border-radius: 6px;
}
.gift-text {
    color: #000000;
    padding-left: 15px;
}
.gift-price {
    color: #fff;
    background: #80abff;
    padding: 2px 10px;
    border-radius: 6px;
}

a{
    padding: 2px 15px;
}
a:link{
    padding: 2px 15px;
    color: #80abff;
}
a:visited{
    padding: 2px 15px;
    color: #80abff;
}
a:hover{
    padding: 2px 15px;
    background: #80abff40;
    border-radius: 4px;
}

</style>
