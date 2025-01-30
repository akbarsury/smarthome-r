<template>
  <div class="flex flex-col gap-4">
    <form>
      <div class="new-user-input-form mb-4">
        <div class="flex flex-col gap-4">
          <div class="input-group" v-for="(field, label) in fields">
            <div>
              <label class="block text-neutral-700 mb-2" :for="label">
                {{ label }}
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
            true
              ? 'bg-red-300 hover:bg-red-400 border-red-500'
              : 'bg-neutral-400 pointer-events-none',
          ]"
          @click.prevent="emits('cancel')"
        >
          cancel
        </button>
        <button
          :class="[
            'border p-1 px-3 rounded',
            meta.valid
              ? 'bg-orange-300 hover:bg-orange-400 border-orange-500'
              : 'bg-neutral-400 cursor-not-allowed',
          ]"
          @click.prevent="submitAddUserForm()"
        >
          Add User
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
const { fields, form, values, meta, isValid } = useManagementForm().addUser();

const submitAddUserForm = async () => {
  if (!isValid.value) return;
  console.log({ values, meta });

  const { _value } = await useApiFetch("/api/v1.0/user/add", {
    method: "post",
    body: values.value,
  });
};

const emits = defineEmits<{
  success: [];
  cancel: [];
}>();
</script>

<style scoped></style>
