import { computed } from "vue";

const VARIANTS = ["primary", "success", "warning", "danger"];

export const variantProps = {
  variant: {
    type: String,
    validator: (v) => VARIANTS.includes(v),
  },
};

/**
 * The expected usage is to include `variantProps` in `defineProps`
 * and then pass the `variant` prop to `useVariant`. For proper reactivity,
 * pass a constant function instead of the direct value.
 *
 *     const props = defineProps({ ...variantProps });
 *     const { variantClass } = useVariant(() => props.variant);
 */
export function useVariant(getVariant) {
  const variantClass = computed(() => getVariant() && `mink-${getVariant()}`);

  return {
    variantClass,
  };
}
