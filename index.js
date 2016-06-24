
((module) => {
	'use strict';

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

		static queue(promise, ...fnlist) {
			return fnlist.reduce((lasted, fn) => lasted.createListenerPromise(fn), new ExtendedPromise(promise));
		}

		static resolve(value) {
			return new ExtendedPromise((resolve) => resolve(value));
		}

		static reject(value) {
			return new ExtendedPromise((_, reject) => reject(value));
		}

		static reverse(promise) {
			return new ExtendedPromise((resolve, reject) => promise.then(_igretf(reject), _igretf(resolve)));
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

		onfinish(onfulfill = DONOTHING, onreject = THROW) {
			return this.then(_igretf(onfulfill), _igretf(onreject));
		}

		createListenerPromise(fn) {
			return new ExtendedPromise.constructor((resolve, reject) => this.onfinish((value) => fn(value, resolve, reject), reject));
		}

		listener(fn) {
			return this.createListenerPromise(fn);
		}

		reverse() {
			return this.constructor.reverse(this);
		}

	}

	module.exports = ExtendedPromise;

})(module);
