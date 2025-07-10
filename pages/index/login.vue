
<template>
  <view class="main">
    <image class="bg-img" src="/static/image/bg.png" mode="aspectFill"></image>
    <t-cropper
      mode="ratio"
      :imageUrl="imageUrl"
      :maxWidth="600"
      :maxHeight="600"
      :radius="300"
      :delay="150"
      @cancel="onCancel"
      @confirm="onConfirm"
    ></t-cropper>
   <view class="content-wrap">
        <view class="logo-title">咖啡灵感工坊</view>
        <view class="logo-description">用创意点亮你的专属咖啡时光</view>
        <button class="button" type="primary" @click="selectFile">上传印花图</button>
   </view>

     <!-- <button class="button" type="primary" @click="goto">测试</button> -->
  </view>
</template>

<script setup>
import { checkCode, random, orderId } from '../../api'
import { onBeforeMount, reactive, toRefs, ref } from "vue";
const model = reactive({
    imageUrl: "",
    resultUrl: [],
});
const token = ref();
const code = ref("");
const randomId = ref();
const orderSubId = ref();
const getFailed = ref(false);
const getOrderFailed = ref(false)

const { resultUrl, imageUrl } = toRefs(model);


onBeforeMount(async () => {
    console.log("BBBBBBBBBBBBBBB")
    console.log(getApp().globalData.token, "##########")
    uni.showLoading({ title: '获取数据中...', mask: true });
    await getRandom();
    await getOrderId();
    uni.hideLoading();
})
const goto = () => {
    uni.navigateTo({
        url: "/pages/index/create-pic"
    })
}
const getRandom = async () => {
    getFailed.value = false;
    let data = {
        accessId: "OPEN"
    }
    try {
        const res = await random(data);
        randomId.value = res.data;
        getApp().globalData.randomId = randomId.value || "aa";
        console.log(res, "RRRRRRRRR")
        uni.setStorageSync("random", res.data)
    } catch (err) {
        console.log(err, "eeeeeeeeeeeeeeeeeeeeeeee")
        getFailed.value = true;
        uni.showToast({
            title: err,
            icon: 'none',
            duration: 2000
        });
        console.error('getRandom error', err);
    }
}
const getOrderId = async () => {
    getOrderFailed.value = false;
    let data = {
        snToken: getApp().globalData.token,
        randomId: getApp().globalData.randomId
    }
    try {
        const res = await orderId(data);
        orderSubId.value = res.data.orderSubId;

        getApp().globalData.orderSubId = orderSubId.value || "CC";
        console.log(orderSubId.value, "orderSubId")
    } catch (err) {
        console.error('getOrderId error', err);
        getOrderFailed.value = true;
        uni.showToast({
            title: err,
            icon: 'none',
            duration: 2000
        });
    }
}

// 使用uni.compressImage压缩图片
const compressImage = () => {
    uni.chooseImage({
        count: 1,
        sizeType: ["compressed"],
        success: (res) => {
            uni.showLoading({
                title: "处理中...",
                mask: true,
            });
            // 使用uni.compressImage压缩图片
            uni.compressImage({
                src: res.tempFilePaths[0],
                quality: 50, // 压缩质量
                success: (compressRes) => {
                    model.imageUrl = compressRes.tempFilePath;
                },
                fail: (err) => {
                    console.error("图片压缩失败：", err);
                },
                complete: () => {
                    uni.hideLoading(); // 关闭loading
                },
            });
        },
    });
};

// 使用默认压缩方式
const defaultCompressImage = () => {
    uni.chooseImage({
        count: 1,
        sizeType: ["compressed"],
        success: (res) => {
            model.imageUrl = res.tempFilePaths[0];
        },
    });
};

/**
 *** 特别声明：在使用 uni.chooseImage 选择的大图片文件无法直接在 Image 组件中显示，通常涉及到以下可能的问题和限制。
 *** 图片大小和尺寸限制：移动设备和浏览器对于能够加载和处理的图片大小有限制，如果选择的图片文件尺寸过大，可能无法正常加载和显示。
 *** 性能问题：大图片文件可能会导致页面加载缓慢或者卡顿，尤其是在移动设备上。
 *** 内存问题：加载大图片可能会消耗大量的内存资源，特别是在移动设备上，可能导致内存不足或者页面崩溃的问题。
 *** 解决参考方案如下：
 *** 防止选择大文件图片后无法在Image中直接临时路径显示图片，导致无法在裁剪插件中显示，
 *** 根据项目需要对大尺寸图片进行压缩、对图片质量要求高的，需要提前上传至oss进行采用网络图片进行裁剪。
 */
