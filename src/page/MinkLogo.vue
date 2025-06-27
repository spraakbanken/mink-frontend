<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import logo from "@/assets/mink.svg";
import logoSlogan from "@/assets/mink-slogan.svg";
import logoSloganEn from "@/assets/mink-slogan-en.svg";
import logoLight from "@/assets/mink-light.svg";
import logoLightSlogan from "@/assets/mink-light-slogan.svg";
import logoLightSloganEn from "@/assets/mink-light-slogan-en.svg";
import ColorSchemeImage from "@/components/ColorSchemeImage.vue";

const props = defineProps<{
  large: boolean;
}>();

const { locale } = useI18n();

const src = computed(() =>
  props.large ? (locale.value == "en" ? logoSloganEn : logoSlogan) : logo,
);
const srcLight = computed(() =>
  props.large
    ? locale.value == "en"
      ? logoLightSloganEn
      : logoLightSlogan
    : logoLight,
);
</script>

<template>
  <ColorSchemeImage
    :alt="$t('logo.alt')"
    :src
    :srcLight
    :class="[large ? 'h-24 relative top-1' : 'h-16']"
  />
</template>
