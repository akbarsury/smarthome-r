<template>
  <div class="min-w-[320px]">
    <div class="div">
      <div class="mb-2">
        <h3 class="text-lg font-bold text-center">Add new node</h3>
      </div>
      <div class="flex flex-col gap-4">
        <div class="add-node-input-form">
          <div class="flex flex-col gap-4">
            <div
              class="input-group"
              v-for="dataKey in Object.keys(props.dataKey) as (keyof Apis.Nodes.Node)[]"
            >
              <label
                class="block capitalize text-neutral-700 mb-2"
                for="serial-number"
              >
                {{ useTextTransform("toKebabCase", dataKey).replace("-", " ") }}
              </label>
              <input
                class="w-full border border-orange-400 rounded p-1"
                id="serial-number"
                :type="
                  typeof newNode.data[dataKey] === 'string'
                    ? 'text'
                    : 'checkbox'
                "
                :disabled="
                  props.action === 'edit' && dataKey === 'serialNumber'
                "
                v-model="newNode.data[dataKey]"
              />
            </div>
          </div>
        </div>
        <div class="add-user-status">
          <div
            :class="[
              'rounded p-2 px-4',
              newNode.meta?.status === 'done:failed'
                ? 'bg-red-300'
                : 'bg-green-300',
            ]"
          >
            {{ newNode.meta?.message }}
          </div>
        </div>
        <div class="add-user-action flex justify-end gap-2">
          <button
            :class="[
              'border p-1 px-3 rounded',
              newNode.meta?.status != 'waiting'
                ? 'bg-red-300 hover:bg-red-400 border-red-500'
                : 'bg-neutral-400 pointer-events-none',
            ]"
            @click.prevent="() => emits('cancel')"
          >
            cancel
          </button>
          <button
            :class="[
              'capitalize border p-1 px-3 rounded',
              newNode.meta?.status != 'waiting'
                ? 'bg-orange-300 hover:bg-orange-400 border-orange-500'
                : 'bg-neutral-400 pointer-events-none',
            ]"
            @click.prevent="emits('add')"
          >
            {{ props.action }} node
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  action: "add" | "edit";
  dataKey: Partial<Apis.Nodes.Node>;
}>();

const emits = defineEmits<{
  cancel: [];
  add: [];
}>();

const newNode: {
  meta?: {
    message: string;
    status: string;
  };
  data: Apis.Nodes.Node;
} = reactive({
  data: {
    serialNumber: "",
    name: "",
    active: false,
  },
});

onMounted(() => {
  newNode.data.serialNumber = props.dataKey.serialNumber || "";
  newNode.data.name = props.dataKey.name || "";
  newNode.data.active = props.dataKey.active || false;
});
</script>

<style scoped></style>
