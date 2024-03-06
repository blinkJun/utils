/** @module DOM */

/**
 * @method elScroll
 * @description 平滑滚动页面
 * @param {HTMLElement} el 需要滚动的页面元素
 * @param {Number} to 滚动结束的地点
 * @param {Number} [from = 0] 滚动的开始地点，一般取元素的 scrollTop || scrollLeft
 * @param {Number} [duration = 500] 运动时间
 * @param {Function} [endCallback = null] 滚动结束时的回调函数
 * @param {String} [direction = 'scrollTop'] 滚动的方向：scrollTop || scrollLeft
 */
export function elScroll(
    el,
    to,
    from = 0,
    duration = 500,
    endCallback = null,
    direction = "scrollTop"
) {
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame =
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) {
                return window.setTimeout(callback, 1000 / 60);
            };
    }
    const difference = Math.abs(from - to);
    const step = Math.ceil((difference / duration) * 50);

    function scroll(start, end, step) {
        if (start === end) {
            endCallback && endCallback();
            return;
        }

        let d = start + step > end ? end : start + step;
        if (start > end) {
            d = start - step < end ? end : start - step;
        }

        if (el === window) {
            window.scrollTo(d, d);
        } else {
            el[direction] = d;
        }
        window.requestAnimationFrame(() => scroll(d, end, step));
    }
    scroll(from, to, step);
}

/**
 * @method setTitle
 * @description 在ios上会出现spa设置title不起效的问题，使用ifarme方式兼容
 * @param {String} title
 */
export function setTitle(title) {
    document.title = title;
    var mobile = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(mobile)) {
        var iframe = document.createElement("iframe");
        iframe.style.display = "none";
        iframe.setAttribute("src", "/favicon.ico");
        var iframeCallback = function () {
            setTimeout(function () {
                iframe.removeEventListener("load", iframeCallback);
                document.body.removeChild(iframe);
            }, 0);
        };
        iframe.addEventListener("load", iframeCallback);
        document.body.appendChild(iframe);
    }
}

/**
 * @method fullScreen
 * @description 全屏
 */
export function fullScreen() {
    let el = document.documentElement;
    let rfs =
        el.requestFullScreen ||
        el.webkitRequestFullScreen ||
        el.mozRequestFullScreen ||
        el.msRequestFullScreen;

    if (rfs) {
        rfs.call(el);
    } else if (typeof window.ActiveXObject !== "undefined") {
        //for IE，这里其实就是模拟了按下键盘的F11，使浏览器全屏
        let wscript = new ActiveXObject("WScript.Shell");
        if (wscript != null) {
            wscript.SendKeys("{F11}");
        }
    }
}

/**
 * @method exitFullScreen
 * @description 退出全屏
 */
export function exitFullScreen() {
    let el = document;
    let cfs =
        el.cancelFullScreen ||
        el.webkitCancelFullScreen ||
        el.mozCancelFullScreen ||
        el.exitFullScreen;

    if (cfs) {
        cfs.call(el);
    } else if (typeof window.ActiveXObject !== "undefined") {
        //for IE，这里和fullScreen相同，模拟按下F11键退出全屏
        let wscript = new ActiveXObject("WScript.Shell");
        if (wscript != null) {
            wscript.SendKeys("{F11}");
        }
    }
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

/**
 * @method setRemFontSize
 * @description 设置 css rem单位基准字体大小
 * @param {Number} [basic = 750] 设计图基准宽度
 */
export function setRemFontSize(basic = 750) {
    var docEl = document.documentElement || document.body;
    var isIOS = navigator.userAgent.match(/iphone|ipod|ipad/gi);
    var dRatio = window.devicePixelRatio;
    var dpr =
        isIOS && dRatio !== undefined
            ? Math.min(dRatio, 3)
            : dRatio !== undefined
            ? dRatio
            : 1; // 设备像素比devicePixelRatio
    var resizeEvt =
        "orientationchange" in window ? "orientationchange" : "resize";
    docEl.dataset.dpr = dpr;

    var recalc = function () {
        // 页面内容可见区域的宽度(兼容各种平台),对于ios设备devicePixelRatio值只可能是1或者2
        // 当width=device-width时，可视区的宽度就是document.documentElement.clientWidth
        // 安卓平台下可见区的宽度：document.body.clientWidth || document.documentElement.clientWidth
        var width = docEl.clientWidth || window.innerWidth;
        // 大于 basic 宽度屏幕限制
        if (width / dpr > basic) {
            width = basic * dpr;
        }
        docEl.style.fontSize = 100 * (width / basic) + "px";
    };
    recalc();
    if (!document.addEventListener) return;
    window.addEventListener(resizeEvt, recalc, false);
}

/**
 * @constant local
 * @description 带JSON格式化的local包装
 * @property {Function} local.save
 * @property {Function} local.get
 * @property {Function} local.del
 */
export const local = {
    /**
     * @method save
     * @description 保存数据
     * @param {String} keyName
     * @param {Object|String} data
     */
    save(keyName, data) {
        if (typeof data === "object") {
            window.localStorage.setItem(keyName, JSON.stringify(data));
        } else {
            window.localStorage.setItem(keyName, data);
        }
    },
    /**
     * @method get
     * @description 获取数据
     * @param {String} keyName
     * @return {Any}
     */
    get(keyName) {
        let record = window.localStorage.getItem(keyName);
        try {
            record = JSON.parse(record);
        } catch (err) {}
        return record;
    },
    /**
     * @method del
     * @description 删除数据
     * @param {String} keyName
     */
    del(keyName) {
        window.localStorage.removeItem(keyName);
    },
};
