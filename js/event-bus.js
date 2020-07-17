/*
 * @Author liangjun
 * @LastEditors liangjun
 * @Date 2020-07-17 17:05:43
 * @LastEditTime 2020-07-17 17:10:03
 * @Description 发布与订阅
 */ 

 
/**
 * @method addListener
 * @description 订阅
 * @param {String} eventName 监听的事件名称
 * @param {Function} callback 回调函数
 * @return
 */
/**
 * @method removeListener
 * @description 移除订阅
 * @param {String} eventName 取消监听的事件名称
 * @param {Function} callback 回调函数
 * @return {Boolean} 是否取消监听成功
 */
/**
 * @method emit
 * @description 发布
 * @param {String} eventName 发布的事件名称
 * @return {Boolean} 是否发布成功
 */
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