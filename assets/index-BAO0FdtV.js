import { bP as useI18n, a7 as reactive, r as ref, ag as onBeforeMount, w as watch, y as createElementBlock, H as createBlock, z as openBlock, K as createCommentVNode, A as createBaseVNode, u as unref, bZ as Swiper, O as Fragment, an as renderList, N as toDisplayString, D as normalizeClass, P as createVNode, I as withCtx, b_ as SwiperSlide, bR as RouterLink } from "./vue-CmclmBdx.js";
import { _ as _export_sfc, a as apiRequest } from "./index-7lo_Phz_.js";
import { s as storeToRefs } from "./pinia-QRlfNOmY.js";
import { u as useApiConfigStore } from "./apiConfig-QxoHLURK.js";
import { A as Autoplay, h as freeMode } from "./swiper-Bjhxao44.js";
import { D as DramaItem } from "./item-YgHiVTkO.js";
import { L as LoadingPage } from "./page-DYY7bfD8.js";
import "./vendor-3nH66FWi.js";
import "./element-plus-BqqwJ07U.js";
import "./axios-DYLuwdcf.js";
const _hoisted_1 = { key: 0 };
const _hoisted_2 = { class: "idxCarouselPic aspect-[4/3] md:aspect-[12/5]" };
const _hoisted_3 = ["srcset"];
const _hoisted_4 = ["srcset"];
const _hoisted_5 = ["src"];
const _hoisted_6 = { class: "idxCarouselInfo Container Space w-full absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" };
const _hoisted_7 = { class: "idxCarouselTitle text-30 font-bold leading-none mt-2 mb-3 md:mb-5 lg:text-40 xl:text-60" };
const _hoisted_8 = { class: "idxCarouselRate flex items-center mb-8" };
const _hoisted_9 = { class: "text-sm leading-none" };
const _hoisted_10 = {
  key: 0,
  class: "idxCarouselDes mb-5 line-clamp-3 max-sm:hidden"
};
const _hoisted_11 = { class: "text" };
const _hoisted_12 = {
  key: 1,
  class: "idxCarouselDots flex items-center justify-center flex-wrap -mb-5"
};
const _hoisted_13 = ["onClick"];
const _hoisted_14 = { class: "idxDramaBlockBox MainBox outer Container" };
const _hoisted_15 = { class: "idxDramaBlock" };
const _hoisted_16 = { class: "idxDramaBlockTopic Topic1" };
const _hoisted_17 = { class: "idxDramaBlockNav" };
const _hoisted_18 = ["aria-label"];
const _hoisted_19 = ["aria-label"];
const _hoisted_20 = { class: "idxDramaBlock" };
const _hoisted_21 = { class: "idxDramaBlockTopic Topic1" };
const _hoisted_22 = { class: "idxDramaBlockNav" };
const _hoisted_23 = ["aria-label"];
const _hoisted_24 = ["aria-label"];
const _hoisted_25 = { class: "idxDramaBlock" };
const _hoisted_26 = { class: "idxDramaBlockTopic Topic1" };
const _hoisted_27 = { class: "idxDramaBlockNav" };
const _hoisted_28 = ["aria-label"];
const _hoisted_29 = ["aria-label"];
const _hoisted_30 = { class: "idxDramaBlock" };
const _hoisted_31 = { class: "idxDramaBlockTopic Topic1" };
const _hoisted_32 = { class: "idxDramaBlockNav" };
const _hoisted_33 = ["aria-label"];
const _hoisted_34 = ["aria-label"];
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const { locale } = useI18n();
    const playingMovieList = reactive([]);
    const playingTvList = reactive([]);
    const playingDrama = reactive([]);
    const playingMovie = reactive([]);
    const playingList = reactive([]);
    const popularMovie = reactive([]);
    const popularTv = reactive([]);
    const loadingPage = ref(true);
    const apiConfigObj = useApiConfigStore();
    apiConfigObj.getApiConfig();
    const { apiConfig } = storeToRefs(apiConfigObj);
    const fetchData = async () => {
      try {
        loadingPage.value = true;
        const [playingMovieRes, playingTvRes, popularMovieRes, popularTvRes] = await Promise.all([
          apiRequest.get("/movie/now_playing", { params: { language: locale.value, page: 1 } }),
          apiRequest.get("/tv/on_the_air", { params: { language: locale.value, page: 1 } }),
          apiRequest.get("/movie/popular", { params: { language: locale.value, page: 1 } }),
          apiRequest.get("/tv/popular", { params: { language: locale.value, page: 1 } })
        ]);
        Object.assign(playingMovie, playingMovieRes.results);
        Object.assign(playingDrama, playingTvRes.results);
        Object.assign(popularMovie, popularMovieRes.results);
        Object.assign(popularTv, popularTvRes.results);
        const fetchDetails = async (items, type) => {
          return Promise.all(
            items.map(async (item) => {
              const detail = await apiRequest.get(`/${type}/${item.id}`, {
                params: { language: locale.value }
              });
              return {
                ...item,
                category: type === "movie" ? "movie" : "show",
                detail
              };
            })
          );
        };
        const [moviesWithDetails, tvsWithDetails] = await Promise.all([
          fetchDetails(playingMovieRes.results, "movie"),
          fetchDetails(playingTvRes.results, "tv")
        ]);
        playingMovieList.length = 0;
        playingTvList.length = 0;
        playingMovieList.push(...moviesWithDetails);
        playingTvList.push(...tvsWithDetails);
        let tmpArr = [];
        for (let i = 0; i < 5; i++) {
          tmpArr.push(playingMovieList[i]);
          tmpArr.push(playingTvList[i]);
        }
        Object.assign(playingList, tmpArr);
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
    const bannerCarousel = ref(null);
    const currentBanner = ref(0);
    const onSwiper = (swiper) => {
      bannerCarousel.value = swiper;
    };
    const onSlideChange = (swiper) => {
      currentBanner.value = swiper.realIndex;
    };
    function clickDot(id) {
      bannerCarousel.value.slideTo(id);
    }
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
    return (_ctx, _cache) => {
      return !loadingPage.value ? (openBlock(), createElementBlock("div", _hoisted_1, [
        playingList.length > 0 ? (openBlock(), createBlock(unref(Swiper), {
          key: 0,
          class: "mb-7.5",
          modules: [unref(Autoplay)],
          "slides-per-view": 1,
          loop: true,
          autoplay: {
            delay: 5e3,
            pauseOnMouseEnter: true
          },
          onSwiper,
          onSlideChange
        }, {
          default: withCtx(() => [
            (openBlock(true), createElementBlock(Fragment, null, renderList(playingList, (fpItem) => {
              return openBlock(), createBlock(unref(SwiperSlide), {
                key: fpItem.id,
                class: "idxCarouselSlide"
              }, {
                default: withCtx(() => [
                  createBaseVNode("div", _hoisted_2, [
                    createBaseVNode("picture", null, [
                      createBaseVNode("source", {
                        srcset: fpItem.backdrop_path ? `${unref(apiConfig).images.secure_base_url}w780${fpItem.backdrop_path}` : `${unref(apiConfig).images.secure_base_url}original${fpItem.poster_path}`,
                        media: "(max-width: 575px)"
                      }, null, 8, _hoisted_3),
                      createBaseVNode("source", {
                        srcset: fpItem.backdrop_path ? `${unref(apiConfig).images.secure_base_url}original${fpItem.backdrop_path}` : `${unref(apiConfig).images.secure_base_url}original${fpItem.poster_path}`,
                        media: "(max-width: 1920px)"
                      }, null, 8, _hoisted_4),
                      createBaseVNode("img", {
                        class: "w-full h-full free object-cover",
                        src: fpItem.backdrop_path ? `${unref(apiConfig).images.secure_base_url}original${fpItem.backdrop_path}` : `${unref(apiConfig).images.secure_base_url}original${fpItem.poster_path}`,
                        alt: "Banner"
                      }, null, 8, _hoisted_5)
                    ])
                  ]),
                  createBaseVNode("div", _hoisted_6, [
                    createBaseVNode("div", _hoisted_7, toDisplayString(fpItem.title ?? fpItem.name), 1),
                    createBaseVNode("div", _hoisted_8, [
                      _cache[8] || (_cache[8] = createBaseVNode("i", { class: "icon icon-starFill block text-xs mr-1" }, null, -1)),
                      createBaseVNode("div", _hoisted_9, toDisplayString(fpItem.vote_average), 1)
                    ]),
                    fpItem.overview !== "" ? (openBlock(), createElementBlock("div", _hoisted_10, toDisplayString(fpItem.overview), 1)) : createCommentVNode("", true),
                    createVNode(unref(RouterLink), {
                      to: `/${fpItem.category}/${fpItem.id}`,
                      class: "idxCarouselMore BtnAny1 default w-fit"
                    }, {
                      default: withCtx(() => [
                        createBaseVNode("div", _hoisted_11, toDisplayString(_ctx.$t("global.moreContent")), 1)
                      ]),
                      _: 2
                    }, 1032, ["to"])
                  ])
                ]),
                _: 2
              }, 1024);
            }), 128))
          ]),
          _: 1
        }, 8, ["modules"])) : createCommentVNode("", true),
        playingList.length > 0 ? (openBlock(), createElementBlock("div", _hoisted_12, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(playingList, (fpItem, fpId) => {
            return openBlock(), createElementBlock("div", {
              key: fpItem.id,
              class: normalizeClass(["idxCarouselDot h-2 rounded-full mb-5 mr-2 md:mr-5 cursor-pointer last:mr-0 xl:hover:bg-primary md:h-3.5", fpId === currentBanner.value ? "bg-primary w-6 md:w-10" : "bg-third w-2 md:w-3.5"]),
              onClick: ($event) => clickDot(fpId)
            }, null, 10, _hoisted_13);
          }), 128))
        ])) : createCommentVNode("", true),
        createBaseVNode("div", _hoisted_14, [
          createBaseVNode("div", _hoisted_15, [
            createBaseVNode("div", _hoisted_16, toDisplayString(_ctx.$t("show.airingTv")), 1),
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
              createBaseVNode("div", _hoisted_17, [
                createBaseVNode("button", {
                  type: "button",
                  class: normalizeClass(["idxDramaBlockNavBtn prev", playingDramaBeginning.value ? "disabled" : ""]),
                  "aria-label": _ctx.$t("global.previous"),
                  onClick: _cache[0] || (_cache[0] = ($event) => playingDramaCarousel.value.slidePrev())
                }, _cache[9] || (_cache[9] = [
                  createBaseVNode("i", { class: "icon icon-arrowL" }, null, -1)
                ]), 10, _hoisted_18),
                createBaseVNode("button", {
                  type: "button",
                  class: normalizeClass(["idxDramaBlockNavBtn next", playingDramaEnd.value ? "disabled" : ""]),
                  "aria-label": _ctx.$t("global.next"),
                  onClick: _cache[1] || (_cache[1] = ($event) => playingDramaCarousel.value.slideNext())
                }, _cache[10] || (_cache[10] = [
                  createBaseVNode("i", { class: "icon icon-arrowR" }, null, -1)
                ]), 10, _hoisted_19)
              ])
            ], 2)
          ]),
          createBaseVNode("div", _hoisted_20, [
            createBaseVNode("div", _hoisted_21, toDisplayString(_ctx.$t("movie.playingMovie")), 1),
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
              createBaseVNode("div", _hoisted_22, [
                createBaseVNode("button", {
                  type: "button",
                  class: normalizeClass(["idxDramaBlockNavBtn prev", playingMovieBeginning.value ? "disabled" : ""]),
                  "aria-label": _ctx.$t("global.previous"),
                  onClick: _cache[2] || (_cache[2] = ($event) => playingMovieCarousel.value.slidePrev())
                }, _cache[11] || (_cache[11] = [
                  createBaseVNode("i", { class: "icon icon-arrowL" }, null, -1)
                ]), 10, _hoisted_23),
                createBaseVNode("button", {
                  type: "button",
                  class: normalizeClass(["idxDramaBlockNavBtn next", playingMovieEnd.value ? "disabled" : ""]),
                  "aria-label": _ctx.$t("global.next"),
                  onClick: _cache[3] || (_cache[3] = ($event) => playingMovieCarousel.value.slideNext())
                }, _cache[12] || (_cache[12] = [
                  createBaseVNode("i", { class: "icon icon-arrowR" }, null, -1)
                ]), 10, _hoisted_24)
              ])
            ], 2)
          ]),
          createBaseVNode("div", _hoisted_25, [
            createBaseVNode("div", _hoisted_26, toDisplayString(_ctx.$t("movie.popularMovie")), 1),
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
              createBaseVNode("div", _hoisted_27, [
                createBaseVNode("button", {
                  type: "button",
                  class: normalizeClass(["idxDramaBlockNavBtn prev", popularMovieBeginning.value ? "disabled" : ""]),
                  "aria-label": _ctx.$t("global.previous"),
                  onClick: _cache[4] || (_cache[4] = ($event) => popularMovieCarousel.value.slidePrev())
                }, _cache[13] || (_cache[13] = [
                  createBaseVNode("i", { class: "icon icon-arrowL" }, null, -1)
                ]), 10, _hoisted_28),
                createBaseVNode("button", {
                  type: "button",
                  class: normalizeClass(["idxDramaBlockNavBtn next", popularMovieEnd.value ? "disabled" : ""]),
                  "aria-label": _ctx.$t("global.next"),
                  onClick: _cache[5] || (_cache[5] = ($event) => popularMovieCarousel.value.slideNext())
                }, _cache[14] || (_cache[14] = [
                  createBaseVNode("i", { class: "icon icon-arrowR" }, null, -1)
                ]), 10, _hoisted_29)
              ])
            ], 2)
          ]),
          createBaseVNode("div", _hoisted_30, [
            createBaseVNode("div", _hoisted_31, toDisplayString(_ctx.$t("show.popularTv")), 1),
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
              createBaseVNode("div", _hoisted_32, [
                createBaseVNode("button", {
                  type: "button",
                  class: normalizeClass(["idxDramaBlockNavBtn prev", popularTvBeginning.value ? "disabled" : ""]),
                  "aria-label": _ctx.$t("global.previous"),
                  onClick: _cache[6] || (_cache[6] = ($event) => popularTvCarousel.value.slidePrev())
                }, _cache[15] || (_cache[15] = [
                  createBaseVNode("i", { class: "icon icon-arrowL" }, null, -1)
                ]), 10, _hoisted_33),
                createBaseVNode("button", {
                  type: "button",
                  class: normalizeClass(["idxDramaBlockNavBtn next", popularTvEnd.value ? "disabled" : ""]),
                  "aria-label": _ctx.$t("global.next"),
                  onClick: _cache[7] || (_cache[7] = ($event) => popularTvCarousel.value.slideNext())
                }, _cache[16] || (_cache[16] = [
                  createBaseVNode("i", { class: "icon icon-arrowR" }, null, -1)
                ]), 10, _hoisted_34)
              ])
            ], 2)
          ])
        ])
      ])) : (openBlock(), createBlock(LoadingPage, { key: 1 }));
    };
  }
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-39fda48e"]]);
export {
  index as default
};
