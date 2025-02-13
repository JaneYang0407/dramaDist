import { bP as useI18n, r as ref, bO as useRoute, a7 as reactive, c as computed, ag as onBeforeMount, w as watch, y as createElementBlock, z as openBlock, A as createBaseVNode, H as createBlock, M as createTextVNode, N as toDisplayString, D as normalizeClass, u as unref, P as createVNode, O as Fragment, an as renderList, aD as resolveComponent, bN as useRouter } from "./vue-CmclmBdx.js";
import { a as apiRequest } from "./index-7lo_Phz_.js";
import { D as DramaItem } from "./item-YgHiVTkO.js";
import { L as LoadingPage } from "./page-DYY7bfD8.js";
import "./vendor-3nH66FWi.js";
import "./element-plus-BqqwJ07U.js";
import "./swiper-Bjhxao44.js";
import "./pinia-QRlfNOmY.js";
import "./axios-DYLuwdcf.js";
const _hoisted_1 = { class: "MainBox outer Container xl:!px-60" };
const _hoisted_2 = { class: "text-white mb-9" };
const _hoisted_3 = { class: "text-primary" };
const _hoisted_4 = { class: "TabBtnBox mb-10" };
const _hoisted_5 = { key: 0 };
const _hoisted_6 = {
  key: 0,
  class: ""
};
const _hoisted_7 = { class: "grid grid-cols-2 gap-x-6 gap-y-15 xs:grid-cols-2 sm:grid-cols-4 xl:grid-cols-5 mb-10" };
const _hoisted_8 = {
  key: 1,
  class: "text-center text-white"
};
const _sfc_main = {
  __name: "[type]",
  setup(__props) {
    const { locale } = useI18n();
    const route = useRoute();
    const router = useRouter();
    const searchKeyword = ref(route.query.q);
    const loadingPage = ref(true);
    const mainData = reactive([]);
    const currentPage = ref(1);
    const totalResults = ref(0);
    const type = ref("movie");
    const type2 = computed(() => {
      if (type.value === "movie") {
        return "movie";
      } else if (type.value === "tv") {
        return "show";
      }
    });
    const fetchData = async () => {
      try {
        loadingPage.value = true;
        const res = await apiRequest.get(`/search/${type.value}`, {
          params: {
            language: locale.value,
            page: currentPage.value,
            query: searchKeyword.value
          }
        });
        Object.assign(mainData, res.results);
        totalResults.value = res.total_results;
        for (let i = 0; i < mainData.length; i++) {
          mainData[i].category = type2.value;
        }
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
    async function changeType(type3) {
      loadingPage.value = true;
      mainData.length = 0;
      currentPage.value = 1;
      router.push({
        path: `/search/${type3}`,
        query: {
          q: searchKeyword.value
        }
      });
      const res = await apiRequest.get(`/search/${type3}`, {
        params: {
          language: locale.value,
          page: 1,
          query: searchKeyword.value
        }
      });
      Object.assign(mainData, res.results);
      totalResults.value = res.total_results;
      for (let i = 0; i < mainData.length; i++) {
        mainData[i].category = type2.value;
      }
      loadingPage.value = false;
    }
    async function changePage(page) {
      loadingPage.value = true;
      mainData.length = 0;
      currentPage.value = page;
      const res = await apiRequest.get(`/search/${type.value}`, {
        params: {
          language: locale.value,
          page,
          query: searchKeyword.value
        }
      });
      Object.assign(mainData, res.results);
      totalResults.value = res.total_results;
      for (let i = 0; i < mainData.length; i++) {
        mainData[i].category = type2.value;
      }
      loadingPage.value = false;
    }
    watch(
      () => route.query.q,
      async () => {
        searchKeyword.value = route.query.q;
        loadingPage.value = true;
        mainData.length = 0;
        await apiRequest.get(`/search/${type.value}`, {
          params: {
            language: locale.value,
            page: 1,
            query: searchKeyword.value
          }
        }).then((res) => {
          Object.assign(mainData, res.results);
          for (let i = 0; i < mainData.length; i++) {
            mainData[i].category = type2.value;
          }
          loadingPage.value = false;
        });
      }
    );
    return (_ctx, _cache) => {
      const _component_ElPagination = resolveComponent("ElPagination");
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createBaseVNode("div", _hoisted_2, [
          createTextVNode(toDisplayString(_ctx.$t("search.search")) + "「 ", 1),
          createBaseVNode("span", _hoisted_3, toDisplayString(searchKeyword.value), 1),
          createTextVNode(" 」" + toDisplayString(_ctx.$t("search.result")), 1)
        ]),
        createBaseVNode("div", _hoisted_4, [
          createBaseVNode("div", {
            class: normalizeClass(["TabBtn", { active: unref(route).fullPath.indexOf("movie") > -1 }]),
            onClick: _cache[0] || (_cache[0] = ($event) => (changeType("movie"), type.value = "movie"))
          }, toDisplayString(_ctx.$t("global.movie")), 3),
          createBaseVNode("div", {
            class: normalizeClass(["TabBtn", { active: unref(route).fullPath.indexOf("tv") > -1 }]),
            onClick: _cache[1] || (_cache[1] = ($event) => (changeType("tv"), type.value = "tv"))
          }, toDisplayString(_ctx.$t("global.show")), 3)
        ]),
        !loadingPage.value ? (openBlock(), createElementBlock("div", _hoisted_5, [
          mainData.length > 0 ? (openBlock(), createElementBlock("div", _hoisted_6, [
            createBaseVNode("div", _hoisted_7, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(mainData, (item) => {
                return openBlock(), createBlock(DramaItem, {
                  key: item.id,
                  data: item,
                  category: item.category
                }, null, 8, ["data", "category"]);
              }), 128))
            ]),
            createVNode(_component_ElPagination, {
              layout: "prev, pager, next",
              "current-page": currentPage.value,
              total: totalResults.value,
              "pager-count": 5,
              "default-page-size": 20,
              onCurrentChange: changePage
            }, null, 8, ["current-page", "total"])
          ])) : (openBlock(), createElementBlock("div", _hoisted_8, toDisplayString(_ctx.$t("global.noData")), 1))
        ])) : (openBlock(), createBlock(LoadingPage, {
          key: 1,
          class: "!bg-transparent"
        }))
      ]);
    };
  }
};
export {
  _sfc_main as default
};
