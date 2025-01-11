import nodeHandler from "~/server/utils/node-handler"

export default nodeHandler(defineEventHandler(async (event) => {
    return 'x'
}))