const selectFile = () => {
    // 推荐使用其他压缩方式，这里只是简单对大图片压缩-仅供思路参考，切勿使用该方式
    // 示例一：uni.compressImage压缩图片
    compressImage();

    // 示例二：使用自带压缩图
    // defaultCompressImage();
};

// 关闭裁剪
const onCancel = () => {
    model.imageUrl = "";
};

// 裁剪确认
const onConfirm = (e) => {
    // 设置url的值，显示控件
    const params = {
        id: new Date().getTime(),
        url: e.tempFilePath,
    };
    console.log(e.tempFilePath, "TTTTTTTTTTT")
    if (!e.tempFilePath) {
        uni.showToast({
            title: "未获取到图片路径",
            icon: "none",
            duration: 2000
        });
        return;
    }
    uni.uploadFile({
        // #ifdef H5
        url: "/gw/v1/uploadPattern",
        // #endif
        // #ifndef H5
        url: "https://coffee.htcbot.com/gw/v1/uploadPattern",
        // #endif
        filePath: e.tempFilePath,
        name: 'file',
        // header: {
        //     // 这里可以添加自定义header，比如token
        //     'Authorization': getToken(),
        // },
        fileType: "image",
        success: (uploadFileRes) => {
            let data;
            try {
                data = JSON.parse(uploadFileRes.data);
            } catch (err) {
                uni.showToast({
                    title: "返回数据格式错误",
                    icon: "none",
                    duration: 4000
                });
                return;
            }
            console.log("data", data)
            if (data.success) {
                let imgUrl = "";
                if (!/^https?:\/\//.test(data.data)) {
                    imgUrl = "https://coffee.htcbot.com/" + data.data;
                }
                else {
                    imgUrl = data.data;
                }
                uni.showToast({
                    title: "上传成功",
                    icon: "none",
                    duration: 8000
                });
                console.log(imgUrl, "imgUrl")
                getApp().globalData.imgUrl = imgUrl
                uni.redirectTo({
                    url: '/pages/index/confirm?img=' + encodeURIComponent(imgUrl)
                });
            } else {
                const message = data.message || "上传失败";
                uni.showToast({
                    title: message,
                    icon: "none",
                    duration: 4000
                });
            }

        },
        fail: (error) => {
            uni.showToast({
                title: "上传失败",
                icon: "none",
                duration: 4000
            });
            uni.hideLoading();
            console.error('error', error);
        },
        complete: (aaaa) => {
            // uni.showToast({
            //     title: "complete",
            //     icon: "none",
            //     duration: 4000
            // });
        }
    });
};

// 预览图片
const prviewImgae = (index, url) => {
    uni.previewImage({
        current: index, // 当前资源下标
        urls: [url],
    });
};

</script>

<style lang="scss" scoped>
.main {
    position: relative;
    min-height: 100vh;
    width: 100vw;
    overflow: hidden;

    .bg-img {
        position: absolute;
        left: 0;
        top: 0;
        width: 100vw;
        height: 100vh;
        z-index: 0;
    }

    .content-wrap {
        position: absolute;
        left: 0;
        right: 0;
        margin: 0 auto;
        bottom: 60vh;
        text-align: center;

        .logo-title {
            color: #fff;

            font-size: 35px;
            margin-bottom: 10px;
        }

        .logo-description {
            margin-top: 10px;
            color: #fff;
        }

        .button {
            position: absolute;
            left: 0;
            right: 0;
            background: linear-gradient(90deg, #FF6B6B 0%, #e9c8a4 100%);
            color: #fff;
            padding: 10rpx;
            border-radius: 80rpx;
            margin: 80rpx 20rpx;
            font-size: 32rpx;
            font-weight: bold;
            box-shadow: 0 4rpx 16rpx rgba(255, 107, 107, 0.15);
            border: none;
        }
    }


}



// .t-cropper,
// .button {
//     position: relative;
//     z-index: 1;
// }</style>
