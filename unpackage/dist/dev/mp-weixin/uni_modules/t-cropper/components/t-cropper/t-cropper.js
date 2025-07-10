"use strict";
const common_vendor = require("../../../../common/vendor.js");
const common_assets = require("../../../../common/assets.js");
const _sfc_main = {
  __name: "t-cropper",
  props: {
    mode: {
      type: String,
      default: "ratio"
    },
    imageUrl: {
      type: String,
      default: ""
    },
    width: {
      type: Number,
      default: 200
    },
    height: {
      type: Number,
      default: 200
    },
    maxWidth: {
      type: Number,
      default: 1024
    },
    maxHeight: {
      type: Number,
      default: 1024
    },
    scaleRatio: {
      type: Number,
      default: 0.7
    },
    minRatio: {
      type: Number,
      default: 1
    },
    maxRatio: {
      type: Number,
      default: 3
    },
    isRotateBtn: {
      type: Boolean,
      default: true
    },
    radius: {
      type: Number,
      default: 0
    },
    delay: {
      type: Number,
      default: 250
    }
  },
  emits: ["confirm", "cancel"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const instance = common_vendor.getCurrentInstance();
    const inInit = common_vendor.ref(false);
    const $emit = __emit;
    common_vendor.ref(Math.random().toString(36).slice(-6));
    const origin = common_vendor.reactive({
      imageUrl: "",
      //设置图片url
      real: {
        //原始图片宽高
        width: 100,
        height: 100
      },
      body: {
        //页面宽高
        width: 100,
        height: 100
      },
      frame: {
        //矩形框
        left: 50,
        top: 50,
        width: 200,
        height: 300
      },
      bgImage: {
        //背景框
        left: 20,
        top: 20,
        width: 300,
        height: 400
      },
      rotate: 0,
      transit: false,
      canvasWidth: 100,
      canvasHeight: 100,
      frameSize: 150
      //裁剪框最小尺寸
    });
    const { transit, rotate, imageUrl, canvasWidth, canvasHeight } = common_vendor.toRefs(origin);
    common_vendor.watchEffect(() => {
      if (props.imageUrl) {
        common_vendor.index.showLoading({
          title: "请稍候...",
          mask: true
        });
        origin.imageUrl = props.imageUrl;
      }
    });
    const imageLoad = (e) => {
      const { width, height } = e.detail;
      origin.real.width = width;
      origin.real.height = height;
      var query = common_vendor.index.createSelectorQuery().in(instance);
      query.select(".preview-body").boundingClientRect((data) => {
        origin.body.width = data.width;
        origin.body.height = data.height;
        inInit.value = true;
        imageReset();
      }).exec();
    };
    const imageReset = () => {
      origin.rotate = 0;
      let frameRate = props.width / props.height;
      let frameHeight = origin.body.height * props.scaleRatio;
      let frameWidth = origin.body.width * props.scaleRatio;
      if (frameWidth / frameHeight > frameRate) {
        frameWidth = frameHeight * frameRate;
      } else {
        frameHeight = frameWidth / frameRate;
      }
      let frameleft = (origin.body.width - frameWidth) / 2;
      let frameTop = (origin.body.height - frameHeight) / 2;
      origin.frame = {
        left: frameleft,
        top: frameTop,
        width: frameWidth,
        height: frameHeight
      };
      let bgRate = origin.real.width / origin.real.height;
      let bgWidth = frameWidth;
      let bgHeight = frameHeight;
      if (bgWidth / bgHeight > bgRate) {
        bgHeight = bgWidth / bgRate;
      } else {
        bgWidth = bgHeight * bgRate;
      }
      let bgLeft = (frameWidth - bgWidth) / 2 + origin.frame.left;
      let bgTop = (frameHeight - bgHeight) / 2 + origin.frame.top;
      origin.bgImage = {
        left: bgLeft,
        top: bgTop,
        width: bgWidth,
        height: bgHeight
      };
      common_vendor.index.hideLoading();
    };
    const comImageStyle = common_vendor.computed(() => (source) => {
      const { left, top, width, height } = origin.bgImage;
      if (source == "image-wrap") {
        return `
      top: ${top}px;
      left: ${left}px;
      width: ${width}px;
      height: ${height}px;
    `;
      } else if (source == "image") {
        let left2 = 0;
        let top2 = 0;
        let width2 = origin.bgImage.width;
        let height2 = origin.bgImage.height;
        if (origin.rotate % 180 != 0) {
          width2 = origin.bgImage.height;
          height2 = origin.bgImage.width;
          top2 = width2 / 2 - height2 / 2;
          left2 = height2 / 2 - width2 / 2;
        }
        const style = {};
        style.left = left2 + "px";
        style.top = top2 + "px";
        style.width = width2 + "px";
        style.height = height2 + "px";
        style.transform = `rotate(${origin.rotate}deg)`;
        return style;
      } else if (source == "image-rect") {
        return `
      top: ${top - origin.frame.top}px;
      left: ${left - origin.frame.left}px;
      width: ${width}px;
      height: ${height}px;
    `;
      } else if (source == "frame-box") {
        return `
      left: ${origin.frame.left}px;
      top: ${origin.frame.top}px;
      width: ${origin.frame.width}px;
      height: ${origin.frame.height}px;
    `;
      }
    });
    const cirStyle = common_vendor.computed(() => {
      const { width } = origin.frame;
      let scale = props.width / width;
      let radius = props.radius / scale;
      return `
  border-radius: ${radius}px
  `;
    });
    const onCancle = () => {
      $emit("cancel");
    };
    const onAngle = () => {
      origin.rotate -= 90;
      let width = origin.bgImage.height;
      let height = origin.bgImage.width;
      let left = origin.bgImage.left;
      let top = origin.bgImage.top;
      let fWidth = origin.frame.width;
      let fLeft = origin.frame.left;
      let fTop = origin.frame.top;
      left = fLeft + (top - fTop);
      top = fTop - (height - fWidth - (fLeft - origin.bgImage.left));
      origin.bgImage = {
        left,
        top,
        width,
        height
      };
      origin.transit = true;
      setTimeout(() => {
        origin.transit = false;
      }, 300);
    };
    const debounce = (fn, wait = 1e3) => {
      let time = null;
      return function(...args) {
        if (time)
          clearTimeout(time);
        time = setTimeout(() => {
          fn.apply(this, args);
        }, wait);
      };
    };
    const onConfirm = debounce(async () => {
      confirmWx();
    }, props.delay);
    const confirmWx = () => {
      common_vendor.index.showLoading({
        title: "处理中"
      });
      let mx = computeMatrix();
      common_vendor.index.createSelectorQuery().in(instance).select("#canvas-cropper").fields({
        node: true,
        size: true
      }).exec(async (res) => {
        const textCanvas = res[0].node;
        const ctx = textCanvas.getContext("2d");
        textCanvas.width = mx.tw;
        textCanvas.height = mx.th;
        await drawClipImage(ctx, mx);
        await ctx.rotate(origin.rotate * Math.PI / 180);
        await createImage(origin.imageUrl, mx, ctx, textCanvas);
        common_vendor.wx$1.canvasToTempFilePath({
          canvas: textCanvas,
          canvasId: "canvasID",
          success: (res2) => {
            $emit("confirm", res2);
          },
          fail: (err) => {
            common_vendor.index.__f__("log", "at uni_modules/t-cropper/components/t-cropper/t-cropper.vue:505", err);
          }
        });
        common_vendor.index.hideLoading();
      });
    };
    const drawClipImage = (ctx, mx) => {
      let { radius } = props;
      if (radius > 0) {
        const w = Math.round(mx.tw);
        const h = Math.round(mx.th);
        if (props.width === props.height && w == h && props.width < w) {
          radius = w / props.width * radius;
        }
        if (props.width != props.height && w != h && props.width < w) {
          common_vendor.index.__f__("log", "at uni_modules/t-cropper/components/t-cropper/t-cropper.vue:537", "11111111");
          if (w > h) {
            radius = w / h * radius;
          } else {
            radius = h / w * radius;
          }
        }
        if (w === h && radius >= w / 2) {
          ctx.arc(w / 2, h / 2, w / 2, 0, 2 * Math.PI);
        } else {
          if (w !== h) {
            radius = Math.min(w / 2, h / 2, radius);
          }
          ctx.moveTo(radius, 0);
          ctx.arcTo(w, 0, w, h, radius);
          ctx.arcTo(w, h, 0, h, radius);
          ctx.arcTo(0, h, 0, 0, radius);
          ctx.arcTo(0, 0, w, 0, radius);
          ctx.closePath();
        }
        ctx.clip();
        ctx.restore();
      }
    };
    const createImage = (img, mx, ctx, textCanvas) => {
      return new Promise((resolve) => {
        const headerImg = textCanvas.createImage();
        headerImg.src = img;
        headerImg.onload = () => {
          let result = ctx.drawImage(
            headerImg,
            mx.sx,
            mx.sy,
            mx.sw,
            mx.sh,
            mx.dx,
            mx.dy,
            mx.dw,
            mx.dh
          );
          resolve(result);
        };
      });
    };
    const computeMatrix = () => {
      let width = props.width;
      let height = props.height;
      let mul = origin.bgImage.width / origin.real.width;
      if (origin.rotate % 180 != 0) {
        mul = origin.bgImage.height / origin.real.width;
      }
      if (props.mode != "fixed") {
        width = origin.frame.width / mul;
        height = origin.frame.height / mul;
      }
      var rate = width / height;
      if (width > props.maxWidth) {
        width = props.maxWidth;
        height = width / rate;
      }
      if (height > props.maxHeight) {
        height = props.maxHeight;
        width = height * rate;
      }
      var sx = (origin.frame.left - origin.bgImage.left) / mul;
      var sy = (origin.frame.top - origin.bgImage.top) / mul;
      var sw = origin.frame.width / mul;
      var sh = origin.frame.height / mul;
      var ox = sx + sw / 2;
      var oy = sy + sh / 2;
      if (origin.rotate % 180 != 0) {
        var temp = sw;
        sw = sh;
        sh = temp;
      }
      var angle = origin.rotate % 360;
      if (angle < 0) {
        angle += 360;
      }
      if (angle == 270) {
        var x = origin.real.width - oy;
        var y = ox;
        ox = x;
        oy = y;
      }
      if (angle == 180) {
        var x = origin.real.width - ox;
        var y = origin.real.height - oy;
        ox = x;
        oy = y;
      }
      if (angle == 90) {
        var x = oy;
        var y = origin.real.height - ox;
        ox = x;
        oy = y;
      }
      sx = ox - sw / 2;
      sy = oy - sh / 2;
      let dr = { x: 0, y: 0, w: width, h: height };
      dr = parseRect(dr, -origin.rotate);
      return {
        tw: width,
        th: height,
        sx,
        sy,
        sw,
        sh,
        dx: dr.x,
        dy: dr.y,
        dw: dr.w,
        dh: dr.h
      };
    };
    const parseRect = (rect, angle) => {
      let x1 = rect.x;
      let y1 = rect.y;
      let x2 = rect.x + rect.w;
      let y2 = rect.y + rect.h;
      let p1 = parsePoint({ x: x1, y: y1 }, angle);
      let p2 = parsePoint({ x: x2, y: y2 }, angle);
      let result = {};
      result.x = Math.min(p1.x, p2.x);
      result.y = Math.min(p1.y, p2.y);
      result.w = Math.abs(p2.x - p1.x);
      result.h = Math.abs(p2.y - p1.y);
      return result;
    };
    const parsePoint = (point, angle) => {
      var result = {};
      result.x = point.x * Math.cos(angle * Math.PI / 180) - point.y * Math.sin(angle * Math.PI / 180);
      result.y = point.y * Math.cos(angle * Math.PI / 180) + point.x * Math.sin(angle * Math.PI / 180);
      return result;
    };
    const move = common_vendor.reactive({
      touchType: "body",
      //移动的类型
      start: {
        //开始的位置
        frame: {
          left: 0,
          top: 0,
          width: 0,
          height: 0
        },
        bgImage: {
          left: 0,
          top: 0,
          width: 0,
          height: 0
        }
      }
    });
    const touch = common_vendor.reactive({
      touchStart: []
      //记录开始触摸
    });
    const touchStart = (e, touchType = "") => {
      switch (touchType) {
        case "body":
          move.touchType = "body";
          break;
        case "left-top":
          move.touchType = "left-top";
          break;
        case "left-bottom":
          move.touchType = "left-bottom";
          break;
        case "right-top":
          move.touchType = "right-top";
          break;
        case "right-bottom":
          move.touchType = "right-bottom";
          break;
        default:
          move.touchType = "body";
          break;
      }
      touch.touchStart = e.touches;
      move.start.frame.left = origin.frame.left;
      move.start.frame.top = origin.frame.top;
      move.start.frame.width = origin.frame.width;
      move.start.frame.height = origin.frame.height;
      move.start.bgImage.left = origin.bgImage.left;
      move.start.bgImage.top = origin.bgImage.top;
      move.start.bgImage.width = origin.bgImage.width;
      move.start.bgImage.height = origin.bgImage.height;
      return false;
    };
    const touchMove = (e) => {
      if (touch.touchStart.length == 1) {
        if (move.touchType == "body") {
          moveImage(touch.touchStart[0], e.touches[0]);
        } else {
          if (props.mode != "fixed") {
            scaleFrame(touch.touchStart[0], e.touches[0]);
          }
        }
      } else if (touch.touchStart.length == 2 && e.touches.length == 2) {
        var ta = touch.touchStart[0];
        var tb = touch.touchStart[1];
        var tc = e.touches[0];
        var td = e.touches[1];
        if (ta.identifier != tc.identifier) {
          var temp = tc;
          tc = td;
          td = temp;
        }
        scaleImage(ta, tb, tc, td);
      }
    };
    const moveImage = (ta, tb) => {
      let mx = tb.clientX - ta.clientX;
      let my = tb.clientY - ta.clientY;
      origin.bgImage.left = move.start.bgImage.left + mx;
      origin.bgImage.top = move.start.bgImage.top + my;
      let frameLeft = origin.frame.left;
      let frameTop = origin.frame.top;
      let frameWidth = origin.frame.width;
      let frameHeight = origin.frame.height;
      if (origin.bgImage.left > frameLeft) {
        origin.bgImage.left = frameLeft;
      }
      if (origin.bgImage.top > frameTop) {
        origin.bgImage.top = frameTop;
      }
      if (origin.bgImage.left + origin.bgImage.width < frameLeft + frameWidth) {
        origin.bgImage.left = frameLeft + frameWidth - origin.bgImage.width;
      }
      if (origin.bgImage.top + origin.bgImage.height < frameTop + frameHeight) {
        origin.bgImage.top = frameTop + frameHeight - origin.bgImage.height;
      }
    };
    const scaleFrame = (ta, tb) => {
      let mx = tb.clientX - ta.clientX;
      let my = tb.clientY - ta.clientY;
      let x1 = move.start.frame.left;
      let y1 = move.start.frame.top;
      let x2 = move.start.frame.left + move.start.frame.width;
      let y2 = move.start.frame.top + move.start.frame.height;
      let cx1 = false;
      let cy1 = false;
      let cx2 = false;
      let cy2 = false;
      let mix = origin.frameSize;
      let rate = origin.frame.width / origin.frame.height;
      const { width: fWidth, height: fHeight } = origin.frame;
      const { width: bgWidth, height: bgHeight } = origin.bgImage;
      const { width: realWidth, height: realHeight } = origin.real;
      if (move.touchType == "left-top") {
        x1 += mx;
        y1 += my;
        cx1 = true;
        cy1 = true;
      } else if (move.touchType == "left-bottom") {
        x1 += mx;
        y2 += my;
        cx1 = true;
        cy2 = true;
      } else if (move.touchType == "right-top") {
        x2 += mx;
        y1 += my;
        cx2 = true;
        cy1 = true;
      } else if (move.touchType == "right-bottom") {
        x2 += mx;
        y2 += my;
        cx2 = true;
        cy2 = true;
      }
      if (x1 < origin.bgImage.left) {
        x1 = origin.bgImage.left;
      }
      if (y1 < origin.bgImage.top) {
        y1 = origin.bgImage.top;
      }
      if (x2 > origin.bgImage.left + origin.bgImage.width) {
        x2 = origin.bgImage.left + origin.bgImage.width;
      }
      if (y2 > origin.bgImage.top + origin.bgImage.height) {
        y2 = origin.bgImage.top + origin.bgImage.height;
      }
      if (cx1) {
        if (x1 > x2 - mix) {
          x1 = x2 - mix;
        }
      }
      if (cy1) {
        if (y1 > y2 - mix) {
          y1 = y2 - mix;
        }
      }
      if (cx2) {
        if (x2 < x1 + mix) {
          x2 = x1 + mix;
        }
      }
      if (cy2) {
        if (y2 < y1 + mix) {
          y2 = y1 + mix;
        }
      }
      if (cx1) {
        if (props.mode != "free") {
          var val = x2 - rate * (y2 - y1);
          if (x1 < val) {
            x1 = val;
          }
        }
      }
      if (cy1) {
        if (props.mode != "free") {
          var val = y2 - (x2 - x1) / rate;
          if (y1 < val) {
            y1 = val;
          }
        }
      }
      if (cx2) {
        if (props.mode != "free") {
          var val = rate * (y2 - y1) + x1;
          if (x2 > val) {
            x2 = val;
          }
        }
      }
      if (cy2) {
        if (props.mode != "free") {
          var val = (x2 - x1) / rate + y1;
          if (y2 > val) {
            y2 = val;
          }
        }
      }
      const owFrame = x2 - x1;
      const ohFrame = y2 - y1;
      if (owFrame < fWidth || ohFrame < fHeight) {
        const currentRatio = props.scaleRatio * props.maxRatio;
        const isScale = bgWidth * currentRatio >= realWidth / props.scaleRatio && bgHeight * currentRatio >= realHeight / props.scaleRatio;
        if (isScale) {
          return false;
        }
      }
      origin.frame.left = x1;
      origin.frame.top = y1;
      origin.frame.width = x2 - x1;
      origin.frame.height = y2 - y1;
    };
    const scaleImage = (ta, tb, tc, td) => {
      let x1 = ta.clientX;
      let y1 = ta.clientY;
      let x2 = tb.clientX;
      let y2 = tb.clientY;
      let x3 = tc.clientX;
      let y3 = tc.clientY;
      let x4 = td.clientX;
      let y4 = td.clientY;
      let ol = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
      let el = Math.sqrt((x3 - x4) * (x3 - x4) + (y3 - y4) * (y3 - y4));
      let ocx = (x1 + x2) / 2;
      let ocy = (y1 + y2) / 2;
      let ecx = (x3 + x4) / 2;
      let ecy = (y3 + y4) / 2;
      let ax = ecx - ocx;
      let ay = ecy - ocy;
      let scale = el / ol;
      if (move.start.bgImage.width * scale < origin.frame.width) {
        scale = origin.frame.width / move.start.bgImage.width;
      }
      if (move.start.bgImage.height * scale < origin.frame.height) {
        scale = origin.frame.height / move.start.bgImage.height;
      }
      if (move.start.bgImage.width * scale > origin.frame.width * props.maxRatio) {
        return;
      }
      origin.bgImage.left = move.start.bgImage.left + ax - (ocx - move.start.bgImage.left) * (scale - 1);
      origin.bgImage.top = move.start.bgImage.top + ay - (ocy - move.start.bgImage.top) * (scale - 1);
      origin.bgImage.width = move.start.bgImage.width * scale;
      origin.bgImage.height = move.start.bgImage.height * scale;
      if (origin.bgImage.left > origin.frame.left) {
        origin.bgImage.left = origin.frame.left;
      }
      if (origin.bgImage.top > origin.frame.top) {
        origin.bgImage.top = origin.frame.top;
      }
      if (origin.bgImage.left + origin.bgImage.width < origin.frame.left + origin.frame.width) {
        origin.bgImage.left = origin.frame.left + origin.frame.width - origin.bgImage.width;
      }
      if (origin.bgImage.top + origin.bgImage.height < origin.frame.top + origin.frame.height) {
        origin.bgImage.top = origin.frame.top + origin.frame.height - origin.bgImage.height;
      }
    };
    const touchEnd = () => {
      touch.touchStart = [];
      resizeImage();
    };
    const touchCancel = () => {
      touch.touchStart = [];
    };
    const resizeImage = () => {
      var rate = origin.frame.width / origin.frame.height;
      var width = origin.body.width * props.scaleRatio;
      var height = origin.body.height * props.scaleRatio;
      if (width / height > rate) {
        width = height * rate;
      } else {
        height = width / rate;
      }
      var left = (origin.body.width - width) / 2;
      var top = (origin.body.height - height) / 2;
      var mul = width / origin.frame.width;
      var ox = origin.frame.left - origin.bgImage.left;
      var oy = origin.frame.top - origin.bgImage.top;
      origin.frame = {
        left,
        top,
        width,
        height
      };
      width = origin.bgImage.width * mul;
      height = origin.bgImage.height * mul;
      left = origin.frame.left - ox * mul;
      top = origin.frame.top - oy * mul;
      origin.bgImage = {
        left,
        top,
        width,
        height
      };
      if (mul != 1) {
        origin.transit = true;
        setTimeout(() => {
          origin.transit = false;
        }, 300);
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.unref(transit) ? 1 : "",
        b: common_vendor.unref(imageUrl),
        c: common_vendor.o(imageLoad),
        d: common_vendor.s(comImageStyle.value("image")),
        e: common_vendor.unref(transit) ? 1 : "",
        f: common_vendor.s(comImageStyle.value("image-wrap")),
        g: common_vendor.unref(transit) ? 1 : "",
        h: common_vendor.unref(imageUrl),
        i: common_vendor.s(comImageStyle.value("image")),
        j: common_vendor.unref(transit) ? 1 : "",
        k: common_vendor.s(comImageStyle.value("image-rect")),
        l: common_vendor.s(cirStyle.value),
        m: props.radius < 50
      }, props.radius < 50 ? {} : {}, {
        n: common_vendor.o((e) => touchStart(e, "left-top")),
        o: common_vendor.o((e) => touchStart(e, "left-bottom")),
        p: common_vendor.o((e) => touchStart(e, "right-top")),
        q: common_vendor.o((e) => touchStart(e, "right-bottom")),
        r: common_vendor.unref(transit) ? 1 : "",
        s: common_vendor.s(comImageStyle.value("frame-box")),
        t: common_vendor.o((e) => touchStart(e, "body")),
        v: common_vendor.o(touchMove),
        w: common_vendor.o(touchEnd),
        x: common_vendor.o(touchCancel),
        y: common_vendor.o(onCancle),
        z: props.isRotateBtn && props.mode !== "free"
      }, props.isRotateBtn && props.mode !== "free" ? {
        A: common_assets._imports_0$1,
        B: common_vendor.o(onAngle)
      } : {}, {
        C: common_vendor.o((...args) => common_vendor.unref(onConfirm) && common_vendor.unref(onConfirm)(...args)),
        D: inInit.value ? 1 : "",
        E: props.imageUrl
      });
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-f1c204a3"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/uni_modules/t-cropper/components/t-cropper/t-cropper.js.map
