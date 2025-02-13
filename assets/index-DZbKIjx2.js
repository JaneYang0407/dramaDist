import { bP as useI18n, a7 as reactive, r as ref, ag as onBeforeMount, w as watch, y as createElementBlock, H as createBlock, z as openBlock, A as createBaseVNode, N as toDisplayString, D as normalizeClass, P as createVNode, I as withCtx, u as unref, bZ as Swiper, O as Fragment, an as renderList, b_ as SwiperSlide } from "./vue-CmclmBdx.js";
import { a as apiRequest } from "./index-7lo_Phz_.js";
import { h as freeMode } from "./swiper-Bjhxao44.js";
import { D as DramaItem } from "./item-YgHiVTkO.js";
import { L as LoadingPage } from "./page-DYY7bfD8.js";
import "./vendor-3nH66FWi.js";
import "./element-plus-BqqwJ07U.js";
import "./pinia-QRlfNOmY.js";
import "./axios-DYLuwdcf.js";
const _hoisted_1 = {
  key: 0,
  class: "idxDramaBlockBox MainBox outer Container"
};
const _hoisted_2 = { class: "idxDramaBlock" };
const _hoisted_3 = { class: "idxDramaBlockTopic Topic1" };
const _hoisted_4 = { class: "idxDramaBlockNav" };
const _hoisted_5 = ["aria-label"];
const _hoisted_6 = ["aria-label"];
const _hoisted_7 = { class: "idxDramaBlock" };
const _hoisted_8 = { class: "idxDramaBlockTopic Topic1" };
const _hoisted_9 = { class: "idxDramaBlockNav" };
const _hoisted_10 = ["aria-label"];
const _hoisted_11 = ["aria-label"];
const _hoisted_12 = { class: "idxDramaBlock" };
const _hoisted_13 = { class: "idxDramaBlockTopic Topic1" };
const _hoisted_14 = { class: "idxDramaBlockNav" };
const _hoisted_15 = ["aria-label"];
const _hoisted_16 = ["aria-label"];
const _hoisted_17 = { class: "idxDramaBlock" };
const _hoisted_18 = { class: "idxDramaBlockTopic Topic1" };
const _hoisted_19 = { class: "idxDramaBlockNav" };
const _hoisted_20 = ["aria-label"];
const _hoisted_21 = ["aria-label"];
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const { locale } = useI18n();
    const playingDrama = reactive([]);
    const popularTv = reactive([]);
    const airingTodayTv = reactive([]);
    const topRatedTv = reactive([]);
    const loadingPage = ref(true);
    const fetchData = async () => {
      try {
        loadingPage.value = true;
        const [playingTvRes, popularTvRes, airingTodayRes, topRatedRes] = await Promise.all([
          apiRequest.get("/tv/on_the_air", { params: { language: locale.value, page: 1 } }),
          apiRequest.get("/tv/popular", { params: { language: locale.value, page: 1 } }),
          apiRequest.get("/tv/airing_today", { params: { language: locale.value, page: 1 } }),
          apiRequest.get("/tv/top_rated", { params: { language: locale.value, page: 1 } })
        ]);
        Object.assign(playingDrama, playingTvRes.results);
        Object.assign(popularTv, popularTvRes.results);
        Object.assign(airingTodayTv, airingTodayRes.results);
        Object.assign(topRatedTv, topRatedRes.results);
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
    const playingDramaCarousel = ref(null);
    const playingDramaBeginning = ref(true);
    const playingDramaEnd = ref(false);
    const onPlayingDramaSwiper = (swiper) => {
      playingDramaCarousel.value = swiper;
    };
    const onPlayingDramaChange = (swiper) => {
      if (swiper.isBeginning) {
        playingDramaBeginning.value = true;
      } else {
        playingDramaBeginning.value = false;
      }
      if (swiper.isEnd) {
        playingDramaEnd.value = true;
      } else {
        playingDramaEnd.value = false;
      }
    };
    const popularTvCarousel = ref(null);
    const popularTvBeginning = ref(true);
    const popularTvEnd = ref(false);
    const onPopularTvSwiper = (swiper) => {
      popularTvCarousel.value = swiper;
    };
    const onPopularTvChange = (swiper) => {
      if (swiper.isBeginning) {
        popularTvBeginning.value = true;
      } else {
        popularTvBeginning.value = false;
      }
      if (swiper.isEnd) {
        popularTvEnd.value = true;
      } else {
        popularTvEnd.value = false;
      }
    };
    const airingTodayTvCarousel = ref(null);
    const airingTodayTvBeginning = ref(true);
    const airingTodayTvEnd = ref(false);
    const onairingTodayTvSwiper = (swiper) => {
      airingTodayTvCarousel.value = swiper;
    };
    const onairingTodayTvChange = (swiper) => {
      if (swiper.isBeginning) {
        airingTodayTvBeginning.value = true;
      } else {
        airingTodayTvBeginning.value = false;
      }
      if (swiper.isEnd) {
        airingTodayTvEnd.value = true;
      } else {
        airingTodayTvEnd.value = false;
      }
    };
    const topRatedTvCarousel = ref(null);
    const topRatedTvBeginning = ref(true);
    const topRatedTvEnd = ref(false);
    const ontopRatedTvSwiper = (swiper) => {
      topRatedTvCarousel.value = swiper;
    };
    const ontopRatedTvChange = (swiper) => {
      if (swiper.isBeginning) {
        topRatedTvBeginning.value = true;
      } else {
        topRatedTvBeginning.value = false;
      }
      if (swiper.isEnd) {
        topRatedTvEnd.value = true;
      } else {
        topRatedTvEnd.value = false;
      }
    };
    return (_ctx, _cache) => {
      return !loadingPage.value ? (openBlock(), createElementBlock("div", _hoisted_1, [
        createBaseVNode("div", _hoisted_2, [
          createBaseVNode("div", _hoisted_3, toDisplayString(_ctx.$t("show.airingTv")), 1),
          createBaseVNode("div", {
            class: normalizeClass(["idxDramaBlockList", [playingDramaEnd.value ? "" : "more", playingDramaBeginning.value ? "" : "front"]])
          }, [
            createVNode(unref(Swiper), {
              modules: [unref(freeMode)],
              "slides-per-view": "auto",
              breakpoints: {
                0: {
                  spaceBetween: 10
                },
                768: {
                  spaceBetween: 0
                }
              },
              onSwiper: onPlayingDramaSwiper,
              onSlideChange: onPlayingDramaChange
            }, {
              default: withCtx(() => [
                (openBlock(true), createElementBlock(Fragment, null, renderList(playingDrama, (fpItem) => {
                  return openBlock(), createBlock(unref(SwiperSlide), {
                    key: fpItem.id,
                    class: "!w-fit md:!px-3.75"
                  }, {
                    default: withCtx(() => [
                      createVNode(DramaItem, {
                        class: "style1",
                        data: fpItem,
                        category: "show"
                      }, null, 8, ["data"])
                    ]),
                    _: 2
                  }, 1024);
                }), 128))
              ]),
              _: 1
            }, 8, ["modules"]),
            createBaseVNode("div", _hoisted_4, [
              createBaseVNode("button", {
                type: "button",
                class: normalizeClass(["idxDramaBlockNavBtn prev", playingDramaBeginning.value ? "disabled" : ""]),
                "aria-label": _ctx.$t("global.previous"),
                onClick: _cache[0] || (_cache[0] = ($event) => playingDramaCarousel.value.slidePrev())
              }, _cache[8] || (_cache[8] = [
                createBaseVNode("i", { class: "icon icon-arrowL" }, null, -1)
              ]), 10, _hoisted_5),
              createBaseVNode("button", {
                type: "button",
                class: normalizeClass(["idxDramaBlockNavBtn next", playingDramaEnd.value ? "disabled" : ""]),
                "aria-label": _ctx.$t("global.next"),
                onClick: _cache[1] || (_cache[1] = ($event) => playingDramaCarousel.value.slideNext())
              }, _cache[9] || (_cache[9] = [
                createBaseVNode("i", { class: "icon icon-arrowR" }, null, -1)
              ]), 10, _hoisted_6)
            ])
          ], 2)
        ]),
        createBaseVNode("div", _hoisted_7, [
          createBaseVNode("div", _hoisted_8, toDisplayString(_ctx.$t("show.popularTv")), 1),
          createBaseVNode("div", {
            class: normalizeClass(["idxDramaBlockList", [popularTvEnd.value ? "" : "more", popularTvBeginning.value ? "" : "front"]])
          }, [
            createVNode(unref(Swiper), {
              modules: [unref(freeMode)],
              "slides-per-view": "auto",
              breakpoints: {
                0: {
                  spaceBetween: 10
                },
                768: {
                  spaceBetween: 0
                }
              },
              onSwiper: onPopularTvSwiper,
              onSlideChange: onPopularTvChange
            }, {
              default: withCtx(() => [
                (openBlock(true), createElementBlock(Fragment, null, renderList(popularTv, (fpItem) => {
                  return openBlock(), createBlock(unref(SwiperSlide), {
                    key: fpItem.id,
                    class: "!w-fit md:!px-3.75"
                  }, {
                    default: withCtx(() => [
                      createVNode(DramaItem, {
                        class: "style1",
                        data: fpItem,
                        category: "show"
                      }, null, 8, ["data"])
                    ]),
                    _: 2
                  }, 1024);
                }), 128))
              ]),
              _: 1
            }, 8, ["modules"]),
            createBaseVNode("div", _hoisted_9, [
              createBaseVNode("button", {
                type: "button",
                class: normalizeClass(["idxDramaBlockNavBtn prev", popularTvBeginning.value ? "disabled" : ""]),
                "aria-label": _ctx.$t("global.previous"),
                onClick: _cache[2] || (_cache[2] = ($event) => popularTvCarousel.value.slidePrev())
              }, _cache[10] || (_cache[10] = [
                createBaseVNode("i", { class: "icon icon-arrowL" }, null, -1)
              ]), 10, _hoisted_10),
              createBaseVNode("button", {
                type: "button",
                class: normalizeClass(["idxDramaBlockNavBtn next", popularTvEnd.value ? "disabled" : ""]),
                "aria-label": _ctx.$t("global.next"),
                onClick: _cache[3] || (_cache[3] = ($event) => popularTvCarousel.value.slideNext())
              }, _cache[11] || (_cache[11] = [
                createBaseVNode("i", { class: "icon icon-arrowR" }, null, -1)
              ]), 10, _hoisted_11)
            ])
          ], 2)
        ]),
        createBaseVNode("div", _hoisted_12, [
          createBaseVNode("div", _hoisted_13, toDisplayString(_ctx.$t("show.airingTodayTv")), 1),
          createBaseVNode("div", {
            class: normalizeClass(["idxDramaBlockList", [airingTodayTvEnd.value ? "" : "more", airingTodayTvBeginning.value ? "" : "front"]])
          }, [
            createVNode(unref(Swiper), {
              modules: [unref(freeMode)],
              "slides-per-view": "auto",
              breakpoints: {
                0: {
                  spaceBetween: 10
                },
                768: {
                  spaceBetween: 0
                }
              },
              onSwiper: onairingTodayTvSwiper,
              onSlideChange: onairingTodayTvChange
            }, {
              default: withCtx(() => [
                (openBlock(true), createElementBlock(Fragment, null, renderList(airingTodayTv, (fpItem) => {
                  return openBlock(), createBlock(unref(SwiperSlide), {
                    key: fpItem.id,
                    class: "!w-fit md:!px-3.75"
                  }, {
                    default: withCtx(() => [
                      createVNode(DramaItem, {
                        class: "style1",
                        data: fpItem,
                        category: "show"
                      }, null, 8, ["data"])
                    ]),
                    _: 2
                  }, 1024);
                }), 128))
              ]),
              _: 1
            }, 8, ["modules"]),
            createBaseVNode("div", _hoisted_14, [
              createBaseVNode("button", {
                type: "button",
                class: normalizeClass(["idxDramaBlockNavBtn prev", airingTodayTvBeginning.value ? "disabled" : ""]),
                "aria-label": _ctx.$t("global.previous"),
                onClick: _cache[4] || (_cache[4] = ($event) => airingTodayTvCarousel.value.slidePrev())
              }, _cache[12] || (_cache[12] = [
                createBaseVNode("i", { class: "icon icon-arrowL" }, null, -1)
              ]), 10, _hoisted_15),
              createBaseVNode("button", {
                type: "button",
                class: normalizeClass(["idxDramaBlockNavBtn next", airingTodayTvEnd.value ? "disabled" : ""]),
                "aria-label": _ctx.$t("global.next"),
                onClick: _cache[5] || (_cache[5] = ($event) => airingTodayTvCarousel.value.slideNext())
              }, _cache[13] || (_cache[13] = [
                createBaseVNode("i", { class: "icon icon-arrowR" }, null, -1)
              ]), 10, _hoisted_16)
            ])
          ], 2)
        ]),
        createBaseVNode("div", _hoisted_17, [
          createBaseVNode("div", _hoisted_18, toDisplayString(_ctx.$t("show.topRatedTv")), 1),
          createBaseVNode("div", {
            class: normalizeClass(["idxDramaBlockList", [topRatedTvEnd.value ? "" : "more", topRatedTvBeginning.value ? "" : "front"]])
          }, [
            createVNode(unref(Swiper), {
              modules: [unref(freeMode)],
              "slides-per-view": "auto",
              breakpoints: {
                0: {
                  spaceBetween: 10
                },
                768: {
                  spaceBetween: 0
                }
              },
              onSwiper: ontopRatedTvSwiper,
              onSlideChange: ontopRatedTvChange
            }, {
              default: withCtx(() => [
                (openBlock(true), createElementBlock(Fragment, null, renderList(topRatedTv, (fpItem) => {
                  return openBlock(), createBlock(unref(SwiperSlide), {
                    key: fpItem.id,
                    class: "!w-fit md:!px-3.75"
                  }, {
                    default: withCtx(() => [
                      createVNode(DramaItem, {
                        class: "style1",
                        data: fpItem,
                        category: "show"
                      }, null, 8, ["data"])
                    ]),
                    _: 2
                  }, 1024);
                }), 128))
              ]),
              _: 1
            }, 8, ["modules"]),
            createBaseVNode("div", _hoisted_19, [
              createBaseVNode("button", {
                type: "button",
                class: normalizeClass(["idxDramaBlockNavBtn prev", topRatedTvBeginning.value ? "disabled" : ""]),
                "aria-label": _ctx.$t("global.previous"),
                onClick: _cache[6] || (_cache[6] = ($event) => topRatedTvCarousel.value.slidePrev())
              }, _cache[14] || (_cache[14] = [
                createBaseVNode("i", { class: "icon icon-arrowL" }, null, -1)
              ]), 10, _hoisted_20),
              createBaseVNode("button", {
                type: "button",
                class: normalizeClass(["idxDramaBlockNavBtn next", topRatedTvEnd.value ? "disabled" : ""]),
                "aria-label": _ctx.$t("global.next"),
                onClick: _cache[7] || (_cache[7] = ($event) => topRatedTvCarousel.value.slideNext())
              }, _cache[15] || (_cache[15] = [
                createBaseVNode("i", { class: "icon icon-arrowR" }, null, -1)
              ]), 10, _hoisted_21)
            ])
          ], 2)
        ])
      ])) : (openBlock(), createBlock(LoadingPage, { key: 1 }));
    };
  }
};
export {
  _sfc_main as default
};
