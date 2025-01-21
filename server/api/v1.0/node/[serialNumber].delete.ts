export default defineEventHandler(async (event) => {
    const { session } = await useSmarthome().requestHandler(event).exec('user')
    if (!session) return generateApiResponse(event, { statusCode: 401 })
    const serialNumber = getRouterParam(event, "serialNumber")
    const node = await useSmarthome().storage.nodes().remove(serialNumber!)
    return generateApiResponse(event,
        {
            statusCode: node ? 200 : 500,
            data: node ? { serialNumber } : undefined
        })
})