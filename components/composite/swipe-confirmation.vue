<template>
  <div
    class="border-2 border-neutral-400 h-[56px] rounded-full overflow-hidden p-1 py-6"
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
        @mousedown="swipeConfirmCapture()"
      ></span>
    </div>
  </div>
</template>

<script setup lang="ts">
const emits = defineEmits<{
  confirmed: [];
}>();

const swipeElRef = useTemplateRef("swipeElRef");
const swipeBulletElRef = useTemplateRef("swipeBulletElRef");
const swipeConfirm = ref({
  confirmed: false,
  swipe: usePointerSwipe(swipeElRef, {
    disableTextSelect: true,
    threshold: 5,
    onSwipeEnd(e, direction) {
      swipeConfirmCapture();
    },
  }),
  mouse: useMouseInElement(swipeBulletElRef),
  el: useElementBounding(swipeElRef),
  bul: useElementBounding(swipeBulletElRef),
});

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
    if (swipeConfirm.value.bul.right >= swipeConfirm.value.el.right) {
      swipeConfirm.value.confirmed = true;
      emits("confirmed");
    }
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
</script>

<style scoped></style>
