<script setup lang="ts">
import { useRouter } from "vue-router";
import { FormKit } from "@formkit/vue";
import useMinkBackend from "@/api/backend.composable";
import useMessenger from "@/message/messenger.composable";
import PendingContent from "@/spin/PendingContent.vue";
import useCreateResource from "@/resource/createResource.composable";
import PageTitle from "@/components/PageTitle.vue";
import LayoutSection from "@/components/LayoutSection.vue";
import FormKitWrapper from "@/components/FormKitWrapper.vue";

const router = useRouter();
const mink = useMinkBackend();
const { alertError } = useMessenger();
const { addNewResource } = useCreateResource();

type Form = {
  publicId: string;
};

async function submit(fields: Form) {
  const resourceId = await mink
    .createMetadata(fields.publicId)
    .catch(alertError);
  if (!resourceId) return;

  await addNewResource("metadata", resourceId);

  router.push(`/library/metadata/${resourceId}`);
}
</script>

<template>
  <PageTitle>{{ $t("metadata.new") }}</PageTitle>
  <LayoutSection>
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
