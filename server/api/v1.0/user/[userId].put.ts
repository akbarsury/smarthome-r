import { z } from "zod"

const editUserSchema = z.object({
    email: z.string(),
    password: z.string(),
    name: z.string(),
    rule: z.string()
})

type EditUser = z.infer<typeof editUserSchema>

export default defineEventHandler(async (event) => {
    const { session } = await useSmarthome().requestHandler(event).exec('app-client')
    if (!session) return generateApiResponse(event, { statusCode: 401 })
    const editUser = await readBody(event) as EditUser
    const userId = getRouterParam(event, "userId")
    console.log({ userId });
    if (!editUserSchema.safeParse(editUser).success && !userId) return generateApiResponse(event, { statusCode: 400 })
    const user = userId ? await useSmarthome().storage.user().update(userId, editUser) : null
    return generateApiResponse(event, {
        statusCode: user ? 200 : 204,
        message: user ? "Success edit user" : "Failed edit user",
        data: user
    })
})