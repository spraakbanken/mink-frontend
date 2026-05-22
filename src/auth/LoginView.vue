<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import LoginButton from "@/auth/LoginButton.vue";
import PageTitle from "@/components/PageTitle.vue";
import LayoutSection from "@/components/LayoutSection.vue";
import HelpBox from "@/components/HelpBox.vue";

const route = useRoute();

const destination = computed(() => route.query.destination as string);
</script>

<template>
  <div>
    <PageTitle>{{ $t("login") }}</PageTitle>

    <HelpBox v-if="destination" important class="my-4">
      {{ $t("login.required") }}
    </HelpBox>

    <div class="flex flex-wrap gap-6">
      <LayoutSection
        class="mt-0! w-64 grow"
        :title="$t('signup.existing.title')"
      >
        <p>
          {{ $t("signup.existing.login") }}
        </p>
        <LoginButton />
        <p>
          {{ $t("signup.existing.tip") }}
        </p>
      </LayoutSection>

      <LayoutSection class="mt-0! w-64 grow" :title="$t('signup.new')">
        <p>{{ $t("signup.new.create") }}</p>
        <ol class="list-decimal pl-6">
          <li>
            <a :href="$t('signup.new.register.url')">
              {{ $t("signup.new.steps.create_eduid") }}
            </a>
            –
            <i18n-t keypath="signup.new.steps.skip_verification" scope="global">
              <template #em>
                <strong>{{
                  $t("signup.new.steps.skip_verification.em")
                }}</strong>
              </template>
            </i18n-t>
          </li>
          <li>
            <i18n-t keypath="signup.new.steps.login" scope="global">
              <template #login>
                <em>{{ $t("login") }}</em>
              </template>
            </i18n-t>
          </li>
          <li>
            <i18n-t keypath="signup.new.steps.idp" scope="global">
              <template #eduid>
                <em>{{ $t("signup.new.eduid") }}</em>
              </template>
            </i18n-t>
          </li>
        </ol>
      </LayoutSection>
    </div>
  </div>
</template>
