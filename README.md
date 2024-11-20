# lnnzhyz2svg

此工具可以将 [LNN 中华语字][lnnzhyz]绘制成 SVG。支持普通话和[希顶语][xdi8] [LNN 中华语字方案][方案]。

[在线演示](https://dgck81lnn.github.io/lnnzhyz2svg/)

[lnnzhyz]: https://notblog.vudrux.site/wiki/LNN_中华语字
[xdi8]: https://notblog.vudrux.site/wiki/希顶语
[方案]: https://notblog.vudrux.site/wiki/希顶语_LNN_中华语字方案


> 本工具输出的 SVG 带有基于 `em` 单位的 `height`、`vertical-align` CSS 属性，适合直接插入到文本中，但应该放大到每 `em` 等于至少 24 物理像素（SVG 内的每 CSS 像素等于至少 1.5 物理像素）；或者，如果与每 `em` 等价的物理像素数为 16 的整数倍（即 SVG 内的每 CSS 像素等于整数个物理像素），添加 [`shape-rendering: crispEdges`](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/shape-rendering) 样式可以优化显示效果。
