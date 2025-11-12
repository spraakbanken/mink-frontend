<script setup lang="ts">
import { useRouter } from "vue-router";
import { FormKit } from "@formkit/vue";
import api from "@/api/api";
import useMessenger from "@/message/messenger.composable";
import useSpin from "@/spin/spin.composable";
import PendingContent from "@/spin/PendingContent.vue";
import { useAuth } from "@/auth/auth.composable";
import PageTitle from "@/components/PageTitle.vue";
import LayoutSection from "@/components/LayoutSection.vue";
import FormKitWrapper from "@/components/FormKitWrapper.vue";
import HelpBox from "@/components/HelpBox.vue";

const router = useRouter();
const { alertError } = useMessenger();
const { refreshAuth } = useAuth();
const { spin } = useSpin();

type Form = {
  publicId: string;
};

async function submit(fields: Form) {
  const id = await spin(
    api.createMetadata(fields.publicId).catch(alertError),
    "create",
  );
  if (!id) return;

  // Have the new corpus included in further API calls.
  await refreshAuth();

  router.push(`/library/metadata/${id}`);
}
</script>

<template>
  <PageTitle>{{ $t("metadata.new") }}</PageTitle>
  <LayoutSection>
    <HelpBox>{{ $t("metadata.help") }}</HelpBox>

    <PendingContent on="create">
      <FormKitWrapper>
        <FormKit
          id="create-metadata"
          type="form"
          :submit-label="$t('create')"
          :submit-attrs="{
            inputClass: 'mink-button button-primary',
          }"
          @submit="submit"
        >
          <FormKit
            :label="$t('public_id')"
            type="text"
            :validation="[
              ['required'],
              ['trim'],
              ['matches', /^[a-z0-9][a-z0-9-]+[a-z0-9]$/],
            ]"
            :validation-messages="{
              matches: $t('metadata.public_id.error.format'),
            }"
            name="publicId"
            input-class="w-72 font-mono"
            :help="$t('metadata.public_id.help')"
          />
        </FormKit>
      </FormKitWrapper>
    </PendingContent>
  </LayoutSection>
</template>
