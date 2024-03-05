/**
 * @class Polling
 * @extends EventTarget
 * @description 轮询类
 * @param {Object} options 轮询选项
 * @param {Function} options.request 请求方法
 * @param {Function} [options.needToPolling = ()=>true] 是否需要继续轮询的检查方法，默认
 * @example
 * const pollingInstance = new Polling({
 *  // 轮询的请求
 *  request:()=>fetch('/data'),
 *  // 可选：在此判断是否继续轮询，不传默认持续轮询
 *  needToPolling: (res) => {
 *    const undoneCount = 1;
 *    return undoneCount > 0;
 *  },
 * });
 * // 每次轮询请求回来的数据更新事件
 * pollingInstance.addEventListener('update',(res)=>{
 *  console.log(res)
 * })
 * // 轮询结束
 * pollingInstance.addEventListener('end',()=>{
 *  console.log('end')
 * })
 * // 开始轮询
 * pollingInstance.start()
 * // 主动结束
 * pollingInstance.stop()
 */
export class Polling extends EventTarget {
    /**
     * @ignore
     * @param {Object} options 轮询选项
     * @param {Function} options.request 请求方法
     * @param {Function} [options.needToPolling = ()=>true] 是否需要继续轮询的检查方法，默认
     */
    constructor({ request, needToPolling = () => true }) {
        super();
        // 请求
        this.request = request;
        // 检查是否需要继续轮询
        this.needToPolling = needToPolling;
        this.pollingListTimer = null;
        this.delay = 3000;
        this.pollingId = 0;
        this.onRequestPollingList = false;
        this.requestErrorCount = 0;
    }
    /**
     * @description 开始轮询
     */
    async start() {
        const needPolling = await this.needToPolling();
        if (needPolling) {
            let delay = this.delay * (this.requestErrorCount + 1);
            delay = delay > 30000 ? 30000 : delay;
            this.pollingListTimer = setTimeout(() => {
                this.polling();
            }, delay);
        }
    }
    /**
     * @description 停止
     */
    async stop() {
        // 更新轮询id，所有请求废弃
        this.pollingId = this.pollingId + 1;
        clearTimeout(this.pollingListTimer);
        this.onRequestPollingList = false;
        this.requestErrorCount = 0;
    }
    /**
     * @description 开始轮询
     * @ignore
     */
    async polling() {
        const pollingId = this.pollingId;
        if (this.onRequestPollingList) {
            return false;
        }
        this.onRequestPollingList = true;
        try {
            const res = await this.request();
            // 重置请求错误状态为0
            this.requestErrorCount = 0;
            // 如果已经变更了轮询id，则废弃
            if (pollingId !== this.pollingId) {
                this.onRequestPollingList = false;
                return false;
            }
            // 更新数据
            this.dispatchEvent(new CustomEvent("update", { detail: res }));
            // 传入新数据由调用者判断是否需要继续轮询
            const needPolling = await this.needToPolling(res);
            // 不再需要轮询表示轮询已结束
            if (!needPolling) {
                this.dispatchEvent(new Event("end"));
                this.onRequestPollingList = false;
                return false;
            }
        } catch (error) {
            this.requestErrorCount++;
            console.log(error);
        }
        this.start();
        this.onRequestPollingList = false;
    }
}
