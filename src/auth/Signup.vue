<script setup>
import Section from "@/components/Section.vue";
import LoginButton from "./LoginButton.vue";
import PageTitle from "@/components/PageTitle.vue";
</script>

<template>
  <div>
    <PageTitle>{{ $t("signup") }}</PageTitle>
    <div class="flex flex-wrap gap-6">
      <Section
        class="!mt-0 w-64 flex-grow"
        :title="$t('signup.existing.title')"
      >
        <p>
          {{ $t("signup.existing.login") }}
        </p>
        <LoginButton />
        <p>
          {{ $t("signup.existing.tip") }}
        </p>
      </Section>

      <Section class="!mt-0 w-64 flex-grow" :title="$t('signup.new')">
        <i18n-t keypath="signup.new.create" scope="global" tag="p">
          <template #register>
            <a :href="$t('signup.new.register.url')" target="_blank">
              {{ $t("signup.new.register.label") }}
            </a>
          </template>
          <template #eduid>
            <em>{{ $t("signup.new.eduid") }}</em>
          </template>
        </i18n-t>
      </Section>
    </div>
  </div>
</template>
