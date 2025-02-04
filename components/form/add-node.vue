<template>
  <div class="add-node">
    <form>
      <div class="flex flex-col gap-4">
        <div class="add-node-status">
          <div
            v-if="addNodeForm.submit.meta.executed"
            :class="[
              'rounded p-2 px-4',
              addNodeForm.submit.meta.success ? 'bg-green-300' : 'bg-red-300',
            ]"
          >
            <span class="text-sm">
              {{ addNodeForm.submit.meta.message }}
            </span>
          </div>
        </div>
        <div class="add-node-input-form">
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
        <div class="add-node-action flex justify-end gap-2">
          <button
            :class="[
              'border p-1 px-3 rounded',
              !addNodeForm.submit.meta.submitting
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
              meta.valid && !addNodeForm.submit.meta.submitting
                ? 'bg-orange-300 hover:bg-orange-400 border-orange-500'
                : 'bg-neutral-400 cursor-not-allowed',
            ]"
            @click.prevent="addNodeForm.submit.exec()"
          >
            <span class="capitalize"> Add Node </span>
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
const emits = defineEmits<{
  success: [];
  cancel: [];
}>();

const addNodeForm = reactive({
  submit: {
    meta: {
      submitting: false,
      executed: false,
      success: false,
      message: "",
    },

    exec: async () => {
      if (!isValid) return;

      addNodeForm.submit.meta.submitting = true;

      const { _value } = await useApiFetch("/api/v1.0/node/add", {
        method: "post",
        body: values.value,
      });

      if (_value.value?.data) {
        addNodeForm.submit.meta.executed = true;
        addNodeForm.submit.meta.success = true;
        addNodeForm.submit.meta.message = "success add node";
        emits("success");
        form.resetForm();
      } else {
        addNodeForm.submit.meta.executed = true;
        addNodeForm.submit.meta.success = false;
        addNodeForm.submit.meta.message = "failed add node";
      }

      addNodeForm.submit.meta.submitting = false;
    },
  },
});

const { fields, form, values, meta, isValid } = useManagementForm().addNode();
</script>

<style scoped></style>
