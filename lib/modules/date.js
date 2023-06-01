/** @module Date */

/**
 * @method dateFormat
 * @description 格式化日期文本
 * @param {Date | String | Number} date 传入日期
 * @param {String} format 传入格式如：yyyy-MM-dd
 * @return {String}
 * @example
 * dateFormat(new Date(), 'yyyy-MM-dd')
 * // 2023-01-02
 */
export function formatDate(date, format) {
    if (typeof date === "string") {
        date =
            date - 0 ||
            (!/\d+T\d+/.test(date) ? date.replace(/-/g, "/") : date);
    }

    const d = new Date(date);
    if (!date || d.toUTCString() === "Invalid Date") {
        return "";
    }

    var map = {
        y: d.getFullYear(), // 年
        M: d.getMonth() + 1, //月
        d: d.getDate(), //日
        h: d.getHours(), //时
        m: d.getMinutes(), //分
        s: d.getSeconds(), //秒
        S: d.getMilliseconds(), //毫秒
        q: Math.floor((d.getMonth() + 3) / 3), //季度
    };

    return format.replace(/([yMdhmsqS])\1*/g, function (m, t) {
        var v = String(map[t]);

        if (t === "y") {
            return v.substr(4 - m.length);
        } else if (t === "S") {
            return ("00" + v).substr(v.length - 1);
        } else if (m.length > 1) {
            return ("0" + v).substr(v.length - 1);
        }

        return v;
    });
}

/**
 * @method date
 * @description 格式化日期为 yyyy-MM-dd 格式
 * @param {Date | String | Number} date
 * @return {String}
 */
export function date(date) {
    return formatDate(date, "yyyy-MM-dd");
}

/**
 * @method datetime
 * @description 格式化日期为 yyyy-MM-dd hh:mm:ss 格式
 * @param {Date | String | Number} date
 * @return {String}
 */
export function datetime(date) {
    return formatDate(date, "yyyy-MM-dd hh:mm:ss");
}
