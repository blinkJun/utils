// 浅拷贝与深拷贝：
// 基本数据储存在栈中，引用类型数据储存在堆之中
// 基本类型数据可直接复制，引用类型数据在赋值时，新变量没有获得新值，而是将指针指向此对象的堆位置
// 浅拷贝：拷贝了对象的引用地址，没有获得新值；深拷贝：获得新值，而不是获得引用地址

// 浅拷贝：let a = b;let a = Object.assign({},b)
// 深拷贝：let a = JSON.parse(JSON.stringify(b));
// 虑多种引用类型的完整深拷贝：

// 常用的引用类型
const objectType = '[object Object]'
const arrayType = '[object Array]'
const setType = '[object Set]'
const mapType = '[object Map]'

// 是引用类型
function isObject(origin) {
    return typeof origin == 'object'
}

// 获取对象的具体引用类型
const getObjectType = function(obj){
    return Object.prototype.toString.call(obj)
}

// 创建一样的对象类型
const createSameObject = function(obj,type){
    if(type===arrayType){
        return []
    }
    if(type===objectType){
        return {}
    }
    return new obj.constructor(obj)
}


/**
 * @method deepCopy
 * @description 深拷贝
 * @param {Object} obj 需要拷贝的对象
 * @return {Object} 返回复制的对象
 */
const deepCopy = function(origin,map = new WeakMap()){
    // 无数据或者类型为基本类型则直接返回
    if(!origin||!isObject(origin)){
        return origin
    }

    // 以下处理引用类型的复制
    // 获取类型和新对象的基本结果
    const type = getObjectType(origin)
    const newObject = createSameObject(origin,type)

    // 已经存在，则直接返回，循环引用
    if(map.has(origin)){
        return map.get(origin)
    }

    map.set(newObject)

    // 根据类型处理
    // Set 类型
    if(type===setType){
        for(const value of origin){
            return newObject.add(deepCopy(value,map));
        }
        return newObject
    }
    // Map类型
    if(type===mapType){
        for(const [key,value] of origin){
            newObject.set(key,deepCopy(value,map))
        }
        return newObject
    }
    // Array 或者 Object 类型
    if(type===arrayType||type===objectType){
        for(const key in origin){
            newObject[key] = deepCopy(origin[key],map)
        }
        return newObject
    }

    return newObject
}