<template>
  <Section :title="filename">
    <table class="w-full mt-4">
      <tbody>
        <tr>
          <th>Filnamn</th>
          <td>{{ filename }}</td>
        </tr>
        <tr>
          <th>Filtyp</th>
          <td>
            <code>{{ metadata.type }}</code>
          </td>
        </tr>
        <tr>
          <th>Uppladdad</th>
          <td>
            {{ new Date(metadata.last_modified).toLocaleString() }}
          </td>
        </tr>
      </tbody>
    </table>
  </Section>
</template>

<script setup>
import { computed } from "@vue/reactivity";
import { useStore } from "vuex";
import Section from "@/components/layout/Section.vue";

const props = defineProps({
  corpusId: { type: String, required: true },
  filename: { type: String, required: true },
});

const store = useStore();
const metadata = computed(() =>
  store.state.corpora[props.corpusId].sources.find(
    (source) => source.name === props.filename
  )
);
</script>

<style></style>
