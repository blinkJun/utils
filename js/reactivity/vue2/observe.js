//双向数据绑定原理实现

// 依赖收集与触发
class Dep {
    // 一直存在的静态方法
    static activeUpdate
    constructor(){
        this.subs = new Set();
    }
    depend(){
        if(Dep.activeUpdate){
            this.subs.add(Dep.activeUpdate)
        }
    }
    notify(){
        this.subs.forEach(update=>update());
    }
}

// 观察对象属性
const observe = function (obj){
    // 数组、其他类型 需要额外处理
    Object.keys(obj).forEach((key)=>{
        let value = obj[key];
        let dep = new Dep();
        Object.defineProperty(obj,key,{
            get(){
                dep.depend();
                return value;
            },
            set(newValue){
                value = newValue;
                dep.notify();
            }
        })
        if(typeof value === 'object'){
            observe(value)
        }
    })
}

// 自动触发函数
const autorun = function (update){
    const wrapperUpdate = function (){
        Dep.activeUpdate = wrapperUpdate;
        update();
        Dep.activeUpdate = null;
    } 
    wrapperUpdate();
}



// 实现如下功能
const state = {
    count:1
}

observe(state);

autorun(()=>{
    console.log(`count change:${state.count}`)
})

state.count++;