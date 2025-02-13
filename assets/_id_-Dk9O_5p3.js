import { bP as useI18n, r as ref, a7 as reactive, ag as onBeforeMount, w as watch, y as createElementBlock, H as createBlock, z as openBlock, A as createBaseVNode, K as createCommentVNode, N as toDisplayString, O as Fragment, an as renderList, bO as useRoute } from "./vue-CmclmBdx.js";
import { _ as _export_sfc, a as apiRequest } from "./index-7lo_Phz_.js";
import { L as LoadingPage } from "./page-DYY7bfD8.js";
import "./vendor-3nH66FWi.js";
import "./element-plus-BqqwJ07U.js";
import "./swiper-Bjhxao44.js";
import "./pinia-QRlfNOmY.js";
import "./axios-DYLuwdcf.js";
const _hoisted_1 = {
  key: 0,
  class: "MainBox"
};
const _hoisted_2 = { class: "MainInner" };
const _hoisted_3 = { class: "psersonBriefBox" };
const _hoisted_4 = { class: "psersonBriefPic" };
const _hoisted_5 = ["src"];
const _hoisted_6 = { class: "psersonBrief" };
const _hoisted_7 = { class: "psersonBriefName Topic1" };
const _hoisted_8 = { class: "psersonBriefListBox" };
const _hoisted_9 = { class: "psersonBriefList" };
const _hoisted_10 = { class: "psersonBriefList" };
const _hoisted_11 = { class: "psersonBriefList" };
const _hoisted_12 = { class: "psersonBriefList" };
const _hoisted_13 = { class: "psersonBriefBio" };
const _hoisted_14 = { class: "psersonDramaBlockBox" };
const _hoisted_15 = { class: "psersonDramaBlock" };
const _hoisted_16 = { class: "psersonDramaBlockTitle Topic2" };
const _hoisted_17 = { class: "psersonDramaBlockTableBox" };
const _hoisted_18 = { class: "psersonDramaBlockTable" };
const _hoisted_19 = { class: "psersonDramaBlock" };
const _hoisted_20 = { class: "psersonDramaBlockTitle Topic2" };
const _hoisted_21 = { class: "psersonDramaBlockTableBox" };
const _hoisted_22 = { class: "psersonDramaBlockTable" };
const _sfc_main = {
  __name: "[id]",
  setup(__props) {
    const { locale } = useI18n();
    const route = useRoute();
    const loadingPage = ref(true);
    const data = reactive({});
    const movieData = reactive({});
    const tvData = reactive({});
    const fetchData = async () => {
      try {
        loadingPage.value = true;
        const [personRes, personMovieRes, personTvRes] = await Promise.all([
          apiRequest.get(`/person/${route.params.id}`, {
            params: {
              language: locale.value
            }
          }),
          apiRequest.get(`/person/${route.params.id}/movie_credits`, {
            params: {
              language: locale.value
            }
          }),
          apiRequest.get(`/person/${route.params.id}/tv_credits`, {
            params: {
              language: locale.value
            }
          })
        ]);
        Object.assign(data, personRes);
        Object.assign(movieData, personMovieRes.cast);
        Object.assign(tvData, personTvRes.cast);
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
    return (_ctx, _cache) => {
      return !loadingPage.value ? (openBlock(), createElementBlock("div", _hoisted_1, [
        createBaseVNode("div", _hoisted_2, [
          createBaseVNode("section", _hoisted_3, [
            createBaseVNode("div", _hoisted_4, [
              data.profile_path !== "" && data.profile_path !== null ? (openBlock(), createElementBlock("img", {
                key: 0,
                class: "free object-cover w-full h-full transition-transform duration-300",
                src: `https://image.tmdb.org/t/p/w300/${data.profile_path}`,
                loading: "lazy",
                alt: ""
              }, null, 8, _hoisted_5)) : createCommentVNode("", true)
            ]),
            createBaseVNode("div", _hoisted_6, [
              createBaseVNode("h1", _hoisted_7, toDisplayString(data.name), 1),
              createBaseVNode("div", _hoisted_8, [
                createBaseVNode("div", _hoisted_9, toDisplayString(_ctx.$t("person.birthday")) + ":" + toDisplayString(data.birthday), 1),
                createBaseVNode("div", _hoisted_10, toDisplayString(_ctx.$t("person.gender")) + ":" + toDisplayString(data.gender === 1 ? _ctx.$t("person.female") : _ctx.$t("person.male")), 1),
                createBaseVNode("div", _hoisted_11, toDisplayString(_ctx.$t("person.birthPlace")) + ":" + toDisplayString(data.place_of_birth), 1),
                createBaseVNode("div", _hoisted_12, toDisplayString(_ctx.$t("person.job")) + ":" + toDisplayString(data.known_for_department), 1)
              ]),
              createBaseVNode("p", _hoisted_13, toDisplayString(data.biography), 1)
            ])
          ]),
          createBaseVNode("section", _hoisted_14, [
            createBaseVNode("div", _hoisted_15, [
              createBaseVNode("h2", _hoisted_16, toDisplayString(_ctx.$t("person.dramaProduct")), 1),
              createBaseVNode("div", _hoisted_17, [
                createBaseVNode("table", _hoisted_18, [
                  createBaseVNode("thead", null, [
                    createBaseVNode("tr", null, [
                      createBaseVNode("th", null, toDisplayString(_ctx.$t("person.tear")), 1),
                      createBaseVNode("th", null, toDisplayString(_ctx.$t("person.name")), 1),
                      createBaseVNode("th", null, toDisplayString(_ctx.$t("person.character")), 1)
                    ])
                  ]),
                  createBaseVNode("tbody", null, [
                    (openBlock(true), createElementBlock(Fragment, null, renderList(tvData, (fpItem) => {
                      return openBlock(), createElementBlock("tr", {
                        key: fpItem.id
                      }, [
                        createBaseVNode("th", null, toDisplayString(fpItem.first_air_date), 1),
                        createBaseVNode("td", null, toDisplayString(fpItem.name), 1),
                        createBaseVNode("td", null, toDisplayString(fpItem.character), 1)
                      ]);
                    }), 128))
                  ])
                ])
              ])
            ]),
            createBaseVNode("div", _hoisted_19, [
              createBaseVNode("h2", _hoisted_20, toDisplayString(_ctx.$t("person.movieProduct")), 1),
              createBaseVNode("div", _hoisted_21, [
                createBaseVNode("table", _hoisted_22, [
                  createBaseVNode("thead", null, [
                    createBaseVNode("tr", null, [
                      createBaseVNode("th", null, toDisplayString(_ctx.$t("person.tear")), 1),
                      createBaseVNode("th", null, toDisplayString(_ctx.$t("person.name")), 1),
                      createBaseVNode("th", null, toDisplayString(_ctx.$t("person.character")), 1)
                    ])
                  ]),
                  createBaseVNode("tbody", null, [
                    (openBlock(true), createElementBlock(Fragment, null, renderList(movieData, (fpItem) => {
                      return openBlock(), createElementBlock("tr", {
                        key: fpItem.id
                      }, [
                        createBaseVNode("th", null, toDisplayString(fpItem.release_date), 1),
                        createBaseVNode("td", null, toDisplayString(fpItem.title), 1),
                        createBaseVNode("td", null, toDisplayString(fpItem.character), 1)
                      ]);
                    }), 128))
                  ])
                ])
              ])
            ])
          ])
        ])
      ])) : (openBlock(), createBlock(LoadingPage, { key: 1 }));
    };
  }
};
const _id_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-2ba1b088"]]);
export {
  _id_ as default
};
