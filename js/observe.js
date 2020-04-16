//双向数据绑定原理实现

// 全局方法
let activeUpdate;

// 依赖收集与触发
class Dep {
    constructor(){
        this.subs = new Set();
    }
    depend(){
        if(activeUpdate){
            this.subs.add(activeUpdate)
        }
    }
    notify(){
        this.subs.forEach(update=>update());
    }
}

// 观察对象属性
const observe = function (obj){
    // 只有一层对象
    // 数组需要额外处理
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
    })
}

// 自动触发函数
const autorun = function (update){
    const wrapperUpdate = function (){
        activeUpdate = wrapperUpdate;
        update();
        activeUpdate = null;
    } 
    wrapperUpdate();
}



// 实现如下功能
const state = {
    count:1
}

observe(state);

autorun(()=>{
    console.log(state.count)
})

state.count++;