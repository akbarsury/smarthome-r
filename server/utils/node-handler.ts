import type { EventHandler, EventHandlerRequest } from 'h3'

const nodeHandler = <T extends EventHandlerRequest, D>(
  handler: EventHandler<T, D>
): EventHandler<T, D> =>
  defineEventHandler<T>(async (event) => {
    try {
      const response = await handler(event)
      return { response }
    } catch (err) {
      // Error handling
      return { err }
    }
  })

export default nodeHandler