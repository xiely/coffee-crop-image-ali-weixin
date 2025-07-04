<template>
  <view>
    <t-cropper
      mode="ratio"
      :imageUrl="imageUrl"
      :width="500"
      :height="500"
      :radius="0"
      :delay="150"
      @cancel="onCancel"
      @confirm="onConfirm"
    ></t-cropper>
    <!-- <view class="preview">
      <image
        v-for="(item, index) in resultUrl"
        :key="item.id"
        class="images"
        @click="prviewImgae(index, item.url)"
        :src="item.url"
      />
    </view> -->
    <button class="button" type="primary" @click="selectFile">选择图片</button>
  </view>
</template>

<script setup>
import { reactive, toRefs } from "vue";
const model = reactive({
    imageUrl: "",
    resultUrl: [],
});

const { resultUrl, imageUrl } = toRefs(model);

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
const onConfirm = (res) => {
    // 设置url的值，显示控件
    const params = {
        id: new Date().getTime(),
        url: res.tempFilePath,
    };
    console.log(res.tempFilePath, "TTTTTTTTTTT")
    model.resultUrl.push(params);
    model.imageUrl = "";
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
.preview {
    padding: 32rpx;

    .images {
        margin: 10rpx;
        width: 200rpx;
        height: 200rpx;
    }
}

.button {
    margin: 0 20rpx;
}
</style>
