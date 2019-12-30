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
