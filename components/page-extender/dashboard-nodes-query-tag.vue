<template>
  <div class="flex justify-between mb-4">
    <div class="basis">
      <NuxtLink :to="{ name: 'app-dashboard-nodes' }">
        <Icon class="mb-[-2px]" name="ic:round-arrow-back-ios-new" />
        <span> Kembali </span>
      </NuxtLink>
    </div>
    <div class="basis">
      <span class="text-orange-700 uppercase font-semibold">
        {{ nodeData?.data?.name }}</span
      >
    </div>
  </div>
  <div class="flex flex-wrap gap-2" v-if="nodeData?.data?.items">
    <div
      class="node-item min-w-72 basis-full sm:basis-[calc(50%_-_0.25rem)] border border-orange-400 rounded p-4"
      v-for="nodeItem in nodeData?.data?.items?.filter(
        (nodeItem) => nodeItem !== null
      ) || []"
    >
      <div class="flex gap-2">
        <div class="h-[60px] w-[60px]">
          <Icon class="block" :name="nodeItem.icon" size="56" />
        </div>
        <div>
          <div class="mb-2">
            <span class="capitalize font-semibold ms-1">
              {{ nodeItem.name }}
            </span>
          </div>
          <div
            class="flex gap-2 h-[36px] p-1"
            v-if="nodeItem.type === 'switch' && nodeItem.current"
          >
            <button
              :class="[
                `block h-[26px] shadow-[0px_5px_#999] shadow-neutral-400 outline outline-[2px] outline-neutral-50 rounded-[15px] relative before:absolute before:top-1 before:bottom-1 before:right-1 before:left-1 before:rounded-full`,
                nodeItem.current === 'on'
                  ? 'before:bg-green-700'
                  : 'before:bg-red-700',
              ]"
              @mousedown="itemAction.fn(nodeItem.name).init()"
              @click.prevent="itemAction.fn().exec()"
            >
              <Icon
                class="block relative translate-y-[-13px]"
                size="51px"
                :name="
                  nodeItem.current === 'on'
                    ? 'line-md:switch-off-to-switch-transition'
                    : 'line-md:switch-to-switch-off-transition'
                "
              />
            </button>
            <button
              :class="[
                'h-[26px] bg-blue-100 border-[1px] border-neutral-400 outline outline-[2px] outline-neutral-50 active:translate-y-[2px] shadow-[0px_5px_#999] shadow-neutral-400 active:shadow-[0px_3px_#888] rounded-[15px]',
              ]"
              v-if="nodeItem.current === 'on'"
            >
              <Icon class="block" size="24px" name="mdi:loop" />
            </button>
          </div>
          <div class="h-[36px] p-1" v-else-if="nodeItem.type === 'push'">
            <button
              :class="[
                'h-[26px] bg-blue-600 border-[5px] border-neutral-950 outline outline-[2px] outline-neutral-50 active:translate-y-[2px] shadow-[0px_5px_#999] shadow-neutral-400 active:shadow-[0px_3px_#888] rounded-[15px]',
              ]"
              @mousedown="itemAction.fn(nodeItem.name).init()"
              @click.prevent="itemAction.fn().exec()"
            >
              <Icon
                :class="['block bg-transparent active:translate-y-[9px] h-4']"
                size="36px"
                name="fluent:oval-48-filled"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div
    class="action-confirmation"
    v-if="toValue(itemAction.data.value?.isActive) === false"
  >
    <CompositeModalFullPage>
      <div class="container max-w-screen-md">
        <div class="p-4">
          <div class="mb-4">
            <span class="font-semibold"> Swipe to confirm action </span>
          </div>
          <CompositeSwipeConfirmation
            class="max-w-[480px] mb-2"
            @confirmed="itemAction.fn().exec()"
          />
          <div class="text-center">
            <button
              class="text-blue-400 underline"
              @click.prevent="itemAction.fn().cancel()"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </CompositeModalFullPage>
  </div>
</template>

<script setup lang="ts">
import type { Pausable, UseIntervalControls } from "@vueuse/core";

const serialNumber = useRoute().query["tag"];
const { data: nodeData, refresh: refreshnodesData } = await useLazyFetch(
  `/api/v1.0/node/${serialNumber}` as "/api/v1.0/node/:serialNumber"
);

type ItemActionFn = (label?: string) => {
  init: () => void;
  exec: () => void;
  cancel: () => void;
};

interface ItemAction {
  data: globalThis.Ref<
    (UseIntervalControls & Pausable & { itemIndex?: number }) | null
  >;
  fn: ItemActionFn;
}

const itemAction: ItemAction = {
  data: ref(null),
  fn: (label?: string) => {
    const init = () => {
      itemAction.data.value = computed(() => {
        const findIndex = nodeData.value?.data?.items?.findIndex(
          (node) => node?.name == label
        );
        console.log({ label, itemAction: findIndex });

        return typeof findIndex === "number" && findIndex >= 0
          ? {
              ...useInterval(100, { controls: true }),
              itemIndex: findIndex,
            }
          : null;
      }).value;

      setTimeout(() => {
        if (itemAction.data.value?.isActive.value) {
          reset();
        }
      }, 30000);
    };

    const exec = () => {
      if (itemAction.data.value === null) return;

      if (itemAction.data.value.isActive) return itemAction.data.value.pause();
      console.log({ itemAction: itemAction.data.value });
      setTimeout(() => reset(), 2000);
    };

    const cancel = () => reset();

    const reset = () => {
      itemAction.data.value = null;
    };

    return { init, exec, cancel };
  },
};
</script>

<style scoped></style>
