# slide

基于zepto的滑动组件。

slide演示：**[demo](http://joy-yi0905.github.io/slide/demo/demo.html)**
slide全屏演示：**[demo](http://joy-yi0905.github.io/slide/demo/fullpage.html)**

### 如何使用

- 首先引入插件的样式文件 `zepto.slide.min.css`

```html
<link rel="stylesheet" href="zepto.slide.min.css">
```

- 然后再引入 `zepto.min.js` 和 `zepto.slide.min.js`（这些文件包含在demo目录）

```html
<script src="zepto.min.js"></script>
<script src="zepto.imgupload.min.js"></script>
```

- 最后，在页面里相应的元素添加方法。 相关示例代码：

```html
<div class="slide" id="slide01"></div>

<script>
$('.slide#slide01').slide();
</script>
```

### 参数

当用户需要自定义输入时，可以将一个对象作为参数传递给 slide 方法，该参数对象可配置以下选项。默认情况下，它们的取值如下：

| **参数** | **描述** | **默认值** | **格式** |
|----------|----------|------------|----------|
| mode | 轮播模式，默认水平方向轮播 | "dir-left-right" | String，还可以是 "fade-in-out" |
| dirType | 方向（水平或垂直）轮播类型，只针对 "dir-left-right" 模式 | "horizontal" | String，还可以是 "vertical"  |
| loop | 是否循环切换 | false | Boolean，还可以是 true |
| index | slide 初始化后指定哪一屏先显示 | 1 | Number |
| autoplay | 是否自动轮播 | true | Boolean |
| interval | 每屏轮播间隔时间 | 3000（毫秒） | Number |
| animateTime | 每屏切换所需时间 | 500（毫秒） | Number |
| switchTriggerRange | 触发换屏所需的拖动距离比例 | 0.3 | Number |
| action | 是否需要箭头控制 | false | Boolean |
| data | slide每屏所需数据 | 3屏，html内容（见demo） | Array |
| slideW | slide 宽度 | 父级容器宽度 | Number |
| slideH | slide 高度 | 当 slide 包含图片时，以第一张图的高度为基准。 当 slide 不包含图片时，以内容最多的屏的高度为基准 | Number |
| callback | 每屏切换后，触发的回调函数。它包含了一个参数，为当前屏的索引值 | 空函数 | Function |



- [ ] 内容超过一屏幕，先滚动完，再触发下一屏幕
- [ ] 滑动跟随
- [ ] 圆点显示可选

