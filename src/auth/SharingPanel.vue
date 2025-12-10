<script setup lang="ts">
import { PhShareNetwork } from "@phosphor-icons/vue";
import { computedAsync } from "@vueuse/core";
import UrlButton from "@/components/UrlButton.vue";
import {
  createAuthGuiUrl,
  getAccessLevel,
  type JwtSbResourceType,
} from "@/auth/sbAuth";
import { useResourceStore } from "@/store/resource.store";
import TerminalOutput from "@/components/TerminalOutput.vue";

const props = defineProps<{
  resourceType: JwtSbResourceType;
  resourceId: string;
}>();

const store = useResourceStore();

const resource = computedAsync(() => store.loadResource(props.resourceId));
</script>

<template>
  <div v-if="resource">
    <table class="w-full">
      <tbody>
        <tr>
          <th>{{ $t("sharing.owner") }}</th>
          <td>
            {{ resource.owner.name }}
          </td>
        </tr>

        <tr>
          <th>{{ $t("sharing.level") }}</th>
          <td class="flex gap-3 items-baseline">
            <div>
              <TerminalOutput class="inline leading-loose">
                {{ getAccessLevel(resourceType, resourceId) }}
              </TerminalOutput>
            </div>
            <UrlButton
              v-if="getAccessLevel(resourceType, resourceId) == 'ADMIN'"
              :href="createAuthGuiUrl(resourceId)"
              target="_blank"
            >
              <PhShareNetwork class="inline mr-1 mb-1" />
              {{ $t("sharing.manage") }}
            </UrlButton>
          </td>
        </tr>
      </tbody>
    </table>

    <details class="my-2 prose">
      <summary class="font-medium">{{ $t("sharing.help.heading") }}</summary>

      <p>
        {{ $t("sharing.help.sbauth") }}
        {{ $t("sharing.help.levels.before") }}
      </p>
      <ul>
        <li><strong>READ</strong> – {{ $t("sharing.help.levels.read") }}</li>
        <li><strong>WRITE</strong> – {{ $t("sharing.help.levels.write") }}</li>
        <li><strong>ADMIN</strong> – {{ $t("sharing.help.levels.admin") }}</li>
      </ul>
      <p>{{ $t("sharing.help.levels.after") }}</p>
    </details>
  </div>
</template>
