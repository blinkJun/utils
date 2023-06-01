# 常用工具、类文档

[点击查看在线函数文档](https://blinkjun.github.io/utils/)

-   [x] 文档使用[`jsdoc`](http://shouce.jb51.net/jsdoc/index.html)生成
-   [x] 提交规范: `commitlint`、打`tag`
-   [x] 书写规范：`eslint`、`jsconfig`
-   [x] 版本更新规范：`blink version`
-   [x] 基础函数补充
-   [x] 自动化发布
-   [x] 生成类型声明文件

## 如何使用

1. 安装此模块：
    ```bash
    npm i @blinkjun/utils
    ```
2. 引入：
    - 在支持`es module`的项目中：`import { isNumber } from '@blinkjun/utils'`
    - 在`node`项目中：`const { isNumber } = require('@blinkjun/utils')`
