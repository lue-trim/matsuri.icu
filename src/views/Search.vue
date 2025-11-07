<template>
    <div>
        <div v-if="!recaptcha_succeed">
            <div id="recaptcha"/>
        </div>
        <div v-if="recaptcha_succeed">
            <div class="container">
                <h2>数据库检索</h2>
                <div class="form-group container options-container">
                    <label for="keyword">关键词</label>
                    <input class="form-control" type="text" id="keyword_input" placeholder="请输入搜索关键词..." @keyup.enter="performSearch(1)">
                </div>
                <div class="form-group container options-container">
                    <label for="type">搜索范围</label>
                    <select id="type" class="dropdown form-control">
                        <option value="all">全部</option>
                        <option value="danmaku">弹幕</option>
                        <option value="subtitle">语音识别字幕</option>
                    </select>
                </div>

                <div class="form-group container options-container">
                    <label for="startTime">开始时间</label>
                    <input class="form-control" type="datetime-local" id="startTime">
                    
                    <label for="endTime">结束时间</label>
                    <input class="form-control" type="datetime-local" id="endTime">
                </div>

                <div class="form-group container options-container">
                    <!-- 占位符以保持布局 -->
                    <label></label>
                    <button class="btn btn-primary form-control" type="button" v-on:click="performSearch(1)">搜索</button>
                </div>
            </div>
        </div>

        <div id="results" class="container">
            <h3>搜索结果</h3>
            <div id="resultList">
                <p class="no-results">请输入条件并点击搜索按钮。</p>
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
            <!-- <Pagination :currentPage="currentPage" :totalItems="totalItems" :totalPages="totalPages"/> -->

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
        name: "DanmakuSearchPage",
        components: {ClipList, LiveComment},
        inject: ['apiRoot'],
        data() {
            return {
                danmaku: this.$route.params.danmaku,
                data: [],
                showed: 10,
                is_end: false,
                page: 0,
                recaptcha_succeed: false,
                recaptcha_sitekey: '6Ld-00grAAAAAClw76z0Fuu9IjX8NeKJKvbaF0oM',
                recaptcha_token: "",
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
            document.title = 'ICU for Viewers';
            setTimeout(() => {
                window.grecaptcha.render("recaptcha", {sitekey: this.recaptcha_sitekey, callback: this.challenge_callback})
            }, 200);
            // this.challenge_callback(1);
        },
        methods: {
            challenge_callback(token) {
                this.recaptcha_token = token;
                this.recaptcha_succeed = true;
                // window.addEventListener('scroll', this.scrollFunc);
                // this.load_more();
                // 可选：按回车键触发搜索
                // document.getElementById('keyword_input').addEventListener('keypress', function(event) {
                //     if (event.key === 'Enter') {
                //         performSearch(1); // 回车搜索时重置为第1页
                //     }
                // });
            },
            scrollFunc() {
                if (document.body.clientHeight - window.scrollY - window.innerHeight < (document.body.clientHeight / this.showed)) {
                    if (!this.is_end && !this.$root.loading) {
                        window.removeEventListener('scroll', this.scrollFunc);
                        this.load_more();
                        this.showed += 10;
                        window.addEventListener('scroll', this.scrollFunc);
                    }
                }
            },
            load_more() {
                this.$root.loading = true;
                this.$http
                .get(`//matsuri.luetrim.top/search/${this.danmaku}?page=${++this.page}`, {headers: {token: this.recaptcha_token}})
                .then(function (response) {
                    if (response.data.status === 0) {
                        this.data = this.data.concat(response.data.data);
                        if (response.data.data.length === 0)
                            this.is_end = true;
                        // if (response.data.data.length > 0 && document.title === 'ICU for Viewers') document.title = this.data[0].full_comments[0].username + ' - ICU for Viewers';
                        this.$root.loading = false;
                    }
                }.bind(this))
            },
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
                const keyword = document.getElementById('keyword_input').value.trim();
                const type = document.getElementById('type').value;
                const startTime = document.getElementById('startTime').value;
                const endTime = document.getElementById('endTime').value;

                const resultList = document.getElementById('resultList');
                this.data = [];
                resultList.innerHTML = '<p class="no-results">搜索中...</p>'; // 显示加载状态
                document.getElementById('paginationControls').style.display = 'none'; // 隐藏分页控件

                // 基本验证 (关键词或类型至少选一个)
                if (!keyword || !type) {
                    resultList.innerHTML = '<p class="no-results">请输入搜索关键词或选择类型。</p>';
                    return;
                }

                // 准备发送到后端的数据
                const requestData = {
                    keyword: keyword,
                    type: type,
                    startTime: startTime,
                    endTime: endTime,
                    page: page,       // 传递页码
                    pageSize: this.PAGE_SIZE // 传递每页大小
                };

                try {
                    const response = await fetch(
                        this.apiRoot + '/search_advanced', 
                        { 
                            method: 'POST', 
                            headers: {
                                "token": this.recaptcha_token,
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(requestData)
                        },
                    );
                    if (response.status == 403) {
                        throw new Error("验证码已过期，请刷新页面重试");
                    }
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
                            // data.data.forEach(clip => {
                            //     resultsHtml += `
                            //         <ClipList :clip=${clip.clip_info} :detail_view="true" :viewer_view="true" :webp_support="webp_support"/>
                            //         <div class="container comment-container">
                            //     `
                            //     clip.full_comments.forEach((comment, index) => {
                            //         resultsHtml += `
                            //             <LiveComment :key=${index} :comment=${comment} :viewer_view="true"/>
                            //         `
                            //     })
                            //     resultsHtml += `
                            //         </div>
                            //         <div class="col-12">
                            //             <hr>
                            //         </div>
                            //         <div class="pb-3"/>
                            //     `;
                            // });
                            resultList.innerHTML = resultsHtml;
                        } else {
                            resultList.innerHTML = '<p class="no-results">未找到匹配的数据。</p>';
                            this.totalItems = 0;
                            this.totalPages = 0;
                            this.currentPage = 1;
                        }
                    } else {
                        throw new Error(data.message || "后端返回错误");
                    }
                } catch (error) {
                    console.error('搜索请求出错:', error);
                    resultList.innerHTML = `<p class="no-results">搜索失败: ${error.message}</p>`;
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

    // 辅助函数：格式化日期时间为本地字符串
    // function formatDateTime(dateString) {
    //     const date = new Date(dateString);
    //     return date.toLocaleString('zh-CN');
    // }

    // --- 模拟后端API ---
    // 模拟大量数据
    // function generateMockData(count, keyword, type) {
    //     const data = [];
    //     const types = type ? [type] : ['A', 'B', 'C'];
    //     for (let i = 1; i <= count; i++) {
    //         const randomType = types[Math.floor(Math.random() * types.length)];
    //         data.push({
    //             id: i,
    //             title: `记录 ${i} - ${keyword || '无关键词'} - 类型 ${randomType}`,
    //             content: `这是模拟的搜索结果内容 ${i}。它可能包含关键词 "${keyword}" 以及类型信息。`,
    //             timestamp: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(), // 随机时间
    //             type: randomType
    //         });
    //     }
    //     return data;
    // }

    // // 模拟后端API响应数据 (带分页)
    // function mockApiSearchResponse(requestData) {
    //     // 模拟网络延迟
    //     return new Promise(resolve => {
    //         setTimeout(() => {
    //             const { keyword, startTime, endTime, type, page = 1 } = requestData;
                
    //             // 1. 生成大量模拟数据 (例如100条)
    //             const allMockData = generateMockData(100, keyword, type);

    //             // 2. 模拟根据关键词、时间、类型筛选 (简化模拟)
    //             let filteredData = allMockData;
    //             if (keyword) {
    //                 filteredData = filteredData.filter(item => 
    //                     item.title.includes(keyword) || item.content.includes(keyword)
    //                 );
    //             }
    //             if (type) {
    //                 filteredData = filteredData.filter(item => item.type === type);
    //             }
    //             // 时间筛选模拟 (简化)
    //             if (startTime || endTime) {
    //                 filteredData = filteredData.filter(item => {
    //                     const itemTime = new Date(item.timestamp);
    //                     const start = startTime ? new Date(startTime) : null;
    //                     const end = endTime ? new Date(endTime) : null;
    //                     return (!start || itemTime >= start) && (!end || itemTime <= end);
    //                 });
    //             }

    //             // 3. 模拟分页
    //             const totalFilteredItems = filteredData.length;
    //             const startIdx = (page - 1) * PAGE_SIZE;
    //             const endIdx = startIdx + PAGE_SIZE;
    //             const paginatedData = filteredData.slice(startIdx, endIdx);

    //             const response = {
    //                 success: true,
    //                 data: paginatedData,
    //                 pagination: {
    //                     currentPage: page,
    //                     pageSize: PAGE_SIZE,
    //                     totalItems: totalFilteredItems,
    //                     totalPages: Math.ceil(totalFilteredItems / PAGE_SIZE)
    //                 }
    //             };
    //             console.log("模拟后端响应:", response); // 供调试查看
    //             resolve(response);
    //         }, 600); // 模拟600ms延迟
    //     });
    // }
    // --- /模拟后端API ---

</script>

<style scoped>
    .options-container {
        padding: 5px 15px;
    }
</style>
