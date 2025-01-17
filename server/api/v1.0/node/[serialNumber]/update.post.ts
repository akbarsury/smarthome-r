export default defineEventHandler(async (event) => {
    const { session } = await useSmarthome().requestHandler(event).exec('user')
    if (!session) return generateApiResponse(event, { statusCode: 401 })
    const serialNumber = getRouterParam(event, "serialNumber")
    const { target: updateType } = getQuery(event)
    if (!["general", "data"].includes(updateType?.toString() || 'ups..')) return generateApiResponse(event, {
        statusCode: 400,
        errors: {
            "updateType": "Invalid updateType parameter."
        }
    })
    return {
        serialNumber, updateType
    }
})