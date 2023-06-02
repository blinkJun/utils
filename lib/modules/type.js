/** @module Type */

/**
 * @constant {Object} objectType 常用的引用类型
 * @property {String} objectType.object 常规对象
 * @property {String} objectType.array 数组
 * @property {String} objectType.date 日期
 * @property {String} objectType.reg 正则
 * @property {String} objectType.set Set
 * @property {String} objectType.map Map
 */
export const objectType = {
    object: "[object Object]",
    array: "[object Array]",
    date: "[object Date]",
    reg: "[object RegExp]",
    set: "[object Set]",
    map: "[object Map]",
};

/**
 * @description 获取对象引用类型，可以和 objectType 包含的类型进行比较
 * @method getObjectType
 * @param {Object} obj
 * @return {String}
 * @example
 * if(getObjectType(obj)===objectType.array){
 *
 * }
 */
export const getObjectType = function (obj) {
    return Object.prototype.toString.call(obj);
};

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
