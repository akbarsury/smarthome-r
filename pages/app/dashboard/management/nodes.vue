<template>
  <div class="node-management">
    <div class="flex justify-end">
      <div class="mt-2">
        <button
          class="bg-blue-600 text-neutral-50 rounded p-1 px-2"
          @click.prevent=""
        >
          Add Node
        </button>
      </div>
    </div>
    <div class="mt-4">
      <div>
        <div>Manajemen node</div>
        <div>{{ { nodesData } }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data: nodesData, refresh: refreshnodesData } = await useFetch(
  "/api/v1.0/node/nodes"
);
</script>

<style scoped></style>
