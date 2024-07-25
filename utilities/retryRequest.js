import { setTimeout } from 'node:timers/promises'

export default function retryRequest(requestFunction, ...args) {

  let waitTime = 1

  const request = async () => {

    let ret

    try {

      ret = await requestFunction(...args)

    } catch (e) {

      if (e.response.status == 429) {
        waitTime *= 2
        console.warn(`\nHit rate limit. Retrying after ${ waitTime }ms.`)
        await setTimeout(waitTime)
        ret = await request()
      } else {
        throw e
      }

    }

    return ret

  }

  return request()

}
