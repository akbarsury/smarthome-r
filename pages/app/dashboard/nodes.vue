<template>
  <div class="nodes">
    <div class="nodes-list" v-if="!serialNumberTag">
      <div class="flex gap-2">
        <div
          class="basis-32 flex-grow max-w-48"
          v-for="node in nodesData?.data as Apis.Nodes.Node[] || []"
        >
          <NuxtLink
            class="block bg-orange-100 hover:bg-orange-200 hover:text-orange-700 border border-orange-400 rounded p-4"
            :to="{
              name: 'app-dashboard-nodes',
              query: { tag: node.serialNumber },
            }"
          >
            <span class="block uppercase font-bold truncate">
              {{ node.name }}
            </span>
          </NuxtLink>
        </div>
      </div>
    </div>
    <div class="node" v-else>
      <PageExtenderDashboardNodesQueryTag />
    </div>
  </div>
</template>

<script setup lang="ts">
const { data: nodesData, refresh: refreshnodesData } = await useApiFetch(
  "/api/v1.0/node/nodes"
);

const serialNumberTag = computed(() => useRoute().query["tag"]);

useRouter().afterEach((to, from) => {
  if (from.name === useRoute().name && from.query["tag"]) {
    console.log("refresh");
    refreshnodesData();
  }
});
</script>

<style scoped></style>
