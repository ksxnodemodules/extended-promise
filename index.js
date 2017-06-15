'use strict'

const _igretf = fn => value => {
  fn(value)
  return value
}

const BEITSELF = x => x
const DONOTHING = () => {}
const THROW = error => { throw error }

class ExtendedPromise extends Promise {
  constructor (executor) {
    switch (typeof executor) {
      case 'function':
        super(executor)
        return
      case 'object': if (executor instanceof Promise) {
        super((...decide) =>
          executor.then(...decide.map(_igretf))
        )
        return
      }
    }
    throw new TypeError(`${executor} is not a valid executor`)
  }

  static get create () {
    return (...args) => new this(...args)
  }

  static get EventPromise () {
    return this.createEventPromiseClass()
  }

  static async _serial (prset = [], callback = BEITSELF) {
    const result = []
    for (const promise of prset) {
      const index = result.length
      const response = await promise
      const object = {
        response,
        promise,
        index,
        __proto__: [response, promise, index]
      }
      result.push(callback(object))
    }
    return result
  }

  static all (iterable) {
    return new this(super.all(iterable))
  }

  static race (iterable) {
    return new this(super.race(iterable))
  }

  static queue (promise, ...fnlist) {
    return fnlist.reduce((lasted, fn) => lasted.createListenerPromise(fn), new this(promise))
  }

  static serial (...args) {
    return new this(this._serial(...args))
  }

  static resolve (value) {
    return new this((resolve) => resolve(value))
  }

  static reject (value) {
    return new this((_, reject) => reject(value))
  }

  static reverse (promise) {
    return new this((resolve, reject) => promise.then(_igretf(reject), _igretf(resolve)))
  }

  static createEventPromiseClass (
    resolveEvent = this.resolveEvent,
    rejectEvent = this.rejectEvent
  ) {
    const create = require('./lib/event-promise.js')
    return create(this, resolveEvent, rejectEvent)
  }

  mkchange (...fn) {
    return this.then(...fn)
  }

  onfulfill (fn) {
    return this.then(_igretf(fn))
  }

  onreject (fn) {
    return this.catch(_igretf(fn))
  }

  onfinish (onfulfill = DONOTHING, onreject = THROW) {
    return this.then(_igretf(onfulfill), _igretf(onreject))
  }

  createListenerPromise (fn) {
    return new this.constructor((resolve, reject) =>
      this.onfinish(value => fn(value, resolve, reject), reject)
    )
  }

  listener (fn) {
    return this.createListenerPromise(fn)
  }

  reverse () {
    return this.constructor.reverse(this)
  }
}

module.exports = ExtendedPromise
