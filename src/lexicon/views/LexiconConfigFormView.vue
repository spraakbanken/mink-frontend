<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { FormKit } from "@formkit/vue";
import {
  emptyConfig,
  makeConfig,
  type LexiconConfigOptions,
} from "../lexiconConfig";
import { useLexicon } from "../lexicon.composable";
import FormKitWrapper from "@/components/FormKitWrapper.vue";
import useResourceIdParam from "@/resource/resourceIdParam.composable";
import PendingContent from "@/spin/PendingContent.vue";
import { useConfigStore } from "@/store/config.store";
import { useUserStore } from "@/store/user.store";
import TerminalOutput from "@/components/TerminalOutput.vue";
import useMessenger from "@/alert/alert.composable";
import TabsBar from "@/components/TabsBar.vue";
import LayoutBox from "@/components/LayoutBox.vue";
import { useAppConfig } from "@/app/useAppConfig";
import useLocale from "@/i18n/locale.composable";

type TabKey = "metadata" | "settings";

type Form = LexiconConfigOptions;

const id = useResourceIdParam();
const { minkUrl } = useAppConfig();
const { config, configOptions } = useLexicon(id);
const { uploadConfig } = useConfigStore();
const { canWrite } = useUserStore();
const router = useRouter();
const { showAlert } = useMessenger();
const { locale3 } = useLocale();

const tabSelected = ref<TabKey>("metadata");

async function submit(fields: Form) {
  const original = configOptions.value || emptyConfig();

  const configNew = { ...fields };
  // Preserve hidden translations
  configNew.name = { ...original.name, ...fields.name };
  configNew.description = { ...original.description, ...fields.description };
  configNew.entryWord.description = {
    ...original.entryWord.description,
    ...fields.entryWord.description,
  };

  const config = { ...original, ...configNew };
  const yaml = makeConfig(id, config, minkUrl);
  try {
    await uploadConfig("lexicon", id, yaml);
    router.push(`/library/lexicon/${id}`);
  } catch (e) {
    if (e instanceof TypeError) {
      // Error from config serialization
      showAlert(e.message);
    } else showAlert(e);
  }
}
</script>

<template>
  <PendingContent :on="`${id}/config`">
    <TabsBar
      :tabs="[
        { key: 'metadata', label: $t('config.metadata') },
        { key: 'settings', label: $t('settings') },
      ]"
      v-model="tabSelected"
    />

    <!-- Using the key attribute to re-render whole form after fetching config -->
    <FormKitWrapper :key="config">
      <FormKit
        id="lexicon-config"
        type="form"
        :disabled="!canWrite('lexicon', id)"
        :submit-label="$t('save')"
        :submit-attrs="{
          inputClass: 'mink-button button-primary',
        }"
        @submit="submit"
      >
        <LayoutBox
          :aria-label="$t('metadata')"
          v-show="tabSelected == 'metadata'"
        >
          <!-- Use current UI language, so if it's "swe", show input for `name.swe` etc -->
          <!-- TODO Manage current input if user switches locale while editing -->
          <FormKit type="group" name="name">
            <FormKit
              :name="locale3"
              :label="$t('name')"
              :value="configOptions?.name?.[locale3]"
              :help="$t('metadata.name.help')"
              type="text"
              input-class="w-72"
            />
          </FormKit>

          <FormKit type="group" name="description">
            <FormKit
              :name="locale3"
              :label="$t('description')"
              :value="configOptions?.description?.[locale3]"
              :help="$t('metadata.description.help')"
              type="textarea"
              input-class="w-full h-20"
            />
          </FormKit>

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
        </LayoutBox>

        <LayoutBox
          :aria-label="$t('settings')"
          v-show="tabSelected == 'settings'"
        >
          <FormKit type="group" name="entryWord">
            <FormKit
              :label="$t('lexicon.config.entry_word.field')"
              type="text"
              name="field"
              validation="required"
              :value="configOptions?.entryWord?.field"
              :help="$t('lexicon.config.entry_word.field.help')"
            />

            <FormKit type="group" name="description">
              <FormKit
                :name="locale3"
                :label="$t('lexicon.config.entry_word.description')"
                :value="configOptions?.entryWord?.description?.[locale3]"
                :help="$t('lexicon.config.entry_word.description.help')"
                type="text"
                input-class="w-72"
              />
            </FormKit>
          </FormKit>
        </LayoutBox>
      </FormKit>
    </FormKitWrapper>
  </PendingContent>
</template>
