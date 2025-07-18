# t-cropper

> **t-cropper  一款高性能移动端图片裁剪工具**

## 平台兼容

| App   |   H5   |   微信小程序 |   支付宝小程序 |
| :---: | :---:  | :----------: | :-----------: |
|  √    |     √  |      √       |      √        |

### 属性说明

|属性         |类型     |默认     |备注      |
| :--------: | :-----: | :----:  | :----:  |
| mode       |String   | "ratio"  | 裁剪模式|
| imageUrl   |String   |   " "    | 需要裁剪的图片路径|
| width      |Number   | 200     | 图片裁剪后的宽度，固定大小时有效|
| height     |Number   | 200     | 图片裁剪后的高度，固定大小时有效|
| maxWidth   |Number   | 1024    | 图片裁剪后的最大宽度 |
| maxHeight  |Number   | 1024    | 图片裁剪后的最大高度 |
| scaleRatio |Number   | 0.7    | 裁剪比列缩放,建议不超过0.95 |
| minRatio  |Number   | 1    | 最小缩放 |
| maxRatio  |Number   | 3    | 最大缩放 |
| radius  |Number   | 0    | 裁剪图片圆角半径，单位px |
| delay   |Number   | 250    | 确定按钮快速重复点击时间 |
| isRotateBtn  |Boolean   | true    | 是否显示旋转按钮 |

### mode有效值

| 模式     |值       |说明   |
| :-----: | :-----: | :----: |
| 固定模式 |fixed    | 裁剪出指定大小的图片，一般用于头像上传    |
| 等比缩放 |ratio    | 限定宽高比，裁剪大小不固定  |
| 自由模式 |free     | 不限定宽高比，裁剪大小不固定  |

### 事件说明

|事件名称     |说明     |返回     |
| :--------: | :-----: | :----:  |
| confirm        |点击确定按钮    |   object    |
| cancel      |点击取消按钮  | -  |

### 示例

```html

<template>
  <view>
    <t-cropper
      mode="ratio"
      :imageUrl="imageUrl"
      :width="500"
      :height="500"
      :radius="100"
      :delay="150"
      @cancel="onCancel"
      @confirm="onConfirm"
    ></t-cropper>
    <view class="preview">
      <image
        v-for="(item, index) in resultUrl"
        :key="item.id"
        class="images"
        @click="prviewImgae(index, item.url)"
        :src="item.url"
      />
    </view>
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
    sizeType: "original",
    success: (res) => {
      console.log("original", res);
      //  示例：防止大图片文件的Image无法直接临时路径显示图片
      uni.showLoading({
        title: "处理中...",
        mask: true,
      });
      // 使用uni.compressImage压缩图片
      uni.compressImage({
        src: res.tempFilePaths[0],
        quality: 80, // 压缩质量
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
    sizeType: "compressed",
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
  // 推荐使用其他压缩方式，这里只是简单大图片压缩示例-经供思路参考切勿使用
  // 示例一：uni.compressImage压缩图片
  // compressImage();

  // 示例二：使用自带压缩图
  defaultCompressImage();
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



```

### 注意

1.uni-app版本不断更新，插件有时无法适应新版本，感谢大家及时提交bug，但希望大家手下留情，不要轻易给差评！
