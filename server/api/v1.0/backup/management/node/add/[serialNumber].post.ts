export default defineEventHandler(async (event) => {
    const serialNumber = getRouterParam(event, "serialNumber")
    const node = serialNumber ? await useSmarthome().storage.nodes().register(serialNumber) : undefined
    return node ? { "serial-number": serialNumber, credential: node.credential, token: node.token } : setResponseStatus(event, 400, 'Bad request')
})