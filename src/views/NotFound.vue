<template>
    <div class="pt-3">
        <h1>404 Not Found</h1>
        <div class="row">
            <div class="col-4">
                <hr>
            </div>
        </div>
        <div class="container">
            <p>喵喵喵？</p>
            <p>请检查输入的地址是否正确</p>
        </div>
    </div>
</template>

<script>
    export default {
        name: "NotFound",
        mounted(){
            document.title = '404 Not Found'
        }
    }
</script>

<style scoped>

</style>
