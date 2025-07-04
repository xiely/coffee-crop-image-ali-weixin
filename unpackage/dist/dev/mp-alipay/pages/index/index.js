"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_t_cropper2 = common_vendor.resolveComponent("t-cropper");
  _easycom_t_cropper2();
}
const _easycom_t_cropper = () => "../../uni_modules/t-cropper/components/t-cropper/t-cropper.js";
if (!Math) {
  _easycom_t_cropper();
}
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const model = common_vendor.reactive({
      imageUrl: "",
      resultUrl: []
    });
    const { resultUrl, imageUrl } = common_vendor.toRefs(model);
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
              common_vendor.index.__f__("error", "at pages/index/index.vue:53", "图片压缩失败：", err);
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
    const onConfirm = (res) => {
      const params = {
        id: (/* @__PURE__ */ new Date()).getTime(),
        url: res.tempFilePath
      };
      common_vendor.index.__f__("log", "at pages/index/index.vue:104", res.tempFilePath, "TTTTTTTTTTT");
      model.resultUrl.push(params);
      model.imageUrl = "";
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
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1cf27b2a"]]);
my.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-alipay/pages/index/index.js.map
