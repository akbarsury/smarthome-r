<template>
  <div class="container h-full">
    <div
      class="flex gap-6 py-6 mx-4"
      v-if="useAppConfig().resolvedOriginRouting === 'guest'"
    >
      <div class="">
        <div class="mb-6">
          <h2 class="text-3xl font-bold text-orange-700 mb-4">
            Welcome to Smarthome Assistant
          </h2>
          <p>See what's happening at home even if you're not there</p>
        </div>
        <div>
          <NuxtLink
            :to="
              useRequestURL().protocol.concat('//', useAppConfig().appOrigin)
            "
            class="text-[#055264] hover:text-orange-300 font-semibold bg-[#72a2ad] hover:bg-[#055264] border border-[#055264] p-2 px-6 rounded-full"
          >
            OPEN APP
          </NuxtLink>
        </div>
      </div>
      <div class="">
        <NuxtImg src="home-assistant.png" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  name: "home",
  auth: false,
  layout: false,
});

const auth = useAuth();
onMounted(() => {
  if (useAppConfig().resolvedOriginRouting === "app") {
    switch (auth.status.value) {
      case "unauthenticated":
        navigateTo({ name: "app-auth-signin" });
      case "authenticated":
        navigateTo({ name: "app-dashboard" });
    }
  }
});
</script>

<style scoped></style>
