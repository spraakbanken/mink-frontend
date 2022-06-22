import { computed } from "vue";

const VARIANTS = ["primary", "success", "warning", "danger"];

export const variantProps = {
  variant: {
    type: String,
    validator: (v) => VARIANTS.includes(v),
  },
};

export function useVariant(variantProp) {
  const variantClass = computed(() => variantProp && `mink-${variantProp}`);

  return {
    variantClass,
  };
}
