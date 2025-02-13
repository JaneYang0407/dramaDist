import { y as createElementBlock, z as openBlock, K as createCommentVNode, A as createBaseVNode, u as unref, N as toDisplayString, D as normalizeClass, bP as useI18n, a7 as reactive, r as ref, ag as onBeforeMount, w as watch, H as createBlock, P as createVNode, O as Fragment, an as renderList, bO as useRoute, bN as useRouter } from "./vue-CmclmBdx.js";
import { _ as _export_sfc, u as useUserStore, a as apiRequest, g as getCookie } from "./index-7lo_Phz_.js";
import { s as storeToRefs } from "./pinia-QRlfNOmY.js";
import { u as useApiConfigStore } from "./apiConfig-QxoHLURK.js";
import { P as PersonItem } from "./item-D1UotU8M.js";
import { L as LoadingPage } from "./page-DYY7bfD8.js";
import { a as ElRate, E as ElMessageBox } from "./element-plus-BqqwJ07U.js";
import "./vendor-3nH66FWi.js";
import "./swiper-Bjhxao44.js";
import "./axios-DYLuwdcf.js";
const _hoisted_1$1 = { class: "DramaInfoBox relative md:flex" };
const _hoisted_2$1 = {
  key: 0,
  class: "DramaInfoPic overflow-hidden"
};
const _hoisted_3$1 = ["src"];
const _hoisted_4$1 = { class: "DramaInfoTop flex items-center mb-1" };
const _hoisted_5$1 = { class: "DramaInfoTitle font-bold mr-2" };
const _hoisted_6$1 = { class: "DramaInfoTag text-sm" };
const _hoisted_7$1 = { class: "DramaInfoTag text-sm" };
const _hoisted_8$1 = { class: "DramaInfoRate flex items-center mb-6" };
const _hoisted_9$1 = { class: "DramaInfoRateNum text-sm" };
const _hoisted_10$1 = { class: "DramaInfoDes text-sm" };
const _sfc_main$1 = {
  __name: "info",
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
      return openBlock(), createElementBlock("div", _hoisted_1$1, [
        props.data.poster_path !== "" && props.data.poster_path !== null ? (openBlock(), createElementBlock("div", _hoisted_2$1, [
          createBaseVNode("img", {
            src: `${unref(apiConfig).images.secure_base_url}w154${props.data.poster_path}`,
            loading: "lazy",
            alt: ""
          }, null, 8, _hoisted_3$1)
        ])) : createCommentVNode("", true),
        createBaseVNode("div", {
          class: normalizeClass(["DramaInfo", props.data.poster_path === "" || props.data.poster_path === null ? "self" : ""])
        }, [
          createBaseVNode("div", _hoisted_4$1, [
            createBaseVNode("div", _hoisted_5$1, toDisplayString(__props.data.name), 1),
            createBaseVNode("div", _hoisted_6$1, toDisplayString(__props.data.episode_count) + " " + toDisplayString(__props.data.episode_count > 1 ? _ctx.$t("global.episodes") : _ctx.$t("global.episode")), 1),
            _cache[0] || (_cache[0] = createBaseVNode("div", { class: "DramaInfoDecor text-sm" }, "．", -1)),
            createBaseVNode("div", _hoisted_7$1, toDisplayString(__props.data.air_date), 1)
          ]),
          createBaseVNode("div", _hoisted_8$1, [
            _cache[1] || (_cache[1] = createBaseVNode("i", { class: "icon icon-starFill text-xs mr-1" }, null, -1)),
            createBaseVNode("div", _hoisted_9$1, toDisplayString(__props.data.vote_average), 1)
          ]),
          createBaseVNode("div", _hoisted_10$1, toDisplayString(__props.data.overview), 1)
        ], 2)
      ]);
    };
  }
};
const DramaInfo = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-d6b3d492"]]);
const _hoisted_1 = { key: 0 };
const _hoisted_2 = { class: "DetailBannerBox" };
const _hoisted_3 = { class: "DetailBanner" };
const _hoisted_4 = ["srcset"];
const _hoisted_5 = ["srcset"];
const _hoisted_6 = ["src"];
const _hoisted_7 = { class: "DetailBannerInfoBox Container Space" };
const _hoisted_8 = { class: "DetailBannerPoster" };
const _hoisted_9 = ["src"];
const _hoisted_10 = { class: "DetailBannerInfo" };
const _hoisted_11 = { class: "DetailBannerCategory" };
const _hoisted_12 = {
  key: 0,
  class: "DetailBannerTag"
};
const _hoisted_13 = { class: "DetailBannerTitle" };
const _hoisted_14 = { class: "DetailBannerRate" };
const _hoisted_15 = { class: "DetailBannerRateNum" };
const _hoisted_16 = { class: "DetailBannerMix" };
const _hoisted_17 = { class: "DetailBannerMixTit" };
const _hoisted_18 = { class: "DetailBannerRateBtn" };
const _hoisted_19 = { class: "text" };
const _hoisted_20 = { class: "DetailBannerRateScore" };
const _hoisted_21 = { class: "DetailBannerActBox" };
const _hoisted_22 = ["aria-label"];
const _hoisted_23 = ["aria-label"];
const _hoisted_24 = { class: "DetailBannerSlogan" };
const _hoisted_25 = { class: "DetailBannerDes" };
const _hoisted_26 = { class: "MainBox outer Container" };
const _hoisted_27 = { class: "InfoBlockBox" };
const _hoisted_28 = { class: "InfoBlock" };
const _hoisted_29 = { class: "Topic2" };
const _hoisted_30 = { class: "flex flex-wrap -mb-5" };
const _hoisted_31 = { class: "InfoBlock" };
const _hoisted_32 = { class: "Topic2" };
const _hoisted_33 = { class: "flex flex-wrap -mb-3.75" };
const _hoisted_34 = { class: "InfoBlock" };
const _hoisted_35 = { class: "Topic2" };
const _hoisted_36 = { class: "grid gap-5 xl:grid-cols-2" };
const _sfc_main = {
  __name: "[id]",
  setup(__props) {
    const { locale, t } = useI18n();
    const route = useRoute();
    const router = useRouter();
    const user = useUserStore();
    const castData = reactive([]);
    const seasonData = reactive([]);
    const tagString = ref("");
    const isRated = ref(false);
    const rateScore = ref(0);
    const isInFavorite = ref(false);
    const isInWatchlist = ref(false);
    const loadingPage = ref(true);
    const apiConfigObj = useApiConfigStore();
    apiConfigObj.getApiConfig();
    const { apiConfig } = storeToRefs(apiConfigObj);
    const fetchData = async () => {
      try {
        loadingPage.value = true;
        const [castRes, seasonRes] = await Promise.all([
          apiRequest.get(`/tv/${route.params.id}/credits`, { params: { language: locale.value } }),
          apiRequest.get(`/tv/${route.params.id}`, { params: { language: locale.value } }),
          ,
        ]);
        Object.assign(castData, castRes);
        Object.assign(seasonData, seasonRes);
        if (!user.userIsLogin) {
          loadingPage.value = false;
        } else {
          const dramaRes = await apiRequest.get(`/tv/${route.params.id}/account_states`, {
            params: {
              session_id: getCookie("session_id")
            }
          });
          isInFavorite.value = dramaRes.favorite;
          isInWatchlist.value = dramaRes.watchlist;
          if (dramaRes.rated !== false && dramaRes.rated.hasOwnProperty("value")) {
            isRated.value = true;
            rateScore.value = dramaRes.rated.value;
          }
        }
        tagString.value = seasonData.genres.map((genre) => genre.name).join("．");
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        loadingPage.value = false;
      }
    };
    onBeforeMount(fetchData);
    watch(locale, () => {
      fetchData();
    });
    function addAct(category) {
      if (user.userIsLogin) {
        if (category === "favorite") {
          apiRequest.post(`/account/${getCookie("account_id")}/favorite`, {
            media_type: "tv",
            media_id: route.params.id,
            favorite: !isInFavorite.value
          }).then(async (res) => {
            if (res.success) {
              const res2 = await apiRequest.get(`/tv/${route.params.id}/account_states`);
              isInFavorite.value = res2.favorite;
              let msg = t("global.addFavoriteSuccess");
              if (!res2.favorite) {
                msg = t("global.removeFavoriteSuccess");
              }
              ElMessageBox.alert(msg, "", {
                center: true,
                confirmButtonText: t("global.confirm")
              });
            }
          });
        } else if (category === "watchlist") {
          apiRequest.post(`/account/${getCookie("account_id")}/watchlist`, {
            media_type: "tv",
            media_id: route.params.id,
            watchlist: !isInWatchlist.value
          }).then(async (res) => {
            if (res.success) {
              const res2 = await apiRequest.get(`/tv/${route.params.id}/account_states`);
              isInWatchlist.value = res2.watchlist;
              let msg = t("global.addWatchlistSuccess");
              if (!res2.watchlist) {
                msg = t("global.removeWatchlistSuccess");
              }
              ElMessageBox.alert(msg, "", {
                center: true,
                confirmButtonText: t("global.confirm")
              });
            }
          });
        } else if (category === "rate") {
          if (rateScore.value === 0) {
            apiRequest.delete(`/tv/${route.params.id}/rating`, {
              session_id: getCookie("session_id")
            }).then(async (res) => {
              isRated.value = false;
              ElMessageBox.alert(t("global.resetRateSuccess"), "", {
                center: true,
                confirmButtonText: t("global.confirm")
              });
            });
          } else {
            apiRequest.post(`/tv/${route.params.id}/rating`, {
              session_id: getCookie("session_id"),
              value: rateScore.value
            }).then(async (res) => {
              isRated.value = true;
              ElMessageBox.alert(t("global.rateSuccess"), "", {
                center: true,
                confirmButtonText: t("global.confirm")
              });
            });
          }
        }
      } else {
        ElMessageBox.alert(t("global.pleaseLoginFirst"), "", {
          center: true,
          confirmButtonText: t("global.confirm"),
          callback: () => {
            router.push({
              name: "login",
              query: {
                from: router.currentRoute.value.fullPath
              }
            });
          }
        });
      }
    }
    return (_ctx, _cache) => {
      return !loadingPage.value ? (openBlock(), createElementBlock("div", _hoisted_1, [
        createBaseVNode("div", _hoisted_2, [
          createBaseVNode("div", _hoisted_3, [
            createBaseVNode("picture", null, [
              createBaseVNode("source", {
                srcset: seasonData.backdrop_path !== "" ? `${unref(apiConfig).images.secure_base_url}w300${seasonData.backdrop_path}` : `${unref(apiConfig).images.secure_base_url}w300${seasonData.poster_path}`,
                media: "(max-width: 575px)"
              }, null, 8, _hoisted_4),
              createBaseVNode("source", {
                srcset: seasonData.backdrop_path !== "" ? `${unref(apiConfig).images.secure_base_url}original${seasonData.backdrop_path}` : `${unref(apiConfig).images.secure_base_url}w1280${seasonData.poster_path}`,
                media: "(max-width: 1920px)"
              }, null, 8, _hoisted_5),
              createBaseVNode("img", {
                class: "w-full h-full free object-cover",
                src: seasonData.backdrop_path !== "" ? `${unref(apiConfig).images.secure_base_url}original${seasonData.backdrop_path}` : `${unref(apiConfig).images.secure_base_url}w342${seasonData.poster_path}`,
                alt: "Banner"
              }, null, 8, _hoisted_6)
            ])
          ]),
          createBaseVNode("div", _hoisted_7, [
            createBaseVNode("div", _hoisted_8, [
              createBaseVNode("img", {
                src: seasonData.poster_path !== "" ? `${unref(apiConfig).images.secure_base_url}w342${seasonData.poster_path}` : `${unref(apiConfig).images.secure_base_url}w300${seasonData.backdrop_path}`,
                alt: "Poster"
              }, null, 8, _hoisted_9)
            ]),
            createBaseVNode("div", _hoisted_10, [
              createBaseVNode("div", _hoisted_11, toDisplayString(_ctx.$t("global.show")), 1),
              tagString.value !== "" ? (openBlock(), createElementBlock("div", _hoisted_12, toDisplayString(tagString.value), 1)) : createCommentVNode("", true),
              createBaseVNode("h1", _hoisted_13, toDisplayString(seasonData.name), 1),
              createBaseVNode("div", _hoisted_14, [
                _cache[4] || (_cache[4] = createBaseVNode("i", { class: "icon icon-starFill" }, null, -1)),
                createBaseVNode("div", _hoisted_15, toDisplayString(seasonData.vote_average), 1)
              ]),
              createBaseVNode("div", _hoisted_16, [
                createBaseVNode("div", _hoisted_17, [
                  createBaseVNode("div", _hoisted_18, [
                    createBaseVNode("div", _hoisted_19, toDisplayString(_ctx.$t("global.myRate")) + ":", 1)
                  ]),
                  createBaseVNode("div", _hoisted_20, toDisplayString(isRated.value ? rateScore.value : _ctx.$t("global.notRateYet")), 1)
                ]),
                createVNode(unref(ElRate), {
                  modelValue: rateScore.value,
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => rateScore.value = $event),
                  max: 10,
                  clearable: "",
                  onChange: _cache[1] || (_cache[1] = ($event) => addAct("rate"))
                }, null, 8, ["modelValue"])
              ]),
              createBaseVNode("div", _hoisted_21, [
                createBaseVNode("button", {
                  type: "button",
                  class: normalizeClass(["DetailBannerAct BtnAny0", isInFavorite.value ? "active" : ""]),
                  "aria-label": _ctx.$t("global.addFavorite"),
                  onClick: _cache[2] || (_cache[2] = ($event) => addAct("favorite"))
                }, [
                  createBaseVNode("i", {
                    class: normalizeClass(["icon", isInFavorite.value ? "icon-heartFill" : "icon-heart"])
                  }, null, 2)
                ], 10, _hoisted_22),
                createBaseVNode("button", {
                  type: "button",
                  class: normalizeClass(["DetailBannerAct BtnAny0", isInWatchlist.value ? "active" : ""]),
                  "aria-label": _ctx.$t("global.addWatchlist"),
                  onClick: _cache[3] || (_cache[3] = ($event) => addAct("watchlist"))
                }, [
                  createBaseVNode("i", {
                    class: normalizeClass(["icon", isInWatchlist.value ? "icon-listFill" : "icon-list"])
                  }, null, 2)
                ], 10, _hoisted_23)
              ]),
              createBaseVNode("div", _hoisted_24, toDisplayString(seasonData.tagline), 1),
              createBaseVNode("p", _hoisted_25, toDisplayString(seasonData.overview), 1)
            ])
          ])
        ]),
        createBaseVNode("div", _hoisted_26, [
          createBaseVNode("div", _hoisted_27, [
            createBaseVNode("div", _hoisted_28, [
              createBaseVNode("h2", _hoisted_29, toDisplayString(_ctx.$t("global.castList")), 1),
              createBaseVNode("div", _hoisted_30, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(castData.cast, (fpItem) => {
                  return openBlock(), createBlock(PersonItem, {
                    key: fpItem.id,
                    data: fpItem
                  }, null, 8, ["data"]);
                }), 128))
              ])
            ]),
            createBaseVNode("div", _hoisted_31, [
              createBaseVNode("h2", _hoisted_32, toDisplayString(_ctx.$t("global.staffList")), 1),
              createBaseVNode("div", _hoisted_33, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(castData.crew, (fpItem) => {
                  return openBlock(), createElementBlock("div", {
                    key: fpItem.id,
                    class: "InfoName"
                  }, toDisplayString(fpItem.name), 1);
                }), 128))
              ])
            ]),
            createBaseVNode("div", _hoisted_34, [
              createBaseVNode("h2", _hoisted_35, toDisplayString(_ctx.$t("global.allSeasons")), 1),
              createBaseVNode("div", _hoisted_36, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(seasonData.seasons, (fpItem) => {
                  return openBlock(), createBlock(DramaInfo, {
                    key: fpItem.id,
                    data: fpItem,
                    class: "cursor-context-menu"
                  }, null, 8, ["data"]);
                }), 128))
              ])
            ])
          ])
        ])
      ])) : (openBlock(), createBlock(LoadingPage, { key: 1 }));
    };
  }
};
export {
  _sfc_main as default
};
