import { computed, reactive } from "vue";
import { api } from "./api";

const info = reactive({});
api.getInfo().then((values) => Object.assign(info, values));

/** Wraps API endpoints with Spin. */
export default function useMinkBackendInfo() {
  const hasInfo = computed(() => Object.keys(info).length);

  const findInfo = (field, name) =>
    info[field]?.data.find((item) => item.name == name).value;
  return {
    info,
    hasInfo,
    findInfo,
  };
}
