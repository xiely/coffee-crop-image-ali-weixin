<script>
export default {
    onLaunch: function (options) {
        console.log("App Launch", options);
        this.globalData.token = decodeURIComponent(options.query.scene);
        // console.log(decodeURIComponent(options.query.scene), "decodeURIComponent(options.scene)")
    },
    onShow: function () {
        console.log("App Show");
    },
    onHide: function () {
        console.log("App Hide");
    },
};
</script>

<style>
page {
    background: #f5f5f5;
}

/*每个页面公共css */
</style>
