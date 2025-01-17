export default defineEventHandler(async (event) => {
    const { session } = await useSmarthome().requestHandler(event).exec('user')
    if (!session) return setResponseStatus(event, 401, "Unauthorized")
    const { serialNumber } = await readBody(event) as { serialNumber: string }
    if (!serialNumber) return setResponseStatus(event, 400, "Bad Request")
    const node = serialNumber ? await useSmarthome().storage.nodes().register(serialNumber) : undefined
    return node ?
        generateApiResponse(200,
            {
                message: "Node registered succcess",
                data: { "serial-number": serialNumber, credential: node.credential, token: node.token }
            })
        : setResponseStatus(event, 400, 'Bad request')
})