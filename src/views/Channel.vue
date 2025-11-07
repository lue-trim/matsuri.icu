<template>
    <div>
        <div class="container">
            <div class="d-flex flex-wrap">
                <a :href="space" target="_blank" rel="noopener noreferrer"><img class="image_container_channel"
                                                                                alt="" :src="face"></a>
                <div class="mid ms-2" v-if="channel_name">
                    <a :href="space" target="_blank" rel="noopener noreferrer"><h3>{{channel_name}}</h3></a>
                </div>
                <div class="w-100 d-sm-none mt-3"/>
                <div class="mid ms-sm-auto">
                    <div class="float-right">
                        <label>状态：
                            <div class="btn-group">
                                <button v-on:click="list()" id="on_button" type="button"
                                        class="btn btn-outline-primary active">直播
                                </button>
                                <button v-on:click="off_list()" id="off_button" type="button"
                                        class="btn btn-outline-primary">下播
                                </button>
                            </div>
                        </label>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <hr>
            </div>
        </div>
        <div v-if="online_clips">
            <ClipList v-for="clip in display_clips" :clip="clip" :detail_view="false" :viewer_view="false"
                      :webp_support="webp_support" :key="clip.id"/>
        </div>
        <div v-else>
            <OffComments :uid="channel"/>
        </div>
        <div class="container" id="paginationControls" align="center">
            <span class="mid comment-container">
                <button class="btn btn-primary" id="prevPage" @click="changePage(currentPage - 1)">＜</button>
                <span id="currentPageDisplay">1</span>/<span id="totalPagesDisplay">1</span>页 (共<span id="totalItemsDisplay">0</span>条)
                <button class="btn btn-primary" id="nextPage" @click="changePage(currentPage + 1)">＞</button>
            </span>
            <span class="mid comment-container">
                <input type="number" class="form-control text" style="max-width: 120px;display: inline" id="pageInput" min="1" placeholder="页码" @keyup.enter="jumpToPage()"/>
                <button class="btn btn-primary" @click="jumpToPage()">跳转</button>
            </span>
        </div>
    </div>
</template>

