/** @module Pattern */

/**
 * @constant {Object} pattern 正则集合对象
 * @property {RegExp} pattern.email 邮件
 * @property {RegExp} pattern.tel 电话
 * @property {RegExp} pattern.mobile 手机号
 * @property {RegExp} pattern.password 密码
 * @property {RegExp} pattern.url 链接
 * @property {RegExp} pattern.IDCard 身份证
 * @property {RegExp} pattern.image 图片
 * @property {RegExp} pattern.video 视频
 * @property {RegExp} pattern.number 数值
 * @property {RegExp} pattern.positiveNumber 正数
 * @property {RegExp} pattern.negativeNumber 负数
 * @property {RegExp} pattern.integer 整数
 * @property {RegExp} pattern.positiveInteger 正整数
 * @property {RegExp} pattern.negativeInteger 负整数
 * @property {RegExp} pattern.ip4 ip4正则
 * @property {RegExp} pattern.colorHex hex颜色（#ffffff）
 * @property {RegExp} pattern.carNo 车牌号
 * @property {RegExp} pattern.includeChineseWord 包含中文
 */
export const pattern = {
    email: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,

    tel: /^(0\d{2,3}[- ]?[1-9]\d{6,7})|([48]00[- ]?[1-9]\d{6})$/,

    mobile: /^(0|86|17951)?(13[0-9]|14[57]|15[012356789]|1[6789][0-9])[0-9]{8}$/,

    // 字母、数字、特殊字符最少2种组合（不能有中文）
    // eslint-disable-next-line no-control-regex
    password:
        /^(?!.*[^\x00-\xff])(?![a-zA-Z]+$)(?![\d]+$)(?![^a-zA-Z\d]+$).{6,20}$/,

    url: /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i,

    IDCard: /^([1-9]\d{7}((0\d)|(1[0-2]))(([012]\d)|3[0-1])\d{3})|([1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([012]\d)|3[0-1])((\d{4})|\d{3}[Xx]))$/,

    image: /\.(jpeg|jpg|gif|png|svg|webp|jfif|bmp|dpg)/i,
    video: /\.(mp4|mpg|mpeg|dat|asf|avi|rm|rmvb|mov|wmv|flv|mkv)/i,

    number: /^-?\d*\.?\d+$/,
    positiveNumber: /^\d*\.?\d+$/,
    negativeNumber: /^-?\d*\.?\d+$/,

    integer: /^-?\d+$/,
    positiveInteger: /^\d+$/,
    negativeInteger: /^-\d+$/,

    ip4: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,

    colorHex: /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/,

    carNo: /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/,

    includeChineseWord: /[\u4E00-\u9FA5]/,
};
