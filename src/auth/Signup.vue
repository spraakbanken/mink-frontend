<script setup>
import Section from "@/components/Section.vue";
import LoginButton from "./LoginButton.vue";
import PageTitle from "@/components/PageTitle.vue";
</script>

<template>
  <div>
    <PageTitle>Create account</PageTitle>
    <div class="flex flex-wrap gap-6">
      <Section
        class="!mt-0 w-64 flex-grow"
        title="You may already have an account"
      >
        <p>
          If your university account is connected to eduGAIN, you can directly
          use Mink by simply signing in:
        </p>
        <LoginButton />
        <p>
          (If you are not sure, click the button and search for your university
          or organization.)
        </p>
      </Section>

      <Section class="!mt-0 w-64 flex-grow" title="No account">
        <p>
          If you are not affiliated with any of the available identity
          providers, you can
          <a href="https://eduid.se/en/" target="_blank"
            >create an eduID account</a
          >
          and then sign in here, selecting <em>eduID Sweden</em> as identity
          provider.
        </p>
      </Section>
    </div>
  </div>
</template>
