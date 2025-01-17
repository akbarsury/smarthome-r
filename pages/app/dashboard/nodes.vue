<template>
  <div>
    <div>Nodes</div>
    <div>{{ { nodesData } }}</div>
  </div>
</template>

<script setup lang="ts">
const { data: nodesData, refresh: refreshnodesData } = await useFetch(
  "/api/v1.0/node/nodes"
);
</script>

<style scoped></style>
