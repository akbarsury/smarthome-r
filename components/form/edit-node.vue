<template>
  <div class="edit-node">
    <form>
      <div class="flex flex-col gap-4">
        <div class="edit-node-status">
          <div
            v-if="editNodeForm.submit.meta.executed"
            :class="[
              'rounded p-2 px-4',
              editNodeForm.submit.meta.success ? 'bg-green-300' : 'bg-red-300',
            ]"
          >
            <span class="text-sm">
              {{ editNodeForm.submit.meta.message }}
            </span>
          </div>
        </div>
        <div
          class="edit-node-input-form"
          v-if="!editNodeForm.submit.meta.success"
        >
          <div class="flex flex-col gap-4">
            <div class="input-group" v-for="(field, label) in fields">
              <div>
                <label
                  class="block capitalize text-neutral-700 mb-2"
                  :for="label"
                >
                  {{ useTextTransform("toKebabCase", label).replace("-", " ") }}
                </label>
                <input
                  v-if="label != 'active'"
                  class="w-full border border-orange-400 rounded p-1"
                  :name="label"
                  :id="label"
                  type="text"
                  v-model="field.val"
                  v-bind="{
                    onInput: () => field.bind.onInput(),
                    onBlur: () => field.bind.onBlur(),
                  }"
                />
                <select
                  v-if="label == 'active'"
                  class="w-full border border-orange-400 rounded p-1"
                  :name="label"
                  :id="label"
                  v-model="field.val"
                  v-bind="{
                    onInput: () => field.bind.onInput(),
                    onBlur: () => field.bind.onBlur(),
                  }"
                >
                  <option :value="false">false</option>
                  <option :value="true">true</option>
                </select>
              </div>
              <div
                class="error-input pt-2"
                v-if="field.errors && !field.props.focus"
              >
                <div class="rounded p-1 px-2 bg-red-300">
                  <span class="text-sm">
                    {{ field.errors[0] }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="edit-node-action flex justify-end gap-2">
          <button
            :class="[
              'border p-1 px-3 rounded',
              !editNodeForm.submit.meta.submitting
                ? 'bg-red-300 hover:bg-red-400 border-red-500'
                : 'bg-neutral-400 pointer-events-none',
            ]"
            @click.prevent="emits('cancel')"
          >
            <span class="capitalize"> close </span>
          </button>
          <button
            :class="[
              'border p-1 px-3 rounded',
              meta.valid && !editNodeForm.submit.meta.submitting
                ? 'bg-orange-300 hover:bg-orange-400 border-orange-500'
                : 'bg-neutral-400 cursor-not-allowed',
            ]"
            @click.prevent="editNodeForm.submit.exec()"
          >
            <span class="capitalize"> edit Node </span>
          </button>
        </div>
      </div>
    </form>
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

const editNodeForm = reactive({
  submit: {
    meta: {
      submitting: false,
      executed: false,
      success: false,
      message: "",
    },

    exec: async () => {
      if (!isValid) return;

      editNodeForm.submit.meta.submitting = true;

      const { _value } = await useApiFetch(
        `/api/v1.0/node/${node.value.nodeId}` as "/api/v1.0/node/:nodeId",
        {
          method: "put",
          body: values.value,
        }
      );

      if (_value.value?.data) {
        editNodeForm.submit.meta.executed = true;
        editNodeForm.submit.meta.success = true;
        editNodeForm.submit.meta.message = "success edit node";
        emits("success");
        // form.resetForm();
      } else {
        editNodeForm.submit.meta.executed = true;
        editNodeForm.submit.meta.success = false;
        editNodeForm.submit.meta.message = "failed edit node";
      }

      editNodeForm.submit.meta.submitting = false;
    },
  },
});

const { fields, values, meta, isValid } = useManagementForm().editNode();

Object.keys(fields).forEach(<S = keyof typeof fields>(field: S) => {
  fields[field].val = node.value[field as "nodeId" | "name" | "active"];
});
</script>

<style scoped></style>
