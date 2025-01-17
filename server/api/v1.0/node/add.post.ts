export default defineEventHandler(async (event) => {
    const { session } = await useSmarthome().requestHandler(event).exec('user')
    if (!session) return generateApiResponse(event, { statusCode: 401 })
    const serialNumber = (await readBody(event))["serial-number"] as string
    if (!serialNumber) return generateApiResponse(event, {
        statusCode: 400, errors: {
            "serial-number": "serial-number is required"
        }
    })
    const node = await useSmarthome().storage.nodes().register(serialNumber, session.user?.email!)
    return generateApiResponse(event,
        {
            statusCode: node ? 200 : 500,
            data: node ? { serialNumber, credential: node.credential, token: node.token } : undefined
        })
})