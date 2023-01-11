<script setup>
import { useAuth } from "@/auth/auth.composable";
import { watchEffect } from "@vue/runtime-core";
import { useRouter } from "vue-router";
import Section from "@/components/Section.vue";
import LoginButton from "@/auth/LoginButton.vue";
import ActionButton from "@/components/ActionButton.vue";
import HomeIllustration from "./components/HomeIllustration.vue";

const { isAuthenticated } = useAuth();
const router = useRouter();

watchEffect(() => {
  if (isAuthenticated.value) {
    router.push("/dashboard");
  }
});
</script>

<template>
  <div>
    <div
      class="bg-amber-300 shadow shadow-amber-600 text-amber-900 p-2 px-4 mb-4"
    >
      <strong>Under construction.</strong> Please note that Mink is still in an
      early development stage, and access to it is thus currently restricted to
      Språkbanken Text employees.
    </div>

    <div class="flex flex-wrap gap-20 my-10">
      <div class="w-full flex flex-row-reverse flex-wrap items-center gap-20">
        <div class="w-full lg:flex-1 text-lg">
          <p class="mb-2">
            <strong>Språkbanken Text</strong> is a research infrastructure for
            language data. We create and maintain language data analysed with
            state-of-the-art language technology methods for researchers
            everywhere, and take pride in providing free and open access where
            possible.
          </p>

          <p class="mb-2">
            <strong>Mink</strong> is our effort to put Språkbanken Text’s
            research infrastructure into the hands of the researchers. You can
            use Mink to apply our language technology methods on texts that you
            have collected yourself. The resulting data can be downloaded or
            made available through our research tools, such as Korp and Strix,
            behind login.
          </p>

          <div class="flex justify-center gap-4 p-8 text-center text-xl">
            <LoginButton />

            <router-link to="/signup">
              <ActionButton variant="success">
                <icon :icon="['fas', 'user-plus']" />
                {{ $t("signup") }}
              </ActionButton>
            </router-link>
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
        <div class="flex flex-col md:flex-row 2xl:flex-col items-center gap-6">
          <HomeIllustration deg="-2" class="w-96 md:w-1/2 2xl:w-4/5">
            <img src="@/assets/sparv-screen.png" />
          </HomeIllustration>

          <Section
            title="Configurable language technology analysis"
            class="flex-1 my-0 text-center"
          >
            Your language data are analyzed by our language technology platform
            <a
              href="https://spraakbanken.gu.se/en/tools/sparv"
              title="About the Sparv tool"
              ><strong>Sparv</strong></a
            >
            according to your settings.
          </Section>
        </div>

        <div
          class="flex flex-col md:flex-row-reverse 2xl:flex-col items-center gap-6"
        >
          <HomeIllustration deg="2" class="w-96 md:w-1/2 2xl:w-4/5">
            <img src="@/assets/texts.png" />
          </HomeIllustration>

          <Section title="Deposit your text" class="flex-1 my-0 text-center">
            Upload your word-processor documents, plain <em>txt</em> files or
            XML data. When using XML, the output of the analyses is added to the
            XML while keeping the input XML structure intact.
          </Section>
        </div>

        <div class="flex flex-col md:flex-row 2xl:flex-col items-center gap-6">
          <HomeIllustration deg="-2" class="w-96 md:w-1/2 2xl:w-4/5">
            <img src="@/assets/korp-screen.png" />
          </HomeIllustration>

          <Section title="Explore in Korp" class="flex-1 my-0 text-center">
            Export the resulting data, for search and statistical analysis, to
            <a
              href="https://spraakbanken.gu.se/en/tools/korp"
              title="About the Korp tool"
              ><strong>Korp</strong></a
            >
            and Strix.
          </Section>
        </div>

        <div
          class="flex flex-col md:flex-row-reverse 2xl:flex-col items-center gap-6"
        >
          <HomeIllustration deg="2" class="w-96 md:w-1/2 2xl:w-5/6">
            <img src="@/assets/share.png" />
          </HomeIllustration>

          <Section
            title="Share and collaborate"
            class="flex-1 my-0 text-center"
          >
            Invite fellow researchers to view your data in our research tools,
            protected by login. Contact us (sb-info@svenska.gu.se) when you want
            to share your data with the research community.
            <p class="mb-2 italic">
              This feature is scheduled for an upcoming version of Mink.
            </p>
          </Section>
        </div>
      </div>
    </div>

    <div>
      <p class="max-w-2xl mx-auto mb-2">
        <strong>Mink or no Mink?</strong>
        Make sure to first get acquainted to any existing language data set
        related to your interests! Språkbanken's growing collection of research
        data can be browsed on the
        <a
          href="https://spraakbanken.gu.se/en/resources"
          title="Språkbanken Text: Language resources"
          >Data</a
        >
        section of our website. At a larger scale, Språkbanken forms a part of
        the CLARIN ERIC, whose collected assortment of data can be browsed in
        the
        <a
          href="https://vlo.clarin.eu/"
          title="CLARIN Virtual Language Observatory"
          >Virtual Language Observatory</a
        >.
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
