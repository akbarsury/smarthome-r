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
              @mousedown="itemAction.init(nodeItem.name, 'switch')"
              @click.prevent="itemAction.exec()"
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
              @mousedown="itemAction.init(nodeItem.name, 'restart')"
              @click.prevent="itemAction.exec()"
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
              @mousedown="itemAction.init(nodeItem.name, 'push')"
              @click.prevent="itemAction.exec()"
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
    v-if="toValue(itemAction._counter.value?.isActive) === false"
  >
    <CompositeModalFullPage>
      <div class="container max-w-screen-md">
        <div class="p-4">
          <div class="mb-4">
            <span class="font-semibold"> Swipe to confirm action </span>
          </div>
          <CompositeSwipeConfirmation
            class="max-w-[480px] mb-2"
            @confirmed="itemAction.exec()"
          />
          <div class="text-center">
            <button
              class="text-blue-400 underline"
              @click.prevent="itemAction.cancel()"
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

const nodeId = useRoute().query["tag"];
const { _value: nodeData, refresh: refreshnodesData } = await useApiFetch(
  `/api/v1.0/node/${nodeId}` as "/api/v1.0/node/:nodeId"
);

interface ItemAction {
  data: globalThis.Ref<{
    itemIndex: number;
    executionType: "switch" | "push" | "restart";
    confirmed?: boolean;
  } | null>;
  _counter: globalThis.Ref<
    ({ initTime: number } & UseIntervalControls & Pausable) | null
  >;
  init: (label: string, executionType: "switch" | "push" | "restart") => void;
  exec: () => void;
  cancel: () => void;
  reset: () => void;
}

const itemAction: ItemAction = {
  data: ref(null),
  _counter: ref(null),
  init: (label, executionType) => {
    const initTime = new Date().getTime();
    const indexedItem = nodeData.value?.data?.items?.findIndex(
      (node) => node?.name == label
    );

    if (typeof indexedItem === "number") {
      itemAction.data.value = {
        itemIndex: indexedItem,
        executionType,
      };
      itemAction._counter.value = computed(() => {
        return {
          initTime,
          ...useInterval(100, { controls: true }),
        };
      }).value;
    }

    setTimeout(() => {
      if (itemAction._counter.value?.initTime === initTime) {
        itemAction.reset();
      }
    }, 30000);
  },

  exec: async () => {
    if (itemAction.data.value === null) return;

    if (
      itemAction._counter.value &&
      typeof itemAction.data.value.confirmed === "undefined"
    ) {
      itemAction._counter.value?.pause();
      itemAction.data.value.confirmed = false;
      return;
    }

    if (itemAction.data.value.confirmed === false) {
      console.log({
        nodeId,
        ...itemAction.data.value,
        clickTime: itemAction._counter.value?.counter,
      });
      const { _value: executionData } = await useApiFetch(
        `/api/v1.0/node/${nodeId}/execution` as "/api/v1.0/node/:nodeId/execution",
        {
          method: "post",
          body: {
            ...itemAction.data.value,
            clickTime: itemAction._counter.value?.counter,
          },
        }
      );
      if (executionData.value?.data) {
        const watchExecution = { id: executionData.value.data.requestId };
      }

      setTimeout(() => itemAction.reset(), 2000);
    }
  },

  cancel: () => itemAction.reset(),

  reset: () => {
    itemAction.data.value = null;
    itemAction._counter.value = null;
  },
};

onMounted(async () => {
  if (typeof nodeId === "string") {
    useWsStore().webSocket.onReady(() =>
      console.log(useWsStore().webSocket.send("bind", { nodeId }))
    );
  }
});
</script>

<style scoped></style>
