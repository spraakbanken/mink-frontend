<template>
  <div>
    <div
      class="bg-amber-300 shadow shadow-amber-600 text-amber-900 p-2 px-4 mb-4"
    >
      <strong>{{ $t("devnotice.title") }}</strong>
      {{ $t("devnotice.description") }}
    </div>

    <h1>{{ $t("accessdenied") }}</h1>
    <p>{{ $t("accessdenied.contact") }}</p>
    <router-link to="/">{{ $t("home") }}</router-link>
  </div>
</template>
