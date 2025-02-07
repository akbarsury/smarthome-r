<template>
  <div>
    <div
      class="grid grid-cols-[auto_1fr] border border-orange-400 rounded-xl p-2 px-4"
    >
      <div class="min-w-[78px]">
        <ul>
          <li>
            <NuxtLink
              class="hover:text-orange-500 hover:underline"
              :to="{
                name: 'app-dashboard-appId-management-users',
                params: { appId: useAppStore().appId },
              }"
            >
              User Management
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              class="hover:text-orange-500 hover:underline"
              :to="{
                name: 'app-dashboard-appId-management-nodes',
                params: { appId: useAppStore().appId },
              }"
            >
              Node Management
            </NuxtLink>
          </li>
        </ul>
      </div>
      <div
        class="relative overflow-hidden pl-2 ml-4 border-s border-orange-400"
      >
        <NuxtPage
          class="relative right-0 w-full h-full"
          :transition="{
            name: 'expand-right',
            mode: 'in-out',
          }"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useIntervalFn(() => {
  if (useRoute().name === "app-dashboard-appId-management") {
    useRouter().replace({
      name: "app-dashboard-appId-management-users",
      params: { appId: useAppStore().appId },
    });
  }
}, 500);
</script>

<style scoped lang="scss">
.expand-right-leave-active {
  transition: right 0.5s;
}
.expand-right-enter-active {
  transition: all 0.5s;
  transition-delay: 0.5s;
}
.expand-right-leave-to,
.expand-right-enter-from {
  @apply absolute right-[110%];
}
</style>
