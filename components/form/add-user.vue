<template>
  <div class="add-user">
    <form>
      <div class="flex flex-col gap-4">
        <div class="add-user-status">
          <div
            v-if="addUserForm.submit.meta.executed"
            :class="[
              'rounded p-2 px-4',
              addUserForm.submit.meta.success ? 'bg-green-300' : 'bg-red-300',
            ]"
          >
            <span class="text-sm">
              {{ addUserForm.submit.meta.message }}
            </span>
          </div>
        </div>
        <div class="add-user-input-form">
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
                  v-if="label != 'rule'"
                  class="w-full border border-orange-400 rounded p-1"
                  :name="label"
                  :id="label"
                  :type="label == 'password' ? 'password' : 'text'"
                  v-model="field.val"
                  v-bind="{
                    onInput: () => field.bind.onInput(),
                    onBlur: () => field.bind.onBlur(),
                  }"
                />
                <select
                  v-if="label == 'rule'"
                  class="w-full border border-orange-400 rounded p-1"
                  :name="label"
                  :id="label"
                  v-model="field.val"
                  v-bind="{
                    onInput: () => field.bind.onInput(),
                    onBlur: () => field.bind.onBlur(),
                  }"
                >
                  <option value="user">user</option>
                  <option value="admin">admin</option>
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
        <div class="add-user-action flex justify-end gap-2">
          <button
            :class="[
              'border p-1 px-3 rounded',
              !addUserForm.submit.meta.submitting
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
              meta.valid && !addUserForm.submit.meta.submitting
                ? 'bg-orange-300 hover:bg-orange-400 border-orange-500'
                : 'bg-neutral-400 cursor-not-allowed',
            ]"
            @click.prevent="addUserForm.submit.exec()"
          >
            <span class="capitalize"> Add User </span>
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

const addUserForm = reactive({
  submit: {
    meta: {
      submitting: false,
      executed: false,
      success: false,
      message: "",
    },

    exec: async () => {
      if (!isValid) return;

      addUserForm.submit.meta.submitting = true;

      const { _value } = await useApiFetch("/api/v1.0/user/add", {
        method: "post",
        body: values.value,
      });

      if (_value.value?.data) {
        addUserForm.submit.meta.executed = true;
        addUserForm.submit.meta.success = true;
        addUserForm.submit.meta.message = "success add user";
        emits("success");
        form.resetForm();
      } else {
        addUserForm.submit.meta.executed = true;
        addUserForm.submit.meta.success = false;
        addUserForm.submit.meta.message = "failed add user";
      }

      addUserForm.submit.meta.submitting = false;
    },
  },
});

const { fields, form, values, meta, isValid } = useManagementForm().addUser();
</script>

<style scoped></style>
