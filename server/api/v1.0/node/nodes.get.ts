export default defineEventHandler(async (event) => {
    const { session } = await useSmarthome().requestHandler(event).exec('user')
    if (!session) return generateApiResponse<undefined>(event, { statusCode: 401 })
    const isManagement = getRequestHeader(event, 'referer')?.endsWith('/dashboard/management/nodes')
    const nodes = (await (await useSmarthome().storage.nodes().get({ activeOnly: !isManagement })).withValue()).map((node) => {
        return isManagement ? { ...node } : { ...node, active: undefined, acceptedUsers: undefined, items: undefined }
    })
    return generateApiResponse<typeof nodes>(event, {
        statusCode: 200,
        data: nodes
    })
})