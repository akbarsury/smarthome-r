<template>
  <div class="user-management">
    <div class="flex justify-end">
      <div class="mt-2">
        <button
          class="bg-blue-600 text-neutral-50 rounded p-1 px-2"
          @click.prevent="() => addUser.open()"
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
          v-for="user in usersData?.data || []"
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
              >
                Edit
              </button>
              <button
                class="bg-red-400 hover:bg-red-600 border-red-600 rounded p-1 px-2"
                @click.prevent="deleteUser.open(user.id)"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="add-user" v-if="addUser.meta.status">
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
                  <div class="input-group">
                    <label class="block text-neutral-700 mb-2" for="email"
                      >Email</label
                    >
                    <input
                      class="w-full border border-orange-400 rounded p-1"
                      id="email"
                      type="email"
                      v-model="addUser.data.newUser.email"
                    />
                  </div>
                  <div class="input-group">
                    <label class="block text-neutral-700 mb-2" for="email"
                      >Password</label
                    >
                    <input
                      class="w-full border border-orange-400 rounded p-1"
                      type="password"
                      v-model="addUser.data.newUser.password"
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
    </div>
    <div class="user-action-modal">
      <div class="delete-user" v-if="deleteUser.meta.status">
        <CompositeModalFullPage @click-outside="deleteUser.close()">
          <div class="min-w-[320px]">
            <div class="div">
              <div class="mb-2">
                <h3 class="text-lg font-bold text-center">Delete user</h3>
              </div>
              <div class="flex flex-col gap-4">
                <div class="" v-if="!deleteUser.meta.status.startsWith('done')">
                  <span class="block mb-2">Are you sure to delete user ?</span>
                  <div
                    class="user-information border border-blue-400 rounded p-2"
                  >
                    <span class="text-red-500 font-semibold border-b">
                      User Information
                    </span>
                    <div>
                      <span class="inline-block w-[48px]">Name</span>
                      <span class="capitalize"
                        >:
                        {{
                          usersData?.data?.find(
                            (user) => user.id === deleteUser.data.userId
                          )?.name
                        }}</span
                      >
                    </div>
                    <div>
                      <span class="inline-block w-[48px]">Email</span>
                      <span
                        >:
                        {{
                          usersData?.data?.find(
                            (user) => user.id === deleteUser.data.userId
                          )?.email
                        }}</span
                      >
                    </div>
                  </div>
                </div>
                <div class="delete-user-status" v-else>
                  <div
                    :class="[
                      'rounded p-2 px-4',
                      deleteUser.meta.status === 'done:failed'
                        ? 'bg-red-300'
                        : 'bg-green-300',
                    ]"
                  >
                    {{ deleteUser.meta.message }}
                  </div>
                </div>
                <div class="delete-user-action flex justify-end gap-2">
                  <button
                    :class="[
                      'border p-1 px-3 rounded',
                      deleteUser.meta.status != 'waiting'
                        ? 'bg-red-300 hover:bg-red-400 border-red-500'
                        : 'bg-neutral-400 pointer-events-none',
                    ]"
                    @click.prevent="deleteUser.close()"
                  >
                    cancel
                  </button>
                  <button
                    :class="[
                      'border p-1 px-3 rounded',
                      deleteUser.meta.status != 'waiting'
                        ? 'bg-orange-300 hover:bg-orange-400 border-orange-500'
                        : 'bg-neutral-400 pointer-events-none',
                    ]"
                    @click.prevent="deleteUser.exec()"
                  >
                    Delete User
                  </button>
                </div>
              </div>
            </div>
          </div>
        </CompositeModalFullPage>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data: usersData, refresh: refreshUsersData } = await useFetch(
  "/api/v1.0/user/users"
);

const addUser: {
  data: {
    newUser: { name?: string; email?: string; password?: string };
  };
  meta: {
    status?: "bind" | "waiting" | "done:failed" | "done:success";
    message?: string;
  };
  open: () => void;
  close: () => void;
  exec: () => void;
} = reactive({
  data: { newUser: {} },

  meta: {},

  open: () => {
    addUser.meta.status = "bind";
  },

  close: () => {
    addUser.meta = {};
    addUser.data = { newUser: {} };
  },

  exec: async () => {
    addUser.meta.status = "waiting";
    const { data: addUserData, errors: addUserErrors } = await $fetch(
      "/api/v1.0/user/add",
      {
        method: "post",
        body: addUser.data.newUser,
      }
    );

    if (addUserData) {
      addUser.meta = {
        status: addUserErrors ? "done:success" : "done:failed",
        message: addUserErrors?.toString(),
      };
      addUser.data.newUser = addUserData ? {} : addUser.data.newUser;
    }

    if (addUser.meta.status === "done:success") {
      await refreshUsersData();
    }

    setTimeout(async () => {
      addUser.close();
    }, 3000);
  },
});

const deleteUser: {
  data: {
    userId?: string;
  };
  meta: {
    status?: "bind" | "waiting" | "done:failed" | "done:success";
    message?: string;
  };
  open: (id: string) => void;
  close: () => void;
  exec: () => void;
} = reactive({
  data: {},

  meta: {},

  open: (id: string) => {
    deleteUser.data.userId = usersData.value?.data?.find(
      (user) => user.id === id
    )?.id;
    if (deleteUser.data.userId) {
      deleteUser.meta.status = "bind";
    }
  },

  close: () => {
    deleteUser.meta = {};
    deleteUser.data = {};
  },

  exec: async () => {
    deleteUser.meta.status = "waiting";
    const { data: deleteUserData } = await $fetch(
      `/api/v1.0/user/${deleteUser.data.userId}` as "/api/v1.0/user/:userId",
      { method: "delete" }
    );

    if (deleteUserData) {
      deleteUser.meta = {
        status: deleteUserData?.userId ? "done:success" : "done:failed",
        // message: deleteUserResult.value.message,
      };
      deleteUser.data = {};
    }

    if (deleteUser.meta.status === "done:success") {
      await refreshUsersData();
    }

    setTimeout(async () => {
      deleteUser.close();
    }, 3000);
  },
});
</script>

<style scoped></style>
