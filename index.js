
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
            return new ExtendedPromise(super.all(iterable));
        }

        static race(iterable) {
            return new ExtendedPromise(super.race(iterable));
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

    }

    module.exports = class extends ExtendedPromise {};

})(module);
