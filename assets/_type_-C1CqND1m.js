import { bP as useI18n, r as ref, a7 as reactive, bO as useRoute, c as computed, ag as onBeforeMount, bN as useRouter, w as watch, y as createElementBlock, z as openBlock, A as createBaseVNode, P as createVNode, I as withCtx, aD as resolveComponent, N as toDisplayString, H as createBlock, K as createCommentVNode, D as normalizeClass, u as unref, O as Fragment, an as renderList, M as createTextVNode } from "./vue-CmclmBdx.js";
import { s as storeToRefs } from "./pinia-QRlfNOmY.js";
import { u as useApiConfigStore } from "./apiConfig-QxoHLURK.js";
import { a as apiRequest, g as getCookie } from "./index-7lo_Phz_.js";
import { L as LoadingPage } from "./page-DYY7bfD8.js";
import { a as ElRate, E as ElMessageBox } from "./element-plus-BqqwJ07U.js";
import "./vendor-3nH66FWi.js";
import "./swiper-Bjhxao44.js";
import "./axios-DYLuwdcf.js";
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
  class: ""
};
const _hoisted_13 = { class: "TabBtnBox mb-10" };
const _hoisted_14 = {
  key: 0,
  class: "DramaListBox"
};
const _hoisted_15 = {
  key: 0,
  class: "DramaListPic"
};
const _hoisted_16 = ["src"];
const _hoisted_17 = { class: "DramaListInfo" };
const _hoisted_18 = { class: "DramaListTop" };
const _hoisted_19 = { class: "DramaListTag" };
const _hoisted_20 = ["onClick"];
const _hoisted_21 = { class: "" };
const _hoisted_22 = { class: "DramaListRate" };
const _hoisted_23 = { class: "DramaListRateNum" };
const _hoisted_24 = { class: "DramaListDes" };
const _hoisted_25 = { class: "DramaListBot" };
const _hoisted_26 = { class: "DetailBannerMix" };
const _hoisted_27 = { class: "DetailBannerMixTit" };
const _hoisted_28 = { class: "DetailBannerRateBtn" };
const _hoisted_29 = { class: "text" };
const _hoisted_30 = { class: "DetailBannerRateScore" };
const _sfc_main = {
  __name: "[type]",
  setup(__props) {
    const { locale, t } = useI18n();
    const route = useRoute();
    const router = useRouter();
    const loadingPage = ref(true);
    const apiConfigObj = useApiConfigStore();
    apiConfigObj.getApiConfig();
    const { apiConfig } = storeToRefs(apiConfigObj);
    const mainData = reactive([]);
    const currentPage = ref(1);
    const totalResults = ref(0);
    const type = ref(route.params.type);
    const type2 = computed(() => {
      if (type.value === "movie") {
        return "movies";
      } else if (type.value === "show") {
        return "tv";
      }
    });
    const type3 = computed(() => {
      if (type.value === "movie") {
        return "movie";
      } else if (type.value === "show") {
        return "tv";
      }
    });
    const fetchData = async () => {
      try {
        loadingPage.value = true;
        const res = await apiRequest.get(`/account/${getCookie("account_id")}/favorite/${type2.value}`, {
          params: {
            language: locale.value,
            page: currentPage.value,
            sort_by: "created_at.desc"
          }
        });
        Object.assign(mainData, res.results);
        totalResults.value = res.total_results;
        for (let i = 0; i < mainData.length; i++) {
          if (route.params.type === "movie") {
            mainData[i].category = "movie";
          } else if (route.params.type === "show") {
            mainData[i].category = "show";
          }
        }
        const fetchDetails = async (items) => {
          const results = await Promise.all(
            items.map(async (item) => {
              const detail = await apiRequest.get(`/${item.category === "movie" ? "movie" : "tv"}/${item.id}/account_states`, {
                params: {
                  session_id: getCookie("session_id")
                }
              });
              return {
                ...item,
                detail
              };
            })
          );
          mainData.splice(0, mainData.length, ...results);
        };
        await fetchDetails(mainData);
        for (let i = 0; i < mainData.length; i++) {
          if (mainData[i].detail.rated !== false) {
            mainData[i].detail.ratedScore = mainData[i].detail.rated.value;
          } else {
            mainData[i].detail.ratedScore = 0;
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        loadingPage.value = false;
      }
    };
    onBeforeMount(async () => {
      if (route.params.type !== "movie" && route.params.type !== "show") {
        await router.push({
          path: "/member/favorite/movie"
        });
      }
      fetchData();
    });
    watch(locale, () => {
      fetchData();
    });
    async function changeType(newType) {
      loadingPage.value = true;
      mainData.length = 0;
      currentPage.value = 1;
      type.value = newType;
      await router.push({
        path: `/member/favorite/${newType}`
      });
      const res = await apiRequest.get(`/account/${getCookie("account_id")}/favorite/${type2.value}`, {
        params: {
          language: locale.value,
          page: currentPage.value,
          sort_by: "created_at.desc"
        }
      });
      Object.assign(mainData, res.results);
      totalResults.value = res.total_results;
      for (let i = 0; i < mainData.length; i++) {
        mainData[i].category = type.value;
      }
      const fetchDetails = async (items) => {
        const results = await Promise.all(
          items.map(async (item) => {
            const detail = await apiRequest.get(`/${item.category === "movie" ? "movie" : "tv"}/${item.id}/account_states`, {
              params: {
                session_id: getCookie("session_id")
              }
            });
            return {
              ...item,
              detail
            };
          })
        );
        mainData.splice(0, mainData.length, ...results);
      };
      await fetchDetails(mainData);
      for (let i = 0; i < mainData.length; i++) {
        if (mainData[i].detail.rated !== false) {
          mainData[i].detail.ratedScore = mainData[i].detail.rated.value;
        } else {
          mainData[i].detail.ratedScore = 0;
        }
      }
      loadingPage.value = false;
    }
    async function changePage(page) {
      loadingPage.value = true;
      mainData.length = 0;
      currentPage.value = page;
      const res = await apiRequest.get(`/account/${getCookie("account_id")}/favorite/${type2.value}`, {
        params: {
          language: locale.value,
          page: currentPage.value,
          sort_by: "created_at.desc"
        }
      });
      Object.assign(mainData, res.results);
      totalResults.value = res.total_results;
      for (let i = 0; i < mainData.length; i++) {
        if (route.params.type === "movie") {
          mainData[i].category = "movie";
        } else if (route.params.type === "show") {
          mainData[i].category = "show";
        }
      }
      const fetchDetails = async (items) => {
        const results = await Promise.all(
          items.map(async (item) => {
            const detail = await apiRequest.get(`/${item.category === "movie" ? "movie" : "tv"}/${item.id}/account_states`, {
              params: {
                session_id: getCookie("session_id")
              }
            });
            return {
              ...item,
              detail
            };
          })
        );
        mainData.splice(0, mainData.length, ...results);
      };
      await fetchDetails(mainData);
      for (let i = 0; i < mainData.length; i++) {
        if (mainData[i].detail.rated !== false) {
          mainData[i].detail.ratedScore = mainData[i].detail.rated.value;
        } else {
          mainData[i].detail.ratedScore = 0;
        }
      }
      loadingPage.value = false;
    }
    function favoriteAct(id) {
      apiRequest.post(`/account/${getCookie("account_id")}/favorite`, {
        media_type: type3.value,
        media_id: id,
        favorite: false
      }).then(async (res) => {
        if (res.success) {
          await apiRequest.get(`/${type3.value}/${id}/account_states`);
          ElMessageBox.alert(t("global.removeFavoriteSuccess"), "", {
            center: true,
            confirmButtonText: t("global.confirm")
          });
          fetchData();
        }
      });
    }
    function rateAct(id, type4, score) {
      if (score === 0) {
        apiRequest.delete(`/${type4 === "movie" ? "movie" : "tv"}/${id}/rating`, {
          session_id: getCookie("session_id")
        }).then(async (res) => {
          ElMessageBox.alert(t("global.resetRateSuccess"), "", {
            center: true,
            confirmButtonText: t("global.confirm")
          });
        });
      } else {
        apiRequest.post(`/${type4 === "movie" ? "movie" : "tv"}/${id}/rating`, {
          session_id: getCookie("session_id"),
          value: score
        }).then(async (res) => {
          ElMessageBox.alert(t("global.rateSuccess"), "", {
            center: true,
            confirmButtonText: t("global.confirm")
          });
        });
      }
    }
    return (_ctx, _cache) => {
      const _component_RouterLink = resolveComponent("RouterLink");
      const _component_ElPagination = resolveComponent("ElPagination");
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createBaseVNode("div", _hoisted_2, [
          createBaseVNode("div", _hoisted_3, [
            createBaseVNode("nav", _hoisted_4, [
              createBaseVNode("ul", _hoisted_5, [
                createBaseVNode("li", _hoisted_6, [
                  createVNode(_component_RouterLink, {
                    to: "/member",
                    class: "MemberMenuListLink"
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
                    class: "MemberMenuListLink active"
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
              createBaseVNode("h1", _hoisted_10, toDisplayString(_ctx.$t("global.myFavorite")), 1),
              createBaseVNode("div", _hoisted_11, [
                !loadingPage.value ? (openBlock(), createElementBlock("div", _hoisted_12, [
                  createBaseVNode("div", _hoisted_13, [
                    createBaseVNode("div", {
                      class: normalizeClass(["TabBtn", { active: unref(route).fullPath.indexOf("movie") > -1 }]),
                      onClick: _cache[0] || (_cache[0] = ($event) => changeType("movie"))
                    }, toDisplayString(_ctx.$t("global.movie")), 3),
                    createBaseVNode("div", {
                      class: normalizeClass(["TabBtn", { active: unref(route).fullPath.indexOf("show") > -1 }]),
                      onClick: _cache[1] || (_cache[1] = ($event) => changeType("show"))
                    }, toDisplayString(_ctx.$t("global.show")), 3)
                  ]),
                  mainData.length > 0 ? (openBlock(), createElementBlock("ul", _hoisted_14, [
                    (openBlock(true), createElementBlock(Fragment, null, renderList(mainData, (fpItem) => {
                      return openBlock(), createElementBlock("li", {
                        key: fpItem.id,
                        class: "DramaList"
                      }, [
                        fpItem.poster_path !== "" ? (openBlock(), createElementBlock("div", _hoisted_15, [
                          createBaseVNode("img", {
                            src: `${unref(apiConfig).images.secure_base_url}w154${fpItem.poster_path}`,
                            loading: "lazy",
                            alt: ""
                          }, null, 8, _hoisted_16)
                        ])) : createCommentVNode("", true),
                        createBaseVNode("div", _hoisted_17, [
                          createBaseVNode("div", _hoisted_18, [
                            createBaseVNode("div", _hoisted_19, toDisplayString(fpItem.release_date ?? fpItem.first_air_date), 1),
                            createBaseVNode("div", {
                              class: "DramaListAct",
                              onClick: ($event) => favoriteAct(fpItem.id)
                            }, _cache[2] || (_cache[2] = [
                              createBaseVNode("i", { class: "icon icon-heartFill" }, null, -1)
                            ]), 8, _hoisted_20)
                          ]),
                          createVNode(_component_RouterLink, {
                            to: `/${fpItem.category}/${fpItem.id}`,
                            class: "DramaListTitle"
                          }, {
                            default: withCtx(() => [
                              createBaseVNode("h2", _hoisted_21, toDisplayString(fpItem.title ?? fpItem.name), 1)
                            ]),
                            _: 2
                          }, 1032, ["to"]),
                          createBaseVNode("div", _hoisted_22, [
                            _cache[3] || (_cache[3] = createBaseVNode("i", { class: "icon icon-starFill" }, null, -1)),
                            createBaseVNode("div", _hoisted_23, toDisplayString(fpItem.vote_average), 1)
                          ]),
                          createBaseVNode("p", _hoisted_24, toDisplayString(fpItem.overview), 1),
                          createBaseVNode("div", _hoisted_25, [
                            createBaseVNode("div", _hoisted_26, [
                              createBaseVNode("div", _hoisted_27, [
                                createBaseVNode("div", _hoisted_28, [
                                  createBaseVNode("div", _hoisted_29, toDisplayString(_ctx.$t("global.myRate")) + ":", 1)
                                ]),
                                createBaseVNode("div", _hoisted_30, toDisplayString(fpItem.detail.ratedScore > 0 ? fpItem.detail.ratedScore : _ctx.$t("global.notRateYet")), 1)
                              ]),
                              createVNode(unref(ElRate), {
                                modelValue: fpItem.detail.ratedScore,
                                "onUpdate:modelValue": ($event) => fpItem.detail.ratedScore = $event,
                                max: 10,
                                clearable: "",
                                onChange: ($event) => rateAct(fpItem.id, fpItem.category, fpItem.detail.ratedScore)
                              }, null, 8, ["modelValue", "onUpdate:modelValue", "onChange"])
                            ])
                          ])
                        ])
                      ]);
                    }), 128))
                  ])) : createCommentVNode("", true),
                  mainData.length > 0 ? (openBlock(), createBlock(_component_ElPagination, {
                    key: 1,
                    layout: "prev, pager, next",
                    "current-page": currentPage.value,
                    total: totalResults.value,
                    "pager-count": 5,
                    "default-page-size": 20,
                    onCurrentChange: changePage
                  }, null, 8, ["current-page", "total"])) : createCommentVNode("", true)
                ])) : (openBlock(), createBlock(LoadingPage, {
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
