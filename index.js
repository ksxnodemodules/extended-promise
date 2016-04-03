
((module) => {
    'use strict';

    var _getfunc = (fn, ...fnlist) =>
        typeof fn === 'function' ? fn : _getfunc(...fnlist);

    var _igretf = (fn) => (value) => {
        fn(value);
        return value;
    };

    const DONOTHING = () => {};
    const THROW = (error) => {throw error};

    class ExtendedPromise extends Promise {

        constructor(executor) {
            switch (typeof executor) {
                case 'function':
                    super(executor);
                    return;
                case 'object':
                    if (executor instanceof Promise) {
                        let alexec = (...decide) =>
                            executor.then(...decide.map(_igretf));
                        super(alexec);
                        return;
                    }
            }
            throw new TypeError(`${executor} is not a valid executor`);
        }

        static all(iterable) {
            return new this(super.all(iterable));
        }

        static race(iterable) {
            return new this(super.race(iterable));
        }

        static queue(promise, ...fnlist) {
            return fnlist.reduce((lasted, fn) => lasted.createListenerPromise(fn), new this(promise));
        }

        static resolve(value) {
            return new this((resolve) => resolve(value));
        }

        static reject(value) {
            return new this((_, reject) => reject(value));
        }

        mkchange(...fn) {
            return this.then(...fn);
        }

        onfulfill(fn) {
            return this.then(_igretf(fn));
        }

        onreject(fn) {
            return this.catch(_igretf(fn));
        }

        onfinish(onfulfill, onreject) {
            return this.then(_igretf(_getfunc(onfulfill, DONOTHING)), _igretf(_getfunc(onreject, THROW)));
        }

        createListenerPromise(fn) {
            return new this.constructor((resolve, reject) => this.onfinish((value) => fn(value, resolve, reject), reject));
        }

        listener(fn) {
            return this.createListenerPromise(fn);
        }

    }

    module.exports = class extends ExtendedPromise {};

})(module);