<script>
    import ClipList from "@/components/ClipList";
    import OffComments from "@/views/OffComments";

    export default {
        name: "ChannelPage",
        components: {ClipList, OffComments},
        inject: ['apiRoot'],
        data() {
            return {
                channel_info: {},
                channel: parseInt(this.$route.params.channel),
                clip_list: [],
                online_clips: true,
                webp_support: this.$root.webp_support,
                showed: 20
            }
        },
        created() {
            let channel_list = JSON.parse(localStorage.getItem('channel_list'));
            if (channel_list === null)
                return;
            let channel_info = channel_list.find(x => x.bilibili_uid === this.channel);
            if (channel_info !== undefined) this.channel_info = channel_info;
        },
        methods: {
            list: function () {
                if (this.online_clips)
                    return;
                document.getElementById('off_button').classList.remove('active');
                document.getElementById('on_button').classList.add('active');
                this.online_clips = true;
                this.get_list();
            },
            off_list: function () {
                if (!this.online_clips)
                    return;
                document.getElementById('on_button').classList.remove('active');
                document.getElementById('off_button').classList.add('active');
                this.online_clips = false;
            },
            // get_list: function () {
            //     let url;
            //     this.$root.loading = true;
            //     url = this.apiRoot + '/channel/' + this.channel.toString() + '/clips';
            //     this.$http
            //         .get(url)
            //         .then(function (response) {
            //             if (response.data.status === 0) {
            //                 this.clip_list = response.data.data;
            //                 this.$root.loading = false;
            //             }
            //         }.bind(this))
            // },
            // scrollFunc() {
            //     if (document.body.clientHeight - window.scrollY - window.innerHeight < (document.body.clientHeight / this.showed)) {
            //         if (this.showed < this.clip_list.length)
            //             this.showed += 10;
            //     }
            // },
            performSearch: async function(page = 1) {
                this.$root.loading = true;
                document.getElementById('paginationControls').disabled = true; // 隐藏分页控件

                // 准备发送到后端的数据
                const requestData = {
                    page: page,       // 传递页码
                };

                try {
                    const response = await fetch(
                        this.apiRoot + '/channel/' + this.channel.toString() + '/clips?page=' + page.toString(), 
                        { 
                            method: 'POST', 
                            headers: {
                                "Content-Type": "application/json",
                            },
                        },
                    );
                    var data = await response.json();

                    // console.log(data)
                    if (data.success) {
                        // 更新分页状态
                        this.totalItems = data.pagination.totalItems;
                        this.totalPages = data.pagination.totalPages;
                        this.currentPage = data.pagination.currentPage;

                        // 更新容器
                        this.clip_list = data.data;
                        this.$root.loading = false;
                    } else {
                        throw new Error(data.message || "后端返回错误");
                    }
                } catch (error) {
                    console.error('请求出错:', error);
                    this.totalItems = 0;
                    this.totalPages = 0;
                    this.currentPage = 1;
                } finally {
                    // 无论成功与否，都更新分页控件
                    // document.getElementById("paginationControls").updatePaginationControls();
                    // Pagination
                    this.updatePaginationControls();
                }
            },
            changePage: async function(newPage) {
                if (newPage >= 1 && newPage <= this.totalPages) {
                // if (newPage >= 1) {
                    this.currentPage = newPage;
                    // 重新执行搜索，但使用当前的查询条件和新的页码
                    await this.performSearch(this.currentPage);
                }
            },
            jumpToPage: async function() {
                const inputElement = document.getElementById('pageInput');
                const pageStr = inputElement.value.trim();
                
                // 输入验证
                if (!pageStr) {
                    pageStr = '1';
                }
                
                const targetPage = parseInt(pageStr, 10);
                if (isNaN(targetPage) || targetPage < 1) {
                    alert('请输入有效的正整数页码！');
                    return;
                }
                
                if (targetPage > this.totalPages) {
                    alert(`页码超出范围！最大页码为 ${this.totalPages}。`);
                    return;
                }
                
                // 如果页码有效，则执行搜索
                this.currentPage = targetPage;
                await this.performSearch(this.currentPage);
            },
            updatePaginationControls: function() {
                document.getElementById('currentPageDisplay').textContent = this.currentPage;
                document.getElementById('totalPagesDisplay').textContent = this.totalPages;
                document.getElementById('totalItemsDisplay').textContent = this.totalItems;

                document.getElementById('prevPage').disabled = (this.currentPage <= 1);
                document.getElementById('nextPage').disabled = (this.currentPage >= this.totalPages);

                const paginationControls = document.getElementById('paginationControls');
                if (this.totalItems > 0) {
                    paginationControls.disabled = false;
                } else {
                    paginationControls.disabled = true;
                    this.data = [];
                }
            },
        },
        mounted: async function () {
            // window.addEventListener('scroll', this.scrollFunc);
            if (Object.entries(this.channel_info).length === 0) {
                console.log('Fetch channel info');
                this.$http
                    .get(apiRoot + '/channel/' + this.channel.toString())
                    .then(function (response) {
                        if (response.data.status === 0) {
                            this.channel_info = response.data.data;
                        }
                    }.bind(this))
            }
            // this.get_list();
            await this.performSearch(1);

        },
        computed: {
            space: function () {
                return 'https://space.bilibili.com/' + this.channel
            },
            channel_name: function () {
                if (this.channel_info) {
                    document.title = this.channel_info.name + ' - ICU for Viewers'
                    return this.channel_info.name;
                }
                return null
            },
            face: function () {
                if (this.channel_info)
                    if (this.webp_support) {
                        return this.channel_info.face + '@200h_200w.webp'
                    } else {
                        return this.channel_info.face + '@200h_200w'
                    }
                return null
            },
            display_clips: function () {
                return this.clip_list//.filter((clip, index) => index < this.showed)
            }
        }
    }
</script>

<style scoped>
    .comment-container {
        padding: 5px 15px;
        margin: 10px;
        display: block;
    }

    .image_container_channel {
        width: 100px;
        height: 100px;
        background-size: cover;
        border-radius: 50%;
    }

    .mid {
        margin-top: auto;
        margin-bottom: auto;
    }

    a:link {
        text-decoration: none;
        color: #212529;
    }

    a:active {
        text-decoration: blink;
        color: #212529;
    }

    a:visited {
        text-decoration: none;
        color: #212529;
    }

    a:hover {
        text-decoration: none;
        color: #212529;
        /* background: #80808040; */
    }
</style>
