<template>
  <div class="node-management">
    <div class="flex justify-end">
      <div class="pt-2">
        <button
          class="bg-blue-600 text-neutral-50 rounded p-1 px-2"
          @click.prevent="nodeBind.set('add')"
        >
          Add Node
        </button>
      </div>
    </div>
    <div class="mt-4">
      <div>
        <div
          class="grid grid-cols-[minmax(auto,_3fr)_minmax(auto,_2fr)_minmax(auto,max-content)] gap-2"
        >
          <div
            class="grid grid-cols-subgrid gap-2 col-span-3 bg-orange-100 hover:bg-orange-200 rounded p-2"
            v-for="node, nodeIndex in nodesData?.data as Apis.Nodes.Node[] || []"
          >
            <div class="">
              <span class="block capitalize">
                {{ node.name || "No name" }}
              </span>
            </div>
            <div class="place-self-center">
              <div class="flex gap-1">
                <div>
                  <span
                    :class="[
                      'block text-xs p-1 px-2 rounded-full',
                      node.active ? 'bg-green-500' : 'bg-neutral-400',
                    ]"
                  >
                    {{ node.active ? "active" : "inactive" }}
                  </span>
                </div>
              </div>
            </div>
            <div class="content-center">
              <div class="flex gap-2">
                <button
                  class="bg-blue-400 hover:bg-blue-600 border-blue-600 rounded p-1 px-2"
                  @click.prevent="nodeBind.set('edit', node)"
                >
                  Edit
                </button>
                <button
                  class="bg-red-400 hover:bg-red-600 border-red-600 rounded p-1 px-2"
                  @click.prevent="nodeBind.set('delete', node)"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="user-action-modal" v-if="nodeBind.action">
      <div class="add-user" v-if="nodeBind.action === 'add'">
        <CompositeModalFullPage>
          <div class="min-w-[320px]">
            <div class="p-2">
              <div class="mb-4">
                <h3 class="text-lg font-bold text-center">Add new node</h3>
              </div>
              <FormAddNode
                @cancel="nodeBind.reset()"
                @success="refreshNodesData()"
              />
            </div>
          </div>
        </CompositeModalFullPage>
      </div>
      <div class="edit-user" v-if="nodeBind.action === 'edit' && nodeBind.node">
        <CompositeModalFullPage>
          <div class="min-w-[320px]">
            <div class="p-2">
              <div class="mb-4">
                <h3 class="text-lg font-bold text-center">Edit node</h3>
              </div>
              <FormEditNode
                :node="nodeBind.node"
                @cancel="nodeBind.reset()"
                @success="refreshNodesData()"
              />
            </div>
          </div>
        </CompositeModalFullPage>
      </div>
      <div
        class="delete-user"
        v-if="nodeBind.action === 'delete' && nodeBind.node"
      >
        <CompositeModalFullPage>
          <div class="min-w-[320px]">
            <div class="p-2">
              <div class="mb-4">
                <h3 class="text-lg font-bold text-center">Delete Node</h3>
              </div>
              <FormDeleteNode
                :node="nodeBind.node"
                @cancel="nodeBind.reset()"
                @success="refreshNodesData()"
              />
            </div>
          </div>
        </CompositeModalFullPage>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { _value: nodesData, refresh: refreshNodesData } = await useApiFetch(
  "/api/v1.0/node/nodes"
);

const nodeBind: globalThis.Ref<{
  action?: "add" | "edit" | "delete";
  node?: Apis.Nodes.Node;
  readonly set: (
    action: "add" | "edit" | "delete",
    node?: Apis.Nodes.Node
  ) => void;
  readonly reset: () => void;
}> = ref({
  set: (action, node) => {
    nodeBind.value.action = action;
    nodeBind.value.node = node;
  },
  reset: () => {
    nodeBind.value.action = undefined;
    nodeBind.value.node = undefined;
  },
});
</script>

<style scoped></style>
