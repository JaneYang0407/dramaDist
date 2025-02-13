const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/index-BAO0FdtV.js","assets/vue-CmclmBdx.js","assets/vendor-3nH66FWi.js","assets/vendor-B86bQ95q.css","assets/element-plus-BqqwJ07U.js","assets/element-plus-DrZq6NW_.css","assets/swiper-Bjhxao44.js","assets/swiper-B1jrVYSs.css","assets/pinia-QRlfNOmY.js","assets/apiConfig-QxoHLURK.js","assets/item-YgHiVTkO.js","assets/item-5I2w9isa.css","assets/page-DYY7bfD8.js","assets/page-D6E5C38-.css","assets/axios-DYLuwdcf.js","assets/index-DdzeTKj6.css","assets/index-DwxHNHFM.js","assets/index-CIdbkVTV.js","assets/index-Cum8M6dN.js","assets/_id_-DyyyOjZs.js","assets/item-D1UotU8M.js","assets/item-CZf08ZAq.css","assets/index-DZbKIjx2.js","assets/_id_-BbigD8Q3.js","assets/_id_-OUV2qNCf.css","assets/index-qV4GCOQS.js","assets/_id_-Dk9O_5p3.js","assets/_id_-CHPBqkYu.css","assets/index-BWEcuOFM.js","assets/_type_-CZIMTXaw.js","assets/index-mbAYdeSD.js","assets/_type_-C1CqND1m.js","assets/_type_-Cj0GUW-s.js","assets/index-CGWv3YKo.js","assets/index-BCAm1A9H.js","assets/error-nhkIKkPU.js"])))=>i.map(i=>d[i]);
import { r as ref, c as computed, Y as nextTick, bN as useRouter, bO as useRoute, bP as useI18n, w as watch, t as onMounted, bQ as useEventListener, y as createElementBlock, z as openBlock, A as createBaseVNode, P as createVNode, I as withCtx, u as unref, bR as RouterLink, K as createCommentVNode, J as withDirectives, aK as vModelText, ak as withKeys, M as createTextVNode, N as toDisplayString, D as normalizeClass, bS as P, O as Fragment, an as renderList, bT as OnClickOutside, H as createBlock, aD as resolveComponent, a6 as onBeforeUnmount, bU as RouterView, bV as createRouter, bW as createMemoryHistory, bX as createWebHistory, bG as createApp, bY as createI18n } from "./vue-CmclmBdx.js";
import { d as defineStore, c as createPinia } from "./pinia-QRlfNOmY.js";
import { a as axios } from "./axios-DYLuwdcf.js";
import "./vendor-3nH66FWi.js";
import { E as ElMessageBox, I as ID_INJECTION_KEY, i as installer } from "./element-plus-BqqwJ07U.js";
import "./swiper-Bjhxao44.js";
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const useViewportStore = defineStore("viewport", () => {
  const vh = ref(0);
  function updateVh() {
    const viewportHeight = window.innerHeight * 0.01;
    vh.value = viewportHeight;
    document.documentElement.style.setProperty("--vh", `${viewportHeight}px`);
  }
  function startListeners() {
    updateVh();
    window.addEventListener("resize", updateVh);
  }
  function stopListeners() {
    window.removeEventListener("resize", updateVh);
  }
  return {
    vh,
    updateVh,
    startListeners,
    stopListeners
  };
});
const _imports_0 = "data:image/svg+xml,%3csvg%20width='159'%20height='150'%20viewBox='0%200%20159%20150'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M34.9355%20115H15.7422L15.8633%20100.832H34.9355C39.6986%20100.832%2043.7148%2099.7624%2046.9844%2097.623C50.2539%2095.4434%2052.7161%2092.2747%2054.3711%2088.1172C56.0664%2083.9596%2056.9141%2078.9342%2056.9141%2073.041V68.7422C56.9141%2064.2214%2056.4297%2060.2454%2055.4609%2056.8145C54.5326%2053.3835%2053.14%2050.4974%2051.2832%2048.1562C49.4264%2045.8151%2047.1458%2044.0592%2044.4414%2042.8887C41.737%2041.6777%2038.6289%2041.0723%2035.1172%2041.0723H15.3789V26.8438H35.1172C41.0104%2026.8438%2046.3991%2027.8529%2051.2832%2029.8711C56.2077%2031.849%2060.4661%2034.6947%2064.0586%2038.4082C67.651%2042.1217%2070.416%2046.5618%2072.3535%2051.7285C74.3314%2056.8548%2075.3203%2062.5664%2075.3203%2068.8633V73.041C75.3203%2079.2975%2074.3314%2085.0091%2072.3535%2090.1758C70.416%2095.3424%2067.651%2099.7826%2064.0586%20103.496C60.5065%20107.169%2056.248%20110.015%2051.2832%20112.033C46.3587%20114.011%2040.9095%20115%2034.9355%20115ZM26.0352%2026.8438V115H7.87109V26.8438H26.0352ZM155.191%20100.832V115H110.811V100.832H155.191ZM116.684%2026.8438V115H98.5195V26.8438H116.684Z'%20fill='%23FFC01E'/%3e%3c/svg%3e";
const apiRequest = axios.create({
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyNzZjMjAwOTY1MmNiYzdlMDUzMDJhZTJiMTZjNmUwNyIsIm5iZiI6MTcxMDQyNjg4MC42MTksInN1YiI6IjY1ZjMwYjAwYzQ5MDQ4MDE4NjE5Zjk4MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.IwpNDd1pv7eH0TWtm8Du1CB-mh-Xq2Kycngm2oIreSg"}`
  },
  baseURL: "https://api.themoviedb.org/3",
  timeout: 5e3
});
apiRequest.interceptors.request.use((config) => {
  return config;
}, (err) => {
  console.log(err);
  return err;
});
apiRequest.interceptors.response.use((res) => {
  return res.data;
}, (err) => {
  console.log(err);
  return err;
});
const useUserStore = defineStore("user", () => {
  const userInfo = ref(null);
  const userId = ref(null);
  const userIsLogin = computed(() => userId.value !== null && userId.value !== void 0);
  async function getUserInfo(id, sessionId) {
    try {
      const res = await apiRequest.get(`/account/${id}`, {
        params: {
          session_id: sessionId
        }
      });
      userInfo.value = res;
      userId.value = res.id;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  async function userLogout(sessionId) {
    const options = {
      method: "DELETE",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyNzZjMjAwOTY1MmNiYzdlMDUzMDJhZTJiMTZjNmUwNyIsIm5iZiI6MTcxMDQyNjg4MC42MTksInN1YiI6IjY1ZjMwYjAwYzQ5MDQ4MDE4NjE5Zjk4MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.IwpNDd1pv7eH0TWtm8Du1CB-mh-Xq2Kycngm2oIreSg"}`
      },
      body: JSON.stringify({ session_id: sessionId })
    };
    try {
      await fetch("https://api.themoviedb.org/3/authentication/session", options).then((res) => res.json()).catch((err) => console.error(err));
      reset();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  function reset() {
    userInfo.value = null;
    userId.value = null;
    nextTick(() => {
      userInfo.value = null;
      userId.value = null;
    });
  }
  return {
    userInfo,
    userId,
    userIsLogin,
    getUserInfo,
    userLogout,
    reset
  };
});
const getCookie = (name) => {
  var nameEQ = name + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _hoisted_1$2 = { class: "headerContainer flex items-center px-2.5 xl:px-12.5" };
const _hoisted_2$2 = { class: "headerMenuBox" };
const _hoisted_3$1 = { class: "headerMenuInner" };
const _hoisted_4 = { class: "headerSearchOuter px-5 mb-5 xl:hidden" };
const _hoisted_5 = { class: "headerSearchBox flex items-center" };
const _hoisted_6 = ["placeholder"];
const _hoisted_7 = { class: "headerNav max-xl:mb-10" };
const _hoisted_8 = { class: "headerNavItems xl:flex xl:items-center" };
const _hoisted_9 = { class: "headerNavItem" };
const _hoisted_10 = { class: "headerNavItem" };
const _hoisted_11 = {
  key: 0,
  class: "headerNavItem xl:hidden"
};
const _hoisted_12 = {
  key: 1,
  class: "headerNavItem xl:hidden"
};
const _hoisted_13 = {
  key: 2,
  class: "headerNavItem xl:hidden"
};
const _hoisted_14 = { class: "headerLangBox xl:hidden" };
const _hoisted_15 = { class: "headerLangTitle" };
const _hoisted_16 = ["onClick"];
const _hoisted_17 = { class: "text" };
const _hoisted_18 = { class: "headerAct ml-auto flex items-center justify-end" };
const _hoisted_19 = { class: "headerSearchBox bg-black/60 flex items-center mr-8 max-xl:hidden" };
const _hoisted_20 = ["placeholder"];
const _hoisted_21 = { class: "headerLangBox mr-8 max-xl:hidden" };
const _hoisted_22 = { class: "headerLangTitle" };
const _hoisted_23 = ["onClick"];
const _hoisted_24 = { class: "text" };
const _hoisted_25 = { class: "text" };
const _hoisted_26 = { class: "text" };
const _hoisted_27 = ["aria-label"];
const _sfc_main$2 = {
  __name: "index",
  setup(__props) {
    const router2 = useRouter();
    const route = useRoute();
    const user = useUserStore();
    const headerActive = ref(false);
    const headerOpen = ref(false);
    const { locale, t } = useI18n();
    const langMenuOpen = ref(false);
    const langList = ref([
      {
        id: "zh-TW",
        title: "繁體中文",
        value: "zh-TW"
      },
      {
        id: "zh-CN",
        title: "简体中文",
        value: "zh-CN"
      },
      {
        id: "en",
        title: "English",
        value: "en-US"
      }
    ]);
    const currentLangTitle = computed(() => {
      return langList.value.find((item) => item.value === locale.value).title;
    });
    watch(locale, (newlocale) => {
      localStorage.setItem("locale", newlocale);
      document.documentElement.lang = langList.value.find((item) => item.value === newlocale).id;
    });
    onMounted(async () => {
      if (getCookie("account_id") !== null && getCookie("session_id") !== null) {
        await user.getUserInfo(getCookie("account_id"), getCookie("session_id"));
      }
      useEventListener(window, "scroll", function(e) {
        if (this.scrollY > 80) {
          headerActive.value = true;
        } else {
          headerActive.value = false;
        }
      });
    });
    async function logout() {
      headerOpen.value = false;
      await user.userLogout(getCookie("session_id"));
      document.cookie = `token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
      document.cookie = `session_id=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
      document.cookie = `account_id=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
      ElMessageBox.alert(t("global.logoutSuccess"), "", {
        center: true,
        confirmButtonText: t("global.confirm"),
        callback: () => {
          router2.push({ name: "index" });
        }
      });
    }
    const searchKeyword = ref(route.query.q ?? "");
    function search2() {
      headerOpen.value = false;
      router2.push({
        path: "/search/movie",
        query: {
          q: searchKeyword.value
        }
      });
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("header", {
        class: normalizeClass(["headerBox w-full fixed top-0 left-0 z-9996 transition-colors duration-200", [headerActive.value ? "bg-black/60" : "", headerOpen.value ? "open" : ""]])
      }, [
        createBaseVNode("div", _hoisted_1$2, [
          createVNode(unref(RouterLink), {
            to: "/",
            class: "headerLogo xl:mr-14",
            onClick: _cache[0] || (_cache[0] = ($event) => headerOpen.value = false)
          }, {
            default: withCtx(() => _cache[15] || (_cache[15] = [
              createBaseVNode("img", {
                src: _imports_0,
                alt: "logo"
              }, null, -1)
            ])),
            _: 1
          }),
          createBaseVNode("div", _hoisted_2$2, [
            createBaseVNode("div", {
              class: "headerMenuBg",
              onClick: _cache[1] || (_cache[1] = ($event) => headerOpen.value = false)
            }),
            createBaseVNode("div", _hoisted_3$1, [
              createBaseVNode("div", _hoisted_4, [
                createBaseVNode("div", _hoisted_5, [
                  withDirectives(createBaseVNode("input", {
                    "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => searchKeyword.value = $event),
                    type: "text",
                    class: "bg-transparent block flex-1 mr-2",
                    placeholder: _ctx.$t("global.searchBar"),
                    onKeyup: withKeys(search2, ["enter"])
                  }, null, 40, _hoisted_6), [
                    [vModelText, searchKeyword.value]
                  ]),
                  createBaseVNode("i", {
                    class: "icon icon-search block cursor-pointer transition-opacity duration-200 xl:hover:opacity-50",
                    onClick: search2
                  })
                ])
              ]),
              createBaseVNode("nav", _hoisted_7, [
                createBaseVNode("ul", _hoisted_8, [
                  createBaseVNode("li", _hoisted_9, [
                    createVNode(unref(RouterLink), {
                      to: "/movie",
                      class: "headerNavItemLink",
                      onClick: _cache[3] || (_cache[3] = ($event) => headerOpen.value = false)
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(_ctx.$t("global.movie")), 1)
                      ]),
                      _: 1
                    })
                  ]),
                  createBaseVNode("li", _hoisted_10, [
                    createVNode(unref(RouterLink), {
                      to: "/show",
                      class: "headerNavItemLink",
                      onClick: _cache[4] || (_cache[4] = ($event) => headerOpen.value = false)
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(_ctx.$t("global.show")), 1)
                      ]),
                      _: 1
                    })
                  ]),
                  unref(user).userIsLogin ? (openBlock(), createElementBlock("li", _hoisted_11, [
                    createVNode(unref(RouterLink), {
                      to: "/member",
                      class: "headerNavItemLink",
                      onClick: _cache[5] || (_cache[5] = ($event) => headerOpen.value = false)
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(_ctx.$t("global.member")), 1)
                      ]),
                      _: 1
                    })
                  ])) : createCommentVNode("", true),
                  unref(user).userIsLogin ? (openBlock(), createElementBlock("li", _hoisted_12, [
                    createVNode(unref(RouterLink), {
                      to: "/member/favorite/movie",
                      class: "headerNavItemLink",
                      onClick: _cache[6] || (_cache[6] = ($event) => headerOpen.value = false)
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(_ctx.$t("global.myFavorite")), 1)
                      ]),
                      _: 1
                    })
                  ])) : createCommentVNode("", true),
                  unref(user).userIsLogin ? (openBlock(), createElementBlock("li", _hoisted_13, [
                    createVNode(unref(RouterLink), {
                      to: "/member/watchlist/movie",
                      class: "headerNavItemLink",
                      onClick: _cache[7] || (_cache[7] = ($event) => headerOpen.value = false)
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(_ctx.$t("global.myWatchList")), 1)
                      ]),
                      _: 1
                    })
                  ])) : createCommentVNode("", true)
                ])
              ]),
              createBaseVNode("div", _hoisted_14, [
                createBaseVNode("div", {
                  class: "headerLang jsHeaderLang",
                  onClick: _cache[8] || (_cache[8] = ($event) => langMenuOpen.value = !langMenuOpen.value)
                }, [
                  _cache[16] || (_cache[16] = createBaseVNode("i", { class: "icon icon-earth text-base" }, null, -1)),
                  createBaseVNode("div", _hoisted_15, toDisplayString(currentLangTitle.value), 1),
                  createBaseVNode("i", {
                    class: normalizeClass(["icon icon-arrowB text-xs scale-75 transition-transform duration-200", { "rotate-180": langMenuOpen.value }])
                  }, null, 2)
                ]),
                createVNode(unref(OnClickOutside), {
                  options: { ignore: [".jsHeaderLang"] },
                  onTrigger: _cache[9] || (_cache[9] = ($event) => langMenuOpen.value = false)
                }, {
                  default: withCtx(() => [
                    createBaseVNode("div", {
                      class: normalizeClass(["headerLangItems", langMenuOpen.value ? "" : "opacity-0 pointer-events-none"])
                    }, [
                      createVNode(unref(P), {
                        class: "headerLangScroll",
                        defer: ""
                      }, {
                        default: withCtx(() => [
                          (openBlock(true), createElementBlock(Fragment, null, renderList(langList.value, (item) => {
                            return openBlock(), createElementBlock("div", {
                              key: item.id,
                              class: normalizeClass(["headerLangItem", { "active": item.value === unref(locale) }]),
                              onClick: ($event) => locale.value = item.value
                            }, toDisplayString(item.title), 11, _hoisted_16);
                          }), 128))
                        ]),
                        _: 1
                      })
                    ], 2)
                  ]),
                  _: 1
                })
              ]),
              unref(user).userIsLogin ? (openBlock(), createElementBlock("button", {
                key: 0,
                class: "headerActLogin BtnAny1 default min-w-20 mx-auto mt-5 xl:hidden",
                type: "button",
                onClick: logout
              }, [
                createBaseVNode("div", _hoisted_17, toDisplayString(_ctx.$t("global.logout")), 1)
              ])) : createCommentVNode("", true)
            ])
          ]),
          createBaseVNode("div", _hoisted_18, [
            createBaseVNode("div", _hoisted_19, [
              withDirectives(createBaseVNode("input", {
                "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => searchKeyword.value = $event),
                type: "text",
                class: "bg-transparent block flex-1 mr-2",
                placeholder: _ctx.$t("global.searchBar"),
                onKeyup: withKeys(search2, ["enter"])
              }, null, 40, _hoisted_20), [
                [vModelText, searchKeyword.value]
              ]),
              createBaseVNode("i", {
                class: "icon icon-search block cursor-pointer transition-opacity duration-200 xl:hover:opacity-50",
                onClick: search2
              })
            ]),
            createBaseVNode("div", _hoisted_21, [
              createBaseVNode("div", {
                class: "headerLang jsHeaderLang",
                onClick: _cache[11] || (_cache[11] = ($event) => langMenuOpen.value = !langMenuOpen.value)
              }, [
                _cache[17] || (_cache[17] = createBaseVNode("i", { class: "icon icon-earth text-lg" }, null, -1)),
                createBaseVNode("div", _hoisted_22, toDisplayString(currentLangTitle.value), 1),
                createBaseVNode("i", {
                  class: normalizeClass(["icon icon-arrowB text-xs scale-90 transition-transform duration-200", { "rotate-180": langMenuOpen.value }])
                }, null, 2)
              ]),
              createVNode(unref(OnClickOutside), {
                options: { ignore: [".jsHeaderLang"] },
                onTrigger: _cache[12] || (_cache[12] = ($event) => langMenuOpen.value = false)
              }, {
                default: withCtx(() => [
                  createBaseVNode("div", {
                    class: normalizeClass(["headerLangItems", langMenuOpen.value ? "" : "opacity-0 pointer-events-none"])
                  }, [
                    createVNode(unref(P), {
                      class: "headerLangScroll",
                      defer: ""
                    }, {
                      default: withCtx(() => [
                        (openBlock(true), createElementBlock(Fragment, null, renderList(langList.value, (item) => {
                          return openBlock(), createElementBlock("div", {
                            key: item.id,
                            class: normalizeClass(["headerLangItem", { "active": item.value === unref(locale) }]),
                            onClick: ($event) => locale.value = item.value
                          }, toDisplayString(item.title), 11, _hoisted_23);
                        }), 128))
                      ]),
                      _: 1
                    })
                  ], 2)
                ]),
                _: 1
              })
            ]),
            !unref(user).userIsLogin ? (openBlock(), createBlock(unref(RouterLink), {
              key: 0,
              to: "/login",
              class: "headerActLogin BtnAny1 default min-w-20",
              onClick: _cache[13] || (_cache[13] = ($event) => headerOpen.value = false)
            }, {
              default: withCtx(() => [
                createBaseVNode("div", _hoisted_24, toDisplayString(_ctx.$t("global.login")), 1)
              ]),
              _: 1
            })) : createCommentVNode("", true),
            unref(user).userIsLogin ? (openBlock(), createBlock(unref(RouterLink), {
              key: 1,
              to: "/member",
              class: "headerActLogin BtnAny1 default min-w-20 mr-3",
              type: "button"
            }, {
              default: withCtx(() => [
                createBaseVNode("div", _hoisted_25, toDisplayString(_ctx.$t("global.member")), 1)
              ]),
              _: 1
            })) : createCommentVNode("", true),
            unref(user).userIsLogin ? (openBlock(), createElementBlock("button", {
              key: 2,
              class: "headerActLogin BtnAny1 default min-w-20 max-xl:hidden",
              type: "button",
              onClick: logout
            }, [
              createBaseVNode("div", _hoisted_26, toDisplayString(_ctx.$t("global.logout")), 1)
            ])) : createCommentVNode("", true),
            createBaseVNode("button", {
              type: "button",
              class: "headerMenuBtn",
              "aria-label": headerOpen.value ? _ctx.$t("global.closeMenu") : _ctx.$t("global.openMenu"),
              onClick: _cache[14] || (_cache[14] = ($event) => headerOpen.value = !headerOpen.value)
            }, _cache[18] || (_cache[18] = [
              createBaseVNode("span", { class: "headerMenuBtnLine" }, null, -1)
            ]), 8, _hoisted_27)
          ])
        ])
      ], 2);
    };
  }
};
const Header = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-53c890ec"]]);
const _hoisted_1$1 = { class: "footerBox" };
const _hoisted_2$1 = { class: "footerNav flex items-center justify-center my-3" };
const _hoisted_3 = { class: "footerCopyRight text-center" };
const _sfc_main$1 = {
  __name: "index",
  setup(__props) {
    const isAppear = ref(false);
    onMounted(() => {
      useEventListener(window, "scroll", () => {
        if (window.scrollY > 200) {
          isAppear.value = true;
        } else {
          isAppear.value = false;
        }
      });
    });
    function goTop() {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    return (_ctx, _cache) => {
      const _component_RouterLink = resolveComponent("RouterLink");
      return openBlock(), createElementBlock(Fragment, null, [
        createBaseVNode("button", {
          type: "button",
          class: normalizeClass(["border-0 p-0 block fixed right-5 bottom-5 z-10 rounded-full w-10 aspect-square bg-primary text-forth transition-opacity duration-300 ease-in-out", isAppear.value ? "" : "pointer-events-none opacity-0"]),
          onClick: _cache[0] || (_cache[0] = ($event) => goTop())
        }, _cache[1] || (_cache[1] = [
          createBaseVNode("i", { class: "icon icon-arrowR -rotate-90 block" }, null, -1)
        ]), 2),
        createBaseVNode("footer", _hoisted_1$1, [
          createVNode(_component_RouterLink, {
            to: "/",
            class: "footerLogo mx-auto w-fit"
          }, {
            default: withCtx(() => _cache[2] || (_cache[2] = [
              createBaseVNode("img", {
                src: _imports_0,
                alt: "logo"
              }, null, -1)
            ])),
            _: 1
          }),
          createBaseVNode("div", _hoisted_2$1, [
            createVNode(_component_RouterLink, {
              to: "/about",
              class: "footerLink"
            }, {
              default: withCtx(() => [
                createTextVNode(toDisplayString(_ctx.$t("about.topic")), 1)
              ]),
              _: 1
            }),
            createVNode(_component_RouterLink, {
              to: "/source",
              class: "footerLink"
            }, {
              default: withCtx(() => [
                createTextVNode(toDisplayString(_ctx.$t("source.topic")), 1)
              ]),
              _: 1
            })
          ]),
          createBaseVNode("div", _hoisted_3, toDisplayString(_ctx.$t("global.copyright")), 1)
        ])
      ], 64);
    };
  }
};
const Footer = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-cd3b187e"]]);
const _hoisted_1 = { class: "ConfigBox" };
const _hoisted_2 = { class: "ContainerBox" };
const _sfc_main = {
  __name: "App",
  setup(__props) {
    const { locale } = useI18n();
    const viewportStore = useViewportStore();
    onMounted(() => {
      const currentLang = ref(localStorage.getItem("locale"));
      if (currentLang.value !== null) {
        locale.value = currentLang.value;
      }
      viewportStore.startListeners();
    });
    onBeforeUnmount(() => {
      viewportStore.stopListeners();
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createVNode(Header),
        createBaseVNode("div", _hoisted_2, [
          createVNode(unref(RouterView))
        ]),
        createVNode(Footer)
      ]);
    };
  }
};
const scriptRel = "modulepreload";
const assetsURL = function(dep) {
  return "/" + dep;
};
const seen = {};
const __vitePreload = function preload(baseModule, deps, importerUrl) {
  let promise = Promise.resolve();
  if (deps && deps.length > 0) {
    document.getElementsByTagName("link");
    const cspNonceMeta = document.querySelector(
      "meta[property=csp-nonce]"
    );
    const cspNonce = (cspNonceMeta == null ? void 0 : cspNonceMeta.nonce) || (cspNonceMeta == null ? void 0 : cspNonceMeta.getAttribute("nonce"));
    promise = Promise.allSettled(
      deps.map((dep) => {
        dep = assetsURL(dep);
        if (dep in seen) return;
        seen[dep] = true;
        const isCss = dep.endsWith(".css");
        const cssSelector = isCss ? '[rel="stylesheet"]' : "";
        if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) {
          return;
        }
        const link = document.createElement("link");
        link.rel = isCss ? "stylesheet" : scriptRel;
        if (!isCss) {
          link.as = "script";
        }
        link.crossOrigin = "";
        link.href = dep;
        if (cspNonce) {
          link.setAttribute("nonce", cspNonce);
        }
        document.head.appendChild(link);
        if (isCss) {
          return new Promise((res, rej) => {
            link.addEventListener("load", res);
            link.addEventListener(
              "error",
              () => rej(new Error(`Unable to preload CSS for ${dep}`))
            );
          });
        }
      })
    );
  }
  function handlePreloadError(err) {
    const e = new Event("vite:preloadError", {
      cancelable: true
    });
    e.payload = err;
    window.dispatchEvent(e);
    if (!e.defaultPrevented) {
      throw err;
    }
  }
  return promise.then((res) => {
    for (const item of res || []) {
      if (item.status !== "rejected") continue;
      handlePreloadError(item.reason);
    }
    return baseModule().catch(handlePreloadError);
  });
};
const routes = [
  {
    path: "/",
    name: "index",
    component: () => __vitePreload(() => import("./index-BAO0FdtV.js"), true ? __vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]) : void 0),
    meta: {
      requiresAuth: false
    }
  },
  {
    path: "/login",
    name: "login",
    component: () => __vitePreload(() => import("./index-DwxHNHFM.js"), true ? __vite__mapDeps([16,1,2,3,4,5,6,7,12,13,8,14]) : void 0),
    meta: {
      requiresAuth: false
    }
  },
  {
    path: "/filter",
    name: "filter",
    component: () => __vitePreload(() => import("./index-CIdbkVTV.js"), true ? __vite__mapDeps([17,10,1,2,3,4,5,6,7,11,8,14]) : void 0),
    meta: {
      requiresAuth: false
    }
  },
  {
    path: "/movie",
    children: [
      {
        path: "",
        name: "movie",
        component: () => __vitePreload(() => import("./index-Cum8M6dN.js"), true ? __vite__mapDeps([18,1,2,3,4,5,6,7,10,11,12,13,8,14]) : void 0),
        meta: {
          requiresAuth: false
        }
      },
      {
        path: ":id",
        name: "movieId",
        component: () => __vitePreload(() => import("./_id_-DyyyOjZs.js"), true ? __vite__mapDeps([19,1,2,3,4,5,6,7,8,9,20,21,12,13,14]) : void 0),
        meta: {
          requiresAuth: false
        }
      }
    ]
  },
  {
    path: "/show",
    children: [
      {
        path: "",
        name: "show",
        component: () => __vitePreload(() => import("./index-DZbKIjx2.js"), true ? __vite__mapDeps([22,1,2,3,4,5,6,7,10,11,12,13,8,14]) : void 0),
        meta: {
          requiresAuth: false
        }
      },
      {
        path: ":id",
        name: "showId",
        component: () => __vitePreload(() => import("./_id_-BbigD8Q3.js"), true ? __vite__mapDeps([23,1,2,3,4,5,6,7,8,9,20,21,12,13,14,24]) : void 0),
        meta: {
          requiresAuth: false
        }
      }
    ]
  },
  {
    path: "/person",
    name: "person",
    component: () => __vitePreload(() => import("./index-qV4GCOQS.js"), true ? __vite__mapDeps([25,1,2,3,4,5,6,7]) : void 0),
    children: [
      {
        path: ":id",
        name: "personId",
        component: () => __vitePreload(() => import("./_id_-Dk9O_5p3.js"), true ? __vite__mapDeps([26,1,2,3,4,5,6,7,12,13,8,14,27]) : void 0),
        meta: {
          requiresAuth: false
        }
      }
    ]
  },
  {
    path: "/search",
    component: () => __vitePreload(() => import("./index-BWEcuOFM.js"), true ? __vite__mapDeps([28,1,2,3,4,5,6,7]) : void 0),
    children: [
      {
        path: ":type",
        name: "searchType",
        component: () => __vitePreload(() => import("./_type_-CZIMTXaw.js"), true ? __vite__mapDeps([29,1,2,3,4,5,6,7,10,11,12,13,8,14]) : void 0),
        meta: {
          requiresAuth: false
        }
      }
    ]
  },
  {
    path: "/member",
    children: [
      {
        path: "",
        name: "member",
        component: () => __vitePreload(() => import("./index-mbAYdeSD.js"), true ? __vite__mapDeps([30,8,1,2,3,4,5,6,7,12,13,14]) : void 0),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: "favorite/:type",
        name: "memberFavoriteType",
        component: () => __vitePreload(() => import("./_type_-C1CqND1m.js"), true ? __vite__mapDeps([31,1,2,3,4,5,6,7,8,9,12,13,14]) : void 0),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: "watchlist/:type",
        name: "memberWatchlistType",
        component: () => __vitePreload(() => import("./_type_-Cj0GUW-s.js"), true ? __vite__mapDeps([32,1,2,3,4,5,6,7,8,9,12,13,14]) : void 0),
        meta: {
          requiresAuth: true
        }
      }
    ]
  },
  {
    path: "/about",
    name: "about",
    component: () => __vitePreload(() => import("./index-CGWv3YKo.js"), true ? __vite__mapDeps([33,1,2,3,4,5,6,7,8,14]) : void 0),
    meta: {
      requiresAuth: false
    }
  },
  {
    path: "/source",
    name: "source",
    component: () => __vitePreload(() => import("./index-BCAm1A9H.js"), true ? __vite__mapDeps([34,1,2,3,4,5,6,7,8,14]) : void 0),
    meta: {
      requiresAuth: false
    }
  },
  {
    path: "/:pathMatch(.*)*",
    name: "error",
    component: () => __vitePreload(() => import("./error-nhkIKkPU.js"), true ? __vite__mapDeps([35,1,2,3,4,5,6,7]) : void 0),
    meta: {
      requiresAuth: false
    }
  }
];
function createRouterInstance(isSSR = false) {
  const router2 = createRouter({
    history: isSSR ? createMemoryHistory() : createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
      if (savedPosition) {
        return savedPosition;
      } else {
        return { top: 0 };
      }
    }
  });
  if (typeof window !== "undefined") {
    router2.beforeEach(async (to, from, next) => {
      const user = useUserStore();
      if (getCookie("account_id") !== null && getCookie("session_id") !== null) {
        await user.getUserInfo(getCookie("account_id"), getCookie("session_id"));
      }
      if (to.meta.requiresAuth && !user.userIsLogin) {
        next("/login");
      } else {
        next();
      }
    });
  }
  return router2;
}
const global$2 = { "movie": "電影", "show": "節目", "login": "登入", "account": "帳號", "password": "密碼", "loginSuccess": "登入成功", "copyright": "版權所有© 2025 Jane Yang", "error": "哎呀!查無此頁面", "searchBar": "請輸入關鍵字...", "member": "會員中心", "myFavorite": "我的最愛", "myWatchList": "我的待看清單", "openMenu": "開啟選單", "closeMenu": "關閉選單", "logout": "登出", "logoutSuccess": "登出成功", "episode": "集", "episodes": "集", "seeMore": "查看更多", "confirm": "確認", "addFavoriteSuccess": "成功加入我的最愛", "removeFavoriteSuccess": "成功從我的最愛移除", "addWatchlistSuccess": "成功加入待看清單", "removeWatchlistSuccess": "成功從待看清單移除", "resetRateSuccess": "重置評分成功", "rateSuccess": "評分成功", "pleaseLoginFirst": "請先進行登入", "myRate": "我的評分", "notRateYet": "尚未評分", "addFavorite": "加入我的最愛", "addWatchlist": "加入待看清單", "castList": "演員名單", "staffList": "工作人員", "allSeasons": "所有季數", "previous": "上一個", "next": "下一個", "noData": "查無資料", "moreContent": "更多內容", "backToIndex": "返回首頁", "welcomeName": "歡迎 {name}" };
const week$2 = { "0": "日", "1": "一", "2": "二", "3": "三", "4": "四", "5": "五", "6": "六" };
const show$2 = { "airingTv": "現正熱播劇集", "popularTv": "高人氣劇集", "airingTodayTv": "今日撥出劇集", "topRatedTv": "高評分劇集" };
const movie$2 = { "playingMovie": "現正熱映電影", "popularMovie": "高人氣電影", "topRatedMovie": "高評分電影", "upcomingMovie": "即將上映電影" };
const search$2 = { "search": "搜尋", "result": "找到以下結果" };
const person$2 = { "birthday": "生日", "gender": "性別", "female": "女", "male": "男", "birthPlace": "出生地", "job": "職業", "dramaProduct": "電視劇作品", "tear": "年份", "name": "名稱", "character": "角色", "movieProduct": "電影作品" };
const about$2 = { "topic": "關於我們", "p1": "因為自己很喜歡看影集及電影，看完都會對該影集/電影進行深入探討，像是故事介紹、演員及其他網友們觀後心得等等，又或是在還沒開始觀看前，先上網蒐集相關資訊，看看劇情是否值得一看。", "p2": "加上職業剛好是網頁前端工程師，於是就想說動手試試看自己寫一個網站出來，藉由The Movie Database (TMDB)開設之API進行串接，並一步一腳印從無到有慢慢打造出來，就這樣Drama Lover(DL)誕生了。", "p3": "希望所有跟我一樣熱愛影集/電影的各位也能透過我撰寫的網站獲得相關資訊，並且可以對看過的或是未來要看的影集/電影做不同操作功能，像是加入我的最愛及待看清單，甚至是評分讓更多人能夠對該影集/電影有個大概的評分了解。" };
const source$2 = { "topic": "資料來源", "p1": "The Movie Database (TMDB) 是一個由社群建立起來的電影/影集資料庫，從西元2008年就開始逐年增加資料量，並且也開發了API供所有有需要的人做使用，此網站就是透過TMDB的API獲取得來不易的資料所建立起來的，在此非常感謝TMDB的開發團隊。" };
const zh = {
  global: global$2,
  week: week$2,
  show: show$2,
  movie: movie$2,
  search: search$2,
  person: person$2,
  about: about$2,
  source: source$2
};
const global$1 = { "movie": "电影", "show": "节目", "login": "登录", "account": "帐号", "password": "密码", "loginSuccess": "登入成功", "copyright": "版权所有© 2025 Jane Yang", "error": "哎呀!查无此页面", "searchBar": "请输入关键字...", "member": "会员中心", "myFavorite": "我的最爱", "myWatchList": "我的待看清单", "logout": "登出", "logoutSuccess": "登出成功", "episode": "集", "episodes": "集", "seeMore": "查看更多", "confirm": "确认", "addFavoriteSuccess": "成功加入我的最爱", "removeFavoriteSuccess": "成功从我的最爱移除", "addWatchlistSuccess": "成功加入待看清单", "removeWatchlistSuccess": "成功从待看清单移除", "resetRateSuccess": "重置评分成功", "rateSuccess": "评分成功", "pleaseLoginFirst": "请先进行登入", "myRate": "我的评分", "notRateYet": "尚未评分", "addFavorite": "加入我的最爱", "addWatchlist": "加入待看清单", "castList": "演员名单", "staffList": "工作人员", "allSeasons": "所有季数", "previous": "上一个", "next": "下一个", "noData": "查无资料", "moreContent": "更多内容", "backToIndex": "返回首頁", "welcomeName": "欢迎 {name}" };
const week$1 = { "0": "日", "1": "一", "2": "二", "3": "三", "4": "四", "5": "五", "6": "六" };
const show$1 = { "airingTv": "现正热播剧集", "popularTv": "高人气剧集", "airingTodayTv": "今日拨出剧集", "topRatedTv": "高评分剧集" };
const movie$1 = { "playingMovie": "现正热映电影", "popularMovie": "高人气电影", "topRatedMovie": "高评分电影", "upcomingMovie": "即将上映电影" };
const search$1 = { "search": "搜索", "result": "找到以下结果" };
const person$1 = { "birthday": "生日", "gender": "性别", "female": "女", "male": "男", "birthPlace": "出生地", "job": "职业", "dramaProduct": "电视剧作品", "tear": "年份", "name": "名称", "character": "角色", "movieProduct": "电影作品" };
const about$1 = { "topic": "关于我们", "p1": "因为自己很喜欢看影集及电影，看完都会对该影集/电影进行深入探讨，像是故事介绍、演员及其他网友们观后心得等等，又或是在还没开始观看前，先上网搜集相关资讯，看看剧情是否值得一看。", "p2": "加上职业刚好是网页前端工程师，于是就想说动手试试看自己写一个网站出来，藉由The Movie Database (TMDB)开设之API进行串接，并一步一脚印从无到有慢慢打造出来，就这样Drama Lover(DL)诞生了。", "p3": "希望所有跟我一样热爱影集/电影的各位也能透过我撰写的网站获得相关资讯，并且可以对看过的或是未来要看的影集/电影做不同操作功能，像是加入我的最爱及待看清单，甚至是评分让更多人能够对该影集/电影有个大概的评分了解。" };
const source$1 = { "topic": "资料来源", "p1": "The Movie Database (TMDB) 是一个由社群建立起来的电影/影集资料库，从西元2008年就开始逐年增加资料量，并且也开发了API供所有有需要的人做使用，此网站就是透过TMDB的API获取得来不易的资料所建立起来的，在此非常感谢TMDB的开发团队。" };
const cn = {
  global: global$1,
  week: week$1,
  show: show$1,
  movie: movie$1,
  search: search$1,
  person: person$1,
  about: about$1,
  source: source$1
};
const global = { "movie": "Movie", "show": "Show", "login": "Login", "account": "Account", "password": "Password", "loginSuccess": "Login successful", "copyright": "Copyright © 2025 Jane Yang. All rights reserved.", "error": "Oops!This page is not found.", "searchBar": "Enter keywords...", "member": "Member center", "myFavorite": "My favorite", "myWatchList": "WatchList", "openMenu": "Open menu", "closeMenu": "Close menu", "logout": "Logout", "logoutSuccess": "Logout successful", "episode": "episode", "episodes": "episodes", "seeMore": "More", "confirm": "Confirm", "addFavoriteSuccess": "Successfully added to my favorites", "removeFavoriteSuccess": "Successfully removed from my favorites", "addWatchlistSuccess": "Successfully added to watchlist", "removeWatchlistSuccess": "Successfully removed from watchlist", "resetRateSuccess": "Reset rating successfully", "rateSuccess": "Rating successful", "pleaseLoginFirst": "Please log in first", "myRate": "My score", "notRateYet": "Not rated yet", "addFavorite": "Add to my favorite", "addWatchlist": "Add to watchlist", "castList": "Cast list", "staffList": "Staff list", "allSeasons": "All seasons", "previous": "Previous", "next": "Next", "noData": "No results", "moreContent": "More", "backToIndex": "Back to home page", "welcomeName": "Welcome {name}" };
const week = { "0": "Sunday", "1": "Monday", "2": "Tuesday", "3": "Wednesday", "4": "Thursday", "5": "Friday", "6": "Saturday" };
const show = { "airingTv": "Currently airing television series", "popularTv": "Popular television series", "airingTodayTv": "Airing today", "topRatedTv": "Top rated television series" };
const movie = { "playingMovie": "Now playing movies", "popularMovie": "Popular movies", "topRatedMovie": "Top rated movies", "upcomingMovie": "Upcoming movies" };
const search = { "search": "Search for", "result": "found the following results." };
const person = { "birthday": "Birthday", "gender": "Gender", "female": "female", "male": "male", "birthPlace": "Place of birth", "job": "Known for", "dramaProduct": "Television series", "tear": "Year", "name": "Name", "character": "Character", "movieProduct": "Film" };
const about = { "topic": "About us", "p1": "Because I like watching series drama and movies very much, I will conduct in-depth discussions about the series drama/movie after watching it, such as story introduction, actors and other netizens’ comments after watching it, etc. Or, before I start watching, I will go online to collect relevant information to think about whether it is worth watching.", "p2": "In addition, I'm a web front-end engineer by profession, so I thought I could try and write a website by myself, fetch data through the API provided by The Movie Database (TMDB), and build it from step by step, and thus Drama Lover (DL) was born.", "p3": "I hope that who love series drama/movies like me can also obtain relevant information through the website I wrote, and can perform different operations on the series drama/movies which have watched or want to watch in the future, such as adding them to my favorites and to-watch lists, and even rating them so that more people can have a general understanding of the series drama/movies." };
const source = { "topic": "Source", "p1": "The Movie Database (TMDB) is a series drama/movies database established by the community. It has been increasing the amount of data year by year since 2008, and has also developed an API for use by all those in need. This website was established by obtaining hard-earned data through TMDB's API. I am very grateful to the development team of TMDB." };
const en = {
  global,
  week,
  show,
  movie,
  search,
  person,
  about,
  source
};
const app = createApp(_sfc_main);
const pinia = createPinia();
app.provide(ID_INJECTION_KEY, {
  prefix: 1024,
  current: 0
});
app.use(pinia);
const router = createRouterInstance();
const i18n = createI18n({
  legacy: false,
  locale: "zh-TW",
  fallbackLocale: "zh-TW",
  messages: {
    "zh-TW": zh,
    "zh-CN": cn,
    "en-US": en
  }
});
app.use(router);
app.use(i18n);
app.use(installer);
app.mount("#app");
export {
  _export_sfc as _,
  apiRequest as a,
  getCookie as g,
  useUserStore as u
};
