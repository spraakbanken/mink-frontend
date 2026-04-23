<script setup lang="ts">
import { FormKit } from "@formkit/vue";
import FormKitWrapper from "@/components/FormKitWrapper.vue";
import HelpBox from "@/components/HelpBox.vue";
import LayoutSection from "@/components/LayoutSection.vue";
import PageTitle from "@/components/PageTitle.vue";
import PendingContent from "@/spin/PendingContent.vue";
import useSpin from "@/spin/spin.composable";
import useAlert from "@/alert/alert.composable";
import { useLexiconStore } from "@/store/lexicon.store";

type Form = {
  name: string;
};

const { spin } = useSpin();
const { createLexicon } = useLexiconStore();
const { showAlert } = useAlert();

async function submit(fields: Form) {
  spin(createLexicon(fields.name), "create").catch(showAlert);
}
</script>

<template>
  <PageTitle>{{ $t("lexicon.new") }}</PageTitle>
  <LayoutSection>
    <HelpBox>
      {{ $t("lexicon.help") }}
      {{ $t("resource.create.help") }}
    </HelpBox>

    <PendingContent on="create">
      <FormKitWrapper>
        <FormKit
          id="create-lexicon"
          type="form"
          :submit-label="$t('create')"
          :submit-attrs="{
            inputClass: 'mink-button button-primary',
          }"
          @submit="submit"
        >
          <FormKit
            :label="$t('name')"
            type="text"
            validation="required:trim"
            name="name"
            input-class="w-72"
          />
        </FormKit>
      </FormKitWrapper>
    </PendingContent>
  </LayoutSection>
</template>
