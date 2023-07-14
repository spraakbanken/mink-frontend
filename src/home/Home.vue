<script setup>
import { useAuth } from "@/auth/auth.composable";
import Section from "@/components/Section.vue";
import { getLogoutUrl } from "@/auth/auth";
import LoginButton from "@/auth/LoginButton.vue";
import ActionButton from "@/components/ActionButton.vue";
import HomeIllustration from "./HomeIllustration.vue";
import HomeNews from "./HomeNews.vue";

const { isAuthenticated, canUserWrite, payload } = useAuth();
const logoutUrl = getLogoutUrl();
</script>

<template>
  <div>
    <HomeNews />

    <div class="flex flex-wrap gap-20 my-10">
      <div class="w-full flex flex-row-reverse flex-wrap items-center gap-20">
        <div class="w-full lg:flex-1 text-lg">
          <i18n-t keypath="home.hero.sb" scope="global" tag="p" class="my-2">
            <strong>Språkbanken Text</strong>
          </i18n-t>
          <i18n-t keypath="home.hero.mink" scope="global" tag="p" class="my-2">
            <strong>Mink</strong>
          </i18n-t>
          <i18n-t
            keypath="home.hero.privacy"
            scope="global"
            tag="p"
            class="my-2"
          />

          <div class="flex justify-center gap-4 p-4 text-center text-xl">
            <div v-if="!isAuthenticated">
              <LoginButton />
              <div class="my-1 text-sm opacity-70">
                {{ $t("login.help") }}
              </div>
            </div>

            <div v-if="!isAuthenticated">
              <router-link to="/signup">
                <ActionButton variant="success">
                  <icon :icon="['fas', 'user-plus']" />
                  {{ $t("signup") }}
                </ActionButton>
              </router-link>
              <div class="my-1 text-sm opacity-70">
                {{ $t("signup.help") }}
              </div>
            </div>

            <div
              v-if="canUserWrite"
              class="bg-sky-100 p-4 rounded shadow-inner flex flex-wrap justify-center items-baseline gap-4"
            >
              <div>{{ $t("welcome", { name: payload.name }) }}</div>

              <router-link to="/corpus">
                <ActionButton variant="primary">
                  {{ $t("mydata") }}
                </ActionButton>
              </router-link>

              <a :href="logoutUrl">
                <ActionButton>
                  <icon :icon="['fas', 'person-running']" />
                  {{ $t("logout") }}
                </ActionButton>
              </a>
            </div>
          </div>
        </div>
        <div class="flex-1">
          <div class="bg-sborange rounded-full aspect-square flex items-center">
            <img src="@/assets/mink-screen.png" class="shadow-lg image3d" />
          </div>
        </div>
      </div>

      <div
        class="flex flex-col 2xl:flex-row my-20 gap-20 md:w-4/5 lg:w-2/3 2xl:w-full mx-auto"
      >
        <div
          class="flex-1 flex flex-col md:flex-row 2xl:flex-col items-center gap-6"
        >
          <HomeIllustration class="w-96 md:w-1/2 2xl:w-4/5">
            <img src="@/assets/sparv-screen.png" />
          </HomeIllustration>

          <Section
            :title="$t('home.features.sparv.title')"
            class="flex-1 my-0 text-center"
          >
            <i18n-t keypath="home.features.sparv.body" scope="global" tag="p">
              <template #sparv>
                <a href="https://spraakbanken.gu.se/en/tools/sparv">
                  <strong>Sparv</strong>
                </a>
              </template>
            </i18n-t>
          </Section>
        </div>

        <div
          class="flex-1 flex flex-col md:flex-row-reverse 2xl:flex-col items-center gap-6"
        >
          <HomeIllustration class="w-96 md:w-1/2 2xl:w-4/5">
            <img src="@/assets/texts.png" />
          </HomeIllustration>

          <Section
            :title="$t('home.features.upload.title')"
            class="flex-1 my-0 text-center"
          >
            <i18n-t
              keypath="home.features.upload.body"
              scope="global"
              tag="p"
            />
          </Section>
        </div>

        <div
          class="flex-1 flex flex-col md:flex-row 2xl:flex-col items-center gap-6"
        >
          <HomeIllustration class="w-96 md:w-1/2 2xl:w-4/5">
            <img src="@/assets/korp-screen.png" />
          </HomeIllustration>

          <Section
            :title="$t('home.features.explore.title')"
            class="flex-1 my-0 text-center"
          >
            <i18n-t keypath="home.features.explore.body" scope="global" tag="p">
              <template #korp>
                <a
                  href="https://spraakbanken.gu.se/en/tools/korp"
                  title="About the Korp tool"
                >
                  <strong>Korp</strong>
                </a>
              </template>
              <template #strix>
                <a href="https://spraakbanken.gu.se/strix/">
                  <strong>Strix</strong></a
                >
              </template>
            </i18n-t>
          </Section>
        </div>

        <div
          class="flex-1 flex flex-col md:flex-row-reverse 2xl:flex-col items-center gap-6"
        >
          <HomeIllustration class="w-96 md:w-1/2 2xl:w-5/6">
            <img src="@/assets/share.png" />
          </HomeIllustration>

          <Section
            :title="$t('home.features.share.title')"
            class="flex-1 my-0 text-center"
          >
            <i18n-t keypath="home.features.share.body" scope="global" tag="p" />
            <i18n-t
              keypath="home.features.share.upcoming"
              scope="global"
              tag="p"
              class="italic"
            />
          </Section>
        </div>
      </div>
    </div>

    <div>
      <p class="max-w-2xl mx-auto mb-2">
        <strong>{{ $t("home.otherdata.title") }}</strong>
        {{ " " }}
        <i18n-t keypath="home.otherdata.body" scope="global">
          <a
            href="https://spraakbanken.gu.se/en/resources"
            :title="$t('home.otherdata.sbdata.title')"
            >Data</a
          >
          <a
            href="https://vlo.clarin.eu/"
            title="CLARIN Virtual Language Observatory"
            >Virtual Language Observatory</a
          >
        </i18n-t>
      </p>
    </div>
  </div>
</template>

<style scoped>
.mt-0 {
  margin-top: 0;
}

.image3d {
  transform: scale(0.9) perspective(500px) rotateY(3deg);
  transition: transform ease-in-out 300ms;
}
.image3d:hover {
  transform: scale(0.95) perspective(500px) rotateY(6deg);
}
</style>
