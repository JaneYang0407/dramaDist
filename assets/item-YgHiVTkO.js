import { _ as _export_sfc } from "./index-7lo_Phz_.js";
import { y as createElementBlock, z as openBlock, A as createBaseVNode, N as toDisplayString } from "./vue-CmclmBdx.js";
const _hoisted_1 = ["href"];
const _hoisted_2 = { class: "DramaItemPicBox relative mb-3.75" };
const _hoisted_3 = { class: "DramaItemPic overflow-hidden" };
const _hoisted_4 = ["src"];
const _hoisted_5 = { class: "DramaItemMore text-sm absolute w-full px-3 text-center left-1/2 -translate-x-1/2 bottom-3 z-1" };
const _hoisted_6 = { class: "DramaItemTitle md:text-lg" };
const _sfc_main = {
  __name: "item",
  props: {
    data: {
      type: Object,
      required: true
    },
    category: {
      type: String,
      required: true
    }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("a", {
        class: "DramaItem relative",
        href: `/${props.category}/${props.data.id}`
      }, [
        createBaseVNode("div", _hoisted_2, [
          createBaseVNode("div", _hoisted_3, [
            createBaseVNode("img", {
              class: "free object-cover w-full h-full",
              src: props.data.poster_path ? `https://image.tmdb.org/t/p/w185${props.data.poster_path}` : `https://image.tmdb.org/t/p/w300${props.data.backdrop_path}`,
              loading: "lazy",
              alt: ""
            }, null, 8, _hoisted_4)
          ]),
          createBaseVNode("div", _hoisted_5, toDisplayString(_ctx.$t("global.seeMore")), 1)
        ]),
        createBaseVNode("div", _hoisted_6, toDisplayString(props.data.title ?? props.data.name), 1)
      ], 8, _hoisted_1);
    };
  }
};
const DramaItem = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-ff3ee93e"]]);
export {
  DramaItem as D
};
