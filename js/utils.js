
const ua = function () {
    let ua = navigator.userAgent;
    const isMobile = /Android|webOS|iPhone|iPod|BlackBerry/i.test(ua)
    const isAndroid = ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1;
    const isIOS = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    const isWx = ua.toLowerCase().match(/MicroMessenger/i) == "micromessenger"
    const isQQ = ua.toLowerCase().match(/QQ/i) == "qq"
    const isWeiBo = ua.toLowerCase().match(/WeiBo/i) == "weibo"
}



// 时间长度格式化：
// 根据时间戳转换成为05:30类似的时间格式 
// durationFormatByStamp(1000) 
// => 00:01
const durationFormatByStamp = function (times) {
    let minu = Math.floor(times / 1000 / 60);
    let second = Math.floor(60 * ((times / 1000 / 60) - Math.floor(times / 1000 / 60)))
    minu = minu < 10 ? '0' + minu : minu;
    second = second < 10 ? '0' + second : second
    return `${minu}:${second}`
}

// 时间日期格式化：
// 根据时间戳转换为对应格式的日期，如：2019-06-05 12：11：23
// dateFormatByStamp(1559110516359,'yyyy-MM-dd hh:mm:ss')
// => 2019-5-29 14:15:30
const dateFormatByStamp = function (timestamp, fmt) {
    let date = new Date(Number(timestamp))
    var o = {
        "M+": date.getMonth() + 1,                 //月份   
        "d+": date.getDate(),                    //日   
        "h+": date.getHours(),                   //小时   
        "m+": date.getMinutes(),                 //分   
        "s+": date.getSeconds(),                 //秒   
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度   
        "S": date.getMilliseconds()             //毫秒   
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

// 获取url参数
const getUrlQuery = function (variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }
    return undefined;
};

// json转换为url query参数
const jsonToUrlQuery = function (json) {
    let paramsString = '';
    for (let key in json) {
        paramsString += `${key}=${encodeURIComponent(json[key])}&`
    }
    return paramsString.slice(0, -1)
}

// 防抖函数
// const needDebounceFunc = ()=>{}
//  const debounceFunc = new Debounce(needDebounceFunc)
//  debounceFunc.exec();
class Debounce {
    constructor(callback, ms) {
        this.timer = null;
        this.callback = callback;
        this.ms = ms;
    }
    exec() {
        clearTimeout(this.timer);
        return this.timer = setTimeout(this.callback, this.ms || 100);
    }
}

// 节流函数
//  const needThrottleFunc = ()=>{}
//  const throttleFunc = new Throttle(needThrottleFunc)
//  throttleFunc.exec();
class Throttle {
    constructor(callback, ms) {
        this.callback = callback;
        this.ms = ms;
        this.canRun = true;
    }
    exec() {
        if (!this.canRun) {
            return false;
        } else {
            this.canRun = false;
            this.callback();
            return setTimeout(() => {
                this.canRun = true;
            }, this.ms || 100);
        }
    }
}

// 事件处理函数
// const eventBus = new EventEmitter();
// eventBus.addListener('start',(data)=>{console.log(data)})
// eventBus.emit('start',123,456)
// => 123,456
class EventEmitter {
    constructor() {
        this.listeners = new Map();
    }
    addListener(eventName, callback) {
        this.listeners.has(eventName) || this.listeners.set(eventName, callback);
        this.listeners.get(eventName).push(callback);
    }
    removeListener(eventName, callback) {
        if (this.listeners.has(eventName)) {
            let eventCallbackList = this.listeners.get(eventName);
            if (eventCallbackList && eventCallbackList.length) {
                let eventCallbackListLength = eventCallbackList.length
                for (let i = 0; i < eventCallbackListLength; i++) {
                    if (typeof eventCallbackList[i] === 'function' && eventCallbackList[i] === callback) {
                        eventCallbackList.splice(i, 1);
                        this.listeners.set(eventName, eventCallbackList);
                        return true;
                    }
                }
            } else {
                return false
            }
        }
        return false;
    }
    emit(eventName, ...args) {
        if (this.listeners.has(eventName)) {
            const eventList = this.listeners.get(eventName);
            if (eventList && eventList.length) {
                eventList.forEach((callbackItem) => {
                    callbackItem(...args)
                })
                return true
            } else {
                return false
            }
        }
    }
}

// 图片懒加载 （依赖节流函数 Throttle）
// <img src="" class="lazy" data-src="http://dev-images.qiniu.kuman.com/diurnal/timgNR1M9P5Y.jpg" alt="">
// const lazy = new LazyLoad()
// lazy.start();lazy.end();lazy.refresh();
// start后，进入窗口类名为.lazy的img元素将data-src的内容载入到src;并删除lazy类名
class LazyLoad {
    constructor(options = {}) {
        this.sourceAttrName = options.source || 'data-src';
        this.lazyloadSelector = options.selector || '.lazy';
        this.ob = null;
        this.throttle = null;
        this.startLock = false;
    }
    loadImage(img) {
        img.src = img.getAttribute(this.sourceAttrName);
        img.classList.remove(this.lazyloadSelector.substring(1))
    }
    isInSight(img) {
        const bound = img.getBoundingClientRect();
        const clientHeight = window.innerHeight;
        //如果只考虑向下滚动加载
        //const clientWidth = window.innerWeight;
        return bound.top <= clientHeight + 100; // +100提前加载
    }
    start() {
        if (this.startLock) {
            console.log('lazyload already start')
            return;
        }
        this.scrollListen();
        if ('IntersectionObserver' in window) {
            let imgs = Array.from(document.querySelectorAll(this.lazyloadSelector));
            this.ob = new IntersectionObserver((changes) => {
                for (const change of changes) {
                    if (0 < change.intersectionRatio && change.intersectionRatio <= 1) {
                        this.loadImage(change.target);
                        this.ob.unobserve(change.target);
                    }
                }
            })
            imgs.forEach((img) => {
                this.ob.observe(img);
            })
        } else {
            window.addEventListener('scroll', this.scrollListen.bind(this))
        }
        this.startLock = true;
    }
    end() {
        this.ob.disconnect();
        window.removeEventListener('scroll', this.scrollListen);
        this.startLock = false;
    }
    refresh() {
        this.end();
        this.start();
    }
    normalLazyLoad() {
        let imgs = Array.from(document.querySelectorAll(this.lazyloadSelector));
        imgs.forEach((img) => {
            if (this.isInSight(img)) {
                this.loadImage(img);
            }
        })
    }
    scrollListen() {
        if (!this.throttle) {
            this.throttle = new Throttle(this.normalLazyLoad.bind(this))
        }
        this.throttle.exec();
    }
}

// 获取和设置页面滚动高度
// 获取：const windowScrollTop = pageScrollTop.get()
// 设置：pageScrollTop.set(200)
const pageScrollTop = {
    get() {
        if (window.pageYOffset) {
            return window.pageYOffset;
        }
        // Explorer 6 Strict
        if (document.documentElement && document.documentElement.scrollTop) {
            return document.documentElement.scrollTop;
        }
        // all other Explorers
        if (document.body) {
            return document.body.scrollTop;
        }
        return 0;
    },
    set(top) {
        if (window.pageYOffset) {
            window.pageYOffset = Number(top);
        }
        // Explorer 6 Strict
        if (document.documentElement && document.documentElement.scrollTop) {
            document.documentElement.scrollTop = Number(top);
        }
        // all other Explorers
        if (document.body) {
            document.body.scrollTop = Number(top);
        }
        return true;
    }
}

// 平滑滚动页面
const scrollTop = function (el, from = 0, to, duration = 500, endCallback) {
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = (
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) {
                return window.setTimeout(callback, 1000 / 60);
            }
        );
    }
    const difference = Math.abs(from - to);
    const step = Math.ceil(difference / duration * 50);

    function scroll(start, end, step) {
        if (start === end) {
            endCallback && endCallback();
            return;
        }

        let d = (start + step > end) ? end : start + step;
        if (start > end) {
            d = (start - step < end) ? end : start - step;
        }

        if (el === window) {
            window.scrollTo(d, d);
        } else {
            el.scrollTop = d;
        }
        window.requestAnimationFrame(() => scroll(d, end, step));
    }
    scroll(from, to, step);
}

