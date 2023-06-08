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

/**
 * @method relativeTime
 * @description 将时间戳格式化相对时间
 * @param {Object} options 相对时间模板，可使用{minute}模板方式替换当前文案，可使用的关键字有：minute、hour、year、month、day
 * @param {String} [options.withinOneMinute = '刚刚'] 一分钟内
 * @param {String} [options.withinOneHour = '{minute}分钟前'] 一小时
 * @param {String} [options.withinToday = '{hour}小时前'] 一天
 * @param {String} [options.yesterday = '昨天'] 昨天
 * @param {String} [options.history = '{month}月{day}日'] 多天以前
 * @return {Function} 返回一个方法，调用该方法并传入一个过去时间对象，可得到格式化的日期文案
 * @example
 * const getPastTimeLabel = relativeTime()
 * getPastTimeLabel(new Date())
 * // '刚刚'
 */
export function relativeTime(options = {}) {
    let timeText = {
        withinOneMinute: "刚刚",
        withinOneHour: "{minute}分钟前",
        withinToday: "{hour}小时前",
        yesterday: "昨天",
        year: "{month}月{day}日",
        history: "{year}年{month}月{day}日",
    };
    Object.assign(timeText, options);
    let judgeTimePast = function (currentTime) {
        const nowTimestamp = Date.now();
        const oneMinute = 1000 * 60;
        const oneHour = oneMinute * 60;
        const oneDay = oneHour * 24;
        const oneYear = oneDay * 365;

        const timestampDate = currentTime;
        const timeYear = timestampDate.getFullYear();
        const timeMonth = timestampDate.getMonth() + 1;
        const timeDate = timestampDate.getDate();
        const timeHours = timestampDate.getHours();
        const timeMinute = timestampDate.getMinutes();

        const timePast = nowTimestamp - currentTime.getTime();
        // 一分钟内
        const isWithinOneMinute = timePast < oneMinute;
        // 一小时内
        const isWithinOneHour = timePast < oneHour;
        // 一天内
        const isToday = timePast <= oneDay;
        // 两天内
        const isYesterday = timePast <= oneDay * 2;
        // 三天内
        const isBeforeYesterday = timePast <= oneDay * 3;
        // 一年内
        const onYear = timePast <= oneYear;

        if (isWithinOneMinute) {
            return timeText.withinOneMinute;
        }
        if (isWithinOneHour) {
            const pastMinute = parseInt(timePast / 1000 / 60);
            return timeText.withinOneHour.replace("{minute}", pastMinute);
        }
        if (isToday) {
            return timeText.withinToday
                .replace("{hour}", timeHours)
                .replace("{minute}", timeMinute);
        }
        if (isYesterday) {
            return timeText.yesterday
                .replace("{hour}", timeHours)
                .replace("{minute}", timeMinute);
        }
        if (isBeforeYesterday) {
            return timeText.dayBeforeYesterday
                .replace("{hour}", timeHours)
                .replace("{minute}", timeMinute);
        }
        if (onYear) {
            timeText.year
                .replace("{month}", timeMonth)
                .replace("{day}", timeDate)
                .replace("{hour}", timeHours)
                .replace("{minute}", timeMinute);
        }
        return timeText.history
            .replace("{year}", timeYear)
            .replace("{month}", timeMonth)
            .replace("{day}", timeDate)
            .replace("{hour}", timeHours)
            .replace("{minute}", timeMinute);
    };
    return judgeTimePast;
}
