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
 * @method formatNumber
 * @description 格式化数值为特定格式
 * @param {Number} number 需要格式化的数值
 * @param {Number} precision 保留小数点，默认2
 * @param {String} thousand 千分位分隔符，默认','
 * @return {String}
 * @example
 * formatNumber(1000.22,1,',')
 * // '1,000.2'
 */
export function formatNumber(number, precision = 2, thousand = ",") {
    if (typeof number == "number" || (number -= 0)) {
        return (number.toFixed(precision) + "").replace(
            /\d{1,3}(?=(\d{3})+(\.\d*)?$)/g,
            "$&" + thousand
        );
    }
    return "0";
}

/**
 * @method formatFileSize
 * @description 格式化文件大小
 * @param  {number} total 文件大小
 * @param  {number} n     total参数的原始单位如果为Byte，则n设为0，如果为KB，则n设为1，如果为MB，则n设为2，以此类推
 * @return {string}       带单位的文件大小的字符串
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
 * @method getPercent
 * @description 获取百分比
 * @param {Number} value 数值
 * @param {Number} total 总数值 默认为100
 * @return {String} 百分比
 * @example
 * getPercent(0)
 * // 0%
 */
export function getPercent(value, total = 100) {
    if (total === 0 || (value === 0 && total === 0)) {
        return "100%";
    } else if (value === 0) {
        return "0%";
    } else {
        let percentValue = parseInt((value / total) * 10000) / 100;
        percentValue = percentValue < 0.01 ? 0.01 : percentValue;
        return `${percentValue}%`;
    }
}

/**
 * @method toFixed
 * @description 重新避免原函数精度不准的问题
 * @param {Number} num 数值
 * @param {Number} s 保留小数点位数 默认为2
 * @return {String}
 * @example
 * toFixed(25.244)
 * // 25.24
 */
export function toFixed(num, s = 2) {
    const times = Math.pow(10, s);
    const des = num * times + 0.5;
    return parseInt(des, 10) / times + "";
}

/**
 * @method copyText
 * @description 复制文本到粘贴板
 * @param {String} text
 * @return {Boolean} 是否复制成功
 */
export function copyText(text) {
    try {
        const input = document.createElement("input");
        input.style.opacity = "0";
        input.style.position = "fixed";
        input.style.top = "-100px;";
        input.style.left = "-100px";
        input.value = text;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
        return true;
    } catch (err) {
        console.log(err);
        console.log(
            "复制失败，execCommand 可能已经废弃，请更新 copyText 方法，使用 permission 获取粘贴板权限后，使用 Clipboard 对象进行复制操作"
        );
        return false;
    }
}