// 将时间戳格式化相对时间
// 获取：const postTimeFormat = postTime()
// 设置：postTimeFormat(0)
const postTime = function (options) {
    let timeText = {
        withinOneMinute: '刚刚',
        withinOneHour: '{minute}分钟前',
        withinToday: '{hour}小时前',
        yesterday: '昨天',
        history: '{month}月{day}日'
    }
    let judgeTimePast = function (timestamp) {
        const now = new Date()
        const nowTimestamp = now.getTime()
        const oneMinute = 1000 * 60;
        const oneHour = oneMinute * 60;
        const timeMonth = new Date(timestamp).getMonth() + 1
        const timeDate = new Date(timestamp).getDate()
        const isToday = now.getDate() === timeDate;
        const isYesterday = new Date(nowTimestamp - 1000 * 60 * 60 * 24).getDate() === timeDate;
        if (isToday) {
            const timePast = nowTimestamp - timestamp

            // 一分钟内
            const isWithinOneMinute = timePast < oneMinute
            if (isWithinOneMinute) {
                return timeText.withinOneMinute
            }

            // 一小时内
            const isWithinOneHour = timePast < oneHour
            if (isWithinOneHour) {
                const pastMinute = parseInt(timePast / 1000 / 60)
                return timeText.withinOneHour.replace('{minute}', pastMinute)
            }

            // 今天内
            const pastHour = parseInt(timePast / 1000 / 60 / 60)
            return timeText.withinToday.replace('{hour}', pastHour)
        }
        if (isYesterday) {
            return timeText.yesterday
        }
        return timeText.history.replace('{month}', timeMonth).replace('{day}', timeDate)
    }
    return judgeTimePast
}

