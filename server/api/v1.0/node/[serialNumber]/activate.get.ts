export default defineEventHandler(async (event) => {
    const token = useSmarthome().getBearer(event)
    if (!token) return generateApiResponse(event, { statusCode: 401 })
    const serialNumber = getRouterParam(event, "serialNumber")
    if (!serialNumber) return generateApiResponse(event, {
        statusCode: 400, errors: {
            "serialNumber": "serialNumber is required"
        }
    })
    const node = await useSmarthome().storage.nodes().activate(serialNumber, token)
    return generateApiResponse(event,
        {
            statusCode: node ? 200 : 500,
            data: node ? { serialNumber, credential: node.credential, token: node.token } : undefined
        })
})