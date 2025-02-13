import { y as createElementBlock, z as openBlock, A as createBaseVNode, P as createVNode, N as toDisplayString, I as withCtx, u as unref, bR as RouterLink } from "./vue-CmclmBdx.js";
import "./vendor-3nH66FWi.js";
import "./element-plus-BqqwJ07U.js";
import "./swiper-Bjhxao44.js";
const _imports_0 = "/assets/bannerMobile-C-RClkMK.webp";
const _imports_1 = "/assets/bannerPc-Ddym00FB.webp";
const _imports_2 = "/assets/banner-BOhGaITa.webp";
const _hoisted_1 = _imports_0;
const _hoisted_2 = _imports_1;
const _hoisted_3 = { class: "Container MainBox outer" };
const _hoisted_4 = { class: "Topic1 text-center mb-8" };
const _hoisted_5 = { class: "text" };
const _sfc_main = {
  __name: "error",
  setup(__props) {
    return (_ctx, _cache) => {
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
          createBaseVNode("h1", _hoisted_4, toDisplayString(_ctx.$t("global.error")), 1),
          createVNode(unref(RouterLink), {
            to: "/",
            class: "BtnAny1 default mx-auto"
          }, {
            default: withCtx(() => [
              createBaseVNode("div", _hoisted_5, toDisplayString(_ctx.$t("global.backToIndex")), 1)
            ]),
            _: 1
          })
        ])
      ]);
    };
  }
};
export {
  _sfc_main as default
};
