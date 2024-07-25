import { setTimeout } from 'node:timers/promises'

export default function retryRequest(requestFunction, ...args) {

  let waitTime = 1

  const request = async () => {
    try {

      return requestFunction(...args)

    } catch (e) {

      if (e.response?.status == 429) {
        waitTime *= 2
        console.warn(`\nHit rate limit. Retrying after ${ waitTime }ms.`)
        await setTimeout(waitTime)
        return request()
      }

      throw e

    }
  }

  return request()

}
