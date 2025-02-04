export default defineEventHandler(async (event) => {
    const { session } = await useSmarthome().requestHandler(event).exec('app-client')
    if (!session) return generateApiResponse(event, { statusCode: 401 })
    const serialNumber = getRouterParam(event, "serialNumber")
    if (!serialNumber) return generateApiResponse(event, { statusCode: 400 })
    const node = await useSmarthome().storage.nodes().remove(serialNumber)
    return generateApiResponse(event,
        {
            statusCode: node ? 200 : 500,
            data: node ? { serialNumber } : undefined
        })
})