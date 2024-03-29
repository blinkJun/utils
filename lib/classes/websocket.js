/**
 * @class WebSocketAuto
 * @extends EventTarget
 * @description WebSocket包装，扩展超时、心跳、重连机制
 * @param {Object} options 选项配置
 * @param {String} options.url 连接地址
 * @param {String | String[]} options.protocols 对应的原生WebSocket参数
 * @param {Number} [options.connectTimeOut = 5000] 默认连接超时时间
 * @param {Number} [options.baseReConnectTimeOut = 2000] 重连间隔时间
 * @param {Number} [options.maxReConnectTimeOut = 60000] 重连间隔时间
 * @param {Number} options.reConnectRepeatLimit 重连次数限制，不设置则不限制
 * @param {Boolean} [options.heartCheckEnable = false] 默认不开启心跳检测
 * @param {Number} [options.heartCheckTimeOut = 10000] 心跳检测频率
 * @param {String | Number} [options.heartCheckPing = 'ping'] 心跳发送包内容
 * @param {String | Number} [options.heartCheckPong = 'pong'] 心跳相应包内容
 * @param {Number} [options.heartCheckCloseTimeOut = 2000] 心跳检测超时时间
 * @param {Boolean} [options.parseMessage = true] 开启消息格式化
 * @param {Boolean} [options.debug = false] 开启debug消息打印，需要打开控制台详细级别的输出
 * @example
 * import { WebSocketAuto } from '@blinkjun/utils';
 *
 * const ws = new WebSocketAuto({
 *  url: 'ws://localhost:8080',
 *  heartCheckEnable: true,
 * });
 *
 * // 发送方法
 * try{
 *  ws.send('hello')
 * }catch(e){
 *
 * }
 *
 * // 手动关闭
 * ws.close()
 *
 * // 主要监听消息事件
 * ws.addEventListener('message', (e) => {
 *  console.log(e);
 * });
 *
 * // 连接成功，可省略
 * ws.addEventListener('open',(e)=>{
 *  console.log(e)
 * })
 *
 * // 连接关闭，可省略
 * ws.addEventListener('close',(e)=>{
 *  console.log(e)
 * })
 *
 * // 连接错误，可省略
 * ws.addEventListener('error',(e)=>{
 *  console.log(e)
 * })
 */
export class WebSocketAuto extends EventTarget {
    /**
     * @ignore
     * @param {Object} options 选项配置
     * @param {String} options.url 连接地址
     * @param {String | String[]} options.protocols 对应的原生WebSocket参数
     * @param {Number} [options.connectTimeOut = 5000] 默认连接超时时间
     * @param {Number} [options.baseReConnectTimeOut = 2000] 重连间隔时间
     * @param {Number} [options.maxReConnectTimeOut = 60000] 重连间隔时间
     * @param {Number} options.reConnectRepeatLimit 重连次数限制，不设置则不限制
     * @param {Boolean} [options.heartCheckEnable = false] 默认不开启心跳检测
     * @param {Number} [options.heartCheckTimeOut = 10000] 心跳检测频率
     * @param {String | Number} [options.heartCheckPing = 'ping'] 心跳发送包内容
     * @param {String | Number} [options.heartCheckPong = 'pong'] 心跳相应包内容
     * @param {Number} [options.heartCheckCloseTimeOut = 2000] 心跳检测超时时间
     * @param {Boolean} [options.parseMessage = true] 开启消息格式化
     * @param {Boolean} [options.debug = false] 开启debug消息打印，需要打开控制台详细级别的输出
     */
    constructor(options) {
        super();

        this.url = options.url;
        this.protocols = options.protocols;

        // 设置连接的超时时间
        this.connectTimeOut = options.connectTimeOut || 5000;

        // 限制重连次数，默认不限制
        this.reConnectTimmer = null;
        this.baseReConnectTimeOut = options.baseReConnectTimeOut || 2000;
        this.maxReConnectTimeOut = options.maxReConnectTimeOut || 60000;
        this.reConnectRepeatLimit = options.reConnectRepeatLimit || null;
        this.reConnectRepeatCount = 0;

        // 心跳配置
        // 是否开启心跳检测，后端需要响应心跳，若后端不响应心跳，会一直重连！
        this.heartCheckEnable = options.heartCheckEnable || false;
        this.heartCheckTimer = null;
        // 心跳频率
        this.heartCheckTimeOut = options.heartCheckTimeOut || 10000;
        this.heartCheckPing = options.heartCheckPing || "ping";
        this.heartCheckPong = options.heartCheckPong || "pong";
        // 发送心跳包后等待的时间，超时则重连
        this.heartCheckCloseTimer = null;
        this.heartCheckCloseTimeOut = options.heartCheckCloseTimeOut || 2000;

        // 是否主动关闭
        this.activeClose = false;

        // 是否格式化消息内容
        this.parseMessage = options.parseMessage || true;

        // 是否开启debug消息
        this.debug = options.debug || false;

        // 缓存消息，连接成功时逐条发送
        this.messages = [];

        this.connect();
    }

