<template>
  <div class="delete-node">
    <div class="flex flex-col gap-4">
      <div
        class="delete-node-status"
        v-if="deleteNodeForm.submit.meta.executed"
      >
        <div
          :class="[
            'rounded p-2 px-4',
            deleteNodeForm.submit.meta.success ? 'bg-green-300' : 'bg-red-300',
          ]"
        >
          <span class="text-sm">
            {{ deleteNodeForm.submit.meta.message }}
          </span>
        </div>
      </div>
      <div
        class="delete-node-details"
        v-if="!deleteNodeForm.submit.meta.success"
      >
        <span class="block mb-2">Are you sure to delete node ?</span>
        <div class="node-information border border-blue-400 rounded p-2">
          <span class="text-red-500 font-semibold border-b">
            Node Information
          </span>
          <div>
            <span class="inline-block w-28">Serial Number</span>
            <span class="capitalize">: {{ node.serialNumber }}</span>
          </div>
        </div>
      </div>
      <div class="delete-node-action flex justify-end gap-2">
        <button
          :class="[
            'border p-1 px-3 rounded',
            deleteNodeForm.submit.meta.success ||
            !deleteNodeForm.submit.meta.submitting
              ? 'bg-red-300 hover:bg-red-400 border-red-500'
              : 'bg-neutral-400 cursor-not-allowed',
          ]"
          @click.prevent="emits('cancel')"
        >
          <span class="capitalize"> close </span>
        </button>
        <button
          :class="[
            'border p-1 px-3 rounded',
            !deleteNodeForm.submit.meta.success &&
            !deleteNodeForm.submit.meta.submitting
              ? 'bg-orange-300 hover:bg-orange-400 border-orange-500'
              : 'bg-neutral-400 cursor-not-allowed',
          ]"
          @click.prevent="deleteNodeForm.submit.exec()"
        >
          <span class="capitalize"> Delete Node </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  node: Apis.Nodes.Node;
}>();

const emits = defineEmits<{
  success: [];
  cancel: [];
}>();

const node = toRef(props.node);

const deleteNodeForm = reactive({
  submit: {
    meta: {
      submitting: false,
      executed: false,
      success: false,
      message: "",
    },

    exec: async () => {
      deleteNodeForm.submit.meta.submitting = true;

      const { _value } = await useApiFetch(
        `/api/v1.0/node/${node.value.serialNumber}` as "/api/v1.0/node/:nodeId",
        { method: "delete" }
      );

      deleteNodeForm.submit.meta.executed = true;

      if (_value.value?.data) {
        deleteNodeForm.submit.meta.success = true;
        deleteNodeForm.submit.meta.message = "success delete node";
        emits("success");
      } else {
        deleteNodeForm.submit.meta.success = false;
        deleteNodeForm.submit.meta.message = "failed delete node";
      }

      deleteNodeForm.submit.meta.submitting = false;
    },
  },
});
</script>

<style scoped></style>
