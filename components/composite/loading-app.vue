<template>
  <div
    class="flex justify-center items-center gap-6 h-full py-6 mx-4"
    v-if="useAppConfig().resolvedOriginRouting === 'app'"
  >
    <div class="">
      <NuxtImg src="home-assistant.png" height="132px" />
    </div>
    <div class="">
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-orange-700 mb-2">
          Smarthome Assistant
        </h2>
      </div>
      <div>
        <p class="font-semibold text-neutral-800">
          <span
            class="loader-buble-1 h-[30px] w-[30px] border-4 border-neutral-600 mr-4"
          ></span>
          <span class="inline-block align-top mt-1">Dashboard is loading</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
