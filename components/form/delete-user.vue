<template>
  <div class="delete-user">
    <div class="flex flex-col gap-4">
      <div
        class="delete-user-status"
        v-if="deleteUserForm.submit.meta.executed"
      >
        <div
          :class="[
            'rounded p-2 px-4',
            deleteUserForm.submit.meta.success ? 'bg-green-300' : 'bg-red-300',
          ]"
        >
          <span class="text-sm">
            {{ deleteUserForm.submit.meta.message }}
          </span>
        </div>
      </div>
      <div
        class="delete-user-details"
        v-if="!deleteUserForm.submit.meta.success"
      >
        <span class="block mb-2">Are you sure to delete user ?</span>
        <div class="user-information border border-blue-400 rounded p-2">
          <span class="text-red-500 font-semibold border-b">
            User Information
          </span>
          <div>
            <span class="inline-block w-[48px]">Name</span>
            <span class="capitalize">: {{ user.name }}</span>
          </div>
          <div>
            <span class="inline-block w-[48px]">Email</span>
            <span>: {{ user.email }}</span>
          </div>
        </div>
      </div>
      <div class="delete-user-action flex justify-end gap-2">
        <button
          :class="[
            'border p-1 px-3 rounded',
            deleteUserForm.submit.meta.success ||
            !deleteUserForm.submit.meta.submitting
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
            !deleteUserForm.submit.meta.success &&
            !deleteUserForm.submit.meta.submitting
              ? 'bg-orange-300 hover:bg-orange-400 border-orange-500'
              : 'bg-neutral-400 cursor-not-allowed',
          ]"
          @click.prevent="deleteUserForm.submit.exec()"
        >
          <span class="capitalize"> Delete User </span>
        </button>
      </div>
    </div>
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

const deleteUserForm = reactive({
  submit: {
    meta: {
      submitting: false,
      executed: false,
      success: false,
      message: "",
    },

    exec: async () => {
      deleteUserForm.submit.meta.submitting = true;

      const { _value } = await useApiFetch(
        `/api/v1.0/user/${user.value.id}` as "/api/v1.0/user/:userId",
        { method: "delete" }
      );

      deleteUserForm.submit.meta.executed = true;

      if (_value.value?.data) {
        deleteUserForm.submit.meta.success = true;
        deleteUserForm.submit.meta.message = "success delete user";
        emits("success");
      } else {
        deleteUserForm.submit.meta.success = false;
        deleteUserForm.submit.meta.message = "failed delete user";
      }

      deleteUserForm.submit.meta.submitting = false;
    },
  },
});
</script>

<style scoped></style>
