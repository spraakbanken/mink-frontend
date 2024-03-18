<script setup lang="ts">
import LoginButton from "@/auth/LoginButton.vue";
import LayoutSection from "@/components/LayoutSection.vue";
import PageTitle from "@/components/PageTitle.vue";
</script>

<template>
  <div>
    <PageTitle>{{ $t("signup") }}</PageTitle>
    <div class="flex flex-wrap gap-6">
      <LayoutSection
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
      </LayoutSection>

      <LayoutSection class="!mt-0 w-64 flex-grow" :title="$t('signup.new')">
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
      </LayoutSection>
    </div>
  </div>
</template>
