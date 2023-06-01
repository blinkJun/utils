/** @module Type */

/**
 * @method isNumber
 * @description 判断传入值是否是数值
 * @param {any} val
 * @return {Boolean}
 */
export function isNumber(val) {
    return typeof val === "number";
}

/**
 * @method isUndefined
 * @description 判断传入值是否是未定义
 * @param {any} val
 * @return {Boolean}
 */
export function isUndefined(val) {
    return typeof val === "undefined";
}

/**
 * @method isPlainObject
 * @description 是否为普通对象
 * @param {any} val
 * @return {Boolean}
 */
export function isPlainObject(val) {
    return val && val.constructor.name === "Object";
}
