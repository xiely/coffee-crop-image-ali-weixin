"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
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
    const app = getApp();
    const model = common_vendor.reactive({
      imageUrl: "",
      resultUrl: []
    });
    const randomId = common_vendor.ref();
    const orderSubId = common_vendor.ref();
    const getFailed = common_vendor.ref(false);
    const getOrderFailed = common_vendor.ref(false);
    const { resultUrl, imageUrl } = common_vendor.toRefs(model);
    common_vendor.onBeforeMount(async () => {
      common_vendor.index.__f__("log", "at pages/index/login.vue:41", "BBBBBBBBBBBBBBB");
      common_vendor.index.__f__("log", "at pages/index/login.vue:42", app.globalData.token, "##########");
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
      try {
        const res = await api_index.random(data);
        randomId.value = res.data;
        app.globalData.randomId = randomId.value || "aa";
        common_vendor.index.__f__("log", "at pages/index/login.vue:64", res, "RRRRRRRRR");
        common_vendor.index.setStorageSync("random", res.data);
      } catch (err) {
        common_vendor.index.__f__("log", "at pages/index/login.vue:67", err, "eeeeeeeeeeeeeeeeeeeeeeee");
        getFailed.value = true;
        common_vendor.index.showToast({
          title: err,
          icon: "none",
          duration: 2e3
        });
        common_vendor.index.__f__("error", "at pages/index/login.vue:74", "getRandom error", err);
      }
    };
    const getOrderId = async () => {
      getOrderFailed.value = false;
      let data = {
        snToken: app.globalData.token,
        randomId: app.globalData.randomId
      };
      try {
        const res = await api_index.orderId(data);
        orderSubId.value = res.data.orderSubId;
        app.globalData.orderSubId = orderSubId.value || "CC";
        common_vendor.index.__f__("log", "at pages/index/login.vue:89", orderSubId.value, "orderSubId");
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/index/login.vue:91", "getOrderId error", err);
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
              common_vendor.index.__f__("error", "at pages/index/login.vue:119", "图片压缩失败：", err);
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
      common_vendor.index.__f__("log", "at pages/index/login.vue:170", e.tempFilePath, "TTTTTTTTTTT");
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
          common_vendor.index.__f__("log", "at pages/index/login.vue:205", "data", data);
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
              duration: 4e3
            });
            common_vendor.index.__f__("log", "at pages/index/login.vue:219", imgUrl, "imgUrl");
            app.globalData.imgUrl = imgUrl;
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
          common_vendor.index.__f__("error", "at pages/index/login.vue:241", "error", error);
        },
        complete: (aaaa) => {
        }
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_assets._imports_0,
        b: common_vendor.o(onCancel),
        c: common_vendor.o(onConfirm),
        d: common_vendor.p({
          mode: "ratio",
          imageUrl: common_vendor.unref(imageUrl),
          maxWidth: 600,
          maxHeight: 600,
          radius: 300,
          delay: 150
        }),
        e: common_vendor.o(selectFile)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-fa14255b"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/login.js.map
