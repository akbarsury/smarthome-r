<template>
  <div class="node-management">
    <div>
      <div class="flex justify-end">
        <div class="mt-2">
          <button
            class="bg-blue-600 text-neutral-50 rounded p-1 px-2"
            @click.prevent="nodeManagement.actions.openForm('add')"
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
                        'text-xs p-1 px-2 rounded-full',
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
                    @click.prevent="
                      nodeManagement.actions.openForm('edit', nodeIndex)
                    "
                  >
                    Edit
                  </button>
                  <button
                    class="bg-red-400 hover:bg-red-600 border-red-600 rounded p-1 px-2"
                    @click.prevent=""
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="add-node" v-if="nodeManagement.form.bindId === 'add'">
      <CompositeModalFullPage
        @click-outside="nodeManagement.actions.closeForm()"
      >
        <PageExtenderAppDashboardManagementNodesAddNode
          action="add"
          :dataKey="{ serialNumber: '', name: '' }"
          @cancel="nodeManagement.actions.closeForm()"
        />
      </CompositeModalFullPage>
    </div>
    <div class="add-node" v-if="nodeManagement.form.bindId === 'edit'">
      <CompositeModalFullPage
        @click-outside="nodeManagement.actions.closeForm()"
      >
        <PageExtenderAppDashboardManagementNodesAddNode
          action="edit"
          :dataKey="{
            serialNumber: nodeManagement.form.data?.serialNumber,
            name: nodeManagement.form.data?.name,
            active: nodeManagement.form.data?.active,
          }"
          @cancel="nodeManagement.actions.closeForm()"
        />
      </CompositeModalFullPage>
    </div>
    <!-- <div class="add-user" v-if="addUser.meta.status">
      <CompositeModalFullPage @click-outside="addUser.close()">
        <div class="min-w-[320px]">
          <div class="div">
            <div class="mb-2">
              <h3 class="text-lg font-bold text-center">Add new user</h3>
            </div>
            <div class="flex flex-col gap-4">
              <div
                class="new-user-input-form"
                v-if="!addUser.meta.status.startsWith('done')"
              >
                <div class="flex flex-col gap-4">
                  <div class="input-group">
                    <label class="block text-neutral-700 mb-2" for="name"
                      >Name</label
                    >
                    <input
                      class="w-full border border-orange-400 rounded p-1"
                      id="name"
                      type="name"
                      v-model="addUser.data.newUser.name"
                    />
                  </div>
                </div>
              </div>
              <div class="add-user-status" v-else>
                <div
                  :class="[
                    'rounded p-2 px-4',
                    addUser.meta.status === 'done:failed'
                      ? 'bg-red-300'
                      : 'bg-green-300',
                  ]"
                >
                  {{ addUser.meta.message }}
                </div>
              </div>
              <div class="add-user-action flex justify-end gap-2">
                <button
                  :class="[
                    'border p-1 px-3 rounded',
                    addUser.meta.status != 'waiting'
                      ? 'bg-red-300 hover:bg-red-400 border-red-500'
                      : 'bg-neutral-400 pointer-events-none',
                  ]"
                  @click.prevent="() => addUser.close()"
                >
                  cancel
                </button>
                <button
                  :class="[
                    'border p-1 px-3 rounded',
                    addUser.meta.status != 'waiting'
                      ? 'bg-orange-300 hover:bg-orange-400 border-orange-500'
                      : 'bg-neutral-400 pointer-events-none',
                  ]"
                  @click.prevent="addUser.exec()"
                >
                  Add User
                </button>
              </div>
            </div>
          </div>
        </div>
      </CompositeModalFullPage>
    </div> -->
  </div>
</template>

<script setup lang="ts">
type AnyString = string;
type NodeManagement = {
  nodes: Apis.Nodes.Node[];
  form: {
    bindId?: string;
    meta?: {
      message: string;
      status: string;
    };
    data?: Apis.Nodes.Node;
  };
  actions: {
    openForm: (action: "add" | "edit" | "delete", nodeIndex?: number) => void;
    closeForm: () => void;
  };
};
const nodeManagement: NodeManagement = reactive({
  nodes: [],
  form: {},
  actions: {
    openForm: (action: "add" | "edit" | "delete", nodeIndex?: number) => {
      if (action === "add") nodeManagement.form.bindId = "add";
      console.log({ action, nodeIndex });
      if (nodesData.value?.data && typeof nodeIndex === "number") {
        const { serialNumber, name, active } = nodesData.value?.data[
          nodeIndex
        ] as Apis.Nodes.Node;
        nodeManagement.form.data = {
          serialNumber,
          name,
          active,
        };
        console.log({ data: nodeManagement.form.data });
        nodeManagement.form.bindId = "edit";
      }
    },
    closeForm: () => (nodeManagement.form.bindId = undefined),
  },
});
const { _value: nodesData, refresh: refreshnodesData } = await useApiFetch(
  "/api/v1.0/node/nodes"
);
</script>

<style scoped></style>
