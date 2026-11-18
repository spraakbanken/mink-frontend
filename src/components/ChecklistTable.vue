<template>
  <table class="w-full table-lined">
    <thead>
      <tr>
        <th>{{ $t("checklist.task") }}</th>
        <th>{{ $t("status") }}</th>
      </tr>
    </thead>

    <tbody>
      <slot />
    </tbody>
  </table>
</template>
