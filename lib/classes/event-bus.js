/*
 * @Author liangjun
 * @LastEditors liangjun
 * @Date 2020-07-17 17:05:43
 * @LastEditTime 2023-06-05 15:45:37
 * @Description 发布与订阅
 */

/**
 * @class EventEmitter
 * @description 事件处理类
 * @example
 * const bus = new EventEmitter();
 * bus.addListener("timeout", (params) => {
 *     console.log(1);
 * });
 * bus.addListener("timeout", function two(params) {
 *     console.log(2);
 *     bus.removeListener("timeout", two);
 * });
 *
 * setInterval(() => {
 *     bus.emit("timeout", Date.now());
 * }, 1000);
 */
export class EventEmitter {
    constructor() {
        this.listeners = new Map();
    }
    /**
     * @description 订阅
     * @param {String} eventName 监听的事件名称
     * @param {Function} callback 回调函数
     */
    addListener(eventName, callback) {
        // 是否已有事件，没有进行重置为空数组
        this.listeners.has(eventName) || this.listeners.set(eventName, []);
        // 有则推进数组
        this.listeners.get(eventName).push(callback);
    }
    /**
     * @description 移除订阅
     * @param {String} eventName 取消监听的事件名称
     * @param {Function} callback 回调函数
     * @return {Boolean} 是否取消监听成功
     */
    removeListener(eventName, callback) {
        if (this.listeners.has(eventName)) {
            let eventCallbackList = this.listeners.get(eventName);
            if (eventCallbackList && eventCallbackList.length) {
                let eventCallbackListLength = eventCallbackList.length;
                for (let i = 0; i < eventCallbackListLength; i++) {
                    // 每一项对比，回调函数一致的进行删除
                    if (eventCallbackList[i] === callback) {
                        eventCallbackList.splice(i, 1);
                        return true;
                    }
                }
            } else {
                return false;
            }
        }
        return false;
    }
    /**
     * @description 发布
     * @param {String} eventName 发布的事件名称
     * @return {Boolean} 是否发布成功
     */
    emit(eventName, ...args) {
        if (this.listeners.has(eventName)) {
            const eventList = this.listeners.get(eventName);
            if (eventList && eventList.length) {
                eventList.forEach((callbackItem) => {
                    callbackItem(...args);
                });
                return true;
            } else {
                return false;
            }
        }
    }
}
