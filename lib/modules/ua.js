/** @module UA */

const getUA = () => navigator.userAgent;

/**
 * @description 是否是移动端设备
 * @method isMobileEquipment
 * @param {String} [ua = navigator.userAgent] 用户代理字符串
 * @return {Boolean}
 */
export const isMobileEquipment = (ua = getUA()) =>
    /Android|webOS|iPhone|iPod|BlackBerry/i.test(ua);

/**
 * @description 是否是安卓设备
 * @method isAndroid
 * @param {String} [ua = navigator.userAgent] 用户代理字符串
 * @return {Boolean}
 */
export const isAndroid = (ua = getUA()) =>
    ua.indexOf("Android") > -1 || ua.indexOf("Adr") > -1;

/**
 * @description 是否是IOS设备
 * @method isIOS
 * @param {String} [ua = navigator.userAgent] 用户代理字符串
 * @return {Boolean}
 */
export const isIOS = (ua = getUA()) =>
    !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);

/**
 * @description 是否是微信浏览器
 * @method isWx
 * @param {String} [ua = navigator.userAgent] 用户代理字符串
 * @return {Boolean}
 */
export const isWx = (ua = getUA()) =>
    ua.toLowerCase().match(/MicroMessenger/i) === "micromessenger";

/**
 * @description 是否是QQ浏览器
 * @method isQQ
 * @param {String} [ua = navigator.userAgent] 用户代理字符串
 * @return {Boolean}
 */
export const isQQ = (ua = getUA()) => ua.toLowerCase().match(/QQ/i) == "qq";

/**
 * @description 是否是微博浏览器
 * @method isWeiBo
 * @param {String} [ua = navigator.userAgent] 用户代理字符串
 * @return {Boolean}
 */
export const isWeiBo = (ua = getUA()) =>
    ua.toLowerCase().match(/WeiBo/i) == "weibo";
