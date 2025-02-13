import { _ as _export_sfc } from "./index-7lo_Phz_.js";
import { y as createElementBlock, z as openBlock, A as createBaseVNode, N as toDisplayString } from "./vue-CmclmBdx.js";
import "./pinia-QRlfNOmY.js";
import "./axios-DYLuwdcf.js";
import "./vendor-3nH66FWi.js";
import "./element-plus-BqqwJ07U.js";
import "./swiper-Bjhxao44.js";
const _imports_0 = "/assets/bannerMobile-B4cYKnHA.webp";
const _imports_1 = "/assets/bannerPc-s5ZOu7ys.webp";
const _imports_2 = "/assets/banner-DEiMNsCe.webp";
const _sfc_main = {};
const _hoisted_1 = _imports_0;
const _hoisted_2 = _imports_1;
const _hoisted_3 = { class: "Container MainBox outer" };
const _hoisted_4 = { class: "Topic1 text-center mb-8" };
const _hoisted_5 = { class: "PureCont" };
const _hoisted_6 = { class: "mb-4 last:mb-0" };
const _hoisted_7 = { class: "mb-4 last:mb-0" };
const _hoisted_8 = { class: "mb-4 last:mb-0" };
function _sfc_render(_ctx, _cache) {
  return openBlock(), createElementBlock("div", null, [
    _cache[0] || (_cache[0] = createBaseVNode("picture", { class: "aspect-[23/12] sm:aspect-[32/5]" }, [
      createBaseVNode("source", {
        srcset: _hoisted_1,
        media: "(max-width: 575px)"
      }),
      createBaseVNode("source", {
        srcset: _hoisted_2,
        media: "(max-width: 1920px)"
      }),
      createBaseVNode("img", {
        class: "w-full h-full free object-cover",
        src: _imports_2,
        alt: "Banner"
      })
    ], -1)),
    createBaseVNode("div", _hoisted_3, [
      createBaseVNode("h1", _hoisted_4, toDisplayString(_ctx.$t("about.topic")), 1),
      createBaseVNode("div", _hoisted_5, [
        createBaseVNode("div", _hoisted_6, toDisplayString(_ctx.$t("about.p1")), 1),
        createBaseVNode("div", _hoisted_7, toDisplayString(_ctx.$t("about.p2")), 1),
        createBaseVNode("div", _hoisted_8, toDisplayString(_ctx.$t("about.p3")), 1)
      ])
    ])
  ]);
}
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export {
  index as default
};
