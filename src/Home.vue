<script setup>
import { useAuth } from "@/auth/auth.composable";
import { watchEffect } from "@vue/runtime-core";
import { useRouter } from "vue-router";
import Section from "@/components/Section.vue";
import LoginButton from "@/auth/LoginButton.vue";
import ActionButton from "@/components/ActionButton.vue";

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

    <div class="flex flex-wrap gap-6 mb-4">
      <div class="flex-1">
        <div class="text-lg">
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
      </div>

      <div class="w-full lg:flex-1 flex flex-wrap content-start gap-4">
        <Section
          title="Configurable language technology analysis"
          class="w-64 flex-grow mt-0"
        >
          Your language data are analyzed by our language technology platform
          <a
            href="https://spraakbanken.gu.se/en/tools/sparv"
            title="About the Sparv tool"
            ><strong>Sparv</strong></a
          >
          according to your settings.
        </Section>

        <Section title="Deposit your text" class="w-64 flex-grow mt-0">
          Upload your word-processor documents, plain <em>txt</em> files or XML
          data. When using XML, the output of the analyses is added to the XML
          while keeping the input XML structure intact.
        </Section>

        <Section title="Explore in Korp" class="w-64 flex-grow mt-0">
          Export the resulting data, for search and statistical analysis, to
          <a
            href="https://spraakbanken.gu.se/en/tools/korp"
            title="About the Korp tool"
            ><strong>Korp</strong></a
          >
          and Strix.
        </Section>

        <Section title="Share and collaborate" class="w-64 flex-grow mt-0">
          Invite fellow researchers to view your data in our research tools,
          protected by login. Contact us (sb-info@svenska.gu.se) when you want
          to share your data with the research community.
          <p class="mb-2 italic">
            This feature is scheduled for an upcoming version of Mink.
          </p>
        </Section>
      </div>
    </div>

    <div>
      <p class="mb-2">
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
</style>
