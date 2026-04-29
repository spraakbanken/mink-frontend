<script lang="ts" setup generic="T">
import { PhSortAscending, PhSortDescending } from "@phosphor-icons/vue";
import { computed, ref } from "vue";

/** Column definition for sortable table */
export type SortableTableColumn<T> = {
  /** Must be unique if used for sorting */
  title: string;
  /** Define a row comparator to enable sorting */
  comparator?: (a: T, b: T) => number;
  /** Classes to give to the `<th>` element */
  thClass?: string;
};

/** Holds current sort state */
export type SortState = {
  /** Column title */
  title: string;
  reverse: boolean;
};

const props = defineProps<{
  columns: SortableTableColumn<T>[];
  rows: T[];
  /** Should return a unique value from each row */
  getRowKey?: (row: T) => string | number;
  defaultSort?: SortState;
}>();

/** Current sort choice */
const sortState = ref<SortState | undefined>(props.defaultSort);

/** Rows after applying chosen sorting */
const rowsSorted = computed(() => {
  if (!sortState.value) return props.rows;
  const { title, reverse } = sortState.value;
  const column = props.columns.find((column) => column.title == title);
  if (!column?.comparator) return props.rows;

  const sorted = [...props.rows].sort(column.comparator);
  return reverse ? sorted.reverse() : sorted;
});

/** Set a new sort choice or reverse current sort */
function toggleSort(column: SortableTableColumn<T>) {
  // If column is already chosen, flip direction
  if (sortState.value?.title == column.title)
    sortState.value.reverse = !sortState.value.reverse;
  // If new column chosen, reassign state
  // Use `markRaw` to avoid proxying the column object
  else sortState.value = { title: column.title, reverse: false };
}
</script>

<template>
  <table>
    <thead>
      <tr>
        <th v-for="(column, i) in columns" :key="i" :class="column.thClass">
          <!-- Title for sortable column -->
          <div
            v-if="column.comparator"
            class="flex items-center gap-1 cursor-pointer"
            @click="toggleSort(column)"
          >
            {{ column.title }}

            <!-- Direction icon -->
            <template v-if="sortState?.title == column.title">
              <component
                :is="sortState.reverse ? PhSortDescending : PhSortAscending"
                class="inline mb-0.5"
              />
            </template>
          </div>

          <!-- Title for non-sortable column -->
          <template v-else>{{ column.title }}</template>
        </th>
      </tr>
    </thead>

    <tbody>
      <slot
        v-for="(row, i) in rowsSorted"
        :key="getRowKey ? getRowKey(row) : i"
        name="tr"
        :row
      >
        <tr>
          <slot :row />
        </tr>
      </slot>
    </tbody>
  </table>
</template>
