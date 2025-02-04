<template>
  <div class="edit-user">
    <form>
      <div class="flex flex-col gap-4">
        <div class="edit-user-status">
          <div
            v-if="editUserForm.submit.meta.executed"
            :class="[
              'rounded p-2 px-4',
              editUserForm.submit.meta.success ? 'bg-green-300' : 'bg-red-300',
            ]"
          >
            <span class="text-sm">
              {{ editUserForm.submit.meta.message }}
            </span>
          </div>
        </div>
        <div
          class="edit-user-input-form"
          v-if="!editUserForm.submit.meta.success"
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
                  v-if="label != 'rule'"
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
        <div class="edit-user-action flex justify-end gap-2">
          <button
            :class="[
              'border p-1 px-3 rounded',
              !editUserForm.submit.meta.submitting
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
              meta.valid && !editUserForm.submit.meta.submitting
                ? 'bg-orange-300 hover:bg-orange-400 border-orange-500'
                : 'bg-neutral-400 cursor-not-allowed',
            ]"
            @click.prevent="editUserForm.submit.exec()"
          >
            <span class="capitalize"> edit User </span>
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  user: Apis.Users.User;
}>();

const emits = defineEmits<{
  success: [];
  cancel: [];
}>();

const user = toRef(props.user);

const editUserForm = reactive({
  submit: {
    meta: {
      submitting: false,
      executed: false,
      success: false,
      message: "",
    },

    exec: async () => {
      if (!isValid) return;

      editUserForm.submit.meta.submitting = true;

      const { _value, status } = await useApiFetch(
        `/api/v1.0/user/${user.value.id}` as "/api/v1.0/user/:userId",
        {
          method: "put",
          body: values.value,
        }
      );

      if (_value.value?.data) {
        editUserForm.submit.meta.executed = true;
        editUserForm.submit.meta.success = true;
        editUserForm.submit.meta.message = "success edit user";
        emits("success");
        form.resetForm();
      } else {
        editUserForm.submit.meta.executed = true;
        editUserForm.submit.meta.success = false;
        editUserForm.submit.meta.message = "failed edit user";
      }

      editUserForm.submit.meta.submitting = false;
    },
  },
});

const { fields, form, values, meta, isValid } = useManagementForm().editUser();

Object.keys(fields).forEach((field) => {
  fields[field as "email" | "name"].val =
    user.value[field as "email" | "name"] || "NULL";
});
</script>

<style scoped></style>
