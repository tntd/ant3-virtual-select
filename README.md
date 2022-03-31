# @tntd/ant3-virtual-select

基于ant3实现高性能虚拟滚动列表

## 安装
```bash
npm i @tntd/ant3-virtual-select
```

## 用法
所有API同ant3 Select
- 注：新增maxWidth属性，该属性只有在dropdownMatchSelectWidth=false的时候才起作用,由于dropdownMatchSelectWidth=false，下拉宽度需要系统计算，同时渲染多个此组件时，会有性能消耗，故新增此属性，在渲染之前计算好下拉宽的高度，已达到性能提升。这里也提供一个算文本的像素宽度的方法，仅供参考：

```javascript
// 获取单行文本的像素宽度
getTextPixelWith = (text, fontStyle = "14px") => {
    let canvas = document.createElement("canvas"); // 创建 canvas 画布
    let context = canvas.getContext("2d"); // 获取 canvas 绘图上下文环境
    context.font = fontStyle; // 设置字体样式，使用前设置好对应的 font 样式才能准确获取文字的像素长度
    let dimension = context.measureText(text); // 测量文字
    return dimension.width;
}
```

```javascript
import VirtualSelect from "@tntd/ant3-virtual-select";

const Option = VirtualSelect.Option;

const children = [];
for (let i = 0; i < 10000; i++) {
	children.push(
		<Option value={i} key={i}>
			{`测试${i}`}
		</Option>
	);
}

<VirtualSelect
    className="u-width"
    showSearch
    optionFilterProp="children"
    allowClear
    placeholder="请选择"
    onChange={handleChange}
    style={{ width: "200px" }}
    dropdownMatchSelectWidth={false}
    defaultValue={500}
>
    {children}
</VirtualSelect>

```
