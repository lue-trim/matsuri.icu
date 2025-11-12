<template>
    <div>
        <div class="form-group">
            <ul class="tab-container">
                <li>
                    <router-link :to="{ path:'/' }" tag='button' class="btn form-control">
                        <span>主页</span>
                    </router-link>
                </li>
                <li>
                    <router-link :to="{ path:'/search/' }" tag='button' class="btn form-control"> <!-- style="width:200px"> -->
                        <span>弹幕/语音数据检索</span>
                    </router-link>
                </li>
                <li>
                    <router-link :to="{ path:'/guard/' }" tag='button' class="btn btn-primary form-control"> <!-- style="width:200px"> -->
                        <span>上舰记录查询</span>
                    </router-link>
                </li>
                <li>
                    <router-link :to="{ path:'/about/' }" tag='button' class="btn form-control">
                        <span>关于</span>
                    </router-link>
                </li>
            </ul>
        </div>


        <!-- Title -->
        <h1>上舰记录查询</h1>
        <div class="row">
            <div class="col-4">
                <hr>
            </div>
        </div>


        <!-- Header -->
        <div>
            <div class="container">
                <div class="form-group container options-container">
                    <label for="uid">暂时只支持查询最近5条且可能有缺失, 仅供参考</label>
                    <input class="form-control" type="number" id="uid_input" placeholder="UID" @keyup.enter="performSearch(1)">
                </div>
                <div class="form-group container options-container">
                    <!-- 占位符以保持布局 -->
                    <label></label>
                    <button class="btn btn-primary form-control" type="button" v-on:click="performSearch(1)">查询 (Enter)</button>
                </div>
            </div>
        </div>


        <!-- Result -->
        <div id="results" class="container">
            <h3>查询结果</h3>
            <div id="resultList">
                <p class="no-results">请输入UID并点击查询</p>
            </div>
            <div v-for="clip in data" :key="clip.clip_info.id">
                <ClipList :clip="clip.clip_info" :detail_view="true" :viewer_view="true" :webp_support="webp_support"/>
                <div class="container comment-container">
                    <LiveComment v-for="(comment,index) in clip.full_comments" :key="index" :comment="comment"
                                 :viewer_view="true"/>
                </div>
                <div class="col-12">
                    <hr>
                </div>
                <div class="pb-3"/>
            </div>

            <div class="container" id="paginationControls" align="center" style="display: none;">
                <span class="mid options-container">
                    <button class="btn btn-primary" id="prevPage" @click="changePage(currentPage - 1)">＜</button>
                    <span id="currentPageDisplay">1</span>/<span id="totalPagesDisplay">1</span>页 (共<span id="totalItemsDisplay">0</span>条)
                    <button class="btn btn-primary" id="nextPage" @click="changePage(currentPage + 1)">＞</button>
                </span>
                <span class="mid options-container">
                    <input type="number" class="form-control text" style="max-width: 120px;display: inline" id="pageInput" min="1" placeholder="页码" @keyup.enter="jumpToPage()"/>
                    <button class="btn btn-primary" @click="jumpToPage()">跳转</button>
                </span>
            </div>
        </div>

    </div>
</template>

<script>
    import ClipList from "@/components/ClipList";
    import LiveComment from "@/components/LiveComment";
    // import Pagination from "@/components/Pagination";

    export default {
        name: "GuardSearchPage",
        components: {ClipList, LiveComment},
        inject: ['apiRoot', 'siteName'],
        data() {
            return {
                danmaku: this.$route.params.danmaku,
                data: [],
                showed: 10,
                is_end: false,
                page: 0,
                webp_support: this.$root.webp_support,

                // --- 配置 ---
                PAGE_SIZE: 100, // 每页显示的项目数
                // --- 状态 ---
                currentPage: 1,
                totalItems: 0,
                totalPages: 0,
            }
        },
        mounted() {
            document.title = '上舰记录查询 - ' + this.siteName;
        },
        methods: {
            changePage: function(newPage) {
                if (newPage >= 1 && newPage <= this.totalPages) {
                // if (newPage >= 1) {
                    this.currentPage = newPage;
                    // 重新执行搜索，但使用当前的查询条件和新的页码
                    this.performSearch(this.currentPage);
                }
            },
            jumpToPage: function() {
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
                this.performSearch(this.currentPage);
            },
            updatePaginationControls: function() {
                document.getElementById('currentPageDisplay').textContent = this.currentPage;
                document.getElementById('totalPagesDisplay').textContent = this.totalPages;
                document.getElementById('totalItemsDisplay').textContent = this.totalItems;

                document.getElementById('prevPage').disabled = (this.currentPage <= 1);
                document.getElementById('nextPage').disabled = (this.currentPage >= this.totalPages);

                const paginationControls = document.getElementById('paginationControls');
                if (this.totalItems > 0) {
                    paginationControls.style.display = 'flex';
                } else {
                    paginationControls.style.display = 'none';
                    this.data = [];
                }
            },
            performSearch: async function(page = 0) {
                const uid = document.getElementById('uid_input').value;
                const resultList = document.getElementById('resultList');
                this.data = [];
                resultList.innerHTML = '<p class="no-results">搜索中...</p>'; // 显示加载状态
                document.getElementById('paginationControls').style.display = 'none'; // 隐藏分页控件

                // 基本验证 (关键词或类型至少选一个)
                if (!uid) {
                    resultList.innerHTML = '<p class="no-results">请输入UID。</p>';
                    return;
                }

                // 准备发送到后端的数据
                // const requestData = {
                //     uid: uid,
                //     page: page,       // 传递页码
                //     pageSize: this.PAGE_SIZE // 传递每页大小
                // };

                try {
                    const response = await fetch(
                        `${this.apiRoot}/guard/${uid}?page=${page}`
                    );
                    var data = await response.json();

                    // console.log(data)
                    if (data.success) {
                        // 更新分页状态
                        this.totalItems = data.pagination.totalItems;
                        this.totalPages = data.pagination.totalPages;
                        this.currentPage = data.pagination.currentPage;

                        // 更新相对时间信息
                        // console.log(res)
                        data.data.forEach(clip => {
                            let start_time = clip.clip_info.start_time
                            clip.full_comments.forEach(comment => {
                                comment.relative_time = comment.time - start_time;
                            });
                        });


                        // 更新容器
                        if (data.data && data.data.length > 0) {
                            let resultsHtml = '';
                            this.data = data.data;
                            resultList.innerHTML = resultsHtml;
                        } else {
                            resultList.innerHTML = '<p class="no-results">未找到匹配的数据。</p>';
                            this.totalItems = 0;
                            this.totalPages = 0;
                            this.currentPage = 1;
                        }
                    } else {
                        throw new Error(data.message || "网络错误");
                    }
                } catch (error) {
                    console.error('查询出错:', error);
                    resultList.innerHTML = `<p class="no-results">查询失败: ${error.message}</p>`;
                    this.totalItems = 0;
                    this.totalPages = 0;
                    this.currentPage = 1;
                } finally {
                    // 无论成功与否，都更新分页控件
                    this.updatePaginationControls();
                }
            }
        }
    }

</script>

<style scoped>
    .options-container {
        padding: 5px 15px;
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
