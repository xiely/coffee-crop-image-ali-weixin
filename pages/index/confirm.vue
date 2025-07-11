<template>
    <view class="main">
        <image class="bg-img" src="/static/image/bg.png" mode="aspectFill"></image>
        <view class="item-wrap">
            <view v-if="!showQrCode" class="upload-img-wrap">
                <view class="image-content">
                    <view class="img-wrap">
                        <image class="image" :mode="'aspectFit'" :src="imgPath"
                        ></image>
                    </view>
                </view>
                <button class="sure-make" type="primary" @click="submit">确定制作</button>
            </view>
            <view v-else class="qrcode-wrap">
                <view class="qrcode-content">
                    <view class="code-title">核销码</view>
                    <view class="qrcode-num">{{ qrValue }}</view>
                    <view class="qrcode-box">
                      <view class="qrcode-border">
                        <uv-qrcode ref="qrcode" canvas-id="qrcode" :value="qrValue" size="400rpx" :options="options"></uv-qrcode>
                      </view>
                    </view>
            
                    <view class="qrcode-tip">将核销码扣至扫码区，开始制作</view>
                </view>
            </view>
        </view>
    </view>
</template>
<script setup>
import uvQrcode from '@/uni_modules/uv-qrcode/components/uv-qrcode/uv-qrcode.vue';
import { flowerSet } from '../../api'
import { ref } from "vue";
import { onMounted } from 'vue';

const imgPath = ref("");
const qrValue = ref("");
const showQrCode = ref(false);
const options = ref({
    errorCorrectLevel: 'Q',
    margin: 10,
    areaColor: "#fff",
    // foregroundImageSrc: require('static/image/logo.png')
})

onMounted(() => {
    imgPath.value = getApp().globalData.imgUrl
})

const submit = () => {
    let data = {
        snToken: getApp().globalData.token,
        randomId: getApp().globalData.randomId,
        orderSubId: getApp().globalData.orderSubId,
        flower: imgPath.value
    }
    flowerSet(data).then(res => {
        console.log(data, "data")
        console.log(res, "RRRRRRRRR")
        if (res.code == "SUCCESS") {
            showQrCode.value = true;
            qrValue.value = res.data
        }
    })
}
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

    .item-wrap {
        margin: 0 auto;
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        min-height: 50vh;
        position: relative;
        background-size: cover;

        .upload-img-wrap {
            .image-content {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                min-height: 600rpx; // 可根据实际图片高度调整
                width: 600rpx;
                margin: 0 auto;

                .img-wrap {
                    width: 100%;
                    text-align: center;
                    margin-bottom: 14px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;

                    .image {
                        width: 600rpx;
                        height: 600rpx;
                        border-radius: 50%;
                        background-color: #fff;
                        display: block;
                    }
                }
            }

            .sure-make {
                position: absolute;
                left: 0;
                right: 0;
                background: linear-gradient(90deg, #FF6B6B 0%, #e9c8a4 100%);
                color: #fff;
                padding: 10rpx;
                border-radius: 80rpx;
                margin: 0rpx 20rpx;
                font-size: 32rpx;
                box-shadow: 0 4rpx 16rpx rgba(255, 107, 107, 0.15);
                border: none;
                display: flex;
                align-items: center;
                justify-content: center;
                height: 88rpx;
            }

        }

        .qrcode-wrap {
            width: 100%;
            text-align: center;
            margin: 0 auto;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 400rpx; // 可根据实际二维码高度调整

            .qrcode-content {
                display: flex;
                flex-direction: column;
                align-items: center;
                margin-top: 60rpx;
                width: 100%;

                .code-title {
                    color: #fff;
                }

                .qrcode-num {
                    font-size: 80rpx;
                    background: linear-gradient(90deg, #FF6B6B 0%, #FFB86C 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    text-fill-color: transparent;
                    font-weight: bold;
                    letter-spacing: 2rpx;
                }

                .qrcode-box {
                    background: #fff;
                    border-radius: 32rpx;
                    box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.08);
                    padding: 20rpx;
                    // margin: 32rpx 0 24rpx 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .qrcode-border {
                    padding: 16rpx;
                    border-radius: 24rpx;
                    background: linear-gradient(135deg, #ff6b6b 0%, #ffb86c 50%, #ffe0b2 100%);
                    box-shadow: 0 2rpx 4rpx rgba(255, 107, 107, 0.08);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .qrcode-tip {
                    width: 400rpx;
                    text-align: center;
                    margin-top: 16rpx;
                    font-size: 28rpx;
                    color: #fff;
                }
            }


        }


    }
}
</style>