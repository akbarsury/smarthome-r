<template>
  <div class="flex flex-wrap gap-2">
    <div
      class="node-item min-w-72 basis-full sm:basis-[calc(50%_-_0.25rem)] border border-neutral-400 rounded p-4"
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
                'h-[26px] bg-orange-600 border-[5px] border-neutral-950 outline outline-[2px] outline-neutral-50 active:translate-y-[2px] shadow-[0px_5px_#999] shadow-neutral-400 active:shadow-[0px_3px_#888] rounded-[15px]',
              ]"
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
</template>

<script setup lang="ts">
const serialNumber = useRoute().query["tag"];
const { data: nodeData, refresh: refreshnodesData } = await useFetch(
  `/api/v1.0/node/${serialNumber}` as "/api/v1.0/node/:serialNumber"
);
</script>

<style scoped></style>
