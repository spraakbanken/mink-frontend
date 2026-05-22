<script setup lang="ts">
import HomeNews from "./HomeNews.vue";
import HomeUserBox from "./HomeUserBox.vue";
import HomeNewsFeatured from "@/home/HomeNewsFeatured.vue";
import minkScreen from "@/assets/mink-screen.png";
import minkScreenDark from "@/assets/mink-screen-dark.png";
import { injectComponent } from "@/injection";

const HomeIntro = injectComponent("HomeIntro", () => import("./HomeIntro.vue"));

const HomeSecondary = injectComponent(
  "HomeSecondary",
  () => import("@/components/EmptyComponent.vue"),
);
</script>

<template>
  <div>
    <HomeNewsFeatured />

    <div class="flex flex-col gap-10 my-10">
      <div class="w-full flex flex-row-reverse flex-wrap items-center gap-20">
        <div class="w-full lg:flex-1 text-lg">
          <HomeIntro />

          <HomeUserBox />
        </div>

        <div class="flex-1">
          <div
            class="bg-sborange-600 dark:bg-sbteal-900 rounded-full aspect-square flex items-center"
          >
            <picture class="shadow-lg image3d">
              <source
                media="(prefers-color-scheme: dark)"
                :srcset="minkScreenDark"
              />
              <img :src="minkScreen" :alt="$t('home.hero.alt')" />
            </picture>
          </div>
        </div>
      </div>

      <HomeNews />

      <HomeSecondary />
    </div>
  </div>
</template>

<style scoped>
.image3d {
  transform: scale(0.9) perspective(500px) rotateY(3deg);
  transition: transform ease-in-out 300ms;
}
.image3d:hover {
  transform: scale(0.95) perspective(500px) rotateY(6deg);
}
</style>
