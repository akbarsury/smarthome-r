<template>
  <div>
    <div
      class="fixed h-screen w-screen bg-neutral-50 z-[1000]"
      v-if="loadingAppDelay"
    >
      <CompositeLoadingApp />
    </div>
    <div
      :class="[
        'max-w-screen-md mx-auto min-h-screen grid',
        $router.currentRoute.value.name !== 'home' &&
        !$router.currentRoute.value.name?.toString().startsWith('app-auth-')
          ? 'grid-rows-[auto_1fr]'
          : 'grid-rows-[1fr]',
      ]"
    >
      <div
        class="container w-full h-fit"
        v-if="
          $router.currentRoute.value.name !== 'home' &&
          !$router.currentRoute.value.name?.toString().startsWith('app-auth-')
        "
      >
        <div class="px-4 mt-2">
          <div class="bg-orange-200 rounded p-4">
            <div class="flex justify-between">
              <div>
                <NuxtLink :to="{ name: 'app-dashboard' }">
                  <h1 class="text-orange-700 text-2xl font-bold">
                    Smarthome Assistant
                  </h1>
                </NuxtLink>
              </div>
              <div
                v-if="
                  !$router.currentRoute.value.name
                    ?.toString()
                    .startsWith('auth')
                "
              >
                <div class="flex gap-2" v-if="authStatus === 'authenticated'">
                  <div>
                    <NuxtLink
                      :to="{ name: 'app-dashboard-nodes' }"
                      class="inline-block bg-orange-200 hover:bg-orange-300 border border-orange-400 p-1 px-3 rounded"
                    >
                      Nodes
                    </NuxtLink>
                  </div>
                  <div>
                    <NuxtLink
                      :to="{ name: 'app-dashboard-management-users' }"
                      class="inline-block bg-orange-200 hover:bg-orange-300 border border-orange-400 p-1 px-3 rounded"
                    >
                      Manajement
                    </NuxtLink>
                  </div>
                  <div>
                    <button
                      class="hover:bg-orange-300 border border-transparent hover:border-orange-400 p-1 px-1 rounded-full"
                      @click.prevent="signOut()"
                    >
                      <div class="h-[1.5rem]">
                        <Icon name="uil:signout" size="1.5rem" />
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="container w-full">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { status: authStatus, signOut: authSignOut } = useAuth();
const signOut = () => {
  authSignOut({
    redirect: false,
  }).then(() => {
    navigateTo({ name: "home" });
  });
};

const loadingAppDelay = ref(true);
onMounted(() => {
  setTimeout(() => (loadingAppDelay.value = false), 1500);
});
</script>

<style scoped></style>
