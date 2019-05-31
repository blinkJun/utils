
let ua = navigator.userAgent;
const isMobile = /Android|webOS|iPhone|iPod|BlackBerry/i.test(ua)
const isAndroid  = ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1; 
const isIOS = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
const isWx = ua.toLowerCase().match(/MicroMessenger/i) == "micromessenger"
const isQQ = ua.toLowerCase().match(/QQ/i) == "qq"
const isWeiBo = ua.toLowerCase().match(/WeiBo/i) == "weibo"



// 时间长度格式化：
// 根据时间戳转换成为05:30类似的时间格式 
// durationFormatByStamp(1000) 
// => 00:01
const durationFormatByStamp=function (times) { 
    let minu=Math.floor(times/1000/60);
    let second = Math.floor(60*((times/1000/60)-Math.floor(times/1000/60)))
    minu = minu<10?'0'+minu:minu;
    second = second<10?'0'+second:second
    return `${minu}:${second}`
}

// 时间日期格式化：
// 根据时间戳转换为对应格式的日期，如：2019-06-05 12：11：23
// dateFormatByStamp(1559110516359,'yyyy-MM-dd hh:mm:ss')
// => 2019-5-29 14:15:30
const dateFormatByStamp=function(timestamp,fmt){
    let date = new Date(Number(timestamp))
    var o = {   
        "M+" : date.getMonth()+1,                 //月份   
        "d+" : date.getDate(),                    //日   
        "h+" : date.getHours(),                   //小时   
        "m+" : date.getMinutes(),                 //分   
        "s+" : date.getSeconds(),                 //秒   
        "q+" : Math.floor((date.getMonth()+3)/3), //季度   
        "S"  : date.getMilliseconds()             //毫秒   
    };   
    if(/(y+)/.test(fmt))   
        fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));   
    for(var k in o)   
        if(new RegExp("("+ k +")").test(fmt))   
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
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
const jsonToUrlQuery=function(json){
    let paramsString = '';
    for (let key in json){
        paramsString+=`${key}=${encodeURIComponent(json[key])}&`
    }
    return paramsString.slice(0,-1)
}

// 防抖函数
// const needDebounceFunc = ()=>{}
//  const debounceFunc = new Debounce(needDebounceFunc)
//  debounceFunc.exec();
class Debounce {
    constructor(callback,ms){
        this.timer = null;
        this.callback = callback;
        this.ms = ms;
    }
    exec(){
        clearTimeout(this.timer);
        return this.timer = setTimeout(this.callback,this.ms||100);
    }
}

// 节流函数
//  const needThrottleFunc = ()=>{}
//  const throttleFunc = new Throttle(needThrottleFunc)
//  throttleFunc.exec();
class Throttle {
    constructor(callback,ms){
        this.callback = callback;
        this.ms = ms;
        this.canRun = true;
    }
    exec(){
        if(!this.canRun){
            return false;
        }else{
            this.canRun = false;
            this.callback();
            return setTimeout(()=>{
                this.canRun=true;
            },this.ms||100);
        }
    }
}