import { defineStore } from 'pinia';

export const useAppStore = defineStore('app', () => {
    const _appId: globalThis.Ref<string | null> = ref(null)
    const appId = computed(() => _appId.value)
    const updateAppId = (appId: string | null) => { _appId.value = appId }

    return {
        appId,
        updateAppId
    }
});
