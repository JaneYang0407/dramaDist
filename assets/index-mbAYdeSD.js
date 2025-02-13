import { s as storeToRefs } from "./pinia-QRlfNOmY.js";
import { u as useUserStore, g as getCookie } from "./index-7lo_Phz_.js";
import { L as LoadingPage } from "./page-DYY7bfD8.js";
import { r as ref, t as onMounted, y as createElementBlock, z as openBlock, A as createBaseVNode, P as createVNode, I as withCtx, aD as resolveComponent, N as toDisplayString, H as createBlock, M as createTextVNode } from "./vue-CmclmBdx.js";
import "./axios-DYLuwdcf.js";
import "./vendor-3nH66FWi.js";
import "./element-plus-BqqwJ07U.js";
import "./swiper-Bjhxao44.js";
const _hoisted_1 = { class: "MainBox" };
const _hoisted_2 = { class: "MainInner" };
const _hoisted_3 = { class: "MemberBox" };
const _hoisted_4 = { class: "MemberMenu" };
const _hoisted_5 = { class: "MemberMenuListBox" };
const _hoisted_6 = { class: "MemberMenuList" };
const _hoisted_7 = { class: "MemberMenuList" };
const _hoisted_8 = { class: "MemberMenuList" };
const _hoisted_9 = { class: "MemberCont" };
const _hoisted_10 = { class: "MemberTopic Topic1" };
const _hoisted_11 = { class: "MemberReal" };
const _hoisted_12 = {
  key: 0,
  class: "MemberCenterList"
};
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const loadingPage = ref(true);
    const user = useUserStore();
    const { userInfo } = storeToRefs(user);
    const userName = ref("");
    onMounted(async () => {
      await user.getUserInfo(getCookie("account_id"), getCookie("session_id"));
      userName.value = userInfo.value.username;
      loadingPage.value = false;
    });
    return (_ctx, _cache) => {
      const _component_RouterLink = resolveComponent("RouterLink");
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createBaseVNode("div", _hoisted_2, [
          createBaseVNode("div", _hoisted_3, [
            createBaseVNode("nav", _hoisted_4, [
              createBaseVNode("ul", _hoisted_5, [
                createBaseVNode("li", _hoisted_6, [
                  createVNode(_component_RouterLink, {
                    to: "/member",
                    class: "MemberMenuListLink active"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(_ctx.$t("global.member")), 1)
                    ]),
                    _: 1
                  })
                ]),
                createBaseVNode("li", _hoisted_7, [
                  createVNode(_component_RouterLink, {
                    to: "/member/favorite/movie",
                    class: "MemberMenuListLink"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(_ctx.$t("global.myFavorite")), 1)
                    ]),
                    _: 1
                  })
                ]),
                createBaseVNode("li", _hoisted_8, [
                  createVNode(_component_RouterLink, {
                    to: "/member/watchlist/movie",
                    class: "MemberMenuListLink"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(_ctx.$t("global.myWatchList")), 1)
                    ]),
                    _: 1
                  })
                ])
              ])
            ]),
            createBaseVNode("div", _hoisted_9, [
              createBaseVNode("h1", _hoisted_10, toDisplayString(_ctx.$t("global.member")), 1),
              createBaseVNode("div", _hoisted_11, [
                !loadingPage.value ? (openBlock(), createElementBlock("div", _hoisted_12, toDisplayString(_ctx.$t("global.welcomeName", { name: userName.value })), 1)) : (openBlock(), createBlock(LoadingPage, {
                  key: 1,
                  class: "noBg"
                }))
              ])
            ])
          ])
        ])
      ]);
    };
  }
};
export {
  _sfc_main as default
};