    /**
     * @description 连接
     * @ignore
     */
    connect() {
        const ws = (this.ws = new WebSocket(this.url, this.protocols));

        // 设置连接超时时间
        const connectTimeOutTimer = setTimeout(() => {
            ws.close();
            this.reConnect();
            this.debug &&
                console.debug(`websocket connect timeout：`, this.url);
        }, this.connectTimeOut);

        // 连接成功
        ws.addEventListener("open", (event) => {
            this.debug && console.debug(`websocket open：`, event);
            clearTimeout(connectTimeOutTimer);

            // 重置配置
            this.reConnectRepeatCount = 0;
            this.activeClose = false;
            this.dispatchEvent(new CustomEvent("open", { detail: event }));

            // 将未连接时缓存下来的消息全部发送出去
            while (this.messages.length > 0) {
                self.send(this.messages.shift());
            }
            // 开始心跳检测
            if (this.heartCheckEnable) {
                this.heartCheck();
            }
        });

        // 收到消息
        ws.addEventListener("message", (event) => {
            this.debug && console.debug(`websocket message：`, event);
            // 没有开启心跳检测则直接触发事件，开启了心跳检测且返回数据不是指定的心跳响应也触发事件
            if (!this.heartCheckEnable || this.heartCheckPong !== event.data) {
                let message = event.data;
                if (this.parseMessage) {
                    try {
                        message = JSON.parse(message);
                    } catch (error) {
                        this.debug &&
                            console.debug(
                                `WebSocketAuto parse message data fail`
                            );
                    }
                }
                this.dispatchEvent(
                    new MessageEvent("message", {
                        ...event,
                        data: message,
                    })
                );
            }
            if (this.heartCheckEnable) {
                // 开始心跳检测
                this.heartCheck();
            }
        });

        // 连接关闭
        ws.addEventListener("close", (event) => {
            this.debug && console.debug(`websocket closed：`, event);
            // 停止心跳检测
            this.stopHeartCheck();
            this.dispatchEvent(new CloseEvent("close", event));
            // 如果不是主动被关闭，则尝试重连
            if (!this.activeClose) {
                this.reConnect();
            }
        });

        // 连接出错
        ws.addEventListener("error", (event) => {
            this.debug && console.debug(`websocket error：`, event);
            // 停止心跳检测
            this.stopHeartCheck();
            this.dispatchEvent(new ErrorEvent("error", event));
            // 重连
            this.reConnect();
        });
    }

    /**
     * @description 重连
     * @ignore
     */
    reConnect() {
        // 如果设置了重连次数限制，超出限制则不再重连
        if (
            this.reConnectRepeatLimit &&
            this.reConnectRepeatCount >= this.reConnectRepeatLimit
        ) {
            return false;
        }
        // 延时重连，随着重连次数增加，重连间隔也增加，直到达到最大重连间隔
        clearTimeout(this.reConnectTimmer);
        let delay = this.baseReConnectTimeOut * (this.reConnectRepeatCount + 1);
        if (delay > this.maxReConnectTimeOut) {
            delay = this.maxReConnectTimeOut;
        }
        this.reConnectTimmer = setTimeout(() => {
            this.debug && console.debug(`websocket reconnecting`);
            this.reConnectRepeatCount++;
            this.connect();
        }, delay);
    }

    /**
     * @description 发送消息
     * @param {Object|String} data
     */
    send(data) {
        if (typeof data === "object") {
            try {
                data = JSON.stringify(data);
            } catch (err) {
                // do nothing
            }
        }

        if (this.ws) {
            if (this.ws.readyState === WebSocket.OPEN) {
                this.debug && console.debug(`websocket send：`, data);
                this.send(data);
            } else {
                console.warn(
                    `websocket send fail：ws readyState is ${this.ws.readyState}，this message will be automatically sent when ws is ready.`
                );
                this.messages.push(data);
            }
        } else {
            console.warn(
                `websocket send fail：ws is not created，this message will be automatically sent when ws is ready.`
            );
            this.messages.push(data);
        }
    }

    /**
     * @description 手动关闭
     */
    close(code = 1000, reason) {
        this.activeClose = true;
        return this.ws?.close(code, reason);
    }

    /**
     * @description 心跳检测
     * @ignore
     */
    heartCheck() {
        this.stopHeartCheck();
        this.heartCheckTimer = setTimeout(() => {
            // 发送心跳包
            this.ws.send(this.heartCheckPing);
            // 一定时间内无响应则关闭，触发重连
            this.heartCheckCloseTimer = setTimeout(() => {
                this.ws?.close();
            }, this.heartCheckCloseTimeOut);
        }, this.heartCheckTimeOut);
    }

    /**
     * @description 停止心跳检测
     * @ignore
     */
    stopHeartCheck() {
        clearTimeout(this.heartCheckTimer);
        clearTimeout(this.heartCheckCloseTimer);
    }
}
