import { bP as useI18n, r as ref, a7 as reactive, t as onMounted, bN as useRouter, w as watch, y as createElementBlock, z as openBlock, A as createBaseVNode, H as createBlock, K as createCommentVNode, P as createVNode, N as toDisplayString, I as withCtx, aD as resolveComponent, bO as useRoute, M as createTextVNode } from "./vue-CmclmBdx.js";
import { u as useUserStore, a as apiRequest } from "./index-7lo_Phz_.js";
import { L as LoadingPage } from "./page-DYY7bfD8.js";
import { E as ElMessageBox } from "./element-plus-BqqwJ07U.js";
import "./vendor-3nH66FWi.js";
import "./swiper-Bjhxao44.js";
import "./pinia-QRlfNOmY.js";
import "./axios-DYLuwdcf.js";
const _imports_0 = "/assets/bannerMobile-D152lkyX.webp";
const _imports_1 = "/assets/bannerPc-DbLWUkrr.webp";
const _imports_2 = "/assets/banner-B1UceERi.webp";
const _hoisted_1 = _imports_0;
const _hoisted_2 = _imports_1;
const _hoisted_3 = { class: "" };
const _hoisted_4 = { class: "Container MainBox outer" };
const _hoisted_5 = { class: "Topic1 text-center mb-8" };
const _hoisted_6 = { class: "text" };
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const { t } = useI18n();
    const route = useRoute();
    const router = useRouter();
    const user = useUserStore();
    const errorMsg = ref("");
    const formField = reactive({
      username: "",
      password: ""
    });
    const loading = ref(false);
    onMounted(() => {
      if (user.userIsLogin) {
        router.replace("/member");
      }
    });
    watch(() => user.userIsLogin, (newValue) => {
      if (newValue) {
        router.replace("/member");
      }
    });
    const login = async () => {
      loading.value = true;
      let token = null;
      await apiRequest.get("/authentication/token/new").then((res) => {
        token = res.request_token;
      });
      await apiRequest.post("/authentication/token/validate_with_login", {
        request_token: token,
        username: formField.username,
        password: formField.password
      }).then((res) => {
        errorMsg.value = "";
        if (res.success) {
          let day = /* @__PURE__ */ new Date();
          day.setTime(day.getTime() + 24 * 60 * 60 * 1e3);
          day = day.toUTCString();
          document.cookie = `token=${res.request_token}; expires=${day}; path=/`;
          apiRequest.post("/authentication/session/new", {
            request_token: token,
            username: formField.username,
            password: formField.password
          }).then((res2) => {
            document.cookie = `session_id=${res2.session_id}; expires=${day}; path=/`;
            if (res2.success) {
              apiRequest.get("/account", {
                params: {
                  api_key: "276c2009652cbc7e05302ae2b16c6e07",
                  session_id: res2.session_id
                }
              }).then((res3) => {
                loading.value = false;
                user.getUserInfo(res3.id, res2.session_id);
                document.cookie = `account_id=${res3.id}; expires=${day}; path=/`;
                ElMessageBox.alert(t("global.loginSuccess"), "", {
                  center: true,
                  confirmButtonText: "OK",
                  callback: () => {
                    if (route.query.from) {
                      router.push(route.query.from);
                    } else {
                      router.push({ name: "member" });
                    }
                  }
                });
              });
            } else {
              errorMsg.value = res.response.data.status_message;
              loading.value = false;
            }
          });
        } else {
          errorMsg.value = res.response.data.status_message;
          loading.value = false;
        }
      }).catch((err) => {
        loading.value = false;
      });
    };
    return (_ctx, _cache) => {
      const _component_ElInput = resolveComponent("ElInput");
      const _component_ElFormItem = resolveComponent("ElFormItem");
      const _component_ElForm = resolveComponent("ElForm");
      return openBlock(), createElementBlock("div", _hoisted_3, [
        _cache[3] || (_cache[3] = createBaseVNode("picture", { class: "aspect-[23/12] sm:aspect-[32/5]" }, [
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
        createBaseVNode("div", _hoisted_4, [
          createBaseVNode("h1", _hoisted_5, toDisplayString(_ctx.$t("global.login")), 1),
          createVNode(_component_ElForm, {
            class: "AccessForm",
            "label-position": "right"
          }, {
            default: withCtx(() => [
              createVNode(_component_ElFormItem, {
                label: _ctx.$t("global.account"),
                "label-position": "top"
              }, {
                default: withCtx(() => [
                  createVNode(_component_ElInput, {
                    modelValue: formField.username,
                    "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => formField.username = $event)
                  }, null, 8, ["modelValue"])
                ]),
                _: 1
              }, 8, ["label"]),
              createVNode(_component_ElFormItem, {
                label: _ctx.$t("global.password"),
                "label-position": "top"
              }, {
                default: withCtx(() => [
                  createVNode(_component_ElInput, {
                    modelValue: formField.password,
                    "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => formField.password = $event),
                    type: "password"
                  }, null, 8, ["modelValue"])
                ]),
                _: 1
              }, 8, ["label"]),
              errorMsg.value !== "" ? (openBlock(), createBlock(_component_ElFormItem, { key: 0 }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(errorMsg.value), 1)
                ]),
                _: 1
              })) : createCommentVNode("", true),
              createBaseVNode("div", {
                class: "BtnAny1 default mx-auto",
                onClick: _cache[2] || (_cache[2] = ($event) => login())
              }, [
                createBaseVNode("div", _hoisted_6, toDisplayString(_ctx.$t("global.login")), 1)
              ])
            ]),
            _: 1
          })
        ]),
        loading.value ? (openBlock(), createBlock(LoadingPage, {
          key: 0,
          class: "absolute top-0 left-0 w-full h-full z-2"
        })) : createCommentVNode("", true)
      ]);
    };
  }
};
export {
  _sfc_main as default
};
