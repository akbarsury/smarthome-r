<template>
  <ClientOnly>
    <div class="flex flex-col" v-for="(form, label) in fields">
      <div>
        <label :for="`${label}`">{{ label }}</label>
        <input :name="`${label}`" :id="`${label}`" v-model="form.val" />
      </div>
    </div>
  </ClientOnly>
  <button class="p-1 border border-orange-800" @click="form.validate()">
    Validate
  </button>
  <pre> {{ { name_, nameAtt_ } }}</pre>
  <div class="flex">
    <div class="basis border border-orange-800">
      <pre> {{ { errors: form.errors } }}</pre>
    </div>
    <div class="basis border border-orange-800">
      <pre> {{ { values: form.values } }}</pre>
    </div>
    <div class="basis border border-orange-800">
      <pre> {{ { keys } }}</pre>
    </div>
    <div class="basis border border-orange-800">
      <pre>{{ { fields } }} </pre>
    </div>
  </div>
  <!-- <div class="flex flex-col gap-4">
    <div
      class="new-user-input-form"
      v-if="!addUser.meta.status.startsWith('done')"
    >
      <div class="flex flex-col gap-4">
        <div class="input-group">
          <label class="block text-neutral-700 mb-2" for="name">Name</label>
          <input
            class="w-full border border-orange-400 rounded p-1"
            id="name"
            type="name"
            v-model="addUser.data.newUser.name"
          />
        </div>
        <div class="input-group">
          <label class="block text-neutral-700 mb-2" for="email">Email</label>
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
          addUser.meta.status === 'done:failed' ? 'bg-red-300' : 'bg-green-300',
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
  </div> -->
</template>

<script setup lang="ts">
const { useField, keys, form, fields } = useManagementForm().form("addUser");
const [name_, nameAtt_] = useField("name");
</script>

<style scoped></style>
