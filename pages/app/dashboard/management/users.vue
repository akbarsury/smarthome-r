<template>
  <div class="user-management">
    <div class="flex justify-end">
      <div class="pt-2">
        <button
          class="bg-blue-500 hover:bg-blue-700 text-neutral-50 rounded p-1 px-2"
          @click.prevent="userBind.set('add')"
        >
          Add User
        </button>
      </div>
    </div>
    <div class="mt-4">
      <div
        class="grid grid-cols-[minmax(auto,_3fr)_minmax(auto,_2fr)_minmax(auto,max-content)] gap-2"
      >
        <div
          class="grid grid-cols-subgrid gap-2 col-span-3 bg-orange-100 hover:bg-orange-200 rounded p-2"
          v-for="user in usersData?.data?.filter((user) => user !== null) as Apis.Users.User[] || []"
        >
          <div class="">
            <span class="block capitalize">
              {{ user.name || "No name" }}
            </span>
            <span> {{ user.email || "No email" }} </span>
          </div>
          <div class="place-self-center">
            <div class="flex gap-1">
              <div>
                <span class="bg-green-500 text-xs p-1 px-2 rounded-full">
                  Verified
                </span>
              </div>
              <div>
                <span class="bg-yellow-500 text-xs p-1 px-2 rounded-full">
                  admin
                </span>
              </div>
            </div>
          </div>
          <div class="content-center">
            <div class="flex gap-2">
              <button
                class="bg-blue-400 hover:bg-blue-600 border-blue-600 rounded p-1 px-2"
                @click.prevent="userBind.set('edit', user)"
              >
                Edit
              </button>
              <button
                class="bg-red-400 hover:bg-red-600 border-red-600 rounded p-1 px-2"
                @click.prevent="userBind.set('delete', user)"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="user-action-modal" v-if="userBind.action">
      <div class="add-user" v-if="userBind.action === 'add'">
        <CompositeModalFullPage>
          <div class="min-w-[320px]">
            <div class="p-2">
              <div class="mb-4">
                <h3 class="text-lg font-bold text-center">Add new user</h3>
              </div>
              <FormAddUser
                @cancel="userBind.reset()"
                @success="refreshUsersData()"
              />
            </div>
          </div>
        </CompositeModalFullPage>
      </div>
      <div class="edit-user" v-if="userBind.action === 'edit' && userBind.user">
        <CompositeModalFullPage>
          <div class="min-w-[320px]">
            <div class="p-2">
              <div class="mb-4">
                <h3 class="text-lg font-bold text-center">Edit user</h3>
              </div>
              <FormEditUser
                :user="userBind.user"
                @cancel="userBind.reset()"
                @success="refreshUsersData()"
              />
            </div>
          </div>
        </CompositeModalFullPage>
      </div>
      <div
        class="delete-user"
        v-if="userBind.action === 'delete' && userBind.user"
      >
        <CompositeModalFullPage>
          <div class="min-w-[320px]">
            <div class="p-2">
              <div class="mb-4">
                <h3 class="text-lg font-bold text-center">Delete user</h3>
              </div>
              <FormDeleteUser
                :user="userBind.user"
                @cancel="userBind.reset()"
                @success="refreshUsersData()"
              />
            </div>
          </div>
        </CompositeModalFullPage>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { _value: usersData, refresh: refreshUsersData } = await useApiFetch(
  "/api/v1.0/user/users"
);

const userBind: globalThis.Ref<{
  action?: "add" | "edit" | "delete";
  user?: Apis.Users.User;
  readonly set: (
    action: "add" | "edit" | "delete",
    user?: Apis.Users.User
  ) => void;
  readonly reset: () => void;
}> = ref({
  set: (action, user) => {
    userBind.value.action = action;
    userBind.value.user = user;
  },
  reset: () => {
    userBind.value.action = undefined;
    userBind.value.user = undefined;
  },
});
</script>

<style scoped></style>
