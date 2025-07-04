<script>
export default {
    onLaunch: function (options) {
        console.log("App Launch", options);
        this.setTokenFromOptions(options);
    },
    onShow: function (options) {
        console.log("App Show", options);
        this.setTokenFromOptions(options);
    },
    onHide: function () {
        console.log("App Hide");
    },
    globalData: {
        token: '',
    },
    methods: {
        setTokenFromOptions(options) {
            // 兼容不同平台的参数结构
            let scene = '';
            if (options && options.query && options.query.scene) {
                scene = options.query.scene;
            } else if (options && options.scene) {
                scene = options.scene;
            }
            if (scene) {
                this.globalData.token = decodeURIComponent(scene);
                console.log('Token set:', this.globalData.token);
            }
        }
    }
};
</script>

<style>
page {
    background: #f5f5f5;
}

/*每个页面公共css */
</style>
