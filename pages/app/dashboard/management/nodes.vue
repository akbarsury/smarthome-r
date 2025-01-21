<template>
  <div class="node-management">
    <div>
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
          <div>{{ { nodesData } }}</div>
        </div>
      </div>
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
const node = reactive({
  nodes: [],
  form: {},
  bindId: "",
});
const { data: nodesData, refresh: refreshnodesData } = await useFetch(
  "/api/v1.0/node/nodes"
);
</script>

<style scoped></style>
