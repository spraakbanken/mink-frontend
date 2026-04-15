<script lang="ts" setup>
import { computedAsync } from "@vueuse/core";
import { attempt } from "es-toolkit";
import { computed } from "vue";
import { useRouter } from "vue-router";
import { FormKit } from "@formkit/vue";
import { PhTrash } from "@phosphor-icons/vue";
import { makeConfig, parseConfig } from "../lexiconConfig";
import FormKitWrapper from "@/components/FormKitWrapper.vue";
import LayoutSection from "@/components/LayoutSection.vue";
import useResourceIdParam from "@/resource/resourceIdParam.composable";
import PendingContent from "@/spin/PendingContent.vue";
import { useConfigStore } from "@/store/config.store";
import { useAuth } from "@/auth/auth.composable";
import LayoutBox from "@/components/LayoutBox.vue";
import TerminalOutput from "@/components/TerminalOutput.vue";
import type { ByLang } from "@/util.types";
import useMessenger from "@/message/messenger.composable";
import RouteButton from "@/components/RouteButton.vue";

type Form = {
  name: ByLang;
  description: ByLang;
};

const id = useResourceIdParam();
const { loadConfig, uploadConfig } = useConfigStore();
const { canWrite, canAdmin } = useAuth();
const router = useRouter();
const { alert, alertError } = useMessenger();

const config = computedAsync(() => loadConfig("lexicon", id));

const configOptions = computed(
  () => attempt(() => parseConfig(config.value || ""))[1],
);

async function submit(fields: Form) {
  const config = {
    name: fields.name,
    description: fields.description,
  };
  const yaml = makeConfig(id, config);
  try {
    await uploadConfig("lexicon", id, yaml);
    router.push(`/library/lexicon/${id}`);
  } catch (e) {
    if (e instanceof TypeError) {
      // Error from config serialization
      alert(e.message, "error");
    } else alertError(e);
  }
}
</script>

<template>
  <PendingContent :on="`${id}/config`">
    <LayoutSection :title="$t('configuration')">
      <!-- Using the key attribute to re-render whole form after fetching config -->
      <FormKitWrapper :key="config">
        <FormKit
          id="lexicon-config"
          type="form"
          :disabled="!canWrite('lexica', id)"
          :submit-label="$t('save')"
          :submit-attrs="{
            inputClass: 'mink-button button-primary',
          }"
          @submit="submit"
        >
          <div class="grid md:grid-cols-2 gap-4">
            <LayoutBox
              v-for="(lang2, lang3) of { swe: 'sv', eng: 'en' }"
              :key="lang3"
              :title="$t(lang2)"
            >
              <FormKit type="group" name="name">
                <FormKit
                  :name="lang3"
                  :label="$t('name')"
                  :value="configOptions?.name?.[lang3]"
                  :help="$t('metadata.name.help')"
                  type="text"
                  input-class="w-72"
                />
              </FormKit>

              <FormKit type="group" name="description">
                <FormKit
                  :name="lang3"
                  :label="$t('description')"
                  :value="configOptions?.description?.[lang3]"
                  :help="$t('metadata.description.help')"
                  type="textarea"
                  input-class="w-full h-20"
                />
              </FormKit>
            </LayoutBox>
          </div>

          <FormKit
            :label="$t('identifier')"
            type="text"
            name="identifier"
            disabled
            :value="id"
            :help="$t('metadata.identifier.help')"
          >
            <template #label>
              <!-- Avoid orphaned <label> for better accessibility -->
              <span class="formkit-label">{{ $t("identifier") }}</span>
            </template>
            <template #input>
              <TerminalOutput class="inline leading-loose">
                {{ id }}
              </TerminalOutput>
            </template>
          </FormKit>
        </FormKit>
      </FormKitWrapper>

      <div class="flex justify-center items-baseline gap-4">
        <RouteButton
          :disabled="!canAdmin('lexica', id)"
          :to="`/library/lexicon/${id}/delete`"
          class="button-danger"
        >
          <PhTrash weight="fill" class="inline mb-1 mr-1" />
          {{ $t("lexicon.delete") }}
        </RouteButton>
      </div>
    </LayoutSection>
  </PendingContent>
</template>