// 将数组拍平
const flatArray = function (arr) {
    return arr.reduce((base, item) => {
        // 如元素是数组则进行递归，逐层拍平
        let temp = Array.isArray(item) ? flat(item) : [item];
        base.push(...temp);
        return base
    }, []) //初始数组
}

// 冒泡排序
// 原理：
// 1，首先遍历一次数组；
// 2，到每一项时，再遍历一次剩余项，与当前项比较，不断取最小值替换到当前项
// 3，这样保证逐渐遍历的过程中都是取到最小值
const bubbleSort = function (arr) {
    let length = arr.length;
    for (let i = 0; i < length; i++) {
        for (let j = i + 1; j < length; j++) {
            if (arr[j] < arr[i]) {
                [arr[j], arr[i]] = [arr[i], arr[j]]
            }
        }
    }
    return arr;
}

// 深拷贝

// 浅拷贝与深拷贝：
// 基本数据储存在栈中，引用类型数据储存在堆之中
// 基本类型数据可直接复制，引用类型数据在赋值时，新变量没有获得新值，而是将指针指向此对象的堆位置
// 浅拷贝：拷贝了对象的引用地址，没有获得新值；深拷贝：获得新值，而不是获得引用地址
// 浅拷贝：let a = b;let a = Object.assign({},b)
// 深拷贝：let a = JSON.parse(JSON.stringify(b));
const deepCopy = function (obj) {
    // 是否是数组
    let newObj = Array.isArray(obj) ? [] : {};
    // 不是对象 直接返回
    if (typeof obj !== 'object') {
        return obj;
    } else {
        //   递归复制
        for (var i in obj) {
            if (typeof obj[i] === 'object') { //判断对象的这条属性是否为对象
                newObj[i] = deepCopy(obj[i]);  //若是对象进行嵌套调用
            } else {
                newObj[i] = obj[i];
            }
        }
    }
    return newObj; //返回深度克隆后的对象
}