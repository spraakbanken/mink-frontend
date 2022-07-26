<script setup>
import { useJwt } from "@/composables/jwt";
import { watchEffect } from "@vue/runtime-core";
import { useRouter } from "vue-router";
import PageTitle from "@/components/PageTitle.vue";
import Section from "@/components/layout/Section.vue";
import ActionButton from "@/components/layout/ActionButton.vue";
import LoginButton from "@/components/LoginButton.vue";

const { isAuthenticated } = useJwt();
const router = useRouter();

watchEffect(() => {
  if (isAuthenticated.value) {
    router.push("/dashboard");
  }
});
</script>

<template>
  <div>
    <div class="bg-amber-100 text-amber-800 p-2 px-4">
      <strong>Under construction.</strong> Please note that Mink is still in an
      early development stage, and access to it is thus currently restricted to
      Språkbanken Text employees.
    </div>

    <PageTitle>Create your corpus</PageTitle>

    <div class="flex flex-wrap -m-4">
      <div class="lg:w-1/2 p-4">
        <p class="mb-2">
          <strong>Språkbanken Text</strong> is a research infrastructure for
          language resources. We create, maintain and host resources for the
          disposal of researchers everywhere, and take pride in providing free
          and open access where possible.
        </p>
        <p class="mb-2">
          <strong>Mink</strong> is our effort to bring more of our language
          resource tools into the hands of researchers. You can use Mink to run
          automatic annotation models on texts that you have collected yourself.
          The resulting resource can be downloaded, shared, and used directly
          for concordance search in Korp.
        </p>
        <div class="text-center p-4 text-xl">
          <LoginButton class="mr-4" />
          <a href="https://spraakbanken.gu.se/auth/">
            <ActionButton>
              <icon :icon="['fas', 'user-plus']" />
              {{ $t("account.create") }}
            </ActionButton>
          </a>
        </div>
      </div>

      <div class="lg:w-1/2 p-4">
        <Section title="Configurable linguistic analysis" class="mt-0">
          Text documents are analyzed by
          <a
            href="https://spraakbanken.gu.se/en/tools/sparv"
            title="About the Sparv tool"
            ><strong>Sparv</strong></a
          >
          according to your settings. In a way, Mink is just a user interface to
          Sparv.
        </Section>

        <Section title="Upload your text data" class="mt-0">
          Add your word-processor documents, plain <em>txt</em> files or XML
          data. When using XML, annotations are added as attributes, keeping the
          structure intact.
        </Section>

        <Section title="Explore in Korp" class="mt-0">
          Use the resulting annotations for concordance search and statistical
          analysis in
          <a
            href="https://spraakbanken.gu.se/en/tools/korp"
            title="About the Korp tool"
            ><strong>Korp</strong></a
          >.
        </Section>

        <Section title="Collaboration and sharing" class="mt-0">
          Invite fellow project members to manage the process. Share the
          finished resource to the research community.
        </Section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mt-0 {
  margin-top: 0;
}
</style>
