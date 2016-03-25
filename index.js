
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
