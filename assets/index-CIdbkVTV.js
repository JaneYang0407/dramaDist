import { D as DramaItem } from "./item-YgHiVTkO.js";
import { r as ref, a7 as reactive, y as createElementBlock, z as openBlock, A as createBaseVNode, b$ as createStaticVNode, P as createVNode, N as toDisplayString, I as withCtx, aD as resolveComponent, O as Fragment, an as renderList, H as createBlock } from "./vue-CmclmBdx.js";
import "./index-7lo_Phz_.js";
import "./pinia-QRlfNOmY.js";
import "./axios-DYLuwdcf.js";
import "./vendor-3nH66FWi.js";
import "./element-plus-BqqwJ07U.js";
import "./swiper-Bjhxao44.js";
const _hoisted_1 = { class: "MainBox outer Container" };
const _hoisted_2 = { class: "TabBtnBox mb-5" };
const _hoisted_3 = { class: "TabBtn active" };
const _hoisted_4 = { class: "TabBtn" };
const _hoisted_5 = { class: "grid grid-cols-2 gap-x-6 gap-y-15 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 3xl:grid-cols-6 5xl:grid-cols-7" };
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const sort = ref("Option1");
    const sortOptions = [
      {
        value: "Option1",
        label: "最新上映"
      },
      {
        value: "Option2",
        label: "熱門"
      }
    ];
    const mainData = reactive([]);
    const mainDataRes = ref([
      {
        id: "1",
        img: "src/assets/images/poster.jpg",
        title: "淚之女王1"
      },
      {
        id: "2",
        img: "src/assets/images/poster.jpg",
        title: "淚之女王3"
      },
      {
        id: "3",
        img: "src/assets/images/poster.jpg",
        title: "淚之女王3"
      },
      {
        id: "4",
        img: "src/assets/images/poster.jpg",
        title: "淚之女王4"
      },
      {
        id: "5",
        img: "src/assets/images/poster.jpg",
        title: "淚之女王5"
      },
      {
        id: "6",
        img: "src/assets/images/poster.jpg",
        title: "淚之女王6"
      },
      {
        id: "7",
        img: "src/assets/images/poster.jpg",
        title: "淚之女王7"
      },
      {
        id: "8",
        img: "src/assets/images/poster.jpg",
        title: "淚之女王8"
      },
      {
        id: "9",
        img: "src/assets/images/poster.jpg",
        title: "淚之女王9"
      }
    ]);
    const mainDataDatabase = ref([
      {
        id: "1",
        favorite: true,
        watchlist: true
      },
      {
        id: "2",
        favorite: true,
        watchlist: false
      },
      {
        id: "3",
        favorite: true,
        watchlist: true
      },
      {
        id: "4",
        favorite: false,
        watchlist: false
      },
      {
        id: "5",
        favorite: false,
        watchlist: true
      },
      {
        id: "6",
        favorite: false,
        watchlist: false
      },
      {
        id: "7",
        favorite: true,
        watchlist: true
      },
      {
        id: "8",
        favorite: false,
        watchlist: true
      },
      {
        id: "9",
        favorite: true,
        watchlist: false
      }
    ]);
    Object.assign(mainData, mainDataRes.value);
    for (let i = 0; i < mainDataDatabase.value.length; i++) {
      for (let j = 0; j < mainData.length; j++) {
        if (mainDataDatabase.value[i].id === mainData[j].id) {
          mainData[j].favorite = mainDataDatabase.value[i].favorite;
          mainData[j].watchlist = mainDataDatabase.value[i].watchlist;
        }
      }
    }
    return (_ctx, _cache) => {
      const _component_ElOption = resolveComponent("ElOption");
      const _component_ElSelect = resolveComponent("ElSelect");
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createBaseVNode("div", _hoisted_2, [
          createBaseVNode("div", _hoisted_3, toDisplayString(_ctx.$t("global.movie")), 1),
          createBaseVNode("div", _hoisted_4, toDisplayString(_ctx.$t("global.show")), 1)
        ]),
        _cache[1] || (_cache[1] = createStaticVNode('<div class="FilterListBox mb-4"><div class="FilterList"><div class="FilterListTitle">分類</div><div class="FilterListCont"><div class="FilterListContItem active">全部</div><div class="FilterListContItem">動作</div><div class="FilterListContItem">劇情</div><div class="FilterListContItem">愛情</div></div></div><div class="FilterList"><div class="FilterListTitle">國家</div><div class="FilterListCont"><div class="FilterListContItem active">全部</div><div class="FilterListContItem">台灣</div><div class="FilterListContItem">韓國</div><div class="FilterListContItem">日本</div></div></div><div class="FilterList"><div class="FilterListTitle">年份</div><div class="FilterListCont"><div class="FilterListContItem active">全部</div><div class="FilterListContItem">2024</div><div class="FilterListContItem">2023</div><div class="FilterListContItem">2022</div></div></div></div>', 1)),
        createVNode(_component_ElSelect, {
          modelValue: sort.value,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => sort.value = $event),
          class: "searchSortSel",
          placeholder: "Select"
        }, {
          default: withCtx(() => [
            (openBlock(), createElementBlock(Fragment, null, renderList(sortOptions, (item) => {
              return createVNode(_component_ElOption, {
                key: item.value,
                label: item.label,
                value: item.value
              }, null, 8, ["label", "value"]);
            }), 64))
          ]),
          _: 1
        }, 8, ["modelValue"]),
        createBaseVNode("div", _hoisted_5, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(mainData, (item) => {
            return openBlock(), createBlock(DramaItem, {
              key: item.id,
              data: item
            }, null, 8, ["data"]);
          }), 128))
        ])
      ]);
    };
  }
};
export {
  _sfc_main as default
};
