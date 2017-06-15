'use strict'
const ACT = fn => fn
const INACT = () => () => {}

function createEventPromise (Promise = require('..'), resolveEvent, rejectEvent) {
  const resolveCaller = resolveEvent ? ACT : INACT
  const rejectCaller = rejectEvent ? ACT : INACT

  class EventPromise extends Promise {
    constructor (target) {
      const handle = typeof target === 'function'
        ? (resolve, reject) =>
          target(resolve, reject)
        : (resolve, reject) => {
          target.on(resolveEvent, resolveCaller(resolve))
          target.on(rejectEvent, rejectCaller(reject))
        }

      if (typeof handle !== 'function') {
        throw new TypeError(`${target} must be either a function or an EventTarget.`)
      }

      super(handle)
    }
  }

  return EventPromise
}

module.exports = createEventPromise
