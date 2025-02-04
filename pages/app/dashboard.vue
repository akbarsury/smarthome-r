<template>
  <div class="dashboard">
    <div
      class="management m-4"
      v-if="$router.currentRoute.value.name !== 'app-dashboard'"
    >
      <ClientOnly>
        <div class="mb-4">
          <h6 class="text-neutral-700 capitalize font-semibold">
            {{ $router.currentRoute.value.path.split("/")[2] }}
          </h6>
        </div>
        <NuxtPage />
      </ClientOnly>
    </div>
    <NuxtPage v-else />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  path: "/dashboard",
});
</script>

<style scoped></style>
