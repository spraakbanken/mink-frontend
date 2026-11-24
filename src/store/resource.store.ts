import { computed, reactive, ref, watch } from "vue";
import { defineStore, storeToRefs } from "pinia";
import { pick } from "es-toolkit";
import { useI18n } from "vue-i18n";
import { type Resource } from "./resource.types";
import { useUserStore } from "./user.store";
import { filterKeys } from "@/util";
import { useApi } from "@/api/useApi";
import type { JobState, ResourceInfo, ResourceType } from "@/api/api.types";
import useSpin from "@/spin/spin.composable";
import useAlert from "@/alert/alert.composable";

export const useResourceStore = defineStore("resource", () => {
  const api = useApi();
  const { spin } = useSpin();
  const userStore = useUserStore();
  const { adminMode } = storeToRefs(userStore);
  const { pushAlert } = useAlert();
  const { t } = useI18n();

  const ids = ref<string[]>([]);
  const resources = reactive<Record<string, Resource>>({});
  const hasResources = computed(() => Object.keys(resources).length);

  /** Whether the list of resources is fetched and not modified. */
  let freshList = false;

  /** Which resources have fresh info loaded. */
  const freshResources = new Set<string>();

  /** Load resource ids and update store to match. */
  async function loadResourceIds() {
    const idsNew = await spin(api.listResources(), "resources");
    ids.value = idsNew;

    // Forget absent resources
    filterKeys(resources, idsNew);

    return idsNew;
  }

  /** Load and store data about all the user's resources. */
  async function loadResources() {
    // If a coding error causes this to be called in admin mode, throw an error instead of making a huge request.
    if (adminMode.value)
      throw new Error("Full resource info must not be loaded in admin mode");

    // Skip if already loaded.
    if (!freshList) {
      const data = await spin(api.listResourceStatuses(), "resources");
      const idsNew = data.resources.map((info) => info.resource.id);
      ids.value = idsNew;

      // Forget old resources and store fresh info
      filterKeys(resources, idsNew);
      data.resources.forEach(storeResource);
      freshList = true;
    }

    return resources;
  }

  /** Load and store data about a given resource. */
  async function loadResource(
    id: string,
    skipCache = false,
    spinToken?: string,
  ): Promise<Resource> {
    spinToken ??= `${id}/info`;
    if (skipCache || !resources[id]) {
      const data = await spin(api.getResourceStatus(id), spinToken);
      storeResource(data);
    }
    return resources[id];
  }

  /** Loads a resource and asserts it is of the given type; throws error otherwise */
  const loadTypedResource = <T extends ResourceType>(type: T, id: string) =>
    loadResource(id).then((resource) => {
      if (resource.type != type)
        throw new Error(`Resource ${id} is not of type ${type}`);
      return resource as Resource<T>;
    });

  /** Store new state for a given resource. */
  function storeResource(info: ResourceInfo): Resource {
    const resource = {
      type: info.resource.type,
      name: info.resource.name,
      owner: pick(info.owner, ["id", "email", "name"]),
      job: info.job,
      publicId: info.resource.public_id,
      sources: info.resource.source_files.sort((a, b) =>
        a.name.localeCompare(b.name),
      ),
    };

    const id = info.resource.id;
    if (!ids.value.includes(id)) ids.value.push(id);

    if (resources[id]) onUpdateResource(resource, resources[id]);

    resources[id] = resource;
    freshResources.add(id);
    return resource;
  }

  /** Called when a previously loaded resource is updated. */
  function onUpdateResource<T extends ResourceType>(
    resource: Resource<T>,
    old: Resource<T>,
  ) {
    const status = getStatus(resource);
    const statusOld = getStatus(old);

    // Alert when a job is completed
    if (statusOld && statusOld != status) {
      if (status == "done") {
        const process = resource.job.current_process;
        const params = { process: t(`job.process.${process}`) };
        pushAlert(t("job.completed.done", params), "success");
      }
      if (status == "error") {
        const process = resource.job.current_process;
        const params = { process: t(`job.process.${process}`) };
        pushAlert(t("job.completed.error", params), "error");
      }
    }
  }

  // Invalidate resource list when switching admin mode on/off
  watch(adminMode, () => (freshList = false));

  return {
    loadResource,
    loadTypedResource,
    loadResourceIds,
    loadResources,
    ids,
    hasResources,
    resources,
  };
});

const getStatus = (resource: Resource): JobState | undefined =>
  resource.job.current_process
    ? resource.job.status[resource.job.current_process]
    : undefined;
