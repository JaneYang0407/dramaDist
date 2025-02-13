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
    const playingMovie = reactive([]);
    const popularMovie = reactive([]);
    const topRatedMovie = reactive([]);
    const upcomingMovie = reactive([]);
    const loadingPage = ref(true);
    const fetchData = async () => {
      try {
        loadingPage.value = true;
        const [playingMovieRes, popularMovieRes, topRatedMovieRes, upcomingMovieRes] = await Promise.all([
          apiRequest.get("/movie/now_playing", { params: { language: locale.value, page: 1 } }),
          apiRequest.get("/movie/popular", { params: { language: locale.value, page: 1 } }),
          apiRequest.get("/movie/top_rated", { params: { language: locale.value, page: 1 } }),
          apiRequest.get("/movie/upcoming", { params: { language: locale.value, page: 1 } })
        ]);
        Object.assign(playingMovie, playingMovieRes.results);
        Object.assign(popularMovie, popularMovieRes.results);
        Object.assign(topRatedMovie, topRatedMovieRes.results);
        Object.assign(upcomingMovie, upcomingMovieRes.results);
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
    const playingMovieCarousel = ref(null);
    const playingMovieBeginning = ref(true);
    const playingMovieEnd = ref(false);
    const onPlayingMovieSwiper = (swiper) => {
      playingMovieCarousel.value = swiper;
    };
    const onPlayingMovieChange = (swiper) => {
      if (swiper.isBeginning) {
        playingMovieBeginning.value = true;
      } else {
        playingMovieBeginning.value = false;
      }
      if (swiper.isEnd) {
        playingMovieEnd.value = true;
      } else {
        playingMovieEnd.value = false;
      }
    };
    const popularMovieCarousel = ref(null);
    const popularMovieBeginning = ref(true);
    const popularMovieEnd = ref(false);
    const onPopularMovieSwiper = (swiper) => {
      popularMovieCarousel.value = swiper;
    };
    const onPopularMovieChange = (swiper) => {
      if (swiper.isBeginning) {
        popularMovieBeginning.value = true;
      } else {
        popularMovieBeginning.value = false;
      }
      if (swiper.isEnd) {
        popularMovieEnd.value = true;
      } else {
        popularMovieEnd.value = false;
      }
    };
    const topRatedMovieCarousel = ref(null);
    const topRatedMovieBeginning = ref(true);
    const topRatedMovieEnd = ref(false);
    const onTopRatedMovieSwiper = (swiper) => {
      topRatedMovieCarousel.value = swiper;
    };
    const onTopRatedMovieChange = (swiper) => {
      if (swiper.isBeginning) {
        topRatedMovieBeginning.value = true;
      } else {
        topRatedMovieBeginning.value = false;
      }
      if (swiper.isEnd) {
        topRatedMovieEnd.value = true;
      } else {
        topRatedMovieEnd.value = false;
      }
    };
    const upcomingMovieCarousel = ref(null);
    const upcomingMovieBeginning = ref(true);
    const upcomingMovieEnd = ref(false);
    const onUpcomingMovieSwiper = (swiper) => {
      upcomingMovieCarousel.value = swiper;
    };
    const onUpcomingMovieChange = (swiper) => {
      if (swiper.isBeginning) {
        upcomingMovieBeginning.value = true;
      } else {
        upcomingMovieBeginning.value = false;
      }
      if (swiper.isEnd) {
        upcomingMovieEnd.value = true;
      } else {
        upcomingMovieEnd.value = false;
      }
    };
    return (_ctx, _cache) => {
      return !loadingPage.value ? (openBlock(), createElementBlock("div", _hoisted_1, [
        createBaseVNode("div", _hoisted_2, [
          createBaseVNode("div", _hoisted_3, toDisplayString(_ctx.$t("movie.playingMovie")), 1),
          createBaseVNode("div", {
            class: normalizeClass(["idxDramaBlockList", [playingMovieEnd.value ? "" : "more", playingMovieBeginning.value ? "" : "front"]])
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
              onSwiper: onPlayingMovieSwiper,
              onSlideChange: onPlayingMovieChange
            }, {
              default: withCtx(() => [
                (openBlock(true), createElementBlock(Fragment, null, renderList(playingMovie, (fpItem) => {
                  return openBlock(), createBlock(unref(SwiperSlide), {
                    key: fpItem.id,
                    class: "!w-fit md:!px-3.75"
                  }, {
                    default: withCtx(() => [
                      createVNode(DramaItem, {
                        class: "style1",
                        data: fpItem,
                        category: "movie"
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
                class: normalizeClass(["idxDramaBlockNavBtn prev", playingMovieBeginning.value ? "disabled" : ""]),
                "aria-label": _ctx.$t("global.previous"),
                onClick: _cache[0] || (_cache[0] = ($event) => playingMovieCarousel.value.slidePrev())
              }, _cache[8] || (_cache[8] = [
                createBaseVNode("i", { class: "icon icon-arrowL" }, null, -1)
              ]), 10, _hoisted_5),
              createBaseVNode("button", {
                type: "button",
                class: normalizeClass(["idxDramaBlockNavBtn next", playingMovieEnd.value ? "disabled" : ""]),
                "aria-label": _ctx.$t("global.next"),
                onClick: _cache[1] || (_cache[1] = ($event) => playingMovieCarousel.value.slideNext())
              }, _cache[9] || (_cache[9] = [
                createBaseVNode("i", { class: "icon icon-arrowR" }, null, -1)
              ]), 10, _hoisted_6)
            ])
          ], 2)
        ]),
        createBaseVNode("div", _hoisted_7, [
          createBaseVNode("div", _hoisted_8, toDisplayString(_ctx.$t("movie.popularMovie")), 1),
          createBaseVNode("div", {
            class: normalizeClass(["idxDramaBlockList", [popularMovieEnd.value ? "" : "more", popularMovieBeginning.value ? "" : "front"]])
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
              onSwiper: onPopularMovieSwiper,
              onSlideChange: onPopularMovieChange
            }, {
              default: withCtx(() => [
                (openBlock(true), createElementBlock(Fragment, null, renderList(popularMovie, (fpItem) => {
                  return openBlock(), createBlock(unref(SwiperSlide), {
                    key: fpItem.id,
                    class: "!w-fit md:!px-3.75"
                  }, {
                    default: withCtx(() => [
                      createVNode(DramaItem, {
                        class: "style1",
                        data: fpItem,
                        category: "movie"
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
                class: normalizeClass(["idxDramaBlockNavBtn prev", popularMovieBeginning.value ? "disabled" : ""]),
                "aria-label": _ctx.$t("global.previous"),
                onClick: _cache[2] || (_cache[2] = ($event) => popularMovieCarousel.value.slidePrev())
              }, _cache[10] || (_cache[10] = [
                createBaseVNode("i", { class: "icon icon-arrowL" }, null, -1)
              ]), 10, _hoisted_10),
              createBaseVNode("button", {
                type: "button",
                class: normalizeClass(["idxDramaBlockNavBtn next", popularMovieEnd.value ? "disabled" : ""]),
                "aria-label": _ctx.$t("global.next"),
                onClick: _cache[3] || (_cache[3] = ($event) => popularMovieCarousel.value.slideNext())
              }, _cache[11] || (_cache[11] = [
                createBaseVNode("i", { class: "icon icon-arrowR" }, null, -1)
              ]), 10, _hoisted_11)
            ])
          ], 2)
        ]),
        createBaseVNode("div", _hoisted_12, [
          createBaseVNode("div", _hoisted_13, toDisplayString(_ctx.$t("movie.topRatedMovie")), 1),
          createBaseVNode("div", {
            class: normalizeClass(["idxDramaBlockList", [topRatedMovieEnd.value ? "" : "more", topRatedMovieBeginning.value ? "" : "front"]])
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
              onSwiper: onTopRatedMovieSwiper,
              onSlideChange: onTopRatedMovieChange
            }, {
              default: withCtx(() => [
                (openBlock(true), createElementBlock(Fragment, null, renderList(topRatedMovie, (fpItem) => {
                  return openBlock(), createBlock(unref(SwiperSlide), {
                    key: fpItem.id,
                    class: "!w-fit md:!px-3.75"
                  }, {
                    default: withCtx(() => [
                      createVNode(DramaItem, {
                        class: "style1",
                        data: fpItem,
                        category: "movie"
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
                class: normalizeClass(["idxDramaBlockNavBtn prev", topRatedMovieBeginning.value ? "disabled" : ""]),
                "aria-label": _ctx.$t("global.previous"),
                onClick: _cache[4] || (_cache[4] = ($event) => topRatedMovieCarousel.value.slidePrev())
              }, _cache[12] || (_cache[12] = [
                createBaseVNode("i", { class: "icon icon-arrowL" }, null, -1)
              ]), 10, _hoisted_15),
              createBaseVNode("button", {
                type: "button",
                class: normalizeClass(["idxDramaBlockNavBtn next", topRatedMovieEnd.value ? "disabled" : ""]),
                "aria-label": _ctx.$t("global.next"),
                onClick: _cache[5] || (_cache[5] = ($event) => topRatedMovieCarousel.value.slideNext())
              }, _cache[13] || (_cache[13] = [
                createBaseVNode("i", { class: "icon icon-arrowR" }, null, -1)
              ]), 10, _hoisted_16)
            ])
          ], 2)
        ]),
        createBaseVNode("div", _hoisted_17, [
          createBaseVNode("div", _hoisted_18, toDisplayString(_ctx.$t("movie.upcomingMovie")), 1),
          createBaseVNode("div", {
            class: normalizeClass(["idxDramaBlockList", [upcomingMovieEnd.value ? "" : "more", upcomingMovieBeginning.value ? "" : "front"]])
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
              onSwiper: onUpcomingMovieSwiper,
              onSlideChange: onUpcomingMovieChange
            }, {
              default: withCtx(() => [
                (openBlock(true), createElementBlock(Fragment, null, renderList(upcomingMovie, (fpItem) => {
                  return openBlock(), createBlock(unref(SwiperSlide), {
                    key: fpItem.id,
                    class: "!w-fit md:!px-3.75"
                  }, {
                    default: withCtx(() => [
                      createVNode(DramaItem, {
                        class: "style1",
                        data: fpItem,
                        category: "movie"
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
                class: normalizeClass(["idxDramaBlockNavBtn prev", upcomingMovieBeginning.value ? "disabled" : ""]),
                "aria-label": _ctx.$t("global.previous"),
                onClick: _cache[6] || (_cache[6] = ($event) => upcomingMovieCarousel.value.slidePrev())
              }, _cache[14] || (_cache[14] = [
                createBaseVNode("i", { class: "icon icon-arrowL" }, null, -1)
              ]), 10, _hoisted_20),
              createBaseVNode("button", {
                type: "button",
                class: normalizeClass(["idxDramaBlockNavBtn next", upcomingMovieEnd.value ? "disabled" : ""]),
                "aria-label": _ctx.$t("global.next"),
                onClick: _cache[7] || (_cache[7] = ($event) => upcomingMovieCarousel.value.slideNext())
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
