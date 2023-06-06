import { isPlainObject, isUndefined } from "../modules/type";

export * from "./deep-copy";

/**
 * @method assignment
 * @description 向目标对象赋值，仅对目标对象target的key赋值，源source多余的key不会添加到target上
 * @param {object} target 待赋值目标对象
 * @param {object} source 赋值目标源
 * @return {object}
 * @example
 * const foo = {
 *  a:1
 * }
 * const fbb = {
 *  a:2,
 *  b:1
 * }
 * assignment(foo,fbb)
 * // { a:2 }
 */
export function assignment(target, source) {
    if (!isPlainObject(target) || !isPlainObject(source)) {
        return target;
    }

    for (let key in target) {
        if (!isUndefined(source[key])) {
            if (isPlainObject(target[key])) {
                target[key] = assignment(target[key], source[key]);
            } else {
                target[key] = source[key];
            }
        }
    }

    return target;
}

/**
 * @method firstUpperCase
 * @description 字符串首字母大写
 * @param {String} str
 * @return {String}
 * @example
 * firstUpperCase('test')
 * // Test
 */
export function firstUpperCase(str) {
    return str.replace(/\w/, (m) => m.toUpperCase());
}

/**
 * @method isWeakPassword
 * @description 是否为弱密码
 * @param {String} text
 * @return {Boolean}
 * @example
 * isWeakPassword('123')
 * // true
 */
export function isWeakPassword(text) {
    let isWeak = false;
    if (text) {
        const str =
            "abcdefghijklmnopqrstuvwxyz0123456789|9876543210zyxwvutsrqponmlkjihgfedcba";
        text.replace(/[^0-9]{3,}|[^a-z]{3,}/gi, function (m) {
            if (!isWeak) {
                isWeak =
                    /^(.)\1{2,}$/.test(m) || str.indexOf(m.toLowerCase()) > -1;
            }
        });
    }
    return isWeak;
}

/**
 * @method formatFileSize
 * @description 格式化文件大小
 * @param  {number} total 文件大小
 * @param  {number} [n = 0] total参数的原始单位如果为Byte，则n设为0，如果为KB，则n设为1，如果为MB，则n设为2，以此类推
 * @return {string} 带单位的文件大小的字符串
 * @example
 * formatFileSize(300)
 * // 300KB'
 */
export function formatFileSize(total, n = 0) {
    var unitArr = ["KB", "MB", "GB", "TB", "PB", "EB"];
    var len = total / 1024.0;

    if (len > 1000) {
        return formatFileSize(len, ++n);
    }

    return len.toPrecision(3) + unitArr[n];
}

/**
 * @method debounce
 * @description 防抖函数
 * @param {Function} callback 回调方法
 * @param {Number} [ms = 200] 防抖延迟
 * @return {Function}
 */
export function debounce(callback, ms = 200) {
    let timer = null;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            callback.apply(this, args);
        }, ms);
    };
}

/**
 * @method throttle
 * @description 节流函数
 * @param {Function} callback 回调方法
 * @param {Number} [ms = 200] 节流间接时间
 * @return {Function}
 */

export function throttle(callback, ms = 200) {
    let canRun = true;
    return function (...args) {
        if (!canRun) {
            return false;
        }
        canRun = false;
        callback.apply(this, args);
        setTimeout(() => {
            canRun = true;
        }, ms);
    };
}

/**
 * @method pointAngle
 * @description 获取两个坐标点之间的角度
 * @param {Object} start 第一个点坐标
 * @param {Number} start.x
 * @param {Number} start.y
 * @param {Object} end 第二个点坐标
 * @param {Number} end.x
 * @param {Number} end.y
 * @return {Number}
 */
export function pointAngle({ x: startX, y: startY }, { x: moveX, y: moveY }) {
    const absX = Math.abs(startX - moveX);
    const abxY = Math.abs(startY - moveY);

    // x 轴之差为 0
    if (absX === 0) {
        return 90;
    }

    // y 轴之差为 0
    if (abxY === 0) {
        return 0;
    }

    let angle = (Math.atan(abxY / absX) * 360) / (2 * Math.PI);

    return angle;
}

/**
 * @method randomColor
 * @description 生成随机HEX色值
 * @return {String}
 */
export function randomColor() {
    return (
        "#" +
        Math.floor(Math.random() * 0xffffff)
            .toString(16)
            .padEnd(6, "0")
    );
}

/**
 * @method starScore
 * @description 生成星级评分
 * @param {Number} rate：（1-5）
 * @return {String}
 */
export function starScore(rate) {
    return "★★★★★☆☆☆☆☆".slice(5 - rate, 10 - rate);
}
