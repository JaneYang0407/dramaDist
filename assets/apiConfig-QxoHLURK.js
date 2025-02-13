import { d as defineStore } from "./pinia-QRlfNOmY.js";
import { a as apiRequest } from "./index-7lo_Phz_.js";
import { a7 as reactive } from "./vue-CmclmBdx.js";
const useApiConfigStore = defineStore("config", () => {
  const apiConfig = reactive({});
  function getApiConfig() {
    apiRequest.get("/configuration").then((res) => {
      Object.assign(apiConfig, res);
    });
  }
  return {
    apiConfig,
    getApiConfig
  };
});
export {
  useApiConfigStore as u
};
