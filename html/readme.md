# 页面效果

## flop
css3实现一个翻牌效果

demo[https://blinkjun.github.io/utils/html/flop.html]

### 实现原理

在牌子容器添加3d视距：
```css
    .box{
        perspective: 900px;
    }
```

将牌子转换为3d类型
```css
    .flop{
        transform-style: preserve-3d;
    }
```

将牌子正反面背面隐藏
```css
    .flop{
        backface-visibility:hidden;
    }
```

## blur-pic
毛玻璃效果

demo[https://blinkjun.github.io/utils/html/blur-pic.html]


## opacity-bg
方格透明背景

demo[https://blinkjun.github.io/utils/html/opacity-bg.html]

## pie
百分比饼图

demo[https://blinkjun.github.io/utils/html/pie.html]

## pie
无缝轮播

demo[https://blinkjun.github.io/utils/html/swipe.html]

## simple-lottery
一个简单的轮盘抽奖
demo[https://blinkjun.github.io/utils/html/lottery.html]

### 使用方法

```html
    <div class="lottery-box" >
        <div class="prize-1 focus" >1</div>
        <div class="prize-2" >2</div>
        <div class="prize-3" >3</div>
        <div class="prize-8" >8</div>
        <div class="prize-btn" >点击开始</div>
        <div class="prize-4" >4</div>
        <div class="prize-7" >7</div>
        <div class="prize-6" >6</div>
        <div class="prize-5" >5</div>
    </div>
```
```javascript
    var lottery = Lottery({
        box:document.querySelector('.lottery-box'),
        // 开始对焦奖品
        index:1,
        // 中奖奖品
        prizeIndex:5,
    })

    // 开始抽奖
    lottery.start(()=>{
        console.log('恭喜！')
    })

    // 设置参数
    lottery.setParams({
        prizeIndex:4
    })
```