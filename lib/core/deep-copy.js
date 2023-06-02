// 浅拷贝与深拷贝：
// 基本数据储存在栈中，引用类型数据储存在堆之中
// 基本类型数据可直接复制，引用类型数据在赋值时，新变量没有获得新值，而是将指针指向此对象的堆位置
// 浅拷贝：拷贝了对象的引用地址，没有获得新值；深拷贝：获得新值，而不是获得引用地址

// 浅拷贝：let a = b;let a = Object.assign({},b)
// 深拷贝：let a = JSON.parse(JSON.stringify(b));
// 考虑多种引用类型的完整深拷贝：
import { isPlainObject, getObjectType, objectType } from "../modules/type";

/**
 * @method deepCopy
 * @description 深拷贝
 * @param {Object} obj 需要拷贝的对象
 * @return {Object} 返回复制的对象
 * @example
 * const newObject = deepCopy(oldObject)
 */
export const deepCopy = function (origin, map = new WeakMap()) {
    // 一、无数据 或者 类型为基本类型、函数则直接返回
    if (!origin || !isPlainObject(origin)) {
        return origin;
    }

    // 二、获取引用数据类型
    const type = getObjectType(origin);

    // 三、已经存在，则直接返回，循环引用
    if (map.has(origin)) {
        return map.get(origin);
    }

    // 四、根据类型处理
    // 1，正则或者Date类型
    if (type === objectType.reg || type === objectType.date) {
        const newObject = new origin.constructor(origin.valueOf());
        map.set(newObject);
        return newObject;
    }
    // 2，Set 类型
    if (type === objectType.set) {
        const newObject = new Set();
        for (const value of origin) {
            newObject.add(deepCopy(value, map));
        }
        map.set(newObject);
        return newObject;
    }
    // 3，Map类型
    if (type === objectType.map) {
        const newObject = new Map();
        for (const [key, value] of origin) {
            newObject.set(key, deepCopy(value, map));
        }
        map.set(newObject);
        return newObject;
    }

    // 4，Array 或者 Object 类型
    // 考虑了以Symbol作为key的情况
    const keys = Reflect.ownKeys(origin);
    // 获取描述符
    const descriptors = Object.getOwnPropertyDescriptors(origin);
    // 考虑原型链，继承原对象的原型，描述符
    const newObject = Object.create(Object.getPrototypeOf(origin), descriptors);

    map.set(newObject);
    keys.forEach((key) => {
        const value = origin[key];
        newObject[key] = deepCopy(value, map);
    });

    // 数组类型则还原
    return type === objectType.array ? Array.from(newObject) : newObject;
};
