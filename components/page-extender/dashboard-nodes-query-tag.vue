<template>
  <div class="flex justify-between mb-4">
    <div class="basis">
      <NuxtLink :to="{ name: 'app-dashboard-nodes' }">
        <Icon class="mb-[-2px]" name="ic:round-arrow-back-ios-new" />
        <span> Kembali </span>
      </NuxtLink>
    </div>
    <div class="basis">
      <span class="text-orange-700 font-semibold">
        {{ nodeData?.data?.name }}</span
      >
    </div>
  </div>
  {{ clickTimeCounter }}
  <div class="flex flex-wrap gap-2" v-if="nodeData?.data?.items">
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
              @click.prevent="itemAction(nodeItem.name)"
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
              @mousedown="itemAction().init()"
              @click.prevent="itemAction(nodeItem.name)"
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
  <div class="confirm p-4">
    <div
      class="border-2 border-neutral-400 h-[56px] max-w-[480px] rounded-full overflow-hidden p-1 py-6"
    >
      <div class="relative" ref="swipeElRef">
        <span
          :class="[
            'block absolute bg-orange-400/30 h-[44px] rounded-full mt-[-21px]',
            swipeConfirm.confirmed
              ? 'cursor-not-allowed w-full'
              : 'cursor-pointer w-[44px] ',
          ]"
          :style="{
            left: swipeConfirm.swipe.isSwiping
              ? swipeConfirm.bul.right >= swipeConfirm.el.right
                ? undefined
                : `${swipeConfirm.swipe.distanceX * -1}px`
              : '0px',
            right:
              swipeConfirm.swipe.isSwiping &&
              swipeConfirm.bul.right >= swipeConfirm.el.right
                ? '0px !important'
                : undefined,
            width:
              swipeConfirm.swipe.isSwiping &&
              swipeConfirm.bul.right >= swipeConfirm.el.right
                ? '100% !important'
                : undefined,
          }"
          ref="swipeBulletElRef"
          @mousedown="itemAction().swipeConfirmCapture()"
        ></span>
      </div>
    </div>
    {{ { swipeConfirm } }}
  </div>
</template>

<script setup lang="ts">
const serialNumber = useRoute().query["tag"];
const { data: nodeData, refresh: refreshnodesData } = await useLazyFetch(
  `/api/v1.0/node/${serialNumber}` as "/api/v1.0/node/:serialNumber"
);

const clickTimeCounter = useInterval(100, { controls: true });
clickTimeCounter.pause();

const swipeElRef = useTemplateRef("swipeElRef");
const swipeBulletElRef = useTemplateRef("swipeBulletElRef");
const swipeConfirm = ref({
  confirmed: false,
  swipe: usePointerSwipe(swipeElRef, {
    disableTextSelect: true,
    threshold: 5,
    onSwipeEnd(e, direction) {
      itemAction().swipeConfirmCapture();
    },
  }),
  mouse: useMouseInElement(swipeBulletElRef),
  el: useElementBounding(swipeElRef),
  bul: useElementBounding(swipeBulletElRef),
});

const itemAction = (label?: string) => {
  const init = () => {
    clickTimeCounter.resume();
    setTimeout(() => {
      if (clickTimeCounter.isActive.value) {
        itemAction();
      }
    }, 30000);
  };

  const exec = () => {
    const item = nodeData.value?.data?.items?.find(
      (node) => node?.name == label
    );
    if (!item) return;
    console.log({ item });
  };

  const swipeConfirmCapture = () => {
    if (swipeConfirm.value.confirmed) return;
    const start = () => {
      // console.log("swipe start");
      // console.log("distance : " + swipeConfirm.value.swipe.distanceX);
      swipeConfirm.value.confirmed = false;
    };
    const end = () => {
      // console.log("swipe end");
      // console.log("distance : " + swipeConfirm.value.swipe.distanceX);
      // console.log("el right : " + swipeConfirm.value.el.right);
      // console.log("bullet right : " + swipeConfirm.value.bul.right);
      if (swipeConfirm.value.bul.right >= swipeConfirm.value.el.right)
        swipeConfirm.value.confirmed = true;
    };
    if (
      !swipeConfirm.value.mouse.isOutside &&
      swipeConfirm.value.swipe.distanceX === 0
    )
      start();
    else if (
      !swipeConfirm.value.mouse.isOutside &&
      swipeConfirm.value.swipe.distanceX < 0
    )
      end();
  };

  clickTimeCounter.pause();
  clickTimeCounter.reset();
  exec();

  return { init, swipeConfirmCapture };
};
</script>

<style scoped></style>
