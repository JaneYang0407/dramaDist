import { H as createBlock, z as openBlock, I as withCtx, A as createBaseVNode, y as createElementBlock, K as createCommentVNode, u as unref, N as toDisplayString, bR as RouterLink } from "./vue-CmclmBdx.js";
import { s as storeToRefs } from "./pinia-QRlfNOmY.js";
import { u as useApiConfigStore } from "./apiConfig-QxoHLURK.js";
import { _ as _export_sfc } from "./index-7lo_Phz_.js";
const _hoisted_1 = { class: "PersonItemPic overflow-hidden aspect-[11/13]" };
const _hoisted_2 = ["src"];
const _hoisted_3 = { class: "PersonItemInfo p-2" };
const _hoisted_4 = { class: "PersonItemTitle" };
const _sfc_main = {
  __name: "item",
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  setup(__props) {
    const props = __props;
    const apiConfigObj = useApiConfigStore();
    apiConfigObj.getApiConfig();
    const { apiConfig } = storeToRefs(apiConfigObj);
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(RouterLink), {
        to: `/person/${props.data.id}`,
        class: "PersonItem relative overflow-hidden rounded-md"
      }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_1, [
            props.data.profile_path !== "" && props.data.profile_path !== null ? (openBlock(), createElementBlock("img", {
              key: 0,
              class: "free object-cover w-full h-full transition-transform duration-300",
              src: `${unref(apiConfig).images.secure_base_url}w185${props.data.profile_path}`,
              loading: "lazy",
              alt: ""
            }, null, 8, _hoisted_2)) : createCommentVNode("", true)
          ]),
          createBaseVNode("div", _hoisted_3, [
            createBaseVNode("div", _hoisted_4, toDisplayString(__props.data.name), 1)
          ])
        ]),
        _: 1
      }, 8, ["to"]);
    };
  }
};
const PersonItem = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-fab6e65c"]]);
export {
  PersonItem as P
};
