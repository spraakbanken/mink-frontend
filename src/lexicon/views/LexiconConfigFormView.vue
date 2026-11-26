<script lang="ts" setup>
import { ref, watchEffect } from "vue";
import { FormKit } from "@formkit/vue";
import { useI18n } from "vue-i18n";
import { PhArrowDown, PhArrowUp, PhPlus, PhTrash } from "@phosphor-icons/vue";
import {
  createField,
  emptyConfig,
  LEXICON_FIELD_TYPES,
  makeConfig,
  type LexiconConfigOptions,
} from "../lexiconConfig";
import { useLexicon } from "../lexicon.composable";
import ActionButton from "@/components/ActionButton.vue";
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

type TabKey = "metadata" | "fields";

type Form = LexiconConfigOptions;

const id = useResourceIdParam();
const { minkUrl } = useAppConfig();
const { config, configOptions } = useLexicon(id);
const { uploadConfig } = useConfigStore();
const { canWrite } = useUserStore();
const { pushAlert, showAlert } = useMessenger();
const { t } = useI18n();
const { locale3 } = useLocale();

const tabSelected = ref<TabKey>("metadata");

const fields = ref<LexiconConfigOptions["fields"]>([createField()]);

/** Model for the local ID of the entry word field selection. */
const entryFieldId = ref("");

watchEffect(() => {
  const value = configOptions.value;
  if (!value) return;
  fields.value = value.fields || [];
  const entryField = fields.value.find((f) => f.name == value.entryWord.field);
  entryFieldId.value = entryField?._id || "";
});

function moveUp(field: LexiconConfigOptions["fields"][0]) {
  const index = fields.value.indexOf(field);
  if (index > 0) {
    fields.value.splice(index, 1);
    fields.value.splice(index - 1, 0, field);
  }
}

function moveDown(field: LexiconConfigOptions["fields"][0]) {
  const index = fields.value.indexOf(field);
  if (index < fields.value.length - 1) {
    fields.value.splice(index, 1);
    fields.value.splice(index + 1, 0, field);
  }
}

async function submit(form: Form) {
  const original = configOptions.value || emptyConfig();

  const configNew: LexiconConfigOptions = { ...form };

  const config = { ...original, ...configNew };
  try {
    const yaml = makeConfig(id, config, minkUrl);
    await uploadConfig("lexicon", id, yaml);
    pushAlert(t("config.saved"), "success");
  } catch (e) {
    showAlert(e);
  }
}
</script>

<template>
  <PendingContent :on="`${id}/config`">
    <TabsBar
      :tabs="[
        { key: 'metadata', label: $t('config.metadata') },
        { key: 'fields', label: $t('lexicon.config.field_settings') },
      ]"
      v-model="tabSelected"
    />

    <!-- Using the key attribute to re-render whole form after fetching config -->
    <FormKitWrapper v-if="configOptions !== undefined" :key="config">
      <FormKit
        id="lexicon-config"
        :value="configOptions"
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
              :key="locale3"
              :name="locale3"
              :label="$t('name')"
              :help="$t('metadata.name.help')"
              type="text"
              preserve
              input-class="w-72"
            />
          </FormKit>

          <FormKit type="group" name="description">
            <FormKit
              :key="locale3"
              :name="locale3"
              :label="$t('description')"
              :help="$t('metadata.description.help')"
              type="textarea"
              preserve
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
          :title="$t('lexicon.config.field_settings')"
          v-show="tabSelected == 'fields'"
        >
          <FormKit type="list" name="fields">
            <ol class="grid gap-1">
              <LayoutBox
                tag="li"
                v-for="field in fields"
                :key="field._id"
                class="flex flex-wrap gap-4 items-baseline"
              >
                <FormKit type="group" :name="field.name" :value="field">
                  <FormKit
                    :label="$t('lexicon.config.field.name')"
                    type="text"
                    name="name"
                    v-model="field.name"
                    validation="required:trim|matches:/^[^<>\s]*$/"
                    input-class="font-mono"
                  />
                  <FormKit type="group" name="label">
                    <FormKit
                      :label="$t('lexicon.config.field.label')"
                      type="text"
                      :name="locale3"
                    />
                  </FormKit>
                  <FormKit
                    type="select"
                    name="type"
                    :label="$t('lexicon.config.field.type')"
                    :options="
                      LEXICON_FIELD_TYPES.map((value) => ({
                        value,
                        label: $t(`lexicon.config.field.type.${value}`),
                      }))
                    "
                  />
                  <FormKit
                    type="checkbox"
                    name="collection"
                    :label="$t('lexicon.config.field.collection')"
                  />
                  <FormKit
                    type="checkbox"
                    name="required"
                    :label="$t('lexicon.config.field.required')"
                  />
                  <div class="ms-auto flex gap-2">
                    <ActionButton
                      @click="moveUp(field)"
                      class="text-start"
                      :disabled="fields.indexOf(field) == 0"
                      :title="$t('list.up')"
                    >
                      <PhArrowUp weight="bold" class="inline" />
                    </ActionButton>
                    <ActionButton
                      @click="moveDown(field)"
                      class="text-start"
                      :disabled="fields.indexOf(field) == fields.length - 1"
                      :title="$t('list.down')"
                    >
                      <PhArrowDown weight="bold" class="inline" />
                    </ActionButton>
                    <ActionButton
                      @click="fields.splice(fields.indexOf(field), 1)"
                      class="button-danger"
                      :title="$t('list.remove')"
                    >
                      <PhTrash weight="fill" class="inline" />
                    </ActionButton>
                  </div>
                </FormKit>
              </LayoutBox>
            </ol>

            <div class="mt-2">
              <ActionButton @click="fields.push(createField())">
                <PhPlus weight="bold" class="inline mb-0.5 mr-1" />
                {{ $t("list.add") }}
              </ActionButton>
            </div>
          </FormKit>

          <FormKit
            type="group"
            name="entryWord"
            :value="configOptions?.entryWord"
          >
            <!-- Use local IDs to track options, not names, as they can be changed above -->
            <FormKit
              type="select"
              :label="$t('lexicon.config.entry_word.field')"
              :options="[
                // Add an empty first option so that an invalid value triggers a validation error
                { value: '', label: '', attrs: { disabled: true } },
                ...fields.map((f) => ({ value: f._id, label: f.name })),
              ]"
              v-model="entryFieldId"
              :help="$t('lexicon.config.entry_word.field.help')"
              validation="required"
              input-class="font-mono"
            />

            <FormKit type="group" name="description">
              <FormKit
                :key="locale3"
                type="textarea"
                :name="locale3"
                :label="$t('lexicon.config.entry_word.description')"
                :help="$t('lexicon.config.entry_word.description.help')"
                preserve
                input-class="w-full"
              />
            </FormKit>
          </FormKit>
        </LayoutBox>
      </FormKit>
    </FormKitWrapper>
  </PendingContent>
</template>
