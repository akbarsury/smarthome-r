<template>
  <div class="nodes">
    <div class="nodes-list" v-if="!serialNumberTag">
      <div class="flex">
        <div
          class="bg-orange-200 rounded p-4"
          v-for="node in nodesData?.data as Apis.Nodes.Node[] || []"
        >
          <NuxtLink
            :to="{
              name: 'app-dashboard-nodes',
              query: { tag: node.serialNumber },
            }"
          >
            <span class="underline font-bold">
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
const { data: nodesData, refresh: refreshnodesData } = await useFetch(
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
