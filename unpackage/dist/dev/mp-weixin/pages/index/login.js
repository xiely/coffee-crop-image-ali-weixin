"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
if (!Array) {
  const _easycom_t_cropper2 = common_vendor.resolveComponent("t-cropper");
  _easycom_t_cropper2();
}
const _easycom_t_cropper = () => "../../uni_modules/t-cropper/components/t-cropper/t-cropper.js";
if (!Math) {
  _easycom_t_cropper();
}
const _sfc_main = {
  __name: "login",
  setup(__props) {
    const model = common_vendor.reactive({
      imageUrl: "",
      resultUrl: []
    });
    common_vendor.ref();
    common_vendor.ref("");
    const randomId = common_vendor.ref();
    const orderSubId = common_vendor.ref();
    const getFailed = common_vendor.ref(false);
    const getOrderFailed = common_vendor.ref(false);
    const { resultUrl, imageUrl } = common_vendor.toRefs(model);
    common_vendor.onBeforeMount(async () => {
      common_vendor.index.__f__("log", "at pages/index/login.vue:45", "BBBBBBBBBBBBBBB");
      common_vendor.index.__f__("log", "at pages/index/login.vue:46", getApp().globalData.token, "##########");
      common_vendor.index.showLoading({ title: "获取数据中...", mask: true });
      await getRandom();
      await getOrderId();
      common_vendor.index.hideLoading();
    });
    const getRandom = async () => {
      getFailed.value = false;
      let data = {
        accessId: "OPEN"
      };
      const res = await api_index.random(data);
      randomId.value = res.data;
      getApp().globalData.randomId = randomId.value || "aa";
      common_vendor.index.__f__("log", "at pages/index/login.vue:62", res, "RRRRRRRRR");
    };
    const getOrderId = async () => {
      getOrderFailed.value = false;
      let data = {
        snToken: getApp().globalData.token,
        randomId: getApp().globalData.randomId
      };
      try {
        const res = await api_index.orderId(data);
        orderSubId.value = res.data.orderSubId;
        getApp().globalData.orderSubId = orderSubId.value || "CC";
        common_vendor.index.__f__("log", "at pages/index/login.vue:86", orderSubId.value, "orderSubId");
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/index/login.vue:88", "getOrderId error", err);
        getOrderFailed.value = true;
        common_vendor.index.showToast({
          title: err,
          icon: "none",
          duration: 2e3
        });
      }
    };
    const compressImage = () => {
      common_vendor.index.chooseImage({
        count: 1,
        sizeType: ["compressed"],
        success: (res) => {
          common_vendor.index.showLoading({
            title: "处理中...",
            mask: true
          });
          common_vendor.index.compressImage({
            src: res.tempFilePaths[0],
            quality: 50,
            // 压缩质量
            success: (compressRes) => {
              model.imageUrl = compressRes.tempFilePath;
            },
            fail: (err) => {
              common_vendor.index.__f__("error", "at pages/index/login.vue:116", "图片压缩失败：", err);
            },
            complete: () => {
              common_vendor.index.hideLoading();
            }
          });
        }
      });
    };
    const selectFile = () => {
      compressImage();
    };
    const onCancel = () => {
      model.imageUrl = "";
    };
    const onConfirm = (e) => {
      ({
        id: (/* @__PURE__ */ new Date()).getTime(),
        url: e.tempFilePath
      });
      common_vendor.index.__f__("log", "at pages/index/login.vue:167", e.tempFilePath, "TTTTTTTTTTT");
      if (!e.tempFilePath) {
        common_vendor.index.showToast({
          title: "未获取到图片路径",
          icon: "none",
          duration: 2e3
        });
        return;
      }
      common_vendor.index.uploadFile({
        url: "https://coffee.htcbot.com/gw/v1/uploadPattern",
        filePath: e.tempFilePath,
        name: "file",
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
            common_vendor.index.showToast({
              title: "返回数据格式错误",
              icon: "none",
              duration: 4e3
            });
            return;
          }
          if (data.success) {
            let imgUrl = "";
            if (!/^https?:\/\//.test(data.data)) {
              imgUrl = "https://coffee.htcbot.com/" + data.data;
            } else {
              imgUrl = data.data;
            }
            common_vendor.index.showToast({
              title: "上传成功",
              icon: "none",
              duration: 8e3
            });
            common_vendor.index.__f__("log", "at pages/index/login.vue:215", imgUrl, "imgUrl");
            getApp().globalData.imgUrl = imgUrl;
            common_vendor.index.redirectTo({
              url: "/pages/index/confirm?img=" + encodeURIComponent(imgUrl)
            });
          } else {
            const message = data.message || "上传失败";
            common_vendor.index.showToast({
              title: message,
              icon: "none",
              duration: 4e3
            });
          }
        },
        fail: (error) => {
          common_vendor.index.showToast({
            title: "上传失败",
            icon: "none",
            duration: 4e3
          });
          common_vendor.index.hideLoading();
          common_vendor.index.__f__("error", "at pages/index/login.vue:237", "error", error);
        },
        complete: (aaaa) => {
        }
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(onCancel),
        b: common_vendor.o(onConfirm),
        c: common_vendor.p({
          mode: "ratio",
          imageUrl: common_vendor.unref(imageUrl),
          width: 500,
          height: 500,
          radius: 0,
          delay: 150
        }),
        d: common_vendor.o(selectFile)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-fa14255b"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/login.js.map
