export const debounce = (fn, retardo) => {
    let idTimeout;
    return function(...args) {
        clearTimeout(idTimeout);
        idTimeout = setTimeout(() => fn.apply(this, args), retardo);
    };
}