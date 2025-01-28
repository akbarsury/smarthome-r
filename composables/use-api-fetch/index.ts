import type { FetchResult, UseFetchOptions } from '#app';
import type { AsyncData, KeysOf, PickFrom } from '#app/composables/asyncData';
import type { DefaultAsyncDataErrorValue, DefaultAsyncDataValue } from '#app/defaults';
import type { AvailableRouterMethod, NitroFetchRequest } from 'nitropack/types';

const useApiFetch = async  <
    ResT = void,
    ReqT extends NitroFetchRequest = NitroFetchRequest,
    ReqM extends AvailableRouterMethod<ReqT> = ResT extends void ? 'get' extends AvailableRouterMethod<ReqT> ? 'get' : AvailableRouterMethod<ReqT> : AvailableRouterMethod<ReqT>, _ResT = ResT extends void ? FetchResult<ReqT, ReqM> : ResT, DataT = _ResT, PickKeys extends KeysOf<DataT> = KeysOf<DataT>, DefaultT = DefaultAsyncDataValue
>(request: Ref<ReqT> | ReqT | (() => ReqT), opts?: UseFetchOptions<_ResT, DataT, PickKeys, DefaultT, ReqT, ReqM>) => {
    const { data, status, clear, error, execute, refresh } = await useFetch(request, opts)
    return { _value: data, status, clear, error, execute, refresh }
}

export { useApiFetch, useApiFetch as default }