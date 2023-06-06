/** @module Number */

/**
 * @method formatNumber
 * @description 格式化数值为特定格式
 * @param {Number} number 需要格式化的数值
 * @param {Number} [precision = 2] 保留小数点
 * @param {String} [thousand = ','] 千分位分隔符
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
 * @method getPercent
 * @description 获取百分比
 * @param {Number} value 数值
 * @param {Number} [total = 100] 总数值
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
 * @param {Number} [s = 2] 保留小数点位数 默认为2
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
