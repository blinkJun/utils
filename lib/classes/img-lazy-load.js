/*
 * @Author liangjun
 * @LastEditors liangjun
 * @Date 2020-07-17 17:03:41
 * @LastEditTime 2023-06-02 17:31:02
 * @Description 图片懒加载
 */

/**
 * @class ImageLazyLoad
 * @description 图片懒加载，自动读取所有包含option.source属性的图片，将到达窗口的图片src替换为 option.source 属性的真实链接
 * @param {Option} option 懒加载选项
 * @param {Option.source} option.source 存放图片链接的属性，如：data-lazy
 * @return {ImageLazyLoad} ImageLazyLoad 图片懒加载实例
 * @example
 * // <img src="default.png" data-lazy="http://dev-images.qiniu.kuman.com/diurnal/timgNR1M9P5Y.jpg" alt="">
 * const lazyImage = new ImageLazyLoad();
 * // 开启懒加载
 * lazyImage.start();
 * // 关闭懒加载
 * lazyImage.end();
 * // 重新开启懒加载
 * lazyImage.refresh();
 */
export class ImageLazyLoad {
    constructor(options = {}) {
        this.sourceAttrName = options.source || "data-lazy";
        this.ob = null;
        this.throttle = null;
        this.startLock = false;
    }
    loadImage(img) {
        img.src = img.getAttribute(this.sourceAttrName);
    }
    isInSight(img) {
        const bound = img.getBoundingClientRect();
        const clientHeight = window.innerHeight;
        //如果只考虑向下滚动加载
        //const clientWidth = window.innerWeight;
        return bound.top <= clientHeight + 100; // +100提前加载
    }
    /**
     * @method start
     * @description 开始检测所有图片状态，进行懒加载和滚动监听
     */
    start() {
        if (this.startLock) {
            console.log("lazyload already start");
            return;
        }
        this.scrollListen();
        if ("IntersectionObserver" in window) {
            let imgs = Array.from(
                document.querySelectorAll(`img[${this.sourceAttrName}]`)
            );
            this.ob = new IntersectionObserver((changes) => {
                for (const change of changes) {
                    if (
                        0 < change.intersectionRatio &&
                        change.intersectionRatio <= 1
                    ) {
                        this.loadImage(change.target);
                        this.ob.unobserve(change.target);
                    }
                }
            });
            imgs.forEach((img) => {
                this.ob.observe(img);
            });
        } else {
            window.addEventListener("scroll", this.scrollListen.bind(this));
        }
        this.startLock = true;
    }
    /**
     * @method end
     * @description 停止检测所有图片状态，停止懒加载和滚动监听
     */
    end() {
        this.ob.disconnect();
        window.removeEventListener("scroll", this.scrollListen);
        this.startLock = false;
    }
    /**
     * @method refresh
     * @description 重新检测所有图片状态，重新懒加载和滚动监听
     */
    refresh() {
        this.end();
        this.start();
    }
    normalLazyLoad() {
        let imgs = Array.from(
            document.querySelectorAll(`img[${this.sourceAttrName}]`)
        );
        imgs.forEach((img) => {
            if (this.isInSight(img)) {
                this.loadImage(img);
            }
        });
    }
    scrollListen() {
        this.normalLazyLoad();
    }
}
