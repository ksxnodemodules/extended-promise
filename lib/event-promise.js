'use strict'
const ACT = fn => fn
const INACT = () => () => {}

function createEventPromise (XPromise = require('..'), resolveEvent, rejectEvent) {
  const resolveCaller = resolveEvent ? ACT : INACT
  const rejectCaller = rejectEvent ? ACT : INACT

  class EventPromise extends XPromise {
    constructor (target) {
      const type = typeof target

      if (type === 'function' || target instanceof Promise) {
        super(target)
        return
      }

      if (type !== 'object') {
        throw new TypeError(`${target} must be either a function or an EventTarget.`)
      }

      super((resolve, reject) => {
        target.on(resolveEvent, resolveCaller(resolve))
        target.on(rejectEvent, rejectCaller(reject))
      })
    }
  }

  return EventPromise
}

module.exports = createEventPromise
